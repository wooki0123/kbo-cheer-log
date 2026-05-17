'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

type Props = {
  weeklyMap: Record<string, number>
}

function formatKey(key: string) {
  // "2026-05-W2" → "5월 2주"
  const [, month, w] = key.split('-')
  return `${parseInt(month)}월 ${w}`
}

export default function MonthlyChart({ weeklyMap }: Props) {
  const data = Object.entries(weeklyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => ({ label: formatKey(key), count }))

  if (data.length === 0) return null

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-sm font-semibold text-gray-600 mb-3">주차별 직관 횟수</h2>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v) => [`${v}회`, '직관']} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill="#3b82f6" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
