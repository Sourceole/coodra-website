import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router'
import MarketingHeader from '../components/MarketingHeader'
import MarketingFooter from '../components/MarketingFooter'
import './InventoryManagementPage.css'

/* ─── capability data ─────────────────────────────────────── */
type Capability = {
  tag: string
  accent: 'mint' | 'amber' | 'violet' | 'teal' | 'coral'
  headline: string
  body: string
  metric: string
  metricLabel: string
  dataLabels: string[]
  dataValues: string[]
  dataBars: string[]
}

const capabilities: Capability[] = [
  {
    tag: 'Availability',
    accent: 'mint',
    headline: 'Stop stockouts before they happen',
    body:
      'Coodra tracks days-to-stockout on every SKU using 90-day sales velocity and current on-hand inventory. Items approaching their reorder point surface automatically — ranked by urgency, not alphabetical order.',
    metric: '< 14d',
    metricLabel: 'stockout flag threshold',
    dataLabels: ['Days to stockout', 'Reorder point hit'],
    dataValues: ['11d', 'At risk'],
    dataBars: ['75%', '45%'],
  },
  {
    tag: 'Margin',
    accent: 'amber',
    headline: 'Protect margin on every reorder',
    body:
      'Every SKU carries a real margin score. Coodra flags products where cost has risen, price has stayed flat, or velocity is climbing without a price adjustment — before the erosion compounds into a quarter-loss.',
    metric: '±2%',
    metricLabel: 'landed cost variance detection',
    dataLabels: ['Margin score', 'Cost delta'],
    dataValues: ['68%', '+8.2%'],
    dataBars: ['60%', '90%'],
  },
  {
    tag: 'Dead Stock',
    accent: 'violet',
    headline: 'Find overstock before it forces a clearance',
    body:
      'Weeks-of-cover and 90-day velocity patterns identify slow-moving inventory. Coodra surfaces items that are accumulating excess and suggests reduction or removal — ranked by how long they have been sitting.',
    metric: '> 16 wk',
    metricLabel: 'cover flags aged stock',
    dataLabels: ['Weeks of cover', '90d reorder rate'],
    dataValues: ['22 wk', '0%'],
    dataBars: ['88%', '35%'],
  },
  {
    tag: 'Forecasting',
    accent: 'teal',
    headline: 'Know what to reorder — and when',
    body:
      'A velocity-based demand forecast runs across your top SKUs every week. Expected units, lower and upper bands, and a flag for unusual seasonality — so replenishment decisions are based on data, not memory.',
    metric: '30-day',
    metricLabel: 'forecast horizon',
    dataLabels: ['Forecasted units', 'Upper / Lower band'],
    dataValues: ['142 units', '±18'],
    dataBars: ['70%', '82%'],
  },
  {
    tag: 'Order Plans',
    accent: 'coral',
    headline: 'Build purchase orders in minutes, not hours',
    body:
      'Coodra generates ranked order candidates based on distributor lead times, MOQ constraints, case pack requirements, and available budget. Three plan variants — profit-max, risk-min, and balanced — let you pick the right one for your cash position.',
    metric: '3 plans',
    metricLabel: 'generated per review cycle',
    dataLabels: ['Profit-max plan', 'Risk-min plan'],
    dataValues: ['$4,820', '$3,150'],
    dataBars: ['55%', '95%'],
  },
]

const decisionTypes = [
  {
    label: 'Reorder',
    accent: 'mint',
    desc: 'SKU is approaching its reorder point or days-to-stockout threshold. Trigger replenishment with distributor and lead-time context.',
    signal: 'Velocity + on-hand vs. reorder point',
    iconPath: 'M6.8 10.7 3.9 7.8a.9.9 0 1 1 1.3-1.3l1.6 1.6 4.1-4.1a.9.9 0 0 1 1.3 1.3l-5.4 5.4Z',
  },
  {
    label: 'Replace',
    accent: 'amber',
    desc: 'SKU is a margin killer — cost has moved, velocity has shifted, or price ladder has a gap. Find a better-performing alternative from your catalog.',
    signal: 'Margin score < 20% or price gap detected',
    iconPath: 'M8 3.2a.9.9 0 0 1 .9.9v4.1a.9.9 0 1 1-1.8 0V4.1A.9.9 0 0 1 8 3.2Zm0 8.9a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2Z',
  },
  {
    label: 'Remove',
    accent: 'violet',
    desc: 'SKU was ordered once in 90 days and never reordered. Either the supplier discontinued it, demand collapsed, or it never belonged in the assortment.',
    signal: 'Zero reorders in 90 days post-first order',
    iconPath: 'M2.6 8.8a2.1 2.1 0 0 1 2.1-2.1H5A3.2 3.2 0 0 1 11.2 6h.1a2.1 2.1 0 1 1 0 4.2H4.7a2.1 2.1 0 0 1-2.1-1.4Z',
  },
]

const posSystems = [
  { name: 'Shopify', note: 'Catalog sync · Order signals · Inventory updates' },
  { name: 'Square', note: 'POS sales feed · Payment events · Store-level stock' },
  { name: 'Lightspeed', note: 'Sell-through stream · Variant inventory · Location performance' },
  { name: 'Clover', note: 'Branch sync · Transactions stream · Category performance' },
  { name: 'Moneris', note: 'Payment snapshots · Settlement sync · Revenue trend feed' },
]

/* ─── scroll reveal ────────────────────────────────────────── */
function RevealSection({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode
  className?: string
  id?: string
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          ref.current?.classList.add('is-visible')
          observer.disconnect()
        }
      },
      { rootMargin: '-60px' }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className={`inv-reveal ${className}`} id={id}>
      {children}
    </section>
  )
}

export default function InventoryManagementPage() {
  const ctaRef = useRef<HTMLElement>(null)
  const [ctaMx, setCtaMx] = useState(50)
  const [ctaGlow, setCtaGlow] = useState(false)
  const [activeCap, setActiveCap] = useState(0)

  const handleCtaMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = ctaRef.current?.getBoundingClientRect()
    if (!rect) return
    setCtaMx(((e.clientX - rect.left) / rect.width) * 100)
  }

  const selectedCap = capabilities[activeCap]

  return (
    <div className="inv-page">
      <MarketingHeader />
      <main>

        {/* ── HERO ─────────────────────────────────────── */}
        <section className="inv-hero" aria-label="Inventory Management hero">
          <div className="inv-hero-inner">
            <div className="inv-hero-copy">
              <span className="inv-hero-eyebrow">
                <span className="inv-eyebrow-dot" aria-hidden="true" />
                Inventory Management
              </span>
              <h1 className="inv-hero-h1">
                Your inventory,<br />
                <em>ranked</em> by what<br />
                matters most.
              </h1>
              <p className="inv-hero-sub">
                Coodra connects to your POS and turns raw sales and inventory data into a
                weekly ranked list of decisions — reorder, replace, or remove — with
                clear rationale and expected impact.
              </p>
              <div className="inv-hero-actions">
                <Link to="/signup" className="inv-btn inv-btn-primary">Start free</Link>
                <Link to="/integrations" className="inv-btn inv-btn-ghost">See POS integrations</Link>
              </div>
            </div>

            <div className="inv-hero-visual" aria-hidden="true">
              <div className="inv-hero-panel">
                <div className="inv-hero-panel-header">
                  <div className="inv-hero-panel-dots">
                    <span className="inv-hero-panel-dot" />
                    <span className="inv-hero-panel-dot" />
                    <span className="inv-hero-panel-dot" />
                  </div>
                  <span className="inv-hero-panel-label">This week&apos;s decisions</span>
                </div>
                <div className="inv-hero-panel-body">
                  <div className="inv-signal-list">
                    <div className="inv-signal inv-signal--mint">
                      <span className="inv-signal-icon">
                        <svg viewBox="0 0 16 16"><path d="M6.8 10.7 3.9 7.8a.9.9 0 1 1 1.3-1.3l1.6 1.6 4.1-4.1a.9.9 0 0 1 1.3 1.3l-5.4 5.4Z" /></svg>
                      </span>
                      <span>
                        Reorder — Oatly Barista Ed.
                        <span className="inv-signal-sub">12 days to stockout · 3 wk lead</span>
                      </span>
                    </div>
                    <div className="inv-signal inv-signal--amber">
                      <span className="inv-signal-icon">
                        <svg viewBox="0 0 16 16"><path d="M8 3.2a.9.9 0 0 1 .9.9v4.1a.9.9 0 1 1-1.8 0V4.1A.9.9 0 0 1 8 3.2Zm0 8.9a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2Z" /></svg>
                      </span>
                      <span>
                        Replace — Blue Buffalo Dog
                        <span className="inv-signal-sub">Margin −8% · cost up, price flat</span>
                      </span>
                    </div>
                    <div className="inv-signal inv-signal--violet">
                      <span className="inv-signal-icon">
                        <svg viewBox="0 0 16 16"><path d="M2.6 8.8a2.1 2.1 0 0 1 2.1-2.1H5A3.2 3.2 0 0 1 11.2 6h.1a2.1 2.1 0 1 1 0 4.2H4.7a2.1 2.1 0 0 1-2.1-1.4Z" /></svg>
                      </span>
                      <span>
                        Reduce — Hario V60 Dripper
                        <span className="inv-signal-sub">22 wk cover · no reorders in 90d</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="inv-hero-badge inv-hero-badge--1">
                <span className="inv-badge-num">30d</span>
                <span className="inv-badge-label">forecast horizon</span>
              </div>
              <div className="inv-hero-badge inv-hero-badge--2">
                <span className="inv-badge-num">3</span>
                <span className="inv-badge-label">plan variants per review</span>
              </div>
              <div className="inv-hero-badge inv-hero-badge--3">
                <span className="inv-badge-num">90d</span>
                <span className="inv-badge-label">sales history analyzed</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── THE PROBLEM — dark full-bleed ──────────────── */}
        <RevealSection id="problem" className="inv-problem">
          <div className="inv-problem-inner">
            <div className="inv-problem-intro">
              <p className="inv-eyebrow">
                <span className="inv-eyebrow-dot" aria-hidden="true" />
                Why inventory slips
              </p>
              <h2>Retailers are managing inventory with tools that do not talk to each other.</h2>
              <p>The POS logs sales. The spreadsheet estimates reorder. The email thread approves the PO. By the time the signal becomes a decision, the window has often closed.</p>
              <Link to="/pricing" className="inv-text-link">See plans that include inventory management →</Link>
            </div>
            <div className="inv-stat-list">
              {[
                { num: '42%', label: 'of independent retailers order based on intuition, not POS data (2025 NRF retail survey)' },
                { num: '18%', label: 'average gross margin erosion in specialty retail from preventable dead stock accumulation' },
                { num: '6.2×', label: 'more stockouts occur on top-selling SKUs than slow-movers — because fast movers get reordered late' },
              ].map((stat, i) => (
                <div key={i} className="inv-stat-block">
                  <span className="inv-stat-num">{stat.num}</span>
                  <p className="inv-stat-text">
                    <span className="inv-stat-label">{stat.label}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* ── HOW IT WORKS ──────────────────────────────── */}
        <RevealSection id="how" className="inv-how">
          <div className="inv-container">
            <div className="inv-how-head">
              <p className="inv-eyebrow">
                <span className="inv-eyebrow-dot" aria-hidden="true" />
                How it works
              </p>
              <h2 className="inv-how-h2">Three steps from raw POS data to ranked action.</h2>
            </div>
            <div className="inv-how-steps">
              {[
                {
                  step: '01',
                  title: 'Connect your POS',
                  body: 'Link Shopify, Square, Lightspeed, Clover, or Moneris. Coodra pulls 90 days of sales, catalog, and current inventory data. No ERP required.',
                  note: 'Setup in under 5 minutes.',
                },
                {
                  step: '02',
                  title: 'Weekly ranked decisions',
                  body: 'Coodra scores every SKU across stockout risk, margin health, and demand trends. The highest-impact decisions surface first — with the reasoning behind each recommendation.',
                  note: 'Updated every Monday morning.',
                },
                {
                  step: '03',
                  title: 'Approve and act',
                  body: 'Review the why behind each decision, adjust quantities if needed, and approve. Coodra drafts the PO with distributor, lead time, and MOQ already applied.',
                  note: 'One approval replaces three manual steps.',
                },
              ].map((item, i) => (
                <div key={i} className="inv-step-item">
                  <div className="inv-step-circle">
                    <span className="inv-step-num">{item.step}</span>
                  </div>
                  <h3 className="inv-step-title">{item.title}</h3>
                  <p className="inv-step-body">{item.body}</p>
                  <span className="inv-step-note">{item.note}</span>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* ── CAPABILITIES — alternating showcase ───────── */}
        <RevealSection id="capabilities" className="inv-caps">
          <div className="inv-container">
            <div className="inv-caps-head">
              <p className="inv-eyebrow">
                <span className="inv-eyebrow-dot" aria-hidden="true" />
                What Coodra tracks
              </p>
              <h2 className="inv-how-h2">Five signals that directly protect your margin.</h2>
            </div>
            <div className="inv-cap-switcher">
              <div className="inv-cap-tabs" role="tablist" aria-label="Coodra capability signals">
                {capabilities.map((cap, i) => (
                  <button
                    key={cap.tag}
                    type="button"
                    role="tab"
                    aria-selected={activeCap === i}
                    className={`inv-cap-tab inv-cap-tab--${cap.accent}${activeCap === i ? ' is-active' : ''}`}
                    onClick={() => setActiveCap(i)}
                  >
                    {cap.tag}
                  </button>
                ))}
              </div>

              <div className="inv-cap-panel" role="tabpanel">
                <div className="inv-cap-content">
                  <span className={`inv-cap-tag inv-cap-tag--${selectedCap.accent}`}>{selectedCap.tag}</span>
                  <h3 className="inv-cap-title">{selectedCap.headline}</h3>
                  <p className="inv-cap-body">{selectedCap.body}</p>
                  <div className="inv-cap-metric">
                    <span className="inv-cap-metric-num">{selectedCap.metric}</span>
                    <span className="inv-cap-metric-label">{selectedCap.metricLabel}</span>
                  </div>
                </div>
                <div className={`inv-cap-visual inv-cap-visual--${selectedCap.accent}`}>
                  {selectedCap.dataLabels.map((label, i) => (
                    <div key={label}>
                      <div className="inv-data-row">
                        <span className="inv-data-label">{label}</span>
                        <span className="inv-data-value">{selectedCap.dataValues[i]}</span>
                      </div>
                      <div className="inv-data-bar">
                        <div
                          className={`inv-data-bar-fill inv-bar--${selectedCap.accent}`}
                          style={{ width: selectedCap.dataBars[i] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* ── DECISION TYPES — large colored panels ─────── */}
        <RevealSection id="decisions" className="inv-decisions">
          <div className="inv-container">
            <div className="inv-decisions-head">
              <p className="inv-eyebrow">
                <span className="inv-eyebrow-dot" aria-hidden="true" />
                AI decision types
              </p>
              <h2 className="inv-how-h2">
                Every recommendation is a reorder, replace, or remove — with the why attached.
              </h2>
            </div>
            <div className="inv-decisions-grid">
              {decisionTypes.map((dt) => (
                <div key={dt.label} className={`inv-decision-panel inv-decision-panel--${dt.accent}`}>
                  <div className="inv-decision-icon">
                    <svg viewBox="0 0 16 16" strokeWidth="1.6">
                      <path d={dt.iconPath} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="inv-decision-title">{dt.label}</h3>
                  <p className="inv-decision-desc">{dt.desc}</p>
                  <span className="inv-decision-signal">
                    <span className="inv-decision-signal-key">Signal: </span>
                    {dt.signal}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* ── POS INTEGRATIONS ─────────────────────────── */}
        <RevealSection id="integrations" className="inv-pos">
          <div className="inv-container">
            <div className="inv-pos-inner">
              <div className="inv-pos-copy">
                <p className="inv-eyebrow">
                  <span className="inv-eyebrow-dot" aria-hidden="true" />
                  POS integrations
                </p>
                <h2>Works with the POS you already have.</h2>
                <p>
                  Coodra connects directly to Shopify, Square, Lightspeed, Clover, and
                  Moneris. No ERP. No middleware. No importer sheets.
                </p>
                <Link to="/integrations" className="inv-text-link">Browse all integrations →</Link>
              </div>
              <div className="inv-pos-marquee-wrap">
                <div className="inv-pos-marquee">
                  {posSystems.map((pos) => (
                    <div key={pos.name} className="inv-pos-row">
                      <span className="inv-pos-name">{pos.name}</span>
                      <p className="inv-pos-note">{pos.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* ── CTA ─────────────────────────────────────── */}
        <section
          ref={ctaRef}
          className="inv-cta"
          aria-label="Inventory management CTA"
          onMouseMove={handleCtaMove}
          onMouseEnter={() => setCtaGlow(true)}
          onMouseLeave={() => setCtaGlow(false)}
        >
          <div className="inv-cta-noise" aria-hidden="true" />
          <div
            className="inv-cta-glow"
            aria-hidden="true"
            style={{ '--mx': `${ctaMx}%` } as React.CSSProperties}
            data-active={ctaGlow ? 'true' : undefined}
          />
          <div className="inv-container inv-cta-inner">
            <h2>See what your inventory data has been telling you.</h2>
            <p>Connect your POS and get your first ranked decision list in under a day.</p>
            <div className="inv-cta-actions">
              <Link to="/signup" className="inv-cta-btn inv-cta-btn--primary">Start for free</Link>
              <Link to="/contact" className="inv-cta-btn inv-cta-btn--ghost">Talk to sales</Link>
            </div>
          </div>
        </section>

      </main>
      <MarketingFooter />
    </div>
  )
}
