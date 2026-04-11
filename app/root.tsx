import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router'
import type { LinksFunction, MetaFunction } from 'react-router'
import '../src/index.css'

export const links: LinksFunction = () => [
  { rel: 'icon', type: 'image/png', href: '/favicon.png?v=3' },
  { rel: 'shortcut icon', href: '/favicon.png?v=3' },
  { rel: 'apple-touch-icon', href: '/favicon.png?v=3' },
]

export const meta: MetaFunction = () => [
  { name: 'description', content: 'Coodra tracks sales, inventory, and demand signals in real time, then recommends exactly what to reorder, replace, remove, and protect so your retail team can act faster.' },
  { name: 'robots', content: 'index, follow' },
  { property: 'og:title', content: 'Coodra — Retail Decision Intelligence' },
  { property: 'og:description', content: 'AI-powered retail decision engine. Know what to reorder, replace, remove, and protect. Built for Shopify, Square, Lightspeed, and Clover.' },
  { property: 'og:image', content: 'https://www.coodra.com/og-image.png' },
  { property: 'og:url', content: 'https://www.coodra.com/' },
  { property: 'og:type', content: 'website' },
  { property: 'og:site_name', content: 'Coodra' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: 'Coodra — Retail Decision Intelligence' },
  { name: 'twitter:description', content: 'AI-powered retail decision engine. Know what to reorder, replace, remove, and protect.' },
  { name: 'twitter:image', content: 'https://www.coodra.com/og-image.png' },
  { title: 'Coodra — Retail Decision Intelligence' },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0b1220" />
        <link rel="canonical" href="https://www.coodra.com/" />
        <Meta />
        <Links />
        {/* Inline theme script to prevent flash — must run before body renders */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var raw=localStorage.getItem('so_theme_last_v1')||'';var mode=String(raw).trim().toLowerCase()==='dark'?'dark':'light';var bg=mode==='dark'?'#0b1220':'#f4f5f7';document.documentElement.setAttribute('data-so-rc-theme',mode);document.documentElement.style.backgroundColor=bg;if(document.body){document.body.setAttribute('data-so-rc-theme',mode);document.body.style.backgroundColor=bg;}}catch(_){}})();`,
          }}
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
