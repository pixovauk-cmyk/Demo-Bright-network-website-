'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle } from 'lucide-react'

interface Props {
  courseSlug: string
  moduleSlug: string
  totalModules: number
}

export default function MarkCompleteButton({ courseSlug, moduleSlug, totalModules }: Props) {
  const [done, setDone] = useState(false)
  const [enrolled, setEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function check() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_slug', courseSlug)
        .maybeSingle()

      if (!enrollment) { setLoading(false); return }
      setEnrolled(true)

      const { data: progress } = await supabase
        .from('module_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_slug', courseSlug)
        .eq('module_slug', moduleSlug)
        .maybeSingle()

      if (progress) setDone(true)
      setLoading(false)
    }
    check()
  }, [courseSlug, moduleSlug])

  async function markComplete() {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('module_progress').upsert({
      user_id: user.id,
      course_slug: courseSlug,
      module_slug: moduleSlug,
    })

    const { data: rows } = await supabase
      .from('module_progress')
      .select('module_slug')
      .eq('user_id', user.id)
      .eq('course_slug', courseSlug)

    if ((rows?.length ?? 0) >= totalModules) {
      await supabase
        .from('enrollments')
        .update({ completed_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('course_slug', courseSlug)
    }

    setDone(true)
    setSaving(false)
  }

  if (loading || !enrolled) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {done ? (
        <div className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl font-semibold text-sm">
          <CheckCircle className="w-4 h-4" /> Module Complete
        </div>
      ) : (
        <button
          onClick={markComplete}
          disabled={saving}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white px-5 py-3 rounded-2xl shadow-xl font-semibold text-sm transition-colors"
        >
          <CheckCircle className="w-4 h-4" />
          {saving ? 'Saving…' : 'Mark Complete'}
        </button>
      )}
    </div>
  )
}
