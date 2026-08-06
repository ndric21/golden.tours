import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import AuthLayout from './AuthLayout'
import Spinner from '../../components/ui/Spinner'

export default function Signup() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const { signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      const { session } = await signUp({ email, password, fullName, phone })
      if (session) {
        navigate('/redirect', { replace: true })
      } else {
        setDone(true)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err.message)
    }
  }

  if (done) {
    return (
      <AuthLayout title="Check your inbox" subtitle="">
        <div className="rounded-2xl border border-safari-200 bg-safari-50 p-5 text-sm text-safari-800">
          <CheckCircle2 className="mb-2 h-6 w-6 text-safari-600" />
          We&apos;ve sent a confirmation link to <strong>{email}</strong>. Confirm your email, then sign in to
          start planning your East Africa journey.
        </div>
        <Link to="/login" className="btn-primary mt-6 w-full">
          Back to Sign In
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Create your account" subtitle="Join Golden Tours and start planning with AI.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div>
          <label className="label" htmlFor="fullName">
            Full name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              id="fullName"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Traveler"
              className="input pl-10"
            />
          </div>
        </div>

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

        <div>
          <label className="label" htmlFor="phone">
            Phone <span className="normal-case text-ink-400">(optional)</span>
          </label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555 000 0000"
              className="input pl-10"
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="input pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading && <Spinner size={16} />}
          Create Account
        </button>

        <div className="relative py-1 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-ink-200" />
          </div>
          <span className="relative bg-sand-50 px-3 text-xs font-medium text-ink-400">or continue with</span>
        </div>

        <button type="button" onClick={handleGoogle} className="btn-secondary w-full">
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.5-1.13 2.78-2.4 3.63v3.02h3.89c2.28-2.1 3.56-5.2 3.56-8.84z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.89-3.02c-1.08.73-2.46 1.16-4.06 1.16-3.12 0-5.77-2.11-6.71-4.94H1.28v3.11C3.26 21.3 7.31 24 12 24z"
            />
            <path fill="#FBBC05" d="M5.29 14.3a7.2 7.2 0 0 1 0-4.6V6.59H1.28a12 12 0 0 0 0 10.82l4.01-3.11z" />
            <path
              fill="#EA4335"
              d="M12 4.76c1.76 0 3.34.6 4.58 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.28 6.59l4.01 3.11C6.23 6.87 8.88 4.76 12 4.76z"
            />
          </svg>
          Sign up with Google
        </button>

        <p className="pt-2 text-center text-sm text-ink-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-gold-700 hover:text-gold-800">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
