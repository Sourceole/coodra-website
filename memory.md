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

## Latest Verified Status (2026-04-25)
- Landing page cleanup + stabilization completed:
  - Removed legacy/unused landing CSS/JS systems while preserving current visual design.
  - Kept active systems only (`hero-v5`, `how-simple`, `ai-chat`, `how-workflow`, `impact`, `cta`, reveal observers, button effects).
  - Confirmed `LandingPage.css` is imported by `LandingPage.tsx` and active behavior remains intact.
- Final QA completed in preview mode (`vite preview`) to avoid dev-HMR false positives:
  - Viewports checked: `1440`, `1280`, `768`, `390`, plus mobile menu open state.
  - Build passed: `npm run build`.
  - Targeted lint passed: `npx eslint src/pages/LandingPage.tsx`.
  - Console in preview: no runtime errors.
  - Mobile menu and header behavior verified.
  - No horizontal overflow at tested breakpoints.
  - No broken links or missing landing assets found in QA sweep.
- Production deployment completed:
  - Vercel deployment promoted and aliased to `https://www.coodra.com`.

## Latest Verified Status (2026-04-28)
- SEO visual insert rollback completed by request:
  - Removed the generated SEO image + method/evidence block from landing impact section.
  - Removed the generated SEO image + methodology references block from pricing FAQ section.
  - Removed now-unused CSS selectors tied to those blocks from:
    - `src/pages/LandingPage.css`
    - `src/pages/PricingPage.css`
- Build verified after rollback:
  - `npm run build` passed locally before deploy.
- Production deployments completed:
  - `dpl_H3ABr7ChENRHKc2kDdmnFDTwrfWZ`
  - `dpl_28ZDQX9qSdgVufUidFsdRaT2tXFD`
  - Both aliased to `https://www.coodra.com`.
- SEO/schema clarification captured:
  - Blog article detail pages already include `articleBody` in JSON-LD.
  - Blog index has `BlogPosting` items but does not require full `articleBody` on each list card for Article rich result eligibility.
  - Recommended future enhancement remains: model blog index as `ItemList` + `ListItem` with lightweight metadata.

## Working Notes
- Keep dark mode disabled site-wide unless explicitly requested.
- Favor smooth but subtle motion; mobile can use simpler motion variants than desktop.
- Verify design changes in-browser before claiming complete.
- Always validate landing behavior in preview/prod mode before final sign-off.

## Dashboard + Integrations Notes (Current)
- Retail dashboard integration connect buttons are scaffolded for provider-specific flows.
- Missing provider credentials/config still prevent fully live OAuth handshakes for all providers.
- Shopify note:
  - Users without a Shopify account will hit Shopify account access/login gate as expected during OAuth.
- Current backend/claim alignment direction:
  - Keep website claims in review-first language until all server-side enforcement paths are confirmed.
  - Avoid hard claims for provider coverage where account-level config is still required.

## Integration Connect Note (2026-04-24)
- Retailer dashboard integration connect flow is now scaffolded end-to-end with:
  - backend start + callback routes,
  - signed callback state,
  - provider token exchange hooks,
  - encrypted token storage fields in billing metadata (`provider_oauth`),
  - provider status updates in `pos_connections`.
- Remaining work is configuration only (credentials + callback app settings).  
  See full checklist in `memory/daily-2026-04-24.md`.

## Handoff Update (2026-04-28, Late Session)

### What We Completed Today
- Deployed multiple production updates to `https://www.coodra.com` across landing/resources/integrations/pricing/security/dashboard polish.
- Added and iterated the Landing Page **Early Access modal** experience (multi-step form, non-intrusive reopen trigger, revised copy and visual styling).
- Wired early-access submission to serverless endpoint `/api/early-access` (Resend email relay to admin inbox).
- Updated modal copy badge text to `2-minute application`.

### Current Fix Just Completed (Important)
- Issue reported: Step 2 displayed `Could not submit right now. Please try again in a moment.` when it should only appear on true submit failures.
- Root cause found: **frontend/backend validation mismatch**.
  - Frontend Step 1 required: `name`, `email`, `posSystem` (location optional).
  - Backend `/api/early-access` still required `location`.
  - Result: submit failed server-side and surfaced generic error.
- Fix applied in backend:
  - File: `api/index.ts`
  - Changed validation to require only `name`, `email`, `posSystem` (+ valid email regex).
  - `location` is now optional server-side.
- Verified:
  - `npm run build` passed locally.
  - Deployed to production and aliased to `https://www.coodra.com`.
  - Deployment id: `dpl_5CH4MZggrNxFM8vn31KAQJBXU6jU`.

### Active/Relevant Files for New Chat
- **Primary current work file**: `src/pages/LandingPage.tsx`
- Styling for modal + hero/page interactions: `src/pages/LandingPage.css`
- Early-access API handler: `api/index.ts`

### What Was Tried During This Fix Cycle
- Added step-aware submit handler in landing form so Step 1 advances and Step 2 submits.
- Cleared stale error state on step transitions/open events.
- Removed `required` from location input in Step 1 UI.
- Final true blocker was backend requiring location; fixed there.

### Current TODO (carry into next chat)
1. **Early Access modal typography/layout final pass**
   - User wants modal headline typography to match landing headline system more closely.
   - Ensure intro title wraps to desired line count on desktop without awkward breaks.
   - Keep no-bloat rule: replace conflicting rules, do not stack overrides.
2. **Modal CSS conflict audit (targeted)**
   - Inspect only early-access modal selectors in `LandingPage.css` for legacy/conflicting declarations.
   - Remove dead/duplicate modal-specific rules safely.
3. **Behavior sanity check after CSS pass**
   - Confirm: Step 0 -> Step 1 -> Step 2 -> Step 3 flow still works.
   - Confirm error only appears on real non-OK submit.

### Guardrails
- Do not change modal submission payload contract unless needed.
- Keep current copy unless user asks.
- No deploy until user asks; when asked, run build first.

## Current State Update (2026-05-03)

### High-Level Direction (Dashboard Revamp)
- We are actively rebuilding the authenticated dashboard experience to visually match provided desktop reference mockups (Command Center, Decisions, Merchandise, Operations, Intelligence, Workspace, Settings) while keeping Coodra-specific backend metrics and logic.
- Core design language now:
  - Outer dark gray app background.
  - One large light-gray container wrapping nav + content.
  - White main content card/panel with internal page scrolling behavior.
  - Teal used as accent (`#2fd7c6` / `#1fc4ba`), not primary text color.
  - Black/dark-gray text across nav and headings.

### What We Completed Most Recently
- Decisions page sections were reworked significantly:
  - Performance section:
    - Decision Outcomes card was rebuilt into a dedicated compact strip component (`DecisionOutcomesStrip`) to prevent inherited layout collisions from shared metric CSS.
    - Approval Velocity / Prediction Accuracy card layout and chart sizing were tuned to better match the reference proportions.
  - History section:
    - Replaced generic `SimpleTable` usage with purpose-built structures:
      - `DecisionsHistoryTable`
      - `DismissedReasonsTable`
    - Added proper headers/columns and row styling closer to reference:
      - Recent Decisions now includes Decision, Type, Status, Impact, Decided, trailing arrow.
      - Dismissed Reasons now includes Reason, Count, % of Dismissed, horizontal orange bars, and row separators.
    - Updated "View all" styling to dark gray tone in these cards.
- Multiple compile-fix cleanups were completed (removed now-unused helpers/components/imports that caused TypeScript failures).
- Build + preview cycle discipline maintained after changes:
  - `npm run build` passes.
  - preview server restarted on `http://127.0.0.1:4173/dashboard`.

### Current Work-In-Progress (Where We Are Right Now)
- We are in precision visual matching mode for the Decisions page only (Performance + History), aiming for near 1:1 with provided references.
- Remaining polish focus for immediate next pass:
  1. Fine-tune exact vertical rhythm and sizing parity between the two Performance cards.
  2. Align Decision Outcomes typography order/spacing exactly to reference (label/value/meta hierarchy).
  3. Tighten Approval chart visual density and scale to mirror reference.
  4. Finish final micro-alignment in History tables (spacing/weights/column widths) to match screenshot proportions.

### Files Currently Being Worked In
- Primary UI logic/components:
  - `C:\Users\micha\shopify\coodra-website\src\dashboard\NewDashboard.tsx`
- Primary dashboard styling:
  - `C:\Users\micha\shopify\coodra-website\src\dashboard\NewDashboard.css`

### Supporting Runtime/Verification Context
- Local preview target for current work:
  - `http://127.0.0.1:4173/dashboard`
- Build and preview restart are run repeatedly during each UI pass to avoid stale CSS/asset issues.

### Important Working Constraints (Still Active)
- Match design references very closely, but do not add fake/untracked business metrics.
- Keep data connected to existing backend/supabase-backed structures where possible.
- Remove/avoid CSS bloat and conflicting overrides during each iteration.
- After frontend changes: build must pass before continuing.

## Current State Update (2026-05-07)

### Big Picture
- The authenticated Coodra dashboard has moved from visual mockup/polish work into real backend integration and production-readiness work.
- User direction is now: every client-facing card/button should be truthful, connected where backend data exists, and use honest empty states/readiness prompts where data does not exist.
- Supabase/backend is the source of truth. Do not add decorative dashboard-only tables or fake supplier/forecast/scorecard metrics.

### Backend/Data Audit Direction Completed
- Audited backend/Supabase direction against dashboard metrics.
- Product principle established:
  - Build data foundations for decisions, execution, trust, auditability, and SaaS operations.
  - Do not create vanity metric tables just because a UI mock shows a metric.
- Priority backend concepts identified:
  - recommendation outcomes
  - prediction/recommendation accuracy snapshots
  - forecast accuracy snapshots
  - dismissal reasons
  - approval velocity derived from workflow timestamps
  - PO workflow only where reorder execution is real
  - data readiness / missing-data checks
  - usage/billing/admin metrics where appropriate
- Supplier caution:
  - Do not show fake supplier scorecards, lead-time drift, fill rate, cost drift, reliability, or supplier alerts without real supplier/PO/invoice/event data.
  - Prefer honest labels like Vendor Watch / Supply Risk / Reorder Readiness until supplier data exists.

### Dashboard Integration Work Done
- Dashboard was updated heavily across nav pages:
  - Command Center
  - Decisions
  - Merchandise
  - Operations
  - Intelligence
  - Workspace
  - Integrations
  - Help
  - Settings/admin surfaces in progress
- Many visual placeholder metrics/images were replaced or hidden/renamed where backend data is not available.
- Intelligence charts now use hover cards/tooltips like Approval Velocity in Decisions.
- Operations, Merchandise, Workspace, and Intelligence spacing/layout were repeatedly tightened against screenshots.
- Integrations received its own nav item/page with search and real logo assets where available.
- Help page was added as an in-dashboard Help surface, styled consistently with the rest of the app.
- Ask Coodra chat card was redesigned:
  - cleaner panel,
  - context line,
  - prompt chips,
  - attachment button,
  - resizable side panel,
  - reduced placeholder/bold text issues.
- Notifications were added near global search as a cohesive dropdown/card.

### Backend/Frontend Integration + Security Work
- We began wiring dashboard buttons/actions to actual backend endpoints instead of placeholders.
- Security hardening direction included:
  - stricter CORS,
  - security headers,
  - no service role exposure to frontend,
  - authenticated backend JWT flow,
  - tenant-aware backend route checks,
  - auditability for sensitive actions where backend supports it.
- Important CORS fix:
  - Backend CORS now explicitly allows frontend headers needed by dashboard auth/API calls:
    - `x-user-email`
    - `x-user-role`
    - `x-role`
    - `x-api-key`
    - `x-mfa-token`
    - `x-mfa-device`
    - `x-merchant-key`
  - File:
    - `C:\Users\micha\shopify\freight-pool-app\sourceole-ai-backend\api\_lib\cors.js`

### Auth/MFA Fix Completed and Confirmed Working
- Issue:
  - User could log in, but did not receive the old dashboard's 6-digit verification code email.
  - The old dashboard used Resend-backed `/api/mfa`; the new React login flow was skipping that MFA step after Supabase login.
- Root cause:
  - Supabase password authentication succeeded.
  - New login page exchanged for backend JWT and navigated to dashboard without starting `/api/mfa`.
  - Therefore Resend was never asked to send the 6-digit code.
- Fix:
  - Added MFA helper functions to:
    - `C:\Users\micha\shopify\coodra-website\src\lib\supabase.ts`
  - Updated login flow in:
    - `C:\Users\micha\shopify\coodra-website\src\pages\LoginPage.tsx`
  - Added MFA code UI styling in:
    - `C:\Users\micha\shopify\coodra-website\src\pages\LoginPage.css`
- New auth flow:
  1. User signs in with Supabase password auth.
  2. Frontend exchanges Supabase session for backend JWT.
  3. Frontend starts `/api/mfa?action=start&reason=login`.
  4. Backend sends 6-digit Resend email.
  5. User enters code on login page.
  6. Frontend verifies via `/api/mfa?action=verify&reason=login`.
  7. Only then does frontend store backend JWT and navigate to `/dashboard`.
- Google OAuth was changed to redirect back through `/login` so the same MFA check can run instead of bypassing it.
- User confirmed: "Great it works."

### Deployments/Verification From Latest Pass
- Backend deployed to production and aliased to:
  - `https://api.coodra.com`
- Website deployed to production and aliased to:
  - `https://www.coodra.com`
- Verified after deploy:
  - `https://www.coodra.com/login` returns 200.
  - Production MFA preflight to `https://api.coodra.com/api/mfa?action=start&reason=login` returns 200.
  - MFA CORS now allows `x-mfa-device` and `x-mfa-token`.
  - `npm run build` passes.
  - Local preview restarted on:
    - `http://127.0.0.1:4173`

### Key Files To Remember
- Website auth/frontend:
  - `C:\Users\micha\shopify\coodra-website\src\lib\supabase.ts`
  - `C:\Users\micha\shopify\coodra-website\src\pages\LoginPage.tsx`
  - `C:\Users\micha\shopify\coodra-website\src\pages\LoginPage.css`
  - `C:\Users\micha\shopify\coodra-website\src\components\AuthGuard.tsx`
- Dashboard:
  - `C:\Users\micha\shopify\coodra-website\src\pages\Dashboard.tsx`
  - `C:\Users\micha\shopify\coodra-website\src\pages\Dashboard.css`
  - `C:\Users\micha\shopify\coodra-website\src\dashboard\*`
- Backend/API:
  - `C:\Users\micha\shopify\freight-pool-app\sourceole-ai-backend\api\log.js`
  - `C:\Users\micha\shopify\freight-pool-app\sourceole-ai-backend\api\chat.js`
  - `C:\Users\micha\shopify\freight-pool-app\sourceole-ai-backend\api\recommend.js`
  - `C:\Users\micha\shopify\freight-pool-app\sourceole-ai-backend\api\reorders.js`
  - `C:\Users\micha\shopify\freight-pool-app\sourceole-ai-backend\api\_lib\cors.js`
  - `C:\Users\micha\shopify\freight-pool-app\sourceole-ai-backend\vercel.json`
- Existing old-dashboard reference:
  - `C:\Users\micha\shopify\freight-pool-app\snippets\so-wh-command-center-script.liquid`

### Current TODO / Next Work
1. Continue button-by-button dashboard production readiness:
   - approve/dismiss decisions,
   - settings actions,
   - profile image upload,
   - integrations connect/disconnect,
   - exports/reports where real backend support exists,
   - Help page actions,
   - Ask Coodra attachments/chat.
2. Keep replacing remaining placeholders with:
   - real backend data,
   - derived metrics,
   - or honest empty states.
3. Run smoke tests page by page after wiring:
   - Command Center
   - Decisions
   - Merchandise
   - Operations
   - Intelligence
   - Workspace
   - Integrations
   - Help
   - Settings
4. Keep production rules:
   - build before deploy,
   - restart preview after `npm run build`,
   - verify production CORS/API routes after deploy.

### Dashboard MFA Enforcement Update (2026-05-07)
- Dashboard MFA is now enforced beyond the login page.
- Policy: require the 6-digit email verification code every 12 hours per browser/device.
- Implementation:
  - The verified MFA token is stored per browser/device using the existing `coodra_mfa_device_id_v1` device id flow.
  - `src/pages/Dashboard.tsx` checks `/api/mfa?action=status&reason=login` during dashboard boot.
  - If the MFA token is missing/expired/invalid, the dashboard clears the cached backend JWT and routes to `/login?mfa=required`, where the existing Resend-backed 6-digit code flow runs.
  - While the dashboard remains open, it re-checks the MFA window once per minute and refreshes the short backend JWT as needed.
  - The backend MFA token TTL remains 12 hours for login reason; the 6-digit challenge code itself still expires after 10 minutes.
- Deployed to production website and verified in live bundle:
  - `https://www.coodra.com/assets/dashboard-BmKs4zzg.js`
  - `https://www.coodra.com/assets/supabase-a1L4I09m.js`

### Ask Coodra Chat UI Update (2026-05-07)
- Chat bubbles no longer show `You` / `Coodra` speaker labels inside each bubble.
- User chat bubbles now use a light gray surface; assistant bubble text is bold for stronger readability.
- Added a `Recent` control beside the close button in Ask Coodra.
- Recent conversations are stored per signed-in user in browser storage under `coodra_chat_conversations_v1_*`.
- Users can reopen recent conversations, start a new chat, and delete conversations.
- Deleting a conversation opens a centered confirmation dialog first; deleting the active conversation clears the active chat.
- Deployed to production and verified markers in live assets:
  - `https://www.coodra.com/assets/dashboard-CUgqwsoI.js`
  - `https://www.coodra.com/assets/dashboard-D3vEjQI9.css`

### Tenant Isolation Fix (2026-05-07, Later)
- Investigated why AI Morning Brief / Today's Plan showed `Protect margin on Maple Syrup 250ml`.
- Finding:
  - `Maple Syrup 250ml` was not hardcoded in frontend.
  - It came from Supabase `product_performance` for `company_id = 3tvpjg-wg.myshopify.com`.
  - `michaelshahid@hotmail.com` had old `enrollments` rows pointing to that company id.
  - Backend `api/performance.js` resolved company from email enrollment, so admin login inherited demo/test POS rows.
- Security/product fix deployed:
  - `api/_lib/retailer-auth.js` now carries verified `merchant_key` and `distributor_id` from backend JWT context.
  - `api/performance.js` now resolves dashboard company data from authenticated `merchant_key` first.
  - Admin users without an explicit `company_id` no longer silently fall back to email enrollments.
  - Email/customer enrollment fallback is now gated behind `PERFORMANCE_ALLOW_EMAIL_ENROLLMENT_FALLBACK=false` by default.
- Verified production behavior:
  - Admin token with no explicit tenant returns `company_id: null`, no products, no AI recommendations.
  - Admin token with explicit `?company_id=3tvpjg-wg.myshopify.com` can still inspect the old demo tenant.
  - Retailer token with `merchant_key=uid:shopify_customer_123` resolves only that tenant and does not show Maple Syrup.
  - Retailer token with `merchant_key=3tvpjg-wg.myshopify.com` still shows the demo Maple data, proving tenant scoping is now explicit.

### Backend JS Audit / Tenant Hardening (2026-05-07)
- User asked to audit backend `.js` files for similar issues after the Maple Syrup tenant leak investigation.
- Audited deployed API/runtime JS under `C:\Users\micha\shopify\freight-pool-app\sourceole-ai-backend\api` (31 files), focusing on tenant identity, mutable headers, client-provided user/session/merchant keys, Supabase scoping, placeholder/global fallbacks, and security-sensitive randomness.
- Fixed and deployed to `https://api.coodra.com`:
  - `api/chat.js`: chat durable memory now scopes to verified `auth.merchant_key` / billing retailer key instead of client-provided `sessionId` or `userId`.
  - `api/recommend.js`: recommendations now prefer verified `auth.merchant_key`; non-admin users cannot inject `session_id`; global event fallback is disabled unless `RECOMMEND_ALLOW_GLOBAL_EVENT_FALLBACK=1`.
  - `api/reorders.js`: reorder reads now prefer verified `auth.merchant_key`; email fallback is disabled unless `REORDERS_ALLOW_EMAIL_FALLBACK=1`; missing table/data returns honest `data_unavailable`.
  - `api/performance.js`: company resolution had already been fixed; plan payload lookup is now tenant-key-first and user/email plan fallback is gated by `PERFORMANCE_ALLOW_IDENTITY_PLAN_FALLBACK=1`.
  - `api/log.js`: support ticket listing now requires auth and ignores merchant query overrides for normal retailer users; MFA 6-digit code generation now uses `crypto.randomInt` instead of `Math.random`.
  - `api/_lib/commerce-facts.js`: catalog variant upsert now uses `on_conflict=merchant_key,shopify_variant_id`.
  - `sql/phase47_catalog_variant_tenant_constraint.sql`: added/applied tenant-scoped unique constraint for catalog variants and dropped unsafe global `shopify_variant_id` unique constraint.
- Supabase migration applied and verified live:
  - `catalog_variants_merchant_shopify_variant_id_key UNIQUE (merchant_key, shopify_variant_id)` exists.
- Verification:
  - `node --check` passed for all backend `api/**/*.js` files.
  - Backend deployed via Vercel and aliased to `https://api.coodra.com`.
  - Smoke tests passed:
    - `/api/log` no auth -> 401.
    - `/api/log?merchant_key=someone-else` as retailer with `merchant_key=audit-retailer-key` returns empty scoped tickets for `audit-retailer-key`, ignoring query override.
    - `/api/performance?view=status` as admin with no tenant returns `company_id: null` and no product/demo data.
    - `/api/reorders` as retailer with no table/data returns `data_unavailable` instead of leaking email-scoped data.
- Remaining watch items:
  - `retailer-plan.js` still has legacy identity-key compatibility (`uid:` / `email:`) because `retailer_plans` currently enforces that key shape. Treat as account/profile state, not merchant commerce facts.
  - `sector_benchmarks` and `recommend.defaultOpportunities` are generic guidance/fallbacks; avoid presenting them as client-owned POS data.
  - Generated/minified website assets and vendored tool bundles were not manually patched; regenerate from source when needed.
2026-05-07 - Live dashboard deployment policy
- User clarified the new dashboard is now the live production dashboard. Moving forward, fixes should target the live site/deployments, not local dev servers, unless a local-only build check is needed.
- Deployed current dashboard header filter fixes to Vercel production for `coodra-website`, aliased to `https://www.coodra.com`.
- Deployed backend date/store filter support to Vercel production for `sourceole-ai-backend`, aliased to `https://api.coodra.com`.
- Verified live dashboard bundle `https://www.coodra.com/assets/dashboard-CkWDbi4A.js` no longer contains old `Change dashboard region filter` or `Change dashboard date range` Ask Coodra handlers, and does contain `All stores` / `Date range`.

2026-05-08 - Ask Coodra first-party guardrail pass
- User asked whether `guardian-sdk` was worth adding. Decision: skip external Guardian SDK for now; implement lightweight internal guardrails instead.
- Backend `sourceole-ai-backend/api/chat.js` now blocks prompt-injection/privacy-probing before both streaming and non-streaming LLM calls.
- Chat response sanitization now refuses suspected leaked internals/secrets such as system prompts, service-role/API key names, JWT-like tokens, and `sk-*` style keys.
- Streaming chunk sanitizer now uses the same sensitive-output guard instead of only competitor-name replacement.
- Added/updated `sourceole-ai-backend/tests/chat-router.test.mjs` regression coverage for prompt extraction refusal and leaked secret refusal.
- Verification passed:
  - `node tests/chat-router.test.mjs`
  - `node tests/chat-read-tools.test.mjs`
  - `node --check api/chat.js`
  - `npm run check:function-count`
  - `npm audit --audit-level=high`
- Deployed backend to production:
  - Deployment id: `dpl_C5HtTG9LQj6EosaTWrUQD2D3gyya`
  - Alias: `https://api.coodra.com`
- Live smoke:
  - `/api/health` returned OK.
  - Unauthenticated `/api/chat` returned 401 with security headers present.

2026-05-08 - Tenant override hardening pass
- User correctly flagged that LLM/tool access must never let one client see another client's backend data.
- Backend `sourceole-ai-backend` hardened tenant override checks across client-facing service-role routes.
- Added reusable helpers in `api/_lib/retailer-auth.js`:
  - `trustedMerchantKey(auth, fallback)`
  - `tenantOverrideError(req, auth)`
- `tenantOverrideError` blocks non-admin query/body overrides for `merchant_key`, `merchantKey`, `retailer_key`, `retailerKey`, `user_id`, `userId`, `email`, `customer_email`, and `customerEmail` unless they match the verified JWT identity.
- Wired override rejection into:
  - `api/chat.js`
  - `api/recommend.js`
  - `api/performance.js`
  - `api/reorders.js`
  - `api/retailer-plan.js`
  - `api/welcome-context.js`
  - `api/analyze-attachment.js`
  - `api/consent.js`
  - retailer chat/support/MFA paths in `api/log.js`
- Recommendation catalog hardening:
  - `fetchCatalogLookup` now requires a verified merchant key and filters both products and variants by `merchant_key`.
  - `fetchCatalogIntelRows` no longer falls back to `global:default` demo catalog rows by default. It only does so if `RECOMMEND_ALLOW_GLOBAL_CATALOG_FALLBACK=1` is explicitly enabled.
- Catalog sync hardening:
  - Legacy Shopify catalog sync now writes `merchant_key` on product/variant rows.
  - Product map reads are filtered by tenant.
  - Upserts use `on_conflict=merchant_key,shopify_product_id` and `on_conflict=merchant_key,shopify_variant_id`.
  - If no explicit `CATALOG_SYNC_MERCHANT_KEY` / `SHOPIFY_MERCHANT_KEY` exists, sync derives a scoped key from `SHOPIFY_STORE_DOMAIN` as `shopify:<domain>` instead of writing unscoped records.
- Added regression tests:
  - `tests/tenant-isolation.test.mjs`
  - `tests/recommend-tenant-scope.test.mjs`
- Verification passed:
  - `node tests/tenant-isolation.test.mjs`
  - `node tests/recommend-tenant-scope.test.mjs`
  - `node tests/chat-router.test.mjs`
  - `node tests/chat-read-tools.test.mjs`
  - `node --check` for edited API files
  - `npm run check:function-count`
  - `npm audit --audit-level=high`
- Deployed backend to production:
  - Deployment id: `dpl_2wWheCG2bPwjUfAdtiLixnvhfhVd`
  - Alias: `https://api.coodra.com`
- Live smoke:
  - `/api/health` returned 200 OK with security headers.
  - Unauthenticated `/api/chat` and `/api/recommend` returned 401 before tenant-scoped work.

2026-05-08 - Production privacy/security hardening pass
- User asked for a one-and-done backend/Supabase hardening loop so no client can access another client's data through the LLM, APIs, Supabase, or frontend identity spoofing.
- Subagent audits checked Supabase/RLS coverage, backend service-role/API routes, LLM tool paths, admin paths, and frontend identity-sending patterns.
- Backend `sourceole-ai-backend` changes:
  - `api/_lib/retailer-auth.js` tenant override detection now includes `company_id` / `companyId`.
  - `api/performance.js` no longer lets non-admin callers override `company_id`; it must resolve from verified JWT/tenant context.
  - `api/retailer-plan.js` now requires recent MFA for API-key rotation, stores an HMAC hash of the active API key, rejects old/revoked stateless keys, removes unauthenticated billing checkout fallback, requires JWT-backed admin billing/admin access, and requires explicit reason/scope for admin impersonation targets.
  - `api/_lib/chat-read-tools.js` refuses service-role read tools unless the tenant key is verified from JWT/billing/admin context and audits tool use to `retailer_action_audit`.
  - `api/chat.js` ignores client-supplied LLM provider/model hints in production; server env controls provider routing.
- Supabase:
  - Added `sourceole-ai-backend/sql/phase48_comprehensive_rls_lockdown.sql`.
  - Applied it to live Supabase.
  - Verified 32 existing tables from the lockdown list have RLS enabled and deny-all direct-client policies.
- Frontend `coodra-website` changes:
  - Backend JWT exchange no longer sends `email` in the `role_resolve` query or `x-user-email` header; the Supabase bearer token is the identity source.
  - Admin fetches no longer send `x-user-email`.
  - Dashboard chat no longer sends `userId` in the request body; backend JWT is authoritative.
- Added/updated regression tests:
  - `sourceole-ai-backend/tests/retailer-plan-security.test.mjs`
  - `sourceole-ai-backend/tests/chat-read-tools.test.mjs`
  - `sourceole-ai-backend/tests/tenant-isolation.test.mjs`
  - `sourceole-ai-backend/tests/sql-rls-coverage.test.mjs`
- Verification passed:
  - Backend `node --check` for edited API files.
  - `node tests/tenant-isolation.test.mjs`
  - `node tests/retailer-plan-security.test.mjs`
  - `node tests/sql-rls-coverage.test.mjs`
  - `node tests/recommend-tenant-scope.test.mjs`
  - `node tests/chat-router.test.mjs`
  - `node tests/chat-read-tools.test.mjs`
  - `npm run check:function-count`
  - `npm audit --audit-level=high` in backend and website.
  - `npm run build` in `coodra-website`.
- Deployed to production:
  - Backend deployment id `dpl_8PEWZVZ7dRz656oZ8bHUiPE5Mdoh`, aliased to `https://api.coodra.com`.
  - Website deployment id `dpl_31qnm5zPxo29dHPzGJbEjBaoPNtb`, aliased to `https://www.coodra.com`.
- Live smoke:
  - `/api/health` returns 200 with security headers.
  - Unauthenticated `/api/chat` returns 401.
  - Unauthenticated `billing_checkout` returns 401.
  - Invalid `/api/retailer-plan?view=api_data` API key returns 401.
  - `https://www.coodra.com/dashboard` returns 200 with CSP, HSTS, frame-deny, nosniff, COOP/CORP-style headers.

2026-05-08 - Ask Coodra professional AI layer
- User asked to make the LLM feel like a real professional with better persistent memory/RAG/tool planning, without unnecessary hardcoding.
- Decision: keep the AI stack inside the existing Node/Vercel backend rather than copying a generic separate FastAPI app layout.
- Added backend modules:
  - `api/_lib/ai-orchestrator.js`: deterministic planner that decides response intent, memory retrieval needs, and safe read-tool selection.
  - `api/_lib/tenant-rag.js`: tenant-scoped retrieval pack over existing retailer memory; refuses unverified `user:` / `session:` scoped tenants.
  - `api/_lib/response-contract.js`: professional answer contract for recommendations, metric explanations, inventory answers, and general retail answers.
  - `api/_lib/ai-trace.js`: writes orchestration traces to existing `retailer_action_audit`.
- Integrated into `api/chat.js`:
  - Adds internal orchestration plan to the system context.
  - Uses tenant-scoped RAG context from verified retailer memory.
  - Uses planner-selected tools instead of calling tool selection directly in chat route.
  - Adds a professional response contract so recommendations include action, reason, impact/confidence when available, evidence boundaries, and missing-data honesty.
  - Traces completed streaming/non-streaming orchestration to audit.
- Added tests:
  - `tests/ai-professional-layer.test.mjs`
- Verification passed:
  - `node --check api/_lib/ai-orchestrator.js api/_lib/response-contract.js api/_lib/tenant-rag.js api/_lib/ai-trace.js api/chat.js`
  - `node tests/ai-professional-layer.test.mjs`
  - `node tests/chat-router.test.mjs`
  - `node tests/chat-read-tools.test.mjs`
  - `node tests/tenant-isolation.test.mjs`
  - `node tests/retailer-plan-security.test.mjs`
  - `node tests/sql-rls-coverage.test.mjs`
  - `node tests/recommend-tenant-scope.test.mjs`
  - `npm run check:function-count`
  - `npm audit --audit-level=high`
  - Website `npm run build`
- Deployed backend to production:
  - Deployment id: `dpl_2kQoZ1Lo7Zjt5zYf9Rgnp9P8v4VA`
  - Alias: `https://api.coodra.com`
- Live smoke:
  - `/api/health` returned 200.
  - Unauthenticated `/api/chat` returned 401 with security headers.

2026-05-08 - Production pricing/plan entitlement system
- User asked to redo pricing end-to-end, not just visually: pricing page, comparison table, frontend gating, backend enforcement, upgrade blockers, billing CTAs, and old pricing bloat/language.
- Pricing strategy implemented:
  - Free `$0`, Starter `$99`, Growth `$199`, Pro `$399`, Enterprise Custom.
  - Growth is now highlighted as `Most Popular`; Starter is no longer highlighted.
  - Replaced user-facing `AI decisions / month` language with `Decision recommendations / month`.
  - Removed `No per-seat fees`, Pro unlimited product language, and market-signal wording from pricing.
  - Pro is capped at `50,000 products tracked`; Enterprise uses custom limits.
- Frontend `coodra-website` changes:
  - Added canonical typed pricing config in `src/lib/pricingPlans.ts`.
  - Updated `src/pages/PricingPage.tsx` and `src/pages/PricingPage.css` to use clean plan cards and grouped comparison table.
  - Updated pricing CTAs: Free `Start Free`, Starter `Choose Starter`, Growth `Choose Growth`, Pro `Choose Pro`, Enterprise `Talk to Sales`.
  - Added dashboard plan state to `DashboardData` and billing mapping in `src/dashboard/dashboardApi.ts`.
  - Added reusable `PlanUpgradeBlocker` in `src/dashboard/NewDashboard.tsx`.
  - Added Growth blockers for forecasting/forecast signals, Growth blocker for automation, and Enterprise handling for API access.
  - Workspace billing/settings now show current plan and live usage for decision recommendations, products tracked, team members, and POS / commerce integrations.
  - Added frontend checkout starter helper `startBillingCheckout`.
- Backend `sourceole-ai-backend` changes:
  - Rebuilt `api/_lib/plan-entitlements.js` as the canonical enforcement config with plan limits, feature flags, aliases, required-plan mapping, structured locked-feature and plan-limit errors.
  - Updated `api/_lib/billing-store.js` to enforce canonical metrics while keeping legacy aliases (`ai_decisions`, `products_analyzed`) backward-compatible.
  - Updated `/api/retailer-plan` billing and usage payloads to expose new plan config, capabilities, usage summary, and checkout route handling.
  - Updated `/api/chat` and `/api/recommend` to consume/enforce `decision_recommendations`.
  - Added server-side gating for forecast scenario and automation write actions.
  - API access remains Enterprise-only and is enforced server-side.
  - Added SQL migration file `sql/phase49_pricing_plan_entitlements_alignment.sql` for plan-code constraint, usage index, and table comments; not applied live from this environment because Supabase CLI/DB connection string was unavailable, but runtime does not require new tables.
- Added backend tests:
  - `tests/plan-entitlements.test.mjs`
  - Updated `tests/billing-store.consume-usage.test.mjs`
- Verification passed:
  - Website `npm run build`.
  - Backend `node --test tests/plan-entitlements.test.mjs tests/billing-store.consume-usage.test.mjs`.
  - Backend `node --check` for modified API files.
  - Text sweep confirmed old pricing phrases (`AI decisions`, `No per-seat`, `Unlimited products`, `Market signals`) are gone from user-facing pricing/app files.
  - Local browser snapshot confirmed live layout content: Growth highlighted, updated prices, grouped comparison table, no `AI decisions / month`.
- Deployed to production:
  - Backend deployment id `dpl_62dtQzUkjDcSuH9abPZjPxKm1ScT`, aliased to `https://api.coodra.com`.
  - Website deployment id `dpl_8XJzFGH9hgGFwo3dVX5bn5BgxfgE`, aliased to `https://www.coodra.com`.
- Live smoke:
  - `https://www.coodra.com/pricing` returned 200 and contains `Decision recommendations / month` plus `Most Popular`, and does not contain `AI decisions / month`.
  - `https://api.coodra.com/api/health` returned 200.
  - Unauthenticated `/api/retailer-plan?view=billing` returns 401.
