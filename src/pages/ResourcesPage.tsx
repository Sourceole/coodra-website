import { useState } from 'react'
import { Link } from 'react-router'
import MarketingHeader from '../components/MarketingHeader'
import MarketingFooter from '../components/MarketingFooter'
import './ResourcesPage.css'

type ResourceCard = {
  category: string
  title: string
  excerpt: string
  to: string
  imageLabel: string
}

const resourceCards: ResourceCard[] = [
  {
    category: 'Case Study',
    title: 'How a regional grocer protected margin in 30 days',
    excerpt: 'See the decision workflow Coodra used to flag erosion early and prioritize action by SKU velocity.',
    to: '/case-studies',
    imageLabel: 'Margin protection',
  },
  {
    category: 'Guide',
    title: 'POS signal quality checklist for independent retailers',
    excerpt: 'A practical framework for validating source data before automation and AI recommendations.',
    to: '/blog',
    imageLabel: 'Signal quality',
  },
  {
    category: 'Blog Post',
    title: 'Inventory mistakes that quietly kill margin',
    excerpt: 'Break down recurring inventory patterns that create avoidable loss and how to correct them fast.',
    to: '/blog/inventory-mistakes-that-kill-margin',
    imageLabel: 'Inventory insights',
  },
  {
    category: 'White Paper',
    title: 'Retail decision intelligence for multi-location teams',
    excerpt: 'An executive overview of governance, confidence scoring, and measurable operational outcomes.',
    to: '/resources#white-papers',
    imageLabel: 'Decision framework',
  },
  {
    category: 'Case Study',
    title: 'Reducing stockout risk with lead-time aware recommendations',
    excerpt: 'Learn how teams combined demand shifts and vendor lead-times to improve availability with less overstock.',
    to: '/case-studies',
    imageLabel: 'Stockout prevention',
  },
  {
    category: 'Guide',
    title: 'Playbook: approving AI actions with clear rationale',
    excerpt: 'Standardize approvals across operators with confidence thresholds, impact preview, and audit-ready context.',
    to: '/resources#guides',
    imageLabel: 'Approval playbook',
  },
]

export default function ResourcesPage() {
  const [email, setEmail] = useState('')

  return (
    <div className="resources-page">
      <MarketingHeader />

      <main>
        <section className="resources-hero" aria-label="Resources hero">
          <div className="resources-container resources-hero-inner">
            <p className="resources-eyebrow">Resources</p>
            <h1>Retail Operations Resources</h1>
            <p>Guides, case studies, and tools for independent retailers.</p>
          </div>
        </section>

        <section className="resources-featured" aria-label="Featured resource">
          <div className="resources-container">
            <article className="featured-resource-card">
              <div className="featured-resource-copy">
                <p className="resources-eyebrow">Featured Guide</p>
                <h2>Retail operators guide to faster weekly decisions</h2>
                <p>
                  A complete operating playbook to connect POS data, rank high-impact moves, and align your team on what to approve first.
                </p>
                <Link to="/blog" className="featured-resource-link">Read more &rarr;</Link>
              </div>

              <div className="featured-resource-visual" aria-hidden="true">
                <span className="fr-dot fr-dot-a" />
                <span className="fr-dot fr-dot-b" />
                <span className="fr-dot fr-dot-c" />
                <span className="fr-ring" />
              </div>
            </article>
          </div>
        </section>

        <section className="resources-library" aria-label="Resource library">
          <div className="resources-container">
            <div className="resources-filter-bar">
              <Link to="/resources" className="filter-pill active">All</Link>
              <Link to="/case-studies" className="filter-pill">Case Studies</Link>
              <Link to="/resources#guides" className="filter-pill">Guides</Link>
              <Link to="/blog" className="filter-pill">Blog Posts</Link>
              <Link to="/resources#white-papers" className="filter-pill">White Papers</Link>
            </div>

            <div className="resources-grid">
              {resourceCards.map((card) => (
                <article className="resource-card" key={card.title}>
                  <div className="resource-card-img" aria-hidden="true">
                    <span>{card.imageLabel}</span>
                  </div>
                  <div className="resource-card-body">
                    <p className="resource-card-eyebrow">{card.category}</p>
                    <h3>{card.title}</h3>
                    <p>{card.excerpt}</p>
                    <Link to={card.to} className="resource-card-link">Read &rarr;</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="resources-newsletter" aria-label="Newsletter signup">
          <div className="resources-container resources-newsletter-inner">
            <h2>Get retail intelligence in your inbox.</h2>
            <p>Practical guides, case studies, and insights - twice a month. No fluff.</p>

            <form
              className="newsletter-form"
              onSubmit={(event) => {
                event.preventDefault()
                setEmail('')
              }}
            >
              <label htmlFor="resources-email" className="sr-only">Email address</label>
              <input
                id="resources-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@store.com"
                required
              />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </section>

        <section className="resources-bottom-cta" aria-label="Bottom call to action">
          <div className="resources-container resources-bottom-cta-inner">
            <h2>Ready to stop guessing?</h2>
            <div className="resources-bottom-actions">
              <Link to="/signup" className="resources-btn resources-btn-primary">Start Free</Link>
              <Link to="/contact" className="resources-btn resources-btn-ghost">Talk to Sales</Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}
