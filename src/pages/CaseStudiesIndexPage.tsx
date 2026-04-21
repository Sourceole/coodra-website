import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { caseStudies } from '../data/caseStudies'
import MarketingHeader from '../components/MarketingHeader'
import MarketingFooter from '../components/MarketingFooter'
import './CaseStudiesIndexPage.css'

type Study = (typeof caseStudies)[number]

function parseMetricValue(value: string): number {
  const match = value.match(/-?\d+(\.\d+)?/)
  if (!match) return 70
  return Math.max(20, Math.min(96, Math.abs(Number(match[0])) * 5))
}

function CaseStudyCard({ study, index }: { study: Study; index: number }) {
  const [visible, setVisible] = useState(false)
  const cardRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const isEven = index % 2 === 0

  return (
    <article
      ref={cardRef}
      className={`cs-card ${visible ? 'cs-card--visible' : ''} ${isEven ? 'cs-card--flip' : ''}`}
      aria-label={study.title}
    >
      {/* Visual side */}
      <div className="cs-card__visual">
        <div className="cs-card__visual-inner">
          <div className="cs-card__industry-icon" aria-hidden="true">
            <IndustryIcon industry={study.industry} />
          </div>
          <div className="cs-card__visual-label">{study.industry}</div>
          <div className="cs-card__visual-footprint">{study.footprint}</div>

          {/* Decorative metric rings */}
          <div className="cs-card__rings" aria-hidden="true">
            <svg viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="90" stroke="rgba(47,215,198,0.12)" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="70" stroke="rgba(47,215,198,0.08)" strokeWidth="1" />
              <circle cx="100" cy="100" r="50" stroke="rgba(47,215,198,0.05)" strokeWidth="1" />
              <circle cx="100" cy="100" r="8" fill="rgba(47,215,198,0.3)" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content side */}
      <div className="cs-card__content">
        <div className="cs-card__eyebrow">
          <span className="cs-card__eyebrow-dot" />
          Case Study
        </div>

        <h2 className="cs-card__title">{study.title}</h2>

        <div className="cs-card__challenge">
          <p className="cs-card__challenge-label">The Challenge</p>
          <p className="cs-card__challenge-text">{study.challenge}</p>
        </div>

        <div className="cs-card__approach">
          <p className="cs-card__approach-label">The Approach</p>
          <p className="cs-card__approach-text">{study.approach}</p>
        </div>

        {/* Metric bars */}
        <div className="cs-card__metrics" role="list" aria-label="Key outcomes">
          {study.results.map((metric, i) => (
            <div
              className="cs-metric-bar"
              role="listitem"
              key={metric.label}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="cs-metric-bar__header">
                <span className="cs-metric-bar__label">{metric.label}</span>
                <span className="cs-metric-bar__value">{metric.value}</span>
              </div>
              <div className="cs-metric-bar__track">
                <div
                  className="cs-metric-bar__fill"
                  style={{
                    width: visible ? `${parseMetricValue(metric.value)}%` : '0%',
                    transitionDelay: `${i * 150 + 300}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Quote */}
        <blockquote className="cs-card__quote">
          <p>"{study.quote}"</p>
          <cite>{study.quoteRole}</cite>
        </blockquote>

        <Link to={`/case-studies/${study.slug}`} className="cs-card__cta">
          Read the full story
          <svg viewBox="0 0 16 16" fill="none" width="16" height="16" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </article>
  )
}

function IndustryIcon({ industry }: { industry: string }) {
  if (industry.toLowerCase().includes('grocery')) {
    return (
      <svg viewBox="0 0 64 64" fill="none" width="64" height="64" aria-hidden="true">
        <rect x="8" y="24" width="48" height="32" rx="4" stroke="#2fd7c6" strokeWidth="2" />
        <path d="M8 32h48" stroke="#2fd7c6" strokeWidth="2" />
        <path d="M20 24V16a12 12 0 0 1 24 0v8" stroke="#2fd7c6" strokeWidth="2" strokeLinecap="round" />
        <circle cx="32" cy="44" r="4" fill="#2fd7c6" opacity="0.6" />
      </svg>
    )
  }
  if (industry.toLowerCase().includes('jewelry')) {
    return (
      <svg viewBox="0 0 64 64" fill="none" width="64" height="64" aria-hidden="true">
        <polygon points="32,8 56,24 56,48 32,56 8,48 8,24" stroke="#2fd7c6" strokeWidth="2" />
        <polygon points="32,20 44,28 44,40 32,44 20,40 20,28" stroke="#2fd7c6" strokeWidth="1.5" opacity="0.6" />
        <line x1="32" y1="8" x2="32" y2="20" stroke="#2fd7c6" strokeWidth="1.5" />
        <line x1="56" y1="24" x2="44" y2="28" stroke="#2fd7c6" strokeWidth="1.5" />
        <line x1="8" y1="24" x2="20" y2="28" stroke="#2fd7c6" strokeWidth="1.5" />
      </svg>
    )
  }
  if (industry.toLowerCase().includes('pharmacy')) {
    return (
      <svg viewBox="0 0 64 64" fill="none" width="64" height="64" aria-hidden="true">
        <rect x="14" y="18" width="36" height="28" rx="4" stroke="#2fd7c6" strokeWidth="2" />
        <path d="M14 28h36" stroke="#2fd7c6" strokeWidth="2" />
        <path d="M32 18V10M26 14l-4-4M38 14l4-4" stroke="#2fd7c6" strokeWidth="2" strokeLinecap="round" />
        <circle cx="26" cy="40" r="3" fill="#2fd7c6" opacity="0.5" />
        <circle cx="38" cy="40" r="3" fill="#2fd7c6" opacity="0.5" />
      </svg>
    )
  }
  if (industry.toLowerCase().includes('pet')) {
    return (
      <svg viewBox="0 0 64 64" fill="none" width="64" height="64" aria-hidden="true">
        <ellipse cx="32" cy="38" rx="18" ry="14" stroke="#2fd7c6" strokeWidth="2" />
        <path d="M16 30c-4-8 0-16 8-16M48 30c4-8 0-16-8-16" stroke="#2fd7c6" strokeWidth="2" strokeLinecap="round" />
        <circle cx="26" cy="36" r="2" fill="#2fd7c6" opacity="0.6" />
        <circle cx="38" cy="36" r="2" fill="#2fd7c6" opacity="0.6" />
        <path d="M28 42c2 2 6 2 8 0" stroke="#2fd7c6" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
  // Default: retail/store icon
  return (
    <svg viewBox="0 0 64 64" fill="none" width="64" height="64" aria-hidden="true">
      <path d="M12 24L32 10l20 14" stroke="#2fd7c6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="8" y="24" width="48" height="32" rx="4" stroke="#2fd7c6" strokeWidth="2" />
      <rect x="26" y="38" width="12" height="18" rx="2" stroke="#2fd7c6" strokeWidth="2" />
      <circle cx="35" cy="47" r="1.5" fill="#2fd7c6" opacity="0.6" />
    </svg>
  )
}

export default function CaseStudiesIndexPage() {
  const [heroVisible, setHeroVisible] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    requestAnimationFrame(() => setHeroVisible(true))
  }, [])

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Coodra Case Studies',
    itemListElement: caseStudies.map((study, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://www.coodra.com/case-studies/${study.slug}`,
      name: study.title,
    })),
  }

  return (
    <div className="cs-index-page">
      <MarketingHeader />

      <main>
        {/* ── Hero ── */}
        <section className="cs-hero" aria-label="Case studies hero" ref={heroRef}>
          <div className="cs-hero__bg" aria-hidden="true">
            <div className="cs-hero__orb cs-hero__orb--1" />
            <div className="cs-hero__orb cs-hero__orb--2" />
            <div className="cs-hero__grid" />
          </div>
          <div className="cs-hero__inner">
            <p className={`cs-hero__eyebrow ${heroVisible ? 'cs-hero__eyebrow--visible' : ''}`}>
              <span className="cs-hero__eyebrow-dot" />
              Customer Stories
            </p>
            <h1 className={`cs-hero__title ${heroVisible ? 'cs-hero__title--visible' : ''}`}>
              What retailers actually accomplish with Coodra
            </h1>
            <p className={`cs-hero__sub ${heroVisible ? 'cs-hero__sub--visible' : ''}`}>
              Real implementations. Anonymized profiles. Specific outcomes — margin uplift, stockout reduction, and decision velocity gains measured in weeks, not quarters.
            </p>
          </div>
        </section>

        {/* ── Case studies ── */}
        <section className="cs-studies" aria-label="Case studies">
          <div className="cs-studies__container">
            <div className="cs-studies__label" aria-hidden="true">
              <span>Implementation Stories</span>
            </div>

            {caseStudies.map((study, i) => (
              <CaseStudyCard key={study.slug} study={study} index={i} />
            ))}

            {/* More coming soon */}
            <div className="cs-more">
              <div className="cs-more__inner">
                <div className="cs-more__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
                    <circle cx="12" cy="12" r="9" stroke="#2fd7c6" strokeWidth="1.5" />
                    <path d="M12 8v4M12 16h.01" stroke="#2fd7c6" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="cs-more__content">
                  <h3>More stories in review</h3>
                  <p>Additional case studies are being finalized with customer consent. Check back soon — or talk to our team about an early pilot in your vertical.</p>
                </div>
                <Link to="/contact" className="cs-more__cta">Talk to our team</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cs-cta" aria-label="Get started">
          <div className="cs-cta__inner">
            <h2 className="cs-cta__title">Ready to run your own story?</h2>
            <p className="cs-cta__sub">Connect your POS. Get your first decision ranked in under 5 minutes.</p>
            <div className="cs-cta__actions">
              <Link to="/signup" className="cs-btn cs-btn--primary">Start free</Link>
              <Link to="/contact" className="cs-btn cs-btn--ghost">Talk to sales</Link>
            </div>
          </div>
        </section>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <MarketingFooter />
    </div>
  )
}
