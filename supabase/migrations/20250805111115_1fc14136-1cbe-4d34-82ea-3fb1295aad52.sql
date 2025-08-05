-- Update the handle_new_user function to properly extract all sign up form data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    full_name, 
    email, 
    role, 
    username,
    phone_number,
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
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'phone_number',
    CASE 
      WHEN NEW.raw_user_meta_data->>'role' = 'artist' THEN 'actor'
      ELSE 'other'
    END,
    'beginner', 
    0, 
    'active', 
    now(), 
    now()
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user trigger when inserting into profiles: %', SQLERRM;
    RETURN NEW;
END;
$$;