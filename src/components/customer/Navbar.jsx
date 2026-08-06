import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { Menu, X, Compass, LogOut, User, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/app', label: 'Home', end: true },
  { to: '/app/destinations', label: 'Destinations' },
  { to: '/app/planner', label: 'AI Planner' },
  { to: '/app/bookings', label: 'My Trips' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-sand-50/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/app" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-gradient text-ink-950">
            <Compass className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-gradient-gold">Golden Tours</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-ink-200 bg-white py-1.5 pl-1.5 pr-3 text-sm font-medium text-ink-800 hover:border-gold-400"
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="h-7 w-7 rounded-full object-cover" />
              ) : (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-safari-100 text-safari-700">
                  <User className="h-4 w-4" />
                </span>
              )}
              <span className="max-w-[120px] truncate">{profile?.full_name ?? 'Traveler'}</span>
              <ChevronDown className="h-3.5 w-3.5 text-ink-400" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-ink-100 bg-white py-1 shadow-elevated">
                  <Link
                    to="/app/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 hover:bg-sand-100"
                  >
                    <User className="h-4 w-4" /> My Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-100 bg-white px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-ink-900 text-white' : 'text-ink-700 hover:bg-sand-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/app/profile"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-sand-100"
            >
              My Profile
            </Link>
            <button
              onClick={handleSignOut}
              className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Sign Out
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
