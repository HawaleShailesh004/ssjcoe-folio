-- Wire real image paths to achievements, events, placements, and faculty.
-- Run in Supabase SQL Editor. Adjust table/column names if your schema differs.
-- Tables expected: achievements (image_url), events (images text[]), placements (photo_url), faculty, departments.

-- ─── Achievements: set image_url from real scraped images ─────────────────────
UPDATE achievements
SET image_url = '/images/achievements/New-SIH-GRAND-FINAL_1.jpg'
WHERE title ILIKE '%Smart India Hackathon%' OR title ILIKE '%SIH%';

UPDATE achievements
SET image_url = '/images/achievements/New-Our-students-have-secured-a-position-in-the-Top-7-at-the-NEC-organised-by-IIT-Bombay-competing-among-4000-colleges-nationwide.jpg'
WHERE title ILIKE '%IIT Bombay%' OR title ILIKE '%NEC%';

UPDATE achievements
SET image_url = '/images/achievements/New-Our-SSJCOE-students-have-cleared-the-Zonal-round-and-been-selected-as-Finalist-in-the-prestigious-AVISHKAR-competition.jpg'
WHERE title ILIKE '%AVISHKAR%';

UPDATE achievements
SET image_url = '/images/achievements/New-IT_Department-Team-Byte-Pilots-First-Prize-in-Futurepreneur-at-K.C.College-of-EnggThane.jpg'
WHERE title ILIKE '%Byte Pilots%' OR title ILIKE '%Futurepreneur%';

UPDATE achievements
SET image_url = '/images/achievements/New-Mechanical-Engineering-students-won-third-prize-at-Techno-connect-Robotics-Competition-at-University-of-Mumbai-kalyan-center-by-Janyu-Technologies-Pvt.-Ltd.jpg'
WHERE title ILIKE '%Robotics%' OR title ILIKE '%Techno Connect%';

-- ─── Events: set images array for matching titles ────────────────────────────
UPDATE events
SET images = ARRAY['/images/campus/1techfest24-25.jpeg']
WHERE title ILIKE '%Technical Festival%' OR title ILIKE '%TechFest%';

UPDATE events
SET images = ARRAY['/images/campus/Internal-Hackathon-img.jpg']
WHERE title ILIKE '%HackNova%' OR title ILIKE '%Hackathon%';

UPDATE events
SET images = ARRAY['/images/campus/Odyssey-2024.jpg']
WHERE title ILIKE '%Cultural%' OR title ILIKE '%Odyssey%';

UPDATE events
SET images = ARRAY['/images/campus/KridaRatna-2024.jpg']
WHERE title ILIKE '%Sports Week%';

UPDATE events
SET images = ARRAY['/images/campus/workshop-on-mastering-cloud-3rd-17-feb-2-scaled.jpg']
WHERE type = 'workshop' AND (images IS NULL OR images = '{}');

-- ─── Placements: wire alumni photos to student names (optional) ─────────────
UPDATE placements
SET photo_url = '/images/faculty/Shubham-Sharma.jpg'
WHERE student_name ILIKE '%Shubham Sharma%';

UPDATE placements
SET photo_url = '/images/faculty/Amay-Shinde.jpg'
WHERE student_name ILIKE '%Amay Shinde%';

UPDATE placements
SET photo_url = '/images/faculty/Aamir-Rajaram-Chavan.jpg'
WHERE student_name ILIKE '%Aamir%' AND student_name ILIKE '%Chavan%';

-- ─── Faculty: real HOD/Principal names and principal photo ───────────────────
-- IT HOD: Dr. Savita Sangam (from crawled content)
UPDATE faculty
SET name = 'Dr. Savita Sangam', designation = 'HOD, Associate Professor'
WHERE dept_id = (SELECT id FROM departments WHERE code = 'IT') AND is_hod = true;

-- Principal: Dr. Uttara Gogate (add if not exists; adjust columns to match your faculty table)
INSERT INTO faculty (dept_id, name, designation, photo_url, bio, specialization, education, email, is_hod)
SELECT
  (SELECT id FROM departments WHERE code = 'CS'),
  'Dr. Uttara Gogate',
  'Principal, Associate Professor',
  '/images/campus/Uttara-Gogate.jpg',
  'Dr. Uttara Gogate is the Principal of SSJCOE, Dombivli. She leads the institution with a focus on academic excellence, research, and industry collaboration.',
  ARRAY['Computer Engineering', 'Academic Administration'],
  'Ph.D. | M.E. Computer Engineering',
  'principal@ssjcoe.edu.in',
  false
WHERE NOT EXISTS (
  SELECT 1 FROM faculty WHERE email = 'principal@ssjcoe.edu.in'
);

-- CHEM HOD: Prof. Nitin Satao (from crawled content)
UPDATE faculty
SET name = 'Prof. Nitin Satao', designation = 'HOD, Assistant Professor'
WHERE dept_id = (SELECT id FROM departments WHERE code = 'CHEM') AND is_hod = true;
