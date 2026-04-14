import type { MetaFunction } from 'react-router'
import BlogIndexPage from '../pages/BlogIndexPage'

export const meta: MetaFunction = () => [
  { title: 'Blog - Coodra' },
  {
    name: 'description',
    content:
      'Retail decision intelligence articles on inventory, margin protection, POS signal quality, and faster store operations.',
  },
  { property: 'og:title', content: 'Blog - Coodra' },
  {
    property: 'og:description',
    content:
      'Retail decision intelligence articles on inventory, margin protection, POS signal quality, and faster store operations.',
  },
  { property: 'og:image', content: 'https://www.coodra.com/og-image.png' },
  { property: 'og:url', content: 'https://www.coodra.com/blog' },
  { property: 'og:type', content: 'website' },
  { property: 'og:site_name', content: 'Coodra' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: 'Blog - Coodra' },
  {
    name: 'twitter:description',
    content:
      'Retail decision intelligence articles on inventory, margin protection, POS signal quality, and faster store operations.',
  },
  { name: 'twitter:image', content: 'https://www.coodra.com/og-image.png' },
  { name: 'robots', content: 'index, follow' },
  { tagName: 'link', rel: 'canonical', href: 'https://www.coodra.com/blog' },
]

export default BlogIndexPage

