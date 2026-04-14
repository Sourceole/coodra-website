import { useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import { exchangeForBackendJwt, getCachedBackendJwt } from '../lib/supabase'

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const cached = getCachedBackendJwt()
  const cachedRole = cached?.role || ''
  const [loading, setLoading] = useState(!cached)
  const [isAdmin, setIsAdmin] = useState(cachedRole === 'admin')

  useEffect(() => {
    let cancelled = false
    if (cachedRole === 'admin') {
      return
    }
    exchangeForBackendJwt()
      .then((result) => {
        if (cancelled) return
        setIsAdmin(result?.role === 'admin')
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setIsAdmin(false)
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [cachedRole])

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


