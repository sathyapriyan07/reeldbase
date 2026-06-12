import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { companyApi } from '@/lib/api'
import { slugify } from '@/lib/utils'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AdminCompanies() {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [type, setType] = useState<'production' | 'distribution' | 'studio'>('production')

  const { data } = useQuery({ queryKey: ['companies'], queryFn: companyApi.list })

  const createMutation = useMutation({
    mutationFn: () => companyApi.create({ name, slug: slugify(name), type }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['companies'] }); setName(''); toast.success('Company added') },
    onError: (err: any) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => companyApi.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['companies'] }); toast.success('Deleted') },
    onError: () => toast.error('Failed to delete'),
  })

  return (
    <>
      <Helmet><title>Companies - ReelDB Admin</title></Helmet>
      <h1 className="text-2xl font-bold font-display mb-6">Companies</h1>
      <div className="flex gap-2 mb-6">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Company name..." className="input-field max-w-xs" />
        <select value={type} onChange={(e) => setType(e.target.value as any)} className="input-field max-w-[150px]">
          <option value="production">Production</option>
          <option value="distribution">Distribution</option>
          <option value="studio">Studio</option>
        </select>
        <button onClick={() => name && createMutation.mutate()} className="btn-primary flex items-center gap-2 text-sm"><FiPlus className="w-4 h-4" /> Add</button>
      </div>
      <div className="glass rounded-xl border border-white/5 overflow-hidden max-w-xl">
        {data?.map((company) => (
          <div key={company.id} className="flex items-center justify-between p-4 border-b border-white/5 last:border-none">
            <div>
              <span className="font-medium">{company.name}</span>
              <span className="badge-secondary ml-2 text-xs capitalize">{company.type}</span>
            </div>
            <button onClick={() => deleteMutation.mutate(company.id)} className="p-2 text-dark-400 hover:text-red-400"><FiTrash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </>
  )
}
