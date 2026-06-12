import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { tagApi } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { slugify } from '@/lib/utils'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AdminTags() {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')

  const { data } = useQuery({ queryKey: ['tags'], queryFn: tagApi.list })

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('tags').insert({ name, slug: slugify(name) })
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tags'] }); setName(''); toast.success('Tag created') },
    onError: (err: any) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tags').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tags'] }); toast.success('Deleted') },
    onError: () => toast.error('Failed to delete'),
  })

  return (
    <>
      <Helmet><title>Tags - ReelDB Admin</title></Helmet>
      <h1 className="text-2xl font-bold font-display mb-6">Tags</h1>
      <div className="flex gap-2 mb-6">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="New tag..." className="input-field max-w-xs" />
        <button onClick={() => name && createMutation.mutate()} className="btn-primary flex items-center gap-2 text-sm"><FiPlus className="w-4 h-4" /> Add</button>
      </div>
      <div className="glass rounded-xl border border-white/5 overflow-hidden max-w-xl">
        <div className="flex flex-wrap gap-2 p-4">
          {data?.map((tag) => (
            <div key={tag.id} className="flex items-center gap-2 bg-dark-800 rounded-lg px-3 py-1.5">
              <span className="text-sm">{tag.name}</span>
              <button onClick={() => deleteMutation.mutate(tag.id)} className="text-dark-400 hover:text-red-400"><FiTrash2 className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
