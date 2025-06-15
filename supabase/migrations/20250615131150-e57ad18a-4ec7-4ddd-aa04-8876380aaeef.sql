
-- Create a composite index on the auditions table
-- This will speed up queries that filter by status and order by creation date, which is common on the auditions page.
CREATE INDEX IF NOT EXISTS idx_auditions_status_created_at ON public.auditions (status, created_at DESC);
