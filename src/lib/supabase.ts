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
export async function exchangeForBackendJwt(): Promise<{ token: string; exp: number } | null> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null

  const supabaseToken = session.access_token
  const email = (session.user.email || '').trim().toLowerCase()
  const userId = (session.user.id || '').trim()

  async function attemptExchange(): Promise<{ token: string; exp: number } | null> {
    const roleResolveUrl = resolveApiEndpoint(
      `/log?view=role_resolve&scope=retailer&email=${encodeURIComponent(email)}&user_id=${encodeURIComponent(userId)}`
    )

    let res: Response
    try {
      res = await fetch(roleResolveUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseToken}`,
          'x-user-id': userId,
          'x-user-email': session.user.email || '',
        },
      })
    } catch {
      return null
    }

    if (!res.ok) return null
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

    return { token: data.backend_jwt, exp }
  }

  // Try up to 3 times with a short delay, in case the first call hits a timing issue
  for (let attempt = 0; attempt < 3; attempt++) {
    const result = await attemptExchange()
    if (result?.token) return result
    if (attempt < 2) await new Promise(r => setTimeout(r, 500))
  }
  return null
}
