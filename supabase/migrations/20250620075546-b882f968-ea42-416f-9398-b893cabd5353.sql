
-- Create storage bucket for audition media
INSERT INTO storage.buckets (id, name, public)
VALUES ('media-assets', 'media-assets', true);

-- Create policies for the media-assets bucket
CREATE POLICY "Users can upload their own media" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'media-assets' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view all media" ON storage.objects
FOR SELECT USING (bucket_id = 'media-assets');

CREATE POLICY "Users can update their own media" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'media-assets' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own media" ON storage.objects
FOR DELETE USING (
  bucket_id = 'media-assets' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
