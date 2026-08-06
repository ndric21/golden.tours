import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingScreen from '../components/LoadingScreen'

export default function RoleRedirect() {
  const { session, profile, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return
    if (!session) {
      navigate('/login', { replace: true })
      return
    }
    if (profile) {
      navigate(profile.role === 'admin' ? '/admin' : '/app', { replace: true })
    }
  }, [session, profile, loading, navigate])

  return <LoadingScreen label="Taking you to your dashboard…" />
}
