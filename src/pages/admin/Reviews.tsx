import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { reviewApi, movieApi } from '@/lib/api'
import { FiEdit2, FiTrash2, FiStar, FiPlus, FiSearch } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

export default function AdminReviews() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [searchMovie, setSearchMovie] = useState('')

  const [form, setForm] = useState({
    title: '', content: '', introduction: '', story: '', performances: '',
    technical_aspects: '', music_review: '', verdict: '', rating: 5,
    status: 'draft' as 'draft' | 'published', featured: false,
    movie_id: '', series_id: '',
  })

  const { data: reviews } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: () => reviewApi.list({}),
  })

  const { data: movies } = useQuery({
    queryKey: ['admin-movies-search', searchMovie],
    queryFn: () => movieApi.list({ search: searchMovie, limit: 10 }),
  })

  const createMutation = useMutation({
    mutationFn: () => reviewApi.create(form),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-reviews'] }); setShowForm(false); resetForm(); toast.success('Review created') },
    onError: (err: any) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => reviewApi.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-reviews'] }); toast.success('Deleted') },
    onError: () => toast.error('Failed to delete'),
  })

  const resetForm = () => setForm({ title: '', content: '', introduction: '', story: '', performances: '', technical_aspects: '', music_review: '', verdict: '', rating: 5, status: 'draft', featured: false, movie_id: '', series_id: '' })

  return (
    <>
      <Helmet><title>Reviews - ReelDB Admin</title></Helmet>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-display">Reviews</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 text-sm">
          <FiPlus className="w-4 h-4" /> New Review
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-xl border border-white/5 p-6 mb-8 space-y-4">
          <h2 className="text-lg font-semibold">Create Review</h2>
          <div>
            <label className="block text-sm font-medium mb-1.5">Search Movie</label>
            <input type="text" value={searchMovie} onChange={(e) => setSearchMovie(e.target.value)} className="input-field" placeholder="Search for a movie..." />
            {movies?.data && movies.data.length > 0 && (
              <div className="mt-2 glass rounded-lg border border-white/5 max-h-40 overflow-y-auto">
                {movies.data.map((m) => (
                  <button key={m.id} onClick={() => setForm({ ...form, movie_id: m.id })} className={`block w-full text-left px-4 py-2 text-sm hover:bg-dark-800 ${form.movie_id === m.id ? 'bg-reel-600/20 text-reel-400' : ''}`}>
                    {m.title} ({m.release_date ? new Date(m.release_date).getFullYear() : 'N/A'})
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Review Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" />
          </div>
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Rating (0-10)</label>
              <input type="number" min={0} max={10} value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })} className="input-field w-24" />
            </div>
            <div className="flex items-end gap-3 pb-1.5">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4" />
                <span className="text-sm">Featured</span>
              </label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className="input-field">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['introduction', 'story', 'performances', 'technical_aspects', 'music_review', 'verdict'].map((field) => (
              <div key={field} className={field === 'verdict' ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium mb-1.5 capitalize">{field.replace('_', ' ')}</label>
                <textarea value={(form as any)[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} className="input-field min-h-[80px]" rows={3} />
              </div>
            ))}
          </div>
          <button onClick={() => createMutation.mutate()} className="btn-primary">Save Review</button>
        </div>
      )}

      <div className="glass rounded-xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 text-left text-sm text-dark-400">
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Rating</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Featured</th>
                <th className="p-4 font-medium w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews?.map((review: any) => (
                <tr key={review.id} className="border-b border-white/5 hover:bg-dark-800/50">
                  <td className="p-4 text-sm font-medium">{review.title}</td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 text-sm"><FiStar className="w-3 h-3 text-yellow-400" />{review.rating}/10</span>
                  </td>
                  <td className="p-4">
                    <span className={`badge ${review.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{review.status}</span>
                  </td>
                  <td className="p-4">{review.featured ? <FiStar className="w-4 h-4 text-yellow-400" /> : '—'}</td>
                  <td className="p-4">
                    <button onClick={() => { if (confirm('Delete this review?')) deleteMutation.mutate(review.id) }} className="p-2 text-dark-400 hover:text-red-400"><FiTrash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
