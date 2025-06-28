
-- Add organizer_notes column to audition_applications table
ALTER TABLE public.audition_applications 
ADD COLUMN organizer_notes TEXT;
