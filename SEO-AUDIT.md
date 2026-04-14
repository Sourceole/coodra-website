# SEO Audit — coodra.com
April 13, 2026

---

## Overall SEO Score: 72/100

| Category | Score | Status |
|---|---|---|
| Crawlability | 95/100 | Excellent |
| Indexability | 80/100 | Good |
| Security | 100/100 | Excellent |
| URL Structure | 90/100 | Excellent |
| Mobile | 90/100 | Good |
| Core Web Vitals | 78/100 | Good |
| Structured Data | 0/100 | Critical Gap |
| JS Rendering / SSR | 95/100 | Excellent |
| On-Page SEO | 50/100 | Needs Work |
| Content Quality | 65/100 | Moderate |

**Overall: 72/100** — Solid foundation with critical structured data gap.

---

## Category Breakdown

### Crawlability: 95/100 — Excellent

**robots.txt:**
- All major AI crawlers allowed: GPTBot, Googlebot, ClaudeBot, PerplexityBot, Bingbot, CCBot, Amazonbot, FacebookBot, Applebot-Extended
- All AI crawlers for training and indexing allowed — critical for GEO/AI citation
- Sitemap referenced correctly: `Sitemap: https://www.coodra.com/sitemap.xml`
- No blocking directives

**Sitemap:**
- XML sitemap present at `/sitemap.xml`
- All key pages included: /, /pricing, /about, /contact, /integrations, /security
- Blog posts included with lastmod dates
- Blog index page included
- `/compare` returns 404 — not yet built (expected, see Phase C)

**Crawl depth:** All important pages within 2 clicks of homepage. Excellent architecture.

**AI crawler access:** Best-in-class. All crawlers allowed. No blocking directives.

### Indexability: 80/100 — Good

**Canonical tags:**
- Blog index: canonical `/blog` — correct
- Blog post: canonical self-referencing — correct
- Integrations: canonical self-referencing — correct
- Homepage: **MISSING canonical tag** — should be `href="https://www.coodra.com/"`
- Pricing, login, signup: canonical tags should be verified

**Duplicate content:** No obvious duplicates detected. URL structure is clean.

**Thin content risk areas:**
- `/about` — 4 principle tiles + contact email. Minimal content. Could be thin for SEO but acceptable for a company page.
- `/contact` — contact form + email. Similar. Low risk for a contact page.

**Index bloat:** None detected. No unnecessary pages in sitemap.

### Security: 100/100 — Excellent

All security headers present and correctly configured:
- `Content-Security-Policy`: comprehensive, `unsafe-inline` present for React Router (necessary)
- `Strict-Transport-Security`: `max-age=31536000; includeSubDomains; preload` — excellent
- `X-Content-Type-Options`: `nosniff` — correct
- `X-Frame-Options`: `SAMEORIGIN` — correct
- `Referrer-Policy`: `strict-origin-when-cross-origin` — correct
- HTTPS enforced: yes
- Mixed content: none detected

**Note:** `unsafe-inline` in CSP is required for React Router SSR hydration. This is acceptable and documented.

### URL Structure: 90/100 — Excellent

- Clean, descriptive URLs: `/blog/inventory-mistakes-that-kill-margin` — well structured
- Hyphenated word separation: consistent
- Lowercase: consistent
- No parameters in public-facing URLs
- Shallow depth: all pages within 2 clicks

**Minor:** `/blog` and `/blog/` — verify trailing slash consistency if any redirects occur.

### Mobile: 90/100 — Good

- `viewport` meta tag: present
- Responsive design: appears correctly implemented based on CSS system (fluid containers, clamp values)
- Font sizes: using rem units throughout CSS, scales appropriately
- Mobile nav: appears functional from CSS (no hamburger visible in HTML — would need live testing)

**Cannot fully verify without live mobile testing.** Recommend manual test on iOS Safari and Android Chrome.

### Core Web Vitals: 78/100 — Good (estimated)

- TTFB: 150ms on homepage — excellent (< 200ms target)
- No CrUX data available without API access — score estimated based on TTFB and page complexity

**Likely ranges (estimated):**
- LCP: ~1.5-2.5s (TTFB is fast, but hero content/composition needs verifying)
- INP: Cannot estimate without field data
- CLS: CSS system uses explicit dimensions — low risk

**Recommended:** Run PageSpeed Insights on key pages with real CrUX data. Labs data insufficient for field performance.

### Structured Data: 0/100 — Critical Gap

**No JSON-LD structured data on any page.** This is the single biggest SEO gap on the site.

**Missing on homepage:**
- Organization schema (name, URL, logo, sameAs social links)
- WebSite schema with search action
- No Article or FAQ schema

**Missing on blog posts:**
- Article schema with: headline, author, datePublished, dateModified, image, publisher
- No author schema (author is "Michael Shahid (CEO)" but not machine-readable)
- No image schema for featured image

**Missing on integrations:**
- FAQPage schema would be appropriate
- SoftwareApplication schema could apply

**Missing site-wide:**
- Organization schema on homepage
- BreadcrumbList on blog posts and case study pages

**Impact:** No rich snippets, no Article rich results in Google, no author rich results, no breadcrumb rich results. AI Overviews may still cite pages but without structured data the content is harder for AI to attribute correctly.

### JS Rendering / SSR: 95/100 — Excellent

- SSR confirmed working: homepage content appears in raw HTML (curl output shows Retail Decision Intelligence, h1, nav links)
- Content visible in initial HTML response — no JavaScript required to see page content
- React Router SSR properly configured
- Meta tags (title, description, canonical) present in initial HTML

**This is a major competitive advantage.** CSR sites show empty divs to AI crawlers. Coodra shows full content.

### On-Page SEO: 50/100 — Needs Work

**Title tags:**
- Homepage: "Coodra — Retail Decision Intelligence" — good
- Blog index: "Blog - Coodra" — generic, should be more descriptive
- Blog post: "5 inventory mistakes that kill margin... - Coodra Blog" — good
- Integrations: "POS Integrations - Coodra" — good

**Meta descriptions:**
- All key pages have unique, descriptive meta descriptions — excellent

**Heading structure:**
- Homepage H1: "Your store, on autopilot." — strong, on-brand
- Blog post: H1 present, but **no H2 subheadings** within article body. The 5 mistake sections have callout blocks but no `<h2>` tags. This hurts SEO readability and content scanning.
- Internal heading hierarchy: needs to be verified per-page

**Image alt text:**
- Blog post image: `alt="Five inventory management mistakes..."` — good, descriptive
- Other images: needs site-wide audit

**Internal links:**
- Homepage: good distribution of internal links to /blog, /integrations, /pricing, /about, /contact, /security, /case-studies
- Blog post: 3 links to /integrations, 3 to /pricing, 1 to /signup — excellent internal linking

### Content Quality: 65/100 — Moderate

**Strengths:**
- Blog posts are 750-780 words — appropriate length for informational articles
- Author attribution: "Michael Shahid (CEO)" visible — good E-E-A-T signal
- Publication dates visible: "April 13, 2026"
- Content is specific and actionable (inventory mistakes with concrete examples)
- Internal links embedded naturally within content

**Gaps:**
- No FAQ section on blog posts — FAQ schema can't be fully utilized without FAQ content
- Blog post headings: no `<h2>` tags for the 5 mistake sections — content is paragraphs only
- No external links to authoritative sources (e.g., linking to retail industry data, research)
- No "last updated" date shown on blog posts (only "published" date)
- About page content: minimal (4 principle tiles + email). Acceptable but not rich.

---

## Critical Issues (Fix Immediately)

### 1. Structured Data — Add JSON-LD to All Pages
**Priority: Critical**

Add to homepage:
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Coodra",
  "url": "https://www.coodra.com",
  "logo": "https://www.coodra.com/images/coodra-logo.png",
  "sameAs": [
    "https://twitter.com/coodra",
    "https://linkedin.com/company/coodra"
  ]
}
```

Add to blog posts:
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "5 inventory mistakes that kill margin...",
  "author": {
    "@type": "Person",
    "name": "Michael Shahid",
    "jobTitle": "CEO",
    "url": "https://www.coodra.com/about"
  },
  "datePublished": "2026-04-13",
  "dateModified": "2026-04-13",
  "image": "https://www.coodra.com/images/blog/inventory-mistakes-infographic.webp",
  "publisher": {
    "@type": "Organization",
    "name": "Coodra",
    "logo": { "@type": "ImageObject", "url": "https://www.coodra.com/images/coodra-logo.png" }
  }
}
```

Add to blog index:
```json
{
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Coodra Blog",
  "url": "https://www.coodra.com/blog",
  "description": "Retail decision intelligence articles..."
}
```

### 2. Blog Post Heading Structure — Add H2 Tags
**Priority: High**

The 5 mistake sections need `<h2>` tags, not just callout boxes. Change from:
```
<div class="callout">Mistake 1: Reordering the same quantities...</div>
```
To:
```
<h2>Mistake 1: Reordering the Same Quantities Every Cycle</h2>
<p>...</p>
```

Each mistake section should have a descriptive H2. This is critical for SEO readability.

### 3. Homepage Missing Canonical Tag
**Priority: High**

Add `<link rel="canonical" href="https://www.coodra.com/">` to homepage `<head>`.

---

## High Priority (Fix Within 1 Week)

### 4. Blog Index Title Tag
Change "Blog - Coodra" to "Retail Intelligence Blog — Coodra" or similar with keyword.

### 5. External Links from Blog Posts
Add 1-2 external links to authoritative retail/inventory sources per blog post. Builds credibility signal.

### 6. "Last Updated" Date on Blog Posts
Add last modified date alongside published date for time-sensitive content.

### 7. FAQ Section on Blog Posts
Consider adding a FAQ section to each blog post. Enables FAQ schema, improves AI Overview inclusion probability.

---

## Medium Priority (Fix Within 1 Month)

### 8. Breadcrumb Schema on Blog Posts
Add BreadcrumbList schema for blog post pages:
`Home > Blog > [Article Title]`

### 9. About Page Content Depth
Consider expanding with founding story paragraph, team section (team section exists per Codex, verify it's rich).

### 10. Core Web Vitals — Get Real Data
Set up PageSpeed Insights API access to get actual CrUX field data for LCP/INP/CLS on key pages.

### 11. Sitemap — Add blog posts
Verify all blog post slugs are in sitemap (2 posts currently).

### 12. Image Explicit Dimensions
Verify all images have explicit `width` and `height` attributes to prevent CLS.

---

## Low Priority (Backlog)

### 13. Compare Page — Build it
`/compare` returns 404. Phase C priority.

### 14. Schema on Integrations Page
FAQPage schema for the integration Q&A section.

### 15. Organization Social Links
Add `sameAs` to Organization schema with actual Twitter/LinkedIn URLs.

### 16. Open Graph Image
Verify og:image is set on homepage and all social share images are present.

---

## Quick Wins Summary

| Fix | Effort | Impact |
|---|---|---|
| Add Organization schema to homepage | 15 min | High |
| Add Article schema to blog posts | 30 min | High |
| Add H2 tags to blog mistake sections | 20 min | High |
| Add canonical to homepage | 2 min | Medium |
| Add FAQ section to blog posts | 30 min | Medium |
| External links from blog posts | 15 min | Medium |

---

## What's Already Excellent

- AI crawler access: all crawlers allowed — best possible for GEO
- Security headers: comprehensive, HSTS preloaded
- SSR: full content in raw HTML, major competitive advantage
- URL structure: clean, descriptive, hyphenated throughout
- Meta descriptions: all key pages have unique, descriptive copy
- Internal linking: strong distribution on homepage and blog posts
- Author attribution: Michael Shahid (CEO) visible on articles
- Blog post images: alt text present, lazy loaded, 200 status
- robots.txt: valid, sitemap referenced, no blocking issues
- TTFB: 150ms — excellent server response