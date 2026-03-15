-- Add vision, mission, intro, established_year to departments
ALTER TABLE departments
  ADD COLUMN IF NOT EXISTS vision text,
  ADD COLUMN IF NOT EXISTS mission text,
  ADD COLUMN IF NOT EXISTS intro text,
  ADD COLUMN IF NOT EXISTS established_year integer;

-- IT
UPDATE departments SET
  vision = 'To be recognized as a premier institution providing quality IT education, producing globally competent professionals capable of meeting technological challenges and contributing to societal development.',
  mission = 'To impart quality technical education through innovative teaching-learning processes, fostering research and innovation, developing professionals with technical competence, ethical values, and social responsibility.',
  intro = 'Established in 1999, the Department of Information Technology has 24 years of glorious history. The department conducts under-graduate and Honours certification programmes. Our highly skilled faculty are dedicated to quality education through minor/major projects, theory lessons, and practical sessions.',
  established_year = 1999
WHERE code = 'IT';

-- CS
UPDATE departments SET
  vision = 'To be a centre of excellence in Computer Engineering education that produces industry-ready professionals equipped with technical knowledge, ethical values, and problem-solving capabilities.',
  mission = 'To provide comprehensive computer engineering education emphasizing design, development and maintenance of computer systems, emerging technologies like AI/ML and cybersecurity, and real-world industry exposure.',
  intro = 'Established in 1994 with initial intake of 60, the Department of Computer Engineering currently offers 90 UG seats. The department emphasizes core subjects alongside emerging techniques like machine learning, AI, and cybersecurity.',
  established_year = 1994
WHERE code = 'CS';

-- MECH
UPDATE departments SET
  vision = 'To be a leading mechanical engineering department producing competent professionals who can design, develop and maintain engineering systems while contributing to sustainable industrial development.',
  mission = 'To provide quality mechanical engineering education through well-equipped laboratories, industry MOUs with companies like Godrej and L&T, and expert lectures ensuring industrial exposure and placement opportunities.',
  intro = 'Established in 1998 with intake of 60, the Department of Mechanical Engineering has well-equipped labs, a CAD-CAM lab with 3D modelling software, and a huge workshop. The department has MOUs with CEMS, Republic Motors, Cad Centre, Volmet, and MECH-INS.',
  established_year = 1998
WHERE code = 'MECH';

-- ENTC
UPDATE departments SET
  vision = 'To be a centre of excellence in Electronics and Telecommunication Engineering producing professionals capable of designing cutting-edge communication systems that shape the connected world.',
  mission = 'To provide quality ENTC education through well-equipped laboratories, expert lectures, add-on programs, project competitions, and industry exposure covering 5G, IoT, embedded systems, and communication engineering.',
  intro = 'Established in 1994 with sanctioned intake of 60, the Department of Electronics & Telecommunication covers communication systems, consumer electronics, IoT, and signal processing. The department prepares students for an industry where 5G and beyond are being developed.',
  established_year = 1994
WHERE code = 'ENTC';

-- CHEM
UPDATE departments SET
  vision = 'To impart quality chemical engineering education creating competent and ethically strong professionals with capabilities of accepting new challenges in the chemical and process industries.',
  mission = 'To provide application-based chemical engineering education through state-of-art laboratories, workshops, seminars, and professional guidance connecting students with prospective employers and competitive exam preparation.',
  intro = 'Started its meritorious journey in 1994, the Department of Chemical Engineering moulds young minds with excellence in chemical engineering and technology. The periodically updated curriculum imparts technical knowledge complemented by an application-based environment in state-of-art laboratories.',
  established_year = 1994
WHERE code = 'CHEM';

-- AIML
UPDATE departments SET
  vision = 'To be a pioneering AI & Machine Learning department at the forefront of artificial intelligence education, producing professionals who revolutionize industries and solve complex problems through intelligent systems.',
  mission = 'To offer a comprehensive AI/ML curriculum equipping students with knowledge for real-world challenges, skill-development programs, and opportunities in technical competitions and research, supported by the CSI Student Chapter and AMSA student forum.',
  intro = 'Established in AY 2021-22 with intake of 30 students, the Department of AI & Machine Learning is at the cutting edge of technical education. The department has fully equipped laboratories, offers Honours Degree programs, and maintains the CSI Student Chapter and AMSA student forum.',
  established_year = 2021
WHERE code = 'AIML';
