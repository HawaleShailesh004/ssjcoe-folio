# Research Paper — SSJCOE Folio (Draft Content)

**Use this content in your final paper formatted per the IJRST template (Times New Roman, two columns, margins, etc.). Author names, affiliations, and emails are placeholders; replace with your team and institution.**

---

## Paper Title
**SSJCOE Folio: An Institutional Web Platform for Verified Record of Placements, Research, Patents, Events and Achievements**

---

## Authors (placeholder — replace with your details)
First Author*1, Second Author2, Third Author2, Fourth Author3  
*1Department, Shivajirao S. Jondhale College of Engineering, Dombivli, Maharashtra, India  
Example@example.com1  
2Department, Shivajirao S. Jondhale College of Engineering, Dombivli, Maharashtra, India  
Example@example.com2  
3Department, Shivajirao S. Jondhale College of Engineering, Dombivli, Maharashtra, India  
Example@example.com3  

---

## ABSTRACT

This paper describes the design and implementation of SSJCOE Folio, an institutional web platform for Shivajirao S. Jondhale College of Engineering (SSJCOE), Dombivli. The platform serves as a verified, single-point record of placements, research papers, patents, events, achievements, faculty, and departments. It is built using Next.js with the App Router and React Server Components, a modern UI stack including React, Tailwind CSS, and shadcn/ui with Radix primitives, and Supabase as the backend for PostgreSQL data and optional storage. The system uses a strict design system (Saffron and Stone colour palette only) and supports filtering, pagination, and role-based admin workflows. The paper outlines the architecture, methods and materials used, key features, and conclusions.

**Keywords:** Institutional website, Next.js, React, Supabase, placements, research, engineering college, SSJCOE  

---

## I. INTRODUCTION

Graduate programmes in Science, Engineering and Technology often require a verified, centralized record of institutional outcomes such as placements, research publications, patents, events, and achievements. SSJCOE Folio is an institutional web platform developed for Shivajirao S. Jondhale College of Engineering, Dombivli, to provide such a verified record in one place.

The platform presents placements with company, role, package (LPA), year, and department; research papers with title, authors, journal, year, category, DOI, and abstract; patents with title, inventors, patent status, and certificate links; events with date, type, location, and description; achievements with type, level, award, and student details; faculty with designation, specialization, and links to their papers and patents; and departments with vision, mission, and per-department statistics. All content is approval-gated (status: approved) and sourced from a Supabase (PostgreSQL) backend.

The organization of this document is as follows. Section II describes the methods and materials, including the technology stack and architecture. Section III presents the results and discussion of the implemented features. Section IV concludes the paper.

---

## II. METHODS AND MATERIAL

### A. Technology Stack

The project uses the following technologies, as specified in the codebase:

- **Framework:** Next.js 16 with App Router and React Server Components.
- **Front-end:** React 19, Tailwind CSS 4, shadcn/ui and Radix UI components.
- **Back-end and data:** Supabase (PostgreSQL); environment variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for client access.
- **Forms and validation:** React Hook Form with Zod.
- **Charts and UX:** Recharts, Embla Carousel, Framer Motion, Sonner (toast notifications).

No other backend or database is used for the main data; Supabase is the single source.

### B. Design System

A strict colour system is enforced in the codebase: only Saffron and Stone are used. Primary accent is Saffron (#E8820C); neutrals use a Stone scale (e.g. stone-950 for headings, stone-800 for body). Status colours (e.g. success, warning) are used only for data states. Blue, green, purple and similar decorative colours are explicitly excluded.

### C. Data Model and Backend

Data is stored in Supabase with the following main entities (as reflected in the TypeScript types and lib modules):

- **placements** — student_name, company, role, package_lpa, year, dept_id, status (e.g. approved).
- **research_papers** — title, authors (array), journal, year, category, doi, abstract, citations, status.
- **patents** — title, inventors (array), patent_number, patent_status (filed | published | granted), dept_id, status.
- **events** — title, date, end_date, location, type (technical, cultural, sports, official, workshop), description, images, dept_id, status.
- **achievements** — title, achievement_type (sports, technical, cultural, academic), student_name, achievement_level (institute, state, national, international), award, date, dept_id, status.
- **faculty** — name, designation, photo_url, specialization (array), is_hod, dept_id.
- **departments** — name, code, vision, mission, intro, established_year, is_active.
- **dept_stats** — per-department, per-year aggregates (e.g. faculty_count, student_count, placement_rate).

All public-facing listings filter by `status = 'approved'` where applicable. Placements are ordered by package_lpa descending; research and events by year or date; patents by created_at.

### D. Application Structure

- **Routes (App Router):** Home (`/`), Placements (`/placements`), Research (`/research`), Patents (`/patents`), Events (`/events`), Achievements (`/achievements`), Faculty (`/faculty`), Departments (`/departments`, plus `/departments/[code]` for department detail), About (`/about`), Contact (`/contact`). Admin and superadmin routes are not linked from the public header and are accessed via separate URLs.
- **Components:** Layout (Header, Footer), shared (e.g. PageHero, Logo, FilterBar, PaginationBar), and section-specific clients (e.g. PlacementsClient, ResearchClient, EventsClient, FacultyClient) with modals for detail view where applicable.
- **Libraries:** Data-fetching and filtering logic in `src/lib` (placements, research, patents, events, achievements, faculty, departments, stats); Supabase client in `src/lib/supabase.ts`; shared types in `src/types`.

### E. Placement Filtering and Statistics

Placements support filters: year, dept_id, min_package, max_package. Landing-page statistics are computed from Supabase: total placements count, average package, highest package, counts of research papers, patents, events, and achievements. Top placements (e.g. top four by package) and placement years are fetched for the home page and placement section.

### F. Pagination and UX

A custom hook `usePagination` is used for client-side pagination of list data (e.g. page size 12). Server-side data is fetched via the lib functions; filtering and pagination are applied as per each section (e.g. placements use year, department, package range).

---

## III. RESULTS AND DISCUSSION

### A. Implemented Features

The platform delivers:

1. **Home page:** Hero section, recruiter section, stats (placements, avg/highest package, research count, patents, events, achievements), upcoming events, top placements, departments grid, achievements strip, student projects section, testimonials, recruiters, vision-mission section, and call-to-action. Vision and mission text are as stated in the codebase (premier institution, quality technical education, innovation, ethical values, social responsibility).
2. **Placements:** List with filters (year, department, package range), sort by package (LPA), and placement detail modal.
3. **Research:** List of approved research papers with category and year filters, and research detail modal.
4. **Patents:** List of approved patents with detail modal.
5. **Events:** List of events (e.g. with EventCard); upcoming events fetched by date.
6. **Achievements:** List with achievement cards and imagery mapped via `getAchievementImage`.
7. **Faculty:** Faculty list with cards; faculty papers and patents fetched by author/inventor name from research_papers and patents tables.
8. **Departments:** Grid of departments and department detail pages with code-based routing; department summary (placements, research, patents, events, achievements, faculty counts) and optional dept_stats.
9. **About and Contact:** Dedicated pages as per routes.
10. **Metadata and SEO:** Root layout provides title (“SSJCOE Folio - A verified record of excellence”), description (placements, research, patents, events, achievements), keywords (SSJCOE, placements, research, engineering college, Jondhale, Dombivli), favicon, and OpenGraph fields.

### B. Admin and Deployment

The README states that admin is not linked from the public site; login is at a secret URL (e.g. `/admin/login`). Public header is hidden on `/admin` and `/superadmin`. Deployment is supported via Vercel with the same Supabase environment variables; alternatively `npm run build` and `npm start` can be used.

### C. Assets and Branding

Logo is an inline SVG (S mark and “SSJCOE FOLIO” wordmark) in the Header and Footer. Favicon is the S mark on saffron. Runtime images are under `public/images/` and mapped in `src/lib/images.ts` (e.g. campus, departments, events, achievements, recruiters).

---

## IV. CONCLUSION

SSJCOE Folio implements a single institutional web platform for Shivajirao S. Jondhale College of Engineering, Dombivli, consolidating placements, research papers, patents, events, achievements, faculty, and departments with a Supabase-backed, approval-gated data model. The stack (Next.js 16, React 19, Tailwind CSS 4, shadcn/ui, Supabase) and a strict Saffron-and-Stone design system provide a consistent, maintainable foundation. The platform is suitable for deployment as the college’s official folio site and can be extended with additional sections or admin features as required by the institution.

---

## V. REFERENCES

[1] Next.js Documentation. “App Router.” https://nextjs.org/docs  
[2] Supabase. “JavaScript Client.” https://supabase.com/docs/reference/javascript  
[3] Tailwind CSS. “Documentation.” https://tailwindcss.com/docs  
[4] Radix UI. “Primitives.” https://www.radix-ui.com/primitives  
[5] Shivajirao S. Jondhale College of Engineering. Institutional information. Dombivli, Maharashtra, India.

---

*Note: Format this document according to the IJRST template (two columns, margins Top/Bottom/Left/Right 1.7 cm, column spacing 1.27 cm, Times New Roman, font sizes as in Table I, level-1/2/3 headings as specified). Replace author names, affiliations, and emails with actual contributors and institution. Add or adjust references as per your institution’s requirements.*
