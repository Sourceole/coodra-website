import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [loading, setLoading] = useState(true)
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(!!session)
      setLoading(false)
    })

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-spinner" aria-label="Loading" />
      </div>
    )
  }

  if (!hasSession) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
