'use client'

import { login } from '@/actions/auth'
import { useActionState } from 'react'

export default function LoginForm() {
  const [state, action, isPending] = useActionState(
    async (_: unknown, formData: FormData) => {
      const result = await login(formData)
      return result ?? null
    },
    null
  )

  return (
    <form action={action} className="bg-white p-8 rounded-lg shadow space-y-4">
      <h1 className="text-2xl font-bold text-center">로그인</h1>
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
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? '로그인 중...' : '로그인'}
      </button>
      <p className="text-center text-sm text-gray-600">
        계정이 없으신가요?{' '}
        <a href="/signup" className="text-blue-600 hover:underline">회원가입</a>
      </p>
    </form>
  )
}
