'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export default function UnenrolButton({ userId, courseSlug }: { userId: string; courseSlug: string }) {
  const [loading, setLoading] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const router = useRouter()

  async function unenrol() {
    setLoading(true)
    await fetch('/api/admin/unenrol', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, courseSlug }),
    })
    setLoading(false)
    setConfirming(false)
    router.refresh()
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-red-600 font-medium">Remove?</span>
        <button onClick={unenrol} disabled={loading} className="text-[10px] font-bold text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded-lg transition-colors">
          {loading ? '…' : 'Yes'}
        </button>
        <button onClick={() => setConfirming(false)} className="text-[10px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg transition-colors">
          No
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
    >
      <Trash2 className="w-3 h-3" /> Unenrol
    </button>
  )
}
