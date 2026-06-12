import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { seriesApi, storageApi } from '@/lib/api'
import { generateSlug } from '@/lib/utils'
import { FiSave, FiArrowLeft, FiUpload } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AdminSeriesEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditing = !!id
  const logoInputRef = useRef<HTMLInputElement>(null)
  const [logoUploading, setLogoUploading] = useState(false)

  const [form, setForm] = useState({
    title: '', original_title: '', slug: '', tagline: '', synopsis: '',
    first_air_date: '', last_air_date: '', poster_url: '', backdrop_url: '',
    logo_url: '', show_logo: false,
    trailer_url: '', language: 'tamil', status: 'Returning Series',
    certification: '', featured: false,
  })

  const { data: series } = useQuery({
    queryKey: ['series', id],
    queryFn: () => seriesApi.getBySlug(id!),
    enabled: isEditing,
  })

  useEffect(() => {
    if (series) {
      setForm({
        title: series.title || '', original_title: series.original_title || '',
        slug: series.slug || '', tagline: series.tagline || '',
        synopsis: series.synopsis || '', first_air_date: series.first_air_date || '',
        last_air_date: series.last_air_date || '', poster_url: series.poster_url || '',
        backdrop_url: series.backdrop_url || '', logo_url: series.logo_url || '',
        show_logo: series.show_logo || false,
        trailer_url: series.trailer_url || '',
        language: series.language || 'tamil', status: series.status || 'Returning Series',
        certification: series.certification || '', featured: series.featured || false,
      })
    }
  }, [series])

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (isEditing) return seriesApi.update(id!, data)
      return seriesApi.create(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-series'] })
      toast.success(isEditing ? 'Series updated' : 'Series created')
      navigate('/admin/series')
    },
    onError: (err: any) => toast.error(err.message),
  })

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoUploading(true)
    try {
      const path = `logos/${Date.now()}_${file.name}`
      const { url } = await storageApi.upload('media', path, file)
      setForm(prev => ({ ...prev, logo_url: url, show_logo: true }))
      toast.success('Logo uploaded')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLogoUploading(false)
      if (logoInputRef.current) logoInputRef.current.value = ''
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = { ...form, slug: form.slug || generateSlug(form.title) }
    mutation.mutate(data)
  }

  return (
    <>
      <Helmet><title>{isEditing ? 'Edit Series' : 'New Series'} - ReelDB Admin</title></Helmet>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/series')} className="p-2 text-white/40 hover:text-white rounded-full hover:bg-white/10"><FiArrowLeft className="w-5 h-5" /></button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{isEditing ? 'Edit Series' : 'New Series'}</h1>
          <p className="text-white/40 text-sm mt-1">{isEditing ? `Editing: ${series?.title}` : 'Create a new series entry'}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="glass-card p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Title *</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || generateSlug(e.target.value) })} className="input-field" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Synopsis</label>
              <textarea value={form.synopsis} onChange={(e) => setForm({ ...form, synopsis: e.target.value })} className="input-field min-h-[100px]" rows={4} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Language</label>
              <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="input-field">
                <option value="tamil">Tamil</option>
                <option value="malayalam">Malayalam</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
                <option value="Returning Series">Returning Series</option>
                <option value="Ended">Ended</option>
                <option value="In Production">In Production</option>
                <option value="Planned">Planned</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Poster URL</label>
              <input type="url" value={form.poster_url} onChange={(e) => setForm({ ...form, poster_url: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Backdrop URL</label>
              <input type="url" value={form.backdrop_url} onChange={(e) => setForm({ ...form, backdrop_url: e.target.value })} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Title Logo</label>
              <div className="flex flex-wrap items-center gap-3">
                <input type="url" value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} className="input-field flex-1 min-w-[200px]" placeholder="Logo URL or upload a file" />
                <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                <button type="button" onClick={() => logoInputRef.current?.click()} disabled={logoUploading} className="btn-secondary flex items-center gap-2 text-sm">
                  <FiUpload className="w-4 h-4" />
                  {logoUploading ? 'Uploading...' : 'Upload'}
                </button>
                {form.logo_url && (
                  <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                    <input type="checkbox" checked={form.show_logo} onChange={(e) => setForm({ ...form, show_logo: e.target.checked })} className="w-4 h-4 rounded border-white/20 bg-white/10" />
                    Show logo instead of title
                  </label>
                )}
              </div>
              {form.logo_url && (
                <div className="mt-2">
                  <img src={form.logo_url} alt="Logo preview" className="h-10 object-contain bg-white/10 rounded p-1" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded border-white/20 bg-white/10" />
              <label htmlFor="featured" className="text-sm font-medium">Featured</label>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button type="submit" disabled={mutation.isPending} className="btn-primary flex items-center gap-2">
            <FiSave className="w-4 h-4" />
            {mutation.isPending ? 'Saving...' : isEditing ? 'Update Series' : 'Create Series'}
          </button>
        </div>
      </form>
    </>
  )
}
