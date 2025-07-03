
-- Add username column to profiles table for artist URLs
ALTER TABLE public.profiles 
ADD COLUMN username TEXT UNIQUE;

-- Create index on username for faster lookups
CREATE INDEX idx_profiles_username ON public.profiles(username);

-- Add auto-incrementing audition_number starting from 1000
ALTER TABLE public.auditions 
ADD COLUMN audition_number SERIAL;

-- Set the sequence to start from 1000
ALTER SEQUENCE auditions_audition_number_seq RESTART WITH 1000;

-- Update existing auditions to have sequential numbers starting from 1000
UPDATE public.auditions 
SET audition_number = 1000 + ROW_NUMBER() OVER (ORDER BY created_at) - 1;

-- Make audition_number NOT NULL after setting values
ALTER TABLE public.auditions 
ALTER COLUMN audition_number SET NOT NULL;

-- Add unique constraint on audition_number
ALTER TABLE public.auditions 
ADD CONSTRAINT unique_audition_number UNIQUE (audition_number);

-- Add about field to profiles table (up to 2000 characters)
ALTER TABLE public.profiles 
ADD COLUMN about TEXT;

-- Add constraint to limit about field to 2000 characters
ALTER TABLE public.profiles 
ADD CONSTRAINT check_about_length CHECK (char_length(about) <= 2000);

-- Add project_description field to projects table
ALTER TABLE public.projects 
ADD COLUMN project_description TEXT;
