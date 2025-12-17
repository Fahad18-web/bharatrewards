-- Duplicate prevention hardening
-- Run this in Supabase SQL Editor

-- 1) Enforce case-insensitive unique emails.
-- Note: you already have a UNIQUE constraint on email; this adds protection for EmailCase variants.
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique_ci
  ON public.users ((lower(email)));

-- 2) Add columns to help detect duplicate/multi-account abuse.
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS email_normalized TEXT,
  ADD COLUMN IF NOT EXISTS name_normalized TEXT,
  ADD COLUMN IF NOT EXISTS device_id TEXT,
  ADD COLUMN IF NOT EXISTS created_ip VARCHAR(45),
  ADD COLUMN IF NOT EXISTS created_user_agent TEXT,
  ADD COLUMN IF NOT EXISTS last_ip VARCHAR(45),
  ADD COLUMN IF NOT EXISTS last_user_agent TEXT,
  ADD COLUMN IF NOT EXISTS last_device_id TEXT;

-- 3) Useful indexes for duplicate checks.
CREATE INDEX IF NOT EXISTS idx_users_device_id ON public.users(device_id);
CREATE INDEX IF NOT EXISTS idx_users_created_ip ON public.users(created_ip);
CREATE INDEX IF NOT EXISTS idx_users_name_normalized ON public.users(name_normalized);

-- 4) (Optional) Keep normalized fields up to date.
-- This trigger updates normalized fields on insert/update.
CREATE OR REPLACE FUNCTION public.set_user_normalized_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.email_normalized := lower(coalesce(NEW.email, ''));
  NEW.name_normalized := regexp_replace(lower(coalesce(NEW.name, '')), '[^a-z0-9]+', '', 'g');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_user_normalized_fields_trigger ON public.users;
CREATE TRIGGER set_user_normalized_fields_trigger
  BEFORE INSERT OR UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.set_user_normalized_fields();
