import { useEffect, type CSSProperties, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
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

const heroRotatingPhrases = [
  'Retail Decisions',
  'Profitable Actions',
  'Clear Priorities',
  'Faster Execution',
]

const heroGridCells = Array.from({ length: 140 }, (_, index) => ({
  index,
  delay: (index % 14) * 45 + Math.floor(index / 14) * 36,
  accent: index % 17 === 0 || index % 29 === 0,
}))

export default function LandingPage() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [typedPhrase, setTypedPhrase] = useState('')
  const [typingPhase, setTypingPhase] = useState<'typing' | 'holding' | 'deleting'>('typing')
  const [cursorVisible, setCursorVisible] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

    // Load landing page JS for globe/particles animations
    const loadScript = () => {
      if (document.getElementById('landing-app-script')) return
      const script = document.createElement('script')
      script.id = 'landing-app-script'
      script.src = '/landing/app.js'
      script.defer = true
      document.body.appendChild(script)
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadScript)
    } else {
      loadScript()
    }

    return () => {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => {
      setCursorVisible((visible) => !visible)
    }, 520)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const phrase = heroRotatingPhrases[phraseIndex]
    let timeout = 0

    if (typingPhase === 'typing') {
      if (typedPhrase.length < phrase.length) {
        timeout = window.setTimeout(() => {
          setTypedPhrase(phrase.slice(0, typedPhrase.length + 1))
        }, 58)
      } else {
        timeout = window.setTimeout(() => {
          setTypingPhase('holding')
        }, 900)
      }
    } else if (typingPhase === 'holding') {
      timeout = window.setTimeout(() => {
        setTypingPhase('deleting')
      }, 850)
    } else if (typedPhrase.length > 0) {
      timeout = window.setTimeout(() => {
        setTypedPhrase(phrase.slice(0, typedPhrase.length - 1))
      }, 36)
    } else {
      timeout = window.setTimeout(() => {
        setPhraseIndex((current) => (current + 1) % heroRotatingPhrases.length)
        setTypingPhase('typing')
      }, 240)
    }

    return () => window.clearTimeout(timeout)
  }, [phraseIndex, typedPhrase, typingPhase])

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

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <div className="site-shell" id="top">
      {/* Ambient background orbs */}
      <div className="ambient ambient-a" aria-hidden="true" />
      <div className="ambient ambient-b" aria-hidden="true" />
      <div className="ambient ambient-c" aria-hidden="true" />
      <div className="mesh-grid" aria-hidden="true" />
      <div className="noise-layer" aria-hidden="true" />

      {/* Header / Nav */}
      <header className="site-header">
        <nav className="nav container" aria-label="Primary">
          <a className="brand" href="/#top" aria-label="Coodra home">
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
            <li><a href="/#how-it-works">How it works</a></li>
            <li><a href="/#decision">Decision Engine</a></li>
            <li><a href="/#proof">Proof</a></li>
            <li><Link to="/pricing">Pricing</Link></li>
          </ul>
          <div className="nav-actions">
            <Link to="/login" className="btn btn-ghost">Sign in</Link>
            <Link to="/signup" className="btn btn-primary">Start Free</Link>
          </div>

          <div
            id="mobile-nav-menu"
            className={`mobile-nav-menu${isMobileMenuOpen ? ' is-open' : ''}`}
          >
            <ul className="mobile-nav-links">
              <li><a href="/#how-it-works" onClick={closeMobileMenu}>How it works</a></li>
              <li><a href="/#decision" onClick={closeMobileMenu}>Decision Engine</a></li>
              <li><a href="/#proof" onClick={closeMobileMenu}>Proof</a></li>
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
        <section className="hero container">
          <div className="hero-data-grid" aria-hidden="true">
            {heroGridCells.map((cell) => (
              <span
                key={cell.index}
                className={`hero-data-grid-cell${cell.accent ? ' is-accent' : ''}`}
                style={{ '--cell-delay': `${cell.delay}ms` } as CSSProperties}
              />
            ))}
          </div>

          <div className="hero-copy">
            <p className="eyebrow">Built for retail teams of every size</p>
            <h1 className="hero-main-line">Turn live store data into</h1>
            <div className="hero-rotate-wrap" aria-live="polite" aria-atomic="true">
              <span className="hero-rotate-text">
                {typedPhrase}
                <span className={`hero-caret${cursorVisible ? ' is-visible' : ''}`} aria-hidden="true">
                  |
                </span>
              </span>
            </div>
            <p className="hero-subhead">
              Coodra tracks sales, inventory, and demand signals in real time, then recommends exactly what to reorder, replace, remove, and protect so your team can act fast.
            </p>
            <div className="hero-actions">
              <Link to="/signup" className="btn btn-primary">Start Free</Link>
              <a href="/#how-it-works" className="btn btn-secondary">See 3-step flow</a>
            </div>
          </div>

          <div className="hero-atmosphere" aria-hidden="true">
            <canvas id="hero-particles" className="hero-particles-canvas" />
          </div>
        </section>

        {/* Video placeholder */}
        <section id="media-expand" className="media-expand container" aria-label="Coodra product reel placeholder">
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
        <section id="how-it-works" className="how-it-works container">
          <div className="how-scroll">
            <header className="how-sticky-head">
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
        <section id="integrations" className="integrations container">
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

            <div className="integrations-list" role="list" aria-label="Coodra POS integrations">
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
        <section id="decision" className="decision-band container">
          <div className="decision-layout">
            <header className="decision-copy">
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
        <section id="proof" className="proof testimonials-section container">
          <p className="eyebrow">Real business outcomes</p>
          <h2>Teams move faster and miss fewer opportunities.</h2>
          <p className="proof-subline">See how retailers use Coodra to act earlier and protect revenue.</p>

          <div className="testimonials-viewport" aria-label="Customer outcomes">
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
        <section id="cta" className="cta container">
          <h2>Ready to make better retail decisions this week?</h2>
          <p>Connect your data, review AI-ranked actions, and approve your first decision in minutes.</p>
          <div className="cta-actions">
            <Link to="/signup" className="btn btn-primary">Start Free</Link>
            <Link to="/login" className="btn btn-secondary">Book a Demo</Link>
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
                <a href="#" aria-label="LinkedIn">in</a>
                <a href="#" aria-label="X">x</a>
                <a href="#" aria-label="YouTube">yt</a>
              </div>
            </section>

            <section className="footer-link-col">
              <h3>Product</h3>
              <a href="#">Decision Engine</a>
              <a href="#">Performance Center</a>
              <a href="#">Integrations</a>
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
              <a href="#">Docs</a>
              <a href="#">Case Studies</a>
              <a href="#">API Status</a>
              <a href="#">Security</a>
            </section>

            <section className="footer-link-col">
              <h3>Company</h3>
              <a href="#">About</a>
              <a href="#">Careers</a>
              <a href="#">Privacy</a>
              <a href="#">Contact</a>
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






