// src/lib/images.ts
// All paths under public/images/ (campus, achievements, depts, faculty, recruiters)

const P = "/images";

// ─── Named images ──────────────────────────────────────────────────────────────
export const IMAGES = {
  // Logo & brand
  college_front: `${P}/college/ssjcoe-front.jpeg`,
  logo: `${P}/New-Logo.png`,
  favicon: `${P}/Favicon-100x100.png`,

  // Campus — hero & backgrounds
  campus_ict: `${P}/campus/ICT.jpg`,
  campus_sports: `${P}/campus/Sports-2025.jpg`,
  campus_sports_alt: `${P}/campus/Sports.jpg`,
  campus_ecell: `${P}/campus/E-cell-event-ASPIRO2025.jpg`,
  campus_ai: `${P}/campus/Training-program-on-AI.jpg`,
  campus_about: `${P}/campus/about-us-img.jpg`,
  campus_tree: `${P}/campus/Tree-plantation-drive.jpg`,
  campus_independence: `${P}/campus/Independence-day.jpg`,
  campus_admission: `${P}/campus/Informative-session-on-Admission-process-for-First-year-students-2025.jpg`,
  campus_gal4: `${P}/campus/gal4.webp`,

  // Events — specific real images
  event_techfest: `${P}/campus/1techfest24-25.jpeg`,
  event_techfest_oscillations: `${P}/campus/TECHFEST-OSCILLATIONS-EVENT---28th-February-2025-1.jpg`,
  event_odyssey: `${P}/campus/Odyssey-2024.jpg`,
  event_odyssey_alt: `${P}/campus/odyssey24.jpeg`,
  event_hackathon: `${P}/achievements/Internal-Hackathon-img.jpg`,
  event_hackathon_alt: `${P}/achievements/Internal-Hackathon_1.jpg`,
  event_shiv_jayanti: `${P}/campus/Shiv-Jayanti.jpg`,
  event_convocation: `${P}/campus/Degree-certificate-distribution-funcion-2024.jpg`,
  event_sports_week: `${P}/campus/KridaRatna-2024.jpg`,
  event_blood_donation: `${P}/campus/Blood-Donation-1.jpg`,
  event_tree_plant: `${P}/campus/Tree-Plantation.jpg`,
  event_cloud_workshop: `${P}/campus/workshop-on-mastering-cloud-3rd-17-feb-2-scaled.jpg`,
  event_algorhythm: `${P}/campus/ALGORHYTHM-Technical-events-by-ACES-on-28th-February-2025.jpg`,
  event_science_day: `${P}/campus/Moments-from-National-Science-Day-2025---exploring-ideas-beyond-boundaries.jpeg`,
  event_csi_project: `${P}/campus/CSI-PROJECT-COMPETITION.jpg`,
  event_poster_presentation: `${P}/campus/poster-presentation.jpg`,
  event_alumni_talk: `${P}/campus/Alumni-Talk.jpg`,
  event_datafication: `${P}/campus/Datafication-and-Analytics-13-2-2025.jpg`,
  event_engineers_day: `${P}/campus/Engineers-day1-scaled.jpg`,
  event_teachers_day: `${P}/campus/Teachers-day-celebration.jpg`,
  event_republic_day: `${P}/campus/Independence-day.jpg`,
  event_industrial_visit: `${P}/campus/Industrial-Visit-to-Maha-Mumbai-Metro-Operations-Control-Limited-MMMOCL-Kandivali-Mumbai-on-27th-September-2024.jpg`,
  event_stellar_presentation: `${P}/campus/Stellar-presentation-competition-15-10-2024.jpg`,
  event_addOn: `${P}/campus/ADD-ON-program-13-2-2025.jpg`,

  // Achievements — real award photos
  achievement_sih_grand_final: `${P}/achievements/New-SIH-GRAND-FINAL_1.jpg`,
  achievement_sih_grand_final2: `${P}/achievements/New-Grand-Final.jpg`,
  achievement_sih_winner: `${P}/achievements/WINNER-IN-GRAND-FINAL-SIH.jpg`,
  achievement_sih_technovate: `${P}/achievements/New-SIH_Tecknovate-For-India_2nd-Runnerup.jpg`,
  achievement_nec_iit: `${P}/achievements/New-Our-students-have-secured-a-position-in-the-Top-7-at-the-NEC-organised-by-IIT-Bombay-competing-among-4000-colleges-nationwide.jpg`,
  achievement_avishkar: `${P}/achievements/New-Our-SSJCOE-students-have-cleared-the-Zonal-round-and-been-selected-as-Finalist-in-the-prestigious-AVISHKAR-competition.jpg`,
  achievement_byte_pilots: `${P}/achievements/New-IT_Department-Team-Byte-Pilots-First-Prize-in-Futurepreneur-at-K.C.College-of-EnggThane.jpg`,
  achievement_mech_robotics: `${P}/achievements/New-Mechanical-Engineering-students-won-third-prize-at-Techno-connect-Robotics-Competition-at-University-of-Mumbai-kalyan-center-by-Janyu-Technologies-Pvt.-Ltd.jpg`,
  achievement_internal_hackathon: `${P}/achievements/Internal-Hackathon_1.jpg`,

  // Placement images
  placement_ceremony: `${P}/campus/Placement-1.jpg`,
  placement_top_1: `${P}/campus/Top-Recruitments-1.jpg`,
  placement_top_2: `${P}/campus/Top-Recruitments-2.jpg`,
  placement_top_3: `${P}/campus/Top-Recruitments-3.jpg`,
  placement_top_4: `${P}/campus/Top-Recruitments-4.jpg`,

  // People — leadership & principal
  principal: `${P}/campus/Uttara-Gogate.jpg`,
  president: `${P}/campus/Sagar-Shivajirao-Jondhale.jpg`,
  trustee: `${P}/campus/Devendra-Jondhale.jpg`,

  // Alumni photos (these were downloaded into faculty folder by scraper)
  alumni_rushank: `${P}/faculty/Rushank-Karekar.jpg`,
  alumni_shubham: `${P}/faculty/Shubham-Sharma.jpg`,
  alumni_amay: `${P}/faculty/Amay-Shinde.jpg`,
  alumni_aamir: `${P}/faculty/Aamir-Rajaram-Chavan.jpg`,
  alumni_isha: `${P}/faculty/Unknown-Girl.png`,

  // Labs
  lab_aiml_dbms: `${P}/campus/AIML-DBMS-Lab.jpeg`,
  lab_aiml_ml: `${P}/campus/AIML-ML-Lab.jpeg`,
  lab_entc_computer: `${P}/depts/EXTC-Computer-Lab-.jpeg`,
  lab_entc_microwave: `${P}/campus/Microwave-Lab-.jpeg`,
  lab_computer: `${P}/depts/Computer-LAB.jpg`,
  lab_generic_1: `${P}/campus/Lab-1.jpg`,
  lab_generic_2: `${P}/campus/Lab-2-img.jpg`,
} as const;

// ─── Dept images ───────────────────────────────────────────────────────────────
export const DEPT_IMAGES: Record<string, string> = {
  IT: `${P}/depts/Information-technology.jpg`,
  CS: `${P}/depts/Computerl-Engineering.jpg`,
  MECH: `${P}/depts/Mechanical-Engineering.jpg`,
  ENTC: `${P}/depts/Electronics-Telecomm.-Engineering.jpg`,
  CHEM: `${P}/depts/Chemical-Engineering.jpg`,
  AIML: `${P}/depts/AI-and-Machine-Learning.jpg`,
  HUMS: `${P}/depts/Humanities-Sciences.jpg`,
};

// ─── Recruiter logos ───────────────────────────────────────────────────────────
export const RECRUITER_LOGOS = [
  { name: "Godrej", logo: `${P}/recruiters/Godrej.jpg` },
  { name: "Infosys", logo: `${P}/recruiters/Infosys.jpg` },
  { name: "Wipro", logo: `${P}/recruiters/Wipro.jpg` },
  { name: "Tata", logo: `${P}/recruiters/Tata.jpg` },
  { name: "Capgemini", logo: `${P}/recruiters/Capgemini.jpg` },
  { name: "Accenture", logo: `${P}/recruiters/accenture.jpg` },
  { name: "L&T Infotech", logo: `${P}/recruiters/LT-Infotech.jpg` },
  { name: "Worley Parsons", logo: `${P}/recruiters/Worley-parsons.jpg` },
  { name: "NSE", logo: `${P}/recruiters/NSE.jpg` },
];

// ─── Event image map — title keyword → image path ─────────────────────────────
// Used by EventCard to auto-assign images based on event title
export const EVENT_IMAGE_MAP: { keywords: string[]; image: string }[] = [
  {
    keywords: ["techfest", "technical festival", "oscillations"],
    image: IMAGES.event_techfest,
  },
  {
    keywords: ["hacknova", "hackathon", "hack"],
    image: IMAGES.event_hackathon,
  },
  {
    keywords: ["odyssey", "cultural festival", "annual cultural"],
    image: IMAGES.event_odyssey,
  },
  { keywords: ["shiv jayanti"], image: IMAGES.event_shiv_jayanti },
  {
    keywords: ["convocation", "degree", "certificate"],
    image: IMAGES.event_convocation,
  },
  {
    keywords: ["sports week", "sports", "krida"],
    image: IMAGES.event_sports_week,
  },
  { keywords: ["blood donation"], image: IMAGES.event_blood_donation },
  {
    keywords: ["tree plantation", "plantation"],
    image: IMAGES.event_tree_plant,
  },
  {
    keywords: ["cloud", "workshop", "mastering"],
    image: IMAGES.event_cloud_workshop,
  },
  { keywords: ["algorhythm", "aces"], image: IMAGES.event_algorhythm },
  {
    keywords: ["science day", "national science"],
    image: IMAGES.event_science_day,
  },
  { keywords: ["csi", "project competition"], image: IMAGES.event_csi_project },
  {
    keywords: ["poster presentation"],
    image: IMAGES.event_poster_presentation,
  },
  {
    keywords: ["alumni", "expert talk", "guest lecture"],
    image: IMAGES.event_alumni_talk,
  },
  { keywords: ["datafication", "analytics"], image: IMAGES.event_datafication },
  { keywords: ["engineers day"], image: IMAGES.event_engineers_day },
  { keywords: ["teachers day"], image: IMAGES.event_teachers_day },
  {
    keywords: ["republic day", "independence"],
    image: IMAGES.event_republic_day,
  },
  {
    keywords: ["industrial visit", "visit"],
    image: IMAGES.event_industrial_visit,
  },
  { keywords: ["add-on", "addon", "embedded"], image: IMAGES.event_addOn },
];

// Normalize image URLs from DB (old /images/images/ or wrong folder) to current /images/ paths
export function normalizeImageUrl(
  url: string | null | undefined,
): string | null {
  if (!url || typeof url !== "string") return null;
  let s = url.replace(/\/images\/images\//g, "/images/");
  // Hackathon images live in achievements/, not campus/
  s = s.replace(
    /\/images\/campus\/Internal-Hackathon/g,
    "/images/achievements/Internal-Hackathon",
  );
  // Fix filename dashes that may be stored as Unicode (em/en dash) or URL-encoded
  s = s.replace(/\u2013|\u2014/g, "---");
  s = s.replace(/%E2%80%93|%E2%80%94/gi, "---");
  return s || null;
}

// Helper: get best image for an event by title matching
export function getEventImage(title: string): string {
  const lower = title.toLowerCase();
  for (const { keywords, image } of EVENT_IMAGE_MAP) {
    if (keywords.some((k) => lower.includes(k))) return image;
  }
  // Default fallback pool — deterministic by title hash
  const pool = [
    IMAGES.campus_ict,
    IMAGES.campus_ecell,
    IMAGES.campus_ai,
    IMAGES.campus_admission,
    IMAGES.campus_sports,
  ];
  const hash = title.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return pool[hash % pool.length];
}

// Helper: get achievement image by title matching
export function getAchievementImage(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("sih") || lower.includes("smart india"))
    return IMAGES.achievement_sih_grand_final;
  if (
    lower.includes("nec") ||
    lower.includes("iit bombay") ||
    lower.includes("entrepreneurship")
  )
    return IMAGES.achievement_nec_iit;
  if (lower.includes("avishkar")) return IMAGES.achievement_avishkar;
  if (lower.includes("byte pilots") || lower.includes("futurepreneur"))
    return IMAGES.achievement_byte_pilots;
  if (lower.includes("robotics") || lower.includes("techno connect"))
    return IMAGES.achievement_mech_robotics;
  if (lower.includes("hackathon")) return IMAGES.achievement_internal_hackathon;
  // Fallback pool
  const pool = [
    IMAGES.achievement_sih_grand_final,
    IMAGES.achievement_nec_iit,
    IMAGES.achievement_avishkar,
    IMAGES.achievement_byte_pilots,
  ];
  const hash = title.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return pool[hash % pool.length];
}
