# 회원 도메인 규칙

## Supabase Auth 사용 규칙

- 로그인: `supabase.auth.signInWithPassword({ email, password })`
- 회원가입: `supabase.auth.signUp({ email, password })` (emailRedirectTo 사용 금지 — 이메일 인증 없음)
- 로그아웃: `supabase.auth.signOut()`
- 세션 확인: `supabase.auth.getUser()` (토큰 검증 포함, `getSession()` 사용 금지)

## 인증 상태 관리

- 서버: `frontend/src/lib/supabase/server.ts`의 createClient로 getUser() 호출
- 클라이언트: `frontend/src/lib/supabase/client.ts`의 createClient로 auth 메서드 호출
- 전역 상태(zustand, context 등)에 user를 저장하지 않는다. 필요 시 서버에서 직접 조회
