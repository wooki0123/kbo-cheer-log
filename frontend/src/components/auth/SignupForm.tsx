'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <h1 className="text-2xl font-bold mb-4">이메일을 확인해주세요</h1>
        <p className="text-gray-600">{email}로 확인 링크를 보냈습니다.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSignup} className="bg-white p-8 rounded-lg shadow space-y-4">
      <h1 className="text-2xl font-bold text-center">회원가입</h1>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-gray-700">이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? '처리 중...' : '회원가입'}
      </button>
      <p className="text-center text-sm text-gray-600">
        이미 계정이 있으신가요?{' '}
        <a href="/login" className="text-blue-600 hover:underline">
          로그인
        </a>
      </p>
    </form>
  )
}
