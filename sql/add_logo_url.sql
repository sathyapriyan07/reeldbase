-- Run this in Supabase SQL Editor to add logo_url column
ALTER TABLE movies ADD COLUMN IF NOT EXISTS logo_url text;
ALTER TABLE series ADD COLUMN IF NOT EXISTS logo_url text;
