import { Link } from 'react-router'
import MarketingHeader from '../components/MarketingHeader'
import './LegalPages.css'

const team = [
  {
    name: 'Michael R.',
    title: 'Founder & CEO',
    bio: 'Leads product vision and retail strategy with a focus on practical, measurable outcomes.',
    linkedin: 'https://www.linkedin.com',
  },
  {
    name: 'Product Engineering',
    title: 'Platform Team',
    bio: 'Builds the decision engine, integrations, and approval flows used by daily retail operators.',
    linkedin: 'https://www.linkedin.com',
  },
  {
    name: 'Customer Operations',
    title: 'Implementation Team',
    bio: 'Helps stores connect systems, onboard quickly, and operationalize recommendations with confidence.',
    linkedin: 'https://www.linkedin.com',
  },
]

export default function AboutPage() {
  return (
    <div className="legal-page">
      <div className="legal-page__container">
        <MarketingHeader />

        <div className="legal-page__shell">
          <aside className="legal-page__sidebar">
            <p className="legal-page__sidebarTitle">Company</p>
            <nav className="legal-page__sidebarLinks" aria-label="Company pages">
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/integrations">Integrations</Link>
              <Link to="/security">Security</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
            </nav>
          </aside>

          <article className="legal-page__card">
            <p className="legal-page__eyebrow">Company</p>
            <h1>About Coodra</h1>

            <p>
              Coodra exists because too many retail teams are overloaded with data but under-supported on decisions.
              We turn live sales, inventory, and demand signals into clear, ranked actions that operators can approve in minutes.
            </p>

            <h2>Founding story</h2>
            <p>
              We built Coodra to become the operational decision layer between a retail business and what customers need next.
              Instead of dashboards that require interpretation, we focus on direct recommendations teams can trust and act on quickly.
            </p>

            <h2>What we believe</h2>
            <div className="legal-page__grid">
              <div className="legal-page__tile">
                <h3>Clear over complex</h3>
                <p>A recommendation is only useful if teams can understand and approve it quickly.</p>
              </div>
              <div className="legal-page__tile">
                <h3>Human in control</h3>
                <p>Coodra supports operators with decision intelligence; your team remains in charge.</p>
              </div>
              <div className="legal-page__tile">
                <h3>Measurable outcomes</h3>
                <p>Every action should map to tangible improvements in sell-through, margin, and stock health.</p>
              </div>
              <div className="legal-page__tile">
                <h3>Practical speed</h3>
                <p>Retail moves fast. Teams need useful answers now, not analysis after the opportunity is gone.</p>
              </div>
            </div>

            <h2>Team</h2>
            <div className="legal-page__teamGrid">
              {team.map((person) => (
                <article key={person.name} className="legal-page__teamCard">
                  <div className="legal-page__avatar" aria-hidden="true">
                    {person.name.slice(0, 1)}
                  </div>
                  <div>
                    <h3>{person.name}</h3>
                    <p className="legal-page__teamRole">{person.title}</p>
                    <p>{person.bio}</p>
                    <a href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                  </div>
                </article>
              ))}
            </div>

            <h2>Locations</h2>
            <p>Serving retailers across Canada and the United States.</p>

            <h2>Get in touch</h2>
            <p>
              We&apos;d love to hear from you. Reach us at <a href="mailto:admin@coodra.com">admin@coodra.com</a>.
            </p>
          </article>
        </div>
      </div>
    </div>
  )
}
