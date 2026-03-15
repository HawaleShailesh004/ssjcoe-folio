-- Seed upcoming events for landing page: set some events to future dates
-- Run this in Supabase SQL Editor (or via migration) so "Upcoming events" section shows data.

-- Mark some events as upcoming by updating their dates
UPDATE events SET date = '2026-04-02' WHERE title ILIKE '%Conference%';
UPDATE events SET date = '2026-04-16' WHERE title ILIKE '%Poster Presentation%';
