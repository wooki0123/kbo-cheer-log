import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">환영합니다</h1>
      <p className="text-gray-600 mb-8">시작하려면 로그인하세요.</p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          로그인
        </Link>
        <Link
          href="/signup"
          className="border border-blue-600 text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50"
        >
          회원가입
        </Link>
      </div>
    </main>
  )
}
