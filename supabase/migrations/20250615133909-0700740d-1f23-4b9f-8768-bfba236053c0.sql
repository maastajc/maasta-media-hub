
-- Enable trigram support for efficient text searching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create a GIN index on the 'tags' column for fast array searching
CREATE INDEX IF NOT EXISTS idx_auditions_tags_gin ON public.auditions USING gin (tags);

-- Create a GIN index on the 'location' column using trigrams for fast 'ilike' text searching
CREATE INDEX IF NOT EXISTS idx_auditions_location_gin ON public.auditions USING gin (location gin_trgm_ops);
