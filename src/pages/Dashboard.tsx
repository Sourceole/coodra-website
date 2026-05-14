import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import NewDashboard from '../dashboard/NewDashboard'
import type { BootUser } from '../dashboard/dashboardTypes'
import { loadAccountProfile } from '../dashboard/dashboardApi'
import { exchangeForBackendJwt, loginMfaStatus, supabase } from '../lib/supabase'
import './Dashboard.css'

type ThemeMode = 'light' | 'dark'

const GLOBAL_THEME_KEY = 'so_theme_last_v1'

declare global {
  interface Window {
    __SO_RC_BOOT__?: BootUser
    __COODRA_API_BASE__?: string
  }
}

function clearStoredJwt() {
  try {
    sessionStorage.removeItem('backend_jwt')
    sessionStorage.removeItem('backend_jwt_exp')
    sessionStorage.removeItem('backend_jwt_role')
  } catch {
    // Session storage may be unavailable in strict browser privacy modes.
  }
}

function normalizeTheme(value: unknown): ThemeMode {
  return String(value || '').trim().toLowerCase() === 'dark' ? 'dark' : 'light'
}

function applyDocumentTheme(mode: ThemeMode) {
  const light = mode === 'light'
  document.documentElement.setAttribute('data-so-rc-theme', light ? 'light' : 'dark')
  document.body.setAttribute('data-so-rc-theme', light ? 'light' : 'dark')
  document.documentElement.style.backgroundColor = light ? '#f8fafa' : '#0d1118'
  document.body.style.backgroundColor = light ? '#f8fafa' : '#0d1118'
}

function userScopeFromIdentity(userId: string | null | undefined, email: string | null | undefined): string {
  return String(userId || email || 'anon')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_')
}

function readThemeFromStorage(scope?: string): ThemeMode {
  try {
    const scopedKey = scope ? `so_theme_v6_${scope}` : ''
    if (scopedKey) {
      const scopedRaw = localStorage.getItem(scopedKey)
      if (scopedRaw) return normalizeTheme(scopedRaw)
    }
    const globalRaw = localStorage.getItem(GLOBAL_THEME_KEY)
    if (globalRaw) return normalizeTheme(globalRaw)
  } catch {
    // Use the product default if storage is blocked.
  }
  return 'light'
}

function readThemeFromProfile(settings: unknown): ThemeMode | null {
  if (!settings || typeof settings !== 'object') return null
  const theme = String((settings as { theme?: unknown }).theme || '').toLowerCase()
  return theme === 'dark' || theme === 'light' ? theme : null
}

async function getSessionWithTimeout(timeoutMs = 8000) {
  const timeoutPromise = new Promise<never>((_, reject) => {
    const timerId = setTimeout(() => {
      clearTimeout(timerId)
      reject(new Error('Session check timed out'))
    }, timeoutMs)
  })

  const sessionPromise = supabase.auth.getSession()
  return Promise.race([sessionPromise, timeoutPromise])
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bootTheme, setBootTheme] = useState<ThemeMode>(() => (
    typeof window === 'undefined' ? 'light' : readThemeFromStorage()
  ))
  const [bootUser, setBootUser] = useState<BootUser | null>(null)

  useEffect(() => {
    applyDocumentTheme(bootTheme)
  }, [bootTheme])

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      try {
        const {
          data: { session },
        } = await getSessionWithTimeout()

        if (!session) {
          if (!cancelled) navigate('/login')
          return
        }

        const exchanged = await exchangeForBackendJwt()
        const jwt = exchanged?.token || ''
        const exp = Number(exchanged?.exp || 0)
        const role = exchanged?.role || ''

        if (!jwt || !exp) {
          clearStoredJwt()
          if (!cancelled) navigate('/login')
          return
        }

        const sessionEmail = session.user.email || ''
        const mfa = await loginMfaStatus(jwt, sessionEmail).catch(() => null)
        if (!mfa?.ok || !mfa.data.verified) {
          clearStoredJwt()
          if (!cancelled) navigate('/login?mfa=required', { replace: true })
          return
        }

        const user = session.user
        const themeScope = userScopeFromIdentity(user.id || null, user.email || '')
        const profileResult = await loadAccountProfile(jwt).catch(() => null)
        const resolvedTheme = readThemeFromProfile(profileResult?.data?.dashboard_settings) || readThemeFromStorage(themeScope)
        setBootTheme(resolvedTheme)
        applyDocumentTheme(resolvedTheme)

        const nextBootUser: BootUser = {
          userId: user.id || null,
          email: user.email || '',
          firstName: user.user_metadata?.first_name || user.user_metadata?.name?.split(' ')[0] || '',
          company: user.user_metadata?.business_name || user.email?.split('@')[0] || 'Retailer',
          region: user.user_metadata?.region || 'Unknown',
          backendJwt: jwt,
          backendJwtExp: exp,
          role,
          supabaseAccessToken: session.access_token || '',
        }

        window.__COODRA_API_BASE__ = String((import.meta.env.VITE_API_URL as string) || 'https://api.coodra.com')
          .trim()
          .replace(/\/+$/, '')

        window.__SO_RC_BOOT__ = nextBootUser

        if (!cancelled) {
          setBootUser(nextBootUser)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Dashboard failed to initialize')
          setLoading(false)
        }
      }
    }

    init()

    return () => {
      cancelled = true
    }
  }, [navigate])

  useEffect(() => {
    if (!bootUser?.email) return

    let cancelled = false
    const verifyActiveMfaWindow = async () => {
      const exchanged = await exchangeForBackendJwt()
      const jwt = exchanged?.token || ''
      if (!jwt) {
        clearStoredJwt()
        if (!cancelled) navigate('/login', { replace: true })
        return
      }

      const mfa = await loginMfaStatus(jwt, bootUser.email).catch(() => null)
      if (!mfa?.ok || !mfa.data.verified) {
        clearStoredJwt()
        if (!cancelled) navigate('/login?mfa=required', { replace: true })
        return
      }

      if (!cancelled && (jwt !== bootUser.backendJwt || exchanged?.exp !== bootUser.backendJwtExp)) {
        setBootUser((current) => current
          ? {
              ...current,
              backendJwt: jwt,
              backendJwtExp: Number(exchanged?.exp || current.backendJwtExp),
              role: exchanged?.role || current.role,
            }
          : current)
      }
    }

    const intervalId = window.setInterval(() => {
      void verifyActiveMfaWindow()
    }, 60_000)

    return () => {
      cancelled = true
      window.clearInterval(intervalId)
    }
  }, [bootUser?.backendJwt, bootUser?.backendJwtExp, bootUser?.email, navigate])

  const handleLogout = async () => {
    clearStoredJwt()
    try {
      await supabase.auth.signOut()
    } finally {
      navigate('/login?logged_out=1', { replace: true })
    }
  }

  if (loading) {
    return (
      <div className="dashboard-shell" data-loading="1" data-theme={bootTheme}>
        <div className="dashboard-loading-card">
          <div className="auth-spinner" />
          <span>Preparing your Coodra command center...</span>
        </div>
      </div>
    )
  }

  if (error || !bootUser) {
    return (
      <div className="dashboard-shell" data-loading="0" data-theme={bootTheme}>
        <div className="dashboard-error">{error || 'Dashboard failed to initialize'}</div>
      </div>
    )
  }

  return <NewDashboard user={bootUser} initialTheme={bootTheme} onLogout={handleLogout} />
}
