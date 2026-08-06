import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck, Users, Sparkles, XCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { fetchMyBookings, updateBookingStatus } from '../../lib/api'
import StatusBadge from '../../components/ui/StatusBadge'
import EmptyState from '../../components/ui/EmptyState'
import LoadingScreen from '../../components/LoadingScreen'

export default function Bookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelingId, setCancelingId] = useState(null)

  const load = () => fetchMyBookings(user.id).then(setBookings)

  useEffect(() => {
    load().finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleCancel = async (id) => {
    setCancelingId(id)
    try {
      await updateBookingStatus(id, 'cancelled')
      await load()
    } finally {
      setCancelingId(null)
    }
  }

  if (loading) return <LoadingScreen label="Loading your trips…" />

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-ink-900">My Trips</h1>
      <p className="mt-2 text-sm text-ink-500">Every booking you've made with Golden Tours, in one place.</p>

      {bookings.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={CalendarCheck}
            title="No trips booked yet"
            description="Start with the AI Planner to get personalized East Africa itineraries matched to you."
            action={
              <Link to="/app/planner" className="btn-primary">
                <Sparkles className="h-4 w-4" /> Plan My Trip
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="flex flex-col gap-4 rounded-2xl border border-ink-100 bg-white p-5 shadow-card sm:flex-row">
              <img
                src={b.package?.images?.[0]}
                alt={b.package?.title}
                className="h-40 w-full shrink-0 rounded-xl object-cover sm:h-28 sm:w-40"
              />
              <div className="flex flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <Link to={`/app/packages/${b.package?.slug}`} className="font-display text-base font-semibold text-ink-900 hover:text-gold-700">
                      {b.package?.title}
                    </Link>
                    <StatusBadge status={b.status} />
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-ink-500">
                    <span className="inline-flex items-center gap-1">
                      <CalendarCheck className="h-3.5 w-3.5" /> Starts {new Date(b.start_date).toLocaleDateString()}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" /> {b.travelers} traveler{b.travelers > 1 ? 's' : ''}
                    </span>
                    <span>{b.package?.duration_days} days</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-ink-400">Total</div>
                    <div className="font-display text-lg font-bold text-ink-900">${Number(b.total_price).toLocaleString()}</div>
                  </div>
                  {b.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      disabled={cancelingId === b.id}
                      className="btn-ghost !text-red-600 hover:!bg-red-50"
                    >
                      <XCircle className="h-4 w-4" /> Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
