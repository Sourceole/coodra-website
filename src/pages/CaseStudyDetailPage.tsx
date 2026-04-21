import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { caseStudies, consentNotice, getCaseStudyBySlug } from '../data/caseStudies'
import MarketingHeader from '../components/MarketingHeader'
import MarketingFooter from '../components/MarketingFooter'
import './CaseStudyDetailPage.css'

type Metric = { label: string; value: string }

function parseMetricValue(value: string): number {
  const match = value.match(/-?\d+(\.\d+)?/)
  if (!match) return 70
  const n = Math.abs(Number(match[0]))
  if (n > 100) return Math.min(96, 40 + n * 0.4)
  return Math.max(30, Math.min(94, n * 5 + 30))
}

function MetricRing({ metric, delay }: { metric: Metric; delay: number }) {
  const [progress, setProgress] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const pct = parseMetricValue(metric.value)
  const r = 38
  const circ = 2 * Math.PI * r

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setProgress(pct), delay)
          obs.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [pct, delay])

  useEffect(() => {
    const blocks = document.querySelectorAll('.csd-block, .csd-quote, .csd-related, .csd-panel')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    blocks.forEach((block) => obs.observe(block))
    return () => obs.disconnect()
  }, [])

  return (
    <div className="metric-ring" ref={ref}>
      <svg viewBox="0 0 88 88" fill="none" width="88" height="88" aria-hidden="true">
        <circle cx="44" cy="44" r={r} stroke="rgba(47,215,198,0.12)" strokeWidth="5" />
        <circle
          cx="44" cy="44" r={r}
          stroke="#2fd7c6"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - progress / 100)}
          transform="rotate(-90 44 44)"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
      </svg>
      <div className="metric-ring__inner">
        <span className="metric-ring__value">{metric.value}</span>
        <span className="metric-ring__label">{metric.label}</span>
      </div>
    </div>
  )
}

export default function CaseStudyDetailPage() {
  const { slug = '' } = useParams()
  const study = getCaseStudyBySlug(slug)
  const [heroVisible, setHeroVisible] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    requestAnimationFrame(() => setHeroVisible(true))
  }, [])

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setHeroVisible(true); obs.disconnect() } },
      { threshold: 0.05 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  if (!study) {
    return (
      <div className="csd-page">
        <MarketingHeader />
        <main className="csd-main">
          <div className="csd-not-found">
            <p className="csd-not-found__crumbs">Home &rsaquo; Case Studies</p>
            <h1>Case study not found</h1>
            <p>We could not find the case study you requested.</p>
            <Link to="/case-studies" className="csd-back">Return to case studies</Link>
          </div>
        </main>
        <MarketingFooter />
      </div>
    )
  }

  const related = caseStudies.filter((s) => s.slug !== study.slug)
  const summary = `How ${study.industry.toLowerCase()} teams moved from reactive planning to a prioritized, explainable decision flow with Coodra.`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: study.title,
    description: summary,
    image: 'https://www.coodra.com/og-image.png',
    author: { '@id': 'https://www.coodra.com/#organization' },
    publisher: { '@id': 'https://www.coodra.com/#organization' },
    url: `https://www.coodra.com/case-studies/${study.slug}`,
    inLanguage: 'en',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.coodra.com/case-studies/${study.slug}` },
    about: study.industry,
    keywords: ['case study', 'retail operations', 'inventory decisions', 'margin improvement'],
  }

  return (
    <div className="csd-page">
      <MarketingHeader />

      <main className="csd-main" ref={heroRef}>

        {/* ── Hero card ── */}
        <section className={`csd-hero ${heroVisible ? 'csd-hero--visible' : ''}`} aria-label="Case study overview">
          {/* Breadcrumb */}
          <div className="csd-breadcrumbs">
            <Link to="/case-studies" className="csd-breadcrumb-home">
              <svg viewBox="0 0 16 16" fill="none" width="14" height="14" aria-hidden="true">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All case studies
            </Link>
          </div>

          <div className="csd-hero__header">
            <div className="csd-hero__meta">
              <span className="csd-chip csd-chip--teal">{study.industry}</span>
              <span className="csd-chip">
                <svg viewBox="0 0 16 16" fill="none" width="12" height="12" aria-hidden="true">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                {study.footprint}
              </span>
            </div>
            <h1 className="csd-hero__title">{study.title}</h1>
            <p className="csd-hero__sub">{summary}</p>
          </div>

          {/* Animated metric rings */}
          <div className="csd-hero__rings" role="list" aria-label="Key outcomes">
            {study.results.map((metric, i) => (
              <MetricRing key={metric.label} metric={metric} delay={i * 200} />
            ))}
          </div>
        </section>

        {/* ── Body layout ── */}
        <div className="csd-layout">

          {/* Left: story */}
          <article className="csd-story" aria-label="Case study narrative">
            <section className="csd-block">
              <div className="csd-block__eyebrow">
                <svg viewBox="0 0 16 16" fill="none" width="14" height="14" aria-hidden="true">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M5 8.5l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                The Challenge
              </div>
              <h2 className="csd-block__heading">The operational bottleneck</h2>
              <p className="csd-block__text">{study.challenge}</p>
            </section>

            <section className="csd-block">
              <div className="csd-block__eyebrow">
                <svg viewBox="0 0 16 16" fill="none" width="14" height="14" aria-hidden="true">
                  <rect x="2" y="5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M5 5V4a3 3 0 0 1 6 0v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                The Approach
              </div>
              <h2 className="csd-block__heading">The decisioning workflow</h2>
              <p className="csd-block__text">{study.approach}</p>
            </section>

            <section className="csd-block csd-block--outcomes">
              <div className="csd-block__eyebrow">
                <svg viewBox="0 0 16 16" fill="none" width="14" height="14" aria-hidden="true">
                  <path d="M8 2v12M2 8l6-6 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                The Outcomes
              </div>
              <h2 className="csd-block__heading">Measurable impact in weeks</h2>

              <div className="csd-outcomes-grid" role="list">
                {study.results.map((metric) => (
                  <div className="csd-outcome-card" role="listitem" key={metric.label}>
                    <span className="csd-outcome-card__value">{metric.value}</span>
                    <span className="csd-outcome-card__label">{metric.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Quote */}
            <figure className="csd-quote" aria-label="Customer quote">
              <div className="csd-quote__mark" aria-hidden="true">"</div>
              <blockquote className="csd-quote__text">{study.quote}</blockquote>
              <figcaption className="csd-quote__cite">{study.quoteRole}</figcaption>
            </figure>

            {/* Consent notice */}
            <p className="csd-consent">{consentNotice}</p>

            {/* Related */}
            {related.length > 0 && (
              <section className="csd-related" aria-label="Related case studies">
                <h3 className="csd-related__heading">More implementation stories</h3>
                <div className="csd-related__grid">
                  {related.map((item) => (
                    <Link to={`/case-studies/${item.slug}`} className="csd-related-card" key={item.slug}>
                      <div className="csd-related-card__top">
                        <span className="csd-related-card__industry">{item.industry}</span>
                        <svg viewBox="0 0 16 16" fill="none" width="14" height="14" aria-hidden="true">
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="csd-related-card__title">{item.title}</p>
                      <p className="csd-related-card__metric">
                        {item.results[0]?.value} — {item.results[0]?.label}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <Link to="/case-studies" className="csd-back-link">
              <svg viewBox="0 0 16 16" fill="none" width="14" height="14" aria-hidden="true">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All case studies
            </Link>
          </article>

          {/* Right: sidebar */}
          <aside className="csd-sidebar" aria-label="Case study sidebar">

            {/* Company snapshot */}
            <div className="csd-panel">
              <p className="csd-panel__label">Company snapshot</p>
              <dl className="csd-facts">
                <div className="csd-fact">
                  <dt>Industry</dt>
                  <dd>{study.industry}</dd>
                </div>
                <div className="csd-fact">
                  <dt>Store footprint</dt>
                  <dd>{study.footprint}</dd>
                </div>
                <div className="csd-fact">
                  <dt>Engagement type</dt>
                  <dd>Inventory decisioning</dd>
                </div>
              </dl>
            </div>

            {/* Results panel */}
            <div className="csd-panel csd-panel--teal">
              <p className="csd-panel__label">Performance outcomes</p>
              <ul className="csd-results-list">
                {study.results.map((metric) => (
                  <li key={metric.label} className="csd-result-item">
                    <span className="csd-result-item__label">{metric.label}</span>
                    <span className="csd-result-item__value">{metric.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA panel */}
            <div className="csd-panel csd-panel--cta">
              <p className="csd-panel__label">Get similar results</p>
              <p className="csd-panel__text">
                Coodra can model your margin, stock health, and decision velocity before rollout — with your actual POS data.
              </p>
              <Link to="/contact" className="csd-panel__cta">
                <svg viewBox="0 0 16 16" fill="none" width="14" height="14" aria-hidden="true">
                  <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Talk to our team
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <MarketingFooter />
    </div>
  )
}
