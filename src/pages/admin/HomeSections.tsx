import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { homeApi } from '@/lib/api'
import { FiPlus, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi'
import toast from 'react-hot-toast'

const sectionTypes = [
  { value: 'hero', label: 'Hero Carousel' },
  { value: 'trending_movies', label: 'Trending Movies' },
  { value: 'trending_series', label: 'Trending Series' },
  { value: 'latest_releases', label: 'Latest Releases' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'recently_added', label: 'Recently Added' },
  { value: 'featured_personalities', label: 'Featured Personalities' },
  { value: 'editors_picks', label: "Editor's Picks" },
  { value: 'top_rated_movies', label: 'Top Rated Movies' },
  { value: 'top_rated_series', label: 'Top Rated Series' },
  { value: 'tamil_section', label: 'Tamil Section' },
  { value: 'malayalam_section', label: 'Malayalam Section' },
  { value: 'custom', label: 'Custom' },
] as const

export default function AdminHomeSections() {
  const queryClient = useQueryClient()

  const { data: sections } = useQuery({
    queryKey: ['admin-home-sections'],
    queryFn: homeApi.getSections,
  })

  const createMutation = useMutation({
    mutationFn: () => homeApi.createSection({
      title: 'New Section',
      type: 'custom',
      items: [],
      item_type: 'movie',
      order: (sections?.length || 0) + 1,
      active: true,
    }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-home-sections'] }); toast.success('Section created') },
    onError: (err: any) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => homeApi.deleteSection(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-home-sections'] }); toast.success('Section deleted') },
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => homeApi.updateSection(id, { active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-home-sections'] }),
  })

  return (
    <>
      <Helmet><title>Home Sections - ReelDB Admin</title></Helmet>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Home Sections</h1>
          <p className="text-dark-400 text-sm mt-1">Manage homepage layout and ordering</p>
        </div>
        <button onClick={() => createMutation.mutate()} className="btn-primary flex items-center gap-2 text-sm">
          <FiPlus className="w-4 h-4" /> Add Section
        </button>
      </div>

      <div className="space-y-3">
        {sections?.map((section, index) => (
          <div key={section.id} className="glass rounded-xl border border-white/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-dark-400 text-sm font-mono">#{index + 1}</div>
                <div>
                  <h3 className="font-medium">{section.title}</h3>
                  <p className="text-xs text-dark-400">{sectionTypes.find(t => t.value === section.type)?.label || section.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={section.active} onChange={(e) => toggleMutation.mutate({ id: section.id, active: e.target.checked })} className="w-4 h-4" />
                  Active
                </label>
                <button onClick={() => { if (confirm('Delete this section?')) deleteMutation.mutate(section.id) }} className="p-2 text-dark-400 hover:text-red-400"><FiTrash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
