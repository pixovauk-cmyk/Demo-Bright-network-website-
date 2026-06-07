'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, CheckCircle, Plus, X } from 'lucide-react'

const SECTORS = ['business', 'technology', 'finance', 'hr', 'customer-service', 'management', 'other']
const LEVELS = ['2', '3', '4', '5', '6', '7']

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function NewCourseForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [level, setLevel] = useState('3')
  const [sector, setSector] = useState('business')
  const [duration, setDuration] = useState('18 months')
  const [tagline, setTagline] = useState('')
  const [description, setDescription] = useState('')
  const [heroImage, setHeroImage] = useState('')
  const [featured, setFeatured] = useState(false)
  const [whatYouLearn, setWhatYouLearn] = useState([''])
  const [employerBenefits, setEmployerBenefits] = useState([''])

  const slug = slugify(title)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/course', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        level,
        sector,
        duration,
        tagline: tagline.trim(),
        description: description.trim(),
        heroImage: heroImage.trim(),
        featured,
        whatYouLearn: whatYouLearn.filter(Boolean),
        employerBenefits: employerBenefits.filter(Boolean),
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Failed to create course')
      setLoading(false)
      return
    }

    router.push(`/admin-portal/content/${data.slug}`)
    router.refresh()
  }

  function updateList(list: string[], setter: (v: string[]) => void, i: number, val: string) {
    const updated = [...list]
    updated[i] = val
    setter(updated)
  }

  function addItem(list: string[], setter: (v: string[]) => void) {
    setter([...list, ''])
  }

  function removeItem(list: string[], setter: (v: string[]) => void, i: number) {
    setter(list.filter((_, j) => j !== i))
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Basic info */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Basic Info</h2>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Course title *</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            placeholder="e.g. Data Analyst"
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          {slug && <p className="text-[10px] text-slate-400 mt-1">Slug: <code>{slug}</code></p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Level</label>
            <select
              value={level}
              onChange={e => setLevel(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
            >
              {LEVELS.map(l => <option key={l} value={l}>Level {l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Sector</label>
            <select
              value={sector}
              onChange={e => setSector(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
            >
              {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Duration</label>
          <input
            type="text"
            value={duration}
            onChange={e => setDuration(e.target.value)}
            placeholder="e.g. 18 months"
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Tagline</label>
          <input
            type="text"
            value={tagline}
            onChange={e => setTagline(e.target.value)}
            placeholder="One-line hook for the course"
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            placeholder="Full course description shown on the course page"
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Hero image URL</label>
          <input
            type="url"
            value={heroImage}
            onChange={e => setHeroImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={featured}
            onChange={e => setFeatured(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-sky-600"
          />
          <span className="text-sm text-slate-700">Feature on homepage</span>
        </label>
      </div>

      {/* What you'll learn */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">What learners will learn</h2>
        {whatYouLearn.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={e => updateList(whatYouLearn, setWhatYouLearn, i, e.target.value)}
              placeholder={`Learning outcome ${i + 1}`}
              className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {whatYouLearn.length > 1 && (
              <button type="button" onClick={() => removeItem(whatYouLearn, setWhatYouLearn, i)} className="text-slate-300 hover:text-red-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addItem(whatYouLearn, setWhatYouLearn)} className="flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-800 font-medium transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add outcome
        </button>
      </div>

      {/* Employer benefits */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Employer benefits</h2>
        {employerBenefits.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={e => updateList(employerBenefits, setEmployerBenefits, i, e.target.value)}
              placeholder={`Benefit ${i + 1}`}
              className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {employerBenefits.length > 1 && (
              <button type="button" onClick={() => removeItem(employerBenefits, setEmployerBenefits, i)} className="text-slate-300 hover:text-red-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addItem(employerBenefits, setEmployerBenefits)} className="flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-800 font-medium transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add benefit
        </button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading || !title.trim()}
        className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
      >
        <BookOpen className="w-4 h-4" />
        {loading ? 'Creating…' : 'Create course'}
      </button>
    </form>
  )
}
