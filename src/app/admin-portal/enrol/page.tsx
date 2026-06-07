import { createAdminClient } from '@/lib/supabase/admin-client'
import { getAllCourses } from '@/lib/courses'
import EnrolLearnerForm from './EnrolLearnerForm'

export default async function EnrolPage() {
  const supabase = createAdminClient()

  const { data: learners } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('role', 'learner')
    .order('full_name')

  const courses = getAllCourses()

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Enrol a Learner</h1>
        <p className="text-slate-500 text-sm mt-1">Assign a course to a learner account</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <EnrolLearnerForm learners={learners ?? []} courses={courses} />
      </div>
    </div>
  )
}
