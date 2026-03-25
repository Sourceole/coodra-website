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

// Exchange Supabase session for a backend JWT by calling role_resolve
export async function exchangeForBackendJwt(): Promise<{ token: string; exp: number } | null> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null

  const supabaseToken = session.access_token

  const res = await fetch(`${import.meta.env.VITE_API_URL}/log?view=role_resolve&scope=retailer`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseToken}`,
      'x-user-email': session.user.email || '',
    },
  })

  if (!res.ok) return null
  const data = await res.json()
  if (!data?.backend_jwt) return null

  return {
    token: data.backend_jwt,
    exp: data.backend_jwt_expires_at ? new Date(data.backend_jwt_expires_at).getTime() / 1000 : 0,
  }
}
