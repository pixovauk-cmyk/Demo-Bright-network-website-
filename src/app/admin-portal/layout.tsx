import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminNav from '@/components/AdminNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/learner')

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />
      <main>{children}</main>
    </div>
  )
}
