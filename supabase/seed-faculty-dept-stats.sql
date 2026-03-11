-- Seed faculty and dept_stats for Faculty and Departments pages.
-- Run in Supabase SQL Editor. Depends on existing departments (e.g. IT, CS, MECH).

INSERT INTO faculty
  (dept_id, name, designation, bio, specialization, education, email, is_hod)
VALUES
  (
    (SELECT id FROM departments WHERE code = 'IT'),
    'Dr. Rajesh Sharma',
    'Professor & HOD',
    'Dr. Sharma has over 15 years of experience in Machine Learning and IoT. He has published 12 research papers and holds 2 patents.',
    ARRAY['Machine Learning', 'IoT', 'Computer Vision'],
    'Ph.D. Computer Engineering, IIT Bombay',
    'hod.it@ssjcoe.edu.in',
    true
  ),
  (
    (SELECT id FROM departments WHERE code = 'IT'),
    'Prof. Anita Kulkarni',
    'Associate Professor',
    'Specializes in blockchain technology and distributed systems with 8 years of teaching experience.',
    ARRAY['Blockchain', 'Distributed Systems', 'Cloud Computing'],
    'M.Tech Computer Science, VJTI Mumbai',
    'a.kulkarni@ssjcoe.edu.in',
    false
  ),
  (
    (SELECT id FROM departments WHERE code = 'CS'),
    'Dr. Meena Patil',
    'Professor & HOD',
    'Expert in Natural Language Processing and AI with extensive industry experience before academia.',
    ARRAY['NLP', 'Artificial Intelligence', 'Data Science'],
    'Ph.D. Information Technology, University of Pune',
    'hod.cs@ssjcoe.edu.in',
    true
  );

-- Dept stats
INSERT INTO dept_stats
  (dept_id, year, faculty_count, student_count, labs_count, placement_rate, graduates_count)
VALUES
  ((SELECT id FROM departments WHERE code = 'IT'), 2024, 18, 480, 6, 92, 120),
  ((SELECT id FROM departments WHERE code = 'CS'), 2024, 15, 420, 5, 88, 110),
  ((SELECT id FROM departments WHERE code = 'MECH'), 2024, 20, 360, 8, 78, 90);
