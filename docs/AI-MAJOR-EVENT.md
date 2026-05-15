# AI-MAJOR-EVENT

주요 사건 및 의사결정.

## 2026-05-12 — 프로젝트 셋업

- Next.js 15 + App Router + TypeScript 채택
- Supabase Auth를 이메일/비밀번호 방식으로 구성
- @supabase/ssr 패키지 사용 (서버사이드 세션 관리)
- 5일 단기 프로젝트 → 미니멀 셋업 + 인증 포함으로 결정
- frontend/, backend/ 디렉토리 분리 구조 유지

## 2026-05-14 — MVP 범위 확정 및 회원 도메인 원칙 수정

- 이메일 인증 제거: Supabase "Confirm email" OFF 설정 완료. SignupForm 이메일 확인 플로우 삭제. 회원가입 후 /login 리다이렉트
- 소셜 로그인, 비밀번호 재설정 미구현 (TODO-BACKLOG 유지)
- game_date 화면 표기: MM-dd 형식 (`game_date.slice(5)`)
- MVP 범위: Task 1~15 전체 구현. 단, MonthlyChart(Recharts)는 UI 고도화로 분류
- 1차 코드 방향: 기능 구현 중심, UI 편의 개선은 추후 고도화
