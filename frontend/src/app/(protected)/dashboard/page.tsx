import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">대시보드</h1>
      <p className="text-gray-600">안녕하세요, {user?.email}님</p>
    </div>
  )
}
