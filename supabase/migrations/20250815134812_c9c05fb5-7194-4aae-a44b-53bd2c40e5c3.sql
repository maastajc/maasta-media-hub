-- Create payments table for tracking PhonePe payments
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_id UUID NULL,
  audition_id UUID NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'cancelled')),
  transaction_id TEXT NULL,
  phonepe_order_id TEXT NOT NULL UNIQUE,
  payment_method TEXT NOT NULL DEFAULT 'phonepe',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT check_event_or_audition CHECK (
    (event_id IS NOT NULL AND audition_id IS NULL) OR 
    (event_id IS NULL AND audition_id IS NOT NULL)
  )
);

-- Enable Row Level Security
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies for payments table
CREATE POLICY "Users can view their own payments" 
ON public.payments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all payments" 
ON public.payments 
FOR ALL 
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Add payment_required and payment_amount columns to events table
ALTER TABLE public.events 
ADD COLUMN payment_required BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN payment_amount DECIMAL(10,2) NULL;

-- Add payment_required and payment_amount columns to auditions table  
ALTER TABLE public.auditions
ADD COLUMN payment_required BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN payment_amount DECIMAL(10,2) NULL;