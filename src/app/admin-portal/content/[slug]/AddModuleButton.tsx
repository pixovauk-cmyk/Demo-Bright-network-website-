'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Save, X } from 'lucide-react'

interface Props {
  courseSlug: string
  nextIndex: number
}

export default function AddModuleButton({ courseSlug, nextIndex }: Props) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState('45 min')
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  function slugify(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  async function addModule() {
    if (!title.trim()) return
    setSaving(true)

    await fetch(`/api/admin/content/${courseSlug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        slug: slugify(title),
        duration,
      }),
    })

    setSaving(false)
    setOpen(false)
    setTitle('')
    setDuration('45 min')
    router.refresh()
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 hover:border-sky-300 text-slate-500 hover:text-sky-600 text-sm font-medium py-4 rounded-2xl transition-colors"
      >
        <Plus className="w-4 h-4" /> Add Module
      </button>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-sky-200 p-5 space-y-4">
      <h3 className="font-semibold text-slate-800 text-sm">New Module</h3>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Module title</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          autoFocus
          placeholder={`Module ${nextIndex} title`}
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        {title && <p className="text-[10px] text-slate-400 mt-1">Slug: <code>{slugify(title)}</code></p>}
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Duration</label>
        <input
          type="text"
          value={duration}
          onChange={e => setDuration(e.target.value)}
          placeholder="45 min"
          className="w-40 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={addModule}
          disabled={saving || !title.trim()}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          <Save className="w-3.5 h-3.5" /> {saving ? 'Adding…' : 'Add module'}
        </button>
        <button
          onClick={() => { setOpen(false); setTitle('') }}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <X className="w-3.5 h-3.5" /> Cancel
        </button>
      </div>
    </div>
  )
}
