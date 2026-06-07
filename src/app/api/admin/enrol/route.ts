import { createAdminClient } from '@/lib/supabase/admin-client'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // Verify caller is admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { userId, courseSlug } = await request.json()
  if (!userId || !courseSlug) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const admin = createAdminClient()
  const { error } = await admin.from('enrollments').insert({ user_id: userId, course_slug: courseSlug })

  if (error && error.code !== '23505') {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
