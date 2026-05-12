import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <span className="font-bold text-lg">App</span>
        <form action="/auth/signout" method="post">
          <button type="submit" className="text-sm text-gray-600 hover:text-gray-900">
            로그아웃
          </button>
        </form>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  )
}
