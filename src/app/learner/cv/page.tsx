import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getCourseBySlug } from '@/lib/courses'
import CVBuilder from './CVBuilder'

export default async function CVPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single()

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('course_slug, completed_at')
    .eq('user_id', user.id)
    .not('completed_at', 'is', null)

  const completedCourses = (enrollments ?? []).map(e => {
    const course = getCourseBySlug(e.course_slug)
    if (!course) return null
    return {
      title: course.title,
      level: course.level,
      completedAt: new Date(e.completed_at!).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
    }
  }).filter(Boolean) as { title: string; level: string; completedAt: string }[]

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">CV Builder</h1>
        <p className="text-slate-500 text-sm mt-1">
          AI-powered UK CV — tailored to your apprenticeship and industry
        </p>
      </div>
      <CVBuilder
        defaultName={profile?.full_name ?? ''}
        defaultEmail={profile?.email ?? user.email ?? ''}
        completedCourses={completedCourses}
      />
    </div>
  )
}
