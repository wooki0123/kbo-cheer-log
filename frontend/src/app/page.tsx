import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <div className="text-6xl mb-4">⚾</div>
      <h1 className="text-4xl font-bold mb-2">KBO 직관 기록</h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        내가 직접 본 KBO 경기를 기록하고, 나만의 직관 통계를 확인하세요.
      </p>
      <div className="flex gap-4">
        <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
          로그인
        </Link>
        <Link href="/signup" className="border border-blue-600 text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50">
          회원가입
        </Link>
      </div>
    </main>
  )
}
