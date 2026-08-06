import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import Modal from './ui/Modal'
import Spinner from './ui/Spinner'
import { createBooking, createEnquiry } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function BookingModal({ pkg, open, onClose }) {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [travelers, setTravelers] = useState(2)
  const [startDate, setStartDate] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  if (!pkg) return null

  const estTotal = pkg.price_min * travelers

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await createBooking({
        user_id: user.id,
        package_id: pkg.id,
        travelers,
        start_date: startDate,
        status: 'pending',
        total_price: estTotal,
        currency: pkg.currency ?? 'USD',
        notes: notes || null,
      })
      await createEnquiry({
        user_id: user.id,
        name: profile?.full_name ?? 'Golden Tours traveler',
        email: profile?.email ?? user.email,
        phone: profile?.phone ?? null,
        message: `New booking request for "${pkg.title}" — ${travelers} traveler(s), starting ${startDate}.`,
        source: 'planner',
        status: 'new',
      })
      setDone(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setDone(false)
    setError('')
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title={done ? 'Booking Requested' : `Book: ${pkg.title}`}>
      {done ? (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-safari-100 text-safari-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h4 className="mt-4 font-display text-lg font-semibold text-ink-900">Request received!</h4>
          <p className="mt-1.5 text-sm text-ink-500">
            Our travel consultants will confirm availability and follow up shortly. Track its status anytime
            under My Trips.
          </p>
          <div className="mt-6 flex gap-2">
            <button className="btn-secondary flex-1" onClick={handleClose}>
              Keep Browsing
            </button>
            <button
              className="btn-primary flex-1"
              onClick={() => {
                handleClose()
                navigate('/app/bookings')
              }}
            >
              View My Trips
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
            </div>
          )}
          <div className="flex items-center gap-3 rounded-xl bg-sand-100 p-3">
            <img src={pkg.images?.[0]} alt="" className="h-14 w-20 rounded-lg object-cover" />
            <div>
              <div className="text-sm font-semibold text-ink-900">{pkg.title}</div>
              <div className="text-xs text-ink-500">{pkg.duration_days} days · from ${pkg.price_min.toLocaleString()}/person</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Travelers</label>
              <input
                type="number"
                min={1}
                max={20}
                required
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
                className="input"
              />
            </div>
            <div>
              <label className="label">Preferred Start Date</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="label">Notes for your consultant (optional)</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Dietary needs, celebration occasions, accessibility requirements…"
              className="input resize-none"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gold-200 bg-gold-50 px-4 py-3">
            <span className="text-sm font-medium text-ink-700">Estimated total</span>
            <span className="font-display text-lg font-bold text-ink-900">${estTotal.toLocaleString()}</span>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading && <Spinner size={16} />}
            Confirm Booking Request
          </button>
          <p className="text-center text-xs text-ink-400">
            This reserves your spot as pending — no payment is taken until our team confirms details with you.
          </p>
        </form>
      )}
    </Modal>
  )
}
