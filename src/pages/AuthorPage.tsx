import { Link } from 'react-router'
import MarketingHeader from '../components/MarketingHeader'
import MarketingFooter from '../components/MarketingFooter'
import './AuthorPage.css'

export default function AuthorPage() {
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://www.coodra.com/#person',
    name: 'Michael Shahid',
    jobTitle: 'Founder & CEO',
    url: 'https://www.coodra.com/author/michael-shahid',
    image: 'https://www.coodra.com/images/michael.jpg',
    worksFor: { '@id': 'https://www.coodra.com/#organization' },
    sameAs: ['https://www.linkedin.com/company/coodra/'],
  }

  return (
    <div className="author-page">
      <MarketingHeader />

      <main className="author-main">
        <section className="author-hero">
          <img src="/images/michael.jpg" alt="Michael Shahid" className="author-hero__image" loading="lazy" />
          <div className="author-hero__copy">
            <p className="author-hero__eyebrow">Author</p>
            <h1>Michael Shahid</h1>
            <p className="author-hero__role">Founder & CEO, Coodra</p>
            <p>
              Michael leads Coodra’s product direction focused on practical, margin-first decision workflows for
              independent retailers. His work centers on turning raw POS and inventory signals into clear weekly actions
              teams can trust and approve quickly.
            </p>
            <div className="author-hero__actions">
              <Link to="/blog" className="author-btn author-btn--primary">Read articles</Link>
              <Link to="/about" className="author-btn author-btn--ghost">About Coodra</Link>
            </div>
          </div>
        </section>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <MarketingFooter />
    </div>
  )
}
