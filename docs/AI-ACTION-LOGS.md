# AI-ACTION-LOGS

최근 작업 로그 (최대 100개 유지).

## 2026-05-17 (편의성 종합 개선)

- 날짜 기본값 오늘로 변경
- 원정팀 확정 시 경기 데이터 자동 불러오기 (autoFetchGame, 무음 실패)
- RecordListClient 신규 생성: 전체/승/패/무/중립/취소 필터 버튼
- RecordCard·상세 페이지 중립(result=null) 배지 처리 (보라색)
- WinRateStats 헤더에 '응원경기 기준' 명시

## 2026-05-17 (자동 결과 선택)

- autoSelectResult 함수 추가: 응원팀 선택 또는 경기 불러오기 완료 시 점수 비교해 승/패/무 자동 입력
- 중립 선택 시 결과 초기화 유지

## 2026-05-17 (폼 UX 개선)

- fetchAwayTeam 서버 액션 추가: 날짜+홈팀 선택 시 스케줄 API로 원정팀 자동 조회
- RecordForm 점진적 공개(progressive disclosure) 구조로 전면 재작성
  - 날짜 → 팀/구장/경기불러오기 → 응원팀 → 날씨 → 결과 → 별점/메모 → 저장 순서로 노출
  - 수정 모드는 모든 필드 즉시 표시
- 별점 초기값 0으로 변경, 별점 선택 후 저장 버튼 활성화

## 2026-05-17 (편의성 개선)

- 홈팀 선택 시 구장 자동 선택: `HOME_STADIUM_MAP` 추가, RecordForm onChange 연동
- 기록 폼 응원팀 선택 필드 추가: CheeringTeam (home/away/neutral), 응원팀 포함 시 자동 선택
- DB `result_required` 제약 완화: 중립 경기(is_cancelled=false, result=NULL) 허용
- 통계 계산 수정: 중립 경기를 played에서 제외, neutral/cancelled 카운트 추가
- 대시보드 서브텍스트: "응원 N · 중립 N · 취소 N" 세분화, 승률 sub "응원경기 기준"
- 최근 5경기 배지: 중립 케이스 처리 (보라색 배지, result! null 단언 제거)

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
