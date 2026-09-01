import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

/**
 * ProtectedRoute Guard Component
 * Redirects unauthenticated visitors to /login with preserving target redirect path.
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    const redirectUrl = location.pathname + location.search
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectUrl)}`} replace />
  }

  if (adminOnly && user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return children
}
