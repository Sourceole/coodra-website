import MarketingHeader from '../components/MarketingHeader'
import './ExpansionPages.css'

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

export default function SecurityPage() {
  return (
    <div className="exp-page">
      <div className="exp-page__container">
        <MarketingHeader />

        <section className="exp-hero motion-fade-up">
          <p className="exp-hero__eyebrow">Security</p>
          <h1>Your data. Locked down. Always.</h1>
          <p>
            Coodra is built with practical safeguards for retail operations teams.
            We prioritize data protection, operational reliability, and transparent controls.
          </p>
          <div className="exp-hero__actions">
            <a className="exp-btn" href="/security-summary.pdf" download>
              Download security summary
            </a>
          </div>
        </section>

        <section className="exp-pipeline" aria-label="Security operating model">
          <article className="exp-pipeline__step">
            <p className="exp-pipeline__label">Control</p>
            <div>
              <h2>Defense starts at integration boundaries.</h2>
              <p>Scoped credentials and explicit permission design reduce blast radius across retail systems.</p>
            </div>
          </article>
          <article className="exp-pipeline__step">
            <p className="exp-pipeline__label">Detection</p>
            <div>
              <h2>Operational telemetry is monitored continuously.</h2>
              <p>We track suspicious behavior and escalate with runbook-ready context.</p>
            </div>
          </article>
          <article className="exp-pipeline__step">
            <p className="exp-pipeline__label">Response</p>
            <div>
              <h2>Incidents move through a defined SLA workflow.</h2>
              <p>Teams receive status visibility and recovery actions without losing auditability.</p>
            </div>
          </article>
        </section>

        <section className="security-matrix" aria-label="Security controls and status">
          {claims.map((row) => (
            <article key={row.claim} className="security-matrix__row">
              <h3>{row.claim}</h3>
              <p>{row.evidence}</p>
              <span className={`status-pill status-pill--${row.status.toLowerCase().replace(' ', '-')}`}>
                {row.status}
              </span>
            </article>
          ))}
          <p className="security-note">
            Need a deeper technical review? Email <a href="mailto:admin@coodra.com">admin@coodra.com</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
