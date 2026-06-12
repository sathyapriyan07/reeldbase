import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { supabase } from '@/lib/supabase'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AdminLanguages() {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [code, setCode] = useState('')

  const { data } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      const { data } = await supabase.from('languages').select('*').order('name')
      return data || []
    },
  })

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('languages').insert({ name, code })
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['languages'] }); setName(''); setCode(''); toast.success('Language added') },
    onError: (err: any) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('languages').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['languages'] }); toast.success('Deleted') },
    onError: () => toast.error('Failed to delete'),
  })

  return (
    <>
      <Helmet><title>Languages - ReelDB Admin</title></Helmet>
      <h1 className="text-2xl font-bold tracking-tight mb-6">Languages</h1>
      <div className="flex gap-2 mb-6">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Language name..." className="input-field max-w-xs" />
        <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code (e.g. ta)" className="input-field max-w-[100px]" />
        <button onClick={() => name && code && createMutation.mutate()} className="btn-primary flex items-center gap-2 text-sm"><FiPlus className="w-4 h-4" /> Add</button>
      </div>
      <div className="glass-card overflow-hidden max-w-xl">
        {data?.map((lang: any) => (
          <div key={lang.id} className="flex items-center justify-between p-4 border-b border-white/[0.06] last:border-none">
            <div>
              <span className="font-medium">{lang.name}</span>
              <span className="text-sm text-white/40 ml-2">({lang.code})</span>
            </div>
            <button onClick={() => deleteMutation.mutate(lang.id)} className="p-2 text-white/40 hover:text-red-400 rounded-full hover:bg-white/10"><FiTrash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </>
  )
}
