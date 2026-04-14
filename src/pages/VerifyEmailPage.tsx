import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { supabase } from '../lib/supabase'
import './VerifyEmailPage.css'

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const email = useMemo(() => (searchParams.get('email') || '').trim().toLowerCase(), [searchParams])

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
      if (!active) return
      if (session) navigate('/dashboard', { replace: true })
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (session) {
        navigate('/dashboard', { replace: true })
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [navigate])

  const resend = async () => {
    if (!email) {
      setStatus('error')
      setMessage('Missing email. Go back to sign up and try again.')
      return
    }

    setStatus('sending')
    setMessage('')
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (error) {
      setStatus('error')
      setMessage(error.message || 'Could not resend confirmation email.')
      return
    }

    setStatus('sent')
    setMessage('Confirmation email sent. Check your inbox and spam folder.')
  }

  return (
    <div className="verify-page">
      <div className="verify-card">
        <h1>Check your email</h1>
        <p>
          We sent a confirmation link{email ? ` to ${email}` : ''}. Once you confirm, this page will
          automatically take you to your dashboard.
        </p>

        {message ? <div className={`verify-msg verify-msg--${status === 'error' ? 'error' : 'ok'}`}>{message}</div> : null}

        <button className="verify-btn" type="button" onClick={resend} disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending...' : 'Resend confirmation email'}
        </button>

        <div className="verify-links">
          <Link to="/login">Back to login</Link>
          <Link to="/signup">Use another email</Link>
        </div>
      </div>
    </div>
  )
}
