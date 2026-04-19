import PricingPage from '../pages/PricingPage'
import type { MetaFunction } from 'react-router'

export const meta: MetaFunction = () => [
  { title: 'Retail Inventory Management Pricing | Coodra' },
  { name: 'description', content: 'Connect POS once, then let Coodra run smarter decisions every day. Pricing that scales with your retail footprint.' },
  { property: 'og:title', content: 'Pricing | Coodra' },
  { property: 'og:description', content: 'Connect POS once, then let Coodra run smarter decisions every day. Pricing that scales with your retail footprint.' },
  { property: 'og:image', content: 'https://www.coodra.com/og-image.png' },
  { property: 'og:url', content: 'https://www.coodra.com/pricing' },
  { property: 'og:type', content: 'website' },
  { property: 'og:site_name', content: 'Coodra' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: 'Pricing | Coodra' },
  { name: 'twitter:description', content: 'Connect POS once, then let Coodra run smarter decisions every day.' },
  { name: 'twitter:image', content: 'https://www.coodra.com/og-image.png' },
  { name: 'robots', content: 'index, follow' },
  { tagName: 'link', rel: 'canonical', href: 'https://www.coodra.com/pricing' },
]

export default PricingPage
