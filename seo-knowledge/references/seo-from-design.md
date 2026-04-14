# SEO From Day One
## Source: Noel Ceta (noelcetaSEO) — "Build SEO into design from day one"

## The Core Problem

Most designers and product teams treat SEO as a post-launch optimization. By then, the structural decisions that determine SEO performance are already baked in — and fixing them costs 10x more than building them correctly from the start.

## SEO Architecture Decisions (Pre-Development)

### URL Structure
- Clean, descriptive URLs that include target keywords: `/blog/inventory-mistakes-that-kill-margin` not `/blog/post-123`
- Shallow depth: important pages within 3 clicks of homepage
- Consistent URL pattern across content types
- Hyphens for word separation, lowercase only

### Content Architecture
- Decide content types before building: blog posts, comparison pages, docs, case studies
- Each type has a predictable URL pattern and internal link structure
- Define navigation hierarchy that prioritizes high-SEO-value pages
- Plan internal linking from the start (not afterthought)

### Schema Implementation Plan
- Decide which schema types apply to which pages BEFORE building
- FAQ schema for informational content
- Article schema for blog posts
- Organization schema site-wide
- Product/service schema for pricing page
- Implement in initial build, not retrofitted later

## Page-Level SEO Decisions (Design Phase)

### Every Page Needs Before Launch:
- [ ] Unique, descriptive title tag (50-60 characters)
- [ ] Meta description (150-160 characters, includes CTA)
- [ ] Single H1 that includes target keyword
- [ ] Heading hierarchy (H2s, H3s) that reflects content structure
- [ ] Image alt text defined for every image
- [ ] Internal links to related pages (minimum 2)
- [ ] External links to authoritative sources (minimum 1-2 for credibility)
- [ ] Clear CTA aligned with page intent
- [ ] Author and publication date visible

### Navigation SEO:
- Primary nav links to highest-SEO-value pages
- Footer contains links to important secondary pages
- Breadcrumbs implemented for deep content (blog posts, docs, case studies)
- Sitemap includes all indexable pages

## Technical SEO Decisions (Development Phase)

### Speed
- LCP target < 2.5s — design hero images appropriately sized
- No render-blocking resources in critical path
- Lazy load images below fold
- Preload critical fonts

### Rendering
- SSR (not CSR) for all public pages — Googlebot sees content in raw HTML
- For any JS-heavy sections: ensure content is accessible to Googlebot
- Test with URL Inspection tool during development

### Mobile
- Mobile-first design from the start
- Test tap targets, font sizes, content reflow
- Don't hide content on mobile that exists on desktop

## Content Decisions (Before Publishing)

### Every piece of content needs:
1. **Primary target keyword** — defined before writing begins
2. **Secondary keywords** — 2-3 related terms naturally woven in
3. **Query intent match** — is this content actually answering what people search for this keyword?
4. **Competitive analysis** — what does the current top-ranking content look like? Can you go deeper/better?
5. **Internal linking plan** — which pages will link to this content, and why?

### The Audit Before Launch Checklist
- [ ] All title/meta tags written, not default template text
- [ ] All images have descriptive alt text
- [ ] All links point to live, correct URLs
- [ ] Schema markup tested and validating
- [ ] Page tested in Google Search Console URL Inspection
- [ ] Mobile usability passed
- [ ] Core Web Vitals in good range for this page
- [ ] Sitemap updated with new URL

## For Coodra — Apply From Day One

Every new page added to the site should go through this checklist:
1. URL is clean and descriptive
2. Title/meta written for the page (not generic)
3. H1 includes the primary topic
4. Internal links to 2+ related pages
5. FAQ or structured content format where natural
6. Schema appropriate to content type
7. Author and date visible
8. Tested in URL Inspection before publish