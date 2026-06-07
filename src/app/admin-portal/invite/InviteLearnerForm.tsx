'use client'

import { useState } from 'react'
import { CheckCircle, Mail, User, Shield } from 'lucide-react'

export default function InviteLearnerForm() {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'learner' | 'admin'>('learner')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, fullName, role }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Failed to send invite')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-6 h-6 text-emerald-600" />
        </div>
        <h3 className="font-semibold text-slate-900 mb-1">Invite sent</h3>
        <p className="text-sm text-slate-500 mb-5">
          An email was sent to <strong>{email}</strong> as a <strong>{role}</strong>.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => { setSuccess(false); setEmail(''); setFullName(''); setRole('learner') }}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Invite another
          </button>
          {role === 'learner' && (
            <a href="/admin-portal/enrol" className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors">
              Enrol them now
            </a>
          )}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Role toggle */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Account type</label>
        <div className="grid grid-cols-2 gap-2">
          {([['learner', 'Learner', User], ['admin', 'Admin', Shield]] as const).map(([val, label, Icon]) => (
            <button
              key={val}
              type="button"
              onClick={() => setRole(val)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                role === val
                  ? val === 'admin'
                    ? 'border-violet-400 bg-violet-50 text-violet-700'
                    : 'border-sky-400 bg-sky-50 text-sky-700'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
        {role === 'admin' && (
          <p className="text-xs text-violet-600 mt-2 bg-violet-50 border border-violet-100 px-3 py-2 rounded-lg">
            Admin accounts have full access to this portal — enrol learners, view all data, invite users.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
        <input
          type="text"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="Jane Smith"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder={role === 'admin' ? 'colleague@brightpeak.com' : 'learner@company.com'}
        />
      </div>

      <div className="bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 text-xs text-sky-700">
        They&apos;ll receive a magic link to set their password and access the portal.
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading || !email}
        className={`w-full flex items-center justify-center gap-2 disabled:opacity-50 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors ${
          role === 'admin' ? 'bg-violet-600 hover:bg-violet-700' : 'bg-sky-600 hover:bg-sky-700'
        }`}
      >
        <Mail className="w-4 h-4" />
        {loading ? 'Sending…' : `Invite ${role}`}
      </button>
    </form>
  )
}
