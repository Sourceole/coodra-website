import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import {
  CheckCircle2,
  Cog,
  Database,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import MarketingHeader from '../components/MarketingHeader'
import MarketingFooter from '../components/MarketingFooter'
import './IntegrationsPage.css'

type IntegrationCard = {
  name: string
  logo: string
  logoWordmark: string
  logoWordmarkClass?: string
  summary: string
  bullets: string[]
  metricLabel: string
  metricValue: string
  metricDelta: string
  badge: string
  category: 'POS' | 'Ecommerce' | 'Payments'
}

type CapabilityCard = {
  title: string
  body: string
  icon: 'sync' | 'rank' | 'approve' | 'control'
}

type StepCard = {
  step: string
  title: string
  body: string
  image: string
}

const integrations: IntegrationCard[] = [
  {
    name: 'Shopify',
    logo: '/images/integrations/shopify.png',
    logoWordmark: '/images/integrations/wordmarks/shopify.svg',
    summary: 'Sync orders, customers, inventory, and catalogs to power smarter retail decisions.',
    bullets: ['Orders & customers', 'Catalog sync', 'Inventory updates', 'Payout reconciliation'],
    metricLabel: 'Revenue (30d)',
    metricValue: '$98,420',
    metricDelta: '+18.6%',
    badge: 'Popular',
    category: 'Ecommerce',
  },
  {
    name: 'Square',
    logo: '/images/integrations/square.png',
    logoWordmark: '/images/integrations/wordmarks/square.svg',
    summary: 'Connect in-person sales and payments from every location and channel.',
    bullets: ['POS sales & refunds', 'Item & variant sync', 'Payment details', 'Location performance'],
    metricLabel: 'Transactions (30d)',
    metricValue: '1,248',
    metricDelta: '+12.3%',
    badge: 'Core integration',
    category: 'POS',
  },
  {
    name: 'Lightspeed',
    logo: '/images/integrations/lightspeed.png',
    logoWordmark: '/images/integrations/wordmarks/lightspeed.svg',
    summary: 'Bring real-time retail data and inventory into Coodra for intelligent actions.',
    bullets: ['Sell & inventory sync', 'Refunds & returns', 'Vendor reporting', 'Location performance'],
    metricLabel: 'GMV (30d)',
    metricValue: '$76,210',
    metricDelta: '+14.2%',
    badge: 'Popular',
    category: 'POS',
  },
  {
    name: 'Clover',
    logo: '/images/integrations/clover.png',
    logoWordmark: '/images/integrations/wordmarks/clover-logotyp-tight.svg',
    logoWordmarkClass: 'is-clover',
    summary: 'Track transactions and item-level data to uncover growth opportunities.',
    bullets: ['Transaction details', 'Items & categories', 'Tax & tips', 'Payout reconciliation'],
    metricLabel: 'Sales (30d)',
    metricValue: '$62,340',
    metricDelta: '+9.8%',
    badge: 'Available',
    category: 'POS',
  },
  {
    name: 'Moneris',
    logo: '/images/integrations/moneris.png',
    logoWordmark: '/images/integrations/wordmarks/moneris.png',
    logoWordmarkClass: 'is-moneris',
    summary: 'Reconcile payments and settlements with confidence and speed.',
    bullets: ['Payment capture', 'Settlement reports', 'Fees & chargebacks', 'Daily reconciliation'],
    metricLabel: 'Settlements (30d)',
    metricValue: '$61,870',
    metricDelta: '+11.7%',
    badge: 'Available',
    category: 'Payments',
  },
]

const capabilityCards: CapabilityCard[] = [
  {
    title: 'Sync sales and inventory',
    body: 'Automatically pull the right data from every system, then keep it clean and always up to date.',
    icon: 'sync',
  },
  {
    title: 'Surface ranked actions',
    body: 'Coodra turns data into prioritized actions so you know what to do and why it will work.',
    icon: 'rank',
  },
  {
    title: 'Approve with context',
    body: 'See expected impact, metrics, and drivers behind every recommendation before you act.',
    icon: 'approve',
  },
  {
    title: 'Stay in control',
    body: 'Every action is human-reviewed and easy to trace through one clean workflow.',
    icon: 'control',
  },
]

const steps: StepCard[] = [
  {
    step: '1',
    title: 'Connect your systems',
    body: 'Choose your platforms and securely connect in just a few clicks.',
    image: '/images/integrations-v3/step-1.png',
  },
  {
    step: '2',
    title: 'Coodra analyzes your data',
    body: 'We normalize, validate, and analyze your data to find what matters most.',
    image: '/images/integrations-v3/step-2.png',
  },
  {
    step: '3',
    title: 'Get ranked actions',
    body: 'Receive prioritized recommendations with expected impact and confidence.',
    image: '/images/integrations-v3/step-3.png',
  },
]

const filters = ['All', 'POS', 'Ecommerce', 'Payments', 'Popular', 'New']

function iconForCapability(kind: CapabilityCard['icon']) {
  if (kind === 'sync') return <Database size={20} aria-hidden="true" />
  if (kind === 'rank') return <TrendingUp size={20} aria-hidden="true" />
  if (kind === 'approve') return <CheckCircle2 size={20} aria-hidden="true" />
  return <ShieldCheck size={20} aria-hidden="true" />
}

export default function IntegrationsPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [query, setQuery] = useState('')

  const filteredIntegrations = useMemo(() => {
    const lowered = query.trim().toLowerCase()

    return integrations.filter((item) => {
      const byFilter =
        activeFilter === 'All' ||
        activeFilter === 'Popular' ||
        activeFilter === 'New' ||
        item.category === activeFilter

      const byQuery =
        lowered.length === 0 ||
        item.name.toLowerCase().includes(lowered) ||
        item.summary.toLowerCase().includes(lowered) ||
        item.bullets.some((bullet) => bullet.toLowerCase().includes(lowered))

      return byFilter && byQuery
    })
  }, [activeFilter, query])

  return (
    <div className="integrations-redesign-page">
      <MarketingHeader />

      <main className="integrations-redesign-main">
        <section className="integrations-hero" aria-label="Coodra integrations hero">
          <div className="integrations-wrap integrations-hero-grid">
            <div className="integrations-hero-copy">
              <p className="integrations-eyebrow">
                <Sparkles size={14} aria-hidden="true" />
                Coodra Integrations
              </p>
              <h1>Connect the tools you already use.</h1>
              <p>
                Coodra connects with your POS, ecommerce, and payment systems so you can turn raw data into ranked
                actions, fast.
              </p>
              <div className="integrations-hero-actions">
                <Link to="/signup" className="integrations-btn integrations-btn-primary">
                  Start free
                </Link>
                <Link to="/contact" className="integrations-btn integrations-btn-secondary">
                  Request an integration
                </Link>
              </div>

              <div className="integrations-hero-platforms">
                <p>Works with leading platforms</p>
                <div className="integrations-platform-row" role="list" aria-label="Supported integrations">
                  {integrations.map((item, index) => (
                    <div key={item.name} className="integrations-platform-item" role="listitem" aria-label={item.name}>
                      <img
                        src={item.logoWordmark}
                        alt={item.name}
                        className={`integrations-platform-logo ${item.logoWordmarkClass ?? ''}`.trim()}
                      />
                      {index < integrations.length - 1 ? <span className="integrations-platform-divider" aria-hidden="true" /> : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="integrations-hero-visual" aria-label="Integration map visual">
              <img src="/images/integrations-v3/hero.png" alt="Coodra integrations visual" />
            </div>
          </div>
        </section>

        <section className="integrations-directory" aria-label="Integrations directory">
          <div className="integrations-wrap">
            <div className="integrations-toolbar">
              <label className="integrations-search" aria-label="Search integrations">
                <Search size={18} aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search integrations"
                />
              </label>

              <div className="integrations-filter-row" role="tablist" aria-label="Integration filters">
                {filters.map((filter) => (
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

            <div className="integrations-card-grid">
              {filteredIntegrations.map((item) => (
                <article key={item.name} className="integration-card">
                  <header className="integration-card-head">
                    <div className="integration-card-brand">
                      <img src={item.logo} alt={`${item.name} logo`} className="integration-card-logo" />
                      <h3>{item.name}</h3>
                    </div>
                    <span className="integration-card-badge">{item.badge}</span>
                  </header>

                  <p className="integration-card-summary">{item.summary}</p>

                  <ul className="integration-card-bullets">
                    {item.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>

                  <div className="integration-card-metric" aria-label={`${item.name} metric`}>
                    <p>{item.metricLabel}</p>
                    <strong>{item.metricValue}</strong>
                    <span>{item.metricDelta}</span>
                  </div>

                  <footer className="integration-card-foot">
                    <button type="button" className="integration-card-btn">
                      View details
                    </button>
                    <p>
                      <span className="integration-status-dot" aria-hidden="true" />
                      Available
                    </p>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="integrations-capabilities" aria-label="What you can do with integrations">
          <div className="integrations-wrap">
            <h2>What you can do with integrations</h2>
            <div className="integrations-capability-grid">
              {capabilityCards.map((item) => (
                <article key={item.title} className="integrations-capability-card">
                  <span className="integrations-capability-icon" aria-hidden="true">
                    {iconForCapability(item.icon)}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="integrations-steps" aria-label="How connections work">
          <div className="integrations-wrap">
            <h2>How connections work</h2>
            <div className="integrations-steps-grid">
              {steps.map((item, index) => (
                <article key={item.step} className="integration-step-card">
                  <div className="integration-step-copy">
                    <span>{item.step}</span>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                  <img src={item.image} alt={item.title} />
                  {index < steps.length - 1 ? <i aria-hidden="true" /> : null}
                </article>
              ))}
            </div>

            <div className="integrations-trust-row">
              <article>
                <ShieldCheck size={24} aria-hidden="true" />
                <div>
                  <h4>Fast & secure setup</h4>
                  <p>Connect in minutes with read-only access and enterprise-grade security.</p>
                </div>
              </article>
              <article>
                <Cog size={24} aria-hidden="true" />
                <div>
                  <h4>No ERP required</h4>
                  <p>Works with the tools you already use, no complex projects needed.</p>
                </div>
              </article>
              <article>
                <CheckCircle2 size={24} aria-hidden="true" />
                <div>
                  <h4>Human-approved actions</h4>
                  <p>Coodra recommends. You decide. Keep review and control in one workflow.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="integrations-bottom-cta" aria-label="Final integrations call to action">
          <div className="integrations-wrap integrations-bottom-cta-inner">
            <div>
              <h2>Need a connector that is not listed yet?</h2>
              <p>Tell us your stack and we will map the fastest path to connect it.</p>
            </div>
            <div className="integrations-bottom-actions">
              <Link to="/contact" className="integrations-btn integrations-btn-primary">
                Request integration
              </Link>
              <Link to="/contact" className="integrations-btn integrations-btn-secondary">
                Talk to sales
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}
