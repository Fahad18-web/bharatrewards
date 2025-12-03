-- Add avatar column to users table
-- Run this in your Supabase SQL Editor if you already have the users table

ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(50);
