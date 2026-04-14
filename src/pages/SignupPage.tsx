import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { supabase, resolveApiEndpoint } from '../lib/supabase'
import { trackEvent } from '../lib/analytics'
import './SignupPage.css'

export default function SignupPage() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [acceptedLegal, setAcceptedLegal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!acceptedLegal) {
      setError('Please accept the Privacy Policy and Terms and Conditions to continue.')
      return
    }

    setLoading(true)
    setError('')
    trackEvent('form_submit', { form_name: 'signup', form_state: 'attempt' })

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          business_name: businessName,
          name: `${firstName} ${lastName}`.trim(),
        },
      },
    })

    if (authError) {
      trackEvent('form_submit', { form_name: 'signup', form_state: 'error' })
      setError(authError.message)
      setLoading(false)
      return
    }

    // Best-effort backend notification
    try {
      fetch(resolveApiEndpoint('/log?action=partner_application_submit'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'partner_application_submit',
          application_type: 'retailer',
          company_name: businessName,
          contact_name: `${firstName} ${lastName}`.trim(),
          email: email.toLowerCase(),
          source: 'register_page',
          notes: 'Self-serve signup',
        }),
        keepalive: true,
      }).catch(() => {})
    } catch {
      void 0
    }

    setLoading(false)

    if (data?.session) {
      trackEvent('form_submit', { form_name: 'signup', form_state: 'success' })
      navigate('/dashboard')
      return
    }

    trackEvent('form_submit', { form_name: 'signup', form_state: 'success' })
    navigate(`/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`)
  }

  const handleGoogleSignup = async () => {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (error) {
      setError(error.message)
      setGoogleLoading(false)
    }
  }

  return (
    <div className="signup">
      <div className="signup__layout">
        {/* Left showcase */}
        <div className="signup__showcase" aria-hidden="true">
          <div className="signup__showcaseInner">
            <a className="signup__brand" href="/" aria-label="Go to Coodra home">
              <img
                src="/images/coodra-logo.png"
                alt="Coodra"
                className="coodra-logo-img"
              />
            </a>

            <div className="signup__heroCopy">
              <h1>Run Retail<br /><span>Decisions</span></h1>
              <p>
                Coodra analyzes sales, inventory, and market context to decide what
                to reorder, replace, remove, and promote.
              </p>
            </div>

            <div className="signup__cards">
              <div className="signup__dot signup__dot--1" />
              <div className="signup__dot signup__dot--2" />

              {/* Main floating card */}
              <div className="signup__visualCard signup__visualCard--main">
                <div className="signup__visualPad">
                  <div className="signup__badgeRow">
                    <span className="signup__vBadge">Coodra Decision</span>
                    <span className="signup__vBadge">Confidence: High</span>
                  </div>
                  <div className="signup__vBlock">
                    Replace Product A with Product B<br />
                    Projected margin improvement: +12%
                  </div>
                  <div className="signup__typingWrap">
                    <span>Analyzing:</span>
                    <span className="signup__typing">margin deltas, sell-through, demand shifts</span>
                  </div>
                </div>
              </div>

              {/* Side floating card */}
              <div className="signup__visualCard signup__visualCard--side">
                <div className="signup__visualPad">
                  <div className="signup__vBadge">Live Analysis</div>
                  <div className="signup__vLine signup__vLine--1" />
                  <div className="signup__vLine signup__vLine--2" />
                  <div className="signup__vLine signup__vLine--3" />
                </div>
              </div>

              {/* Mini floating card */}
              <div className="signup__visualCard signup__visualCard--mini">
                <div className="signup__visualPad">
                  <div className="signup__vBadge">Market Shift</div>
                  <div className="signup__vLine signup__vLine--1" />
                  <div className="signup__vLine signup__vLine--3" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="signup__panel">
          <div className="signup__card">
            <h1>Create account</h1>
            <p>Open your Coodra account and start running product decisions.</p>

            {error && <div className="signup__errors">{error}</div>}

            <form onSubmit={handleSignup}>
              <div className="signup__grid">
                <div className="signup__field">
                  <label htmlFor="reg-first">First name</label>
                  <input
                    id="reg-first"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Alex"
                    required
                    autoComplete="given-name"
                  />
                </div>
                <div className="signup__field">
                  <label htmlFor="reg-last">Last name</label>
                  <input
                    id="reg-last"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Morgan"
                    required
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div className="signup__field">
                <label htmlFor="reg-business">Business name</label>
                <input
                  id="reg-business"
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="My Retail Store"
                  required
                  autoComplete="organization"
                />
              </div>

              <div className="signup__field">
                <label htmlFor="reg-email">Work email</label>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="retailer@business.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="signup__field">
                <label htmlFor="reg-pass">Password</label>
                <input
                  id="reg-pass"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  autoComplete="new-password"
                  minLength={8}
                />
              </div>

              <label className="signup__legalCheck" htmlFor="reg-legal-accept">
                <input
                  id="reg-legal-accept"
                  type="checkbox"
                  checked={acceptedLegal}
                  onChange={(e) => setAcceptedLegal(e.target.checked)}
                  required
                />
                <span>
                  I agree to the <Link to="/privacy">Privacy Policy</Link> and <Link to="/terms">Terms and Conditions</Link>.
                </span>
              </label>

              <button type="submit" className="signup__btn" disabled={loading}>
                {loading ? 'Creating account...' : 'Start Free'}
              </button>
            </form>

            <div className="signup__divider">or</div>

            <button type="button" className="btn-google" onClick={handleGoogleSignup} disabled={googleLoading}>
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
              Continue with Google
            </button>

            <div className="signup__links">
              Already have an account? <Link to="/login">Log in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


