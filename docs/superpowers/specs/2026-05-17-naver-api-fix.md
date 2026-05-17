# 네이버 스포츠 API 실제 동작 구조 (2026-05-17)

작성일: 2026-05-17

> 기존 Task 7 구현 당시 예상한 API 구조와 실제 구조가 달라 디버깅 후 확인된 실제 동작 명세.

---

## 배경

`2026-05-13-kbo-app.md` Task 7에서 구현한 naver.ts의 API 엔드포인트와 응답 구조가
실제와 달라 경기 데이터를 가져오지 못하는 문제가 발생. 브라우저 DevTools로 실제
호출 패턴을 확인하여 수정.

---

## 실제 동작 API 엔드포인트

### 1. 경기 일정 조회

```
GET https://api-gw.sports.naver.com/schedule/games
  ?fields=basic,schedule,baseball,manualRelayUrl
  &upperCategoryId=kbaseball
  &fromDate=YYYY-MM-DD
  &toDate=YYYY-MM-DD
  &size=500
```

**필수 헤더:**
```
accept: application/json, text/plain, */*
accept-language: ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7
charset: utf-8
origin: https://m.sports.naver.com
referer: https://m.sports.naver.com/kbaseball/schedule/index
x-sports-backend: kotlin
```

**응답 구조:**
```json
{
  "code": 200,
  "success": true,
  "result": {
    "games": [
      {
        "gameId": "20260515LGSK02026",
        "categoryId": "kbo",
        "homeTeamCode": "SK",
        "homeTeamName": "SSG",
        "awayTeamCode": "LG",
        "awayTeamName": "LG",
        "homeTeamScore": 7,
        "awayTeamScore": 8,
        "winner": "AWAY",
        "statusCode": "RESULT"
      }
    ]
  }
}
```

**주의:** 날짜 형식은 `YYYY-MM-DD` (대시 포함). 기존 코드의 `date.replace(/-/g, '')` 제거 필요.

---

### 2. 경기 기록 조회 (박스스코어)

```
GET https://api-gw.sports.naver.com/schedule/games/{gameId}/record
```

(헤더 동일)

**응답 구조:**
```json
{
  "result": {
    "recordData": {
      "teamPitchingBoxscore": {
        "away": { "r": 7, "hit": 7, "bbhp": 4, "kk": 4 },
        "home": { "r": 8, "hit": 11, "bbhp": 12, "kk": 12 }
      },
      "battersBoxscore": {
        "homeTotal": { "ab": 35, "hit": 7, "run": 7 },
        "awayTotal": { "ab": 35, "hit": 11, "run": 8 },
        "home": [{ "name": "박성한", "bb": 0, ... }],
        "away": [{ "name": "구본혁", "bb": 0, ... }]
      },
      "pitchersBoxscore": {
        "home": [{ "name": "투수명", ... }],
        "away": [{ "name": "투수명", ... }]
      },
      "etcRecords": [
        { "how": "홈런", "result": "박동원2호(5회1점 김도현)" },
        { "how": "실책", "result": "오지환(1회) 치리노스(6회) 천성호(9회)" }
      ],
      "gameInfo": { ... }
    }
  }
}
```

---

## teamPitchingBoxscore 해석 주의사항

`away`/`home`은 **투수 소속팀** 기준:
- `away.r` = 원정팀 투수가 허용한 실점 = **홈팀 득점**
- `home.r` = 홈팀 투수가 허용한 실점 = **원정팀 득점**
- `away.hit` = 원정팀 투수가 허용한 안타 = **홈팀 안타**
- `home.hit` = 홈팀 투수가 허용한 안타 = **원정팀 안타**

즉 타격 팀 기준으로는 **역전**하여 읽어야 한다.

---

## 실책(E) 집계 방식

`etcRecords`의 `"실책"` 항목 텍스트에서 선수 이름을 파싱한 뒤,
`battersBoxscore.away[]` + `pitchersBoxscore.away[]`의 `name` 필드로 팀 판별.

- 투수도 실책 가능 → `pitchersBoxscore`도 반드시 포함
- 텍스트 형식: `"오지환(1회) 치리노스(6회) 천성호(9회)"` → 공백 분리 후 `(...)` 제거

---

## 이닝별 점수 가용성

| 엔드포인트 | 결과 |
|---|---|
| `/schedule/games/{id}/record` | 이닝별 점수 없음 |
| `/schedule/games/{id}` | 이닝별 점수 없음 |
| `/schedule/games/{id}/linescore` | **403 (인증 필요)** |

**결론:** 이닝별 점수는 인증 없이 접근 불가. `GameData.innings` 및 `InningScore` 타입 제거.
BoxScore 컴포넌트는 R/H/E/BB 4개 컬럼만 표시.

---

## NAVER_TEAM_MAP 실제 코드 (수정 확인)

| 팀명 | 코드 |
|------|------|
| 두산 베어스 | OB |
| LG 트윈스 | LG |
| KT 위즈 | KT |
| SSG 랜더스 | **SK** (SK 와이번스 코드 유지) |
| NC 다이노스 | NC |
| 키움 히어로즈 | WO |
| 삼성 라이온즈 | **SS** |
| 한화 이글스 | HH |
| 롯데 자이언츠 | LT |
| KIA 타이거즈 | HT |
