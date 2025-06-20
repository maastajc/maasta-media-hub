
-- Enable RLS on auditions table (if not already enabled)
ALTER TABLE public.auditions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view open auditions" ON public.auditions;
DROP POLICY IF EXISTS "Users can create auditions" ON public.auditions;
DROP POLICY IF EXISTS "Users can update their own auditions" ON public.auditions;

-- Create RLS policies for auditions (public read access)
CREATE POLICY "Anyone can view open auditions" ON public.auditions
FOR SELECT USING (status = 'open');

CREATE POLICY "Users can create auditions" ON public.auditions
FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own auditions" ON public.auditions
FOR UPDATE USING (auth.uid() = creator_id);

-- Enable RLS on events table (if not already enabled)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view published events" ON public.events;
DROP POLICY IF EXISTS "Users can create events" ON public.events;
DROP POLICY IF EXISTS "Users can update their own events" ON public.events;

-- Create RLS policies for events (public read access)
CREATE POLICY "Anyone can view published events" ON public.events
FOR SELECT USING (status = 'published');

CREATE POLICY "Users can create events" ON public.events
FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own events" ON public.events
FOR UPDATE USING (auth.uid() = creator_id);

-- Enable RLS on audition_applications table (if not already enabled)
ALTER TABLE public.audition_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own applications" ON public.audition_applications;
DROP POLICY IF EXISTS "Users can create applications" ON public.audition_applications;
DROP POLICY IF EXISTS "Audition creators can view applications for their auditions" ON public.audition_applications;

-- Create RLS policies for audition applications
CREATE POLICY "Users can view their own applications" ON public.audition_applications
FOR SELECT USING (auth.uid() = artist_id);

CREATE POLICY "Users can create applications" ON public.audition_applications
FOR INSERT WITH CHECK (auth.uid() = artist_id);

CREATE POLICY "Audition creators can view applications for their auditions" ON public.audition_applications
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.auditions 
    WHERE auditions.id = audition_applications.audition_id 
    AND auditions.creator_id = auth.uid()
  )
);

-- Fix the get_unique_categories function
CREATE OR REPLACE FUNCTION public.get_unique_categories()
RETURNS SETOF text
LANGUAGE sql
STABLE
AS $function$
  SELECT DISTINCT category::text
  FROM public.auditions
  WHERE category IS NOT NULL AND category <> '' AND status = 'open'
  ORDER BY category;
$function$;

-- Create function to get unique event categories
CREATE OR REPLACE FUNCTION public.get_unique_event_categories()
RETURNS SETOF text
LANGUAGE sql
STABLE
AS $function$
  SELECT DISTINCT category::text
  FROM public.events
  WHERE category IS NOT NULL AND category <> '' AND status = 'published'
  ORDER BY category;
$function$;
