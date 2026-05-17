# TODO-DONE

## 2026-05-12

- [x] 프로젝트 기본 셋업 (Next.js 15 + Supabase Auth 스켈레톤)
- [x] CLAUDE.md 요구 문서 초기 생성

## 2026-05-13

- [x] Task 1: DB 마이그레이션 SQL 작성 (`backend/migrations/001_initial_schema.sql`)
- [x] Task 2: TypeScript 타입 & KBO 상수 정의
- [x] Task 3: Middleware `/records` 보호 경로 추가
- [x] Task 4: Auth Server Actions + SignupForm/LoginForm 리팩토링 (응원팀 선택 추가)
- [x] Task 5: Profile Server Action
- [x] Task 6: Records CRUD Server Actions
- [x] Task 7: Naver Sports 비공식 API 경기 데이터 조회 Action
- [x] Task 8: 통계 유틸(stats.ts) + Header 컴포넌트 + Protected Layout
- [x] Task 9: 랜딩 페이지 KBO 브랜딩 업데이트
- [x] Task 10: 대시보드 페이지 (요약 카드, 홈/원정 승률, 구장별 방문, 월별 차트)
- [x] Task 11: 직관 기록 목록 페이지
- [x] Task 12: 새 기록 추가 폼 (네이버 경기 불러오기, 우천취소)
- [x] Task 13: 기록 상세/삭제 페이지 (BoxScore 표시, 삭제 확인)
- [x] Task 14: 기록 수정 페이지 (`/records/[id]/edit`, RecordForm 수정 모드)
- [x] Task 15: 최종 점검 (빌드 성공, ESLint 오류 없음)

## 2026-05-17

- [x] 네이버 스포츠 API 엔드포인트 수정 (스케줄, 박스스코어)
- [x] `NAVER_TEAM_MAP` 팀 코드 2건 수정 (SSG→SK, 삼성→SS)
- [x] 응답 파싱 로직 전면 재작성 (teamPitchingBoxscore 역전 규칙 적용)
- [x] 실책(E) 집계: etcRecords 텍스트 파싱 + 투수 이름셋 포함
- [x] 이닝별 점수 제거 (linescore 403 확인 → GameData, BoxScore에서 제거)
- [x] 홈팀 선택 시 구장 자동 선택 (HOME_STADIUM_MAP 추가)
- [x] 기록 폼에 경기별 응원팀 선택 필드 추가 (홈팀/원정팀/중립, 응원팀 자동 선택)
- [x] DB 제약 완화: 중립 경기 result=NULL 허용 (migration 002)
- [x] 중립 경기 승률 통계 제외 (played 필터에서 result=null 제외)
- [x] 대시보드 총 직관 서브텍스트 세분화 (응원·중립·취소 수 표시)
- [x] 최근 5경기 중립 배지 추가 (보라색, '중립' 레이블)
- [x] 날짜·홈팀 선택 시 원정팀 자동 조회 (fetchAwayTeam 서버 액션 추가)
- [x] 기록 폼 점진적 공개(progressive disclosure) 구조로 재작성
- [x] 별점 초기값 0으로 변경, 별점 선택 시 저장 버튼 활성화
- [x] 응원팀 선택 시 점수 비교해 결과(승/패/무) 자동 선택
