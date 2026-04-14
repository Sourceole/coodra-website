import { AuthGuard } from '../components/AuthGuard'
import { AdminGuard } from '../components/AdminGuard'
import AdminPage from '../pages/AdminPage'
import type { MetaFunction } from 'react-router'

export const meta: MetaFunction = () => [
  { title: 'Admin — Coodra' },
  { name: 'description', content: 'Coodra admin workspace.' },
  { name: 'robots', content: 'noindex, follow' },
]

export default function AdminRoute() {
  return (
    <AuthGuard>
      <AdminGuard>
        <AdminPage />
      </AdminGuard>
    </AuthGuard>
  )
}