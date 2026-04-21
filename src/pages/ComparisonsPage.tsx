import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router'
import { motion, useInView } from 'framer-motion'
import { Check, X, ArrowRight, Zap, ShieldCheck, BarChart3, RefreshCw } from 'lucide-react'
import MarketingHeader from '../components/MarketingHeader'
import MarketingFooter from '../components/MarketingFooter'
import MarketingMedia from '../components/MarketingMedia'
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

const competitorDetails: { name: Competitor; tagline: string; body: string; callout: string }[] = [
  {
    name: 'Netstock',
    tagline: 'Mid-market planning — built for ERP shops',
    body: 'Netstock was built for mid-market businesses that already have an ERP and a planning team to operate it. Getting value out of Netstock requires mapping data from that ERP — a process that routinely takes weeks and often involves consultants. If your business runs on a modern POS and not an ERP, Netstock is not built for you.',
    callout: 'Choose Coodra if you do not have an ERP and need replenishment decisions the same day you sign up.',
  },
  {
    name: 'Cin7',
    tagline: 'Enterprise operations platform — complex pricing',
    body: 'Cin7 is an enterprise and mid-market operations platform with complex, module-based pricing that scales quickly as you add features and locations. It is designed for businesses that have the internal resources to implement and maintain an ERP. Many independent retailers find the pricing and complexity aimed at a fundamentally different type of operation.',
    callout: 'Choose Coodra if you want clear, ranked replenishment decisions without the overhead of an ERP configuration project.',
  },
  {
    name: 'Fishbowl',
    tagline: 'QuickBooks-adjacent — manual entry required',
    body: 'Fishbowl is often paired with QuickBooks for inventory tracking and is popular among small manufacturers and e-commerce businesses. It requires manual data entry for inventory counts rather than pulling live data from your POS. The result is a system that requires ongoing operator time to maintain rather than one that acts on your behalf.',
    callout: 'Choose Coodra if you want replenishment recommendations surfaced automatically from your actual POS sales data.',
  },
  {
    name: 'DEAR Systems',
    tagline: 'Cloud ERP for SMBs — setup before value',
    body: 'DEAR Systems is a cloud ERP aimed at SMB businesses that need comprehensive inventory, purchasing, and sales management in one platform. The tradeoff is setup complexity — DEAR requires ERP-level configuration before replenishment logic becomes operational. For independent retailers who just need to know what to reorder this week, that setup overhead is often the barrier.',
    callout: 'Choose Coodra if you need replenishment recommendations now without weeks of ERP implementation.',
  },
  {
    name: 'Zoho Inventory',
    tagline: 'Part of the Zoho suite — best within Zoho ecosystem',
    body: 'Zoho Inventory is part of the broader Zoho suite — a collection of business tools that includes CRM, accounting, inventory, and more. For independent retailers already in the Zoho ecosystem, Zoho Inventory works as an inventory module. But the inventory module alone does not have the AI decision-ranking layer that Coodra is built around.',
    callout: 'Choose Coodra if your priority is a ranked list of what to reorder this week without adopting the Zoho platform.',
  },
  {
    name: 'Sortly',
    tagline: 'Visual inventory tracking — tracks, does not decide',
    body: 'Sortly is a visually driven inventory tracking tool designed for small teams that need to know what they have on the shelf. Its free tier is generous for basic tracking. Where Sortly stops is exactly where Coodra starts: Sortly shows you what you have, but it does not tell you what to do about it. There is no demand signal, no margin-weighted ranking, and no replenishment calendar.',
    callout: 'Choose Coodra if you have graduated from knowing what is on your shelf to knowing what to reorder before you run out.',
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

const comparisonsMedia = {
  context: {
    posterPng: '/images/media/comparisons-context-view-animated.svg',
    objectPosition: 'center center',
  },
  approval: {
    posterPng: '/images/media/comparisons-approval-flow-animated.svg',
    objectPosition: 'center center',
  },
} as const

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
                      className={`cmp-brand-chip__logo ${c === 'DEAR Systems' ? 'cmp-brand-chip__logo--dear' : ''}`}
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

// ── FAQ schema ────────────────────────────────────────────────────────────────

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How is Coodra different from Netstock?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Netstock is built for mid-market companies with ERP systems and dedicated supply chain planners. Coodra is built for independent retailers who run Shopify, Square, Lightspeed, or Clover and do not have an ERP or a dedicated planner. Coodra connects directly to your POS and delivers ranked decisions the same day — no implementation project, no data mapping, and no months of setup.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Coodra require an ERP to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Coodra is designed from the ground up for retailers without an ERP. It uses your actual POS sales and inventory data — drawn directly from Shopify, Square, Lightspeed, or Clover — to generate replenishment recommendations. You do not need Netstock, Cin7, DEAR, or any other ERP to use Coodra.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Coodra less expensive than Cin7?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Coodra is priced for independent retailers, not enterprise operations. Cin7 is an ERP platform with module-based pricing that scales with features and user count. Coodra\'s pricing is published transparently on its website, starts from a free plan, and does not require implementation fees or add-ons to deliver core value.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why is Coodra better for independent retailers without a dedicated planner?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most inventory platforms assume you have a planner who can interpret dashboards, run reports, and act on recommendations. Coodra assumes you are a busy retail operator with five other jobs. It surfaces the top five decisions worth acting on this week, ranked by impact on your margin, with clear rationale for each action. You approve or skip — no dashboard exploration required.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can Coodra replace Fishbowl or Zoho Inventory for a small retail team?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For a small retail team using Shopify or Square, Coodra is designed to replace the manual work of tracking what to reorder. Fishbowl is often paired with QuickBooks and requires more manual data entry. Zoho Inventory is broader but requires manual sync and setup. Coodra pulls your POS data automatically and focuses specifically on the weekly replenishment decision — not inventory tracking or accounting.',
      },
    },
  ],
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function ComparisonsPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [activeCompetitor, setActiveCompetitor] = useState<Competitor>('Netstock')
  const [contentKey, setContentKey] = useState(0)
  const activeDetail = competitorDetails.find(d => d.name === activeCompetitor)!

  // Trigger fade animation on competitor change by updating key
  useEffect(() => {
    setContentKey(k => k + 1)
  }, [activeCompetitor])

  return (
    <div className="cmp-page site-shell" data-theme="light">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
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
              Coodra is retail inventory software for small business — built to turn your POS data into ranked daily decisions without an ERP, a consultant, or weeks of setup. Built for independent retail teams across Shopify, Square, Lightspeed, Clover, and more. Here is how it compares against Netstock, Cin7, Fishbowl, DEAR Systems, Zoho Inventory, and Sortly.
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

        {/* ── Tier 1: Best inventory software for small retail business ── */}
        <section className="cmp-tier1">
          <div className="cmp-tier1-inner container">
            <h2 className="cmp-tier1-h2">Best Inventory Software for Small Retail Business: What to Look For</h2>
            <div className="cmp-tier1-grid">
              <div className="cmp-tier1-col">
                <p>
                  Small retail businesses have fundamentally different needs from mid-market or enterprise operations. The best inventory software for a small retail business connects directly to your point-of-sale system — Shopify, Square, Lightspeed, or Clover — without requiring an ERP, a dedicated IT team, or weeks of implementation time. If the software requires data mapping, consultant-assisted setup, or a mandatory module bundle before you can see your first reorder recommendation, it was not built for your size of operation.
                </p>
                <p>
                  What small retailers actually need is simple: a list of what to reorder this week, ranked by urgency and impact on margin. Not a dashboard to explore. Not a spreadsheet to maintain. Not a module to configure. The right software surfaces the five decisions most worth acting on right now, with clear rationale, so you can approve or skip in under ten minutes. That is the bar for what independent retail inventory management software should deliver in 2026.
                </p>
                <p>
                  Beyond the core decision surface, look for transparent pricing on the vendor's own website, a free entry plan with no credit card required, and a setup that completes in hours — not weeks. Retail inventory software for small business should also work with the POS you already have, pulling live sales and on-hand data without manual entry or importer scripts. Any vendor that asks you to export, clean, and re-import your own POS data before they can deliver their first insight is adding steps that a small retail team does not have time for.
                </p>
              </div>
              <div className="cmp-tier1-col">
                <p>
                  A retail inventory management company serving independent retailers should understand the realities of multi-location, multi-category retail: that a jewelry store and a pet supply shop face different replenishment rhythms even if they use the same POS. The software should handle lead time variation between distributors, seasonal velocity shifts that distort simple averages, and the margin difference between a top-selling SKU and one that just appears to be moving.
                </p>
                <p>
                  Coodra was designed around one specific observation: independent retail teams do not have a planner on staff. They have a store owner or manager who is already doing five other jobs. The best inventory software for a small retail business does not hand them a data warehouse and ask them to find the insight. It delivers the insight directly — ranked by margin impact, with distributor and lead-time context attached to each recommendation — so the decision is already made, just awaiting approval.
                </p>
                <p>
                  When evaluating retail inventory software for small business, prioritize vendors whose comparison charts show "ERP required" and "weeks to implement" as checkmarks in the competitor columns — not your own. That is the tell. If a vendor built their comparison table to highlight enterprise features, they are likely an enterprise vendor. Independent retail has different needs, and your software should reflect that from day one.
                </p>
              </div>
            </div>
            <div className="cmp-tier1-note">
              <p>
                <strong>Comparing options?</strong> Use the chart below to see how Coodra specifically compares on the features that matter most for small retail — no ERP, same-day setup, POS-direct, and transparent pricing.{' '}
                <Link to="/resources">Browse our free resource library →</Link>
              </p>
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

            <div className="cmp-evidence-media" aria-label="Real dashboard comparison evidence">
              <article className="cmp-evidence-media__card">
                <div className="cmp-evidence-media__frame">
                  <MarketingMedia
                    alt="Coodra dashboard context view"
                    posterPng={comparisonsMedia.context.posterPng}
                    objectPosition={comparisonsMedia.context.objectPosition}
                  />
                </div>
                <p>Real context view</p>
              </article>
              <article className="cmp-evidence-media__card">
                <div className="cmp-evidence-media__frame">
                  <MarketingMedia
                    alt="Coodra dashboard recommendation approval flow"
                    posterPng={comparisonsMedia.approval.posterPng}
                    objectPosition={comparisonsMedia.approval.objectPosition}
                  />
                </div>
                <p>Real approval flow</p>
              </article>
            </div>

            {/* How to read this chart */}
            <div className="cmp-chart-guide">
              <h3 className="cmp-chart-guide__heading">How to read this chart</h3>
              <div className="cmp-chart-guide__items">
                <div className="cmp-chart-guide__item">
                  <span className="cmp-chart-guide__icon cmp-check cmp-check--coodra"><Check size={12} strokeWidth={3} /></span>
                  <p><strong>Coodra column</strong> — what Coodra delivers</p>
                </div>
                <div className="cmp-chart-guide__item">
                  <span className="cmp-chart-guide__icon cmp-check"><Check size={12} strokeWidth={3} /></span>
                  <p><strong>Competitor columns</strong> — whether they offer the feature</p>
                </div>
                <div className="cmp-chart-guide__item">
                  <span className="cmp-chart-guide__icon cmp-cross"><X size={12} strokeWidth={3} /></span>
                  <p><strong>Gray text</strong> — feature is missing or requires a paid add-on</p>
                </div>
                <div className="cmp-chart-guide__item">
                  <span className="cmp-chart-guide__icon cmp-cell-text">Aa</span>
                  <p><strong>Descriptive text</strong> — how the competitor describes the limitation</p>
                </div>
              </div>
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

        {/* ── Retail Inventory Management Companies ── */}
        <section className="cmp-companies-section">
          <div className="cmp-companies-inner container">
            <div className="cmp-companies-header">
              <h2 className="cmp-companies-h2">What to Look for in a Retail Inventory Management Company</h2>
              <p>
                Not all retail inventory management companies serve the same type of customer. Most were built for enterprise operations, mid-market supply chains, or businesses that already have an ERP. Independent retailers — single to multi-location, Shopify or Square POS, one to three people making buying decisions — represent a distinctly different segment. Here is what separates the right fit from a misaligned vendor.
              </p>
            </div>
            <div className="cmp-companies-grid">
              <div className="cmp-company-card">
                <h3>No ERP requirement</h3>
                <p>Retail inventory management companies that require an ERP to function are designed for businesses with supply chain teams and IT departments. For independent retailers running Shopify, Square, Lightspeed, or Clover, an ERP requirement is a barrier — not a feature. Choose software that connects directly to your POS on day one.</p>
              </div>
              <div className="cmp-company-card">
                <h3>Same-day setup</h3>
                <p>If a retail inventory management company quotes weeks or months to implement, they are built for projects, not operations. The best vendors for small retail teams offer setup that completes in hours — pulling 90 days of live POS sales and inventory data automatically, without a consultant, data mapping exercise, or importer spreadsheet.</p>
              </div>
              <div className="cmp-company-card">
                <h3>Decision-first, not dashboard-first</h3>
                <p>Most inventory platforms hand you a data warehouse and ask you to find the insight. A retail inventory management company built for independent retail teams does the opposite: it surfaces the ranked list of decisions most worth acting on this week, with clear rationale for each. You approve or skip — not explore and interpret.</p>
              </div>
              <div className="cmp-company-card">
                <h3>Transparent pricing</h3>
                <p>Vendors that publish their pricing on their own website are confident enough in their product to show it without a sales conversation. Retail inventory management companies that hide pricing behind a "contact sales" form are often pricing for enterprise deals — and independent retailers frequently discover they are paying enterprise prices for a product that does not fit their use case.</p>
              </div>
              <div className="cmp-company-card">
                <h3>Margin-weighted recommendations</h3>
                <p>Inventory reorder tools that recommend purely by velocity or turnover miss the point for retail teams trying to protect their margin. The right retail inventory management company scores every SKU by its contribution to net margin — flagging items where cost has moved, price has stayed flat, or velocity has climbed without a corresponding price adjustment.</p>
              </div>
              <div className="cmp-company-card">
                <h3>Lead-time context on every order</h3>
                <p>Reorder recommendations without distributor lead-time context create stockouts on fast movers. A retail inventory management company built for independent retail attaches lead time, MOQ, case pack requirements, and available budget to every order candidate — so what you approve is what arrives before you run out, not after.</p>
              </div>
            </div>
            <div className="cmp-companies-cta">
              <p>
                Coodra meets every one of these criteria.{' '}
                <Link to="/signup">Start free with no credit card →</Link>
              </p>
            </div>
          </div>
        </section>

        {/* ── Competitor tabs ── */}
        <section className="cmp-competitor-tabs">
          <div className="cmp-tabs-inner container">

            <div className="cmp-tabs-header">
              <h2>How Coodra compares to each competitor</h2>
              <p>
                Every competitor listed here serves a real market. Coodra&rsquo;s specific argument is that the independent retail segment — single to multi-location, Shopify or Square POS, one to three people making buying decisions — is not that market. Here is what that difference looks like in practice for each tool.
              </p>
            </div>

            {/* Tab bar */}
            <div className="cmp-tabs-bar" role="tablist">
              {competitorDetails.map((comp) => (
                <button
                  key={comp.name}
                  role="tab"
                  aria-selected={activeCompetitor === comp.name}
                  className={`cmp-tab ${activeCompetitor === comp.name ? 'cmp-tab--active' : ''}`}
                  onClick={() => setActiveCompetitor(comp.name)}
                >
                  <img
                    src={competitorLogos[comp.name].logo}
                    alt={competitorLogos[comp.name].alt}
                    className={`cmp-tab__logo ${comp.name === 'DEAR Systems' ? 'cmp-tab__logo--dear' : ''}`}
                    loading="lazy"
                  />
                  <span className="cmp-tab__name">{comp.name}</span>
                </button>
              ))}
            </div>

            {/* Tab content — CSS keyframe animation on competitor change */}
            <div key={contentKey} className="cmp-tab-content cmp-tab-content--animating" role="tabpanel">
              <div className="cmp-tab-content__meta">
                <img
                  src={competitorLogos[activeCompetitor].logo}
                  alt={competitorLogos[activeCompetitor].alt}
                  className={`cmp-tab-content__logo ${activeCompetitor === 'DEAR Systems' ? 'cmp-tab-content__logo--dear' : ''}`}
                  loading="lazy"
                />
                <div>
                  <p className="cmp-tab-content__tagline">{activeDetail.tagline}</p>
                  <h3>Coodra vs {activeCompetitor}</h3>
                </div>
              </div>

              <p className="cmp-tab-content__body">{activeDetail.body}</p>

              <div className="cmp-tab-content__callout">
                <span className="cmp-tab-content__callout-icon" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
                    <circle cx="10" cy="10" r="9" stroke="#2fd7c6" strokeWidth="1.5"/>
                    <path d="M10 6v5M10 13.5v.5" stroke="#2fd7c6" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </span>
                <p>{activeDetail.callout}</p>
              </div>

              <div className="cmp-tab-content__actions">
                <Link to="/signup" className="btn btn-primary">
                  Start free <ArrowRight size={16} />
                </Link>
                <Link to="/pricing" className="btn btn-secondary">
                  See pricing
                </Link>
              </div>
            </div>

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
