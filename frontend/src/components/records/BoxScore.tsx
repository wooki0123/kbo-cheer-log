import { GameData } from '@/lib/types'

export default function BoxScore({ data, homeTeam, awayTeam }: {
  data: GameData
  homeTeam: string
  awayTeam: string
}) {
  const maxInning = Math.max(...data.innings.map((i) => i.inning))

  return (
    <div className="overflow-x-auto">
      <table className="text-sm border-collapse w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-2 py-1 text-left border">팀</th>
            {Array.from({ length: maxInning }, (_, i) => (
              <th key={i + 1} className="px-2 py-1 border">{i + 1}</th>
            ))}
            <th className="px-2 py-1 border font-bold">R</th>
            <th className="px-2 py-1 border">H</th>
            <th className="px-2 py-1 border">E</th>
            <th className="px-2 py-1 border">BB</th>
          </tr>
        </thead>
        <tbody>
          {(['away', 'home'] as const).map((side) => (
            <tr key={side}>
              <td className="px-2 py-1 border font-medium">
                {side === 'home' ? homeTeam : awayTeam}
              </td>
              {data.innings.map((inn) => (
                <td key={inn.inning} className="px-2 py-1 border text-center">
                  {inn[side] ?? '-'}
                </td>
              ))}
              <td className="px-2 py-1 border text-center font-bold">
                {data.total[side].score}
              </td>
              <td className="px-2 py-1 border text-center">{data.total[side].hits}</td>
              <td className="px-2 py-1 border text-center">{data.total[side].errors}</td>
              <td className="px-2 py-1 border text-center">{data.total[side].walks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
