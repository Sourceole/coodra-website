import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Link } from 'react-router'
import { trackEvent } from '../lib/analytics'
import './LandingPage.css'

const integrationShowcaseItems = [
  {
    name: 'Shopify',
    description: 'Sync products, orders, and inventory in real time.',
    iconSrc: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/shopify.svg',
    className: 'brand-shopify',
  },
  {
    name: 'Square',
    description: 'Unify in-store sales and catalog performance signals.',
    iconSrc: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/square.svg',
    className: 'brand-square',
  },
  {
    name: 'Lightspeed',
    description: 'Connect POS sell-through and stock movement data.',
    iconSrc: '/images/integrations/lightspeed.png?v=20260410',
    className: 'brand-lightspeed',
  },
  {
    name: 'Clover',
    description: 'Bring transaction and location trends into one view.',
    iconSrc: '/images/integrations/clover.png?v=20260410',
    className: 'brand-clover',
  },
  {
    name: 'Moneris',
    description: 'Pull payment and sales snapshots into decision workflows.',
    iconSrc: '/images/integrations/moneris.png?v=20260410',
    className: 'brand-moneris',
  },
]

const heroIncomingSignals = [
  { title: 'POS', meta: 'Live sell-through' },
  { title: 'Inventory', meta: 'Stock depth' },
  { title: 'Demand', meta: 'Forecast signal' },
]

const heroOutgoingDecisions = [
  { tag: 'Priority 1', title: 'Reorder 142 units' },
  { tag: 'Priority 2', title: 'Markdown 8 SKUs' },
  { tag: 'Priority 3', title: 'Hold 23 SKUs' },
]

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [coreBoosted, setCoreBoosted] = useState(false)
  const [isLiteHero, setIsLiteHero] = useState(false)
  const radarRef = useRef<HTMLDivElement | null>(null)

  const handleIntegrationVisualMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    event.currentTarget.style.setProperty('--mx', `${x}px`)
    event.currentTarget.style.setProperty('--my', `${y}px`)
  }

  const handleIntegrationVisualLeave = (event: MouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--mx', '50%')
    event.currentTarget.style.setProperty('--my', '50%')
  }

  useEffect(() => {
    // Set theme on <html> so CSS vars cascade correctly
    document.documentElement.setAttribute('data-theme', 'light')

    // Defer landing canvas/animation script until after load to protect LCP.
    const loadScript = () => {
      if (document.getElementById('landing-app-script')) return
      const script = document.createElement('script')
      script.id = 'landing-app-script'
      script.src = '/landing/app.js'
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
    const closeOnDesktop = () => {
      if (window.innerWidth > 760) {
        setIsMobileMenuOpen(false)
      }
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', closeOnDesktop, { passive: true })
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.removeEventListener('resize', closeOnDesktop)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  useEffect(() => {
    if (window.innerWidth <= 760) {
      document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

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

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const handleRadarMove = (event: MouseEvent<HTMLDivElement>) => {
    const radarEl = radarRef.current
    if (!radarEl) return
    const coreEl = radarEl.querySelector('.hero-radar-core') as HTMLElement | null
    if (!coreEl) return

    const coreRect = coreEl.getBoundingClientRect()
    const coreX = coreRect.left + coreRect.width / 2
    const coreY = coreRect.top + coreRect.height / 2

    const tokens = radarEl.querySelectorAll<HTMLElement>('.hero-signal-token')
    tokens.forEach((token) => {
      const rect = token.getBoundingClientRect()
      const tokenX = rect.left + rect.width / 2
      const tokenY = rect.top + rect.height / 2

      const pointerDx = event.clientX - tokenX
      const pointerDy = event.clientY - tokenY
      const pointerDistance = Math.hypot(pointerDx, pointerDy)
      const influence = Math.max(0, 1 - pointerDistance / 220)

      const toCoreX = coreX - tokenX
      const toCoreY = coreY - tokenY
      const toCoreDistance = Math.max(1, Math.hypot(toCoreX, toCoreY))
      const nx = toCoreX / toCoreDistance
      const ny = toCoreY / toCoreDistance
      const pull = 14 * influence

      token.style.setProperty('--token-attract', influence.toFixed(3))
      token.style.setProperty('--token-tx', `${(nx * pull).toFixed(2)}px`)
      token.style.setProperty('--token-ty', `${(ny * pull).toFixed(2)}px`)
    })
  }

  const handleRadarLeave = () => {
    const radarEl = radarRef.current
    if (!radarEl) return
    const tokens = radarEl.querySelectorAll<HTMLElement>('.hero-signal-token')
    tokens.forEach((token) => {
      token.style.setProperty('--token-attract', '0')
      token.style.setProperty('--token-tx', '0px')
      token.style.setProperty('--token-ty', '0px')
    })
  }

  return (
    <div className={`site-shell${isLiteHero ? ' is-lite-hero' : ''}`} id="top">
      {/* Ambient background orbs */}
      {!isLiteHero ? (
        <>
          <div className="ambient ambient-a" aria-hidden="true" />
          <div className="ambient ambient-b" aria-hidden="true" />
          <div className="ambient ambient-c" aria-hidden="true" />
          <div className="mesh-grid" aria-hidden="true" />
          <div className="noise-layer" aria-hidden="true" />
        </>
      ) : null}

      {/* Header / Nav */}
      <header className="site-header">
        <nav className="nav nav-desktop container surface-glass" aria-label="Primary">
          <a className="brand" href="#top" aria-label="Coodra home">
            <img
              src="/images/coodra-logo.png"
              alt="Coodra"
              className="coodra-logo-img"
            />
          </a>

          <button
            type="button"
            className={`nav-toggle${isMobileMenuOpen ? ' is-open' : ''}`}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-menu"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          <ul className="nav-links">
            <li><a href="#how-it-works">How it works</a></li>
            <li><a href="#decision">Decision Engine</a></li>
            <li><a href="#proof">Proof</a></li>
            <li><Link to="/pricing">Pricing</Link></li>
          </ul>
          <div className="nav-actions">
            <Link to="/login" className="btn btn-ghost">Sign in</Link>
            <Link to="/signup" className="btn btn-primary">Start Free</Link>
          </div>

          <button
            type="button"
            className={`mobile-nav-overlay${isMobileMenuOpen ? ' is-open' : ''}`}
            aria-hidden={!isMobileMenuOpen}
            tabIndex={isMobileMenuOpen ? 0 : -1}
            onClick={closeMobileMenu}
          />

          <div
            id="mobile-nav-menu"
            className={`mobile-nav-menu nav-mobile surface-glass${isMobileMenuOpen ? ' is-open' : ''}`}
          >
            <p className="mobile-nav-kicker">Navigation</p>
            <ul className="mobile-nav-links">
              <li><a href="#how-it-works" onClick={closeMobileMenu}>How it works</a></li>
              <li><a href="#decision" onClick={closeMobileMenu}>Decision Engine</a></li>
              <li><a href="#proof" onClick={closeMobileMenu}>Proof</a></li>
              <li><Link to="/pricing" onClick={closeMobileMenu}>Pricing</Link></li>
            </ul>
            <div className="mobile-nav-actions">
              <Link to="/login" className="btn btn-ghost" onClick={closeMobileMenu}>Sign in</Link>
              <Link to="/signup" className="btn btn-primary" onClick={closeMobileMenu}>Start Free</Link>
            </div>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="hero container" data-aos="fade-up">
          <div className="hero-copy">
            <p className="eyebrow">Built for retail teams of every size</p>
            <h1 className="hero-headline">Your store, on autopilot.</h1>
            <p className="hero-subhead">
              Coodra reads sales, inventory, and demand in real time, then recommends the next best move to protect margin and cash flow.
            </p>
            <div
              className="hero-actions"
              onMouseEnter={() => setCoreBoosted(true)}
              onMouseLeave={() => setCoreBoosted(false)}
            >
              <Link to="/signup" className="btn btn-primary">Start Free</Link>
              <a href="#how-it-works" className="btn btn-secondary">See 3-step flow</a>
            </div>
          </div>

          <div
            className="hero-radar"
            aria-hidden="true"
            ref={radarRef}
            onMouseMove={handleRadarMove}
            onMouseLeave={handleRadarLeave}
          >
            <svg className="hero-radar-flows" viewBox="0 0 560 330" preserveAspectRatio="none">
              <path className="hero-flow-path hero-flow-path--in" d="M64 64 C 180 56, 220 105, 278 163" />
              <path className="hero-flow-path hero-flow-path--in" d="M64 163 C 190 163, 214 163, 278 163" />
              <path className="hero-flow-path hero-flow-path--in" d="M64 264 C 176 272, 224 220, 278 163" />
              <path className="hero-flow-path hero-flow-path--out" d="M282 163 C 338 112, 380 73, 492 64" />
              <path className="hero-flow-path hero-flow-path--out" d="M282 163 C 340 163, 384 163, 492 163" />
              <path className="hero-flow-path hero-flow-path--out" d="M282 163 C 340 214, 382 256, 492 264" />
              <circle className="hero-flow-dot hero-flow-dot--a" r="5" />
              <circle className="hero-flow-dot hero-flow-dot--b" r="5" />
              <circle className="hero-flow-dot hero-flow-dot--c" r="5" />
            </svg>

            <div className="hero-signal-tokens">
              <span className="hero-signal-token token-pos">POS</span>
              <span className="hero-signal-token token-sku">SKU</span>
              <span className="hero-signal-token token-margin">Margin</span>
              <span className="hero-signal-token token-sellthrough">Sell-through</span>
            </div>

            <div className="hero-radar-column hero-radar-column--incoming">
              {heroIncomingSignals.map((signal) => (
                <article key={signal.title} className="hero-radar-card hero-radar-card--incoming">
                  <p>{signal.title}</p>
                  <span>{signal.meta}</span>
                </article>
              ))}
            </div>

            <div className={`hero-radar-core${coreBoosted ? ' is-boosted' : ''}`}>
              <span className="hero-radar-ring hero-radar-ring--a" />
              <span className="hero-radar-ring hero-radar-ring--b" />
              <span className="hero-radar-ring hero-radar-ring--pulse" />
              <img src="/images/logo.png" alt="" className="hero-radar-logo" />
              <div className="hero-radar-terminal">
                <span className="hero-radar-terminal-label">Decision:</span>
                <span className="hero-radar-terminal-line">Reorder 142 units</span>
                <span className="hero-radar-terminal-caret" />
              </div>
            </div>

            <div className="hero-radar-column hero-radar-column--outgoing">
              {heroOutgoingDecisions.map((decision) => (
                <article key={decision.tag} className="hero-radar-card hero-radar-card--outgoing">
                  <p>{decision.tag}</p>
                  <span>{decision.title}</span>
                </article>
              ))}
            </div>
          </div>

          {!isLiteHero ? (
            <div className="hero-atmosphere" aria-hidden="true">
              <canvas id="hero-particles" className="hero-particles-canvas" />
            </div>
          ) : null}
        </section>

        {/* Video placeholder */}
        <section id="media-expand" className="media-expand container" aria-label="Coodra product reel placeholder" data-aos="fade-up" data-aos-delay="100">
          <div className="media-expand-stage" data-reveal="up">
            <div className="media-expand-frame" aria-hidden="true">
              <div className="media-expand-placeholder">
                <div className="media-expand-placeholder-inner">
                  <span className="media-expand-play" />
                  <p>See Coodra in action</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="how-it-works container" data-aos="fade-up" data-aos-delay="150">
          <div className="how-scroll" data-reveal="up">
            <header className="how-sticky-head" data-reveal="up">
              <p className="eyebrow">How it works</p>
              <h2>Three steps from signal to action.</h2>
              <p className="how-scroll-sub">Connect your systems, review AI recommendations, and approve decisions in minutes.</p>
            </header>

            <div className="how-scroll-track" aria-label="Three connected steps">
              <div className="how-flip-stage">
                <article className="how-pill-card how-flip-card" id="howFlipCard">
                  <p className="how-step-tag" id="howFlipTag">Step 1</p>
                  <h3 id="howFlipTitle">Connect your data</h3>
                  <p id="howFlipBody">Sync POS, catalog, and inventory data so Coodra sees what is happening now.</p>
                </article>
              </div>
              <div className="how-trigger-rail">
                <div className="how-trigger is-active" data-how-step="1" data-tag="Step 1" data-title="Connect your data" data-body="Sync POS, catalog, and inventory data so Coodra sees what is happening now." />
                <div className="how-trigger" data-how-step="2" data-tag="Step 2" data-title="Get ranked actions" data-body="Coodra scores demand shifts, margin pressure, and stock risk to prioritize what matters most." />
                <div className="how-trigger" data-how-step="3" data-tag="Step 3" data-title="Approve and move" data-body="Approve recommendations fast and keep your team focused on high-impact decisions." />
              </div>
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
          <div className="integrations-showcase">
            <div className="integrations-showcase-head">
              <div className="integrations-copy">
                <p className="eyebrow">Integrations</p>
                <h2>Plug in your systems. Decide faster every day.</h2>
                <p className="integrations-sub">
                  Connect the POS tools you already use, then let Coodra turn daily sales and inventory signals into clear next actions your team can approve.
                </p>
              </div>
              <div
                className="integrations-illustration"
                aria-hidden="true"
                onMouseMove={handleIntegrationVisualMove}
                onMouseLeave={handleIntegrationVisualLeave}
              >
                <div className="integrations-node-grid" />
                <div className="integrations-node-grid-highlight" />
                <div className="integrations-node-core">
                  <img src="/images/logo.png" alt="Coodra icon" />
                </div>
                <span className="integrations-node-dot dot-a" />
                <span className="integrations-node-dot dot-b" />
                <span className="integrations-node-dot dot-c" />
              </div>
            </div>

            <div className="integrations-list" data-stagger role="list" aria-label="Coodra POS integrations">
              {integrationShowcaseItems.map((item) => (
                <article key={item.name} className="integration-row" role="listitem">
                  <div className={`integration-logo ${item.className}`}>
                    <img src={item.iconSrc} alt={`${item.name} logo`} />
                  </div>
                  <div className="integration-text">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Decision Engine */}
        <section id="decision" className="decision-band container" data-aos="fade-up" data-aos-delay="250">
          <div className="decision-layout">
            <header className="decision-copy" data-reveal="up">
              <p className="eyebrow">Why teams switch to Coodra</p>
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
        </section>

        {/* Proof / Testimonials */}
        <section id="proof" className="proof testimonials-section container" data-aos="fade-up" data-aos-delay="300" data-reveal="up">
          <p className="eyebrow">Real business outcomes</p>
          <h2 className="proof-title-lines">
            <span className="proof-title-line">Teams move faster and</span>
            <span className="proof-title-line">miss fewer opportunities.</span>
          </h2>
          <p className="proof-subline">See how retailers use Coodra to act earlier and protect revenue.</p>

          <div className="testimonials-viewport" data-reveal="up" aria-label="Customer outcomes">
            <div className="testimonials-marquee" data-marquee>
              <article className="t-card">
                <div className="t-author"><span className="t-avatar">SJ</span><div><p>Sophie J.</p><small>Multi-location grocery</small></div></div>
                <blockquote>Coodra flagged stockout risk two days earlier. We recovered weekend sales before it hurt us.</blockquote>
              </article>
              <article className="t-card">
                <div className="t-author"><span className="t-avatar">ML</span><div><p>Marcus L.</p><small>Specialty pet retail</small></div></div>
                <blockquote>Reorder recommendations are clearer than our old reports. My team moves in minutes now.</blockquote>
              </article>
              <article className="t-card">
                <div className="t-author"><span className="t-avatar">AG</span><div><p>Ariana G.</p><small>Health & wellness</small></div></div>
                <blockquote>We stopped over-ordering low velocity SKUs and protected margin in the same month.</blockquote>
              </article>
              <article className="t-card">
                <div className="t-author"><span className="t-avatar">TR</span><div><p>Tyler R.</p><small>Convenience stores</small></div></div>
                <blockquote>The why behind each suggestion made approvals easy for operators and owners.</blockquote>
              </article>
              <article className="t-card">
                <div className="t-author"><span className="t-avatar">EB</span><div><p>Elena B.</p><small>Beauty retail</small></div></div>
                <blockquote>Coodra highlighted weak movers we kept missing. We corrected mix faster than ever.</blockquote>
              </article>
              <article className="t-card">
                <div className="t-author"><span className="t-avatar">DK</span><div><p>David K.</p><small>Electronics chain</small></div></div>
                <blockquote>Signal quality is strong. It feels like an operator that never sleeps.</blockquote>
              </article>
            </div>
            <div className="testimonials-fade testimonials-fade-left" aria-hidden="true" />
            <div className="testimonials-fade testimonials-fade-right" aria-hidden="true" />
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="cta container surface-contrast" data-aos="fade-up" data-aos-delay="350" data-reveal="up">
          <h2>Ready to make better retail decisions this week?</h2>
          <p>Connect your data, review AI-ranked actions, and approve your first decision in minutes.</p>
          <div className="cta-actions">
            <Link to="/signup" className="btn btn-primary">Start Free</Link>
            <Link to="/pricing" className="btn btn-secondary">View Pricing</Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer premium-footer">
        <div className="footer-bg-gradient" aria-hidden="true" />
        <div className="container footer-premium-inner">
          <div className="footer-grid">
            <section className="footer-brand-col">
              <p className="footer-kicker">Retail Decision Intelligence</p>
              <p className="footer-summary">Coodra helps any retail business turn live data into high-confidence actions.</p>
              <div className="footer-socials">
                <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">in</a>
                <a href="https://x.com" target="_blank" rel="noreferrer">x</a>
                <a href="https://www.youtube.com" target="_blank" rel="noreferrer">yt</a>
              </div>
            </section>

            <section className="footer-link-col">
              <h3>Product</h3>
              <a href="#">Decision Engine</a>
              <a href="#">Performance Center</a>
              <Link to="/integrations">Integrations</Link>
              <Link to="/pricing">Pricing</Link>
            </section>

            <section className="footer-link-col">
              <h3>Solutions</h3>
              <a href="#">Grocery</a>
              <a href="#">Convenience</a>
              <a href="#">Specialty Retail</a>
              <a href="#">Multi-store Ops</a>
            </section>

            <section className="footer-link-col">
              <h3>Resources</h3>
              <Link to="/blog">Blog</Link>
              <a href="#">Docs</a>
              <Link to="/case-studies">Case Studies</Link>
              <a href="#">API Status</a>
              <Link to="/security">Security</Link>
            </section>

            <section className="footer-link-col">
              <h3>Company</h3>
              <Link to="/about">About</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/contact">Contact</Link>
            </section>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2026 Coodra. All rights reserved.</p>
            <img
              src="/images/coodra-logo.png"
              alt="Coodra"
              style={{ height: 140, width: 'auto', display: 'block', opacity: 0.7 }}
            />
          </div>
        </div>
      </footer>
    </div>
  )
}







