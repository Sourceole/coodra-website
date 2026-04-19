import type { MetaFunction } from 'react-router'
import ResourcesPage from '../pages/ResourcesPage'

export const meta: MetaFunction = () => [
  { title: 'Retail Operations Resources — Guides & Tools | Coodra' },
  {
    name: 'description',
    content: 'Free guides, research, and tools for independent retailers on inventory management, POS data, margin improvement, and store operations.',
  },
  { property: 'og:title', content: 'Retail Operations Resources | Coodra' },
  {
    property: 'og:description',
    content: 'Free guides, research, and tools for independent retailers on inventory management, POS data, margin improvement, and store operations.',
  },
  { property: 'og:image', content: 'https://www.coodra.com/og-image.png' },
  { property: 'og:url', content: 'https://www.coodra.com/resources' },
  { property: 'og:type', content: 'website' },
  { property: 'og:site_name', content: 'Coodra' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: 'Retail Operations Resources | Coodra' },
  {
    name: 'twitter:description',
    content: 'Free guides, research, and tools for independent retailers on inventory management, POS data, margin improvement, and store operations.',
  },
  { name: 'twitter:image', content: 'https://www.coodra.com/og-image.png' },
  { name: 'robots', content: 'index, follow' },
  { tagName: 'link', rel: 'canonical', href: 'https://www.coodra.com/resources' },
]

export default ResourcesPage
