-- Create enum for booking status
CREATE TYPE booking_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id UUID NOT NULL,
  booker_id UUID NOT NULL,
  category TEXT NOT NULL,
  project_type TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  duration TEXT,
  budget DECIMAL(10,2),
  requirements TEXT,
  notes TEXT,
  status booking_status NOT NULL DEFAULT 'pending',
  technical_requirements TEXT,
  script_link TEXT,
  deliverables TEXT,
  deadline TIMESTAMP WITH TIME ZONE,
  num_shows INTEGER,
  rehearsal_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Artists can view bookings for them" 
ON public.bookings 
FOR SELECT 
USING (auth.uid() = artist_id);

CREATE POLICY "Bookers can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING (auth.uid() = booker_id);

CREATE POLICY "Users can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (auth.uid() = booker_id);

CREATE POLICY "Artists can update their bookings" 
ON public.bookings 
FOR UPDATE 
USING (auth.uid() = artist_id);

CREATE POLICY "Bookers can update their own bookings" 
ON public.bookings 
FOR UPDATE 
USING (auth.uid() = booker_id);

-- Create trigger for updated_at
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();