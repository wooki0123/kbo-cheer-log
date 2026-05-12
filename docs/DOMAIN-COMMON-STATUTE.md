# 공통 도메인 규칙

## 컴포넌트 네이밍

- 파일명: PascalCase (예: `LoginForm.tsx`)
- 컴포넌트명: 파일명과 동일

## 파일 구조

- 페이지: `frontend/src/app/...` (Next.js App Router 규칙)
- 컴포넌트: `frontend/src/components/<domain>/ComponentName.tsx`
- 유틸리티: `frontend/src/lib/<purpose>/`

## 에러 처리

- Supabase 응답의 `error` 필드를 항상 확인
- 사용자에게 보여주는 에러 메시지는 한국어로 작성
