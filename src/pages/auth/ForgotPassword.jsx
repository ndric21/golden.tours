import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import AuthLayout from './AuthLayout'
import Spinner from '../../components/ui/Spinner'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Reset your password" subtitle="We'll email you a secure link to set a new password.">
      {sent ? (
        <div className="rounded-2xl border border-safari-200 bg-safari-50 p-5 text-sm text-safari-800">
          <CheckCircle2 className="mb-2 h-6 w-6 text-safari-600" />
          If an account exists for <strong>{email}</strong>, a reset link is on its way.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input pl-10"
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading && <Spinner size={16} />}
            Send Reset Link
          </button>
        </form>
      )}
      <Link to="/login" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-600 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" /> Back to Sign In
      </Link>
    </AuthLayout>
  )
}
