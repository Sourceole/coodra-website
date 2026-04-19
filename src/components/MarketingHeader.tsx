import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { createPortal } from 'react-dom'
import './MarketingHeader.css'

const platformFeatures = [
  {
    to: '/integrations',
    title: 'Integrations',
    description: 'Connect Shopify, Square, Lightspeed, Clover, and Moneris in minutes.',
    icon: 'plug',
  },
  {
    to: '/security',
    title: 'Security',
    description: 'Enterprise-grade controls, encrypted data, and clear guardrails.',
    icon: 'shield',
  },
  {
    to: '/contact',
    title: 'Support',
    description: 'Get implementation help and fast answers from the Coodra team.',
    icon: 'chat',
  },
]

export default function MarketingHeader() {
  const [isMounted, setIsMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobilePlatformOpen, setIsMobilePlatformOpen] = useState(false)
  const [isPlatformMenuOpen, setIsPlatformMenuOpen] = useState(false)
  const platformMenuRef = useRef<HTMLLIElement | null>(null)
  const platformCloseTimerRef = useRef<number | null>(null)

  const cancelPlatformClose = () => {
    if (platformCloseTimerRef.current !== null) {
      window.clearTimeout(platformCloseTimerRef.current)
      platformCloseTimerRef.current = null
    }
  }

  const openPlatformMenu = () => {
    cancelPlatformClose()
    setIsPlatformMenuOpen(true)
  }

  const schedulePlatformClose = () => {
    cancelPlatformClose()
    platformCloseTimerRef.current = window.setTimeout(() => {
      setIsPlatformMenuOpen(false)
      platformCloseTimerRef.current = null
    }, 140)
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false)
        setIsMobilePlatformOpen(false)
      }
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
        setIsMobilePlatformOpen(false)
        setIsPlatformMenuOpen(false)
      }
    }

    window.addEventListener('resize', closeOnDesktop, { passive: true })
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      window.removeEventListener('resize', closeOnDesktop)
      window.removeEventListener('keydown', closeOnEscape)
      cancelPlatformClose()
    }
  }, [])

  useEffect(() => {
    if (window.innerWidth <= 768) {
      document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!isPlatformMenuOpen) return
      if (!platformMenuRef.current) return
      if (platformMenuRef.current.contains(event.target as Node)) return
      setIsPlatformMenuOpen(false)
    }

    window.addEventListener('mousedown', onClickOutside)
    return () => window.removeEventListener('mousedown', onClickOutside)
  }, [isPlatformMenuOpen])

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    setIsMobilePlatformOpen(false)
  }

  const mobileNavLayer = (
    <>
      <button
        type="button"
        className={`mh-mobile-nav-overlay${isMobileMenuOpen ? ' is-open' : ''}`}
        aria-hidden={!isMobileMenuOpen}
        tabIndex={isMobileMenuOpen ? 0 : -1}
        onClick={closeMobileMenu}
      />

      <div id="mh-mobile-nav-menu" className={`mh-mobile-nav-menu${isMobileMenuOpen ? ' is-open' : ''}`}>
        <div className="mh-mobile-nav-topbar">
          <p className="mh-mobile-nav-kicker">
            <span className="mh-mobile-nav-kicker-icon" aria-hidden="true">
              <svg viewBox="0 0 16 16">
                <path d="M8 1.9c.26 1.38 1.34 2.46 2.72 2.72C9.34 4.88 8.26 5.96 8 7.34 7.74 5.96 6.66 4.88 5.28 4.62 6.66 4.36 7.74 3.28 8 1.9Zm3.8 5.3c.18.9.9 1.62 1.8 1.8-.9.18-1.62.9-1.8 1.8-.18-.9-.9-1.62-1.8-1.8.9-.18 1.62-.9 1.8-1.8Z" />
              </svg>
            </span>
            Navigation
          </p>
          <button
            type="button"
            className="mh-mobile-nav-close"
            aria-label="Close navigation menu"
            onClick={closeMobileMenu}
          >
            <span />
            <span />
          </button>
        </div>
        <ul className="mh-mobile-nav-links">
          <li className={`mh-mobile-group${isMobilePlatformOpen ? ' is-open' : ''}`}>
            <button
              type="button"
              className="mh-mobile-group-toggle"
              aria-expanded={isMobilePlatformOpen}
              onClick={() => setIsMobilePlatformOpen((open) => !open)}
            >
              Platform
              <span className="mh-mobile-group-caret" aria-hidden="true" />
            </button>
            <div className="mh-mobile-group-panel">
              <ul className="mh-mobile-feature-list">
                {platformFeatures.map((feature) => (
                  <li key={feature.to}>
                    <Link to={feature.to} onClick={closeMobileMenu}>
                      <span className="mh-platform-icon" aria-hidden="true">
                        {feature.icon === 'plug' ? (
                          <svg viewBox="0 0 16 16">
                            <path d="M5.2 2.6a.8.8 0 0 1 1.6 0v1h2.4v-1a.8.8 0 0 1 1.6 0v1h.6a.8.8 0 0 1 0 1.6h-.6v1.1a3.9 3.9 0 0 1-3.2 3.8v2.7h1.8a.8.8 0 0 1 0 1.6H6.6a.8.8 0 1 1 0-1.6h1.8V10a3.9 3.9 0 0 1-3.2-3.8V5.2h-.6a.8.8 0 0 1 0-1.6h.6v-1Z" />
                          </svg>
                        ) : null}
                        {feature.icon === 'shield' ? (
                          <svg viewBox="0 0 16 16">
                            <path d="M8 1.8 3.3 3.5v3.4c0 3.2 2 6 4.7 7.3 2.7-1.3 4.7-4 4.7-7.3V3.5L8 1.8Zm0 2 3.1 1.1v2c0 2.3-1.3 4.5-3.1 5.6-1.8-1.1-3.1-3.3-3.1-5.6v-2L8 3.8Z" />
                          </svg>
                        ) : null}
                        {feature.icon === 'chat' ? (
                          <svg viewBox="0 0 16 16">
                            <path d="M8 2.4c-3.2 0-5.8 2-5.8 4.6 0 1.6 1 3 2.5 3.8v2.1c0 .4.4.7.8.5l2.4-1.2c.2 0 .4.1.6.1 3.2 0 5.8-2 5.8-4.6S11.2 2.4 8 2.4Zm-2 4.8a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6Zm2 0a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6Zm2 0a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6Z" />
                          </svg>
                        ) : null}
                      </span>
                      <span className="mh-mobile-feature-copy">
                        <strong>{feature.title}</strong>
                        <span>{feature.description}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link to="/about" className="mh-mobile-discover-link" onClick={closeMobileMenu}>
                Discover Coodra
              </Link>
            </div>
          </li>
          <li><Link to="/#how-it-works" onClick={closeMobileMenu}>How it works</Link></li>
          <li><Link to="/pricing" onClick={closeMobileMenu}>Pricing</Link></li>
          <li><Link to="/#decision" onClick={closeMobileMenu}>Decision Engine</Link></li>
          <li><Link to="/#proof" onClick={closeMobileMenu}>Proof</Link></li>
        </ul>
        <div className="mh-mobile-nav-actions">
          <Link to="/login" className="mh-sign-in" onClick={closeMobileMenu}>Sign in</Link>
          <Link to="/signup" className="mh-btn-start" onClick={closeMobileMenu}>Start for free</Link>
        </div>
      </div>
    </>
  )

  return (
    <header className="mh-site-header">
      <nav className="mh-nav-white" aria-label="Primary">
        <div className="mh-nav">
          <Link className="mh-brand" to="/" aria-label="Coodra home">
            <img src="/images/coodra-logo.png" alt="Coodra" className="coodra-logo-img" />
          </Link>

          <button
            type="button"
            className={`mh-nav-toggle${isMobileMenuOpen ? ' is-open' : ''}`}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mh-mobile-nav-menu"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          <ul className="mh-nav-links">
            <li
              ref={platformMenuRef}
              className={`mh-nav-item mh-has-mega${isPlatformMenuOpen ? ' is-open' : ''}`}
              onMouseEnter={openPlatformMenu}
              onMouseLeave={schedulePlatformClose}
            >
              <button
                type="button"
                className="mh-nav-trigger"
                aria-expanded={isPlatformMenuOpen}
                aria-controls="mh-platform-mega"
                onClick={() => {
                  cancelPlatformClose()
                  setIsPlatformMenuOpen((open) => !open)
                }}
              >
                Platform
                <span className="mh-nav-caret" aria-hidden="true" />
              </button>

              <div
                id="mh-platform-mega"
                className={`mh-platform-mega${isPlatformMenuOpen ? ' is-open' : ''}`}
                onMouseEnter={openPlatformMenu}
                onMouseLeave={schedulePlatformClose}
              >
                <div className="mh-platform-mega-grid">
                  <div className="mh-platform-col">
                    <p className="mh-platform-col-title">Features</p>
                    <ul className="mh-platform-list">
                      {platformFeatures.map((feature) => (
                        <li key={feature.to}>
                          <Link to={feature.to} className="mh-platform-link" onClick={() => setIsPlatformMenuOpen(false)}>
                            <span className="mh-platform-icon" aria-hidden="true">
                              {feature.icon === 'plug' ? (
                                <svg viewBox="0 0 16 16">
                                  <path d="M5.2 2.6a.8.8 0 0 1 1.6 0v1h2.4v-1a.8.8 0 0 1 1.6 0v1h.6a.8.8 0 0 1 0 1.6h-.6v1.1a3.9 3.9 0 0 1-3.2 3.8v2.7h1.8a.8.8 0 0 1 0 1.6H6.6a.8.8 0 1 1 0-1.6h1.8V10a3.9 3.9 0 0 1-3.2-3.8V5.2h-.6a.8.8 0 0 1 0-1.6h.6v-1Z" />
                                </svg>
                              ) : null}
                              {feature.icon === 'shield' ? (
                                <svg viewBox="0 0 16 16">
                                  <path d="M8 1.8 3.3 3.5v3.4c0 3.2 2 6 4.7 7.3 2.7-1.3 4.7-4 4.7-7.3V3.5L8 1.8Zm0 2 3.1 1.1v2c0 2.3-1.3 4.5-3.1 5.6-1.8-1.1-3.1-3.3-3.1-5.6v-2L8 3.8Z" />
                                </svg>
                              ) : null}
                              {feature.icon === 'chat' ? (
                                <svg viewBox="0 0 16 16">
                                  <path d="M8 2.4c-3.2 0-5.8 2-5.8 4.6 0 1.6 1 3 2.5 3.8v2.1c0 .4.4.7.8.5l2.4-1.2c.2 0 .4.1.6.1 3.2 0 5.8-2 5.8-4.6S11.2 2.4 8 2.4Zm-2 4.8a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6Zm2 0a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6Zm2 0a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6Z" />
                                </svg>
                              ) : null}
                            </span>
                            <span className="mh-platform-copy">
                              <strong>{feature.title}</strong>
                              <span>{feature.description}</span>
                            </span>
                            <span className="mh-platform-arrow" aria-hidden="true">&rarr;</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </li>
            <li><Link to="/#how-it-works">How it works</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li><Link to="/#decision">Decision Engine</Link></li>
            <li><Link to="/#proof">Proof</Link></li>
          </ul>

          <div className="mh-nav-actions">
            <Link to="/login" className="mh-sign-in">Sign in</Link>
            <Link to="/signup" className="mh-btn-start">Start for free</Link>
          </div>

        </div>
      </nav>
      <div className="mh-spacer" aria-hidden="true" />
      {isMounted ? createPortal(mobileNavLayer, document.body) : null}
    </header>
  )
}
