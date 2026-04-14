import { Link, useParams } from 'react-router'
import { caseStudies, consentNotice, getCaseStudyBySlug } from '../data/caseStudies'
import MarketingHeader from '../components/MarketingHeader'
import './CaseStudiesPage.css'

export default function CaseStudyDetailPage() {
  const { slug = '' } = useParams()
  const study = getCaseStudyBySlug(slug)

  if (!study) {
    return (
      <div className="case-page">
        <div className="case-page__container">
          <MarketingHeader />

          <article className="case-article">
            <p className="case-crumbs">Home {'>'} Case Studies</p>
            <h1>Case study not found</h1>
            <p>We could not find the case study you requested.</p>
            <Link to="/case-studies" className="case-back">Return to case studies</Link>
          </article>
        </div>
      </div>
    )
  }

  const related = caseStudies.filter((item) => item.slug !== study.slug).slice(0, 1)

  return (
    <div className="case-page">
      <div className="case-page__container">
        <MarketingHeader />

        <p className="case-consent">{consentNotice}</p>

        <article className="case-article">
          <p className="case-crumbs">Home {'>'} Case Studies {'>'} {study.title}</p>
          <h1>{study.title}</h1>
          <p className="case-article__sub">{study.industry} - {study.footprint}</p>

          <h2>Challenge</h2>
          <p>{study.challenge}</p>

          <h2>Approach</h2>
          <p>{study.approach}</p>

          <h2>Results</h2>
          <div className="case-metrics">
            {study.results.map((metric) => (
              <div key={metric.label} className="case-metric">
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>

          <div className="case-quote">
            <blockquote>"{study.quote}"</blockquote>
            <cite>{study.quoteRole}</cite>
          </div>

          {related.length > 0 ? (
            <>
              <h2>Related case study</h2>
              <p>
                <Link to={`/case-studies/${related[0].slug}`}>{related[0].title}</Link>
              </p>
            </>
          ) : null}

          <Link to="/case-studies" className="case-back">Back to all case studies</Link>
        </article>
      </div>
    </div>
  )
}
