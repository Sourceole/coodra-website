# Coodra Project Memory

## Purpose
Persistent shared memory for Coodra website work (Codex + Minimax + Michael) so new sessions can recover context quickly and avoid regressions.

## Project Snapshot
- Project path: `C:\Users\micha\shopify\coodra-website`
- Hosting: Vercel production alias `https://www.coodra.com`
- Stack:
  - React Router v7 SSR app (`app/root.tsx`, `app/routes.ts`)
  - React + TypeScript + Vite
  - Supabase auth/data helpers
  - Serverless API in `api/index.ts`
- Core content/data:
  - Blog records: `src/data/blogPosts.ts`
  - Case studies: `src/data/caseStudies.ts`
  - Route pages: `src/routes/*`, `src/pages/*`

## Brand / UX Constants
- Keep landing headline tagline: `Your store. On autopilot.`
- Brand colors:
  - Teal `#2fd7c6`
  - Navy `#0a1a31` (limited; no dark-mode sections unless explicitly requested)
  - Muted `#506786`
  - White `#ffffff`
  - Surface `#f8fafc`
- Font system:
  - Bebas Neue (display/headlines)
  - Inter (UI/nav/footer/buttons)
  - Nunito (body/supporting copy)
- Header and footer must stay visually consistent across pages with landing-page style.

## Live Routes (Current)
- Marketing: `/`, `/pricing`, `/about`, `/contact`, `/integrations`, `/security`, `/comparisons`, `/resources`, `/inventory-management`
- Content: `/blog`, `/blog/:slug`, `/case-studies`, `/case-studies/:slug`
- Product/auth: `/login`, `/signup`, `/dashboard`, `/admin`, `/verify-email`, `/reset-password`
- Legal: `/privacy`, `/terms`

## Major Completed Work (Consolidated)
- Mobile nav and landing behavior polish:
  - Hamburger menu behavior, layering fixes, alignment and spacing polish.
  - Section/hash navigation reliability improved (first-click smooth scroll behavior).
- Header/footer parity effort across secondary pages to match landing style.
- SSR/CSP/hydration stability pass:
  - Theme bootstrapping moved away from problematic inline paths.
  - Hydration mismatch noise reduced; route/framework import alignment done.
  - CSP updates for production asset/script behavior.
- Retailer dashboard UX fix:
  - Guarded Shopify cart calls in non-Shopify context to prevent `/cart.js` 404s.
- SEO/GEO implementation (from Minimax memory + repo state):
  - Org/WebSite JSON-LD in root.
  - Blog and pricing structured data coverage implemented.
  - Sitemap expanded and maintained.
  - Robots updated for crawler policy.
- Blog system and page polish:
  - Grid/spacing/centering fixes.
  - Post rendering and image/path cleanup.
- Integrations/comparisons/inventory/security/about page iterations with ongoing visual refinement.

## Content + SEO Notes
- Blog library includes operational inventory/POS topics and comparison content.
- GEO docs/plans live in:
  - `GEO-TECHNICAL-AUDIT.md`
  - `SEO-PLAN.md`
  - `SEO-AUDIT.md`
- Expansion/redesign planning docs:
  - `PAGE-EXPANSION-PLAN.md`
  - `PAGE-REDESIGN-PLAN.md`
  - `COMPETITIVE-DESIGN-ANALYSIS.md`

## Deployment Protocol
1. `npm run build` (must pass)
2. `vercel --prod --yes` (or `npx vercel deploy --prod --yes`)
3. Verify alias points to `https://www.coodra.com`
4. Smoke test key routes and console/runtime stability

## Latest Verified Status (2026-04-18)
- Production dependency hardening completed:
  - `@react-three/drei` upgraded to `9.122.0`
  - `shadcn` moved to `devDependencies`
  - `npm audit --omit=dev` returned `0 vulnerabilities`
- Full live sweep across sitemap URLs completed:
  - 23 URLs checked
  - 0 HTTP failures
  - 0 runtime/page errors
  - 0 console errors after fix
- Fixed blog console error root cause:
  - Missing image reference on `/blog` (`/images/blog/demand-forecasting-erp.jpg`)
  - Updated to existing asset path in `src/data/blogPosts.ts`
  - Rebuilt, redeployed, and re-verified clean

## Working Notes
- Keep dark mode disabled site-wide unless explicitly requested.
- Favor smooth but subtle motion; mobile can use simpler motion variants than desktop.
- Verify design changes in-browser before claiming complete.
