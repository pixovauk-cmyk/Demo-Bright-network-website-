import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { courseSlug, moduleSlug, question, options, correctIndex } = await request.json()
  if (!courseSlug || !moduleSlug || !question || !options || correctIndex === undefined) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const { data: quiz, error } = await supabase
    .from('quizzes')
    .insert({ course_slug: courseSlug, module_slug: moduleSlug, question, options, correct_index: correctIndex })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ quiz })
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { error } = await supabase.from('quizzes').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
