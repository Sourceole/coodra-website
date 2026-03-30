import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

function resolveApiEndpoint(path: string) {
  const baseRaw = ((import.meta.env.VITE_API_URL as string) || 'https://api.coodra.com').trim().replace(/\/+$/, '')
  if (baseRaw.endsWith('/api')) {
    return `${baseRaw}${path.startsWith('/') ? path : `/${path}`}`
  }
  return `${baseRaw}/api${path.startsWith('/') ? path : `/${path}`}`
}

// Exchange Supabase session for a backend JWT by calling role_resolve
export async function exchangeForBackendJwt(): Promise<{ token: string; exp: number; role: string } | null> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null

  const supabaseToken = session.access_token
  const sessionEmail = session.user.email || ''
  const email = sessionEmail.trim().toLowerCase()

  async function attemptExchange(): Promise<{ token: string; exp: number; role: string } | null> {
    const roleResolveUrl = resolveApiEndpoint(
      `/log?view=role_resolve&scope=retailer&email=${encodeURIComponent(email)}`
    )

    let res: Response
    try {
      res = await fetch(roleResolveUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${supabaseToken}`,
          'x-user-email': sessionEmail,
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

    return { token: data.backend_jwt, exp, role: data.role || '' }
  }

  // Try up to 3 times with a short delay, in case the first call hits a timing issue
  for (let attempt = 0; attempt < 3; attempt++) {
    const result = await attemptExchange()
    if (result?.token) return result
    if (attempt < 2) await new Promise(r => setTimeout(r, 500))
  }
  return null
}
