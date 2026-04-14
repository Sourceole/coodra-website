import VerifyEmailPage from '../pages/VerifyEmailPage'
import type { MetaFunction } from 'react-router'

export const meta: MetaFunction = () => [
  { title: 'Check your email — Coodra' },
  { name: 'description', content: 'Check your email for a confirmation link to activate your Coodra account.' },
  { name: 'robots', content: 'noindex' },
]

export default VerifyEmailPage