export default function StatCard({ icon: Icon, label, value, sub, accent = 'gold' }) {
  const accents = {
    gold: 'bg-gold-50 text-gold-700',
    safari: 'bg-safari-50 text-safari-700',
    ink: 'bg-ink-900 text-gold-300',
    red: 'bg-red-50 text-red-600',
  }
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accents[accent]}`}>
        <Icon className="h-6 w-6" />
      </span>
      <div className="min-w-0">
        <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</div>
        <div className="truncate font-display text-2xl font-bold text-ink-900">{value}</div>
        {sub && <div className="text-xs text-ink-400">{sub}</div>}
      </div>
    </div>
  )
}
