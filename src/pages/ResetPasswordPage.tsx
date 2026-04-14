import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { supabase } from '../lib/supabase'
import { trackEvent } from '../lib/analytics'
import './ResetPasswordPage.css'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    trackEvent('form_submit', { form_name: 'reset_password', form_state: 'attempt' })

    if (password.length < 8) {
      trackEvent('form_submit', { form_name: 'reset_password', form_state: 'error' })
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      trackEvent('form_submit', { form_name: 'reset_password', form_state: 'error' })
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (updateError) {
      trackEvent('form_submit', { form_name: 'reset_password', form_state: 'error' })
      setError(updateError.message || 'Could not update password.')
      return
    }

    trackEvent('form_submit', { form_name: 'reset_password', form_state: 'success' })
    setMessage('Password updated. You can now log in.')
    setTimeout(() => navigate('/login', { replace: true }), 1000)
  }

  return (
    <div className="reset-page">
      <div className="reset-card">
        <h1>Set a new password</h1>
        <p>Choose a secure password for your Coodra account.</p>

        {error ? <div className="reset-msg reset-msg--error">{error}</div> : null}
        {message ? <div className="reset-msg reset-msg--ok">{message}</div> : null}

        <form onSubmit={submit}>
          <label htmlFor="new-password">New password</label>
          <input
            id="new-password"
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <label htmlFor="confirm-password">Confirm password</label>
          <input
            id="confirm-password"
            type="password"
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update password'}
          </button>
        </form>

        <div className="reset-links">
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </div>
  )
}



