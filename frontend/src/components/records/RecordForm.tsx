'use client'

import { useState, useTransition } from 'react'
import { KBO_TEAMS, KBO_STADIUMS, WEATHER_OPTIONS } from '@/lib/constants/kbo'
import { fetchGameData } from '@/actions/naver'
import { createRecord, updateRecord } from '@/actions/records'
import { GameData, GameRecord, GameResult } from '@/lib/types'
import BoxScore from './BoxScore'

type Props = {
  initialData?: GameRecord
  recordId?: string
}

export default function RecordForm({ initialData, recordId }: Props) {
  const isEdit = !!recordId
  const [isPending, startTransition] = useTransition()
  const [gameDate, setGameDate] = useState(initialData?.game_date ?? '')
  const [homeTeam, setHomeTeam] = useState(initialData?.home_team ?? '')
  const [awayTeam, setAwayTeam] = useState(initialData?.away_team ?? '')
  const [result, setResult] = useState<GameResult | ''>(initialData?.result ?? '')
  const [isCancelled, setIsCancelled] = useState(initialData?.is_cancelled ?? false)
  const [stadium, setStadium] = useState(initialData?.stadium ?? '')
  const [weather, setWeather] = useState(initialData?.weather ?? '')
  const [rating, setRating] = useState(initialData?.rating ?? 3)
  const [memo, setMemo] = useState(initialData?.memo ?? '')
  const [gameData, setGameData] = useState<GameData | null>(initialData?.innings_data ?? null)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0]

  const handleFetchGame = async () => {
    if (!gameDate || !homeTeam || !awayTeam) {
      setFetchError('날짜, 홈팀, 원정팀을 먼저 입력하세요.')
      return
    }
    setIsFetching(true)
    setFetchError(null)
    const data = await fetchGameData(gameDate, homeTeam, awayTeam)
    setIsFetching(false)
    if (!data) {
      setFetchError('경기 데이터를 찾을 수 없습니다.')
    } else {
      setGameData(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isCancelled && !result) { setError('결과를 선택하세요.'); return }
    if (homeTeam === awayTeam) { setError('홈팀과 원정팀이 같을 수 없습니다.'); return }

    const payload = {
      game_date: gameDate,
      home_team: homeTeam,
      away_team: awayTeam,
      result: isCancelled ? null : (result as GameResult),
      is_cancelled: isCancelled,
      stadium,
      weather,
      rating,
      memo,
      innings_data: gameData,
      hits_home: gameData?.total.home.hits ?? null,
      hits_away: gameData?.total.away.hits ?? null,
      errors_home: gameData?.total.home.errors ?? null,
      errors_away: gameData?.total.away.errors ?? null,
      walks_home: gameData?.total.home.walks ?? null,
      walks_away: gameData?.total.away.walks ?? null,
    }

    startTransition(async () => {
      const res = isEdit
        ? await updateRecord(recordId, payload)
        : await createRecord(payload)
      if (res?.error) setError(res.error)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold">{isEdit ? '직관 기록 수정' : '직관 기록 추가'}</h1>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700">경기 날짜</label>
        <input type="date" max={today} required value={gameDate}
          onChange={(e) => setGameDate(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">홈팀</label>
          <select required value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="">선택</option>
            {KBO_TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">원정팀</label>
          <select required value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="">선택</option>
            {KBO_TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div>
        <button type="button" onClick={handleFetchGame} disabled={isFetching}
          className="text-sm bg-gray-100 border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-200 disabled:opacity-50">
          {isFetching ? '조회 중...' : '⬇ 경기 불러오기'}
        </button>
        {fetchError && <p className="text-xs text-gray-400 mt-1">{fetchError}</p>}
        {gameData && (
          <div className="mt-2">
            <BoxScore data={gameData} homeTeam={homeTeam} awayTeam={awayTeam} />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">구장</label>
        <select required value={stadium} onChange={(e) => setStadium(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
          <option value="">선택</option>
          {KBO_STADIUMS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">날씨</label>
        <select required value={weather}
          onChange={(e) => { setWeather(e.target.value); if (e.target.value !== '비') setIsCancelled(false) }}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
          <option value="">선택</option>
          {WEATHER_OPTIONS.map((w) => <option key={w} value={w}>{w}</option>)}
        </select>
      </div>

      {weather === '비' && (
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={isCancelled}
            onChange={(e) => { setIsCancelled(e.target.checked); if (e.target.checked) setResult('') }}
            className="w-4 h-4" />
          우천취소
        </label>
      )}

      {!isCancelled && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">결과</label>
          <div className="flex gap-3">
            {(['win', 'lose', 'draw'] as GameResult[]).map((r) => (
              <label key={r} className="flex items-center gap-1 cursor-pointer text-sm">
                <input type="radio" name="result" value={r} checked={result === r}
                  onChange={() => setResult(r)} />
                {r === 'win' ? '승' : r === 'lose' ? '패' : '무'}
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">별점</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setRating(n)}
              className={`text-2xl ${n <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">메모 (선택)</label>
        <textarea value={memo} onChange={(e) => setMemo(e.target.value)} rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={isPending}
          className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
          {isPending ? '저장 중...' : '저장'}
        </button>
        <a href={isEdit ? `/records/${recordId}` : '/records'}
          className="flex-1 text-center border border-gray-300 py-2 rounded-md hover:bg-gray-50">
          취소
        </a>
      </div>
    </form>
  )
}
