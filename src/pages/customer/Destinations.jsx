import { useEffect, useMemo, useState } from 'react'
import { Search, MapIcon, LayoutGrid } from 'lucide-react'
import { fetchDestinations } from '../../lib/api'
import DestinationCard from '../../components/DestinationCard'
import MapView from '../../components/ui/MapView'
import EmptyState from '../../components/ui/EmptyState'
import { COUNTRIES, COUNTRY_FLAGS } from '../../data/constants'

export default function Destinations() {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [country, setCountry] = useState('all')
  const [view, setView] = useState('grid')

  useEffect(() => {
    fetchDestinations()
      .then(setDestinations)
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return destinations.filter((d) => {
      const matchesQuery =
        !query ||
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.short_description.toLowerCase().includes(query.toLowerCase())
      const matchesCountry = country === 'all' || d.country === country
      return matchesQuery && matchesCountry
    })
  }, [destinations, query, country])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold text-ink-900">Destinations & Places</h1>
        <p className="max-w-2xl text-sm text-ink-500">
          From the endless plains of the Serengeti to Zanzibar's turquoise coast — explore the real places
          behind every Golden Tours itinerary.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations…"
              className="input pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCountry('all')}
              className={`chip ${country === 'all' ? 'chip-active' : ''}`}
            >
              All countries
            </button>
            {COUNTRIES.map((c) => (
              <button
                key={c}
                onClick={() => setCountry(c)}
                className={`chip ${country === c ? 'chip-active' : ''}`}
              >
                {COUNTRY_FLAGS[c]} {c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 gap-1 rounded-full border border-ink-200 bg-white p-1">
          <button
            onClick={() => setView('grid')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
              view === 'grid' ? 'bg-ink-900 text-white' : 'text-ink-500'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" /> Grid
          </button>
          <button
            onClick={() => setView('map')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
              view === 'map' ? 'bg-ink-900 text-white' : 'text-ink-500'
            }`}
          >
            <MapIcon className="h-3.5 w-3.5" /> Map
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-2xl bg-ink-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={Search}
            title="No destinations match your search"
            description="Try a different keyword or clear the country filter."
          />
        </div>
      ) : view === 'map' ? (
        <div className="mt-8">
          <MapView
            points={filtered.map((d) => ({ name: d.name, lat: d.lat, lng: d.lng, description: d.country }))}
            height={560}
            zoom={5}
          />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      )}
    </div>
  )
}
