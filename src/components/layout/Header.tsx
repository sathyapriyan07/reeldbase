import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { FiSearch, FiMenu, FiX, FiChevronDown, FiUser, FiShield } from 'react-icons/fi'

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
    <header className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-reel-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-xl font-bold font-display hidden sm:block">ReelDB</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/discover?type=movie" className="text-sm text-dark-300 hover:text-white transition-colors">Movies</Link>
            <Link to="/discover?type=series" className="text-sm text-dark-300 hover:text-white transition-colors">Series</Link>
            <Link to="/discover?type=people" className="text-sm text-dark-300 hover:text-white transition-colors">People</Link>
            <div className="relative group">
              <button className="text-sm text-dark-300 hover:text-white transition-colors flex items-center gap-1">
                More <FiChevronDown className="w-3 h-3" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 glass border border-white/5 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                <Link to="/discover" className="block px-4 py-2 text-sm text-dark-300 hover:text-white hover:bg-dark-800">Discover</Link>
                <Link to="/discover?type=movie&sort=top_rated" className="block px-4 py-2 text-sm text-dark-300 hover:text-white hover:bg-dark-800">Top Rated</Link>
                <Link to="/discover?type=movie&sort=latest" className="block px-4 py-2 text-sm text-dark-300 hover:text-white hover:bg-dark-800">Latest Releases</Link>
                <Link to="/discover?type=movie&sort=upcoming" className="block px-4 py-2 text-sm text-dark-300 hover:text-white hover:bg-dark-800">Upcoming</Link>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-dark-300 hover:text-white transition-colors"
            >
              <FiSearch className="w-5 h-5" />
            </button>

            {profile?.role === 'admin' && (
              <Link
                to="/admin"
                className="hidden md:flex items-center gap-1.5 text-sm text-reel-400 hover:text-reel-300 transition-colors"
              >
                <FiShield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => { setShowUserMenu(!showUserMenu); refreshProfile() }}
                  className="flex items-center gap-2 p-2 text-dark-300 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 bg-reel-600/20 rounded-full flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <FiUser className="w-4 h-4 text-reel-400" />
                    )}
                  </div>
                </button>
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 mt-2 w-56 glass border border-white/5 rounded-lg z-20 py-2 shadow-xl">
                      <div className="px-4 py-2 border-b border-white/5">
                        <p className="text-sm font-medium">{profile?.username}</p>
                        <p className="text-xs text-dark-400">{profile?.email}</p>
                      </div>
                      {profile?.role === 'admin' && (
                        <Link to="/admin" className="block px-4 py-2 text-sm text-dark-300 hover:text-white hover:bg-dark-800" onClick={() => setShowUserMenu(false)}>
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => { signOut(); setShowUserMenu(false) }}
                        className="w-full text-left px-4 py-2 text-sm text-dark-300 hover:text-white hover:bg-dark-800"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm !py-2 !px-4">
                Sign In
              </Link>
            )}

            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden p-2 text-dark-300 hover:text-white"
            >
              {mobileMenu ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-white/5 py-4 px-4">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, series, people..."
                className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-reel-600 transition-colors"
                autoFocus
              />
            </div>
          </form>
        </div>
      )}

      {mobileMenu && (
        <div className="md:hidden border-t border-white/5 py-4 px-4">
          <nav className="flex flex-col gap-3">
            <Link to="/discover?type=movie" className="text-sm text-dark-300 hover:text-white py-2" onClick={() => setMobileMenu(false)}>Movies</Link>
            <Link to="/discover?type=series" className="text-sm text-dark-300 hover:text-white py-2" onClick={() => setMobileMenu(false)}>Series</Link>
            <Link to="/discover?type=people" className="text-sm text-dark-300 hover:text-white py-2" onClick={() => setMobileMenu(false)}>People</Link>
            <Link to="/discover" className="text-sm text-dark-300 hover:text-white py-2" onClick={() => setMobileMenu(false)}>Discover</Link>
          </nav>
        </div>
      )}
    </header>
  )
}
