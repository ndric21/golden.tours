import { Link } from 'react-router-dom'
import { Clock, Users, Sparkles } from 'lucide-react'
import StarRating from './ui/StarRating'
import MapView from './ui/MapView'

export default function PackageCard({ pkg, onBook, showMap = false }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">
      <div className="relative h-52 overflow-hidden">
        <img
          src={pkg.images?.[0]}
          alt={pkg.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
        {pkg.featured && (
          <span className="absolute left-3 top-3 badge bg-gold-gradient text-ink-950">
            <Sparkles className="h-3 w-3" /> Featured
          </span>
        )}
        <span className="absolute right-3 top-3 badge bg-white/90 text-ink-800 capitalize backdrop-blur">
          {pkg.budget_level}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-lg font-semibold leading-snug text-ink-900 text-balance">{pkg.title}</h3>
          <div className="mt-1.5">
            <StarRating rating={pkg.rating} count={pkg.review_count} />
          </div>
        </div>
        <p className="line-clamp-2 text-sm text-ink-500">{pkg.description}</p>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-medium text-ink-500">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-gold-600" /> {pkg.duration_days} days
          </span>
          {pkg.group_size && (
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-gold-600" /> {pkg.group_size}
            </span>
          )}
        </div>

        {showMap && pkg.map_points?.length > 0 && (
          <MapView points={pkg.map_points} height={120} zoom={5} className="pointer-events-none" />
        )}

        {pkg.highlights?.length > 0 && (
          <ul className="space-y-1 text-xs text-ink-500">
            {pkg.highlights.slice(0, 2).map((h) => (
              <li key={h} className="flex items-start gap-1.5">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gold-500" />
                <span className="line-clamp-1">{h}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-ink-400">From</div>
            <div className="font-display text-xl font-bold text-ink-900">
              ${pkg.price_min.toLocaleString()}
              <span className="text-xs font-normal text-ink-400"> /person</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Link to={`/app/packages/${pkg.slug}`} className="btn-secondary flex-1 !px-3 !py-2 text-xs">
            View Itinerary
          </Link>
          <button
            type="button"
            onClick={() => onBook?.(pkg)}
            className="btn-primary flex-1 !px-3 !py-2 text-xs"
          >
            Book This Trip
          </button>
        </div>
      </div>
    </div>
  )
}
