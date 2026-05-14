import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import MarketingHeader from '../components/MarketingHeader'
import MarketingFooter from '../components/MarketingFooter'
import './InventoryPlanningArticlePage.css'

const SITE_URL = 'https://www.coodra.com'

const tocItems = [
  { id: 'why-it-matters', label: 'Why inventory planning matters' },
  { id: 'weekly-workflow', label: 'The weekly workflow — three questions, 20 minutes' },
  { id: 'reorder-point', label: 'Reorder point formula' },
  { id: 'velocity', label: 'Sales velocity as early warning' },
  { id: 'lead-time', label: 'Lead time — the variable most retailers skip' },
  { id: 'safety-stock', label: 'Safety stock without overcomplicating it' },
  { id: 'put-it-together', label: 'Putting the four signals together' },
  { id: 'tools', label: 'Tools that fit independent retail' },
  { id: 'key-takeaways', label: 'Key takeaways' },
  { id: 'related-reading', label: 'Related reading' },
]

const faqData = [
  {
    question: 'What is inventory planning for small retail?',
    answer: 'Inventory planning for small retail is a weekly decision system: based on what sold, what is on the shelf, and what is coming in, what should you actually order right now? It does not require enterprise software — it requires a clear answer to three questions answered consistently, every week.',
  },
  {
    question: 'How often should an independent retailer review inventory?',
    answer: 'Once a week is the cadence that fits independent retail. A 20-minute weekly review catches stockout risk before it becomes a customer-facing gap and excess inventory before it compounds into margin pressure. The key word is weekly — a monthly review is too slow for fast-moving SKUs.',
  },
  {
    question: 'What is a reorder point and how do you calculate it?',
    answer: 'A reorder point is the inventory level that triggers a new purchase order. The formula: ROP = (Average Weekly Sales × Lead Time in weeks) + Safety Stock. For a SKU selling 5 units per week with a 3-week lead time and a 1-week safety buffer, the reorder point is 5×3 + 5 = 20 units. When on-hand drops to 20, you reorder.',
  },
  {
    question: 'Do independent retailers need an ERP for inventory planning?',
    answer: 'No. The vast majority of independent retailers running Shopify, Square, or Lightspeed have all the data they need for effective inventory planning. ERP platforms are designed for multi-warehouse, multi-location operations with complex supply chain constraints. For a single- or two-location retailer, POS-connected planning software is faster to set up and directly answers the three weekly questions.',
  },
  {
    question: 'How do you plan inventory around lead time variation?',
    answer: 'Most retailers plan with a quoted lead time. The problem is that quoted lead times are usually optimistic. Planning with your actual median lead time — measured from PO sent to shelf-ready — is what prevents the stockouts that feel inexplicable. Track actual lead times by supplier class and update your reorder points when you see a shift.',
  },
  {
    question: 'What is the simplest safety stock method for small retail?',
    answer: 'Start with two weeks of average weekly sales as your safety stock buffer per SKU. This is not a target — it is a trigger level. When inventory drops to that buffer, it is time to reorder, not time to panic. High-velocity SKUs or products with unreliable suppliers warrant a higher buffer; stable, slow-moving products can often run with less.',
  },
]

const articleBody = [
  'Inventory planning for independent retail is a weekly decision system built on sales velocity, current on-hand inventory, actual supplier lead time, and practical safety stock.',
  'The weekly workflow can be run in about 20 minutes by answering three questions: which SKUs are approaching reorder point, which SKUs are accelerating in demand, and which SKUs are accumulating excess.',
  'Use a simple reorder point baseline: ROP = (Average Weekly Sales × Lead Time) + Safety Stock. Then review velocity and lead-time drift so reorder timing stays aligned to current demand and supplier reality.',
  'For most independent retailers, a practical safety stock baseline starts at two weeks of average weekly sales and is adjusted upward for high-velocity or volatile supplier SKUs.',
  'The goal is not reporting volume; it is a ranked weekly action list your team can execute quickly to reduce stockouts, protect margin, and keep cash in motion.',
].join('\n\n')

export default function InventoryPlanningArticlePage() {
  const [activeSection, setActiveSection] = useState<string>(tocItems[0].id)
  const sectionIds = useMemo(() => tocItems.map((item) => item.id), [])

  useEffect(() => {
    const offset = 140
    let raf = 0

    const updateActiveSection = () => {
      let current = sectionIds[0]
      sectionIds.forEach((id) => {
        const section = document.getElementById(id)
        if (!section) return
        const top = section.getBoundingClientRect().top
        if (top - offset <= 0) current = id
      })
      setActiveSection((prev) => (prev === current ? prev : current))
    }

    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        updateActiveSection()
        raf = 0
      })
    }

    updateActiveSection()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [sectionIds])

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'What Inventory Planning Actually Means for Independent Retail (and How to Do It Without a Planner)',
    description: 'A practical operating guide for independent retailers: use reorder points, demand velocity, lead time, and safety stock to run a weekly inventory rhythm that protects margin, reduces stockouts, and keeps cash in motion.',
    image: `${SITE_URL}/images/blog/blog-cover-1.png`,
    datePublished: '2026-04-20',
    dateModified: '2026-04-20',
    author: { '@id': `${SITE_URL}/#person` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    url: `${SITE_URL}/blog/inventory-planning-for-small-retail`,
    inLanguage: 'en',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/inventory-planning-for-small-retail` },
    articleBody,
  }

  const authorPerson = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: 'Michael Shahid',
    jobTitle: 'Founder & CEO',
    url: `${SITE_URL}/author/michael-shahid`,
    image: `${SITE_URL}/images/michael.jpg`,
    sameAs: ['https://www.linkedin.com/company/coodra/'],
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <div className="ipa-page">
      <MarketingHeader />

      <main className="ipa-shell">
        <div className="ipa-grid">
          <article className="ipa-main" data-page-meta>
            <nav className="ipa-breadcrumbs">
              <Link to="/">Home</Link>
              <span>&gt;</span>
              <Link to="/blog">Blog</Link>
              <span>&gt;</span>
              <Link to="/inventory-management">Inventory Management</Link>
              <span>&gt;</span>
              <span>Inventory Planning</span>
            </nav>

            <header className="ipa-hero">
              <div className="ipa-hero-left">
                <p className="ipa-meta">Inventory Planning &bull; April 20, 2026 &bull; 8 min read</p>
                <h1>What Inventory Planning Actually Means for Independent Retail (and How to Do It Without a Planner)</h1>
                <p className="ipa-lede">
                  A practical operating guide for independent retailers: use reorder points, demand velocity, lead time, and safety stock to run a weekly inventory rhythm that protects margin, reduces stockouts, and keeps cash in motion.
                </p>
                <div className="ipa-author">
                  <img src="/images/michael.jpg" alt="Michael Shahid" />
                  <div>
                    <strong>By Michael Shahid</strong>
                    <p>Founder & CEO, Coodra</p>
                  </div>
                </div>
              </div>
              <div className="ipa-hero-right">
                <img
                  src="/images/blog/blog-cover-1.png"
                  alt="Coodra inventory planning: weekly workflow visual showing reorder point, velocity, lead time, and safety stock signals"
                />
              </div>
            </header>

            <section id="why-it-matters" className="ipa-section">
              <h2>Why inventory planning matters for independent retail</h2>
              <p>
                The phrase "inventory planning" sounds like something enterprise retailers do — supply chain teams, ERP systems, monthly S&amp;OP meetings. Most independent retailers look at that and think: that is not for us. And they are right — but not for the reason they think.
              </p>
              <p>
                Inventory planning for independent retail does not require a planner or enterprise software. It requires a clear answer to one question every week: based on what sold, what is on the shelf, and what is coming in, what should I actually order right now?
              </p>
              <p>
                That is the whole thing. Everything else — demand forecasting, safety stock calculations, seasonal adjustments — is commentary on those three inputs. And for independent retailers running Shopify POS, Square, or Lightspeed, the data to answer that question sits in the system you already use.
              </p>
              <div className="ipa-benefits">
                <article>
                  <h3>Fewer stockouts</h3>
                  <p>Protect high-demand SKUs before shelves go empty and customers go elsewhere.</p>
                </article>
                <article>
                  <h3>Less excess</h3>
                  <p>Cut overbuying on slow movers before it compounds into margin pressure.</p>
                </article>
                <article>
                  <h3>More cash flow</h3>
                  <p>Move working capital toward your fastest-turn products, not dead stock.</p>
                </article>
                <article>
                  <h3>Smaller teams</h3>
                  <p>The buyer is also the manager. The system has to fit a real operating schedule.</p>
                </article>
              </div>
            </section>

            <section id="weekly-workflow" className="ipa-section">
              <h2>The weekly workflow: three questions, 20 minutes</h2>
              <p>
                The inventory planning workflow that fits independent retail is not a 12-step process. It is a weekly review with three questions, answered in order. If you only have 20 minutes, answer those three questions and act on the one decision that matters most this week.
              </p>
              <div className="ipa-steps">
                <article>
                  <span>1</span>
                  <h3>Which SKUs are approaching their reorder point?</h3>
                  <p>Pull current on-hand inventory from your POS, sort ascending. Cross-reference with average weekly sales. Any SKU below 4 weeks of on-hand is a candidate; below 2 weeks is urgent.</p>
                </article>
                <article>
                  <span>2</span>
                  <h3>Which SKUs are trending up before stockout hits?</h3>
                  <p>Compare your top 20 SKUs by volume over the last 4 weeks against the prior 4 weeks. Products selling 20% or more above their baseline are signaling demand shift — usually before you run out.</p>
                </article>
                <article>
                  <span>3</span>
                  <h3>Which SKUs have excess accumulating?</h3>
                  <p>Calculate weeks-of-cover: on-hand divided by average weekly sales. Any SKU above 6 weeks of cover is accumulating excess. Reduce the next PO quantity until velocity catches up.</p>
                </article>
              </div>
              <p>
                The retailers who run this consistently are not doing it because they have more time. They do it because they have built it into their week as a non-negotiable operating habit — the same way they count the cash drawer. It takes less time than checking email, if the system surfaces the answers automatically.
              </p>
              <p>
                <Link to="/blog/reorder-points-without-excel">See the reorder point formula without a spreadsheet</Link>, and <Link to="/inventory-management">learn how Coodra surfaces all three questions in a single ranked view</Link>.
              </p>
            </section>

            <section id="reorder-point" className="ipa-section ipa-formula">
              <article>
                <h3>Reorder point: the simplest formula</h3>
                <p>Use this baseline to set a consistent trigger for every core SKU.</p>
                <div className="ipa-formula-box">ROP = (Average Weekly Sales &times; Lead Time) + Safety Stock</div>
                <ul>
                  <li><strong>Average Weekly Sales:</strong> units sold per week over the last 4–12 weeks</li>
                  <li><strong>Lead Time:</strong> actual days from PO sent to shelf-ready, not the quoted number</li>
                  <li><strong>Safety Stock:</strong> buffer for demand and delivery variability</li>
                </ul>
                <p>
                  Example: a SKU selling 5 units per week, with a 3-week lead time and a 1-week safety buffer. ROP = (5 &times; 3) + 5 = 20 units. When on-hand drops to 20, place the order.
                </p>
              </article>
              <article className="ipa-formula-visual">
                <div className="ipa-mug-visual">
                  <img
                    src="/images/blog/mug.png"
                    alt="Reorder point formula visual: ROP equals average weekly sales times lead time plus safety stock"
                    loading="lazy"
                  />
                </div>
              </article>
            </section>

            <section id="velocity" className="ipa-section">
              <h2>Sales velocity: your early warning system</h2>
              <p>
                Do not wait for stockouts to confirm demand changes. Compare current 2-week sales velocity to the prior 4-week baseline by SKU. Large positive deltas often appear one to two reorder cycles before a shelfout.
              </p>
              <p>
                The signal to watch: a product that sells 20% more than its 4-week average in back-to-back weeks. That is not noise. That is a demand shift, and the reorder point that made sense three weeks ago may no longer cover the new reality.
              </p>
              <p>
                <Link to="/blog/how-to-read-pos-data">How to pull and interpret sales velocity from your POS</Link> — five questions every POS can answer weekly.
              </p>
            </section>

            <section id="lead-time" className="ipa-section">
              <h2>Lead time: the variable most independent retailers skip</h2>
              <p>
                When you see a SKU at 3 weeks of on-hand supply, the question is not "is this enough?" The question is: given my supplier's lead time, will this be enough when the reorder arrives?
              </p>
              <p>
                If your lead time is 3 weeks and you have 3 weeks of supply on hand, you are ordering at the edge of a stockout. One unexpectedly strong seller week and you are empty before the order lands. The fix: plan with your <em>actual</em> median lead time per supplier — not the quoted number.
              </p>
              <p>
                Quoted lead times are usually optimistic. Planning from actual received lead times materially improves reorder timing. Track median lead time by supplier class and review it monthly for drift — especially around holidays and disruptions.
              </p>
              <p>
                <Link to="/blog/lead-time-and-why-it-breaks-every-reorder-formula">Lead time drift is the most common cause of stockouts that feel inexplicable</Link>. The retailer did nothing wrong with their demand forecast. They just did not update the lead time assumption when the supplier started running slow.
              </p>
            </section>

            <section id="safety-stock" className="ipa-section">
              <h2>Safety stock without overcomplicating it</h2>
              <p>
                Safety stock protects service levels during demand spikes and delivery variability. For most independent retailers, the starting point is simple: two weeks of average weekly sales as a buffer per SKU.
              </p>
              <p>
                That is not the order quantity — it is the trigger level. When inventory hits the safety stock buffer, it is time to act, not time to panic. The reorder still follows the ROP formula. The safety stock just prevents the panic.
              </p>
              <p>
                Two adjustments to make: first, <strong>high-velocity SKUs</strong> warrant a higher buffer because a stockout on your best seller is the most expensive stockout. Second, <strong>SKUs from unreliable suppliers</strong> warrant a higher buffer because delivery variability is higher.
              </p>
              <p>
                <Link to="/blog/safety-stock-without-overcomplicating-it">The two-week velocity buffer method for safety stock</Link> — and when holding more actually makes sense.
              </p>
            </section>

            <section id="put-it-together" className="ipa-section">
              <h2>Putting the four signals together</h2>
              <p>
                The weekly inventory review is not four separate exercises. It is one exercise that combines four signals: ROP status, velocity changes, lead time assumptions, and buffer adequacy. The output is always a ranked action list.
              </p>
              <p>
                Rank by what has the highest margin impact and the highest stockout risk. The top item on the list this week may not be the SKU with the lowest on-hand quantity — it may be the highest-margin SKU where a stockout would cost the most in gross profit, even if it is not yet at its reorder point.
              </p>
              <p>
                Coodra runs this combination automatically every week from your POS data and presents the output as a ranked decision list — not a dashboard to explore. <Link to="/signup">Connect your POS and see what the first weekly review looks like for your store</Link>.
              </p>
            </section>

            <section id="tools" className="ipa-section">
              <h2>Tools that fit independent retail</h2>
              <p>
                The best inventory planning tool is not the most complex one. It is the one your team can execute every week with low friction. For independent retailers, that means three things: POS-connected reporting so data is current automatically, clear threshold settings so the system flags what needs attention, and one approval flow to turn the ranked list into action.
              </p>
              <p>
                Enterprise planning tools exist and they solve a different problem — multi-warehouse optimization, statistical demand forecasting across thousands of SKUs, automated PO generation weeks in advance. If that is your operation, those tools make sense. If you run one or two locations and the buyer and manager are the same person, the right tool answers three questions in a single view and gets out of the way.
              </p>
              <p>
                <Link to="/comparisons">See how Coodra compares to Netstock, Cin7, and other planning tools</Link> — and why most independent retailers do not need a planner.
              </p>
              <div className="ipa-source-card">
                <h3>Primary sources</h3>
                <ul>
                  <li><a href="https://www.census.gov/retail/" target="_blank" rel="noopener noreferrer">U.S. Census Bureau: Monthly Retail Trade and Inventories</a></li>
                  <li><a href="https://www.shopify.com/retail/reorder-point-formula" target="_blank" rel="noopener noreferrer">Shopify: Reorder point formula for retailers</a></li>
                  <li><a href="https://squareup.com/help/us/en/article/7039-track-and-manage-your-inventory-with-square" target="_blank" rel="noopener noreferrer">Square: Inventory management guide</a></li>
                  <li><a href="https://www.investopedia.com/terms/s/safety-stock.asp" target="_blank" rel="noopener noreferrer">Investopedia: Safety stock definition and formula</a></li>
                </ul>
              </div>
            </section>

            <section id="key-takeaways" className="ipa-takeaways">
              <strong>Key takeaways</strong>
              <span>Inventory planning for independent retail fits in 20 minutes a week.</span>
              <span>Track actual lead times, not quoted ones — that is where most stockouts originate.</span>
              <span>Velocity changes are early warning signals, not after-the-fact confirmation.</span>
              <span>The output of the weekly review is a ranked action list — not a dashboard.</span>
            </section>

            <section id="related-reading" className="ipa-section">
              <h2>Related reading</h2>
              <div className="ipa-related">
                <Link to="/blog/reorder-points-without-excel">
                  <img src="/images/blog/reorder-points-formula.svg" alt="Reorder point formula visual" />
                  <div>
                    <strong>Reorder Points Without Excel</strong>
                    <small>7 min read</small>
                  </div>
                </Link>
                <Link to="/blog/safety-stock-without-overcomplicating-it">
                  <img src="/images/blog/safety-stock-guide.svg" alt="Safety stock guide visual" />
                  <div>
                    <strong>Safety Stock Without Overcomplicating It</strong>
                    <small>6 min read</small>
                  </div>
                </Link>
                <Link to="/blog/lead-time-and-why-it-breaks-every-reorder-formula">
                  <img src="/images/blog/lead-time-reorder-formula.svg" alt="Lead time reorder formula visual" />
                  <div>
                    <strong>Lead Time: Why It Breaks Every Reorder Formula</strong>
                    <small>6 min read</small>
                  </div>
                </Link>
              </div>
            </section>

            <section className="ipa-bottom-cta">
              <div>
                <h3>Make smarter inventory decisions every week.</h3>
                <p>Coodra surfaces what to reorder, what to hold, and what to fix next — ranked by margin impact.</p>
              </div>
              <Link to="/signup" className="ipa-cta-btn">Start Free</Link>
            </section>
          </article>

          <aside className="ipa-sidebar">
            <section className="ipa-sidecard ipa-toc">
              <h3>On this page</h3>
              {tocItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={activeSection === item.id ? 'is-active' : ''}
                >
                  {item.label}
                </a>
              ))}
            </section>

            <section className="ipa-sidecard ipa-promo">
              <h3>See how Coodra ranks what to reorder next</h3>
              <p>Coodra analyzes sales, inventory, lead time, and demand signals so you can act with confidence — no spreadsheet required.</p>
              <Link to="/signup" className="ipa-cta-btn">Start Free</Link>
              <small>No credit card required</small>
            </section>

            <section className="ipa-sidecard ipa-checklist">
              <h3>Quick checklist</h3>
              <ul>
                <li>Review SKUs at or below ROP</li>
                <li>Scan top 20 SKUs for velocity changes</li>
                <li>Identify SKUs with more than 6 weeks of cover</li>
                <li>Place POs for top priorities</li>
                <li>Confirm supplier lead times for open orders</li>
              </ul>
            </section>
          </aside>
        </div>
      </main>

      <MarketingFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorPerson) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </div>
  )
}
