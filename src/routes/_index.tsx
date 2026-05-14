import LandingPage from '../pages/LandingPage'
import type { MetaFunction } from 'react-router'

export const meta: MetaFunction = () => [
  { title: 'Retail Inventory Intelligence | Coodra' },
  {
    name: 'description',
    content:
      'Coodra inventory management tracks sales, inventory, and demand signals in real time, then surfaces ranked reorder, replace, and remove recommendations with rationale so your retail team can act faster.',
  },
  { tagName: 'link', rel: 'canonical', href: 'https://www.coodra.com/' },
  { property: 'og:title', content: 'Retail Inventory Intelligence | Coodra' },
  {
    property: 'og:description',
    content:
      'AI-powered retail decision engine. Review ranked reorder, replace, and remove recommendations with clear rationale. Built for Shopify, Square, Lightspeed, and Clover.',
  },
  { property: 'og:image', content: 'https://www.coodra.com/og-image.png' },
  { property: 'og:url', content: 'https://www.coodra.com/' },
  { property: 'og:type', content: 'website' },
  { property: 'og:site_name', content: 'Coodra' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: 'Retail Inventory Intelligence | Coodra' },
  {
    name: 'twitter:description',
    content:
      'AI-powered retail decision engine. Review ranked reorder, replace, and remove recommendations with rationale.',
  },
  { name: 'twitter:image', content: 'https://www.coodra.com/og-image.png' },
  { name: 'robots', content: 'index, follow' },
  { tagName: 'link', rel: 'preload', as: 'image', href: '/images/landing/hero-left.webp', type: 'image/webp' },
]

export default LandingPage
