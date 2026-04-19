import { useRef } from 'react'
import { Link } from 'react-router'
import { motion, useInView } from 'framer-motion'
import { Check, X, ArrowRight, Zap, ShieldCheck, BarChart3, RefreshCw } from 'lucide-react'
import MarketingHeader from '../components/MarketingHeader'
import MarketingFooter from '../components/MarketingFooter'
import './ComparisonsPage.css'

// ── Competitor data ───────────────────────────────────────────────────────────
// Columns: Coodra, Netstock, Cin7, Fishbowl, DEAR, Zoho Inventory, Sortly
// true = has feature, false = does not have, string = note/value

const competitors = ['Netstock', 'Cin7', 'Fishbowl', 'DEAR Systems', 'Zoho Inventory', 'Sortly'] as const
type Competitor = typeof competitors[number]

const competitorLogos: Record<Competitor, { logo: string; alt: string }> = {
  Netstock: {
    logo: '/images/competitors/netstock.png',
    alt: 'Netstock logo',
  },
  Cin7: {
    logo: '/images/competitors/cin7.png',
    alt: 'Cin7 logo',
  },
  Fishbowl: {
    logo: '/images/competitors/fishbowl.png',
    alt: 'Fishbowl logo',
  },
  'DEAR Systems': {
    logo: '/images/competitors/dearsystems.png',
    alt: 'DEAR Systems logo',
  },
  'Zoho Inventory': {
    logo: '/images/competitors/zoho.png',
    alt: 'Zoho logo',
  },
  Sortly: {
    logo: '/images/competitors/sortly.png',
    alt: 'Sortly logo',
  },
}

interface FeatureRow {
  feature: string
  coodra: boolean | string
  competitors: Record<Competitor, boolean | string>
  coodraNote?: string
}

const comparisonRows: FeatureRow[] = [
  {
    feature: 'Built for independent retailers',
    coodra: true,
    competitors: {
      Netstock: 'Mid-market focus',
      Cin7: 'Enterprise/mid-market',
      Fishbowl: 'SMB-focused',
      'DEAR Systems': 'SMB cloud ERP',
      'Zoho Inventory': 'SMB + enterprise',
      Sortly: 'SMB/teams',
    },
  },
  {
    feature: 'No ERP required',
    coodra: true,
    competitors: {
      Netstock: false,
      Cin7: false,
      Fishbowl: 'QuickBooks often paired',
      'DEAR Systems': false,
      'Zoho Inventory': false,
      Sortly: true,
    },
    coodraNote: 'Core differentiator',
  },
  {
    feature: 'Connects POS directly (Shopify, Square, Lightspeed, Clover)',
    coodra: true,
    competitors: {
      Netstock: false,
      Cin7: true,
      Fishbowl: 'Limited POS',
      'DEAR Systems': 'Limited',
      'Zoho Inventory': true,
      Sortly: 'Limited',
    },
    coodraNote: 'POS-direct',
  },
  {
    feature: 'Live in a day — no implementation project',
    coodra: true,
    competitors: {
      Netstock: 'Weeks to months',
      Cin7: 'Days to weeks',
      Fishbowl: 'Days to weeks',
      'DEAR Systems': 'Days to weeks',
      'Zoho Inventory': 'Hours to days',
      Sortly: 'Same day',
    },
  },
  {
    feature: 'Transparent pricing on website',
    coodra: true,
    competitors: {
      Netstock: false,
      Cin7: false,
      Fishbowl: false,
      'DEAR Systems': false,
      'Zoho Inventory': true,
      Sortly: true,
    },
    coodraNote: 'Public pricing page',
  },
  {
    feature: 'No mandatory modules or add-ons',
    coodra: true,
    competitors: {
      Netstock: false,
      Cin7: false,
      Fishbowl: 'Add-ons required',
      'DEAR Systems': 'Module-based',
      'Zoho Inventory': 'Suite bundled',
      Sortly: 'Free/paid tiers',
    },
  },
  {
    feature: 'Starts from POS data — no data cleanup required',
    coodra: true,
    competitors: {
      Netstock: false,
      Cin7: false,
      Fishbowl: false,
      'DEAR Systems': false,
      'Zoho Inventory': false,
      Sortly: true,
    },
  },
  {
    feature: '90-day sales history pulled automatically',
    coodra: true,
    competitors: {
      Netstock: 'ERP data mapping',
      Cin7: 'ERP data required',
      Fishbowl: 'Manual entry',
      'DEAR Systems': 'ERP setup needed',
      'Zoho Inventory': 'Manual sync',
      Sortly: 'Manual entry',
    },
  },
  {
    feature: 'Predictive demand signal from POS history',
    coodra: true,
    competitors: {
      Netstock: false,
      Cin7: false,
      Fishbowl: false,
      'DEAR Systems': 'MRP forecasting',
      'Zoho Inventory': false,
      Sortly: false,
    },
    coodraNote: 'AI-powered',
  },
  {
    feature: 'Designed for teams without a dedicated planner',
    coodra: true,
    competitors: {
      Netstock: false,
      Cin7: false,
      Fishbowl: false,
      'DEAR Systems': false,
      'Zoho Inventory': false,
      Sortly: true,
    },
  },
]

const whyCoodra = [
  {
    icon: Zap,
    title: 'Live in a day',
    body: 'Connect your POS and see your first ranked inventory decision the same day. No implementation project, no data cleanup, no consultant.',
  },
  {
    icon: RefreshCw,
    title: 'Decisions, not dashboards',
    body: 'Coodra surfaces the five inventory decisions most worth acting on this week — ranked by impact on your margin. Not a data warehouse you have to explore.',
  },
  {
    icon: ShieldCheck,
    title: 'No ERP required',
    body: 'Built for independent retail teams across Shopify, Square, Lightspeed, Clover, and more. No enterprise software. No dedicated planner. No months of onboarding.',
  },
  {
    icon: BarChart3,
    title: 'Margin-first, always',
    body: 'Every recommendation is ranked by contribution to your net margin — not by vendor incentives, not by turnover velocity alone.',
  },
]

// ── Float badge data ───────────────────────────────────────────────────────────

const heroFloats = [
  { cls: 'fp-1', label: 'No ERP', color: 'teal' },
  { cls: 'fp-2', label: 'Same day setup', color: 'amber' },
  { cls: 'fp-3', label: '$0 setup fee', color: 'mint' },
  { cls: 'fp-4', label: '90-day history', color: 'violet' },
  { cls: 'fp-5', label: 'Ranked decisions', color: 'red' },
]

const heroStats = [
  { num: '1', label: 'day to first decision' },
  { num: '0', label: 'ERP integrations needed' },
  { num: '$0', label: 'setup or implementation' },
  { num: 'Free', label: 'plan available' },
]

// ── Comparison table ───────────────────────────────────────────────────────────

function ComparisonTable() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="cmp-table-outer">
      <div className="cmp-table-scroll">
        <table className="cmp-table">
          <thead>
            <tr>
              <th className="cmp-table__th cmp-table__th--feature">Feature</th>
              <th className="cmp-table__th cmp-table__th--coodra">
                <span className="cmp-brand-chip cmp-brand-chip--coodra cmp-brand-chip--with-logo">
                  <img src="/images/logo.png" alt="Coodra logo" className="cmp-brand-chip__logo" loading="lazy" />
                  Coodra
                </span>
              </th>
              {competitors.map((c) => (
                <th key={c} className="cmp-table__th cmp-table__th--competitor">
                  <span className="cmp-brand-chip cmp-brand-chip--with-logo">
                    <img
                      src={competitorLogos[c].logo}
                      alt={competitorLogos[c].alt}
                      className="cmp-brand-chip__logo"
                      loading="lazy"
                    />
                    {c}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row, i) => (
              <motion.tr
                key={row.feature}
                className="cmp-table__row"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.35, delay: i * 0.04, ease: [0.22, 0.8, 0.3, 1] }}
              >
                <td className="cmp-table__feature">
                  {row.feature}
                  {row.coodraNote ? (
                    <span className="cmp-table__note">{row.coodraNote}</span>
                  ) : null}
                </td>
                <td className="cmp-table__cell cmp-table__cell--coodra">
                  <CellValue value={row.coodra} isCoodra />
                </td>
                {competitors.map((c) => (
                  <td key={c} className="cmp-table__cell">
                    <CellValue value={row.competitors[c]} />
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CellValue({ value, isCoodra = false }: { value: boolean | string; isCoodra?: boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <span className={`cmp-check ${isCoodra ? 'cmp-check--coodra' : ''}`}>
        <Check size={14} strokeWidth={2.5} />
      </span>
    ) : (
      <span className={`cmp-cross ${isCoodra ? 'cmp-cross--coodra' : ''}`}>
        <X size={14} strokeWidth={2.5} />
      </span>
    )
  }
  return <span className={`cmp-cell-text ${isCoodra ? 'cmp-cell-text--coodra' : ''}`}>{value}</span>
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function ComparisonsPage() {
  const heroRef = useRef<HTMLDivElement>(null)

  return (
    <div className="cmp-page site-shell" data-theme="light">
      <MarketingHeader />

      <main>
        {/* ── Hero ── */}
        <section className="cmp-hero" ref={heroRef}>
          {/* Floating badges */}
          {heroFloats.map((f) => (
            <div key={f.cls} className={`cmp-hero-float ${f.cls} cmp-hero-float--${f.color}`} aria-hidden="true">
              {f.label}
            </div>
          ))}

          <div className="cmp-hero-inner container">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 0.8, 0.3, 1] }}
            >
              <p className="cmp-eyebrow">
                <svg viewBox="0 0 16 16" aria-hidden="true" className="cmp-eyebrow-icon">
                  <path d="M8 2.2c.3 1.7 1.6 3 3.3 3.3-1.7.3-3 1.6-3.3 3.3-.3-1.7-1.6-3-3.3-3.3 1.7-.3 3-1.6 3.3-3.3Zm4.4 6.3c.2.9.9 1.6 1.8 1.8-.9.2-1.6.9-1.8 1.8-.2-.9-.9-1.6-1.8-1.8.9-.2 1.6-.9 1.8-1.8Z" />
                </svg>
                Inventory Software Comparison
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 0.8, 0.3, 1] }}
            >
              Built for independent retail.
              <br />
              <span className="cmp-accent">Not enterprise operations.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18, ease: [0.22, 0.8, 0.3, 1] }}
            >
              Coodra connects to your existing POS and turns live sales and inventory data into clear daily actions, no ERP required. Built for independent retail teams across Shopify, Square, Lightspeed, Clover, and more. Here is how it compares against Netstock, Cin7, Fishbowl, DEAR Systems, Zoho Inventory, and Sortly.
            </motion.p>

            <motion.div
              className="cmp-hero-actions"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28, ease: [0.22, 0.8, 0.3, 1] }}
            >
              <Link to="/signup" className="btn btn-primary">
                Start free <ArrowRight size={16} />
              </Link>
              <Link to="/pricing" className="btn btn-secondary">
                See pricing
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── Stats band ── */}
        <section className="cmp-stats-band">
          <div className="cmp-stats-inner container">
            <div className="cmp-stats-grid">
              {heroStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="cmp-stat-pill"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 0.8, 0.3, 1] }}
                >
                  <span className="cmp-stat-pill__num">{stat.num}</span>
                  <span className="cmp-stat-pill__label">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comparison table ── */}
        <section className="cmp-table-section">
          <div className="cmp-table-section-inner container">
            <div className="cmp-table-header" data-aos="fade-up">
              <h2>How Coodra stacks up</h2>
              <p>
                Every other solution on this chart was built for a different type of business. Coodra was built for independent retailers using modern POS systems - including Shopify, Square, Lightspeed, Clover, and more - without an ERP, without a dedicated planner, and without months to spend on implementation.
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, ease: [0.22, 0.8, 0.3, 1] }}
            >
              <ComparisonTable />
            </motion.div>
          </div>
        </section>

        {/* ── Why Coodra ── */}
        <section className="cmp-why-section">
          <div className="cmp-why-inner container">
            <div className="cmp-why-header" data-aos="fade-up">
              <p className="cmp-eyebrow">
                <svg viewBox="0 0 16 16" aria-hidden="true" className="cmp-eyebrow-icon">
                  <path d="M8 2.2c.3 1.7 1.6 3 3.3 3.3-1.7.3-3 1.6-3.3 3.3-.3-1.7-1.6-3-3.3-3.3 1.7-.3 3-1.6 3.3-3.3Zm4.4 6.3c.2.9.9 1.6 1.8 1.8-.9.2-1.6.9-1.8 1.8-.2-.9-.9-1.6-1.8-1.8.9-.2 1.6-.9 1.8-1.8Z" />
                </svg>
                Why Coodra
              </p>
              <h2>The difference is in the design philosophy</h2>
              <p>
                Enterprise tools solve enterprise problems. Coodra solves the specific problem that
                independent retailers actually have: not enough time to manage inventory manually, and no
                ERP to delegate it to.
              </p>
            </div>

            <div className="cmp-why-grid">
              {whyCoodra.map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.article
                    key={item.title}
                    className="cmp-why-card surface-card"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 0.8, 0.3, 1] }}
                  >
                    <div className="cmp-why-icon">
                      <Icon size={20} strokeWidth={1.8} />
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </motion.article>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cmp-cta surface-contrast" data-aos="fade-up" data-aos-delay="100">
          <div className="cmp-cta-inner container">
            <h2>
              No ERP. No months of setup.
              <br />
              <span className="cmp-accent">Just your store, running smarter.</span>
            </h2>
            <p>Connect your POS. Coodra does the rest. Start free and scale as your store grows.</p>
            <div className="cmp-cta-actions">
              <Link to="/signup" className="btn btn-primary-dark">
                Start free <ArrowRight size={16} />
              </Link>
              <Link to="/pricing" className="btn btn-ghost-dark">
                View pricing
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}

