import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { blogPosts, getBlogPostBySlug } from '../data/blogPosts'
import { trackEvent } from '../lib/analytics'
import MarketingHeader from '../components/MarketingHeader'
import MarketingFooter from '../components/MarketingFooter'
import InventoryPlanningArticlePage from './InventoryPlanningArticlePage'
import './BlogPages.css'

type PrimarySource = {
  label: string
  url: string
}

type MidPostVisual = {
  src: string
  alt: string
  caption: string
}


type TocItem = {
  id: string
  label: string
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const stripHtml = (value: string) =>
  value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()

const buildArticleBody = (
  blocks: Array<{ type: 'paragraph'; text: string } | { type: 'callout'; text: string } | { type: 'image'; src: string; alt: string; caption?: string }>
) =>
  blocks
    .filter((block) => block.type === 'paragraph' || block.type === 'callout')
    .map((block) => stripHtml(block.text))
    .join('\n\n')


const primarySourcesBySlug: Record<string, PrimarySource[]> = {
  'inventory-mistakes-that-kill-margin': [
    { label: 'Shopify Help Center: Inventory management', url: 'https://www.shopify.com/retail/inventory-management' },
    { label: 'Square Support: Track and manage inventory', url: 'https://squareup.com/help/us/en/article/7039-track-and-manage-your-inventory-with-square' },
    { label: 'Lightspeed Retail: Inventory management docs', url: 'https://retail-support.lightspeedhq.com/' },
  ],
  'pos-data-trust-guide': [
    { label: 'Shopify Admin developer reference', url: 'https://shopify.dev/docs/api/admin-rest' },
    { label: 'Square Orders developer reference', url: 'https://developer.squareup.com/reference/square' },
    { label: 'Lightspeed Retail developer docs', url: 'https://developers.lightspeedhq.com/retail/' },
  ],
  'dead-inventory-signs': [
    { label: 'U.S. Census Bureau: Retail trade and inventories', url: 'https://www.census.gov/retail/' },
    { label: 'Shopify: Inventory management guide', url: 'https://www.shopify.com/retail/inventory-management' },
    { label: 'Square support: Inventory insights', url: 'https://squareup.com/help/us/en/article/8249-inventory-insights' },
  ],
  'reorder-points-without-excel': [
    { label: 'Shopify: Inventory planning guide', url: 'https://www.shopify.com/retail/inventory-planning' },
    { label: 'Corporate Finance Institute: Reorder Point resource', url: 'https://corporatefinanceinstitute.com/resources' },
    { label: 'APICS Dictionary: Definition of key operations terms', url: 'https://www.ascm.org/learning-development/apics-certification-maintenance/definitions/' },
  ],
  'coodra-vs-netstock': [
    { label: 'Netstock official product overview', url: 'https://www.netstock.com/' },
    { label: 'Shopify POS overview', url: 'https://www.shopify.com/pos' },
    { label: 'Square for Retail overview', url: 'https://squareup.com/us/en/point-of-sale/retail' },
  ],
  'how-to-read-pos-data': [
    { label: 'Shopify analytics and reports docs', url: 'https://help.shopify.com/en/manual/reports-and-analytics' },
    { label: 'Square reporting and analytics', url: 'https://squareup.com/help/us/en/article/5355-square-analytics-and-reporting' },
    { label: 'Lightspeed Retail: Reporting and analytics support', url: 'https://www.lightspeedhq.com/retail/support/reporting-analytics' },
  ],
  'stock-to-sales-ratio-guide': [
    { label: 'U.S. Census Bureau: Retail trade and inventories', url: 'https://www.census.gov/retail/' },
    { label: 'Wall Street Prep: Inventory turnover formula', url: 'https://www.wallstreetprep.com/knowledge/inventory-turnover/' },
    { label: 'Shopify: Inventory management guide', url: 'https://www.shopify.com/retail/inventory-management' },
  ],
  'demand-forecasting-without-an-erp': [
    { label: 'U.S. Small Business Administration: Business finance guide', url: 'https://www.sba.gov/business-guide/manage-your-business' },
    { label: 'Shopify retail demand forecasting guide', url: 'https://www.shopify.com/retail/demand-forecasting' },
    { label: 'Square business reports reference', url: 'https://squareup.com/help/us/en/article/5191-view-and-download-reports' },
  ],
  'lead-time-and-why-it-breaks-every-reorder-formula': [
    { label: 'APICS Dictionary: Definition of lead time', url: 'https://www.ascm.org/learning-development/apics-certification-maintenance/definitions/' },
    { label: 'Corporate Finance Institute: Lead time in operations', url: 'https://corporatefinanceinstitute.com/resources/accounting/lead-time/' },
    { label: 'Shopify: Inventory planning guide', url: 'https://www.shopify.com/retail/inventory-planning' },
  ],
  'safety-stock-without-overcomplicating-it': [
    { label: 'Shopify: Inventory planning guide', url: 'https://www.shopify.com/retail/inventory-planning' },
    { label: 'Corporate Finance Institute: Operations resources', url: 'https://corporatefinanceinstitute.com/resources' },
    { label: 'Corporate Finance Institute: Operations resources', url: 'https://corporatefinanceinstitute.com/resources' },
  ],
  'the-90-day-replenishment-calendar': [
    { label: 'Shopify: Inventory management guide', url: 'https://www.shopify.com/retail/inventory-management' },
    { label: 'Square inventory alerts and purchasing', url: 'https://squareup.com/help/us/en/article/6889-set-up-and-manage-inventory-alerts' },
    { label: 'Netstock: Inventory planning resources', url: 'https://www.netstock.com/resources' },
  ],
  'inventory-planning-for-small-retail': [
    { label: 'U.S. SBA operations planning resources', url: 'https://www.sba.gov/business-guide/manage-your-business/manage-day-day' },
    { label: 'Shopify inventory planning guides', url: 'https://www.shopify.com/retail/topics/inventory-management' },
    { label: 'Square support: Inventory management', url: 'https://squareup.com/help/us/en/article/7039-track-and-manage-your-inventory-with-square' },
  ],
  'ai-inventory-management-for-retail': [
    { label: 'Google Search Central: Helpful content guidance', url: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content' },
    { label: 'Shopify AI and retail operations resources', url: 'https://www.shopify.com/retail/ai-in-retail' },
    { label: 'Square AI tooling announcements and docs', url: 'https://developer.squareup.com/blog/' },
  ],
}

const midPostVisualBySlug: Record<string, MidPostVisual> = {
  'inventory-mistakes-that-kill-margin': {
    src: '/images/blog/insights/inventory-mistakes-that-kill-margin-insight.svg',
    alt: 'Custom Coodra infographic summarizing margin leak patterns and inventory risk trajectory',
    caption: 'Original Coodra insight chart: margin leak pattern snapshot.',
  },
  'pos-data-trust-guide': {
    src: '/images/blog/insights/pos-data-trust-guide-insight.svg',
    alt: 'Custom Coodra infographic showing POS signal reliability checks for decision quality',
    caption: 'Original Coodra insight chart: POS signal reliability mix.',
  },
  'dead-inventory-signs': {
    src: '/images/blog/insights/dead-inventory-signs-insight.svg',
    alt: 'Custom Coodra infographic showing dead inventory warning thresholds and risk curve',
    caption: 'Original Coodra insight chart: dead stock early-warning score.',
  },
  'reorder-points-without-excel': {
    src: '/images/blog/insights/reorder-points-without-excel-insight.svg',
    alt: 'Custom Coodra infographic for reorder trigger confidence and late reorder reduction',
    caption: 'Original Coodra insight chart: reorder trigger confidence.',
  },
  'coodra-vs-netstock': {
    src: '/images/blog/insights/coodra-vs-netstock-insight.svg',
    alt: 'Custom Coodra comparison infographic highlighting independent retail fit and setup cadence',
    caption: 'Original Coodra insight chart: independent retail fit check.',
  },
  'how-to-read-pos-data': {
    src: '/images/blog/insights/how-to-read-pos-data-insight.svg',
    alt: 'Custom Coodra infographic mapping POS signal clarity to buying confidence outcomes',
    caption: 'Original Coodra insight chart: POS-to-decision clarity index.',
  },
  'stock-to-sales-ratio-guide': {
    src: '/images/blog/insights/stock-to-sales-ratio-guide-insight.svg',
    alt: 'Custom Coodra infographic showing stock-to-sales risk thresholds and holding cost pressure',
    caption: 'Original Coodra insight chart: stock-to-sales risk curve.',
  },
  'demand-forecasting-without-an-erp': {
    src: '/images/blog/insights/demand-forecasting-without-an-erp-insight.svg',
    alt: 'Custom Coodra infographic for no-ERP demand forecasting checkpoints and quality lift',
    caption: 'Original Coodra insight chart: no-ERP forecast playbook.',
  },
  'lead-time-and-why-it-breaks-every-reorder-formula': {
    src: '/images/blog/insights/lead-time-and-why-it-breaks-every-reorder-formula-insight.svg',
    alt: 'Custom Coodra infographic showing lead-time drift impact on reorder reliability',
    caption: 'Original Coodra insight chart: lead time drift monitor.',
  },
  'safety-stock-without-overcomplicating-it': {
    src: '/images/blog/insights/safety-stock-without-overcomplicating-it-insight.svg',
    alt: 'Custom Coodra infographic on safety stock baseline coverage and emergency PO reduction',
    caption: 'Original Coodra insight chart: safety stock simplicity model.',
  },
  'the-90-day-replenishment-calendar': {
    src: '/images/blog/insights/the-90-day-replenishment-calendar-insight.svg',
    alt: 'Custom Coodra infographic visualizing 90-day replenishment rhythm and forward planning range',
    caption: 'Original Coodra insight chart: 90-day replenishment rhythm.',
  },
  'inventory-planning-for-small-retail': {
    src: '/images/blog/insights/inventory-planning-for-small-retail-insight.svg',
    alt: 'Custom Coodra infographic for weekly small-retail planning loop and decision cadence',
    caption: 'Original Coodra insight chart: small-retail planning loop.',
  },
  'ai-inventory-management-for-retail': {
    src: '/images/blog/insights/ai-inventory-management-for-retail-insight.svg',
    alt: 'Custom Coodra infographic showing AI-assisted retail decision signal scorecard',
    caption: 'Original Coodra insight chart: decision recommendation assist scorecard.',
  },
}

export default function BlogPostPage() {
  const { slug = '' } = useParams()
  const post = getBlogPostBySlug(slug)
  const isInventoryPlanningArticle = post?.slug === 'inventory-planning-for-small-retail'
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null)

  useEffect(() => {
    if (!post) return
    const timer = window.setTimeout(() => {
      trackEvent('blog_article_read', {
        article_slug: post.slug,
        page_path: `/blog/${post.slug}`,
        seconds_on_page: 30,
      })
    }, 30_000)

    return () => window.clearTimeout(timer)
  }, [post])

  const tocItems: TocItem[] = useMemo(() => {
    return (post?.content ?? [])
      .filter((block) => block.type === 'callout')
      .map((block, index) => {
        const text = block.type === 'callout' ? block.text : ''
        return {
          id: `section-${index + 1}-${slugify(text).slice(0, 42)}`,
          label: text,
        }
      })
  }, [post?.content])

  const [activeSection, setActiveSection] = useState<string>(tocItems[0]?.id ?? '')
  const sectionIds = useMemo(() => tocItems.map((item) => item.id), [tocItems])

  useEffect(() => {
    if (sectionIds.length === 0) return

    const offset = 140
    let raf = 0

    const updateActiveSection = () => {
      let current = sectionIds[0]
      sectionIds.forEach((id) => {
        const section = document.getElementById(id)
        if (!section) return
        const top = section.getBoundingClientRect().top
        if (top - offset <= 0) current = id
      })
      setActiveSection((prev) => (prev === current ? prev : current))
    }

    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        updateActiveSection()
        raf = 0
      })
    }

    updateActiveSection()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [sectionIds])

  if (!post) {
    return (
      <div className="blog-page blog-page--post">
        <div className="blog-page__container">
          <MarketingHeader />

          <article className="blog-article">
            <p className="blog-breadcrumbs">Home {'>'} Blog</p>
            <h1>Article not found</h1>
            <p className="blog-article__lede">We could not find this blog article.</p>
            <div className="blog-cta">
              <Link to="/blog">Back to blog</Link>
            </div>
          </article>
        </div>
        <MarketingFooter />
      </div>
    )
  }

  if (isInventoryPlanningArticle) {
    return <InventoryPlanningArticlePage />
  }

  const related = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 2)
  const primarySources = primarySourcesBySlug[post.slug] ?? []
  const midPostVisual = midPostVisualBySlug[post.slug]
  const insertAt = Math.max(2, Math.floor(post.content.length / 2))

  const SITE_URL = 'https://www.coodra.com'
  const authorUrl = `${SITE_URL}/author/michael-shahid`
  const authorName = 'Michael Shahid'
  const authorPerson = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: authorName,
    jobTitle: 'CEO',
    url: authorUrl,
    image: `${SITE_URL}/images/michael.jpg`,
    sameAs: ['https://www.linkedin.com/company/coodra/'],
  }
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: `${SITE_URL}${post.coverImage}`,
    datePublished: post.isoPublishedAt,
    dateModified: post.isoPublishedAt,
    author: { '@id': `${SITE_URL}/#person` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    url: `${SITE_URL}/blog/${post.slug}`,
    inLanguage: 'en',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
    articleBody: buildArticleBody(post.content),
  }

  const renderBlock = (block: (typeof post.content)[number], i: number) => {
    if (block.type === 'paragraph') {
      return (
        <div
          key={`paragraph-${i}`}
          className="blog-content__paragraph"
          dangerouslySetInnerHTML={{ __html: block.text }}
        />
      )
    }

    if (block.type === 'image') {
      return (
        <figure key={`image-${i}`} className="blog-content__image">
          <img src={block.src} alt={block.alt} loading="lazy" />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      )
    }

    if (block.type === 'callout') {
      const calloutPosition =
        post.content.slice(0, i + 1).filter((entry) => entry.type === 'callout').length - 1
      const tocItem = tocItems[calloutPosition]
      return (
        <h2 key={`callout-${i}`} id={tocItem?.id} className="blog-content__callout blog-content__callout--unified">
          {block.text}
        </h2>
      )
    }

    return null
  }

  const contentNodes = post.content.flatMap((block, i) => {
    const node = renderBlock(block, i)
    if (!node) return []

    if (midPostVisual && i === insertAt) {
      return [
        <figure className="blog-content__image blog-content__image--insight" key={`${post.slug}-insight`}>
          <img src={midPostVisual.src} alt={midPostVisual.alt} loading="lazy" />
          <figcaption>{midPostVisual.caption}</figcaption>
        </figure>,
        node,
      ]
    }

    return [node]
  })

  return (
    <div className="blog-page blog-page--post blog-page--unified">
      <div className="blog-page__container">
        <MarketingHeader />

        <article className="blog-article blog-article--unified">
          <div className="blog-unified-grid">
            <div className="blog-unified-main">
              <header className="blog-post-hero blog-post-hero--unified">
                <p className="blog-breadcrumbs">
                  <Link to="/">Home</Link> {'>'} <Link to="/blog">Blog</Link> {'>'} {post.title}
                </p>

                <div className="blog-post-hero__meta">
                  <span>{post.category}</span>
                  <span>{post.readingTime}</span>
                  <span>{post.publishedAt}</span>
                </div>

                <h1>{post.title}</h1>
                <p className="blog-article__lede">{post.excerpt}</p>

                <div className="blog-post-hero__author">
                  <img
                    src="/images/michael.jpg"
                    alt="Michael Shahid"
                    className="blog-post-hero__avatar-image"
                    loading="lazy"
                  />
                  <p>
                    <Link to="/author/michael-shahid">Michael Shahid</Link> • Founder & CEO
                  </p>
                </div>

                <figure className="blog-post-hero__cover blog-post-hero__cover--unified">
                  <img src={post.coverImage} alt={post.coverImageAlt} loading="lazy" />
                </figure>
              </header>

              <div className="blog-content blog-content--unified">
                {contentNodes}
              </div>

              {primarySources.length > 0 ? (
                <section className="blog-sources" aria-label="Primary sources">
                  <h2>Primary sources</h2>
                  <ul>
                    {primarySources.map((source) => (
                      <li key={`${post.slug}-${source.url}`}>
                        <a href={source.url} target="_blank" rel="noopener noreferrer">
                          {source.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <div className="blog-helpful">
                <p>Was this helpful?</p>
                <div className="blog-helpful__actions">
                  <button
                    type="button"
                    onClick={() => {
                      setFeedback('yes')
                      trackEvent('blog_feedback', { article_slug: post.slug, helpful: true })
                    }}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFeedback('no')
                      trackEvent('blog_feedback', { article_slug: post.slug, helpful: false })
                    }}
                  >
                    No
                  </button>
                </div>
                {feedback ? <p>Thanks for the feedback.</p> : null}
              </div>

              <div className="blog-cta">
                <Link to="/signup" className="btn">Start Free</Link>
              </div>

              <section className="blog-related">
                <h2>Related articles</h2>
                <ul className="blog-related__list">
                  {related.map((item) => (
                    <li key={item.slug} className="blog-related__item">
                      <Link to={`/blog/${item.slug}`}>
                        <span>{item.category}</span>
                        <strong>{item.title}</strong>
                        <small>{item.readingTime}</small>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <aside className="blog-unified-sidebar">
              <section className="blog-unified-card blog-unified-toc">
                <h3>On this page</h3>
                {tocItems.map((item) => (
                  <a key={item.id} href={`#${item.id}`} className={activeSection === item.id ? 'is-active' : ''}>
                    {item.label}
                  </a>
                ))}
              </section>

              <section className="blog-unified-card blog-unified-promo">
                <h3>See how Coodra ranks what to do next</h3>
                <p>Coodra analyzes sales, inventory, lead time, and demand signals to rank the next best action by impact.</p>
                <Link to="/signup" className="blog-unified-cta">Start Free</Link>
                <small>No credit card required</small>
              </section>

              <section className="blog-unified-card blog-unified-checklist">
                <h3>Quick checklist</h3>
                <ul>
                  <li>Review your lowest-cover SKUs</li>
                  <li>Compare 2-week and 4-week velocity</li>
                  <li>Validate current supplier lead times</li>
                  <li>Adjust safety stock on high-volatility items</li>
                  <li>Publish this week's reorder priorities</li>
                </ul>
              </section>
            </aside>
          </div>
        </article>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(authorPerson) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      </div>
      <MarketingFooter />
    </div>
  )
}
