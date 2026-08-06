import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { DollarSign, CalendarCheck, MapPin, Inbox, ArrowUpRight } from 'lucide-react'
import StatCard from '../../components/admin/StatCard'
import StatusBadge from '../../components/ui/StatusBadge'
import LoadingScreen from '../../components/LoadingScreen'
import { fetchDashboardStats, fetchCustomersPerDestination, fetchDestinations, fetchAllEnquiries } from '../../lib/api'

const PIE_COLORS = ['#C28A26', '#3E6E49', '#A06E1D', '#5C8C66', '#7C551C', '#83AC8B']

function monthKey(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

function buildTrend(bookings) {
  const now = new Date()
  const months = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({ key: monthKey(d), bookings: 0, revenue: 0 })
  }
  const map = new Map(months.map((m) => [m.key, m]))
  for (const b of bookings) {
    const key = monthKey(b.created_at)
    if (map.has(key)) {
      map.get(key).bookings += 1
      map.get(key).revenue += Number(b.total_price ?? 0)
    }
  }
  return months
}

function buildPopularDestinations(bookings, destinations) {
  const destMap = new Map(destinations.map((d) => [d.id, d.name]))
  const counts = new Map()
  for (const b of bookings) {
    const ids = b.package?.destination_ids ?? []
    for (const id of ids) {
      const name = destMap.get(id)
      if (!name) continue
      counts.set(name, (counts.get(name) ?? 0) + 1)
    }
  }
  return Array.from(counts.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [customersPerDest, setCustomersPerDest] = useState([])
  const [destinations, setDestinations] = useState([])
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchDashboardStats(), fetchCustomersPerDestination(), fetchDestinations(), fetchAllEnquiries()])
      .then(([s, cpd, dests, enq]) => {
        setStats(s)
        setCustomersPerDest(cpd)
        setDestinations(dests)
        setEnquiries(enq.slice(0, 6))
      })
      .finally(() => setLoading(false))
  }, [])

  const trend = useMemo(() => (stats ? buildTrend(stats.bookings) : []), [stats])
  const popular = useMemo(
    () => (stats ? buildPopularDestinations(stats.bookings, destinations) : []),
    [stats, destinations]
  )
  const recentBookings = useMemo(
    () => (stats ? [...stats.bookings].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 6) : []),
    [stats]
  )

  if (loading || !stats) return <LoadingScreen label="Loading admin dashboard…" />

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-500">Golden Tours company performance at a glance.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          sub="From confirmed payments"
          accent="gold"
        />
        <StatCard icon={CalendarCheck} label="Total Bookings" value={stats.totalBookings} sub="All time" accent="safari" />
        <StatCard icon={MapPin} label="Active Tours" value={stats.activeTours} sub="Pending & confirmed" accent="ink" />
        <StatCard icon={Inbox} label="New Leads" value={stats.newLeads} sub="Awaiting first contact" accent="red" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="card p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-ink-900">Booking Trends</h2>
            <span className="text-xs text-ink-400">Last 6 months</span>
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C28A26" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#C28A26" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E6E6" />
                <XAxis dataKey="key" tick={{ fontSize: 12, fill: '#767F7F' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#767F7F' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #E4E6E6', fontSize: 13 }}
                  formatter={(value, name) => [name === 'revenue' ? `$${value.toLocaleString()}` : value, name === 'revenue' ? 'Revenue' : 'Bookings']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#C28A26" strokeWidth={2} fill="url(#revenueFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-display text-base font-bold text-ink-900">Popular Destinations</h2>
          <p className="text-xs text-ink-400">By booking volume</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={popular} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {popular.map((entry, idx) => (
                    <Cell key={entry.name} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E4E6E6', fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1.5">
            {popular.map((p, idx) => (
              <div key={p.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-ink-600">
                  <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[idx % PIE_COLORS.length] }} />
                  {p.name}
                </span>
                <span className="font-semibold text-ink-800">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-display text-base font-bold text-ink-900">Customers per Destination</h2>
        <p className="text-xs text-ink-400">Unique customers who booked a trip touching each place</p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={customersPerDest.slice(0, 10)} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E4E6E6" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#767F7F' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 12, fill: '#454B4B' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E4E6E6', fontSize: 13 }} />
              <Bar dataKey="customers" radius={[0, 6, 6, 0]} fill="#3E6E49" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-ink-900">Recent Bookings</h2>
            <Link to="/admin/bookings" className="flex items-center gap-1 text-xs font-semibold text-gold-700 hover:text-gold-800">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentBookings.map((b, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-xl bg-sand-100 px-4 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-ink-800">{b.package?.title ?? 'Package'}</div>
                  <div className="text-xs text-ink-400">{new Date(b.created_at).toLocaleDateString()}</div>
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-ink-900">Recent Enquiries</h2>
            <Link to="/admin/enquiries" className="flex items-center gap-1 text-xs font-semibold text-gold-700 hover:text-gold-800">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {enquiries.map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-xl bg-sand-100 px-4 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-ink-800">{e.name}</div>
                  <div className="truncate text-xs text-ink-400">{e.message}</div>
                </div>
                <StatusBadge status={e.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
