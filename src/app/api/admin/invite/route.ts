import { createAdminClient } from '@/lib/supabase/admin-client'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { email, fullName, role = 'learner' } = await request.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const admin = createAdminClient()
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName ?? '' },
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback`,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Trigger creates profile as 'learner' by default — update if admin
  if (role === 'admin' && data.user) {
    await admin
      .from('profiles')
      .update({ role: 'admin', full_name: fullName ?? '' })
      .eq('id', data.user.id)
  }

  return NextResponse.json({ ok: true })
}
