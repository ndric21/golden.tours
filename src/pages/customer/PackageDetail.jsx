import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, Users, CalendarRange, CheckCircle2, MessageSquare } from 'lucide-react'
import { fetchPackageBySlug, fetchPackageReviews } from '../../lib/api'
import MapView from '../../components/ui/MapView'
import StarRating from '../../components/ui/StarRating'
import BookingModal from '../../components/BookingModal'
import LoadingScreen from '../../components/LoadingScreen'

export default function PackageDetail() {
  const { slug } = useParams()
  const [pkg, setPkg] = useState(null)
  const [reviews, setReviews] = useState([])
  const [activeImage, setActiveImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchPackageBySlug(slug).then(async (data) => {
      if (!mounted) return
      setPkg(data)
      setActiveImage(0)
      const rv = await fetchPackageReviews(data.id)
      if (mounted) setReviews(rv)
      setLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [slug])

  if (loading) return <LoadingScreen label="Loading itinerary…" />
  if (!pkg) return null

  return (
    <div>
      <div className="relative h-[420px] w-full overflow-hidden">
        <img src={pkg.images?.[activeImage]} alt={pkg.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/25 to-transparent" />
        <Link
          to="/app/planner"
          className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-2 text-xs font-semibold text-ink-800 backdrop-blur hover:bg-white sm:left-8 sm:top-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>
        <div className="absolute inset-x-0 bottom-0 px-4 pb-6 sm:px-8 sm:pb-10">
          <span className="badge bg-gold-gradient capitalize text-ink-950">{pkg.budget_level}</span>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold text-white text-balance sm:text-4xl">
            {pkg.title}
          </h1>
          <div className="mt-2">
            <StarRating rating={pkg.rating} count={pkg.review_count} />
          </div>
        </div>
      </div>

      {pkg.images?.length > 1 && (
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-4 sm:px-6 lg:px-8">
          {pkg.images.map((img, idx) => (
            <button
              key={img}
              onClick={() => setActiveImage(idx)}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                idx === activeImage ? 'border-gold-500' : 'border-transparent opacity-70'
              }`}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-8 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="space-y-10 lg:col-span-2">
          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">Overview</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">{pkg.description}</p>
          </div>

          {pkg.highlights?.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-bold text-ink-900">Trip Highlights</h2>
              <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {pkg.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 rounded-xl bg-white p-3 text-sm text-ink-700 shadow-card">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-safari-600" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {pkg.itinerary?.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-bold text-ink-900">Day-by-Day Itinerary</h2>
              <div className="mt-4 space-y-4">
                {pkg.itinerary.map((day) => (
                  <div key={day.day} className="flex gap-4 rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-gradient font-display text-sm font-bold text-ink-950">
                      {day.day}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-ink-900">{day.title}</h4>
                      <p className="mt-1 text-sm text-ink-500">{day.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pkg.map_points?.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-bold text-ink-900">Route Map</h2>
              <div className="mt-4">
                <MapView points={pkg.map_points} height={360} zoom={6} />
              </div>
            </div>
          )}

          <div>
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink-900">
              <MessageSquare className="h-5 w-5 text-gold-600" /> Traveler Reviews
            </h2>
            {reviews.length === 0 ? (
              <p className="mt-3 text-sm text-ink-500">No reviews yet — be the first to travel and share your story.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-safari-100 text-sm font-semibold text-safari-700">
                          {r.author?.full_name?.[0] ?? 'G'}
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-ink-900">{r.author?.full_name ?? 'Golden Tours traveler'}</div>
                          <StarRating rating={r.rating} showValue={false} size={12} />
                        </div>
                      </div>
                      <span className="text-xs text-ink-400">{new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-3 text-sm text-ink-600">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sticky booking sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="card p-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">Price per person</div>
              <div className="mt-1 font-display text-3xl font-bold text-ink-900">
                ${pkg.price_min.toLocaleString()}
                <span className="text-sm font-normal text-ink-400"> – ${pkg.price_max.toLocaleString()}</span>
              </div>

              <div className="mt-5 space-y-3 border-t border-ink-100 pt-5 text-sm">
                <div className="flex items-center gap-2 text-ink-600">
                  <Clock className="h-4 w-4 text-gold-600" /> {pkg.duration_days} days
                </div>
                {pkg.group_size && (
                  <div className="flex items-center gap-2 text-ink-600">
                    <Users className="h-4 w-4 text-gold-600" /> {pkg.group_size}
                  </div>
                )}
                {pkg.best_months?.length > 0 && (
                  <div className="flex items-center gap-2 text-ink-600">
                    <CalendarRange className="h-4 w-4 text-gold-600" /> Best: {pkg.best_months.join(', ')}
                  </div>
                )}
              </div>

              <button onClick={() => setBooking(true)} className="btn-primary mt-6 w-full">
                Book This Trip
              </button>
            </div>

            {pkg.interests?.length > 0 && (
              <div className="card p-6">
                <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">Perfect for</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {pkg.interests.map((i) => (
                    <span key={i} className="badge bg-sand-100 capitalize text-ink-600">
                      {i.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <BookingModal pkg={pkg} open={booking} onClose={() => setBooking(false)} />
    </div>
  )
}
