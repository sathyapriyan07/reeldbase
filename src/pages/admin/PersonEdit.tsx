import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { personApi } from '@/lib/api'
import { generateSlug } from '@/lib/utils'
import { FiSave, FiArrowLeft } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AdminPersonEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditing = !!id

  const [form, setForm] = useState({
    name: '', slug: '', biography: '', birth_date: '', death_date: '',
    birth_place: '', profile_url: '', role: 'actor', known_for_department: '',
  })

  const { data: person } = useQuery({
    queryKey: ['person', id],
    queryFn: () => personApi.getBySlug(id!),
    enabled: isEditing,
  })

  useEffect(() => {
    if (person) {
      setForm({
        name: person.name || '', slug: person.slug || '',
        biography: person.biography || '', birth_date: person.birth_date || '',
        death_date: person.death_date || '', birth_place: person.birth_place || '',
        profile_url: person.profile_url || '', role: person.role || 'actor',
        known_for_department: person.known_for_department || '',
      })
    }
  }, [person])

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (isEditing) return personApi.update(id!, data)
      return personApi.create(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-people'] })
      toast.success(isEditing ? 'Person updated' : 'Person created')
      navigate('/admin/people')
    },
    onError: (err: any) => toast.error(err.message),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({ ...form, slug: form.slug || generateSlug(form.name) })
  }

  return (
    <>
      <Helmet><title>{isEditing ? 'Edit Person' : 'New Person'} - ReelDB Admin</title></Helmet>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/people')} className="p-2 text-white/40 hover:text-white rounded-full hover:bg-white/10"><FiArrowLeft className="w-5 h-5" /></button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{isEditing ? 'Edit Person' : 'New Person'}</h1>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="glass-card p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input-field">
                <option value="actor">Actor</option>
                <option value="actress">Actress</option>
                <option value="director">Director</option>
                <option value="writer">Writer</option>
                <option value="producer">Producer</option>
                <option value="music_director">Music Director</option>
                <option value="cinematographer">Cinematographer</option>
                <option value="editor">Editor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Profile URL</label>
              <input type="url" value={form.profile_url} onChange={(e) => setForm({ ...form, profile_url: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Birth Date</label>
              <input type="date" value={form.birth_date} onChange={(e) => setForm({ ...form, birth_date: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Death Date</label>
              <input type="date" value={form.death_date} onChange={(e) => setForm({ ...form, death_date: e.target.value })} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Birth Place</label>
              <input type="text" value={form.birth_place} onChange={(e) => setForm({ ...form, birth_place: e.target.value })} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Biography</label>
              <textarea value={form.biography} onChange={(e) => setForm({ ...form, biography: e.target.value })} className="input-field min-h-[200px]" rows={8} />
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button type="submit" disabled={mutation.isPending} className="btn-primary flex items-center gap-2">
            <FiSave className="w-4 h-4" />
            {mutation.isPending ? 'Saving...' : isEditing ? 'Update Person' : 'Create Person'}
          </button>
        </div>
      </form>
    </>
  )
}
