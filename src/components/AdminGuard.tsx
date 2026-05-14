import { useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import { clearAuthState, exchangeForBackendJwt, loginMfaStatus, supabase } from '../lib/supabase'

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let cancelled = false

    const deny = async () => {
      clearAuthState()
      if (!cancelled) {
        setIsAdmin(false)
        setLoading(false)
      }
    }

    const verify = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user?.email) {
          await deny()
          return
        }

        const result = await exchangeForBackendJwt({ forceRefresh: true, scope: 'admin' })
        if (cancelled) return
        if (result?.role !== 'super_admin' || !result.token) {
          await deny()
          return
        }

        const mfa = await loginMfaStatus(result.token, session.user.email).catch(() => null)
        if (!mfa?.ok || !mfa.data.verified) {
          await deny()
          return
        }

        setIsAdmin(true)
        setLoading(false)
      } catch {
        await deny()
      }
    }

    void verify()
    const { data: authSubscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        clearAuthState()
        if (cancelled) return
        setIsAdmin(false)
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
      authSubscription.subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-spinner" aria-label="Loading" />
      </div>
    )
  }

  if (!isAdmin) return <Navigate to="/" replace />
  return <>{children}</>
}


