# Phase 2 — Step 1: Landing Page — Checklist

- [x] useAuthStore created
- [x] src/lib/stats.ts created
- [x] Landing page server component created
- [x] src/components/landing/ folder created with all 6 sections
- [x] Animated counter works on scroll
- [x] Departments pull from Supabase and render
- [x] Top placements render (after seed data added)
- [x] Hero dark section looks correct with saffron accents
- [x] Stats strip renders with colored icons
- [x] Footer and header render on landing page

**Landing page is now dynamic** (`export const dynamic = "force-dynamic"`) so new data from Supabase shows on every request without rebuild.

---

## Placements not showing?

The site only shows placements where **`status = 'approved'`**. New rows often default to `'draft'`.

**In Supabase (Table Editor or SQL):**

1. Open the **placements** table.
2. For each row you want on the site, set **status** to **`approved`**.

**Or run in SQL Editor:**

```sql
-- Approve all existing placements so they show on the landing page
UPDATE placements SET status = 'approved' WHERE status IN ('draft', 'pending');
```

Then refresh http://localhost:3000. The hero counters and the “Recent highlights” section will update.

---

## Placements approved but still not showing?

**1. Check what the app receives**

With `npm run dev` running, open:

**http://localhost:3000/api/debug-placements**

- If you see `"ok": true` and `"count": 4` with a `"data"` array → Supabase is returning rows; the home page should show them (try a hard refresh or restart dev server).
- If you see `"ok": false` and an `"error"` object → the request is blocked. Usually this is **RLS (Row Level Security)**.

**2. Allow public read for approved placements (RLS)**

In **Supabase Dashboard** → **SQL Editor**, run:

```sql
-- Allow anyone (including anon) to read approved placements
CREATE POLICY "Public reads approved placements"
  ON placements FOR SELECT
  USING (status = 'approved');
```

If the policy already exists, you’ll get an error; that’s fine. Then open **Authentication** → **Policies** and confirm the `placements` table has a policy that allows `SELECT` when `status = 'approved'`.

After that, call **http://localhost:3000/api/debug-placements** again and refresh the home page. You can remove `src/app/api/debug-placements/route.ts` when everything works.

---

## Error: "infinite recursion detected in policy for relation profiles"

This happens when an RLS policy on **profiles** (or on another table) does a subquery like `(SELECT role FROM profiles WHERE id = auth.uid())`. That check runs under RLS, which then evaluates policies on `profiles` again → infinite recursion.

**Fix:** Run the SQL in **`supabase/fix-rls-recursion.sql`** in the Supabase **SQL Editor**. It:

1. Adds **`get_my_role()`** and **`get_my_dept_id()`** as `SECURITY DEFINER` functions so the app can read role/dept without going through RLS on `profiles`.
2. Recreates **profiles** policies so they use `get_my_role()` instead of subquerying `profiles`.
3. Recreates the **placements** “Public reads approved” and HOD policies so they use these helpers and no longer trigger recursion.

After running the script, refresh the app; placements should load and the error should go away.

**Next:** Phase 2 — Step 2: Placements Showcase page.
