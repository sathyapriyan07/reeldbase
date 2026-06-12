import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { seriesApi, reviewApi, ratingApi } from '@/lib/api'
import { getImageUrl, formatDate, getLanguageLabel } from '@/lib/utils'
import { FiStar, FiCalendar, FiPlay } from 'react-icons/fi'
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
        <div className="animate-spin w-10 h-10 border-4 border-reel-600 border-t-transparent rounded-full" />
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

      <div className="relative h-[40vh] min-h-[300px]">
        {series.backdrop_url ? (
          <img src={getImageUrl(series.backdrop_url, 'original') || series.backdrop_url} alt={series.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-dark-900 to-dark-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/60 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 flex-shrink-0">
            {series.poster_url ? (
              <img src={getImageUrl(series.poster_url, 'w500') || series.poster_url} alt={series.title} className="w-full rounded-xl shadow-2xl" />
            ) : (
              <div className="w-full aspect-[2/3] bg-gradient-to-br from-dark-800 to-dark-700 rounded-xl flex items-center justify-center">
                <span className="text-5xl font-bold text-dark-600 font-display">{series.title[0]}</span>
              </div>
            )}
          </div>

          <div className="flex-1 pt-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-primary">{getLanguageLabel(series.language)}</span>
              <span className="badge-secondary">Series</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-2">{series.title}</h1>
            {series.tagline && <p className="text-lg text-reel-400 italic mb-4">&ldquo;{series.tagline}&rdquo;</p>}

            <div className="flex flex-wrap items-center gap-4 text-sm text-dark-300 mb-6">
              {series.first_air_date && (
                <span className="flex items-center gap-1.5"><FiCalendar className="w-4 h-4" />{formatDate(series.first_air_date)}</span>
              )}
              {seasons && <span className="flex items-center gap-1.5">{seasons.length} Seasons</span>}
            </div>

            {series.synopsis && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-2">Synopsis</h3>
                <p className="text-dark-200 leading-relaxed">{series.synopsis}</p>
              </div>
            )}

            {series.trailer_url && (
              <a href={series.trailer_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 btn-primary">
                <FiPlay className="w-4 h-4" /> Watch Trailer
              </a>
            )}
          </div>
        </div>

        {seasons && seasons.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold font-display mb-6">Seasons</h2>
            <div className="space-y-4">
              {seasons.map((season) => (
                <div key={season.id} className="glass rounded-xl border border-white/5 overflow-hidden">
                  <button
                    onClick={() => setExpandedSeason(expandedSeason === season.id ? null : season.id)}
                    className="w-full flex items-center gap-4 p-4 text-left hover:bg-dark-800/50 transition-colors"
                  >
                    {season.poster_url ? (
                      <img src={getImageUrl(season.poster_url, 'w185') || season.poster_url} alt={season.name} className="w-16 h-24 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-24 bg-dark-800 rounded flex items-center justify-center">
                        <span className="font-bold text-dark-600">S{season.season_number}</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{season.name}</h3>
                      <p className="text-sm text-dark-400">{season.episode_count} Episodes</p>
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
          <section className="mt-12 glass rounded-xl p-6 md:p-8 border border-white/5">
            <h2 className="text-2xl font-bold font-display mb-4">Review</h2>
            <div className="flex items-center gap-2 bg-reel-600/20 px-3 py-1.5 rounded-lg inline-flex mb-4">
              <FiStar className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-xl font-bold">{primaryReview.rating}/10</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">{primaryReview.title}</h3>
            {primaryReview.verdict && (
              <div className="mt-4 p-4 bg-reel-600/10 rounded-lg border border-reel-600/20">
                <h4 className="text-sm font-semibold text-reel-400 uppercase tracking-wider mb-1">Verdict</h4>
                <p className="text-dark-200">{primaryReview.verdict}</p>
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

  if (!episodes?.length) return <div className="px-4 pb-4 text-sm text-dark-400">No episodes yet</div>

  return (
    <div className="border-t border-white/5">
      {episodes.map((ep: any) => (
        <div key={ep.id} className="flex items-start gap-4 p-4 hover:bg-dark-800/30 transition-colors">
          {ep.still_url ? (
            <img src={getImageUrl(ep.still_url, 'w300') || ep.still_url} alt={ep.name} className="w-32 aspect-video object-cover rounded" />
          ) : (
            <div className="w-32 aspect-video bg-dark-800 rounded flex items-center justify-center">
              <span className="text-xs text-dark-600">E{ep.episode_number}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-sm">E{ep.episode_number} &mdash; {ep.name}</h4>
                {ep.air_date && <p className="text-xs text-dark-400 mt-0.5">{formatDate(ep.air_date)}</p>}
              </div>
              {ep.runtime && <span className="text-xs text-dark-400 flex-shrink-0">{ep.runtime}m</span>}
            </div>
            {ep.overview && <p className="text-sm text-dark-400 mt-1 line-clamp-2">{ep.overview}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}
