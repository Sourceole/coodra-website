import PrivacyPage from '../pages/PrivacyPage'
import type { MetaFunction } from 'react-router'

export const meta: MetaFunction = () => [
  { title: 'Privacy Policy | Coodra' },
  { name: 'description', content: 'Read how Coodra collects, uses, and protects personal information across Canada and the United States.' },
  { property: 'og:title', content: 'Privacy Policy | Coodra' },
  { property: 'og:description', content: 'Read how Coodra collects, uses, and protects personal information across Canada and the United States.' },
  { property: 'og:image', content: 'https://www.coodra.com/og-image.png' },
  { property: 'og:url', content: 'https://www.coodra.com/privacy' },
  { property: 'og:type', content: 'website' },
  { property: 'og:site_name', content: 'Coodra' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: 'Privacy Policy | Coodra' },
  { name: 'twitter:description', content: 'Read how Coodra collects, uses, and protects personal information across Canada and the United States.' },
  { name: 'twitter:image', content: 'https://www.coodra.com/og-image.png' },
  { name: 'robots', content: 'index, follow' },
  { tagName: 'link', rel: 'canonical', href: 'https://www.coodra.com/privacy' },
]

export default PrivacyPage
