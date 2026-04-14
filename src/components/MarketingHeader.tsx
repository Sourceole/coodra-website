import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router'
import './MarketingHeader.css'

export default function MarketingHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  const sectionLinks = useMemo(() => {
    const prefix = location.pathname === '/' ? '' : '/'
    return {
      how: `${prefix}#how-it-works`,
      decision: `${prefix}#decision`,
      proof: `${prefix}#proof`,
    }
  }, [location.pathname])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname, location.hash])

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
    const onScroll = () => {
      setIsScrolled(window.scrollY > 8)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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
    <header className={`mh-site-header${isScrolled ? ' is-scrolled' : ''}`}>
      <nav className="mh-nav container" aria-label="Primary">
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
          <li><a href={sectionLinks.how}>How it works</a></li>
          <li><a href={sectionLinks.decision}>Decision Engine</a></li>
          <li><a href={sectionLinks.proof}>Proof</a></li>
          <li><Link to="/pricing">Pricing</Link></li>
        </ul>
        <div className="mh-nav-actions">
          <Link to="/login" className="mh-btn mh-btn-ghost">Sign in</Link>
          <Link to="/signup" className="mh-btn mh-btn-primary">Start Free</Link>
        </div>

        <button
          type="button"
          className={`mh-mobile-nav-overlay${isMobileMenuOpen ? ' is-open' : ''}`}
          aria-hidden={!isMobileMenuOpen}
          tabIndex={isMobileMenuOpen ? 0 : -1}
          onClick={closeMobileMenu}
        />

        <div
          id="mh-mobile-nav-menu"
          className={`mh-mobile-nav-menu${isMobileMenuOpen ? ' is-open' : ''}`}
        >
          <p className="mh-mobile-nav-kicker">Navigation</p>
          <ul className="mh-mobile-nav-links">
            <li><a href={sectionLinks.how} onClick={closeMobileMenu}>How it works</a></li>
            <li><a href={sectionLinks.decision} onClick={closeMobileMenu}>Decision Engine</a></li>
            <li><a href={sectionLinks.proof} onClick={closeMobileMenu}>Proof</a></li>
            <li><Link to="/pricing" onClick={closeMobileMenu}>Pricing</Link></li>
          </ul>
          <div className="mh-mobile-nav-actions">
            <Link to="/login" className="mh-btn mh-btn-ghost" onClick={closeMobileMenu}>Sign in</Link>
            <Link to="/signup" className="mh-btn mh-btn-primary" onClick={closeMobileMenu}>Start Free</Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
