
-- Create awards table for storing user awards and achievements
CREATE TABLE public.awards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id UUID NOT NULL,
  title TEXT NOT NULL,
  organization TEXT,
  year INTEGER,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;

-- Create policies for awards table
CREATE POLICY "Users can view their own awards" 
  ON public.awards 
  FOR SELECT 
  USING (artist_id = auth.uid());

CREATE POLICY "Users can create their own awards" 
  ON public.awards 
  FOR INSERT 
  WITH CHECK (artist_id = auth.uid());

CREATE POLICY "Users can update their own awards" 
  ON public.awards 
  FOR UPDATE 
  USING (artist_id = auth.uid());

CREATE POLICY "Users can delete their own awards" 
  ON public.awards 
  FOR DELETE 
  USING (artist_id = auth.uid());

-- Add trigger for updated_at timestamp
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.awards
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
