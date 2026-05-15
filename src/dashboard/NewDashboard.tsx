import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import '@fontsource-variable/geist/index.css'
import type { ChangeEvent, CSSProperties, FormEvent, MouseEvent as ReactMouseEvent } from 'react'
import {
  BarChart3,
  Bell,
  BookOpen,
  Bug,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Command,
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  Image,
  Layers3,
  LifeBuoy,
  LogOut,
  Mail,
  Moon,
  Package,
  PackageCheck,
  Paperclip,
  Plug,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Sun,
  Tag,
  Target,
  TrendingUp,
  Truck,
  Users,
  Video,
  Zap,
  X
} from 'lucide-react'
import type { BootUser, DashboardData, DashboardPageId, IntegrationCard, MerchantDecision, MetricCardData, MetricTone, ProfitSeriesPoint, SimpleRow } from './dashboardTypes'
import { dashboardFallbackData } from './dashboardData'
import {
  disconnectIntegrationConnection,
  loadAccountProfile,
  loadBillingPortal,
  loadDashboardData,
  sendDashboardChat,
  startBillingCheckout,
  streamDashboardChat,
  startIntegrationConnection,
  syncIntegrationConnection,
  updateAccountProfile,
  updateMerchantDecisionStatus
} from './dashboardApi'
import type { AccountProfile, DashboardChatAttachment, DashboardChatMessage, DashboardLoadFilters, DashboardSettings, LoadResult } from './dashboardApi'
import { getPlan, planIncludes, type PlanKey } from '../lib/pricingPlans'
import './NewDashboard.css'

declare const __COODRA_DASHBOARD_BUILD_ID__: string

type NewDashboardProps = {
  user: BootUser
  data?: DashboardData
  initialTheme?: 'light' | 'dark'
  onLogout: () => void | Promise<void>
}

type NavItem = {
  id: DashboardPageId
  label: string
  description: string
  icon: typeof Command
}

type DrawerItem = {
  title: string
  entityType?: 'merchant_decision' | 'purchase_order' | 'simple_row'
  entityId?: string
  eyebrow?: string
  summary?: string
  why?: string
  impact?: string
  status?: string
  tone?: string
  details?: Array<{ label: string; value: string }>
  primaryAction?: string
  secondaryAction?: string
  askContext?: string
}

type DashboardDatePreset = 'last_7_days' | 'last_30_days' | 'this_month' | 'last_month' | 'quarter_to_date' | 'year_to_date' | 'custom'

type DashboardDateRange = {
  preset: DashboardDatePreset
  from: string
  to: string
}

type StoreOption = {
  id: string
  label: string
  subtitle?: string
  disabled?: boolean
}

type FilterMenuPosition = {
  left: number
  top: number
}

type DashboardVersionManifest = {
  version?: string
}

const DASHBOARD_VERSION_URL = '/dashboard-version.json'
const DASHBOARD_UPDATE_CHECK_INTERVAL_MS = 30 * 1000
const GLOBAL_THEME_STORAGE_KEY = 'so_theme_last_v1'

function dashboardThemeStorageScope(user: BootUser): string {
  return String(user.userId || user.email || 'anon')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_')
}

function persistDashboardThemePreference(user: BootUser, theme: 'light' | 'dark') {
  try {
    localStorage.setItem(GLOBAL_THEME_STORAGE_KEY, theme)
    localStorage.setItem(`so_theme_v6_${dashboardThemeStorageScope(user)}`, theme)
  } catch {
    // Storage can be blocked in strict privacy modes.
  }
}

const navItems: NavItem[] = [
  { id: 'command-center', label: 'Command Center', description: 'Today\'s priorities', icon: Command },
  { id: 'decisions', label: 'Decisions', description: 'Approve and track actions', icon: ClipboardList },
  { id: 'merchandise', label: 'Merchandise', description: 'Products and assortment', icon: Layers3 },
  { id: 'operations', label: 'Operations', description: 'Inventory and reorder readiness', icon: Truck },
  { id: 'intelligence', label: 'Intelligence', description: 'Forecasts and reports', icon: BarChart3 },
  { id: 'integrations', label: 'Integrations', description: 'Apps, POS, and syncs', icon: Plug },
  { id: 'workspace', label: 'Workspace', description: 'Settings and integrations', icon: Store }
]

const pageCopy: Record<DashboardPageId, { title: string; subtitle: string }> = {
  'command-center': { title: 'Command Center', subtitle: 'Here\'s what matters most for your business today.' },
  decisions: { title: 'Decisions', subtitle: 'Review, prioritize, and act on AI-driven recommendations.' },
  merchandise: { title: 'Merchandise', subtitle: 'Optimize assortment, product roles, and catalog quality to drive performance.' },
  operations: { title: 'Operations', subtitle: 'Manage inventory, purchase orders, vendor readiness, and transfers.' },
  intelligence: { title: 'Intelligence', subtitle: 'Forecasts, performance signals, reports, and deeper analysis.' },
  integrations: { title: 'Integrations', subtitle: 'Connect stores, POS systems, payment providers, and data sources.' },
  workspace: { title: 'Workspace', subtitle: 'Manage automation, billing, team access, and account controls.' },
  settings: { title: 'Settings', subtitle: 'Manage account preferences, security, notifications, and workspace appearance.' },
  help: { title: 'Help & Support', subtitle: 'Find answers, get support, and learn how to use Coodra.' }
}

function moneyToneClass(tone: string | undefined) {
  return `tone-${tone || 'neutral'}`
}

function todayLabel() {
  return 'Tuesday, May 5, 2026'
}

function dateInputValue(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function defaultDashboardDateRange(): DashboardDateRange {
  const today = new Date()
  return {
    preset: 'last_30_days',
    from: dateInputValue(addDays(today, -29)),
    to: dateInputValue(today)
  }
}

function presetDateRange(preset: DashboardDatePreset): DashboardDateRange {
  const today = new Date()
  if (preset === 'last_7_days') return { preset, from: dateInputValue(addDays(today, -6)), to: dateInputValue(today) }
  if (preset === 'this_month') return { preset, from: dateInputValue(startOfMonth(today)), to: dateInputValue(today) }
  if (preset === 'last_month') {
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const lastDay = new Date(today.getFullYear(), today.getMonth(), 0)
    return { preset, from: dateInputValue(lastMonth), to: dateInputValue(lastDay) }
  }
  if (preset === 'quarter_to_date') {
    const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3
    return { preset, from: dateInputValue(new Date(today.getFullYear(), quarterStartMonth, 1)), to: dateInputValue(today) }
  }
  if (preset === 'year_to_date') return { preset, from: dateInputValue(new Date(today.getFullYear(), 0, 1)), to: dateInputValue(today) }
  return defaultDashboardDateRange()
}

function formatShortDate(value: string) {
  const date = new Date(`${value}T12:00:00`)
  if (!Number.isFinite(date.getTime())) return value
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function dateRangeLabel(range: DashboardDateRange) {
  const labels: Record<DashboardDatePreset, string> = {
    last_7_days: 'Last 7 days',
    last_30_days: 'Last 30 days',
    this_month: 'This month',
    last_month: 'Last month',
    quarter_to_date: 'Quarter to date',
    year_to_date: 'Year to date',
    custom: `${formatShortDate(range.from)} - ${formatShortDate(range.to)}`
  }
  return labels[range.preset]
}

function comparisonLabel(range: DashboardDateRange) {
  if (range.preset === 'last_7_days') return 'vs previous 7 days'
  if (range.preset === 'last_30_days') return 'vs previous 30 days'
  if (range.preset === 'this_month') return 'vs previous month'
  if (range.preset === 'last_month') return 'vs prior month'
  if (range.preset === 'quarter_to_date') return 'vs previous quarter'
  if (range.preset === 'year_to_date') return 'vs previous year'
  return 'vs previous period'
}

function dashboardFiltersFromRange(range: DashboardDateRange, storeId: string): DashboardLoadFilters {
  return {
    dateFrom: range.from,
    dateTo: range.to,
    datePreset: range.preset,
    storeId
  }
}

function updateComparisonText(text: string | undefined, range: DashboardDateRange) {
  if (!text) return text
  return text.replace(/vs last \d+ days/gi, comparisonLabel(range))
}

function withDateRangeLabels(data: DashboardData, range: DashboardDateRange): DashboardData {
  const next = structuredClone(data)
  const updateMetric = (metric: MetricCardData) => ({
    ...metric,
    change: updateComparisonText(metric.change, range),
    detail: updateComparisonText(metric.detail, range)
  })
  next.commandCenter.metrics = next.commandCenter.metrics.map(updateMetric)
  next.commandCenter.outcomes = next.commandCenter.outcomes.map(updateMetric)
  next.decisions.metrics = next.decisions.metrics.map(updateMetric)
  next.merchandise.metrics = next.merchandise.metrics.map(updateMetric)
  next.operations.metrics = next.operations.metrics.map(updateMetric)
  next.intelligence.metrics = next.intelligence.metrics.map(updateMetric)
  next.workspace.metrics = next.workspace.metrics.map(updateMetric)
  return next
}

function businessLabel(user: BootUser, profile: AccountProfile | null) {
  return profile?.business_name || user.company || 'Current business'
}

function firstName(user: BootUser) {
  return user.firstName || user.email.split('@')[0] || 'there'
}

function MiniSparkline({ values }: { values?: number[] }) {
  const points = values && values.length ? values : [20, 32, 28, 38, 44, 51]
  const max = Math.max(...points, 1)
  const min = Math.min(...points, 0)
  const span = Math.max(max - min, 1)
  const path = points
    .map((value, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * 100
      const y = 42 - ((value - min) / span) * 34
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
  const fillPath = `${path} L 100 44 L 0 44 Z`

  return (
    <svg className="cd-mini-spark" viewBox="0 0 100 46" role="img" aria-label="Trend sparkline">
      <path d={fillPath} className="cd-mini-spark__fill" />
      <path d={path} className="cd-mini-spark__line" />
    </svg>
  )
}

function decisionToDrawer(decision: MerchantDecision): DrawerItem {
  return {
    title: decision.title,
    eyebrow: `${decision.category} decision`,
    summary: decision.action,
    why: decision.why,
    impact: decision.impact,
    status: decision.status === 'pending' ? 'Due Today' : decision.status,
    tone: decision.urgency === 'High' ? 'red' : decision.urgency === 'Medium' ? 'amber' : 'teal',
    details: [
      { label: 'Urgency', value: decision.urgency },
      { label: 'Confidence', value: `${decision.confidence}%` },
      { label: 'Owner', value: decision.owner || 'Unassigned' },
      { label: 'Due', value: decision.due || 'Today' },
      { label: 'Expected impact', value: decision.impact }
    ],
    primaryAction: decision.status === 'pending' ? 'Approve decision' : 'Review decision',
    secondaryAction: 'Dismiss',
    askContext: decision.title,
    entityType: 'merchant_decision',
    entityId: decision.id
  }
}

function rowToDrawer(row: SimpleRow, eyebrow: string): DrawerItem {
  return {
    title: row.title,
    eyebrow,
    summary: row.subtitle || row.detail,
    why: row.detail || row.subtitle,
    impact: row.metric,
    status: row.status,
    tone: row.tone,
    details: [
      { label: 'Metric', value: row.metric || 'Not available' },
      { label: 'Status', value: row.status || row.detail || 'Open' },
      { label: 'Last updated', value: 'Recently' }
    ],
    primaryAction: row.status || 'Review',
    secondaryAction: 'Ask Coodra',
    askContext: row.title
  }
}

function StatusPill({ children, tone }: { children: string; tone?: string }) {
  return <span className={`cd-pill ${moneyToneClass(tone)}`}>{children}</span>
}

function PlanUpgradeBlocker({
  featureName,
  requiredPlan,
  currentPlan,
  description,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel = 'Compare plans',
  secondaryCtaHref = '/pricing',
  bullets = []
}: {
  featureName: string
  requiredPlan: PlanKey
  currentPlan?: string
  description: string
  primaryCtaLabel?: string
  primaryCtaHref?: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
  bullets?: string[]
}) {
  const required = getPlan(requiredPlan)
  const current = getPlan(currentPlan)
  const label = primaryCtaLabel || (requiredPlan === 'enterprise' ? 'Talk to Sales' : `Upgrade to ${required.name}`)
  const href = primaryCtaHref || (requiredPlan === 'enterprise' ? '/contact?intent=enterprise' : `/pricing?upgrade=${requiredPlan}`)
  return (
    <article className="cd-plan-blocker">
      <span className="cd-plan-blocker__icon"><ShieldCheck size={18} /></span>
      <div>
        <small>{current.name} plan</small>
        <h3>{featureName} is available on {required.name}{requiredPlan === 'enterprise' ? '.' : ' and above.'}</h3>
        <p>{description}</p>
        {bullets.length ? (
          <ul>
            {bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
          </ul>
        ) : null}
        <div className="cd-plan-blocker__actions">
          <a href={href}>{label}</a>
          <a className="is-secondary" href={secondaryCtaHref}>{secondaryCtaLabel}</a>
        </div>
      </div>
    </article>
  )
}

function RoleCard({ row, index, total }: { row: SimpleRow; index: number; total: number }) {
  const icons = [Star, BarChart3, Store, Calendar, Package, PackageCheck]
  const Icon = icons[index % icons.length]
  const displayTone = merchandiseRoleTone(row)
  const isRiskRole = row.title.toLowerCase().includes('dead') || row.title.toLowerCase().includes('risk')
  const count = Number(String(row.metric || '').replace(/[^0-9.-]/g, ''))
  const share = total > 0 && Number.isFinite(count) ? `${Math.round((count / total) * 100)}% of catalog` : row.detail || 'Classified'
  return (
    <article className={`cd-role-card ${moneyToneClass(displayTone)}`}>
      <span className="cd-metric__icon"><Icon size={22} /></span>
      <div>
        <strong>{row.title}</strong>
        <span>{row.metric || '0'}</span>
        <small className={isRiskRole ? 'is-down' : ''}><b>{isRiskRole ? '↓' : '↑'} {share}</b></small>
      </div>
    </article>
  )
}

type WorkspaceMetric = {
  label: string
  value: string
}

function WorkspaceIcon({ icon: Icon }: { icon: typeof Command }) {
  return (
    <span className="cd-workspace-icon">
      <Icon size={18} />
    </span>
  )
}

function WorkspacePolicyCard({
  icon,
  title,
  subtitle,
  metrics
}: {
  icon: typeof Command
  title: string
  subtitle: string
  metrics: WorkspaceMetric[]
}) {
  return (
    <article className="cd-ref-card cd-workspace-policy">
      <WorkspaceIcon icon={icon} />
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <ChevronRight className="cd-workspace-card-chevron" size={18} />
      <div className="cd-workspace-policy__metrics">
        {metrics.map((metric) => (
          <span key={metric.label}>
            <small>{metric.label}</small>
            <strong>{metric.value}</strong>
          </span>
        ))}
      </div>
    </article>
  )
}

function WorkspaceBillingCard({ onAsk, onOpenPage }: { onAsk: (context: string) => void; onOpenPage: (pageId: DashboardPageId) => void }) {
  const metrics = [
    { label: 'Plan Usage', value: 'See overview' },
    { label: 'Users', value: 'Team-backed' },
    { label: 'System Usage', value: 'Not metered' },
    { label: 'Data Storage', value: 'Not metered' }
  ]

  return (
    <article className="cd-ref-card cd-workspace-billing">
      <div className="cd-workspace-card-head">
        <WorkspaceIcon icon={CreditCard} />
        <h3>Billing & Limits</h3>
      </div>
      <div className="cd-workspace-billing__metrics">
        {metrics.map((metric) => (
          <span key={metric.label}>
            <small>{metric.label}</small>
            <strong>{metric.value}</strong>
          </span>
        ))}
      </div>
      <div className="cd-workspace-card-footer">
        <button type="button" onClick={() => onOpenPage('settings')}>View billing details<ChevronRight size={15} /></button>
        <button type="button" onClick={() => onAsk('Download workspace usage report')}><Download size={14} />Download usage report</button>
      </div>
    </article>
  )
}

function WorkspaceAdminMiniCard({
  icon,
  title,
  value,
  detail,
  action,
  onClick
}: {
  icon: typeof Command
  title: string
  value: string
  detail: string
  action: string
  onClick: () => void
}) {
  return (
    <article className="cd-ref-card cd-workspace-mini-admin">
      <div className="cd-workspace-card-head">
        <WorkspaceIcon icon={icon} />
        <h3>{title}</h3>
      </div>
      <strong>{value}</strong>
      <small>{detail}</small>
      <button type="button" onClick={onClick}>{action}<ChevronRight size={15} /></button>
    </article>
  )
}

function WorkspaceActivityCard({ rows, onAsk }: { rows: SimpleRow[]; onAsk: (context: string) => void }) {
  return (
    <article className="cd-ref-card cd-workspace-activity">
      <div className="cd-workspace-card-head">
        <WorkspaceIcon icon={TrendingUp} />
        <h3>Recent System Activity</h3>
      </div>
      <div className="cd-workspace-activity__list">
        {rows.length ? rows.slice(0, 5).map((row) => (
          <div className="cd-workspace-activity__row" key={row.title}>
            <i className={`is-${row.tone}`} />
            <span>{row.title}</span>
            <time>{row.metric || row.detail || 'Logged'}</time>
          </div>
        )) : (
          <div className="cd-empty-row">System activity will appear after audited workspace events.</div>
        )}
      </div>
      <button type="button" onClick={() => onAsk('View all workspace system activity')}>View all activity<ChevronRight size={15} /></button>
    </article>
  )
}

function CommandBriefRow({ icon: Icon, title, detail, onAsk }: { icon: typeof Sparkles; title: string; detail: string; onAsk: (context: string) => void }) {
  return (
    <button className="cd-brief-row" type="button" onClick={() => onAsk(`AI Morning Brief: ${title}`)}>
      <span className="cd-soft-icon"><Icon size={16} /></span>
      <span>
        <strong>{title}</strong>
        <small>{detail}</small>
      </span>
      <ChevronRight size={16} />
    </button>
  )
}

function ImpactMap({ metrics }: { metrics: MetricCardData[] }) {
  const inventoryMetric = metrics.find((metric) => metric.label.toLowerCase().includes('inventory'))
  const marginMetric = metrics.find((metric) => metric.label.toLowerCase().includes('margin'))
  const revenueMetric = metrics.find((metric) => metric.label.toLowerCase().includes('revenue'))
  const rows = [
    { label: 'Profit', impact: marginMetric?.value || 'Measuring', tone: marginMetric?.tone === 'green' ? 'positive' : 'warning', width: marginMetric ? 30 : 12 },
    { label: 'Revenue', impact: revenueMetric?.value || 'Measuring', tone: revenueMetric?.tone === 'green' ? 'positive' : 'warning', width: revenueMetric ? 42 : 12 },
    { label: 'Inventory', impact: inventoryMetric?.value || 'Measuring', tone: inventoryMetric?.tone === 'green' ? 'positive' : 'warning', width: 22 },
    { label: 'Readiness', impact: inventoryMetric?.detail || 'Needs data', tone: 'warning', width: 18 }
  ]

  return (
    <article className="cd-card cd-overview-card cd-impact-map">
      <div className="cd-card-title-row">
        <h2>Impact Map</h2>
        <small>Net Impact</small>
      </div>
      <div className="cd-impact-map__rows">
        {rows.map((row) => (
          <div className={`cd-impact-row is-${row.tone}`} key={row.label}>
            <span>{row.label}</span>
            <div><i style={{ width: `${row.width}%` }} /></div>
            <b>{row.impact}</b>
          </div>
        ))}
      </div>
    </article>
  )
}

function CommandPlanTable({ decisions, openDetail }: { decisions: MerchantDecision[]; openDetail: (item: DrawerItem) => void }) {
  return (
    <section className="cd-command-section">
      <div className="cd-command-section__head"><h2>Today's Plan</h2></div>
      <div className="cd-table-wrap cd-plan-table-wrap">
        <table className="cd-plan-table">
          <thead>
            <tr><th>Action</th><th>Type</th><th>Expected Impact</th><th>Confidence</th><th>Urgency</th><th /></tr>
          </thead>
          <tbody>
            {decisions.length ? decisions.slice(0, 5).map((decision) => (
              <tr key={decision.id}>
                <td>
                  <button className="cd-plan-action" type="button" onClick={() => openDetail(decisionToDrawer(decision))}>
                    <span>{decision.title}</span>
                    <small>{decision.why}</small>
                  </button>
                </td>
                <td><StatusPill tone="neutral">{decision.category}</StatusPill></td>
                <td><strong className="cd-positive-number">{decision.impact}</strong></td>
                <td><span className={`cd-confidence-label is-${decision.confidence >= 85 ? 'high' : 'medium'}`}>{decision.confidence >= 85 ? 'High' : 'Medium'}</span></td>
                <td><span className={`cd-dot-label is-${decision.urgency.toLowerCase()}`}>{decision.urgency}</span></td>
                <td><div className="cd-plan-actions"><button className="cd-small-primary" type="button" onClick={() => openDetail({ ...decisionToDrawer(decision), primaryAction: 'Approve decision' })}>Review</button><button className="cd-small-ghost" type="button" onClick={() => openDetail({ ...decisionToDrawer(decision), primaryAction: 'Dismiss recommendation', secondaryAction: 'Ask Coodra' })}>Dismiss</button></div></td>
              </tr>
            )) : <tr><td colSpan={6}><div className="cd-empty-row">No recommendations are waiting for review.</div></td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function BusinessPulse({ metrics }: { metrics: MetricCardData[] }) {
  return (
    <section className="cd-command-section">
      <div className="cd-command-section__head"><h2>Business Pulse</h2></div>
      <div className="cd-business-pulse">
        {metrics.slice(0, 4).map((metric) => (
          <article className="cd-pulse-card" key={metric.label}>
            <small>{metric.label}</small>
            <strong>{metric.value}</strong>
            <span className={metric.tone === 'red' || String(metric.change || '').startsWith('-') ? 'is-down' : 'is-up'}>
              {metric.tone === 'red' || String(metric.change || '').startsWith('-') ? '↓' : '↑'} {metric.change === 'Live backend' ? metric.detail || 'Connected data' : metric.change || metric.detail || 'Live backend'}
            </span>
          </article>
        ))}
      </div>
    </section>
  )
}

function CommandOutcomes({ metrics, profitSeries }: { metrics: MetricCardData[]; profitSeries: ProfitSeriesPoint[] }) {
  const hasChartData = profitSeries.length > 0
  const chartData = hasChartData ? profitSeries : [{ month: 'Now', thisYear: 0, lastYear: 0 }]
  const values = chartData.flatMap((point) => [point.thisYear, point.lastYear])
  const maxValue = Math.max(...values, 1)
  const minValue = Math.min(...values, 0)
  const topValue = Math.ceil(maxValue / 10) * 10
  const bottomValue = Math.max(0, Math.floor(minValue / 10) * 10)
  const midValue = Math.round((topValue + bottomValue) / 2)
  const xFor = (index: number) => 70 + (index * (1050 / Math.max(chartData.length - 1, 1)))
  const yFor = (value: number) => 18 + ((topValue - value) / Math.max(topValue - bottomValue, 1)) * 58
  const pathFor = (key: 'thisYear' | 'lastYear') => chartData.map((point, index) => `${index === 0 ? 'M' : 'L'}${xFor(index)} ${yFor(point[key])}`).join(' ')
  const moneyLabel = (value: number) => value >= 1000 ? `$${(value / 1000).toFixed(1)}B` : `$${Math.round(value)}M`
  const pointTitle = (point: ProfitSeriesPoint) => {
    const difference = point.thisYear - point.lastYear
    const sign = difference >= 0 ? '+' : '-'
    return `${point.month}: This year ${moneyLabel(point.thisYear)}, last year ${moneyLabel(point.lastYear)}, difference ${sign}${moneyLabel(Math.abs(difference))}`
  }

  return (
    <section className="cd-command-section">
      <div className="cd-command-section__head"><h2>Outcomes</h2></div>
      <article className="cd-card cd-command-outcomes">
        <div className="cd-outcome-total">
          <small>Year to Date <CircleHelp size={13} /></small>
          <div className="cd-outcome-metrics">
            {metrics.slice(0, 3).map((metric) => (
              <span key={metric.label}>
                <small>{metric.label}</small>
                <span className={`cd-outcome-value-row ${metric.value.length > 7 ? 'is-text-value' : ''}`}>
                  <strong>{metric.value}</strong>
                  {(() => {
                    const changeText = metric.change || metric.detail || ''
                    const isSigned = /^[+-]/.test(changeText)
                    const isReadiness = !isSigned && (/^Needs\b/i.test(changeText) || metric.tone === 'neutral')
                    return <em className={`${changeText.startsWith('-') ? 'is-down' : ''} ${isReadiness ? 'is-muted' : ''}`.trim()}>{isSigned ? (changeText.startsWith('-') ? '↓' : '↑') : null} {isSigned ? changeText.replace(/^[+-]\s*/, '') : changeText || 'Measuring'}</em>
                  })()}
                </span>
              </span>
            ))}
          </div>
        </div>
        <div className="cd-outcome-chart">
          <div className="cd-card-title-row">
            <h3>Profit Over Time <CircleHelp size={13} /></h3>
            <div className="cd-profit-legend"><span>This Year</span><span>Last Year</span></div>
          </div>
          {hasChartData ? <svg className="cd-profit-line-chart" viewBox="0 0 1180 120" role="img" aria-label="Profit over time chart">
            <g className="cd-chart-grid">
              <text x="0" y="20">{moneyLabel(topValue)}</text>
              <line x1="55" y1="16" x2="1140" y2="16" />
              <text x="0" y="50">{moneyLabel(midValue)}</text>
              <line x1="55" y1="46" x2="1140" y2="46" />
              <text x="0" y="80">{moneyLabel(bottomValue)}</text>
              <line x1="55" y1="76" x2="1140" y2="76" />
            </g>
            <path className="cd-profit-line is-last" d={pathFor('lastYear')} />
            <path className="cd-profit-line is-current" d={pathFor('thisYear')} />
            {chartData.map((point, index) => (
              <g className="cd-profit-points" key={point.month}>
                <circle className="is-last" cx={xFor(index)} cy={yFor(point.lastYear)} r="4">
                  <title>{pointTitle(point)}</title>
                </circle>
                <circle className="is-current" cx={xFor(index)} cy={yFor(point.thisYear)} r="4.5">
                  <title>{pointTitle(point)}</title>
                </circle>
                <text className="cd-chart-month" x={xFor(index)} y="108">{point.month}</text>
              </g>
            ))}
          </svg> : <div className="cd-profit-empty">Outcome history will appear after measured actions.</div>}
        </div>
      </article>
    </section>
  )
}
function LaunchReadinessPanel({ rows, onOpenPage, onAsk }: { rows: SimpleRow[]; onOpenPage: (page: DashboardPageId) => void; onAsk: (context: string) => void }) {
  return (
    <section className="cd-command-section cd-launch-readiness">
      <div className="cd-command-section__head">
        <h2>Launch Readiness</h2>
        <button type="button" onClick={() => onOpenPage('integrations')}>View all<ChevronRight size={15} /></button>
      </div>
      <article className="cd-card cd-launch-readiness-card">
        {rows.map((row, index) => (
          <button
            type="button"
            className={`cd-launch-step tone-${row.tone || 'neutral'}`}
            key={row.id}
            onClick={() => (row.id === 'connect-pos' ? onOpenPage('integrations') : onAsk(row.title))}
          >
            <span className="cd-launch-step__index">{index + 1}</span>
            <span>
              <strong>{row.title}</strong>
              <small>{row.subtitle}</small>
            </span>
            <em>{row.status}</em>
          </button>
        ))}
      </article>
    </section>
  )
}

function CommandCenterPage({
  data,
  openDetail,
  onAsk,
  onOpenPage
}: {
  data: DashboardData
  openDetail: (item: DrawerItem) => void
  onAsk: (context: string) => void
  onOpenPage: (page: DashboardPageId) => void
}) {
  const briefRows = data.commandCenter.decisions.length
    ? data.commandCenter.decisions.slice(0, 3).map((decision) => ({
      icon: decision.category.toLowerCase().includes('reorder') ? PackageCheck : Sparkles,
      title: decision.title,
      detail: decision.why
    }))
    : [
      {
        icon: Sparkles,
        title: 'No live recommendations yet',
        detail: 'Coodra will surface the highest-impact actions once backend signals are available.'
      },
      {
        icon: ShieldCheck,
        title: 'Vendor data readiness',
        detail: 'Supplier, lead-time, MOQ, and pack-size details can be added during PO review.'
      }
    ]
  const readinessRows = buildLaunchReadinessRows(data)
  const showLaunchReadiness = readinessRows.some((row) => row.tone !== 'green')
  return (
    <div className="cd-command-page">
      <section className="cd-command-overview">
        <article className="cd-card cd-overview-card">
          <div className="cd-card-title-row"><h2>AI Morning Brief</h2></div>
          <div className="cd-brief-list">
            {briefRows.map((row) => <CommandBriefRow icon={row.icon} title={row.title} detail={row.detail} onAsk={onAsk} key={row.title} />)}
          </div>
        </article>
        <ImpactMap metrics={data.commandCenter.metrics} />
      </section>
      {showLaunchReadiness ? <LaunchReadinessPanel rows={readinessRows} onOpenPage={onOpenPage} onAsk={onAsk} /> : null}
      <CommandPlanTable decisions={data.commandCenter.decisions} openDetail={openDetail} />
      <BusinessPulse metrics={data.commandCenter.metrics} />
      <CommandOutcomes metrics={data.commandCenter.outcomes} profitSeries={data.commandCenter.profitSeries} />
    </div>
  )
}

const pageMetricIcons: Record<string, Array<typeof Sparkles>> = {
  decisions: [ClipboardList, TrendingUp, Check, BarChart3],
  merchandise: [Target, Star, ShieldCheck, ClipboardList],
  operations: [Package, PackageCheck, ClipboardList, Truck],
  intelligence: [TrendingUp, ShieldCheck, Target, BarChart3],
  workspace: [PackageCheck, Zap, BarChart3, ShieldCheck]
}

function ReferenceMetricGrid({ metrics, page }: { metrics: MetricCardData[]; page: keyof typeof pageMetricIcons }) {
  return (
    <section className="cd-ref-overview">
      {metrics.slice(0, 4).map((metric, index) => {
        const Icon = pageMetricIcons[page][index] || Sparkles
        const meta = metric.change === 'Live backend' ? metric.detail : (metric.change || metric.detail || 'Needs data')
        const isDown = String(meta || '').trim().startsWith('-') || metric.tone === 'red'
        const deltaText = String(meta || '').trim().replace(/^[+-]\s*/, '')
        const signedMeta = /^[+-]/.test(String(meta || '').trim())
        const decisionContext = metric.change === 'Live backend'
          ? metric.detail || 'Live backend'
          : metric.change || metric.detail || 'Needs data'
        return (
          <article className={`cd-card cd-ref-metric ${moneyToneClass(metric.tone)}`} key={metric.label}>
            <span className="cd-ref-metric__icon"><Icon size={22} /></span>
            <div>
              <span className="cd-ref-metric-title">{metric.label}{page === 'decisions' || page === 'operations' ? <CircleHelp size={12} /> : null}</span>
              <strong>{metric.value}</strong>
              {page === 'decisions'
                ? (
                  <small className="cd-ref-metric-meta">
                    {signedMeta ? <b className={isDown ? 'is-down' : 'is-up'}>{isDown ? '↓' : '↑'} {deltaText}</b> : null}
                    <em>{decisionContext}</em>
                  </small>
                  )
                : page === 'operations'
                  ? (
                    <small className="cd-ref-metric-meta cd-ref-metric-meta--ops">
                      <em>{metric.change || metric.detail || 'Live backend'}</em>
                    </small>
                    )
                  : <small className={isDown ? 'is-down' : ''}>{isDown ? '↓' : '↑'} {meta}</small>}
            </div>
            {metric.spark ? <MiniSparkline values={metric.spark} /> : null}
          </article>
        )
      })}
    </section>
  )
}

function ReferenceSection({ title, children, action, onAction }: { title: string; children: React.ReactNode; action?: string; onAction?: () => void }) {
  return (
    <section className="cd-ref-section">
      <div className="cd-ref-section__head">
        <h2>{title}</h2>
        {action ? <button type="button" onClick={onAction}>{action}<ChevronRight size={15} /></button> : null}
      </div>
      {children}
    </section>
  )
}

function ReferenceCardTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="cd-ref-card-title">
      <h3>{title}<CircleHelp size={14} /></h3>
      {action ? <button type="button" onClick={onAction}>{action}<ExternalLink size={13} /></button> : null}
    </div>
  )
}

function ApprovalVelocityChart({ data }: { data: DashboardData['decisions']['approvalVelocity'] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const source = data.chart.length
    ? data.chart
    : [
      { month: 'Now', velocityHours: 0, accuracyPct: null }
    ]
  const maxVelocity = Math.max(12, ...source.map((point) => point.velocityHours || 0))
  const chartMonths = source.map((point, index) => {
    const x = 32 + (index * (248 / Math.max(source.length - 1, 1)))
    const velocityY = 92 - ((point.velocityHours || 0) / maxVelocity) * 72
    const accuracyY = point.accuracyPct == null ? 68 : 92 - (point.accuracyPct / 100) * 72
    return {
      month: point.month,
      x,
      velocityY,
      accuracyY,
      velocity: point.velocityHours ? `${Number(point.velocityHours.toFixed(1))}h` : 'Measuring',
      accuracy: point.accuracyPct == null ? 'Measuring' : `${Math.round(point.accuracyPct)}%`
    }
  })
  const activeMonth = activeIndex === null ? null : chartMonths[activeIndex]
  const velocityPoints = chartMonths.map(({ x, velocityY }) => [x, velocityY])
  const accuracyPoints = chartMonths.map(({ x, accuracyY }) => [x, accuracyY])
  const pathFor = (points: number[][]) => points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x} ${y}`).join(' ')
  const setActiveFromClientX = (clientX: number, element: HTMLElement | SVGElement) => {
    const rect = element.getBoundingClientRect()
    if (!rect.width) return
    const viewX = ((clientX - rect.left) / rect.width) * 340
    const nearestIndex = chartMonths.reduce((closest, point, index) => (
      Math.abs(point.x - viewX) < Math.abs(chartMonths[closest].x - viewX) ? index : closest
    ), 0)
    setActiveIndex(nearestIndex)
  }

  return (
    <div
      className="cd-approval-chart"
      aria-label="Approval velocity and prediction accuracy chart"
      onMouseLeave={() => setActiveIndex(null)}
      onTouchStart={(event) => setActiveFromClientX(event.touches[0].clientX, event.currentTarget)}
      onTouchMove={(event) => setActiveFromClientX(event.touches[0].clientX, event.currentTarget)}
      onTouchEnd={() => window.setTimeout(() => setActiveIndex(null), 900)}
    >
      <div className="cd-approval-chart__legend">
        <span><i className="is-teal" />Velocity (hrs)</span>
        <span><i className="is-dashed" />Accuracy (%)</span>
      </div>
      {activeMonth ? (
        <div
          className="cd-approval-tooltip"
          style={{
            left: `clamp(82px, ${(activeMonth.x / 340) * 100}%, calc(100% - 82px))`,
            top: `${20 + (Math.min(activeMonth.velocityY, activeMonth.accuracyY) / 128) * 108}px`
          }}
        >
          <strong>{activeMonth.month}</strong>
          <span><i className="is-teal" />Velocity <b>{activeMonth.velocity}</b></span>
          <span><i className="is-dashed" />Accuracy <b>{activeMonth.accuracy}</b></span>
        </div>
      ) : null}
      <svg viewBox="0 0 340 128" role="img" aria-label="Velocity and accuracy by month">
        <g className="cd-approval-grid">
          {[20, 44, 68, 92].map((y) => <line key={`h-${y}`} x1="28" y1={y} x2="304" y2={y} />)}
          {chartMonths.map(({ x }) => <line key={`v-${x}`} x1={x} y1="18" x2={x} y2="96" />)}
        </g>
        <g className="cd-approval-axis cd-approval-axis--left">
          <text x="4" y="24">12h</text>
          <text x="8" y="48">8h</text>
          <text x="8" y="72">4h</text>
          <text x="12" y="96">0h</text>
        </g>
        <g className="cd-approval-axis cd-approval-axis--right">
          <text x="312" y="24">100%</text>
          <text x="317" y="48">75%</text>
          <text x="317" y="72">50%</text>
          <text x="317" y="96">25%</text>
        </g>
        {data.chart.length ? <path className="cd-approval-line cd-approval-line--accuracy" d={pathFor(accuracyPoints)} /> : null}
        {data.chart.length ? <path className="cd-approval-line cd-approval-line--velocity" d={pathFor(velocityPoints)} /> : null}
        {chartMonths.map((point, index) => (
          <g
            className={activeIndex === index ? 'cd-approval-point is-active' : 'cd-approval-point'}
            key={point.month}
            tabIndex={0}
            role="button"
            aria-label={`${point.month}: velocity ${point.velocity}, accuracy ${point.accuracy}`}
            onFocus={() => setActiveIndex(index)}
            onBlur={() => setActiveIndex(null)}
            onMouseEnter={() => setActiveIndex(index)}
            onClick={() => setActiveIndex(index)}
          >
            <rect className="cd-approval-hit-area" x={point.x - 22} y="14" width="44" height="108" rx="6" />
            <circle className="cd-approval-dot is-accuracy" cx={point.x} cy={point.accuracyY} r="2.6" />
            <circle className="cd-approval-dot is-velocity" cx={point.x} cy={point.velocityY} r="2.8" />
          </g>
        ))}
        <g className="cd-approval-months">
          {chartMonths.map((point) => <text key={point.month} x={point.x} y="122">{point.month}</text>)}
        </g>
      </svg>
    </div>
  )
}

function currentPlanCode(data: DashboardData) {
  return data.billing?.planCode || 'free'
}

function canUsePlanFeature(data: DashboardData, requiredPlan: PlanKey) {
  return planIncludes(currentPlanCode(data), requiredPlan)
}

function lockedFeatureDescription(feature: 'forecasting' | 'outcome_tracking' | 'automation' | 'custom_alerts') {
  const descriptions = {
    forecasting: 'Upgrade to forecast demand, spot trend changes, and plan inventory before stockouts happen.',
    outcome_tracking: 'Measure whether approved recommendations improved revenue, margin, and inventory health.',
    automation: 'Turn repeatable approval workflows into controlled automations with guardrails.',
    custom_alerts: 'Create custom thresholds and notification rules for the operational signals that matter most.'
  }
  return descriptions[feature]
}

function DecisionOutcomesStrip({ metrics }: { metrics: MetricCardData[] }) {
  return (
    <div className="cd-decision-outcomes-strip">
      {metrics.map((metric) => {
        const meta = String(metric.change === 'Live backend' ? metric.detail : (metric.change || metric.detail || '')).trim()
        const signedDelta = /^[+-]/.test(meta)
        const isNegativeDelta = meta.startsWith('-')
        const deltaText = signedDelta ? meta.replace(/^[+-]\s*/, '') : meta
        return (
          <div className="cd-decision-outcomes-metric" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <div className="cd-decision-outcomes-meta">
              <em>vs last 30 days</em>
              {meta ? (
                <small className={signedDelta ? `cd-delta ${isNegativeDelta ? 'is-negative' : 'is-positive'}` : 'cd-readiness-note'}>
                  {signedDelta ? <span aria-hidden="true">{isNegativeDelta ? '↓' : '↑'}</span> : null}
                  {deltaText}
                </small>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function formatDashboardDate(value?: string) {
  const raw = String(value || '').trim()
  if (!raw) return 'Not decided'
  const time = Date.parse(raw)
  if (!Number.isFinite(time)) return raw
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(time))
}

function DecisionsHistoryTable({ decisions }: { decisions: MerchantDecision[] }) {
  const rows = decisions.filter((decision) => ['approved', 'executed', 'measured', 'dismissed'].includes(decision.status)).slice(0, 4)
  const tableRows = rows.map((decision) => ({
      id: decision.id,
      title: decision.title,
      category: decision.category,
      impact: decision.impact,
      status: decision.status === 'executed' || decision.status === 'measured' ? 'Implemented' : decision.status.replace(/^./, (s) => s.toUpperCase()),
      decided: formatDashboardDate(decision.decidedAt)
    }))

  return (
    <div className="cd-decision-history-table">
      <div className="cd-decision-history-head">
        <span>Decision</span>
        <span>Type</span>
        <span>Status</span>
        <span>Impact</span>
        <span>Decided</span>
        <span />
      </div>
      {tableRows.length ? tableRows.map((row) => (
        <div className="cd-decision-history-row" key={row.id}>
          <strong>{row.title}</strong>
          <StatusPill tone="neutral">{row.category}</StatusPill>
          <span className="cd-history-status"><i />{row.status}</span>
          <b>{row.impact}</b>
          <time>{row.decided}</time>
          <ChevronRight size={17} />
        </div>
      )) : <div className="cd-empty-row">Approved and executed decisions will appear here once clients start acting on recommendations.</div>}
    </div>
  )
}

function DismissedReasonsTable({ rows }: { rows: SimpleRow[] }) {
  return (
    <div className="cd-dismissed-table">
      <div className="cd-dismissed-head">
        <span>Reason</span>
        <span>Count</span>
        <span>% of Dismissed</span>
      </div>
      {rows.length ? rows.map((row) => {
        const percent = Number(String(row.detail || '0').replace('%', '')) || 0
        return (
        <div className="cd-dismissed-row" key={row.id}>
          <span>{row.title}</span>
          <b>{row.metric}</b>
          <div><em>{row.detail}</em><i style={{ width: `${percent * 2.1}px` }} /></div>
        </div>
        )
      }) : <div className="cd-empty-row">Dismissal reasons will appear after users dismiss recommendations with a reason.</div>}
    </div>
  )
}

function RefRowIcon({ icon: Icon, tone = 'neutral' }: { icon: typeof Sparkles; tone?: string }) {
  return <span className={`cd-ref-row-icon ${moneyToneClass(tone)}`}><Icon size={18} /></span>
}

function DecisionReferenceTable({ decisions, onOpen }: { decisions: MerchantDecision[]; onOpen: (item: DrawerItem) => void }) {
  const [activeTab, setActiveTab] = useState('All')
  const visibleDecisions = activeTab === 'All'
    ? decisions
    : decisions.filter((decision) => decision.category.toLowerCase().includes(activeTab.toLowerCase().replace(/s$/, '')))
  return (
    <div className="cd-ref-card cd-ref-table-card">
      <div className="cd-ref-tabs">
        {['All', 'Pricing', 'Promotions', 'Reorders', 'Catalog'].map((tab) => <button className={activeTab === tab ? 'is-active' : ''} type="button" key={tab} onClick={() => setActiveTab(tab)}>{tab}</button>)}
        <span>{visibleDecisions.length} items</span>
      </div>
      <table className="cd-ref-table">
        <thead><tr><th>Action</th><th>Type</th><th>Expected Impact</th><th>Confidence</th><th>Urgency</th><th /></tr></thead>
        <tbody>
          {visibleDecisions.length ? visibleDecisions.slice(0, 5).map((decision) => (
            <tr key={decision.id}>
              <td><button className="cd-ref-action-cell" type="button" onClick={() => onOpen(decisionToDrawer(decision))}><strong>{decision.title}</strong></button></td>
              <td><StatusPill tone="neutral">{decision.category}</StatusPill></td>
              <td><strong className="cd-positive-number">{decision.impact}</strong></td>
              <td><span className={`cd-confidence-label is-${decision.confidence >= 85 ? 'high' : 'medium'}`}>{decision.confidence >= 85 ? 'High' : 'Medium'}</span></td>
              <td><span className={`cd-dot-label is-${decision.urgency.toLowerCase()}`}>{decision.urgency}</span></td>
              <td><div className="cd-plan-actions"><button className="cd-small-primary" type="button" onClick={() => onOpen({ ...decisionToDrawer(decision), primaryAction: 'Approve decision' })}>Review</button><button className="cd-small-ghost" type="button" onClick={() => onOpen({ ...decisionToDrawer(decision), primaryAction: 'Dismiss recommendation', secondaryAction: 'Ask Coodra' })}>Dismiss</button></div></td>
            </tr>
          )) : <tr><td colSpan={6}><div className="cd-empty-row">No recommendations are waiting for review.</div></td></tr>}
        </tbody>
      </table>
    </div>
  )
}

function MerchandiseOpportunityReference({ rows, onOpen }: { rows: SimpleRow[]; onOpen: (row: SimpleRow) => void }) {
  return (
    <div className="cd-ref-card cd-ref-table-card cd-merch-opportunity-card">
      <ReferenceCardTitle title="Top Product Opportunities" />
      <table className="cd-ref-table">
        <thead><tr><th>Product</th><th>Role</th><th>Sell-through <CircleHelp size={12} /></th><th>Margin <CircleHelp size={12} /></th><th>Recommendation</th><th /></tr></thead>
        <tbody>
          {rows.length ? rows.slice(0, 4).map((row) => {
            return (
            <tr key={row.id}>
              <td><button className="cd-product-cell" type="button" onClick={() => onOpen(row)}><span><strong>{row.title}</strong><small>{row.id}</small></span></button></td>
              <td><StatusPill tone={row.tone}>{row.subtitle || row.status || 'Opportunity'}</StatusPill></td>
              <td><span className="cd-opportunity-metric"><strong>{row.metric || 'Measuring'}</strong><small>Backend signal</small></span></td>
              <td><span className="cd-opportunity-metric"><strong>Measuring</strong><small>Needs margin data</small></span></td>
              <td>{row.detail || 'Review product opportunity.'}</td>
              <td><button className="cd-small-ghost" type="button" onClick={() => onOpen(row)}>View details</button></td>
            </tr>
            )
          }) : <tr><td colSpan={6}><div className="cd-empty-row">Product opportunities will appear after SKU role or pricing signals are available.</div></td></tr>}
        </tbody>
      </table>
    </div>
  )
}

function numericSkuCount(value?: string) {
  const match = String(value || '').match(/[\d,.]+/)
  return match ? Number(match[0].replace(/,/g, '')) : 0
}

function merchandiseRoleTone(row: SimpleRow) {
  const label = row.title.toLowerCase()
  if (label.includes('traffic')) return 'amber'
  if (label.includes('dead')) return 'red'
  if (label.includes('margin')) return 'green'
  return row.tone || 'teal'
}

function MerchandiseRoleBreakdown({ rows }: { rows: SimpleRow[] }) {
  const total = rows.reduce((sum, row) => sum + numericSkuCount(row.metric), 0)
  const safeTotal = total || 1
  const colorStops = rows
    .slice(0, 4)
    .reduce<{ stops: string[]; cursor: number }>((acc, row) => {
      const tone = merchandiseRoleTone(row)
      const colors: Record<string, string> = {
        teal: '#11b8aa',
        green: '#42c99a',
        blue: '#3b82f6',
        amber: '#f59e0b',
        red: '#ef4444'
      }
      const value = numericSkuCount(row.metric)
      const next = acc.cursor + (value / safeTotal) * 100
      acc.stops.push(`${colors[tone] || '#11b8aa'} ${acc.cursor}% ${next}%`)
      acc.cursor = next
      return acc
    }, { stops: [], cursor: 0 })

  return (
    <article className="cd-ref-card cd-merch-role-breakdown">
      <ReferenceCardTitle title="Role Breakdown" />
      <div className="cd-merch-role-breakdown__body">
        <div className="cd-merch-donut" style={{ background: colorStops.stops.length ? `conic-gradient(${colorStops.stops.join(', ')})` : 'var(--cd-merch-donut-empty, #eef2f6)' }}>
          <span><strong>{total}</strong><small>Total SKUs</small></span>
        </div>
        <div className="cd-merch-role-legend">
          {rows.length ? rows.slice(0, 4).map((row) => {
            const value = numericSkuCount(row.metric)
            const percent = Math.round((value / safeTotal) * 100)
            return (
              <div className={`cd-merch-role-legend__row ${moneyToneClass(merchandiseRoleTone(row))}`} key={row.id}>
                <i />
                <strong>{row.title}</strong>
                <span>{percent}%</span>
                <b>{row.metric}</b>
              </div>
            )
          }) : <div className="cd-empty-row">SKU roles will appear once role classification data is available.</div>}
        </div>
      </div>
    </article>
  )
}

function MerchandiseCatalogTasks({ rows, onOpen, onAsk }: { rows: SimpleRow[]; onOpen: (row: SimpleRow) => void; onAsk: (context: string) => void }) {
  const icons = [Tag, Image, FileText]
  const openCatalogTasks = () => {
    if (rows[0]) {
      onOpen(rows[0])
      return
    }
    onAsk('Catalog optimization tasks')
  }

  return (
    <article className="cd-ref-card cd-merch-catalog-card">
      <ReferenceCardTitle title="Catalog Optimization Tasks" />
      <div className="cd-merch-catalog-tasks">
        {rows.length ? rows.map((row, index) => {
          const Icon = icons[index % icons.length]
          return (
            <span className={moneyToneClass(row.tone)} key={row.id}>
              <RefRowIcon icon={Icon} tone={row.tone} />
              <span className="cd-merch-catalog-copy">
                <strong>{(row.metric || '0').replace(/\s*SKUs?/i, '')}</strong>
                <small>{row.title}</small>
                <b>{row.status || 'Open'}</b>
              </span>
            </span>
          )
        }) : <div className="cd-empty-row">No catalog readiness tasks are open.</div>}
        <button className="cd-merch-inline-link" type="button" onClick={openCatalogTasks}>View all tasks<ChevronRight size={15} /></button>
      </div>
    </article>
  )
}

function MerchandiseWatchlist({ rows, onOpen, onAsk }: { rows: SimpleRow[]; onOpen: (row: SimpleRow) => void; onAsk: (context: string) => void }) {
  const openWatchlist = () => {
    if (rows[0]) {
      onOpen(rows[0])
      return
    }
    onAsk('Dead stock watchlist')
  }

  return (
    <article className="cd-ref-card cd-merch-watchlist-card">
      <ReferenceCardTitle title="Dead Stock Watchlist" />
      <div className="cd-merch-watchlist">
        {rows.length ? rows.slice(0, 3).map((row) => {
          return (
          <div className={`cd-merch-watchlist__item ${moneyToneClass(row.tone)}`} key={row.id}>
            <div>
              <strong>{row.title}</strong>
              <small>{row.subtitle || row.status || 'Readiness signal'}</small>
              <b>{row.metric || row.detail || 'Review'}</b>
            </div>
          </div>
          )
        }) : <div className="cd-empty-row">Dead-stock and promotion watchlists will appear when backend signals are available.</div>}
        <button className="cd-merch-inline-link" type="button" onClick={openWatchlist}>View all<ChevronRight size={15} /></button>
      </div>
    </article>
  )
}

function OperationsReferenceTable({ rows, onOpen, onAsk }: { rows: SimpleRow[]; onOpen: (row: SimpleRow) => void; onAsk: (context: string) => void }) {
  return (
    <div className="cd-ref-card cd-ref-table-card cd-operations-reorder-card">
      <table className="cd-ref-table">
        <thead><tr><th>SKU / Product</th><th>On Hand</th><th>Days of Supply <CircleHelp size={12} /></th><th>Reorder Qty</th><th>Vendor Data</th><th>Risk <CircleHelp size={12} /></th><th>Action</th></tr></thead>
        <tbody>
          {rows.length ? rows.map((row) => {
            const availableMatch = String(row.subtitle || '').match(/Available\s+([-\d,.]+)/i)
            const thresholdMatch = String(row.subtitle || '').match(/threshold\s+([-\d,.]+)/i)
            const available = availableMatch?.[1] || '0'
            const threshold = thresholdMatch?.[1] || row.metric || 'Review'
            const riskTone = row.tone === 'red' ? 'red' : 'amber'
            return (
            <tr key={row.id}>
              <td><button className="cd-product-cell" type="button" onClick={() => onOpen(row)}><span><strong>{row.detail || row.title}</strong><small>{row.title}</small></span></button></td>
              <td>{available}</td>
              <td><strong className={riskTone === 'amber' ? 'cd-warning-number' : 'cd-danger-number'}>Unknown</strong></td>
              <td>{threshold}</td>
              <td>Missing supplier</td>
              <td><span className={`cd-risk-pill is-${riskTone}`}><i />{riskTone === 'red' ? 'High' : 'Medium'}</span></td>
              <td><button className="cd-small-ghost" type="button" onClick={() => onOpen(row)}>Create PO</button></td>
            </tr>
            )
          }) : <tr><td colSpan={7}><div className="cd-empty-row">No inventory-backed reorder risks right now.</div></td></tr>}
        </tbody>
      </table>
      <button className="cd-ref-view-all" type="button" onClick={() => rows[0] ? onOpen(rows[0]) : onAsk('View all inventory SKUs')}>View all SKUs<ChevronRight size={15} /></button>
    </div>
  )
}

function OperationsVendorReadiness({ rows, onOpen, onAsk }: { rows: SimpleRow[]; onOpen: (item: DrawerItem) => void; onAsk: (context: string) => void }) {
  const reviewReadiness = () => {
    if (rows[0]) {
      onOpen(rowToDrawer(rows[0], 'Vendor readiness'))
      return
    }
    onAsk('Review vendor readiness and missing supplier details')
  }

  return (
    <article className="cd-ref-card cd-ops-scorecard">
      <ReferenceCardTitle title="Vendor Watch" />
      <table className="cd-ops-compact-table">
        <thead><tr><th>Readiness Check</th><th>Items</th><th>Status</th><th>Why it matters</th></tr></thead>
        <tbody>
          <tr className={rows.length ? 'is-warning' : ''}>
              <td>Vendor data incomplete</td>
              <td>{rows.length}</td>
              <td>{rows.length ? 'Improve confidence' : 'No reorder risks'}</td>
              <td>Add vendor details during PO review.</td>
            </tr>
        </tbody>
      </table>
      <button className="cd-ref-view-all" type="button" onClick={reviewReadiness}>Review readiness<ChevronRight size={15} /></button>
    </article>
  )
}

function OperationsPoWorkflow({ rows, onOpen, onAsk }: { rows: SimpleRow[]; onOpen: (item: DrawerItem) => void; onAsk: (context: string) => void }) {
  const grouped = rows.reduce<Record<string, { status: string; pos: number; value: number }>>((acc, row) => {
    const status = row.status || row.title || 'Draft'
    const current = acc[status] || { status, pos: 0, value: 0 }
    current.pos += 1
    current.value += Number(String(row.metric || '0').replace(/[^\d.-]/g, '')) || 0
    acc[status] = current
    return acc
  }, {})
  const workflow = Object.values(grouped)
  const workflowToDrawer = (row: { status: string; pos: number; value: number }): DrawerItem => ({
    title: `${row.status} purchase orders`,
    eyebrow: 'PO workflow',
    summary: `${row.pos} purchase order${row.pos === 1 ? '' : 's'} in ${row.status.toLowerCase()} status.`,
    why: 'Coodra can summarize this workflow status without creating or updating purchase orders.',
    impact: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(row.value),
    status: row.status,
    details: [
      { label: 'POs', value: String(row.pos) },
      { label: 'Value', value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(row.value) },
      { label: 'Source', value: 'Purchase order workflow' }
    ],
    primaryAction: 'Ask Coodra',
    secondaryAction: 'Review workflow',
    askContext: `${row.status} purchase orders`
  })
  const openAllPos = () => {
    if (workflow[0]) {
      onOpen(workflowToDrawer(workflow[0]))
      return
    }
    onAsk('View all purchase orders')
  }

  return (
    <article className="cd-ref-card cd-ops-po-card">
      <ReferenceCardTitle title="PO Workflow" />
      <table className="cd-ops-compact-table">
        <thead><tr><th>Status</th><th>POs</th><th>Value</th><th>vs Last 7 Days <CircleHelp size={12} /></th><th>Action</th></tr></thead>
        <tbody>
          {workflow.length ? workflow.map((row) => (
            <tr key={row.status}>
              <td>{row.status}</td>
              <td>{row.pos}</td>
              <td>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(row.value)}</td>
              <td><span className="cd-ops-positive">Workflow-backed</span></td>
              <td><button className="cd-small-ghost" type="button" onClick={() => onOpen(workflowToDrawer(row))}>View</button></td>
            </tr>
          )) : <tr><td colSpan={5}><div className="cd-empty-row">Purchase orders will appear once reorder workflows create drafts.</div></td></tr>}
        </tbody>
      </table>
      <button className="cd-ref-view-all" type="button" onClick={openAllPos}>View all POs<ChevronRight size={15} /></button>
    </article>
  )
}

function OperationsTransferCard({ row, onOpen, onAsk }: { row?: SimpleRow; onOpen: (row: SimpleRow) => void; onAsk: (context: string) => void }) {
  return (
    <article className="cd-ref-card cd-ops-stat-card cd-ops-transfer-card">
      <ReferenceCardTitle title="Transfer Readiness" />
      <div className="cd-ops-stat-grid">
        <span><strong>{row?.metric || 'Not active'}</strong><small>Multi-location data</small></span>
        <span><strong>{row ? 'Ready' : 'Missing'}</strong><small>Location inventory</small></span>
      </div>
      <button className="cd-small-ghost" type="button" onClick={() => row ? onOpen(row) : onAsk('Review transfer readiness and missing location inventory')}>Review readiness</button>
    </article>
  )
}

function OperationsLocationsCard({ onAsk }: { onAsk: (context: string) => void }) {
  return (
    <article className="cd-ref-card cd-ops-stat-card cd-ops-locations-card">
      <ReferenceCardTitle title="Locations" />
      <div className="cd-ops-stat-grid">
        <span><strong>Not active</strong><small>Location-level data</small></span>
        <span><strong>Missing</strong><small>Coverage snapshots</small></span>
      </div>
      <button className="cd-small-ghost" type="button" onClick={() => onAsk('View locations and location-level inventory readiness')}>View Locations</button>
    </article>
  )
}

function OperationsSupplierAlerts({ onAsk }: { onAsk: (context: string) => void }) {
  return (
    <article className="cd-ref-card cd-ops-alert-card">
      <ReferenceCardTitle title="Supply Risk" />
      <div className="cd-ops-alert-list">
        <div className="cd-ops-alert is-amber"><i /><span>Supply-risk alerts need verified PO or supplier history.</span><time>Readiness</time></div>
      </div>
      <button className="cd-ref-view-all" type="button" onClick={() => onAsk('Improve supplier data for supply-risk alerts')}>Improve data<ChevronRight size={15} /></button>
    </article>
  )
}

const CORE_POS_INVENTORY_PROVIDERS = ['Shopify', 'Square', 'Clover', 'Lightspeed', 'WooCommerce', 'Loyverse']
const FUTURE_PAYMENT_PROVIDERS = ['Moneris', 'Global Payments']

function providerKey(provider: string) {
  return provider.toLowerCase().replace(/\s+/g, '')
}

function isFuturePaymentProvider(provider: string) {
  return FUTURE_PAYMENT_PROVIDERS.some((name) => providerKey(name) === providerKey(provider))
}

function getDisplayIntegrations(integrations: IntegrationCard[]) {
  return [...CORE_POS_INVENTORY_PROVIDERS, ...FUTURE_PAYMENT_PROVIDERS].map((provider) => {
    const existing = integrations.find((integration) => integration.provider.toLowerCase() === provider.toLowerCase())
    if (existing) {
      return existing
    }
    return {
      provider,
      description: `${provider} integration`,
      status: 'Not connected' as const,
      lastSync: undefined,
      accent: 'neutral'
    } as IntegrationCard
  })
}

function DecisionsPage({ data, openDetail, onAsk }: { data: DashboardData; openDetail: (item: DrawerItem) => void; onAsk: (context: string) => void }) {
  return (
    <div className="cd-ref-page cd-ref-page--decisions">
      <ReferenceMetricGrid metrics={data.decisions.metrics} page="decisions" />
      <ReferenceSection title="Decision Queue">
        <DecisionReferenceTable decisions={data.decisions.queue} onOpen={openDetail} />
      </ReferenceSection>
      <ReferenceSection title="Performance">
        <div className="cd-ref-two">
          <article className="cd-ref-card cd-decision-outcomes-card"><ReferenceCardTitle title="Decision Outcomes" /><DecisionOutcomesStrip metrics={data.commandCenter.outcomes.concat(data.decisions.metrics.slice(2, 3)).slice(0, 4)} /></article>
          <article className="cd-ref-card cd-approval-card"><ReferenceCardTitle title="Approval Velocity / Prediction Accuracy" /><div className="cd-ref-chart-row"><div><small>Median Time to Approve</small><strong>{data.decisions.approvalVelocity.medianHours}</strong><div className="cd-approval-meta"><em>approval timestamps</em><small>{data.decisions.approvalVelocity.velocityChange}</small></div></div><div><small>Prediction Accuracy</small><strong>{data.decisions.approvalVelocity.predictionAccuracy}</strong><div className="cd-approval-meta"><em>outcome snapshots</em><small>{data.decisions.approvalVelocity.accuracyChange}</small></div></div><ApprovalVelocityChart data={data.decisions.approvalVelocity} /></div></article>
        </div>
      </ReferenceSection>
      <ReferenceSection title="History">
        <div className="cd-ref-two">
          <article className="cd-ref-card cd-decision-history-card"><ReferenceCardTitle title="Recent Decisions" action="View all" onAction={() => onAsk('View all recent decisions')} /><DecisionsHistoryTable decisions={data.decisions.queue} /></article>
          <article className="cd-ref-card cd-decision-history-card"><ReferenceCardTitle title="Dismissed Reasons" action="View all" onAction={() => onAsk('Analyze all dismissed recommendation reasons')} /><DismissedReasonsTable rows={data.decisions.dismissedReasons} /></article>
        </div>
      </ReferenceSection>
    </div>
  )
}

function MerchandisePage({ data, openDetail, onAsk }: { data: DashboardData; openDetail: (item: DrawerItem) => void; onAsk: (context: string) => void }) {
  const roleTotal = data.merchandise.roleMix.reduce((sum, row) => sum + (Number(String(row.metric || '').replace(/[^0-9.-]/g, '')) || 0), 0)
  const openMerchandiseRow = (row: SimpleRow) => openDetail(rowToDrawer(row, 'Catalog quality'))
  return (
    <div className="cd-ref-page cd-ref-page--merchandise">
      <ReferenceMetricGrid metrics={data.merchandise.metrics} page="merchandise" />
      <ReferenceSection title="Assortment Health">
        <div className="cd-ref-two">
          <MerchandiseRoleBreakdown rows={data.merchandise.roleMix} />
          <article className="cd-ref-card"><ReferenceCardTitle title="SKU Roles Summary" /><div className="cd-role-grid">{data.merchandise.roleMix.slice(0, 4).map((row, index) => <RoleCard key={row.id} row={row} index={index} total={roleTotal} />)}</div></article>
        </div>
      </ReferenceSection>
      <ReferenceSection title="Opportunities">
        <MerchandiseOpportunityReference rows={data.merchandise.opportunities} onOpen={(row) => openDetail(rowToDrawer(row, 'Product opportunity'))} />
      </ReferenceSection>
      <ReferenceSection title="Catalog Quality">
        <div className="cd-ref-two">
          <MerchandiseCatalogTasks rows={data.merchandise.catalogTasks} onOpen={openMerchandiseRow} onAsk={onAsk} />
          <MerchandiseWatchlist rows={data.merchandise.highlights} onOpen={openMerchandiseRow} onAsk={onAsk} />
        </div>
      </ReferenceSection>
    </div>
  )
}

function OperationsPage({ data, openDetail, onAsk }: { data: DashboardData; openDetail: (item: DrawerItem) => void; onAsk: (context: string) => void }) {
  const openOperationsRow = (row: SimpleRow) => openDetail(rowToDrawer(row, 'Operations readiness'))
  return (
    <div className="cd-ref-page cd-ref-page--operations">
      <ReferenceMetricGrid metrics={data.operations.metrics} page="operations" />
      <ReferenceSection title="Inventory & Reorder Intelligence">
        <OperationsReferenceTable rows={data.operations.reorders} onOpen={(row) => openDetail(rowToDrawer(row, 'Inventory and reorder'))} onAsk={onAsk} />
      </ReferenceSection>
      <ReferenceSection title="Supply Readiness">
        <div className="cd-ref-two">
          <OperationsVendorReadiness rows={data.operations.reorders} onOpen={openDetail} onAsk={onAsk} />
          <OperationsPoWorkflow rows={data.operations.purchaseOrders} onOpen={openDetail} onAsk={onAsk} />
        </div>
      </ReferenceSection>
      <ReferenceSection title="Execution">
        <div className="cd-ref-three">
          <OperationsTransferCard row={data.operations.transfers[0]} onOpen={openOperationsRow} onAsk={onAsk} />
          <OperationsLocationsCard onAsk={onAsk} />
          <OperationsSupplierAlerts onAsk={onAsk} />
        </div>
      </ReferenceSection>
    </div>
  )
}

function IntelligenceChartCard({ variant, series }: { variant: 'performance' | 'forecast'; series: number[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const isForecast = variant === 'forecast'
  const title = isForecast ? 'Forecasts' : 'Performance Over Time'
  const months = series.length
    ? series.map((_, index) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index] || `P${index + 1}`)
    : ['Now']
  const yLabels = isForecast ? ['$200M', '$160M', '$120M', '$80M', '$40M'] : ['$160M', '$140M', '$120M', '$100M', '$80M']
  const maxValue = Math.max(1, ...series)
  const pointList = (series.length ? series : [0]).map((value, index) => {
    const x = 8 + (index * (436 / Math.max((series.length || 1) - 1, 1)))
    const y = 92 - ((value || 0) / maxValue) * 70
    return `${x},${y}`
  })
  const primaryPoints = pointList.join(' ')
  const primaryLabel = isForecast ? 'Forecast Revenue' : 'Revenue'
  const primaryValues = (series.length ? series : [0]).map((value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value))
  const parsePoints = (points: string) => points.split(' ').map((pair) => {
    const [x, y] = pair.split(',').map(Number)
    return { x, y }
  })
  const primaryData = parsePoints(primaryPoints)
  const monthPoints = months.map((month, index) => ({
    month,
    x: primaryData[index]?.x || 0,
    y: primaryData[index]?.y || 0,
    primary: primaryValues[index]
  }))
  const activeMonth = activeIndex === null ? null : monthPoints[activeIndex]
  const setActiveFromClientX = (clientX: number, element: HTMLElement | SVGElement) => {
    const rect = element.getBoundingClientRect()
    if (!rect.width) return
    const viewX = ((clientX - rect.left) / rect.width) * 452
    const nearestIndex = monthPoints.reduce((closest, point, index) => (
      Math.abs(point.x - viewX) < Math.abs(monthPoints[closest].x - viewX) ? index : closest
    ), 0)
    setActiveIndex(nearestIndex)
  }

  return (
    <article
      className={`cd-ref-card cd-intel-chart-card ${isForecast ? 'is-forecast' : ''}`}
      onMouseLeave={() => setActiveIndex(null)}
      onTouchEnd={() => window.setTimeout(() => setActiveIndex(null), 900)}
    >
      <div className="cd-intel-card-head">
        <h3>{title}<CircleHelp size={13} /></h3>
        <div className="cd-intel-legend">
          <span><i />{isForecast ? 'Forecast Revenue ($M)' : 'Revenue ($M)'}</span>
        </div>
      </div>
      <div className="cd-intel-chart-body">
        <div className="cd-intel-y-axis">{yLabels.map((label) => <span key={label}>{label}</span>)}</div>
        <div
          className="cd-intel-plot"
          onTouchStart={(event) => setActiveFromClientX(event.touches[0].clientX, event.currentTarget)}
          onTouchMove={(event) => setActiveFromClientX(event.touches[0].clientX, event.currentTarget)}
        >
          {isForecast ? <span className="cd-intel-forecast-marker">Forecast →</span> : null}
          {activeMonth ? (
            <div
              className="cd-intel-tooltip"
              style={{
                left: `clamp(84px, ${(activeMonth.x / 452) * 100}%, calc(100% - 84px))`,
                top: `${Math.max(12, (activeMonth.y / 104) * 110)}px`
              }}
            >
              <strong>{activeMonth.month}</strong>
              <span><i />{primaryLabel}<b>{activeMonth.primary}</b></span>
            </div>
          ) : null}
          <svg viewBox="0 0 452 104" preserveAspectRatio="none" role="img" aria-label={`${title} by month`}>
            <line x1="4" x2="448" y1="18" y2="18" />
            <line x1="4" x2="448" y1="38" y2="38" />
            <line x1="4" x2="448" y1="58" y2="58" />
            <line x1="4" x2="448" y1="78" y2="78" />
            {isForecast ? <line className="cd-intel-vline" x1="82" x2="82" y1="8" y2="94" /> : null}
            {series.length ? <polyline className="cd-intel-line-primary" points={primaryPoints} /> : null}
            {primaryPoints.split(' ').map((pair) => {
              const [x, y] = pair.split(',')
              return <circle key={pair} cx={x} cy={y} r="2.5" />
            })}
            {monthPoints.map((point, index) => (
              <g
                className={activeIndex === index ? 'cd-intel-point is-active' : 'cd-intel-point'}
                key={point.month}
                tabIndex={0}
                role="button"
                aria-label={`${point.month}: ${primaryLabel} ${point.primary}`}
                onFocus={() => setActiveIndex(index)}
                onBlur={() => setActiveIndex(null)}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseMove={() => setActiveIndex(index)}
                onMouseOver={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
              >
                <rect x={point.x - 26} y="6" width="52" height="94" rx="6" />
              </g>
            ))}
          </svg>
          <div className="cd-intel-x-axis">{months.map((month) => <span key={month}>{month}</span>)}</div>
        </div>
      </div>
    </article>
  )
}

function IntelligenceSignalsTable() {
  return (
    <article className="cd-ref-card cd-intel-signals-card">
      <table className="cd-intel-signal-table">
        <thead><tr><th>Item</th><th>Signal</th><th>Impact</th><th>Recommendation</th><th /></tr></thead>
        <tbody>
          <tr><td colSpan={5}><div className="cd-empty-row cd-empty-row--centered">Forecast signals will appear after forecast accuracy snapshots are measured.</div></td></tr>
        </tbody>
      </table>
    </article>
  )
}

function IntelligenceReportsCard({ onAsk }: { onAsk: (context: string) => void }) {
  return (
    <article className="cd-ref-card cd-intel-report-card">
      <ReferenceCardTitle title="Reports & Exports" />
      <div className="cd-intel-report-list">
        <div className="cd-empty-row">Reports will appear after export jobs are generated.</div>
      </div>
      <button className="cd-ref-view-all" type="button" onClick={() => onAsk('View all reports and exports')}>View all reports<ChevronRight size={15} /></button>
    </article>
  )
}

function IntelligenceRecentExportsCard({ onAsk }: { onAsk: (context: string) => void }) {
  return (
    <article className="cd-ref-card cd-intel-export-card">
      <ReferenceCardTitle title="Recent Exports" />
      <div className="cd-intel-export-list">
        <div className="cd-empty-row">Export history will appear after reports are generated.</div>
      </div>
      <button className="cd-ref-view-all" type="button" onClick={() => onAsk('View recent exports')}>View all exports<ChevronRight size={15} /></button>
    </article>
  )
}

function IntelligenceSupplierHighlightsCard({ onAsk }: { onAsk: (context: string) => void }) {
  return (
    <article className="cd-ref-card cd-intel-supplier-card">
      <ReferenceCardTitle title="Data Readiness" />
      <table className="cd-intel-supplier-table">
        <thead><tr><th>Signal</th><th>Status</th><th>Next Step</th></tr></thead>
        <tbody>
          <tr><td>Supply intelligence</td><td>Not enabled</td><td>Add verified PO or supplier history</td></tr>
        </tbody>
      </table>
      <button className="cd-ref-view-all" type="button" onClick={() => onAsk('Review intelligence data readiness')}>Review readiness<ChevronRight size={15} /></button>
    </article>
  )
}

function IntelligencePage({ data, onAsk }: { data: DashboardData; onAsk: (context: string) => void }) {
  const hasForecasting = canUsePlanFeature(data, 'growth')
  return (
    <div className="cd-ref-page cd-ref-page--intelligence">
      <ReferenceMetricGrid metrics={data.intelligence.metrics} page="intelligence" />
      <ReferenceSection title="Performance Trends">
        {hasForecasting ? (
          <div className="cd-ref-two">
            <IntelligenceChartCard variant="performance" series={data.intelligence.performanceSeries} />
            <IntelligenceChartCard variant="forecast" series={data.intelligence.forecastSeries} />
          </div>
        ) : (
          <PlanUpgradeBlocker
            featureName="Forecasting"
            requiredPlan="growth"
            currentPlan={currentPlanCode(data)}
            description={lockedFeatureDescription('forecasting')}
            bullets={['Forward-looking demand planning', 'Forecast accuracy history', 'Trend-aware inventory planning']}
          />
        )}
      </ReferenceSection>
      <ReferenceSection title="Forecast Signals">
        {hasForecasting ? <IntelligenceSignalsTable /> : (
          <PlanUpgradeBlocker
            featureName="Forecast signals"
            requiredPlan="growth"
            currentPlan={currentPlanCode(data)}
            description="Upgrade to Growth to unlock measured forecast signals and forward-looking recommendations."
          />
        )}
      </ReferenceSection>
      <ReferenceSection title="Reports">
        <div className="cd-ref-three">
          <IntelligenceReportsCard onAsk={onAsk} />
          <IntelligenceRecentExportsCard onAsk={onAsk} />
          <IntelligenceSupplierHighlightsCard onAsk={onAsk} />
        </div>
      </ReferenceSection>
    </div>
  )
}

function IntegrationTile({
  integration,
  busy,
  busyAction,
  onConnect,
  disabledReason
}: {
  integration: IntegrationCard
  busy: boolean
  busyAction: 'connect' | 'disconnect'
  onConnect: (integration: IntegrationCard) => void
  disabledReason?: string
}) {
  const key = providerKey(integration.provider)
  const logoSrc: Record<string, string> = {
    shopify: '/images/integrations/shopify.svg',
    square: '/images/integrations/square.svg',
    clover: '/images/integrations/clover.svg',
    lightspeed: '/images/integrations/lightspeed.svg',
    woocommerce: '/images/integrations/woocommerce.svg',
    quickbooks: '/images/integrations/quickbooks.svg',
    shipstation: '/images/integrations/globalpayments.svg',
    loyverse: '/images/integrations/loyverse.svg',
    moneris: '/images/integrations/moneris-icon.png',
    globalpayments: '/images/integrations/globalpayments.svg'
  }
  const category: Record<string, string> = {
    shopify: 'POS, catalog, orders, and inventory',
    square: 'POS, sales, catalog, and inventory',
    clover: 'POS, items, orders, and inventory',
    lightspeed: 'Retail POS and inventory',
    woocommerce: 'Products, orders, sales, and inventory',
    moneris: 'Payments provider, not primary inventory',
    loyverse: 'POS, items, receipts, and inventory',
    globalpayments: 'Payments provider, future data source',
    quickbooks: 'Accounting'
  }
  const isConnected = integration.status === 'Connected'
  const actionDisabled = Boolean(disabledReason) || busy

  return (
    <article className={`cd-card cd-integration ${moneyToneClass(integration.accent)}`}>
      <div className="cd-integration__logo">
        {logoSrc[key] ? <img src={logoSrc[key]} alt="" /> : integration.provider.slice(0, 2)}
      </div>
      <div className="cd-integration__body">
        <h3>{integration.provider}</h3>
        <p>{category[key] || integration.description}</p>
        {disabledReason ? <small>{disabledReason}</small> : null}
      </div>
      <button
        className={`cd-integration__action ${isConnected ? 'is-disconnect' : ''}`}
        type="button"
        disabled={actionDisabled}
        onClick={() => onConnect(integration)}
      >
        {disabledReason ? 'Future' : busy ? (busyAction === 'disconnect' ? 'Disconnecting...' : 'Connecting...') : isConnected ? 'Disconnect' : 'Connect'}
      </button>
    </article>
  )
}

function oauthReturnNoticeFromQuery() {
  const params = new URLSearchParams(window.location.search)
  const provider = params.get('provider') || params.get('integration') || params.get('source') || 'integration'
  const status = String(params.get('status') || params.get('success') || '').toLowerCase()
  const error = params.get('error_description') || params.get('error')
  const hasReturnSignal = ['provider', 'integration', 'connection', 'oauth', 'status', 'success', 'error', 'error_description'].some((key) => params.has(key))
  if (!hasReturnSignal) return null
  if (error) {
    return { tone: 'red' as MetricTone, text: `${provider} returned an OAuth error: ${error}. The dashboard will refresh connection status, but you may need to try connecting again.` }
  }
  if (status === 'false' || status === 'failed' || status === 'error') {
    return { tone: 'red' as MetricTone, text: `${provider} returned without a successful connection status. Refreshing live connection status now.` }
  }
  if (status === 'connected' || status === 'success' || status === 'true') {
    return { tone: 'green' as MetricTone, text: `${provider} returned from authorization. Refreshing live connection status now.` }
  }
  return { tone: 'amber' as MetricTone, text: `${provider} returned from authorization. Refreshing live connection status now.` }
}

type WooCommerceCredentials = {
  storeUrl: string
  consumerKey: string
  consumerSecret: string
}

function WooCommerceConnectModal({
  open,
  busy,
  onClose,
  onSubmit
}: {
  open: boolean
  busy: boolean
  onClose: () => void
  onSubmit: (credentials: WooCommerceCredentials) => void
}) {
  const [storeUrl, setStoreUrl] = useState('')
  const [consumerKey, setConsumerKey] = useState('')
  const [consumerSecret, setConsumerSecret] = useState('')

  useEffect(() => {
    if (!open) return
    setStoreUrl('')
    setConsumerKey('')
    setConsumerSecret('')
  }, [open])

  if (!open) return null

  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit({
      storeUrl: storeUrl.trim(),
      consumerKey: consumerKey.trim(),
      consumerSecret: consumerSecret.trim()
    })
  }

  return (
    <div className="cd-modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !busy) onClose()
    }}>
      <section className="cd-card cd-woo-modal" role="dialog" aria-modal="true" aria-labelledby="woocommerce-connect-title">
        <header className="cd-woo-modal__head">
          <div>
            <span>WooCommerce</span>
            <h2 id="woocommerce-connect-title">Connect store</h2>
          </div>
          <button className="cd-icon-button" type="button" aria-label="Close WooCommerce connection" onClick={onClose} disabled={busy}>
            <X size={16} />
          </button>
        </header>
        <p className="cd-woo-modal__copy">
          Paste a WooCommerce REST API key from WordPress. Coodra will use it read-only first to sync products, orders, sales, and inventory.
        </p>
        <form className="cd-woo-modal__form" onSubmit={submit}>
          <label>
            <span>Store URL</span>
            <input
              type="url"
              value={storeUrl}
              onChange={(event) => setStoreUrl(event.target.value)}
              placeholder="https://yourstore.com"
              autoComplete="url"
              required
            />
          </label>
          <label>
            <span>Consumer key</span>
            <input
              type="text"
              value={consumerKey}
              onChange={(event) => setConsumerKey(event.target.value)}
              placeholder="ck_..."
              autoComplete="off"
              required
            />
          </label>
          <label>
            <span>Consumer secret</span>
            <input
              type="password"
              value={consumerSecret}
              onChange={(event) => setConsumerSecret(event.target.value)}
              placeholder="cs_..."
              autoComplete="off"
              required
            />
          </label>
          <div className="cd-woo-modal__actions">
            <button className="cd-small-ghost" type="button" onClick={onClose} disabled={busy}>Cancel</button>
            <button className="cd-integration__action" type="submit" disabled={busy}>
              {busy ? 'Connecting...' : 'Connect WooCommerce'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

function IntegrationsPage({ data, user, onRefresh }: { data: DashboardData; user: BootUser; onRefresh: () => Promise<LoadResult> }) {
  const [query, setQuery] = useState('')
  const [busyProvider, setBusyProvider] = useState<{ provider: string; action: 'connect' | 'disconnect' } | null>(null)
  const [connectNotice, setConnectNotice] = useState<{ tone: MetricTone; text: string } | null>(null)
  const [wooModalOpen, setWooModalOpen] = useState(false)
  const integrations = getDisplayIntegrations(data.workspace.integrations)
  const filteredIntegrations = integrations.filter((integration) => {
    const haystack = [integration.provider, integration.description, integration.status, integration.lastSync || ''].join(' ').toLowerCase()
    return haystack.includes(query.trim().toLowerCase())
  })
  const coreIntegrations = filteredIntegrations.filter((integration) => !isFuturePaymentProvider(integration.provider))
  const paymentIntegrations = filteredIntegrations.filter((integration) => isFuturePaymentProvider(integration.provider))

  useEffect(() => {
    const notice = oauthReturnNoticeFromQuery()
    if (!notice) return
    setConnectNotice(notice)
    void onRefresh().catch((err: unknown) => {
      setConnectNotice({
        tone: 'red',
        text: err instanceof Error ? err.message : 'Returned from authorization, but live connection status could not be refreshed.'
      })
    })
  }, [onRefresh])

  const runWooCommerceConnect = async (credentials: WooCommerceCredentials) => {
    const provider = 'WooCommerce'
    setBusyProvider({ provider, action: 'connect' })
    setConnectNotice(null)
    const result = await startIntegrationConnection(provider, user.backendJwt, credentials)
    if (!result.ok) {
      setBusyProvider(null)
      setConnectNotice({
        tone: 'red',
        text: result.error
          ? `WooCommerce connection could not be started. ${result.error}`
          : 'WooCommerce connection could not be started.'
      })
      return
    }

    setConnectNotice({ tone: 'amber', text: 'WooCommerce connected. Running the first read-only sync now.' })
    const syncResult = await syncIntegrationConnection(provider, user.backendJwt)
    try {
      await onRefresh()
    } catch {
      // A failed refresh should not hide the connection result.
    }
    setBusyProvider(null)
    setWooModalOpen(false)

    if (!syncResult.ok) {
      setConnectNotice({
        tone: 'amber',
        text: syncResult.error
          ? `WooCommerce connected, but the first sync needs attention: ${syncResult.error}`
          : 'WooCommerce connected, but the first sync needs attention.'
      })
      return
    }

    const synced = syncResult.data?.result
    setConnectNotice({
      tone: 'green',
      text: `WooCommerce connected and synced ${synced?.synced_products || 0} products, ${synced?.synced_variants || 0} variants, and ${synced?.synced_orders || 0} orders.`
    })
  }

  const handleConnect = async (integration: IntegrationCard) => {
    const provider = integration.provider
    if (integration.status === 'Connected') {
      setBusyProvider({ provider, action: 'disconnect' })
      setConnectNotice(null)
      const result = await disconnectIntegrationConnection(provider, user.backendJwt)
      if (result.ok) {
        try {
          await onRefresh()
          setConnectNotice({
            tone: 'green',
            text: result.data?.message || `${provider} was disconnected and dashboard data has been refreshed.`
          })
        } catch (err: unknown) {
          setConnectNotice({
            tone: 'amber',
            text: err instanceof Error ? `${provider} disconnected, but refresh failed: ${err.message}` : `${provider} disconnected, but dashboard data could not be refreshed.`
          })
        } finally {
          setBusyProvider(null)
        }
        return
      }
      setBusyProvider(null)
      setConnectNotice({
        tone: 'red',
        text: result.error || `${provider} could not be disconnected.`
      })
      return
    }
    if (providerKey(provider) === 'woocommerce') {
      setWooModalOpen(true)
      return
    }
    setBusyProvider({ provider, action: 'connect' })
    setConnectNotice(null)
    const result = await startIntegrationConnection(provider, user.backendJwt)
    setBusyProvider(null)
    const launchUrl = result.data?.connectUrl || result.data?.launch_url || ''
    if (result.ok && launchUrl) {
      window.location.assign(launchUrl)
      return
    }
    if (result.ok) {
      setConnectNotice({
        tone: 'amber',
        text: result.data?.message || `${provider} has been marked pending.`
      })
      return
    }
    setConnectNotice({
      tone: 'red',
      text: result.error
        ? `${provider} connection could not be started. ${result.error}`
        : `${provider} connection could not be started.`
    })
  }

  return (
    <div className="cd-ref-page cd-ref-page--integrations">
      <div className="cd-integrations-toolbar">
        <Search size={17} />
        <input
          id="integration-search"
          name="integration-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search integrations"
          aria-label="Search integrations"
        />
      </div>
      {connectNotice ? (
        <div className={`cd-integration-notice tone-${connectNotice.tone}`}>
          {connectNotice.text}
        </div>
      ) : null}
      {coreIntegrations.length ? (
        <section className="cd-integrations-section">
          <div className="cd-integrations-section__head">
            <h2>POS + Inventory</h2>
            <p>Use these connectors to sync products, sales, orders, and inventory into Coodra.</p>
          </div>
          <div className="cd-ref-integration-grid">
            {coreIntegrations.map((integration) => (
              <IntegrationTile
                key={integration.provider}
                integration={integration}
                busy={busyProvider?.provider === integration.provider}
                busyAction={busyProvider?.action || 'connect'}
                onConnect={handleConnect}
              />
            ))}
          </div>
        </section>
      ) : null}
      {paymentIntegrations.length ? (
        <section className="cd-integrations-section cd-integrations-section--secondary">
          <div className="cd-integrations-section__head">
            <h2>Payments / Future</h2>
            <p>These are not primary inventory systems, so they stay out of the main onboarding path.</p>
          </div>
          <div className="cd-ref-integration-grid">
            {paymentIntegrations.map((integration) => (
              <IntegrationTile
                key={integration.provider}
                integration={integration}
                busy={busyProvider?.provider === integration.provider}
                busyAction={busyProvider?.action || 'connect'}
                onConnect={handleConnect}
                disabledReason="Not a primary inventory source"
              />
            ))}
          </div>
        </section>
      ) : null}
      {!filteredIntegrations.length ? (
        <article className="cd-ref-card cd-integrations-empty">
          <strong>No integrations found</strong>
          <span>Try searching for a POS, inventory source, provider, or sync status.</span>
        </article>
      ) : null}
      <WooCommerceConnectModal
        open={wooModalOpen}
        busy={busyProvider?.provider === 'WooCommerce'}
        onClose={() => setWooModalOpen(false)}
        onSubmit={runWooCommerceConnect}
      />
    </div>
  )
}

function WorkspacePage({ data, onAsk, onOpenPage }: { data: DashboardData; onAsk: (context: string) => void; onOpenPage: (pageId: DashboardPageId) => void }) {
  const hasAutomation = canUsePlanFeature(data, 'growth')
  return (
    <div className="cd-ref-page cd-ref-page--workspace">
      <ReferenceMetricGrid metrics={data.workspace.metrics} page="workspace" />
      <ReferenceSection title="Policies & Automation">
        {hasAutomation ? (
          <div className="cd-ref-two">
            <WorkspacePolicyCard
              icon={Settings}
              title="Open-to-Buy / Automation Rules"
              subtitle="Define spend guardrails, OTB calculations, and automated actions."
              metrics={[
                { label: 'Rules', value: String(data.workspace.automation.length) },
                { label: 'Active', value: String(data.workspace.automation.filter((row) => row.status === 'Active').length) },
                { label: 'Updated', value: 'Workspace' }
              ]}
            />
            <WorkspacePolicyCard
              icon={TrendingUp}
              title="Vendor Constraints / Forecast Scenarios"
              subtitle="Manage user-provided vendor constraints and demand scenarios."
              metrics={[
                { label: 'Constraints', value: 'Not configured' },
                { label: 'Scenarios', value: 'Not configured' },
                { label: 'Updated', value: 'When created' }
              ]}
            />
          </div>
        ) : (
          <PlanUpgradeBlocker
            featureName="Automation"
            requiredPlan="growth"
            currentPlan={currentPlanCode(data)}
            description={lockedFeatureDescription('automation')}
          />
        )}
      </ReferenceSection>
      <ReferenceSection title="Administration">
        <div className="cd-ref-admin">
          <WorkspaceBillingCard onAsk={onAsk} onOpenPage={onOpenPage} />
          <WorkspaceAdminMiniCard icon={Users} title="Team Members" value={String(data.workspace.team.length)} detail="Active users" action="Manage team" onClick={() => onAsk('Manage workspace team members')} />
          <WorkspaceActivityCard rows={data.workspace.activity} onAsk={onAsk} />
        </div>
      </ReferenceSection>
    </div>
  )
}

function SettingsToggle({ label, enabled = true, onChange }: { label: string; enabled?: boolean; onChange?: (enabled: boolean) => void }) {
  const [isEnabled, setIsEnabled] = useState(enabled)
  useEffect(() => setIsEnabled(enabled), [enabled])
  return (
    <div className="cd-settings-row">
      <span>{label}</span>
      <button
        className={`cd-settings-toggle ${isEnabled ? 'is-enabled' : ''}`}
        type="button"
        aria-pressed={isEnabled}
        onClick={() => {
          setIsEnabled((current) => {
            const next = !current
            onChange?.(next)
            return next
          })
        }}
      >
        <span />
      </button>
    </div>
  )
}

function SettingsSelect({ label, value, onChange }: { label: string; value: string; onChange?: (value: string) => void }) {
  const optionsByLabel: Record<string, string[]> = {
    Theme: ['Light', 'Dark', 'System'],
    'Report frequency': ['Weekly', 'Daily', 'Monthly', 'Off'],
    Density: ['Comfortable', 'Compact', 'Spacious'],
    Accent: ['Minimal', 'Teal', 'Blue'],
    Language: ['English', 'French', 'Spanish']
  }
  const options = optionsByLabel[label] || [value]
  const [selectedValue, setSelectedValue] = useState(value)
  useEffect(() => setSelectedValue(value), [value])
  const cycleValue = () => {
    const currentIndex = options.indexOf(selectedValue)
    const nextValue = options[(currentIndex + 1) % options.length]
    setSelectedValue(nextValue)
    onChange?.(nextValue)
  }

  return (
    <div className="cd-settings-row">
      <span>{label}</span>
      <button className="cd-settings-select" type="button" onClick={cycleValue}>{selectedValue}<ChevronDown size={14} /></button>
    </div>
  )
}

const defaultDashboardSettings: Required<DashboardSettings> = {
  notifications: {
    email_enabled: true,
    weekly_digest: true,
    product_updates: true
  },
  theme: 'system',
  reports: {
    frequency: 'weekly',
    include_csv: false
  }
}

function mergeDashboardSettings(settings?: DashboardSettings): Required<DashboardSettings> {
  return {
    notifications: {
      ...defaultDashboardSettings.notifications,
      ...(settings?.notifications || {})
    },
    theme: settings?.theme || defaultDashboardSettings.theme,
    reports: {
      ...defaultDashboardSettings.reports,
      ...(settings?.reports || {})
    }
  }
}

function dashboardThemeFromProfile(profile: AccountProfile | null, fallback: 'light' | 'dark' | 'system' = 'system'): 'light' | 'dark' | 'system' {
  const theme = String(profile?.dashboard_settings?.theme || fallback).toLowerCase()
  if (theme === 'light' || theme === 'dark') return theme
  return 'system'
}

function profileAvatar(profile: AccountProfile | null) {
  return profile?.avatar_data_url || profile?.avatar_url || ''
}

function isValidContactEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
}

function buildLaunchReadinessRows(data: DashboardData): SimpleRow[] {
  const connectedCount = data.workspace.integrations.filter((integration) => integration.status === 'Connected').length
  const hasRevenueOrUnits = data.commandCenter.metrics.some((metric) => {
    const label = metric.label.toLowerCase()
    const value = String(metric.value || '').toLowerCase()
    return (label.includes('revenue') && !['$0', '$0.00', 'measuring'].includes(value)) ||
      (label.includes('units') && !['0', 'measuring'].includes(value))
  })
  const hasDecisions = data.commandCenter.decisions.length > 0 || data.decisions.queue.length > 0
  const hasCatalogSignals = data.merchandise.catalogTasks.length > 0 || data.merchandise.roleMix.length > 0
  const hasPoWorkflow = data.operations.purchaseOrders.length > 0

  return [
    {
      id: 'connect-pos',
      title: 'Connect POS and inventory source',
      subtitle: connectedCount ? `${connectedCount} live connection${connectedCount === 1 ? '' : 's'} found` : 'Connect Shopify, Square, Lightspeed, Clover, or Loyverse to start.',
      status: connectedCount ? 'Complete' : 'Needs connection',
      tone: connectedCount ? 'green' : 'amber'
    },
    {
      id: 'sync-commerce',
      title: 'Sync catalog, sales, and inventory',
      subtitle: hasRevenueOrUnits ? 'Live commerce facts are available for the dashboard.' : 'Metrics stay empty until the first successful provider sync.',
      status: hasRevenueOrUnits ? 'Ready' : 'Waiting',
      tone: hasRevenueOrUnits ? 'green' : 'neutral'
    },
    {
      id: 'catalog-readiness',
      title: 'Review catalog readiness',
      subtitle: hasCatalogSignals ? 'Catalog signals are available for SKU roles and cleanup.' : 'Missing SKU, cost, vendor, or image checks appear after catalog sync.',
      status: hasCatalogSignals ? 'Ready' : 'After sync',
      tone: hasCatalogSignals ? 'green' : 'neutral'
    },
    {
      id: 'first-decisions',
      title: 'Generate trusted decisions',
      subtitle: hasDecisions || hasPoWorkflow ? 'Recommendations or workflow records are available.' : 'Coodra will recommend actions after enough live signals are measured.',
      status: hasDecisions || hasPoWorkflow ? 'Ready' : 'Needs live data',
      tone: hasDecisions || hasPoWorkflow ? 'green' : 'neutral'
    }
  ]
}

function SettingsPage({
  user,
  data,
  profile,
  onProfileChanged
}: {
  user: BootUser
  data: DashboardData
  profile: AccountProfile | null
  onProfileChanged: (profile: AccountProfile) => void
}) {
  const company = user.company || 'Coodra'
  const connected = data.workspace.integrations.filter((integration) => integration.status === 'Connected').length
  const currentPlan = getPlan(data.billing?.planCode)
  const usageMetrics = data.billing?.usageSummary?.metrics || {}
  const [profileDraft, setProfileDraft] = useState({
    business_name: profile?.business_name || company,
    contact_email: profile?.contact_email || user.email,
    avatar_data_url: profileAvatar(profile)
  })
  const [settingsDraft, setSettingsDraft] = useState<Required<DashboardSettings>>(mergeDashboardSettings(profile?.dashboard_settings))
  const [saving, setSaving] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    setProfileDraft({
      business_name: profile?.business_name || company,
      contact_email: profile?.contact_email || user.email,
      avatar_data_url: profileAvatar(profile)
    })
    setSettingsDraft(mergeDashboardSettings(profile?.dashboard_settings))
  }, [company, profile, user.email])

  const saveProfile = async () => {
    const businessName = profileDraft.business_name.trim()
    const contactEmail = profileDraft.contact_email.trim().toLowerCase()
    if (!businessName) {
      setNotice('Business name is required.')
      return
    }
    if (!isValidContactEmail(contactEmail)) {
      setNotice('Use a valid contact email address.')
      return
    }
    setSaving('profile')
    setNotice('')
    const result = await updateAccountProfile(user.backendJwt, {
      business_name: businessName,
      contact_email: contactEmail,
      avatar_data_url: profileDraft.avatar_data_url || null,
      dashboard_settings: settingsDraft
    })
    setSaving('')
    if (!result.ok || !result.data) {
      setNotice(result.error || 'Profile could not be saved.')
      return
    }
    onProfileChanged(result.data)
    setProfileDraft((current) => ({ ...current, business_name: businessName, contact_email: contactEmail }))
    setNotice('Profile and dashboard preferences saved.')
  }

  const saveSettings = async (nextSettings: Required<DashboardSettings>) => {
    const businessName = profileDraft.business_name.trim()
    const contactEmail = profileDraft.contact_email.trim().toLowerCase()
    if (!businessName || !isValidContactEmail(contactEmail)) {
      setNotice('Save a valid business name and contact email before changing settings.')
      return
    }
    setSettingsDraft(nextSettings)
    const result = await updateAccountProfile(user.backendJwt, {
      business_name: businessName,
      contact_email: contactEmail,
      avatar_data_url: profileDraft.avatar_data_url || null,
      dashboard_settings: nextSettings
    })
    if (result.ok && result.data) onProfileChanged(result.data)
    setNotice(result.ok ? 'Settings saved.' : result.error || 'Settings could not be saved.')
  }

  const onAvatarFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setNotice('Use a PNG, JPG, or WebP profile image.')
      return
    }
    if (file.size > 64 * 1024) {
      setNotice('Use a profile image under 64 KB for now.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setProfileDraft((current) => ({ ...current, avatar_data_url: String(reader.result || '') }))
      setNotice('Profile image ready. Save profile to keep it.')
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const openBillingPortal = async () => {
    setSaving('billing')
    const result = await loadBillingPortal(user.backendJwt)
    setSaving('')
    const url = result.data?.portal_url || result.data?.redirect_url || result.data?.url
    if (result.ok && url) {
      window.location.href = url
      return
    }
    setNotice(result.error || 'Billing portal is not available for this workspace yet.')
  }

  const choosePlan = async (planCode: PlanKey) => {
    setSaving(`checkout-${planCode}`)
    setNotice('')
    const result = await startBillingCheckout(user.backendJwt, planCode)
    setSaving('')
    const url = result.data?.redirect_url
    if (result.ok && url) {
      window.location.href = url
      return
    }
    setNotice(result.error || result.data?.message || 'Checkout could not be started for this plan.')
  }

  const requestDangerAction = (kind: 'deactivate' | 'delete') => {
    const action = kind === 'delete' ? 'delete this workspace' : 'deactivate this account'
    const confirmed = window.confirm(`Request to ${action}? This will open a support request and will not change data automatically.`)
    if (!confirmed) return
    const subject = kind === 'delete' ? 'Coodra workspace deletion request' : 'Coodra account deactivation request'
    const body = [
      `Workspace: ${company}`,
      `Contact: ${profileDraft.contact_email || user.email}`,
      `Connected integrations: ${connected}`,
      '',
      `I confirm I want support to review this ${action} request.`
    ].join('\n')
    window.location.href = `mailto:support@coodra.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="cd-ref-page cd-settings-page">
      {notice ? <div className={`cd-data-notice ${notice.includes('could not') || notice.includes('not available') ? 'is-warning' : 'is-success'}`}><Sparkles size={16} /><span>{notice}</span></div> : null}
      <ReferenceSection title="Account">
        <div className="cd-ref-two">
          <article className="cd-ref-card cd-settings-card cd-settings-profile">
            <ReferenceCardTitle title="Profile" />
            <div className="cd-settings-profile__body">
              <div className="cd-settings-avatar">
                {profileDraft.avatar_data_url ? <img src={profileDraft.avatar_data_url} alt="" /> : firstName(user).slice(0, 1).toUpperCase()}
              </div>
              <div>
                <h3>{firstName(user)}</h3>
                <p>{user.email}</p>
                <span>Coodra Admin</span>
              </div>
            </div>
            <div className="cd-settings-form">
              <label><span>Business name</span><input id="settings-business-name" name="business_name" value={profileDraft.business_name} maxLength={120} onChange={(event) => setProfileDraft((current) => ({ ...current, business_name: event.target.value }))} /></label>
              <label><span>Contact email</span><input id="settings-contact-email" name="contact_email" type="email" value={profileDraft.contact_email} maxLength={254} onChange={(event) => setProfileDraft((current) => ({ ...current, contact_email: event.target.value }))} /></label>
              <label className="cd-settings-file"><Paperclip size={15} /><span>Upload profile image</span><input id="settings-profile-image" name="profile_image" type="file" accept="image/png,image/jpeg,image/webp" onChange={onAvatarFile} /></label>
              {profileDraft.avatar_data_url ? <button className="cd-settings-link-button" type="button" onClick={() => { setProfileDraft((current) => ({ ...current, avatar_data_url: '' })); setNotice('Profile image removed. Save profile to keep this change.') }}>Remove profile image</button> : null}
            </div>
            <button className="cd-settings-button" type="button" onClick={saveProfile} disabled={saving === 'profile'}>{saving === 'profile' ? 'Saving...' : 'Save profile'}</button>
          </article>
          <article className="cd-ref-card cd-settings-card">
            <ReferenceCardTitle title="Organization" />
            <div className="cd-settings-kv">
              <span>Company</span><strong>{company}</strong>
              <span>Industry</span><strong>Retail AI</strong>
              <span>Region</span><strong>{user.region || 'Not set'}</strong>
            </div>
            <button className="cd-settings-button" type="button" onClick={saveProfile} disabled={saving === 'profile'}>Save organization</button>
          </article>
        </div>
      </ReferenceSection>
      <ReferenceSection title="Preferences">
        <div className="cd-ref-two">
          <article className="cd-ref-card cd-settings-card">
            <ReferenceCardTitle title="Notifications" />
            <div className="cd-settings-list">
              <SettingsToggle label="Email alerts" enabled={!!settingsDraft.notifications.email_enabled} onChange={(enabled) => saveSettings({ ...settingsDraft, notifications: { ...settingsDraft.notifications, email_enabled: enabled } })} />
              <SettingsToggle label="Weekly summary" enabled={!!settingsDraft.notifications.weekly_digest} onChange={(enabled) => saveSettings({ ...settingsDraft, notifications: { ...settingsDraft.notifications, weekly_digest: enabled } })} />
              <SettingsToggle label="Product announcements" enabled={!!settingsDraft.notifications.product_updates} onChange={(enabled) => saveSettings({ ...settingsDraft, notifications: { ...settingsDraft.notifications, product_updates: enabled } })} />
            </div>
          </article>
          <article className="cd-ref-card cd-settings-card">
            <ReferenceCardTitle title="Dashboard preferences" />
            <div className="cd-settings-list">
              <SettingsSelect label="Theme" value={(settingsDraft.theme || 'system').replace(/^./, (s) => s.toUpperCase())} onChange={(value) => saveSettings({ ...settingsDraft, theme: value.toLowerCase() })} />
              <SettingsSelect label="Report frequency" value={(settingsDraft.reports.frequency || 'weekly').replace(/^./, (s) => s.toUpperCase())} onChange={(value) => saveSettings({ ...settingsDraft, reports: { ...settingsDraft.reports, frequency: value.toLowerCase() } })} />
              <SettingsToggle label="Include CSV in reports" enabled={!!settingsDraft.reports.include_csv} onChange={(enabled) => saveSettings({ ...settingsDraft, reports: { ...settingsDraft.reports, include_csv: enabled } })} />
            </div>
          </article>
        </div>
      </ReferenceSection>
      <ReferenceSection title="Security">
        <div className="cd-ref-two">
          <article className="cd-ref-card cd-settings-card">
            <ReferenceCardTitle title="Password & authentication" />
            <div className="cd-settings-kv">
              <span>Sign-in method</span><strong>Password plus email code</strong>
              <span>MFA policy</span><strong className="is-good">8-hour trusted device</strong>
              <span>Verification method</span><strong>6-digit email code</strong>
            </div>
            <p className="cd-settings-note">Coodra requires email verification on sign-in. After verification, this device stays trusted for 8 hours, so logging out and back in during that window will not ask for a new code.</p>
          </article>
          <article className="cd-ref-card cd-settings-card">
            <ReferenceCardTitle title="Access & permissions" />
            <div className="cd-settings-kv">
              <span>Role</span><strong>Admin</strong>
              <span>Team access</span><strong>Managed by workspace</strong>
              <span>Audit log access</span><strong className="is-good">Enabled</strong>
              <span>Security review</span><strong className="is-good">MFA required</strong>
            </div>
          </article>
        </div>
      </ReferenceSection>
      <ReferenceSection title="Billing & data">
        <article className="cd-ref-card cd-settings-wide">
          <div>
            <small>Plan</small>
            <strong>{currentPlan.name}</strong>
            <button type="button" onClick={openBillingPortal} disabled={saving === 'billing'}>{saving === 'billing' ? 'Opening...' : 'Manage billing'}<ChevronRight size={15} /></button>
          </div>
          <div><small>Decision recommendations</small><strong>{usageMetrics.decision_recommendations?.used ?? 0} / {usageMetrics.decision_recommendations?.unlimited ? 'Custom' : usageMetrics.decision_recommendations?.limit ?? currentPlan.limits.decision_recommendations}</strong><span>This billing period</span></div>
          <div><small>Products tracked</small><strong>{usageMetrics.products_tracked?.used ?? 0} / {usageMetrics.products_tracked?.unlimited ? 'Custom' : usageMetrics.products_tracked?.limit ?? currentPlan.limits.products_tracked}</strong><span>Synced catalog limit</span></div>
          <div><small>Team members</small><strong>{usageMetrics.team_members?.used ?? 1} / {usageMetrics.team_members?.unlimited ? 'Custom' : usageMetrics.team_members?.limit ?? currentPlan.limits.team_members}</strong><span>Seat limit</span></div>
          <div><small>POS / commerce integrations</small><strong>{usageMetrics.pos_commerce_integrations?.used ?? connected} / {usageMetrics.pos_commerce_integrations?.unlimited ? 'Custom' : usageMetrics.pos_commerce_integrations?.limit ?? currentPlan.limits.pos_commerce_integrations}</strong><span>Connection limit</span></div>
        </article>
        <article className="cd-ref-card cd-settings-wide cd-plan-actions-card">
          <div><small>Upgrade</small><strong>Starter</strong><button type="button" onClick={() => choosePlan('starter')} disabled={saving === 'checkout-starter'}>{saving === 'checkout-starter' ? 'Starting...' : 'Choose Starter'}</button></div>
          <div><small>Recommended</small><strong>Growth</strong><button type="button" onClick={() => choosePlan('growth')} disabled={saving === 'checkout-growth'}>{saving === 'checkout-growth' ? 'Starting...' : 'Choose Growth'}</button></div>
          <div><small>Scale</small><strong>Pro</strong><button type="button" onClick={() => choosePlan('pro')} disabled={saving === 'checkout-pro'}>{saving === 'checkout-pro' ? 'Starting...' : 'Choose Pro'}</button></div>
          <div><small>Custom</small><strong>Enterprise</strong><button type="button" onClick={() => choosePlan('enterprise')} disabled={saving === 'checkout-enterprise'}>{saving === 'checkout-enterprise' ? 'Opening...' : 'Talk to Sales'}</button></div>
        </article>
      </ReferenceSection>
      <ReferenceSection title="Danger zone">
        <article className="cd-ref-card cd-settings-danger">
          <div><span>Deactivate account</span><p>Temporarily disable access after support confirms ownership.</p><button type="button" onClick={() => requestDangerAction('deactivate')}>Request deactivation</button></div>
          <div><span>Delete workspace</span><p>Permanently delete all data after a verified support review. {connected} integrations are connected.</p><button type="button" onClick={() => requestDangerAction('delete')}>Request deletion</button></div>
        </article>
      </ReferenceSection>
    </div>
  )
}

function promptChipsFor(context: string) {
  const lowerContext = context.toLowerCase()
  if (lowerContext.includes('decision')) return ['Which decisions should I approve?', 'Why is this high confidence?', 'Show downside risk']
  if (lowerContext.includes('merchandise') || lowerContext.includes('product') || lowerContext.includes('sku')) return ['Which SKUs should I cut?', 'Find bundle candidates', 'Explain SKU roles']
  if (lowerContext.includes('operation') || lowerContext.includes('supplier') || lowerContext.includes('reorder')) return ['What needs reordering?', 'Improve vendor readiness', 'Show transfer readiness']
  if (lowerContext.includes('intelligence') || lowerContext.includes('forecast')) return ['Explain forecast changes', 'Show top drivers', 'Compare to last period']
  if (lowerContext.includes('workspace') || lowerContext.includes('integration')) return ['Check sync health', 'Explain automation rules', 'Help configure integration']
  return ['What should I review first?', 'Explain today’s highest-impact decision', 'What changed overnight?']
}

async function readChatAttachment(file: File): Promise<DashboardChatAttachment> {
  const readableTextTypes = [
    'text/',
    'application/json',
    'application/csv',
    'application/xml'
  ]
  const canReadText = readableTextTypes.some((type) => file.type.startsWith(type) || file.type === type)
  const attachment: DashboardChatAttachment = {
    name: file.name.slice(0, 120),
    type: file.type || 'application/octet-stream',
    size: file.size
  }
  if (canReadText && file.size <= 24_000) {
    attachment.text = await file.text()
  }
  return attachment
}

function chatResponseText(data: unknown) {
  if (!data || typeof data !== 'object') return ''
  const response = data as { choices?: Array<{ message?: { content?: unknown } }>; message?: unknown }
  return String(response.choices?.[0]?.message?.content || response.message || '').trim()
}

function chatThinkingDisplay(label: string) {
  const clean = String(label || '').trim()
  if (!clean || /^(preparing answer|thinking|choosing retail expert|reading intent)$/i.test(clean)) return 'Thinking'
  return clean
}

type ChatConversation = {
  id: string
  title: string
  context: string
  messages: DashboardChatMessage[]
  createdAt: number
  updatedAt: number
}

function chatStorageKey(user: BootUser) {
  const scope = String(user.userId || user.email || 'anon').toLowerCase().replace(/[^a-z0-9_-]/g, '_')
  return `coodra_chat_conversations_v1_${scope}`
}

function newChatId() {
  return `dash_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function conversationTitle(messages: DashboardChatMessage[], fallback: string) {
  const firstUserMessage = messages.find((message) => message.role === 'user')?.content || ''
  const title = firstUserMessage.replace(/\s+/g, ' ').trim()
  return (title || fallback || 'New conversation').slice(0, 72)
}

function loadStoredConversations(user: BootUser): ChatConversation[] {
  try {
    const raw = localStorage.getItem(chatStorageKey(user))
    const parsed = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((item): ChatConversation | null => {
        if (!item || typeof item !== 'object') return null
        const row = item as Partial<ChatConversation>
        const id = String(row.id || '').trim()
        const messages = Array.isArray(row.messages)
          ? row.messages
              .filter((message): message is DashboardChatMessage => {
                const role = (message as DashboardChatMessage)?.role
                const content = String((message as DashboardChatMessage)?.content || '').trim()
                return (role === 'user' || role === 'assistant') && Boolean(content)
              })
              .slice(-40)
          : []
        if (!id || !messages.length) return null
        return {
          id,
          title: String(row.title || conversationTitle(messages, 'Recent conversation')).slice(0, 72),
          context: String(row.context || 'Current dashboard').slice(0, 80),
          messages,
          createdAt: Number(row.createdAt || Date.now()),
          updatedAt: Number(row.updatedAt || Date.now())
        }
      })
      .filter((item): item is ChatConversation => item !== null)
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 20)
  } catch {
    return []
  }
}

function storeConversations(user: BootUser, conversations: ChatConversation[]) {
  try {
    localStorage.setItem(chatStorageKey(user), JSON.stringify(conversations.slice(0, 20)))
  } catch {
    // Chat history is a convenience layer. If storage is unavailable, keep the active chat in memory.
  }
}

function AskDrawer({ open, context, user, onClose, onResizeStart }: { open: boolean; context: string; user: BootUser; onClose: () => void; onResizeStart: (event: ReactMouseEvent<HTMLDivElement>) => void }) {
  const promptChips = promptChipsFor(context)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<DashboardChatMessage[]>([])
  const [conversationId, setConversationId] = useState(() => newChatId())
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const [recentOpen, setRecentOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<ChatConversation | null>(null)
  const [attachments, setAttachments] = useState<DashboardChatAttachment[]>([])
  const [isSending, setIsSending] = useState(false)
  const [thinkingLabel, setThinkingLabel] = useState('Preparing answer')
  const [chatError, setChatError] = useState('')
  const chatIdentityKey = `${user.userId || ''}:${user.email || ''}`

  useEffect(() => {
    setConversations(loadStoredConversations(user))
    setHistoryLoaded(true)
  }, [user, chatIdentityKey])

  useEffect(() => {
    if (!historyLoaded) return
    storeConversations(user, conversations)
  }, [conversations, historyLoaded, user])

  const persistConversation = (nextMessages: DashboardChatMessage[]) => {
    if (!nextMessages.length) return
    const now = Date.now()
    setConversations((current) => {
      const existing = current.find((item) => item.id === conversationId)
      const next: ChatConversation = {
        id: conversationId,
        title: conversationTitle(nextMessages, context),
        context: context || existing?.context || 'Current dashboard',
        messages: nextMessages.slice(-40),
        createdAt: existing?.createdAt || now,
        updatedAt: now
      }
      return [next, ...current.filter((item) => item.id !== conversationId)].slice(0, 20)
    })
  }

  const startNewConversation = () => {
    setConversationId(newChatId())
    setMessages([])
    setAttachments([])
    setDraft('')
    setChatError('')
    setRecentOpen(false)
  }

  const openConversation = (conversation: ChatConversation) => {
    setConversationId(conversation.id)
    setMessages(conversation.messages)
    setAttachments([])
    setDraft('')
    setChatError('')
    setRecentOpen(false)
  }

  const confirmDeleteConversation = () => {
    if (!pendingDelete) return
    setConversations((current) => current.filter((item) => item.id !== pendingDelete.id))
    if (pendingDelete.id === conversationId) {
      setConversationId(newChatId())
      setMessages([])
      setAttachments([])
      setDraft('')
      setChatError('')
    }
    setPendingDelete(null)
  }

  const sendPrompt = async (event: FormEvent) => {
    event.preventDefault()
    const nextPrompt = draft.trim()
    if (!nextPrompt || isSending) return
    const nextMessages: DashboardChatMessage[] = [...messages, { role: 'user', content: nextPrompt }]
    setMessages(nextMessages)
    persistConversation(nextMessages)
    setDraft('')
    setChatError('')
    setThinkingLabel('Preparing answer')
    setIsSending(true)
    let streamedText = ''
    const chatPayload = {
      messages: nextMessages,
      sessionId: conversationId,
      context,
      firstName: firstName(user),
      attachments
    }
    const result = await streamDashboardChat(user.backendJwt, chatPayload, {
      onStatus: setThinkingLabel,
      onContent: (content) => {
        streamedText += content
      }
    })
    const finalResult = result.ok ? result : await sendDashboardChat(user.backendJwt, chatPayload)
    if (!result.ok) {
      streamedText = ''
    }
    if (finalResult.ok && streamedText && !chatResponseText(finalResult.data)) {
      finalResult.data = { message: streamedText, choices: [{ message: { content: streamedText } }] }
    }
    setIsSending(false)
    if (!finalResult.ok) {
      setChatError(finalResult.error || 'Ask Coodra could not respond right now.')
      return
    }
    const answer = chatResponseText(finalResult.data) || 'I could not generate a response from the available context.'
    const answeredMessages: DashboardChatMessage[] = [...nextMessages, { role: 'assistant', content: answer }]
    setMessages(answeredMessages)
    persistConversation(answeredMessages)
    setAttachments([])
  }
  const attachFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).slice(0, 3)
    event.target.value = ''
    if (!files.length) return
    const accepted: DashboardChatAttachment[] = []
    for (const file of files) {
      if (file.size > 1_000_000) {
        setChatError(`${file.name} is too large. Attach files under 1 MB.`)
        continue
      }
      accepted.push(await readChatAttachment(file))
    }
    if (accepted.length) setAttachments((current) => [...current, ...accepted].slice(0, 3))
  }
  const submitOnEnter = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey) return
    event.preventDefault()
    if (!draft.trim() || isSending) return
    event.currentTarget.form?.requestSubmit()
  }
  const hasMessages = messages.length > 0
  const thinkingDisplay = chatThinkingDisplay(thinkingLabel)
  return (
    <aside className={`cd-chat-drawer ${open ? 'is-open' : ''}`}>
      <div className="cd-chat-resize-handle" role="separator" aria-orientation="vertical" aria-label="Resize Ask Coodra" onMouseDown={onResizeStart} />
      <div className="cd-chat-drawer__head">
        <div className="cd-chat-title-row">
          <h2>Ask Coodra</h2>
          <div className="cd-context-chip"><span />Context: {context || 'Current dashboard'}</div>
        </div>
        <div className="cd-chat-head-actions">
          <div className="cd-chat-recent-wrap">
            <button className="cd-chat-recent-button" type="button" onClick={() => setRecentOpen((value) => !value)} aria-expanded={recentOpen}>Recent</button>
            {recentOpen ? (
              <div className="cd-chat-recent-panel">
                <div className="cd-chat-recent-panel__head">
                  <span>Recent conversations</span>
                  <button type="button" onClick={startNewConversation}>New chat</button>
                </div>
                {conversations.length ? (
                  <div className="cd-chat-recent-list">
                    {conversations.map((conversation) => (
                      <div className={`cd-chat-recent-item ${conversation.id === conversationId ? 'is-active' : ''}`} key={conversation.id}>
                        <button type="button" onClick={() => openConversation(conversation)}>
                          <span>{conversation.title}</span>
                          <small>{conversation.context}</small>
                        </button>
                        <button type="button" aria-label={`Delete ${conversation.title}`} onClick={() => setPendingDelete(conversation)}><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="cd-chat-recent-empty">Conversations you keep will appear here.</p>
                )}
              </div>
            ) : null}
          </div>
          <button className="cd-icon-button" type="button" onClick={onClose} aria-label="Close Ask Coodra"><X size={18} /></button>
        </div>
      </div>
      <div className="cd-chat-topline">
        <div className="cd-prompt-grid">
          {promptChips.map((chip) => <button key={chip} type="button" onClick={() => setDraft(chip)}>{chip}</button>)}
        </div>
      </div>
      <div className={hasMessages ? 'cd-chat-thread' : 'cd-chat-welcome'}>
        {hasMessages ? (
          messages.map((message, index) => (
            <div className={`cd-chat-bubble is-${message.role}`} key={`${message.role}-${index}`}>
              <p>{message.content}</p>
            </div>
          ))
        ) : (
          <>
            <span className="cd-chat-mark">
              <img src="/images/brand/coodra-logo-mark.png" alt="" />
            </span>
            <h3><span>Hey {firstName(user)},</span><span>how can I help today?</span></h3>
          </>
        )}
        {isSending ? (
          <div className="cd-chat-thinking" role="status" aria-live="polite">
            <span className="cd-chat-thinking__text">{thinkingDisplay}</span>
            <span className="cd-chat-thinking__beam" aria-hidden="true" />
          </div>
        ) : null}
        {chatError ? <p className="cd-chat-local-note is-error">{chatError}</p> : null}
        {attachments.length ? (
          <div className="cd-chat-attachments">
            {attachments.map((attachment) => (
              <button type="button" key={`${attachment.name}-${attachment.size}`} onClick={() => setAttachments((current) => current.filter((item) => item !== attachment))}>
                <Paperclip size={13} />{attachment.name}<X size={12} />
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <form className="cd-composer" onSubmit={sendPrompt}>
        <button className="cd-attach-button" type="button" aria-label="Attach file" onClick={() => document.getElementById('cd-chat-attachment')?.click()}><Paperclip size={16} /></button>
        <input
          id="cd-chat-attachment"
          className="cd-chat-attachment-input"
          type="file"
          multiple
          onChange={attachFile}
        />
        <textarea id="cd-chat-message" name="message" placeholder="Ask anything..." rows={1} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={submitOnEnter} />
        <div className="cd-composer__actions">
          <button className="cd-send-button" type="submit" aria-label="Send message" disabled={isSending || !draft.trim()}><Send size={16} /></button>
        </div>
      </form>
      {pendingDelete ? (
        <div className="cd-chat-confirm-backdrop" role="presentation">
          <div className="cd-chat-confirm-card" role="dialog" aria-modal="true" aria-labelledby="cd-chat-confirm-title">
            <h3 id="cd-chat-confirm-title">Delete this conversation?</h3>
            <p>This removes “{pendingDelete.title}” from your recent chats on this browser.</p>
            <div>
              <button type="button" onClick={() => setPendingDelete(null)}>Cancel</button>
              <button type="button" onClick={confirmDeleteConversation}>Delete</button>
            </div>
          </div>
        </div>
      ) : null}
    </aside>
  )
}

function HelpPage({ onAsk }: { onAsk: (context: string) => void }) {
  const supportOptions = [
    { title: 'Ask Coodra', text: 'Get help with the page you are viewing.', icon: Sparkles, action: 'Open assistant', primary: true, onClick: () => onAsk('Help') },
    { title: 'Email support', text: 'Send the team a support request.', icon: Mail, action: 'Email support', onClick: () => { window.location.href = 'mailto:support@coodra.com?subject=Coodra%20support%20request' } },
    { title: 'Report an issue', text: 'Tell us what needs fixing.', icon: Bug, action: 'Report issue', onClick: () => { window.location.href = 'mailto:support@coodra.com?subject=Coodra%20dashboard%20issue' } }
  ]
  const resources = [
    { title: 'Decision reviews', text: 'How to review, approve, and track recommendations.', icon: BookOpen, action: 'Read guide' },
    { title: 'Integration setup', text: 'Connect Shopify, POS, payment, and accounting systems.', icon: Plug, action: 'View setup' },
    { title: 'Forecast scenarios', text: 'Compare scenarios and understand forecast changes.', icon: Video, action: 'Learn more' }
  ]
  const recommended = [
    ['How to review decisions', 'Review, simulate, and approve decisions with confidence.', 'Read article'],
    ['Improving vendor readiness', 'Add supplier, lead-time, MOQ, and pack-size details during PO review.', 'Read article'],
    ['Connecting Shopify', 'Set up and sync your Shopify store in a few steps.', 'Read guide'],
    ['Using forecast scenarios', 'Compare scenarios and plan for different outcomes.', 'Read article']
  ]
  const statuses = ['App services', 'Sync jobs', 'Forecast engine', 'Notifications']
  const shortcuts = [
    ['⌘ K', 'Open global search'],
    ['Ask', 'Open Ask Coodra'],
    ['Esc', 'Close open drawer'],
    ['Tab', 'Move through controls']
  ]

  return (
    <div className="cd-ref-page cd-help-page">
      <section className="cd-help-fast-grid">
        <article className="cd-ref-card cd-help-search-card">
          <ReferenceCardTitle title="Search help" />
          <p>Search guides and common questions for the workflows in this dashboard.</p>
          <label className="cd-help-search"><Search size={17} /><input placeholder="Search help articles..." onKeyDown={(event) => {
            if (event.key === 'Enter') onAsk(`Help search: ${(event.currentTarget as HTMLInputElement).value}`)
          }} /></label>
          <span>Popular topics</span>
          <div className="cd-help-topic-row">
            {['Approvals', 'Forecasts', 'Integrations', 'Billing'].map((topic) => <button type="button" key={topic} onClick={() => onAsk(`Help topic: ${topic}`)}>{topic}</button>)}
          </div>
        </article>
        <article className="cd-ref-card cd-help-contact-card">
          <ReferenceCardTitle title="Get help fast" />
          <p>Use the support path that fits what you need right now.</p>
          <div className="cd-help-support-options">
            {supportOptions.map((option) => {
              const Icon = option.icon
              return (
                <div key={option.title}>
                  <Icon size={18} />
                  <strong>{option.title}</strong>
                  <span>{option.text}</span>
                  <button className={option.primary ? 'is-primary' : ''} type="button" onClick={option.onClick}>{option.action}</button>
                </div>
              )
            })}
          </div>
        </article>
      </section>

      <ReferenceSection title="Popular resources">
        <div className="cd-ref-three">
          {resources.map((resource) => {
            const Icon = resource.icon
            return (
              <article className="cd-ref-card cd-help-resource-card" key={resource.title}>
                <Icon size={20} />
                <div>
                  <h3>{resource.title}</h3>
                  <p>{resource.text}</p>
                  <button type="button" onClick={() => onAsk(`Help resource: ${resource.title}`)}>{resource.action}<ChevronRight size={14} /></button>
                </div>
              </article>
            )
          })}
        </div>
      </ReferenceSection>

      <ReferenceSection title="Recommended for you">
        <article className="cd-ref-card cd-help-recommended-card">
          {recommended.map(([title, text, action]) => (
            <div className="cd-help-recommended-row" key={title}>
              <FileText size={16} />
              <strong>{title}</strong>
              <span>{text}</span>
              <button type="button" onClick={() => onAsk(`Help article: ${title}`)}>{action}<ChevronRight size={14} /></button>
            </div>
          ))}
        </article>
      </ReferenceSection>

      <ReferenceSection title="System & account help">
        <div className="cd-ref-two">
          <article className="cd-ref-card cd-help-status-card">
            <ReferenceCardTitle title="System status" />
            <p>Current status of Coodra services used by this dashboard.</p>
            <div>
              {statuses.map((status) => <span key={status}><i />{status}<em>Operational</em></span>)}
            </div>
            <button type="button" onClick={() => onAsk('View Coodra system status page')}>View status page<ChevronRight size={14} /></button>
          </article>
          <article className="cd-ref-card cd-help-shortcuts-card">
            <ReferenceCardTitle title="Keyboard shortcuts & tips" />
            <p>Small shortcuts for moving through Coodra faster.</p>
            <div>
              {shortcuts.map(([keys, label]) => <span key={label}><kbd>{keys}</kbd>{label}</span>)}
            </div>
            <button type="button" onClick={() => onAsk('View all keyboard shortcuts and tips')}>View all shortcuts<ChevronRight size={14} /></button>
          </article>
        </div>
      </ReferenceSection>

      <article className="cd-ref-card cd-help-cta">
        <span><LifeBuoy size={22} /></span>
        <div>
          <strong>Still need help?</strong>
          <p>Reach out anytime or ask Coodra for instant answers about your current workflow.</p>
        </div>
        <button type="button" onClick={() => { window.location.href = 'mailto:support@coodra.com?subject=Coodra%20support%20request' }}><Mail size={15} />Email support</button>
        <button type="button" onClick={() => onAsk('Help')}><Sparkles size={15} />Ask Coodra</button>
      </article>
    </div>
  )
}

function DetailDrawer({
  item,
  onClose,
  onAsk,
  onDecisionStatusChange,
  busy,
  notice
}: {
  item: DrawerItem | null
  onClose: () => void
  onAsk: (context: string) => void
  onDecisionStatusChange: (item: DrawerItem, status: 'approved' | 'dismissed') => void
  busy: boolean
  notice: string
}) {
  const open = !!item
  const isDecision = item?.entityType === 'merchant_decision' && !!item.entityId
  const primaryLabel = busy ? 'Working...' : item?.primaryAction || 'Review with Coodra'
  return (
    <aside className={`cd-detail-drawer ${open ? 'is-open' : ''}`}>
      <div className="cd-chat-drawer__head">
        <div>
          <span className="cd-eyebrow">{item?.eyebrow || 'Details'}</span>
          <h2>{item?.title || 'Details'}</h2>
        </div>
        <button className="cd-icon-button" type="button" onClick={onClose} aria-label="Close details"><X size={18} /></button>
      </div>
      {item ? (
        <>
          <div className="cd-detail-summary">
            <p>{item.summary || 'Review the evidence and recommended next step.'}</p>
            <div>
              {item.impact ? <strong>{item.impact}</strong> : null}
              {item.status ? <StatusPill tone={item.tone}>{item.status}</StatusPill> : null}
            </div>
          </div>
          <div className="cd-detail-section">
            <h3>Why this matters</h3>
            <p>{item.why || item.summary || 'Coodra surfaced this because it may affect revenue, margin, stock position, or operating risk.'}</p>
          </div>
          <div className="cd-detail-grid">
            {(item.details || []).map((detail) => (
              <span key={detail.label}>
                <small>{detail.label}</small>
                <b>{detail.value}</b>
              </span>
            ))}
          </div>
          <div className="cd-detail-section">
            <h3>Recommended actions</h3>
            <p>{isDecision ? 'Approve or dismiss this recommendation. Coodra will record the decision and update the dashboard.' : 'Review the recommendation, check constraints, then decide the next step.'}</p>
          </div>
          {notice ? <div className={`cd-detail-notice ${notice.includes('could not') || notice.includes('failed') ? 'is-error' : 'is-success'}`}>{notice}</div> : null}
          <div className="cd-drawer-actions">
            <button
              className="cd-primary-button"
              type="button"
              disabled={busy}
              onClick={() => {
                if (isDecision) {
                  onDecisionStatusChange(item, item.primaryAction?.toLowerCase().includes('dismiss') ? 'dismissed' : 'approved')
                  return
                }
                onAsk(item.askContext || item.title)
              }}
            >{primaryLabel}</button>
            <button
              className="cd-small-ghost"
              type="button"
              disabled={busy}
              onClick={() => {
                if (isDecision) {
                  onDecisionStatusChange(item, 'dismissed')
                  return
                }
                onAsk(item.askContext || item.title)
              }}
            >{item.secondaryAction || (isDecision ? 'Dismiss' : 'Ask Coodra')}</button>
            <button className="cd-link-button" type="button" onClick={() => onAsk(item.askContext || item.title)}>Ask Coodra about this<ChevronRight size={15} /></button>
          </div>
        </>
      ) : null}
    </aside>
  )
}

type NotificationRow = {
  id: string
  title: string
  detail: string
  time: string
  tone: MetricTone
  page: DashboardPageId
}

function buildNotificationRows(data: DashboardData): NotificationRow[] {
  const rows: NotificationRow[] = []
  const reviewableDecisions = [...data.commandCenter.decisions, ...data.decisions.queue]
    .filter((decision) => ['suggested', 'pending'].includes(decision.status))
  const uniqueReviewableCount = new Set(reviewableDecisions.map((decision) => decision.id)).size

  if (uniqueReviewableCount > 0) {
    rows.push({
      id: 'decisions-review',
      title: `${uniqueReviewableCount} ${uniqueReviewableCount === 1 ? 'recommendation is' : 'recommendations are'} awaiting review`,
      detail: 'Recommendations are waiting for approval or dismissal.',
      time: 'Open',
      tone: 'amber',
      page: 'decisions'
    })
  }

  data.workspace.activity.slice(0, 3).forEach((activity) => {
    rows.push({
      id: `activity-${activity.id}`,
      title: activity.title,
      detail: activity.subtitle || activity.detail || 'Workspace event recorded.',
      time: activity.metric || activity.status || 'Logged',
      tone: activity.tone || 'neutral',
      page: 'workspace'
    })
  })

  data.workspace.integrations
    .filter((integration) => integration.status === 'Error' || integration.status === 'Pending')
    .slice(0, 2)
    .forEach((integration) => {
      rows.push({
        id: `integration-${integration.provider}`,
        title: `${integration.provider} ${integration.status.toLowerCase()}`,
        detail: integration.description,
        time: integration.lastSync || 'Needs review',
        tone: integration.status === 'Error' ? 'red' : 'amber',
        page: 'integrations'
      })
    })

  return rows.slice(0, 5)
}

function NotificationsPopover({ open, rows, onOpenPage }: { open: boolean; rows: NotificationRow[]; onOpenPage: (page: DashboardPageId) => void }) {
  const [readIds, setReadIds] = useState<string[]>([])
  const visibleRows = rows.filter((row) => !readIds.includes(row.id))
  const hasNotifications = rows.length > 0

  return (
    <div className={`cd-notification-popover ${open ? 'is-open' : ''}`} role="dialog" aria-label="Recent notifications" hidden={!open}>
      <div className="cd-notification-popover__head">
        <strong>Recent notifications</strong>
        <button type="button" disabled={!visibleRows.length} onClick={() => setReadIds(rows.map((row) => row.id))}>Mark all read</button>
      </div>
      <div className="cd-notification-list">
        {visibleRows.length ? visibleRows.map((row) => (
          <button className="cd-notification-row" type="button" key={row.id} onClick={() => onOpenPage(row.page)}>
            <span className={`cd-notification-dot is-${row.tone}`} />
            <span>
              <strong>{row.title}</strong>
              <small>{row.detail}</small>
            </span>
            <time>{row.time}</time>
          </button>
        )) : (
          <div className="cd-empty-row">No recent notifications.</div>
        )}
      </div>
      <button
        className="cd-notification-footer"
        type="button"
        disabled={!hasNotifications}
        onClick={() => onOpenPage('workspace')}
      >{hasNotifications ? 'View all notifications' : 'No notifications yet'}<ChevronRight size={14} /></button>
    </div>
  )
}

export default function NewDashboard({ user, data = dashboardFallbackData, initialTheme = 'light', onLogout }: NewDashboardProps) {
  const [activePage, setActivePage] = useState<DashboardPageId>('command-center')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [drawerContext, setDrawerContext] = useState('Current dashboard')
  const [chatWidth, setChatWidth] = useState(420)
  const [detailItem, setDetailItem] = useState<DrawerItem | null>(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [scopeMenuOpen, setScopeMenuOpen] = useState(false)
  const [dateMenuOpen, setDateMenuOpen] = useState(false)
  const [filterMenuPosition, setFilterMenuPosition] = useState<FilterMenuPosition>({ left: 0, top: 0 })
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [themeSaving, setThemeSaving] = useState(false)
  const [selectedStoreId, setSelectedStoreId] = useState('all')
  const [dateRange, setDateRange] = useState<DashboardDateRange>(() => defaultDashboardDateRange())
  const [customDateRange, setCustomDateRange] = useState<DashboardDateRange>(() => ({ ...defaultDashboardDateRange(), preset: 'custom' }))
  const [dashboardData, setDashboardData] = useState<DashboardData>(data)
  const [accountProfile, setAccountProfile] = useState<AccountProfile | null>(null)
  const [loadingData, setLoadingData] = useState(true)
  const [dataNotice, setDataNotice] = useState('')
  const [drawerBusy, setDrawerBusy] = useState(false)
  const [drawerNotice, setDrawerNotice] = useState('')
  const [availableDashboardBuildId, setAvailableDashboardBuildId] = useState('')
  const mainRef = useRef<HTMLElement | null>(null)
  const profileMenuRef = useRef<HTMLDivElement | null>(null)
  const allowBrowserNavigationRef = useRef(false)
  const mobileSwipeRef = useRef<{ active: boolean; startX: number; startY: number }>({ active: false, startX: 0, startY: 0 })
  const activeCopy = pageCopy[activePage]
  const greeting = useMemo(() => `Good morning, ${firstName(user)}`, [user])
  const notificationRows = useMemo(() => buildNotificationRows(dashboardData), [dashboardData])
  const dashboardFilters = useMemo(() => dashboardFiltersFromRange(dateRange, selectedStoreId), [dateRange, selectedStoreId])
  const hasDashboardUpdate = Boolean(availableDashboardBuildId && availableDashboardBuildId !== __COODRA_DASHBOARD_BUILD_ID__)
  const [systemPrefersDark, setSystemPrefersDark] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  ))
  const refreshDashboardData = useCallback(async () => {
    const result = await loadDashboardData(user.backendJwt, dashboardFilters)
    setDashboardData(withDateRangeLabels(result.data, dateRange))
    setDataNotice(result.usedFallback ? 'Some modules are using safe fallback states until their backend data is available.' : '')
    return result
  }, [dashboardFilters, dateRange, user.backendJwt])

  useEffect(() => {
    let cancelled = false
    loadAccountProfile(user.backendJwt).then((result) => {
      if (!cancelled && result.ok && result.data) setAccountProfile(result.data)
    })
    return () => {
      cancelled = true
    }
  }, [user.backendJwt])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const updatePreference = () => setSystemPrefersDark(media.matches)
    updatePreference()
    media.addEventListener('change', updatePreference)
    return () => media.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    let cancelled = false

    const checkForDashboardUpdate = async () => {
      try {
        const response = await fetch(`${DASHBOARD_VERSION_URL}?t=${Date.now()}`, { cache: 'no-store' })
        if (!response.ok) return
        const manifest = await response.json() as DashboardVersionManifest
        if (cancelled || !manifest.version) return
        setAvailableDashboardBuildId(manifest.version === __COODRA_DASHBOARD_BUILD_ID__ ? '' : manifest.version)
      } catch {
        if (!cancelled) setAvailableDashboardBuildId('')
      }
    }

    void checkForDashboardUpdate()
    const intervalId = window.setInterval(checkForDashboardUpdate, DASHBOARD_UPDATE_CHECK_INTERVAL_MS)
    const checkWhenVisible = () => {
      if (document.visibilityState === 'visible') void checkForDashboardUpdate()
    }

    window.addEventListener('focus', checkForDashboardUpdate)
    document.addEventListener('visibilitychange', checkWhenVisible)

    return () => {
      cancelled = true
      window.clearInterval(intervalId)
      window.removeEventListener('focus', checkForDashboardUpdate)
      document.removeEventListener('visibilitychange', checkWhenVisible)
    }
  }, [])

  useEffect(() => {
    if (!profileMenuOpen) return

    const closeOnOutsidePointer = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node) || !profileMenuRef.current) return
      if (!profileMenuRef.current.contains(target)) setProfileMenuOpen(false)
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setProfileMenuOpen(false)
    }

    window.addEventListener('pointerdown', closeOnOutsidePointer)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.removeEventListener('pointerdown', closeOnOutsidePointer)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [profileMenuOpen])

  useEffect(() => {
    let cancelled = false
    setLoadingData(true)
    loadDashboardData(user.backendJwt, dashboardFilters)
      .then((result) => {
        if (cancelled) return
        setDashboardData(withDateRangeLabels(result.data, dateRange))
        setDataNotice(result.usedFallback ? 'Some modules are using safe fallback states until their backend data is available.' : '')
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setDashboardData(withDateRangeLabels(data, dateRange))
        setDataNotice(err instanceof Error ? err.message : 'Dashboard data could not be loaded.')
      })
      .finally(() => {
        if (!cancelled) setLoadingData(false)
      })

    return () => {
      cancelled = true
    }
  }, [dashboardFilters, data, dateRange, user.backendJwt])

  const isMobileViewport = useCallback(() => window.matchMedia('(max-width: 760px)').matches, [])

  const scrollDashboardTop = useCallback((behavior: ScrollBehavior = 'smooth') => {
    window.requestAnimationFrame(() => {
      const target = mainRef.current
      if (target) {
        target.scrollTo({ top: 0, behavior })
        return
      }
      window.scrollTo({ top: 0, behavior })
    })
  }, [])

  const openAsk = (context: string) => {
    setMobileNavOpen(false)
    setProfileMenuOpen(false)
    setDetailItem(null)
    setNotificationsOpen(false)
    setScopeMenuOpen(false)
    setDateMenuOpen(false)
    setDrawerContext(context)
    setDrawerOpen(true)
  }

  const openDetail = (item: DrawerItem) => {
    setMobileNavOpen(false)
    setProfileMenuOpen(false)
    setDrawerOpen(false)
    setNotificationsOpen(false)
    setScopeMenuOpen(false)
    setDateMenuOpen(false)
    setDrawerNotice('')
    setDetailItem(item)
  }

  const changeDecisionStatus = async (item: DrawerItem, status: 'approved' | 'dismissed') => {
    if (!item.entityId) return
    const reasonCode = status === 'dismissed' ? window.prompt('Why dismiss this recommendation?', 'wrong_timing') : ''
    if (status === 'dismissed' && reasonCode === null) return
    const confirmed = window.confirm(status === 'approved'
      ? `Approve "${item.title}"?`
      : `Dismiss "${item.title}"?`)
    if (!confirmed) return
    setDrawerBusy(true)
    setDrawerNotice('')
    const result = await updateMerchantDecisionStatus(item.entityId, status, user.backendJwt, {
      reasonCode: status === 'dismissed' ? reasonCode || 'other' : undefined,
      reasonText: status === 'dismissed' ? reasonCode || undefined : undefined
    })
    setDrawerBusy(false)
    if (!result.ok) {
      setDrawerNotice(result.error || 'Decision could not be updated.')
      return
    }
    setDrawerNotice(status === 'approved' ? 'Decision approved.' : 'Recommendation dismissed.')
    await refreshDashboardData()
  }

  const openHelpPage = () => {
    setDrawerOpen(false)
    setDetailItem(null)
    setNotificationsOpen(false)
    setScopeMenuOpen(false)
    setDateMenuOpen(false)
    setProfileMenuOpen(false)
    setMobileNavOpen(false)
    setActivePage('help')
    scrollDashboardTop()
  }

  const openSettingsPage = () => {
    setDrawerOpen(false)
    setDetailItem(null)
    setNotificationsOpen(false)
    setScopeMenuOpen(false)
    setDateMenuOpen(false)
    setProfileMenuOpen(false)
    setMobileNavOpen(false)
    setActivePage('settings')
    scrollDashboardTop()
  }

  const closeSideDrawers = () => {
    setDrawerOpen(false)
    setDetailItem(null)
    setNotificationsOpen(false)
    setScopeMenuOpen(false)
    setDateMenuOpen(false)
  }

  const openPage = (pageId: DashboardPageId) => {
    setDrawerOpen(false)
    setDetailItem(null)
    setNotificationsOpen(false)
    setScopeMenuOpen(false)
    setDateMenuOpen(false)
    setProfileMenuOpen(false)
    setMobileNavOpen(false)
    setActivePage(pageId)
    scrollDashboardTop()
  }

  const openMobileNav = useCallback(() => {
    setDrawerOpen(false)
    setDetailItem(null)
    setNotificationsOpen(false)
    setScopeMenuOpen(false)
    setDateMenuOpen(false)
    setProfileMenuOpen(false)
    setMobileNavOpen(true)
  }, [])

  useEffect(() => {
    const pushDashboardGuard = () => {
      try {
        window.history.pushState({ ...(window.history.state || {}), coodraDashboardGuard: true }, '', window.location.href)
      } catch {
        // Some embedded/privacy contexts can block history writes.
      }
    }

    pushDashboardGuard()
    const handlePopState = () => {
      if (allowBrowserNavigationRef.current) return
      setMobileNavOpen(true)
      pushDashboardGuard()
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (!touch || mobileNavOpen || touch.clientX > 28) return
      mobileSwipeRef.current = { active: true, startX: touch.clientX, startY: touch.clientY }
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (!mobileSwipeRef.current.active) return
      const touch = event.touches[0]
      if (!touch) return
      const dx = touch.clientX - mobileSwipeRef.current.startX
      const dy = Math.abs(touch.clientY - mobileSwipeRef.current.startY)
      if (dx > 12 && dx > dy * 1.25) event.preventDefault()
      if (dx > 58 && dy < 70) {
        openMobileNav()
        mobileSwipeRef.current.active = false
      }
    }

    const handleTouchEnd = () => {
      mobileSwipeRef.current.active = false
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [mobileNavOpen, openMobileNav])

  const startChatResize = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    const startX = event.clientX
    const startWidth = chatWidth
    let frame = 0
    const onMove = (moveEvent: MouseEvent) => {
      const nextWidth = Math.min(760, Math.max(360, startWidth + (startX - moveEvent.clientX)))
      if (frame) window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        setChatWidth(nextWidth)
        frame = 0
      })
    }
    const onUp = () => {
      if (frame) window.cancelAnimationFrame(frame)
      document.body.classList.remove('cd-is-resizing-chat')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    document.body.classList.add('cd-is-resizing-chat')
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const page = (() => {
    switch (activePage) {
      case 'command-center':
        return <CommandCenterPage data={dashboardData} openDetail={openDetail} onAsk={openAsk} onOpenPage={openPage} />
      case 'decisions':
        return <DecisionsPage data={dashboardData} openDetail={openDetail} onAsk={openAsk} />
      case 'merchandise':
        return <MerchandisePage data={dashboardData} openDetail={openDetail} onAsk={openAsk} />
      case 'operations':
        return <OperationsPage data={dashboardData} openDetail={openDetail} onAsk={openAsk} />
      case 'intelligence':
        return <IntelligencePage data={dashboardData} onAsk={openAsk} />
      case 'integrations':
        return <IntegrationsPage data={dashboardData} user={user} onRefresh={refreshDashboardData} />
      case 'workspace':
        return <WorkspacePage data={dashboardData} onAsk={openAsk} onOpenPage={openPage} />
      case 'settings':
        return <SettingsPage user={user} data={dashboardData} profile={accountProfile} onProfileChanged={setAccountProfile} />
      case 'help':
        return <HelpPage onAsk={openAsk} />
      default:
        return null
    }
  })()
  const sidePanelOpen = drawerOpen || !!detailItem
  const shellStyle = sidePanelOpen ? ({ '--cd-chat-width': `${chatWidth}px` } as CSSProperties) : undefined
  const requestedTheme = dashboardThemeFromProfile(accountProfile, initialTheme)
  const resolvedTheme = requestedTheme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : requestedTheme
  useEffect(() => {
    const background = resolvedTheme === 'dark' ? '#080808' : '#f8fafa'
    document.documentElement.setAttribute('data-so-rc-theme', resolvedTheme)
    document.documentElement.style.backgroundColor = background
    document.body.setAttribute('data-so-rc-theme', resolvedTheme)
    document.body.style.backgroundColor = background
  }, [resolvedTheme])
  const profileSubtitle = user.company ? `${user.company} Admin` : 'Coodra Admin'
  const sidebarAvatar = accountProfile?.avatar_data_url || accountProfile?.avatar_url || ''
  const currentBusinessLabel = businessLabel(user, accountProfile)
  const storeOptions: StoreOption[] = useMemo(() => [
    { id: 'all', label: 'All stores', subtitle: currentBusinessLabel },
    ...(dashboardData.stores?.length
      ? dashboardData.stores.map((store) => ({ id: store.id, label: store.name, subtitle: store.subtitle || currentBusinessLabel }))
      : [{ id: 'synced-store-placeholder', label: 'Individual stores', subtitle: 'Appears after location-level sync is enabled', disabled: true }])
  ], [currentBusinessLabel, dashboardData.stores])
  useEffect(() => {
    if (selectedStoreId === 'all') return
    if (!storeOptions.some((store) => store.id === selectedStoreId && !store.disabled)) {
      setSelectedStoreId('all')
    }
  }, [selectedStoreId, storeOptions])
  const selectedStore = storeOptions.find((store) => store.id === selectedStoreId) || storeOptions[0]
  const dashboardScopeLabel = selectedStore.id === 'all' ? 'All stores' : selectedStore.label
  const dashboardDate = dateRangeLabel(dateRange)
  const toggleProfileTheme = async () => {
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    persistDashboardThemePreference(user, nextTheme)
    const nextSettings = { ...mergeDashboardSettings(accountProfile?.dashboard_settings), theme: nextTheme }
    const previousProfile = accountProfile
    const nextProfile: AccountProfile = {
      ...(accountProfile || {}),
      business_name: accountProfile?.business_name || user.company || '',
      contact_email: accountProfile?.contact_email || user.email,
      dashboard_settings: nextSettings
    }
    setAccountProfile(nextProfile)
    setThemeSaving(true)
    const result = await updateAccountProfile(user.backendJwt, {
      business_name: nextProfile.business_name || user.company || null,
      contact_email: nextProfile.contact_email || user.email,
      avatar_url: nextProfile.avatar_url || null,
      avatar_data_url: nextProfile.avatar_data_url || null,
      dashboard_settings: nextSettings
    })
    setThemeSaving(false)
    if (result.ok && result.data) {
      setAccountProfile(result.data)
      return
    }
    setAccountProfile(previousProfile)
    persistDashboardThemePreference(user, resolvedTheme)
  }
  const applyPresetDateRange = (preset: DashboardDatePreset) => {
    const nextRange = presetDateRange(preset)
    setDateRange(nextRange)
    setCustomDateRange({ ...nextRange, preset: 'custom' })
    setDateMenuOpen(false)
    scrollDashboardTop('auto')
  }
  const applyCustomDateRange = () => {
    if (!customDateRange.from || !customDateRange.to) return
    const normalizedRange = customDateRange.from <= customDateRange.to
      ? customDateRange
      : { ...customDateRange, from: customDateRange.to, to: customDateRange.from }
    setDateRange({ ...normalizedRange, preset: 'custom' })
    setDateMenuOpen(false)
    scrollDashboardTop('auto')
  }
  const positionFilterMenu = (event: ReactMouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    if (isMobileViewport()) {
      setFilterMenuPosition({
        left: 14,
        top: rect.bottom + 8
      })
      return
    }
    setFilterMenuPosition({
      left: Math.max(12, Math.min(rect.left, window.innerWidth - 380)),
      top: rect.bottom + 10
    })
  }
  const handleLogout = () => {
    allowBrowserNavigationRef.current = true
    setMobileNavOpen(false)
    setProfileMenuOpen(false)
    void onLogout()
  }

  const handleDashboardUpdate = () => {
    allowBrowserNavigationRef.current = true
    window.location.reload()
  }

  return (
    <div className={`cd-app-shell cd-theme-${resolvedTheme} ${sidePanelOpen ? 'has-chat' : ''} ${sidebarCollapsed ? 'is-sidebar-collapsed' : ''} ${mobileNavOpen ? 'is-mobile-nav-open' : ''}`} data-theme={resolvedTheme} data-theme-preference={requestedTheme} style={shellStyle}>
      <div className="cd-mobile-edge-swipe" aria-hidden="true" />
      <button
        className="cd-mobile-nav-overlay"
        type="button"
        aria-label="Close navigation"
        aria-hidden={!mobileNavOpen}
        hidden={!mobileNavOpen}
        tabIndex={mobileNavOpen ? 0 : -1}
        onClick={() => setMobileNavOpen(false)}
      />
      <aside className="cd-sidebar">
        <div className="cd-brand">
          <div className="cd-brand__copy">
            <img
              className="cd-brand-logo cd-brand-logo--full"
              src="/images/brand/coodra-new-logo-cropped.png"
              alt="Coodra"
            />
            <img
              className="cd-brand-logo cd-brand-logo--mark"
              src="/images/brand/coodra-logo-mark.png"
              alt="Coodra"
            />
          </div>
          <div className="cd-brand__controls">
            <button
              className="cd-sidebar-toggle"
              type="button"
              onClick={() => {
                if (isMobileViewport()) {
                  setMobileNavOpen(false)
                  return
                }
                setSidebarCollapsed((collapsed) => !collapsed)
              }}
              aria-label={mobileNavOpen ? 'Close navigation' : sidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}
              aria-pressed={mobileNavOpen ? true : sidebarCollapsed}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
        <nav className="cd-nav" aria-label="Dashboard navigation">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button className={activePage === item.id ? 'is-active' : ''} key={item.id} type="button" onClick={() => openPage(item.id)} title={sidebarCollapsed ? item.label : undefined}>
                <Icon size={18} />
                <span>
                  <strong>{item.label}</strong>
                </span>
              </button>
            )
          })}
        </nav>
        {hasDashboardUpdate ? (
          <aside className="cd-update-card" aria-label="Dashboard update available">
            <div className="cd-update-card__header">
              <span className="cd-update-card__icon" aria-hidden="true">🚀</span>
              <p>New Feature</p>
            </div>
            <span>Update to get the latest dashboard improvements.</span>
            <div className="cd-update-card__actions">
              <a href="#dashboard-update">View details</a>
              <button type="button" onClick={handleDashboardUpdate}>Update</button>
            </div>
          </aside>
        ) : null}
        {hasDashboardUpdate ? (
          <button
            className="cd-update-compact"
            type="button"
            onClick={handleDashboardUpdate}
            aria-label="Update dashboard"
            title="Update available"
          >
            <span aria-hidden="true">🚀</span>
            <Sparkles size={14} />
          </button>
        ) : null}
        <div className="cd-sidebar__bottom" ref={profileMenuRef}>
          {profileMenuOpen ? (
            <div className="cd-profile-menu" role="menu" aria-label="Profile menu">
              <button type="button" role="menuitem" onClick={openSettingsPage}><Settings size={16} /><span>Settings</span></button>
              <button type="button" role="menuitem" onClick={openHelpPage}><CircleHelp size={16} /><span>Help</span></button>
              <button className="cd-profile-theme-toggle" type="button" role="menuitem" onClick={toggleProfileTheme} disabled={themeSaving}>
                {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                <span>{themeSaving ? 'Saving theme...' : resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
              </button>
              <button className="is-danger" type="button" role="menuitem" onClick={handleLogout}><LogOut size={16} /><span>Log out</span></button>
            </div>
          ) : null}
          <button
            className={`cd-profile-card ${profileMenuOpen ? 'is-open' : ''}`}
            type="button"
            onClick={() => {
              setDrawerOpen(false)
              setDetailItem(null)
              setNotificationsOpen(false)
              setScopeMenuOpen(false)
              setDateMenuOpen(false)
              setProfileMenuOpen((open) => !open)
            }}
            aria-label="Open profile menu"
            aria-haspopup="menu"
            aria-expanded={profileMenuOpen}
          >
            <div className="cd-avatar">{sidebarAvatar ? <img src={sidebarAvatar} alt="" /> : firstName(user).slice(0, 1).toUpperCase()}</div>
            <div>
              <strong>{firstName(user)}</strong>
              <small>{profileSubtitle}</small>
            </div>
            <ChevronRight className="cd-profile-card__chevron" size={15} />
          </button>
        </div>
      </aside>
      <main className="cd-main" ref={mainRef}>
        <div className="cd-mobile-topbar">
          <button
            className="cd-mobile-menu-button"
            type="button"
            aria-label="Open navigation"
            aria-expanded={mobileNavOpen}
            onClick={openMobileNav}
          >
            <ChevronRight size={20} />
          </button>
          <div className="cd-mobile-topbar__actions">
            <div className="cd-notification-anchor cd-mobile-notification-anchor">
              <button
                className={`cd-notification-button ${notificationsOpen ? 'is-open' : ''}`}
                type="button"
                aria-label="Open notifications"
                aria-expanded={notificationsOpen}
                onClick={() => {
                  setDrawerOpen(false)
                  setDetailItem(null)
                  setScopeMenuOpen(false)
                  setDateMenuOpen(false)
                  setNotificationsOpen((open) => !open)
                }}
              >
                <Bell size={20} />
                {notificationRows.length ? <span>{notificationRows.length}</span> : null}
              </button>
              <NotificationsPopover open={notificationsOpen} rows={notificationRows} onOpenPage={openPage} />
            </div>
            <button className="cd-primary-button" type="button" onClick={() => openAsk(activeCopy.title)}><Sparkles size={17} />Ask Coodra</button>
          </div>
        </div>
        <header className="cd-page-header">
          <div className="cd-header-actions">
            <div className="cd-header-actions__left">
              <div className="cd-filter-anchor">
                <button
                  className={`cd-filter-button ${scopeMenuOpen ? 'is-open' : ''}`}
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded={scopeMenuOpen}
                  onClick={(event) => {
                    positionFilterMenu(event)
                    setDrawerOpen(false)
                    setDetailItem(null)
                    setNotificationsOpen(false)
                    setDateMenuOpen(false)
                    setScopeMenuOpen((open) => !open)
                  }}
                >
                  <Store size={16} />{dashboardScopeLabel}<ChevronDown size={15} />
                </button>
                <div className={`cd-filter-menu cd-scope-menu ${scopeMenuOpen ? 'is-open' : ''}`} style={filterMenuPosition} role="dialog" aria-label="Business and store filter" hidden={!scopeMenuOpen}>
                  <div className="cd-filter-menu__head">
                    <strong>{currentBusinessLabel}</strong>
                    <span>Choose the business view for this dashboard.</span>
                  </div>
                  <div className="cd-filter-menu__list">
                    {storeOptions.map((store) => (
                      <button
                        key={store.id}
                        type="button"
                        disabled={store.disabled}
                        className={selectedStoreId === store.id ? 'is-selected' : ''}
                        onClick={() => {
                          if (store.disabled) return
                          setSelectedStoreId(store.id)
                          setScopeMenuOpen(false)
                          scrollDashboardTop('auto')
                        }}
                      >
                        <span>
                          <strong>{store.label}</strong>
                          {store.subtitle ? <small>{store.subtitle}</small> : null}
                        </span>
                        {selectedStoreId === store.id ? <Check size={15} /> : null}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="cd-filter-anchor">
                <button
                  className={`cd-filter-button ${dateMenuOpen ? 'is-open' : ''}`}
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded={dateMenuOpen}
                  onClick={(event) => {
                    positionFilterMenu(event)
                    setDrawerOpen(false)
                    setDetailItem(null)
                    setNotificationsOpen(false)
                    setScopeMenuOpen(false)
                    setDateMenuOpen((open) => !open)
                  }}
                >
                  <Calendar size={16} />{dashboardDate}<ChevronDown size={15} />
                </button>
                <div className={`cd-filter-menu cd-date-menu ${dateMenuOpen ? 'is-open' : ''}`} style={filterMenuPosition} role="dialog" aria-label="Dashboard date range" hidden={!dateMenuOpen}>
                  <div className="cd-filter-menu__head">
                    <strong>Date range</strong>
                    <span>Metrics compare against the matching previous period.</span>
                  </div>
                  <div className="cd-date-presets" aria-label="Quick date ranges">
                    {(['last_7_days', 'last_30_days', 'this_month', 'last_month', 'quarter_to_date', 'year_to_date'] as DashboardDatePreset[]).map((preset) => (
                      <button key={preset} type="button" className={dateRange.preset === preset ? 'is-selected' : ''} onClick={() => applyPresetDateRange(preset)}>
                        {dateRangeLabel(presetDateRange(preset))}
                      </button>
                    ))}
                  </div>
                  <div className="cd-date-inputs">
                    <label>
                      <span>From</span>
                      <input
                        id="dashboard-date-from"
                        name="dashboard-date-from"
                        type="date"
                        value={customDateRange.from}
                        onChange={(event) => setCustomDateRange((range) => ({ ...range, preset: 'custom', from: event.target.value }))}
                      />
                    </label>
                    <label>
                      <span>To</span>
                      <input
                        id="dashboard-date-to"
                        name="dashboard-date-to"
                        type="date"
                        value={customDateRange.to}
                        onChange={(event) => setCustomDateRange((range) => ({ ...range, preset: 'custom', to: event.target.value }))}
                      />
                    </label>
                  </div>
                  <button className="cd-date-apply" type="button" onClick={applyCustomDateRange}>Apply range</button>
                </div>
              </div>
            </div>
            <div className="cd-header-actions__right">
              <div className="cd-notification-anchor">
                <button
                  className={`cd-notification-button ${notificationsOpen ? 'is-open' : ''}`}
                  type="button"
                  aria-label="Open notifications"
                  aria-expanded={notificationsOpen}
                  onClick={() => {
                    setDrawerOpen(false)
                    setDetailItem(null)
                    setScopeMenuOpen(false)
                    setDateMenuOpen(false)
                    setNotificationsOpen((open) => !open)
                  }}
                >
                  <Bell size={16} />
                  {notificationRows.length ? <span>{notificationRows.length}</span> : null}
                </button>
                <NotificationsPopover open={notificationsOpen} rows={notificationRows} onOpenPage={openPage} />
              </div>
              <label className="cd-search">
                <Search size={16} />
                <input id="cd-dashboard-search" name="dashboard-search" placeholder={activePage === 'decisions' ? 'Search decisions...' : activePage === 'merchandise' ? 'Search products, SKUs...' : 'Search anything...'} onKeyDown={(event) => {
                  if (event.key !== 'Enter') return
                  const value = event.currentTarget.value.trim()
                  if (value) openAsk(`Search ${activeCopy.title}: ${value}`)
                }} />
                <span className="cd-search-kbd">⌘K</span>
              </label>
              <button className="cd-primary-button" type="button" onClick={() => openAsk(activeCopy.title)}><Sparkles size={17} />Ask Coodra</button>
            </div>
          </div>
          <div className="cd-page-title-block">
            <span className="cd-date">{todayLabel()}</span>
            <h1>{activePage === 'command-center' ? greeting : activeCopy.title}</h1>
            <p>{activeCopy.subtitle}</p>
          </div>
        </header>
        {loadingData || dataNotice ? (
          <div className={`cd-data-notice ${loadingData ? 'is-loading' : ''}`}>
            <Sparkles size={16} />
            <span>{loadingData ? 'Loading live Coodra data...' : dataNotice}</span>
          </div>
        ) : null}
        {page}
      </main>
      <AskDrawer open={drawerOpen} context={drawerContext} user={user} onClose={closeSideDrawers} onResizeStart={startChatResize} />
      <DetailDrawer item={detailItem} onClose={closeSideDrawers} onAsk={openAsk} onDecisionStatusChange={changeDecisionStatus} busy={drawerBusy} notice={drawerNotice} />
    </div>
  )
}

