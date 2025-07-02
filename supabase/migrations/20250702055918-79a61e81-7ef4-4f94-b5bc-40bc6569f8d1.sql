
-- Fix the language_proficiency enum to include 'advanced' as a valid option
ALTER TYPE language_proficiency ADD VALUE IF NOT EXISTS 'advanced';
