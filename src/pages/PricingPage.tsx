import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import MarketingHeader from '../components/MarketingHeader'
import MarketingFooter from '../components/MarketingFooter'
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

function ComparisonCell({ value }: { value: string }) {
  if (value === 'Yes') {
    return (
      <span className="check-yes" aria-label="Included">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M6.8 11.1 3.9 8.2a.9.9 0 1 1 1.3-1.3l1.6 1.6 4.2-4.2a.9.9 0 0 1 1.3 1.3l-5.5 5.5Z" />
        </svg>
      </span>
    )
  }

  if (value === '-') {
    return <span className="check-dash" aria-hidden="true">-</span>
  }

  return <span>{value}</span>
}

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)

  const displayTiers = useMemo(
    () =>
      tiers.map((tier) => ({
        ...tier,
        displayPrice: formatPrice(isYearly ? tier.yearlyPrice : tier.monthlyPrice, isYearly),
      })),
    [isYearly],
  )

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What POS systems does Coodra connect to?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Coodra connects to Shopify, Square, Lightspeed, Clover, and Moneris. All five POS integrations are included on every plan at no extra cost. You connect your POS once and Coodra syncs your sales and inventory data automatically — no manual exports required.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many stores can I manage?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Free supports 1 store. Starter supports 1 store. Growth supports up to 5 stores. Pro supports up to 15 stores. Enterprise supports unlimited stores.',
        },
      },
      {
        '@type': 'Question',
        name: 'What counts as an "AI decision"?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Each reorder, replace, or remove recommendation that Coodra surfaces counts as one AI decision. Free plans get 75 per month. Starter gets 500 per month. Growth and Pro include unlimited AI decisions.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is there a free plan?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. The Free plan includes 1 store, 500 products tracked, and 75 AI decisions per month at no charge. No credit card required to start.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I add team members?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Free includes 1 team member. Starter includes 2. Growth includes 10. Pro includes 25. Enterprise includes unlimited team members. There are no per-seat fees on Starter, Growth, or Pro.',
        },
      },
      {
        '@type': 'Question',
        name: 'What happens if I exceed my AI decision limit?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'On Free and Starter plans, you will receive a notification when you approach your monthly decision limit. You can upgrade to Growth for unlimited decisions, or wait until your limit resets at the start of the next billing month.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I cancel anytime?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. There are no cancellation fees. You can cancel your subscription at any time from your account settings. If you cancel a paid plan, you will retain access through the end of your current billing period.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does Coodra work for multi-location retailers?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Growth supports up to 5 stores, Pro up to 15 stores, and Enterprise supports unlimited stores. Each store\'s inventory and sales data is tracked separately and aggregated into a single inventory intelligence view.',
        },
      },
    ],
  }

  return (
    <div className="pricing-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <MarketingHeader />

      <main className="pricing-main">
        <section className="pricing-hero" aria-label="Pricing hero">
          <div className="pricing-hero-inner">
            <p className="pricing-eyebrow">Simple Pricing</p>
            <h1>Pricing that scales with your retail footprint</h1>
            <p className="pricing-hero-subhead">Connect POS once, then let Coodra run smarter decisions every day.</p>

            <div className="pricing-billing-switch" role="tablist" aria-label="Billing period">
              <button
                type="button"
                role="tab"
                aria-selected={!isYearly}
                className={`billing-option ${!isYearly ? 'is-active' : ''}`}
                onClick={() => setIsYearly(false)}
              >
                Monthly
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={isYearly}
                className={`billing-option ${isYearly ? 'is-active' : ''}`}
                onClick={() => setIsYearly(true)}
              >
                Yearly <span className="billing-discount">{YEARLY_DISCOUNT_LABEL}</span>
              </button>
              <span className={`billing-knob ${isYearly ? 'is-yearly' : ''}`} aria-hidden="true" />
            </div>
          </div>
        </section>

        <section className="pricing-grid-section" aria-label="Pricing plans">
          <div className="pricing-grid">
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
                <Link className={`pricing-btn ${tier.popular ? 'pricing-btn-primary' : 'pricing-btn-ghost'}`} to="/signup">
                  {tier.cta}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="pricing-features-section" aria-label="Feature comparison section">
          <div className="pricing-features-inner">
            <header className="pricing-features-head">
              <p className="pricing-eyebrow">Feature Breakdown</p>
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
                      <td><ComparisonCell value={row[1]} /></td>
                      <td><ComparisonCell value={row[2]} /></td>
                      <td><ComparisonCell value={row[3]} /></td>
                      <td><ComparisonCell value={row[4]} /></td>
                      <td><ComparisonCell value={row[5]} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="pricing-faq" aria-label="Frequently asked questions">
          <div className="pricing-faq-inner">
            <h2>Frequently asked questions</h2>
            <div className="pricing-faq-grid">
              <details className="faq-item">
                <summary className="faq-question">What POS systems does Coodra connect to?</summary>
                <div className="faq-answer">
                  <p>Coodra connects to Shopify, Square, Lightspeed, Clover, and Moneris. All five POS integrations are included on every plan at no extra cost. You connect your POS once and Coodra syncs your sales and inventory data automatically — no manual exports required.</p>
                </div>
              </details>
              <details className="faq-item">
                <summary className="faq-question">How many stores can I manage?</summary>
                <div className="faq-answer">
                  <p>Free supports 1 store. Starter supports 1 store. Growth supports up to 5 stores. Pro supports up to 15 stores. Enterprise supports unlimited stores. Each additional store beyond your plan limit can be added as an add-on or by upgrading your plan.</p>
                </div>
              </details>
              <details className="faq-item">
                <summary className="faq-question">What counts as an "AI decision"?</summary>
                <div className="faq-answer">
                  <p>Each reorder, replace, or remove recommendation that Coodra surfaces counts as one AI decision. Free plans get 75 per month. Starter gets 500 per month. Growth and Pro include unlimited AI decisions.</p>
                </div>
              </details>
              <details className="faq-item">
                <summary className="faq-question">Is there a free plan?</summary>
                <div className="faq-answer">
                  <p>Yes. The Free plan includes 1 store, 500 products tracked, and 75 AI decisions per month at no charge. No credit card required to start.</p>
                </div>
              </details>
              <details className="faq-item">
                <summary className="faq-question">Can I add team members?</summary>
                <div className="faq-answer">
                  <p>Free includes 1 team member. Starter includes 2. Growth includes 10. Pro includes 25. Enterprise includes unlimited team members. There are no per-seat fees on Starter, Growth, or Pro.</p>
                </div>
              </details>
              <details className="faq-item">
                <summary className="faq-question">What happens if I exceed my AI decision limit?</summary>
                <div className="faq-answer">
                  <p>On Free and Starter plans, you will receive a notification when you approach your monthly decision limit. You can upgrade to Growth for unlimited decisions, or wait until your limit resets at the start of the next billing month.</p>
                </div>
              </details>
              <details className="faq-item">
                <summary className="faq-question">Can I cancel anytime?</summary>
                <div className="faq-answer">
                  <p>Yes. There are no cancellation fees. You can cancel your subscription at any time from your account settings. If you cancel a paid plan, you will retain access through the end of your current billing period.</p>
                </div>
              </details>
              <details className="faq-item">
                <summary className="faq-question">Does Coodra work for multi-location retailers?</summary>
                <div className="faq-answer">
                  <p>Yes. Growth supports up to 5 stores, Pro up to 15 stores, and Enterprise supports unlimited stores. Each store's inventory and sales data is tracked separately and aggregated into a single inventory intelligence view.</p>
                </div>
              </details>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}
