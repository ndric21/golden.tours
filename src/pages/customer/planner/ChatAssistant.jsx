import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Send, Sparkles, User, MapPin, AlertCircle } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'
import { createConversation, saveMessage, askAI, fetchDestinations, fetchPackages } from '../../../lib/api'
import Spinner from '../../../components/ui/Spinner'

const WELCOME = `Jambo! I'm Jua, your Golden Tours AI travel consultant. 🌍

I specialize exclusively in East Africa — Tanzania, Kenya, Uganda, Rwanda and Zanzibar. Tell me who's traveling, your budget, how many days you have, and what excites you (safari, gorillas, Kilimanjaro, beaches, culture) — and I'll build real, realistic recommendations around it.

What are you dreaming up?`

function findReferences(text, catalog) {
  const found = []
  const lower = text.toLowerCase()
  for (const item of catalog) {
    if (lower.includes(item.name.toLowerCase())) {
      found.push(item)
      if (found.length >= 3) break
    }
  }
  return found
}

export default function ChatAssistant() {
  const { user } = useAuth()
  const [conversationId, setConversationId] = useState(null)
  const [messages, setMessages] = useState([{ role: 'assistant', content: WELCOME, references: [] }])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [catalog, setCatalog] = useState([])
  const bottomRef = useRef(null)

  useEffect(() => {
    async function loadCatalog() {
      const [dests, pkgs] = await Promise.all([fetchDestinations(), fetchPackages()])
      setCatalog([
        ...dests.map((d) => ({ type: 'destination', name: d.name, slug: d.slug, image: d.images?.[0] })),
        ...pkgs.map((p) => ({ type: 'package', name: p.title, slug: p.slug, image: p.images?.[0] })),
      ])
    }
    loadCatalog()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  const handleSend = async (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending) return
    setError('')
    setInput('')

    const userMsg = { role: 'user', content: text }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setSending(true)

    try {
      let convId = conversationId
      if (!convId) {
        const conv = await createConversation(user.id, text.slice(0, 60))
        convId = conv.id
        setConversationId(convId)
      }
      await saveMessage(convId, 'user', text)

      const history = nextMessages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }))

      const reply = await askAI(history, 'chat')
      await saveMessage(convId, 'assistant', reply)

      const references = findReferences(reply, catalog)
      setMessages((prev) => [...prev, { role: 'assistant', content: reply, references }])
    } catch (err) {
      setError(err.message || 'Something went wrong reaching Jua. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex h-[70vh] min-h-[520px] flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
      <div className="flex items-center gap-3 border-b border-ink-100 bg-ink-950 px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-gradient text-ink-950">
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <div className="text-sm font-semibold text-white">Jua — Golden Tours AI</div>
          <div className="text-xs text-ink-400">East Africa travel consultant · always online</div>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto bg-sand-50 px-4 py-6 scrollbar-thin sm:px-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                msg.role === 'user' ? 'bg-safari-100 text-safari-700' : 'bg-gold-gradient text-ink-950'
              }`}
            >
              {msg.role === 'user' ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            </span>
            <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
              <div
                className={`whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'rounded-tr-sm bg-ink-900 text-white'
                    : 'rounded-tl-sm border border-ink-100 bg-white text-ink-800 shadow-card'
                }`}
              >
                {msg.content}
              </div>
              {msg.references?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {msg.references.map((ref) => (
                    <Link
                      key={ref.slug}
                      to={ref.type === 'destination' ? `/app/destinations/${ref.slug}` : `/app/packages/${ref.slug}`}
                      className="flex items-center gap-2 rounded-xl border border-ink-100 bg-white p-1.5 pr-3 text-xs font-medium text-ink-700 shadow-card transition-colors hover:border-gold-400"
                    >
                      {ref.image && <img src={ref.image} alt="" className="h-8 w-10 rounded-lg object-cover" />}
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gold-600" /> {ref.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-gradient text-ink-950">
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-ink-100 bg-white px-4 py-3 text-sm text-ink-400 shadow-card">
              <Spinner size={14} /> Jua is thinking…
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-3 border-t border-ink-100 bg-white p-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about safaris, gorilla trekking, Zanzibar, budgets, seasons…"
          className="input flex-1"
        />
        <button type="submit" disabled={sending || !input.trim()} className="btn-primary !px-5">
          {sending ? <Spinner size={16} /> : <Send className="h-4 w-4" />}
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  )
}
