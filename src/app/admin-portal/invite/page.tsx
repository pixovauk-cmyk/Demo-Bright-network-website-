import InviteLearnerForm from './InviteLearnerForm'

export default function InvitePage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Invite a Learner</h1>
        <p className="text-slate-500 text-sm mt-1">Send an account invite — learner sets their own password via email link</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <InviteLearnerForm />
      </div>
    </div>
  )
}
