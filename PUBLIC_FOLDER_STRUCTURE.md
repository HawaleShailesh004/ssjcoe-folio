# Public folder structure (nested)

```
public/
├── file.svg
├── globe.svg
├── next.svg
├── vercel.svg
├── window.svg
│
└── images/
    ├── logo.png
    │
    ├── achievements/          (empty)
    │
    ├── college/
    │   ├── admission-session.jpg
    │   ├── ai-training.jpg
    │   ├── ecell-aspiro.jpg
    │   ├── ict.jpg
    │   ├── independence-day.jpg
    │   ├── sports.jpg
    │   └── tree-plantation.jpg
    │
    ├── depts/                  (empty)
    │
    ├── images/                 ← main scraped content (use /images/images/ in URLs)
    │   ├── Favicon-100x100.png
    │   ├── logo-1.jpg
    │   ├── logo-2.jpg
    │   ├── logo-3.jpg
    │   ├── logo-4.jpg
    │   ├── New-Logo.png
    │   │
    │   ├── achievements/
    │   │   ├── Grand-Final.jpg
    │   │   ├── Information-technology.jpg
    │   │   ├── Internal-Hackathon-img.jpg
    │   │   ├── Internal-Hackathon_1.jpg
    │   │   ├── New-Grand-Final.jpg
    │   │   ├── New-IT_Department-Team-Byte-Pilots-First-Prize-in-Futurepreneur-at-K.C.College-of-EnggThane.jpg
    │   │   ├── New-Our-SSJCOE-students-have-cleared-the-Zonal-round-and-been-selected-as-Finalist-in-the-prestigious-AVISHKAR-competition.jpg
    │   │   ├── New-Our-students-have-secured-a-position-in-the-Top-7-at-the-NEC-organised-by-IIT-Bombay-competing-among-4000-colleges-nationwide.jpg
    │   │   ├── New-SIH-GRAND-FINAL_1.jpg
    │   │   ├── New-SIH_Tecknovate-For-India_2nd-Runnerup.jpg
    │   │   ├── New-SIH_Tecnovate-For-India.jpg
    │   │   ├── SIH-GRAND-FINAL_1.jpg
    │   │   ├── SIH_GRAND-FINAL.jpg
    │   │   ├── SIH_Tecknovate-For-India_2nd-Runnerup.jpg
    │   │   ├── SIH_Tecnovate-For-India-img-1.jpg
    │   │   ├── Students-attending-the-expert-session-on-Space-Technology-–-27th-January-2026.jpg
    │   │   ├── Students-engaging-in-the-Technical-Talk-on-Space-Technology-–-27th-January-2026.jpg
    │   │   └── WINNER-IN-GRAND-FINAL-SIH.jpg
    │   │
    │   ├── campus/
    │   │   ├── 1techfest24-25.jpeg
    │   │   ├── about-us-img.jpg
    │   │   ├── ADD-ON-program-13-2-2025.jpg
    │   │   ├── AIML-ML-Lab.jpeg
    │   │   ├── E-cell-event-ASPIRO2025.jpg
    │   │   ├── ICT.jpg
    │   │   ├── LIBRARY.jpg
    │   │   ├── Sports.jpg
    │   │   ├── Sports-2025.jpg
    │   │   ├── Training-program-on-AI.jpg
    │   │   └── … (100+ more files)
    │   │
    │   ├── depts/
    │   │   ├── AI-and-Machine-Learning.jpg
    │   │   ├── Chemical-Engineering.jpg
    │   │   ├── Computerl-Engineering.jpg
    │   │   ├── Electronics-Telecomm.-Engineering.jpg
    │   │   ├── Information-technology.jpg
    │   │   ├── Mechanical-Engineering.jpg
    │   │   └── … (more)
    │   │
    │   ├── faculty/
    │   │   ├── Amay-Shinde.jpg
    │   │   ├── Shubham-Sharma.jpg
    │   │   └── … (more)
    │   │
    │   └── recruiters/
    │       ├── accenture.jpg
    │       ├── Capgemini.jpg
    │       ├── Godrej.jpg
    │       ├── Infosys.jpg
    │       ├── LT-Infotech.jpg
    │       ├── NSE.jpg
    │       ├── Tata.jpg
    │       ├── Wipro.jpg
    │       ├── Worley-parsons.jpg
    │       └── …
    │
    └── recruiters/             (empty)
```

**URLs:** Files under `public/images/images/` are served at **`/images/images/...`** (e.g. `/images/images/campus/ICT.jpg`).
