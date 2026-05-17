type Props = {
  homeGames: number
  homeWinRate: number
  awayGames: number
  awayWinRate: number
}

export default function WinRateStats({ homeGames, homeWinRate, awayGames, awayWinRate }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-sm font-semibold text-gray-600 mb-3">홈 / 원정 승률 <span className="font-normal text-gray-400">(응원경기 기준)</span></h2>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-xs text-gray-400">홈 ({homeGames}경기)</p>
          <p className="text-2xl font-bold text-blue-600">{homeWinRate}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">원정 ({awayGames}경기)</p>
          <p className="text-2xl font-bold text-green-600">{awayWinRate}%</p>
        </div>
      </div>
    </div>
  )
}
