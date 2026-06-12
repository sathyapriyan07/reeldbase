import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { movieApi, reviewApi, ratingApi } from '@/lib/api'
import { getImageUrl, formatDate, formatRuntime, getLanguageLabel } from '@/lib/utils'
import { FiStar, FiClock, FiCalendar, FiPlay } from 'react-icons/fi'

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
        <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="badge-primary">{getLanguageLabel(movie.language)}</span>
                  {movie.certification && (
                    <span className="badge-secondary">{movie.certification}</span>
                  )}
                </div>
                {movie.show_logo && movie.logo_url ? (
                  <img
                    src={getImageUrl(movie.logo_url, 'original') || movie.logo_url}
                    alt={movie.title}
                    className="h-8 sm:h-10 lg:h-14 object-contain mb-2"
                  />
                ) : (
                  <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight mb-2">{movie.title}</h1>
                )}
                {(!movie.show_logo || !movie.logo_url) && movie.original_title && movie.original_title !== movie.title && (
                  <p className="text-sm sm:text-base text-white/50 mb-2">{movie.original_title}</p>
                )}
                {movie.tagline && (
                  <p className="text-sm sm:text-base text-reel-400 italic mb-3">&ldquo;{movie.tagline}&rdquo;</p>
                )}
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/60">
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
            <div className="w-full aspect-video bg-gradient-to-br from-apple-900 to-black rounded-2xl flex items-center justify-center">
              <span className="text-8xl font-bold text-white/10">{movie.title[0]}</span>
            </div>
          )}
        </div>

        <div className="mt-6 sm:mt-8 max-w-3xl">
          {movie.trailer_url && (
            <a
              href={movie.trailer_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 btn-primary mb-6 text-sm"
            >
              <FiPlay className="w-4 h-4" />
              Watch Trailer
            </a>
          )}

          {movie.overview && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Overview</h3>
              <p className="text-white/80 leading-relaxed text-sm sm:text-base">{movie.overview}</p>
            </div>
          )}
        </div>

        {primaryReview && (
          <section className="mt-10 glass-card p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Review</h2>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                <FiStar className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-lg font-bold">{primaryReview.rating}/10</span>
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-4">{primaryReview.title}</h3>
            {primaryReview.introduction && (
              <div className="mb-5">
                <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Introduction</h4>
                <p className="text-white/70 leading-relaxed text-sm">{primaryReview.introduction}</p>
              </div>
            )}
            {primaryReview.story && (
              <div className="mb-5">
                <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Story</h4>
                <p className="text-white/70 leading-relaxed text-sm">{primaryReview.story}</p>
              </div>
            )}
            {primaryReview.performances && (
              <div className="mb-5">
                <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Performances</h4>
                <p className="text-white/70 leading-relaxed text-sm">{primaryReview.performances}</p>
              </div>
            )}
            {primaryReview.technical_aspects && (
              <div className="mb-5">
                <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Technical Aspects</h4>
                <p className="text-white/70 leading-relaxed text-sm">{primaryReview.technical_aspects}</p>
              </div>
            )}
            {primaryReview.pros && primaryReview.pros.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Pros</h4>
                <ul className="list-disc list-inside space-y-1">
                  {primaryReview.pros.map((p: string, i: number) => <li key={i} className="text-white/60 text-sm">{p}</li>)}
                </ul>
              </div>
            )}
            {primaryReview.cons && primaryReview.cons.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Cons</h4>
                <ul className="list-disc list-inside space-y-1">
                  {primaryReview.cons.map((c: string, i: number) => <li key={i} className="text-white/60 text-sm">{c}</li>)}
                </ul>
              </div>
            )}
            {primaryReview.verdict && (
              <div className="mt-5 p-4 bg-reel-500/10 rounded-2xl border border-reel-500/20">
                <h4 className="text-xs font-semibold text-reel-400 uppercase tracking-wider mb-1">Verdict</h4>
                <p className="text-white/70 text-sm">{primaryReview.verdict}</p>
              </div>
            )}
          </section>
        )}

        {cast && cast.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">Cast</h2>
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none -mx-4 px-4 snap-x snap-mandatory">
              {cast.map((c: any) => (
                <Link key={c.id} to={`/person/${c.people?.slug}`} className="card group text-center shrink-0 w-28 sm:w-auto snap-start">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {c.people?.profile_url ? (
                      <img src={getImageUrl(c.people.profile_url, 'w185') || c.people.profile_url} alt={c.people.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-apple-900 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white/20">{c.people?.name?.[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="text-sm font-medium line-clamp-1">{c.people?.name}</p>
                    {c.character && <p className="text-xs text-white/40 line-clamp-1">{c.character}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {crew && crew.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">Crew</h2>
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none -mx-4 px-4 snap-x snap-mandatory">
              {crew.map((c: any) => (
                <Link key={c.id} to={`/person/${c.people?.slug}`} className="card group text-center shrink-0 w-28 sm:w-auto snap-start">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {c.people?.profile_url ? (
                      <img src={getImageUrl(c.people.profile_url, 'w185') || c.people.profile_url} alt={c.people.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-apple-900 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white/20">{c.people?.name?.[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="text-sm font-medium line-clamp-1">{c.people?.name}</p>
                    {c.job && <p className="text-xs text-white/40 line-clamp-1">{c.job}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="h-12" />
      </div>
    </>
  )
}
