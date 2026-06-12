import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { personApi } from '@/lib/api'
import { getImageUrl, formatDate, getRoleLabel } from '@/lib/utils'
import { FiCalendar, FiMapPin, FiExternalLink } from 'react-icons/fi'

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
        <div className="animate-spin w-10 h-10 border-4 border-reel-600 border-t-transparent rounded-full" />
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-72 flex-shrink-0">
            {person.profile_url ? (
              <img src={getImageUrl(person.profile_url, 'w500') || person.profile_url} alt={person.name} className="w-full rounded-xl shadow-2xl" />
            ) : (
              <div className="w-full aspect-[3/4] bg-gradient-to-br from-dark-800 to-dark-700 rounded-xl flex items-center justify-center">
                <span className="text-6xl font-bold text-dark-600 font-display">{person.name[0]}</span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="mb-2">
              <span className="badge-primary">{getRoleLabel(person.role)}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-4">{person.name}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-dark-300 mb-6">
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
                <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-2">Biography</h3>
                <p className="text-dark-200 leading-relaxed whitespace-pre-line">{person.biography}</p>
              </div>
            )}

            {person.also_known_as && person.also_known_as.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-2">Also Known As</h3>
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
            <h2 className="text-2xl font-bold font-display mb-6">Filmography</h2>

            {filmography.movieCast.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Acting (Movies)</h3>
                <div className="grid gap-3">
                  {filmography.movieCast.map((c: any) => (
                    <Link key={c.id} to={`/movie/${c.movies?.slug}`} className="flex items-center gap-4 p-3 rounded-lg glass glass-hover">
                      {c.movies?.poster_url ? (
                        <img src={getImageUrl(c.movies.poster_url, 'w92') || c.movies.poster_url} alt={c.movies.title} className="w-10 h-14 object-cover rounded" />
                      ) : (
                        <div className="w-10 h-14 bg-dark-800 rounded flex items-center justify-center"><span className="font-bold text-dark-600">{c.movies?.title?.[0]}</span></div>
                      )}
                      <div>
                        <p className="font-medium">{c.movies?.title}</p>
                        {c.character && <p className="text-sm text-dark-400">as {c.character}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {filmography.movieCrew.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Crew (Movies)</h3>
                <div className="grid gap-3">
                  {filmography.movieCrew.map((c: any) => (
                    <Link key={c.id} to={`/movie/${c.movies?.slug}`} className="flex items-center gap-4 p-3 rounded-lg glass glass-hover">
                      {c.movies?.poster_url ? (
                        <img src={getImageUrl(c.movies.poster_url, 'w92') || c.movies.poster_url} alt={c.movies.title} className="w-10 h-14 object-cover rounded" />
                      ) : (
                        <div className="w-10 h-14 bg-dark-800 rounded flex items-center justify-center"><span className="font-bold text-dark-600">{c.movies?.title?.[0]}</span></div>
                      )}
                      <div>
                        <p className="font-medium">{c.movies?.title}</p>
                        <p className="text-sm text-dark-400">{c.job} &middot; {c.department}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {filmography.seriesCast.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Acting (Series)</h3>
                <div className="grid gap-3">
                  {filmography.seriesCast.map((c: any) => (
                    <Link key={c.id} to={`/series/${c.series?.slug}`} className="flex items-center gap-4 p-3 rounded-lg glass glass-hover">
                      {c.series?.poster_url ? (
                        <img src={getImageUrl(c.series.poster_url, 'w92') || c.series.poster_url} alt={c.series.title} className="w-10 h-14 object-cover rounded" />
                      ) : (
                        <div className="w-10 h-14 bg-dark-800 rounded flex items-center justify-center"><span className="font-bold text-dark-600">{c.series?.title?.[0]}</span></div>
                      )}
                      <div>
                        <p className="font-medium">{c.series?.title}</p>
                        {c.character && <p className="text-sm text-dark-400">as {c.character}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {filmography.seriesCrew.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Crew (Series)</h3>
                <div className="grid gap-3">
                  {filmography.seriesCrew.map((c: any) => (
                    <Link key={c.id} to={`/series/${c.series?.slug}`} className="flex items-center gap-4 p-3 rounded-lg glass glass-hover">
                      {c.series?.poster_url ? (
                        <img src={getImageUrl(c.series.poster_url, 'w92') || c.series.poster_url} alt={c.series.title} className="w-10 h-14 object-cover rounded" />
                      ) : (
                        <div className="w-10 h-14 bg-dark-800 rounded flex items-center justify-center"><span className="font-bold text-dark-600">{c.series?.title?.[0]}</span></div>
                      )}
                      <div>
                        <p className="font-medium">{c.series?.title}</p>
                        <p className="text-sm text-dark-400">{c.job} &middot; {c.department}</p>
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
