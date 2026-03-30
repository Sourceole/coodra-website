import { useEffect, useState, useCallback } from 'react'
import { supabase, exchangeForBackendJwt } from '../lib/supabase'
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

type Retailer = {
  user_id: string
  email: string
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
  const res = await fetch(resolveApiEndpoint(path), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'x-user-email': email,
      ...(options.headers || {}),
    },
  })
  return res
}

// ── AdminPage ─────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'retailers' | 'chats' | 'applications'

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
    return (
      <div className="admin-access-denied">
        <div className="admin-access-icon">⚠️</div>
        <h1>Access Denied</h1>
        <p>You must be an admin to view this page.</p>
      </div>
    )
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
  const [stats, setStats] = useState<OverviewStats | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    adminFetch('/api/log?view=admin_overview')
      .then(r => r.json())
      .then(d => {
        if (d.ok) setStats(d.stats)
        else setError(d.error || 'Failed to load')
      })
      .catch(() => setError('Network error'))
  }, [])

  if (error) return <div className="admin-error">{error}</div>
  if (!stats) return <div className="admin-loading"><div className="admin-spinner" /></div>

  return (
    <div className="admin-overview">
      <h2 className="admin-page-title">Overview</h2>
      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.totalRetailers.toLocaleString()}</div>
          <div className="admin-stat-label">Total Retailers</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.activeRetailers.toLocaleString()}</div>
          <div className="admin-stat-label">Active</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">${stats.mrr.toLocaleString()}</div>
          <div className="admin-stat-label">MRR</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.newThisMonth.toLocaleString()}</div>
          <div className="admin-stat-label">New This Month</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.trialRetailers.toLocaleString()}</div>
          <div className="admin-stat-label">Trialing</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.chatsToday.toLocaleString()}</div>
          <div className="admin-stat-label">Chats Today</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.aiDecisionsToday.toLocaleString()}</div>
          <div className="admin-stat-label">AI Decisions Today</div>
        </div>
      </div>
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
  const [saving, setSaving] = useState(false)

  const loadRetailers = useCallback((offset = 0) => {
    setLoading(true)
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) })
    if (search) params.set('search', search)
    if (planFilter) params.set('plan_code', planFilter)
    if (statusFilter) params.set('status', statusFilter)
    adminFetch(`/api/log?view=admin_retailers&${params}`)
      .then(r => r.json())
      .then(d => {
        if (d.ok) {
          setRetailers(d.retailers)
          setTotal(d.total)
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
  }

  const savePlan = async () => {
    if (!manageRetailer) return
    setSaving(true)
    const res = await adminFetch('/api/log?action=admin_set_plan', {
      method: 'PATCH',
      body: JSON.stringify({ user_id: manageRetailer.user_id, plan_code: managePlan, status: manageStatus }),
    })
    const d = await res.json()
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
        <span className="admin-count">{total.toLocaleString()} retailers</span>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Period End</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="admin-td-center">Loading…</td></tr>
            ) : retailers.length === 0 ? (
              <tr><td colSpan={6} className="admin-td-center">No retailers found</td></tr>
            ) : retailers.map(r => (
              <tr key={r.user_id}>
                <td>{r.email}</td>
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
    adminFetch(`/api/log?view=admin_retailers&${params}`)
      .then(r => r.json())
      .then(d => {
        if (d.ok) setRetailers(d.retailers)
        setLoadingR(false)
      })
      .catch(() => setLoadingR(false))
  }, [])

  useEffect(() => {
    if (!selectedUserId) { setThreads([]); setSelectedThread(null); return }
    setLoadingT(true)
    adminFetch(`/api/log?view=retailer_chats&user_id=${encodeURIComponent(selectedUserId)}&limit=50`)
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
    adminFetch(`/api/log?view=retailer_chat_messages&chat_id=${encodeURIComponent(selectedThread.id)}&limit=100`)
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
    adminFetch(`/api/log?view=admin_partner_applications&${params}`)
      .then(r => r.json())
      .then(d => {
        if (d.ok) { setApps(d.applications); setTotal(d.total) }
        else setError(d.error || 'Failed to load')
        setLoading(false)
      })
      .catch(() => { setError('Network error'); setLoading(false) })
  }

  const patchStatus = async (id: string, status: 'approved' | 'rejected', notes = '') => {
    setActioningId(id)
    const res = await adminFetch('/api/log?action=partner_application_status', {
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
