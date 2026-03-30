import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, exchangeForBackendJwt } from '../lib/supabase'
import './Dashboard.css'

type BootPayload = {
  userId: string | null
  email: string
  firstName: string
  company: string
  region: string
  backendJwt: string
  backendJwtExp: number
  role: string
}

declare global {
  interface Window {
    __SO_RC_BOOT__?: BootPayload
    __SO_RC_TEMPLATE_LOADED__?: boolean
  }
}

function clearStoredJwt() {
  try {
    sessionStorage.removeItem('backend_jwt')
    sessionStorage.removeItem('backend_jwt_exp')
  } catch {
    // ignore
  }
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    let scriptEl: HTMLScriptElement | null = null

    const init = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          if (!cancelled) navigate('/login')
          return
        }

        // Always exchange on boot so we don't get stuck with stale/invalid cached backend JWTs.
        const exchanged = await exchangeForBackendJwt()
        const jwt = exchanged?.token || ''
        const exp = Number(exchanged?.exp || 0)

        if (!jwt || !exp) {
          clearStoredJwt()
          if (!cancelled) navigate('/login')
          return
        }

        sessionStorage.setItem('backend_jwt', jwt)
        sessionStorage.setItem('backend_jwt_exp', String(exp))

        const user = session.user
        window.__SO_RC_BOOT__ = {
          userId: user.id || null,
          email: user.email || '',
          firstName: user.user_metadata?.first_name || user.user_metadata?.name?.split(' ')[0] || '',
          company: user.user_metadata?.business_name || user.email?.split('@')[0] || 'Retailer',
          region: user.user_metadata?.region || 'Unknown',
          backendJwt: jwt,
          backendJwtExp: exp,
          role: exchanged?.role || '',
        }

        const host = document.getElementById('soRcHost')
        if (!host) throw new Error('Dashboard host not found')

        const htmlRes = await fetch('/wh-command-center.template.html', { cache: 'no-store' })
        if (!htmlRes.ok) throw new Error('Could not load dashboard template')
        const templateHtml = await htmlRes.text()

        if (cancelled) return
        host.innerHTML = `<section id="so-rc-web" class="soRc soRc--booting">${templateHtml}</section>`

        scriptEl = document.createElement('script')
        scriptEl.src = `/wh-command-center.web.js?v=${Date.now()}`
        scriptEl.async = false
        scriptEl.onload = () => {
          if (cancelled) return
          window.__SO_RC_TEMPLATE_LOADED__ = true
          setLoading(false)
        }
        scriptEl.onerror = () => {
          if (cancelled) return
          setError('Dashboard script failed to load. Please refresh.')
          setLoading(false)
        }

        document.body.appendChild(scriptEl)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Dashboard failed to initialize')
          setLoading(false)
        }
      }
    }

    init()

    return () => {
      cancelled = true
      if (scriptEl && scriptEl.parentNode) scriptEl.parentNode.removeChild(scriptEl)
    }
  }, [navigate])

  return (
    <div className="dashboard-shell">
      <div id="soRcHost" className="dashboard-host" />
      {loading ? <div className="dashboard-loading">Loading...</div> : null}
      {error ? <div className="dashboard-error">{error}</div> : null}
    </div>
  )
}

