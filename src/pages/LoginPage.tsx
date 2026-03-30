import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase, exchangeForBackendJwt } from '../lib/supabase'
import './LoginPage.css'

const RECOMMENDATIONS = [
  { tag: 'Reorder', text: 'Royal Canin S/O - 14 units left', confidence: 'High confidence' },
  { tag: 'Replace', text: 'Switch Brand B -> Brand A (+12% margin)', confidence: 'High confidence' },
  { tag: 'Remove', text: 'Clear slow mover - zero sales, 90 days', confidence: 'Medium confidence' },
  { tag: 'Protect', text: 'Top seller - auto-reorder enabled', confidence: 'High confidence' },
]

function LiveWidget() {
  const [saleCount, setSaleCount] = useState(1847)
  const [stockLevel, setStockLevel] = useState(62)
  const [recIdx, setRecIdx] = useState(0)
  const [recVisible, setRecVisible] = useState(true)
  const saleRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const recRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sales counter: ticks up every 1.4s
  useEffect(() => {
    saleRef.current = setInterval(() => {
      setSaleCount((n) => n + Math.floor(Math.random() * 3 + 1))
    }, 1400)
    return () => {
      if (saleRef.current) clearInterval(saleRef.current)
    }
  }, [])

  // Stock bar: slow drift
  useEffect(() => {
    const id = setInterval(() => {
      setStockLevel((n) => {
        const next = n + (Math.random() > 0.5 ? 1 : -1)
        return Math.max(20, Math.min(95, next))
      })
    }, 800)
    return () => clearInterval(id)
  }, [])

  // Recommendation card cycling
  useEffect(() => {
    recRef.current = setTimeout(() => {
      setRecVisible(false)
      setTimeout(() => {
        setRecIdx((i) => (i + 1) % RECOMMENDATIONS.length)
        setRecVisible(true)
      }, 400)
    }, 3500)
    return () => {
      if (recRef.current) clearTimeout(recRef.current)
    }
  }, [recIdx])

  const rec = RECOMMENDATIONS[recIdx]
  const stockColor = stockLevel > 70 ? '#2ED3B7' : stockLevel > 40 ? '#F59E0B' : '#EF4444'

  return (
    <div className="live-widget" aria-label="Live Coodra workspace preview">
      <div className="live-widget__header">
        <div className="live-widget__pulse" />
        <span>Live · Coodra Workspace</span>
      </div>

      <div className="live-widget__metrics">
        <div className="live-widget__metric">
          <span className="live-widget__metric-label">Sales Today</span>
          <span className="live-widget__metric-value live-widget__sales">${saleCount.toLocaleString()}</span>
        </div>
        <div className="live-widget__metric">
          <span className="live-widget__metric-label">Stock Health</span>
          <div className="live-widget__bar-wrap">
            <div className="live-widget__bar" style={{ width: `${stockLevel}%`, background: stockColor }} />
          </div>
          <span className="live-widget__metric-sub">{stockLevel}% in stock</span>
        </div>
      </div>

      <div className={`live-widget__rec ${recVisible ? 'is-visible' : 'is-hidden'}`}>
        <div className="live-widget__rec-header">
          <span className="live-widget__rec-tag">{rec.tag}</span>
          <span className="live-widget__rec-conf">{rec.confidence}</span>
        </div>
        <p className="live-widget__rec-text">{rec.text}</p>
        <div className="live-widget__rec-actions">
          <button className="live-widget__btn live-widget__btn--approve">Approve</button>
          <div className="live-widget__rec-action-right">
            <div className="live-widget__pulse" />
            <button className="live-widget__btn live-widget__btn--dismiss">Dismiss</button>
          </div>
        </div>
      </div>

      <div className="live-widget__float live-widget__float--1" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="1" width="5" height="5" rx="1" fill="rgba(46,211,183,0.6)" />
          <rect x="8" y="1" width="5" height="5" rx="1" fill="rgba(46,211,183,0.4)" />
          <rect x="1" y="8" width="5" height="5" rx="1" fill="rgba(46,211,183,0.3)" />
          <rect x="8" y="8" width="5" height="5" rx="1" fill="rgba(46,211,183,0.5)" />
        </svg>
      </div>
      <div className="live-widget__float live-widget__float--2" aria-hidden="true">
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
          <path d="M1 9 L5 3 L9 6 L13 1 L15 2" stroke="rgba(46,211,183,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showRecover, setShowRecover] = useState(false)
  const [recoverEmail, setRecoverEmail] = useState('')
  const [recoverState, setRecoverState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [recoverError, setRecoverError] = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)

  useEffect(() => {
    let active = true
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!active || !session) return

      const exchanged = await exchangeForBackendJwt()
      if (!active) return

      if (exchanged?.token && exchanged?.exp) {
        try {
          sessionStorage.setItem('backend_jwt', exchanged.token)
          sessionStorage.setItem('backend_jwt_exp', String(exchanged.exp))
        } catch {
          // ignore storage failures
        }
        navigate('/dashboard', { replace: true })
        return
      }

      // If the backend JWT exchange fails, don't bounce in a login<->dashboard loop.
      await supabase.auth.signOut().catch(() => {})
      setError('Your session could not be verified. Please sign in again.')
    }
    void init()

    return () => {
      active = false
    }
  }, [navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    const exchanged = await exchangeForBackendJwt()
    if (!exchanged?.token || !exchanged?.exp) {
      await supabase.auth.signOut().catch(() => {})
      setError('Sign-in succeeded, but your dashboard session could not be verified. Please try again.')
      setLoading(false)
      return
    }

    try {
      sessionStorage.setItem('backend_jwt', exchanged.token)
      sessionStorage.setItem('backend_jwt_exp', String(exchanged.exp))
    } catch {
      // ignore storage failures
    }

    setLoading(false)
    navigate('/dashboard')
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (oauthError) {
      setError(oauthError.message)
      setGoogleLoading(false)
    }
  }

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault()
    setRecoverState('sending')
    setRecoverError('')

    const { error: recoverErr } = await supabase.auth.resetPasswordForEmail(recoverEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (recoverErr) {
      setRecoverError(recoverErr.message)
      setRecoverState('error')
      return
    }

    setRecoverState('sent')
  }

  return (
    <div className="login">
      <div className="login__layout">
        <div className="login__left" aria-hidden="true">
          <a className="login__logo" href="/" aria-label="Go to Coodra home">
            <img src="/images/coodra-logo.png" alt="Coodra" className="coodra-logo-img" />
          </a>
          <div className="login__intro">
            <h1>
              Welcome back to
              <br />
              <span>Coodra</span>
            </h1>
            <p>Log in and continue running smarter retail decisions.</p>
            <LiveWidget />
          </div>
        </div>

        <div className="login__panel">
          <div className="login__card">
            <div className="login__view" style={{ display: showRecover ? 'none' : undefined }}>
              <h1 className="login__title">Log in</h1>
              <p className="login__sub">Use your account to continue to your retailer workspace.</p>

              {error && <div className="login__errors">{error}</div>}

              <form onSubmit={handleLogin}>
                <div className="login__field">
                  <label htmlFor="login-email">Email</label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="retailer@business.com"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="login__field">
                  <label htmlFor="login-pass">Password</label>
                  <input
                    id="login-pass"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    required
                    autoComplete="current-password"
                  />
                </div>

                <button type="submit" className="login__btn" disabled={loading}>
                  {loading ? 'Signing in...' : 'Log in'}
                </button>
              </form>

              <div className="login__divider">or</div>

              <button type="button" className="btn-google" onClick={handleGoogleLogin} disabled={googleLoading}>
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                  <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/>
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                </svg>
                Continue with Google
              </button>

              <button type="button" className="login__btnGhost" onClick={() => setShowRecover(true)}>
                Forgot password?
              </button>

              <div className="login__links">
                Need an account? <Link to="/signup">Start free</Link>
              </div>
            </div>

            <div className="login__view" style={{ display: showRecover ? undefined : 'none' }}>
              <div className="login__recover" style={{ marginTop: 0 }} id="loginRecoverBox">
                <p className="login__recoverTitle">Reset your password</p>
                <p className="login__recoverSub">Enter your account email and we'll send a secure reset link.</p>

                {recoverState === 'error' && (
                  <div className="login__recoverMsg login__recoverMsg--err is-show">{recoverError}</div>
                )}

                {recoverState === 'sent' && (
                  <div className="login__recoverSuccess">
                    We sent a password reset email. Check your inbox and spam folder for the reset link.
                  </div>
                )}

                <form onSubmit={handleRecover}>
                  <div className="login__recoverFormRow login__field">
                    <label htmlFor="recover-email">Account email</label>
                    <input
                      id="recover-email"
                      type="email"
                      value={recoverEmail}
                      onChange={(e) => setRecoverEmail(e.target.value)}
                      placeholder="retailer@business.com"
                      required
                      autoComplete="email"
                    />
                  </div>

                  <button type="submit" className="login__btn" disabled={recoverState === 'sending'}>
                    {recoverState === 'sending' ? 'Sending...' : 'Send reset email'}
                  </button>
                </form>

                <button
                  type="button"
                  className="login__backBtn"
                  onClick={() => {
                    setShowRecover(false)
                    setRecoverState('idle')
                    setRecoverError('')
                  }}
                >
                  Back to login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
