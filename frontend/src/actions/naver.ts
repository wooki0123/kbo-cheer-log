'use server'

import { NAVER_TEAM_MAP } from '@/lib/constants/kbo'
import { GameData } from '@/lib/types'

type NaverScheduleGame = {
  gameId: string
  homeTeamCode: string
  awayTeamCode: string
  statusCode: string
}

type NaverPlayer = { name: string }

type NaverRecord = {
  teamPitchingBoxscore: {
    away: { r: number; hit: number; bbhp: number }
    home: { r: number; hit: number; bbhp: number }
  }
  battersBoxscore: {
    away: NaverPlayer[]
    home: NaverPlayer[]
  }
  pitchersBoxscore: {
    away: NaverPlayer[]
    home: NaverPlayer[]
  }
  etcRecords: Array<{ how: string; result: string }>
}

const NAVER_HEADERS = {
  'accept': 'application/json, text/plain, */*',
  'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
  'charset': 'utf-8',
  'origin': 'https://m.sports.naver.com',
  'referer': 'https://m.sports.naver.com/kbaseball/schedule/index',
  'x-sports-backend': 'kotlin',
}

function countErrors(
  etcRecords: NaverRecord['etcRecords'],
  playerNames: Set<string>
): number {
  const errorEntry = etcRecords.find((r) => r.how === '실책')
  if (!errorEntry) return 0

  const parsed = errorEntry.result
    .split(' ')
    .map((token) => token.replace(/\([^)]*\)/g, '').trim())
    .filter(Boolean)

  return parsed.filter((name) => playerNames.has(name)).length
}

export async function fetchGameData(
  date: string,
  homeTeam: string,
  awayTeam: string
): Promise<GameData | null> {
  const homeCode = NAVER_TEAM_MAP[homeTeam]
  const awayCode = NAVER_TEAM_MAP[awayTeam]
  if (!homeCode || !awayCode) return null

  try {
    const scheduleRes = await fetch(
      `https://api-gw.sports.naver.com/schedule/games?fields=basic,schedule,baseball,manualRelayUrl&upperCategoryId=kbaseball&fromDate=${date}&toDate=${date}&size=500`,
      { headers: NAVER_HEADERS, next: { revalidate: 0 } }
    )
    if (!scheduleRes.ok) return null

    const scheduleData = await scheduleRes.json()
    const games: NaverScheduleGame[] = scheduleData?.result?.games ?? []

    const game = games.find(
      (g) => g.homeTeamCode === homeCode && g.awayTeamCode === awayCode
    )
    if (!game) return null


    const recordRes = await fetch(
      `https://api-gw.sports.naver.com/schedule/games/${game.gameId}/record`,
      { headers: NAVER_HEADERS, next: { revalidate: 0 } }
    )
    if (!recordRes.ok) return null

    const raw = (await recordRes.json())?.result?.recordData
    const record = raw as NaverRecord
    const p = record?.teamPitchingBoxscore
    const bs = record?.battersBoxscore
    if (!p || !bs) return null

    const ps = record?.pitchersBoxscore
    const awayNames = new Set([
      ...bs.away.map((b) => b.name),
      ...(ps?.away ?? []).map((p) => p.name),
    ])
    const homeNames = new Set([
      ...bs.home.map((b) => b.name),
      ...(ps?.home ?? []).map((p) => p.name),
    ])

    // away = 원정팀 투수 기록 → 홈팀 타격 결과
    // home = 홈팀 투수 기록 → 원정팀 타격 결과
    return {
      total: {
        home: {
          score: p.away.r,
          hits: p.away.hit,
          errors: countErrors(record.etcRecords ?? [], homeNames),
          walks: p.away.bbhp,
        },
        away: {
          score: p.home.r,
          hits: p.home.hit,
          errors: countErrors(record.etcRecords ?? [], awayNames),
          walks: p.home.bbhp,
        },
      },
    }
  } catch {
    return null
  }
}
