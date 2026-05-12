# CONTEXT

현재 작업에 직접 필요한 정보만 유지한다.

## 현재 상태

기본 프로젝트 셋업 완료. Next.js 15 + Supabase Auth 스켈레톤 구성됨.

## 디렉토리 구조

- `frontend/` : Next.js 앱 (App Router + TypeScript + Tailwind)
- `backend/` : Supabase 관련 (마이그레이션, Edge Functions 등, 현재 비어있음)
- `docs/` : 프로젝트 문서

## 환경변수 (frontend/.env.local)

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key
