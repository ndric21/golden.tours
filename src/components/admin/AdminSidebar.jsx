import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  MapPin,
  Package,
  MessagesSquare,
  Inbox,
  CreditCard,
  Star,
  BarChart3,
  Settings,
  Compass,
  X,
} from 'lucide-react'

const items = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/destinations', label: 'Destinations', icon: MapPin },
  { to: '/admin/packages', label: 'Tour Packages', icon: Package },
  { to: '/admin/chat-logs', label: 'AI Chat Logs', icon: MessagesSquare },
  { to: '/admin/enquiries', label: 'Enquiries / Leads', icon: Inbox },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-ink-950/50 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-ink-800 bg-ink-950 transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-gradient text-ink-950">
              <Compass className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <div className="font-display text-base font-bold text-gradient-gold">Golden Tours</div>
              <div className="text-[11px] uppercase tracking-wider text-ink-400">Admin Console</div>
            </div>
          </div>
          <button onClick={onClose} className="text-ink-400 hover:text-white lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4 scrollbar-thin">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gold-gradient text-ink-950 shadow-gold'
                    : 'text-ink-300 hover:bg-ink-800 hover:text-white'
                }`
              }
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-ink-800 p-4 text-xs text-ink-500">Golden Tours Company Console</div>
      </aside>
    </>
  )
}
