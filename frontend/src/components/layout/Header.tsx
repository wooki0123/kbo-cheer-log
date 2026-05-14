import { signout } from '@/actions/auth'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-blue-700 text-white px-4 py-3 flex items-center justify-between">
      <Link href="/dashboard" className="text-lg font-bold">⚾ KBO 직관 기록</Link>
      <nav className="flex items-center gap-4 text-sm">
        <Link href="/records" className="hover:underline">내 기록</Link>
        <Link
          href="/records/new"
          className="bg-white text-blue-700 px-3 py-1 rounded-md font-medium hover:bg-blue-50"
        >
          + 기록 추가
        </Link>
        <form action={signout}>
          <button type="submit" className="hover:underline">로그아웃</button>
        </form>
      </nav>
    </header>
  )
}
