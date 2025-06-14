
-- Enable RLS and define policies for the 'profiles' table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist to ensure idempotency
DROP POLICY IF EXISTS "Public can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.profiles;

-- Policy: Allow public read access to all profiles.
CREATE POLICY "Public can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Policy: Allow users to manage their own profile.
CREATE POLICY "Users can manage their own profile"
  ON public.profiles
  FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Enable RLS and define policies for 'education_training'
ALTER TABLE public.education_training ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view education and training" ON public.education_training;
DROP POLICY IF EXISTS "Users can manage their own education and training" ON public.education_training;
CREATE POLICY "Public can view education and training" ON public.education_training FOR SELECT USING (true);
CREATE POLICY "Users can manage their own education and training" ON public.education_training FOR ALL USING (auth.uid() = artist_id) WITH CHECK (auth.uid() = artist_id);

-- Enable RLS and define policies for 'language_skills'
ALTER TABLE public.language_skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view language skills" ON public.language_skills;
DROP POLICY IF EXISTS "Users can manage their own language skills" ON public.language_skills;
CREATE POLICY "Public can view language skills" ON public.language_skills FOR SELECT USING (true);
CREATE POLICY "Users can manage their own language skills" ON public.language_skills FOR ALL USING (auth.uid() = artist_id) WITH CHECK (auth.uid() = artist_id);

-- Enable RLS and define policies for 'media_assets'
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view media assets" ON public.media_assets;
DROP POLICY IF EXISTS "Users can manage their own media assets" ON public.media_assets;
CREATE POLICY "Public can view media assets" ON public.media_assets FOR SELECT USING (true);
CREATE POLICY "Users can manage their own media assets" ON public.media_assets FOR ALL USING (auth.uid() = artist_id) WITH CHECK (auth.uid() = artist_id);

-- Enable RLS and define policies for 'projects'
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view projects" ON public.projects;
DROP POLICY IF EXISTS "Users can manage their own projects" ON public.projects;
CREATE POLICY "Public can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Users can manage their own projects" ON public.projects FOR ALL USING (auth.uid() = artist_id) WITH CHECK (auth.uid() = artist_id);

-- Enable RLS and define policies for 'special_skills'
ALTER TABLE public.special_skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view special skills" ON public.special_skills;
DROP POLICY IF EXISTS "Users can manage their own special skills" ON public.special_skills;
CREATE POLICY "Public can view special skills" ON public.special_skills FOR SELECT USING (true);
CREATE POLICY "Users can manage their own special skills" ON public.special_skills FOR ALL USING (auth.uid() = artist_id) WITH CHECK (auth.uid() = artist_id);

-- Enable RLS and define policies for 'tools_software'
ALTER TABLE public.tools_software ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view tools and software" ON public.tools_software;
DROP POLICY IF EXISTS "Users can manage their own tools and software" ON public.tools_software;
CREATE POLICY "Public can view tools and software" ON public.tools_software FOR SELECT USING (true);
CREATE POLICY "Users can manage their own tools and software" ON public.tools_software FOR ALL USING (auth.uid() = artist_id) WITH CHECK (auth.uid() = artist_id);
