import { Compass } from 'lucide-react'

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1600&auto=format&fit=crop"
          alt="Hot air balloon safari over the Serengeti at sunrise"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-ink-950/10" />
        <div className="absolute inset-x-0 bottom-0 animate-fade-in-up p-12">
          <span className="eyebrow">
            <Compass className="h-3 w-3" /> Tanzania · Kenya · Uganda · Rwanda · Zanzibar
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold text-white text-balance drop-shadow-[0_2px_30px_rgba(0,0,0,0.6)]">
            East Africa, planned by AI. Delivered with expertise.
          </h2>
          <p className="mt-3 max-w-md text-sm text-ink-200">
            Serengeti migrations, Zanzibar sunsets, Kilimanjaro summits, and gorilla treks — curated across
            Tanzania, Kenya, Uganda, Rwanda and Zanzibar.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-sand-50 px-6 py-12">
        <div className="w-full max-w-sm animate-fade-in-up">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-gradient text-ink-950">
              <Compass className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold text-gradient-gold">Golden Tours</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-ink-900">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-ink-500">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
