# SEO Knowledge Skill — Coodra Website

## Overview

This skill synthesizes SEO best practices from leading practitioners into an actionable framework for coodra.com. It covers content strategy, technical SEO, audit methodology, and AI Overview optimization.

---

## The 7-Pillar SEO Framework

### Pillar 1: Data Gathering

Before writing a single word, collect:

- **Google Search Console** — non-branded keywords driving impressions
- **Competitor content analysis** — what they rank for, what's working
- **Industry reports** — authoritative sources in retail/inventory intelligence
- **Reddit threads** — what retailers actually complain about and ask
- **Community forums** — Quora, industry-specific communities
- **Reviews** — what customers say about existing solutions

**For coodra specifically:**
- GSC non-branded queries: "inventory management", "POS inventory", "retail margin tools"
- Competitors: Netstock, Cin7 — what do they rank for?
- Communities: r/retail, r/smallbusiness, industry forums
- Reviews: what do retailers say about inventory management pain points?

### Pillar 2: Pattern Recognition

From the raw data, find:

- **Content angles** that resonate in the data
- **Questions people actually ask** (not assumed questions)
- **What Google wants you to cover** (query intent)
- **What competitors do poorly** — gaps Coodra can fill

**Key insight:** Don't guess what retailers care about. Extract it from the data.

### Pillar 3: Content That Satisfies Intent

Every piece of content must:
- Satisfy the **original search intent** completely
- **Go beyond the intent** — answer the question the user didn't know to ask
- Provide **real value** — not optimized fluff
- Include **internal links** to related Coodra pages
- Have **clear hierarchical structure** (H2s, H3s that match query structure)

**Content rules:**
- Answer the query in the first 100 words
- Use lists, tables, and headings to structure information
- Include a FAQ section where natural
- End with a clear CTA tied to the content

### Pillar 4: AI Overview Optimization

AI Overviews appear when content directly answers the query in a structured way.

**What triggers AI Overviews:**
- Direct, factual answers in plain language
- Use of lists (numbered and bulleted)
- Use of tables for comparisons
- Clear FAQ-style Q&A format
- Complete answers (not partial)
- Demonstrated expertise — not just definition regurgitation

**For coodra:**
- Blog posts should format key takeaways as numbered lists
- Comparison content should use tables
- FAQ schema markup on informational content
- Answers written in complete sentences with specific details

### Pillar 5: Topical Authority + Pillar Content Clusters

Topical authority is BUILT, not bought. A new site with zero backlinks can outrank high-DA competitors by deeply covering a narrow topic. Google's quality raters and AI systems evaluate comprehensive topic coverage as an E-E-A-T signal.

**Key insight:** Domain authority is not a prerequisite for ranking. Comprehensive topical coverage is.

**Framework:** One comprehensive pillar page + spoke pages for each sub-topic, all internally linked. This is the hub-and-spoke model. See `references/topical-authority.md` for full methodology.

**Pillar page:** Comprehensive deep-dive on a core topic
- e.g., "The Complete Guide to Retail Inventory Management"

**Cluster content:** Related sub-topics linking to the pillar
- e.g., "How to calculate safety stock"
- e.g., "Inventory turnover formula"
- e.g., "Signs you're over-ordering inventory"

**For coodra, the topic clusters to own:**
1. Inventory management (core pillar)
   - Safety stock calculation
   - Dead stock reduction
   - Reorder point formula
   - Inventory turnover
2. Retail margin optimization
   - True cost of inventory
   - Margin protection strategies
   - Pricing for margin
3. POS data for retail decisions
   - Shopify inventory intelligence
   - Square data for buying decisions
   - Lightspeed reporting insights
4. Demand forecasting for SMBs
   - Without an ERP
   - With POS data
   - Seasonal patterns

### Pillar 6: Link Building

**What works for B2B SaaS:**
- Digital PR — data-driven stories Coodra can publish
- Expert interviews — founder quotes in industry content
- Resource page outreach — Coodra as a listed tool
- Competitor backlink analysis — find where they're linked and replicate
- Original research — coodra benchmark data no competitor has

**For coodra:**
- "State of Independent Retail Inventory Decisions" — original research
- Founder quotes in retail trade publications
- Comparison pages other sites link to as a resource
- Integration partner pages (links from Shopify/Square partner directories)

### Pillar 7: Technical Foundation

**Non-negotiable for every page:**
- Fast loading (LCP < 2.5s)
- Mobile-friendly (Google mobile-first)
- Clean URLs (descriptive, hyphenated, lowercase)
- Schema markup (Article, FAQ, Organization as appropriate)
- Canonical tags pointing to the right URL
- HTTPS enforced

**Additional for coodra:**
- SSR — already done, major advantage
- XML sitemap — keep updated
- Robots.txt — allow AI crawlers
- Core Web Vitals monitoring

---

## Audit Framework (from foley_seo methodology)

### Phase 1: GSC Analysis
1. Pull non-branded keywords — segment by performance
2. Build folder segments: product/category/service/blog
3. 3-month YoY comparison
4. Click gap analysis — what queries show impressions but no clicks
5. Decay analysis — which pages are losing impressions
6. AI Overview / CTR review — where are you appearing in AI Overviews

### Phase 2: Crawl Analysis
1. Full site crawl (Screaming Frog or equivalent)
2. Segment by priority (traffic, content age)
3. Rendering checks — does JS-rendered content appear?
4. Canonical chain validation
5. Internal link consistency
6. HTTP header validation
7. Hreflang validation (if applicable)

### Phase 3: Content Audit
Per page:
- Word count vs. engagement time ratio
- NLP-based quality assessment
- E-E-A-T signal check (author, citations, date)
- Query alignment — does the content match what the page ranks for?
- Cannibalization check — is another page competing for the same queries?
- Duplicate content scan
- Internal/external link quality

**Content quality signals that matter:**
- Author expertise visible
- Publication and update dates present
- Sources cited
- Clear structure with headings
- Actionable takeaways
- Original data or perspective

### Phase 4: Link Audit
- Referring domain accruement rate (healthy = growing)
- Link quality by traffic segment
- Topical trust flow
- Anchor text distribution
- Lost links (decay monitoring)
- Spam/oblog review

### Phase 5: Index & Technical
- Indexed vs. discovered pages — find the gap
- Non-indexed reason evaluation
- Crawl budget review
- Robots/canonical/header corrections
- Core Web Vitals — LCP, INP, CLS

### Phase 6: SERP Analysis
- AI Overview appearance analysis
- CTR by query type
- Content strategy adjustments for AI Overviews

---

## Rich Snippets / Schema Troubleshooting

Schema validates but rich snippets don't show? Common causes:

1. **Content not matching schema type** — Article schema requires actual article content
2. **Age of content** — new pages need time to earn rich snippets
3. **Content thinness** — schema on 200-word pages won't rank
4. **Not the right page type** — FAQ schema works best on informational pages, not homepages
5. **Query-trigger mismatch** — Google only shows rich snippets for certain query types
6. **Mobile-usability issues** — rich snippets suppressed on mobile-broken pages
7. **Manual action or suppression** — check Search Console for messages

---

## SEO for Coodra — Priority Actions

### High Priority (Month 1)
1. Fix comparison page (Phase C) — target "Coodra vs Netstock" queries
2. Write 2 more blog articles targeting specific GSC non-branded keywords
3. Audit all existing pages for E-E-A-T signals (author, date, citations)
4. Add FAQ schema to blog posts and informational pages
5. Check indexing: are all pages being indexed correctly?

### Medium Priority (Month 2)
1. Build first topic cluster (inventory management pillar + 3 cluster articles)
2. Submit updated sitemap to Google Search Console
3. Begin link building: partner directory submissions, resource page outreach
4. Competitor backlink analysis — find where Netstock/Cin7 are linked

### Low Priority (Month 3+)
1. Original research publication for link building
2. Expanded topic clusters (margin optimization, demand forecasting)
3. Conversion-optimized landing pages for high-intent queries
4. Enterprise/geographic targeting if/when relevant

---

## Key SEO Principles

1. **Write for humans first, search engines second** — satisfying intent is the primary goal
2. **Topical authority takes months to build** — consistency > one-off viral posts
3. **Technical SEO is table stakes, not a moat** — everyone has fast mobile pages now
4. **Links are still the #1 ranking factor** — original data and resources attract links organically
5. **AI Overviews change what ranks** — direct answers win; long-tail informational content benefits
6. **GSC data is ground truth** — use it to find opportunities, not SEO tools' keyword volumes
7. **E-E-A-T compounds** — expertise and authority build over time with consistent quality