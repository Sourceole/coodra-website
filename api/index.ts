import type { IncomingHttpHeaders, IncomingMessage, ServerResponse } from "node:http";

type VercelRequest = IncomingMessage & {
  url?: string;
  headers: IncomingHttpHeaders;
};

type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  send: (body: string) => void;
};

type RequestHandler = (
  req: VercelRequest,
  res: VercelResponse
) => Promise<void> | void;

export const config = {
  runtime: "nodejs",
};

let requestHandler: RequestHandler;

const MAX_EARLY_ACCESS_BODY_BYTES = 16 * 1024
const EARLY_ACCESS_RATE_WINDOW_MS = 10 * 60 * 1000
const EARLY_ACCESS_RATE_LIMIT = 5
const earlyAccessBuckets = new Map<string, { count: number; resetAt: number }>()

class PayloadTooLargeError extends Error {}

async function readRequestBody(req: IncomingMessage, maxBytes: number): Promise<string> {
  const chunks: Buffer[] = []
  let totalBytes = 0
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    totalBytes += buffer.byteLength
    if (totalBytes > maxBytes) {
      throw new PayloadTooLargeError("request_body_too_large")
    }
    chunks.push(buffer)
  }
  return Buffer.concat(chunks).toString("utf8")
}

function getClientIp(headers: IncomingHttpHeaders): string {
  const forwardedFor = String(headers["x-forwarded-for"] || "").split(",")[0]?.trim()
  return forwardedFor || String(headers["x-real-ip"] || headers["cf-connecting-ip"] || "unknown")
}

function isRateLimited(bucketKey: string, limit: number, windowMs: number) {
  const now = Date.now()
  const bucket = earlyAccessBuckets.get(bucketKey)
  if (!bucket || bucket.resetAt <= now) {
    earlyAccessBuckets.set(bucketKey, { count: 1, resetAt: now + windowMs })
    return false
  }
  bucket.count += 1
  return bucket.count > limit
}

function field(value: unknown, maxLength: number): string {
  return String(value || "").trim().slice(0, maxLength)
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

async function ensureHandler() {
  if (requestHandler) return;

  const { createRequestListener } = await import("@react-router/node");

  // Dynamic import of the server build - it may be CJS or ESM
  const serverBuildPath = process.cwd() + "/build/server/index.js";
  const serverBuildModule = await import(serverBuildPath);

  // Get the actual build - handle both CJS and ESM default exports
  const serverBuild = serverBuildModule.default ?? serverBuildModule;

  requestHandler = createRequestListener({
    build: serverBuild,
    mode: "production",
  }) as RequestHandler;
}

export default async function vercelHandler(
  request: VercelRequest,
  response: VercelResponse
) {
  const url = new URL(request.url || "/", `https://${request.headers.host}`);
  const pathname = url.pathname;

  if (pathname === "/api/capabilities") {
    const approvalEnforced = String(process.env.COODRA_APPROVAL_ENFORCED ?? "true").trim().toLowerCase() === "true";
    const payload = {
      ok: true,
      source: "coodra-website",
      updated_at: new Date().toISOString(),
      capabilities: {
        approval_enforced: approvalEnforced,
        forecast_live: true,
        providers: {
          shopify: { enabled: true, status: "available", category: "pos_inventory" },
          square: { enabled: true, status: "available", category: "pos_inventory" },
          lightspeed: { enabled: true, status: "available", category: "pos_inventory" },
          clover: { enabled: true, status: "available", category: "pos_inventory" },
          loyverse: { enabled: true, status: "available", category: "pos_inventory" },
          moneris: { enabled: false, status: "future", category: "payments", note: "Not a primary inventory source." },
          globalpayments: { enabled: false, status: "future", category: "payments", note: "Not a primary inventory source." },
        },
      },
    };

    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Cache-Control", "public, max-age=60");
    response.end(JSON.stringify(payload));
    return;
  }

  if (pathname === "/api/early-access" && request.method === "POST") {
    try {
      if (isRateLimited(`early-access:${getClientIp(request.headers)}`, EARLY_ACCESS_RATE_LIMIT, EARLY_ACCESS_RATE_WINDOW_MS)) {
        response.statusCode = 429
        response.setHeader("Content-Type", "application/json; charset=utf-8")
        response.setHeader("Retry-After", String(Math.ceil(EARLY_ACCESS_RATE_WINDOW_MS / 1000)))
        response.end(JSON.stringify({ ok: false, error: "rate_limited" }))
        return
      }

      const bodyText = await readRequestBody(request, MAX_EARLY_ACCESS_BODY_BYTES)
      const payload = JSON.parse(bodyText || "{}") as Record<string, unknown>

      const name = field(payload.name, 120)
      const email = field(payload.email, 254).toLowerCase()
      const location = field(payload.location, 160)
      const posSystem = field(payload.pos_system, 80)
      const storeCount = field(payload.store_count, 40)
      const monthlyRevenue = field(payload.monthly_revenue_band, 80)
      const biggestChallenge = field(payload.biggest_challenge, 500)
      const feedbackPartner = field(payload.feedback_partner, 40)
      const notes = field(payload.notes, 1000)
      const source = field(payload.source || "landing_page_modal", 120)

      if (!name || !email || !posSystem || !/^\S+@\S+\.\S+$/.test(email)) {
        response.statusCode = 400
        response.setHeader("Content-Type", "application/json; charset=utf-8")
        response.end(JSON.stringify({ ok: false, error: "missing_or_invalid_fields" }))
        return
      }

      const resendApiKey = process.env.RESEND_API_KEY
      const fromEmail = process.env.CONTACT_FROM_EMAIL || "Coodra <onboarding@resend.dev>"
      const toEmail = process.env.EARLY_ACCESS_TO_EMAIL || "admin@coodra.com"

      if (!resendApiKey) {
        response.statusCode = 503
        response.setHeader("Content-Type", "application/json; charset=utf-8")
        response.end(JSON.stringify({ ok: false, error: "email_not_configured" }))
        return
      }

      const subject = `New Early Access Application: ${name}`
      const emailText = [
        "New Coodra early-access application",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Location: ${location}`,
        `POS: ${posSystem}`,
        `Stores: ${storeCount || "-"}`,
        `Monthly Revenue: ${monthlyRevenue || "-"}`,
        `Biggest Challenge: ${biggestChallenge || "-"}`,
        `Feedback Calls: ${feedbackPartner || "-"}`,
        `Notes: ${notes || "-"}`,
        `Source: ${source}`,
      ].join("\n")

      const emailHtml = `
        <div style="font-family:Inter,Arial,sans-serif;color:#12253f;line-height:1.5">
          <h2 style="margin:0 0 12px">New Coodra Early Access Application</h2>
          <p style="margin:0 0 16px">A retailer submitted the landing-page early access form.</p>
          <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%">
            <tr><td style="padding:6px 0"><strong>Name:</strong></td><td style="padding:6px 0">${escapeHtml(name)}</td></tr>
            <tr><td style="padding:6px 0"><strong>Email:</strong></td><td style="padding:6px 0">${escapeHtml(email)}</td></tr>
            <tr><td style="padding:6px 0"><strong>Location:</strong></td><td style="padding:6px 0">${escapeHtml(location)}</td></tr>
            <tr><td style="padding:6px 0"><strong>POS:</strong></td><td style="padding:6px 0">${escapeHtml(posSystem)}</td></tr>
            <tr><td style="padding:6px 0"><strong>Stores:</strong></td><td style="padding:6px 0">${escapeHtml(storeCount || "-")}</td></tr>
            <tr><td style="padding:6px 0"><strong>Monthly Revenue:</strong></td><td style="padding:6px 0">${escapeHtml(monthlyRevenue || "-")}</td></tr>
            <tr><td style="padding:6px 0"><strong>Biggest Challenge:</strong></td><td style="padding:6px 0">${escapeHtml(biggestChallenge || "-")}</td></tr>
            <tr><td style="padding:6px 0"><strong>Feedback Calls:</strong></td><td style="padding:6px 0">${escapeHtml(feedbackPartner || "-")}</td></tr>
            <tr><td style="padding:6px 0"><strong>Notes:</strong></td><td style="padding:6px 0">${escapeHtml(notes || "-")}</td></tr>
            <tr><td style="padding:6px 0"><strong>Source:</strong></td><td style="padding:6px 0">${escapeHtml(source)}</td></tr>
          </table>
        </div>
      `

      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: email,
          subject,
          text: emailText,
          html: emailHtml,
        }),
      })

      if (!resendRes.ok) {
        const detail = await resendRes.text().catch(() => "")
        console.error("Early access email send failed:", detail)
        response.statusCode = 502
        response.setHeader("Content-Type", "application/json; charset=utf-8")
        response.end(JSON.stringify({ ok: false, error: "email_send_failed" }))
        return
      }

      response.statusCode = 200
      response.setHeader("Content-Type", "application/json; charset=utf-8")
      response.end(JSON.stringify({ ok: true }))
      return
    } catch (error: unknown) {
      if (error instanceof PayloadTooLargeError) {
        response.statusCode = 413
        response.setHeader("Content-Type", "application/json; charset=utf-8")
        response.end(JSON.stringify({ ok: false, error: "request_body_too_large" }))
        return
      }
      if (error instanceof SyntaxError) {
        response.statusCode = 400
        response.setHeader("Content-Type", "application/json; charset=utf-8")
        response.end(JSON.stringify({ ok: false, error: "invalid_json" }))
        return
      }
      const message = errorMessage(error)
      console.error("Early access handler error:", message)
      response.statusCode = 500
      response.setHeader("Content-Type", "application/json; charset=utf-8")
      response.end(JSON.stringify({ ok: false, error: "internal_error" }))
      return
    }
  }

  if (
    pathname.startsWith("/assets") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    response.status(404).send("Not Found");
    return;
  }

  try {
    await ensureHandler();
    await requestHandler(request, response);
  } catch (error: unknown) {
    const message = errorMessage(error);
    const stack = error instanceof Error ? error.stack : "";
    console.error("Handler error:", message, "\nStack:", stack);
    response.status(500).send("Internal Server Error");
  }
}
