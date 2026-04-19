import type { MetaFunction } from 'react-router'
import InventoryManagementPage from '../pages/InventoryManagementPage'

export const meta: MetaFunction = () => [
  { title: 'Retail Inventory Management — AI Ranked Decisions | Coodra' },
  {
    name: 'description',
    content:
      'Coodra connects to your POS and turns raw sales and inventory data into a weekly ranked list of reorder, replace, and remove decisions — with clear rationale and expected margin impact.',
  },
  { property: 'og:title', content: 'Retail Inventory Management | Coodra' },
  {
    property: 'og:description',
    content:
      'Stop managing inventory from a spreadsheet. Coodra tracks stockout risk, margin health, and demand signals — and surfaces the decisions worth acting on first.',
  },
  { property: 'og:image', content: 'https://www.coodra.com/og-image.png' },
  { property: 'og:url', content: 'https://www.coodra.com/inventory-management' },
  { property: 'og:type', content: 'website' },
  { property: 'og:site_name', content: 'Coodra' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: 'Retail Inventory Management | Coodra' },
  {
    name: 'twitter:description',
    content:
      'AI-ranked inventory decisions — reorder, replace, remove — updated every week from your POS data.',
  },
  { name: 'twitter:image', content: 'https://www.coodra.com/og-image.png' },
  { name: 'robots', content: 'index, follow' },
  { tagName: 'link', rel: 'canonical', href: 'https://www.coodra.com/inventory-management' },
]

export default InventoryManagementPage
