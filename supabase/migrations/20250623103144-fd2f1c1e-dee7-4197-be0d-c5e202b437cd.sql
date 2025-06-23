
-- Add email verification fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN email_verified BOOLEAN DEFAULT false,
ADD COLUMN email_verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN verification_token TEXT,
ADD COLUMN verification_token_expires_at TIMESTAMP WITH TIME ZONE;

-- Create email verification tokens table for better tracking
CREATE TABLE public.email_verification_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for email verification tokens
ALTER TABLE public.email_verification_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own verification tokens" 
  ON public.email_verification_tokens 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own verification tokens" 
  ON public.email_verification_tokens 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own verification tokens" 
  ON public.email_verification_tokens 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create function to generate verification token
CREATE OR REPLACE FUNCTION public.generate_email_verification_token(user_id_param UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  token TEXT;
  expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Generate a random token
  token := encode(gen_random_bytes(32), 'base64');
  -- Set expiration to 24 hours from now
  expires_at := now() + interval '24 hours';
  
  -- Insert the token
  INSERT INTO public.email_verification_tokens (user_id, token, expires_at)
  VALUES (user_id_param, token, expires_at);
  
  RETURN token;
END;
$$;

-- Create function to verify email token
CREATE OR REPLACE FUNCTION public.verify_email_token(token_param TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  verification_record RECORD;
BEGIN
  -- Find the token
  SELECT * INTO verification_record
  FROM public.email_verification_tokens
  WHERE token = token_param
  AND expires_at > now()
  AND used_at IS NULL;
  
  -- If token not found or expired
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Mark token as used
  UPDATE public.email_verification_tokens
  SET used_at = now()
  WHERE id = verification_record.id;
  
  -- Update user profile as verified
  UPDATE public.profiles
  SET email_verified = true, email_verified_at = now()
  WHERE id = verification_record.user_id;
  
  RETURN true;
END;
$$;
