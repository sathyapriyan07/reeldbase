import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-xs">R</span>
              </div>
              <span className="text-base font-bold tracking-tight">ReelDB</span>
            </Link>
            <p className="text-sm text-white/40">Tamil & Malayalam Cinema Database</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">Browse</h3>
            <div className="flex flex-col gap-3">
              <Link to="/discover?type=movie" className="text-sm text-white/60 hover:text-white transition-colors">Movies</Link>
              <Link to="/discover?type=series" className="text-sm text-white/60 hover:text-white transition-colors">Series</Link>
              <Link to="/discover?type=people" className="text-sm text-white/60 hover:text-white transition-colors">People</Link>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">Top Rated</h3>
            <div className="flex flex-col gap-3">
              <Link to="/discover?type=movie&sort=top_rated&language=tamil" className="text-sm text-white/60 hover:text-white transition-colors">Tamil Movies</Link>
              <Link to="/discover?type=movie&sort=top_rated&language=malayalam" className="text-sm text-white/60 hover:text-white transition-colors">Malayalam Movies</Link>
              <Link to="/discover?type=series&sort=top_rated" className="text-sm text-white/60 hover:text-white transition-colors">Top Series</Link>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">Connect</h3>
            <div className="flex flex-col gap-3">
              <Link to="/" className="text-sm text-white/60 hover:text-white transition-colors">About</Link>
              <Link to="/" className="text-sm text-white/60 hover:text-white transition-colors">Contact</Link>
              <Link to="/" className="text-sm text-white/60 hover:text-white transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-white/[0.06] text-center text-sm text-white/30">
          &copy; {new Date().getFullYear()} ReelDB. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
