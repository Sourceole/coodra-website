# Dashboard Integrations End-to-End Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the authenticated Coodra dashboard use the live Coodra backend cleanly, with usable integration actions, honest metric/data states, and no dead-feeling dashboard controls.

**Architecture:** The website remains the UI shell hosted by `coodra-website` and talks to `https://api.coodra.com`. The Coodra backend remains the integration/data authority, with Supabase and provider secrets staying server-side. Frontend changes should be limited to dashboard API/UI behavior; backend changes should reuse existing `/api/performance` and `/api/retailer-plan` views.

**Tech Stack:** React Router/Vite/TypeScript frontend, Coodra Vercel serverless Node backend, Supabase, Vercel production deployments.

---

### Task 1: Backend Integration Completeness

**Files:**
- Modify if needed: `C:\Users\micha\shopify\freight-pool-app\sourceole-ai-backend\api\performance.js`
- Modify if needed: `C:\Users\micha\shopify\freight-pool-app\sourceole-ai-backend\vercel.json`

- [ ] **Step 1: Inspect existing integration routes**
  Confirm `/api/integrations/start`, `/api/integrations/callback`, `/api/performance/connections`, `/api/performance/status`, and `/api/performance/sync` are present and protected correctly.

- [ ] **Step 2: Verify provider behavior**
  Confirm each supported provider has one of: real OAuth launch, pending/manual setup path, or honest missing-config response. Do not add fake provider success.

- [ ] **Step 3: Patch only real gaps**
  Reuse existing handlers for `disconnect`, `set_primary`, and `connect_pending`. Do not duplicate connection state logic.

- [ ] **Step 4: Check backend syntax**
  Run: `node --check api\performance.js`
  Expected: passes with no syntax errors.

### Task 2: Website Dashboard Integration Actions

**Files:**
- Modify: `C:\Users\micha\shopify\coodra-website\src\dashboard\dashboardApi.ts`
- Modify: `C:\Users\micha\shopify\coodra-website\src\dashboard\NewDashboard.tsx`
- Modify if needed: `C:\Users\micha\shopify\coodra-website\src\dashboard\NewDashboard.css`

- [ ] **Step 1: Add backend connection action API helpers**
  Add typed helpers for `/api/performance/connections` actions: `disconnect`, `set_primary`, and `connect_pending` if needed.

- [ ] **Step 2: Wire integration card buttons**
  Connect buttons should launch OAuth/setup URL. Connected integrations should disconnect through backend, refresh dashboard data, and show a cohesive notice.

- [ ] **Step 3: Handle OAuth return state**
  If the dashboard returns with success/error query parameters, show an honest notice and refresh data.

- [ ] **Step 4: Keep UI cohesive**
  Preserve current integration card layout and logo treatment. Do not add placeholder metrics.

### Task 3: Dashboard Clickability and Redirect Audit

**Files:**
- Inspect primarily: `C:\Users\micha\shopify\coodra-website\src\dashboard\NewDashboard.tsx`
- Inspect primarily: `C:\Users\micha\shopify\coodra-website\src\dashboard\dashboardData.ts`
- Modify only if a specific dead control has a clear destination/action.

- [ ] **Step 1: Inventory clickable dashboard controls**
  List controls that are wired, controls that open details, controls that navigate, and controls that are inert.

- [ ] **Step 2: Recommend exact wiring**
  Map each inert control to one of: existing dashboard page, details drawer, Ask Coodra, mailto/help action, download/report action, or disabled/hidden state.

- [ ] **Step 3: Patch high-confidence dead controls**
  Only patch controls with obvious product behavior. Avoid inventing backend APIs.

### Task 4: Vercel and Environment Readiness

**Files/Systems:**
- Inspect Vercel project env names for `coodra-website` and `sourceole-ai-backend`.
- Inspect CSP and backend CORS allowlists.

- [ ] **Step 1: Confirm project ownership**
  Confirm `coodra-website` hosts `https://www.coodra.com` and `sourceole-ai-backend` hosts `https://api.coodra.com`.

- [ ] **Step 2: Confirm env separation**
  Website should only have frontend-safe envs. Backend should have Supabase service role, backend JWT secret, and provider secrets. Do not print secrets.

- [ ] **Step 3: Confirm security boundaries**
  CSP should allow `https://api.coodra.com`; backend CORS should allow the website origin. Service-role keys must not be exposed to the frontend.

### Task 5: Verification and Preview

**Files/Commands:**
- Website command: `npm run build`
- Backend command: `node --check api\performance.js`
- Preview restart: restart `vite preview` on `http://127.0.0.1:4173`

- [ ] **Step 1: Run backend syntax checks**
- [ ] **Step 2: Run website build**
- [ ] **Step 3: Restart preview after build**
- [ ] **Step 4: Smoke test `/dashboard` locally**
- [ ] **Step 5: Smoke test protected backend endpoints without exposing tokens**
