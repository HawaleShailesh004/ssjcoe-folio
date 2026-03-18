import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // Not logged in → redirect to login
  if (!user && (path.startsWith('/admin') || path.startsWith('/superadmin'))) {
    if (path !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return supabaseResponse
  }

  // Logged in → check role
  if (user && (path.startsWith('/admin') || path.startsWith('/superadmin'))) {
    if (path === '/admin/login') {
      // Already logged in, redirect based on role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'superadmin') {
        return NextResponse.redirect(new URL('/superadmin/dashboard', request.url))
      }
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    // HOD trying to access superadmin routes
    if (path.startsWith('/superadmin')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'superadmin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*', '/superadmin/:path*'],
}
