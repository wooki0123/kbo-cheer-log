'use client'

import { signup } from '@/actions/auth'
import { KBO_TEAMS } from '@/lib/constants/kbo'
import { useActionState } from 'react'

export default function SignupForm() {
  const [state, action, isPending] = useActionState(
    async (_: unknown, formData: FormData) => {
      const result = await signup(formData)
      return result ?? null
    },
    null
  )

  return (
    <form action={action} className="bg-white p-8 rounded-lg shadow space-y-4">
      <h1 className="text-2xl font-bold text-center">회원가입</h1>
      {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
      <div>
        <label className="block text-sm font-medium text-gray-700">이메일</label>
        <input
          type="email"
          name="email"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">비밀번호</label>
        <input
          type="password"
          name="password"
          required
          minLength={6}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">응원팀</label>
        <select
          name="favorite_team"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">팀을 선택하세요</option>
          {KBO_TEAMS.map((team) => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? '처리 중...' : '회원가입'}
      </button>
      <p className="text-center text-sm text-gray-600">
        이미 계정이 있으신가요?{' '}
        <a href="/login" className="text-blue-600 hover:underline">로그인</a>
      </p>
    </form>
  )
}
