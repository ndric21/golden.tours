import { Link } from 'react-router-dom'
import { MapPin, ArrowUpRight } from 'lucide-react'
import { COUNTRY_FLAGS } from '../data/constants'

export default function DestinationCard({ destination }) {
  return (
    <Link
      to={`/app/destinations/${destination.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={destination.images?.[0]}
          alt={destination.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/0 to-transparent" />
        <span className="absolute left-3 top-3 badge bg-white/90 text-ink-800 backdrop-blur">
          {COUNTRY_FLAGS[destination.country]} {destination.country}
        </span>
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-white text-balance">{destination.name}</h3>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-gradient text-ink-950 opacity-0 transition-opacity group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="line-clamp-2 text-sm text-ink-500">{destination.short_description}</p>
        <div className="mt-auto flex items-center gap-1.5 pt-2 text-xs font-medium text-ink-400">
          <MapPin className="h-3.5 w-3.5" />
          Best season: {destination.best_season}
        </div>
      </div>
    </Link>
  )
}
