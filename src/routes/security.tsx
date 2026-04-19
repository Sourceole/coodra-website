import type { MetaFunction } from 'react-router'
import SecurityPage from '../pages/SecurityPage'

export const meta: MetaFunction = () => [
  { title: 'Security | Coodra' },
  {
    name: 'description',
    content:
      'Review Coodra security controls, implementation status, and operational safeguards for retail decision intelligence.',
  },
  { property: 'og:title', content: 'Security | Coodra' },
  {
    property: 'og:description',
    content:
      'Review Coodra security controls, implementation status, and operational safeguards for retail decision intelligence.',
  },
  { property: 'og:image', content: 'https://www.coodra.com/og-image.png' },
  { property: 'og:url', content: 'https://www.coodra.com/security' },
  { property: 'og:type', content: 'website' },
  { property: 'og:site_name', content: 'Coodra' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: 'Security | Coodra' },
  {
    name: 'twitter:description',
    content:
      'Review Coodra security controls, implementation status, and operational safeguards for retail decision intelligence.',
  },
  { name: 'twitter:image', content: 'https://www.coodra.com/og-image.png' },
  { name: 'robots', content: 'index, follow' },
  { tagName: 'link', rel: 'canonical', href: 'https://www.coodra.com/security' },
]

export default SecurityPage
