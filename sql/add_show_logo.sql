ALTER TABLE movies ADD COLUMN IF NOT EXISTS show_logo boolean DEFAULT false;
ALTER TABLE series ADD COLUMN IF NOT EXISTS show_logo boolean DEFAULT false;
