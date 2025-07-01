
-- Add username field to profiles table and make it unique
ALTER TABLE public.profiles 
ADD COLUMN username TEXT UNIQUE;

-- Add constraint to ensure username follows a valid pattern (alphanumeric and underscores only)
ALTER TABLE public.profiles 
ADD CONSTRAINT username_format_check CHECK (username ~ '^[a-zA-Z0-9_]+$');

-- Add constraint for username length (3-30 characters)
ALTER TABLE public.profiles 
ADD CONSTRAINT username_length_check CHECK (char_length(username) >= 3 AND char_length(username) <= 30);
