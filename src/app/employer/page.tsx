import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function EmployerDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Employer Portal</h1>
      <p className="text-slate-500 mt-1">Employer dashboard — coming next.</p>
    </div>
  )
}
