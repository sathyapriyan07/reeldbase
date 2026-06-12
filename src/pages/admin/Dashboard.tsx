import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '@/lib/supabase'
import { FiFilm, FiMonitor, FiUsers, FiFileText, FiStar, FiArrowUp, FiEye } from 'react-icons/fi'

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [movies, series, people, reviews, genres] = await Promise.all([
        supabase.from('movies').select('*', { count: 'exact', head: true }),
        supabase.from('series').select('*', { count: 'exact', head: true }),
        supabase.from('people').select('*', { count: 'exact', head: true }),
        supabase.from('reviews').select('*', { count: 'exact', head: true }),
        supabase.from('genres').select('*', { count: 'exact', head: true }),
      ])
      return {
        movies: movies.count || 0,
        series: series.count || 0,
        people: people.count || 0,
        reviews: reviews.count || 0,
        genres: genres.count || 0,
      }
    },
  })

  const { data: recentMovies } = useQuery({
    queryKey: ['admin-recent-movies'],
    queryFn: async () => {
      const { data } = await supabase.from('movies').select('id, title, slug, release_date, featured').order('created_at', { ascending: false }).limit(5)
      return data || []
    },
  })

  const cards = [
    { label: 'Movies', value: stats?.movies || 0, icon: FiFilm, color: 'bg-blue-500/10 text-blue-400', link: '/admin/movies' },
    { label: 'Series', value: stats?.series || 0, icon: FiMonitor, color: 'bg-purple-500/10 text-purple-400', link: '/admin/series' },
    { label: 'People', value: stats?.people || 0, icon: FiUsers, color: 'bg-green-500/10 text-green-400', link: '/admin/people' },
    { label: 'Reviews', value: stats?.reviews || 0, icon: FiFileText, color: 'bg-yellow-500/10 text-yellow-400', link: '/admin/reviews' },
    { label: 'Genres', value: stats?.genres || 0, icon: FiStar, color: 'bg-pink-500/10 text-pink-400', link: '/admin/genres' },
  ]

  return (
    <>
      <Helmet><title>Dashboard - ReelDB Admin</title></Helmet>

      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display">Dashboard</h1>
        <p className="text-dark-400 mt-1">Overview of your database</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {cards.map((card) => (
          <Link key={card.label} to={card.link} className="glass rounded-xl p-5 border border-white/5 hover:border-reel-600/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm text-dark-400">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl border border-white/5 p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Movies</h2>
          <div className="space-y-3">
            {recentMovies?.map((m: any) => (
              <Link key={m.id} to={`/admin/movies/${m.id}/edit`} className="flex items-center justify-between p-3 rounded-lg hover:bg-dark-800 transition-colors">
                <span className="font-medium text-sm">{m.title}</span>
                <div className="flex items-center gap-2">
                  {m.featured && <FiStar className="w-3 h-3 text-yellow-400" />}
                  <span className="text-xs text-dark-400">{m.release_date ? new Date(m.release_date).getFullYear() : '—'}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl border border-white/5 p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/admin/movies/new" className="p-4 rounded-lg bg-reel-600/10 border border-reel-600/20 hover:bg-reel-600/20 transition-colors text-center">
              <FiFilm className="w-6 h-6 text-reel-400 mx-auto mb-2" />
              <span className="text-sm font-medium">Add Movie</span>
            </Link>
            <Link to="/admin/series/new" className="p-4 rounded-lg bg-purple-600/10 border border-purple-600/20 hover:bg-purple-600/20 transition-colors text-center">
              <FiMonitor className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <span className="text-sm font-medium">Add Series</span>
            </Link>
            <Link to="/admin/people/new" className="p-4 rounded-lg bg-green-600/10 border border-green-600/20 hover:bg-green-600/20 transition-colors text-center">
              <FiUsers className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <span className="text-sm font-medium">Add Person</span>
            </Link>
            <Link to="/admin/tmdb-import" className="p-4 rounded-lg bg-orange-600/10 border border-orange-600/20 hover:bg-orange-600/20 transition-colors text-center">
              <FiArrowUp className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <span className="text-sm font-medium">TMDB Import</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
