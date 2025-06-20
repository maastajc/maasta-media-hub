
-- Update the existing events table to match the full requirements
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS date_start timestamp with time zone,
ADD COLUMN IF NOT EXISTS date_end timestamp with time zone,
ADD COLUMN IF NOT EXISTS is_online boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS ticket_type text DEFAULT 'free' CHECK (ticket_type IN ('free', 'paid')),
ADD COLUMN IF NOT EXISTS ticket_limit integer,
ADD COLUMN IF NOT EXISTS registration_deadline timestamp with time zone,
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'published' CHECK (status IN ('published', 'draft', 'cancelled')),
ADD COLUMN IF NOT EXISTS is_talent_needed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS organizer_contact text;

-- Update existing event_date column to be date_start if date_start is null
UPDATE public.events 
SET date_start = event_date 
WHERE date_start IS NULL AND event_date IS NOT NULL;

-- Create event_registrations table for tracking user registrations
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  ticket_id uuid NOT NULL DEFAULT gen_random_uuid(),
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  payment_status text DEFAULT 'n/a' CHECK (payment_status IN ('success', 'pending', 'failed', 'n/a')),
  confirmation_email_sent boolean DEFAULT false,
  participant_name text,
  participant_email text,
  participant_phone text,
  notes text,
  status text DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'waitlist'))
);

-- Enable RLS on event_registrations
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for event_registrations
CREATE POLICY "Users can view their own registrations" 
  ON public.event_registrations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own registrations" 
  ON public.event_registrations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own registrations" 
  ON public.event_registrations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Event organizers can view registrations for their events"
  ON public.event_registrations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.events e 
      WHERE e.id = event_registrations.event_id 
      AND e.creator_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON public.event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_events_date_start ON public.events(date_start);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);

-- Create a function to check if an event is full
CREATE OR REPLACE FUNCTION public.is_event_full(event_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  event_limit integer;
  current_registrations integer;
BEGIN
  -- Get the ticket limit for the event
  SELECT ticket_limit INTO event_limit
  FROM public.events
  WHERE id = event_id_param;
  
  -- If no limit is set, event is never full
  IF event_limit IS NULL THEN
    RETURN false;
  END IF;
  
  -- Count current confirmed registrations
  SELECT COUNT(*) INTO current_registrations
  FROM public.event_registrations
  WHERE event_id = event_id_param 
  AND status = 'confirmed';
  
  -- Return true if at or over capacity
  RETURN current_registrations >= event_limit;
END;
$$;

-- Create a function to get event registration stats
CREATE OR REPLACE FUNCTION public.get_event_stats(event_id_param uuid)
RETURNS TABLE (
  total_registrations bigint,
  confirmed_registrations bigint,
  cancelled_registrations bigint,
  is_full boolean
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_registrations,
    COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_registrations,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_registrations,
    public.is_event_full(event_id_param) as is_full
  FROM public.event_registrations
  WHERE event_id = event_id_param;
END;
$$;
