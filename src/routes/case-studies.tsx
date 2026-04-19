import type { MetaFunction } from 'react-router'
import CaseStudiesIndexPage from '../pages/CaseStudiesIndexPage'

export const meta: MetaFunction = () => [
  { title: 'Case Studies | Coodra' },
  {
    name: 'description',
    content:
      'See anonymized case study templates showing how Coodra helps retailers protect margin, reduce stock risk, and speed up decisions.',
  },
  { property: 'og:title', content: 'Case Studies | Coodra' },
  {
    property: 'og:description',
    content:
      'See anonymized case study templates showing how Coodra helps retailers protect margin, reduce stock risk, and speed up decisions.',
  },
  { property: 'og:image', content: 'https://www.coodra.com/og-image.png' },
  { property: 'og:url', content: 'https://www.coodra.com/case-studies' },
  { property: 'og:type', content: 'website' },
  { property: 'og:site_name', content: 'Coodra' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: 'Case Studies | Coodra' },
  {
    name: 'twitter:description',
    content:
      'See anonymized case study templates showing how Coodra helps retailers protect margin, reduce stock risk, and speed up decisions.',
  },
  { name: 'twitter:image', content: 'https://www.coodra.com/og-image.png' },
  { name: 'robots', content: 'index, follow' },
  { tagName: 'link', rel: 'canonical', href: 'https://www.coodra.com/case-studies' },
]

export default CaseStudiesIndexPage

