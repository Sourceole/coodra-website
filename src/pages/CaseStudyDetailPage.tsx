import { Link, useParams } from 'react-router'
import { ArrowUpRight, Building2, ClipboardCheck, Compass, ShieldCheck, Sparkles } from 'lucide-react'
import { caseStudies, consentNotice, getCaseStudyBySlug } from '../data/caseStudies'
import MarketingHeader from '../components/MarketingHeader'
import MarketingFooter from '../components/MarketingFooter'
import './CaseStudyDetailPage.css'

function metricStrength(value: string, index: number) {
  const fallback = [82, 74, 88]
  const numberMatch = value.match(/-?\d+(\.\d+)?/)
  if (!numberMatch) return fallback[index % fallback.length]

  const amount = Math.abs(Number(numberMatch[0]))
  if (Number.isNaN(amount)) return fallback[index % fallback.length]

  return Math.max(48, Math.min(94, Math.round(50 + amount * 6)))
}

export default function CaseStudyDetailPage() {
  const { slug = '' } = useParams()
  const study = getCaseStudyBySlug(slug)

  if (!study) {
    return (
      <div className="case-detail-page">
        <MarketingHeader />
        <main className="case-detail-main">
          <section className="case-detail-not-found">
            <p className="case-detail-crumbs">Home {'>'} Case Studies</p>
            <h1>Case study not found</h1>
            <p>We could not find the case study you requested.</p>
            <Link to="/case-studies" className="case-detail-back">Return to case studies</Link>
          </section>
        </main>
        <MarketingFooter />
      </div>
    )
  }

  const related = caseStudies.filter((item) => item.slug !== study.slug).slice(0, 2)
  const summary =
    `How ${study.industry.toLowerCase()} teams moved from reactive planning to a prioritized, explainable decision flow with Coodra.`

  return (
    <div className="case-detail-page">
      <MarketingHeader />

      <main className="case-detail-main">
        <section className="case-detail-hero">
          <div className="case-detail-hero__top">
            <p className="case-detail-crumbs">Home {'>'} Case Studies {'>'} {study.title}</p>
            <div className="case-detail-chips" aria-label="Case metadata">
              <span className="case-detail-chip case-detail-chip--teal">
                <Sparkles size={14} aria-hidden="true" />
                {study.industry}
              </span>
              <span className="case-detail-chip">
                <Compass size={14} aria-hidden="true" />
                {study.footprint}
              </span>
            </div>
          </div>
          <h1>{study.title}</h1>
          <p className="case-detail-subhead">{summary}</p>

          <div className="case-detail-ribbon" role="list" aria-label="Key outcomes">
            {study.results.map((metric, index) => (
              <div className="case-detail-ribbon__item" role="listitem" key={metric.label}>
                <p>{metric.label}</p>
                <strong>{metric.value}</strong>
                <span style={{ width: `${metricStrength(metric.value, index)}%` }} />
              </div>
            ))}
          </div>
        </section>

        <section className="case-detail-layout" aria-label="Case study details">
          <article className="case-detail-story">
            <section className="case-detail-block">
              <p className="case-detail-block__eyebrow">
                <Building2 size={14} aria-hidden="true" />
                Challenge
              </p>
              <h2>The operational bottleneck</h2>
              <p>{study.challenge}</p>
            </section>

            <section className="case-detail-block">
              <p className="case-detail-block__eyebrow">
                <ClipboardCheck size={14} aria-hidden="true" />
                Intervention
              </p>
              <h2>The decisioning workflow</h2>
              <p>{study.approach}</p>
            </section>

            <section className="case-detail-block">
              <p className="case-detail-block__eyebrow">
                <ArrowUpRight size={14} aria-hidden="true" />
                Outcomes
              </p>
              <h2>Measurable impact in weeks</h2>
              <div className="case-detail-metrics">
                {study.results.map((metric) => (
                  <div key={metric.label} className="case-detail-metric">
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                  </div>
                ))}
              </div>
            </section>

            <figure className="case-detail-quote">
              <blockquote>"{study.quote}"</blockquote>
              <figcaption>{study.quoteRole}</figcaption>
            </figure>

            <p className="case-detail-consent">{consentNotice}</p>

            {related.length > 0 ? (
              <section className="case-detail-related">
                <h3>Related stories</h3>
                <div className="case-detail-related__grid">
                  {related.map((item) => (
                    <Link to={`/case-studies/${item.slug}`} className="case-detail-related__card" key={item.slug}>
                      <span>{item.industry}</span>
                      <strong>{item.title}</strong>
                      <p>{item.results[0]?.value} {item.results[0]?.label.toLowerCase()}</p>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            <Link to="/case-studies" className="case-detail-back">Back to all case studies</Link>
          </article>

          <aside className="case-detail-sidebar">
            <div className="case-detail-panel">
              <p className="case-detail-panel__title">Company snapshot</p>
              <dl className="case-detail-facts">
                <div>
                  <dt>Industry</dt>
                  <dd>{study.industry}</dd>
                </div>
                <div>
                  <dt>Footprint</dt>
                  <dd>{study.footprint}</dd>
                </div>
                <div>
                  <dt>Engagement type</dt>
                  <dd>Inventory decisioning</dd>
                </div>
              </dl>
            </div>

            <div className="case-detail-panel case-detail-panel--navy">
              <p className="case-detail-panel__title">Performance signal</p>
              <ul>
                {study.results.map((metric) => (
                  <li key={metric.label}>
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                  </li>
                ))}
              </ul>
            </div>

            <div className="case-detail-panel">
              <p className="case-detail-panel__title">Need a similar outcome?</p>
              <p>Coodra can model your margin, stock health, and decision velocity before rollout.</p>
              <Link to="/contact" className="case-detail-cta">
                <ShieldCheck size={16} aria-hidden="true" />
                Talk to our team
              </Link>
            </div>
          </aside>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}
