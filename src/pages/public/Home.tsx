import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { movieApi, seriesApi } from '@/lib/api'
import HeroCarousel from '@/components/ui/HeroCarousel'
import ContentSection, { HorizontalSection } from '@/components/ui/ContentSection'
import MovieCard, { SeriesCard } from '@/components/ui/MovieCard'

export default function Home() {
  const { data: trendingMovies } = useQuery({
    queryKey: ['movies', 'trending'],
    queryFn: () => movieApi.list({ featured: true, limit: 12, sort: 'views' }),
  })

  const { data: trendingSeries } = useQuery({
    queryKey: ['series', 'trending'],
    queryFn: () => seriesApi.list({ featured: true, limit: 12, sort: 'views' }),
  })

  const { data: latestMovies } = useQuery({
    queryKey: ['movies', 'latest'],
    queryFn: () => movieApi.list({ limit: 12, sort: 'release_date' }),
  })

  const { data: tamilMovies } = useQuery({
    queryKey: ['movies', 'tamil'],
    queryFn: () => movieApi.list({ language: 'tamil', limit: 12 }),
  })

  const { data: malayalamMovies } = useQuery({
    queryKey: ['movies', 'malayalam'],
    queryFn: () => movieApi.list({ language: 'malayalam', limit: 12 }),
  })

  const heroItems = trendingMovies?.data?.slice(0, 5) || []

  return (
    <>
      <Helmet>
        <title>ReelDB - Tamil & Malayalam Cinema Database</title>
        <meta name="description" content="Discover Tamil and Malayalam movies, series, and personalities. The ultimate database for South Indian cinema." />
      </Helmet>

      <HeroCarousel items={heroItems} />

      <div className="space-y-2 pb-12">
        <ContentSection title="Trending Movies" viewAllLink="/discover?type=movie&sort=trending">
          {trendingMovies?.data?.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </ContentSection>

        <HorizontalSection title="Trending Series" viewAllLink="/discover?type=series&sort=trending">
          {trendingSeries?.data?.map((series) => (
            <div key={series.id} className="w-[170px] flex-shrink-0 snap-start">
              <SeriesCard series={series} />
            </div>
          ))}
        </HorizontalSection>

        <ContentSection title="Latest Releases" viewAllLink="/discover?type=movie&sort=latest">
          {latestMovies?.data?.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </ContentSection>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/discover?type=movie&language=tamil" className="relative rounded-2xl overflow-hidden h-56 sm:h-72 group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-reel-900/90 to-black/90 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                <div className="text-center">
                  <h3 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">தமிழ்</h3>
                  <p className="text-reel-400 text-sm">Tamil Cinema</p>
                </div>
              </div>
            </Link>
            <Link to="/discover?type=movie&language=malayalam" className="relative rounded-2xl overflow-hidden h-56 sm:h-72 group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 to-black/90 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                <div className="text-center">
                  <h3 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">മലയാളം</h3>
                  <p className="text-emerald-400 text-sm">Malayalam Cinema</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <ContentSection title="Tamil Movies" viewAllLink="/discover?type=movie&language=tamil">
          {tamilMovies?.data?.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </ContentSection>

        <ContentSection title="Malayalam Movies" viewAllLink="/discover?type=movie&language=malayalam">
          {malayalamMovies?.data?.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </ContentSection>
      </div>
    </>
  )
}
