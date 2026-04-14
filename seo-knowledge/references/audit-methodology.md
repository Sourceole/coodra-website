# SEO Audit Methodology
## Source: Daniel Foley Carter (@foley_seo) — Comprehensive 20+ category audit framework

## Phase 1: Google Search Console Foundation

### Data Segmentation
- Segment by brand vs non-brand traffic
- Segment by folder: product/category/service/blog
- Compare last 3 months YoY (not MoM — seasonal variance)
- Identify click gaps: queries with impressions but no clicks
- Find decaying pages: losing impressions over time
- Identify AI Overview appearances and CTR patterns

### Click Gap Analysis
Find queries where:
- High impressions + low clicks = ranking but not compelling snippet
- Opportunity to improve title/meta/Content to earn clicks
- Also: queries you DON'T rank for but should

---

## Phase 2: Website Crawl

### Crawl Configuration
- Full site crawl with JavaScript rendering
- Segment by priority (top pages by traffic, mid-tier, low/zero traffic)
- Include GSC data merged into crawl output
- Separate crawl with GA4 integration

### Key Crawl Checks
- **Rendering validation** — does JS-rendered content match static HTML?
- **Canonical chains** — do all canonicals point to the right place?
- **Internal link consistency** — are all internal links returning 200?
- **HTTP headers** — proper handling of 3xx/4xx/5xx
- **URL parameters** — are dynamic URLs handled correctly?
- **Pagination** — are paginated sequences handled properly?

### JS Functionality Review
- CSR vs SSR — what's Googlebot actually seeing?
- Button/event handlers — do interactive elements work?
- Dynamic content — is content loaded correctly post-render?

---

## Phase 3: Content Audit

### Per-URL Analysis
For every significant page, assess:

**Performance vs. consumption:**
- Word count ÷ average time on page = content consumption rate
- Low consumption rate with high word count = content quality problem OR too long
- Flag pages where consumption doesn't match content length

**NLP/Quality Signals:**
- Does content actually cover the query it's trying to rank for?
- Query-to-content alignment (keyword cannibalization risk)
- Topical relevance and depth
- Factual accuracy

**E-E-A-T Evaluation:**
- Author identity and credentials visible?
- Publication date present and accurate?
- Last updated date for time-sensitive content?
- Sources cited with links?
- Company expertise demonstrated?

**Content Hygiene:**
- Duplicate content check (internal and external)
- Plagiarism screening
- Wayback Machine — has content been copied from elsewhere?
- Fact-check validation on claims

**Link Audit:**
- Internal links from and to the page
- External links (quality of outbound links)
- Anchor text distribution of internal links pointing to page
- Are links contextual or footer/sidebar?

### Content Decay Detection
Identify pages losing impressions/clicks over 3+ month period:
- Match decay to: word count changes, readability changes, internal link changes
- Check if competitor has published better content on same query
- Evaluate if page needs refresh or redirect consolidation

---

## Phase 4: Link Audit

### Referring Domains
- Track domain accruement rate over time
- Healthy = steady growth; unhealthy = flat or declining
- Segment by traffic value (referring domains driving traffic vs. not)

### Link Quality Assessment
- Topical trust flow — do linking sites relate to your industry?
- Link context — is the link in relevant content or random sidebar?
- Anchor text distribution — natural vs. over-optimized?
- PBN/network detection
- OBL (outbound links) from linking pages — quality signal

### Link Decay
- Lost links over time — why?
- Disavow file review — any links wrongly disavowed?
- New links acquired — quality check on new referrers

---

## Phase 5: Technical Audit

### Core Web Vitals
- LCP (Largest Contentful Paint) — target < 2.5s
- INP (Interaction to Next Paint) — target < 200ms (replaced FID)
- CLS (Cumulative Layout Shift) — target < 0.1
- Check field data (CrUX) not just lab data

### Crawl Budget
- Pages discovered vs. pages indexed — identify gaps
- Low-value pages consuming crawl budget
- Orphan pages (no internal links pointing to them)
- Crawl frequency by page type

### Indexation
- Indexed pages vs. discovered pages — find the delta
- Non-indexed reasons: noindex, canonical to other page, blocked by robots?
- URL Inspection API for batch index status

### Structured Data
- Schema.org markup validation
- Correct schema type per content type
- JSON-LD syntax validation
- Rich result eligibility by type

### Rendering
- Does Googlebot see the same content as users?
- Dynamic content loaded via JS — does it render in Googlebot?
- CSR pages — consider SSR for content that matters for SEO

---

## Phase 6: SERP Analysis

### AI Overview Presence
- Which queries trigger AI Overviews?
- Where does Coodra appear in AI Overviews?
- What content is being cited in AI Overviews?
- Strategy: create content specifically designed to be cited in AI Overviews

### CTR Analysis
- By query type and position
- Identify position where CTR drops (usually position 4-5+)
- Title/meta optimization opportunities for above-position content

### Competitive SERP
- Who appears for target queries?
- What content format wins (articles, products, videos, local)?
- What content depth wins?
- Identify SERP features (People Also Ask, Local Pack, etc.)

---

## Priority Framework for Audits

### Critical (Fix Within 1 Week)
- Indexation of important pages
- Core Web Vitals failures
- HTTPS not enforced
- Major canonical issues (duplicate content)
- Robots.txt blocking important pages

### High (Fix Within 1 Month)
- Content decay without refresh strategy
- Click gaps on high-impression queries
- Missing or broken schema
- Internal link issues
- E-E-A-T gaps on top pages

### Medium (Fix Within 3 Months)
- Backlink decay monitoring
- Content expansion for thin pages
- New topic cluster development
- Link building campaigns

### Low (Backlog)
- URL structure cleanup
- Pagination consolidation
- Long-term content strategy
- Site architecture improvements