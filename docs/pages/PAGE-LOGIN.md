# 로그인 페이지

경로: `/login`
인증: 불필요

---

## 목적

이메일/비밀번호로 로그인.

---

## 화면 구성

- 이메일 입력
- 비밀번호 입력
- 로그인 버튼
- 회원가입 링크 → `/signup`
- 오류 메시지 표시 영역

---

## 동작

1. 폼 제출 → `actions/auth.ts` `login` Server Action 호출
2. 성공 → `/dashboard` 리다이렉트
3. 실패 → 오류 메시지 표시

---

## 기존 파일

`frontend/src/app/(auth)/login/page.tsx`
`frontend/src/components/auth/LoginForm.tsx`
