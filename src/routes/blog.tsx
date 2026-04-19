import type { MetaFunction } from 'react-router'
import BlogIndexPage from '../pages/BlogIndexPage'

export const meta: MetaFunction = () => [
  { title: 'Retail Inventory Intelligence | Coodra Blog' },
  {
    name: 'description',
    content: 'Practical guides and analysis on inventory management, margin protection, POS data, and smarter retail operations — written for independent retailers.',
  },
  { property: 'og:title', content: 'Retail Inventory Intelligence | Coodra Blog' },
  {
    property: 'og:description',
    content: 'Practical guides and analysis on inventory management, margin protection, POS data, and smarter retail operations — written for independent retailers.',
  },
  { property: 'og:image', content: 'https://www.coodra.com/og-image.png' },
  { property: 'og:url', content: 'https://www.coodra.com/blog' },
  { property: 'og:type', content: 'website' },
  { property: 'og:site_name', content: 'Coodra' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: 'Retail Inventory Intelligence | Coodra Blog' },
  {
    name: 'twitter:description',
    content: 'Practical guides and analysis on inventory management, margin protection, POS data, and smarter retail operations — written for independent retailers.',
  },
  { name: 'twitter:image', content: 'https://www.coodra.com/og-image.png' },
  { name: 'robots', content: 'index, follow' },
  { tagName: 'link', rel: 'canonical', href: 'https://www.coodra.com/blog' },
]

export default BlogIndexPage

