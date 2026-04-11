import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('../src/routes/_index.tsx'),
  route('pricing', '../src/routes/pricing.tsx'),
  route('login', '../src/routes/login.tsx'),
  route('signup', '../src/routes/signup.tsx'),
  route('verify-email', '../src/routes/verify-email.tsx'),
  route('reset-password', '../src/routes/reset-password.tsx'),
  route('dashboard', '../src/routes/dashboard.tsx'),
  route('admin', '../src/routes/admin.tsx'),
] satisfies RouteConfig