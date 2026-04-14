import ResetPasswordPage from '../pages/ResetPasswordPage'
import type { MetaFunction } from 'react-router'

export const meta: MetaFunction = () => [
  { title: 'Reset password — Coodra' },
  { name: 'description', content: 'Reset your Coodra account password.' },
  { name: 'robots', content: 'noindex' },
]

export default ResetPasswordPage