import { AuthGuard } from '../components/AuthGuard'
import { AdminGuard } from '../components/AdminGuard'
import AdminPage from '../pages/AdminPage'
export default function AdminRoute() {
  return (
    <AuthGuard>
      <AdminGuard>
        <AdminPage />
      </AdminGuard>
    </AuthGuard>
  )
}