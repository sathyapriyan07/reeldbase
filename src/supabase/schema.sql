-- ReelDB Complete Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  username TEXT UNIQUE,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Genres
CREATE TABLE genres (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE genres ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Genres are viewable by everyone" ON genres FOR SELECT USING (true);
CREATE POLICY "Admins can manage genres" ON genres FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Languages
CREATE TABLE languages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Languages are viewable by everyone" ON languages FOR SELECT USING (true);
CREATE POLICY "Admins can manage languages" ON languages FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Companies (Production, Distribution, Studio)
CREATE TABLE companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  description TEXT,
  type TEXT CHECK (type IN ('production', 'distribution', 'studio')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Companies are viewable by everyone" ON companies FOR SELECT USING (true);
CREATE POLICY "Admins can manage companies" ON companies FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Collections
CREATE TABLE collections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  overview TEXT,
  poster_url TEXT,
  backdrop_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Collections are viewable by everyone" ON collections FOR SELECT USING (true);
CREATE POLICY "Admins can manage collections" ON collections FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Movies
CREATE TABLE movies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tmdb_id INTEGER,
  title TEXT NOT NULL,
  original_title TEXT,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT,
  overview TEXT,
  release_date DATE,
  runtime INTEGER,
  poster_url TEXT,
  backdrop_url TEXT,
  trailer_url TEXT,
  language TEXT DEFAULT 'tamil' CHECK (language IN ('tamil', 'malayalam', 'both')),
  budget BIGINT,
  revenue BIGINT,
  status TEXT,
  certification TEXT,
  imdb_id TEXT,
  collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
  featured BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Movies are viewable by everyone" ON movies FOR SELECT USING (true);
CREATE POLICY "Admins can manage movies" ON movies FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Series
CREATE TABLE series (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tmdb_id INTEGER,
  title TEXT NOT NULL,
  original_title TEXT,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT,
  synopsis TEXT,
  first_air_date DATE,
  last_air_date DATE,
  poster_url TEXT,
  backdrop_url TEXT,
  trailer_url TEXT,
  language TEXT DEFAULT 'tamil' CHECK (language IN ('tamil', 'malayalam', 'both')),
  status TEXT,
  certification TEXT,
  featured BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE series ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Series are viewable by everyone" ON series FOR SELECT USING (true);
CREATE POLICY "Admins can manage series" ON series FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Seasons
CREATE TABLE seasons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  series_id UUID REFERENCES series(id) ON DELETE CASCADE,
  tmdb_id INTEGER,
  season_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  overview TEXT,
  air_date DATE,
  poster_url TEXT,
  episode_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Seasons are viewable by everyone" ON seasons FOR SELECT USING (true);
CREATE POLICY "Admins can manage seasons" ON seasons FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Episodes
CREATE TABLE episodes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  season_id UUID REFERENCES seasons(id) ON DELETE CASCADE,
  tmdb_id INTEGER,
  episode_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  overview TEXT,
  air_date DATE,
  still_url TEXT,
  runtime INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Episodes are viewable by everyone" ON episodes FOR SELECT USING (true);
CREATE POLICY "Admins can manage episodes" ON episodes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- People
CREATE TABLE people (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tmdb_id INTEGER,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  biography TEXT,
  birth_date DATE,
  death_date DATE,
  birth_place TEXT,
  profile_url TEXT,
  role TEXT CHECK (role IN ('actor', 'actress', 'director', 'writer', 'producer', 'music_director', 'cinematographer', 'editor')),
  known_for_department TEXT,
  also_known_as TEXT[],
  gender INTEGER,
  popularity FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE people ENABLE ROW LEVEL SECURITY;
CREATE POLICY "People are viewable by everyone" ON people FOR SELECT USING (true);
CREATE POLICY "Admins can manage people" ON people FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Movie Cast
CREATE TABLE movie_cast (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  character TEXT,
  "order" INTEGER DEFAULT 0,
  role TEXT DEFAULT 'actor' CHECK (role IN ('actor', 'actress', 'director', 'writer', 'producer', 'music_director', 'cinematographer', 'editor')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE movie_cast ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Movie cast is viewable by everyone" ON movie_cast FOR SELECT USING (true);
CREATE POLICY "Admins can manage movie cast" ON movie_cast FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Movie Crew
CREATE TABLE movie_crew (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  department TEXT NOT NULL,
  job TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE movie_crew ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Movie crew is viewable by everyone" ON movie_crew FOR SELECT USING (true);
CREATE POLICY "Admins can manage movie crew" ON movie_crew FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Series Cast
CREATE TABLE series_cast (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  series_id UUID REFERENCES series(id) ON DELETE CASCADE,
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  character TEXT,
  "order" INTEGER DEFAULT 0,
  role TEXT DEFAULT 'actor' CHECK (role IN ('actor', 'actress', 'director', 'writer', 'producer', 'music_director', 'cinematographer', 'editor')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE series_cast ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Series cast is viewable by everyone" ON series_cast FOR SELECT USING (true);
CREATE POLICY "Admins can manage series cast" ON series_cast FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Series Crew
CREATE TABLE series_crew (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  series_id UUID REFERENCES series(id) ON DELETE CASCADE,
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  department TEXT NOT NULL,
  job TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE series_crew ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Series crew is viewable by everyone" ON series_crew FOR SELECT USING (true);
CREATE POLICY "Admins can manage series crew" ON series_crew FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Junction tables
CREATE TABLE movie_genres (
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  genre_id UUID REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (movie_id, genre_id)
);

ALTER TABLE movie_genres ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Movie genres are viewable by everyone" ON movie_genres FOR SELECT USING (true);
CREATE POLICY "Admins can manage movie genres" ON movie_genres FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE TABLE series_genres (
  series_id UUID REFERENCES series(id) ON DELETE CASCADE,
  genre_id UUID REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (series_id, genre_id)
);

ALTER TABLE series_genres ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Series genres are viewable by everyone" ON series_genres FOR SELECT USING (true);
CREATE POLICY "Admins can manage series genres" ON series_genres FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE TABLE movie_languages (
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  language_id UUID REFERENCES languages(id) ON DELETE CASCADE,
  PRIMARY KEY (movie_id, language_id)
);

ALTER TABLE movie_languages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Movie languages are viewable by everyone" ON movie_languages FOR SELECT USING (true);
CREATE POLICY "Admins can manage movie languages" ON movie_languages FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE TABLE series_languages (
  series_id UUID REFERENCES series(id) ON DELETE CASCADE,
  language_id UUID REFERENCES languages(id) ON DELETE CASCADE,
  PRIMARY KEY (series_id, language_id)
);

ALTER TABLE series_languages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Series languages are viewable by everyone" ON series_languages FOR SELECT USING (true);
CREATE POLICY "Admins can manage series languages" ON series_languages FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE TABLE movie_companies (
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  PRIMARY KEY (movie_id, company_id)
);

ALTER TABLE movie_companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Movie companies are viewable by everyone" ON movie_companies FOR SELECT USING (true);
CREATE POLICY "Admins can manage movie companies" ON movie_companies FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE TABLE series_companies (
  series_id UUID REFERENCES series(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  PRIMARY KEY (series_id, company_id)
);

ALTER TABLE series_companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Series companies are viewable by everyone" ON series_companies FOR SELECT USING (true);
CREATE POLICY "Admins can manage series companies" ON series_companies FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Social Links
CREATE TABLE social_links (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  platform TEXT CHECK (platform IN ('instagram', 'twitter', 'facebook', 'youtube', 'wikipedia', 'imdb')),
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Social links are viewable by everyone" ON social_links FOR SELECT USING (true);
CREATE POLICY "Admins can manage social links" ON social_links FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Reviews
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  series_id UUID REFERENCES series(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  introduction TEXT,
  story TEXT,
  performances TEXT,
  technical_aspects TEXT,
  music_review TEXT,
  positives TEXT[],
  negatives TEXT[],
  verdict TEXT,
  pros TEXT[],
  cons TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured BOOLEAN DEFAULT FALSE,
  rating INTEGER CHECK (rating >= 0 AND rating <= 10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published reviews are viewable by everyone" ON reviews FOR SELECT USING (status = 'published' OR auth.uid() = author_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can manage all reviews" ON reviews FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Ratings
CREATE TABLE ratings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  series_id UUID REFERENCES series(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 0 AND rating <= 10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(movie_id, user_id),
  UNIQUE(series_id, user_id)
);

ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ratings are viewable by everyone" ON ratings FOR SELECT USING (true);
CREATE POLICY "Users can manage own ratings" ON ratings FOR ALL USING (auth.uid() = user_id);

-- Images
CREATE TABLE images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  series_id UUID REFERENCES series(id) ON DELETE CASCADE,
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type TEXT CHECK (type IN ('poster', 'backdrop', 'gallery', 'profile', 'banner')),
  caption TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Images are viewable by everyone" ON images FOR SELECT USING (true);
CREATE POLICY "Admins can manage images" ON images FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Videos
CREATE TABLE videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  series_id UUID REFERENCES series(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT CHECK (type IN ('trailer', 'clip', 'featurette', 'interview')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Videos are viewable by everyone" ON videos FOR SELECT USING (true);
CREATE POLICY "Admins can manage videos" ON videos FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Awards
CREATE TABLE awards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  series_id UUID REFERENCES series(id) ON DELETE CASCADE,
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  year INTEGER,
  winner BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Awards are viewable by everyone" ON awards FOR SELECT USING (true);
CREATE POLICY "Admins can manage awards" ON awards FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Trivia
CREATE TABLE trivia (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  series_id UUID REFERENCES series(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE trivia ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trivia is viewable by everyone" ON trivia FOR SELECT USING (true);
CREATE POLICY "Admins can manage trivia" ON trivia FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Tags
CREATE TABLE tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tags are viewable by everyone" ON tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage tags" ON tags FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE TABLE movie_tags (
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (movie_id, tag_id)
);

ALTER TABLE movie_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Movie tags are viewable by everyone" ON movie_tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage movie tags" ON movie_tags FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE TABLE series_tags (
  series_id UUID REFERENCES series(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (series_id, tag_id)
);

ALTER TABLE series_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Series tags are viewable by everyone" ON series_tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage series tags" ON series_tags FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Home Sections
CREATE TABLE home_sections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('hero', 'trending_movies', 'trending_series', 'latest_releases', 'upcoming', 'recently_added', 'featured_personalities', 'editors_picks', 'top_rated_movies', 'top_rated_series', 'tamil_section', 'malayalam_section', 'custom')),
  items TEXT[] DEFAULT '{}',
  item_type TEXT CHECK (item_type IN ('movie', 'series', 'person', 'review')),
  "order" INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE home_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Home sections are viewable by everyone" ON home_sections FOR SELECT USING (true);
CREATE POLICY "Admins can manage home sections" ON home_sections FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Watchlists
CREATE TABLE watchlists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  series_id UUID REFERENCES series(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own watchlists" ON watchlists FOR ALL USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_movies_slug ON movies(slug);
CREATE INDEX idx_movies_release_date ON movies(release_date DESC);
CREATE INDEX idx_movies_featured ON movies(featured) WHERE featured = TRUE;
CREATE INDEX idx_movies_language ON movies(language);
CREATE INDEX idx_series_slug ON series(slug);
CREATE INDEX idx_series_first_air_date ON series(first_air_date DESC);
CREATE INDEX idx_series_featured ON series(featured) WHERE featured = TRUE;
CREATE INDEX idx_series_language ON series(language);
CREATE INDEX idx_people_slug ON people(slug);
CREATE INDEX idx_people_role ON people(role);
CREATE INDEX idx_movie_cast_movie ON movie_cast(movie_id);
CREATE INDEX idx_movie_cast_person ON movie_cast(person_id);
CREATE INDEX idx_movie_crew_movie ON movie_crew(movie_id);
CREATE INDEX idx_movie_crew_person ON movie_crew(person_id);
CREATE INDEX idx_reviews_movie ON reviews(movie_id);
CREATE INDEX idx_reviews_featured ON reviews(featured) WHERE featured = TRUE;
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_images_movie ON images(movie_id);
CREATE INDEX idx_images_person ON images(person_id);
CREATE INDEX idx_seasons_series ON seasons(series_id);
CREATE INDEX idx_episodes_season ON episodes(season_id);
