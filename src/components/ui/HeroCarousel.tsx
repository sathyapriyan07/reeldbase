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
    <div className="relative h-[65vh] min-h-[500px] max-h-[900px] overflow-hidden">
      {items.map((m, i) => (
        <div
          key={m.id}
          className={`absolute inset-0 transition-all duration-1000 ${i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
        >
          {m.backdrop_url ? (
            <img
              src={getImageUrl(m.backdrop_url, 'original') || m.backdrop_url}
              alt={m.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-apple-900 to-black" />
          )}
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12 lg:p-16">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="badge-primary">{getLanguageLabel(item.language)}</span>
              {item.release_date && (
                <span className="text-sm text-white/60">{new Date(item.release_date).getFullYear()}</span>
              )}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-4 leading-tight">
              {item.title}
            </h1>
            {item.tagline && (
              <p className="text-base sm:text-lg text-white/60 italic mb-3">&ldquo;{item.tagline}&rdquo;</p>
            )}
            {item.overview && (
              <p className="text-sm sm:text-base text-white/70 line-clamp-2 mb-8 max-w-xl leading-relaxed">
                {item.overview}
              </p>
            )}
            <div className="flex items-center gap-4">
              <Link
                to={`/movie/${item.slug}`}
                className="inline-flex items-center gap-2.5 bg-white text-black font-semibold px-8 py-3.5 rounded-full hover:bg-white/90 transition-all duration-300"
              >
                <FiPlay className="w-4 h-4" />
                View Details
              </Link>
              {item.runtime && (
                <span className="text-sm text-white/50">{item.runtime} min</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {len > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all opacity-0 hover:opacity-100"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all opacity-0 hover:opacity-100"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-6 right-6 sm:right-12 lg:right-16 flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === current ? 'w-8 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
