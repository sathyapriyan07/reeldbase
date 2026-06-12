import { supabase } from './supabase'
import type {
  Movie, Series, Person, Genre, Language_t as LanguageType,
  Company, Review, Rating, Image, Video, Award, Trivia,
  Tag, Collection, Season, Episode, MovieCast, MovieCrew,
  SeriesCast, SeriesCrew, HomeSection, SocialLink, Profile,
} from '@/types'

// ============== AUTH ==============
export const authApi = {
  signUp: async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { username } }
    })
    if (error) throw error
    return data
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },

  getProfile: async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
    if (error) throw error
    return data
  },

  isAdmin: async (): Promise<boolean> => {
    const session = await authApi.getSession()
    if (!session) return false
    const profile = await authApi.getProfile(session.user.id)
    return profile?.role === 'admin'
  },
}

// ============== MOVIES ==============
export const movieApi = {
  list: async (params?: {
    language?: string; genre?: string; year?: number;
    page?: number; limit?: number; featured?: boolean;
    sort?: string; search?: string;
  }) => {
    let query = supabase.from('movies').select('*', { count: 'exact' })

    if (params?.search) query = query.ilike('title', `%${params.search}%`)
    if (params?.language) query = query.eq('language', params.language)
    if (params?.featured) query = query.eq('featured', true)
    if (params?.genre) {
      const { data: movieIds } = await supabase
        .from('movie_genres')
        .select('movie_id')
        .eq('genre_id', params.genre)
      if (movieIds?.length) query = query.in('id', movieIds.map(m => m.movie_id))
    }
    if (params?.year) {
      const start = `${params.year}-01-01`
      const end = `${params.year}-12-31`
      query = query.gte('release_date', start).lte('release_date', end)
    }

    const sort = params?.sort || 'created_at'
    query = query.order(sort, { ascending: false })

    const page = params?.page || 1
    const limit = params?.limit || 20
    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data, count, error } = await query
    if (error) throw error
    return { data: data as Movie[], count: count || 0 }
  },

  getById: async (id: string): Promise<Movie | null> => {
    const { data } = await supabase.from('movies').select('*').eq('id', id).single()
    return data as Movie | null
  },

  getBySlug: async (slug: string): Promise<Movie | null> => {
    const { data } = await supabase.from('movies').select('*').eq('slug', slug).single()
    return data as Movie | null
  },

  create: async (movie: Partial<Movie>) => {
    const { data, error } = await supabase.from('movies').insert(movie).select().single()
    if (error) throw error
    return data as Movie
  },

  update: async (id: string, movie: Partial<Movie>) => {
    const { data, error } = await supabase.from('movies').update(movie).eq('id', id).select().single()
    if (error) throw error
    return data as Movie
  },

  delete: async (id: string) => {
    const { error } = await supabase.from('movies').delete().eq('id', id)
    if (error) throw error
  },
}

// ============== SERIES ==============
export const seriesApi = {
  list: async (params?: {
    language?: string; genre?: string; page?: number;
    limit?: number; featured?: boolean; sort?: string; search?: string;
  }) => {
    let query = supabase.from('series').select('*', { count: 'exact' })

    if (params?.search) query = query.ilike('title', `%${params.search}%`)
    if (params?.language) query = query.eq('language', params.language)
    if (params?.featured) query = query.eq('featured', true)
    if (params?.genre) {
      const { data: seriesIds } = await supabase
        .from('series_genres')
        .select('series_id')
        .eq('genre_id', params.genre)
      if (seriesIds?.length) query = query.in('id', seriesIds.map(s => s.series_id))
    }

    const sort = params?.sort || 'created_at'
    query = query.order(sort, { ascending: false })

    const page = params?.page || 1
    const limit = params?.limit || 20
    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data, count, error } = await query
    if (error) throw error
    return { data: data as Series[], count: count || 0 }
  },

  getBySlug: async (slug: string): Promise<Series | null> => {
    const { data } = await supabase.from('series').select('*').eq('slug', slug).single()
    return data as Series | null
  },

  create: async (series: Partial<Series>) => {
    const { data, error } = await supabase.from('series').insert(series).select().single()
    if (error) throw error
    return data as Series
  },

  update: async (id: string, series: Partial<Series>) => {
    const { data, error } = await supabase.from('series').update(series).eq('id', id).select().single()
    if (error) throw error
    return data as Series
  },

  delete: async (id: string) => {
    const { error } = await supabase.delete().eq('id', id)
    if (error) throw error
  },

  getSeasons: async (seriesId: string): Promise<Season[]> => {
    const { data } = await supabase.from('seasons').select('*').eq('series_id', seriesId).order('season_number')
    return (data || []) as Season[]
  },

  getEpisodes: async (seasonId: string): Promise<Episode[]> => {
    const { data } = await supabase.from('episodes').select('*').eq('season_id', seasonId).order('episode_number')
    return (data || []) as Episode[]
  },
}

// ============== PEOPLE ==============
export const personApi = {
  list: async (params?: { role?: string; page?: number; limit?: number; search?: string }) => {
    let query = supabase.from('people').select('*', { count: 'exact' })

    if (params?.search) query = query.ilike('name', `%${params.search}%`)
    if (params?.role) query = query.eq('role', params.role)

    query = query.order('popularity', { ascending: false })

    const page = params?.page || 1
    const limit = params?.limit || 20
    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data, count, error } = await query
    if (error) throw error
    return { data: data as Person[], count: count || 0 }
  },

  getBySlug: async (slug: string): Promise<Person | null> => {
    const { data } = await supabase.from('people').select('*').eq('slug', slug).single()
    return data as Person | null
  },

  create: async (person: Partial<Person>) => {
    const { data, error } = await supabase.from('people').insert(person).select().single()
    if (error) throw error
    return data as Person
  },

  update: async (id: string, person: Partial<Person>) => {
    const { data, error } = await supabase.from('people').update(person).eq('id', id).select().single()
    if (error) throw error
    return data as Person
  },

  delete: async (id: string) => {
    const { error } = await supabase.from('people').delete().eq('id', id)
    if (error) throw error
  },

  getFilmography: async (personId: string) => {
    const [movieCast, movieCrew, seriesCast, seriesCrew] = await Promise.all([
      supabase.from('movie_cast').select('*, movies(*)').eq('person_id', personId),
      supabase.from('movie_crew').select('*, movies(*)').eq('person_id', personId),
      supabase.from('series_cast').select('*, series(*)').eq('person_id', personId),
      supabase.from('series_crew').select('*, series(*)').eq('person_id', personId),
    ])
    return {
      movieCast: movieCast.data || [],
      movieCrew: movieCrew.data || [],
      seriesCast: seriesCast.data || [],
      seriesCrew: seriesCrew.data || [],
    }
  },
}

// ============== GENRES ==============
export const genreApi = {
  list: async (): Promise<Genre[]> => {
    const { data } = await supabase.from('genres').select('*').order('name')
    return (data || []) as Genre[]
  },

  create: async (genre: Partial<Genre>) => {
    const { data, error } = await supabase.from('genres').insert(genre).select().single()
    if (error) throw error
    return data as Genre
  },

  update: async (id: string, genre: Partial<Genre>) => {
    const { data, error } = await supabase.from('genres').update(genre).eq('id', id).select().single()
    if (error) throw error
    return data as Genre
  },

  delete: async (id: string) => {
    const { error } = await supabase.from('genres').delete().eq('id', id)
    if (error) throw error
  },
}

// ============== REVIEWS ==============
export const reviewApi = {
  list: async (params?: { movieId?: string; seriesId?: string; status?: string; featured?: boolean }) => {
    let query = supabase.from('reviews').select('*, profiles(username, avatar_url)')

    if (params?.movieId) query = query.eq('movie_id', params.movieId)
    if (params?.seriesId) query = query.eq('series_id', params.seriesId)
    if (params?.status) query = query.eq('status', params.status)
    if (params?.featured) query = query.eq('featured', true)

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  create: async (review: Partial<Review>) => {
    const { data, error } = await supabase.from('reviews').insert(review).select().single()
    if (error) throw error
    return data as Review
  },

  update: async (id: string, review: Partial<Review>) => {
    const { data, error } = await supabase.from('reviews').update(review).eq('id', id).select().single()
    if (error) throw error
    return data as Review
  },

  delete: async (id: string) => {
    const { error } = await supabase.from('reviews').delete().eq('id', id)
    if (error) throw error
  },
}

// ============== RATINGS ==============
export const ratingApi = {
  getAverage: async (movieId?: string, seriesId?: string) => {
    let query = supabase.from('ratings').select('rating')
    if (movieId) query = query.eq('movie_id', movieId)
    if (seriesId) query = query.eq('series_id', seriesId)
    const { data } = await query
    if (!data?.length) return { average: 0, count: 0 }
    const sum = data.reduce((acc, r) => acc + r.rating, 0)
    return { average: Math.round((sum / data.length) * 10) / 10, count: data.length }
  },

  upsert: async (rating: { movie_id?: string; series_id?: string; rating: number }) => {
    const session = await authApi.getSession()
    if (!session) throw new Error('Not authenticated')
    const { data, error } = await supabase.from('ratings').upsert({
      ...rating,
      user_id: session.user.id,
    }).select().single()
    if (error) throw error
    return data
  },
}

// ============== HOME SECTIONS ==============
export const homeApi = {
  getSections: async (): Promise<HomeSection[]> => {
    const { data } = await supabase.from('home_sections').select('*').eq('active', true).order('order')
    return (data || []) as HomeSection[]
  },

  updateSection: async (id: string, section: Partial<HomeSection>) => {
    const { data, error } = await supabase.from('home_sections').update(section).eq('id', id).select().single()
    if (error) throw error
    return data as HomeSection
  },

  createSection: async (section: Partial<HomeSection>) => {
    const { data, error } = await supabase.from('home_sections').insert(section).select().single()
    if (error) throw error
    return data as HomeSection
  },

  deleteSection: async (id: string) => {
    const { error } = await supabase.from('home_sections').delete().eq('id', id)
    if (error) throw error
  },
}

// ============== IMAGES / STORAGE ==============
export const storageApi = {
  upload: async (bucket: string, path: string, file: File) => {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    })
    if (error) throw error
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)
    return { path: data.path, url: publicUrl }
  },

  delete: async (bucket: string, path: string) => {
    const { error } = await supabase.storage.from(bucket).remove([path])
    if (error) throw error
  },

  list: async (bucket: string, folder?: string) => {
    const { data, error } = await supabase.storage.from(bucket).list(folder || '')
    if (error) throw error
    return data || []
  },
}

// ============== SEARCH ==============
export const searchApi = {
  global: async (query: string) => {
    const [movies, series, people] = await Promise.all([
      supabase.from('movies').select('id, title, slug, poster_url, release_date').ilike('title', `%${query}%`).limit(5),
      supabase.from('series').select('id, title, slug, poster_url, first_air_date').ilike('title', `%${query}%`).limit(5),
      supabase.from('people').select('id, name, slug, profile_url, role').ilike('name', `%${query}%`).limit(5),
    ])
    return {
      movies: movies.data || [],
      series: series.data || [],
      people: people.data || [],
    }
  },
}

// ============== COMPANIES ==============
export const companyApi = {
  list: async (): Promise<Company[]> => {
    const { data } = await supabase.from('companies').select('*').order('name')
    return (data || []) as Company[]
  },

  create: async (company: Partial<Company>) => {
    const { data, error } = await supabase.from('companies').insert(company).select().single()
    if (error) throw error
    return data as Company
  },

  update: async (id: string, company: Partial<Company>) => {
    const { data, error } = await supabase.from('companies').update(company).eq('id', id).select().single()
    if (error) throw error
    return data as Company
  },

  delete: async (id: string) => {
    const { error } = await supabase.from('companies').delete().eq('id', id)
    if (error) throw error
  },
}

// ============== COLLECTIONS ==============
export const collectionApi = {
  list: async (): Promise<Collection[]> => {
    const { data } = await supabase.from('collections').select('*').order('name')
    return (data || []) as Collection[]
  },
}

// ============== TAGS ==============
export const tagApi = {
  list: async (): Promise<Tag[]> => {
    const { data } = await supabase.from('tags').select('*').order('name')
    return (data || []) as Tag[]
  },
}
