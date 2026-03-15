// ─── Content Status ───────────────────────────────────────────────────────────
export type ContentStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export type UserRole = 'hod' | 'superadmin' | 'platform_admin';

export type AchievementLevel = 'institute' | 'state' | 'national' | 'international';

export type EventType = 'technical' | 'cultural' | 'sports' | 'official' | 'workshop';

export type PatentStatus = 'filed' | 'published' | 'granted';

// ─── Department ───────────────────────────────────────────────────────────────
export interface Department {
  id: string;
  name: string;
  code: string; // e.g. 'IT', 'CS', 'MECH'
  hod_user_id?: string;
  is_active: boolean;
  created_at: string;
  vision?: string;
  mission?: string;
  intro?: string;
  established_year?: number;
}

// ─── User ─────────────────────────────────────────────────────────────────────
export interface AppUser {
  id: string;
  email: string;
  role: UserRole;
  dept_id?: string;
  name: string;
  created_at: string;
}

// ─── Placement ────────────────────────────────────────────────────────────────
export interface Placement {
  id: string;
  dept_id: string;
  student_name: string;
  company: string;
  role: string;
  package_lpa: number;
  year: number;
  batch?: string;
  location?: string;
  photo_url?: string;
  join_date?: string;
  email?: string;
  status: ContentStatus;
  rejection_reason?: string;
  submitted_date?: string;
  created_at: string;
  updated_at: string;
}

// ─── Research Paper ───────────────────────────────────────────────────────────
export interface ResearchPaper {
  id: string;
  dept_id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  category: string;
  doi?: string;
  pdf_url?: string;
  abstract: string;
  citations: number;
  published_date?: string;
  status: ContentStatus;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

// ─── Patent ───────────────────────────────────────────────────────────────────
export interface Patent {
  id: string;
  dept_id: string;
  title: string;
  inventors: string[];
  patent_number?: string;
  patent_status: PatentStatus;
  date?: string;
  certificate_url?: string;
  description?: string;
  category?: string;
  year?: number;
  status: ContentStatus;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

// ─── Event ────────────────────────────────────────────────────────────────────
export interface Event {
  id: string;
  dept_id: string;
  title: string;
  date: string;
  end_date?: string;
  time?: string;
  location: string;
  participants?: number;
  type: EventType;
  description: string;
  images: string[];
  organizer?: string;
  year: number;
  outcomes?: string;
  is_official: boolean;
  status: ContentStatus;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

// ─── Achievement ──────────────────────────────────────────────────────────────
export type AchievementType = "sports" | "technical" | "cultural" | "academic";

export interface Achievement {
  id: string;
  dept_id: string;
  title: string;
  achievement_type: AchievementType;
  sport?: string;
  student_name: string;
  achievement_level: AchievementLevel;
  award: string;
  date: string;
  venue?: string;
  image_url?: string;
  description?: string;
  year: number;
  status: ContentStatus;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

// ─── Faculty ──────────────────────────────────────────────────────────────────
export interface Faculty {
  id: string;
  dept_id: string;
  name: string;
  designation: string;
  photo_url?: string;
  bio?: string;
  specialization: string[];
  education?: string;
  email?: string;
  is_hod: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Department Stats ─────────────────────────────────────────────────────────
export interface DeptStats {
  id: string;
  dept_id: string;
  year: number;
  faculty_count: number;
  student_count: number;
  labs_count: number;
  placement_rate: number;
  graduates_count: number;
}

// ─── Audit Log ────────────────────────────────────────────────────────────────
export interface AuditLog {
  id: string;
  record_id: string;
  record_type: string;
  action: 'created' | 'updated' | 'deleted' | 'approved' | 'rejected' | 'submitted';
  actor_id: string;
  actor_role: UserRole;
  timestamp: string;
  notes?: string;
}

// ─── Featured Content ─────────────────────────────────────────────────────────
export interface FeaturedContent {
  id: string;
  record_id: string;
  record_type: string;
  pinned_by: string;
  pinned_at: string;
  order_position: number;
}
