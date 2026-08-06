import { useEffect, useMemo, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { BarChart3 } from 'lucide-react'
import { fetchCustomersPerDestination, fetchAllBookings, fetchDashboardStats } from '../../lib/api'
import LoadingScreen from '../../components/LoadingScreen'
import { BOOKING_STATUSES, STATUS_COLORS } from '../../data/constants'

const COLORS = ['#C28A26', '#3E6E49', '#A06E1D', '#5C8C66', '#7C551C', '#83AC8B', '#EDD89C', '#26442E']

function monthKey(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

function buildRevenueTrend(bookings) {
  const now = new Date()
  const months = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({ key: monthKey(d), revenue: 0, bookings: 0 })
  }
  const map = new Map(months.map((m) => [m.key, m]))
  for (const b of bookings) {
    const key = monthKey(b.created_at)
    if (map.has(key)) {
      map.get(key).revenue += Number(b.total_price ?? 0)
      map.get(key).bookings += 1
    }
  }
  return months
}

function buildStatusBreakdown(bookings) {
  return BOOKING_STATUSES.map((s) => ({
    name: s,
    value: bookings.filter((b) => b.status === s).length,
  })).filter((s) => s.value > 0)
}

function buildTopPackages(bookings) {
  const counts = new Map()
  for (const b of bookings) {
    const title = b.package?.title
    if (!title) continue
    counts.set(title, (counts.get(title) ?? 0) + 1)
  }
  return Array.from(counts.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)
}

const STATUS_HEX = {
  pending: '#D6A63F',
  confirmed: '#3E6E49',
  completed: '#767F7F',
  cancelled: '#DC2626',
}

export default function Reports() {
  const [customersPerDest, setCustomersPerDest] = useState([])
  const [bookings, setBookings] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchCustomersPerDestination(), fetchAllBookings(), fetchDashboardStats()])
      .then(([cpd, b, s]) => {
        setCustomersPerDest(cpd)
        setBookings(b)
        setStats(s)
      })
      .finally(() => setLoading(false))
  }, [])

  const revenueTrend = useMemo(() => buildRevenueTrend(bookings), [bookings])
  const statusBreakdown = useMemo(() => buildStatusBreakdown(bookings), [bookings])
  const topPackages = useMemo(() => buildTopPackages(bookings), [bookings])

  if (loading || !stats) return <LoadingScreen label="Building reports…" />

  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-ink-900">
          <BarChart3 className="h-6 w-6 text-gold-600" /> Reports
        </h1>
        <p className="mt-1 text-sm text-ink-500">Deep-dive analytics across revenue, bookings and destinations.</p>
      </div>

      <div className="card p-6">
        <h2 className="font-display text-base font-bold text-ink-900">Customers per Destination</h2>
        <p className="text-xs text-ink-400">Unique customers who have booked a trip touching each place — full breakdown</p>
        <div className="mt-4" style={{ height: Math.max(280, customersPerDest.length * 32) }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={customersPerDest} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E4E6E6" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#767F7F' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" width={160} tick={{ fontSize: 12, fill: '#454B4B' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E4E6E6', fontSize: 13 }} />
              <Bar dataKey="customers" radius={[0, 6, 6, 0]}>
                {customersPerDest.map((entry, idx) => (
                  <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="card p-6 xl:col-span-2">
          <h2 className="font-display text-base font-bold text-ink-900">Revenue & Booking Trend</h2>
          <p className="text-xs text-ink-400">Last 12 months</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E6E6" />
                <XAxis dataKey="key" tick={{ fontSize: 11, fill: '#767F7F' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#767F7F' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#767F7F' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E4E6E6', fontSize: 13 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#C28A26" strokeWidth={2.5} dot={false} name="Revenue ($)" />
                <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="#3E6E49" strokeWidth={2.5} dot={false} name="Bookings" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-display text-base font-bold text-ink-900">Bookings by Status</h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusBreakdown} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {statusBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_HEX[entry.name]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E4E6E6', fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1.5">
            {statusBreakdown.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-xs capitalize">
                <span className="flex items-center gap-1.5 text-ink-600">
                  <span className="h-2 w-2 rounded-full" style={{ background: STATUS_HEX[s.name] }} />
                  {s.name}
                </span>
                <span className="font-semibold text-ink-800">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-display text-base font-bold text-ink-900">Top Performing Packages</h2>
        <p className="text-xs text-ink-400">By number of bookings</p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topPackages}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E6E6" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#767F7F' }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={70} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#767F7F' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E4E6E6', fontSize: 13 }} />
              <Bar dataKey="value" fill="#C28A26" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
