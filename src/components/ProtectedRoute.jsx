import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingScreen from './LoadingScreen'

export default function ProtectedRoute({ children, requireRole }) {
  const { session, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingScreen />

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireRole && profile?.role !== requireRole) {
    const fallback = profile?.role === 'admin' ? '/admin' : '/app'
    return <Navigate to={fallback} replace />
  }

  return children
}
