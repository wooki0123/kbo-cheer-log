type Props = {
  label: string
  value: string | number
  sub?: string
}

export default function StatsCard({ label, value, sub }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4 text-center">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-blue-700">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}
