# Dashboard Production Hardening Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the authenticated Coodra dashboard production-ready by wiring every visible button to a real tenant-safe action, persisted setting, detail flow, or explicit disabled state.

**Architecture:** Reuse the existing `sourceole-ai-backend` `/api/retailer-plan` and `/api/performance` handlers as the source of truth. Store decision writes, dismissal reasons, PO actions, profile/settings changes, API access, MFA, billing/report actions, and audit logs through existing tenant-scoped backend services. The website dashboard should call typed API helpers and refresh live data after mutations.

**Tech Stack:** React/TypeScript/Vite dashboard, Coodra Vercel Node serverless backend, Supabase/PostgREST, billing metadata for account/profile state, browser-use for in-app UI smoke tests.

---

### Task 1: Backend Write Surface Audit and Gaps

**Files:**
- Inspect: `C:\Users\micha\shopify\freight-pool-app\sourceole-ai-backend\api\retailer-plan.js`
- Modify if needed: `C:\Users\micha\shopify\freight-pool-app\sourceole-ai-backend\api\retailer-plan.js`

- [ ] Confirm existing handlers for:
  - `merchant_decision_status`
  - `po_create_draft`
  - `po_update_status`
  - `account_profile_status`
  - `account_profile_update`
  - `mfa_security_status`
  - `mfa_security_update`
  - `api_access_status`
  - `api_access_rotate_key`
  - `team_members`
  - `team_member_add`
  - `team_member_remove`
  - `billing_portal`
  - `export_performance_csv`
  - `export_decisions_csv`
  - `generate_report_csv`
- [ ] Add only missing backend fields needed for profile image/settings persistence.
- [ ] Ensure every write is authenticated, tenant-scoped, input-limited, and audit logged when material.
- [ ] Run `node --check api\retailer-plan.js`.

### Task 2: Frontend API Helpers

**Files:**
- Modify: `C:\Users\micha\shopify\coodra-website\src\dashboard\dashboardApi.ts`
- Modify if needed: `C:\Users\micha\shopify\coodra-website\src\dashboard\dashboardTypes.ts`

- [ ] Add typed helpers for retailer-plan POST actions.
- [ ] Add typed helpers for account profile get/update, decision status, PO create/update, report exports, billing portal, API key rotation, MFA update, and team invite/remove.
- [ ] Use backend JWT only; do not expose service-role or tenant ids in the client.

### Task 3: Decision and PO Actions

**Files:**
- Modify: `C:\Users\micha\shopify\coodra-website\src\dashboard\NewDashboard.tsx`
- Modify if needed: `C:\Users\micha\shopify\coodra-website\src\dashboard\NewDashboard.css`

- [ ] Wire Review/Approve buttons to `merchant_decision_status`.
- [ ] Wire Dismiss buttons to a reason picker/default reason and `merchant_decision_status`.
- [ ] Refresh dashboard data after mutation.
- [ ] Wire Create PO and PO status buttons to existing PO endpoints when possible.
- [ ] Show success/error notices rather than silently failing.

### Task 4: Settings and Profile Persistence

**Files:**
- Modify: `C:\Users\micha\shopify\coodra-website\src\dashboard\NewDashboard.tsx`
- Modify: `C:\Users\micha\shopify\coodra-website\src\dashboard\NewDashboard.css`
- Modify if needed: `C:\Users\micha\shopify\freight-pool-app\sourceole-ai-backend\api\retailer-plan.js`

- [ ] Load account profile status from backend.
- [ ] Allow profile editing: business name, contact email, and profile image.
- [ ] Persist settings toggles/select values through backend metadata if backend support exists, otherwise add a lean metadata field.
- [ ] Wire billing, team, API, MFA/security, notification, and danger-zone controls to backend or explicit confirmation/disabled states.

### Task 5: Button-by-Button QA

**Files:**
- Create if useful: `C:\Users\micha\shopify\coodra-website\docs\dashboard-button-smoke-results.md`

- [ ] Build and restart preview after build.
- [ ] Use browser-use in-app browser to navigate the dashboard.
- [ ] Click every visible dashboard button one by one across:
  - Command Center
  - Decisions
  - Merchandise
  - Operations
  - Intelligence
  - Integrations
  - Workspace
  - Settings
  - Help
  - Ask Coodra
  - Notifications
  - Profile menu
- [ ] Record actual result and fix any broken controls.
- [ ] Only deploy after checks pass.
