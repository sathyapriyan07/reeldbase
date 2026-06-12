import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { movieApi, seriesApi, personApi, genreApi } from '@/lib/api'
import type { PersonRole } from '@/types'
import { FiSearch, FiDownload, FiExternalLink, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'

const TMDB_API = 'https://api.themoviedb.org/3'
const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY || ''

type SearchType = 'movie' | 'tv' | 'person'

interface TMDBResult {
  id: number
  title?: string
  name?: string
  poster_path: string | null
  backdrop_path: string | null
  overview: string
  release_date?: string
  first_air_date?: string
  vote_average: number
  media_type?: string
}

async function fetchFromTMDB(endpoint: string) {
  const res = await fetch(`${TMDB_API}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${TMDB_KEY}`)
  if (!res.ok) throw new Error('TMDB API error')
  return res.json()
}

export default function AdminTMDBImport() {
  const [searchType, setSearchType] = useState<SearchType>('movie')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<TMDBResult[]>([])
  const [importing, setImporting] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    if (!TMDB_KEY) { toast.error('Set VITE_TMDB_API_KEY in .env'); return }
    try {
      const data = await fetchFromTMDB(`/search/${searchType}?query=${encodeURIComponent(query)}&language=en-US&page=1`)
      setResults(data.results || [])
      setSearched(true)
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const roleMap: Record<string, PersonRole> = {
    Acting: 'actor',
    Directing: 'director',
    Writing: 'writer',
    Production: 'producer',
    Sound: 'music_director',
    Camera: 'cinematographer',
    Editing: 'editor',
  }

  const importMovie = async (tmdbId: number) => {
    setImporting(`movie-${tmdbId}`)
    try {
      const details = await fetchFromTMDB(`/movie/${tmdbId}?append_to_response=credits,images,videos,external_ids`)
      const existing = await movieApi.getByTmdbId(tmdbId)
      const movieData = {
        tmdb_id: details.id,
        title: details.title,
        original_title: details.original_title,
        slug: (details.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + details.id,
        tagline: details.tagline,
        overview: details.overview,
        release_date: details.release_date,
        runtime: details.runtime,
        poster_url: details.poster_path ? `https://image.tmdb.org/t/p/original${details.poster_path}` : null,
        backdrop_url: details.backdrop_path ? `https://image.tmdb.org/t/p/original${details.backdrop_path}` : null,
        language: 'tamil' as const,
        budget: details.budget,
        revenue: details.revenue,
        status: details.status,
        certification: details.release_dates?.results?.[0]?.release_dates?.[0]?.certification || null,
        imdb_id: details.external_ids?.imdb_id || null,
      }
      const created = existing
        ? await movieApi.update(existing.id, movieData)
        : await movieApi.create(movieData)

      // Import genres
      if (details.genres?.length) {
        await Promise.all(details.genres.map((g: any) =>
          genreApi.getOrCreate(g.name).then(genre =>
            movieApi.addGenre(created.id, genre.id)
          )
        ))
      }

      // Import cast
      let castImported = 0
      if (details.credits?.cast?.length) {
        await Promise.allSettled(details.credits.cast.map(async (c: any) => {
          try {
            const person = await personApi.getOrCreate(c.id, {
              tmdb_id: c.id,
              name: c.name,
              slug: (c.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + c.id,
              profile_url: c.profile_path ? `https://image.tmdb.org/t/p/original${c.profile_path}` : null,
              role: roleMap[c.known_for_department] || 'actor',
              known_for_department: c.known_for_department,
              popularity: c.popularity,
            })
            await movieApi.addCast({
              movie_id: created.id,
              person_id: person.id,
              character: c.character || null,
              order: c.order,
              role: roleMap[c.known_for_department] || 'actor',
            })
            castImported++
          } catch { /* skip failed cast member */ }
        }))
      }

      // Import crew
      let crewImported = 0
      if (details.credits?.crew?.length) {
        await Promise.allSettled(details.credits.crew.map(async (c: any) => {
          try {
            const person = await personApi.getOrCreate(c.id, {
              tmdb_id: c.id,
              name: c.name,
              slug: (c.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + c.id,
              profile_url: c.profile_path ? `https://image.tmdb.org/t/p/original${c.profile_path}` : null,
              role: roleMap[c.department] || 'actor',
              known_for_department: c.department,
              popularity: c.popularity,
            })
            await movieApi.addCrew({
              movie_id: created.id,
              person_id: person.id,
              department: c.department || 'Production',
              job: c.job || 'Unknown',
            })
            crewImported++
          } catch { /* skip failed crew member */ }
        }))
      }

      toast.success(`Imported: ${details.title} (${(details.genres?.length || 0)} genres, ${castImported} cast, ${crewImported} crew)`)
    } catch (err: any) {
      toast.error(`Import failed: ${err.message}`)
    } finally {
      setImporting(null)
    }
  }

  const importSeries = async (tmdbId: number) => {
    setImporting(`series-${tmdbId}`)
    try {
      const details = await fetchFromTMDB(`/tv/${tmdbId}?append_to_response=credits,images,videos,external_ids`)
      const existing = await seriesApi.getByTmdbId(tmdbId)
      const seriesData = {
        tmdb_id: details.id,
        title: details.name,
        original_title: details.original_name,
        slug: (details.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + details.id,
        tagline: details.tagline,
        synopsis: details.overview,
        first_air_date: details.first_air_date,
        last_air_date: details.last_air_date,
        poster_url: details.poster_path ? `https://image.tmdb.org/t/p/original${details.poster_path}` : null,
        backdrop_url: details.backdrop_path ? `https://image.tmdb.org/t/p/original${details.backdrop_path}` : null,
        language: 'tamil' as const,
        status: details.status,
      }
      const created = existing
        ? await seriesApi.update(existing.id, seriesData)
        : await seriesApi.create(seriesData)

      // Import genres
      if (details.genres?.length) {
        await Promise.all(details.genres.map((g: any) =>
          genreApi.getOrCreate(g.name).then(genre =>
            seriesApi.addGenre(created.id, genre.id)
          )
        ))
      }

      // Import cast
      let castImported = 0
      if (details.credits?.cast?.length) {
        await Promise.allSettled(details.credits.cast.map(async (c: any) => {
          try {
            const person = await personApi.getOrCreate(c.id, {
              tmdb_id: c.id,
              name: c.name,
              slug: (c.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + c.id,
              profile_url: c.profile_path ? `https://image.tmdb.org/t/p/original${c.profile_path}` : null,
              role: roleMap[c.known_for_department] || 'actor',
              known_for_department: c.known_for_department,
              popularity: c.popularity,
            })
            await seriesApi.addCast({
              series_id: created.id,
              person_id: person.id,
              character: c.character || null,
              order: c.order,
              role: roleMap[c.known_for_department] || 'actor',
            })
            castImported++
          } catch { /* skip failed cast member */ }
        }))
      }

      // Import crew
      let crewImported = 0
      if (details.credits?.crew?.length) {
        await Promise.allSettled(details.credits.crew.map(async (c: any) => {
          try {
            const person = await personApi.getOrCreate(c.id, {
              tmdb_id: c.id,
              name: c.name,
              slug: (c.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + c.id,
              profile_url: c.profile_path ? `https://image.tmdb.org/t/p/original${c.profile_path}` : null,
              role: roleMap[c.department] || 'actor',
              known_for_department: c.department,
              popularity: c.popularity,
            })
            await seriesApi.addCrew({
              series_id: created.id,
              person_id: person.id,
              department: c.department || 'Production',
              job: c.job || 'Unknown',
            })
            crewImported++
          } catch { /* skip failed crew member */ }
        }))
      }

      toast.success(`Imported: ${details.name} (${(details.genres?.length || 0)} genres, ${castImported} cast, ${crewImported} crew)`)
    } catch (err: any) {
      toast.error(`Import failed: ${err.message}`)
    } finally {
      setImporting(null)
    }
  }

  const importPerson = async (tmdbId: number) => {
    setImporting(`person-${tmdbId}`)
    try {
      const details = await fetchFromTMDB(`/person/${tmdbId}?append_to_response=external_ids,social_media`)
      // Determine best role from known_for_department
      const roleMap: Record<string, string> = {
        Acting: 'actor', Directing: 'director', Writing: 'writer',
        Production: 'producer', Sound: 'music_director',
        Camera: 'cinematographer', Editing: 'editor',
      }
      const person = {
        tmdb_id: details.id,
        name: details.name,
        slug: (details.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + details.id,
        biography: details.biography,
        birth_date: details.birthday,
        death_date: details.deathday,
        birth_place: details.place_of_birth,
        profile_url: details.profile_path ? `https://image.tmdb.org/t/p/original${details.profile_path}` : null,
        role: (roleMap[details.known_for_department] || 'actor') as PersonRole,
        known_for_department: details.known_for_department,
        also_known_as: details.also_known_as,
        gender: details.gender,
        popularity: details.popularity,
      }
      await personApi.create(person)
      toast.success(`Imported: ${details.name}`)
    } catch (err: any) {
      toast.error(`Import failed: ${err.message}`)
    } finally {
      setImporting(null)
    }
  }

  return (
    <>
      <Helmet><title>TMDB Import - ReelDB Admin</title></Helmet>
      <h1 className="text-2xl font-bold font-display mb-2">TMDB Import</h1>
      <p className="text-dark-400 mb-6">Search and import movies, series, and people from TMDB</p>

      <div className="glass rounded-xl border border-white/5 p-6 mb-8">
        <div className="flex gap-2 mb-4">
          {(['movie', 'tv', 'person'] as SearchType[]).map((type) => (
            <button
              key={type}
              onClick={() => { setSearchType(type); setResults([]); setSearched(false) }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${searchType === type ? 'bg-reel-600 text-white' : 'bg-dark-800 text-dark-300 hover:text-white'}`}
            >
              {type === 'movie' ? 'Movies' : type === 'tv' ? 'Series' : 'People'}
            </button>
          ))}
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search TMDB for ${searchType === 'movie' ? 'movies' : searchType === 'tv' ? 'series' : 'people'}...`}
              className="input-field pl-10"
            />
          </div>
          <button type="submit" className="btn-primary">Search</button>
        </form>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-dark-400">{results.length} results found</p>
          {results.map((result) => {
            const title = result.title || result.name || ''
            const date = result.release_date || result.first_air_date || ''
            const isImporting = importing === `${searchType}-${result.id}`

            return (
              <div key={result.id} className="glass rounded-xl border border-white/5 p-4 flex items-center gap-4">
                <div className="w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-dark-800">
                  {result.poster_path ? (
                    <img src={`https://image.tmdb.org/t/p/w185${result.poster_path}`} alt={title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><span className="text-2xl font-bold text-dark-600">?</span></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium">{title}</h3>
                  {result.overview && <p className="text-sm text-dark-400 line-clamp-2 mt-1">{result.overview}</p>}
                  <div className="flex items-center gap-3 mt-2 text-xs text-dark-400">
                    {date && <span>{date}</span>}
                    <span>TMDB: {result.id}</span>
                    {result.vote_average > 0 && <span>{result.vote_average.toFixed(1)}/10</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={`https://www.themoviedb.org/${searchType}/${result.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-dark-400 hover:text-white transition-colors"
                  >
                    <FiExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => {
                      if (searchType === 'movie') importMovie(result.id)
                      else if (searchType === 'tv') importSeries(result.id)
                      else importPerson(result.id)
                    }}
                    disabled={isImporting}
                    className="btn-primary flex items-center gap-2 text-sm !py-2 !px-3"
                  >
                    {isImporting ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <FiDownload className="w-4 h-4" />
                    )}
                    Import
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {searched && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-dark-400">No results found. Try a different search term.</p>
        </div>
      )}
    </>
  )
}
