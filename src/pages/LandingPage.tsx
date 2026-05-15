import { useEffect, useRef, type MouseEvent } from 'react'
import { Link } from 'react-router'
import Lenis from 'lenis'
import { trackEvent } from '../lib/analytics'
import MarketingHeader from '../components/MarketingHeader'
import MarketingFooter from '../components/MarketingFooter'
import './LandingPage.css'

const heroTrustRailItems = [
  { name: 'shopify', logoSrc: '/images/integrations/wordmarks/shopify.svg', logoClass: 'hero-v5-trust-logo is-shopify' },
  { name: 'Square', logoSrc: '/images/integrations/wordmarks/square.svg', logoClass: 'hero-v5-trust-logo is-square' },
  { name: 'lightspeed', logoSrc: '/images/integrations/wordmarks/lightspeed.svg', logoClass: 'hero-v5-trust-logo is-lightspeed' },
  {
    name: 'clover',
    logoSrc: '/images/integrations/wordmarks/clover-logotyp-tight.svg',
    logoClass: 'hero-v5-trust-logo is-clover',
  },
  {
    name: 'WooCommerce',
    logoSrc: '/images/integrations/woocommerce.svg',
    logoClass: 'hero-v5-trust-logo is-woocommerce',
  },
  {
    name: 'Odoo',
    logoSrc: '/images/integrations/odoo.svg',
    logoClass: 'hero-v5-trust-logo is-woocommerce',
  },
  {
    name: 'Moneris',
    logoSrc: '/images/integrations/wordmarks/moneris.png',
    logoClass: 'hero-v5-trust-logo is-moneris',
  },
]

const landingHowToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Weekly retail decision workflow for independent stores',
  description:
    'A practical weekly workflow for independent retailers to connect POS signals, analyze demand and inventory changes, and approve ranked actions.',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Connect your systems',
      text: 'Connect POS and inventory sources so Coodra can ingest current sales, stock, and lead-time signals.',
    },
    {
      '@type': 'HowToStep',
      name: 'Review ranked opportunities',
      text: 'Coodra prioritizes reorder, replace, and remove decisions by urgency and margin contribution.',
    },
    {
      '@type': 'HowToStep',
      name: 'Approve actions with context',
      text: 'Review projected impact and approve high-confidence actions in a review-first workflow.',
    },
  ],
}

export default function LandingPage() {
  const ctaCardRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    // Set theme on <html> so CSS vars cascade correctly
    document.documentElement.setAttribute('data-theme', 'light')

    return () => {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [])

  useEffect(() => {
    const section = document.getElementById('proof')
    if (!section) return

    let fired = false
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!fired && entry.isIntersecting && entry.intersectionRatio >= 0.35) {
            fired = true
            trackEvent('impact_section_visible', {
              page_path: '/',
              section_id: 'proof',
            })
          }
        })
      },
      { threshold: [0.35] }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const handleCtaPointerMove = (event: MouseEvent<HTMLElement>) => {
    const node = ctaCardRef.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    node.style.setProperty('--cta-mx', `${Math.max(0, Math.min(100, x))}%`)
    node.style.setProperty('--cta-my', `${Math.max(0, Math.min(100, y))}%`)
  }

  const handleCtaPointerEnter = () => {
    const node = ctaCardRef.current
    if (!node) return
    node.style.setProperty('--cta-glow', '1')
  }

  const handleCtaPointerLeave = () => {
    const node = ctaCardRef.current
    if (!node) return
    node.style.setProperty('--cta-glow', '0')
    node.style.setProperty('--cta-mx', '50%')
    node.style.setProperty('--cta-my', '50%')
  }

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobileOrTablet = window.matchMedia('(max-width: 1024px)').matches
    if (prefersReducedMotion || isMobileOrTablet) return

    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.08,
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 0.92,
      wheelMultiplier: 0.88,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    })

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = window.requestAnimationFrame(raf)
    }

    rafId = window.requestAnimationFrame(raf)
    return () => {
      window.cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return (
    <div className="site-shell" id="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(landingHowToJsonLd) }}
      />
      <MarketingHeader />

      <main>
        {/* Hero */}
        <section className="hero-v5" id="hero">
          <div className="hero-v5-scene" aria-hidden="true">
            <div className="hero-v5-scene-fallback" />
          </div>

          <div className="hero-v5-side hero-v5-side-left" aria-hidden="true">
            <picture>
              <source srcSet="/images/landing/hero-left.webp" type="image/webp" />
              <img
                src="/images/landing/hero-left.png"
                alt=""
                width={1254}
                height={1254}
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </picture>
          </div>
          <div className="hero-v5-side hero-v5-side-right" aria-hidden="true">
            <picture>
              <source srcSet="/images/landing/hero-right.webp" type="image/webp" />
              <img
                src="/images/landing/hero-right.png"
                alt=""
                width={1254}
                height={1254}
                loading="eager"
                decoding="async"
              />
            </picture>
          </div>

          <div className="hero-v5-overlay container">
            <p className="hero-v5-eyebrow">
              <span className="hero-v5-pill-icon" aria-hidden="true">
                <svg viewBox="0 0 16 16">
                  <path d="M6 2h4v2h2v2h2v4h-2v2h-2v2H6v-2H4v-2H2V6h2V4h2Zm.8 3.2v5.6h1.4V9h1.4v1.8H11V5.2Zm2.8 1.3v1.1h1v-1.1Zm-2.8 0v1.1h1v-1.1Z" />
                </svg>
              </span>
              AI for Independent Retail
            </p>
            <h1 className="hero-v5-headline">
              Your store.
              <br />
              <span className="hero-v5-accent">On autopilot.</span>
            </h1>
            <p className="hero-v5-subhead">
              Coodra is the AI layer that knows your inventory, catches margin leaks, and knows your store better than you do - all from one dashboard.
            </p>
            <div className="hero-v5-actions">
              <Link to="/signup" className="hero-v5-cta hero-v5-cta-primary">Start For Free</Link>
              <Link to="/integrations" className="hero-v5-cta hero-v5-cta-secondary">
                See Integrations
                <span className="hero-v5-cta-icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16">
                    <path d="M2.2 2.2h4.4v4.4H2.2Zm7.2 0h4.4v4.4H9.4ZM2.2 9.4h4.4v4.4H2.2Zm7.2 0h4.4v4.4H9.4Z" />
                  </svg>
                </span>
              </Link>
            </div>
            <p className="hero-v5-support-links">
              Learn the workflow in <Link to="/resources">resources</Link>, compare plans on <Link to="/pricing">pricing</Link>, and see real operator guidance in our <Link to="/blog">blog</Link>.
            </p>
          </div>

        </section>

        <section className="hero-v5-trust" aria-label="Supported integrations">
          <div className="container">
            <p className="hero-v5-pos-note">
              <span className="hero-v5-pos-icon" aria-hidden="true">
                <svg viewBox="0 0 16 16">
                  <path d="M8 1.8 2.6 4.2v3.9c0 3.3 2.3 6.2 5.4 6.9 3.1-.7 5.4-3.6 5.4-6.9V4.2Zm0 2.1 3.6 1.6v2.7c0 2.2-1.4 4.2-3.6 4.8-2.2-.6-3.6-2.6-3.6-4.8V5.5Z" />
                </svg>
              </span>
              Connect securely to Shopify, Square, Lightspeed, Clover, WooCommerce, and Odoo. Moneris available by account configuration.
            </p>
            <div className="hero-v5-trust-row" role="list">
              {heroTrustRailItems.map((item) => (
                <div key={item.name} className="hero-v5-trust-item" role="listitem" aria-label={item.name}>
                  <img src={item.logoSrc} alt={item.name} className={item.logoClass} loading="lazy" decoding="async" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="how-it-works container">
          <div className="how-simple-layout" aria-label="How Coodra helps operators decide faster">
            <div className="how-simple-media">
              <img src="/images/landing/dashboard-how.png" alt="Coodra dashboard preview" loading="lazy" decoding="async" />
            </div>

            <div className="how-simple-copy">
              <p className="hero-v5-eyebrow">
                <span className="hero-v5-pill-icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16">
                    <path d="M2.2 12.6h11.6v1.2H2.2ZM3.2 10l2.6-2.6 2.1 2.1 3.3-3.3 1.6 1.6-.9.9-.7-.7-3.3 3.3-2.1-2.1-1.7 1.7Z" />
                  </svg>
                </span>
                Real-time retail intelligence
              </p>
              <h2>See the shift. Read the risk. Make the move.</h2>
              <p>
                Coodra turns raw POS and inventory data into clear operating signals, so your team can act faster with less
                guesswork.
              </p>
              <ul className="how-simple-list">
                <li>Detect demand shifts, low-stock risk, and margin leaks early.</li>
                <li>Understand impact with context, not just isolated metrics.</li>
                <li>Get clear, priority-ranked actions your team can execute quickly.</li>
                <li>Move from reporting to decisions in one workflow.</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="ai-chat" className="ai-chat-section container">
          <div className="ai-chat-layout" aria-label="How Coodra AI chat helps operators take action">
            <div className="ai-chat-copy">
              <p className="hero-v5-eyebrow">
                <span className="hero-v5-pill-icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16">
                    <path d="M3.5 2.5h9a2 2 0 0 1 2 2V10a2 2 0 0 1-2 2H8l-3 2v-2H3.5a2 2 0 0 1-2-2V4.5a2 2 0 0 1 2-2Zm0 1.2a.8.8 0 0 0-.8.8V10c0 .4.4.8.8.8h2.7v.9l1.5-.9h4.8a.8.8 0 0 0 .8-.8V4.5a.8.8 0 0 0-.8-.8Z" />
                  </svg>
                </span>
                AI Chat / Retail Intelligence
              </p>
              <h2>Get answers. Take action.</h2>
              <p>
                Coodra Agent explains what changed, why it changed, and what to do next, so your team can make
                faster, higher-confidence decisions.
              </p>
              <ul className="ai-chat-list">
                <li>Highlights demand and revenue shifts in plain language.</li>
                <li>Recommends product swaps with clear reasoning.</li>
                <li>Shows projected impact before you approve a move.</li>
                <li>Turns analysis into practical next steps for operators.</li>
              </ul>
            </div>

            <div className="ai-chat-media">
              <img src="/images/landing/ai-chat-cropped.png" alt="Coodra AI Chat analysis and action recommendations" loading="lazy" decoding="async" />
            </div>
          </div>
        </section>

        <section id="decision" className="how-workflow-section container">
          <header className="how-workflow-head" data-reveal="up">
            <p className="hero-v5-eyebrow">
              <span className="hero-v5-pill-icon" aria-hidden="true">
                <svg viewBox="0 0 16 16">
                  <path d="M3 4h4v1.2H5.6L7.8 7.4l-.9.9L4.7 6.1V7.5H3Zm10 8H9v-1.2h1.4L8.2 8.6l.9-.9 2.2 2.2V8.5H13Z" />
                </svg>
              </span>
              How it works
            </p>
            <h2>How Coodra helps you move faster</h2>
          </header>

          <div className="how-workflow-grid">
            <article className="how-workflow-card">
              <div className="how-workflow-step">
                <span>1</span>
                <h3>Connect</h3>
              </div>
              <p>Bring POS, ecommerce, and inventory signals together in minutes.</p>
              <img className="how-workflow-visual" src="/images/landing/how-step-connect.png" alt="Connect your retail systems into one data layer" loading="lazy" decoding="async" />
            </article>

            <article className="how-workflow-card">
              <div className="how-workflow-step">
                <span>2</span>
                <h3>Analyze</h3>
              </div>
              <p>Coodra surfaces demand shifts, margin opportunities, and inventory risk.</p>
              <img className="how-workflow-visual" src="/images/landing/how-step-analyze.png" alt="Analyze opportunities and risks across retail data" loading="lazy" decoding="async" />
            </article>

            <article className="how-workflow-card">
              <div className="how-workflow-step">
                <span>3</span>
                <h3>Act</h3>
              </div>
              <p>Approve high-impact actions with clear expected outcomes.</p>
              <img className="how-workflow-visual" src="/images/landing/how-step-act.png" alt="Approve recommended retail actions with projected impact" loading="lazy" decoding="async" />
            </article>
          </div>

          <div className="how-workflow-outcomes" aria-label="Outcomes from using Coodra">
            <article className="how-workflow-outcome">
              <img src="/images/landing/how-benefit-stockouts.png" alt="" loading="lazy" decoding="async" />
              <div>
                <h4>Fewer stockouts</h4>
                <p>Keep shelves full and customers happy.</p>
              </div>
            </article>
            <article className="how-workflow-outcome">
              <img src="/images/landing/how-benefit-margin.png" alt="" loading="lazy" decoding="async" />
              <div>
                <h4>Higher margin visibility</h4>
                <p>Spot profit opportunities that compound.</p>
              </div>
            </article>
            <article className="how-workflow-outcome">
              <img src="/images/landing/how-benefit-speed.png" alt="" loading="lazy" decoding="async" />
              <div>
                <h4>Faster decisions</h4>
                <p>From insight to action in a few clicks.</p>
              </div>
            </article>
          </div>
        </section>

        {/* Proof / Impact */}
        <section id="proof" className="proof impact-section container" data-reveal="up">
          <div className="impact-card" data-reveal="up" aria-label="Retail outcomes">
            <div className="impact-copy">
              <h3>Decisions that compound.</h3>
              <p className="impact-sub">Small, smart actions. Big, lasting impact.</p>
              <div className="impact-pillars">
                <article className="impact-pillar">
                  <span className="impact-pillar-icon" aria-hidden="true">
                    <svg viewBox="0 0 16 16">
                      <path d="M8 1.4 2.2 3.8v3.5c0 3.4 2.1 6.6 5.8 7.3 3.7-.7 5.8-3.9 5.8-7.3V3.8L8 1.4Zm0 1.5 4.4 1.8v2.6c0 2.7-1.5 5.2-4.4 5.9-2.9-.7-4.4-3.2-4.4-5.9V4.7L8 2.9Zm2.3 2.6 1 .8-3.8 4.5-2-2 .9-.9 1.1 1.1 2.8-3.5Z" />
                    </svg>
                  </span>
                  <div>
                    <h4>Protect margin</h4>
                    <p>Identify price and cost opportunities daily.</p>
                  </div>
                </article>
                <article className="impact-pillar">
                  <span className="impact-pillar-icon" aria-hidden="true">
                    <svg viewBox="0 0 16 16">
                      <path d="M7.9 1.2 2 4.5V11l5.9 3.3 5.9-3.3V4.5L7.9 1.2Zm0 1.4 4.6 2.6-1.7 1-4.6-2.6 1.7-1Zm-2.9 1.7 4.6 2.6-1.7 1L3.3 5.3l1.7-1Zm-1.8 2.1 4.1 2.3v4L3.2 10.4v-4Zm5.4 6.3v-4l4.1-2.3v4l-4.1 2.3Z" />
                    </svg>
                  </span>
                  <div>
                    <h4>Move inventory</h4>
                    <p>Stock the right items at the right time.</p>
                  </div>
                </article>
                <article className="impact-pillar">
                  <span className="impact-pillar-icon" aria-hidden="true">
                    <svg viewBox="0 0 16 16">
                      <path d="m2.1 11.6 4.7-4.7 2.2 2.2L13 5v2h1.2V2.9H10V4h2.1L9 7.1 6.8 4.9 1.2 10.5l.9 1.1Z" />
                    </svg>
                  </span>
                  <div>
                    <h4>Grow with clarity</h4>
                    <p>See what drives profit and do more of it.</p>
                  </div>
                </article>
              </div>
            </div>
            <div className="impact-stats" aria-label="Measured outcomes">
              <p className="impact-kicker">Stores using Coodra see measurable impact.</p>
              <div className="impact-metrics">
                <article className="impact-metric">
                  <strong>+18%</strong>
                  <p>Gross margin improvement</p>
                </article>
                <article className="impact-metric">
                  <strong>+23%</strong>
                  <p>Increase in sell-through</p>
                </article>
                <article className="impact-metric">
                  <strong>-31%</strong>
                  <p>Reduction in stockouts</p>
                </article>
              </div>
              <div className="impact-graph" aria-hidden="true">
                <svg viewBox="0 0 640 170" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="impactFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(43, 192, 174, 0.28)" />
                      <stop offset="100%" stopColor="rgba(43, 192, 174, 0)" />
                    </linearGradient>
                  </defs>
                  <path d="M0 138 C70 128 102 142 156 120 C214 96 272 116 324 98 C382 76 444 126 510 90 C552 67 582 75 640 32 L640 170 L0 170 Z" fill="url(#impactFill)" />
                  <path d="M0 138 C70 128 102 142 156 120 C214 96 272 116 324 98 C382 76 444 126 510 90 C552 67 582 75 640 32" />
                  <g className="impact-graph-points">
                    <circle cx="65" cy="132" r="4" />
                    <circle cx="160" cy="120" r="4" />
                    <circle cx="258" cy="108" r="4" />
                    <circle cx="356" cy="92" r="4" />
                    <circle cx="480" cy="104" r="4" />
                    <circle cx="578" cy="74" r="5" />
                  </g>
                </svg>
                <p>Results from early Coodra retail partners.</p>
              </div>
            </div>
          </div>
        </section>
        {/* CTA */}
        <section
          id="cta"
          ref={ctaCardRef}
          className="cta container surface-contrast"
          data-reveal="up"
          onMouseMove={handleCtaPointerMove}
          onMouseEnter={handleCtaPointerEnter}
          onMouseLeave={handleCtaPointerLeave}
        >
          <div className="cta-shadow-overlay" aria-hidden="true" />
          <div className="cta-noise-overlay" aria-hidden="true" />
          <h2>Ready to make better retail decisions this week?</h2>
          <p>Connect your data, review AI-ranked actions, and approve your first decision in minutes.</p>
          <div className="cta-actions">
            <Link to="/signup" className="btn btn-primary">Start Free</Link>
            <Link to="/pricing" className="btn btn-secondary">View Pricing</Link>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}









