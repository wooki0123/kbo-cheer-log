# 회원가입 페이지

경로: `/signup`
인증: 불필요

---

## 목적

이메일/비밀번호 + 응원팀 선택으로 가입.

---

## 화면 구성

- 이메일 입력
- 비밀번호 입력
- 응원팀 선택 (KBO 10개 팀 드롭다운 또는 선택 버튼)
- 가입 버튼
- 로그인 링크 → `/login`
- 오류 메시지 표시 영역

---

## KBO 팀 목록

두산 베어스, LG 트윈스, KT 위즈, SSG 랜더스, NC 다이노스,
키움 히어로즈, 삼성 라이온즈, 한화 이글스, 롯데 자이언츠, KIA 타이거즈

---

## 동작

1. 폼 제출 → `actions/auth.ts` `signup` Server Action 호출
2. Supabase Auth 가입 처리
3. `profiles` 테이블에 `favorite_team` 저장
4. 성공 → `/dashboard` 리다이렉트
5. 실패 → 오류 메시지 표시

---

## 기존 파일 수정

`frontend/src/app/(auth)/signup/page.tsx` — 응원팀 선택 필드 추가
`frontend/src/components/auth/SignupForm.tsx` — 응원팀 선택 UI 추가
