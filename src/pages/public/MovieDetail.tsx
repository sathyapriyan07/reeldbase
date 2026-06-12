import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { movieApi, reviewApi, ratingApi, personApi } from '@/lib/api'
import { getImageUrl, formatDate, formatRuntime, getLanguageLabel, getRoleLabel } from '@/lib/utils'
import { FiStar, FiClock, FiCalendar, FiPlay, FiExternalLink } from 'react-icons/fi'
import ContentSection from '@/components/ui/ContentSection'
import MovieCard from '@/components/ui/MovieCard'

export default function MovieDetail() {
  const { slug } = useParams<{ slug: string }>()

  const { data: movie, isLoading } = useQuery({
    queryKey: ['movie', slug],
    queryFn: () => movieApi.getBySlug(slug || ''),
    enabled: !!slug,
  })

  const { data: reviews } = useQuery({
    queryKey: ['reviews', 'movie', movie?.id],
    queryFn: () => reviewApi.list({ movieId: movie?.id, status: 'published' }),
    enabled: !!movie?.id,
  })

  const { data: avgRating } = useQuery({
    queryKey: ['ratings', 'movie', movie?.id],
    queryFn: () => ratingApi.getAverage(movie?.id, undefined),
    enabled: !!movie?.id,
  })

  const { data: cast } = useQuery({
    queryKey: ['movie-cast', movie?.id],
    queryFn: async () => {
      const { supabase } = await import('@/lib/supabase')
      const { data: castData } = await supabase
        .from('movie_cast')
        .select('*, people(*)')
        .eq('movie_id', movie!.id)
        .order('order')
      return castData || []
    },
    enabled: !!movie?.id,
  })

  const { data: crew } = useQuery({
    queryKey: ['movie-crew', movie?.id],
    queryFn: async () => {
      const { supabase } = await import('@/lib/supabase')
      const { data: crewData } = await supabase
        .from('movie_crew')
        .select('*, people(*)')
        .eq('movie_id', movie!.id)
      return (crewData || []) as any[]
    },
    enabled: !!movie?.id,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-10 h-10 border-4 border-reel-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Movie not found</h1>
        <Link to="/" className="text-reel-400 hover:text-reel-300 mt-4 inline-block">Go home</Link>
      </div>
    )
  }

  const primaryReview = reviews?.find(r => r.featured) || reviews?.[0]

  return (
    <>
      <Helmet>
        <title>{movie.title} - ReelDB</title>
        <meta name="description" content={movie.overview || `${movie.title} movie details`} />
        <meta property="og:title" content={`${movie.title} - ReelDB`} />
        <meta property="og:description" content={movie.overview || ''} />
        {movie.poster_url && <meta property="og:image" content={getImageUrl(movie.poster_url, 'w500') || movie.poster_url} />}
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative aspect-video rounded-2xl overflow-hidden">
          {(movie.backdrop_url || movie.poster_url) ? (
            <>
              <img
                src={getImageUrl(movie.backdrop_url || movie.poster_url!, 'original') || movie.backdrop_url || movie.poster_url!}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-950/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="badge-primary">{getLanguageLabel(movie.language)}</span>
                  {movie.certification && (
                    <span className="badge-secondary">{movie.certification}</span>
                  )}
                </div>
                {movie.logo_url ? (
                  <img
                    src={getImageUrl(movie.logo_url, 'original') || movie.logo_url}
                    alt={movie.title}
                    className="h-8 sm:h-10 lg:h-14 object-contain mb-2"
                  />
                ) : (
                  <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold font-display mb-2">{movie.title}</h1>
                )}
                {!movie.logo_url && movie.original_title && movie.original_title !== movie.title && (
                  <p className="text-sm sm:text-base text-dark-300 mb-2">{movie.original_title}</p>
                )}
                {movie.tagline && (
                  <p className="text-sm sm:text-base text-reel-400 italic mb-3">&ldquo;{movie.tagline}&rdquo;</p>
                )}
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-dark-300">
                  {movie.release_date && (
                    <span className="flex items-center gap-1.5"><FiCalendar className="w-4 h-4" />{formatDate(movie.release_date)}</span>
                  )}
                  {movie.runtime && (
                    <span className="flex items-center gap-1.5"><FiClock className="w-4 h-4" />{formatRuntime(movie.runtime)}</span>
                  )}
                  {avgRating && avgRating.count > 0 && (
                    <span className="flex items-center gap-1.5 text-yellow-400">
                      <FiStar className="w-4 h-4 fill-yellow-400" />
                      {avgRating.average} ({avgRating.count} ratings)
                    </span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="w-full aspect-video bg-gradient-to-br from-dark-900 to-dark-800 rounded-2xl flex items-center justify-center">
              <span className="text-8xl font-bold text-dark-600 font-display">{movie.title[0]}</span>
            </div>
          )}
        </div>

        <div className="mt-6 sm:mt-8">
          {movie.trailer_url && (
            <a
              href={movie.trailer_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 btn-primary mb-6"
            >
              <FiPlay className="w-4 h-4" />
              Watch Trailer
            </a>
          )}

          {movie.overview && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-2">Overview</h3>
              <p className="text-dark-200 leading-relaxed">{movie.overview}</p>
            </div>
          )}
        </div>

        {primaryReview && (
          <section className="mt-12 glass rounded-xl p-6 md:p-8 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold font-display">Review</h2>
              <div className="flex items-center gap-2 bg-reel-600/20 px-3 py-1.5 rounded-lg">
                <FiStar className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-xl font-bold">{primaryReview.rating}/10</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4">{primaryReview.title}</h3>
            {primaryReview.introduction && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-2">Introduction</h4>
                <p className="text-dark-200 leading-relaxed">{primaryReview.introduction}</p>
              </div>
            )}
            {primaryReview.story && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-2">Story</h4>
                <p className="text-dark-200 leading-relaxed">{primaryReview.story}</p>
              </div>
            )}
            {primaryReview.performances && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-2">Performances</h4>
                <p className="text-dark-200 leading-relaxed">{primaryReview.performances}</p>
              </div>
            )}
            {primaryReview.technical_aspects && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-2">Technical Aspects</h4>
                <p className="text-dark-200 leading-relaxed">{primaryReview.technical_aspects}</p>
              </div>
            )}
            {primaryReview.pros && primaryReview.pros.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-2">Pros</h4>
                <ul className="list-disc list-inside space-y-1">
                  {primaryReview.pros.map((p: string, i: number) => <li key={i} className="text-dark-200 text-sm">{p}</li>)}
                </ul>
              </div>
            )}
            {primaryReview.cons && primaryReview.cons.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-2">Cons</h4>
                <ul className="list-disc list-inside space-y-1">
                  {primaryReview.cons.map((c: string, i: number) => <li key={i} className="text-dark-200 text-sm">{c}</li>)}
                </ul>
              </div>
            )}
            {primaryReview.verdict && (
              <div className="mt-6 p-4 bg-reel-600/10 rounded-lg border border-reel-600/20">
                <h4 className="text-sm font-semibold text-reel-400 uppercase tracking-wider mb-1">Verdict</h4>
                <p className="text-dark-200">{primaryReview.verdict}</p>
              </div>
            )}
          </section>
        )}

        {cast && cast.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold font-display mb-6">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {cast.map((c: any) => (
                <Link key={c.id} to={`/person/${c.people?.slug}`} className="card group text-center">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {c.people?.profile_url ? (
                      <img src={getImageUrl(c.people.profile_url, 'w185') || c.people.profile_url} alt={c.people.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-dark-800 flex items-center justify-center">
                        <span className="text-2xl font-bold text-dark-600">{c.people?.name?.[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-sm font-medium line-clamp-1">{c.people?.name}</p>
                    {c.character && <p className="text-xs text-dark-400 line-clamp-1">{c.character}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {crew && crew.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold font-display mb-6">Crew</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(() => {
                const grouped = crew.reduce((acc: Record<string, any[]>, c: any) => {
                  const dept = c.department || 'Other'
                  if (!acc[dept]) acc[dept] = []
                  acc[dept].push(c)
                  return acc
                }, {})
                return Object.entries(grouped).map(([department, members]) => (
                  <div key={department} className="glass rounded-xl border border-white/5 p-4">
                    <h3 className="text-sm font-semibold text-reel-400 uppercase tracking-wider mb-3">{department}</h3>
                    <div className="space-y-2">
                      {members.map((c: any) => (
                        <Link key={c.id} to={`/person/${c.people?.slug}`} className="flex items-center gap-3 group">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-dark-800 flex-shrink-0">
                            {c.people?.profile_url ? (
                              <img src={getImageUrl(c.people.profile_url, 'w185') || c.people.profile_url} alt={c.people.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-sm font-bold text-dark-600">{c.people?.name?.[0]}</span>
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium group-hover:text-reel-400 transition-colors line-clamp-1">{c.people?.name}</p>
                            {c.job && <p className="text-xs text-dark-400 line-clamp-1">{c.job}</p>}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))
              })()}
            </div>
          </section>
        )}

        <ContentSection title="Similar Movies"></ContentSection>

        <div className="h-12" />
      </div>
    </>
  )
}
