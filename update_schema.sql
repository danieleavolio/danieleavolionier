-- Run this in Supabase SQL Editor to add the missing image column
ALTER TABLE projects ADD COLUMN IF NOT EXISTS image text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS image text;
