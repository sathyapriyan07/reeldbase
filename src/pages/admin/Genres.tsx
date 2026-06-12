import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { genreApi } from '@/lib/api'
import { slugify } from '@/lib/utils'
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AdminGenres() {
  const queryClient = useQueryClient()
  const [newName, setNewName] = useState('')
  const [editing, setEditing] = useState<{ id: string; name: string } | null>(null)

  const { data } = useQuery({ queryKey: ['genres'], queryFn: genreApi.list })

  const createMutation = useMutation({
    mutationFn: (name: string) => genreApi.create({ name, slug: slugify(name) }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['genres'] }); setNewName(''); toast.success('Genre created') },
    onError: (err: any) => toast.error(err.message),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => genreApi.update(id, { name, slug: slugify(name) }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['genres'] }); setEditing(null); toast.success('Genre updated') },
    onError: (err: any) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => genreApi.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['genres'] }); toast.success('Genre deleted') },
    onError: () => toast.error('Failed to delete'),
  })

  return (
    <>
      <Helmet><title>Genres - ReelDB Admin</title></Helmet>
      <h1 className="text-2xl font-bold font-display mb-6">Genres</h1>

      <div className="flex gap-2 mb-6">
        <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New genre name..." className="input-field max-w-xs" />
        <button onClick={() => newName && createMutation.mutate(newName)} className="btn-primary flex items-center gap-2 text-sm"><FiPlus className="w-4 h-4" /> Add</button>
      </div>

      <div className="glass rounded-xl border border-white/5 overflow-hidden max-w-xl">
        {data?.map((genre) => (
          <div key={genre.id} className="flex items-center justify-between p-4 border-b border-white/5 last:border-none">
            {editing?.id === genre.id ? (
              <div className="flex items-center gap-2 flex-1">
                <input type="text" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="input-field flex-1" autoFocus />
                <button onClick={() => updateMutation.mutate({ id: genre.id, name: editing.name })} className="p-2 text-green-400 hover:text-green-300"><FiSave className="w-4 h-4" /></button>
                <button onClick={() => setEditing(null)} className="p-2 text-dark-400 hover:text-white"><FiX className="w-4 h-4" /></button>
              </div>
            ) : (
              <>
                <span className="font-medium">{genre.name}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setEditing({ id: genre.id, name: genre.name })} className="p-2 text-dark-400 hover:text-white"><FiEdit2 className="w-4 h-4" /></button>
                  <button onClick={() => { if (confirm('Delete this genre?')) deleteMutation.mutate(genre.id) }} className="p-2 text-dark-400 hover:text-red-400"><FiTrash2 className="w-4 h-4" /></button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
