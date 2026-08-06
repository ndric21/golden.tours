import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, MapPin, Search } from 'lucide-react'
import { fetchDestinations, createDestination, updateDestination, deleteDestination } from '../../lib/api'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import LoadingScreen from '../../components/LoadingScreen'
import { COUNTRIES } from '../../data/constants'

const CATEGORIES = ['wildlife', 'beach', 'mountain', 'culture', 'gorilla', 'adventure', 'lake']

const emptyForm = {
  name: '',
  slug: '',
  country: 'Tanzania',
  category: 'wildlife',
  short_description: '',
  description: '',
  best_season: '',
  highlights: '',
  lat: '',
  lng: '',
  images: '',
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function AdminDestinations() {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const load = () => fetchDestinations().then(setDestinations)

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setError('')
    setModalOpen(true)
  }

  const openEdit = (d) => {
    setEditing(d)
    setForm({
      name: d.name,
      slug: d.slug,
      country: d.country,
      category: d.category,
      short_description: d.short_description,
      description: d.description,
      best_season: d.best_season,
      highlights: (d.highlights ?? []).join('\n'),
      lat: d.lat,
      lng: d.lng,
      images: (d.images ?? []).join('\n'),
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
        name: form.name,
        slug: form.slug || slugify(form.name),
        country: form.country,
        category: form.category,
        short_description: form.short_description,
        description: form.description,
        best_season: form.best_season,
        highlights: form.highlights.split('\n').map((s) => s.trim()).filter(Boolean),
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
        images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
      }
      if (editing) {
        await updateDestination(editing.id, payload)
      } else {
        await createDestination(payload)
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
    if (!confirm('Delete this destination? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await deleteDestination(id)
      await load()
    } catch (err) {
      alert(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = destinations.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()))

  if (loading) return <LoadingScreen label="Loading destinations…" />

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Destinations</h1>
          <p className="mt-1 text-sm text-ink-500">{destinations.length} East African destinations managed</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" className="input pl-10" />
          </div>
          <button onClick={openCreate} className="btn-primary shrink-0">
            <Plus className="h-4 w-4" /> Add Destination
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={MapPin} title="No destinations yet" description="Add your first East African destination." />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <div key={d.id} className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
              <img src={d.images?.[0]} alt={d.name} className="h-36 w-full object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-ink-900">{d.name}</div>
                    <div className="text-xs capitalize text-ink-400">
                      {d.country} · {d.category}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <button onClick={() => openEdit(d)} className="rounded-lg p-1.5 text-ink-400 hover:bg-sand-100 hover:text-gold-700">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      disabled={deletingId === d.id}
                      className="rounded-lg p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600"
                    >
                      {deletingId === d.id ? <Spinner size={14} /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-ink-500">{d.short_description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Destination' : 'Add Destination'} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Slug (URL id, optional)</label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="auto-generated from name"
                className="input"
              />
            </div>
            <div>
              <label className="label">Country</label>
              <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input">
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="capitalize">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Latitude</label>
              <input required type="number" step="any" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Longitude</label>
              <input required type="number" step="any" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} className="input" />
            </div>
          </div>

          <div>
            <label className="label">Short Description</label>
            <input
              required
              value={form.short_description}
              onChange={(e) => setForm({ ...form, short_description: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="label">Full Description</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input resize-none"
            />
          </div>

          <div>
            <label className="label">Best Season</label>
            <input required value={form.best_season} onChange={(e) => setForm({ ...form, best_season: e.target.value })} className="input" />
          </div>

          <div>
            <label className="label">Highlights (one per line)</label>
            <textarea
              rows={3}
              value={form.highlights}
              onChange={(e) => setForm({ ...form, highlights: e.target.value })}
              className="input resize-none"
            />
          </div>

          <div>
            <label className="label">Image URLs (one per line)</label>
            <textarea
              required
              rows={3}
              value={form.images}
              onChange={(e) => setForm({ ...form, images: e.target.value })}
              className="input resize-none"
            />
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving && <Spinner size={16} />}
            {editing ? 'Save Changes' : 'Create Destination'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
