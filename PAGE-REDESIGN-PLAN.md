# Coodra Website Redesign Plan v2
**Date:** April 15, 2026
**Prepared for:** Coodra.com
**Status:** Rewrite complete, ready for phased execution

## Non-Negotiables
1. Do not redesign or structurally change the landing page route `/`.
2. Do not redesign header or footer visual style from landing page; reuse them exactly on every non-home page.
3. Keep Coodra brand colors from landing page:
- Teal `#2fd7c6`
- Navy `#0a1a31`
- Muted `#506786`
- White `#ffffff`
- Surface `#f8fafc`
4. Every non-home page must feel premium and animated.
5. Every non-home page must have a distinct layout language, not card clones.

---

## Competitor Research Summary (via MCP browser + AIDesigner MCP account)

### What was reviewed
- `symphonyai.com`: home, resources, about, contact-us, security-trust
- `invent.ai`: home, planning, resources, case-study, about-us, get-in-touch, security-compliance

### Implementation stack signals observed
- SymphonyAI appears to be WordPress + heavy custom CSS modules + JS interactions (not React/Framer-first).
- invent.ai appears HubSpot/theme-driven + carousel modules + utility scripts (not React/Framer-first).
- Conclusion for Coodra: do not copy their stack. Copy page strategy and visual hierarchy in React/CSS.

### What they do better than us right now
1. Strong page role differentiation (each page has a clear purpose).
2. Rich proof architecture (outcomes, case studies, metrics blocks).
3. Better resource ecosystem (filters, formats, editorial rhythm).
4. Better trust packaging (security and compliance presented as product quality, not legal text).
5. Better conversion sequencing (soft trust CTA -> hard CTA).

### Where Coodra should stay different
1. Keep cleaner and lighter visual system than both competitors.
2. Keep faster scanability and fewer overloaded sections.
3. Keep small-team confidence tone instead of enterprise jargon overload.

---

## Root Cause of "Everything Looks The Same"
Current plans reuse a repeated pattern:
- Eyebrow + H1 + subhead
- White cards on pale background
- Same hover lift and same spacing rhythm

That creates consistency but kills page identity.

### Fix
Assign each route a **unique page archetype** with unique:
- layout grid behavior
- section sequencing
- animation language
- background behavior
- proof block style

---

## Global Brand System (Keep Shared)
Use globally everywhere for consistency, while layout and motion differ by page.

### Typography
- Display: `Bebas Neue`
- UI and navigation: `Inter`
- Body and long-form: `Nunito`

### Tokens
```css
--coodra-teal: #2fd7c6;
--coodra-navy: #0a1a31;
--coodra-muted: #506786;
--coodra-white: #ffffff;
--coodra-surface: #f8fafc;
--coodra-border: rgba(10, 26, 49, 0.08);
--coodra-shadow-sm: 0 4px 16px rgba(10, 26, 49, 0.06);
--coodra-shadow-md: 0 10px 30px rgba(10, 26, 49, 0.10);
--coodra-shadow-teal: 0 12px 32px rgba(47, 215, 198, 0.16);
```

### Motion baseline
- Respect `prefers-reduced-motion`.
- Use transform/opacity first, avoid layout-jank animations.
- Mobile keeps same animation logic, with reduced distance and duration.

---

## Required Shared Layout Contract (All Non-Home Pages)
1. `MarketingHeader` from landing page used unchanged.
2. `MarketingFooter` from landing page used unchanged.
3. Non-home page top spacing aligned to landing-page header behavior.
4. Page container width defaults to `max-width: 1280px` with responsive paddings.

---

## New IA to Compete Better (Pages to Add)
These are the highest-value additions to match competitor depth.

1. `/platform`
- Purpose: Product architecture and AI decisioning core.
- Why: Symphony and invent both have central platform pages.

2. `/solutions`
- Purpose: Role/use-case gateway (owners, operators, planners).
- Why: Competitor solution hubs are strong discovery engines.

3. `/customers`
- Purpose: Proof hub with logos, outcomes, references.
- Why: Competitors heavily leverage customer proof pages.

4. `/whitepapers`
- Purpose: Long-form authority content.
- Why: Critical for trust + SEO + enterprise perception.

5. `/events`
- Purpose: Upcoming webinars/events + recordings.
- Why: Competitor resource engines include events heavily.

6. `/status` (lightweight)
- Purpose: Reliability trust signal and incident transparency.
- Why: Helps enterprise confidence.

---

## Page Archetypes (Mandatory Distinction Matrix)

### A. Analytical Control Room
- Dense but clean; data-panels and signal flows.
- Use for: `/integrations`, `/security`, `/platform`.

### B. Editorial Storytelling
- Big narrative blocks, image-led rhythm, fewer UI cards.
- Use for: `/about`, `/blog/:slug`, `/case-studies/:slug`.

### C. Marketplace Library
- Filter rails, format chips, content cards with media-first hierarchy.
- Use for: `/resources`, `/blog`, `/whitepapers`, `/events`.

### D. Commercial Compare
- Pricing and comparison-first with calculators and table tooling.
- Use for: `/pricing`.

### E. Conversion Concierge
- Form-first trust path with reassurance and process transparency.
- Use for: `/contact`, `/signup`, `/login`.

### F. Proof Mosaic
- Outcome tiles, logos, quote blocks, metric ribbons.
- Use for: `/case-studies`, `/customers`.

No page may use the exact same section order as another archetype.

---

## Execution Order (Revised)
Do one page at a time, deploy, user verifies, then continue.

1. `/case-studies/:slug` (finish proof journey after case-study index)
2. `/about`
3. `/integrations`
4. `/security`
5. `/contact`
6. `/login` + `/signup` + `/reset-password` + `/verify-email`
7. `/blog`
8. `/blog/:slug`
9. `/platform` (new)
10. `/solutions` (new)
11. `/customers` (new)
12. `/whitepapers` (new)
13. `/events` (new)
14. `/status` (new)
15. Legal polish (`/privacy`, `/terms`) only

---

## Page-by-Page Detailed Specs

## 1) `/case-studies/:slug` - Editorial Story + Performance Sidebar
### Visual intent
Look like an investor-grade story page, not a basic blog post.

### Structure
1. Hero ribbon with industry chip, client category, one-line KPI summary.
2. Main split layout:
- Left: challenge -> intervention -> outcome narrative.
- Right sticky rail: quick facts, KPI snapshots, CTA.
3. Results strip with 3 animated counters.
4. Pull-quote module with large typographic quote.
5. Related stories rail.

### Motion
- KPI counters animate on enter.
- Sticky rail chips slide in staggered.
- Quote block fades with slight blur-to-sharp transition.

### Distinction rule
No generic card grid as main layout.

---

## 2) `/about` - Brand Manifesto + Timeline
### Visual intent
Company story page, cinematic and human, not feature list.

### Structure
1. Manifesto hero with oversized type and subtle kinetic background.
2. Timeline section (year milestones with alternating left-right layout).
3. Principles section with icon-led statements.
4. Team section using portrait panels (not small cards).
5. Final recruitment/partnership CTA band.

### Motion
- Timeline nodes animate line-draw on scroll.
- Portrait panels scale from 0.96 -> 1 with fade.
- Background grain/parallax subtly shifts on pointer movement desktop only.

### Distinction rule
Avoid comparison tables and dense dashboards here.

---

## 3) `/integrations` - Analytical Control Room
### Visual intent
Operations map that shows data flowing into Coodra.

### Structure
1. Hero with integration value proposition and trust badges.
2. Live connector canvas (animated lines between platform nodes).
3. Integration directory grouped by category (POS, ERP, BI, messaging).
4. "From signal to action" process lane (step conveyor style).
5. Implementation CTA with technical doc link.

### Motion
- Connector lines animate with pulse direction.
- Nodes float microscopically with easing.
- Process lane auto-advances when in viewport.

### Distinction rule
No testimonial-heavy storytelling in this page core.

---

## 4) `/security` - Trust Center Architecture
### Visual intent
Audit-ready and controlled. Minimal decoration, maximum confidence.

### Structure
1. Trust hero with certifications and uptime summary.
2. Security pillars in asymmetrical grid (governance, data, app, infra).
3. Controls matrix (access, encryption, monitoring, incident response).
4. Compliance timeline and downloadable artifacts.
5. Contact security team CTA.

### Motion
- Pillars reveal with masked upward clip.
- Matrix row highlight on hover with subtle left accent sweep.
- Compliance badges use slow glow pulse.

### Distinction rule
No playful floating UI elements.

---

## 5) `/contact` - Conversion Concierge
### Visual intent
High-trust intake flow, less marketing noise.

### Structure
1. Hero with clear response-time promise.
2. Two-column body:
- Left: guided form
- Right: what happens next (3 steps) + office/contact meta
3. FAQ mini-accordion for pre-sales objections.
4. Optional scheduler block.

### Motion
- Field focus glow and label micro-motion.
- Submit success state with progress confirmation animation.
- Right column steps stagger in once form enters viewport.

### Distinction rule
No giant card mosaics; form is primary.

---

## 6) Auth Group (`/login`, `/signup`, `/reset-password`, `/verify-email`) - Conversion Concierge Lite
### Visual intent
Product-like authentication shell, visually coherent but lighter than marketing pages.

### Structure
1. Split layout desktop:
- Left brand panel with moving gradient mesh.
- Right auth panel.
2. Unified components for all auth routes.
3. Inline trust/support links.

### Motion
- Left mesh slow drift.
- Form transitions slide/fade between states.
- Validation feedback with non-jarring motion.

### Distinction rule
No heavy section stacking; single-screen focus.

---

## 7) `/blog` - Marketplace Library (Magazine)
### Visual intent
Editorial feed with clear hierarchy (featured + standard cards).

### Structure
1. Hero intro.
2. Featured article block (large media + excerpt).
3. Category tabs/chips.
4. Masonry-like post grid.
5. Newsletter inline CTA.

### Motion
- Card media zoom on hover.
- Category switch uses content fade+slide.
- Read-progress indicator appears while scrolling listing.

### Distinction rule
Not the same visual as case studies index; blog is more editorial and text-forward.

---

## 8) `/blog/:slug` - Editorial Storytelling
### Visual intent
Premium reading experience.

### Structure
1. Article hero with title, author, date, reading time.
2. Main content column with sticky TOC on desktop.
3. Inline callouts, quotes, and stat blocks.
4. End-of-article conversion block.

### Motion
- TOC active marker follows scroll.
- Inline media reveal with directional fade.
- Header reading progress bar.

### Distinction rule
No dashboard-style modules in article body.

---

## 9) `/platform` (new) - Analytical Control Room
### Visual intent
Show Coodra core engine architecture and explainability.

### Structure
1. Platform hero.
2. Architecture map (data ingestion -> model layer -> decision layer -> actions).
3. Explainability section with rationale examples.
4. Reliability/performance metrics.
5. CTA to integrations + security.

### Motion
- Architecture paths animate sequence when visible.
- Layer cards reveal from depth (z-like transform).

---

## 10) `/solutions` (new) - Multi-Persona Selector
### Visual intent
Route users to relevant solution bundles.

### Structure
1. Hero with role selector chips.
2. Role-specific panels (owner, operator, planner).
3. Problem -> action -> outcome sequences.
4. Final cross-role proof ribbon.

### Motion
- Chip switches crossfade content containers.
- Outcome numbers count up.

### Distinction rule
Not a clone of platform page; this is persona narrative.

---

## 11) `/customers` (new) - Proof Mosaic
### Visual intent
Proof-centric with outcomes first.

### Structure
1. Hero + logo cloud.
2. Outcome matrix (revenue, margin, stock health, time saved).
3. Customer spotlight strips.
4. Quote carousel.
5. CTA to case studies.

### Motion
- Logos float minimally.
- Outcome tiles animate value and sparkline.
- Carousel uses subtle momentum transitions.

---

## 12) `/whitepapers` (new) - Marketplace Library (Expert)
### Visual intent
Research-grade resource page.

### Structure
1. Hero.
2. Featured whitepaper.
3. Faceted filters (topic, role, format).
4. Resource grid + pagination.
5. Download gate CTA.

### Motion
- Filter chip state transitions.
- Card hover emphasis on title and icon.

---

## 13) `/events` (new) - Marketplace Library (Temporal)
### Visual intent
Upcoming and past event timeline.

### Structure
1. Hero.
2. Upcoming events row.
3. On-demand recordings grid.
4. Event categories.
5. Speaker CTA.

### Motion
- Date badges animate in sequence.
- Event card hover reveals secondary metadata.

---

## 14) `/status` (new) - Trust Utility
### Visual intent
Minimal utility page, high clarity.

### Structure
1. Current status hero (all systems operational or incident).
2. Components table.
3. Incident history list.
4. Subscribe to updates.

### Motion
- Very subtle only (status pulse).

### Distinction rule
Utility-first; no marketing flourish.

---

## 15) Legal Polish (`/privacy`, `/terms`) - Minor Only
1. Keep legal document structure.
2. Ensure body font is Nunito for readability.
3. Confirm mobile sidebar behavior.
4. Footer copyright year set to 2026.

---

## Design Differentiation Guardrails (Must Pass Before Sign-Off)
For each page, validate all 6 checks:
1. Unique archetype assigned.
2. Unique section order not matching another page.
3. Unique primary motion behavior.
4. Unique hero composition.
5. Unique proof module type.
6. Still uses shared header/footer and brand tokens.

If any check fails, page must be revised before deployment.

---

## Animation Catalog by Archetype
Use these presets so animation style is consistent inside archetype but distinct across archetypes.

### Editorial Storytelling
- `storyReveal`: opacity 0->1, y 28->0, duration 820ms, ease cubic-bezier(0.16,1,0.3,1)
- `lineDraw`: stroke-dashoffset animation for timeline/connectors

### Analytical Control Room
- `signalPulse`: scale 1->1.05->1, opacity 0.45->0.8->0.45
- `pathFlow`: background-position shift for connector lines

### Marketplace Library
- `cardLift`: translateY(-4px), shadow deepen
- `filterSwap`: opacity and x transition for filtered content

### Commercial Compare
- `tierFocus`: active tier slight scale and glow
- `tableSweep`: row hover accent bar expand

### Conversion Concierge
- `fieldFocus`: border and glow pulse on focus
- `successConfirm`: checkmark scale and fade-in

### Proof Mosaic
- `metricCount`: animated numbers with easing
- `logoDrift`: subpixel drift over 8-12s

---

## Build Rules
1. CSS in page-specific files only.
2. No structural inline styles.
3. Reusable motion helpers in shared utility CSS/hooks.
4. Mobile must preserve behavior and not disable core interactions.
5. No new heavy animation libs unless current stack cannot deliver needed effects.

---

## Route-to-File Map (Current + New)

### Existing pages (redesign allowed)
- `/pricing` -> `src/pages/PricingPage.tsx` + `PricingPage.css`
- `/resources` -> `src/pages/ResourcesPage.tsx` + `ResourcesPage.css`
- `/case-studies` -> `src/pages/CaseStudiesIndexPage.tsx` + `CaseStudiesIndexPage.css`
- `/case-studies/:slug` -> `src/pages/CaseStudyDetailPage.tsx` + new dedicated css
- `/about` -> `src/pages/AboutPage.tsx` + new dedicated css
- `/contact` -> `src/pages/ContactPage.tsx` + dedicated css split from ExpansionPages.css
- `/integrations` -> `src/pages/IntegrationsPage.tsx` + dedicated css split
- `/security` -> `src/pages/SecurityPage.tsx` + dedicated css split
- `/blog` -> `src/pages/BlogIndexPage.tsx` + `BlogPages.css`
- `/blog/:slug` -> `src/pages/BlogPostPage.tsx` + `BlogPages.css`
- `/login` `/signup` `/reset-password` `/verify-email` -> auth page css files
- `/privacy` `/terms` -> `LegalPages.css`

### New pages to add
- `/platform` -> `src/pages/PlatformPage.tsx` + `PlatformPage.css`
- `/solutions` -> `src/pages/SolutionsPage.tsx` + `SolutionsPage.css`
- `/customers` -> `src/pages/CustomersPage.tsx` + `CustomersPage.css`
- `/whitepapers` -> `src/pages/WhitepapersPage.tsx` + `WhitepapersPage.css`
- `/events` -> `src/pages/EventsPage.tsx` + `EventsPage.css`
- `/status` -> `src/pages/StatusPage.tsx` + `StatusPage.css`

---

## QA Checklist Per Page (Required)
1. Header exactly matches landing page.
2. Footer exactly matches landing page.
3. No overlap/z-index bugs on desktop or mobile.
4. Motion feels smooth at 60fps class interactions.
5. Visual identity is clearly different from previous completed page.
6. Spacing between sections is intentional and balanced.
7. CTA hierarchy is clear.

---

## Immediate Next Step
Proceed with next page in order: `/case-studies/:slug` using the "Editorial Story + Performance Sidebar" archetype.

