import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from 'react-router'
import type { LinksFunction, MetaFunction } from 'react-router'
import { useEffect } from 'react'
import '../src/index.css'
import { initAnalytics, trackEvent, trackPageView } from '../src/lib/analytics'

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined
const SITE_URL = 'https://www.coodra.com'

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Coodra',
  url: SITE_URL,
  logo: `${SITE_URL}/images/coodra-logo.png`,
  email: 'admin@coodra.com',
  sameAs: [],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'Coodra',
  description: 'Retail decision intelligence platform for sales, inventory, and demand.',
  inLanguage: 'en',
  publisher: {
    '@id': `${SITE_URL}/#organization`,
  },
}

export const links: LinksFunction = () => [
  { rel: 'preload', href: '/fonts/bebas-neue-400.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
  { rel: 'preload', href: '/fonts/nunito-400.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
  { rel: 'preload', href: '/fonts/nunito-700.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
  { rel: 'icon', type: 'image/png', href: '/favicon.png?v=4' },
  { rel: 'shortcut icon', href: '/favicon.png?v=4' },
  { rel: 'apple-touch-icon', href: '/favicon.png?v=4' },
]

export const meta: MetaFunction = () => [
  { name: 'description', content: 'Coodra tracks sales, inventory, and demand signals in real time, then recommends exactly what to reorder, replace, remove, and protect so your retail team can act faster.' },
  { name: 'robots', content: 'index, follow' },
  { property: 'og:title', content: 'Coodra - Retail Decision Intelligence' },
  { property: 'og:description', content: 'AI-powered retail decision engine. Know what to reorder, replace, remove, and protect. Built for Shopify, Square, Lightspeed, and Clover.' },
  { property: 'og:image', content: 'https://www.coodra.com/og-image.png' },
  { property: 'og:url', content: 'https://www.coodra.com/' },
  { property: 'og:type', content: 'website' },
  { property: 'og:site_name', content: 'Coodra' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: 'Coodra - Retail Decision Intelligence' },
  { name: 'twitter:description', content: 'AI-powered retail decision engine. Know what to reorder, replace, remove, and protect.' },
  { name: 'twitter:image', content: 'https://www.coodra.com/og-image.png' },
  { title: 'Coodra - Retail Decision Intelligence' },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-so-rc-theme="light" style={{ backgroundColor: '#f4f5f7' }}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0b1220" />
        {GA_MEASUREMENT_ID ? (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  window.gtag = gtag;
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}', {
                    send_page_view: false
                  });
                `,
              }}
            />
          </>
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Meta />
        <Links />
      </head>
      <body data-so-rc-theme="light" style={{ backgroundColor: '#f4f5f7' }}>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  const location = useLocation()

  useEffect(() => {
    initAnalytics()
  }, [])

  useEffect(() => {
    const path = `${location.pathname}${location.search || ''}`
    trackPageView(path, document.title)
  }, [location.pathname, location.search])

  useEffect(() => {
    if (!location.hash) return

    const hash = decodeURIComponent(location.hash.replace(/^#/, ''))

    if (hash === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const scrollToHashTarget = () => {
      const target = document.getElementById(hash)
      if (!target) return
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(scrollToHashTarget)
    })

    return () => cancelAnimationFrame(raf1)
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (location.pathname !== '/') return
    let hasTracked = false

    const onScroll = () => {
      if (hasTracked) return
      const doc = document.documentElement
      const maxScrollable = Math.max(doc.scrollHeight - window.innerHeight, 1)
      const progress = (window.scrollY / maxScrollable) * 100
      if (progress >= 75) {
        hasTracked = true
        trackEvent('scroll_depth_75', {
          page_path: location.pathname,
          percent_scrolled: 75,
        })
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [location.pathname])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const cta = target?.closest('a, button') as HTMLElement | null
      if (!cta) return

      const isBrandedButton = cta.classList.contains('btn')
      const isTaggedCta = cta.hasAttribute('data-analytics-click')
      if (!isBrandedButton && !isTaggedCta) return

      const text = (cta.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80)
      const href = cta instanceof HTMLAnchorElement ? cta.getAttribute('href') || '' : ''

      trackEvent('cta_click', {
        cta_text: text || 'unknown',
        destination: href || 'button',
        page_path: location.pathname,
      })
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [location.pathname])

  return <Outlet />
}
