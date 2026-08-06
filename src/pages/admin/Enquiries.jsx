import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Inbox, Search, Mail, Phone } from 'lucide-react'
import { fetchAllEnquiries, updateEnquiryStatus } from '../../lib/api'
import StatusBadge from '../../components/ui/StatusBadge'
import EmptyState from '../../components/ui/EmptyState'
import LoadingScreen from '../../components/LoadingScreen'
import { ENQUIRY_STATUSES } from '../../data/constants'

const SOURCE_LABELS = {
  contact_form: 'Contact Form',
  ai_chat: 'AI Chat',
  planner: 'AI Planner',
}

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [updatingId, setUpdatingId] = useState(null)

  const load = () => fetchAllEnquiries().then(setEnquiries)

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return enquiries.filter((e) => {
      const matchesStatus = status === 'all' || e.status === status
      const matchesQuery = !q || e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q)
      return matchesStatus && matchesQuery
    })
  }, [enquiries, query, status])

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id)
    try {
      await updateEnquiryStatus(id, newStatus)
      await load()
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) return <LoadingScreen label="Loading enquiries…" />

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Enquiries / Leads</h1>
          <p className="mt-1 text-sm text-ink-500">{enquiries.length} leads captured from bookings, AI chat and contact forms</p>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search leads…" className="input w-full pl-10 sm:w-72" />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button onClick={() => setStatus('all')} className={`chip ${status === 'all' ? 'chip-active' : ''}`}>
          All ({enquiries.length})
        </button>
        {ENQUIRY_STATUSES.map((s) => (
          <button key={s} onClick={() => setStatus(s)} className={`chip capitalize ${status === s ? 'chip-active' : ''}`}>
            {s} ({enquiries.filter((e) => e.status === s).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={Inbox} title="No enquiries found" description="New leads from bookings and the AI planner will appear here." />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.map((e) => (
            <div key={e.id} className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {e.user_id ? (
                      <Link to={`/admin/customers/${e.user_id}`} className="font-semibold text-ink-900 hover:text-gold-700">
                        {e.name}
                      </Link>
                    ) : (
                      <span className="font-semibold text-ink-900">{e.name}</span>
                    )}
                    <span className="badge bg-sand-100 text-ink-500">{SOURCE_LABELS[e.source] ?? e.source}</span>
                    <span className="text-xs text-ink-400">{new Date(e.created_at).toLocaleString()}</span>
                  </div>
                  <p className="mt-2 text-sm text-ink-600">{e.message}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {e.email}
                    </span>
                    {e.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {e.phone}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusBadge status={e.status} />
                  <select
                    value={e.status}
                    disabled={updatingId === e.id}
                    onChange={(ev) => handleStatusChange(e.id, ev.target.value)}
                    className="rounded-lg border border-ink-200 bg-white px-2.5 py-1.5 text-xs font-semibold capitalize"
                  >
                    {ENQUIRY_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
