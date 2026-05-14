import { createClient } from '@supabase/supabase-js'
import type { Session, SupabaseClient } from '@supabase/supabase-js'

// Lazily create the client so we don't crash during module initialization
type AppSupabaseClient = SupabaseClient
let _supabase: AppSupabaseClient | null = null

function createFallbackSupabase(): AppSupabaseClient {
  const fallbackAuth = {
    async getSession() {
      return { data: { session: null as Session | null }, error: null }
    },
    async signInWithPassword() {
      return {
        data: { user: null, session: null },
        error: new Error('Supabase is not configured for this environment. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'),
      }
    },
    async signInWithOAuth() {
      return {
        data: { provider: null, url: null },
        error: new Error('Supabase is not configured for this environment. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'),
      }
    },
    async signOut() {
      return { error: null }
    },
    async resetPasswordForEmail() {
      return {
        data: null,
        error: new Error('Supabase is not configured for this environment. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'),
      }
    },
    onAuthStateChange() {
      return {
        data: {
          subscription: {
            unsubscribe() {
              // no-op fallback
            },
          },
        },
      }
    },
  }

  return {
    auth: fallbackAuth,
  } as unknown as AppSupabaseClient
}

function getSupabase(): AppSupabaseClient | null {
  if (!_supabase) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
    // During SSR build, these may be undefined.
    if (!supabaseUrl || !supabaseAnonKey) {
      return null
    }
    _supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }
  return _supabase
}

// Export a proxy that returns safe auth fallbacks during SSR build when env vars aren't available
const fallbackSupabase = createFallbackSupabase()

export const supabase: AppSupabaseClient = new Proxy(fallbackSupabase, {
  get(_target, prop: PropertyKey) {
    const client = getSupabase()
    if (!client) {
      return Reflect.get(fallbackSupabase, prop)
    }
    return Reflect.get(client, prop)
  },
}) as AppSupabaseClient

export function clearAuthState() {
  try {
    sessionStorage.removeItem('backend_jwt')
    sessionStorage.removeItem('backend_jwt_exp')
    sessionStorage.removeItem('backend_jwt_role')
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i) || ''
      if (key.startsWith('coodra_mfa_token_v1_')) {
        sessionStorage.removeItem(key)
      }
    }
  } catch {
    // ignore storage failures
  }
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i) || ''
      if (key.startsWith('sb-') && key.includes('-auth-token')) {
        localStorage.removeItem(key)
      }
      if (key.startsWith('coodra_mfa_token_v1_')) {
        localStorage.removeItem(key)
      }
    }
  } catch {
    // ignore storage failures
  }
}

function isInvalidRefreshTokenError(err: unknown) {
  const text = String(err instanceof Error ? err.message : err || '').toLowerCase()
  return text.includes('invalid refresh token') || text.includes('refresh token not found')
}

export function getCachedBackendJwt(): { token: string; exp: number; role: string } | null {
  try {
    const token = sessionStorage.getItem('backend_jwt') || ''
    const exp = Number(sessionStorage.getItem('backend_jwt_exp') || 0)
    const role = sessionStorage.getItem('backend_jwt_role') || ''
    const now = Math.floor(Date.now() / 1000)
    if (!token || !exp) return null
    if (exp - now < 120) return null
    return { token, exp, role }
  } catch {
    return null
  }
}

export function resolveApiEndpoint(path: string) {
  const baseRaw = ((import.meta.env.VITE_API_URL as string) || 'https://api.coodra.com').trim().replace(/\/+$/, '')
  if (baseRaw.endsWith('/api')) {
    return `${baseRaw}${path.startsWith('/') ? path : `/${path}`}`
  }
  return `${baseRaw}/api${path.startsWith('/') ? path : `/${path}`}`
}

function randomId() {
  const cryptoObj = globalThis.crypto
  if (cryptoObj?.getRandomValues) {
    const bytes = new Uint8Array(16)
    cryptoObj.getRandomValues(bytes)
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  }
  return `${Date.now()}_${Math.random().toString(36).slice(2)}`
}

export function getMfaDeviceId() {
  const key = 'coodra_mfa_device_id_v1'
  try {
    const existing = localStorage.getItem(key)
    if (existing) return existing
    const next = randomId()
    localStorage.setItem(key, next)
    return next
  } catch {
    return 'browser-session'
  }
}

function mfaTokenKey(email: string) {
  return `coodra_mfa_token_v1_${email.trim().toLowerCase()}`
}

export function getMfaToken(email: string) {
  try {
    const key = mfaTokenKey(email)
    return localStorage.getItem(key) || sessionStorage.getItem(key) || ''
  } catch {
    try {
      return sessionStorage.getItem(mfaTokenKey(email)) || ''
    } catch {
      return ''
    }
  }
}

export function setMfaToken(email: string, token: string) {
  try {
    const key = mfaTokenKey(email)
    localStorage.setItem(key, token)
    sessionStorage.removeItem(key)
  } catch {
    try {
      sessionStorage.setItem(mfaTokenKey(email), token)
    } catch {
      // ignore storage failures
    }
  }
}

type MfaResult = {
  ok?: boolean
  required?: boolean
  verified?: boolean
  token?: string
  error?: string
  mfa_error?: string
  resend_after_sec?: number
  retry_after_sec?: number
  expires_in_sec?: number
  remaining_attempts?: number
  enabled?: boolean
}

async function mfaFetch(
  action: 'status' | 'start' | 'resend' | 'verify',
  jwt: string,
  email: string,
  body: Record<string, unknown> = {},
): Promise<{ ok: boolean; status: number; data: MfaResult }> {
  const url = resolveApiEndpoint(`/mfa?action=${encodeURIComponent(action)}&reason=login`)
  const res = await fetch(url, {
    method: action === 'status' ? 'GET' : 'POST',
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
      'x-user-email': email,
      'x-mfa-device': getMfaDeviceId(),
      'x-mfa-token': getMfaToken(email),
    },
    body: action === 'status' ? undefined : JSON.stringify({ reason: 'login', channel: 'email', ...body }),
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok && !!data?.ok, status: res.status, data }
}

export function startLoginMfa(jwt: string, email: string) {
  return mfaFetch('start', jwt, email)
}

export function resendLoginMfa(jwt: string, email: string) {
  return mfaFetch('resend', jwt, email)
}

export async function verifyLoginMfa(jwt: string, email: string, code: string) {
  const result = await mfaFetch('verify', jwt, email, { code })
  if (result.ok && result.data.token) setMfaToken(email, result.data.token)
  return result
}

export function loginMfaStatus(jwt: string, email: string) {
  return mfaFetch('status', jwt, email)
}

// Exchange Supabase session for a backend JWT by calling role_resolve
type BackendJwtExchangeOptions = {
  forceRefresh?: boolean
  scope?: 'retailer' | 'admin'
}

export async function exchangeForBackendJwt(options: BackendJwtExchangeOptions = {}): Promise<{ token: string; exp: number; role: string } | null> {
  const cached = options.forceRefresh ? null : getCachedBackendJwt()
  if (cached) return cached

  const supabaseClient = getSupabase()
  if (!supabaseClient) return null

  try {
    const { data: { session } } = await supabaseClient.auth.getSession()
    if (!session?.user) return null

    const supabaseToken = session.access_token

    async function attemptExchange(): Promise<{ token: string; exp: number; role: string } | null> {
      const scope = options.scope === 'admin' ? 'admin' : 'retailer'
      const roleResolveUrl = resolveApiEndpoint(
        `/log?view=role_resolve&scope=${encodeURIComponent(scope)}`
      )

      let res: Response
      try {
        res = await fetch(roleResolveUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${supabaseToken}`,
          },
        })
      } catch {
        return null
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        console.warn('exchangeForBackendJwt: role_resolve failed', {
          status: res.status,
          error: err?.error || 'unknown_error',
        })
        return null
      }
      const data = await res.json()
      if (!data?.backend_jwt) return null

      const rawExp = data.backend_jwt_expires_at
      let exp = 0
      if (typeof rawExp === 'number' && Number.isFinite(rawExp)) {
        exp = rawExp > 1e12 ? Math.floor(rawExp / 1000) : Math.floor(rawExp)
      } else if (typeof rawExp === 'string' && rawExp.trim()) {
        const n = Number(rawExp)
        if (Number.isFinite(n) && n > 0) {
          exp = n > 1e12 ? Math.floor(n / 1000) : Math.floor(n)
        } else {
          const ts = Date.parse(rawExp)
          exp = Number.isFinite(ts) ? Math.floor(ts / 1000) : 0
        }
      }

      const result = { token: data.backend_jwt, exp, role: data.role || '' }
      try {
        sessionStorage.setItem('backend_jwt', result.token)
        sessionStorage.setItem('backend_jwt_exp', String(result.exp))
        sessionStorage.setItem('backend_jwt_role', result.role || '')
      } catch {
        // ignore storage failures
      }
      return result
    }

    // Try twice with short backoff to keep login snappy.
    for (let attempt = 0; attempt < 2; attempt++) {
      const result = await attemptExchange()
      if (result?.token) return result
      if (attempt < 1) await new Promise(r => setTimeout(r, 200))
    }
  } catch (err) {
    if (isInvalidRefreshTokenError(err)) {
      clearAuthState()
      await supabaseClient.auth.signOut().catch(() => {})
    }
  }
  return null
}

export async function getSessionSafely(): Promise<Session | null> {
  const supabaseClient = getSupabase()
  if (!supabaseClient) return null
  try {
    const { data: { session } } = await supabaseClient.auth.getSession()
    return session
  } catch (err) {
    if (isInvalidRefreshTokenError(err)) {
      clearAuthState()
      await supabaseClient.auth.signOut().catch(() => {})
    }
    return null
  }
}
