-- Add support for multiple ticket types and winning prize to events table
ALTER TABLE events ADD COLUMN ticket_types JSONB DEFAULT '[]'::jsonb;
ALTER TABLE events ADD COLUMN winning_prize DECIMAL(10,2);

-- Update event_registrations to support ticket type selection
ALTER TABLE event_registrations ADD COLUMN ticket_type_name TEXT;
ALTER TABLE event_registrations ADD COLUMN ticket_price DECIMAL(10,2);

-- Add index for better performance on ticket queries
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_user_id ON event_registrations(user_id);