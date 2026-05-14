import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import {
  ArrowRight,
  BarChart3,
  Boxes,
  ClipboardList,
  Clock3,
  FileText,
  LineChart,
  ShieldCheck,
  Sparkles,
  Wallet,
} from 'lucide-react'
import MarketingHeader from '../components/MarketingHeader'
import MarketingFooter from '../components/MarketingFooter'
import { blogPosts } from '../data/blogPosts'
import './ResourcesPage.css'

type Topic = {
  name: string
  Icon: typeof Boxes
}

type ResourceCard = {
  tag: string
  title: string
  excerpt: string
  readTime: string
  date: string
  slug: string
  coverImage: string
  coverImageAlt: string
}

const topics: Topic[] = [
  { name: 'Inventory Planning', Icon: Boxes },
  { name: 'POS Data', Icon: FileText },
  { name: 'Demand Forecasting', Icon: LineChart },
  { name: 'Reordering', Icon: ClipboardList },
  { name: 'Margin', Icon: Wallet },
  { name: 'Comparisons', Icon: BarChart3 },
  { name: 'Lead Time', Icon: Clock3 },
  { name: 'Safety Stock', Icon: ShieldCheck },
]

const INITIAL_VISIBLE_ARTICLES = 8
const LOAD_MORE_STEP = 4

const operatorsStrip = [
  {
    title: 'Practical & Actionable',
    body: 'Step-by-step guidance you can use in your store today.',
    Icon: ClipboardList,
  },
  {
    title: 'Retail-Focused',
    body: 'Every resource is written for independent retailers.',
    Icon: ShieldCheck,
  },
  {
    title: 'AI-Powered Insights',
    body: 'Learn how AI turns data into better decisions.',
    Icon: Sparkles,
  },
  {
    title: 'Save Time, Drive Results',
    body: 'Spend less time in spreadsheets and more time growing your business.',
    Icon: Clock3,
  },
]

export default function ResourcesPage() {
  const resourcesFaqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What kind of resources does Coodra publish?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Coodra publishes practical retail operations guides focused on inventory planning, POS data, demand forecasting, lead time, safety stock, and margin improvement for independent retailers.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are Coodra resources written for independent retailers?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Every resource is built for independent operators and emphasizes weekly decisions teams can execute quickly without enterprise overhead.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do these guides require an ERP system?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. The guidance is designed for POS-connected operations and focuses on actionable workflows that do not require ERP implementation.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where should I start if I am new to Coodra resources?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Start with The Complete Guide to Inventory Planning for Independent Retailers, then explore topic sections for POS data, demand forecasting, and reordering.',
        },
      },
    ],
  }

  const latestResources = useMemo<ResourceCard[]>(
    () =>
      [...blogPosts]
        .sort((a, b) => new Date(b.isoPublishedAt).getTime() - new Date(a.isoPublishedAt).getTime())
        .map((post) => ({
          tag: post.category,
          title: post.title,
          excerpt: post.excerpt,
          readTime: post.readingTime,
          date: post.publishedAt,
          slug: post.slug,
          coverImage: post.coverImage,
          coverImageAlt: post.coverImageAlt,
        })),
    [],
  )
  const [visibleArticles, setVisibleArticles] = useState(INITIAL_VISIBLE_ARTICLES)
  const displayedResources = latestResources.slice(0, visibleArticles)
  const hasMoreArticles = visibleArticles < latestResources.length

  const guidesAndArticlesCount = latestResources.length
  const topicsCoveredCount = topics.length

  return (
    <div className="resources-v3-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(resourcesFaqJsonLd) }}
      />
      <MarketingHeader />

      <main className="resources-v3-main">
        <section className="resources-v3-hero">
          <div className="resources-v3-shell">
            <div className="resources-v3-hero-grid">
              <div className="resources-v3-hero-copy">
                <p className="resources-v3-eyebrow">Resource Library</p>
                <h1>
                  <span className="resources-v3-line">Retail Operations</span>
                  <br />
                  <span className="resources-v3-line">Resources</span>
                </h1>
                <p>
                  Practical guides, tools, and insights to help independent retailers run smarter, more profitable
                  stores with AI.
                </p>
                <p className="resources-v3-byline">By Michael Shahid, CEO, Coodra</p>
                <div className="resources-v3-hero-stats" role="list" aria-label="Resource stats">
                  <div role="listitem">
                    <strong>{guidesAndArticlesCount}</strong>
                    <span>Guides & Articles</span>
                  </div>
                  <div role="listitem">
                    <strong>{topicsCoveredCount}</strong>
                    <span>Topics Covered</span>
                  </div>
                  <div role="listitem">
                    <strong>100%</strong>
                    <span>Retail Focused</span>
                  </div>
                </div>
              </div>

              <div className="resources-v3-hero-media">
                <picture>
                  <source srcSet="/images/resources/hero.webp" type="image/webp" />
                  <img
                    src="/images/resources/hero.png"
                    alt="Retail resources overview visual"
                    width={1448}
                    height={1086}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
                </picture>
              </div>
            </div>
          </div>
        </section>

        <section className="resources-v3-featured">
          <div className="resources-v3-shell">
            <article className="resources-v3-featured-card">
              <div className="resources-v3-featured-media">
                <img
                  src="/images/blog/covers/inventory-planning.png"
                  alt="Featured guide cover for inventory planning"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="resources-v3-featured-copy">
                <p className="resources-v3-pill">Featured Guide</p>
                <h2>
                  <span className="resources-v3-line">The Complete Guide to Inventory Planning</span>
                  <br />
                  <span className="resources-v3-line">for Independent Retailers</span>
                </h2>
                <p>
                  A step-by-step framework for building smarter inventory plans that reduce stockouts, cut excess,
                  and improve cash flow without the spreadsheets.
                </p>
                <div className="resources-v3-meta">
                  <span>Inventory Planning</span>
                  <span>12 min read</span>
                </div>
              </div>
              <div className="resources-v3-featured-cta">
                <Link to="/blog/inventory-planning-for-small-retail" className="resources-v3-btn resources-v3-btn-primary">
                  Read the Guide <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          </div>
        </section>

        <section className="resources-v3-topics">
          <div className="resources-v3-shell">
            <header className="resources-v3-section-head">
              <h2>Browse by topic</h2>
              <Link to="/blog">View all topics</Link>
            </header>
            <div className="resources-v3-topic-grid">
              {topics.map((topic) => (
                <article key={topic.name} className="resources-v3-topic-card">
                  <span className="resources-v3-topic-icon" aria-hidden="true">
                    <topic.Icon size={18} />
                  </span>
                  <h3>{topic.name}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="resources-v3-latest">
          <div className="resources-v3-shell">
            <header className="resources-v3-section-head">
              <h2>Latest resources</h2>
              <Link to="/blog">View all articles</Link>
            </header>
            <div className="resources-v3-card-grid">
              {displayedResources.map((item) => (
                <Link key={item.slug} to={`/blog/${item.slug}`} className="resources-v3-article-card">
                  <div className="resources-v3-article-media">
                    <img src={item.coverImage} alt={item.coverImageAlt} loading="lazy" decoding="async" />
                  </div>
                  <div className="resources-v3-article-body">
                    <p className="resources-v3-tag">{item.tag}</p>
                    <h3>{item.title}</h3>
                    <p>{item.excerpt}</p>
                    <div className="resources-v3-article-meta">
                      <span>{item.readTime}</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {hasMoreArticles ? (
              <div className="resources-v3-load-more">
                <button
                  type="button"
                  className="resources-v3-btn resources-v3-btn-ghost"
                  onClick={() => setVisibleArticles((count) => Math.min(count + LOAD_MORE_STEP, latestResources.length))}
                >
                  Load more articles
                </button>
              </div>
            ) : null}
          </div>
        </section>

        <section className="resources-v3-operators">
          <div className="resources-v3-shell">
            <h2>Built for store operators, not analysts</h2>
            <div className="resources-v3-operator-row">
              {operatorsStrip.map((item) => (
                <article key={item.title} className="resources-v3-operator-item">
                  <span className="resources-v3-operator-icon" aria-hidden="true">
                    <item.Icon size={18} />
                  </span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="resources-v3-cta">
          <div className="resources-v3-shell">
            <article className="resources-v3-cta-card">
              <div>
                <h2>Ready to stop guessing?</h2>
                <p>
                  Join thousands of retailers using Coodra to forecast demand, optimize inventory, and grow profit
                  every day.
                </p>
              </div>
              <div className="resources-v3-cta-actions">
                <Link to="/signup" className="resources-v3-btn resources-v3-btn-primary">
                  Start Free
                </Link>
                <Link to="/contact" className="resources-v3-btn resources-v3-btn-secondary">
                  Talk to Sales
                </Link>
              </div>
            </article>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}
