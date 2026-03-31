import { useEffect, useState, useCallback, useMemo } from 'react'
import { supabase, exchangeForBackendJwt } from '../lib/supabase'
import { Navigate } from 'react-router-dom'
import './AdminPage.css'

// ── Types ────────────────────────────────────────────────────────────────────

type OverviewStats = {
  totalRetailers: number
  activeRetailers: number
  trialRetailers: number
  mrr: number
  newThisMonth: number
  chatsToday: number
  aiDecisionsToday: number
}

type OverviewPlanMix = {
  plan: string
  count: number
}

type OverviewTrendPoint = {
  date: string
  new_retailers: number
  chats: number
  ai_decisions: number
}

type OverviewHourlyPoint = {
  hour: number
  ai_decisions: number
}

type OverviewAttention = {
  past_due: number
  trial_ending_7d: number
  no_activity_14d: number
}

type OverviewTopActive = {
  user_id: string
  email: string
  plan_code: string
  chat_count: number
}

type OverviewRevenuePoint = {
  date: string
  mrr: number
  arr: number
}

type OverviewPayload = {
  stats: OverviewStats
  plan_mix: OverviewPlanMix[]
  trends: { daily: OverviewTrendPoint[] }
  revenue?: { daily: OverviewRevenuePoint[] }
  activity: { hourly_ai_decisions_utc: OverviewHourlyPoint[] }
  attention: OverviewAttention
  top_active: OverviewTopActive[]
}

type Retailer = {
  user_id: string
  email: string
  role: string
  plan_code: string
  status: string
  period_end: string | null
  created_at: string
  last_seen: string | null
}

type ChatThread = {
  id: string
  title: string
  last_message_at: string
  created_at: string
}

type ChatMessage = {
  id: string
  role: string
  content: string
  created_at: string
}

type PartnerApp = {
  id: string
  application_type: string
  status: string
  company_name: string
  contact_name: string
  email: string
  phone: string | null
  website: string | null
  country: string | null
  region: string | null
  notes: string | null
  source: string
  reviewed_by: string | null
  reviewed_at: string | null
  decision_notes: string | null
  created_at: string
}

// ── API helper ────────────────────────────────────────────────────────────────

function resolveApiEndpoint(path: string) {
  const baseRaw = ((import.meta.env.VITE_API_URL as string) || 'https://api.coodra.com').trim().replace(/\/+$/, '')
  if (baseRaw.endsWith('/api')) {
    return `${baseRaw}${path.startsWith('/') ? path : `/${path}`}`
  }
  return `${baseRaw}/api${path.startsWith('/') ? path : `/${path}`}`
}

async function adminFetch(path: string, options: RequestInit = {}) {
  const exchanged = await exchangeForBackendJwt()
  const token = exchanged?.token
  const email = (await supabase.auth.getSession())?.data?.session?.user?.email || ''
  const hasBody = options.body !== undefined && options.body !== null
  const method = String(options.method || (hasBody ? 'POST' : 'GET')).toUpperCase()
  const defaultHeaders: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'x-user-email': email,
  }
  if (hasBody && method !== 'GET') defaultHeaders['Content-Type'] = 'application/json'
  const res = await fetch(resolveApiEndpoint(path), {
    ...options,
    method,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  })
  return res
}

// ── AdminPage ─────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'retailers' | 'chats' | 'applications'

function toNum(v: unknown, fallback = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

function monthLabel(monthKey: string) {
  const [y, m] = String(monthKey || '').split('-').map((x) => Number(x))
  if (!Number.isFinite(y) || !Number.isFinite(m) || m < 1 || m > 12) return monthKey
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleString('en-US', { month: 'short' })
}

export default function AdminPage() {
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  useEffect(() => {
    exchangeForBackendJwt().then(result => {
      setRole(result?.role || '')
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <div className="admin-loading"><div className="admin-spinner" /></div>
  }

  if (role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <span className="admin-logo">Coodra</span>
          <span className="admin-badge">Admin</span>
        </div>
        <nav className="admin-nav">
          <button className={`admin-nav-item${activeTab === 'overview' ? ' active' : ''}`} onClick={() => setActiveTab('overview')}>
            Overview
          </button>
          <button className={`admin-nav-item${activeTab === 'retailers' ? ' active' : ''}`} onClick={() => setActiveTab('retailers')}>
            Retailers
          </button>
          <button className={`admin-nav-item${activeTab === 'chats' ? ' active' : ''}`} onClick={() => setActiveTab('chats')}>
            Chat History
          </button>
          <button className={`admin-nav-item${activeTab === 'applications' ? ' active' : ''}`} onClick={() => setActiveTab('applications')}>
            Applications
          </button>
        </nav>
      </aside>
      <main className="admin-main">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'retailers' && <RetailersTab />}
        {activeTab === 'chats' && <ChatsTab />}
        {activeTab === 'applications' && <ApplicationsTab />}
      </main>
    </div>
  )
}

// ── Overview Tab ──────────────────────────────────────────────────────────────

function OverviewTab() {
  const [payload, setPayload] = useState<OverviewPayload | null>(null)
  const [error, setError] = useState('')
  const [revenueMode, setRevenueMode] = useState<'mrr' | 'arr'>('mrr')
  const [revenueRange, setRevenueRange] = useState<'3m' | '6m' | '12m' | 'all'>('12m')
  const [hoverMonthIdx, setHoverMonthIdx] = useState(-1)
  const revenueDaily = Array.isArray(payload?.revenue?.daily) ? payload.revenue.daily : []

  const monthlyRevenue = useMemo(() => {
    const map = new Map<string, OverviewRevenuePoint>()
    for (const point of revenueDaily) {
      const month = String(point?.date || '').slice(0, 7)
      if (!month) continue
      map.set(month, point)
    }
    const points = Array.from(map.entries()).map(([month, point]) => ({
      month,
      mrr: toNum(point.mrr),
      arr: toNum(point.arr),
      date: point.date,
    }))
    const rangeCount = revenueRange === '3m' ? 3 : revenueRange === '6m' ? 6 : revenueRange === '12m' ? 12 : points.length
    return points.slice(Math.max(0, points.length - rangeCount))
  }, [revenueDaily, revenueRange])

  useEffect(() => {
    adminFetch('/log?view=admin_overview')
      .then(r => r.json())
      .then(d => {
        if (d.ok) setPayload(d)
        else setError(d.error || 'Failed to load')
      })
      .catch(() => setError('Network error'))
  }, [])

  if (error) return <div className="admin-error">{error}</div>
  if (!payload) return <div className="admin-loading"><div className="admin-spinner" /></div>

  const stats = payload.stats
  const planMix = Array.isArray(payload.plan_mix) ? payload.plan_mix : []
  const maxPlan = Math.max(1, ...planMix.map(p => toNum(p.count)))
  const paidCount = planMix
    .filter((p) => String(p.plan).toLowerCase() !== 'free')
    .reduce((sum, p) => sum + toNum(p.count), 0)
  const mrr = toNum(stats.mrr)
  const arr = mrr * 12
  const arpa = paidCount > 0 ? mrr / paidCount : 0
  const revenuePrimary = revenueMode === 'mrr' ? mrr : arr
  const revenuePrimaryLabel = revenueMode === 'mrr' ? 'Monthly recurring revenue' : 'Annual recurring revenue'
  const revenueMax = Math.max(1, ...monthlyRevenue.map((p) => toNum(revenueMode === 'mrr' ? p.mrr : p.arr)))
  const revenuePoints = monthlyRevenue.map((p, i) => {
    const x = monthlyRevenue.length <= 1 ? 0 : (i / (monthlyRevenue.length - 1)) * 100
    const v = toNum(revenueMode === 'mrr' ? p.mrr : p.arr)
    const y = 100 - (v / revenueMax) * 100
    return { x, y, value: v, month: p.month }
  })
  const revenuePolyline = revenuePoints.map((p) => `${p.x},${p.y}`).join(' ')
  const activeRevenueIdx = hoverMonthIdx >= 0 ? hoverMonthIdx : Math.max(0, revenuePoints.length - 1)
  const activeRevenuePoint = revenuePoints[activeRevenueIdx]
  const hourly = Array.isArray(payload.activity?.hourly_ai_decisions_utc) ? payload.activity.hourly_ai_decisions_utc : []
  const maxHour = Math.max(1, ...hourly.map(h => toNum(h.ai_decisions)))
  const topActive = Array.isArray(payload.top_active) ? payload.top_active.slice(0, 6) : []
  const attention = payload.attention || { past_due: 0, trial_ending_7d: 0, no_activity_14d: 0 }

  return (
    <div className="admin-overview">
      <div className="admin-overview-header">
        <h2 className="admin-page-title">Executive Overview</h2>
      </div>

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-value">{toNum(stats.totalRetailers).toLocaleString()}</div>
          <div className="admin-stat-label">Total Retailers</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{toNum(stats.activeRetailers).toLocaleString()}</div>
          <div className="admin-stat-label">Active</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">${toNum(stats.mrr).toLocaleString()}</div>
          <div className="admin-stat-label">MRR</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{toNum(stats.newThisMonth).toLocaleString()}</div>
          <div className="admin-stat-label">New This Month</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{toNum(stats.trialRetailers).toLocaleString()}</div>
          <div className="admin-stat-label">Trialing</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{toNum(stats.chatsToday).toLocaleString()}</div>
          <div className="admin-stat-label">Chats Today</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{toNum(stats.aiDecisionsToday).toLocaleString()}</div>
          <div className="admin-stat-label">AI Decisions Today</div>
        </div>
      </div>

      <div className="admin-insight-grid">
        <section className="admin-panel admin-panel-revenue">
          <div className="admin-panel-head">
            <h3>Revenue</h3>
            <div className="admin-range-toggle">
              <button
                className={`admin-range-btn${revenueMode === 'mrr' ? ' active' : ''}`}
                onClick={() => setRevenueMode('mrr')}
              >
                MRR
              </button>
              <button
                className={`admin-range-btn${revenueMode === 'arr' ? ' active' : ''}`}
                onClick={() => setRevenueMode('arr')}
              >
                ARR
              </button>
            </div>
          </div>
          <div className="admin-revenue-subhead">
            <div className="admin-range-toggle">
              {(['3m', '6m', '12m', 'all'] as const).map((range) => (
                <button
                  key={range}
                  className={`admin-range-btn${revenueRange === range ? ' active' : ''}`}
                  onClick={() => setRevenueRange(range)}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>
            {activeRevenuePoint ? (
              <div className="admin-revenue-hover-value">
                <span>{monthLabel(activeRevenuePoint.month)} {activeRevenuePoint.month.slice(0, 4)}</span>
                <strong>${toNum(activeRevenuePoint.value).toLocaleString()}</strong>
              </div>
            ) : null}
          </div>
          <div className="admin-revenue-main">
            <div className="admin-revenue-value">${revenuePrimary.toLocaleString()}</div>
            <div className="admin-revenue-label">{revenuePrimaryLabel}</div>
          </div>
          <div className="admin-revenue-grid">
            <div className="admin-revenue-item">
              <span>Paid Accounts</span>
              <strong>{paidCount.toLocaleString()}</strong>
            </div>
            <div className="admin-revenue-item">
              <span>ARPA</span>
              <strong>${Math.round(arpa).toLocaleString()}</strong>
            </div>
            <div className="admin-revenue-item">
              <span>Trialing</span>
              <strong>{toNum(stats.trialRetailers).toLocaleString()}</strong>
            </div>
            <div className="admin-revenue-item">
              <span>New This Month</span>
              <strong>{toNum(stats.newThisMonth).toLocaleString()}</strong>
            </div>
          </div>
          <div
            className="admin-revenue-trend"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / Math.max(1, rect.width)))
              const idx = Math.round(ratio * Math.max(0, monthlyRevenue.length - 1))
              setHoverMonthIdx(idx)
            }}
            onMouseLeave={() => setHoverMonthIdx(-1)}
          >
            <div className="admin-revenue-trend-head">
              <span>{revenueMode.toUpperCase()} trend</span>
              <span>monthly</span>
            </div>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="admin-revenue-trend-chart">
              <polyline className="line-grid" points="0,100 100,100" />
              <polyline className="line-grid" points="0,75 100,75" />
              <polyline className="line-grid" points="0,50 100,50" />
              <polyline className="line-grid" points="0,25 100,25" />
              <polyline className="line-revenue" points={revenuePolyline} />
              {activeRevenuePoint ? (
                <>
                  <line className="line-cursor" x1={activeRevenuePoint.x} x2={activeRevenuePoint.x} y1={0} y2={100} />
                  <circle className="line-dot" cx={activeRevenuePoint.x} cy={activeRevenuePoint.y} r="1.45" />
                </>
              ) : null}
            </svg>
            <div className="admin-revenue-months">
              {monthlyRevenue.map((point, idx) => (
                <span key={`${point.month}-${idx}`} className={idx === activeRevenueIdx ? 'active' : ''}>
                  {monthLabel(point.month)}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-head">
            <h3>Plan Mix</h3>
            <span>Live distribution</span>
          </div>
          <div className="admin-planmix-list">
            {planMix.map((p) => (
              <div key={p.plan} className="admin-planmix-row">
                <span className="plan-name">{p.plan}</span>
                <div className="plan-bar">
                  <div style={{ width: `${(toNum(p.count) / maxPlan) * 100}%` }} />
                </div>
                <span className="plan-count">{toNum(p.count).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-head">
            <h3>Attention Needed</h3>
            <span>Revenue risk and churn</span>
          </div>
          <div className="admin-attention">
            <div className="attention-item">
              <strong>{toNum(attention.past_due).toLocaleString()}</strong>
              <span>Past due accounts</span>
            </div>
            <div className="attention-item">
              <strong>{toNum(attention.trial_ending_7d).toLocaleString()}</strong>
              <span>Trials ending in 7 days</span>
            </div>
            <div className="attention-item">
              <strong>{toNum(attention.no_activity_14d).toLocaleString()}</strong>
              <span>No activity in 14 days</span>
            </div>
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-head">
            <h3>Peak Hours (UTC)</h3>
            <span>AI decisions in last 24h</span>
          </div>
          <div className="admin-hourly">
            {hourly.map((h) => (
              <div key={h.hour} className="hour-bar" title={`${h.hour}:00 UTC - ${toNum(h.ai_decisions)} decisions`}>
                <div className="hour-fill" style={{ height: `${(toNum(h.ai_decisions) / maxHour) * 100}%` }} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="admin-panel admin-top-active">
        <div className="admin-panel-head">
          <h3>Most Active Retailers (30d)</h3>
          <span>By chat thread volume</span>
        </div>
        {topActive.length === 0 ? (
          <div className="admin-empty-inline">No activity data yet.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Retailer</th>
                  <th>Plan</th>
                  <th>Chats (30d)</th>
                </tr>
              </thead>
              <tbody>
                {topActive.map((r) => (
                  <tr key={r.user_id}>
                    <td>{r.email || r.user_id}</td>
                    <td><span className={`admin-plan-badge plan-${r.plan_code}`}>{r.plan_code}</span></td>
                    <td>{toNum(r.chat_count).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

// ── Retailers Tab ─────────────────────────────────────────────────────────────

function RetailersTab() {
  const [retailers, setRetailers] = useState<Retailer[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(0)
  const limit = 25
  const [manageRetailer, setManageRetailer] = useState<Retailer | null>(null)
  const [managePlan, setManagePlan] = useState('')
  const [manageStatus, setManageStatus] = useState('')
  const [manageRole, setManageRole] = useState('retailer_user')
  const [saving, setSaving] = useState(false)

  const loadRetailers = useCallback((offset = 0) => {
    setLoading(true)
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) })
    if (search) params.set('search', search)
    if (planFilter) params.set('plan_code', planFilter)
    if (statusFilter) params.set('status', statusFilter)
    adminFetch(`/log?view=admin_retailers&${params}`)
      .then(r => r.json())
      .then(d => {
        if (d.ok) {
          setRetailers(Array.isArray(d.retailers) ? d.retailers : [])
          setTotal(toNum(d.total))
        } else {
          setError(d.error || 'Failed to load')
        }
        setLoading(false)
      })
      .catch(() => { setError('Network error'); setLoading(false) })
  }, [search, planFilter, statusFilter])

  useEffect(() => { loadRetailers(0); setPage(0) }, [search, planFilter, statusFilter])

  const openManage = (r: Retailer) => {
    setManageRetailer(r)
    setManagePlan(r.plan_code)
    setManageStatus(r.status)
    setManageRole(r.role || 'retailer_user')
  }

  const savePlan = async () => {
    if (!manageRetailer) return
    setSaving(true)
    const planRes = await adminFetch('/log?action=admin_set_plan', {
      method: 'PATCH',
      body: JSON.stringify({ user_id: manageRetailer.user_id, plan_code: managePlan, status: manageStatus }),
    })
    const planData = await planRes.json().catch(() => ({}))
    if (!planData?.ok) {
      setSaving(false)
      alert(planData?.error || 'Failed to update')
      return
    }
    const roleRes = await adminFetch('/log?action=admin_set_role', {
      method: 'PATCH',
      body: JSON.stringify({ user_id: manageRetailer.user_id, email: manageRetailer.email, role: manageRole }),
    })
    const d = await roleRes.json().catch(() => ({}))
    setSaving(false)
    if (d.ok) {
      setManageRetailer(null)
      loadRetailers(page * limit)
    } else {
      alert(d.error || 'Failed to update')
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="admin-retailers">
      <h2 className="admin-page-title">Retailers</h2>

      <div className="admin-toolbar">
        <input
          className="admin-search"
          placeholder="Search email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="admin-select" value={planFilter} onChange={e => setPlanFilter(e.target.value)}>
          <option value="">All Plans</option>
          <option value="free">Free</option>
          <option value="starter">Starter</option>
          <option value="growth">Growth</option>
          <option value="enterprise">Enterprise</option>
        </select>
        <select className="admin-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="trialing">Trialing</option>
          <option value="past_due">Past Due</option>
          <option value="canceled">Canceled</option>
          <option value="paused">Paused</option>
        </select>
        <span className="admin-count">{toNum(total).toLocaleString()} retailers</span>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Period End</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="admin-td-center">Loading…</td></tr>
            ) : retailers.length === 0 ? (
              <tr><td colSpan={7} className="admin-td-center">No retailers found</td></tr>
            ) : retailers.map(r => (
              <tr key={r.user_id}>
                <td>{r.email}</td>
                <td>{r.role || 'retailer_user'}</td>
                <td><span className={`admin-plan-badge plan-${r.plan_code}`}>{r.plan_code}</span></td>
                <td><span className={`admin-status-badge status-${r.status}`}>{r.status}</span></td>
                <td>{r.period_end ? new Date(r.period_end).toLocaleDateString() : '—'}</td>
                <td>{r.last_seen ? new Date(r.last_seen).toLocaleDateString() : 'Never'}</td>
                <td>
                  <button className="admin-btn admin-btn-sm" onClick={() => openManage(r)}>Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="admin-pagination">
          <button className="admin-btn admin-btn-sm" disabled={page === 0} onClick={() => { setPage(p => p - 1); loadRetailers((page - 1) * limit) }}>Prev</button>
          <span>Page {page + 1} of {totalPages}</span>
          <button className="admin-btn admin-btn-sm" disabled={page >= totalPages - 1} onClick={() => { setPage(p => p + 1); loadRetailers((page + 1) * limit) }}>Next</button>
        </div>
      )}

      {manageRetailer && (
        <div className="admin-modal-overlay" onClick={() => setManageRetailer(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>Manage Retailer</h3>
            <p className="admin-modal-email">{manageRetailer.email}</p>
            <div className="admin-modal-field">
              <label>Role</label>
              <select className="admin-select" value={manageRole} onChange={e => setManageRole(e.target.value)}>
                <option value="retailer_user">Retailer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="admin-modal-field">
              <label>Plan</label>
              <select className="admin-select" value={managePlan} onChange={e => setManagePlan(e.target.value)}>
                <option value="free">Free</option>
                <option value="starter">Starter</option>
                <option value="growth">Growth</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
            <div className="admin-modal-field">
              <label>Status</label>
              <select className="admin-select" value={manageStatus} onChange={e => setManageStatus(e.target.value)}>
                <option value="active">Active</option>
                <option value="trialing">Trialing</option>
                <option value="past_due">Past Due</option>
                <option value="canceled">Canceled</option>
                <option value="paused">Paused</option>
              </select>
            </div>
            <div className="admin-modal-actions">
              <button className="admin-btn" onClick={() => setManageRetailer(null)}>Cancel</button>
              <button className="admin-btn admin-btn-primary" disabled={saving} onClick={savePlan}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Chat History Tab ──────────────────────────────────────────────────────────

function ChatsTab() {
  const [retailers, setRetailers] = useState<Retailer[]>([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [threads, setThreads] = useState<ChatThread[]>([])
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loadingR, setLoadingR] = useState(true)
  const [loadingT, setLoadingT] = useState(false)
  const [loadingM, setLoadingM] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams({ limit: '500' })
    adminFetch(`/log?view=admin_retailers&${params}`)
      .then(r => r.json())
      .then(d => {
        if (d.ok) setRetailers(Array.isArray(d.retailers) ? d.retailers : [])
        setLoadingR(false)
      })
      .catch(() => setLoadingR(false))
  }, [])

  useEffect(() => {
    if (!selectedUserId) { setThreads([]); setSelectedThread(null); return }
    setLoadingT(true)
    adminFetch(`/log?view=retailer_chats&user_id=${encodeURIComponent(selectedUserId)}&limit=50`)
      .then(r => r.json())
      .then(d => {
        setThreads(d.chats || [])
        setLoadingT(false)
      })
      .catch(() => setLoadingT(false))
  }, [selectedUserId])

  useEffect(() => {
    if (!selectedThread) { setMessages([]); return }
    setLoadingM(true)
    adminFetch(`/log?view=retailer_chat_messages&chat_id=${encodeURIComponent(selectedThread.id)}&limit=100`)
      .then(r => r.json())
      .then(d => {
        setMessages(d.messages || [])
        setLoadingM(false)
      })
      .catch(() => setLoadingM(false))
  }, [selectedThread])

  return (
    <div className="admin-chats">
      <h2 className="admin-page-title">Chat History</h2>
      <div className="admin-chats-layout">
        <div className="admin-chats-sidebar">
          <label className="admin-chats-label">Retailer</label>
          {loadingR ? (
            <div className="admin-td-center">Loading…</div>
          ) : (
            <select className="admin-select admin-chat-retailer-select" value={selectedUserId} onChange={e => { setSelectedUserId(e.target.value); setSelectedThread(null) }}>
              <option value="">Select retailer…</option>
              {retailers.map(r => (
                <option key={r.user_id} value={r.user_id}>{r.email}</option>
              ))}
            </select>
          )}
          {loadingT ? (
            <div className="admin-td-center">Loading…</div>
          ) : threads.length === 0 && selectedUserId ? (
            <div className="admin-td-center">No chats</div>
          ) : (
            <div className="admin-thread-list">
              {threads.map(t => (
                <button
                  key={t.id}
                  className={`admin-thread-item${selectedThread?.id === t.id ? ' active' : ''}`}
                  onClick={() => setSelectedThread(t)}
                >
                  <div className="admin-thread-title">{t.title || '(No title)'}</div>
                  <div className="admin-thread-date">{t.last_message_at ? new Date(t.last_message_at).toLocaleDateString() : ''}</div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="admin-chat-messages">
          {!selectedThread ? (
            <div className="admin-empty-state">Select a retailer and thread to view messages</div>
          ) : loadingM ? (
            <div className="admin-td-center">Loading…</div>
          ) : messages.length === 0 ? (
            <div className="admin-empty-state">No messages</div>
          ) : (
            <div className="admin-message-list">
              {messages.map(m => (
                <div key={m.id} className={`admin-message admin-message-${m.role}`}>
                  <div className="admin-message-bubble">
                    <span className="admin-message-role">{m.role === 'assistant' ? 'AI' : 'User'}</span>
                    <p className="admin-message-content">{m.content}</p>
                    <span className="admin-message-time">{new Date(m.created_at).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Applications Tab ───────────────────────────────────────────────────────────

function ApplicationsTab() {
  const [statusFilter, setStatusFilter] = useState('pending')
  const [apps, setApps] = useState<PartnerApp[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(0)
  const limit = 50
  const [actioningId, setActioningId] = useState<string | null>(null)

  useEffect(() => { loadApps(0); setPage(0) }, [statusFilter])

  const loadApps = (offset = 0) => {
    setLoading(true)
    const params = new URLSearchParams({ status: statusFilter, limit: String(limit), offset: String(offset) })
    adminFetch(`/log?view=admin_partner_applications&${params}`)
      .then(r => r.json())
      .then(d => {
        if (d.ok) { setApps(Array.isArray(d.applications) ? d.applications : []); setTotal(toNum(d.total)) }
        else setError(d.error || 'Failed to load')
        setLoading(false)
      })
      .catch(() => { setError('Network error'); setLoading(false) })
  }

  const patchStatus = async (id: string, status: 'approved' | 'rejected', notes = '') => {
    setActioningId(id)
    const res = await adminFetch('/log?action=partner_application_status', {
      method: 'PATCH',
      body: JSON.stringify({ id, status, reviewed_by: 'admin', decision_notes: notes }),
    })
    const d = await res.json()
    setActioningId(null)
    if (d.ok) loadApps(page * limit)
    else alert(d.error || 'Failed to update')
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="admin-applications">
      <h2 className="admin-page-title">Partner Applications</h2>
      <div className="admin-toolbar">
        <div className="admin-filter-tabs">
          {['pending', 'approved', 'rejected'].map(s => (
            <button key={s} className={`admin-filter-tab${statusFilter === s ? ' active' : ''}`} onClick={() => setStatusFilter(s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <span className="admin-count">{total} total</span>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Type</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="admin-td-center">Loading…</td></tr>
            ) : apps.length === 0 ? (
              <tr><td colSpan={6} className="admin-td-center">No {statusFilter} applications</td></tr>
            ) : apps.map(a => (
              <tr key={a.id}>
                <td>{a.company_name}</td>
                <td>{a.contact_name}</td>
                <td><a href={`mailto:${a.email}`}>{a.email}</a></td>
                <td>{a.application_type}</td>
                <td>{new Date(a.created_at).toLocaleDateString()}</td>
                <td>
                  {statusFilter === 'pending' && (
                    <div className="admin-action-group">
                      <button
                        className="admin-btn admin-btn-approve"
                        disabled={actioningId === a.id}
                        onClick={() => patchStatus(a.id, 'approved')}
                      >
                        {actioningId === a.id ? '…' : 'Approve'}
                      </button>
                      <button
                        className="admin-btn admin-btn-reject"
                        disabled={actioningId === a.id}
                        onClick={() => patchStatus(a.id, 'rejected')}
                      >
                        {actioningId === a.id ? '…' : 'Reject'}
                      </button>
                    </div>
                  )}
                  {statusFilter !== 'pending' && (
                    <span className="admin-reviewed-info">
                      {a.reviewed_by ? `by ${a.reviewed_by}` : ''} {a.reviewed_at ? new Date(a.reviewed_at).toLocaleDateString() : ''}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="admin-pagination">
          <button className="admin-btn admin-btn-sm" disabled={page === 0} onClick={() => { setPage(p => p - 1); loadApps((page - 1) * limit) }}>Prev</button>
          <span>Page {page + 1} of {totalPages}</span>
          <button className="admin-btn admin-btn-sm" disabled={page >= totalPages - 1} onClick={() => { setPage(p => p + 1); loadApps((page + 1) * limit) }}>Next</button>
        </div>
      )}
    </div>
  )
}
