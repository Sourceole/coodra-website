import LandingPage from '../pages/LandingPage'
import type { MetaFunction } from 'react-router'

export const meta: MetaFunction = () => [
  { title: 'Retail Inventory Intelligence | Coodra' },
  {
    name: 'description',
    content:
      'Coodra inventory management tracks sales, inventory, and demand signals in real time, then recommends exactly what to reorder, replace, remove, and protect so your retail team can act faster.',
  },
  { tagName: 'link', rel: 'canonical', href: 'https://www.coodra.com/' },
  { property: 'og:title', content: 'Retail Inventory Intelligence | Coodra' },
  {
    property: 'og:description',
    content:
      'AI-powered retail decision engine. Know what to reorder, replace, remove, and protect. Built for Shopify, Square, Lightspeed, and Clover.',
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
      'AI-powered retail decision engine. Know what to reorder, replace, remove, and protect.',
  },
  { name: 'twitter:image', content: 'https://www.coodra.com/og-image.png' },
  { name: 'robots', content: 'index, follow' },
]

export default LandingPage
