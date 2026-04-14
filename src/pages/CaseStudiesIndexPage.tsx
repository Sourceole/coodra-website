import { Link } from 'react-router'
import { caseStudies, consentNotice } from '../data/caseStudies'
import MarketingHeader from '../components/MarketingHeader'
import './CaseStudiesPage.css'

export default function CaseStudiesIndexPage() {
  return (
    <div className="case-page">
      <div className="case-page__container">
        <MarketingHeader />

        <section className="case-hero">
          <p className="case-hero__eyebrow">Case Studies</p>
          <h1>How retail teams act faster with Coodra.</h1>
          <p>
            Two implementation-ready case study templates are live now so your team can evaluate
            challenge, approach, and measurable impact in one structure.
          </p>
        </section>

        <p className="case-consent">{consentNotice}</p>

        <section className="case-grid" aria-label="Case study list">
          {caseStudies.map((study) => (
            <article key={study.slug} className="case-card">
              <p className="case-card__meta">{study.industry} - {study.footprint}</p>
              <h2>{study.title}</h2>
              <p>{study.challenge}</p>
              <div className="case-metrics">
                {study.results.map((metric) => (
                  <div key={metric.label} className="case-metric">
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                  </div>
                ))}
              </div>
              <Link to={`/case-studies/${study.slug}`} className="case-card__link">
                Read case study
              </Link>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}
