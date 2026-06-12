import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { movieApi, seriesApi, personApi, genreApi } from '@/lib/api'
import MovieCard, { SeriesCard, PersonCard } from '@/components/ui/MovieCard'
import { FiFilter, FiX } from 'react-icons/fi'

export default function Discover() {
  const [searchParams, setSearchParams] = useSearchParams()
  const type = searchParams.get('type') || 'movie'
  const language = searchParams.get('language') || ''
  const genreFilter = searchParams.get('genre') || ''
  const sort = searchParams.get('sort') || 'created_at'
  const [showFilters, setShowFilters] = useState(false)

  const { data: genres } = useQuery({
    queryKey: ['genres'],
    queryFn: genreApi.list,
  })

  const { data: movies } = useQuery({
    queryKey: ['movies', 'discover', language, genreFilter, sort],
    queryFn: () => movieApi.list({ language: language || undefined, genre: genreFilter || undefined, sort, limit: 50 }),
    enabled: type === 'movie',
  })

  const { data: series } = useQuery({
    queryKey: ['series', 'discover', language, genreFilter, sort],
    queryFn: () => seriesApi.list({ language: language || undefined, genre: genreFilter || undefined, sort, limit: 50 }),
    enabled: type === 'series',
  })

  const { data: people } = useQuery({
    queryKey: ['people', 'discover'],
    queryFn: () => personApi.list({ limit: 50 }),
    enabled: type === 'people',
  })

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(key, value)
    else params.delete(key)
    setSearchParams(params)
  }

  const tabs = [
    { value: 'movie', label: 'Movies' },
    { value: 'series', label: 'Series' },
    { value: 'people', label: 'People' },
  ]

  return (
    <>
      <Helmet>
        <title>Discover - ReelDB</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold font-display">Discover</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary !py-2 !px-3 flex items-center gap-2 text-sm"
          >
            <FiFilter className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="flex gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => updateFilter('type', tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                type === tab.value
                  ? 'bg-reel-600 text-white'
                  : 'bg-dark-800 text-dark-300 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {showFilters && (
          <div className="glass border border-white/5 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="text-dark-400 hover:text-white">
                <FiX className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(type === 'movie' || type === 'series') && (
                <>
                  <div>
                    <label className="block text-xs text-dark-400 mb-1.5">Language</label>
                    <select
                      value={language}
                      onChange={(e) => updateFilter('language', e.target.value)}
                      className="input-field text-sm"
                    >
                      <option value="">All</option>
                      <option value="tamil">Tamil</option>
                      <option value="malayalam">Malayalam</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-dark-400 mb-1.5">Genre</label>
                    <select
                      value={genreFilter}
                      onChange={(e) => updateFilter('genre', e.target.value)}
                      className="input-field text-sm"
                    >
                      <option value="">All Genres</option>
                      {genres?.map((g) => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-dark-400 mb-1.5">Sort By</label>
                    <select
                      value={sort}
                      onChange={(e) => updateFilter('sort', e.target.value)}
                      className="input-field text-sm"
                    >
                      <option value="created_at">Recently Added</option>
                      <option value="release_date">Release Date</option>
                      <option value="views">Most Viewed</option>
                      <option value="title">Title</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {type === 'movie' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies?.data?.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {type === 'series' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {series?.data?.map((s) => (
              <SeriesCard key={s.id} series={s} />
            ))}
          </div>
        )}

        {type === 'people' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {people?.data?.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
