-- Add support for multiple ticket types and winning prize to events table
ALTER TABLE events ADD COLUMN ticket_types JSONB DEFAULT '[]'::jsonb;
ALTER TABLE events ADD COLUMN winning_prize DECIMAL(10,2);

-- Update event_registrations to support ticket type selection
ALTER TABLE event_registrations ADD COLUMN ticket_type_name TEXT;
ALTER TABLE event_registrations ADD COLUMN ticket_price DECIMAL(10,2);