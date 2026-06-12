import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { personApi } from '@/lib/api'
import { getImageUrl, getRoleLabel } from '@/lib/utils'
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AdminPeople() {
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-people', search],
    queryFn: () => personApi.list({ search, limit: 100 }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => personApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-people'] })
      toast.success('Person deleted')
    },
    onError: () => toast.error('Failed to delete'),
  })

  return (
    <>
      <Helmet><title>People - ReelDB Admin</title></Helmet>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display">People</h1>
          <p className="text-dark-400 text-sm mt-1">{data?.count || 0} people</p>
        </div>
        <Link to="/admin/people/new" className="btn-primary flex items-center gap-2 text-sm">
          <FiPlus className="w-4 h-4" /> Add Person
        </Link>
      </div>
      <div className="relative mb-6">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search people..." className="input-field pl-10" />
      </div>
      {isLoading ? (
        <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-reel-600 border-t-transparent rounded-full" /></div>
      ) : (
        <div className="glass rounded-xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-left text-sm text-dark-400">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Birth Date</th>
                  <th className="p-4 font-medium w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((person) => (
                  <tr key={person.id} className="border-b border-white/5 hover:bg-dark-800/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {person.profile_url ? (
                          <img src={getImageUrl(person.profile_url, 'w92') || person.profile_url} alt={person.name} className="w-10 h-14 object-cover rounded" />
                        ) : (
                          <div className="w-10 h-14 bg-dark-800 rounded flex items-center justify-center"><span className="font-bold text-dark-600">{person.name[0]}</span></div>
                        )}
                        <p className="font-medium text-sm">{person.name}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{getRoleLabel(person.role)}</td>
                    <td className="p-4 text-sm text-dark-400">{person.birth_date || '—'}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/people/${person.id}/edit`} className="p-2 text-dark-400 hover:text-white"><FiEdit2 className="w-4 h-4" /></Link>
                        <button onClick={() => { if (confirm('Delete this person?')) deleteMutation.mutate(person.id) }} className="p-2 text-dark-400 hover:text-red-400"><FiTrash2 className="w-4 h-4" /></button>
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
