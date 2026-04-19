import { AuthGuard } from '../components/AuthGuard'
import Dashboard from '../pages/Dashboard'
import type { MetaFunction } from 'react-router'

export const meta: MetaFunction = () => [
  { title: 'Dashboard | Coodra' },
  { name: 'description', content: 'Your Coodra retail decision workspace. Review AI recommendations, approve actions, and track performance.' },
  { name: 'robots', content: 'noindex, follow' },
]

export default function DashboardRoute() {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  )
}