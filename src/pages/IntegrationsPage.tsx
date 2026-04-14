import { Link } from 'react-router'
import MarketingHeader from '../components/MarketingHeader'
import './ExpansionPages.css'

const integrations = [
  {
    name: 'Shopify',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/shopify.svg',
    summary: 'Sync products, orders, and inventory in real time.',
    bullets: ['Catalog + product sync', 'Orders + transactions sync', 'Inventory + stock sync'],
  },
  {
    name: 'Square',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/square.svg',
    summary: 'Unify in-store sales and catalog performance signals.',
    bullets: ['Catalog + modifiers sync', 'Sales + payment signal sync', 'Stock + location sync'],
  },
  {
    name: 'Lightspeed',
    logo: '/images/integrations/lightspeed.png?v=20260410',
    summary: 'Connect POS sell-through and stock movement data.',
    bullets: ['Items + variants sync', 'Daily sell-through signal', 'Store-level inventory sync'],
  },
  {
    name: 'Clover',
    logo: '/images/integrations/clover.png?v=20260410',
    summary: 'Bring transaction and location trends into one view.',
    bullets: ['Products + categories sync', 'Order + payment signal sync', 'Inventory + branch sync'],
  },
]

export default function IntegrationsPage() {
  return (
    <div className="exp-page">
      <div className="exp-page__container">
        <MarketingHeader />

        <section className="exp-hero motion-fade-up" data-aos="fade-up">
          <p className="exp-hero__eyebrow">Integrations</p>
          <h1>Works with the tools you already run.</h1>
          <p>
            Connect your current POS stack and let Coodra transform live operational data
            into ranked, high-confidence retail actions.
          </p>
          <div className="exp-hero__actions">
            <Link to="/contact" className="exp-btn">Start an integration review</Link>
            <Link to="/security" className="exp-btn exp-btn--ghost">See data controls</Link>
          </div>
        </section>

        <section className="exp-pipeline" aria-label="How integration works">
          <article className="exp-pipeline__step">
            <p className="exp-pipeline__label">Step 01</p>
            <div>
              <h2>Connect your systems in one pass.</h2>
              <p>We map POS, inventory, and transaction feeds into one clean operating model.</p>
            </div>
          </article>
          <article className="exp-pipeline__step">
            <p className="exp-pipeline__label">Step 02</p>
            <div>
              <h2>Normalize and score signal quality.</h2>
              <p>Coodra checks incoming feed reliability before recommendations are generated.</p>
            </div>
          </article>
          <article className="exp-pipeline__step">
            <p className="exp-pipeline__label">Step 03</p>
            <div>
              <h2>Push approved actions back to operations.</h2>
              <p>Teams can approve next moves with clear rationale and expected impact.</p>
            </div>
          </article>
        </section>

        <section className="exp-connector-band" aria-label="Connector coverage">
          {integrations.map((item) => (
            <div key={`${item.name}-connector`} className="exp-connector">
              <img src={item.logo} alt="" aria-hidden="true" />
              <span>{item.name}</span>
            </div>
          ))}
        </section>

        <section className="integration-grid motion-stagger-grid" aria-label="Coodra POS integrations">
          {integrations.map((item) => (
            <article key={item.name} className="integration-card">
              <div className="integration-card__head">
                <div className="integration-card__logo">
                  <img src={item.logo} alt={`${item.name} logo`} />
                </div>
                <div>
                  <h2>{item.name}</h2>
                  <p>{item.summary}</p>
                </div>
              </div>

              <ul>
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="exp-cta motion-fade-up" data-aos="fade-up">
          <h2>Don&apos;t see your POS?</h2>
          <p>We can still help. Tell us what you run and we&apos;ll map the cleanest path to connect.</p>
          <div className="exp-cta__actions">
            <Link to="/contact" className="exp-btn">Contact us</Link>
            <Link to="/case-studies" className="exp-btn exp-btn--ghost">View case studies</Link>
          </div>
        </section>
      </div>
    </div>
  )
}
