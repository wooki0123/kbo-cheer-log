import { getRecords } from '@/actions/records'
import { getProfile } from '@/actions/profile'
import { calcStats } from '@/lib/stats'
import StatsCard from '@/components/dashboard/StatsCard'
import RecentGames from '@/components/dashboard/RecentGames'
import WinRateStats from '@/components/dashboard/WinRateStats'
import StadiumStats from '@/components/dashboard/StadiumStats'

export default async function DashboardPage() {
  const [records, profile] = await Promise.all([getRecords(), getProfile()])
  const favoriteTeam = profile?.favorite_team ?? ''
  const stats = calcStats(records, favoriteTeam)

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">
        {favoriteTeam ? `${favoriteTeam} 직관 통계` : '직관 통계'}
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatsCard label="총 직관" value={stats.total} sub="우천취소 포함" />
        <StatsCard label="승률" value={`${stats.winRate}%`} sub={`${stats.played}경기 기준`} />
        <StatsCard label="승 / 패 / 무" value={`${stats.wins} / ${stats.losses} / ${stats.draws}`} />
      </div>

      <RecentGames records={stats.recent5} />

      <WinRateStats
        homeGames={stats.homeGames}
        homeWinRate={stats.homeWinRate}
        awayGames={stats.awayGames}
        awayWinRate={stats.awayWinRate}
      />

      <StadiumStats stadiumMap={stats.stadiumMap} />
    </div>
  )
}
