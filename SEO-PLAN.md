# Coodra SEO Plan — Living Document

**Last updated:** 2026-04-17
**Status:** P0+P1 complete. Competitive gap analysis complete. Keyword research pending Search Console.

---

## GOAL

Rank #1 on a cluster of keywords for independent retail inventory management. Target: Netstock, Cin7, Instant.ai, and SymphonyAI. Own the "independent retailer" positioning.

---

## TARGET KEYWORDS (Primary Cluster)

TBD — pending Search Console data + competitive gap analysis

## TARGET KEYWORDS (Secondary Cluster)

TBD — pending Search Console data + competitive gap analysis

---

## EXISTING PAGES

| Route | File | SEO Status | P0 Done |
|---|---|---|---|
| `/` | `_index.tsx` | ✅ P0 complete (title standardized) | ✅ |
| `/pricing` | `pricing.tsx` | ✅ P0 complete (schema added) | ✅ |
| `/about` | `about.tsx` | ✅ P0 complete (meta + schema) | ✅ |
| `/contact` | `contact.tsx` | ✅ P0 complete (schema added) | ✅ |
| `/integrations` | `integrations.tsx` | ✅ P0 complete (title + schema) | ✅ |
| `/security` | `security.tsx` | ✅ P0 complete (title + schema) | ✅ |
| `/blog` | `blog.tsx` | audit pending | — |
| `/blog/inventory-mistakes-that-kill-margin` | blog post | ✅ P0 complete (Article schema) | ✅ |
| `/blog/pos-data-trust-guide` | blog post | ✅ P0 complete (Article schema) | ✅ |
| `/login` | `login.tsx` | ✅ P0 complete (noindex added) | ✅ |
| `/signup` | `signup.tsx` | ✅ P0 complete (noindex added) | ✅ |
| `/sitemap.xml` | `public/sitemap.xml` | ✅ P0 complete (login/signup removed) | ✅ |

## NEW PAGES TO BUILD (Priority Order)

TBD — pending keyword research. Candidate pages:

1. [ ] `/inventory-management` — broad SEO foundation
2. [ ] `/comparisons` — "Coodra vs. Netstock" competitive capture
3. [ ] `/roi-calculator` — conversion + keyword tool
4. [ ] `/how-it-works` — technical explainer
5. [ ] `/for/jewelry` — vertical hub (jewelry)
6. [ ] `/for/grocery` — vertical hub (grocery)
7. [ ] `/for/pharmacy` — vertical hub (pharmacy)
8. [ ] `/integrations/shopify` — POS-specific integration page
9. [ ] `/integrations/clover` — POS-specific integration page
10. [ ] `/integrations/lightspeed` — POS-specific integration page
11. [ ] `/integrations/square` — POS-specific integration page
12. [ ] `/resources` — guides, checklists, templates
13. [ ] `/demand-forecasting` — educational + product hybrid

---

## PHASE 1: On-Page SEO Audit — COMPLETE

**Date completed:** 2026-04-17
**Audited by:** Claude Code (initial review of meta() exports + technical files)

### What Passed ✅

| Check | Status | Notes |
|---|---|---|
| robots.txt | ✅ PASS | All major AI crawlers explicitly allowed (GPTBot, ClaudeBot, PerplexityBot, Googlebot, bingbot, CCBot, Applebot-Extended). Correct Allow: / directives. |
| Sitemap.xml | ✅ PASS | Includes all key pages (/, /pricing, /about, /contact, /integrations, /security, /case-studies, 2 case study slugs, /blog, 2 blog posts, /privacy, /terms, /login, /signup). Sitemap referenced in robots.txt. |
| Canonical tags | ✅ PASS | All pages have self-referencing canonical. |
| HTTPS | ✅ PASS | Via Vercel (enforced by default). |
| Security headers | ✅ PASS | vercel.json has X-Content-Type-Options, X-Frame-Options, HSTS, CSP, Referrer-Policy, Permissions-Policy. Tight CSP — no issues. |
| robots meta | ✅ PASS | All pages have `name: 'robots', content: 'index, follow'` |
| AI crawler access | ✅ PASS | All crawlers allowed. No accidental blocks. |

### What Needs Fixing ⚠️

#### Title tags — Issues by page

| Route | Current title | Issue | Target keyword |
|---|---|---|---|
| `/` | "Coodra - Retail Decision Intelligence" | No primary target keyword in title | "Inventory Management" or "Retail Intelligence" |
| `/pricing` | "Pricing — Coodra" | Dashes vs pipe — inconsistent, no keyword | "Inventory Management Pricing" or "Retail AI Pricing" |
| `/about` | "About - Coodra" | No target keyword | "About Coodra Retail AI" |
| `/contact` | (need to check) | — | — |
| `/integrations` | "POS Integrations - Coodra" | Dashes inconsistent, could be stronger | "Retail POS Integrations" |
| `/security` | "Security - Coodra" | No target keyword | OK as-is (trust/compliance page) |
| `/blog` | (need to check) | — | — |

**Note on title format:** Coodra uses both em dash (—) and pipe (|) across pages. Pick ONE format and use it consistently. Netstock uses pipe (`|`) — recommend pipe format.

#### Meta descriptions — Issues by page

| Route | Current | Issue |
|---|---|---|
| `/` | "Coodra tracks sales, inventory, and demand signals in real time, then recommends exactly what to reorder, replace, remove, and protect so your retail team can act faster." | Good length (156 chars). No keyword at front. Could be stronger for SERP CTR. |
| `/pricing` | "Connect POS once, then let Coodra run smarter decisions every day. Pricing that scales with your retail footprint." | 152 chars, good. No keyword. |
| `/about` | "Learn how Coodra helps retail teams turn live data into clear, measurable actions." | 106 chars — TOO SHORT. Missing value props. |
| `/integrations` | "Connect Shopify, Square, Lightspeed, and Clover to Coodra and turn live store data into clear daily retail actions." | 152 chars, good. But missing SEO keyword "POS" in description. |
| `/security` | "Review Coodra security controls, implementation status, and operational safeguards for retail decision intelligence." | 158 chars, OK. Could be stronger. |

#### Schema markup — Missing

| Page | Current | Needed |
|---|---|---|
| ALL pages | Organization schema on root only (app/root.tsx) | WebSite + Organization on all pages. Article schema on blog posts. BreadcrumbList on inner pages. |
| Blog posts | None | Article schema with headline, author, datePublished, dateModified, image |
| /integrations | None | BreadcrumbList + SoftwareApplication schema |
| /pricing | None | SoftwareApplication + Offer schema |
| /security | None | SecurityInformation schema |

#### Sitemap — Issues

- `/login` included (priority 0.3, yearly) — should be excluded from sitemap as it's a noindex page
- `/signup` included — same issue — these don't need to be in the sitemap
- Missing: `/admin`, `/dashboard` — if these are gated pages, correct to exclude
- Missing: `/blog` should have a proper `<lastmod>` reflecting the latest post date
- Blog post `<lastmod>` dates are all `2026-04-13` which may be stale

#### Other Technical Issues

- **vercel.json rewrites:** SPA rewrite `/(.*)` → `/api/index` still in place. This is for SSR routing, not SPA fallback — fine if SSR works. But if `build/SSR/outputDirectory` is used, the rewrites may conflict with the SSR build. Codex should verify this after the React Router v7 migration.
- **Missing: `/login` and `/signup` noindex** — Login/signup should have a noindex meta directive to prevent search engines from indexing auth pages.
- **Missing: breadcrumb schema** — `/about`, `/contact`, `/integrations`, `/security` should all have BreadcrumbList schema to establish site hierarchy.
- **Missing: image alt text audit** — Need to verify all `<img>` tags in route components have descriptive alt attributes. Cannot audit from meta() files alone.

---

### Page-by-Page Audit Results

#### `/` (Homepage)
- [x] Title: "Coodra - Retail Decision Intelligence" — pass (could include "inventory")
- [x] Meta description: "Coodra tracks sales, inventory, and demand signals..." — pass (good CTR copy)
- [x] Canonical: self-referencing ✓
- [x] robots: index, follow ✓
- [x] OG/Twitter: all present ✓
- [ ] H1 audit: NEED TO CHECK (in page component, not meta)
- [ ] H2 hierarchy audit: NEED TO CHECK
- [ ] Internal links: NEED TO CHECK
- [ ] Schema: NEED TO CHECK (Organization/WebSite present in root?)
- [ ] Image alt: NEED TO CHECK

#### `/pricing`
- [x] Title: "Pricing — Coodra" — pass but weak (needs keyword)
- [x] Meta description: present ✓
- [x] Canonical: self-referencing ✓
- [ ] Schema SoftwareApplication + Offer: MISSING
- [ ] H1/H2 audit: NEED TO CHECK
- [ ] Image alt: NEED TO CHECK

#### `/about`
- [x] Title: "About - Coodra" — pass but no keyword
- [x] Meta description: TOO SHORT (106 chars) — needs expanding
- [ ] Schema: MISSING (need at minimum Organization)
- [ ] H1/H2 audit: NEED TO CHECK
- [ ] Image alt: NEED TO CHECK

#### `/contact`
- [ ] Title: NEED TO CHECK
- [ ] Meta description: NEED TO CHECK
- [ ] Schema: MISSING (ContactPage schema)
- [ ] H1/H2 audit: NEED TO CHECK
- [ ] Image alt: NEED TO CHECK

#### `/integrations`
- [x] Title: "POS Integrations - Coodra" — pass but inconsistent dash
- [x] Meta: present ✓
- [ ] Schema: MISSING (BreadcrumbList + SoftwareApplication)
- [ ] H1/H2 audit: NEED TO CHECK
- [ ] Image alt: NEED TO CHECK

#### `/security`
- [x] Title: "Security - Coodra" — OK as-is (trust page)
- [x] Meta: present, 158 chars ✓
- [ ] Schema: MISSING (SecurityInformation schema)
- [ ] H1/H2 audit: NEED TO CHECK
- [ ] Image alt: NEED TO CHECK

#### `/blog`
- [ ] Title: NEED TO CHECK
- [ ] Meta description: NEED TO CHECK
- [ ] Schema: MISSING (Blog schema + Article on posts)
- [ ] H1/H2 audit: NEED TO CHECK
- [ ] Image alt: NEED TO CHECK

#### Blog posts
- [ ] Schema Article: MISSING on both posts
- [ ] Open Graph image: both use same /og-image.png — consider post-specific OG images

---

## PHASE 1 (continued): Page Component Audit — COMPLETE

**Audited by:** Claude Code (manual file read, 2026-04-17)
**Files read:** LandingPage.tsx, PricingPage.tsx, IntegrationsPage.tsx, SecurityPage.tsx, AboutPage.tsx, ContactPage.tsx

### H1 / H2 Hierarchy

| Route | H1 | H2s | Assessment |
|---|---|---|---|
| `/` | "Your store. On autopilot." | — | Tagline H1 (brand voice, not keyword-targeted). Acceptable for homepage hero. |
| `/pricing` | "Pricing that scales with your retail footprint" | — | Strong, keyword-adjacent |
| `/about` | "OPERATIONS CLARITY FOR INDEPENDENT RETAIL." | — | Keyword-rich ✓ |
| `/contact` | "Contact" | "Direct contact", "Social" | Minimal — could be stronger |
| `/integrations` | "Connect the tools you already use." | — | Descriptive ✓ |
| `/security` | "YOUR DATA. LOCKED DOWN." | "How Coodra secures daily decision workflows.", "Implementation status by control area." | Brand/positioning ✓ |
| `/blog` | (not yet audited — blog route building pending) | — | — |

### Internal Link Anchor Text

| Route | Links Found | Anchor Text Issues |
|---|---|---|
| `/` | CTA: "Start For Free", "See Integrations" | "Start For Free" — CTA generic but acceptable. "See Integrations" — descriptive ✓ |
| `/pricing` | None obvious (feature table only) | No issues ✓ |
| `/about` | Founding story image alt="", team avatar alts, sidebar links | No generic "click here" links ✓ |
| `/contact` | Sidebar: About, Contact, Integrations, Security, Privacy, Terms | All descriptive ✓ |
| `/integrations` | "Request integration", "Review security" CTAs | Descriptive ✓ |
| `/security` | "Contact Security Team", "Send Message" CTAs | Descriptive ✓ |

### Image Alt Text

| Route | Findings | Status |
|---|---|---|
| `/` | POS integration logos: `alt="${item.name} logo"` — all descriptive ✓ | ✅ PASS |
| `/about` | Founding story image: `alt=""` (decorative) ✓. Leadership avatars: proper alt ✓ | ✅ PASS |
| `/contact` | Social links have `aria-label` instead of alt — accessible ✓ | ✅ PASS |
| `/integrations` | All integration logos: `alt="${item.name} logo"` ✓ | ✅ PASS |
| `/security` | No images besides decorative elements | ✅ PASS |

### Overall Component Audit Verdict

**H1/H2:** Homepage H1 is brand tagline, not keyword-targeted. Acceptable for hero but title/meta should carry keyword weight (P1). Contact H1 is thin. All other pages have adequate H1s.

**Internal links:** No generic "click here" or "read more" links. All anchor text descriptive. ✅

**Image alt:** All meaningful images have descriptive alt. Decorative images use empty alt. ✅

---

### Priority Fixes — Status

**P0 — COMPLETED ✅ (Commit: 2899d96)**

- [x] Fix 1: noindex on /login and /signup
- [x] Fix 2: Article schema on both blog posts
- [x] Fix 3: SoftwareApplication + Offer schema on /pricing
- [x] Fix 4: BreadcrumbList on /about, /contact, /integrations, /security
- [x] Fix 5: /about meta description expanded to 150-160 chars
- [x] Fix 6: Title format standardized to pipe (|) across all pages
- [x] Fix 7: /login and /signup excluded from sitemap.xml

**P1 — Quick wins (after keyword research):**
8. [x] Add primary target keyword to homepage title — DONE (already "Retail Inventory Intelligence | Coodra")
9. [x] Add "POS" keyword to integrations title — DONE (already "POS Integrations | Coodra")
10. [x] Add "POS" keyword to integrations meta description — DONE (front-loaded: "Coodra POS integrations: connect Shopify...")
11. [x] Add "inventory management" keyword to homepage meta description — DONE (front-loaded: "Coodra inventory management tracks sales...")
12. [x] Add "inventory management" keyword to pricing title — DONE ("Retail Inventory Management Pricing | Coodra")

**P2 — Pending keyword research:**
13. Rewrite meta descriptions with target keywords from all pages
14. Build new pages with SEO keywords from scratch
15. Internal linking architecture audit
16. Backlink strategy — pending competitive analysis

---

## PHASE 2: Keyword Strategy

### Competitive Gap Analysis — COMPLETE

**Research date:** 2026-04-17
**Method:** WebFetch of competitor homepages, blogs, and key SEO pages

---

#### Competitor Overview

| Competitor | Tagline | Primary Positioning | Blog | Key SEO Pages |
|---|---|---|---|---|
| **Netstock** | "Supply and demand planning made smarter with AI" | SMBs, 90-day ROI, ERP integrations | 35+ posts (8 pages) | /compare/, /roi-calculator/, /inventory-health-quiz/, /tariffs/, /s&op/ |
| **Cin7** | "Say goodbye to inventory chaos" | All-in-one, multi-channel, 700+ integrations | 13 posts visible | /compare/, industry pages (7 verticals), /roi-calculator/ |
| **Instant.ai** | Unknown (site is minimal/invisible) | Unknown | None | Minimal web presence |
| **SymphonyAI** | "AI that knows your business" | Enterprise, vertical AI, retail/CPG | Minimal | /retail-cpg/, /glossary/, resource hub |

---

#### What Each Competitor Does Well

**Netstock (strongest content game):**
- 35+ blog posts indexed — topics cover ERP integrations, demand forecasting, SMB scaling, tariff impacts, safety stock, manufacturing
- Lead magnets: 6-day Inventory Crash Course, Inventory Health Quiz, ROI Calculator
- Competitive comparison page (/compare/)
- Tariff impact resource hub (timed to 2025-2026 trade climate)
- Podcast ("Reorder Point Podcast")
- S&OP (Sales & Operations Planning) dedicated page
- Heavy use of "inventory optimization", "demand planning", "excess inventory", "stock-outs" keywords

**Cin7:**
- Blog with 13+ posts — recent: "Best Omnichannel Inventory Management Software: 2026 Comparison Guide", AI demand planning, inventory reporting
- Industry vertical pages: Food & Beverage, Fashion, Health & Beauty, Manufacturing, Retail, Sporting Goods, Wholesale
- Competitive comparison page (/compare/)
- ROI Calculator
- Heavy use of "inventory management software", "multi-channel", "real-time visibility"

**SymphonyAI:**
- Glossary page (/glossary/) — SEO gold for long-tail AI/retail terms
- Resource hub with analyst reports, white papers, case studies
- Vertical industry pages with strong AI positioning
- Enterprise-focused metrics (85% fewer false positives, 50% reduction in downtime)
- NOT an SMB player — retail page targets enterprise merchandising/supply chain teams

**Instant.ai:**
- Effectively invisible. Site appears to be placeholder or in stealth mode. Not a content competitor.

---

#### Content Gaps Coodra Can Own

These are areas where no competitor has a strong, dedicated page:

| Gap | Why It Matters | Competitor Status |
|---|---|---|
| **"No ERP needed" angle** | Independent retailers (jewelry, pet, pharmacy, grocery) rarely have ERP — this is Coodra's core differentiator | None of the four competitors addresses this directly |
| **Independent retailer voice** | Netstock/Cin7/SymphonyAI all speak to enterprise or mid-market; no one owns "the independent retailer" | Wide open |
| **Voice of small retail** | Blog written from the perspective of a small retail team, not a supply chain expert | None — all competitor blogs are written for operations managers |
| **Tariff impact for small retail** | Netstock has a tariff hub but for SMBs — small retail angle doesn't exist | Netstock's is enterprise/Mid-market focused |
| **Vertical hubs: jewelry, grocery, pharmacy, pet supply** | Cin7 has 7 industry pages but none are small-ticket, high-margin verticals like jewelry or specialty retail | Wide open — only Cin7 has industry pages at all |
| **POS-native positioning** | Coodra connects directly to Shopify, Square, Lightspeed, Clover — positioning as "POS-first, not ERP-first" | Not owned by any competitor |
| **Retailer memory / entity tracking** | Unique AI capability of remembering each retailer's context across conversations | Not addressed by any competitor |
| **Pricing transparency** | Coodra already has a pricing page — Netstock and Cin7 hide pricing; advantage if Coodra is upfront | Opportunity to be the transparent option |

---

#### Pages Coodra Has That Competitors Don't

| Coodra Page | Competitor Equivalent? |
|---|---|
| `/security` (security controls + trust) | None — all competitors lack a dedicated security page |
| `/integrations` | All competitors have integrations pages, but Coodra's is clean and POS-focused |
| Pricing page (transparent) | Netstock and Cin7 hide pricing behind demo requests |

---

#### Pages Competitors Have That Coodra Doesn't

| Page | Competitor | SEO Value |
|---|---|---|
| `/compare` (competitive comparison) | Netstock, Cin7 | High — captures "vs" searches ("Coodra vs Netstock") |
| `/roi-calculator` | Netstock, Cin7 | High — intent to buy, shareable results |
| `/inventory-health-quiz` | Netstock only | Medium — lead gen + SEO |
| `/tariffs` resource hub | Netstock only | Timely, high search volume |
| `/s&op` (Sales & Operations Planning) | Netstock | Medium — captures operations keywords |
| `/glossary` | SymphonyAI only | High — long-tail, topical authority |
| Vertical industry pages | Cin7 (7), SymphonyAI | High — "inventory management for [industry]" |
| Blog with 35+ posts | Netstock | Massive — without content, Coodra is invisible to informational queries |
| Podcast | Netstock | Medium — brand building |

---

#### Blog Topic Gap (Immediate Opportunity)

Netstock's 35 posts and Cin7's 13 posts represent topics Coodra can out-rank by publishing **better, more independent-retailer-focused content** on the same themes:

**High-value topics no competitor owns with an independent retailer lens:**
1. "Inventory management for jewelry stores" / "for pet shops" / "for pharmacies" / "for grocery"
2. "Demand forecasting without an ERP" (Coodra's exact differentiator)
3. "5 inventory mistakes independent retailers make" (Coodra blog post #1)
4. "How to read POS data to make better buying decisions" (retailer-first, not ops-manager-first)
5. "Signs your store has too much dead inventory"
6. "The independent retailer's guide to stock-to-sales ratio"
7. "How jewelry retailers can reduce overstock without cutting variety"
8. "Grocery inventory management without a POS-integrated system"
9. "Small pharmacy: how to manage expiration dates and overstock"
10. "The real cost of not knowing your turn rate"

**Long-tail "how do I..." queries competitors ignore:**
- "How to reduce inventory without reducing selection"
- "What is a good stock turn rate for independent retail"
- "How to use Shopify data to order smarter"
- "Signs you need inventory management software"
- "How to calculate reorder points without Excel"
- "Independent retail: when to mark down vs hold inventory"

---

#### Instant.ai Verdict

Instant.ai has essentially no web presence beyond a single word on their homepage. They are **not a content competitor**. They may be operating via direct sales, partner channels, or are in early/stealth mode. Do not allocate SEO resources against Instant.ai content strategy — monitor annually.

---

#### Recommended Immediate Actions from Gap Analysis

1. **Publish blog post 1** ("5 inventory mistakes that kill margin") — begin competing for informational queries
2. **Publish blog post 2** ("Demand Forecasting Without an ERP") — capture the "no ERP needed" searches
3. **Build `/inventory-management`** — broad SEO foundation page (nets both "inventory management software" and "inventory management for retail" queries)
4. **Build `/how-it-works`** — technical explainer; captures "how does Coodra work" queries
5. **Build vertical hub `/for/[vertical]`** — start with jewelry or pet supply (high-margin, underserved)
6. **Build `/comparisons`** — capture "Coodra vs Netstock" and "Coodra vs Cin7" searches
7. **Build `/roi-calculator`** — high-intent, shareable, drives demo conversions

---

### Keyword Map

TBD — pending Search Console data + Search Console query analysis

### Competitive Backlink Gap

Netstock and Cin7 both have substantial backlink profiles (industry press, integration partner links, review sites). SymphonyAI has enterprise analyst coverage (Gartner, Forrester). TBD — requires backlink audit tool.

### Competitive Gap Analysis

TBD — pending keyword research

### Keyword Map

TBD — pending keyword research

---

## PHASE 3: Off-Site SEO + Backlink Strategy

TBD — pending keyword research + backlink audit

### Backlink Targets

TBD

### Outreach Plan

TBD

---

## TECHNICAL SEO CHECKLIST

- [x] robots.txt — ✅ AI crawlers all allowed (GPTBot, ClaudeBot, PerplexityBot, Googlebot, bingbot, CCBot, Applebot-Extended)
- [x] XML sitemap — ✅ Exists at /sitemap.xml, referenced in robots.txt
- [x] `sitemap.xml` — ✅ Includes all main pages, blog, case studies
  - [ ] Exclude `/login` and `/signup` (add noindex instead)
  - [ ] Blog `<lastmod>` may be stale (check)
- [x] `robots.txt` — ✅ No accidental disallows on important paths
- [ ] Schema markup — ⚠️ PARTIAL
  - [ ] Organization: in app/root.tsx (need to verify)
  - [ ] WebSite: need to verify
  - [ ] Article on blog posts: MISSING — add
  - [ ] SoftwareApplication + Offer on /pricing: MISSING — add
  - [ ] BreadcrumbList on inner pages: MISSING — add
  - [ ] SecurityInformation on /security: optional but recommended
  - [ ] ContactPage on /contact: optional
- [ ] Core Web Vitals — ⏳ pending Search Console data
- [ ] Mobile usability — ⏳ pending Search Console data
- [x] HTTPS — ✅ Enforced via Vercel
- [x] Canonical tags — ✅ Self-referencing on all pages
- [ ] Security headers — ⚠️ vercel.json has CSP — tight and correct, but verify no blocking
  - [ ] Verify Google Tag Manager and Google Analytics domains are in CSP

---

## CONTENT CADENCE

TBD — pending keyword research

### Blog Post Ideas (from MEMORY.md)
1. "5 inventory mistakes that kill margin" + infographic (DRAFT)
2. "Demand Forecasting Without an ERP" + comparison diagram (DRAFT)
3. Additional posts TBD based on keyword research

---

## MEASUREMENT

TBD

---

## NOTES

- Competitors: Netstock, Cin7, Instant.ai, SymphonyAI
- NOT competitors: Shopify, Square, Lightspeed (data sources only)
- Geographic target: TBD (pending clarification from Michael)
- Primary offer: TBD (pending clarification from Michael)
- Pricing range: TBD (pending clarification from Michael)
- Content budget: TBD (pending clarification from Michael)
- Content writer: TBD (pending clarification from Michael)

---

*Last audit run: 2026-04-17*
*Search Console: waiting (up to 1 day from setup)*
