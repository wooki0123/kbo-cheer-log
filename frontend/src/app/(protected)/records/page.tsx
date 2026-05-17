import { getRecords } from '@/actions/records'
import RecordListClient from '@/components/records/RecordListClient'
import Link from 'next/link'

export default async function RecordsPage() {
  const records = await getRecords()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">내 직관 기록</h1>
        <Link
          href="/records/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
        >
          + 기록 추가
        </Link>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">⚾</p>
          <p>아직 기록이 없습니다.</p>
          <Link href="/records/new" className="mt-4 inline-block text-blue-600 hover:underline text-sm">
            첫 직관을 기록해보세요
          </Link>
        </div>
      ) : (
        <RecordListClient records={records} />
      )}
    </div>
  )
}
