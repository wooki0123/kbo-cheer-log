'use client'

import { useState } from 'react'
import { GameRecord } from '@/lib/types'
import RecordCard from './RecordCard'

type Filter = 'all' | 'win' | 'lose' | 'draw' | 'neutral' | 'cancelled'
type SortOrder = 'desc' | 'asc'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'win', label: '승' },
  { value: 'lose', label: '패' },
  { value: 'draw', label: '무' },
  { value: 'neutral', label: '중립' },
  { value: 'cancelled', label: '취소' },
]

function matchFilter(record: GameRecord, filter: Filter) {
  if (filter === 'all') return true
  if (filter === 'cancelled') return record.is_cancelled
  if (filter === 'neutral') return !record.is_cancelled && record.result === null
  return !record.is_cancelled && record.result === filter
}

export default function RecordListClient({ records }: { records: GameRecord[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [sort, setSort] = useState<SortOrder>('desc')
  const [stadium, setStadium] = useState('')

  const stadiums = Array.from(new Set(records.map((r) => r.stadium))).sort()

  const filtered = records
    .filter((r) => matchFilter(r, filter))
    .filter((r) => stadium === '' || r.stadium === stadium)
    .sort((a, b) => {
      const cmp = a.game_date.localeCompare(b.game_date)
      return sort === 'desc' ? -cmp : cmp
    })

  return (
    <>
      <div className="flex flex-wrap gap-2 items-center">
        {FILTERS.map(({ value, label }) => (
          <button key={value} onClick={() => setFilter(value)}
            className={`px-3 py-1 rounded-full text-sm border ${
              filter === value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}>
            {label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <select value={stadium} onChange={(e) => setStadium(e.target.value)}
          className="text-sm border border-gray-300 rounded-md px-2 py-1 text-gray-600">
          <option value="">구장 전체</option>
          {stadiums.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <button onClick={() => setSort(sort === 'desc' ? 'asc' : 'desc')}
          className="text-sm border border-gray-300 rounded-md px-3 py-1 text-gray-600 hover:bg-gray-50">
          {sort === 'desc' ? '최신순 ↓' : '오래된순 ↑'}
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-8">해당하는 기록이 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </div>
      )}
    </>
  )
}
