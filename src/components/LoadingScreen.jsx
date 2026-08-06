import { Compass } from 'lucide-react'

export default function LoadingScreen({ label = 'Loading Golden Tours…' }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-sand-50">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gold-gradient shadow-elevated">
        <Compass className="h-8 w-8 animate-spin text-ink-950" style={{ animationDuration: '2.5s' }} />
      </div>
      <p className="text-sm font-medium text-ink-500">{label}</p>
    </div>
  )
}
