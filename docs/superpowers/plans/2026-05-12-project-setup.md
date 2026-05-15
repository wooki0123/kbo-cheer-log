# Project Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Next.js 15 + Supabase Auth 기반 인증 포함 스켈레톤 프로젝트를 구성한다.

**Architecture:** App Router + TypeScript + Tailwind CSS. `@supabase/ssr`로 서버/클라이언트 세션을 분리 관리하며, middleware.ts가 보호된 라우트 접근을 제어한다. Route Groups `(auth)`, `(protected)`로 레이아웃을 분리한다.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Supabase (`@supabase/supabase-js`, `@supabase/ssr`)

---

## File Map

| 파일 | 역할 |
|------|------|
| `src/middleware.ts` | 세션 확인 + 라우트 보호/리다이렉트 |
| `src/lib/supabase/client.ts` | 브라우저용 Supabase 클라이언트 |
| `src/lib/supabase/server.ts` | 서버용 Supabase 클라이언트 (cookies 기반) |
| `src/app/layout.tsx` | 루트 레이아웃 |
| `src/app/page.tsx` | 랜딩 페이지 (비로그인: 로그인 유도, 로그인: /dashboard 리다이렉트) |
| `src/app/(auth)/login/page.tsx` | 로그인 페이지 |
| `src/app/(auth)/signup/page.tsx` | 회원가입 페이지 |
| `src/app/(auth)/layout.tsx` | 인증 페이지 공통 레이아웃 |
| `src/app/(protected)/dashboard/page.tsx` | 대시보드 (보호된 라우트) |
| `src/app/(protected)/layout.tsx` | 보호된 페이지 공통 레이아웃 |
| `src/components/auth/LoginForm.tsx` | 로그인 폼 컴포넌트 |
| `src/components/auth/SignupForm.tsx` | 회원가입 폼 컴포넌트 |
| `src/app/auth/callback/route.ts` | Supabase Auth 콜백 라우트 |
| `docs/*.md` | CLAUDE.md 요구 문서들 |

---

### Task 1: Next.js 프로젝트 초기화

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, `.env.local`, `.gitignore`

- [ ] **Step 1: Next.js 프로젝트 생성**

`C:\AIBE6\Agent-coding` 디렉토리에서 실행. 이미 파일이 있으므로 현재 디렉토리에 직접 생성한다.

```bash
cd C:\AIBE6\Agent-coding
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```

프롬프트가 나오면 모두 기본값(Enter)으로 진행.

- [ ] **Step 2: 설치 확인**

```bash
npm run build
```

Expected: `✓ Compiled successfully` 또는 빌드 성공 메시지.

- [ ] **Step 3: .env.local 생성**

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

- [ ] **Step 4: .gitignore에 .env.local 포함 확인**

`create-next-app`이 자동 생성한 `.gitignore`에 `.env.local`이 포함되어 있는지 확인. 없으면 추가.

- [ ] **Step 5: 커밋**

```bash
git add -A
git commit -m "chore: initialize Next.js 15 with TypeScript and Tailwind"
```

---

### Task 2: Supabase 패키지 설치 및 클라이언트 설정

**Files:**
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`

- [ ] **Step 1: 패키지 설치**

```bash
npm install @supabase/supabase-js @supabase/ssr
```

- [ ] **Step 2: 브라우저용 클라이언트 생성**

`src/lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 3: 서버용 클라이언트 생성**

`src/lib/supabase/server.ts`:

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component에서 호출 시 무시 (middleware가 세션 갱신 처리)
          }
        },
      },
    }
  )
}
```

- [ ] **Step 4: 빌드 확인**

```bash
npm run build
```

Expected: 빌드 성공.

- [ ] **Step 5: 커밋**

```bash
git add src/lib/supabase/client.ts src/lib/supabase/server.ts package.json package-lock.json
git commit -m "feat: add Supabase client setup (browser and server)"
```

---

### Task 3: Middleware 설정

**Files:**
- Create: `src/middleware.ts`

- [ ] **Step 1: middleware.ts 생성**

`src/middleware.ts`:

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const protectedPaths = ['/dashboard']
  const authPaths = ['/login', '/signup']

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))
  const isAuthPath = authPaths.some((p) => pathname.startsWith(p))

  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthPath && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

- [ ] **Step 2: 빌드 확인**

```bash
npm run build
```

Expected: 빌드 성공.

- [ ] **Step 3: 커밋**

```bash
git add src/middleware.ts
git commit -m "feat: add auth middleware for route protection"
```

---

### Task 4: 인증 페이지 생성 (로그인 / 회원가입)

**Files:**
- Create: `src/app/(auth)/layout.tsx`
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/app/(auth)/signup/page.tsx`
- Create: `src/components/auth/LoginForm.tsx`
- Create: `src/components/auth/SignupForm.tsx`
- Create: `src/app/auth/callback/route.ts`

- [ ] **Step 1: Auth 레이아웃 생성**

`src/app/(auth)/layout.tsx`:

```typescript
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
```

- [ ] **Step 2: Supabase Auth 콜백 라우트 생성**

`src/app/auth/callback/route.ts`:

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
```

- [ ] **Step 3: LoginForm 컴포넌트 생성**

`src/components/auth/LoginForm.tsx`:

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow space-y-4">
      <h1 className="text-2xl font-bold text-center">로그인</h1>
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
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? '로그인 중...' : '로그인'}
      </button>
      <p className="text-center text-sm text-gray-600">
        계정이 없으신가요?{' '}
        <a href="/signup" className="text-blue-600 hover:underline">
          회원가입
        </a>
      </p>
    </form>
  )
}
```

- [ ] **Step 4: SignupForm 컴포넌트 생성**

> **주의:** 이메일 인증 없음. Supabase "Confirm email" OFF 설정 완료. 회원가입 성공 시 `/login`으로 리다이렉트.

`src/components/auth/SignupForm.tsx`:

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignupForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/login')
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
```

- [ ] **Step 5: 로그인 페이지 생성**

`src/app/(auth)/login/page.tsx`:

```typescript
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return <LoginForm />
}
```

- [ ] **Step 6: 회원가입 페이지 생성**

`src/app/(auth)/signup/page.tsx`:

```typescript
import SignupForm from '@/components/auth/SignupForm'

export default function SignupPage() {
  return <SignupForm />
}
```

- [ ] **Step 7: 빌드 확인**

```bash
npm run build
```

Expected: 빌드 성공.

- [ ] **Step 8: 커밋**

```bash
git add src/app/\(auth\)/ src/components/auth/ src/app/auth/
git commit -m "feat: add login and signup pages with Supabase auth"
```

---

### Task 5: 보호된 라우트 및 랜딩 페이지 생성

**Files:**
- Create: `src/app/(protected)/layout.tsx`
- Create: `src/app/(protected)/dashboard/page.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Protected 레이아웃 생성**

`src/app/(protected)/layout.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <span className="font-bold text-lg">App</span>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            로그아웃
          </button>
        </form>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  )
}
```

- [ ] **Step 2: 로그아웃 라우트 생성**

`src/app/auth/signout/route.ts`:

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL('/login', request.url))
}
```

- [ ] **Step 3: 대시보드 페이지 생성**

`src/app/(protected)/dashboard/page.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">대시보드</h1>
      <p className="text-gray-600">
        안녕하세요, {user?.email}님
      </p>
    </div>
  )
}
```

- [ ] **Step 4: 랜딩 페이지 수정**

`src/app/page.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

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
```

- [ ] **Step 5: 루트 레이아웃 정리**

`src/app/layout.tsx`:

```typescript
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'App',
  description: 'Next.js + Supabase App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={geist.className}>{children}</body>
    </html>
  )
}
```

- [ ] **Step 6: 빌드 확인**

```bash
npm run build
```

Expected: 빌드 성공.

- [ ] **Step 7: 커밋**

```bash
git add src/app/\(protected\)/ src/app/page.tsx src/app/layout.tsx src/app/auth/signout/
git commit -m "feat: add dashboard page, landing page, and signout route"
```

---

### Task 6: CLAUDE.md 요구 문서 생성

**Files:**
- Create: `docs/CONTEXT.md`
- Create: `docs/TODO-READY.md`
- Create: `docs/TODO-DOING.md`
- Create: `docs/TODO-BACKLOG.md`
- Create: `docs/TODO-DONE.md`
- Create: `docs/ARCHITECTURE-CONSTITUTION.md`
- Create: `docs/ARCHITECTURE-STATUTE.md`
- Create: `docs/DOMAIN-COMMON-CONSTITUTION.md`
- Create: `docs/DOMAIN-COMMON-STATUTE.md`
- Create: `docs/DOMAIN-MEMBER-CONSTITUTION.md`
- Create: `docs/DOMAIN-MEMBER-STATUTE.md`
- Create: `docs/AI-ACTION-LOGS.md`
- Create: `docs/AI-MAJOR-EVENT.md`
- Create: `docs/AI-MAJOR-EVENT-RECAP.md`

- [ ] **Step 1: CONTEXT.md 생성**

`docs/CONTEXT.md`:

```markdown
# CONTEXT

현재 작업에 직접 필요한 정보만 유지한다.

## 현재 상태

기본 프로젝트 셋업 완료. Next.js 15 + Supabase Auth 스켈레톤 구성됨.

## 환경변수

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key
```

- [ ] **Step 2: 아키텍처 원칙 문서 생성**

`docs/ARCHITECTURE-CONSTITUTION.md`:

```markdown
# 아키텍처 핵심 원칙

1. **서버 컴포넌트 우선**: 클라이언트 상태가 필요한 경우에만 `use client` 사용
2. **Supabase SSR**: 세션은 반드시 `@supabase/ssr`을 통해 서버/클라이언트 분리 관리
3. **인증 위임**: 라우트 보호는 middleware.ts가 담당, 개별 페이지에서 중복 처리 금지
4. **단방향 의존성**: components → lib → (external). lib이 components를 참조하지 않는다
```

- [ ] **Step 3: 아키텍처 구현 규칙 문서 생성**

`docs/ARCHITECTURE-STATUTE.md`:

```markdown
# 아키텍처 구현 규칙

## 폴더 구조

- `src/app/(auth)/` : 인증 페이지 (로그인, 회원가입)
- `src/app/(protected)/` : 인증이 필요한 페이지
- `src/components/` : 재사용 가능한 UI 컴포넌트
- `src/lib/supabase/` : Supabase 클라이언트 (client.ts, server.ts)

## 클라이언트/서버 분리 규칙

- 서버 컴포넌트: `src/lib/supabase/server.ts`의 `createClient()` 사용
- 클라이언트 컴포넌트: `src/lib/supabase/client.ts`의 `createClient()` 사용
- 두 클라이언트를 혼용하지 않는다

## 라우트 보호

- 보호된 경로 추가 시 `src/middleware.ts`의 `protectedPaths` 배열에 추가
- 인증 경로 추가 시 `authPaths` 배열에 추가
```

- [ ] **Step 4: 공통 도메인 문서 생성**

`docs/DOMAIN-COMMON-CONSTITUTION.md`:

```markdown
# 공통 도메인 원칙

1. **타입 우선**: 모든 데이터 구조는 TypeScript 타입으로 먼저 정의한다
2. **에러 명시**: 함수는 에러를 throw하지 않고 `{ data, error }` 형태로 반환한다
3. **단일 책임**: 컴포넌트는 하나의 명확한 역할만 가진다
```

`docs/DOMAIN-COMMON-STATUTE.md`:

```markdown
# 공통 도메인 규칙

## 컴포넌트 네이밍

- 파일명: PascalCase (예: `LoginForm.tsx`)
- 컴포넌트명: 파일명과 동일

## 파일 구조

- 페이지: `src/app/...` (Next.js App Router 규칙)
- 컴포넌트: `src/components/<domain>/ComponentName.tsx`
- 유틸리티: `src/lib/<purpose>/`

## 에러 처리

- Supabase 응답의 `error` 필드를 항상 확인
- 사용자에게 보여주는 에러 메시지는 한국어로 작성
```

- [ ] **Step 5: 회원 도메인 문서 생성**

`docs/DOMAIN-MEMBER-CONSTITUTION.md`:

```markdown
# 회원 도메인 원칙

1. **Supabase Auth 위임**: 인증 로직은 Supabase Auth에 위임하고 직접 구현하지 않는다
2. **세션 불변성**: 세션 토큰을 직접 조작하지 않는다. Supabase 클라이언트 메서드만 사용
3. **이메일 인증**: 회원가입 시 이메일 확인을 기본으로 한다
```

`docs/DOMAIN-MEMBER-STATUTE.md`:

```markdown
# 회원 도메인 규칙

## Supabase Auth 사용 규칙

- 로그인: `supabase.auth.signInWithPassword({ email, password })`
- 회원가입: `supabase.auth.signUp({ email, password, options: { emailRedirectTo } })`
- 로그아웃: `supabase.auth.signOut()`
- 세션 확인: `supabase.auth.getUser()` (토큰 검증 포함, getSession() 사용 금지)

## 인증 상태 관리

- 서버: `src/lib/supabase/server.ts`의 createClient로 getUser() 호출
- 클라이언트: `src/lib/supabase/client.ts`의 createClient로 auth 메서드 호출
- 전역 상태(zustand, context 등)에 user를 저장하지 않는다. 필요 시 서버에서 직접 조회
```

- [ ] **Step 6: TODO 및 로그 문서 생성**

`docs/TODO-READY.md`:

```markdown
# TODO-READY

바로 작업 가능한 항목들.

- 도메인별 기능 구현 (기획 확정 후)
- Supabase DB 테이블 설계 및 마이그레이션
- 프로필 페이지 추가
```

`docs/TODO-DOING.md`:

```markdown
# TODO-DOING

현재 진행 중인 작업.

(없음)
```

`docs/TODO-BACKLOG.md`:

```markdown
# TODO-BACKLOG

아직 시작하지 않은 예정 작업.

- 소셜 로그인 (Google, GitHub)
- 비밀번호 재설정 플로우
```

`docs/TODO-DONE.md`:

```markdown
# TODO-DONE

## 2026-05-12

- [x] 프로젝트 기본 셋업 (Next.js 15 + Supabase Auth 스켈레톤)
```

`docs/AI-ACTION-LOGS.md`:

```markdown
# AI-ACTION-LOGS

최근 작업 로그 (최대 100개 유지).

## 2026-05-12

- 프로젝트 초기 셋업: Next.js 15 + TypeScript + Tailwind + Supabase Auth
- 아키텍처/도메인 문서 초기 생성
```

`docs/AI-MAJOR-EVENT.md`:

```markdown
# AI-MAJOR-EVENT

주요 사건 및 의사결정.

## 2026-05-12 — 프로젝트 셋업

- Next.js 15 + App Router + TypeScript 채택
- Supabase Auth를 이메일/비밀번호 방식으로 구성
- @supabase/ssr 패키지 사용 (서버사이드 세션 관리)
- 5일 단기 프로젝트 → 미니멀 셋업 + 인증 포함으로 결정
```

`docs/AI-MAJOR-EVENT-RECAP.md`:

```markdown
# AI-MAJOR-EVENT-RECAP

빠르게 읽기 위한 주요 사건 요약.

| 날짜 | 사건 | 결정 |
|------|------|------|
| 2026-05-12 | 프로젝트 초기 셋업 | Next.js 15 + Supabase Auth 스켈레톤 구성 |
```

- [ ] **Step 7: 커밋**

```bash
git add docs/
git commit -m "docs: add CLAUDE.md required documents and architecture/domain docs"
```

---

### Task 7: 최종 확인

- [ ] **Step 1: ESLint 확인**

```bash
npm run lint
```

Expected: 에러 없음.

- [ ] **Step 2: 빌드 최종 확인**

```bash
npm run build
```

Expected: 빌드 성공.

- [ ] **Step 3: 개발 서버 실행 확인**

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속 후 확인:
- `/` → 랜딩 페이지 표시
- `/dashboard` → `/login`으로 리다이렉트
- `/login` → 로그인 폼 표시
- `/signup` → 회원가입 폼 표시

- [ ] **Step 4: 최종 커밋**

```bash
git add -A
git commit -m "chore: project setup complete"
```
