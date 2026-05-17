import { GameRecord } from './types'

export function calcStats(records: GameRecord[], favoriteTeam: string) {
  const played = records.filter((r) => !r.is_cancelled && r.result !== null)
  const neutral = records.filter((r) => !r.is_cancelled && r.result === null).length
  const cancelled = records.filter((r) => r.is_cancelled).length
  const wins = played.filter((r) => r.result === 'win').length
  const losses = played.filter((r) => r.result === 'lose').length
  const draws = played.filter((r) => r.result === 'draw').length
  const winRate = played.length > 0 ? Math.round((wins / played.length) * 100) : 0

  const homeGames = played.filter((r) => r.home_team === favoriteTeam)
  const awayGames = played.filter((r) => r.away_team === favoriteTeam)
  const homeWins = homeGames.filter((r) => r.result === 'win').length
  const awayWins = awayGames.filter((r) => r.result === 'win').length
  const homeWinRate = homeGames.length > 0 ? Math.round((homeWins / homeGames.length) * 100) : 0
  const awayWinRate = awayGames.length > 0 ? Math.round((awayWins / awayGames.length) * 100) : 0

  const stadiumMap: Record<string, number> = {}
  records.forEach((r) => {
    stadiumMap[r.stadium] = (stadiumMap[r.stadium] ?? 0) + 1
  })

  const weeklyMap: Record<string, number> = {}
  records.forEach((r) => {
    const week = Math.ceil(new Date(r.game_date).getDate() / 7)
    const key = `${r.game_date.slice(0, 7)}-W${week}`
    weeklyMap[key] = (weeklyMap[key] ?? 0) + 1
  })

  const recent5 = [...records]
    .sort((a, b) => b.game_date.localeCompare(a.game_date))
    .slice(0, 5)

  return {
    total: records.length,
    played: played.length,
    neutral,
    cancelled,
    wins,
    losses,
    draws,
    winRate,
    homeGames: homeGames.length,
    homeWinRate,
    awayGames: awayGames.length,
    awayWinRate,
    stadiumMap,
    weeklyMap,
    recent5,
  }
}
