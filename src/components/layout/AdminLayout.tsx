import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import {
  FiHome, FiFilm, FiMonitor, FiUsers, FiTag, FiGlobe, FiBriefcase,
  FiFileText, FiImage, FiGrid, FiMenu, FiX, FiDownload,
  FiChevronLeft, FiStar
} from 'react-icons/fi'

const navItems = [
  { icon: FiHome, label: 'Dashboard', path: '/admin' },
  { icon: FiFilm, label: 'Movies', path: '/admin/movies' },
  { icon: FiMonitor, label: 'Series', path: '/admin/series' },
  { icon: FiUsers, label: 'People', path: '/admin/people' },
  { icon: FiTag, label: 'Genres', path: '/admin/genres' },
  { icon: FiGlobe, label: 'Languages', path: '/admin/languages' },
  { icon: FiBriefcase, label: 'Companies', path: '/admin/companies' },
  { icon: FiFileText, label: 'Reviews', path: '/admin/reviews' },
  { icon: FiStar, label: 'Tags', path: '/admin/tags' },
  { icon: FiGrid, label: 'Home Sections', path: '/admin/home-sections' },
  { icon: FiImage, label: 'Media', path: '/admin/media' },
  { icon: FiDownload, label: 'TMDB Import', path: '/admin/tmdb-import' },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { profile } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black flex">
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-apple-950 border-r border-white/[0.06] transform transition-transform duration-300
        lg:translate-x-0 lg:static lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/[0.06]">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">R</span>
            </div>
            <span className="text-base font-bold tracking-tight">ReelDB</span>
            <span className="text-[10px] text-reel-400 ml-0.5 font-medium">Admin</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/40 hover:text-white">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3 space-y-0.5 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/admin' && location.pathname.startsWith(item.path))
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/[0.06]">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors w-full px-3 py-2.5 rounded-xl hover:bg-white/5"
          >
            <FiChevronLeft className="w-4 h-4" />
            Back to Site
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 h-16 glass flex items-center justify-between px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-white/40 hover:text-white rounded-full hover:bg-white/10"
          >
            <FiMenu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-sm text-white/50">
              Welcome, <span className="text-white font-medium">{profile?.username}</span>
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
