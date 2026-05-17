import { GameRecord } from '@/lib/types'

const BADGE: Record<string, string> = {
  win: 'bg-blue-100 text-blue-700',
  lose: 'bg-red-100 text-red-700',
  draw: 'bg-gray-100 text-gray-600',
  neutral: 'bg-purple-100 text-purple-700',
}
const LABEL: Record<string, string> = { win: '승', lose: '패', draw: '무', neutral: '중립' }

export default function RecentGames({ records }: { records: GameRecord[] }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-sm font-semibold text-gray-600 mb-3">최근 5경기 <span className="font-normal text-gray-400">(전체 직관 기준)</span></h2>
      <div className="flex gap-2 flex-wrap">
        {records.map((r) => (
          <span
            key={r.id}
            className={`px-2 py-1 rounded text-sm font-bold ${
              r.is_cancelled ? 'bg-yellow-100 text-yellow-700'
              : r.result === null ? BADGE.neutral
              : BADGE[r.result]
            }`}
          >
            {r.is_cancelled ? 'C' : r.result === null ? LABEL.neutral : LABEL[r.result]}
          </span>
        ))}
        {records.length === 0 && <p className="text-sm text-gray-400">기록 없음</p>}
      </div>
    </div>
  )
}
