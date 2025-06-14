
-- Step 1: Safely migrate data from artist_details to profiles, skipping faulty rows if any remain.
-- This part may not be needed if it succeeded before, but it's safe to run again.
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Check if artist_details table exists before trying to loop through it
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = 'artist_details') THEN
        FOR r IN SELECT * FROM public.artist_details
        LOOP
            BEGIN
                INSERT INTO public.profiles (
                    id, full_name, email, role, bio, phone_number, gender, city, state, country,
                    profile_picture_url, category, experience_level, association_membership,
                    work_preference, personal_website, instagram, linkedin, youtube_vimeo, status,
                    verified, willing_to_relocate, years_of_experience, date_of_birth, created_at, updated_at, rate_card, imdb_profile
                )
                VALUES (
                    r.id, r.full_name, r.email, r.role, r.bio,
                    CASE WHEN r.phone_number ~ '^\+?[\d\s-]{7,20}$' THEN r.phone_number ELSE NULL END,
                    CASE WHEN r.gender IN ('male', 'female', 'other', 'prefer_not_to_say') THEN r.gender ELSE NULL END,
                    r.city, r.state, r.country,
                    r.profile_picture_url, r.category, r.experience_level, r.association_membership,
                    r.work_preference, r.personal_website, r.instagram, r.linkedin, r.youtube_vimeo, r.status,
                    r.verified, r.willing_to_relocate, r.years_of_experience,
                    CASE WHEN r.date_of_birth IS NOT NULL AND r.date_of_birth > now() THEN NULL ELSE r.date_of_birth END,
                    CASE WHEN r.created_at IS NOT NULL AND r.created_at > now() THEN now() ELSE r.created_at END,
                    CASE WHEN r.updated_at IS NOT NULL AND r.updated_at > now() THEN now() ELSE r.updated_at END,
                    r.rate_card, r.imdb_profile
                )
                ON CONFLICT (id) DO NOTHING;
            EXCEPTION WHEN OTHERS THEN
                RAISE WARNING 'Could not migrate artist_details row with id %. Error: %', r.id, SQLERRM;
            END;
        END LOOP;
    END IF;
END;
$$;

-- Step 2: Drop the redundant artist_details table and its dependencies.
DROP TABLE IF EXISTS public.artist_details CASCADE;

-- Step 3: Idempotently create foreign keys to point to the new public.profiles table.
ALTER TABLE public.education_training DROP CONSTRAINT IF EXISTS education_training_artist_id_fkey;
ALTER TABLE public.education_training ADD CONSTRAINT education_training_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.language_skills DROP CONSTRAINT IF EXISTS language_skills_artist_id_fkey;
ALTER TABLE public.language_skills ADD CONSTRAINT language_skills_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.media_assets DROP CONSTRAINT IF EXISTS media_assets_artist_id_fkey;
ALTER TABLE public.media_assets ADD CONSTRAINT media_assets_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_artist_id_fkey;
ALTER TABLE public.projects ADD CONSTRAINT projects_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.special_skills DROP CONSTRAINT IF EXISTS special_skills_artist_id_fkey;
ALTER TABLE public.special_skills ADD CONSTRAINT special_skills_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.tools_software DROP CONSTRAINT IF EXISTS tools_software_artist_id_fkey;
ALTER TABLE public.tools_software ADD CONSTRAINT tools_software_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.auditions DROP CONSTRAINT IF EXISTS auditions_creator_id_fkey;
ALTER TABLE public.auditions ADD CONSTRAINT auditions_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.professional_references DROP CONSTRAINT IF EXISTS professional_references_artist_id_fkey;
ALTER TABLE public.professional_references ADD CONSTRAINT professional_references_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Step 4: Update the handle_new_user function to insert into the unified profiles table.
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (
    id, full_name, email, role, category, experience_level, years_of_experience, status, created_at, updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email, 'artist', 'actor', 'beginner', 0, 'active', now(), now()
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user trigger when inserting into profiles: %', SQLERRM;
    RETURN NEW;
END;
$function$;

-- Step 5: Idempotently setup RLS policies for all relevant tables.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can delete their own profile." ON public.profiles;
CREATE POLICY "Users can delete their own profile." ON public.profiles FOR DELETE USING (auth.uid() = id);

ALTER TABLE public.education_training ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Education entries are public." ON public.education_training;
CREATE POLICY "Education entries are public." ON public.education_training FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage their own education entries." ON public.education_training;
CREATE POLICY "Users can manage their own education entries." ON public.education_training FOR ALL USING (auth.uid() = artist_id) WITH CHECK (auth.uid() = artist_id);

ALTER TABLE public.language_skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Language skills are public." ON public.language_skills;
CREATE POLICY "Language skills are public." ON public.language_skills FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage their own language skills." ON public.language_skills;
CREATE POLICY "Users can manage their own language skills." ON public.language_skills FOR ALL USING (auth.uid() = artist_id) WITH CHECK (auth.uid() = artist_id);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Media assets are public." ON public.media_assets;
CREATE POLICY "Media assets are public." ON public.media_assets FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage their own media assets." ON public.media_assets;
CREATE POLICY "Users can manage their own media assets." ON public.media_assets FOR ALL USING (auth.uid() = artist_id) WITH CHECK (auth.uid() = artist_id);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Projects are public." ON public.projects;
CREATE POLICY "Projects are public." ON public.projects FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage their own projects." ON public.projects;
CREATE POLICY "Users can manage their own projects." ON public.projects FOR ALL USING (auth.uid() = artist_id) WITH CHECK (auth.uid() = artist_id);

ALTER TABLE public.special_skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Skills are public." ON public.special_skills;
CREATE POLICY "Skills are public." ON public.special_skills FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage their own skills." ON public.special_skills;
CREATE POLICY "Users can manage their own skills." ON public.special_skills FOR ALL USING (auth.uid() = artist_id) WITH CHECK (auth.uid() = artist_id);

ALTER TABLE public.tools_software ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tools are public." ON public.tools_software;
CREATE POLICY "Tools are public." ON public.tools_software FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage their own tools." ON public.tools_software;
CREATE POLICY "Users can manage their own tools." ON public.tools_software FOR ALL USING (auth.uid() = artist_id) WITH CHECK (auth.uid() = artist_id);

ALTER TABLE public.professional_references ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "References are public." ON public.professional_references;
CREATE POLICY "References are public." ON public.professional_references FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage their own references." ON public.professional_references;
CREATE POLICY "Users can manage their own references." ON public.professional_references FOR ALL USING (auth.uid() = artist_id) WITH CHECK (auth.uid() = artist_id);
