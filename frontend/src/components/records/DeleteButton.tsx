'use client'

import { deleteRecord } from '@/actions/records'
import { useTransition } from 'react'

export default function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm('삭제하시겠습니까?')) return
    startTransition(async () => { await deleteRecord(id) })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm border border-red-300 text-red-600 px-3 py-1 rounded-md hover:bg-red-50 disabled:opacity-50"
    >
      {isPending ? '삭제 중...' : '삭제'}
    </button>
  )
}
