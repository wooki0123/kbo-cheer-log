'use server'

import { NAVER_TEAM_MAP } from '@/lib/constants/kbo'
import { GameData } from '@/lib/types'

type NaverScheduleGame = {
  gameId: string
  homeTeamCode: string
  awayTeamCode: string
  statusCode: string
}

type NaverBoxScore = {
  inningScoreList: Array<{
    inning: number
    homeScore: number | null
    awayScore: number | null
  }>
  homeTeamEtcRecords: Array<{ recordType: string; count: number }>
  awayTeamEtcRecords: Array<{ recordType: string; count: number }>
  homeScore: number
  awayScore: number
}

export async function fetchGameData(
  date: string,
  homeTeam: string,
  awayTeam: string
): Promise<GameData | null> {
  const homeCode = NAVER_TEAM_MAP[homeTeam]
  const awayCode = NAVER_TEAM_MAP[awayTeam]
  if (!homeCode || !awayCode) return null

  const formattedDate = date.replace(/-/g, '')

  try {
    const scheduleRes = await fetch(
      `https://api-gw.sports.naver.com/schedule/games?fields=basic,superBrief,brief,schedule,record&upperCategoryId=kbaseball&categoryId=kbo&fromDate=${formattedDate}&toDate=${formattedDate}`,
      { headers: { Referer: 'https://sports.naver.com' }, next: { revalidate: 0 } }
    )
    if (!scheduleRes.ok) return null

    const scheduleData = await scheduleRes.json()
    const games: NaverScheduleGame[] = scheduleData?.result?.games ?? []

    const game = games.find(
      (g) => g.homeTeamCode === homeCode && g.awayTeamCode === awayCode
    )
    if (!game) return null

    const boxRes = await fetch(
      `https://api-gw.sports.naver.com/game/${game.gameId}/record?fields=boxscore`,
      { headers: { Referer: 'https://sports.naver.com' }, next: { revalidate: 0 } }
    )
    if (!boxRes.ok) return null

    const boxData = await boxRes.json()
    const box: NaverBoxScore = boxData?.result?.boxscore

    if (!box) return null

    const getCount = (records: Array<{ recordType: string; count: number }>, type: string) =>
      records.find((r) => r.recordType === type)?.count ?? 0

    return {
      innings: box.inningScoreList.map((s) => ({
        inning: s.inning,
        home: s.homeScore,
        away: s.awayScore,
      })),
      total: {
        home: {
          score: box.homeScore,
          hits: getCount(box.homeTeamEtcRecords, 'HIT'),
          errors: getCount(box.homeTeamEtcRecords, 'ERROR'),
          walks: getCount(box.homeTeamEtcRecords, 'BB'),
        },
        away: {
          score: box.awayScore,
          hits: getCount(box.awayTeamEtcRecords, 'HIT'),
          errors: getCount(box.awayTeamEtcRecords, 'ERROR'),
          walks: getCount(box.awayTeamEtcRecords, 'BB'),
        },
      },
    }
  } catch {
    return null
  }
}
