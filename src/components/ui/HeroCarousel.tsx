import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { FiPlay, FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi'
import type { Movie } from '@/types'
import { getImageUrl, getLanguageLabel } from '@/lib/utils'

interface Props {
  items: Movie[]
}

export default function HeroCarousel({ items }: Props) {
  const [current, setCurrent] = useState(0)
  const len = items.length

  const next = useCallback(() => setCurrent((c) => (c + 1) % len), [len])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + len) % len), [len])

  useEffect(() => {
    if (len <= 1) return
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [len, next])

  if (!items.length) return null

  const item = items[current]

  return (
    <div className="relative h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden">
      {items.map((m, i) => (
        <div
          key={m.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          {m.backdrop_url ? (
            <img
              src={getImageUrl(m.backdrop_url, 'original') || m.backdrop_url}
              alt={m.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-dark-900 to-dark-800" />
          )}
        </div>
      ))}

      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12 lg:p-16">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="badge-primary">{getLanguageLabel(item.language)}</span>
              {item.release_date && (
                <span className="text-sm text-dark-300">{new Date(item.release_date).getFullYear()}</span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold font-display mb-3">
              {item.title}
            </h1>
            {item.tagline && (
              <p className="text-lg text-dark-300 italic mb-2">&ldquo;{item.tagline}&rdquo;</p>
            )}
            {item.overview && (
              <p className="text-sm sm:text-base text-dark-200 line-clamp-2 mb-6 max-w-xl">
                {item.overview}
              </p>
            )}
            <div className="flex items-center gap-4">
              <Link
                to={`/movie/${item.slug}`}
                className="inline-flex items-center gap-2 bg-reel-600 hover:bg-reel-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200"
              >
                <FiPlay className="w-4 h-4" />
                View Details
              </Link>
              {item.runtime && (
                <span className="text-sm text-dark-400">{item.runtime} min</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {len > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all opacity-0 hover:opacity-100"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all opacity-0 hover:opacity-100"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 right-6 sm:right-12 lg:right-16 flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'bg-reel-500 w-6' : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
