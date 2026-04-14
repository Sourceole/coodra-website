# Page Expansion Plan v4.1 -- coodra.com
## Brand-System-First Execution Plan -- Updated April 2026

---

## Status: Implemented Items (Production Verification Pending)

These items are built but need smoke-test confirmation in production before being marked fully done.

| Item | Status | Verification |
|---|---|---|
| Hero canvas deferred init (LCP fix) | Implemented in repo | Smoke test: LCP < 2,500ms on PageSpeed Insights |
| Organization + WebSite JSON-LD | Implemented in root.tsx | Smoke test: see verification commands in Phase 0.1 |

---

## Brand System

Coodra's design system. All pages consume these tokens. Intentional exceptions must be documented in-page spec.

### Color Palette (Immutable)

```
--brand-primary:     #2fd7c6  (teal -- the differentiator)
--brand-dark:        #0a1a31  (deep navy -- headings, contrast sections)
--bg-base:           #f4f8ff  (warm white -- page background)
--bg-surface:        #ffffff  (cards, containers)
--bg-dark:           #0a1a31  (dark sections for contrast)
--text-primary:      #0a1a31  (headings, body)
--text-muted:        #506786  (secondary text)
--brand-accent:      #7aece0  (hover states, lighter teal)
--border:            rgba(65, 179, 174, 0.2)
--border-hairline:   rgba(10, 26, 49, 0.08)   (inner card border)
```

### Typography Scale

```
Hero H1:       clamp(3.5rem, 8vw, 6rem),  Bebas Neue,   teal,  tracking: -0.02em
Page H2:       2rem,                        Nunito Bold,   navy,  tracking: -0.02em
Section H3:    1.25rem,                    Nunito Bold,   navy,  tracking: -0.01em
Eyebrow:       0.75rem,                    Inter Bold,    teal,  tracking: 0.08em, uppercase
Body:          1rem / 1.75,               Nunito Regular
Stats/numbers:  3rem,                       Inter Bold
Buttons:       0.875rem,                   Inter Bold
```

**Font policy:** Bebas Neue for display headings (H1), Nunito for body and navigation text. Inter is approved as an optional small-UI exception only (eyebrow labels, stats/numbers, buttons). Do not use Inter for body copy or section headings. If Inter is not explicitly loaded, use Nunito/system fallback for those small UI elements.

**Note:** Confirm global heading `letter-spacing: -0.02em` is a CSS token. If applied per-component only, promote to a global CSS variable and validate across all pages during Phase 0.

### Surface Variants

All standard UI surfaces must use these variants. Intentional exceptions must be documented in-page spec.

| Variant | When to use | Recipe |
|---|---|---|
| `surface-card` | Cards, panels | `background: var(--bg-surface)`, `border-radius: 16px`, `box-shadow: inset 0 0 0 1px var(--border-hairline)` |
| `surface-glass` | Nav overlays, modals, dropdowns | `background: rgba(255,255,255,0.85)`, `backdrop-filter: blur(12px)`, `border-radius: 16px` |
| `surface-contrast` | Dark sections, CTA strips | `background: var(--bg-dark)`, `color: white` |

### Motion Presets

All presets must support reduced-motion fallback behavior. Motion values are canonical regardless of implementation method chosen in Phase 0.

| Preset name | Behavior | Values |
|---|---|---|
| `fadeUp` | Section enters viewport | `opacity: 0->1, y: 50->0, 600ms, ease [0.72, 0, 0.12, 1]` |
| `staggerCards` | Grid items enter viewport | `staggerChildren: 100ms, each item opacity 0->1, y: 20->0, 500ms` |
| `hoverLift` | Card or button hover | `translateY(-4px), 200ms, ease [0.72, 0, 0.12, 1]` |
| `pressFeedback` | Button press | `scale: 0.98, 200ms, ease [0.72, 0, 0.12, 1]` |
| `arrowSlide` | CTA arrow on hover | `x: '-150%'->'0%', opacity: 0->1, 300ms, ease [0.72, 0, 0.12, 1]` |
| `springSnappy` | Modals, popovers | `type: spring, stiffness: 500, damping: 25` |
| `springSoft` | Dropdowns, tooltips | `type: spring, stiffness: 300, damping: 30` |
| `logoMarquee` | Logo rail | `animation: 20s linear infinite, pauses on hover` |

**Easing curves (define once, reference everywhere):**
```css
--ease-primary:  cubic-bezier(0.72, 0, 0.12, 1);   /* standard -- use most places */
--ease-out:      cubic-bezier(0.12, 1, 0.72, 1);   /* exits */
--ease-back:     cubic-bezier(0.12, 1.4, 0.72, 1); /* slight overshoot on pop-in */
--ease-soft:     cubic-bezier(0.24, 0.01, 0.36, 1); /* gentle, friendly */
```

**Reduced motion (global -- all presets must degrade gracefully):**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 200ms !important;
  }
}
```

### Interaction States

Every interactive element follows these states:

```
Default  ->  Hover  ->  Active/Pressed  ->  Focus-visible
```

**Buttons:**
- Default: `background: #1aab9f`, `border-radius: 999px`, `padding: 0.68rem 1.2rem`
- Hover: `translateY(-2px)`, `box-shadow: 0 8px 24px rgba(46,211,183,0.3)`
- Active: `scale: 0.98`, `translateY(0)`
- Focus-visible: `outline: 2px solid var(--brand-primary)`, `outline-offset: 2px`

**Links:**
- Default: `color: var(--text-primary)`
- Hover: `color: var(--brand-primary)`
- Transition: `200ms var(--ease-primary)`

**Cards:**
- Default: `surface-card` recipe
- Hover: `hoverLift` preset + teal border hint: `box-shadow: inset 0 0 0 1px rgba(46,211,183,0.3), 0 8px 24px rgba(15,26,49,0.08)`
- Transition: `200ms var(--ease-primary)`

---

## Navigation Patterns

| Variant | When |
|---|---|
| `nav-desktop` | Sticky top, teal gradient or glass background, pill CTAs right-aligned |
| `nav-mobile` | Hamburger -> full-screen overlay with accordion sections, "Start Free" CTA at bottom |
| `nav-mega` | Desktop only: dropdown panels with multi-column links + visual, backdrop blur |

Initial pages use `nav-desktop`. Mega-menu is a Phase 2 addition.

---

## Page Adoption Matrix

Which SurfaceVariant and MotionPreset each live page uses.

| Page | Surfaces | Motion Presets | Notes |
|---|---|---|---|
| `/` (homepage) | card, glass, contrast | fadeUp, staggerCards, hoverLift, logoMarquee | Hero canvas stays; verify defer |
| `/pricing` | card, glass | fadeUp, staggerCards, hoverLift | Add pricing calculator (Phase 3) |
| `/login` | glass | fadeUp | No change needed |
| `/signup` | glass | fadeUp | No change needed |
| `/integrations` | card, glass | fadeUp, staggerCards | Phase 2 |
| `/security` | card, contrast | fadeUp, staggerCards, hoverLift | Phase 2 |
| `/about` | card, glass | fadeUp, staggerCards | Phase 2 |
| `/contact` | card, glass | fadeUp, staggerCards | Phase 2 |
| `/case-studies` | card | fadeUp, staggerCards | Phase 3 |
| `/case-studies/:slug` | card, glass | fadeUp | Phase 3 |
| `/compare` | card, glass, contrast | fadeUp, staggerCards, pressFeedback | Phase 3 -- tab interface |
| `/blog` | card | fadeUp, staggerCards | Phase 3 |
| `/blog/:slug` | card, glass | fadeUp, staggerCards | Phase 3 |
| `/demo` | card, glass | fadeUp, staggerCards | Phase 4 |
| `/docs` | card, glass | fadeUp | Phase 4 |

---

## Performance + SEO Gates

Every page must pass these before shipping. These are non-negotiable.

| Gate | Target | Tool |
|---|---|---|
| LCP | < 2,500ms | PageSpeed Insights |
| CLS | < 0.1 | PageSpeed Insights |
| INP | < 200ms | PageSpeed Insights |
| SSR | All content in raw HTML (verify with `curl`) | Manual |
| JSON-LD | Present in raw HTML, validates at validator.schema.org | Manual |
| Canonical | Every indexable route must output self-referencing `<link rel="canonical">` in raw HTML. Current baseline: per-route canonical tags (including homepage/index). Optional future enhancement: add a root-level default with per-route overrides. | Manual |
| Meta description | Present and non-generic per route | Manual |
| GA4 event | `page_view` fires on route load | GA4 DebugView |

---

## Phase 0: System Spec + Verification (Week 0)

**Goal:** Define the brand system in code, verify what's already built.

### 0.1 Verify implemented items in production

- [ ] JSON-LD:
  - Windows: `curl.exe -s https://www.coodra.com | findstr schema.org`
  - Unix/macOS: `curl -s https://www.coodra.com | grep schema.org`
  - Should return Organization + WebSite JSON-LD blocks
- [ ] Hero defer: open https://www.coodra.com in PageSpeed Insights, check LCP < 2,500ms
- [ ] If either fails, file a bug. Do not proceed until both pass.

### 0.2 Confirm typography tracking

- [ ] Check if `letter-spacing: -0.02em` on H1/H2 is a CSS variable or per-component
- [ ] If not global, promote to CSS variable on `:root`
- [ ] Verify across homepage, pricing, about, integrations pages

### 0.3 Choose motion implementation path

**Chosen default: CSS/JS motion (current stack).** MotionPreset values are canonical regardless of implementation. Reevaluate Framer Motion on a page-by-page basis if CSS/JS motion proves insufficient for a specific animation need.

- [ ] Document chosen implementation approach in repo (comment in CSS file or motion.ts module)
- [ ] Ensure all animation values in current CSS match MotionPreset table exactly

### 0.4 Build SurfaceVariant CSS recipes

- [ ] Add `surface-card`, `surface-glass`, `surface-contrast` as CSS classes or CSS variables in `:root`
- [ ] Verify all existing pages use only these three surface types -- intentional exceptions documented in-page
- [ ] Known issue to fix during Phase 1: decision section card visual artifact/clipping at specific transforms/viewports -- already with Codex

### 0.5 Define NavPattern structure

- [ ] `nav-desktop` component with glass background, sticky behavior, right-aligned CTAs
- [ ] `nav-mobile` component with hamburger -> overlay
- [ ] `nav-mega` designed (not built) for Phase 2

**Phase 0 Definition of Done:**
- [ ] Production smoke tests (JSON-LD, LCP) pass
- [ ] Typography tracking confirmed global
- [ ] Motion implementation approach documented
- [ ] SurfaceVariant CSS recipes in `:root` or as classes
- [ ] NavPattern components scoped
- [ ] Design QA snapshot of current homepage (desktop + mobile) as baseline

---

## Phase 1: Homepage Polish + Navigation IA (Weeks 1-3)

**Goal:** The homepage and nav set the standard. Every other page follows.

### 1.1 Navigation pass

- Align desktop nav to `nav-desktop` pattern
- Ensure mobile nav is `nav-mobile` with full-screen overlay
- Verify "Start Free" + "Book a demo" CTAs at all breakpoints
- Verify hamburger menu opens/closes smoothly (no layout shift)

### 1.2 Homepage surface audit

- [ ] Every card uses `surface-card` recipe
- [ ] Dark sections use `surface-contrast`
- [ ] Nav/modal overlays use `surface-glass`
- [ ] Remove any shadow values that don't match the surface recipes
- [ ] Fix decision section card visual artifact/clipping -- already with Codex

### 1.3 Homepage motion audit

- [ ] Apply `fadeUp` to all content sections
- [ ] Apply `staggerCards` to feature grids and testimonial cards
- [ ] Add `logoMarquee` to any logo rail (if customer logos exist -- confirm consent first)
- [ ] All hover states use `hoverLift`
- [ ] All buttons use `pressFeedback` on active
- [ ] Verify `prefers-reduced-motion` collapses all animations

### 1.4 Homepage performance verification

- [ ] LCP < 2,500ms (hero canvas deferred)
- [ ] CLS < 0.1 (explicit width/height on all images)
- [ ] GA4 `page_view` fires on load

### 1.5 Homepage SEO verification

- [ ] Canonical + meta description in raw HTML (homepage + each indexable route)
- [ ] H1 is descriptive and non-generic
- [ ] Internal links have meaningful anchor text

**Phase 1 Definition of Done:**
- [ ] Nav works at all breakpoints (1440, 1280, 1024, 768, 390)
- [ ] Design QA snapshot: homepage desktop + mobile (no clipping, no shadow collisions)
- [ ] All Performance + SEO gates pass independently
- [ ] Card artifact issue confirmed resolved or tracked as open Known Issue

---

## Phase 2: Trust Core Pages (Weeks 4-7)

**Goal:** Integrations, Security, About, Contact all match the Phase 1 standard.

Each page in this phase:
- Uses only the three SurfaceVariant recipes (exceptions documented)
- Uses MotionPreset animations from the system
- Has per-route `meta()` with canonical, title, description
- Fires GA4 `page_view` on load
- Passes Performance + SEO gates

### A1. Integrations (`/integrations`)
- Hero: fadeUp
- Card grid per POS: staggerCards, hoverLift
- Surface: card + glass

### A2. Security (`/security`)
- Hero: fadeUp on dark contrast section
- Claims table: staggerCards on rows
- Surface: card + contrast

### A3. About Page Upgrade
- Team section: staggerCards on cards
- Surface: card + glass
- Photo avatars: confirm consent before using real photos

### A4. Contact Page Upgrade
- Form section: fadeUp
- Surface: card + glass

### Nav mega-menu (new)
- Desktop: `nav-mega` with multi-column dropdown
- Mobile: `nav-mobile` (accordion)
- Built after all Phase 2 pages are live and stable

**Phase 2 Definition of Done:**
- [ ] All 4 pages pass Performance + SEO gates independently
- [ ] Design QA snapshot: each page desktop + mobile before phase sign-off
- [ ] Mega-menu works on desktop (hover) and mobile (accordion)
- [ ] GA4 `page_view` confirmed firing on each new route

---

## Phase 3: Content + Comparison (Weeks 8-13)

### B1. Case Studies System
- Template: `/case-studies` + `/case-studies/:slug`
- Surfaces: card
- Motion: fadeUp, staggerCards
- Data: anonymized until explicit consent obtained
- GA4: `page_view` + `case_study_read`

### B2. Homepage Testimonials Upgrade
- Customer logo row: logoMarquee (CSS animation, 20s linear)
- Testimonial cards: staggerCards
- Animated counter on stats
- Consent required before displaying any retailer name/logo

### B3. Comparison Page (`/compare`)
- Tab interface: pressFeedback on tab switch
- Tab indicator: CSS slide (left + width transition, 300ms)
- Surface: card + contrast
- Legal review required before publishing

### B4. Pricing Calculator
- Inline addition to `/pricing`
- fadeUp on calculator section
- Live output on input change
- GA4: `cta_click "Start Free"` from calculator

### C1. Blog System
- `/blog` + `/blog/:slug` routes
- Surfaces: card + glass
- Motion: fadeUp, staggerCards
- FAQ section: staggerCards on FAQ items
- Reading time, author byline, category tags
- GA4: `page_view`, `blog_article_read`

### C2. Blog Content (2 articles)
1. `/blog/inventory-mistakes-that-kill-margin`
2. `/blog/pos-data-trust-guide`
- Founder voice for E-E-A-T signal
- Infographic for article 1
- Comparison diagram for article 2

**Phase 3 Definition of Done:**
- [ ] All Phase 3 routes pass Performance + SEO gates
- [ ] Design QA snapshot: Compare page desktop + mobile
- [ ] Legal review confirmed for comparison page claims
- [ ] Consent confirmed before any retailer name/logo in testimonials or marquee

---

## Phase 4: Demo + Docs (Weeks 14-18)

Only after Phase 3 pages are live and stable.

### D1. Demo Page (`/demo`)
- Surface: card + glass
- Motion: fadeUp, staggerCards
- Video: poster frame, no autoplay
- GA4: `page_view /demo`

### D2. Docs / Help Center (`/docs`)
- Surface: card + glass
- Motion: fadeUp
- Sidebar with category headers
- 5 initial articles
- Search
- GA4: `docs_article_view`

**Phase 4 Definition of Done:**
- [ ] Demo page and Docs pass all gates
- [ ] Design QA snapshot: demo page + docs desktop + mobile
- [ ] Full site coverage complete

---

## What NOT to Change

- The teal color system (#2fd7c6) -- the differentiator, keep it everywhere
- "Your store. On autopilot." tagline -- owns it
- SSR implementation -- core competitive advantage, do not break it
- Security headers -- excellent posture
- The hero canvas radar animation -- genuinely impressive, keep it (defer is already in place)
- Route structure -- SSR pattern is solid
- Bebas Neue for display headings, Nunito for body -- keep, do not replace with a different typeface for these uses
- Inter for small UI elements (eyebrow, stats, buttons) -- optional exception; do not require loading Inter if Nunito/system fallback is used
- 2-script footprint -- do not add heavy animation libraries

---

## Success Metrics

| Phase | Goal |
|---|---|
| Phase 0 | Design system in code, production smoke tests pass |
| Phase 1 | Homepage passes all Performance + SEO gates; nav works at all breakpoints |
| Phase 2 | 4 pages live; each passes gates independently |
| Phase 3 | Blog + Compare + Case Studies live; organic search impressions begin |
| Phase 4 | Demo + Docs live; full site coverage complete |

---

## Known Issues

| Issue | Owner | Status |
|---|---|---|
| Decision section card visual artifact/clipping at specific transforms/viewports | Codex | In progress -- do not close |
| Customer logos for marquee (consent needed) | Michael | Pending |
| Testimonial/case study consent | Michael | Pending |
| Security compliance status for claims table | Michael | Pending |
| Demo video asset | Michael | Pending |
