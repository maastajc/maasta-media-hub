
-- Enable RLS on tables (this is safe to run even if already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audition_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Anyone can view open auditions" ON public.auditions;
DROP POLICY IF EXISTS "Anyone can view active profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create auditions" ON public.auditions;
DROP POLICY IF EXISTS "Users can update own auditions" ON public.auditions;
DROP POLICY IF EXISTS "Users can delete own auditions" ON public.auditions;
DROP POLICY IF EXISTS "Artists can view own applications" ON public.audition_applications;
DROP POLICY IF EXISTS "Creators can view applications for their auditions" ON public.audition_applications;
DROP POLICY IF EXISTS "Artists can create applications" ON public.audition_applications;
DROP POLICY IF EXISTS "Creators can update applications for their auditions" ON public.audition_applications;

-- Profiles policies - users can view all active profiles but only edit their own
CREATE POLICY "Anyone can view active profiles" ON public.profiles
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Auditions policies - anyone can view open auditions, creators can manage their own
CREATE POLICY "Anyone can view open auditions" ON public.auditions
  FOR SELECT USING (status = 'open');

CREATE POLICY "Users can create auditions" ON public.auditions
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update own auditions" ON public.auditions
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete own auditions" ON public.auditions
  FOR DELETE USING (auth.uid() = creator_id);

-- Audition applications policies - artists can view their own, creators can view applications for their auditions
CREATE POLICY "Artists can view own applications" ON public.audition_applications
  FOR SELECT USING (auth.uid() = artist_id);

CREATE POLICY "Creators can view applications for their auditions" ON public.audition_applications
  FOR SELECT USING (
    auth.uid() IN (
      SELECT creator_id FROM public.auditions WHERE id = audition_id
    )
  );

CREATE POLICY "Artists can create applications" ON public.audition_applications
  FOR INSERT WITH CHECK (auth.uid() = artist_id);

CREATE POLICY "Creators can update applications for their auditions" ON public.audition_applications
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT creator_id FROM public.auditions WHERE id = audition_id
    )
  );
