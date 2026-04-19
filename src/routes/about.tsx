import type { MetaFunction } from 'react-router'
import AboutPage from '../pages/AboutPage'

const aboutDescription =
  'Coodra is AI-powered retail intelligence for independent stores. We turn your POS sales and inventory data into clear daily actions - reorder, replace, remove, protect.'

export const meta: MetaFunction = () => [
  { title: 'About | Coodra' },
  { name: 'description', content: aboutDescription },
  { property: 'og:title', content: 'About | Coodra' },
  { property: 'og:description', content: aboutDescription },
  { property: 'og:image', content: 'https://www.coodra.com/og-image.png' },
  { property: 'og:url', content: 'https://www.coodra.com/about' },
  { property: 'og:type', content: 'website' },
  { property: 'og:site_name', content: 'Coodra' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: 'About | Coodra' },
  { name: 'twitter:description', content: aboutDescription },
  { name: 'twitter:image', content: 'https://www.coodra.com/og-image.png' },
  { name: 'robots', content: 'index, follow' },
  { tagName: 'link', rel: 'canonical', href: 'https://www.coodra.com/about' },
]

export default AboutPage
