import PricingPage from '../pages/PricingPage'
import type { MetaFunction } from 'react-router'

const pricingSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Coodra',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free trial available. Paid plans scale with retail footprint.',
  },
  description: 'AI-powered retail inventory management and decision intelligence.',
}

export const meta: MetaFunction = () => [
  { title: 'Pricing | Coodra' },
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
  {
    tagName: 'script',
    type: 'application/ld+json',
    props: {
      dangerouslySetInnerHTML: {
        __html: JSON.stringify(pricingSchema),
      },
    },
  },
]

export default PricingPage
