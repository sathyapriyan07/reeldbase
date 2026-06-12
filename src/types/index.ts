export type Language = 'tamil' | 'malayalam' | 'both'
export type MediaType = 'movie' | 'series' | 'person'
export type PersonRole = 'actor' | 'actress' | 'director' | 'writer' | 'producer' | 'music_director' | 'cinematographer' | 'editor'
export type ReviewStatus = 'draft' | 'published'
export type UserRole = 'admin' | 'user'

export interface Profile {
  id: string
  email: string
  username: string
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Genre {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface Language_t {
  id: string
  name: string
  code: string
  created_at: string
}

export interface Company {
  id: string
  name: string
  slug: string
  logo_url: string | null
  description: string | null
  type: 'production' | 'distribution' | 'studio'
  created_at: string
}

export interface Movie {
  id: string
  tmdb_id: number | null
  title: string
  original_title: string | null
  slug: string
  tagline: string | null
  overview: string | null
  release_date: string | null
  runtime: number | null
  poster_url: string | null
  backdrop_url: string | null
  trailer_url: string | null
  language: Language
  budget: number | null
  revenue: number | null
  status: string | null
  certification: string | null
  imdb_id: string | null
  collection_id: string | null
  featured: boolean
  views: number
  created_at: string
  updated_at: string
}

export interface Series {
  id: string
  tmdb_id: number | null
  title: string
  original_title: string | null
  slug: string
  tagline: string | null
  synopsis: string | null
  first_air_date: string | null
  last_air_date: string | null
  poster_url: string | null
  backdrop_url: string | null
  trailer_url: string | null
  language: Language
  status: string | null
  certification: string | null
  featured: boolean
  views: number
  created_at: string
  updated_at: string
}

export interface Season {
  id: string
  series_id: string
  tmdb_id: number | null
  season_number: number
  name: string
  overview: string | null
  air_date: string | null
  poster_url: string | null
  episode_count: number
  created_at: string
}

export interface Episode {
  id: string
  season_id: string
  tmdb_id: number | null
  episode_number: number
  name: string
  overview: string | null
  air_date: string | null
  still_url: string | null
  runtime: number | null
  created_at: string
}

export interface Person {
  id: string
  tmdb_id: number | null
  name: string
  slug: string
  biography: string | null
  birth_date: string | null
  death_date: string | null
  birth_place: string | null
  profile_url: string | null
  role: PersonRole
  known_for_department: string | null
  also_known_as: string[] | null
  gender: number | null
  popularity: number | null
  created_at: string
  updated_at: string
}

export interface MovieCast {
  id: string
  movie_id: string
  person_id: string
  character: string | null
  order: number
  role: PersonRole
  created_at: string
}

export interface MovieCrew {
  id: string
  movie_id: string
  person_id: string
  department: string
  job: string
  created_at: string
}

export interface SeriesCast {
  id: string
  series_id: string
  person_id: string
  character: string | null
  order: number
  role: PersonRole
  created_at: string
}

export interface SeriesCrew {
  id: string
  series_id: string
  person_id: string
  department: string
  job: string
  created_at: string
}

export interface MovieGenre {
  movie_id: string
  genre_id: string
}

export interface SeriesGenre {
  series_id: string
  genre_id: string
}

export interface MovieLanguage {
  movie_id: string
  language_id: string
}

export interface SeriesLanguage {
  series_id: string
  language_id: string
}

export interface MovieCompany {
  movie_id: string
  company_id: string
}

export interface SeriesCompany {
  series_id: string
  company_id: string
}

export interface Review {
  id: string
  movie_id: string | null
  series_id: string | null
  author_id: string
  title: string
  content: string
  introduction: string | null
  story: string | null
  performances: string | null
  technical_aspects: string | null
  music_review: string | null
  positives: string[] | null
  negatives: string[] | null
  verdict: string | null
  pros: string[] | null
  cons: string[] | null
  status: ReviewStatus
  featured: boolean
  rating: number
  created_at: string
  updated_at: string
}

export interface Rating {
  id: string
  movie_id: string | null
  series_id: string | null
  user_id: string
  rating: number
  created_at: string
  updated_at: string
}

export interface Image {
  id: string
  movie_id: string | null
  series_id: string | null
  person_id: string | null
  url: string
  type: 'poster' | 'backdrop' | 'gallery' | 'profile' | 'banner'
  caption: string | null
  order: number
  created_at: string
}

export interface Video {
  id: string
  movie_id: string | null
  series_id: string | null
  title: string
  url: string
  type: 'trailer' | 'clip' | 'featurette' | 'interview'
  created_at: string
}

export interface Award {
  id: string
  movie_id: string | null
  series_id: string | null
  person_id: string | null
  name: string
  category: string | null
  year: number | null
  winner: boolean
  created_at: string
}

export interface Trivia {
  id: string
  movie_id: string | null
  series_id: string | null
  content: string
  created_at: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface MovieTag {
  movie_id: string
  tag_id: string
}

export interface SeriesTag {
  series_id: string
  tag_id: string
}

export interface Collection {
  id: string
  name: string
  slug: string
  overview: string | null
  poster_url: string | null
  backdrop_url: string | null
  created_at: string
}

export interface HomeSection {
  id: string
  title: string
  type: 'hero' | 'trending_movies' | 'trending_series' | 'latest_releases' | 'upcoming' | 'recently_added' | 'featured_personalities' | 'editors_picks' | 'top_rated_movies' | 'top_rated_series' | 'tamil_section' | 'malayalam_section' | 'custom'
  items: string[]
  item_type: 'movie' | 'series' | 'person' | 'review'
  order: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface SocialLink {
  id: string
  person_id: string
  platform: 'instagram' | 'twitter' | 'facebook' | 'youtube' | 'wikipedia' | 'imdb'
  url: string
  created_at: string
}

export interface Watchlist {
  id: string
  user_id: string
  movie_id: string | null
  series_id: string | null
  created_at: string
}
