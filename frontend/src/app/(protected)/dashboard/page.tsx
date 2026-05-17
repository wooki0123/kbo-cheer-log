import { getRecords } from '@/actions/records'
import { getProfile } from '@/actions/profile'
import { calcStats } from '@/lib/stats'
import StatsCard from '@/components/dashboard/StatsCard'
import RecentGames from '@/components/dashboard/RecentGames'
import WinRateStats from '@/components/dashboard/WinRateStats'
import StadiumStats from '@/components/dashboard/StadiumStats'
import MonthlyChart from '@/components/dashboard/MonthlyChart'

export default async function DashboardPage() {
  const [records, profile] = await Promise.all([getRecords(), getProfile()])
  const favoriteTeam = profile?.favorite_team ?? ''
  const stats = calcStats(records, favoriteTeam)

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">내 직관 통계</h1>

      <div>
        <h2 className="text-sm font-semibold text-gray-500 mb-2">내 직관 현황</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatsCard label="총 직관" value={stats.total} sub={`응원 ${stats.played} · 중립 ${stats.neutral} · 취소 ${stats.cancelled}`} />
          <StatsCard label="응원 승률" value={`${stats.winRate}%`} sub={`응원경기 ${stats.played}경기 기준`} />
          <StatsCard label="승 / 패 / 무" value={`${stats.wins} / ${stats.losses} / ${stats.draws}`} />
        </div>
      </div>

      <RecentGames records={stats.recent5} />

      {favoriteTeam && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-2">{favoriteTeam} 경기</h2>
          <WinRateStats
            favoriteTeam={favoriteTeam}
            homeGames={stats.homeGames}
            homeWinRate={stats.homeWinRate}
            awayGames={stats.awayGames}
            awayWinRate={stats.awayWinRate}
          />
        </div>
      )}

      <MonthlyChart weeklyMap={stats.weeklyMap} />

      <StadiumStats stadiumMap={stats.stadiumMap} />
    </div>
  )
}
