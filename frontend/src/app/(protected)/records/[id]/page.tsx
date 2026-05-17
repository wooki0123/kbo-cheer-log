import { getRecordById } from '@/actions/records'
import { notFound } from 'next/navigation'
import BoxScore from '@/components/records/BoxScore'
import DeleteButton from '@/components/records/DeleteButton'
import Link from 'next/link'

const RESULT_LABEL: Record<string, string> = { win: '승', lose: '패', draw: '무', neutral: '중립' }
const RESULT_STYLE: Record<string, string> = {
  win: 'bg-blue-100 text-blue-700',
  lose: 'bg-red-100 text-red-700',
  draw: 'bg-gray-100 text-gray-600',
  neutral: 'bg-purple-100 text-purple-700',
}

export default async function RecordDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const record = await getRecordById(id)
  if (!record) notFound()

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/records" className="text-sm text-gray-500 hover:underline">← 목록으로</Link>
        <div className="flex gap-2">
          <Link
            href={`/records/${id}/edit`}
            className="text-sm border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-50"
          >
            수정
          </Link>
          <DeleteButton id={id} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">{record.home_team} vs {record.away_team}</h1>
          {(() => {
            const key = record.is_cancelled ? null : (record.result ?? 'neutral')
            return (
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                record.is_cancelled ? 'bg-yellow-100 text-yellow-700' : RESULT_STYLE[key!]
              }`}>
                {record.is_cancelled ? '우천취소' : RESULT_LABEL[key!]}
              </span>
            )
          })()}
        </div>

        <div className="text-sm text-gray-600 space-y-1">
          <p>📅 {record.game_date.slice(5)}</p>
          <p>🏟️ {record.stadium}</p>
          <p>🌤️ {record.weather}</p>
          <p>⭐ {'★'.repeat(record.rating)}{'☆'.repeat(5 - record.rating)}</p>
          {record.memo && <p>📝 {record.memo}</p>}
        </div>

        {record.innings_data && (
          <div className="mt-4">
            <h2 className="text-sm font-semibold text-gray-600 mb-2">경기 기록</h2>
            <BoxScore
              data={record.innings_data}
              homeTeam={record.home_team}
              awayTeam={record.away_team}
            />
          </div>
        )}
      </div>
    </div>
  )
}
