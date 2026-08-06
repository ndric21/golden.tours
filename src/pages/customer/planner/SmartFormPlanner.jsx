import { useEffect, useState } from 'react'
import { Sparkles, Users, Wallet, CalendarRange, Clock3, AlertCircle } from 'lucide-react'
import {
  INTERESTS,
  BUDGET_LEVELS,
  TRAVELER_COUNTS,
  DURATIONS,
  MONTHS,
} from '../../../data/constants'
import { fetchPackages, askAI } from '../../../lib/api'
import PackageCard from '../../../components/PackageCard'
import BookingModal from '../../../components/BookingModal'
import EmptyState from '../../../components/ui/EmptyState'
import Spinner from '../../../components/ui/Spinner'

const ICONS_BY_INTEREST = INTERESTS.reduce((acc, i) => ({ ...acc, [i.id]: i.label }), {})

function scorePackage(pkg, form) {
  let score = 0
  const overlap = form.interests.filter((i) => pkg.interests?.includes(i)).length
  score += overlap * 10

  const durationRange = DURATIONS.find((d) => d.id === form.duration)
  if (durationRange && pkg.duration_days >= durationRange.min && pkg.duration_days <= durationRange.max) {
    score += 8
  } else if (durationRange) {
    const dist = Math.min(
      Math.abs(pkg.duration_days - durationRange.min),
      Math.abs(pkg.duration_days - durationRange.max)
    )
    score += Math.max(0, 5 - dist)
  }

  if (pkg.budget_level === form.budget) score += 6

  if (form.month && pkg.best_months?.includes(form.month)) score += 5

  if (form.travelers <= 2 && pkg.interests?.includes('honeymoon')) score += 2
  if (form.travelers >= 5 && pkg.interests?.includes('family')) score += 2

  return score
}

export default function SmartFormPlanner({ initialInterest }) {
  const [travelers, setTravelers] = useState(2)
  const [budget, setBudget] = useState('mid-range')
  const [duration, setDuration] = useState('6-8')
  const [month, setMonth] = useState('')
  const [interests, setInterests] = useState(initialInterest ? [initialInterest] : [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState(null)
  const [aiIntro, setAiIntro] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [bookingPkg, setBookingPkg] = useState(null)

  useEffect(() => {
    if (initialInterest) setInterests([initialInterest])
  }, [initialInterest])

  const toggleInterest = (id) => {
    setInterests((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setResults(null)
    setAiIntro('')
    try {
      const allPackages = await fetchPackages()
      const form = { travelers, budget, duration, month, interests }
      const ranked = allPackages
        .map((pkg) => ({ pkg, score: scorePackage(pkg, form) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
        .map((r) => r.pkg)

      setResults(ranked)
      setLoading(false)

      if (ranked.length > 0) {
        setAiLoading(true)
        const interestLabels = interests.map((i) => ICONS_BY_INTEREST[i]).join(', ') || 'open to suggestions'
        const prompt = `A traveler wants a trip with these exact preferences: ${travelers} traveler(s), ${budget} budget level, ${duration} days trip length, ${
          month ? `traveling in ${month}` : 'flexible on month'
        }, interested in: ${interestLabels}. I've matched them to these Golden Tours packages: ${ranked
          .map((p) => p.title)
          .join('; ')}. Write a short (3-4 sentence) warm, expert intro explaining why these specific matches suit their stated preferences. Reference at least two package names by their exact title. Do not list generic travel tips — be specific to their inputs.`
        try {
          const reply = await askAI([{ role: 'user', content: prompt }], 'planner')
          setAiIntro(reply)
        } catch {
          // AI note is a nice-to-have; recommendations still stand without it.
        } finally {
          setAiLoading(false)
        }
      }
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleGenerate} className="card p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="label flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> Number of Travelers
            </label>
            <div className="flex flex-wrap gap-2">
              {TRAVELER_COUNTS.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setTravelers(t.id)}
                  className={`chip ${travelers === t.id ? 'chip-active' : ''}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label flex items-center gap-1.5">
              <Wallet className="h-3.5 w-3.5" /> Budget Level
            </label>
            <div className="flex flex-wrap gap-2">
              {BUDGET_LEVELS.map((b) => (
                <button
                  type="button"
                  key={b.id}
                  onClick={() => setBudget(b.id)}
                  title={b.hint}
                  className={`chip ${budget === b.id ? 'chip-active' : ''}`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" /> Trip Duration
            </label>
            <div className="flex flex-wrap gap-2">
              {DURATIONS.map((d) => (
                <button
                  type="button"
                  key={d.id}
                  onClick={() => setDuration(d.id)}
                  className={`chip ${duration === d.id ? 'chip-active' : ''}`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label flex items-center gap-1.5">
              <CalendarRange className="h-3.5 w-3.5" /> Preferred Travel Month
            </label>
            <select value={month} onChange={(e) => setMonth(e.target.value)} className="input">
              <option value="">Flexible / not sure yet</option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="label">Interests (select all that apply)</label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((interest) => (
              <button
                type="button"
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={`chip ${interests.includes(interest.id) ? 'chip-active' : ''}`}
              >
                {interest.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mt-5 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary mt-7 w-full sm:w-auto">
          {loading ? <Spinner size={16} /> : <Sparkles className="h-4 w-4" />}
          Generate My Personalized Itineraries
        </button>
      </form>

      {loading && (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-96 animate-pulse rounded-2xl bg-ink-100" />
          ))}
        </div>
      )}

      {results && !loading && (
        <div className="mt-10">
          {(aiIntro || aiLoading) && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-gold-200 bg-gold-50 p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-gradient text-ink-950">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-gold-700">
                  Jua&apos;s personalized note
                </div>
                {aiLoading ? (
                  <div className="mt-1.5 flex items-center gap-2 text-sm text-ink-500">
                    <Spinner size={14} /> Personalizing your recommendations…
                  </div>
                ) : (
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{aiIntro}</p>
                )}
              </div>
            </div>
          )}

          {results.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="No exact matches yet"
              description="Try widening your budget or duration, or chat with Jua for a fully custom itinerary."
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} onBook={setBookingPkg} showMap />
              ))}
            </div>
          )}
        </div>
      )}

      <BookingModal pkg={bookingPkg} open={!!bookingPkg} onClose={() => setBookingPkg(null)} />
    </div>
  )
}
