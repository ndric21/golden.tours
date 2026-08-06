import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessagesSquare, Search, Sparkles, User } from 'lucide-react'
import { fetchAllConversations } from '../../lib/api'
import Modal from '../../components/ui/Modal'
import EmptyState from '../../components/ui/EmptyState'
import LoadingScreen from '../../components/LoadingScreen'

export default function ChatLogs() {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(null)

  useEffect(() => {
    fetchAllConversations()
      .then(setConversations)
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return conversations.filter(
      (c) => !q || c.customer?.full_name?.toLowerCase().includes(q) || c.title?.toLowerCase().includes(q)
    )
  }, [conversations, query])

  const sortedMessages = (c) => [...(c.messages ?? [])].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

  if (loading) return <LoadingScreen label="Loading AI chat logs…" />

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">AI Chat Logs</h1>
          <p className="mt-1 text-sm text-ink-500">{conversations.length} conversations with Jua, the AI assistant</p>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search customer or topic…" className="input w-full pl-10 sm:w-80" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={MessagesSquare} title="No AI conversations yet" description="Chat transcripts will appear here as customers use the AI Planner." />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.map((c) => {
            const msgs = sortedMessages(c)
            const lastMsg = msgs[msgs.length - 1]
            return (
              <button
                key={c.id}
                onClick={() => setActive(c)}
                className="flex w-full items-center gap-4 rounded-2xl border border-ink-100 bg-white p-4 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-ink-900">{c.customer?.full_name ?? 'Unknown traveler'}</span>
                    <span className="text-xs text-ink-400">{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="truncate text-sm text-ink-500">{lastMsg?.content ?? c.title}</div>
                </div>
                <span className="shrink-0 badge bg-sand-100 text-ink-600">{msgs.length} messages</span>
              </button>
            )
          })}
        </div>
      )}

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.customer?.full_name ?? 'Conversation'} maxWidth="max-w-xl">
        {active && (
          <div>
            <Link to={`/admin/customers/${active.user_id}`} className="text-xs font-semibold text-gold-700 hover:text-gold-800">
              View customer profile →
            </Link>
            <div className="mt-4 max-h-96 space-y-4 overflow-y-auto scrollbar-thin">
              {sortedMessages(active).map((m) => (
                <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      m.role === 'user' ? 'bg-safari-100 text-safari-700' : 'bg-gold-gradient text-ink-950'
                    }`}
                  >
                    {m.role === 'user' ? <User className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
                  </span>
                  <div
                    className={`max-w-[75%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm ${
                      m.role === 'user' ? 'rounded-tr-sm bg-ink-900 text-white' : 'rounded-tl-sm bg-sand-100 text-ink-800'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
