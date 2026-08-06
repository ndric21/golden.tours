import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-sand-50 px-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-gradient text-ink-950">
        <Compass className="h-8 w-8" />
      </span>
      <h1 className="font-display text-3xl font-bold text-ink-900">Lost off the map</h1>
      <p className="max-w-sm text-sm text-ink-500">
        This page doesn't exist — even our best guides couldn't find it. Let's get you back on the trail.
      </p>
      <Link to="/" className="btn-primary">
        Back to Golden Tours
      </Link>
    </div>
  )
}
