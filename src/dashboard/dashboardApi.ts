import { dashboardFallbackData } from './dashboardData'
import type { DashboardData, IntegrationCard, MerchantDecision, MetricCardData, ProfitSeriesPoint, SimpleRow } from './dashboardTypes'

type ApiResult<T> = {
  ok: boolean
  data?: T
  error?: string
}

export type LoadResult = {
  data: DashboardData
  usedFallback: boolean
  errors: string[]
}

export type DashboardLoadFilters = {
  dateFrom?: string
  dateTo?: string
  datePreset?: string
  businessId?: string
  storeId?: string
}

const DASHBOARD_REQUEST_TIMEOUT_MS = 8000

function apiBase() {
  return String(window.__COODRA_API_BASE__ || import.meta.env.VITE_API_URL || 'https://api.coodra.com').replace(/\/+$/, '')
}

function headers(jwt: string) {
  return {
    Accept: 'application/json',
    Authorization: `Bearer ${jwt}`
  }
}

function humanApiError(error: string) {
  const normalized = error.trim().toLowerCase()
  const messages: Record<string, string> = {
    company_not_resolved: 'Your company workspace could not be resolved for this action.',
    missing_company: 'Your company workspace could not be resolved for this action.',
    integration_not_configured: 'This integration is not configured for this workspace yet.',
    provider_not_configured: 'This integration is not configured for this workspace yet.',
    request_timeout: 'The request timed out. Please try again.'
  }
  return messages[normalized] || error
}

function withDashboardFilters(path: string, filters: DashboardLoadFilters = {}) {
  const [basePath, query = ''] = path.split('?')
  const params = new URLSearchParams(query)
  if (filters.dateFrom) params.set('date_from', filters.dateFrom)
  if (filters.dateTo) params.set('date_to', filters.dateTo)
  if (filters.datePreset) params.set('date_preset', filters.datePreset)
  if (filters.businessId) params.set('business_id', filters.businessId)
  if (filters.storeId && filters.storeId !== 'all') params.set('store_id', filters.storeId)
  const nextQuery = params.toString()
  return nextQuery ? `${basePath}?${nextQuery}` : basePath
}

export async function getJson<T>(path: string, jwt: string, timeoutMs = DASHBOARD_REQUEST_TIMEOUT_MS): Promise<ApiResult<T>> {
  const controller = new AbortController()
  const timeoutId = globalThis.setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(`${apiBase()}${path}`, { headers: headers(jwt), signal: controller.signal })
    const json = await res.json().catch(() => null) as T | null
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` }
    return { ok: true, data: json || undefined }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { ok: false, error: 'request_timeout' }
    }
    return { ok: false, error: err instanceof Error ? err.message : 'request_failed' }
  } finally {
    globalThis.clearTimeout(timeoutId)
  }
}

async function postJson<T>(
  path: string,
  jwt: string,
  payload: Record<string, unknown>,
  timeoutMs = DASHBOARD_REQUEST_TIMEOUT_MS
): Promise<ApiResult<T>> {
  const controller = new AbortController()
  const timeoutId = globalThis.setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(`${apiBase()}${path}`, {
      method: 'POST',
      headers: {
        ...headers(jwt),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    })
    const json = await res.json().catch(() => null) as T | null
    if (!res.ok) {
      const message = json && typeof json === 'object' && 'message' in json ? String((json as Record<string, unknown>).message || '') : ''
      const error = json && typeof json === 'object' && 'error' in json ? String((json as Record<string, unknown>).error || '') : ''
      return { ok: false, error: humanApiError(message || error || `HTTP ${res.status}`), data: json || undefined }
    }
    return { ok: true, data: json || undefined }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { ok: false, error: 'request_timeout' }
    }
    return { ok: false, error: err instanceof Error ? err.message : 'request_failed' }
  } finally {
    globalThis.clearTimeout(timeoutId)
  }
}

export type IntegrationConnectResult = {
  ok?: boolean
  provider?: string
  connectUrl?: string
  launch_url?: string
  configured?: boolean
  missing_fields?: string[]
  setup_mode?: string
  store_url?: string
  message?: string
  error?: string
}

export type IntegrationConnectionAction = 'disconnect' | 'set_primary' | 'connect_pending'

export type IntegrationConnectionActionResult = {
  ok?: boolean
  provider?: string
  action?: IntegrationConnectionAction
  status?: string
  message?: string
  error?: string
}

function normalizeProvider(provider: string) {
  return provider.trim().toLowerCase().replace(/\s+/g, '')
}

export type IntegrationConnectionPayload = {
  storeUrl?: string
  consumerKey?: string
  consumerSecret?: string
  baseUrl?: string
  database?: string
  username?: string
  apiKey?: string
}

export async function startIntegrationConnection(
  provider: string,
  jwt: string,
  options: IntegrationConnectionPayload = {}
): Promise<ApiResult<IntegrationConnectResult>> {
  const normalizedProvider = normalizeProvider(provider)
  const timeoutMs = options.storeUrl || options.consumerKey || options.consumerSecret || options.baseUrl || options.database || options.username || options.apiKey ? 25_000 : 12_000
  return postJson<IntegrationConnectResult>('/api/integrations/start', jwt, {
    provider: normalizedProvider,
    return_to: window.location.href,
    ...(options.storeUrl ? { store_url: options.storeUrl } : {}),
    ...(options.consumerKey ? { consumer_key: options.consumerKey } : {}),
    ...(options.consumerSecret ? { consumer_secret: options.consumerSecret } : {}),
    ...(options.baseUrl ? { base_url: options.baseUrl } : {}),
    ...(options.database ? { database: options.database } : {}),
    ...(options.username ? { username: options.username } : {}),
    ...(options.apiKey ? { api_key: options.apiKey } : {})
  }, timeoutMs)
}

export async function updateIntegrationConnection(
  provider: string,
  jwt: string,
  action: IntegrationConnectionAction
): Promise<ApiResult<IntegrationConnectionActionResult>> {
  return postJson<IntegrationConnectionActionResult>('/api/performance/connections', jwt, {
    provider: normalizeProvider(provider),
    action
  }, 12_000)
}

export function disconnectIntegrationConnection(provider: string, jwt: string) {
  return updateIntegrationConnection(provider, jwt, 'disconnect')
}

export type IntegrationSyncResult = {
  ok?: boolean
  provider?: string
  status?: string
  result?: {
    synced_products?: number
    synced_variants?: number
    synced_orders?: number
  }
  message?: string
  error?: string
}

export function syncIntegrationConnection(provider: string, jwt: string) {
  return postJson<IntegrationSyncResult>('/api/performance/sync', jwt, {
    provider: normalizeProvider(provider),
    syncType: 'FULL_SYNC',
    executeNow: true
  }, 60_000)
}

export type DecisionMutationStatus = 'approved' | 'dismissed' | 'executed' | 'open'

export type DecisionStatusResult = {
  ok?: boolean
  decision?: Record<string, unknown>
  error?: string
  message?: string
}

export function updateMerchantDecisionStatus(
  decisionId: string,
  status: DecisionMutationStatus,
  jwt: string,
  options: { reasonCode?: string; reasonText?: string } = {}
) {
  return postJson<DecisionStatusResult>('/api/retailer-plan', jwt, {
    action: 'merchant_decision_status',
    merchant_decision: {
      id: decisionId,
      status,
      reason_code: options.reasonCode,
      reason_text: options.reasonText
    }
  }, 12_000)
}

export type AccountProfile = {
  ok?: boolean
  business_name?: string | null
  contact_email?: string | null
  sign_in_email?: string | null
  avatar_url?: string | null
  avatar_data_url?: string | null
  dashboard_settings?: DashboardSettings
  error?: string
}

export type DashboardSettings = {
  notifications?: {
    email_enabled?: boolean
    weekly_digest?: boolean
    product_updates?: boolean
  }
  theme?: string
  reports?: {
    frequency?: string
    include_csv?: boolean
  }
}

export function loadAccountProfile(jwt: string) {
  return getJson<AccountProfile>('/api/retailer-plan?view=account_profile_status', jwt)
}

export function updateAccountProfile(jwt: string, profile: {
  business_name?: string | null
  contact_email?: string | null
  avatar_url?: string | null
  avatar_data_url?: string | null
  dashboard_settings?: DashboardSettings
}) {
  return postJson<AccountProfile>('/api/retailer-plan', jwt, {
    action: 'account_profile_update',
    ...profile
  }, 15_000)
}

export type MfaSecurityStatus = {
  ok?: boolean
  enabled?: boolean
  method?: string
  strict_sms?: boolean
  phone_verified_once?: boolean
  phone_e164?: string | null
  phone_masked?: string | null
  error?: string
}

export function loadMfaSecurity(jwt: string) {
  return getJson<MfaSecurityStatus>('/api/retailer-plan?view=mfa_security_status', jwt)
}

export function updateMfaSecurity(jwt: string, payload: { enabled?: boolean; strict_sms?: boolean; phone?: string }) {
  return postJson<MfaSecurityStatus>('/api/retailer-plan', jwt, {
    action: 'mfa_security_update',
    ...payload
  })
}

export function loadBillingPortal(jwt: string) {
  return getJson<{ ok?: boolean; portal_url?: string; redirect_url?: string; url?: string; error?: string }>('/api/retailer-plan?view=billing_portal', jwt, 12_000)
}

export function startBillingCheckout(jwt: string, planCode: string) {
  return postJson<{ ok?: boolean; mode?: string; redirect_url?: string; plan_code?: string; error?: string; message?: string }>('/api/retailer-plan', jwt, {
    action: 'billing_checkout',
    plan_code: planCode
  }, 12_000)
}

export function addTeamMember(jwt: string, payload: { email: string; role?: string }) {
  return postJson<{ ok?: boolean; team_members?: unknown[]; error?: string }>('/api/retailer-plan', jwt, {
    action: 'team_member_add',
    ...payload
  }, 12_000)
}

export function removeTeamMember(jwt: string, memberId: string) {
  return postJson<{ ok?: boolean; team_members?: unknown[]; error?: string }>('/api/retailer-plan', jwt, {
    action: 'team_member_remove',
    id: memberId
  }, 12_000)
}

export function createPurchaseOrderDraft(jwt: string, payload: Record<string, unknown>) {
  return postJson<{ ok?: boolean; purchase_order?: unknown; po?: unknown; error?: string }>('/api/retailer-plan', jwt, {
    action: 'po_create_draft',
    ...payload
  }, 12_000)
}

export function updatePurchaseOrderStatus(jwt: string, poId: string, status: string) {
  return postJson<{ ok?: boolean; purchase_order?: unknown; po?: unknown; error?: string }>('/api/retailer-plan', jwt, {
    action: 'po_update_status',
    po_id: poId,
    status
  }, 12_000)
}

export type DashboardChatAttachment = {
  name: string
  type: string
  size: number
  text?: string
}

export type DashboardChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type DashboardChatResponse = {
  id?: string
  choices?: Array<{ message?: { content?: string } }>
  message?: string
  error?: string
}

export type DashboardChatPayload = {
  messages: DashboardChatMessage[]
  sessionId: string
  context?: string
  firstName?: string
  attachments?: DashboardChatAttachment[]
  performanceContext?: Record<string, unknown>
}

function dashboardChatPayload(payload: DashboardChatPayload) {
  const lastUserMessage = [...payload.messages].reverse().find((message) => message.role === 'user')?.content || ''
  const attachmentText = payload.attachments?.length
    ? `Attached files:\n${payload.attachments.map((attachment) => {
      const text = attachment.text ? `\n${attachment.text.slice(0, 12_000)}` : '\nFile content was not readable in the browser; use the filename and type only.'
      return `- ${attachment.name} (${attachment.type || 'unknown'}, ${attachment.size} bytes)${text}`
    }).join('\n')}`
    : ''

  return {
    sessionId: payload.sessionId,
    userText: lastUserMessage,
    messages: payload.messages,
    dashboard_context: payload.context || undefined,
    attachment_context: attachmentText || undefined,
    client_profile: {
      first_name: payload.firstName || undefined
    },
    performance_context: payload.performanceContext || undefined
  }
}

export function sendDashboardChat(jwt: string, payload: DashboardChatPayload) {
  return postJson<DashboardChatResponse>('/api/chat', jwt, dashboardChatPayload(payload), 45_000)
}

function cleanChatStatusLabel(label: string) {
  const cleaned = String(label || '')
    .replace(/\btool[_-]?started\b/gi, '')
    .replace(/\btool[_-]?finished\b/gi, '')
    .replace(/\btool[_-]?call\b/gi, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return cleaned || 'Preparing answer'
}

export async function streamDashboardChat(
  jwt: string,
  payload: DashboardChatPayload,
  handlers: {
    onStatus?: (label: string) => void
    onContent?: (content: string) => void
  } = {}
): Promise<ApiResult<DashboardChatResponse>> {
  const controller = new AbortController()
  const timeoutId = globalThis.setTimeout(() => controller.abort(), 60_000)
  try {
    const res = await fetch(`${apiBase()}/api/chat?stream=true`, {
      method: 'POST',
      headers: {
        ...headers(jwt),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...dashboardChatPayload(payload), stream: true }),
      signal: controller.signal
    })
    if (!res.ok || !res.body) {
      const json = await res.json().catch(() => null) as { error?: string; message?: string } | null
      return { ok: false, error: json?.message || json?.error || `HTTP ${res.status}` }
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let fullText = ''
    let finalText = ''
    let error = ''

    const handleLine = (line: string) => {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data:')) return
      const raw = trimmed.slice(5).trim()
      if (!raw || raw === '[DONE]') return
      try {
        const event = JSON.parse(raw) as { type?: string; content?: string; label?: string; message?: string }
        if (event.type === 'status' && event.label) {
          handlers.onStatus?.(cleanChatStatusLabel(event.label))
          return
        }
        if (event.type === 'content' && event.content) {
          fullText += event.content
          handlers.onContent?.(event.content)
          return
        }
        if (event.type === 'done') {
          finalText = String(event.content || fullText)
          return
        }
        if (event.type === 'error') {
          error = String(event.message || 'Ask Coodra could not respond right now.')
        }
      } catch {
        // Ignore malformed event chunks.
      }
    }

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split(/\r?\n/)
      buffer = lines.pop() || ''
      lines.forEach(handleLine)
    }
    if (buffer) handleLine(buffer)

    if (error) return { ok: false, error }
    const content = finalText || fullText
    return {
      ok: true,
      data: {
        message: content,
        choices: [{ message: { content } }]
      }
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { ok: false, error: 'request_timeout' }
    }
    return { ok: false, error: err instanceof Error ? err.message : 'request_failed' }
  } finally {
    globalThis.clearTimeout(timeoutId)
  }
}

function currency(value: unknown) {
  const n = Number(value || 0)
  if (!Number.isFinite(n)) return '$0'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function currencyFromCents(value: unknown) {
  return currency(Number(value || 0) / 100)
}

function percent(value: unknown) {
  const n = Number(value || 0)
  if (!Number.isFinite(n)) return '0%'
  return `${Math.round(n * (n <= 1 ? 100 : 1))}%`
}

function formatNumber(value: unknown) {
  const n = Number(value || 0)
  return new Intl.NumberFormat('en-US').format(Number.isFinite(n) ? n : 0)
}

function asArray<T = Record<string, unknown>>(value: unknown): T[] {
  return Array.isArray(value) ? value as T[] : []
}

function cleanText(value: unknown, fallback = '') {
  const text = String(value || '').trim()
  return text || fallback
}

function formatRelativeTime(value: unknown) {
  const raw = cleanText(value)
  if (!raw) return ''
  const time = Date.parse(raw)
  if (!Number.isFinite(time)) return raw
  const diffMs = Date.now() - time
  const absMs = Math.abs(diffMs)
  const minutes = Math.round(absMs / 60_000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(time))
}

function mapUrgency(value: unknown): MerchantDecision['urgency'] {
  const n = Number(value || 0)
  if (n >= 75) return 'High'
  if (n >= 45) return 'Medium'
  return 'Low'
}

function mapDecisions(rows: Record<string, unknown>[]): MerchantDecision[] {
  return rows.slice(0, 8).map((row, index) => ({
    id: cleanText(row.id, `decision-${index}`),
    title: cleanText(row.title, 'Retail decision'),
    why: cleanText(row.summary || row.reasoning, 'Coodra found a signal worth reviewing.'),
    category: cleanText(row.decision_type, 'Decision').replace(/_/g, ' '),
    action: cleanText(row.recommended_action, 'Review recommendation'),
    impact: currencyFromCents(row.financial_impact_estimate_cents),
    urgency: mapUrgency(row.urgency_score),
    confidence: Math.round(Number(row.confidence_score || 0.5) * 100),
    owner: 'Owner',
    due: 'Today',
    status: cleanText(row.status, 'suggested') as MerchantDecision['status'],
    createdAt: cleanText(row.created_at),
    approvedAt: cleanText(row.approved_at),
    dismissedAt: cleanText(row.dismissed_at),
    executedAt: cleanText(row.executed_at),
    decidedAt: cleanText(row.executed_at || row.approved_at || row.dismissed_at)
  }))
}

function mapSimpleRows(rows: Record<string, unknown>[], kind: 'sku' | 'price' | 'supplier' | 'promotion' | 'catalog'): SimpleRow[] {
  return rows.slice(0, 8).map((row, index) => {
    if (kind === 'sku') {
      return {
        id: cleanText(row.id, `sku-${index}`),
        title: cleanText(row.sku_id || row.primary_role, 'SKU role'),
        subtitle: cleanText(row.role_reason || row.primary_role, 'Assortment classification'),
        metric: percent(row.confidence_score),
        detail: cleanText(row.primary_role, '').replace(/_/g, ' '),
        status: 'Classified',
        tone: 'teal'
      }
    }
    if (kind === 'price') {
      return {
        id: cleanText(row.id, `price-${index}`),
        title: cleanText(row.sku_id, 'Price recommendation'),
        subtitle: cleanText(row.reason, 'Margin opportunity'),
        metric: currencyFromCents(row.estimated_monthly_impact_cents),
        status: cleanText(row.status, 'Open'),
        tone: 'green'
      }
    }
    if (kind === 'supplier') {
      return {
        id: cleanText(row.id, `supplier-${index}`),
        title: cleanText(row.supplier_id, 'Supplier'),
        subtitle: `Fill rate ${percent(row.fill_rate)} / lead time ${cleanText(row.avg_lead_time_days, '0')} days`,
        metric: cleanText(row.supplier_score, '0'),
        detail: cleanText(row.risk_level, 'watch'),
        tone: cleanText(row.risk_level, '').toLowerCase() === 'high' ? 'red' : 'teal'
      }
    }
    if (kind === 'promotion') {
      return {
        id: cleanText(row.id, `promotion-${index}`),
        title: cleanText(row.title || row.promotion_type, 'Promotion recommendation'),
        subtitle: cleanText(row.reason, 'Promotion opportunity'),
        metric: percent(row.confidence_score),
        status: cleanText(row.status, 'Open'),
        tone: 'blue'
      }
    }
    return {
      id: cleanText(row.id, `catalog-${index}`),
      title: cleanText(row.task_type, 'Catalog task').replace(/_/g, ' '),
      subtitle: cleanText(row.reason, 'Improve catalog readiness'),
      metric: cleanText(row.ai_readiness_score, ''),
      status: cleanText(row.status, 'Open'),
      tone: 'amber'
    }
  })
}

function mapIntegrations(rows: Record<string, unknown>[]): IntegrationCard[] {
  if (!rows.length) return []
  return rows.map((row) => ({
    provider: cleanText(row.provider, 'Integration').replace(/^./, (s) => s.toUpperCase()),
    description: 'Connected POS and commerce data source.',
    status: cleanText(row.status, 'Not connected').toLowerCase() === 'connected' ? 'Connected' : 'Pending',
    lastSync: formatRelativeTime(row.last_sync_at || row.lastSyncAt),
    accent: cleanText(row.status, '').toLowerCase() === 'connected' ? 'green' : 'amber'
  }))
}

function mapProfitSeries(rows: Record<string, unknown>[]): ProfitSeriesPoint[] {
  return rows
    .map((row, index) => {
      const month = cleanText(row.month || row.label || row.period, ['Jan', 'Feb', 'Mar', 'Apr', 'May'][index] || `M${index + 1}`)
      const thisYear = Number(row.thisYear ?? row.this_year ?? row.current ?? row.current_year ?? row.value)
      const lastYear = Number(row.lastYear ?? row.last_year ?? row.previous ?? row.previous_year ?? row.compare)
      if (!Number.isFinite(thisYear) || !Number.isFinite(lastYear)) return null
      return { month, thisYear, lastYear }
    })
    .filter((row): row is ProfitSeriesPoint => row !== null)
    .slice(0, 6)
}

function summarizeOutcomes(rows: Record<string, unknown>[]) {
  const measuredStatuses = new Set(['positive', 'neutral', 'negative', 'inconclusive', 'ordered'])
  const positiveStatuses = new Set(['positive', 'ordered'])
  const measured = rows.filter((row) => measuredStatuses.has(cleanText(row.outcome_status).toLowerCase()))
  const positive = measured.filter((row) => positiveStatuses.has(cleanText(row.outcome_status).toLowerCase()))
  const realizedImpactCents = rows.reduce((sum, row) => sum + Number(row.realized_impact_cents || 0), 0)
  const realizedMarginLiftCents = rows.reduce((sum, row) => sum + Number(row.realized_margin_lift_cents || 0), 0)
  const realizedMarginDollars = rows.reduce((sum, row) => sum + Number(row.realized_margin_dollars || 0), 0)
  const liftValue = realizedMarginLiftCents || realizedImpactCents || Math.round(realizedMarginDollars * 100)
  return {
    measuredCount: measured.length,
    positiveCount: positive.length,
    positiveRate: measured.length ? Math.round((positive.length / measured.length) * 100) : null,
    realizedImpactCents,
    realizedLiftCents: liftValue
  }
}

function summarizeAccuracy(rows: Record<string, unknown>[]) {
  if (!rows.length) return { accuracyPct: null as number | null, directionPct: null as number | null }
  const directionRows = rows.filter((row) => typeof row.direction_correct === 'boolean')
  const directionPct = directionRows.length
    ? Math.round((directionRows.filter((row) => row.direction_correct === true).length / directionRows.length) * 100)
    : null
  const pctErrors = rows.map((row) => Number(row.percentage_error)).filter((n) => Number.isFinite(n))
  const avgPctError = pctErrors.length ? pctErrors.reduce((a, b) => a + b, 0) / pctErrors.length : null
  const accuracyPct = avgPctError == null ? directionPct : Math.max(0, Math.min(100, Math.round((1 - avgPctError) * 100)))
  return { accuracyPct, directionPct }
}

function summarizeForecastAccuracy(rows: Record<string, unknown>[]) {
  if (!rows.length) return null
  const pctErrors = rows.map((row) => Number(row.percentage_error)).filter((n) => Number.isFinite(n))
  if (!pctErrors.length) return null
  const avgPctError = pctErrors.reduce((a, b) => a + b, 0) / pctErrors.length
  return Math.max(0, Math.min(100, Math.round((1 - avgPctError) * 100)))
}

function summarizeDismissals(rows: Record<string, unknown>[]): SimpleRow[] {
  if (!rows.length) return []
  const counts = new Map<string, number>()
  for (const row of rows) {
    const code = cleanText(row.reason_code, 'other')
    counts.set(code, (counts.get(code) || 0) + 1)
  }
  const total = rows.length || 1
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([code, count]) => ({
      id: code,
      title: code.replace(/_/g, ' ').replace(/\b\w/g, (s) => s.toUpperCase()),
      metric: String(count),
      detail: `${Math.round((count / total) * 100)}%`,
      tone: code === 'bad_recommendation' || code === 'missing_data' ? 'red' : 'amber'
    }))
}

function medianApprovalHours(rows: Record<string, unknown>[]) {
  const durations = rows
    .map((row) => {
      const created = Date.parse(cleanText(row.created_at))
      const approved = Date.parse(cleanText(row.approved_at || row.executed_at))
      if (!Number.isFinite(created) || !Number.isFinite(approved) || approved < created) return null
      return (approved - created) / 36e5
    })
    .filter((n): n is number => n != null)
    .sort((a, b) => a - b)
  if (!durations.length) return null
  const mid = Math.floor(durations.length / 2)
  return durations.length % 2 ? durations[mid] : (durations[mid - 1] + durations[mid]) / 2
}

function monthKey(value: unknown) {
  const raw = cleanText(value)
  const d = raw ? new Date(raw) : new Date()
  return Number.isFinite(d.getTime()) ? new Intl.DateTimeFormat('en-US', { month: 'short' }).format(d) : ''
}

function applyDecisionTrustMetrics(base: DashboardData, decisionRows: Record<string, unknown>[], outcomeRows: Record<string, unknown>[], accuracyRows: Record<string, unknown>[], dismissalRows: Record<string, unknown>[]) {
  const open = decisionRows.filter((row) => ['open', 'pending', 'suggested'].includes(cleanText(row.status).toLowerCase()))
  const approved = decisionRows.filter((row) => ['approved', 'executed'].includes(cleanText(row.status).toLowerCase()))
  const totalDecisions = decisionRows.length
  const projectedImpact = open.reduce((sum, row) => sum + Number(row.financial_impact_estimate_cents || 0), 0)
  const approvalRate = totalDecisions ? Math.round((approved.length / totalDecisions) * 100) : null
  const outcomes = summarizeOutcomes(outcomeRows)
  const accuracy = summarizeAccuracy(accuracyRows)
  const approvalHours = medianApprovalHours(decisionRows)
  const dismissed = summarizeDismissals(dismissalRows)

  base.decisions.metrics = [
    { label: 'Pending decisions', value: String(open.length), change: open.length ? `${open.length} open` : 'No open decisions', tone: open.length ? 'amber' : 'green' },
    { label: 'Projected impact', value: currencyFromCents(projectedImpact), change: open.length ? 'Open recommendations' : 'No open estimate', tone: 'teal' },
    { label: 'Approval rate', value: approvalRate == null ? 'Measuring' : `${approvalRate}%`, change: totalDecisions ? `${approved.length} of ${totalDecisions}` : 'Needs decisions', tone: approvalRate == null ? 'neutral' : 'green' },
    { label: 'Measured lift', value: outcomeRows.length ? currencyFromCents(outcomes.realizedLiftCents) : 'Measuring', change: outcomeRows.length ? `${outcomes.measuredCount} measured` : 'Needs outcomes', tone: outcomeRows.length ? 'green' : 'neutral' }
  ]

  base.commandCenter.outcomes = [
    { label: 'Decisions approved', value: String(approved.length), change: totalDecisions ? `${approved.length} approved` : 'Needs decisions', detail: 'Decision workflow', tone: 'teal' },
    { label: 'Positive outcome rate', value: outcomes.positiveRate == null ? 'Measuring' : `${outcomes.positiveRate}%`, change: outcomes.measuredCount ? `${outcomes.positiveCount} positive` : 'Needs measured outcomes', detail: 'Measured actions', tone: outcomes.positiveRate == null ? 'neutral' : 'green' },
    { label: 'Gross profit lift', value: outcomeRows.length ? currencyFromCents(outcomes.realizedLiftCents) : 'Measuring', change: outcomeRows.length ? 'Realized outcomes' : 'Needs settled actions', detail: 'Attributed', tone: outcomeRows.length ? 'green' : 'neutral' }
  ]

  base.decisions.dismissedReasons = dismissed
  base.decisions.approvalVelocity = {
    medianHours: approvalHours == null ? 'Measuring' : `${Number(approvalHours.toFixed(1))}h`,
    velocityChange: approvalHours == null ? 'Needs approvals' : 'Derived from approvals',
    predictionAccuracy: accuracy.accuracyPct == null ? 'Measuring' : `${accuracy.accuracyPct}%`,
    accuracyChange: accuracyRows.length ? `${accuracyRows.length} snapshots` : 'Needs outcomes',
    chart: buildApprovalAccuracyChart(decisionRows, accuracyRows)
  }
}

function buildApprovalAccuracyChart(decisionRows: Record<string, unknown>[], accuracyRows: Record<string, unknown>[]) {
  const buckets = new Map<string, { durations: number[]; accuracy: number[] }>()
  for (const row of decisionRows) {
    const created = Date.parse(cleanText(row.created_at))
    const approved = Date.parse(cleanText(row.approved_at || row.executed_at))
    if (!Number.isFinite(created) || !Number.isFinite(approved) || approved < created) continue
    const key = monthKey(row.approved_at || row.executed_at)
    const bucket = buckets.get(key) || { durations: [], accuracy: [] }
    bucket.durations.push((approved - created) / 36e5)
    buckets.set(key, bucket)
  }
  for (const row of accuracyRows) {
    const key = monthKey(row.measured_at)
    const bucket = buckets.get(key) || { durations: [], accuracy: [] }
    const pctError = Number(row.percentage_error)
    if (Number.isFinite(pctError)) bucket.accuracy.push(Math.max(0, Math.min(100, (1 - pctError) * 100)))
    else if (row.direction_correct === true) bucket.accuracy.push(100)
    else if (row.direction_correct === false) bucket.accuracy.push(0)
    buckets.set(key, bucket)
  }
  return [...buckets.entries()].slice(-6).map(([month, bucket]) => ({
    month,
    velocityHours: bucket.durations.length ? bucket.durations.reduce((a, b) => a + b, 0) / bucket.durations.length : 0,
    accuracyPct: bucket.accuracy.length ? bucket.accuracy.reduce((a, b) => a + b, 0) / bucket.accuracy.length : null
  }))
}

function updateMetricsFromPerformance(base: DashboardData, payload: Record<string, unknown>) {
  const summary = payload.summary as Record<string, unknown> | undefined
  const metrics = payload.metrics as Record<string, unknown> | undefined
  const dashboard = payload.dashboard as Record<string, unknown> | undefined
  const storeRows = asArray<Record<string, unknown>>(dashboard?.stores)
  base.stores = storeRows
    .map((store) => ({
      id: cleanText(store.id || store.store_id || store.location_id || ''),
      name: cleanText(store.name || store.store_name || store.location_name || 'Store'),
      subtitle: cleanText(store.weekSales || store.week_sales ? `${currency(store.weekSales || store.week_sales)} selected period sales` : '')
    }))
    .filter((store) => store.id && store.name)
  const revenue = summary?.revenue ?? metrics?.revenue ?? dashboard?.weekSales
  const units = summary?.unitsSold ?? metrics?.units_sold ?? dashboard?.weekOrders
  const margin = summary?.grossMarginPct ?? metrics?.gross_margin_pct ?? dashboard?.grossMargin
  const revenueSeries = asArray<number>(dashboard?.revenueSeries)
  const grossSeries = asArray<number>(dashboard?.grossSeries)
  const volumeSeries = asArray<number>(dashboard?.volumeSeries)
  const profitSeries = mapProfitSeries(asArray<Record<string, unknown>>(dashboard?.profitSeries || dashboard?.grossProfitSeries || dashboard?.outcomeProfitSeries))
  const revenueMetric: MetricCardData = { label: 'Revenue', value: currency(revenue), change: 'Live backend', detail: 'Connected data', tone: 'teal' }
  const marginMetric: MetricCardData = { label: 'Gross Margin', value: percent(margin), change: 'Live backend', detail: 'Margin rate', tone: 'green' }
  const unitsMetric: MetricCardData = { label: 'Units Sold', value: new Intl.NumberFormat('en-US').format(Number(units || 0)), change: 'Live backend', detail: 'Sales volume', tone: 'blue' }
  const lowInventory = asArray<Record<string, unknown>>(dashboard?.lowInventory)
  const lowInventoryAlerts = Number(dashboard?.lowInventoryAlerts || lowInventory.length || 0)
  const connected = asArray<Record<string, unknown>>(payload.connections).filter((row) => cleanText(row.status).toLowerCase() === 'connected').length

  base.commandCenter.metrics = [
    revenueMetric,
    marginMetric,
    unitsMetric,
    {
      label: 'Inventory Risks',
      value: String(lowInventoryAlerts),
      change: lowInventoryAlerts ? 'Needs reorder review' : 'No current risks',
      detail: 'Inventory-backed',
      tone: lowInventoryAlerts ? 'amber' : 'green'
    }
  ]
  base.intelligence.metrics = [
    revenueMetric,
    marginMetric,
    { label: 'Low inventory risks', value: String(lowInventoryAlerts), change: lowInventoryAlerts ? 'Needs reorder review' : 'No current risks', tone: lowInventoryAlerts ? 'amber' : 'green' },
    { label: 'Forecast Accuracy', value: 'Measuring', change: 'Needs forecast snapshots', tone: 'neutral' }
  ]
  base.operations.metrics = [
    { label: 'Inventory at risk', value: String(lowInventoryAlerts), change: lowInventoryAlerts ? 'At or below threshold' : 'No current risks', tone: lowInventoryAlerts ? 'amber' : 'green' },
    { label: 'Reorder queue', value: String(lowInventory.length), change: lowInventory.length ? 'Inventory-backed' : 'No reorder candidates', tone: lowInventory.length ? 'teal' : 'green' },
    { label: 'Open POs', value: '0', change: 'No PO records yet', tone: 'neutral' },
    { label: 'Connected systems', value: String(connected), change: 'Live integrations', tone: connected ? 'green' : 'amber' }
  ]
  base.merchandise.metrics = [
    { label: 'Products analyzed', value: formatNumber(units), change: 'Sales-backed volume', tone: 'teal' },
    { label: 'Top products tracked', value: String(asArray(dashboard?.topProducts).length || asArray(payload.dashboard && (payload.dashboard as Record<string, unknown>).topProducts).length || 0), change: 'From performance data', tone: 'blue' },
    { label: 'At-risk items', value: String(lowInventoryAlerts), change: lowInventoryAlerts ? 'Needs cleanup' : 'No current risks', tone: lowInventoryAlerts ? 'amber' : 'green' },
    { label: 'Catalog tasks', value: String(base.merchandise.catalogTasks.length), change: 'Readiness checks', tone: 'neutral' }
  ]
  if (revenueSeries.length) {
    base.commandCenter.metrics[0].spark = revenueSeries
    base.intelligence.performanceSeries = revenueSeries
  }
  if (grossSeries.length) {
    base.commandCenter.metrics[1].spark = grossSeries
  }
  if (volumeSeries.length) {
    base.commandCenter.metrics[2].spark = volumeSeries
    base.intelligence.forecastSeries = volumeSeries
  }
  if (profitSeries.length) {
    base.commandCenter.profitSeries = profitSeries
  }
  base.commandCenter.hero.impactValue = currency(Number(revenue || 0) * 0.18)

  const recommendations = asArray<Record<string, unknown>>(dashboard?.aiRecommendations)
  const performanceDecisions: MerchantDecision[] = recommendations.slice(0, 3).map((row, index) => ({
    id: cleanText(row.id, `performance-decision-${index}`),
    title: cleanText(row.headline, 'Review Coodra recommendation'),
    why: cleanText(row.reason, 'Coodra found a live performance signal worth reviewing.'),
    category: 'Signal',
    action: 'Review recommendation',
    impact: index === 0 ? currency(Number(revenue || 0) * 0.04) : currency(Number(revenue || 0) * 0.02),
    urgency: cleanText(row.confidence).toLowerCase() === 'high' ? 'High' : 'Medium',
    confidence: cleanText(row.confidence).toLowerCase() === 'high' ? 88 : 74,
    owner: 'Owner',
    due: 'Today',
    status: 'suggested'
  }))
  for (const item of lowInventory.slice(0, Math.max(0, 3 - performanceDecisions.length))) {
    performanceDecisions.push({
      id: cleanText(item.id, `low-inventory-${performanceDecisions.length}`),
      title: `Reorder ${cleanText(item.title, 'low-stock item')}`,
      why: `Available quantity is ${cleanText(item.available, 'low')} against a reorder threshold of ${cleanText(item.reorderThreshold, 'set')}.`,
      category: 'Reorder',
      action: 'Review reorder quantity',
      impact: currency(Number(revenue || 0) * 0.015),
      urgency: 'High',
      confidence: 86,
      owner: 'Owner',
      due: 'Today',
      status: 'pending'
    })
  }
  if (performanceDecisions.length) {
    base.commandCenter.decisions = performanceDecisions
    base.decisions.queue = performanceDecisions
    base.commandCenter.hero.title = `${performanceDecisions.length} decisions need your attention`
    base.commandCenter.hero.summary = `${cleanText(dashboard?.lowInventoryAlerts, '0')} low-inventory alerts and ${recommendations.length} AI recommendations are ready for review.`
  }

  base.operations.reorders = lowInventory.slice(0, 8).map((item, index) => ({
    id: cleanText(item.id || item.sku, `reorder-${index}`),
    title: cleanText(item.title || item.sku, 'Inventory item'),
    subtitle: `Available ${cleanText(item.available, '0')} / threshold ${cleanText(item.reorderThreshold, '0')}`,
    metric: cleanText(item.reorderThreshold, 'Review'),
    detail: cleanText(item.sku, 'SKU unavailable'),
    status: 'Review',
    tone: Number(item.available || 0) <= 0 ? 'red' : 'amber'
  }))
}

function updateWorkspaceFromLiveData(base: DashboardData, performance: Record<string, unknown> | undefined, usage: Record<string, unknown> | undefined, billing: Record<string, unknown> | undefined) {
  const connections = asArray<Record<string, unknown>>(performance?.connections)
  const connectedCount = connections.filter((row) => cleanText(row.status).toLowerCase() === 'connected').length
  const activeAutomations = base.workspace.automation.filter((row) => cleanText(row.status).toLowerCase() === 'active').length
  const planCode = cleanText(billing?.plan_code || usage?.plan_code, 'free')
  const planStatus = cleanText(billing?.status || usage?.status, 'active')
  const usageMetrics = usage?.metrics as Record<string, Record<string, unknown>> | undefined
  const productsTracked = usageMetrics?.products_tracked?.used ?? usageMetrics?.products_analyzed?.used
  const decisionRecommendations = usageMetrics?.decision_recommendations?.used ?? usageMetrics?.ai_decisions?.used
  const usageDetail = productsTracked != null || decisionRecommendations != null
    ? `${new Intl.NumberFormat('en-US').format(Number(productsTracked || 0))} products / ${new Intl.NumberFormat('en-US').format(Number(decisionRecommendations || 0))} recommendations`
    : 'Usage starts after sync'

  base.workspace.metrics = [
    { label: 'Connected integrations', value: String(connectedCount), change: connections.length ? `${connections.length} configured` : 'No live integrations', tone: connectedCount ? 'teal' : 'amber' },
    { label: 'Active automations', value: String(activeAutomations), change: activeAutomations ? 'Guardrails enabled' : 'No guardrails enabled', tone: activeAutomations ? 'green' : 'neutral' },
    { label: 'Usage this month', value: planCode.toLowerCase() === 'enterprise' ? 'Unlimited' : 'Active', change: usageDetail, tone: 'blue' },
    { label: 'Plan status', value: planCode.replace(/^./, (s) => s.toUpperCase()), change: planStatus.replace(/^./, (s) => s.toUpperCase()), tone: 'neutral' }
  ]
}

function applyBillingState(base: DashboardData, billing: Record<string, unknown> | undefined, usage: Record<string, unknown> | undefined) {
  const usageSummary = (billing?.usage_summary || usage) as NonNullable<DashboardData['billing']>['usageSummary'] | undefined
  base.billing = {
    planCode: cleanText(billing?.plan_code || usage?.plan_code, 'free').toLowerCase(),
    status: cleanText(billing?.status || usage?.status, 'active').toLowerCase(),
    periodStart: cleanText(billing?.period_start) || null,
    periodEnd: cleanText(billing?.period_end) || null,
    entitlements: (billing?.entitlements as Record<string, unknown>) || undefined,
    capabilities: (billing?.capabilities as Record<string, unknown>) || undefined,
    usageSummary: usageSummary && typeof usageSummary === 'object' ? usageSummary : undefined
  }
}

export async function loadDashboardData(jwt: string, filters: DashboardLoadFilters = {}): Promise<LoadResult> {
  const next: DashboardData = structuredClone(dashboardFallbackData)
  const errors: string[] = []

  const [performance, decisions, recommendationOutcomes, recommendationAccuracy, forecastAccuracy, dismissalReasons, skuRoles, priceRecommendations, promotionRecommendations, catalogTasks, poWorkflow, usage, billing] = await Promise.all([
    getJson<Record<string, unknown>>(withDashboardFilters('/api/performance/status', filters), jwt),
    getJson<Record<string, unknown>>(withDashboardFilters('/api/retailer-plan?view=merchant_decisions', filters), jwt),
    getJson<Record<string, unknown>>(withDashboardFilters('/api/retailer-plan?view=recommendation_outcomes', filters), jwt),
    getJson<Record<string, unknown>>(withDashboardFilters('/api/retailer-plan?view=recommendation_accuracy', filters), jwt),
    getJson<Record<string, unknown>>(withDashboardFilters('/api/retailer-plan?view=forecast_accuracy', filters), jwt),
    getJson<Record<string, unknown>>(withDashboardFilters('/api/retailer-plan?view=dismissal_reasons', filters), jwt),
    getJson<Record<string, unknown>>(withDashboardFilters('/api/retailer-plan?view=sku_roles', filters), jwt),
    getJson<Record<string, unknown>>(withDashboardFilters('/api/retailer-plan?view=price_recommendations', filters), jwt),
    getJson<Record<string, unknown>>(withDashboardFilters('/api/retailer-plan?view=promotion_recommendations', filters), jwt),
    getJson<Record<string, unknown>>(withDashboardFilters('/api/retailer-plan?view=catalog_optimization_tasks', filters), jwt),
    getJson<Record<string, unknown>>(withDashboardFilters('/api/retailer-plan?view=po_workflow', filters), jwt),
    getJson<Record<string, unknown>>(withDashboardFilters('/api/retailer-plan?view=usage', filters), jwt),
    getJson<Record<string, unknown>>(withDashboardFilters('/api/retailer-plan?view=billing', filters), jwt)
  ])

  if (performance.ok && performance.data) {
    updateMetricsFromPerformance(next, performance.data)
    next.workspace.integrations = mapIntegrations(asArray(performance.data.connections))
  } else {
    errors.push(`performance: ${performance.error || 'unavailable'}`)
  }

  applyBillingState(next, billing.data, usage.data)
  updateWorkspaceFromLiveData(next, performance.data, usage.data, billing.data)

  if (decisions.ok && decisions.data) {
    const rows = asArray<Record<string, unknown>>(decisions.data.merchant_decisions || decisions.data.decisions)
    const mapped = mapDecisions(rows)
    if (mapped.length) {
      next.commandCenter.decisions = mapped.slice(0, 3)
      next.decisions.queue = mapped
      next.commandCenter.hero.title = `${mapped.length} decisions need your attention`
    }
    applyDecisionTrustMetrics(
      next,
      rows,
      recommendationOutcomes.ok ? asArray<Record<string, unknown>>(recommendationOutcomes.data?.recommendation_outcomes) : [],
      recommendationAccuracy.ok ? asArray<Record<string, unknown>>(recommendationAccuracy.data?.recommendation_accuracy_snapshots) : [],
      dismissalReasons.ok ? asArray<Record<string, unknown>>(dismissalReasons.data?.dismissal_reasons) : []
    )
  } else {
    errors.push(`decisions: ${decisions.error || 'unavailable'}`)
  }

  if (skuRoles.ok && skuRoles.data) {
    const mapped = mapSimpleRows(asArray(skuRoles.data.sku_roles), 'sku')
    if (mapped.length) {
      next.merchandise.roleMix = mapped.slice(0, 4)
      next.merchandise.opportunities = mapped
      next.merchandise.metrics[1] = { label: 'SKU roles classified', value: String(mapped.length), change: 'From SKU roles', tone: 'teal' }
    }
  } else {
    errors.push(`sku roles: ${skuRoles.error || 'unavailable'}`)
  }

  if (priceRecommendations.ok && priceRecommendations.data) {
    const mapped = mapSimpleRows(asArray(priceRecommendations.data.price_recommendations), 'price')
    if (mapped.length) next.commandCenter.bottomCards = mapped.slice(0, 3)
  } else {
    errors.push(`price recommendations: ${priceRecommendations.error || 'unavailable'}`)
  }

  if (promotionRecommendations.ok && promotionRecommendations.data) {
    const mapped = mapSimpleRows(asArray(promotionRecommendations.data.promotion_recommendations), 'promotion')
    if (mapped.length) next.merchandise.highlights = mapped.slice(0, 3)
  } else {
    errors.push(`promotion recommendations: ${promotionRecommendations.error || 'unavailable'}`)
  }

  if (catalogTasks.ok && catalogTasks.data) {
    const mapped = mapSimpleRows(asArray(catalogTasks.data.catalog_optimization_tasks), 'catalog')
    if (mapped.length) {
      next.merchandise.catalogTasks = mapped
      next.merchandise.metrics[3] = { label: 'Catalog tasks', value: String(mapped.length), change: 'Open readiness work', tone: 'blue' }
    }
  } else {
    errors.push(`catalog tasks: ${catalogTasks.error || 'unavailable'}`)
  }

  if (forecastAccuracy.ok && forecastAccuracy.data) {
    const forecastRows = asArray<Record<string, unknown>>(forecastAccuracy.data.forecast_accuracy_snapshots)
    const forecastPct = summarizeForecastAccuracy(forecastRows)
    next.intelligence.metrics[3] = {
      label: 'Forecast Accuracy',
      value: forecastPct == null ? 'Measuring' : `${forecastPct}%`,
      change: forecastRows.length ? `${forecastRows.length} snapshots` : 'Needs forecast snapshots',
      tone: forecastPct == null ? 'neutral' : 'green'
    }
  } else {
    errors.push(`forecast accuracy: ${forecastAccuracy.error || 'unavailable'}`)
  }

  if (poWorkflow.ok && poWorkflow.data) {
    const workflow = poWorkflow.data.po_workflow as Record<string, unknown> | undefined
    const drafts = asArray<Record<string, unknown>>(workflow?.drafts)
    next.operations.purchaseOrders = drafts.map((row, index) => ({
      id: cleanText(row.po_id || row.id, `po-${index}`),
      title: cleanText(row.status, 'draft').replace(/^./, (s) => s.toUpperCase()),
      subtitle: cleanText(row.supplier_name, 'Supplier not assigned'),
      metric: currencyFromCents(row.total_cents),
      status: cleanText(row.status, 'Draft'),
      tone: cleanText(row.status).toLowerCase() === 'approved' ? 'green' : 'amber'
    }))
    next.operations.metrics[2] = { label: 'Open POs', value: String(drafts.length), change: drafts.length ? 'Workflow-backed' : 'No PO records yet', tone: drafts.length ? 'blue' : 'neutral' }
  } else {
    errors.push(`po workflow: ${poWorkflow.error || 'unavailable'}`)
  }

  return {
    data: next,
    usedFallback: errors.length > 0,
    errors
  }
}
