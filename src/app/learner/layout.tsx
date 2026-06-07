import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LearnerNav from '@/components/LearnerNav'

export default async function LearnerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-[#F4F6FF]">
      <LearnerNav
        fullName={profile?.full_name ?? ''}
        email={profile?.email ?? user.email ?? ''}
      />
      <main>{children}</main>
    </div>
  )
}
