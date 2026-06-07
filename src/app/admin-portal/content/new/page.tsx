import NewCourseForm from './NewCourseForm'

export default function NewCoursePage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Create New Course</h1>
        <p className="text-slate-500 text-sm mt-1">Fill in the details — you can add modules and videos after saving</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <NewCourseForm />
      </div>
    </div>
  )
}
