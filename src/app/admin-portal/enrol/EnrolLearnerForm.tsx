'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { CheckCircle, BookOpen } from 'lucide-react'

interface Learner { id: string; full_name: string; email: string }
interface Course { slug: string; title: string; level: string; duration: string }

export default function EnrolLearnerForm({
  learners,
  courses,
}: {
  learners: Learner[]
  courses: Course[]
}) {
  const [userId, setUserId] = useState('')
  const [courseSlug, setCourseSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId || !courseSlug) return
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/enrol', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, courseSlug }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Failed to enrol')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    router.refresh()
  }

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-6 h-6 text-emerald-600" />
        </div>
        <h3 className="font-semibold text-slate-900 mb-1">Enrolment confirmed</h3>
        <p className="text-sm text-slate-500 mb-5">The learner now has access to this course.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => { setSuccess(false); setUserId(''); setCourseSlug('') }}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Enrol another
          </button>
          <a href="/admin-portal/learners" className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors">
            View learners
          </a>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Learner</label>
        <select
          value={userId}
          onChange={e => setUserId(e.target.value)}
          required
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
        >
          <option value="">Select a learner…</option>
          {learners.map(l => (
            <option key={l.id} value={l.id}>
              {l.full_name ? `${l.full_name} (${l.email})` : l.email}
            </option>
          ))}
        </select>
        {learners.length === 0 && (
          <p className="text-xs text-amber-600 mt-1">No learners yet. Invite one first.</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Course</label>
        <select
          value={courseSlug}
          onChange={e => setCourseSlug(e.target.value)}
          required
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
        >
          <option value="">Select a course…</option>
          {courses.map(c => (
            <option key={c.slug} value={c.slug}>
              {c.title} — Level {c.level} · {c.duration}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading || !userId || !courseSlug}
        className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors"
      >
        <BookOpen className="w-4 h-4" />
        {loading ? 'Enrolling…' : 'Enrol learner'}
      </button>
    </form>
  )
}
