import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CalendarDays, CheckCircle2 } from 'lucide-react'
import { fetchDestinationBySlug, fetchPackagesForDestination } from '../../lib/api'
import MapView from '../../components/ui/MapView'
import PackageCard from '../../components/PackageCard'
import BookingModal from '../../components/BookingModal'
import LoadingScreen from '../../components/LoadingScreen'
import EmptyState from '../../components/ui/EmptyState'
import { COUNTRY_FLAGS } from '../../data/constants'
import { Compass } from 'lucide-react'

export default function DestinationDetail() {
  const { slug } = useParams()
  const [destination, setDestination] = useState(null)
  const [packages, setPackages] = useState([])
  const [activeImage, setActiveImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [bookingPkg, setBookingPkg] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchDestinationBySlug(slug).then(async (dest) => {
      if (!mounted) return
      setDestination(dest)
      setActiveImage(0)
      const pkgs = await fetchPackagesForDestination(dest.id)
      if (mounted) setPackages(pkgs)
      setLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [slug])

  if (loading) return <LoadingScreen label="Loading destination…" />
  if (!destination) return null

  return (
    <div>
      <div className="relative h-[420px] w-full overflow-hidden">
        <img
          src={destination.images?.[activeImage]}
          alt={destination.name}
          className="h-full w-full object-cover transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent" />
        <Link
          to="/app/destinations"
          className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-2 text-xs font-semibold text-ink-800 backdrop-blur hover:bg-white sm:left-8 sm:top-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>
        <div className="absolute inset-x-0 bottom-0 px-4 pb-6 sm:px-8 sm:pb-10">
          <span className="badge bg-gold-gradient text-ink-950">
            {COUNTRY_FLAGS[destination.country]} {destination.country}
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">{destination.name}</h1>
        </div>
      </div>

      {destination.images?.length > 1 && (
        <div className="mx-auto -mt-1 flex max-w-7xl gap-2 overflow-x-auto px-4 py-4 sm:px-6 lg:px-8">
          {destination.images.map((img, idx) => (
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
        <div className="lg:col-span-2">
          <h2 className="font-display text-xl font-bold text-ink-900">About {destination.name}</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-600">{destination.description}</p>

          {destination.highlights?.length > 0 && (
            <div className="mt-8">
              <h3 className="font-display text-lg font-bold text-ink-900">Highlights</h3>
              <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {destination.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 rounded-xl bg-white p-3 text-sm text-ink-700 shadow-card">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-safari-600" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
              <CalendarDays className="h-4 w-4 text-gold-600" /> Best time to visit
            </div>
            <p className="mt-1.5 text-sm text-ink-500">{destination.best_season}</p>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-ink-900">Location</h3>
            <MapView points={[{ name: destination.name, lat: destination.lat, lng: destination.lng }]} height={260} zoom={8} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-bold text-ink-900">Tours featuring {destination.name}</h2>
        {packages.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={Compass}
              title="No packages yet for this destination"
              description="Ask our AI Planner — it can still build a custom itinerary featuring this destination."
              action={
                <Link to="/app/planner" className="btn-primary">
                  Open AI Planner
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} onBook={setBookingPkg} />
            ))}
          </div>
        )}
      </div>

      <BookingModal pkg={bookingPkg} open={!!bookingPkg} onClose={() => setBookingPkg(null)} />
    </div>
  )
}
