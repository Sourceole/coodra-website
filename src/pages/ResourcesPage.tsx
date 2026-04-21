import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router'
import MarketingHeader from '../components/MarketingHeader'
import MarketingFooter from '../components/MarketingFooter'
import './ResourcesPage.css'

type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  readingTime: string
  publishedAt: string
}

const allPosts: BlogPost[] = [
  {
    slug: 'inventory-mistakes-that-kill-margin',
    title: '5 inventory mistakes that kill margin (and how to catch them before they do)',
    excerpt: 'A practical framework for spotting hidden inventory drag early and turning signals into high-confidence actions.',
    category: 'Inventory',
    readingTime: '7 min read',
    publishedAt: 'April 13, 2026',
  },
  {
    slug: 'dead-inventory-signs',
    title: '5 Signs Your Store Has Too Much Dead Inventory',
    excerpt: 'Dead stock quietly drains margin every week it sits. Here are the five signals before the damage compounds.',
    category: 'Inventory',
    readingTime: '6 min read',
    publishedAt: 'April 17, 2026',
  },
  {
    slug: 'reorder-points-without-excel',
    title: 'How to Calculate Reorder Points Without Excel',
    excerpt: 'The reorder point formula is simple. Getting the data and applying it consistently is where the work is.',
    category: 'Inventory',
    readingTime: '7 min read',
    publishedAt: 'April 17, 2026',
  },
  {
    slug: 'how-to-read-pos-data',
    title: 'How to Read Your POS Data to Make Smarter Buying Decisions',
    excerpt: 'Your POS logs everything you need — sales velocity, stock position, demand trends. Turn it into a weekly buying strategy.',
    category: 'Inventory',
    readingTime: '7 min read',
    publishedAt: 'April 17, 2026',
  },
  {
    slug: 'stock-to-sales-ratio-guide',
    title: 'The Stock-to-Sales Ratio: The Simple Metric Most Independent Retailers Skip',
    excerpt: 'Lower is better. Most retailers do not track it — and pay for it in margin every week it goes unchecked.',
    category: 'Inventory',
    readingTime: '6 min read',
    publishedAt: 'April 17, 2026',
  },
  {
    slug: 'safety-stock-without-overcomplicating-it',
    title: 'How to Set Safety Stock Levels Without Overcomplicating It',
    excerpt: 'Most retailers hold too much or none at all. Here is the practical middle ground — a method that actually gets used.',
    category: 'Inventory',
    readingTime: '5 min read',
    publishedAt: 'April 19, 2026',
  },
  {
    slug: 'lead-time-and-why-it-breaks-every-reorder-formula',
    title: 'Lead Time and Why It Breaks Every Reorder Formula',
    excerpt: 'Most demand forecasting mistakes are not bad forecasts. They are lead-time errors. Here is why it quietly destroys most replenishment.',
    category: 'Inventory',
    readingTime: '6 min read',
    publishedAt: 'April 19, 2026',
  },
  {
    slug: 'the-90-day-replenishment-calendar',
    title: 'The 90-Day Replenishment Calendar: Turn Your POS Data into a Concrete Buying Schedule',
    excerpt: 'Most retailers know what they sold last week. Almost none have a clear picture of what they should buy for the next 90 days.',
    category: 'Inventory',
    readingTime: '6 min read',
    publishedAt: 'April 19, 2026',
  },
  {
    slug: 'pos-data-trust-guide',
    title: 'Shopify vs Square vs Lightspeed: which POS data should you trust?',
    excerpt: 'How to evaluate signal quality across POS platforms and avoid making inventory calls on noisy data.',
    category: 'POS Data',
    readingTime: '8 min read',
    publishedAt: 'April 13, 2026',
  },
  {
    slug: 'demand-forecasting-without-an-erp',
    title: 'Demand Forecasting Without an ERP: What Independent Retailers Can Actually Do',
    excerpt: 'Most tools assume you have clean records and a data team. Here is what you can do with the data you already have.',
    category: 'Demand Forecasting',
    readingTime: '6 min read',
    publishedAt: 'April 18, 2026',
  },
  {
    slug: 'coodra-vs-netstock',
    title: 'Coodra vs Netstock: Which Is Right for Independent Retailers?',
    excerpt: 'Netstock serves mid-market planning teams with ERP integrations. Coodra is built for independent retailers who want decisions, not dashboards.',
    category: 'Comparisons',
    readingTime: '8 min read',
    publishedAt: 'April 17, 2026',
  },
]

const CATEGORIES = ['All', 'Inventory', 'POS Data', 'Demand Forecasting', 'Comparisons']

const categoryColors: Record<string, string> = {
  'Inventory': '#2fd7c6',
  'POS Data': '#7c6aef',
  'Demand Forecasting': '#f59e0b',
  'Comparisons': '#ec4899',
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const color = categoryColors[post.category] ?? '#2fd7c6'
  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`blog-card reveal delay-${(index % 4) + 1}`}
      style={{ '--card-accent': color } as React.CSSProperties}
    >
      <div className="blog-card__image">
        <div className="blog-card__image-bg" />
        <span className="blog-card__category" style={{ background: `${color}18`, color }}>
          {post.category}
        </span>
        <span className="blog-card__read-time">{post.readingTime}</span>
      </div>
      <div className="blog-card__body">
        <h3 className="blog-card__title">{post.title}</h3>
        <p className="blog-card__excerpt">{post.excerpt}</p>
        <div className="blog-card__footer">
          <span className="blog-card__date">{post.publishedAt}</span>
          <span className="blog-card__cta">
            Read
            <svg viewBox="0 0 16 16" fill="none" width="14" height="14" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>(allPosts)
  const [isFiltering, setIsFiltering] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const filterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    const revealEls = document.querySelectorAll('.reveal')
    revealEls.forEach((el) => observerRef.current?.observe(el))

    return () => observerRef.current?.disconnect()
  }, [])

  useEffect(() => {
    if (filterTimeoutRef.current) clearTimeout(filterTimeoutRef.current)

    if (activeCategory === 'All') {
      setDisplayedPosts(allPosts)
      return
    }

    setIsFiltering(true)
    filterTimeoutRef.current = setTimeout(() => {
      setDisplayedPosts(allPosts.filter((p) => p.category === activeCategory))
      setIsFiltering(false)
      setTimeout(() => {
        document.querySelectorAll('.blog-card.reveal').forEach((el) => {
          el.classList.remove('visible')
          observerRef.current?.observe(el)
        })
      }, 50)
    }, 200)
  }, [activeCategory])

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What resources does Coodra offer for independent retailers?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Coodra\'s resource library covers inventory decisioning, POS data interpretation, demand forecasting, and replenishment planning — all written for independent operators who run stores without a data team or ERP. Each guide is free to read and based on patterns Coodra sees across thousands of retail locations.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I access the retailer playbook?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The retailer playbook is available as a featured guide on this page. It covers how to connect your POS data to a weekly decisioning workflow, how to rank inventory moves by margin impact, and how to align your team on what to approve first — without spreadsheets or ERP integrations.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does Coodra offer free inventory guides for small retailers?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Every blog post on this page is free to read. Topics include how to catch dead inventory before it compounds, how to calculate reorder points from your POS data, and how to build a 90-day replenishment calendar. No signup required to access the guides.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I compare Coodra to other inventory planning tools?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. The comparisons section covers how Coodra stacks up against Netstock, Cin7, Fishbowl, DEAR, Zoho Inventory, and Sortly — with specific attention to what independent retailers need that mid-market tools do not offer. Each comparison focuses on ease of setup, POS requirements, and total cost of ownership.',
        },
      },
      {
        '@type': 'Question',
        name: 'What POS systems does Coodra work with?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Coodra connects to Shopify POS, Square, Lightspeed, and most platforms that export sales and inventory data via API or CSV. It does not require an ERP or a dedicated IT team. Setup typically takes under an hour for retailers already running a supported POS.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Coodra useful for stores that already have a purchasing manager?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Coodra is designed to augment your existing team\'s judgment, not replace it. It surfaces margin-impacting signals from your POS data and models replenishment scenarios — giving your buyer a decision-ready brief instead of a raw data export. Most stores using Coodra have one to three people making buying decisions.',
        },
      },
    ],
  }

  return (
    <div className="resources-page">
      <MarketingHeader />

      <main>
        {/* ── Hero ── */}
        <section className="resources-hero" aria-label="Resources hero">
          <div className="resources-container">
            <p className="resources-eyebrow">Resource Library</p>
            <h1>Retail Operations Resources</h1>
            <p className="resources-hero-sub">
              Guides, case studies, and tools for independent retailers running smarter — without an ERP, without a dedicated planner.
            </p>
          </div>
        </section>

        {/* ── Featured card ── */}
        <section className="resources-featured" aria-label="Featured resource">
          <div className="resources-container">
            <article className="featured-card">
              <div className="featured-card__content">
                <div className="featured-card__eyebrow">
                  <span className="featured-card__eyebrow-dot" />
                  Featured Guide
                </div>
                <h2 className="featured-card__title">
                  Retail operator&rsquo;s guide to faster weekly decisions
                </h2>
                <p className="featured-card__desc">
                  A complete operating playbook to connect your POS, rank high-impact moves, and align your team on what to approve first — every week.
                </p>
                <Link to="/blog" className="featured-card__link">
                  Read the guide
                  <svg
                    className="featured-card__link-arrow"
                    viewBox="0 0 16 16"
                    fill="none"
                    width="16"
                    height="16"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>

              <div className="featured-card__visual" aria-hidden="true">
                <CompassIllustration />
              </div>
            </article>
          </div>
        </section>

        {/* ── What the library covers ── */}
        <section className="resources-about" aria-label="About the resource library">
          <div className="resources-container">
            <div className="resources-about__inner reveal">
              <div className="resources-about__text">
                <h2 className="resources-about__heading">What the resource library covers</h2>
                <p>
                  Most independent retailers make buying decisions from memory, supplier calls, and whatever showed up in last week&rsquo;s inbox. Coodra&rsquo;s library is built around the decisions that actually move margin — and the patterns that quietly cost retailers the most when they go unnoticed.
                </p>
                <p>
                  Every guide starts with what your POS already knows. Sales velocity, stock depth, sell-through rate by category, reorder point gaps — the data is there. The guides show you how to read it, act on it, and build a repeatable weekly workflow without hiring a planner or buying an ERP.
                </p>
                <p>
                  The inventory mistake guides cover the five patterns that compound margin damage fastest: dead stock accumulation, reorder point errors from bad lead-time data, over-ordering on seasonal items, under-ordering on proven SKUs, and approval bottlenecks that let good inventory decisions die in your inbox.
                </p>
                <p>
                  Each guide is short, specific, and written for a store operator reading it on their phone between shifts. No dashboards, no enterprise workflows — just the decision and how to make it faster.
                </p>
              </div>
              <div className="resources-about__stats" role="list" aria-label="Library at a glance">
                <div className="resources-stat" role="listitem">
                  <span className="resources-stat__value">11</span>
                  <span className="resources-stat__label">Guides published</span>
                </div>
                <div className="resources-stat" role="listitem">
                  <span className="resources-stat__value">5</span>
                  <span className="resources-stat__label">Decision categories</span>
                </div>
                <div className="resources-stat" role="listitem">
                  <span className="resources-stat__value">Free</span>
                  <span className="resources-stat__label">Always — no paywall</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Unified blog / resources section ── */}
        <section className="blog-showcase" aria-label="Blog posts">
          <div className="resources-container">
            <div className="blog-showcase__header reveal">
              <span className="blog-showcase__eyebrow">From the blog</span>
              <h2 className="blog-showcase__title">Retail intelligence, in writing</h2>
              <p className="blog-showcase__sub">
                Every post is written for independent operators — no enterprise jargon, no generic advice. Just the patterns that cost retailers the most margin, and how to catch them early.
              </p>
            </div>

            <div className="reveal delay-1 blog-showcase__filters" role="tablist" aria-label="Filter blog posts by category">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={activeCategory === cat}
                  className={`blog-filter-pill ${activeCategory === cat ? 'blog-filter-pill--active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                  style={activeCategory === cat && cat !== 'All' ?
                    { background: `${categoryColors[cat]}18`, color: categoryColors[cat], borderColor: `${categoryColors[cat]}50` } :
                    {}}
                >
                  {cat !== 'All' && (
                    <span className="blog-filter-pill__dot" style={{ background: categoryColors[cat] }} />
                  )}
                  {cat}
                </button>
              ))}
            </div>

            <div className="reveal delay-2 blog-showcase__count">
              <span>{displayedPosts.length} article{displayedPosts.length !== 1 ? 's' : ''}</span>
              {activeCategory !== 'All' && <span> in {activeCategory}</span>}
            </div>

            <div className={`blog-grid ${isFiltering ? 'blog-grid--fading' : ''}`}>
              {displayedPosts.map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i} />
              ))}
            </div>

            <div className="reveal delay-2 blog-showcase__cta">
              <Link to="/blog" className="blog-showcase__all-link">
                View all articles
                <svg viewBox="0 0 16 16" fill="none" width="16" height="16" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Closing paragraph ── */}
        <section className="resources-closing" aria-label="Get started with Coodra">
          <div className="resources-container">
            <div className="resources-closing__inner reveal">
              <p className="resources-closing__text">
                Every guide on this page is written to help you make one better decision this week. If you are ready to stop reacting to inventory and start controlling it — Coodra connects to your POS and builds your weekly decision brief automatically, so the data is always ready when you need it.
              </p>
              <div className="resources-closing__links">
                <Link to="/blog/inventory-mistakes-that-kill-margin" className="resources-closing__link">
                  Start with the inventory mistake guide
                  <svg viewBox="0 0 16 16" fill="none" width="14" height="14" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <span className="resources-closing__sep">or</span>
                <Link to="/signup" className="resources-closing__link resources-closing__link--primary">
                  Try Coodra free
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="reveal delay-1 resources-bottom-cta" aria-label="Get started">
          <div className="resources-container">
            <div className="resources-bottom-cta__inner">
              <h2>Ready to stop guessing?</h2>
              <p>Connect your POS. Coodra handles the rest.</p>
              <div className="resources-bottom-actions">
                <Link to="/signup" className="resources-btn resources-btn-primary">Start Free</Link>
                <Link to="/contact" className="resources-btn resources-btn-ghost">Talk to Sales</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <MarketingFooter />
    </div>
  )
}

function CompassIllustration() {
  return (
    <svg
      className="compass-illustration"
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      width="240"
      height="240"
    >
      <g className="compass-ring">
        <circle cx="120" cy="120" r="110" stroke="rgba(47,215,198,0.15)" strokeWidth="1.5" />
        <circle cx="120" cy="120" r="88" stroke="rgba(47,215,198,0.1)" strokeWidth="1" />
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
          const rad = (angle * Math.PI) / 180
          const x1 = 120 + 88 * Math.sin(rad)
          const y1 = 120 - 88 * Math.cos(rad)
          const x2 = angle % 90 === 0 ? 120 + 78 * Math.sin(rad) : 120 + 83 * Math.sin(rad)
          const y2 = angle % 90 === 0 ? 120 - 78 * Math.cos(rad) : 120 - 83 * Math.cos(rad)
          return (
            <line
              key={angle}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={angle % 90 === 0 ? '#2fd7c6' : 'rgba(47,215,198,0.3)'}
              strokeWidth={angle % 90 === 0 ? 2 : 1}
              strokeLinecap="round"
            />
          )
        })}
        <text x="120" y="22" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" fill="rgba(47,215,198,0.7)" letterSpacing="1">N</text>
        <text x="222" y="124" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" fill="rgba(47,215,198,0.5)" letterSpacing="1">E</text>
        <text x="120" y="226" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" fill="rgba(47,215,198,0.5)" letterSpacing="1">S</text>
        <text x="18" y="124" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" fill="rgba(47,215,198,0.5)" letterSpacing="1">W</text>
      </g>
      <g className="compass-needle">
        <polygon points="120,40 126,115 120,105 114,115" fill="#2fd7c6" />
        <polygon points="120,200 126,125 120,135 114,125" fill="rgba(47,215,198,0.35)" />
      </g>
      <circle cx="120" cy="120" r="8" fill="#2fd7c6" />
      <circle cx="120" cy="120" r="4" fill="#ffffff" />
      <circle cx="120" cy="120" r="52" stroke="rgba(47,215,198,0.08)" strokeWidth="1" strokeDasharray="4 4" />
      <text x="148" y="90" fontFamily="Inter, sans-serif" fontSize="7" fontWeight="600" fill="rgba(47,215,198,0.6)">REORDER</text>
      <text x="148" y="100" fontFamily="Inter, sans-serif" fontSize="7" fontWeight="600" fill="rgba(47,215,198,0.6)">⬤</text>
      <rect x="155" y="145" width="50" height="8" rx="4" fill="rgba(47,215,198,0.1)" />
      <rect x="155" y="145" width="35" height="8" rx="4" fill="#2fd7c6" opacity="0.7" />
      <rect x="155" y="158" width="50" height="8" rx="4" fill="rgba(47,215,198,0.1)" />
      <rect x="155" y="158" width="22" height="8" rx="4" fill="#2fd7c6" opacity="0.4" />
      <rect x="155" y="171" width="50" height="8" rx="4" fill="rgba(47,215,198,0.1)" />
      <rect x="155" y="171" width="42" height="8" rx="4" fill="#2fd7c6" opacity="0.55" />
      <text x="155" y="140" fontFamily="Inter, sans-serif" fontSize="7" fontWeight="700" fill="rgba(47,215,198,0.5)" letterSpacing="0.5">DECISIONS</text>
    </svg>
  )
}
