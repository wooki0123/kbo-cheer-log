export type GameResult = 'win' | 'lose' | 'draw'

export type GameData = {
  total: {
    home: { score: number; hits: number; errors: number; walks: number }
    away: { score: number; hits: number; errors: number; walks: number }
  }
}

export type GameRecord = {
  id: string
  user_id: string
  game_date: string
  home_team: string
  away_team: string
  result: GameResult | null
  is_cancelled: boolean
  stadium: string
  weather: string
  rating: number
  memo: string | null
  innings_data: GameData | null
  hits_home: number | null
  hits_away: number | null
  errors_home: number | null
  errors_away: number | null
  walks_home: number | null
  walks_away: number | null
  created_at: string
}

export type Profile = {
  id: string
  favorite_team: string
  created_at: string
}

export type CreateGameRecordInput = {
  game_date: string
  home_team: string
  away_team: string
  result: GameResult | null
  is_cancelled: boolean
  stadium: string
  weather: string
  rating: number
  memo: string
  innings_data: GameData | null
  hits_home: number | null
  hits_away: number | null
  errors_home: number | null
  errors_away: number | null
  walks_home: number | null
  walks_away: number | null
}
