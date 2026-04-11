import { AuthGuard } from '../components/AuthGuard'
import Dashboard from '../pages/Dashboard'
export default function DashboardRoute() {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  )
}