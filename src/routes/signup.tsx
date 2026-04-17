import SignupPage from '../pages/SignupPage'
import type { MetaFunction } from 'react-router'

export const meta: MetaFunction = () => [
  { title: 'Start free | Coodra' },
  { name: 'description', content: 'Open your Coodra account and start running product decisions. AI-powered retail decision intelligence for independent retailers.' },
  { property: 'og:title', content: 'Start free | Coodra' },
  { property: 'og:description', content: 'Open your Coodra account and start running product decisions. AI-powered retail decision intelligence for independent retailers.' },
  { property: 'og:image', content: 'https://www.coodra.com/og-image.png' },
  { property: 'og:url', content: 'https://www.coodra.com/signup' },
  { property: 'og:type', content: 'website' },
  { property: 'og:site_name', content: 'Coodra' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: 'Start free | Coodra' },
  { name: 'twitter:description', content: 'Open your Coodra account and start running product decisions.' },
  { name: 'twitter:image', content: 'https://www.coodra.com/og-image.png' },
  { name: 'robots', content: 'noindex, follow' },
  { rel: 'canonical', href: 'https://www.coodra.com/signup' },
]

export default SignupPage
