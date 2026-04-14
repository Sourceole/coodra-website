import TermsPage from '../pages/TermsPage'
import type { MetaFunction } from 'react-router'

export const meta: MetaFunction = () => [
  { title: 'Terms and Conditions — Coodra' },
  { name: 'description', content: 'Read Coodra terms and conditions for account use, data usage, service scope, and legal terms.' },
  { property: 'og:title', content: 'Terms and Conditions — Coodra' },
  { property: 'og:description', content: 'Read Coodra terms and conditions for account use, data usage, service scope, and legal terms.' },
  { property: 'og:image', content: 'https://www.coodra.com/og-image.png' },
  { property: 'og:url', content: 'https://www.coodra.com/terms' },
  { property: 'og:type', content: 'website' },
  { property: 'og:site_name', content: 'Coodra' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: 'Terms and Conditions — Coodra' },
  { name: 'twitter:description', content: 'Read Coodra terms and conditions for account use, data usage, service scope, and legal terms.' },
  { name: 'twitter:image', content: 'https://www.coodra.com/og-image.png' },
  { name: 'robots', content: 'index, follow' },
  { tagName: 'link', rel: 'canonical', href: 'https://www.coodra.com/terms' },
]

export default TermsPage
