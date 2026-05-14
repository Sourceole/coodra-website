import { Link } from 'react-router'
import {
  CheckCircle2,
  Clock3,
  Download,
  Globe,
  Lock,
  Mail,
  Puzzle,
  ShieldCheck,
  UserCheck,
} from 'lucide-react'
import MarketingHeader from '../components/MarketingHeader'
import MarketingFooter from '../components/MarketingFooter'
import './SecurityPage.css'

type SecurityStep = {
  id: string
  title: string
  body: string
  Icon: typeof Lock
}

type SecurityControl = {
  label: string
  status: 'Implemented' | 'In Progress' | 'Planned'
  Icon: typeof Lock
}

const steps: SecurityStep[] = [
  {
    id: '1. Control',
    title: 'Control',
    body:
      'We enforce strong integration boundaries with scoped credentials and least-privilege access, so your data stays in the right hands.',
    Icon: Lock,
  },
  {
    id: '2. Detection',
    title: 'Detection',
    body:
      'Continuous telemetry and anomaly detection monitor suspicious behavior across systems, users, and data flows.',
    Icon: Globe,
  },
  {
    id: '3. Response',
    title: 'Response',
    body:
      'Our security team follows a defined incident workflow with SLA-backed response, recovery actions, and full auditability.',
    Icon: ShieldCheck,
  },
]

const controls: SecurityControl[] = [
  { label: 'Data encrypted at rest (AES-256)', status: 'Implemented', Icon: Lock },
  { label: 'Data encrypted in transit (TLS 1.2+)', status: 'Implemented', Icon: ShieldCheck },
  { label: 'Role-based access controls', status: 'Implemented', Icon: UserCheck },
  { label: 'GDPR alignment', status: 'In Progress', Icon: Globe },
  { label: 'CCPA alignment', status: 'In Progress', Icon: Globe },
  { label: 'Incident response SLA: 24 hours', status: 'Implemented', Icon: Clock3 },
  { label: 'Data residency: Canada + US', status: 'Planned', Icon: Globe },
]

function statusClass(status: SecurityControl['status']) {
  if (status === 'Implemented') return 'security-status security-status--implemented'
  if (status === 'In Progress') return 'security-status security-status--progress'
  return 'security-status security-status--planned'
}

export default function SecurityPage() {
  return (
    <div className="security-page-v3">
      <MarketingHeader />

      <main className="security-main-v3">
        <section className="security-hero-v3" aria-label="Security overview">
          <div className="security-shell">
            <div className="security-hero-grid">
              <div className="security-hero-copy">
                <p className="security-eyebrow">
                  <span className="security-eyebrow-icon" aria-hidden="true">
                    <ShieldCheck size={12} />
                  </span>
                  Security
                </p>
                <h1>Your data. Locked down.</h1>
                <p>
                  Enterprise-grade safeguards for independent retail operations. Coodra prioritizes data protection,
                  operational reliability, and transparent controls so you can run with confidence.
                </p>
                <div className="security-hero-actions">
                  <a className="security-btn security-btn--primary" href="/security-summary.pdf" download>
                    <Download size={16} aria-hidden="true" />
                    Download Security Summary
                  </a>
                  <Link className="security-btn security-btn--secondary" to="/contact">
                    <Mail size={16} aria-hidden="true" />
                    Contact Security Team
                  </Link>
                </div>
              </div>

              <div className="security-hero-media">
                <img src="/images/security/security.png" alt="Security architecture overview" loading="eager" decoding="async" />
              </div>
            </div>
          </div>
        </section>

        <section className="security-section-v3" aria-label="How Coodra secures daily decision workflows">
          <div className="security-shell">
            <h2 className="security-section-title">How Coodra secures daily decision workflows</h2>
            <div className="security-steps-grid">
              {steps.map((step) => (
                <article key={step.id} className="security-step-card">
                  <span className="security-step-icon" aria-hidden="true">
                    <step.Icon size={20} />
                  </span>
                  <div>
                    <h3>
                      <span className="security-step-id">{step.id}</span> {step.title}
                    </h3>
                    <p>{step.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="security-section-v3" aria-label="Implementation status by control area">
          <div className="security-shell">
            <h2 className="security-section-title">Implementation status by control area</h2>
            <div className="security-controls-grid">
              {controls.map((item) => (
                <article key={item.label} className="security-control-card">
                  <div className="security-control-left">
                    <span className="security-control-icon" aria-hidden="true">
                      <item.Icon size={18} />
                    </span>
                    <h3>{item.label}</h3>
                  </div>
                  <span className={statusClass(item.status)}>{item.status}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="security-section-v3" aria-label="Security posture">
          <div className="security-shell">
            <div className="security-posture-strip">
              <div className="security-posture-item">
                <UserCheck size={20} aria-hidden="true" />
                <span>Human approval on every action</span>
              </div>
              <div className="security-posture-item">
                <Puzzle size={20} aria-hidden="true" />
                <span>No ERP required</span>
              </div>
              <div className="security-posture-item">
                <ShieldCheck size={20} aria-hidden="true" />
                <span>Encrypted data handling</span>
              </div>
              <div className="security-posture-item">
                <CheckCircle2 size={20} aria-hidden="true" />
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </section>

        <section className="security-section-v3 security-section-v3--cta" aria-label="Security contact">
          <div className="security-shell">
            <div className="security-procurement-card">
              <div className="security-procurement-copy">
                <h2>Need security documentation for procurement?</h2>
                <p>
                  We can provide architecture notes, control evidence, and response workflows to share with your team.
                </p>
                <p className="security-procurement-note">
                  Need a deeper technical review? Email <a href="mailto:admin@coodra.com">admin@coodra.com</a>.
                </p>
              </div>
              <div className="security-procurement-actions">
                <Link to="/contact" className="security-btn security-btn--primary">
                  <Mail size={16} aria-hidden="true" />
                  Send Message
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}
