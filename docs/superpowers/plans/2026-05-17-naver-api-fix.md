# 네이버 스포츠 API 수정 계획 (2026-05-17)

작성일: 2026-05-17

> Task 7에서 구현한 Naver Sports 경기 데이터 조회가 실제로 동작하지 않는 문제 디버깅 및 수정 계획.

---

## 배경

`frontend/src/actions/naver.ts`의 API 엔드포인트, 헤더, 응답 파싱 로직이 실제 Naver Sports
비공식 API와 다르게 구현되어 있어 경기 데이터를 가져오지 못하는 상태.

---

## 수정 범위

### 1. 스케줄 API 엔드포인트 수정

- 변경 전: 잘못된 endpoint + date format (`date.replace(/-/g, '')`)
- 변경 후: `https://api-gw.sports.naver.com/schedule/games?fields=basic,schedule,baseball,manualRelayUrl&upperCategoryId=kbaseball&fromDate=${date}&toDate=${date}&size=500`
- 헤더 추가: `origin`, `x-sports-backend: kotlin` (mobile 사이트 기준)

### 2. 팀 코드 수정 (`kbo.ts`)

- `'SSG 랜더스': 'SK'` (구 SK 와이번스 코드 유지)
- `'삼성 라이온즈': 'SS'`

### 3. 박스스코어 API 엔드포인트 수정

- 변경 전: `/game/{gameId}/record?fields=boxscore` (404)
- 변경 후: `/schedule/games/{gameId}/record`

### 4. 응답 파싱 로직 전면 교체

- `result.recordData.teamPitchingBoxscore` 구조 사용
- `away`/`home` 역전 규칙 적용 (투수 소속팀 기준)
- 실책(E) 파싱: `etcRecords[].how === '실책'` 텍스트에서 선수명 추출
- 타자 + 투수 양쪽 이름셋 사용 (투수도 실책 가능)

### 5. 이닝별 점수 제거

- `/linescore` 엔드포인트 → 403 (인증 필요)
- `GameData` 타입에서 `innings` 제거
- `BoxScore` 컴포넌트 이닝 컬럼 제거 (R/H/E/BB 4컬럼만 표시)

---

## 수정 파일

| 파일 | 변경 내용 |
|------|----------|
| `frontend/src/actions/naver.ts` | 전면 재작성 (엔드포인트, 헤더, 파싱 로직) |
| `frontend/src/lib/constants/kbo.ts` | `NAVER_TEAM_MAP` 팀 코드 2건 수정 |
| `frontend/src/lib/types/index.ts` | `GameData`에서 `innings`/`InningScore` 제거 |
| `frontend/src/components/records/BoxScore.tsx` | 이닝 컬럼 제거, 4컬럼만 표시 |

---

## 완료 기준

- [x] 스케줄 API 200 응답 확인
- [x] 팀 코드 매칭 (`found: true`)
- [x] 박스스코어 API 200 응답 확인
- [x] R/H/E/BB 수치 정확히 표시 (E=3 확인)
- [x] 이닝 관련 코드 제거 완료
- [x] 빌드 오류 없음
