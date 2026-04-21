import type { MetaFunction } from 'react-router'
import AuthorPage from '../pages/AuthorPage'

const URL = 'https://www.coodra.com/author/michael-shahid'

export const meta: MetaFunction = () => [
  { title: 'Michael Shahid | Author at Coodra' },
  {
    name: 'description',
    content:
      'Read inventory and retail operations articles by Michael Shahid, Founder & CEO at Coodra.',
  },
  { property: 'og:title', content: 'Michael Shahid | Author at Coodra' },
  {
    property: 'og:description',
    content:
      'Read inventory and retail operations articles by Michael Shahid, Founder & CEO at Coodra.',
  },
  { property: 'og:url', content: URL },
  { property: 'og:type', content: 'profile' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'robots', content: 'index, follow' },
  { tagName: 'link', rel: 'canonical', href: URL },
]

export default AuthorPage
