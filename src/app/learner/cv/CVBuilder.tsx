'use client'

import { useState } from 'react'
import { Plus, Trash2, Sparkles, Copy, CheckCircle, FileText } from 'lucide-react'

interface WorkEntry { role: string; company: string; duration: string; description: string }
interface CompletedCourse { title: string; level: string; completedAt: string }

interface Props {
  defaultName: string
  defaultEmail: string
  completedCourses: CompletedCourse[]
}

export default function CVBuilder({ defaultName, defaultEmail, completedCourses }: Props) {
  const [fullName, setFullName] = useState(defaultName)
  const [email, setEmail] = useState(defaultEmail)
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [personalStatement, setPersonalStatement] = useState('')
  const [skills, setSkills] = useState('')
  const [workExperience, setWorkExperience] = useState<WorkEntry[]>([
    { role: '', company: '', duration: '', description: '' }
  ])

  const [generating, setGenerating] = useState(false)
  const [cv, setCv] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  function addWork() {
    setWorkExperience(prev => [...prev, { role: '', company: '', duration: '', description: '' }])
  }

  function updateWork(i: number, field: keyof WorkEntry, value: string) {
    setWorkExperience(prev => prev.map((w, j) => j === i ? { ...w, [field]: value } : w))
  }

  function removeWork(i: number) {
    setWorkExperience(prev => prev.filter((_, j) => j !== i))
  }

  async function generate() {
    setGenerating(true)
    setError('')
    setCv('')

    try {
      const res = await fetch('/api/learner/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName, email, phone, location,
          personalStatement, skills,
          workExperience: workExperience.filter(w => w.role || w.company),
          completedCourses,
        }),
      })

      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Failed to generate'); return }

      setCv(data.cv)
      setTimeout(() => document.getElementById('cv-output')?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Network error — please try again')
    } finally {
      setGenerating(false)
    }
  }

  async function copyCV() {
    await navigator.clipboard.writeText(cv)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const inputClass = 'w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500'

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Form */}
      <div className="space-y-6">
        {/* Completed courses badge */}
        {completedCourses.length > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-800">Auto-populated from your profile</span>
            </div>
            {completedCourses.map((c, i) => (
              <div key={i} className="text-xs text-emerald-700">
                Level {c.level} {c.title} — {c.completedAt}
              </div>
            ))}
          </div>
        )}

        {/* Personal details */}
        <div>
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Personal Details</h2>
          <div className="space-y-3">
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full name" className={inputClass} />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className={inputClass} />
            <div className="grid grid-cols-2 gap-3">
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" className={inputClass} />
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="City, UK" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Personal statement */}
        <div>
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">About You</h2>
          <textarea
            value={personalStatement}
            onChange={e => setPersonalStatement(e.target.value)}
            rows={4}
            placeholder="Tell Claude about yourself, your ambitions, what kind of role you're aiming for. The more detail, the better the CV. E.g. 'I'm a motivated business admin apprentice looking to move into project management in financial services...'"
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Work experience */}
        <div>
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Work Experience</h2>
          <div className="space-y-4">
            {workExperience.map((w, i) => (
              <div key={i} className="border border-slate-200 rounded-xl p-4 space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value={w.role} onChange={e => updateWork(i, 'role', e.target.value)} placeholder="Job title" className={inputClass} />
                  <input type="text" value={w.company} onChange={e => updateWork(i, 'company', e.target.value)} placeholder="Company" className={inputClass} />
                </div>
                <input type="text" value={w.duration} onChange={e => updateWork(i, 'duration', e.target.value)} placeholder="Duration (e.g. Jun 2022 – present)" className={inputClass} />
                <textarea
                  value={w.description}
                  onChange={e => updateWork(i, 'description', e.target.value)}
                  rows={2}
                  placeholder="Key responsibilities and achievements"
                  className={`${inputClass} resize-none`}
                />
                {workExperience.length > 1 && (
                  <button onClick={() => removeWork(i)} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                )}
              </div>
            ))}
            <button onClick={addWork} className="flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-800 font-medium transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add another role
            </button>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Skills</h2>
          <textarea
            value={skills}
            onChange={e => setSkills(e.target.value)}
            rows={3}
            placeholder="List your skills, software, tools — e.g. Microsoft Office, stakeholder management, Salesforce, project planning, data analysis..."
            className={`${inputClass} resize-none`}
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          onClick={generate}
          disabled={generating || !fullName}
          className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          {generating ? 'Claude is writing your CV…' : 'Generate UK CV with AI'}
        </button>
      </div>

      {/* CV Output */}
      <div id="cv-output">
        {generating && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div className="w-10 h-10 border-2 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600 text-sm font-medium">Claude is writing your CV…</p>
            <p className="text-slate-400 text-xs mt-1">Tailoring to UK standards and your industry</p>
          </div>
        )}

        {cv && !generating && (
          <div className="sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-600" />
                <span className="text-sm font-semibold text-slate-800">Your CV</span>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-bold">UK Format</span>
              </div>
              <button
                onClick={copyCV}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 prose prose-sm prose-slate max-w-none max-h-[75vh] overflow-y-auto">
              <div className="whitespace-pre-wrap text-sm text-slate-800 leading-relaxed font-mono">
                {cv}
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">
              Copy and paste into Word or Google Docs to format and download as PDF
            </p>
          </div>
        )}

        {!cv && !generating && (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center h-full flex flex-col items-center justify-center">
            <FileText className="w-10 h-10 text-slate-200 mb-3" />
            <p className="text-slate-400 text-sm">Your AI-generated CV will appear here</p>
            <p className="text-slate-300 text-xs mt-1">UK format · ATS optimised · Industry tailored</p>
          </div>
        )}
      </div>
    </div>
  )
}
