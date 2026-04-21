import { Link } from 'react-router'
import './MarketingFooter.css'

const productLinks = [
  { to: '/integrations', label: 'Integrations' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/comparisons', label: 'Comparisons' },
  { to: '/inventory-management', label: 'Inventory Management' },
  { to: '/#decision', label: 'Decision Engine' },
  { to: '/#how-it-works', label: 'How It Works' },
]

const resourceLinks = [
  { to: '/resources', label: 'Resource Library' },
  { to: '/blog', label: 'Blog' },
  { to: '/case-studies', label: 'Case Studies' },
  { to: '/integrations', label: 'Integrations' },
]

const companyLinks = [
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/security', label: 'Security' },
]

const legalLinks = [
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
]

export default function MarketingFooter() {
  return (
    <footer className="mf-footer" itemProp="publisher" itemScope itemType="https://schema.org/Organization">
      <div className="mf-wrap">
        <div className="mf-grid">
          <section className="mf-brand-col">
            <img src="/images/coodra-logo.png" alt="Coodra" className="mf-logo" itemProp="logo" />
            <p className="mf-summary" itemProp="description">The AI intelligence layer for independent retail operations.</p>
          </section>

          <section className="mf-col">
            <h4>Product</h4>
            <ul>
              {productLinks.map((item) => (
                <li key={item.to}><Link to={item.to}>{item.label}</Link></li>
              ))}
            </ul>
          </section>

          <section className="mf-col">
            <h4>Resources</h4>
            <ul>
              {resourceLinks.map((item) => (
                <li key={item.to}><Link to={item.to}>{item.label}</Link></li>
              ))}
            </ul>
          </section>

          <section className="mf-col">
            <h4>Company</h4>
            <ul>
              {companyLinks.map((item) => (
                <li key={item.to}><Link to={item.to}>{item.label}</Link></li>
              ))}
            </ul>
          </section>

          <section className="mf-col">
            <h4>Legal</h4>
            <ul>
              {legalLinks.map((item) => (
                <li key={item.to}><Link to={item.to}>{item.label}</Link></li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mf-bottom">
          <p>&copy; 2026 Coodra Inc. All rights reserved.</p>
          <div className="mf-status">
            <span className="mf-status-dot" aria-hidden="true" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  )
}
