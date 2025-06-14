
-- Enable RLS and define policies for the 'auditions' table
ALTER TABLE public.auditions ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist to ensure idempotency
DROP POLICY IF EXISTS "Public can view open auditions" ON public.auditions;
DROP POLICY IF EXISTS "Creators can manage their own auditions" ON public.auditions;

-- Policy: Allow anyone to view auditions that are marked as 'open'.
CREATE POLICY "Public can view open auditions"
  ON public.auditions
  FOR SELECT
  USING (status = 'open');

-- Policy: Allow creators to perform any action (create, view, update, delete) on their own auditions.
CREATE POLICY "Creators can manage their own auditions"
  ON public.auditions
  FOR ALL
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);


-- Enable RLS and define policies for the 'audition_applications' table
ALTER TABLE public.audition_applications ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist
DROP POLICY IF EXISTS "Artists can manage their own applications" ON public.audition_applications;
DROP POLICY IF EXISTS "Creators can view applications for their auditions" ON public.audition_applications;
DROP POLICY IF EXISTS "Creators can update status on applications for their auditions" ON public.audition_applications;


-- Policy: Allow artists to manage their own applications.
CREATE POLICY "Artists can manage their own applications"
  ON public.audition_applications
  FOR ALL
  USING (auth.uid() = artist_id)
  WITH CHECK (auth.uid() = artist_id);

-- Policy: Allow audition creators to view applications submitted for their auditions.
CREATE POLICY "Creators can view applications for their auditions"
  ON public.audition_applications
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.auditions
      WHERE auditions.id = audition_applications.audition_id AND auditions.creator_id = auth.uid()
    )
  );

-- Policy: Allow audition creators to update the status of applications for their auditions.
CREATE POLICY "Creators can update status on applications for their auditions"
    ON public.audition_applications
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.auditions
            WHERE auditions.id = audition_applications.audition_id AND auditions.creator_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.auditions
            WHERE auditions.id = audition_applications.audition_id AND auditions.creator_id = auth.uid()
        )
    );


-- Enable RLS and define policies for the 'events' table
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist
DROP POLICY IF EXISTS "Public can view all events" ON public.events;
DROP POLICY IF EXISTS "Creators can manage their own events" ON public.events;

-- Policy: Allow anyone to view any event.
CREATE POLICY "Public can view all events"
  ON public.events
  FOR SELECT
  USING (true);

-- Policy: Allow creators to manage their own events.
CREATE POLICY "Creators can manage their own events"
  ON public.events
  FOR ALL
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);


-- Enable RLS and define policies for the 'event_attendees' table
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist
DROP POLICY IF EXISTS "Users can manage their own attendance" ON public.event_attendees;
DROP POLICY IF EXISTS "Event creators can view attendees" ON public.event_attendees;

-- Policy: Allow users to manage their own event attendance records.
CREATE POLICY "Users can manage their own attendance"
  ON public.event_attendees
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Allow event creators to view all attendees for their events.
CREATE POLICY "Event creators can view attendees"
  ON public.event_attendees
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_attendees.event_id AND events.creator_id = auth.uid()
    )
  );
