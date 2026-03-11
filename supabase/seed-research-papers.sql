-- =============================================================================
-- Seed: Research papers from src/data/research.ts → research_papers
-- =============================================================================
-- Run this in Supabase SQL Editor after:
--   - departments table exists and has rows (e.g. IT, CS, MECH, etc.)
--   - research_papers table exists with columns matching ResearchPaper type
--
-- Note: published_date column is type date; we store (year-01-01) from source year.
-- If research_papers is missing doi or pdf_url, run first:
--   ALTER TABLE research_papers ADD COLUMN IF NOT EXISTS doi text;
--   ALTER TABLE research_papers ADD COLUMN IF NOT EXISTS pdf_url text;
--
-- Optional: Clear existing seed research rows first (uncomment if needed):
--   DELETE FROM research_papers WHERE status = 'approved';
-- =============================================================================

-- Use IT department as default for all papers (source data has no dept; change code if needed)
INSERT INTO research_papers (
  dept_id,
  title,
  authors,
  journal,
  year,
  category,
  doi,
  pdf_url,
  abstract,
  citations,
  published_date,
  status
)
SELECT
  (SELECT id FROM departments WHERE code = 'IT' LIMIT 1),
  v.title,
  v.authors,
  v.journal,
  v.year::int,
  v.category,
  NULLIF(TRIM(v.doi), ''),
  NULLIF(NULLIF(TRIM(v.pdf_link), ''), '#'),
  v.abstract,
  v.citations,
  (v.year || '-01-01')::date,  /* published_date: column is date type; use first day of year */
  'approved'
FROM (VALUES
  (
    'A Review on Digital Image Watermarking Techniques using Neural Networks',
    ARRAY['Mangalagowri Gorbal', 'Dr. Ramesh D. Shelke', 'Dr. Manuj Joshi']::text[],
    'IOT with Smart Systems, Springer Lecture Notes in Networks and Systems',
    '2023',
    'Artificial Intelligence',
    '10.1007/978-981-99-3761-5_54',
    '#',
    'This paper presents a comprehensive review of digital image watermarking techniques that utilize neural networks. It explores various approaches, their robustness against attacks, and performance metrics, highlighting the integration of deep learning in watermarking security.',
    12,
    '14th March 2023'
  ),
  (
    'An image watermarking scheme: Combining the transform domain and deep learning modality with an improved Scrambling process',
    ARRAY['Mangalagowri Gorbal', 'Dr. Ramesh D. Shelke', 'Dr. Manuj Joshi']::text[],
    'International Journal of Computers and Applications',
    '2024',
    'Artificial Intelligence',
    '10.1080/1206212X.2024.2313301',
    '#',
    'This study proposes a novel image watermarking scheme that combines transform domain techniques with deep learning modalities. It introduces an improved scrambling process to enhance security and robustness against various image processing attacks.',
    4,
    '27th Jan, 2024'
  ),
  (
    'Robust image watermarking scheme with Transform Domain Technique on resisting Different attacks: Impact of Self-Improved Optimization Algorithm',
    ARRAY['Mangalagowri Gorbal', 'Dr. Ramesh D. Shelke', 'Dr. Manuj Joshi']::text[],
    'International Journal of Systems Assurance Engineering and Management, Springer',
    '2025',
    'Artificial Intelligence',
    '10.1007/s13198-024-02655-7',
    '#',
    'We present a robust image watermarking scheme leveraging transform domain techniques. The method incorporates a self-improved optimization algorithm to maximize imperceptibility and robustness against a wide range of geometric and non-geometric attacks.',
    0,
    '18th February 2025'
  ),
  (
    'The Role of Deep Learning in Credit Card Fraud Detection: A State-of-the-Art Review',
    ARRAY['Pranita N Sangit', 'Dr. Savita Sangam']::text[],
    'Cureus Journals',
    '2025',
    'Artificial Intelligence',
    NULL,
    '#',
    'Credit card fraud detection is a critical challenge in the financial sector. This review provides analysis of state-of-the-art deep learning techniques applied to credit card fraud detection, exploring their architectures, methodologies, and performance in real-world scenarios.',
    0,
    '10th September 2025'
  ),
  (
    'Sentiment Analysis Employing LSTM for Binary Classification of Social Media Texts',
    ARRAY['Dr. Savita Sangam', 'Pournima Anil Kharade']::text[],
    'International Journal of Computer Applications',
    '2025',
    'Machine Learning',
    NULL,
    '#',
    'This paper explores the application of Long Short-Term Memory (LSTM) networks for binary sentiment classification of social media texts, demonstrating improved accuracy over traditional methods.',
    0,
    'August 2025'
  ),
  (
    'Sales Forecasting Prediction Using Machine Learning',
    ARRAY['Pradip Alam', 'Dr. Savita Sangam', 'Pooja Ghude', 'Mansi Padekar']::text[],
    'Journal of Emerging Technologies and Innovative Research (JETIR)',
    '2024',
    'Machine Learning',
    NULL,
    '#',
    'A study on maximizing sales prediction accuracy using various machine learning algorithms, providing insights for better inventory and business management.',
    0,
    'June 2024'
  ),
  (
    'LeadForge Multifarious',
    ARRAY['Aakanksha Kalyani', 'Dr. Savita Sangam', 'Shubham Warke', 'Mitali Parkar']::text[],
    'Journal of Emerging Technologies and Innovative Research (JETIR)',
    '2024',
    'Cloud Computing',
    NULL,
    '#',
    'This paper presents LeadForge Multifarious, a comprehensive system design addressing modern challenges in lead generation and management using innovative technological solutions.',
    0,
    'July 2024'
  ),
  (
    'Most Persistent Feature Selection Method for Opinion Mining of Social Media Reviews',
    ARRAY['Dr. Savita Sangam', 'Subhash Shinde']::text[],
    'Information and Communication Technology for Competitive Strategies, Springer',
    '2018',
    'Data Science',
    NULL,
    '#',
    'The work in this paper develops a framework for opinion mining. It includes a novel feature selection method called Most Persistent Feature Selection (MPFS). MPFS method uses information gain of the features in the review documents.',
    6,
    '31st August 2018'
  )
) AS v (title, authors, journal, year, category, doi, pdf_link, abstract, citations, published_date);
