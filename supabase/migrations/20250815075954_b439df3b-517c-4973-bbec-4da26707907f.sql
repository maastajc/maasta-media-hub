-- Create storage policies for media-assets bucket to allow event image uploads

-- Allow authenticated users to upload their own files to media-assets bucket
CREATE POLICY "Users can upload to media-assets bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'media-assets' 
  AND auth.uid() IS NOT NULL
);

-- Allow users to view files in media-assets bucket
CREATE POLICY "Users can view media-assets" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'media-assets');

-- Allow users to update their own files in media-assets bucket
CREATE POLICY "Users can update their own files in media-assets" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'media-assets' 
  AND auth.uid() IS NOT NULL
);

-- Allow users to delete their own files in media-assets bucket  
CREATE POLICY "Users can delete their own files in media-assets" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'media-assets' 
  AND auth.uid() IS NOT NULL
);