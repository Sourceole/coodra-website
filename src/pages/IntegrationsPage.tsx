import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Search, ShieldCheck, Sparkles } from 'lucide-react'
import MarketingHeader from '../components/MarketingHeader'
import MarketingFooter from '../components/MarketingFooter'
import './IntegrationsPage.css'

type IntegrationItem = {
  name: string
  logo: string
  summary: string
  bullets: string[]
  category: string
  pricing: string
  rating: string
  reviews: string
}

const integrations: IntegrationItem[] = [
  {
    name: 'Shopify',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/shopify.svg',
    summary: 'Sync catalog, orders, and inventory from Shopify into decision-ready workflows.',
    bullets: ['Catalog sync', 'Order signal sync', 'Inventory updates'],
    category: 'Commerce',
    pricing: 'Free plan available',
    rating: '4.9',
    reviews: '1,248',
  },
  {
    name: 'Square',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/square.svg',
    summary: 'Connect in-store sales and payment events to improve stock and margin actions.',
    bullets: ['POS sales feed', 'Payment events', 'Store-level stock'],
    category: 'POS',
    pricing: 'Free plan available',
    rating: '4.8',
    reviews: '986',
  },
  {
    name: 'Lightspeed',
    logo: '/images/integrations/lightspeed.png?v=20260410',
    summary: 'Bring sell-through and product movement into one operating intelligence layer.',
    bullets: ['Sell-through stream', 'Variant inventory', 'Location performance'],
    category: 'POS',
    pricing: 'Free plan available',
    rating: '4.7',
    reviews: '612',
  },
  {
    name: 'Clover',
    logo: '/images/integrations/clover.png?v=20260410',
    summary: 'Track transaction trends and branch-level movement to prioritize actions fast.',
    bullets: ['Branch sync', 'Transactions stream', 'Category performance'],
    category: 'POS',
    pricing: 'Free plan available',
    rating: '4.8',
    reviews: '734',
  },
  {
    name: 'Moneris',
    logo: '/images/integrations/moneris.png?v=20260410',
    summary: 'Feed payment and settlement data into Coodra for cleaner cash and margin signals.',
    bullets: ['Payment snapshots', 'Settlement sync', 'Revenue trend feed'],
    category: 'Payments',
    pricing: 'Free plan available',
    rating: '4.6',
    reviews: '211',
  },
]

const filterOptions = ['All', 'POS', 'Commerce', 'Payments']

function renderStars(rating: string) {
  const rounded = Math.round(Number(rating))
  return '★'.repeat(Math.max(1, Math.min(5, rounded)))
}

export default function IntegrationsPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [query, setQuery] = useState('')

  const filteredIntegrations = useMemo(() => {
    const lowered = query.trim().toLowerCase()

    return integrations.filter((item) => {
      const byFilter = activeFilter === 'All' || item.category === activeFilter
      const byQuery =
        lowered.length === 0 ||
        item.name.toLowerCase().includes(lowered) ||
        item.summary.toLowerCase().includes(lowered) ||
        item.bullets.some((bullet) => bullet.toLowerCase().includes(lowered))

      return byFilter && byQuery
    })
  }, [activeFilter, query])

  return (
    <div className="integrations-v2-page">
      <MarketingHeader />

      <main className="integrations-v2-main">
        <section className="integrations-v2-hero" aria-label="Integrations hero">
          <div className="integrations-v2-inner">
            <p className="integrations-v2-eyebrow">
              <Sparkles size={14} aria-hidden="true" />
              Coodra Integrations
            </p>
            <h1>Connect the tools you already use.</h1>
            <p>Browse available connectors and launch quickly with clean, reliable operational data.</p>
          </div>
        </section>

        <section className="integrations-v2-directory" aria-label="All integration listings">
          <div className="integrations-v2-inner">
            <div className="integrations-v2-toolbar">
              <label className="integrations-v2-search" aria-label="Search integrations">
                <Search size={16} aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search integrations"
                />
              </label>
              <div className="integrations-v2-filters" role="tablist" aria-label="Integration filters">
                {filterOptions.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    role="tab"
                    aria-selected={activeFilter === filter}
                    className={activeFilter === filter ? 'is-active' : ''}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="integrations-v2-list">
              {filteredIntegrations.map((item) => (
                <article key={item.name} className="integrations-v2-row">
                  <div className="integrations-v2-row__title">
                    <span className="integrations-v2-row__logo">
                      <img src={item.logo} alt={`${item.name} logo`} />
                    </span>
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.summary}</p>
                      <p className="integrations-v2-row__rating">
                        {renderStars(item.rating)} {item.rating} · {item.reviews} reviews
                      </p>
                    </div>
                  </div>
                  <ul>
                    {item.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <div className="integrations-v2-row__meta">
                    <span>{item.pricing}</span>
                    <p>
                      <ShieldCheck size={14} aria-hidden="true" />
                      Verified connector
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="integrations-v2-cta" aria-label="Integrations CTA">
          <div className="integrations-v2-inner">
            <h2>Need a connector that is not listed yet?</h2>
            <p>Tell us your stack and we will map a rollout plan with timeline and ownership.</p>
            <div className="integrations-v2-cta__actions">
              <Link to="/contact" className="integrations-v2-btn integrations-v2-btn--primary">
                Request integration
              </Link>
              <Link to="/security" className="integrations-v2-btn integrations-v2-btn--ghost">
                Review security
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}
