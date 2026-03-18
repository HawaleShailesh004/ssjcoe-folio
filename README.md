# SSJCOE Folio

**A verified record of excellence**

**Live:** `https://ssjcoe-folio.vercel.app`

[![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-Saffron%20%26%20Stone-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%7C%20Auth%20%7C%20Storage-3ECF8E?logo=supabase)](https://supabase.com/)
[![RLS](https://img.shields.io/badge/Security-Row%20Level%20Security-0f172a)](https://supabase.com/docs/guides/database/postgres/row-level-security)
[![shadcn/ui](https://img.shields.io/badge/UI-shadcn%2Fui-111827)](https://ui.shadcn.com/)
[![Framer Motion](https://img.shields.io/badge/Animations-Framer%20Motion-DB2777?logo=framer)](https://www.framer.com/motion/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel)](https://vercel.com/)

A web-based institutional credibility showcase platform for **Shivajirao S. Jondhale College of Engineering, Dombivli**. It presents verified placements, research, patents, events, achievements, and faculty across six departments, with a role-based admin panel and a four-state content workflow. Built for recruiters, aspirants, and NAAC auditors who need a single source of truth.

---

## Description

SSJCOE Folio is the official showcase and verification layer for the college’s academic and extracurricular outcomes. It gives:

- **Recruiters** — Filtered placement records, company-wise and department-wise views.
- **Aspirants** — Transparent view of research, patents, events, and achievements.
- **NAAC / auditors** — Approved, auditable records with an audit log of admin actions.

The public site shows only **approved** content; Row-Level Security (RLS) in PostgreSQL enforces this. Admins (HOD and Principal) manage content through a protected panel with draft → pending → approved/rejected workflow.

---

## Features

### Public interface

| Feature | Description |
|--------|-------------|
| **Placements** | Company-wise and department-wise placement data with filters and trends. |
| **Research** | Published papers with journal, category, and author details. |
| **Patents** | Patents with status, inventors, and filing details. |
| **Events** | Events with type, date, location, and media (banner, report). |
| **Achievements** | Student/team achievements (technical, sports, cultural, academic) with proofs. |
| **Faculty** | Department-wise faculty profiles with photo, education, and designation. |
| **Departments** | Six departments with overview and department-specific data. |
| **Detail modals** | Row-level detail modals and pagination on list pages. |

### Admin panel

| Feature | Description |
|--------|-------------|
| **Role-based access** | **HOD** — data entry for own department; **Principal** — approval authority (superadmin). |
| **Content workflow** | Draft → Pending → Approved / Rejected; only approved records appear on the public site. |
| **CRUD** | Create, edit, delete for placements, research, patents, events, achievements, faculty. |
| **File uploads** | PDFs and images via Supabase Storage (proofs, certificates, headshots, banners). |
| **Bulk import** | CSV import for placement data. |
| **Approvals** | Principal approves/rejects pending items from a single queue. |
| **Audit log** | All admin actions logged (actor, action, table, record, timestamp). |
| **Route protection** | Middleware enforces login and role; HOD cannot access superadmin routes. |

---

## Tech stack

| Layer | Technology |
|-------|-------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS — custom “Saffron & Stone” design (stone palette + saffron `#E8820C`) |
| **Backend / DB** | Supabase (PostgreSQL, Auth, Storage, RLS) |
| **UI** | shadcn/ui, Framer Motion |
| **Hosting** | Vercel |

---

## Project structure

Key folders only:

```
jondhale-folio/
├── public/
│   └── images/              # Static institutional images
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # Landing
│   │   ├── layout.tsx       # Root layout
│   │   ├── about/           # About page
│   │   ├── contact/         # Contact page
│   │   ├── placements/     # Public placements
│   │   ├── research/       # Public research
│   │   ├── patents/        # Public patents
│   │   ├── events/         # Public events
│   │   ├── achievements/   # Public achievements
│   │   ├── faculty/        # Public faculty (+ [id])
│   │   ├── departments/    # Departments list + [code]
│   │   ├── admin/          # Admin (HOD + login)
│   │   │   ├── login/      # Login page
│   │   │   └── (dashboard)/# Placements, research, events, etc.
│   │   ├── superadmin/     # Principal: approvals, users, audit, departments
│   │   └── api/            # create-hod, set-admin-password
│   ├── components/
│   │   ├── landing/         # Hero, stats, sections
│   │   ├── shared/         # Layout, pagination, modals, UI primitives
│   │   ├── admin/          # Admin CRUD clients, detail modals, bulk import
│   │   ├── achievements/   # Achievement cards & detail modal
│   │   ├── events/         # Event cards & detail modal
│   │   ├── placements/     # Placement cards & detail modal
│   │   ├── research/       # Research cards & detail modal
│   │   ├── patents/       # Patent cards & detail modal
│   │   ├── faculty/        # Faculty cards
│   │   ├── departments/    # Departments grid
│   │   └── ui/             # shadcn/ui components
│   ├── lib/                # Supabase clients, storage, images, data helpers
│   ├── hooks/              # usePagination, etc.
│   ├── stores/             # Auth store
│   ├── types/              # Shared TypeScript types
│   └── middleware.ts       # Route protection (admin/superadmin)
```

---

## Getting started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Clone and install

```bash
git clone <repository-url>
cd jondhale-folio
npm install
```

### Environment variables

Create a `.env.local` in the project root with:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (e.g. `https://xxxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous (public) key for client-side auth and RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key — **server-only**; used for admin APIs (e.g. create HOD). Never expose to the client. |

### Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use `/admin/login` to sign in as HOD or Principal.

---

## Database setup

The app uses **Supabase** (PostgreSQL). Core behaviour:

- **RLS (Row-Level Security)** is enabled on content tables so the public sees only rows where `status = 'approved'`. Authenticated admin requests use roles to allow HOD (own department) or Principal (all) access.
- **Eight core tables** (conceptually): `placements`, `research_papers`, `patents`, `events`, `achievements`, `faculty`, `profiles`, `audit_log`. Content tables include `status`, `department_id` (where applicable), and often `created_at` / `updated_at`. File URLs (proofs, banners, etc.) reference Supabase Storage.
- **Storage buckets** hold PDFs and images; policies should allow authenticated uploads and public read for approved assets as per your design.

Apply migrations and RLS policies from your Supabase project (or SQL scripts in the repo, if any).

---

## Admin access and roles

| Role | Login | Access | Workflow |
|------|--------|--------|----------|
| **HOD** | `/admin/login` | `/admin/*` (dashboard, placements, research, events, achievements, patents, faculty for **own department**) | Create/edit drafts; submit for approval (Draft → Pending). Cannot approve. |
| **Principal (superadmin)** | `/admin/login` | `/admin/*` and `/superadmin/*` (approvals, users, audit, departments) | Approve or reject pending items; manage users and departments; view audit log. |

- **Login route:** `/admin/login`. After login, HODs are redirected to `/admin/dashboard`, Principals to `/superadmin/dashboard`.
- **Middleware** protects `/admin` and `/superadmin`: unauthenticated users are redirected to `/admin/login`; HODs hitting `/superadmin/*` are redirected to `/admin/dashboard`.

---

## Content workflow (ASCII)

```
                    ┌─────────┐
                    │  DRAFT  │  (HOD creates/edits)
                    └────┬────┘
                         │ Submit
                         ▼
                    ┌─────────┐
                    │ PENDING │  (awaits Principal)
                    └────┬────┘
                    ┌────┴────┐
                    ▼         ▼
             ┌──────────┐ ┌──────────┐
             │ APPROVED │ │ REJECTED │
             └──────────┘ └──────────┘
                  │              │
                  ▼              ▼
             Public site    Not shown
             (RLS allows    (RLS filters
              only these)    these out)
```

---

## Deployment (Vercel)

1. Push the repo to GitHub and import the project in [Vercel](https://vercel.com).
2. Set **Root Directory** to `jondhale-folio` if the repo is the parent monorepo.
3. In **Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy. Use **Preview** for branches and **Production** for the main branch.

---

## License

This project is developed for Shivajirao S. Jondhale College of Engineering, Dombivli. All rights reserved.

---

**Built by** — Siddhi Avhad, Piyush Bendre, Sai Gadge, Shailesh Hawale  
**Department of Information Technology**, SSJCOE, Dombivli
