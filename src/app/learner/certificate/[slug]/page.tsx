import { createClient } from '@/lib/supabase/server'
import { getCourseBySlug } from '@/lib/courses'
import { redirect, notFound } from 'next/navigation'
import CertificateView from './CertificateView'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function CertificatePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const course = getCourseBySlug(slug)
  if (!course) notFound()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single()

  const { data: progress } = await supabase
    .from('module_progress')
    .select('module_slug')
    .eq('user_id', user.id)
    .eq('course_slug', slug)

  const completedSlugs = new Set((progress ?? []).map(p => p.module_slug))
  const allComplete = course.modules.every(m => completedSlugs.has(m.slug))
  if (!allComplete) redirect('/learner')

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('completed_at, enrolled_at')
    .eq('user_id', user.id)
    .eq('course_slug', slug)
    .single()

  const completionDate = enrollment?.completed_at ?? enrollment?.enrolled_at ?? new Date().toISOString()
  const name = profile?.full_name || profile?.email || 'Learner'

  return (
    <CertificateView
      learnerName={name}
      courseTitle={course.title}
      courseLevel={course.level}
      completionDate={completionDate}
      courseSlug={slug}
    />
  )
}
