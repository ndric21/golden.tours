import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Sparkles,
  MapPin,
  CalendarCheck,
  MessageCircleMore,
  ArrowRight,
  PawPrint,
  Palmtree,
  Mountain,
  Users,
  Trees,
  Compass,
  Heart,
  Home as HomeIcon,
  Gem,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { fetchFeaturedPackages, fetchMyBookings, fetchDestinations } from '../../lib/api'
import PackageCard from '../../components/PackageCard'
import BookingModal from '../../components/BookingModal'
import EmptyState from '../../components/ui/EmptyState'
import { INTERESTS } from '../../data/constants'

const ICONS = { PawPrint, Palmtree, Mountain, Users, Trees, Compass, Heart, Home: HomeIcon, Gem }

export default function Home() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [packages, setPackages] = useState([])
  const [destinationsCount, setDestinationsCount] = useState(0)
  const [upcomingBooking, setUpcomingBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingPkg, setBookingPkg] = useState(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const [pkgs, dests, bookings] = await Promise.all([
          fetchFeaturedPackages(),
          fetchDestinations(),
          user ? fetchMyBookings(user.id) : Promise.resolve([]),
        ])
        if (!mounted) return
        setPackages(pkgs)
        setDestinationsCount(dests.length)
        const upcoming = bookings.find((b) => ['pending', 'confirmed'].includes(b.status))
        setUpcomingBooking(upcoming ?? null)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [user])

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Traveler'

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1547970810-dc1eac37d174?q=80&w=2000&auto=format&fit=crop"
            alt="Wildebeest and zebra crossing the Serengeti plains"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950/85 via-ink-950/60 to-ink-950/20" />
        </div>
        <div className="relative mx-auto max-w-7xl animate-fade-in-up px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <span className="eyebrow">
            <Sparkles className="h-3 w-3" /> Welcome back, {firstName}
          </span>
          <h1 className="mt-5 max-w-2xl font-display text-4xl font-bold leading-tight text-gradient-gold text-balance drop-shadow-[0_2px_30px_rgba(0,0,0,0.6)] sm:text-5xl">
            Where in East Africa will your next story begin?
          </h1>
          <p className="mt-4 max-w-xl text-base text-ink-200">
            Let our AI travel consultant design a personalized safari, beach escape, or summit climb across
            Tanzania, Kenya, Uganda, Rwanda and Zanzibar — grounded in real logistics, not generic guesses.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/app/planner" className="btn-primary">
              <Sparkles className="h-4 w-4" /> Plan My Trip with AI
            </Link>
            <Link to="/app/destinations" className="btn-secondary !bg-white/5 !text-white !border-white/20 hover:!border-gold-400 hover:!text-gold-300">
              Explore Destinations
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Quick overview cards */}
        <section className="-mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="card flex items-center gap-4 p-5 transition-all hover:border-gold-300 hover:shadow-gold">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-50 text-gold-600">
              <CalendarCheck className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">Your Trip Status</div>
              {upcomingBooking ? (
                <div className="truncate text-sm font-semibold text-ink-900">{upcomingBooking.package?.title}</div>
              ) : (
                <div className="text-sm font-semibold text-ink-900">No trip planned yet</div>
              )}
              <Link to="/app/bookings" className="text-xs font-medium text-gold-700 hover:text-gold-800">
                View my trips →
              </Link>
            </div>
          </div>

          <div className="card flex items-center gap-4 p-5 transition-all hover:border-gold-300 hover:shadow-gold">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-safari-50 text-safari-600">
              <MapPin className="h-6 w-6" />
            </span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">Destinations</div>
              <div className="text-sm font-semibold text-ink-900">{destinationsCount} places to explore</div>
              <Link to="/app/destinations" className="text-xs font-medium text-gold-700 hover:text-gold-800">
                Browse map →
              </Link>
            </div>
          </div>

          <div className="card flex items-center gap-4 p-5 transition-all hover:border-gold-300 hover:shadow-gold">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink-900 text-gold-300">
              <MessageCircleMore className="h-6 w-6" />
            </span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">AI Assistant</div>
              <div className="text-sm font-semibold text-ink-900">Ask Jua anything</div>
              <Link to="/app/planner?tab=chat" className="text-xs font-medium text-gold-700 hover:text-gold-800">
                Start chatting →
              </Link>
            </div>
          </div>
        </section>

        {/* Interests quick links */}
        <section className="mt-14">
          <h2 className="font-display text-xl font-bold text-ink-900">What kind of journey calls to you?</h2>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {INTERESTS.map((interest) => {
              const Icon = ICONS[interest.icon]
              return (
                <button
                  key={interest.id}
                  onClick={() => navigate(`/app/planner?interest=${interest.id}`)}
                  className="chip flex items-center gap-2"
                >
                  <Icon className="h-4 w-4 text-gold-600" />
                  {interest.label}
                </button>
              )
            })}
          </div>
        </section>

        {/* Featured tours */}
        <section className="mt-14 pb-20">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink-900">Featured East African Tours</h2>
              <p className="mt-1 text-sm text-ink-500">Hand-picked, currently trending journeys.</p>
            </div>
            <Link to="/app/planner" className="hidden items-center gap-1 text-sm font-semibold text-gold-700 hover:text-gold-800 sm:flex">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-96 animate-pulse rounded-2xl bg-ink-100" />
              ))}
            </div>
          ) : packages.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                icon={Sparkles}
                title="Featured tours coming soon"
                description="Our team is curating this season's top East African itineraries."
              />
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} onBook={setBookingPkg} />
              ))}
            </div>
          )}
        </section>
      </div>

      <BookingModal pkg={bookingPkg} open={!!bookingPkg} onClose={() => setBookingPkg(null)} />
    </div>
  )
}
