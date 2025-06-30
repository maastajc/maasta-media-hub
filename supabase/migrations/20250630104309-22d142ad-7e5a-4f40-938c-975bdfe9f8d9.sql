
-- Add new fields to the profiles table for portfolio links and preferred domains
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS behance text,
ADD COLUMN IF NOT EXISTS preferred_domains text;
