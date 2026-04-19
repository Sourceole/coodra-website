import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { Link } from 'react-router'
import Lenis from 'lenis'
import { motion, useReducedMotion } from 'framer-motion'
import { trackEvent } from '../lib/analytics'
import MarketingHeader from '../components/MarketingHeader'
import MarketingFooter from '../components/MarketingFooter'
import BackgroundPaths from '../components/BackgroundPaths'
import './LandingPage.css'

const integrationShowcaseItems = [
  {
    name: 'Shopify',
    iconSrc: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/shopify.svg',
    logoClass: 'integration-logo-shopify',
  },
  {
    name: 'Square',
    iconSrc: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/square.svg',
    logoClass: 'integration-logo-square',
  },
  {
    name: 'Lightspeed',
    iconSrc: '/images/integrations/lightspeed.png?v=20260410',
    logoClass: 'integration-logo-lightspeed',
  },
  {
    name: 'Clover',
    iconSrc: '/images/integrations/clover.png?v=20260410',
    logoClass: 'integration-logo-clover',
  },
  {
    name: 'Moneris',
    iconSrc: '/images/integrations/moneris.png?v=20260410',
    logoClass: 'integration-logo-moneris',
  },
]

const decisionParticles = [
  { x: 12, y: 28, size: 8, dur: 18, delay: 0.2, alpha: 0.52 },
  { x: 24, y: 62, size: 6, dur: 22, delay: 1.8, alpha: 0.44 },
  { x: 33, y: 40, size: 9, dur: 20, delay: 0.9, alpha: 0.48 },
  { x: 46, y: 74, size: 6, dur: 24, delay: 2.5, alpha: 0.42 },
  { x: 58, y: 32, size: 7, dur: 19, delay: 1.1, alpha: 0.5 },
  { x: 69, y: 57, size: 6, dur: 23, delay: 3.2, alpha: 0.4 },
  { x: 81, y: 36, size: 8, dur: 21, delay: 2.1, alpha: 0.46 },
  { x: 87, y: 69, size: 9, dur: 26, delay: 1.4, alpha: 0.43 },
]

const chatUserPrompt = 'Reorder 4 cases from my main distributor'
const chatAssistantIntro =
  'Oatly Barista Edition is trending 24% above normal this week. Stockout predicted by Friday. Based on distributor lead times, you should reorder now to avoid a gap.'
const chatAssistantDecisionTitle = 'Draft PO created - $186.00'
const chatAssistantDecisionBody = '4 cases of Oatly Barista Edition -> Main Street Distributors. Approve to send?'

const testimonials = [
  {
    initials: 'SJ',
    name: 'Sophie J.',
    role: 'Multi-location grocery',
    company: 'Corner Street Market',
    quote: 'Coodra flagged stockout risk two days earlier. We recovered weekend sales before it hurt us.',
  },
  {
    initials: 'ML',
    name: 'Marcus L.',
    role: 'Specialty pet retail',
    company: 'FreshMart Group',
    quote: 'Reorder recommendations are clearer than our old reports. My team moves in minutes now.',
  },
  {
    initials: 'AG',
    name: 'Ariana G.',
    role: 'Health & wellness',
    company: 'Peak Wellness',
    quote: 'We stopped over-ordering low velocity SKUs and protected margin in the same month.',
  },
  {
    initials: 'TR',
    name: 'Tyler R.',
    role: 'Convenience stores',
    company: 'Daily Grind',
    quote: 'The why behind each suggestion made approvals easy for operators and owners.',
  },
  {
    initials: 'EB',
    name: 'Elena B.',
    role: 'Beauty retail',
    company: 'Glow House',
    quote: 'Coodra highlighted weak movers we kept missing. We corrected mix faster than ever.',
  },
  {
    initials: 'DK',
    name: 'David K.',
    role: 'Electronics chain',
    company: 'Volt Retail',
    quote: 'Signal quality is strong. It feels like an operator that never sleeps.',
  },
  {
    initials: 'NP',
    name: 'Nadia P.',
    role: 'Urban convenience',
    company: 'Metro Mini',
    quote: 'Our team trusts the next-best action view. We fix risk before it becomes lost sales.',
  },
]

export default function LandingPage() {
  const [isLiteHero, setIsLiteHero] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [introStream, setIntroStream] = useState('')
  const [inputDraft, setInputDraft] = useState('')
  const [isSendingPrompt, setIsSendingPrompt] = useState(false)
  const [showUserPrompt, setShowUserPrompt] = useState(false)
  const [decisionTitleStream, setDecisionTitleStream] = useState('')
  const [decisionBodyStream, setDecisionBodyStream] = useState('')
  const [outgoingTestimonial, setOutgoingTestimonial] = useState<number | null>(null)
  const reduceMotion = useReducedMotion()
  const testimonialDeckDepth = 4
  const outgoingTimerRef = useRef<number | null>(null)
  const ctaCardRef = useRef<HTMLElement | null>(null)

  const transitionToTestimonial = (resolveNext: (current: number) => number) => {
    setActiveTestimonial((current) => {
      const next = ((resolveNext(current) % testimonials.length) + testimonials.length) % testimonials.length
      if (next === current) return current

      setOutgoingTestimonial(current)
      if (outgoingTimerRef.current !== null) {
        window.clearTimeout(outgoingTimerRef.current)
      }
      outgoingTimerRef.current = window.setTimeout(() => {
        setOutgoingTestimonial((prev) => (prev === current ? null : prev))
      }, 850)

      return next
    })
  }

  useEffect(() => {
    // Set theme on <html> so CSS vars cascade correctly
    document.documentElement.setAttribute('data-theme', 'light')

    // Defer landing canvas/animation script until after load to protect LCP.
    const loadScript = () => {
      if (document.getElementById('landing-app-script')) return
      const script = document.createElement('script')
      script.id = 'landing-app-script'
      script.src = '/landing/app.js?v=20260415-4'
      script.defer = true
      document.body.appendChild(script)
    }

    const scheduleScriptLoad = () => {
      const w = window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
        cancelIdleCallback?: (id: number) => void
      }

      if (typeof w.requestIdleCallback === 'function') {
        w.requestIdleCallback(loadScript, { timeout: 2400 })
      } else {
        window.setTimeout(loadScript, 1200)
      }
    }

    if (document.readyState === 'complete') {
      scheduleScriptLoad()
    } else {
      window.addEventListener('load', scheduleScriptLoad, { once: true })
    }

    return () => {
      window.removeEventListener('load', scheduleScriptLoad)
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
            trackEvent('testimonial_section_visible', {
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

  useEffect(() => {
    const checkLiteHero = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const isNarrowViewport = window.matchMedia('(max-width: 900px)').matches
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      const isSaveData = Boolean(connection?.saveData)
      setIsLiteHero(prefersReducedMotion || isNarrowViewport || isSaveData)
    }

    checkLiteHero()
    window.addEventListener('resize', checkLiteHero, { passive: true })
    return () => window.removeEventListener('resize', checkLiteHero)
  }, [])

  useEffect(() => {
    if (reduceMotion) return
    const interval = window.setInterval(() => {
      transitionToTestimonial((prev) => prev + 1)
    }, 5200)
    return () => window.clearInterval(interval)
  }, [reduceMotion])

  useEffect(() => {
    return () => {
      if (outgoingTimerRef.current !== null) {
        window.clearTimeout(outgoingTimerRef.current)
      }
    }
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

  useEffect(() => {
    let cancelled = false

    const sleep = (ms: number) => new Promise<void>((resolve) => {
      window.setTimeout(resolve, ms)
    })

    const streamText = async (setter: (value: string) => void, text: string, speed: number) => {
      setter('')
      for (let i = 1; i <= text.length; i += 1) {
        if (cancelled) return false
        setter(text.slice(0, i))
        await sleep(speed)
      }
      return true
    }

    const runSequence = async () => {
      setIntroStream('')
      setInputDraft('')
      setIsSendingPrompt(false)
      setShowUserPrompt(false)
      setDecisionTitleStream('')
      setDecisionBodyStream('')

      await sleep(300)
      if (!(await streamText(setIntroStream, chatAssistantIntro, 16))) return

      if (!(await streamText(setInputDraft, chatUserPrompt, 34))) return

      await sleep(260)
      if (cancelled) return
      setIsSendingPrompt(true)
      await sleep(320)
      if (cancelled) return
      setIsSendingPrompt(false)
      setShowUserPrompt(true)
      setInputDraft('')

      await sleep(420)
      if (!(await streamText(setDecisionTitleStream, chatAssistantDecisionTitle, 20))) return
      await sleep(140)
      await streamText(setDecisionBodyStream, chatAssistantDecisionBody, 15)
    }

    void runSequence()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className={`site-shell${isLiteHero ? ' is-lite-hero' : ''}`} id="top">
      <MarketingHeader />

      <main>
        {/* Hero */}
        <section className="hero-v5" id="hero">
          <div className="hero-v5-scene" aria-hidden="true">
            <div className="hero-v5-scene-fallback" />
          </div>

          <div className="hero-v5-watermark wm-a" aria-hidden="true">42.8%</div>
          <div className="hero-v5-watermark wm-b" aria-hidden="true">400+</div>
          <div className="hero-v5-watermark wm-c" aria-hidden="true">$4,200</div>
          <div className="hero-v5-watermark wm-d" aria-hidden="true">15 min</div>

          <div className="hero-v5-floating ds-1" aria-hidden="true">
            <span className="ficon-svg red">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 3.2a.9.9 0 0 1 .9.9v4.1a.9.9 0 1 1-1.8 0V4.1a.9.9 0 0 1 .9-.9Zm0 8.9a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2Z" />
              </svg>
            </span>
            Stock Alert - 12 units
          </div>
          <div className="hero-v5-floating ds-2" aria-hidden="true">
            <span className="ficon-svg teal">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M6.8 10.7 3.9 7.8a.9.9 0 0 1 1.3-1.3l1.6 1.6 4.1-4.1a.9.9 0 1 1 1.3 1.3l-5.4 5.4Z" />
              </svg>
            </span>
            PO Draft - $186
          </div>
          <div className="hero-v5-floating ds-3" aria-hidden="true">
            <span className="ficon-svg amber">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M2.6 8.8a2.1 2.1 0 0 1 2.1-2.1H5A3.2 3.2 0 0 1 11.2 6h.1a2.1 2.1 0 1 1 0 4.2H4.7a2.1 2.1 0 0 1-2.1-1.4ZM8 5a.8.8 0 0 1 .8.8v.3h.3a.8.8 0 1 1 0 1.6h-.3V8a.8.8 0 1 1-1.6 0v-.3h-.3a.8.8 0 1 1 0-1.6h.3v-.3A.8.8 0 0 1 8 5Z" />
              </svg>
            </span>
            $526 saved<span className="hero-v5-floating-tail"> - this week</span>
          </div>
          <div className="hero-v5-floating ds-4" aria-hidden="true"><span className="ficon arrow">&uarr;</span>+4.2% margin</div>
          <div className="hero-v5-floating ds-5" aria-hidden="true"><span className="ficon violet">&#8599;</span>Oatly +24%</div>
          <div className="hero-v5-floating ds-6" aria-hidden="true"><span className="ficon dark" />Corner Street</div>

          <div className="hero-v5-overlay container">
            <p className="hero-v5-eyebrow">
              <span className="hero-v5-pill-icon" aria-hidden="true">
                <svg viewBox="0 0 16 16">
                  <path d="M8 2.2c.3 1.7 1.6 3 3.3 3.3-1.7.3-3 1.6-3.3 3.3-.3-1.7-1.6-3-3.3-3.3 1.7-.3 3-1.6 3.3-3.3Zm4.4 6.3c.2.9.9 1.6 1.8 1.8-.9.2-1.6.9-1.8 1.8-.2-.9-.9-1.6-1.8-1.8.9-.2 1.6-.9 1.8-1.8Z" />
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
              <Link to="/integrations" className="hero-v5-cta hero-v5-cta-secondary">See Integrations</Link>
            </div>

            <article className="hero-v5-mockup" aria-label="Coodra assistant preview">
              <header className="hero-v5-mockup-bar">
                <span className="hero-v5-dot is-red" />
                <span className="hero-v5-dot is-yellow" />
                <span className="hero-v5-dot is-green" />
                <div className="hero-v5-bar-ghost" aria-hidden="true" />
              </header>

              <div className="hero-v5-mockup-body">
                <section className="hero-v5-chat-panel">
                  <header className="hero-v5-chat-head">
                    <div className="hero-v5-chat-avatar">
                      <img src="/images/logo.png" alt="" aria-hidden="true" />
                    </div>
                    <div>
                      <p>Corner Street Market</p>
                      <span>3 active conversations</span>
                    </div>
                    <span className="hero-v5-chat-live">Live</span>
                  </header>

                  <div className="hero-v5-chat-feed">
                    <article className="hero-v5-msg hero-v5-msg-assistant">
                      <div className="hero-v5-msg-avatar">
                        <img src="/images/logo.png" alt="" aria-hidden="true" />
                      </div>
                      <p>{introStream}</p>
                    </article>

                    {showUserPrompt ? (
                      <article className="hero-v5-msg hero-v5-msg-user">
                        <p>{chatUserPrompt}</p>
                      </article>
                    ) : null}

                    {decisionTitleStream ? (
                      <article className="hero-v5-msg hero-v5-msg-assistant hero-v5-msg-decision">
                        <div className="hero-v5-msg-avatar">
                          <img src="/images/logo.png" alt="" aria-hidden="true" />
                        </div>
                        <div className="hero-v5-decision-copy">
                          <strong>{decisionTitleStream}</strong>
                          <p>{decisionBodyStream}</p>
                        </div>
                      </article>
                    ) : null}
                  </div>

                  <footer className="hero-v5-chat-input">
                    <div className="hero-v5-chat-field">
                      {inputDraft || 'Ask Coodra anything...'}
                    </div>
                    <button type="button" className={`hero-v5-send${isSendingPrompt ? ' is-sending' : ''}`} aria-label="Send" />
                  </footer>
                </section>

                <aside className="hero-v5-metrics-panel" aria-label="Store metrics">
                  <div className="hero-v5-metrics-top">
                    <article className="hero-v5-metric-card">
                      <p className="metric-kicker">Gross Margin</p>
                      <h4>42.8%</h4>
                      <span className="metric-pill mint">+4.2%</span>
                    </article>
                    <article className="hero-v5-metric-card">
                      <p className="metric-kicker">Low Stock</p>
                      <h4>3 ITEMS</h4>
                      <span className="metric-pill amber">Action needed</span>
                    </article>
                  </div>

                  <div className="hero-v5-margin-alert">
                    <h4>Margin Alert - Last 30 Days</h4>
                    <article className="alert-row red">
                      <div>
                        <p>Blue Buffalo Dog Food</p>
                        <span>Cost +8% &middot; Price unchanged</span>
                      </div>
                      <div className="alert-value">
                        <strong>-$340/mo</strong>
                        <span>margin erosion</span>
                      </div>
                    </article>
                    <article className="alert-row amber">
                      <div>
                        <p>Fiddlehead Coffee</p>
                        <span>Cost +5% &middot; Price unchanged</span>
                      </div>
                      <div className="alert-value">
                        <strong>-$186/mo</strong>
                        <span>margin erosion</span>
                      </div>
                    </article>
                    <article className="alert-row green">
                      <div>
                        <p>Oatly Barista Ed.</p>
                        <span>Price updated +6% &middot; Cost flat</span>
                      </div>
                      <div className="alert-value">
                        <strong>+$220/mo</strong>
                        <span>protected</span>
                      </div>
                    </article>
                  </div>
                </aside>
              </div>
            </article>
          </div>

        </section>

        {/* How it works */}
        <section id="how-it-works" className="how-it-works container" data-aos="fade-up" data-aos-delay="150">
          <div className="how-scroll">
            <div className="how-stage-track" aria-label="Three connected steps">
              <div className="how-stage-shell">
                <header className="how-sticky-head">
                <p className="eyebrow how-eyebrow">
                  <span className="how-eyebrow-icon" aria-hidden="true">
                    <svg viewBox="0 0 16 16">
                      <path d="M8 2.2c.3 1.7 1.6 3 3.3 3.3-1.7.3-3 1.6-3.3 3.3-.3-1.7-1.6-3-3.3-3.3 1.7-.3 3-1.6 3.3-3.3Zm4.4 6.3c.2.9.9 1.6 1.8 1.8-.9.2-1.6.9-1.8 1.8-.2-.9-.9-1.6-1.8-1.8.9-.2 1.6-.9 1.8-1.8Z" />
                    </svg>
                  </span>
                  How it works
                </p>
                <h2>Three steps from signal to action.</h2>
                <p className="how-scroll-sub">Connect your systems, review AI recommendations, and approve decisions in minutes.</p>
                </header>
                <div className="how-flip-stage">
                  <article className="how-pill-card how-flip-card" id="howFlipCard">
                    <p className="how-step-tag" id="howFlipTag">Step 1</p>
                    <h3 id="howFlipTitle">Connect your data</h3>
                    <p id="howFlipBody">Sync POS, catalog, and inventory data so Coodra sees what is happening now.</p>
                  </article>
                </div>
              </div>
              <div className="how-trigger-rail">
                <div className="how-trigger is-active" data-how-step="1" data-tag="Step 1" data-title="Connect your data" data-body="Sync POS, catalog, and inventory data so Coodra sees what is happening now." />
                <div className="how-trigger" data-how-step="2" data-tag="Step 2" data-title="Get ranked actions" data-body="Coodra scores demand shifts, margin pressure, and stock risk to prioritize what matters most." />
                <div className="how-trigger" data-how-step="3" data-tag="Step 3" data-title="Approve and move" data-body="Approve recommendations fast and keep your team focused on high-impact decisions." />
              </div>
            </div>
            <div className="how-scroll-track">
              <div className="how-mobile-list" aria-label="Three steps">
                <article className="how-pill-card">
                  <p className="how-step-tag">Step 1</p>
                  <h3>Connect your data</h3>
                  <p>Sync POS, catalog, and inventory data so Coodra sees what is happening now.</p>
                </article>
                <article className="how-pill-card">
                  <p className="how-step-tag">Step 2</p>
                  <h3>Get ranked actions</h3>
                  <p>Coodra scores demand shifts, margin pressure, and stock risk to prioritize what matters most.</p>
                </article>
                <article className="how-pill-card">
                  <p className="how-step-tag">Step 3</p>
                  <h3>Approve and move</h3>
                  <p>Approve recommendations fast and keep your team focused on high-impact decisions.</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section id="integrations" className="integrations container" data-aos="fade-up" data-aos-delay="200">
          <div className="integrations-float-layout">
            <BackgroundPaths />

            <div className="integrations-float-center">
              <p className="eyebrow eyebrow-with-icon">
                <span className="eyebrow-icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16">
                    <path d="M8 2.2c.3 1.7 1.6 3 3.3 3.3-1.7.3-3 1.6-3.3 3.3-.3-1.7-1.6-3-3.3-3.3 1.7-.3 3-1.6 3.3-3.3Zm4.4 6.3c.2.9.9 1.6 1.8 1.8-.9.2-1.6.9-1.8 1.8-.2-.9-.9-1.6-1.8-1.8.9-.2 1.6-.9 1.8-1.8Z" />
                  </svg>
                </span>
                Integrations
              </p>
              <h2>Connect your stack. Let Coodra handle the signal flow.</h2>
              <p className="integrations-sub">
                Plug in the systems your team already uses and turn raw data into decisions with clear rationale and measurable impact.
              </p>
              <Link to="/integrations" className="hero-v5-cta hero-v5-cta-secondary">See Integrations</Link>
            </div>

            <div className="integrations-float-canvas" role="list" aria-label="Coodra integrations">
              {integrationShowcaseItems.map((item, index) => (
                <article key={item.name} className={`integration-float-card pos-${index + 1}`} role="listitem" aria-label={item.name}>
                  <div className="integration-float-image">
                    <img src={item.iconSrc} alt={`${item.name} logo`} className={item.logoClass} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Decision Engine */}
        <section id="decision" className="decision-band" data-aos="fade-up" data-aos-delay="250">
          <div className="decision-bg" aria-hidden="true">
            <div className="decision-particles">
              {decisionParticles.map((particle, index) => (
                <span
                  key={`decision-particle-${index}`}
                  className="decision-particle"
                  style={
                    {
                      '--px': `${particle.x}%`,
                      '--py': `${particle.y}%`,
                      '--ps': `${particle.size}px`,
                      '--pd': `${particle.dur}s`,
                      '--pdelay': `${particle.delay}s`,
                      '--pa': particle.alpha,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
          </div>
          <div className="container">
            <div className="decision-layout">
            <header className="decision-copy" data-reveal="up">
              <p className="eyebrow eyebrow-with-icon">
                <span className="eyebrow-icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16">
                    <path d="M8 2.2c.3 1.7 1.6 3 3.3 3.3-1.7.3-3 1.6-3.3 3.3-.3-1.7-1.6-3-3.3-3.3 1.7-.3 3-1.6 3.3-3.3Zm4.4 6.3c.2.9.9 1.6 1.8 1.8-.9.2-1.6.9-1.8 1.8-.2-.9-.9-1.6-1.8-1.8.9-.2 1.6-.9 1.8-1.8Z" />
                  </svg>
                </span>
                Why teams switch to Coodra
              </p>
              <h2>Decisions that are fast, clear, and measurable.</h2>
              <p>
                Every recommendation includes confidence, reasoning, and expected impact so your team knows what to do next and why it matters.
              </p>
            </header>
            <div className="decision-stack-wrap">
              <div className="display-cards-stack decision-stack" aria-label="Coodra operating layers">
                <article className="display-card decision-layer-1">
                  <div className="display-card-top">
                    <span className="display-icon">A</span>
                    <p className="display-title">Clear rationale</p>
                  </div>
                  <p className="display-body">See the exact data signals behind each recommendation.</p>
                  <p className="display-date">No black box</p>
                </article>
                <article className="display-card decision-layer-2">
                  <div className="display-card-top">
                    <span className="display-icon">B</span>
                    <p className="display-title">Human approval</p>
                  </div>
                  <p className="display-body">Your team approves actions before anything changes.</p>
                  <p className="display-date">Always in control</p>
                </article>
                <article className="display-card decision-layer-3">
                  <div className="display-card-top">
                    <span className="display-icon">C</span>
                    <p className="display-title">Measured outcomes</p>
                  </div>
                  <p className="display-body">Track what decisions improve sell-through, margin, and stock health.</p>
                  <p className="display-date">Impact you can prove</p>
                </article>
              </div>
            </div>
            </div>
          </div>
        </section>

        {/* Proof / Testimonials */}
        <section id="proof" className="proof testimonials-section container" data-aos="fade-up" data-aos-delay="300" data-reveal="up">
          <div className="testimonials-modern" data-reveal="up" aria-label="Customer outcomes">
            <div className="testimonials-modern-copy">
              <p className="eyebrow eyebrow-with-icon testimonials-modern-eyebrow">
                <span className="eyebrow-icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16">
                    <path d="M8 2.2c.3 1.7 1.6 3 3.3 3.3-1.7.3-3 1.6-3.3 3.3-.3-1.7-1.6-3-3.3-3.3 1.7-.3 3-1.6 3.3-3.3Zm4.4 6.3c.2.9.9 1.6 1.8 1.8-.9.2-1.6.9-1.8 1.8-.2-.9-.9-1.6-1.8-1.8.9-.2 1.6-.9 1.8-1.8Z" />
                  </svg>
                </span>
                Trusted by retail operators
              </p>
              <h3>Loved by teams running real stores.</h3>
              <p className="testimonials-modern-sub">
                Don&apos;t just take our word for it. Here&apos;s how operators describe working with Coodra every week.
              </p>
              <div className="testimonials-dots" role="tablist" aria-label="Testimonial slides">
                {testimonials.map((item, idx) => (
                  <button
                    key={`dot-${item.initials}-${idx}`}
                    type="button"
                    className={`testimonials-dot${idx === activeTestimonial ? ' is-active' : ''}`}
                    aria-label={`Show testimonial ${idx + 1}`}
                    onClick={() => transitionToTestimonial(() => idx)}
                  />
                ))}
              </div>
            </div>

            <div className="testimonials-modern-stage">
              {testimonials.map((item, idx) => (
                <motion.article
                  key={`${item.initials}-${item.name}`}
                  className="testimonials-modern-card"
                  initial={false}
                  animate={(() => {
                    const deckIndex = (idx - activeTestimonial + testimonials.length) % testimonials.length
                    const visibleDepth = Math.min(deckIndex, testimonialDeckDepth - 1)
                    const isVisible = deckIndex < testimonialDeckDepth
                    const isOutgoing = outgoingTestimonial === idx && idx !== activeTestimonial

                    const xPositions = [0, 14, 28, 42]
                    const yPositions = [0, 10, 20, 30]
                    const scales = [1, 0.988, 0.976, 0.964]
                    const rotations = [0, 0.9, 1.7, 2.6]
                    const opacities = [1, 0.97, 0.92, 0.82]

                    if (isOutgoing) {
                      return {
                        opacity: [1, 0.96, 0.8],
                        x: [0, -12, 36],
                        y: [0, -10, 28],
                        scale: [1, 1.02, 0.96],
                        rotate: [0, -2.8, 7.4],
                      }
                    }

                    return {
                      opacity: isVisible ? opacities[visibleDepth] : 0,
                      x: isVisible ? xPositions[visibleDepth] : 58,
                      y: isVisible ? yPositions[visibleDepth] : 44,
                      scale: isVisible ? scales[visibleDepth] : 0.95,
                      rotate: isVisible ? rotations[visibleDepth] : 3.2,
                    }
                  })()}
                  transition={
                    outgoingTestimonial === idx && idx !== activeTestimonial
                      ? { duration: 0.84, ease: [0.22, 1, 0.36, 1], times: [0, 0.35, 1] }
                      : { duration: 0.78, ease: [0.22, 1, 0.36, 1] }
                  }
                  style={{
                    zIndex:
                      outgoingTestimonial === idx && idx !== activeTestimonial
                        ? testimonialDeckDepth + 3
                        : testimonialDeckDepth - ((idx - activeTestimonial + testimonials.length) % testimonials.length),
                    pointerEvents: idx === activeTestimonial ? 'auto' : 'none',
                  }}
                >
                  <div className="testimonials-modern-stars" aria-hidden="true">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                  <blockquote>&quot;{item.quote}&quot;</blockquote>
                  <div className="testimonials-modern-divider" />
                  <div className="testimonials-modern-author">
                    <span className="testimonials-modern-avatar">{item.initials}</span>
                    <div>
                      <p>{item.name}</p>
                      <small>{item.role}, {item.company}</small>
                    </div>
                  </div>
                </motion.article>
              ))}
              <div className="testimonials-modern-deco deco-a" aria-hidden="true" />
              <div className="testimonials-modern-deco deco-b" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          id="cta"
          ref={ctaCardRef}
          className="cta container surface-contrast"
          data-aos="fade-up"
          data-aos-delay="350"
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







