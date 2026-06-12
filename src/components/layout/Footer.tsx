import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-reel-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-lg font-bold font-display">ReelDB</span>
            </Link>
            <p className="text-sm text-dark-400">Tamil & Malayalam Cinema Database</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Browse</h3>
            <div className="flex flex-col gap-2">
              <Link to="/discover?type=movie" className="text-sm text-dark-400 hover:text-white transition-colors">Movies</Link>
              <Link to="/discover?type=series" className="text-sm text-dark-400 hover:text-white transition-colors">Series</Link>
              <Link to="/discover?type=people" className="text-sm text-dark-400 hover:text-white transition-colors">People</Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Top Rated</h3>
            <div className="flex flex-col gap-2">
              <Link to="/discover?type=movie&sort=top_rated&language=tamil" className="text-sm text-dark-400 hover:text-white transition-colors">Tamil Movies</Link>
              <Link to="/discover?type=movie&sort=top_rated&language=malayalam" className="text-sm text-dark-400 hover:text-white transition-colors">Malayalam Movies</Link>
              <Link to="/discover?type=series&sort=top_rated" className="text-sm text-dark-400 hover:text-white transition-colors">Top Series</Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Connect</h3>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-dark-400 hover:text-white transition-colors">About</Link>
              <Link to="/" className="text-sm text-dark-400 hover:text-white transition-colors">Contact</Link>
              <Link to="/" className="text-sm text-dark-400 hover:text-white transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/5 text-center text-sm text-dark-500">
          &copy; {new Date().getFullYear()} ReelDB. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
