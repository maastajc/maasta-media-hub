
-- Add custom_links column to profiles table to store custom portfolio links
ALTER TABLE public.profiles 
ADD COLUMN custom_links JSONB DEFAULT '[]'::jsonb;

-- Add a comment to document the column
COMMENT ON COLUMN public.profiles.custom_links IS 'Array of custom portfolio links with label and url fields';
