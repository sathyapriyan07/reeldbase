import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { movieApi } from '@/lib/api'
import { getImageUrl, getLanguageLabel, formatDate } from '@/lib/utils'
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiStar } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AdminMovies() {
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-movies', search],
    queryFn: () => movieApi.list({ search, limit: 100, sort: 'created_at' }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => movieApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-movies'] })
      toast.success('Movie deleted')
    },
    onError: () => toast.error('Failed to delete'),
  })

  return (
    <>
      <Helmet><title>Movies - ReelDB Admin</title></Helmet>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Movies</h1>
          <p className="text-dark-400 text-sm mt-1">{data?.count || 0} movies</p>
        </div>
        <Link to="/admin/movies/new" className="btn-primary flex items-center gap-2 text-sm">
          <FiPlus className="w-4 h-4" /> Add Movie
        </Link>
      </div>

      <div className="relative mb-6">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search movies..."
          className="input-field pl-10"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-reel-600 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="glass rounded-xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-left text-sm text-dark-400">
                  <th className="p-4 font-medium">Title</th>
                  <th className="p-4 font-medium">Language</th>
                  <th className="p-4 font-medium">Release</th>
                  <th className="p-4 font-medium">Featured</th>
                  <th className="p-4 font-medium">Views</th>
                  <th className="p-4 font-medium w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((movie) => (
                  <tr key={movie.id} className="border-b border-white/5 hover:bg-dark-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {movie.poster_url ? (
                          <img src={getImageUrl(movie.poster_url, 'w92') || movie.poster_url} alt={movie.title} className="w-10 h-14 object-cover rounded" />
                        ) : (
                          <div className="w-10 h-14 bg-dark-800 rounded flex items-center justify-center"><span className="font-bold text-dark-600">{movie.title[0]}</span></div>
                        )}
                        <div>
                          <p className="font-medium text-sm">{movie.title}</p>
                          {movie.original_title && <p className="text-xs text-dark-400">{movie.original_title}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{getLanguageLabel(movie.language)}</td>
                    <td className="p-4 text-sm text-dark-400">{movie.release_date ? formatDate(movie.release_date) : '—'}</td>
                    <td className="p-4">{movie.featured ? <FiStar className="w-4 h-4 text-yellow-400" /> : '—'}</td>
                    <td className="p-4 text-sm text-dark-400">{movie.views}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/movies/${movie.id}/edit`} className="p-2 text-dark-400 hover:text-white transition-colors">
                          <FiEdit2 className="w-4 h-4" />
                        </Link>
                        <button onClick={() => { if (confirm('Delete this movie?')) deleteMutation.mutate(movie.id) }} className="p-2 text-dark-400 hover:text-red-400 transition-colors">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}
