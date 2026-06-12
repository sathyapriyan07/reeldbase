import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { movieApi, genreApi, companyApi } from '@/lib/api'
import { generateSlug } from '@/lib/utils'
import { FiSave, FiArrowLeft, FiPlus, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AdminMovieEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditing = !!id

  const [form, setForm] = useState({
    title: '', original_title: '', slug: '', tagline: '', overview: '',
    release_date: '', runtime: 0, poster_url: '', backdrop_url: '',
    trailer_url: '', language: 'tamil', budget: 0, revenue: 0,
    status: 'Released', certification: '', imdb_id: '', featured: false,
  })

  const { data: movie } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => movieApi.getById(id!),
    enabled: isEditing,
  })

  const { data: genres } = useQuery({ queryKey: ['genres'], queryFn: genreApi.list })

  useEffect(() => {
    if (movie) {
      setForm({
        title: movie.title || '',
        original_title: movie.original_title || '',
        slug: movie.slug || '',
        tagline: movie.tagline || '',
        overview: movie.overview || '',
        release_date: movie.release_date || '',
        runtime: movie.runtime || 0,
        poster_url: movie.poster_url || '',
        backdrop_url: movie.backdrop_url || '',
        trailer_url: movie.trailer_url || '',
        language: movie.language || 'tamil',
        budget: movie.budget || 0,
        revenue: movie.revenue || 0,
        status: movie.status || 'Released',
        certification: movie.certification || '',
        imdb_id: movie.imdb_id || '',
        featured: movie.featured || false,
      })
    }
  }, [movie])

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (isEditing) return movieApi.update(id!, data)
      return movieApi.create(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-movies'] })
      toast.success(isEditing ? 'Movie updated' : 'Movie created')
      navigate('/admin/movies')
    },
    onError: (err: any) => toast.error(err.message),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = { ...form, slug: form.slug || generateSlug(form.title) }
    mutation.mutate(data)
  }

  const updateField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (field === 'title' && !isEditing && !form.slug) {
      setForm(prev => ({ ...prev, title: value, slug: generateSlug(value) }))
    }
  }

  return (
    <>
      <Helmet><title>{isEditing ? 'Edit Movie' : 'New Movie'} - ReelDB Admin</title></Helmet>

      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/movies')} className="p-2 text-dark-400 hover:text-white">
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold font-display">{isEditing ? 'Edit Movie' : 'New Movie'}</h1>
          <p className="text-dark-400 text-sm mt-1">{isEditing ? `Editing: ${movie?.title}` : 'Create a new movie entry'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="glass rounded-xl border border-white/5 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Title *</label>
              <input type="text" value={form.title} onChange={(e) => updateField('title', e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Original Title</label>
              <input type="text" value={form.original_title} onChange={(e) => updateField('original_title', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Slug</label>
              <input type="text" value={form.slug} onChange={(e) => updateField('slug', e.target.value)} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Tagline</label>
              <input type="text" value={form.tagline} onChange={(e) => updateField('tagline', e.target.value)} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Overview</label>
              <textarea value={form.overview} onChange={(e) => updateField('overview', e.target.value)} className="input-field min-h-[120px]" rows={4} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Release Date</label>
              <input type="date" value={form.release_date} onChange={(e) => updateField('release_date', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Runtime (minutes)</label>
              <input type="number" value={form.runtime} onChange={(e) => updateField('runtime', parseInt(e.target.value))} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Language</label>
              <select value={form.language} onChange={(e) => updateField('language', e.target.value)} className="input-field">
                <option value="tamil">Tamil</option>
                <option value="malayalam">Malayalam</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Certification</label>
              <input type="text" value={form.certification} onChange={(e) => updateField('certification', e.target.value)} className="input-field" placeholder="U/A, A, etc." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => updateField('status', e.target.value)} className="input-field">
                <option value="Released">Released</option>
                <option value="Post Production">Post Production</option>
                <option value="In Production">In Production</option>
                <option value="Announced">Announced</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">IMDB ID</label>
              <input type="text" value={form.imdb_id} onChange={(e) => updateField('imdb_id', e.target.value)} className="input-field" placeholder="tt1234567" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Poster URL</label>
              <input type="url" value={form.poster_url} onChange={(e) => updateField('poster_url', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Backdrop URL</label>
              <input type="url" value={form.backdrop_url} onChange={(e) => updateField('backdrop_url', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Trailer URL</label>
              <input type="url" value={form.trailer_url} onChange={(e) => updateField('trailer_url', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Budget</label>
              <input type="number" value={form.budget} onChange={(e) => updateField('budget', parseInt(e.target.value))} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Revenue</label>
              <input type="number" value={form.revenue} onChange={(e) => updateField('revenue', parseInt(e.target.value))} className="input-field" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => updateField('featured', e.target.checked)} className="w-4 h-4 rounded border-dark-700 bg-dark-800" />
              <label htmlFor="featured" className="text-sm font-medium">Featured on homepage</label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button type="submit" disabled={mutation.isPending} className="btn-primary flex items-center gap-2">
            <FiSave className="w-4 h-4" />
            {mutation.isPending ? 'Saving...' : isEditing ? 'Update Movie' : 'Create Movie'}
          </button>
          <button type="button" onClick={() => navigate('/admin/movies')} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </>
  )
}
