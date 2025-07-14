
-- Update the media asset validation function to allow 4 images instead of 3
CREATE OR REPLACE FUNCTION public.validate_media_asset_limit()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  video_count INTEGER;
  photo_count INTEGER;
BEGIN
  -- Count existing videos for this user
  SELECT COUNT(*) INTO video_count
  FROM public.media_assets
  WHERE user_id = NEW.user_id AND is_video = true;
  
  -- Count existing photos for this user
  SELECT COUNT(*) INTO photo_count
  FROM public.media_assets
  WHERE user_id = NEW.user_id AND is_video = false;
  
  -- Check limits: 3 videos, 4 photos
  IF NEW.is_video = true AND video_count >= 3 THEN
    RAISE EXCEPTION 'User has reached the maximum limit of 3 videos';
  END IF;
  
  IF NEW.is_video = false AND photo_count >= 4 THEN
    RAISE EXCEPTION 'User has reached the maximum limit of 4 photos';
  END IF;
  
  RETURN NEW;
END;
$function$;
