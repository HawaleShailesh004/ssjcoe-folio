import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

/**
 * One-time setup: set password for an auth user (e.g. dummy email that can't receive mail).
 * Call once then remove this route or disable it.
 *
 * 1. Add to .env.local:
 *    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
 *    SETUP_SECRET=any-random-string-you-choose
 *
 * 2. Request (replace with your values):
 *    POST /api/set-admin-password
 *    Body: { "userId": "1f37a796-4cda-482c-a942-21aa9ec38974", "password": "YourNewPassword123", "secret": "any-random-string-you-choose" }
 *
 * 3. After success, delete this file or remove SETUP_SECRET so the route stops working.
 */
export async function POST(request: Request) {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const setupSecret = process.env.SETUP_SECRET

  if (!serviceRoleKey) {
    return NextResponse.json(
      { error: 'Missing SUPABASE_SERVICE_ROLE_KEY in .env.local' },
      { status: 500 }
    )
  }
  if (!setupSecret) {
    return NextResponse.json(
      { error: 'Missing SETUP_SECRET in .env.local (add a random string for one-time use)' },
      { status: 500 }
    )
  }

  let body: { userId?: string; password?: string; secret?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (body.secret !== setupSecret) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }
  if (!body.userId || !body.password) {
    return NextResponse.json(
      { error: 'Body must include userId and password' },
      { status: 400 }
    )
  }
  if (body.password.length < 6) {
    return NextResponse.json(
      { error: 'Password must be at least 6 characters' },
      { status: 400 }
    )
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { error } = await supabase.auth.admin.updateUserById(body.userId, {
    password: body.password,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true, message: 'Password set. You can now log in with that email and this password.' })
}
