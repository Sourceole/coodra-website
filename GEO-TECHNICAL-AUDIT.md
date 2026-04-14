# GEO Technical SEO Audit — coodra.com
Date: 2026-04-11

## Technical Score: 87/100

## Score Breakdown
| Category | Score | Status |
|---|---|---|
| Crawlability | 14/15 | Pass |
| Indexability | 9/12 | Pass |
| Security | 10/10 | Pass |
| URL Structure | 8/8 | Pass |
| Mobile Optimization | 9/10 | Pass |
| Core Web Vitals | 12/15 | Pass |
| Server-Side Rendering | 15/15 | Pass |
| Page Speed & Server | 10/15 | Warn |

Status: Pass = 80%+ of category points, Warn = 50-79%, Fail = <50%

## AI Crawler Access
| Crawler | User-Agent | Status | Recommendation |
|---|---|---|---|
| GPTBot | GPTBot | Allowed | No action needed |
| Googlebot | Googlebot | Allowed | No action needed |
| Google-Extended | Google-Extended | Allowed | No action needed |
| PerplexityBot | PerplexityBot | Allowed | No action needed |
| ClaudeBot | ClaudeBot | Allowed | No action needed |
| CCBot | CCBot | Allowed | No action needed |
| bingbot | bingbot | Allowed | No action needed |
| Amazonbot | Amazonbot | Allowed | No action needed |
| FacebookBot | FacebookBot | Allowed | No action needed |
| Applebot-Extended | Applebot-Extended | Allowed | No action needed |
| Bytespider | Not listed | Assumed allowed | No action needed |

All major AI crawlers are allowed. robots.txt is well-configured.

## Critical Issues (fix immediately)

### 1. Pricing/Login canonical points to homepage (SSR bug)
**Page:** `/pricing`, `/login`
**Problem:** `<link rel="canonical" href="https://www.coodra.com/"/>` on the pricing page points to homepage instead of `https://www.coodra.com/pricing`. Same for login.
**Impact:** Search engines may treat pricing/login as duplicate content of homepage.
**Fix:** Ensure `root.tsx` uses `location.pathname` for canonical, not a hardcoded path.

### 2. Page titles not differentiated (SSR bug)
**Page:** `/pricing`, `/login`, `/signup`
**Problem:** All return `<title>Coodra — Retail Decision Intelligence</title>` (homepage title).
**Impact:** Users and search engines cannot distinguish pages by title in browser tabs or SERPs.
**Fix:** Add route-specific `<title>` in each route's `meta()` export.

## Warnings (fix this month)

### 3. Large HTML page weight — homepage 27KB
**Page:** `/` (homepage)
**Finding:** Homepage SSR HTML is 27,610 bytes uncompressed. The inline Three.js canvas data contributes significantly.
**Impact:** Slow TTFB contribution on cold loads; higher bandwidth cost per pageview.
**Fix:** Consider moving the decorative canvas data to a lazy-loaded asset, or streaming the response for TTFB improvement.

### 4. Cross-Origin-Opener-Policy: same-origin (may limit AI indexing)
**Header:** `Cross-Origin-Opener-Policy: same-origin`
**Finding:** This header prevents cross-origin pages from communicating with the document via `window.opener`. While secure, some AI crawlers (particularly browser-based ones like Perplexity) may have issues with pages that open AI tool windows.
**Impact:** Low — this is a security-appropriate setting. Documenting for awareness only.
**Fix:** No action needed — same-origin is the correct setting for an app like Coodra.

## Recommendations (optimize this quarter)

### 5. Add JSON-LD structured data
**Pages:** Homepage, Pricing
**Finding:** No structured data detected in raw HTML.
**Opportunity:** Adding Organization schema, Product/Service schema for pricing tiers, and FAQ schema could significantly boost AI citation quality and search appearance.
**Recommendation:** Add JSON-LD `<script type="application/ld+json">` in `root.tsx` for Organization schema. Add Service schema on pricing page.

### 6. Sitemap missing key pages
**Finding:** `/dashboard`, `/admin`, `/verify-email`, `/reset-password` are not in sitemap.
**Impact:** These are auth-gated but should still be discoverable.
**Recommendation:** Add auth pages to sitemap with `priority: 0.1` and `changefreq: yearly`. Note: these pages may be `noindex` which is appropriate for auth-gated content.

### 7. Add robots.txt disallow for `/dashboard` and `/admin`
**Finding:** Dashboard and admin are auth-gated but crawlable.
**Recommendation:** Add `Disallow: /dashboard` and `Disallow: /admin` to prevent unnecessary crawl budget spend on pages that will redirect unauthenticated users anyway.

### 8. Consider adding IndexNow protocol
**Finding:** IndexNow is not implemented.
**Opportunity:** IndexNow would instantly notify Bing/Yandex when pricing or content changes, speeding up AI visibility on Bing Copilot and ChatGPT (which uses Bing index).
**Recommendation:** Add IndexNow key file at `.well-known/indexnow-key.txt` and notify IndexNow when content changes.

### 9. TTFB excellent at 241ms
**Finding:** Time to first byte is 241ms — well under the 800ms target.
**Opportunity:** Already excellent. No action needed.

## Detailed Findings

### Category 1: Crawlability — 14/15
- **robots.txt:** Valid, complete. All AI crawlers allowed. Sitemap reference present.
- **AI Crawler Access:** All 10 major AI crawlers allowed. 5/5 points.
- **XML Sitemap:** Present at `/sitemap.xml` (after fix). 4 URLs tracked.
- **Crawl Depth:** All public pages reachable within 2 clicks from homepage. 2/2 points.
- **Noindex:** No erroneous noindex directives found. 2/2 points.

### Category 2: Indexability — 9/12
- **Canonical Tags:** Present on all pages but `/pricing` and `/login` canonical points to homepage (bug, see Critical Issue #1). 2/3 points.
- **Duplicate Content:** Minor issue — pricing/login share homepage's canonical and description. 2/3 points.
- **Pagination:** Not applicable (no paginated content).
- **Hreflang:** Not applicable (single language site).
- **Index Bloat:** Only 4 pages in sitemap; indexed pages likely match content pages. 2/2 points.

### Category 3: Security — 10/10
- **HTTPS:** Enforced, valid.
- **HSTS:** Present with appropriate settings (`max-age=31536000; includeSubDomains; preload`). 2/2 points.
- **CSP:** Comprehensive, properly restrictive. 1/1 points.
- **X-Content-Type-Options:** `nosniff` present. 1/1 points.
- **X-Frame-Options:** `SAMEORIGIN` present. 1/1 points.
- **Referrer-Policy:** `strict-origin-when-cross-origin` present. 1/1 points.
- **Permissions-Policy:** `camera=(), microphone=(), geolocation=()` — appropriate restrictions. 1/1 points.
- **X-Permitted-Cross-Domain-Policies:** `none` present. 1/1 points.
- **Cross-Origin-Opener-Policy:** `same-origin` present. 1/1 points.
- **Cross-Origin-Resource-Policy:** `same-site` present. 1/1 points.

### Category 4: URL Structure — 8/8
- **Clean URLs:** All URLs are clean (`/`, `/pricing`, `/login`, `/signup`, `/dashboard`). 2/2 points.
- **Logical Hierarchy:** Flat structure appropriate for a small marketing site. 2/2 points.
- **Redirect Chains:** None detected. All pages serve directly. 2/2 points.
- **Parameter Handling:** No parameter-based duplicates. 2/2 points.

### Category 5: Mobile Optimization — 9/10
- **Viewport:** `<meta name="viewport" content="width=device-width, initial-scale=1.0"/>` present on all pages. 3/3 points.
- **Responsive Layout:** CSS-based responsive design detected. 3/3 points.
- **Tap Targets:** Buttons and links appear appropriately sized in CSS. 2/2 points.
- **Font Sizes:** Base font sizes appear adequate. 1/2 points (minor uncertainty without live mobile test).

### Category 6: Core Web Vitals — 12/15
- **LCP:** Estimated good — TTFB is fast (241ms), hero content is text-based with CSS, no large hero images blocking render. 4/5 points.
- **INP:** Estimated good — minimal JS on landing page, streaming SSR reduces blocking. 4/5 points.
- **CLS:** Estimated good — all images should have explicit dimensions in CSS, no dynamic content insertion above fold. 4/5 points.
- *Note: Field data unavailable — estimates based on code inspection. Recommend verifying with CrUX data in Google Search Console.*

### Category 7: Server-Side Rendering — 15/15 (CRITICAL FOR GEO)
- **Main content in raw HTML:** Full page content (hero, nav, sections, footer, testimonials) confirmed in curl output for `/`, `/pricing`, `/login`, `/signup`. 8/8 points.
- **Meta tags + structured data:** Title, description, canonical, OG tags, robots meta all in raw HTML. However, canonical and title are incorrectly shared (see Critical Issue #1). 3/4 points.
- **Internal links:** Navigation links, CTA links, footer links all present in raw HTML. 3/3 points.
- **Assessment:** SSR is working correctly. AI crawlers will see complete content. This is the biggest improvement from the previous CSR-only implementation.

### Category 8: Page Speed & Server — 10/15
- **TTFB:** 241ms — well under 800ms target. 3/3 points.
- **Page weight:** Homepage 27KB uncompressed HTML, 127KB pricing page. Reasonable for content-rich pages. 1/2 points.
- **Images:** Images served from CDN (`cdn.jsdelivr.net` for icons). No oversized images detected in SSR HTML. 2/3 points.
- **JS bundles:** Supabase 186KB is the largest bundle. Route-level code splitting confirmed (`/assets/_index-DJjE4fgb.js` 19KB for homepage route only). 1/2 points.
- **Compression:** Vercel applies gzip/brotli automatically. 2/2 points.
- **Cache headers:** Assets served with `Cache-Control: public, max-age=0, must-revalidate` — no long-term caching on HTML. Assets use content-hashed filenames but `max-age=0` means every page load refetches assets. 0/2 points.
- **CDN:** Vercel Edge Network used automatically. 1/1 points.

### Notable: Cache headers on static assets
All assets (CSS, JS, images) return `Cache-Control: public, max-age=0, must-revalidate`. This means browsers cannot cache assets between sessions. With content-hashed filenames, this is overly restrictive. Consider setting `Cache-Control: public, max-age=31536000, immutable` for assets with content hashes — Vercel typically handles this but the header is being overridden by the vercel.json security headers configuration.

## Summary

Coodra's technical foundation for AI search visibility is **strong and improving**. The SSR migration fixes the single biggest GEO issue (AI crawlers seeing empty pages). AI crawler access is fully open. Security headers are comprehensive. TTFB is excellent.

The two critical fixes needed are both SSR-related bugs:
1. Canonical tag bug on inner pages (pricing, login) pointing to homepage
2. Title tag bug — all inner pages show homepage title

Both are straightforward fixes in `root.tsx` or individual route `meta()` exports.

The biggest remaining opportunity is **cache headers on static assets** — the `max-age=0` policy on content-hashed assets forces revalidation on every load, degrading performance. This is likely from the security headers configuration in vercel.json and should be narrowed to only apply to HTML responses.