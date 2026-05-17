# CONTEXT

현재 작업에 직접 필요한 정보만 유지한다.

## 현재 상태

MVP 구현 완료. 네이버 스포츠 API 연동 정상 동작 확인 (2026-05-17 디버깅 완료).
R/H/E/BB 박스스코어 표시 동작. 이닝별 점수는 인증 필요로 제외.

## 디렉토리 구조

- `frontend/` : Next.js 앱 (App Router + TypeScript + Tailwind)
- `backend/` : Supabase 관련 (마이그레이션, Edge Functions 등, 현재 비어있음)
- `docs/` : 프로젝트 문서

## 환경변수 (frontend/.env.local)

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key
