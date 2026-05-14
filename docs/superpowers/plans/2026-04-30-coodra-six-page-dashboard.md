# Coodra Six-Page Dashboard Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the new six-page Coodra dashboard shell behind the existing authenticated `/dashboard` route, preserving backend infrastructure and avoiding risky rewrites.

**Architecture:** Replace the old injected HTML dashboard with a native React dashboard shell composed of focused components, local fallback data, and a narrow API adapter that can be wired to the existing backend views. Keep backend changes separate unless a data gap blocks real functionality.

**Tech Stack:** React 18, React Router 7, TypeScript, CSS modules/plain CSS, Supabase auth bootstrap, existing api.coodra.com backend.

---

### Task 1: Shell And Design Tokens

**Files:**
- Create: `src/dashboard/dashboardTypes.ts`
- Create: `src/dashboard/dashboardData.ts`
- Create: `src/dashboard/NewDashboard.tsx`
- Create: `src/dashboard/NewDashboard.css`
- Modify: `src/pages/Dashboard.tsx`
- Asset: `public/images/coodra-dashboard-logo.png`

- [ ] Copy the approved Coodra logo into public assets.
- [ ] Create shared dashboard TypeScript types for pages, metrics, decisions, rows, and integration state.
- [ ] Create local fallback/demo data shaped like the real API contracts.
- [ ] Build the app shell with left nav, utility links, real authenticated boot user, and Ask Coodra drawer.
- [ ] Add CSS tokens matching the document: light mode, white cards, sparse teal, soft borders, responsive layout.
- [ ] Replace the old injected dashboard boot in `Dashboard.tsx` with the new React shell while preserving auth/JWT bootstrap.

### Task 2: Six Static Pages

**Files:**
- Modify: `src/dashboard/NewDashboard.tsx`
- Modify: `src/dashboard/NewDashboard.css`

- [ ] Implement Command Center modules matching `command center.png`.
- [ ] Implement Decisions modules matching `decisions.png`, with merchant decision approve/dismiss actions only where appropriate.
- [ ] Implement Merchandise modules matching `merchandise.png`.
- [ ] Implement Operations modules matching `operations.png`.
- [ ] Implement Intelligence modules matching `intelligence.png`.
- [ ] Implement Workspace modules matching `workspace.png`.
- [ ] Ensure no permanent right rail and drawer only opens on demand.

### Task 3: API Adapter

**Files:**
- Create: `src/dashboard/dashboardApi.ts`
- Modify: `src/dashboard/NewDashboard.tsx`

- [ ] Read backend JWT from boot/session storage.
- [ ] Fetch existing backend views: performance status, retailer-plan merchant decisions, sku roles, price recommendations, supplier scorecards, promotion recommendations, catalog tasks, billing/team/usage/integrations.
- [ ] Normalize real responses into the six page data model.
- [ ] Use fallback data only for empty/error development states, never as silent production truth.
- [ ] Add visible loading and error states.

### Task 4: Verification

**Files:**
- Existing project scripts.

- [ ] Run TypeScript/build.
- [ ] Fix all type errors.
- [ ] Inspect in browser at desktop and mobile widths.
- [ ] Validate auth redirect behavior.
- [ ] Validate old generated template files are no longer required before deleting later.
