'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

type Props = {
  weeklyMap: Record<string, number>
}

function formatKey(key: string) {
  // "2026-05-W2" → "2주차"  (X축은 짧게)
  const weekNum = key.split('-W')[1]
  return `${weekNum}주차`
}

function formatMonth(ym: string) {
  // "2026-05" → "5월"
  return `${parseInt(ym.slice(5))}월`
}

export default function MonthlyChart({ weeklyMap }: Props) {
  const months = Array.from(
    new Set(Object.keys(weeklyMap).map((k) => k.slice(0, 7)))
  ).sort()

  const [selectedMonth, setSelectedMonth] = useState(months[months.length - 1] ?? '')

  const data = Object.entries(weeklyMap)
    .filter(([key]) => key.startsWith(selectedMonth))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => ({ label: formatKey(key), count }))

  if (months.length === 0) return null

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-600">주차별 직관 횟수</h2>
        <div className="flex gap-1">
          {months.map((m) => (
            <button key={m} onClick={() => setSelectedMonth(m)}
              className={`px-2 py-0.5 text-xs rounded-full border ${
                selectedMonth === m
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 text-gray-500 hover:bg-gray-50'
              }`}>
              {formatMonth(m)}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
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
