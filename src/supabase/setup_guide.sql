-- =====================================================
-- RUN THIS ENTIRE FILE IN YOUR SUPABASE SQL EDITOR
-- (sql.new -> paste -> run, OR open schema.sql and run all)
-- =====================================================

-- 1. First verify no tables exist (clean slate)
-- Drop everything if re-running
DO $$ DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
    EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
  END LOOP;
END $$;

-- 2. Run the full schema
-- Copy ALL content from src/supabase/schema.sql and paste here

-- 3. Verify it worked - run this query:
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- 4. Verify policies exist:
SELECT tablename, policyname, permissive, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
