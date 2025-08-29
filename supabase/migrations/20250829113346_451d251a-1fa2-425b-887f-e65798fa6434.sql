
-- Create an enum for notification types
CREATE TYPE notification_type AS ENUM ('audition', 'booking', 'networking', 'event');

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Optional fields for linking to related entities
  related_id UUID, -- Can link to audition_id, booking_id, event_id, etc.
  related_type TEXT -- Type of related entity (audition, booking, event, connection)
);

-- Add RLS policies for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only view their own notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read/unread)
CREATE POLICY "Users can update their own notifications"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- System can insert notifications for any user
CREATE POLICY "System can create notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER handle_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Enable realtime for notifications
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create index for better performance
CREATE INDEX idx_notifications_user_id_created_at ON public.notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_user_id_unread ON public.notifications(user_id, is_read) WHERE is_read = false;
