export default function StadiumStats({ stadiumMap }: { stadiumMap: Record<string, number> }) {
  const sorted = Object.entries(stadiumMap).sort((a, b) => b[1] - a[1])

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-sm font-semibold text-gray-600 mb-3">구장별 방문 횟수</h2>
      {sorted.length === 0 ? (
        <p className="text-sm text-gray-400">기록 없음</p>
      ) : (
        <ul className="space-y-1">
          {sorted.map(([stadium, count]) => (
            <li key={stadium} className="flex justify-between text-sm">
              <span className="text-gray-700">{stadium}</span>
              <span className="font-semibold text-blue-700">{count}회</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
