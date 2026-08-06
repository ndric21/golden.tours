import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ClipboardList, MessageCircleMore } from 'lucide-react'
import SmartFormPlanner from './planner/SmartFormPlanner'
import ChatAssistant from './planner/ChatAssistant'

export default function Planner() {
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') === 'chat' ? 'chat' : 'form'
  const initialInterest = searchParams.get('interest') ?? ''
  const [tab, setTab] = useState(initialTab)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-ink-900">AI Vacation Planner</h1>
        <p className="mt-2 text-sm text-ink-500">
          Two ways to plan your East Africa trip — fill out a smart form for instant matched itineraries, or
          chat directly with Jua, our AI travel consultant.
        </p>
      </div>

      <div className="mt-8 inline-flex rounded-full border border-ink-200 bg-white p-1">
        <button
          onClick={() => setTab('form')}
          className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
            tab === 'form' ? 'bg-ink-900 text-white' : 'text-ink-500 hover:text-ink-800'
          }`}
        >
          <ClipboardList className="h-4 w-4" /> Smart Form Planner
        </button>
        <button
          onClick={() => setTab('chat')}
          className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
            tab === 'chat' ? 'bg-ink-900 text-white' : 'text-ink-500 hover:text-ink-800'
          }`}
        >
          <MessageCircleMore className="h-4 w-4" /> AI Chat Assistant
        </button>
      </div>

      <div className="mt-8">
        {tab === 'form' ? <SmartFormPlanner initialInterest={initialInterest} /> : <ChatAssistant />}
      </div>
    </div>
  )
}
