import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { FiSearch, FiMenu, FiX, FiUser, FiShield, FiChevronDown } from 'react-icons/fi'

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, profile, signOut, refreshProfile } = useAuth()
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">R</span>
            </div>
            <span className="text-lg font-bold tracking-tight hidden sm:block">ReelDB</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link to="/discover?type=movie" className="nav-link px-3 py-2">Movies</Link>
            <Link to="/discover?type=series" className="nav-link px-3 py-2">Series</Link>
            <Link to="/discover?type=people" className="nav-link px-3 py-2">People</Link>
            <div className="relative group">
              <button className="nav-link px-3 py-2 flex items-center gap-1">
                More <FiChevronDown className="w-3 h-3" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-apple-900/90 backdrop-blur-xl border border-white/[0.06] rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2 shadow-2xl">
                <Link to="/discover" className="block px-5 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5">Discover</Link>
                <Link to="/discover?type=movie&sort=top_rated" className="block px-5 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5">Top Rated</Link>
                <Link to="/discover?type=movie&sort=latest" className="block px-5 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5">Latest Releases</Link>
                <Link to="/discover?type=movie&sort=upcoming" className="block px-5 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5">Upcoming</Link>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
            >
              <FiSearch className="w-4 h-4" />
            </button>

            {profile?.role === 'admin' && (
              <Link
                to="/admin"
                className="hidden md:flex items-center gap-1.5 text-sm text-reel-400 hover:text-reel-300 transition-colors px-3 py-2"
              >
                <FiShield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => { setShowUserMenu(!showUserMenu); refreshProfile() }}
                  className="p-2.5 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
                >
                  <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <FiUser className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-apple-900/90 backdrop-blur-xl border border-white/[0.06] rounded-2xl z-20 py-2 shadow-2xl">
                      <div className="px-5 py-3 border-b border-white/[0.06]">
                        <p className="text-sm font-medium">{profile?.username}</p>
                        <p className="text-xs text-white/50">{profile?.email}</p>
                      </div>
                      {profile?.role === 'admin' && (
                        <Link to="/admin" className="block px-5 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5" onClick={() => setShowUserMenu(false)}>
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => { signOut(); setShowUserMenu(false) }}
                        className="w-full text-left px-5 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm !px-5 !py-2">
                Sign In
              </Link>
            )}

            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden p-2.5 text-white/70 hover:text-white rounded-full hover:bg-white/10"
            >
              {mobileMenu ? <FiX className="w-4 h-4" /> : <FiMenu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-white/[0.06] py-4 px-4">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, series, people..."
                className="w-full bg-apple-800/50 border border-white/[0.06] rounded-full pl-12 pr-5 py-3 text-white placeholder-white/40 focus:outline-none focus:border-reel-500/50 transition-all text-sm"
                autoFocus
              />
            </div>
          </form>
        </div>
      )}

      {mobileMenu && (
        <div className="md:hidden border-t border-white/[0.06] py-4 px-4">
          <nav className="flex flex-col gap-1">
            <Link to="/discover?type=movie" className="nav-link px-4 py-3 rounded-xl hover:bg-white/5" onClick={() => setMobileMenu(false)}>Movies</Link>
            <Link to="/discover?type=series" className="nav-link px-4 py-3 rounded-xl hover:bg-white/5" onClick={() => setMobileMenu(false)}>Series</Link>
            <Link to="/discover?type=people" className="nav-link px-4 py-3 rounded-xl hover:bg-white/5" onClick={() => setMobileMenu(false)}>People</Link>
            <Link to="/discover" className="nav-link px-4 py-3 rounded-xl hover:bg-white/5" onClick={() => setMobileMenu(false)}>Discover</Link>
          </nav>
        </div>
      )}
    </header>
  )
}
