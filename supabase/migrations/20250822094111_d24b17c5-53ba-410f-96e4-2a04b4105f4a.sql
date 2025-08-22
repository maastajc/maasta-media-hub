
-- Fix RLS policies for organizations table
DROP POLICY IF EXISTS "Users can create organizations" ON public.organizations;
DROP POLICY IF EXISTS "Public can view organizations" ON public.organizations;

-- Allow authenticated users to insert organizations where they are the creator
CREATE POLICY "Authenticated users can create organizations" 
ON public.organizations 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- Allow everyone to view all organizations publicly
CREATE POLICY "Everyone can view organizations" 
ON public.organizations 
FOR SELECT 
TO public
USING (true);

-- Create storage bucket for organization assets if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('org-assets', 'org-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for the org-assets bucket
CREATE POLICY "Anyone can view org assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'org-assets');

CREATE POLICY "Authenticated users can upload org assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'org-assets');

CREATE POLICY "Users can update their own org assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'org-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own org assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'org-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
