import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { caseStudies } from '../data/caseStudies'
import MarketingHeader from '../components/MarketingHeader'
import MarketingFooter from '../components/MarketingFooter'
import './CaseStudiesIndexPage.css'

type CaseCategory = 'All' | 'Jewelry' | 'Grocery' | 'Pet Supply' | 'Pharmacy' | 'Multi-location'

const filters: CaseCategory[] = ['All', 'Jewelry', 'Grocery', 'Pet Supply', 'Pharmacy', 'Multi-location']

const categoryBySlug: Record<string, Exclude<CaseCategory, 'All'>> = {
  'multi-location-grocery-margin-recovery': 'Grocery',
  'specialty-retail-inventory-risk-control': 'Multi-location',
}

export default function CaseStudiesIndexPage() {
  const [activeFilter, setActiveFilter] = useState<CaseCategory>('All')

  const filteredStudies = useMemo(() => {
    if (activeFilter === 'All') return caseStudies

    return caseStudies.filter((study) => {
      const category = categoryBySlug[study.slug]
      return category === activeFilter
    })
  }, [activeFilter])

  return (
    <div className="case-index-page">
      <MarketingHeader />

      <main>
        <section className="case-index-hero" aria-label="Customer stories hero">
          <div className="case-index-container case-index-hero-inner">
            <p className="case-index-eyebrow">Customer Stories</p>
            <h1>Retailers making smarter moves, every day.</h1>
            <p>
              Real implementation stories showing how teams move from signal to action with clearer priorities and faster approvals.
            </p>
          </div>
        </section>

        <section className="case-index-library" aria-label="Case studies library">
          <div className="case-index-container">
            <div className="case-filter-bar" role="tablist" aria-label="Case study filters">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={activeFilter === filter}
                  className={`case-filter-pill${activeFilter === filter ? ' active' : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="case-study-grid">
              {filteredStudies.map((study) => (
                <article key={study.slug} className="case-study-card">
                  <div className="case-study-img" aria-hidden="true">
                    <span>{study.industry}</span>
                  </div>

                  <div className="case-study-body">
                    <p className="case-study-industry">{study.industry}</p>
                    <h3>{study.title}</h3>
                    <p>{study.challenge}</p>
                    <Link to={`/case-studies/${study.slug}`} className="case-study-link">
                      Read story &rarr;
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="case-index-cta" aria-label="Case studies CTA">
          <div className="case-index-container case-index-cta-inner">
            <h2>Your story could be next.</h2>
            <Link to="/contact" className="case-index-cta-btn">Talk to our team</Link>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}
