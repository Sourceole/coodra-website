import { useEffect } from 'react'
import { Link } from 'react-router'
import { Activity, Download, Lock, ShieldCheck, Sparkles } from 'lucide-react'
import MarketingHeader from '../components/MarketingHeader'
import MarketingFooter from '../components/MarketingFooter'
import './SecurityPage.css'

const claims = [
  {
    claim: 'Data encrypted at rest (AES-256)',
    evidence: 'Architecture controls (available on request)',
    status: 'Implemented',
  },
  {
    claim: 'Data encrypted in transit (TLS 1.2+)',
    evidence: 'Transport security policy and edge configuration',
    status: 'Implemented',
  },
  {
    claim: 'API keys scoped to least privilege',
    evidence: 'Integration key policy documentation',
    status: 'Implemented',
  },
  {
    claim: 'GDPR alignment',
    evidence: 'Privacy policy and DPA process',
    status: 'In Progress',
  },
  {
    claim: 'CCPA alignment',
    evidence: 'Privacy rights workflow',
    status: 'In Progress',
  },
  {
    claim: 'Incident response SLA: 24 hours',
    evidence: 'Response runbook (available on request)',
    status: 'Implemented',
  },
  {
    claim: 'Data residency: Canada + US',
    evidence: 'Infrastructure region strategy',
    status: 'Planned',
  },
]

const operatingModel = [
  {
    icon: Lock,
    label: 'Control',
    title: 'Defense starts at integration boundaries.',
    body: 'Scoped credentials and explicit permission design reduce blast radius across retail systems.',
  },
  {
    icon: Activity,
    label: 'Detection',
    title: 'Operational telemetry is monitored continuously.',
    body: 'We track suspicious behavior and escalate with runbook-ready context.',
  },
  {
    icon: ShieldCheck,
    label: 'Response',
    title: 'Incidents move through a defined SLA workflow.',
    body: 'Teams receive status visibility and recovery actions without losing auditability.',
  },
]

export default function SecurityPage() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.security-reveal'))
    if (!nodes.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="security-v2-page">
      <div className="security-v2-container">
        <MarketingHeader />

        <main className="security-v2-main">
          <section className="security-v2-hero security-reveal is-visible" aria-label="Security hero">
            <div className="security-v2-hero__bg" aria-hidden="true">
              <span className="security-v2-hero__orb security-v2-hero__orb--a" />
              <span className="security-v2-hero__orb security-v2-hero__orb--b" />
              <span className="security-v2-hero__orb security-v2-hero__orb--c" />
              <span className="security-v2-hero__spark security-v2-hero__spark--a" />
              <span className="security-v2-hero__spark security-v2-hero__spark--b" />
              <span className="security-v2-hero__spark security-v2-hero__spark--c" />
            </div>
            <div className="security-v2-inner">
              <p className="security-v2-badge">
                <Sparkles size={14} aria-hidden="true" />
                Security
              </p>
              <h1>
                YOUR DATA.
                <br />
                <em>LOCKED DOWN.</em>
              </h1>
              <p>
                Coodra is built with practical safeguards for retail operations teams. We prioritize data protection,
                operational reliability, and transparent controls.
              </p>
              <div className="security-v2-hero__actions">
                <a className="security-v2-btn security-v2-btn--primary" href="/security-summary.pdf" download>
                  <Download size={16} aria-hidden="true" />
                  Download Security Summary
                </a>
                <Link className="security-v2-btn security-v2-btn--ghost" to="/contact">
                  Contact Security Team
                </Link>
              </div>
            </div>
          </section>

          <section className="security-v2-model security-reveal" aria-label="Security operating model">
            <div className="security-v2-model__ambient" aria-hidden="true" />
            <div className="security-v2-inner">
              <header>
                <p className="security-v2-eyebrow">Operating Model</p>
                <h2>How Coodra secures daily decision workflows.</h2>
              </header>
              <div className="security-v2-model__grid">
                {operatingModel.map((item) => (
                  <article key={item.label}>
                    <div className="security-v2-model__icon" aria-hidden="true">
                      <item.icon size={18} />
                    </div>
                    <p className="security-v2-model__label">{item.label}</p>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="security-v2-matrix security-reveal" aria-label="Security controls and status">
            <div className="security-v2-matrix__ambient" aria-hidden="true" />
            <div className="security-v2-inner">
              <header>
                <p className="security-v2-eyebrow">Controls</p>
                <h2>Implementation status by control area.</h2>
              </header>
              <div className="security-v2-matrix__rows">
                {claims.map((row) => (
                  <article key={row.claim} className="security-v2-matrix__row">
                    <div className="security-v2-matrix__copy">
                      <h3>{row.claim}</h3>
                      <p>{row.evidence}</p>
                    </div>
                    <span className={`security-v2-status security-v2-status--${row.status.toLowerCase().replace(' ', '-')}`}>
                      {row.status}
                    </span>
                  </article>
                ))}
              </div>
              <p className="security-v2-note">
                Need a deeper technical review? Email <a href="mailto:admin@coodra.com">admin@coodra.com</a>.
              </p>
            </div>
          </section>

          <section className="security-v2-cta security-reveal" aria-label="Security CTA">
            <div className="security-v2-inner">
              <h2>Need security documentation for procurement?</h2>
              <p>We can share architecture notes, control evidence, and response workflows with your team.</p>
              <div className="security-v2-cta__actions">
                <Link to="/contact" className="security-v2-btn security-v2-btn--primary">
                  Send Message
                </Link>
              </div>
            </div>
          </section>
        </main>

        <MarketingFooter />
      </div>
    </div>
  )
}
