import type { MetaFunction } from 'react-router'
import ComparisonsPage from '../pages/ComparisonsPage'

export const meta: MetaFunction = () => [
  { title: 'Coodra vs Netstock, Cin7, and Alternatives | Coodra' },
  {
    name: 'description',
    content:
      'See how Coodra compares to Netstock and Cin7 — built for independent retailers without an ERP, live in one day, no data cleanup required.',
  },
  { property: 'og:title', content: 'Coodra vs Netstock, Cin7 | Inventory Software Comparisons' },
  {
    property: 'og:description',
    content:
      'Built for independent retail, not enterprise operations. Coodra goes live the same day you connect your store — no ERP, no data cleanup, no weeks of setup.',
  },
  { property: 'og:image', content: 'https://www.coodra.com/og-image.png' },
  { property: 'og:url', content: 'https://www.coodra.com/comparisons' },
  { property: 'og:type', content: 'website' },
  { property: 'og:site_name', content: 'Coodra' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: 'Coodra vs Netstock, Cin7 | Comparisons' },
  {
    name: 'twitter:description',
    content: 'Coodra vs Netstock and Cin7 — independent retail inventory software comparison.',
  },
  { name: 'twitter:image', content: 'https://www.coodra.com/og-image.png' },
  { name: 'robots', content: 'index, follow' },
  { tagName: 'link', rel: 'canonical', href: 'https://www.coodra.com/comparisons' },
]

export default ComparisonsPage
