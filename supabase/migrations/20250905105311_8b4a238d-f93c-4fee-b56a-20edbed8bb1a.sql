-- Add task request field to auditions table
ALTER TABLE public.auditions 
ADD COLUMN task_requirements TEXT;

-- Add media submission fields to audition_applications table  
ALTER TABLE public.audition_applications 
ADD COLUMN portfolio_links TEXT[],
ADD COLUMN media_urls TEXT[];

-- Add comments for documentation
COMMENT ON COLUMN public.auditions.task_requirements IS 'Optional field for organizers to request specific tasks, photos, or videos from applicants';
COMMENT ON COLUMN public.audition_applications.portfolio_links IS 'Array of portfolio URLs submitted by applicants';
COMMENT ON COLUMN public.audition_applications.media_urls IS 'Array of uploaded media file URLs from applicants';