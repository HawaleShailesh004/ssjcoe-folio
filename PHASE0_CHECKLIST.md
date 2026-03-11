# Phase 0 Completion Checklist

- [x] Next.js project created and runs
- [x] All dependencies installed
- [x] Folder structure created (`src/types`, `src/lib`, `src/stores`, `src/hooks`, `src/components/{ui,layout,shared}`)
- [x] UI components copied from old project (`src/components/ui/`) and imports fixed (no version suffixes)
- [x] Shared components: `ImageUpload`, `ImageWithFallback` in `src/components/shared/`
- [x] Types consolidated in `src/types/index.ts`
- [x] Supabase client in `src/lib/supabase.ts` (safe when env is missing; build passes without .env.local)
- [x] `.env.local.example` created — copy to `.env.local` and add your Supabase URL + anon key
- [ ] Supabase project created (you did this)
- [ ] All tables created via SQL Editor (you did this)
- [ ] RLS policies applied (you did this)
- [ ] Two test users created with profiles (you did this)
- [ ] `.env.local` configured with real values
- [ ] Home page shows departments (connection verified) — run `npm run dev` and open http://localhost:3000

Once you tick the last items, Phase 0 is done. Next: Phase 1 — design system and shared components.
