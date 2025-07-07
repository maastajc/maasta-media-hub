
-- Fix the storage bucket policies for artist_media bucket
-- First, let's make sure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('artist_media', 'artist_media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can upload their own media" ON storage.objects;
DROP POLICY IF EXISTS "Users can view all media" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own media" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own media" ON storage.objects;

-- Create new comprehensive policies for artist_media bucket
CREATE POLICY "Allow authenticated users to upload to artist_media" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'artist_media' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow public read access to artist_media" ON storage.objects
FOR SELECT USING (bucket_id = 'artist_media');

CREATE POLICY "Allow users to update their own files in artist_media" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'artist_media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Allow users to delete their own files in artist_media" ON storage.objects
FOR DELETE USING (
  bucket_id = 'artist_media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
