-- Create work_links table to store user's work showcase links
CREATE TABLE public.work_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  work_title TEXT NOT NULL,
  work_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.work_links ENABLE ROW LEVEL SECURITY;

-- Create policies for work_links
CREATE POLICY "Users can view their own work links" 
ON public.work_links 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own work links" 
ON public.work_links 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own work links" 
ON public.work_links 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own work links" 
ON public.work_links 
FOR DELETE 
USING (auth.uid() = user_id);

-- Allow public read access for viewing profiles
CREATE POLICY "Work links are publicly viewable" 
ON public.work_links 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_work_links_updated_at
BEFORE UPDATE ON public.work_links
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();