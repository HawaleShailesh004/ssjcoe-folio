-- Real faculty data (scraped from official site). Run after migrate-departments-vision-mission.sql

-- Clear existing faculty first
DELETE FROM faculty;

-- ── IT Department ─────────────────────────────────────────────────────────────
INSERT INTO faculty (dept_id, name, designation, specialization, education, email, is_hod) VALUES
((SELECT id FROM departments WHERE code='IT'), 'Dr. Savita Sangam',               'HOD, Associate Professor', ARRAY['Information Technology','Software Engineering'],       'Ph.D. | M.E.',  'hod.it@ssjcoe.edu.in',          true),
((SELECT id FROM departments WHERE code='IT'), 'Dr. Gorbal Mangalagowri Rameshchandra', 'Associate Professor', ARRAY['Computer Engineering','Programming'],           'Ph.D. | M.E.',  'g.ramesh@ssjcoe.edu.in',        false),
((SELECT id FROM departments WHERE code='IT'), 'Prof. Khaire Prajkta Prakash',    'Assistant Professor',      ARRAY['Information Technology'],                            'M.E. | B.E.',   'p.khaire@ssjcoe.edu.in',        false),
((SELECT id FROM departments WHERE code='IT'), 'Prof. Narkhede Deepali Atul',     'Assistant Professor',      ARRAY['Information Technology'],                            'M.E. | B.E.',   'd.narkhede@ssjcoe.edu.in',      false),
((SELECT id FROM departments WHERE code='IT'), 'Prof. Devmane Arti Mahavir',      'Assistant Professor',      ARRAY['Information Technology'],                            'M.E. | B.E.',   'a.devmane@ssjcoe.edu.in',       false),
((SELECT id FROM departments WHERE code='IT'), 'Prof. Anuja Chavhan',             'Assistant Professor',      ARRAY['Information Technology'],                            'M.E. | B.E.',   'a.chavhan@ssjcoe.edu.in',       false),
((SELECT id FROM departments WHERE code='IT'), 'Prof. Priyanka Saxena',           'Assistant Professor',      ARRAY['Information Technology'],                            'M.E. | B.E.',   'p.saxena@ssjcoe.edu.in',        false);

-- ── CS Department ─────────────────────────────────────────────────────────────
INSERT INTO faculty (dept_id, name, designation, photo_url, specialization, education, email, is_hod) VALUES
((SELECT id FROM departments WHERE code='CS'), 'Dr. Uttara Gogate',             'Principal, Associate Professor', '/images/campus/Uttara-Gogate.jpg', ARRAY['Computer Engineering','Academic Administration'], 'Ph.D. | M.E.',  'principal@ssjcoe.edu.in',   false),
((SELECT id FROM departments WHERE code='CS'), 'Dr. Saroja T.V.',               'HOD, Associate Professor',       null, ARRAY['Machine Learning','AI','Computer Networks'],         'Ph.D. | M.E.',  'hod.cs@ssjcoe.edu.in',      true),
((SELECT id FROM departments WHERE code='CS'), 'Dr. K.K. Tripathi',             'Assistant Professor',            null, ARRAY['Cybersecurity','Distributed Computing'],             'Ph.D. | M.E.',  'kk.tripathi@ssjcoe.edu.in', false),
((SELECT id FROM departments WHERE code='CS'), 'Prof. Pallavi Chandratre',       'Assistant Professor',            null, ARRAY['Computer Engineering'],                             'M.E. | B.E.',   'p.chandratre@ssjcoe.edu.in',false),
((SELECT id FROM departments WHERE code='CS'), 'Prof. Diksha Bhave',            'Assistant Professor',            null, ARRAY['Computer Engineering'],                             'M.E. | B.E.',   'd.bhave@ssjcoe.edu.in',     false),
((SELECT id FROM departments WHERE code='CS'), 'Prof. Reena Deshmukh',          'Assistant Professor',            null, ARRAY['Computer Engineering'],                             'M.E. | B.E.',   'r.deshmukh@ssjcoe.edu.in',  false),
((SELECT id FROM departments WHERE code='CS'), 'Prof. Deveshree Wankhede',      'Assistant Professor',            null, ARRAY['Computer Engineering'],                             'M.E. | B.E.',   'd.wankhede@ssjcoe.edu.in',  false),
((SELECT id FROM departments WHERE code='CS'), 'Prof. Manisha Sonawane',        'Assistant Professor',            null, ARRAY['Computer Engineering'],                             'M.E. | B.E.',   'm.sonawane@ssjcoe.edu.in',  false),
((SELECT id FROM departments WHERE code='CS'), 'Prof. Samita Patil',            'Assistant Professor',            null, ARRAY['Computer Engineering'],                             'M.E. | B.E.',   's.patil@ssjcoe.edu.in',     false),
((SELECT id FROM departments WHERE code='CS'), 'Prof. Pallavi Bharambe',        'Assistant Professor',            null, ARRAY['Computer Engineering'],                             'M.E. | B.E.',   'p.bharambe@ssjcoe.edu.in',  false),
((SELECT id FROM departments WHERE code='CS'), 'Prof. Shweta Patil',            'Assistant Teacher',              null, ARRAY['Computer Engineering'],                             'M.E. | B.E.',   'sw.patil@ssjcoe.edu.in',    false),
((SELECT id FROM departments WHERE code='CS'), 'Prof. Shubhangi Patil',         'Assistant Professor',            null, ARRAY['Computer Engineering'],                             'M.E. | B.E.',   'sh.patil@ssjcoe.edu.in',    false),
((SELECT id FROM departments WHERE code='CS'), 'Prof. Ruchira Malunjkar',       'Assistant Professor',            null, ARRAY['Computer Engineering'],                             'M.E. | B.E.',   'r.malunjkar@ssjcoe.edu.in', false),
((SELECT id FROM departments WHERE code='CS'), 'Prof. Smita Jagtap',            'Assistant Professor',            null, ARRAY['Computer Engineering'],                             'M.E. | B.E.',   's.jagtap@ssjcoe.edu.in',    false),
((SELECT id FROM departments WHERE code='CS'), 'Prof. Shital Patil',            'Assistant Professor',            null, ARRAY['Computer Engineering'],                             'M.E. | B.E.',   'st.patil@ssjcoe.edu.in',    false);

-- ── MECH Department ───────────────────────────────────────────────────────────
INSERT INTO faculty (dept_id, name, designation, specialization, education, email, is_hod) VALUES
((SELECT id FROM departments WHERE code='MECH'), 'Dr. Varsha Magar',             'HOD, Assistant Professor', ARRAY['Mechanical Engineering','Manufacturing'],         'Ph.D. | M.E.',  'hod.mech@ssjcoe.edu.in',        true),
((SELECT id FROM departments WHERE code='MECH'), 'Prof. Suvarna P. Ghonmode',   'Assistant Professor',      ARRAY['Mechanical Engineering'],                         'M.E. | B.E.',   's.ghonmode@ssjcoe.edu.in',      false),
((SELECT id FROM departments WHERE code='MECH'), 'Prof. Tushar B. Pokharkar',   'Assistant Professor',      ARRAY['Mechanical Engineering','CAD/CAM'],               'M.E. | B.E.',   't.pokharkar@ssjcoe.edu.in',     false),
((SELECT id FROM departments WHERE code='MECH'), 'Prof. Nagesh G. Kondra',      'Assistant Professor',      ARRAY['Mechanical Engineering'],                         'M.E. | B.E.',   'n.kondra@ssjcoe.edu.in',        false),
((SELECT id FROM departments WHERE code='MECH'), 'Prof. Shreya N. Sawaibahadure','Assistant Professor',     ARRAY['Mechanical Engineering'],                         'M.E. | B.E.',   's.sawaibahadure@ssjcoe.edu.in', false),
((SELECT id FROM departments WHERE code='MECH'), 'Prof. Vipul V. Kulkarni',     'Assistant Professor',      ARRAY['Mechanical Engineering','Thermal'],               'M.E. | M.E.',   'v.kulkarni@ssjcoe.edu.in',      false),
((SELECT id FROM departments WHERE code='MECH'), 'Prof. Shepal Sonyabapu Popat','Assistant Professor',      ARRAY['Mechanical Engineering'],                         'M.E. | B.E.',   's.popat@ssjcoe.edu.in',         false);

-- ── ENTC Department ───────────────────────────────────────────────────────────
INSERT INTO faculty (dept_id, name, designation, specialization, education, email, is_hod) VALUES
((SELECT id FROM departments WHERE code='ENTC'), 'Dr. Vishwas Iyer',            'HOD, Professor',           ARRAY['Wireless Communications','5G','Signal Processing'],'Ph.D. | M.E.',  'hod.entc@ssjcoe.edu.in',        true),
((SELECT id FROM departments WHERE code='ENTC'), 'Prof. R. Gokhale',            'Associate Professor',      ARRAY['Electronics','Antenna Design'],                   'M.E. | B.E.',   'r.gokhale@ssjcoe.edu.in',       false),
((SELECT id FROM departments WHERE code='ENTC'), 'Prof. K. Pillai',             'Assistant Professor',      ARRAY['Telecommunication','Networks'],                   'M.E. | B.E.',   'k.pillai@ssjcoe.edu.in',        false);

-- ── CHEM Department ───────────────────────────────────────────────────────────
INSERT INTO faculty (dept_id, name, designation, specialization, education, email, is_hod) VALUES
((SELECT id FROM departments WHERE code='CHEM'), 'Prof. Nitin Satao',           'HOD, Assistant Professor', ARRAY['Process Engineering','Chemical Reaction Engineering'],'M.E. | B.E.',  'hod.chem@ssjcoe.edu.in',        true),
((SELECT id FROM departments WHERE code='CHEM'), 'Dr. Pradnya K. Ingle',        'Associate Professor',      ARRAY['Mass Transfer','Process Design'],                 'Ph.D. | M.E.',  'p.ingle@ssjcoe.edu.in',         false),
((SELECT id FROM departments WHERE code='CHEM'), 'Prof. Hemlata Nehete',        'Assistant Professor',      ARRAY['Chemical Engineering'],                           'M.E. | B.E.',   'h.nehete@ssjcoe.edu.in',        false),
((SELECT id FROM departments WHERE code='CHEM'), 'Prof. Manisha Gonate',        'Assistant Professor',      ARRAY['Chemical Engineering'],                           'M.E. | B.E.',   'm.gonate@ssjcoe.edu.in',        false),
((SELECT id FROM departments WHERE code='CHEM'), 'Prof. Girish Deshmukh',       'Assistant Professor',      ARRAY['Chemical Engineering'],                           'M.E. | B.E.',   'g.deshmukh@ssjcoe.edu.in',      false),
((SELECT id FROM departments WHERE code='CHEM'), 'Prof. Neha Agarwal',          'Assistant Professor',      ARRAY['Chemical Engineering'],                           'M.E. | B.E.',   'n.agarwal@ssjcoe.edu.in',       false),
((SELECT id FROM departments WHERE code='CHEM'), 'Prof. Priyanka Waghulade',    'Assistant Professor',      ARRAY['Chemical Engineering'],                           'M.E. | B.E.',   'p.waghulade@ssjcoe.edu.in',     false),
((SELECT id FROM departments WHERE code='CHEM'), 'Prof. Dhanashree Kumthekar',  'Assistant Professor',      ARRAY['Chemical Engineering'],                           'M.E. | B.E.',   'd.kumthekar@ssjcoe.edu.in',     false),
((SELECT id FROM departments WHERE code='CHEM'), 'Prof. Kunal Chavan',          'Assistant Professor',      ARRAY['Chemical Engineering'],                           'M.E. | B.E.',   'k.chavan@ssjcoe.edu.in',        false);

-- ── AIML Department ───────────────────────────────────────────────────────────
INSERT INTO faculty (dept_id, name, designation, specialization, education, email, is_hod) VALUES
((SELECT id FROM departments WHERE code='AIML'), 'Prof. Aishwarya Desai',       'HOD, Assistant Professor', ARRAY['Artificial Intelligence','Machine Learning','Deep Learning'],'M.Tech | B.E.','hod.aiml@ssjcoe.edu.in', true);

-- ── Update MECH intro (correct content) ────────────────────────────────────────
UPDATE departments SET
  intro = 'Established in 1998 for the undergraduate course with an intake of 60, the Department of Mechanical Engineering has well-equipped laboratories, a CAD/CAM lab with 3D modelling software, and a huge workshop. The department has MOUs with CEMS, Republic Motors, Cad Centre, Volmet, and MECH-INS. Student chapter MESA organises technical activities, and faculty have secured research grants from University of Mumbai.'
WHERE code = 'MECH';
