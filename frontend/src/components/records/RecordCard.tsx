import Link from 'next/link'
import { GameRecord } from '@/lib/types'

const RESULT_STYLE: Record<string, string> = {
  win: 'bg-blue-100 text-blue-700',
  lose: 'bg-red-100 text-red-700',
  draw: 'bg-gray-100 text-gray-600',
}
const RESULT_LABEL: Record<string, string> = { win: '승', lose: '패', draw: '무' }

export default function RecordCard({ record }: { record: GameRecord }) {
  return (
    <Link href={`/records/${record.id}`}>
      <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 mb-1">{record.game_date.slice(5)} · {record.stadium}</p>
          <p className="font-semibold text-gray-800">
            {record.home_team} vs {record.away_team}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {'⭐'.repeat(record.rating)} · {record.weather}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
          record.is_cancelled
            ? 'bg-yellow-100 text-yellow-700'
            : RESULT_STYLE[record.result!]
        }`}>
          {record.is_cancelled ? '우천취소' : RESULT_LABEL[record.result!]}
        </span>
      </div>
    </Link>
  )
}
