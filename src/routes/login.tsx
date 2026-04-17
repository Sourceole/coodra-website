import LoginPage from '../pages/LoginPage'
import type { MetaFunction } from 'react-router'

export const meta: MetaFunction = () => [
  { title: 'Log in | Coodra' },
  { name: 'description', content: 'Log in to your Coodra account and continue running smarter retail decisions.' },
  { property: 'og:title', content: 'Log in | Coodra' },
  { property: 'og:description', content: 'Log in to your Coodra account and continue running smarter retail decisions.' },
  { property: 'og:image', content: 'https://www.coodra.com/og-image.png' },
  { property: 'og:url', content: 'https://www.coodra.com/login' },
  { property: 'og:type', content: 'website' },
  { property: 'og:site_name', content: 'Coodra' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: 'Log in | Coodra' },
  { name: 'twitter:description', content: 'Log in to your Coodra account and continue running smarter retail decisions.' },
  { name: 'twitter:image', content: 'https://www.coodra.com/og-image.png' },
  { name: 'robots', content: 'noindex, follow' },
  { rel: 'canonical', href: 'https://www.coodra.com/login' },
]

export default LoginPage
