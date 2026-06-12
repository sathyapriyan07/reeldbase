import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { seriesApi } from '@/lib/api'
import { getImageUrl, getLanguageLabel, formatDate } from '@/lib/utils'
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AdminSeries() {
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-series', search],
    queryFn: () => seriesApi.list({ search, limit: 100 }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => seriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-series'] })
      toast.success('Series deleted')
    },
    onError: () => toast.error('Failed to delete'),
  })

  return (
    <>
      <Helmet><title>Series - ReelDB Admin</title></Helmet>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Series</h1>
          <p className="text-dark-400 text-sm mt-1">{data?.count || 0} series</p>
        </div>
        <Link to="/admin/series/new" className="btn-primary flex items-center gap-2 text-sm">
          <FiPlus className="w-4 h-4" /> Add Series
        </Link>
      </div>
      <div className="relative mb-6">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search series..." className="input-field pl-10" />
      </div>
      {isLoading ? (
        <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-reel-600 border-t-transparent rounded-full" /></div>
      ) : (
        <div className="glass rounded-xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-left text-sm text-dark-400">
                  <th className="p-4 font-medium">Title</th>
                  <th className="p-4 font-medium">Language</th>
                  <th className="p-4 font-medium">First Air</th>
                  <th className="p-4 font-medium">Views</th>
                  <th className="p-4 font-medium w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((s) => (
                  <tr key={s.id} className="border-b border-white/5 hover:bg-dark-800/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {s.poster_url ? (
                          <img src={getImageUrl(s.poster_url, 'w92') || s.poster_url} alt={s.title} className="w-10 h-14 object-cover rounded" />
                        ) : (
                          <div className="w-10 h-14 bg-dark-800 rounded flex items-center justify-center"><span className="font-bold text-dark-600">{s.title[0]}</span></div>
                        )}
                        <p className="font-medium text-sm">{s.title}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{getLanguageLabel(s.language)}</td>
                    <td className="p-4 text-sm text-dark-400">{s.first_air_date ? formatDate(s.first_air_date) : '—'}</td>
                    <td className="p-4 text-sm text-dark-400">{s.views}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/series/${s.id}/edit`} className="p-2 text-dark-400 hover:text-white"><FiEdit2 className="w-4 h-4" /></Link>
                        <button onClick={() => { if (confirm('Delete this series?')) deleteMutation.mutate(s.id) }} className="p-2 text-dark-400 hover:text-red-400"><FiTrash2 className="w-4 h-4" /></button>
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
