# AI-MAJOR-EVENT

주요 사건 및 의사결정.

## 2026-05-12 — 프로젝트 셋업

- Next.js 15 + App Router + TypeScript 채택
- Supabase Auth를 이메일/비밀번호 방식으로 구성
- @supabase/ssr 패키지 사용 (서버사이드 세션 관리)
- 5일 단기 프로젝트 → 미니멀 셋업 + 인증 포함으로 결정
- frontend/, backend/ 디렉토리 분리 구조 유지

## 2026-05-17 — 편의성 개선 (응원팀 선택, 중립 경기)

- 홈팀 선택 시 홈구장 자동 선택 (`HOME_STADIUM_MAP`)
- 기록 폼에 경기별 응원팀 선택 추가: 응원팀 자동 감지, 중립 시 결과 입력 불필요
- DB 제약 완화: 미취소 경기에서 result=NULL 허용 (중립 저장)
- 통계/대시보드/최근경기 모두 중립 케이스 명시적으로 처리

## 2026-05-17 — 네이버 스포츠 API 연동 수정

- 스케줄 API: 엔드포인트, 헤더(origin, x-sports-backend: kotlin), 날짜 형식 수정
- 팀 코드: SSG=SK, 삼성=SS (Naver 레거시 코드 기준)
- 박스스코어 API: `/schedule/games/{gameId}/record` (기존 URL 404)
- 파싱 로직: `teamPitchingBoxscore`의 away/home이 타격팀 기준 역전임을 확인
- 실책(E): `etcRecords` 텍스트 파싱 + 투수(`pitchersBoxscore`)도 실책 가능
- 이닝별 점수: `/linescore` 403 (인증 필요) → 기능 자체 제거 결정
- R/H/E/BB 4컬럼 박스스코어로 확정

## 2026-05-14 — MVP 범위 확정 및 회원 도메인 원칙 수정

- 이메일 인증 제거: Supabase "Confirm email" OFF 설정 완료. SignupForm 이메일 확인 플로우 삭제. 회원가입 후 /login 리다이렉트
- 소셜 로그인, 비밀번호 재설정 미구현 (TODO-BACKLOG 유지)
- game_date 화면 표기: MM-dd 형식 (`game_date.slice(5)`)
- MVP 범위: Task 1~15 전체 구현. 단, MonthlyChart(Recharts)는 UI 고도화로 분류
- 1차 코드 방향: 기능 구현 중심, UI 편의 개선은 추후 고도화
