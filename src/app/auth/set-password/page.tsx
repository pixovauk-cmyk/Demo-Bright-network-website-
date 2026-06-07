'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) { setError(error.message); setLoading(false); return }

    router.push('/learner')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F6FF]">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Set your password</h1>
          <p className="text-slate-500 mt-1 text-sm">Choose a password to access your account in future</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">New password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Min. 8 characters"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm password</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors"
          >
            {loading ? 'Saving…' : 'Set password & continue'}
          </button>
        </form>
      </div>
    </div>
  )
}
