import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { seriesApi, reviewApi } from '@/lib/api'
import { getImageUrl, formatDate, getLanguageLabel } from '@/lib/utils'
import { FiCalendar, FiPlay } from 'react-icons/fi'
import { useState } from 'react'

export default function SeriesDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [expandedSeason, setExpandedSeason] = useState<string | null>(null)

  const { data: series, isLoading } = useQuery({
    queryKey: ['series', slug],
    queryFn: () => seriesApi.getBySlug(slug || ''),
    enabled: !!slug,
  })

  const { data: seasons } = useQuery({
    queryKey: ['seasons', series?.id],
    queryFn: () => seriesApi.getSeasons(series!.id),
    enabled: !!series?.id,
  })

  const { data: reviews } = useQuery({
    queryKey: ['reviews', 'series', series?.id],
    queryFn: () => reviewApi.list({ seriesId: series?.id, status: 'published' }),
    enabled: !!series?.id,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!series) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Series not found</h1>
        <Link to="/" className="text-reel-400 hover:text-reel-300 mt-4 inline-block">Go home</Link>
      </div>
    )
  }

  const primaryReview = reviews?.find(r => r.featured) || reviews?.[0]

  return (
    <>
      <Helmet>
        <title>{series.title} - ReelDB</title>
        <meta name="description" content={series.synopsis || `${series.title} series details`} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative aspect-video rounded-2xl overflow-hidden">
          {(series.backdrop_url || series.poster_url) ? (
            <>
              <img
                src={getImageUrl(series.backdrop_url || series.poster_url!, 'original') || series.backdrop_url || series.poster_url!}
                alt={series.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="badge-primary">{getLanguageLabel(series.language)}</span>
                  <span className="badge-secondary">Series</span>
                </div>
                {series.show_logo && series.logo_url ? (
                  <img
                    src={getImageUrl(series.logo_url, 'original') || series.logo_url}
                    alt={series.title}
                    className="h-8 sm:h-10 lg:h-14 object-contain mb-2"
                  />
                ) : (
                  <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight mb-2">{series.title}</h1>
                )}
                {series.tagline && (
                  <p className="text-sm sm:text-base text-reel-400 italic mb-3">&ldquo;{series.tagline}&rdquo;</p>
                )}
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/60">
                  {series.first_air_date && (
                    <span className="flex items-center gap-1.5"><FiCalendar className="w-4 h-4" />{formatDate(series.first_air_date)}</span>
                  )}
                  {seasons && (
                    <span>{seasons.length} Seasons</span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="w-full aspect-video bg-gradient-to-br from-apple-900 to-black rounded-2xl flex items-center justify-center">
              <span className="text-8xl font-bold text-white/10">{series.title[0]}</span>
            </div>
          )}
        </div>

        <div className="mt-6 sm:mt-8 max-w-3xl">
          {series.trailer_url && (
            <a
              href={series.trailer_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 btn-primary mb-6 text-sm"
            >
              <FiPlay className="w-4 h-4" />
              Watch Trailer
            </a>
          )}

          {series.synopsis && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Synopsis</h3>
              <p className="text-white/80 leading-relaxed text-sm sm:text-base">{series.synopsis}</p>
            </div>
          )}
        </div>

        {seasons && seasons.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">Seasons</h2>
            <div className="space-y-3">
              {seasons.map((season) => (
                <div key={season.id} className="glass-card overflow-hidden">
                  <button
                    onClick={() => setExpandedSeason(expandedSeason === season.id ? null : season.id)}
                    className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/[0.02] transition-colors"
                  >
                    {season.poster_url ? (
                      <img src={getImageUrl(season.poster_url, 'w185') || season.poster_url} alt={season.name} className="w-14 h-20 object-cover rounded-xl" />
                    ) : (
                      <div className="w-14 h-20 bg-apple-800 rounded-xl flex items-center justify-center">
                        <span className="font-bold text-white/30 text-sm">S{season.season_number}</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{season.name}</h3>
                      <p className="text-xs text-white/40">{season.episode_count} Episodes</p>
                    </div>
                  </button>
                  {expandedSeason === season.id && (
                    <SeasonEpisodes seasonId={season.id} />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {primaryReview && (
          <section className="mt-10 glass-card p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-4">Review</h2>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full inline-flex mb-4">
              <FiCalendar className="w-5 h-5 text-yellow-400" />
              <span className="text-lg font-bold">{primaryReview.rating}/10</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-4">{primaryReview.title}</h3>
            {primaryReview.verdict && (
              <div className="mt-4 p-4 bg-reel-500/10 rounded-2xl border border-reel-500/20">
                <h4 className="text-xs font-semibold text-reel-400 uppercase tracking-wider mb-1">Verdict</h4>
                <p className="text-white/70 text-sm">{primaryReview.verdict}</p>
              </div>
            )}
          </section>
        )}

        <div className="h-12" />
      </div>
    </>
  )
}

function SeasonEpisodes({ seasonId }: { seasonId: string }) {
  const { data: episodes } = useQuery({
    queryKey: ['episodes', seasonId],
    queryFn: async () => {
      const { supabase } = await import('@/lib/supabase')
      const { data } = await supabase.from('episodes').select('*').eq('season_id', seasonId).order('episode_number')
      return data || []
    },
  })

  if (!episodes?.length) return <div className="px-4 pb-4 text-sm text-white/40">No episodes yet</div>

  return (
    <div className="border-t border-white/[0.06]">
      {episodes.map((ep: any) => (
        <div key={ep.id} className="flex items-start gap-4 p-4 hover:bg-white/[0.02] transition-colors">
          {ep.still_url ? (
            <img src={getImageUrl(ep.still_url, 'w300') || ep.still_url} alt={ep.name} className="w-28 aspect-video object-cover rounded-xl" />
          ) : (
            <div className="w-28 aspect-video bg-apple-800 rounded-xl flex items-center justify-center">
              <span className="text-xs text-white/30">E{ep.episode_number}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-sm">E{ep.episode_number} &mdash; {ep.name}</h4>
                {ep.air_date && <p className="text-xs text-white/40 mt-0.5">{formatDate(ep.air_date)}</p>}
              </div>
              {ep.runtime && <span className="text-xs text-white/40 flex-shrink-0">{ep.runtime}m</span>}
            </div>
            {ep.overview && <p className="text-sm text-white/50 mt-1 line-clamp-2">{ep.overview}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}
