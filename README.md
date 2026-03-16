# SSJCOE Folio

**A verified record of excellence.**  
Institutional site for **Shivajirao S. Jondhale College of Engineering, Dombivli** — placements, research, patents, events, achievements, faculty, and departments in one place.

---

## Tech stack

| Layer      | Stack |
|-----------|--------|
| Framework | Next.js 16 (App Router, React Server Components) |
| UI        | React 19, Tailwind CSS 4, shadcn/ui + Radix |
| Data      | Supabase (Postgres, optional storage) |
| Forms     | React Hook Form, Zod |
| Charts / UX | Recharts, Embla Carousel, Framer Motion, Sonner |

Design system: **Saffron + Stone** only (see `src/app/globals.css`). No blue/green/purple etc.

---

## Project structure

```
jondhale-folio/
├── src/
│   ├── app/                    # Routes (App Router)
│   │   ├── layout.tsx         # Root layout, metadata, Header/Footer
│   │   ├── page.tsx           # Home (hero, stats, events, placements, etc.)
│   │   ├── placements/        # Placements list + filters
│   │   ├── research/          # Research papers
│   │   ├── patents/           # Patents
│   │   ├── events/            # Events
│   │   ├── achievements/      # Achievements
│   │   ├── faculty/           # Faculty
│   │   ├── departments/       # Departments list + [code] detail
│   │   ├── about/             # About SSJCOE
│   │   └── contact/           # Contact
│   ├── components/
│   │   ├── layout/            # Header, Footer
│   │   ├── shared/            # PageHero, Logo, FilterBar, PaginationBar, etc.
│   │   ├── landing/           # HeroSection, StatsSection, RecruitersSection, etc.
│   │   ├── placements/        # PlacementsClient, PlacementDetailModal
│   │   ├── research/          # ResearchClient, ResearchDetailModal
│   │   ├── patents/           # PatentsClient, PatentDetailModal
│   │   ├── events/            # EventsClient, EventCard
│   │   ├── achievements/      # AchievementsClient, AchievementCard
│   │   ├── faculty/           # FacultyClient, FacultyCard
│   │   └── departments/       # DepartmentsGrid, DepartmentPlacementsGrid, etc.
│   ├── lib/                   # Data helpers, images, utils
│   │   ├── images.ts          # IMAGES, DEPT_IMAGES, getEventImage, etc.
│   │   ├── stats.ts
│   │   ├── placements.ts
│   │   ├── research.ts
│   │   ├── patents.ts
│   │   ├── events.ts
│   │   ├── achievements.ts
│   │   ├── faculty.ts
│   │   └── departments.ts
│   ├── hooks/                 # usePagination, etc.
│   └── types/                 # Shared TypeScript types
├── public/
│   ├── favicon.svg            # Official S-mark favicon
│   └── images/                # Campus, depts, events, achievements, recruiters
├── .env.local                 # Not committed — Supabase (and other) keys
└── package.json
```

---

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** (or yarn/pnpm)
- **Supabase** project (for placements, research, patents, events, achievements, faculty, departments)

---

## Environment variables

Create `.env.local` in the project root (never commit it):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Add any other keys your app needs (e.g. admin auth). All `.env*` files are in `.gitignore`.

---

## Getting started

**Install dependencies**

```bash
npm install
```

**Run development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Build for production**

```bash
npm run build
npm start
```

**Lint**

```bash
npm run lint
```

---

## Deployment

- **Vercel**: Connect the repo; default Next.js build works. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in project settings.
- **Other**: `npm run build` then run `npm start` or serve the `.next` output with a Node server.

---

## Admin panel

- Admin is **not** linked from the public site (no “Admin” in header/footer).
- Login is at a **secret URL** (e.g. `/admin/login`), shared only with judges/faculty/admin.
- On `/admin` and `/superadmin` routes, the public `Header` is hidden.

---

## Assets and images

- **Runtime images**: `public/images/` — mapped in `src/lib/images.ts` (`IMAGES`, `DEPT_IMAGES`, `getEventImage`, `getAchievementImage`).
- **Logo**: Inline SVG in `src/components/shared/Logo.tsx` (S mark + SSJCOE FOLIO wordmark). Used in Header and Footer.
- **Favicon**: `public/favicon.svg` (S mark on saffron). Set in `src/app/layout.tsx` metadata.

---

## License

Private — SSJCOE / institutional use.
