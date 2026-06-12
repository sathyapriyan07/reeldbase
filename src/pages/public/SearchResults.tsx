import { useSearchParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { searchApi } from '@/lib/api'
import { getImageUrl, getRoleLabel } from '@/lib/utils'
import { FiSearch } from 'react-icons/fi'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchApi.global(query),
    enabled: query.length > 0,
  })

  return (
    <>
      <Helmet>
        <title>{query ? `Search: ${query} - ReelDB` : 'Search - ReelDB'}</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          Search Results for &ldquo;{query}&rdquo;
        </h1>
        <p className="text-white/40 mb-8">
          {data
            ? `${data.movies.length + data.series.length + data.people.length} results found`
            : 'Type to search...'}
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="space-y-10">
            {data?.movies && data.movies.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4">Movies</h2>
                <div className="grid gap-2">
                  {data.movies.map((m: any) => (
                    <Link key={m.id} to={`/movie/${m.slug}`} className="flex items-center gap-4 p-3 rounded-2xl bg-apple-900/30 hover:bg-apple-900/60 transition-all border border-white/[0.04]">
                      {m.poster_url ? (
                        <img src={getImageUrl(m.poster_url, 'w92') || m.poster_url} alt={m.title} className="w-11 h-15 object-cover rounded-xl" />
                      ) : (
                        <div className="w-11 h-15 bg-apple-900 rounded-xl flex items-center justify-center"><span className="text-lg font-bold text-white/20">{m.title[0]}</span></div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{m.title}</p>
                        {m.release_date && <p className="text-xs text-white/40">{new Date(m.release_date).getFullYear()}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {data?.series && data.series.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4">Series</h2>
                <div className="grid gap-2">
                  {data.series.map((s: any) => (
                    <Link key={s.id} to={`/series/${s.slug}`} className="flex items-center gap-4 p-3 rounded-2xl bg-apple-900/30 hover:bg-apple-900/60 transition-all border border-white/[0.04]">
                      {s.poster_url ? (
                        <img src={getImageUrl(s.poster_url, 'w92') || s.poster_url} alt={s.title} className="w-11 h-15 object-cover rounded-xl" />
                      ) : (
                        <div className="w-11 h-15 bg-apple-900 rounded-xl flex items-center justify-center"><span className="text-lg font-bold text-white/20">{s.title[0]}</span></div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{s.title}</p>
                        {s.first_air_date && <p className="text-xs text-white/40">{new Date(s.first_air_date).getFullYear()}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {data?.people && data.people.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4">People</h2>
                <div className="grid gap-2">
                  {data.people.map((p: any) => (
                    <Link key={p.id} to={`/person/${p.slug}`} className="flex items-center gap-4 p-3 rounded-2xl bg-apple-900/30 hover:bg-apple-900/60 transition-all border border-white/[0.04]">
                      {p.profile_url ? (
                        <img src={getImageUrl(p.profile_url, 'w92') || p.profile_url} alt={p.name} className="w-11 h-15 object-cover rounded-xl" />
                      ) : (
                        <div className="w-11 h-15 bg-apple-900 rounded-xl flex items-center justify-center"><span className="text-lg font-bold text-white/20">{p.name[0]}</span></div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{p.name}</p>
                        <p className="text-xs text-white/40">{getRoleLabel(p.role)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {data && !data.movies.length && !data.series.length && !data.people.length && (
              <div className="text-center py-20">
                <FiSearch className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/40">No results found for &ldquo;{query}&rdquo;</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
