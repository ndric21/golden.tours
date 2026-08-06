import { useState } from 'react'
import { Outlet, useNavigate, Link } from 'react-router-dom'
import { Menu, LogOut, User } from 'lucide-react'
import AdminSidebar from './AdminSidebar'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-sand-100">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-ink-100 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button
            className="text-ink-500 hover:text-ink-900 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="hidden text-sm text-ink-400 lg:block">Company Admin Console</div>
          <Link to="/admin/settings" className="flex items-center gap-2.5">
            <div className="text-right leading-tight">
              <div className="text-sm font-semibold text-ink-900">{profile?.full_name}</div>
              <div className="text-xs text-ink-400">Administrator</div>
            </div>
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover" />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                <User className="h-4.5 w-4.5" />
              </span>
            )}
          </Link>
          <button
            onClick={handleSignOut}
            className="ml-3 hidden items-center gap-1.5 rounded-full border border-ink-200 px-3.5 py-2 text-xs font-semibold text-ink-600 hover:border-red-300 hover:text-red-600 sm:flex"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
