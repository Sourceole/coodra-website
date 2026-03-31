import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { exchangeForBackendJwt, getCachedBackendJwt } from '../lib/supabase'

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let cancelled = false
    const cached = getCachedBackendJwt()
    if (cached?.role === 'admin') {
      setIsAdmin(true)
      setLoading(false)
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

