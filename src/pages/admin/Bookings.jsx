import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, CalendarCheck } from 'lucide-react'
import { fetchAllBookings, updateBookingStatus } from '../../lib/api'
import StatusBadge from '../../components/ui/StatusBadge'
import EmptyState from '../../components/ui/EmptyState'
import LoadingScreen from '../../components/LoadingScreen'
import { BOOKING_STATUSES } from '../../data/constants'

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [updatingId, setUpdatingId] = useState(null)

  const load = () => fetchAllBookings().then(setBookings)

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus = status === 'all' || b.status === status
      const q = query.toLowerCase()
      const matchesQuery =
        !q ||
        b.customer?.full_name?.toLowerCase().includes(q) ||
        b.customer?.email?.toLowerCase().includes(q) ||
        b.package?.title?.toLowerCase().includes(q)
      return matchesStatus && matchesQuery
    })
  }, [bookings, query, status])

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id)
    try {
      await updateBookingStatus(id, newStatus)
      await load()
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) return <LoadingScreen label="Loading bookings…" />

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Bookings</h1>
          <p className="mt-1 text-sm text-ink-500">{bookings.length} total bookings across all customers</p>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customer or package…"
            className="input w-full pl-10 sm:w-72"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button onClick={() => setStatus('all')} className={`chip ${status === 'all' ? 'chip-active' : ''}`}>
          All ({bookings.length})
        </button>
        {BOOKING_STATUSES.map((s) => (
          <button key={s} onClick={() => setStatus(s)} className={`chip capitalize ${status === s ? 'chip-active' : ''}`}>
            {s} ({bookings.filter((b) => b.status === s).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={CalendarCheck} title="No bookings found" description="Try a different filter or search term." />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-ink-100 bg-white shadow-card">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-ink-100 bg-sand-100 text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Package</th>
                <th className="px-5 py-3 font-semibold">Start Date</th>
                <th className="px-5 py-3 font-semibold">Travelers</th>
                <th className="px-5 py-3 font-semibold">Total</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-sand-50">
                  <td className="px-5 py-3.5">
                    <Link to={`/admin/customers/${b.user_id}`} className="font-medium text-ink-800 hover:text-gold-700">
                      {b.customer?.full_name}
                    </Link>
                    <div className="text-xs text-ink-400">{b.customer?.email}</div>
                  </td>
                  <td className="px-5 py-3.5 text-ink-700">{b.package?.title}</td>
                  <td className="px-5 py-3.5 text-ink-500">{new Date(b.start_date).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5 text-ink-500">{b.travelers}</td>
                  <td className="px-5 py-3.5 font-semibold text-ink-800">${Number(b.total_price).toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <select
                      value={b.status}
                      disabled={updatingId === b.id}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                      className="rounded-lg border border-ink-200 bg-white px-2.5 py-1.5 text-xs font-semibold capitalize"
                    >
                      {BOOKING_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
