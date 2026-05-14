import { Fragment, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Clock3, Database, ShieldCheck, Sparkles } from 'lucide-react'
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import MarketingHeader from '../components/MarketingHeader'
import MarketingFooter from '../components/MarketingFooter'
import { openEarlyAccessModal } from '../lib/earlyAccessEvents'
import { formatPlanValue, pricingComparisonGroups, pricingPlans } from '../lib/pricingPlans'
import './PricingPage.css'

const faqs = [
  ['What POS systems does Coodra connect to?', 'Coodra connects to Shopify, Square, Lightspeed, and Clover. Moneris support is available by account configuration.'],
  ['Do I need an ERP?', 'No. Coodra does not require an ERP. We connect directly to your POS and inventory sources.'],
  ['Does Coodra place orders automatically?', 'No. Coodra is review-first in the app: it recommends actions, and your team approves or skips each decision.'],
  ['Can I join before public launch?', 'Yes. Coodra is onboarding select retailers through early access so we can verify integrations, data quality, and dashboard workflows with real stores before opening self-serve plans.'],
]

const pricingFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([question, answer]) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: answer,
    },
  })),
}

const pricingHowToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to start Coodra with your POS',
  description:
    'A review-first onboarding flow for independent retailers to connect POS data and begin weekly decision reviews.',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Connect your POS',
      text: 'Connect Shopify, Square, Lightspeed, or Clover so sales and inventory data can sync.',
    },
    {
      '@type': 'HowToStep',
      name: 'Review ranked recommendations',
      text: 'Review weekly reorder and margin opportunities sorted by impact.',
    },
    {
      '@type': 'HowToStep',
      name: 'Approve actions',
      text: 'Approve high-confidence actions with context and projected impact.',
    },
  ],
}

function AnimatedPriceValue({ amount, reduceMotion }: { amount: number | 'Custom'; reduceMotion: boolean }) {
  const [display, setDisplay] = useState(typeof amount === 'number' ? amount : 0)
  const motionAmount = useMotionValue(typeof amount === 'number' ? amount : 0)
  const roundedAmount = useTransform(motionAmount, (latest) => Math.round(latest))

  useMotionValueEvent(roundedAmount, 'change', (latest) => {
    setDisplay(latest)
  })

  useEffect(() => {
    if (typeof amount !== 'number') {
      motionAmount.set(0)
      return
    }

    if (reduceMotion) {
      motionAmount.set(amount)
      return
    }

    const controls = animate(motionAmount, amount, {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })

    return () => controls.stop()
  }, [amount, motionAmount, reduceMotion])

  if (amount === 'Custom') {
    return <span className="price-value">Custom</span>
  }

  return <span className="price-value">${display.toLocaleString()}</span>
}

function Cell({ value }: { value: string }) {
  if (value === 'Included') return <span className="pricing-check">{'\u2713'}</span>
  if (value === 'Not included') return <span className="pricing-dash">{'\u2014'}</span>
  return <span>{value}</span>
}

export default function PricingPage() {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.22 })
  const heroParallaxY = useTransform(smoothProgress, [0, 0.25], [0, -22])
  const heroParallaxScale = useTransform(smoothProgress, [0, 0.25], [1, 1.02])

  const priceTiers = useMemo(
    () =>
      pricingPlans.map((tier) => ({
        ...tier,
        displayPrice: tier.price,
        cta: tier.key === 'enterprise' ? 'Talk to Coodra' : 'Request Early Access',
        ctaHref: tier.key === 'enterprise' ? '/contact?intent=enterprise' : ''
      })),
    [],
  )

  const sectionReveal = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 26 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.16 },
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
      }

  return (
    <div className="pricing-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingFaqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingHowToJsonLd) }}
      />
      <MarketingHeader />
      <motion.div className="pricing-scroll-progress" style={{ scaleX: smoothProgress }} />

      <main className="pricing-main-v2">
        <motion.section className="pricing-hero-v2" {...sectionReveal}>
          <div className="container pricing-hero-grid">
            <div className="pricing-hero-copy">
              <p className="pricing-eyebrow-v2">Early access</p>
              <h1>Join Coodra before public launch</h1>
              <p>Coodra is currently onboarding select retailers with guided setup so we can verify integrations, dashboard workflows, and recommendation quality before opening self-serve plans.</p>

              <div className="pricing-hero-actions">
                <button type="button" className="btn-start" onClick={openEarlyAccessModal}>Request Early Access</button>
                <Link to="/contact?intent=pilot" className="btn-sales">Talk to Coodra</Link>
              </div>
              <div className="pricing-early-access-note">
                <span>Guided onboarding only</span>
                <p>Plan details are shown for transparency. Early access accounts are approved before setup.</p>
              </div>
            </div>

            <motion.div
              className="pricing-hero-media"
              style={reduceMotion ? undefined : { y: heroParallaxY, scale: heroParallaxScale }}
            >
              <picture>
                <source srcSet="/images/pricing/hero-1.webp" type="image/webp" />
                <img
                  src="/images/pricing/hero-1.png"
                  alt="Coodra pricing hero visual"
                  width={1586}
                  height={992}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
              </picture>
            </motion.div>
          </div>
        </motion.section>

        <motion.section className="container pricing-plans-v2" aria-label="Plans" {...sectionReveal}>
          <div className="pricing-access-banner">
            <div>
              <span>Public self-serve is not open yet</span>
              <p>We are prioritizing early access retailers who can connect real POS and inventory data with our team during onboarding.</p>
            </div>
            <button type="button" onClick={openEarlyAccessModal}>Apply for Early Access</button>
          </div>
          <div className="plan-grid-v2">
            {priceTiers.map((tier, index) => (
              <motion.article
                key={tier.name}
                className={`plan-card-v2${tier.highlighted ? ' is-popular' : ''}`}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={reduceMotion ? undefined : { duration: 0.42, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
              >
                {tier.badge ? <div className="popular-top">{tier.badge}</div> : null}
                <h3>{tier.name}</h3>
                <p className="price">
                  <AnimatedPriceValue amount={tier.displayPrice} reduceMotion={!!reduceMotion} />
                  {tier.displayPrice === 'Custom' ? null : (
                    <span className="price-unit">/month</span>
                  )}
                </p>
                <p className="price-note">Public pricing preview</p>
                <p className="blurb">{tier.description}</p>
                <ul>
                  {tier.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {tier.ctaHref ? (
                  <Link to={tier.ctaHref} className={`plan-btn${tier.highlighted ? ' filled' : ''}`}>
                    {tier.cta}
                  </Link>
                ) : (
                  <button type="button" className={`plan-btn${tier.highlighted ? ' filled' : ''}`} onClick={openEarlyAccessModal}>
                    {tier.cta}
                  </button>
                )}
              </motion.article>
            ))}
          </div>

          <div className="plan-value-bar">
            <div className="value-row">
              <div className="value-feature">
                <span className="value-icon" aria-hidden="true">
                  <Sparkles className="value-icon-svg" />
                </span>
                <div><strong>Decision recommendations</strong><span>Clear, review-first actions your team controls.</span></div>
              </div>
              <div className="value-feature">
                <span className="value-icon" aria-hidden="true">
                  <Clock3 className="value-icon-svg" />
                </span>
                <div><strong>Setup in one day</strong><span>Connect today. Decisions tomorrow.</span></div>
              </div>
              <div className="value-feature">
                <span className="value-icon" aria-hidden="true">
                  <Database className="value-icon-svg" />
                </span>
                <div><strong>No ERP required</strong><span>We connect cleanly to your POS data.</span></div>
              </div>
              <div className="value-feature">
                <span className="value-icon" aria-hidden="true">
                  <ShieldCheck className="value-icon-svg" />
                </span>
                <div><strong>Review-first decisions</strong><span>Your team reviews and approves before execution.</span></div>
              </div>
            </div>
            <div className="value-pos-label">Works with the POS you use</div>
            <div className="value-logo-row">
              <div className="value-logo-item logo-shopify"><img src="/images/integrations/wordmarks/shopify.svg" alt="Shopify" /></div>
              <div className="value-logo-item logo-square"><img src="/images/integrations/wordmarks/square.svg" alt="Square" /></div>
              <div className="value-logo-item logo-lightspeed"><img src="/images/integrations/wordmarks/lightspeed.svg" alt="Lightspeed" /></div>
              <div className="value-logo-item logo-clover"><img src="/images/integrations/wordmarks/clover-logotyp-tight.svg" alt="Clover" /></div>
              <div className="value-logo-item logo-moneris"><img src="/images/integrations/wordmarks/moneris.png" alt="Moneris" /></div>
            </div>
          </div>
        </motion.section>

        <motion.section className="container includes-v2" {...sectionReveal}>
          <div className="includes-copy">
            <p className="pricing-eyebrow-v2">Built for retail. Powered by AI.</p>
            <h2>Early access keeps the workflow review-first</h2>
            <ul>
              <li>Guided connection for POS and inventory data</li>
              <li>Get ranked recommendations by margin &times; urgency</li>
              <li>Ask Coodra Agent what changed and why</li>
              <li>Validate recommendations with your team before public launch</li>
            </ul>
          </div>
          <div className="includes-images">
            <div className="includes-image-card">
              <img src="/images/pricing/includes-2.png" alt="Coodra AI chat preview" loading="lazy" decoding="async" />
            </div>
            <div className="includes-image-card">
              <img src="/images/pricing/includes-3.png" alt="Coodra recommendations preview" loading="lazy" decoding="async" />
            </div>
          </div>
        </motion.section>

        <motion.section className="container sidebyside-v2" {...sectionReveal}>
          <div className="sidebyside-head">
            <h2>Every plan, side by side.</h2>
          </div>
          <div className="sidebyside-table-wrap">
            <table>
              <thead>
                <tr>
                  <th />
                  {pricingPlans.map((plan) => <th key={plan.key}>{plan.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {pricingComparisonGroups.map((group) => (
                  <Fragment key={group.title}>
                    <tr className="pricing-group-row" key={`${group.title}-label`}>
                      <td colSpan={pricingPlans.length + 1}>{group.title}</td>
                    </tr>
                    {group.rows.map(([label, key]) => (
                      <tr key={label}>
                        <td>{label}</td>
                        {pricingPlans.map((plan) => {
                          const raw = key === 'support' || key === 'slaOnboarding'
                            ? plan[key]
                            : key in plan.limits
                              ? plan.limits[key as keyof typeof plan.limits]
                              : plan.features[key as keyof typeof plan.features]
                          return <td key={plan.key}><Cell value={formatPlanValue(raw)} /></td>
                        })}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        <motion.section className="container pricing-faq-v2" {...sectionReveal}>
          <h2>Frequently asked questions</h2>
          <div className="faq-list-v2">
            {faqs.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </motion.section>

        <motion.section className="container pricing-cta-v2" {...sectionReveal}>
          <div className="pricing-cta-card">
            <div className="cta-copy">
              <p className="pricing-eyebrow-v2">Join the pilot</p>
              <h2>Help shape Coodra before public launch.</h2>
              <p>Apply for early access and we will guide setup, verify your connections, and gather feedback from real dashboard use.</p>
            </div>
            <div className="cta-actions">
              <button type="button" className="btn-start" onClick={openEarlyAccessModal}>Request Early Access</button>
              <Link to="/contact?intent=pilot" className="btn-sales">Talk to Coodra</Link>
            </div>
          </div>
        </motion.section>
      </main>

      <MarketingFooter />
    </div>
  )
}

