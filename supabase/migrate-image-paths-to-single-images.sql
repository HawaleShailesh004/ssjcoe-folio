-- One-time: fix old /images/images/ URLs to /images/ (and hackathon paths to achievements/).
-- Run in Supabase SQL Editor if your DB still has the double "images" path.

-- Achievements: replace /images/images/ with /images/
UPDATE achievements
SET image_url = REPLACE(image_url, '/images/images/', '/images/')
WHERE image_url LIKE '/images/images/%';

-- Achievements: fix hackathon images that were in campus → they live in achievements/
UPDATE achievements
SET image_url = REPLACE(image_url, '/images/campus/Internal-Hackathon', '/images/achievements/Internal-Hackathon')
WHERE image_url LIKE '%/campus/Internal-Hackathon%';

-- Events: update images array elements (replace in each)
UPDATE events e
SET images = (
  SELECT array_agg(REPLACE(REPLACE(elm, '/images/images/', '/images/'), '/images/campus/Internal-Hackathon', '/images/achievements/Internal-Hackathon'))
  FROM unnest(e.images) AS elm
)
WHERE e.images IS NOT NULL AND array_length(e.images, 1) > 0
  AND EXISTS (SELECT 1 FROM unnest(e.images) AS elm WHERE elm LIKE '/images/images/%' OR elm LIKE '%/campus/Internal-Hackathon%');

-- Placements: photo_url
UPDATE placements
SET photo_url = REPLACE(photo_url, '/images/images/', '/images/')
WHERE photo_url LIKE '/images/images/%';

-- Faculty: photo_url
UPDATE faculty
SET photo_url = REPLACE(photo_url, '/images/images/', '/images/')
WHERE photo_url LIKE '/images/images/%';
