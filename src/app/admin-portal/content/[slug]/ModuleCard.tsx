'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Video, FileText, HelpCircle, ChevronDown, ChevronUp,
  Save, Plus, Trash2, CheckCircle, X, Clock
} from 'lucide-react'

interface Module {
  title: string
  slug: string
  duration: string
  videoUrl: string
  description: string
  resources: string[]
}

interface Quiz {
  id: string
  question: string
  options: string[]
  correct_index: number
}

interface Props {
  courseSlug: string
  module: Module
  index: number
  quizzes: Quiz[]
}

export default function ModuleCard({ courseSlug, module: mod, index, quizzes: initialQuizzes }: Props) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'video' | 'resources' | 'quiz'>('video')

  // Video/description state
  const [videoUrl, setVideoUrl] = useState(mod.videoUrl)
  const [duration, setDuration] = useState(mod.duration)
  const [description, setDescription] = useState(mod.description)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Resources state
  const [resources, setResources] = useState<string[]>(mod.resources)
  const [newResource, setNewResource] = useState('')

  // Quiz state
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes)
  const [addingQuiz, setAddingQuiz] = useState(false)
  const [quizQ, setQuizQ] = useState('')
  const [quizOpts, setQuizOpts] = useState(['', '', '', ''])
  const [quizCorrect, setQuizCorrect] = useState(0)
  const [quizSaving, setQuizSaving] = useState(false)

  const router = useRouter()

  async function saveModule() {
    setSaving(true)
    await fetch(`/api/admin/content/${courseSlug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moduleSlug: mod.slug, videoUrl, duration, description, resources }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  async function addQuiz() {
    if (!quizQ.trim() || quizOpts.some(o => !o.trim())) return
    setQuizSaving(true)
    const res = await fetch('/api/admin/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseSlug,
        moduleSlug: mod.slug,
        question: quizQ,
        options: quizOpts,
        correctIndex: quizCorrect,
      }),
    })
    const data = await res.json()
    if (data.quiz) setQuizzes(prev => [...prev, data.quiz])
    setQuizQ('')
    setQuizOpts(['', '', '', ''])
    setQuizCorrect(0)
    setAddingQuiz(false)
    setQuizSaving(false)
  }

  async function deleteQuiz(id: string) {
    await fetch('/api/admin/quiz', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setQuizzes(prev => prev.filter(q => q.id !== id))
  }

  const tabs = [
    { id: 'video' as const, label: 'Video', icon: Video },
    { id: 'resources' as const, label: `Resources (${resources.length})`, icon: FileText },
    { id: 'quiz' as const, label: `Quiz (${quizzes.length})`, icon: HelpCircle },
  ]

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left"
      >
        <div className="w-8 h-8 rounded-xl bg-sky-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-slate-900 text-sm">{mod.title}</div>
          <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{duration}</span>
            <span className="flex items-center gap-1"><Video className="w-3 h-3" />{videoUrl ? 'Video set' : 'No video'}</span>
            <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{resources.length} resources</span>
            <span className="flex items-center gap-1"><HelpCircle className="w-3 h-3" />{quizzes.length} quiz</span>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
      </button>

      {open && (
        <div className="border-t border-slate-100">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 px-6">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition-colors -mb-px ${
                  tab === id
                    ? 'border-sky-600 text-sky-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* VIDEO TAB */}
            {tab === 'video' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Video URL</label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={e => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/embed/... or Vimeo embed URL"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">Use YouTube embed URL: youtube.com/embed/VIDEO_ID</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    placeholder="e.g. 45 min"
                    className="w-48 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Module description</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                  />
                </div>

                {/* Video preview */}
                {videoUrl && videoUrl.includes('embed') && (
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-2">Preview</label>
                    <div className="rounded-xl overflow-hidden border border-slate-200 aspect-video">
                      <iframe src={videoUrl} className="w-full h-full" allowFullScreen title="preview" />
                    </div>
                  </div>
                )}

                <button
                  onClick={saveModule}
                  disabled={saving}
                  className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving…' : saved ? 'Saved!' : 'Save changes'}
                </button>
              </div>
            )}

            {/* RESOURCES TAB */}
            {tab === 'resources' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  {resources.length === 0 && (
                    <p className="text-sm text-slate-400">No resources yet. Add one below.</p>
                  )}
                  {resources.map((r, i) => (
                    <div key={i} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
                      <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span className="flex-1 text-sm text-slate-700">{r}</span>
                      <button
                        onClick={() => {
                          const updated = resources.filter((_, j) => j !== i)
                          setResources(updated)
                        }}
                        className="text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newResource}
                    onChange={e => setNewResource(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && newResource.trim()) {
                        setResources(prev => [...prev, newResource.trim()])
                        setNewResource('')
                      }
                    }}
                    placeholder="Resource name (e.g. Module Handbook PDF)"
                    className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <button
                    onClick={() => {
                      if (newResource.trim()) {
                        setResources(prev => [...prev, newResource.trim()])
                        setNewResource('')
                      }
                    }}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>

                <button
                  onClick={saveModule}
                  disabled={saving}
                  className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving…' : saved ? 'Saved!' : 'Save resources'}
                </button>
              </div>
            )}

            {/* QUIZ TAB */}
            {tab === 'quiz' && (
              <div className="space-y-4">
                {quizzes.length === 0 && !addingQuiz && (
                  <p className="text-sm text-slate-400">No quiz questions yet.</p>
                )}

                {quizzes.map((q, qi) => (
                  <div key={q.id} className="border border-slate-200 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded mr-2">Q{qi + 1}</span>
                        <span className="text-sm font-medium text-slate-800">{q.question}</span>
                      </div>
                      <button onClick={() => deleteQuiz(q.id)} className="text-slate-300 hover:text-red-500 transition-colors flex-shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                            i === q.correct_index
                              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold'
                              : 'bg-slate-50 border border-slate-100 text-slate-600'
                          }`}
                        >
                          <span className="font-bold">{['A', 'B', 'C', 'D'][i]}.</span> {opt}
                          {i === q.correct_index && <CheckCircle className="w-3 h-3 ml-auto flex-shrink-0" />}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {addingQuiz ? (
                  <div className="border border-sky-200 bg-sky-50/40 rounded-xl p-5 space-y-4">
                    <h4 className="font-semibold text-slate-800 text-sm">New question</h4>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Question</label>
                      <input
                        type="text"
                        value={quizQ}
                        onChange={e => setQuizQ(e.target.value)}
                        placeholder="What is…?"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-2">Answer options — click to mark correct</label>
                      <div className="grid grid-cols-2 gap-2">
                        {quizOpts.map((opt, i) => (
                          <div key={i} className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setQuizCorrect(i)}
                              className={`w-7 h-9 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold border transition-colors ${
                                quizCorrect === i
                                  ? 'bg-emerald-500 border-emerald-600 text-white'
                                  : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-300'
                              }`}
                            >
                              {['A', 'B', 'C', 'D'][i]}
                            </button>
                            <input
                              type="text"
                              value={opt}
                              onChange={e => {
                                const updated = [...quizOpts]
                                updated[i] = e.target.value
                                setQuizOpts(updated)
                              }}
                              placeholder={`Option ${['A', 'B', 'C', 'D'][i]}`}
                              className="flex-1 border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2">Green letter = correct answer</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={addQuiz}
                        disabled={quizSaving || !quizQ.trim() || quizOpts.some(o => !o.trim())}
                        className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" /> {quizSaving ? 'Saving…' : 'Save question'}
                      </button>
                      <button
                        onClick={() => { setAddingQuiz(false); setQuizQ(''); setQuizOpts(['', '', '', '']) }}
                        className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingQuiz(true)}
                    className="flex items-center gap-2 border-2 border-dashed border-slate-200 hover:border-sky-300 text-slate-500 hover:text-sky-600 text-sm font-medium px-5 py-3 rounded-xl transition-colors w-full justify-center"
                  >
                    <Plus className="w-4 h-4" /> Add quiz question
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
