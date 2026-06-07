import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ROLE_ROUTES: Record<string, string> = {
  '/learner': 'learner',
  '/admin-portal': 'admin',
  '/employer': 'employer',
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Find which portal this path is under
  const portalPrefix = Object.keys(ROLE_ROUTES).find(prefix =>
    pathname.startsWith(prefix)
  )

  if (!portalPrefix) return supabaseResponse

  // Not logged in → login page
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  // Fetch role from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const requiredRole = ROLE_ROUTES[portalPrefix]
  const userRole = profile?.role

  if (userRole !== requiredRole) {
    // Redirect to their correct portal
    const portalMap: Record<string, string> = {
      learner: '/learner',
      admin: '/admin-portal',
      employer: '/employer',
    }
    const url = request.nextUrl.clone()
    url.pathname = portalMap[userRole ?? ''] ?? '/auth/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/learner/:path*', '/admin-portal/:path*', '/employer/:path*'],
}
