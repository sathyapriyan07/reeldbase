import { Link } from 'react-router-dom'
import { FiStar } from 'react-icons/fi'
import type { Movie } from '@/types'
import { getImageUrl, formatDate, getLanguageLabel } from '@/lib/utils'

interface Props {
  movie: Movie
  rating?: number
}

export default function MovieCard({ movie, rating }: Props) {
  return (
    <Link to={`/movie/${movie.slug}`} className="card group">
      <div className="relative aspect-[2/3] overflow-hidden">
        {movie.poster_url ? (
          <img
            src={getImageUrl(movie.poster_url, 'w500') || movie.poster_url}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-dark-800 to-dark-700 flex items-center justify-center">
            <span className="text-4xl font-bold text-dark-600 font-display">{movie.title[0]}</span>
          </div>
        )}
        <div className="absolute inset-0 card-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {rating && (
          <div className="absolute top-2 right-2 bg-dark-900/90 rounded-lg px-2 py-1 flex items-center gap-1">
            <FiStar className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-semibold">{rating}/10</span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className="badge-primary text-[10px]">{getLanguageLabel(movie.language)}</span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-reel-400 transition-colors">
          {movie.title}
        </h3>
        {movie.release_date && (
          <p className="text-xs text-dark-400 mt-1">{formatDate(movie.release_date).split(',')[0]}</p>
        )}
      </div>
    </Link>
  )
}

export function SeriesCard({ series }: { series: any }) {
  return (
    <Link to={`/series/${series.slug}`} className="card group">
      <div className="relative aspect-[2/3] overflow-hidden">
        {series.poster_url ? (
          <img
            src={getImageUrl(series.poster_url, 'w500') || series.poster_url}
            alt={series.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-dark-800 to-dark-700 flex items-center justify-center">
            <span className="text-4xl font-bold text-dark-600 font-display">{series.title[0]}</span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className="badge-primary text-[10px]">{getLanguageLabel(series.language)}</span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-reel-400 transition-colors">
          {series.title}
        </h3>
        {series.first_air_date && (
          <p className="text-xs text-dark-400 mt-1">
            {formatDate(series.first_air_date).split(',')[0]}
          </p>
        )}
      </div>
    </Link>
  )
}

export function PersonCard({ person }: { person: any }) {
  return (
    <Link to={`/person/${person.slug}`} className="card group text-center">
      <div className="relative aspect-[3/4] overflow-hidden">
        {person.profile_url ? (
          <img
            src={getImageUrl(person.profile_url, 'w500') || person.profile_url}
            alt={person.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-dark-800 to-dark-700 flex items-center justify-center">
            <span className="text-3xl font-bold text-dark-600 font-display">{person.name[0]}</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-reel-400 transition-colors">
          {person.name}
        </h3>
        {person.role && (
          <p className="text-xs text-dark-400 mt-1 capitalize">{person.role.replace('_', ' ')}</p>
        )}
      </div>
    </Link>
  )
}
