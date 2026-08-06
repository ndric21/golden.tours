import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Users, Mail, Phone, ArrowUpRight } from 'lucide-react'
import { fetchCustomers } from '../../lib/api'
import EmptyState from '../../components/ui/EmptyState'
import LoadingScreen from '../../components/LoadingScreen'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetchCustomers()
      .then(setCustomers)
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return customers.filter(
      (c) => !q || c.full_name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q)
    )
  }, [customers, query])

  if (loading) return <LoadingScreen label="Loading customers…" />

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Customers</h1>
          <p className="mt-1 text-sm text-ink-500">{customers.length} registered travelers</p>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email…"
            className="input w-full pl-10 sm:w-80"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={Users} title="No customers found" description="Try a different search term." />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Link
              key={c.id}
              to={`/admin/customers/${c.id}`}
              className="group flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-100 text-lg font-semibold text-gold-700">
                {c.full_name?.[0] ?? 'G'}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold text-ink-900">{c.full_name}</div>
                <div className="mt-1 flex items-center gap-1 truncate text-xs text-ink-500">
                  <Mail className="h-3 w-3" /> {c.email}
                </div>
                {c.phone && (
                  <div className="mt-0.5 flex items-center gap-1 truncate text-xs text-ink-500">
                    <Phone className="h-3 w-3" /> {c.phone}
                  </div>
                )}
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-300 group-hover:text-gold-600" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
