import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { personApi } from '@/lib/api'
import { getImageUrl, formatDate, getRoleLabel } from '@/lib/utils'
import { FiCalendar, FiMapPin } from 'react-icons/fi'

export default function PersonDetail() {
  const { slug } = useParams<{ slug: string }>()

  const { data: person, isLoading } = useQuery({
    queryKey: ['person', slug],
    queryFn: () => personApi.getBySlug(slug || ''),
    enabled: !!slug,
  })

  const { data: filmography } = useQuery({
    queryKey: ['filmography', person?.id],
    queryFn: () => personApi.getFilmography(person!.id),
    enabled: !!person?.id,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!person) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Person not found</h1>
        <Link to="/" className="text-reel-400 hover:text-reel-300 mt-4 inline-block">Go home</Link>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{person.name} - ReelDB</title>
        <meta name="description" content={person.biography?.slice(0, 200) || `${person.name} profile`} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="w-full md:w-72 flex-shrink-0">
            {person.profile_url ? (
              <img src={getImageUrl(person.profile_url, 'w500') || person.profile_url} alt={person.name} className="w-full rounded-2xl shadow-2xl" />
            ) : (
              <div className="w-full aspect-[3/4] bg-gradient-to-br from-apple-900 to-black rounded-2xl flex items-center justify-center">
                <span className="text-6xl font-bold text-white/10">{person.name[0]}</span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="mb-3">
              <span className="badge-primary">{getRoleLabel(person.role)}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">{person.name}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-white/60 mb-6">
              {person.birth_date && (
                <span className="flex items-center gap-1.5"><FiCalendar className="w-4 h-4" />Born: {formatDate(person.birth_date)}</span>
              )}
              {person.birth_place && (
                <span className="flex items-center gap-1.5"><FiMapPin className="w-4 h-4" />{person.birth_place}</span>
              )}
              {person.death_date && (
                <span className="flex items-center gap-1.5 text-red-400">Died: {formatDate(person.death_date)}</span>
              )}
            </div>

            {person.biography && (
              <div className="mb-8">
                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Biography</h3>
                <p className="text-white/70 leading-relaxed whitespace-pre-line text-sm sm:text-base">{person.biography}</p>
              </div>
            )}

            {person.also_known_as && person.also_known_as.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Also Known As</h3>
                <div className="flex flex-wrap gap-2">
                  {person.also_known_as.map((name, i) => (
                    <span key={i} className="badge-secondary">{name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {filmography && (
          <section className="mt-12">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">Filmography</h2>

            {filmography.movieCast.length > 0 && (
              <div className="mb-8">
                <h3 className="text-base font-semibold mb-4">Acting (Movies)</h3>
                <div className="grid gap-2">
                  {filmography.movieCast.map((c: any) => (
                    <Link key={c.id} to={`/movie/${c.movies?.slug}`} className="flex items-center gap-4 p-3 rounded-2xl bg-apple-900/30 hover:bg-apple-900/60 transition-all border border-white/[0.04]">
                      {c.movies?.poster_url ? (
                        <img src={getImageUrl(c.movies.poster_url, 'w92') || c.movies.poster_url} alt={c.movies.title} className="w-10 h-13 object-cover rounded-xl" />
                      ) : (
                        <div className="w-10 h-13 bg-apple-800 rounded-xl flex items-center justify-center"><span className="font-bold text-white/20">{c.movies?.title?.[0]}</span></div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{c.movies?.title}</p>
                        {c.character && <p className="text-xs text-white/40">as {c.character}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {filmography.movieCrew.length > 0 && (
              <div className="mb-8">
                <h3 className="text-base font-semibold mb-4">Crew (Movies)</h3>
                <div className="grid gap-2">
                  {filmography.movieCrew.map((c: any) => (
                    <Link key={c.id} to={`/movie/${c.movies?.slug}`} className="flex items-center gap-4 p-3 rounded-2xl bg-apple-900/30 hover:bg-apple-900/60 transition-all border border-white/[0.04]">
                      {c.movies?.poster_url ? (
                        <img src={getImageUrl(c.movies.poster_url, 'w92') || c.movies.poster_url} alt={c.movies.title} className="w-10 h-13 object-cover rounded-xl" />
                      ) : (
                        <div className="w-10 h-13 bg-apple-800 rounded-xl flex items-center justify-center"><span className="font-bold text-white/20">{c.movies?.title?.[0]}</span></div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{c.movies?.title}</p>
                        <p className="text-xs text-white/40">{c.job} &middot; {c.department}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {filmography.seriesCast.length > 0 && (
              <div className="mb-8">
                <h3 className="text-base font-semibold mb-4">Acting (Series)</h3>
                <div className="grid gap-2">
                  {filmography.seriesCast.map((c: any) => (
                    <Link key={c.id} to={`/series/${c.series?.slug}`} className="flex items-center gap-4 p-3 rounded-2xl bg-apple-900/30 hover:bg-apple-900/60 transition-all border border-white/[0.04]">
                      {c.series?.poster_url ? (
                        <img src={getImageUrl(c.series.poster_url, 'w92') || c.series.poster_url} alt={c.series.title} className="w-10 h-13 object-cover rounded-xl" />
                      ) : (
                        <div className="w-10 h-13 bg-apple-800 rounded-xl flex items-center justify-center"><span className="font-bold text-white/20">{c.series?.title?.[0]}</span></div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{c.series?.title}</p>
                        {c.character && <p className="text-xs text-white/40">as {c.character}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {filmography.seriesCrew.length > 0 && (
              <div className="mb-8">
                <h3 className="text-base font-semibold mb-4">Crew (Series)</h3>
                <div className="grid gap-2">
                  {filmography.seriesCrew.map((c: any) => (
                    <Link key={c.id} to={`/series/${c.series?.slug}`} className="flex items-center gap-4 p-3 rounded-2xl bg-apple-900/30 hover:bg-apple-900/60 transition-all border border-white/[0.04]">
                      {c.series?.poster_url ? (
                        <img src={getImageUrl(c.series.poster_url, 'w92') || c.series.poster_url} alt={c.series.title} className="w-10 h-13 object-cover rounded-xl" />
                      ) : (
                        <div className="w-10 h-13 bg-apple-800 rounded-xl flex items-center justify-center"><span className="font-bold text-white/20">{c.series?.title?.[0]}</span></div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{c.series?.title}</p>
                        <p className="text-xs text-white/40">{c.job} &middot; {c.department}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        <div className="h-12" />
      </div>
    </>
  )
}
