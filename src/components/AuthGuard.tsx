import { useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { getSessionSafely, supabase } from '../lib/supabase'

interface AuthGuardProps {
  children: React.ReactNode
}

async function getSessionWithTimeout(timeoutMs = 8000): Promise<Session | null> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    const timerId = setTimeout(() => {
      clearTimeout(timerId)
      reject(new Error('Session check timed out'))
    }, timeoutMs)
  })

  const sessionPromise = getSessionSafely()

  return Promise.race([sessionPromise, timeoutPromise])
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [loading, setLoading] = useState(true)
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    let cancelled = false

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      if (cancelled) return
      setHasSession(!!session)
      setLoading(false)
    })

    // Check current session with timeout so the guard cannot hang forever.
    getSessionWithTimeout()
      .then((session) => {
        if (cancelled) return
        setHasSession(!!session)
      })
      .catch(() => {
        if (cancelled) return
        setHasSession(false)
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })

    return () => {
      cancelled = true
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
