import type { IncomingHttpHeaders, IncomingMessage, ServerResponse } from "node:http";

type VercelRequest = IncomingMessage & {
  url?: string;
  headers: IncomingHttpHeaders;
};

type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  send: (body: string) => void;
};

export const config = {
  runtime: "nodejs",
};

let requestHandler: (req: any, res: any) => Promise<void> | void;

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
  }) as any;
}

export default async function vercelHandler(
  request: VercelRequest,
  response: VercelResponse
) {
  const url = new URL(request.url || "/", `https://${request.headers.host}`);
  const pathname = url.pathname;

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
  } catch (error: any) {
    console.error("Handler error:", error?.message || error, "\nStack:", error?.stack);
    response.status(500).send("Server error: " + (error?.message || String(error)));
  }
}
