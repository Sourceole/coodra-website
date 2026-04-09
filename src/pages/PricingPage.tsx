import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './PricingPage.css'

type Tier = {
  name: string
  monthlyPrice: number | 'Custom'
  yearlyPrice: number | 'Custom'
  description: string
  cta: string
  popular?: boolean
  items: string[]
}

const YEARLY_DISCOUNT_LABEL = 'Save 18%'

const tiers: Tier[] = [
  {
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Start free. No credit card. Connect your POS in 5 minutes.',
    cta: 'Start Free',
    items: [
      '1 store',
      '500 products tracked',
      '75 AI decisions / month',
      'Reorder, replace, remove decisions',
      'Basic margin insights',
      'POS included: Shopify, Square, Lightspeed, Clover, Moneris',
      '1 team member',
    ],
  },
  {
    name: 'Starter',
    monthlyPrice: 79,
    yearlyPrice: 777,
    description: 'For solo retailers ready to stop guessing and start knowing.',
    cta: 'Choose Starter',
    items: [
      'Everything in Free',
      '2,500 products tracked',
      '500 AI decisions / month',
      'Category performance',
      'Export data',
      'POS included: Shopify, Square, Lightspeed, Clover, Moneris',
      '2 team members',
      'No per-seat fees',
    ],
  },
  {
    name: 'Growth',
    monthlyPrice: 199,
    yearlyPrice: 1957,
    description: 'For retailers ready to let Coodra run full product strategy.',
    cta: 'Choose Growth',
    popular: true,
    items: [
      'Everything in Starter',
      '5 stores',
      '10,000 products tracked',
      'Unlimited AI decisions',
      'Market signals and trend detection',
      'Inventory risk alerts',
      'POS included: Shopify, Square, Lightspeed, Clover, Moneris',
      '10 team members',
      'No per-seat fees',
    ],
  },
  {
    name: 'Pro',
    monthlyPrice: 349,
    yearlyPrice: 3434,
    description: 'For growing retailers with multiple locations.',
    cta: 'Choose Pro',
    items: [
      'Everything in Growth',
      '15 stores',
      'Unlimited products',
      'Priority support',
      'Custom alerts',
      'POS included: Shopify, Square, Lightspeed, Clover, Moneris',
      '25 team members',
      'No per-seat fees',
    ],
  },
  {
    name: 'Enterprise',
    monthlyPrice: 'Custom',
    yearlyPrice: 'Custom',
    description: 'For large retail operations that need custom everything.',
    cta: 'Talk to Sales',
    items: [
      'Everything in Pro',
      'Unlimited stores',
      'Dedicated CSM',
      'Custom integrations',
      'SLA',
      'API access',
      'Unlimited team members',
    ],
  },
]

const features = [
  ['Stores', '1', '1', '5', '15', 'Unlimited'],
  ['Products tracked', '500', '2,500', '10,000', 'Unlimited', 'Unlimited'],
  ['AI decisions / month', '75', '500', 'Unlimited', 'Unlimited', 'Unlimited'],
  ['Team members', '1', '2', '10', '25', 'Unlimited'],
  ['POS integrations included', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes'],
  ['Reorder / Replace / Remove', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes'],
  ['Category performance', '-', 'Yes', 'Yes', 'Yes', 'Yes'],
  ['Market signals', '-', '-', 'Yes', 'Yes', 'Yes'],
  ['Trend detection', '-', '-', 'Yes', 'Yes', 'Yes'],
  ['Inventory risk alerts', '-', '-', 'Yes', 'Yes', 'Yes'],
  ['Priority support', '-', '-', '-', 'Yes', 'Yes'],
  ['Custom alerts', '-', '-', '-', 'Yes', 'Yes'],
  ['API access', '-', '-', '-', '-', 'Yes'],
]

function formatPrice(value: number | 'Custom', yearly: boolean) {
  if (value === 'Custom') return 'Custom'
  return `$${value.toLocaleString()}${yearly ? '/year' : '/month'}`
}

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const toggleBillingPeriod = () => setIsYearly((prev) => !prev)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light')
    return () => {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [])

  const displayTiers = useMemo(
    () =>
      tiers.map((tier) => ({
        ...tier,
        displayPrice: formatPrice(isYearly ? tier.yearlyPrice : tier.monthlyPrice, isYearly),
      })),
    [isYearly],
  )

  return (
    <div className="pricing-page">
      <header className="site-header pricing-header">
        <nav className="nav container pricing-nav" aria-label="Pricing navigation">
          <Link className="brand pricing-brand" to="/">
            <img className="coodra-logo-img" src="/images/coodra-logo.png" alt="Coodra" />
          </Link>
          <div className="nav-links pricing-links">
            <a href="/#how-it-works">How it works</a>
            <a href="/#decision">Decision Engine</a>
            <a href="/#proof">Proof</a>
            <Link className="is-active" to="/pricing">
              Pricing
            </Link>
          </div>
          <div className="nav-actions pricing-actions">
            <Link className="btn btn-ghost pricing-btn" to="/login">
              Sign in
            </Link>
            <Link className="btn btn-primary pricing-btn" to="/signup">
              Start Free
            </Link>
          </div>
        </nav>
      </header>

      <main className="container pricing-main">
        <section className="pricing-hero">
          <h1>Pricing that scales with your retail footprint</h1>
          <p>Connect POS once, then let Coodra run smarter decisions every day.</p>
          <div
            className="pricing-billing-switch"
            role="tablist"
            aria-label="Billing period"
            onClick={toggleBillingPeriod}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                toggleBillingPeriod()
              }
            }}
            tabIndex={0}
          >
            <button type="button" role="tab" aria-selected={!isYearly} className={`billing-option ${!isYearly ? 'is-active' : ''}`}>
              Monthly
            </button>
            <button type="button" role="tab" aria-selected={isYearly} className={`billing-option ${isYearly ? 'is-active' : ''}`}>
              Yearly <span className="billing-discount">{YEARLY_DISCOUNT_LABEL}</span>
            </button>
            <span className={`billing-knob ${isYearly ? 'is-yearly' : ''}`} aria-hidden="true" />
          </div>
        </section>

        <section className="pricing-grid">
          {displayTiers.map((tier) => (
            <article className={`price-card ${tier.popular ? 'is-popular' : ''}`} key={tier.name}>
              {tier.popular ? <span className="popular-badge">Most Popular</span> : null}
              <p className="tier-name">{tier.name}</p>
              <p className="tier-price">{tier.displayPrice}</p>
              <p className="tier-desc">{tier.description}</p>
              <ul className="tier-list">
                {tier.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link className={`btn pricing-btn ${tier.popular ? 'btn-primary pricing-btn-primary' : 'btn-ghost pricing-btn-ghost'}`} to="/signup">
                {tier.cta}
              </Link>
            </article>
          ))}
        </section>

        <section className="pricing-features-section" aria-label="Feature comparison section">
          <header className="pricing-features-head">
            <p className="eyebrow">Feature Breakdown</p>
            <h2>Every plan, side by side.</h2>
          </header>
          <div className="pricing-table-wrap">
            <table className="pricing-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Free</th>
                  <th>Starter</th>
                  <th>Growth</th>
                  <th>Pro</th>
                  <th>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {features.map((row) => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td className={row[1] === 'Yes' ? 'check-yes' : row[1] === '-' ? 'check-dash' : ''}>{row[1]}</td>
                    <td className={row[2] === 'Yes' ? 'check-yes' : row[2] === '-' ? 'check-dash' : ''}>{row[2]}</td>
                    <td className={row[3] === 'Yes' ? 'check-yes' : row[3] === '-' ? 'check-dash' : ''}>{row[3]}</td>
                    <td className={row[4] === 'Yes' ? 'check-yes' : row[4] === '-' ? 'check-dash' : ''}>{row[4]}</td>
                    <td className={row[5] === 'Yes' ? 'check-yes' : row[5] === '-' ? 'check-dash' : ''}>{row[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}

