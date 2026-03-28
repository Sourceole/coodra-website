import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './PricingPage.css'

const tiers = [
  {
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Explore how Coodra analyzes your store.',
    cta: 'Start Free',
    popular: false,
    items: ['1 store', '250 products analyzed', '20 AI decisions per month', 'Reorder decisions', 'Basic margin insights'],
  },
  {
    name: 'Starter',
    monthlyPrice: 49,
    yearlyPrice: 490,
    description: 'For small retailers running everyday decisions.',
    cta: 'Choose Starter',
    popular: false,
    items: ['1 store', '1,000 products analyzed', '200 AI decisions per month', 'Reorder, replace, remove decisions', 'Margin insights', 'Category performance'],
  },
  {
    name: 'Growth',
    monthlyPrice: 199,
    yearlyPrice: 1990,
    description: 'For retailers who want Coodra actively running product decisions.',
    cta: 'Choose Growth',
    popular: true,
    items: ['5 stores', '10,000 products analyzed', 'Unlimited AI decisions', 'Market signals', 'Trend detection', 'Inventory alerts', 'Team members'],
  },
  {
    name: 'Enterprise',
    monthlyPrice: 'Custom',
    yearlyPrice: 'Custom',
    description: 'For multi-location and large retail operations.',
    cta: 'Talk to Sales',
    popular: false,
    items: ['Unlimited stores', 'Unlimited products analyzed', 'Unlimited AI decisions', 'Custom integrations', 'Dedicated support'],
  },
]

const features = [
  ['Stores', '1', '1', '5', 'Unlimited'],
  ['Products analyzed', '250', '1,000', '10,000', 'Unlimited'],
  ['AI decisions per month', '20', '200', 'Unlimited', 'Unlimited'],
  ['Reorder decisions', 'Yes', 'Yes', 'Yes', 'Yes'],
  ['Replace decisions', '-', 'Yes', 'Yes', 'Yes'],
  ['Remove decisions', '-', 'Yes', 'Yes', 'Yes'],
  ['Margin insights', 'Basic', 'Yes', 'Yes', 'Yes'],
  ['Category performance', '-', 'Yes', 'Yes', 'Yes'],
  ['Market signals', '-', '-', 'Yes', 'Yes'],
  ['Trend detection', '-', '-', 'Yes', 'Yes'],
  ['Inventory risk alerts', '-', '-', 'Yes', 'Yes'],
  ['Team members', '1', '2', '10', 'Unlimited'],
  ['Exports', '-', 'Yes', 'Yes', 'Yes'],
  ['API access', '-', '-', '-', 'Yes'],
]

function AnimatedPriceNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value)
  const previousValue = useRef(value)

  useEffect(() => {
    const from = previousValue.current
    const to = value
    const duration = 420
    const start = performance.now()
    let rafId = 0

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const next = Math.round(from + (to - from) * eased)
      setDisplayValue(next)
      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        previousValue.current = to
      }
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [value])

  return <>{displayValue.toLocaleString()}</>
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
            <Link className="is-active" to="/pricing">Pricing</Link>
          </div>
          <div className="nav-actions pricing-actions">
            <Link className="btn btn-ghost pricing-btn" to="/login">Sign in</Link>
            <Link className="btn btn-primary pricing-btn" to="/signup">Start Free</Link>
          </div>
        </nav>
      </header>

      <main className="container pricing-main">
        <section className="pricing-hero">
          <h1>Pricing that grows with your store</h1>
          <p>Start free. Upgrade as Coodra runs more of your retail decisions.</p>
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
            <button
              type="button"
              role="tab"
              aria-selected={!isYearly}
              className={`billing-option ${!isYearly ? 'is-active' : ''}`}
            >
              Monthly
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isYearly}
              className={`billing-option ${isYearly ? 'is-active' : ''}`}
            >
              Yearly
            </button>
            <span className={`billing-knob ${isYearly ? 'is-yearly' : ''}`} aria-hidden="true" />
          </div>
        </section>

        <section className="pricing-grid">
          {tiers.map((tier) => (
            <article className={`price-card ${tier.popular ? 'is-popular' : ''}`} key={tier.name}>
              {tier.popular ? <span className="popular-sheen" aria-hidden="true" /> : null}
              {tier.popular ? <span className="popular-badge">Most Popular</span> : null}
              <p className="tier-name">{tier.name}</p>
              <p className="tier-price">
                {typeof tier.monthlyPrice === 'number' ? (
                  <>
                    $
                    <AnimatedPriceNumber value={isYearly ? (tier.yearlyPrice as number) : tier.monthlyPrice} />
                    <span>{isYearly ? '/year' : '/month'}</span>
                  </>
                ) : (
                  <>
                    {tier.monthlyPrice}
                    <span />
                  </>
                )}
              </p>
              <p className="tier-desc">{tier.description}</p>
              <ul className="tier-list">
                {tier.items.map((item) => <li key={item}>{item}</li>)}
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
            <h2>Compare every feature side by side.</h2>
          </header>
          <div className="pricing-table-wrap">
            <table className="pricing-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Free</th>
                  <th>Starter</th>
                  <th>Growth</th>
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
