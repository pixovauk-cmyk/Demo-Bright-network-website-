'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import Link from 'next/link'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/learner'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicSent, setMagicSent] = useState(false)
  const [magicLoading, setMagicLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push(next)
    router.refresh()
  }

  async function sendMagicLink() {
    if (!email) { setError('Enter your email first'); return }
    setMagicLoading(true)
    setError('')
    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/set-password`,
    })
    setMagicSent(true)
    setMagicLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F6FF]">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Sign in to BrightPeak</h1>
          <p className="text-slate-500 mt-1 text-sm">Access your learning portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
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
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-4 text-center">
          {magicSent ? (
            <p className="text-emerald-600 text-sm font-medium">Password reset link sent — check your email.</p>
          ) : (
            <button
              onClick={sendMagicLink}
              disabled={magicLoading}
              className="text-sm text-blue-600 hover:underline disabled:opacity-50"
            >
              {magicLoading ? 'Sending…' : 'Forgot password?'}
            </button>
          )}
        </div>

        <p className="text-sm text-slate-500 mt-4 text-center">
          No account?{' '}
          <Link href="/auth/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
