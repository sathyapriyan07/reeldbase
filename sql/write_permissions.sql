-- Run this in Supabase SQL Editor
-- Grants write access to authenticated users for all tables

-- ===== GRANTS =====
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- ===== RLS POLICIES =====
-- Allow authenticated users to insert/update/delete on all tables

-- Movies
CREATE POLICY "Authenticated can insert movies" ON movies FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can update movies" ON movies FOR UPDATE USING (true);
CREATE POLICY "Authenticated can delete movies" ON movies FOR DELETE USING (true);

-- Series
CREATE POLICY "Authenticated can insert series" ON series FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can update series" ON series FOR UPDATE USING (true);
CREATE POLICY "Authenticated can delete series" ON series FOR DELETE USING (true);

-- People
CREATE POLICY "Authenticated can insert people" ON people FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can update people" ON people FOR UPDATE USING (true);
CREATE POLICY "Authenticated can delete people" ON people FOR DELETE USING (true);

-- Genres
CREATE POLICY "Authenticated can insert genres" ON genres FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can update genres" ON genres FOR UPDATE USING (true);
CREATE POLICY "Authenticated can delete genres" ON genres FOR DELETE USING (true);

-- Movie junction tables
CREATE POLICY "Authenticated can insert movie_genres" ON movie_genres FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can delete movie_genres" ON movie_genres FOR DELETE USING (true);

CREATE POLICY "Authenticated can insert movie_cast" ON movie_cast FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can delete movie_cast" ON movie_cast FOR DELETE USING (true);

CREATE POLICY "Authenticated can insert movie_crew" ON movie_crew FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can delete movie_crew" ON movie_crew FOR DELETE USING (true);

CREATE POLICY "Authenticated can insert movie_languages" ON movie_languages FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can delete movie_languages" ON movie_languages FOR DELETE USING (true);

CREATE POLICY "Authenticated can insert movie_companies" ON movie_companies FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can delete movie_companies" ON movie_companies FOR DELETE USING (true);

CREATE POLICY "Authenticated can insert movie_tags" ON movie_tags FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can delete movie_tags" ON movie_tags FOR DELETE USING (true);

-- Series junction tables
CREATE POLICY "Authenticated can insert series_genres" ON series_genres FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can delete series_genres" ON series_genres FOR DELETE USING (true);

CREATE POLICY "Authenticated can insert series_cast" ON series_cast FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can delete series_cast" ON series_cast FOR DELETE USING (true);

CREATE POLICY "Authenticated can insert series_crew" ON series_crew FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can delete series_crew" ON series_crew FOR DELETE USING (true);

CREATE POLICY "Authenticated can insert series_languages" ON series_languages FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can delete series_languages" ON series_languages FOR DELETE USING (true);

CREATE POLICY "Authenticated can insert series_companies" ON series_companies FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can delete series_companies" ON series_companies FOR DELETE USING (true);

CREATE POLICY "Authenticated can insert series_tags" ON series_tags FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can delete series_tags" ON series_tags FOR DELETE USING (true);

-- Seasons & Episodes
CREATE POLICY "Authenticated can insert seasons" ON seasons FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can update seasons" ON seasons FOR UPDATE USING (true);
CREATE POLICY "Authenticated can delete seasons" ON seasons FOR DELETE USING (true);

CREATE POLICY "Authenticated can insert episodes" ON episodes FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can update episodes" ON episodes FOR UPDATE USING (true);
CREATE POLICY "Authenticated can delete episodes" ON episodes FOR DELETE USING (true);

-- Reviews
CREATE POLICY "Authenticated can insert reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can update reviews" ON reviews FOR UPDATE USING (true);
CREATE POLICY "Authenticated can delete reviews" ON reviews FOR DELETE USING (true);

-- Ratings
CREATE POLICY "Authenticated can insert ratings" ON ratings FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can update ratings" ON ratings FOR UPDATE USING (true);
CREATE POLICY "Authenticated can delete ratings" ON ratings FOR DELETE USING (true);

-- Images
CREATE POLICY "Authenticated can insert images" ON images FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can delete images" ON images FOR DELETE USING (true);

-- Videos
CREATE POLICY "Authenticated can insert videos" ON videos FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can delete videos" ON videos FOR DELETE USING (true);

-- Awards
CREATE POLICY "Authenticated can insert awards" ON awards FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can update awards" ON awards FOR UPDATE USING (true);
CREATE POLICY "Authenticated can delete awards" ON awards FOR DELETE USING (true);

-- Trivia
CREATE POLICY "Authenticated can insert trivia" ON trivia FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can delete trivia" ON trivia FOR DELETE USING (true);

-- Tags
CREATE POLICY "Authenticated can insert tags" ON tags FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can update tags" ON tags FOR UPDATE USING (true);
CREATE POLICY "Authenticated can delete tags" ON tags FOR DELETE USING (true);

-- Collections
CREATE POLICY "Authenticated can insert collections" ON collections FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can update collections" ON collections FOR UPDATE USING (true);
CREATE POLICY "Authenticated can delete collections" ON collections FOR DELETE USING (true);

-- Home sections
CREATE POLICY "Authenticated can insert home_sections" ON home_sections FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can update home_sections" ON home_sections FOR UPDATE USING (true);
CREATE POLICY "Authenticated can delete home_sections" ON home_sections FOR DELETE USING (true);

-- Social links
CREATE POLICY "Authenticated can insert social_links" ON social_links FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can delete social_links" ON social_links FOR DELETE USING (true);

-- Watchlist
CREATE POLICY "Authenticated can insert watchlist" ON watchlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated can delete own watchlist" ON watchlist FOR DELETE USING (auth.uid() = user_id);

-- Companies
CREATE POLICY "Authenticated can insert companies" ON companies FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can update companies" ON companies FOR UPDATE USING (true);
CREATE POLICY "Authenticated can delete companies" ON companies FOR DELETE USING (true);

-- Languages
CREATE POLICY "Authenticated can insert languages" ON languages FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can update languages" ON languages FOR UPDATE USING (true);
CREATE POLICY "Authenticated can delete languages" ON languages FOR DELETE USING (true);
