import AdminPage from '../pages/AdminPage'
import { AdminGuard } from '../components/AdminGuard'
import type { MetaFunction } from 'react-router'

export const meta: MetaFunction = () => [
  { title: 'Admin | Coodra' },
  { name: 'robots', content: 'noindex, nofollow' },
  { tagName: 'link', rel: 'canonical', href: 'https://www.coodra.com/admin' },
]

export default function AdminRoute() {
  return (
    <AdminGuard>
      <AdminPage />
    </AdminGuard>
  )
}
