import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, Globe2, CalendarPlus, MessageSquare } from 'lucide-react'
import {
  fetchCustomerProfile,
  fetchCustomerBookings,
  fetchCustomerPayments,
  fetchCustomerConversations,
} from '../../lib/api'
import StatusBadge from '../../components/ui/StatusBadge'
import LoadingScreen from '../../components/LoadingScreen'
import EmptyState from '../../components/ui/EmptyState'

export default function CustomerDetail() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [bookings, setBookings] = useState([])
  const [payments, setPayments] = useState([])
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    Promise.all([
      fetchCustomerProfile(id),
      fetchCustomerBookings(id),
      fetchCustomerPayments(id),
      fetchCustomerConversations(id),
    ]).then(([p, b, pay, conv]) => {
      if (!mounted) return
      setProfile(p)
      setBookings(b)
      setPayments(pay)
      setConversations(conv)
      setLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [id])

  if (loading) return <LoadingScreen label="Loading customer profile…" />
  if (!profile) return null

  const totalSpent = payments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + Number(p.amount), 0)

  return (
    <div>
      <Link to="/admin/customers" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" /> Back to Customers
      </Link>

      <div className="mt-4 flex flex-col gap-6 rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-100 text-2xl font-semibold text-gold-700">
            {profile.full_name?.[0]}
          </span>
          <div>
            <h1 className="font-display text-xl font-bold text-ink-900">{profile.full_name}</h1>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-500">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> {profile.email}
              </span>
              {profile.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> {profile.phone}
                </span>
              )}
              {profile.nationality && (
                <span className="flex items-center gap-1.5">
                  <Globe2 className="h-3.5 w-3.5" /> {profile.nationality}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-6 sm:gap-8">
          <div className="text-center">
            <div className="font-display text-2xl font-bold text-ink-900">{bookings.length}</div>
            <div className="text-xs text-ink-400">Bookings</div>
          </div>
          <div className="text-center">
            <div className="font-display text-2xl font-bold text-ink-900">${totalSpent.toLocaleString()}</div>
            <div className="text-xs text-ink-400">Total Spent</div>
          </div>
          <div className="text-center">
            <div className="font-display text-2xl font-bold text-ink-900">
              {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
            <div className="text-xs text-ink-400">Member Since</div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-ink-900">
            <CalendarPlus className="h-4 w-4 text-gold-600" /> Booking History
          </h2>
          {bookings.length === 0 ? (
            <div className="mt-3">
              <EmptyState title="No bookings yet" description="This customer hasn't booked a trip." />
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {bookings.map((b) => (
                <div key={b.id} className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-3.5 shadow-card">
                  <img src={b.package?.images?.[0]} alt="" className="h-12 w-16 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-ink-800">{b.package?.title}</div>
                    <div className="text-xs text-ink-400">
                      {new Date(b.start_date).toLocaleDateString()} · {b.travelers} traveler(s) · $
                      {Number(b.total_price).toLocaleString()}
                    </div>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-display text-base font-bold text-ink-900">Payment History</h2>
          {payments.length === 0 ? (
            <div className="mt-3">
              <EmptyState title="No payments recorded" description="No payments have been logged for this customer." />
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl border border-ink-100 bg-white p-3.5 shadow-card">
                  <div>
                    <div className="text-sm font-medium text-ink-800">{p.booking?.package?.title}</div>
                    <div className="text-xs capitalize text-ink-400">{p.method.replace('_', ' ')}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-ink-900">${Number(p.amount).toLocaleString()}</div>
                    <StatusBadge status={p.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-ink-900">
          <MessageSquare className="h-4 w-4 text-gold-600" /> AI Conversations
        </h2>
        {conversations.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="No AI conversations" description="This customer hasn't used the AI Chat Assistant yet." />
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {conversations.map((c) => (
              <div key={c.id} className="rounded-xl border border-ink-100 bg-white p-4 shadow-card">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-ink-800">{c.title}</div>
                  <span className="text-xs text-ink-400">{new Date(c.created_at).toLocaleDateString()}</span>
                </div>
                <div className="mt-1 text-xs text-ink-400">{c.messages?.length ?? 0} messages</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
