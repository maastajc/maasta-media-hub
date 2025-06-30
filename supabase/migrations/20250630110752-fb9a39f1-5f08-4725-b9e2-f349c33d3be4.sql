
-- Add cover image field to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS cover_image_url text;
