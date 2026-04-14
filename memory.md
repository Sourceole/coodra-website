# Coodra Project Memory

## Purpose
Persistent working notes for ongoing Coodra website work so future sessions can recover context quickly.

## How To Use
- Update this file with stable context (architecture, conventions, key decisions).
- Add a dated log entry in `memory/daily-YYYY-MM-DD.md` after each significant change.
- Prefer facts + file paths + deploy URLs over long narratives.

## Current Project Snapshot
- Project path: `C:\Users\micha\shopify\coodra-website`
- Stack: Vite + React + TypeScript + React Router (currently client-rendered, planned RRv7 SSR migration).
- Hosting: Vercel (`www.coodra.com`).
- Key app areas:
  - Landing page: `src/pages/LandingPage.tsx` + `src/pages/LandingPage.css`
  - Retailer UX shell: `src/pages/Dashboard.tsx` + `public/wh-command-center.*`
  - Auth guards: `src/components/AuthGuard.tsx`, `src/components/AdminGuard.tsx`
  - Supabase helpers: `src/lib/supabase.ts`

## Important Recent Decisions
- Mobile nav uses hamburger + slide-down panel with Sign in inside mobile menu.
- Hero is text-first with animated teal rotating phrase and interactive background grid.
- Redirect loop issue fixed by removing self-referential redirects from `vercel.json`.
- Pricing header now mirrors landing header styling/behavior (transparent nav style, same mobile breakpoint behavior).
- Section hash navigation is standardized to direct hash links (`#...`) and handled in `app/root.tsx` for first-click smooth scroll reliability.
- Global heading tracking standardized via `--title-letter-spacing` in `src/index.css`.
- Favicons now sourced from `public/favicon.png` with cache-busted links at `?v=4`.

## Tooling Notes
- Installed local UI audit tool:
  - Repo: `C:\Users\micha\shopify\tools\impeccable`
  - Dependencies installed (`npm install` complete).
- `impeccable` source scan used for anti-pattern cleanup across landing/blog/case studies/login/contact.

## Deployment Notes
- Always run `npm run build` before deploy.
- Deploy command: `vercel --prod --yes`

## Open Threads
- React Router v7 framework/SSR migration planned by Minimax.
- Keep auth flow and page logic intact during migration.

- 2026-04-11: Retailer UX fix - guarded Shopify AJAX cart calls in public/wh-command-center.web.js to prevent /cart.js 404 on coodra.com; bumped dashboard asset version to 2026-04-11-retailer-cart-guard-2.
- 2026-04-13: Pricing header parity + centered container fixes + favicon update + impeccable audit cleanup + hash-nav first-click fix + proof heading forced 2-line layout.
