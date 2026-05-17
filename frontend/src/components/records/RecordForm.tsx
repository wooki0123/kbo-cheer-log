'use client'

import { useState, useTransition } from 'react'
import { KBO_TEAMS, KBO_STADIUMS, WEATHER_OPTIONS, HOME_STADIUM_MAP } from '@/lib/constants/kbo'
import { fetchGameData, fetchAwayTeam } from '@/actions/naver'
import { createRecord, updateRecord } from '@/actions/records'
import { GameData, GameRecord, GameResult } from '@/lib/types'
import BoxScore from './BoxScore'

type CheeringTeam = 'home' | 'away' | 'neutral'

type Props = {
  initialData?: GameRecord
  recordId?: string
  favoriteTeam?: string
}

export default function RecordForm({ initialData, recordId, favoriteTeam }: Props) {
  const isEdit = !!recordId
  const [isPending, startTransition] = useTransition()
  const [gameDate, setGameDate] = useState(initialData?.game_date ?? '')
  const [homeTeam, setHomeTeam] = useState(initialData?.home_team ?? '')
  const [awayTeam, setAwayTeam] = useState(initialData?.away_team ?? '')

  const inferCheeringTeam = (home: string, away: string): CheeringTeam | '' => {
    if (!favoriteTeam) return ''
    if (home === favoriteTeam) return 'home'
    if (away === favoriteTeam) return 'away'
    return ''
  }

  const [cheeringTeam, setCheeringTeam] = useState<CheeringTeam | ''>(
    () => inferCheeringTeam(initialData?.home_team ?? '', initialData?.away_team ?? '')
  )
  const [result, setResult] = useState<GameResult | ''>(initialData?.result ?? '')
  const [isCancelled, setIsCancelled] = useState(initialData?.is_cancelled ?? false)
  const [stadium, setStadium] = useState(initialData?.stadium ?? '')
  const [weather, setWeather] = useState(initialData?.weather ?? '')
  const [rating, setRating] = useState(initialData?.rating ?? 0)
  const [memo, setMemo] = useState(initialData?.memo ?? '')
  const [gameData, setGameData] = useState<GameData | null>(initialData?.innings_data ?? null)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isFetching, setIsFetching] = useState(false)
  const [isFetchingAway, setIsFetchingAway] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0]

  // 진행 단계 가시성
  const showTeams = isEdit || gameDate !== ''
  const showCheeringTeam = isEdit || (homeTeam !== '' && awayTeam !== '')
  const showWeather = isEdit || cheeringTeam !== ''
  const resultResolved = isCancelled || cheeringTeam === 'neutral' || result !== ''
  const showResult = cheeringTeam !== '' && cheeringTeam !== 'neutral' && !isCancelled && (isEdit || weather !== '')
  const showRatingMemo = isEdit || (weather !== '' && resultResolved)
  const saveEnabled = rating > 0

  const autoSelectResult = (cheering: CheeringTeam | '', data: GameData | null) => {
    if (!data || !cheering || cheering === 'neutral') return
    const { home, away } = data.total
    const myScore = cheering === 'home' ? home.score : away.score
    const oppScore = cheering === 'home' ? away.score : home.score
    setResult(myScore > oppScore ? 'win' : myScore < oppScore ? 'lose' : 'draw')
  }

  const autoFetchAway = async (date: string, home: string) => {
    if (!date || !home) return
    setIsFetchingAway(true)
    const away = await fetchAwayTeam(date, home)
    setIsFetchingAway(false)
    if (away) {
      setAwayTeam(away)
      setCheeringTeam(inferCheeringTeam(home, away))
    }
  }

  const handleFetchGame = async () => {
    if (!gameDate || !homeTeam || !awayTeam) return
    setIsFetching(true)
    setFetchError(null)
    const data = await fetchGameData(gameDate, homeTeam, awayTeam)
    setIsFetching(false)
    if (!data) setFetchError('경기 데이터를 찾을 수 없습니다.')
    else { setGameData(data); autoSelectResult(cheeringTeam, data) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (homeTeam === awayTeam) { setError('홈팀과 원정팀이 같을 수 없습니다.'); return }

    const payload = {
      game_date: gameDate,
      home_team: homeTeam,
      away_team: awayTeam,
      result: (isCancelled || cheeringTeam === 'neutral') ? null : (result as GameResult),
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

      {/* 1. 날짜 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">경기 날짜</label>
        <input type="date" max={today} required value={gameDate}
          onChange={(e) => { setGameDate(e.target.value); autoFetchAway(e.target.value, homeTeam) }}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
      </div>

      {/* 2. 홈팀 / 원정팀 / 구장 / 경기 불러오기 */}
      {showTeams && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">홈팀</label>
              <select required value={homeTeam} onChange={(e) => {
                  const team = e.target.value
                  setHomeTeam(team)
                  if (HOME_STADIUM_MAP[team]) setStadium(HOME_STADIUM_MAP[team])
                  setCheeringTeam(inferCheeringTeam(team, awayTeam))
                  autoFetchAway(gameDate, team)
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="">선택</option>
                {KBO_TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                원정팀{isFetchingAway && <span className="ml-1 text-xs text-gray-400">조회 중...</span>}
              </label>
              <select required value={awayTeam} onChange={(e) => {
                  const team = e.target.value
                  setAwayTeam(team)
                  setCheeringTeam(inferCheeringTeam(homeTeam, team))
                }}
                disabled={isFetchingAway}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 disabled:opacity-50">
                <option value="">선택</option>
                {KBO_TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
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
            <button type="button" onClick={handleFetchGame}
              disabled={isFetching || !homeTeam || !awayTeam}
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
        </>
      )}

      {/* 3. 응원팀 */}
      {showCheeringTeam && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">오늘 응원한 팀</label>
          <div className="flex gap-2">
            {([
              { value: 'home', label: homeTeam || '홈팀' },
              { value: 'away', label: awayTeam || '원정팀' },
              { value: 'neutral', label: '중립' },
            ] as { value: CheeringTeam; label: string }[]).map(({ value, label }) => (
              <button key={value} type="button"
                onClick={() => {
                  setCheeringTeam(value)
                  if (value === 'neutral') setResult('')
                  else autoSelectResult(value, gameData)
                }}
                className={`flex-1 py-1.5 text-sm rounded-md border ${
                  cheeringTeam === value
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. 날씨 */}
      {showWeather && (
        <>
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
        </>
      )}

      {/* 5. 결과 */}
      {showResult && (
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

      {/* 6. 별점 / 메모 */}
      {showRatingMemo && (
        <>
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
        </>
      )}

      {/* 7. 저장 */}
      <div className="flex gap-3">
        <button type="submit" disabled={isPending || !saveEnabled}
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
