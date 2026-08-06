import { useEffect, useMemo, useState } from 'react'
import { Star, Search, Trash2 } from 'lucide-react'
import { fetchAllReviews, deleteReview } from '../../lib/api'
import EmptyState from '../../components/ui/EmptyState'
import LoadingScreen from '../../components/LoadingScreen'
import StarRating from '../../components/ui/StarRating'
import Spinner from '../../components/ui/Spinner'

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const load = () => fetchAllReviews().then(setReviews)

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return reviews.filter(
      (r) => !q || r.author?.full_name?.toLowerCase().includes(q) || r.package?.title?.toLowerCase().includes(q)
    )
  }, [reviews, query])

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '—'

  const handleDelete = async (id) => {
    if (!confirm('Remove this review?')) return
    setDeletingId(id)
    try {
      await deleteReview(id)
      await load()
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <LoadingScreen label="Loading reviews…" />

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Reviews</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
            {reviews.length} reviews · average rating{' '}
            <span className="flex items-center gap-1 font-semibold text-ink-800">
              <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" /> {avgRating}
            </span>
          </p>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search reviews…" className="input w-full pl-10 sm:w-72" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={Star} title="No reviews yet" description="Customer reviews will appear here after trips are completed." />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((r) => (
            <div key={r.id} className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-ink-900">{r.author?.full_name}</div>
                  <div className="text-xs text-ink-400">{r.package?.title}</div>
                  <div className="mt-1.5">
                    <StarRating rating={r.rating} showValue={false} />
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(r.id)}
                  disabled={deletingId === r.id}
                  className="shrink-0 rounded-lg p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600"
                >
                  {deletingId === r.id ? <Spinner size={14} /> : <Trash2 className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-3 text-sm text-ink-600">{r.comment}</p>
              <div className="mt-2 text-xs text-ink-400">{new Date(r.created_at).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
