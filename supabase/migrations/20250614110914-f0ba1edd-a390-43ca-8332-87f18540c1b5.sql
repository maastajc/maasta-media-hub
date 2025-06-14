
-- Modify the handle_new_user function to insert into artist_details
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  -- Insert into public.artist_details table when a new user is created
  INSERT INTO public.artist_details (
    id,
    full_name,
    email,
    role,
    category,
    experience_level,
    years_of_experience,
    status,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'artist'),
    'actor', -- Default category
    'beginner', -- Default experience_level
    0, -- Default years_of_experience
    'active', -- Default status
    now(),
    now()
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't prevent user creation
    RAISE LOG 'Error in handle_new_user trigger when inserting into artist_details: %', SQLERRM;
    RETURN NEW;
END;
$function$;

-- Enable Row Level Security on the artist_details table
ALTER TABLE public.artist_details ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to all artist details
-- This is necessary for public profile pages (e.g., /artists/:artistId)
CREATE POLICY "Public can read artist details"
  ON public.artist_details
  FOR SELECT
  USING (true);

-- Policy: Allow authenticated users to manage their own artist details
-- This covers SELECT, INSERT, UPDATE, DELETE for the record owner
CREATE POLICY "Owners can manage their own artist details"
  ON public.artist_details
  FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

