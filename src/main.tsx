import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import './index.css'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Dashboard from './pages/Dashboard'
import PricingPage from './pages/PricingPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import { AuthGuard } from './components/AuthGuard'

declare global {
  interface Window {
    __COODRA_SENTRY_TEST__?: (message?: string) => void
  }
}

const sentryDsn = (import.meta.env.VITE_SENTRY_DSN as string | undefined)?.trim() || ''
const sentryEnabledInDev = String(import.meta.env.VITE_SENTRY_ENABLE_IN_DEV || '').toLowerCase() === 'true'
const sentryEnabled = Boolean(sentryDsn) && (import.meta.env.PROD || sentryEnabledInDev)
const tracesSampleRate = Number(String(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE ?? '0.1').trim())
const replaysSessionSampleRate = Number(String(import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE ?? '0.0').trim())
const replaysOnErrorSampleRate = Number(String(import.meta.env.VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE ?? '1.0').trim())

if (sentryEnabled) {
  Sentry.init({
    dsn: sentryDsn,
    environment: import.meta.env.MODE,
    release: (import.meta.env.VITE_APP_RELEASE as string | undefined)?.trim() || undefined,
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    tracesSampleRate: Number.isFinite(tracesSampleRate) ? tracesSampleRate : 0.1,
    replaysSessionSampleRate: Number.isFinite(replaysSessionSampleRate) ? replaysSessionSampleRate : 0.0,
    replaysOnErrorSampleRate: Number.isFinite(replaysOnErrorSampleRate) ? replaysOnErrorSampleRate : 1.0,
    sendDefaultPii: false,
  })

  window.__COODRA_SENTRY_TEST__ = (message = 'Coodra Sentry forced test') => {
    Sentry.captureException(new Error(String(message)))
    void Sentry.flush(2000)
  }
} else {
  window.__COODRA_SENTRY_TEST__ = (message = 'Coodra Sentry forced test') => {
    console.warn('[Coodra] Sentry is disabled in this build', { message })
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
