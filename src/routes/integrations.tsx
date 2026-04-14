import type { MetaFunction } from 'react-router'
import IntegrationsPage from '../pages/IntegrationsPage'

export const meta: MetaFunction = () => [
  { title: 'POS Integrations - Coodra' },
  {
    name: 'description',
    content:
      'Connect Shopify, Square, Lightspeed, and Clover to Coodra and turn live store data into clear daily retail actions.',
  },
  { property: 'og:title', content: 'POS Integrations - Coodra' },
  {
    property: 'og:description',
    content:
      'Connect Shopify, Square, Lightspeed, and Clover to Coodra and turn live store data into clear daily retail actions.',
  },
  { property: 'og:image', content: 'https://www.coodra.com/og-image.png' },
  { property: 'og:url', content: 'https://www.coodra.com/integrations' },
  { property: 'og:type', content: 'website' },
  { property: 'og:site_name', content: 'Coodra' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: 'POS Integrations - Coodra' },
  {
    name: 'twitter:description',
    content:
      'Connect Shopify, Square, Lightspeed, and Clover to Coodra and turn live store data into clear daily retail actions.',
  },
  { name: 'twitter:image', content: 'https://www.coodra.com/og-image.png' },
  { name: 'robots', content: 'index, follow' },
  { tagName: 'link', rel: 'canonical', href: 'https://www.coodra.com/integrations' },
]

export default IntegrationsPage
