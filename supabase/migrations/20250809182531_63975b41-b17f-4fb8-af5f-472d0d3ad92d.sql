-- Add work_preferences column to profiles table to store array of selected professions
ALTER TABLE public.profiles 
ADD COLUMN work_preferences text[] DEFAULT '{}';

-- Add comment to document the column
COMMENT ON COLUMN public.profiles.work_preferences IS 'Array of selected primary professions (up to 5)';