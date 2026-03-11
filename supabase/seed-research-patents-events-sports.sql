-- Seed data for Research, Patents, Events, Sports pages.
-- Run in Supabase SQL Editor after tables and RLS are set up.

-- Research papers
INSERT INTO research_papers (dept_id, title, authors, journal, year, category, abstract, citations, status)
VALUES
  ((SELECT id FROM departments WHERE code = 'IT'), 'Deep Learning for Medical Image Segmentation', ARRAY['Dr. R. Sharma', 'Prof. A. Kulkarni'], 'IEEE Transactions on Medical Imaging', 2023, 'Machine Learning', 'This paper presents a novel deep learning approach for medical image segmentation using U-Net architecture with attention mechanisms.', 12, 'approved'),
  ((SELECT id FROM departments WHERE code = 'CS'), 'Blockchain-based Supply Chain Management', ARRAY['Prof. S. Patil', 'Dr. M. Joshi'], 'Journal of Network and Computer Applications', 2023, 'Blockchain', 'We propose a decentralized supply chain management system leveraging smart contracts on Ethereum.', 8, 'approved');

-- Patents
INSERT INTO patents (dept_id, title, inventors, patent_status, year, description, status)
VALUES
  ((SELECT id FROM departments WHERE code = 'IT'), 'Smart Water Quality Monitoring System Using IoT', ARRAY['Dr. R. Sharma', 'Prof. V. Desai'], 'granted', 2023, 'An IoT-based system for real-time water quality monitoring with ML-based anomaly detection.', 'approved'),
  ((SELECT id FROM departments WHERE code = 'MECH'), 'Energy Efficient HVAC Control Algorithm', ARRAY['Prof. K. Nair'], 'filed', 2024, 'Novel control algorithm for HVAC systems reducing energy consumption by 30%.', 'approved');

-- Events
INSERT INTO events (dept_id, title, date, type, location, description, participants, year, is_official, status)
VALUES
  ((SELECT id FROM departments WHERE code = 'IT'), 'TechFest 2024', '2024-03-15', 'technical', 'Main Auditorium', 'Annual technical festival featuring hackathons, paper presentations, and project exhibitions.', 450, 2024, true, 'approved'),
  ((SELECT id FROM departments WHERE code = 'CS'), 'Code Sprint', '2024-02-10', 'technical', 'Computer Lab Block', '24-hour competitive coding event with participants from 15+ colleges.', 200, 2024, false, 'approved');

-- Sports
INSERT INTO sports_achievements (dept_id, title, sport, student_name, achievement_level, award, date, venue, year, status)
VALUES
  ((SELECT id FROM departments WHERE code = 'IT'), 'Gold Medal in 100m Sprint', 'Athletics', 'Rohan Mehta', 'state', 'Gold Medal - Maharashtra State Inter-College Athletics Championship', '2024-01-20', 'Pune Sports Complex', 2024, 'approved'),
  ((SELECT id FROM departments WHERE code = 'CS'), 'Chess Tournament Winner', 'Chess', 'Anjali Singh', 'national', '1st Place - All India Inter-Engineering Chess Championship', '2024-03-05', 'IIT Mumbai', 2024, 'approved');
