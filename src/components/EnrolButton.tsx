'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { BookOpen } from 'lucide-react'

interface Props {
  courseSlug: string
  courseTitle: string
}

export default function EnrolButton({ courseSlug, courseTitle }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function enrol() {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not logged in'); setLoading(false); return }

    const { error } = await supabase.from('enrollments').insert({
      user_id: user.id,
      course_slug: courseSlug,
    })

    if (error && error.code !== '23505') {
      setError('Failed to enrol. Try again.')
      setLoading(false)
      return
    }

    router.refresh()
  }

  return (
    <div>
      <button
        onClick={enrol}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
        title={courseTitle}
      >
        <BookOpen className="w-3.5 h-3.5" />
        {loading ? 'Enrolling…' : 'Enrol now'}
      </button>
      {error && <p className="text-red-500 text-xs mt-1 text-center">{error}</p>}
    </div>
  )
}
