import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Package as PackageIcon, Search, Star } from 'lucide-react'
import {
  fetchPackages,
  fetchDestinations,
  createPackage,
  updatePackage,
  deletePackage,
} from '../../lib/api'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import LoadingScreen from '../../components/LoadingScreen'
import StatusBadge from '../../components/ui/StatusBadge'
import { INTERESTS, COUNTRIES, MONTHS } from '../../data/constants'

const emptyForm = {
  title: '',
  slug: '',
  destination_ids: [],
  countries: [],
  description: '',
  duration_days: 6,
  price_min: '',
  price_max: '',
  budget_level: 'mid-range',
  interests: [],
  images: '',
  highlights: '',
  itinerary: '',
  map_points: '',
  best_months: [],
  group_size: '',
  featured: false,
}

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function parseItinerary(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, idx) => {
      const [title, ...rest] = line.split('|')
      return { day: idx + 1, title: title.trim(), description: rest.join('|').trim() }
    })
}

function itineraryToText(itinerary) {
  return (itinerary ?? []).map((d) => `${d.title} | ${d.description}`).join('\n')
}

function parseMapPoints(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, lat, lng] = line.split('|').map((s) => s.trim())
      return { name, lat: parseFloat(lat), lng: parseFloat(lng) }
    })
}

function mapPointsToText(points) {
  return (points ?? []).map((p) => `${p.name} | ${p.lat} | ${p.lng}`).join('\n')
}

function toggleInArray(arr, value) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
}

export default function AdminPackages() {
  const [packages, setPackages] = useState([])
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const load = () => fetchPackages().then(setPackages)

  useEffect(() => {
    Promise.all([load(), fetchDestinations().then(setDestinations)]).finally(() => setLoading(false))
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setError('')
    setModalOpen(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    setForm({
      title: p.title,
      slug: p.slug,
      destination_ids: p.destination_ids ?? [],
      countries: p.countries ?? [],
      description: p.description,
      duration_days: p.duration_days,
      price_min: p.price_min,
      price_max: p.price_max,
      budget_level: p.budget_level,
      interests: p.interests ?? [],
      images: (p.images ?? []).join('\n'),
      highlights: (p.highlights ?? []).join('\n'),
      itinerary: itineraryToText(p.itinerary),
      map_points: mapPointsToText(p.map_points),
      best_months: p.best_months ?? [],
      group_size: p.group_size ?? '',
      featured: p.featured,
    })
    setError('')
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        title: form.title,
        slug: form.slug || slugify(form.title),
        destination_ids: form.destination_ids,
        countries: form.countries,
        description: form.description,
        duration_days: Number(form.duration_days),
        price_min: Number(form.price_min),
        price_max: Number(form.price_max),
        budget_level: form.budget_level,
        interests: form.interests,
        images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
        highlights: form.highlights.split('\n').map((s) => s.trim()).filter(Boolean),
        itinerary: parseItinerary(form.itinerary),
        map_points: parseMapPoints(form.map_points),
        best_months: form.best_months,
        group_size: form.group_size || null,
        featured: form.featured,
      }
      if (editing) {
        await updatePackage(editing.id, payload)
      } else {
        await createPackage(payload)
      }
      await load()
      setModalOpen(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this package? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await deletePackage(id)
      await load()
    } catch (err) {
      alert(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = packages.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))

  if (loading) return <LoadingScreen label="Loading packages…" />

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Tour Packages</h1>
          <p className="mt-1 text-sm text-ink-500">{packages.length} packages live in the catalog</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" className="input pl-10" />
          </div>
          <button onClick={openCreate} className="btn-primary shrink-0">
            <Plus className="h-4 w-4" /> Add Package
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={PackageIcon} title="No packages yet" description="Create your first East African tour package." />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-ink-100 bg-white shadow-card">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-ink-100 bg-sand-100 text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Package</th>
                <th className="px-5 py-3 font-semibold">Duration</th>
                <th className="px-5 py-3 font-semibold">Price</th>
                <th className="px-5 py-3 font-semibold">Rating</th>
                <th className="px-5 py-3 font-semibold">Featured</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-sand-50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0]} alt="" className="h-10 w-14 rounded-lg object-cover" />
                      <span className="font-medium text-ink-800">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-ink-500">{p.duration_days} days</td>
                  <td className="px-5 py-3.5 text-ink-500">
                    ${p.price_min.toLocaleString()}–${p.price_max.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 text-ink-500">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" /> {p.rating || '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">{p.featured && <StatusBadge status="confirmed" />}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => openEdit(p)} className="rounded-lg p-1.5 text-ink-400 hover:bg-sand-100 hover:text-gold-700">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id}
                        className="rounded-lg p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600"
                      >
                        {deletingId === p.id ? <Spinner size={14} /> : <Trash2 className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Package' : 'Add Package'} maxWidth="max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Title</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Slug (optional)</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input" />
            </div>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <label className="label">Duration (days)</label>
              <input required type="number" min={1} value={form.duration_days} onChange={(e) => setForm({ ...form, duration_days: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Price Min ($)</label>
              <input required type="number" min={0} value={form.price_min} onChange={(e) => setForm({ ...form, price_min: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Price Max ($)</label>
              <input required type="number" min={0} value={form.price_max} onChange={(e) => setForm({ ...form, price_max: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Budget Level</label>
              <select value={form.budget_level} onChange={(e) => setForm({ ...form, budget_level: e.target.value })} className="input">
                <option value="budget">Budget</option>
                <option value="mid-range">Mid-Range</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Countries</label>
            <div className="flex flex-wrap gap-2">
              {COUNTRIES.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setForm({ ...form, countries: toggleInArray(form.countries, c) })}
                  className={`chip ${form.countries.includes(c) ? 'chip-active' : ''}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Destinations featured in this package</label>
            <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto rounded-xl border border-ink-100 p-3 scrollbar-thin">
              {destinations.map((d) => (
                <button
                  type="button"
                  key={d.id}
                  onClick={() => setForm({ ...form, destination_ids: toggleInArray(form.destination_ids, d.id) })}
                  className={`chip !py-1.5 text-xs ${form.destination_ids.includes(d.id) ? 'chip-active' : ''}`}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Interests</label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((i) => (
                <button
                  type="button"
                  key={i.id}
                  onClick={() => setForm({ ...form, interests: toggleInArray(form.interests, i.id) })}
                  className={`chip ${form.interests.includes(i.id) ? 'chip-active' : ''}`}
                >
                  {i.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Best Months</label>
            <div className="flex max-h-28 flex-wrap gap-2 overflow-y-auto rounded-xl border border-ink-100 p-3 scrollbar-thin">
              {MONTHS.map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setForm({ ...form, best_months: toggleInArray(form.best_months, m) })}
                  className={`chip !py-1.5 text-xs ${form.best_months.includes(m) ? 'chip-active' : ''}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Group Size (optional)</label>
              <input value={form.group_size} onChange={(e) => setForm({ ...form, group_size: e.target.value })} placeholder="e.g. 2–12 people" className="input" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-ink-300 text-gold-600 focus:ring-gold-400"
                />
                Feature on homepage
              </label>
            </div>
          </div>

          <div>
            <label className="label">Image URLs (one per line)</label>
            <textarea required rows={3} value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} className="input resize-none" />
          </div>

          <div>
            <label className="label">Highlights (one per line)</label>
            <textarea rows={3} value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} className="input resize-none" />
          </div>

          <div>
            <label className="label">Itinerary — one line per day, format: Title | Description</label>
            <textarea
              rows={5}
              value={form.itinerary}
              onChange={(e) => setForm({ ...form, itinerary: e.target.value })}
              placeholder="Arrival in Arusha | Meet your guide and transfer to your lodge for the night."
              className="input resize-none font-mono text-xs"
            />
          </div>

          <div>
            <label className="label">Route Map Points — one per line, format: Name | Lat | Lng</label>
            <textarea
              rows={3}
              value={form.map_points}
              onChange={(e) => setForm({ ...form, map_points: e.target.value })}
              placeholder="Serengeti National Park | -2.3333 | 34.8333"
              className="input resize-none font-mono text-xs"
            />
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving && <Spinner size={16} />}
            {editing ? 'Save Changes' : 'Create Package'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
