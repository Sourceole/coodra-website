import AboutPage from '../pages/AboutPage'
import type { MetaFunction } from 'react-router'

export const meta: MetaFunction = () => [
  { title: 'About - Coodra' },
  { name: 'description', content: 'Learn how Coodra helps retail teams turn live data into clear, measurable actions.' },
  { property: 'og:title', content: 'About - Coodra' },
  { property: 'og:description', content: 'Learn how Coodra helps retail teams turn live data into clear, measurable actions.' },
  { property: 'og:image', content: 'https://www.coodra.com/og-image.png' },
  { property: 'og:url', content: 'https://www.coodra.com/about' },
  { property: 'og:type', content: 'website' },
  { property: 'og:site_name', content: 'Coodra' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: 'About - Coodra' },
  { name: 'twitter:description', content: 'Learn how Coodra helps retail teams turn live data into clear, measurable actions.' },
  { name: 'twitter:image', content: 'https://www.coodra.com/og-image.png' },
  { name: 'robots', content: 'index, follow' },
  { tagName: 'link', rel: 'canonical', href: 'https://www.coodra.com/about' },
]

export default AboutPage

