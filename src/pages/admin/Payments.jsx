import { useEffect, useMemo, useState } from 'react'
import { CreditCard, Search, Plus } from 'lucide-react'
import { fetchAllPayments, updatePaymentStatus, fetchAllBookings, createPayment } from '../../lib/api'
import StatusBadge from '../../components/ui/StatusBadge'
import EmptyState from '../../components/ui/EmptyState'
import LoadingScreen from '../../components/LoadingScreen'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import { PAYMENT_STATUSES } from '../../data/constants'

export default function Payments() {
  const [payments, setPayments] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [updatingId, setUpdatingId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ booking_id: '', amount: '', method: 'card', status: 'paid' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = () => fetchAllPayments().then(setPayments)

  useEffect(() => {
    Promise.all([load(), fetchAllBookings().then(setBookings)]).finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return payments.filter((p) => {
      const matchesStatus = status === 'all' || p.status === status
      const matchesQuery =
        !q ||
        p.booking?.customer?.full_name?.toLowerCase().includes(q) ||
        p.booking?.package?.title?.toLowerCase().includes(q)
      return matchesStatus && matchesQuery
    })
  }, [payments, query, status])

  const totalPaid = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + Number(p.amount), 0)

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id)
    try {
      await updatePaymentStatus(id, newStatus)
      await load()
    } finally {
      setUpdatingId(null)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await createPayment({
        booking_id: form.booking_id,
        amount: Number(form.amount),
        currency: 'USD',
        method: form.method,
        status: form.status,
        paid_at: form.status === 'paid' ? new Date().toISOString() : null,
      })
      await load()
      setModalOpen(false)
      setForm({ booking_id: '', amount: '', method: 'card', status: 'paid' })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingScreen label="Loading payments…" />

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Payments</h1>
          <p className="mt-1 text-sm text-ink-500">
            ${totalPaid.toLocaleString()} collected across {payments.filter((p) => p.status === 'paid').length} paid transactions
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" className="input pl-10" />
          </div>
          <button onClick={() => setModalOpen(true)} className="btn-primary shrink-0">
            <Plus className="h-4 w-4" /> Record Payment
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button onClick={() => setStatus('all')} className={`chip ${status === 'all' ? 'chip-active' : ''}`}>
          All ({payments.length})
        </button>
        {PAYMENT_STATUSES.map((s) => (
          <button key={s} onClick={() => setStatus(s)} className={`chip capitalize ${status === s ? 'chip-active' : ''}`}>
            {s} ({payments.filter((p) => p.status === s).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={CreditCard} title="No payments found" description="Try a different filter or record a new payment." />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-ink-100 bg-white shadow-card">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-ink-100 bg-sand-100 text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Package</th>
                <th className="px-5 py-3 font-semibold">Amount</th>
                <th className="px-5 py-3 font-semibold">Method</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-sand-50">
                  <td className="px-5 py-3.5 font-medium text-ink-800">{p.booking?.customer?.full_name}</td>
                  <td className="px-5 py-3.5 text-ink-500">{p.booking?.package?.title}</td>
                  <td className="px-5 py-3.5 font-semibold text-ink-900">${Number(p.amount).toLocaleString()}</td>
                  <td className="px-5 py-3.5 capitalize text-ink-500">{p.method.replace('_', ' ')}</td>
                  <td className="px-5 py-3.5">
                    <select
                      value={p.status}
                      disabled={updatingId === p.id}
                      onChange={(e) => handleStatusChange(p.id, e.target.value)}
                      className="rounded-lg border border-ink-200 bg-white px-2.5 py-1.5 text-xs font-semibold capitalize"
                    >
                      {PAYMENT_STATUSES.map((s) => (
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Record Payment">
        <form onSubmit={handleCreate} className="space-y-4">
          {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <div>
            <label className="label">Booking</label>
            <select
              required
              value={form.booking_id}
              onChange={(e) => {
                const b = bookings.find((bk) => bk.id === e.target.value)
                setForm({ ...form, booking_id: e.target.value, amount: b ? b.total_price : form.amount })
              }}
              className="input"
            >
              <option value="">Select a booking…</option>
              {bookings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.customer?.full_name} — {b.package?.title}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Amount ($)</label>
              <input required type="number" min={0} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Method</label>
              <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} className="input">
                <option value="card">Card</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input">
              {PAYMENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving && <Spinner size={16} />}
            Record Payment
          </button>
        </form>
      </Modal>
    </div>
  )
}
