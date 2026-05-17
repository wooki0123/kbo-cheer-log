# AI-ACTION-LOGS

최근 작업 로그 (최대 100개 유지).

## 2026-05-17

- 네이버 스포츠 스케줄 API URL 수정: `api-gw.sports.naver.com/schedule/games` + 날짜 형식 유지(대시 포함)
- 필수 헤더 추가: `origin: https://m.sports.naver.com`, `x-sports-backend: kotlin`
- `NAVER_TEAM_MAP` 팀 코드 수정: SSG→SK, 삼성→SS
- 박스스코어 API URL 수정: `/schedule/games/{gameId}/record`
- 응답 파싱: `result.recordData.teamPitchingBoxscore` 사용, away/home 역전 적용
- 실책 집계: `etcRecords` 텍스트 파싱, `pitchersBoxscore` 이름셋 포함
- 이닝별 점수 제거: `/linescore` 403 확인 → `GameData` 타입, `BoxScore` 컴포넌트에서 이닝 코드 삭제
- docs 업데이트: specs/plans 파일 생성, CONTEXT/TODO-DONE/AI-ACTION-LOGS/AI-MAJOR-EVENT 갱신

## 2026-05-12

- 프로젝트 초기 셋업: Next.js 15 + TypeScript + Tailwind + Supabase Auth
- frontend/ 디렉토리에 Next.js 앱 초기화
- Supabase SSR 클라이언트 설정 (browser/server 분리)
- middleware.ts로 라우트 보호 구현
- 로그인/회원가입 폼 및 대시보드 페이지 생성
- 아키텍처/도메인 문서 초기 생성
