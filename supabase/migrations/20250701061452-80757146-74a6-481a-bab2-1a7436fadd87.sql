
-- Add headline and about fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN headline TEXT,
ADD COLUMN about TEXT;

-- Add check constraint for headline length (max 200 characters)
ALTER TABLE public.profiles 
ADD CONSTRAINT headline_length_check CHECK (char_length(headline) <= 200);
