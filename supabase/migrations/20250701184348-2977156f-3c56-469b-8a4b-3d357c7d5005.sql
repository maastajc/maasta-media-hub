-- Add foreign key relationship between awards and profiles tables
ALTER TABLE public.awards 
ADD CONSTRAINT awards_artist_id_fkey 
FOREIGN KEY (artist_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;