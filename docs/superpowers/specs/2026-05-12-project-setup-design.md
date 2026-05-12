# 프로젝트 셋업 설계 (2026-05-12)

## 개요

Next.js (App Router + TypeScript) + Supabase (Auth + DB) 기반의 인증 포함 기본 스켈레톤.
기획 확정 전 골격 구성을 목적으로 하며, 5일 이내 소규모 프로젝트를 전제로 한다.

---

## 기술 스택

- **Frontend:** Next.js 15, App Router, TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Supabase (Auth + PostgreSQL)
- **Supabase 클라이언트:** `@supabase/ssr` (SSR 공식 패키지)

---

## 아키텍처

```
[Browser]
    ↓
[Next.js App Router]
    ├── middleware.ts         → 보호된 라우트 접근 제어
    ├── /app/(auth)/          → 로그인, 회원가입 페이지
    └── /app/(protected)/     → 인증 필요한 페이지들
         ↓
[Supabase]
    ├── Auth    → 세션 관리, JWT
    └── DB      → PostgreSQL (추후 도메인 테이블 추가)
```

- 비로그인 상태에서 보호된 라우트 접근 시 → middleware가 `/login`으로 리다이렉트
- 로그인 성공 시 → Supabase 세션 발급, `/dashboard`로 이동
- 서버 컴포넌트에서 Supabase 서버 클라이언트로 세션 확인

---

## 폴더 구조

```
Agent-coding/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── (protected)/
│   │   │   └── dashboard/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── auth/
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts     → 브라우저용 클라이언트
│   │       └── server.ts     → 서버용 클라이언트
│   └── middleware.ts
├── docs/
│   ├── CONTEXT.md
│   ├── TODO-READY.md
│   ├── TODO-DOING.md
│   ├── TODO-BACKLOG.md
│   ├── TODO-DONE.md
│   ├── ARCHITECTURE-CONSTITUTION.md
│   ├── ARCHITECTURE-STATUTE.md
│   ├── DOMAIN-COMMON-CONSTITUTION.md
│   ├── DOMAIN-COMMON-STATUTE.md
│   ├── DOMAIN-MEMBER-CONSTITUTION.md
│   ├── DOMAIN-MEMBER-STATUTE.md
│   ├── AI-ACTION-LOGS.md
│   ├── AI-MAJOR-EVENT.md
│   └── AI-MAJOR-EVENT-RECAP.md
├── .env.local
└── ...
```

---

## 인증 흐름

### 지원 방식
- 이메일/비밀번호 (기본)

### 페이지별 동작

| 페이지 | 비로그인 | 로그인 상태 |
|--------|----------|-------------|
| `/` | 접근 가능 (로그인 유도) | `/dashboard` 리다이렉트 |
| `/login` | 접근 가능 | `/dashboard` 리다이렉트 |
| `/signup` | 접근 가능 | `/dashboard` 리다이렉트 |
| `/dashboard` | `/login` 리다이렉트 | 접근 가능 |

### Middleware 동작
```
요청 → middleware.ts
  → Supabase 세션 확인
  → 보호된 경로 + 비로그인 → /login 리다이렉트
  → 인증 경로 + 로그인 상태 → /dashboard 리다이렉트
  → 그 외 → 통과
```

### 환경변수 (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## CLAUDE.md 문서 구조

### 아키텍처
- `ARCHITECTURE-CONSTITUTION.md`: App Router 기반, 서버 컴포넌트 우선, Supabase SSR 원칙
- `ARCHITECTURE-STATUTE.md`: 폴더 구조 규칙, 클라이언트/서버 분리 규칙

### 도메인
- `DOMAIN-COMMON-CONSTITUTION.md`: 공통 원칙 (에러 처리, 타입 정의 방식)
- `DOMAIN-COMMON-STATUTE.md`: 공통 규칙 (컴포넌트 네이밍, 파일 구조)
- `DOMAIN-MEMBER-CONSTITUTION.md`: 회원 도메인 원칙 (인증 상태 관리 방식)
- `DOMAIN-MEMBER-STATUTE.md`: 회원 도메인 규칙 (Supabase Auth 사용 규칙)

---

## 결정 근거

- 5일 단기 프로젝트 → 재작업 비용 최소화를 위해 인증 포함 셋업 선택
- App Router + TypeScript → Next.js 최신 표준
- `@supabase/ssr` → 서버 컴포넌트에서 세션 처리를 위한 공식 패키지
- Route Groups `(auth)`, `(protected)` → 레이아웃 분리 및 미들웨어 제어 용이
