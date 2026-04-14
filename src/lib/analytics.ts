type AnalyticsParams = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined

let initialized = false

const isEnabled = () => typeof window !== 'undefined' && Boolean(GA_MEASUREMENT_ID)

const ensureGtag = () => {
  if (!window.dataLayer) window.dataLayer = []
  if (!window.gtag) {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args)
    }
  }
}

export const initAnalytics = () => {
  if (!isEnabled() || initialized || !GA_MEASUREMENT_ID) return
  ensureGtag()
  window.gtag?.('js', new Date())
  // Disable automatic page_view so router-driven page tracking stays accurate.
  window.gtag?.('config', GA_MEASUREMENT_ID, { send_page_view: false })
  initialized = true
}

export const trackEvent = (eventName: string, params: AnalyticsParams = {}) => {
  if (!isEnabled()) return
  ensureGtag()
  window.gtag?.('event', eventName, params)
}

export const trackPageView = (path: string, title?: string) => {
  trackEvent('page_view', {
    page_path: path,
    page_title: title,
  })
}
