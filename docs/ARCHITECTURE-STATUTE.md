# 아키텍처 구현 규칙

## 폴더 구조

- `frontend/src/app/(auth)/` : 인증 페이지 (로그인, 회원가입)
- `frontend/src/app/(protected)/` : 인증이 필요한 페이지
- `frontend/src/components/` : 재사용 가능한 UI 컴포넌트
- `frontend/src/lib/supabase/` : Supabase 클라이언트 (client.ts, server.ts)

## 클라이언트/서버 분리 규칙

- 서버 컴포넌트: `src/lib/supabase/server.ts`의 `createClient()` 사용
- 클라이언트 컴포넌트: `src/lib/supabase/client.ts`의 `createClient()` 사용
- 두 클라이언트를 혼용하지 않는다

## 라우트 보호

- 보호된 경로 추가 시 `frontend/src/middleware.ts`의 `protectedPaths` 배열에 추가
- 인증 경로 추가 시 `authPaths` 배열에 추가
