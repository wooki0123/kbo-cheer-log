# KBO 직관 기록 앱 — 프로젝트 기획 문서

> 야구 직관 또는 경기 시청 후기를 작성할 수 있는 개인 일기장 플랫폼  
> 마지막 업데이트: 2026-05-17

---

## 목차

1. [MVP](#mvp)
2. [기술 스택](#기술-스택)
3. [프로젝트 구성](#프로젝트-구성)
4. [페이지 구성](#페이지-구성)
5. [DB 구성](#db-구성)
6. [핵심 기능](#핵심-기능)
7. [네이버 스포츠 API 명세](#네이버-스포츠-api-명세)
8. [진행 상황](#진행-상황)
9. [다음 작업 (고도화)](#다음-작업-고도화)

---

## MVP

- **개인 소감 작성 및 별점 기능** — 경기 후기와 1~5점 별점 입력
- **인증 기능** — 본인만 DB CRUD 가능 (Supabase Auth + RLS)
- **경기 데이터 자동 조회** — 네이버 스포츠 비공식 API로 총점·안타·볼넷·실책 자동 불러오기 (이닝별 스코어는 API 인증 필요로 미구현)

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router, Server Actions) |
| 언어 | TypeScript 5 |
| 스타일 | Tailwind CSS 4 |
| 차트 | Recharts 3 |
| 인증/DB | Supabase (Auth + PostgreSQL + RLS) |
| Supabase 클라이언트 | `@supabase/ssr` + `@supabase/supabase-js` |
| 패키지 매니저 | npm |
| 버전 관리 | Git |

---

## 프로젝트 구성

```
Agent-coding/
├── frontend/
│   ├── src/
│   │   ├── actions/                   # Next.js Server Actions
│   │   │   ├── auth.ts                # 로그인, 회원가입, 로그아웃
│   │   │   ├── profile.ts             # 프로필(응원팀) 저장
│   │   │   ├── records.ts             # 기록 CRUD (생성/조회/수정/삭제)
│   │   │   └── naver.ts               # 네이버 스포츠 경기 데이터 조회 (fetchGameData, fetchAwayTeam)
│   │   │
│   │   ├── app/
│   │   │   ├── (auth)/                # 인증 라우트 그룹 (미인증 전용)
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── login/page.tsx     # 로그인 페이지
│   │   │   │   └── signup/page.tsx    # 회원가입 페이지
│   │   │   │
│   │   │   ├── (protected)/           # 보호된 라우트 그룹 (인증 필요)
│   │   │   │   ├── layout.tsx         # Header 포함 공통 레이아웃
│   │   │   │   ├── dashboard/page.tsx # 대시보드 (통계)
│   │   │   │   └── records/
│   │   │   │       ├── page.tsx       # 기록 목록
│   │   │   │       ├── new/page.tsx   # 새 기록 추가
│   │   │   │       └── [id]/
│   │   │   │           ├── page.tsx   # 기록 상세/삭제
│   │   │   │           └── edit/page.tsx  # 기록 수정
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── callback/route.ts  # Supabase 이메일 인증 콜백
│   │   │   │   └── signout/route.ts   # 로그아웃 라우트
│   │   │   │
│   │   │   ├── page.tsx               # 랜딩 페이지 (/)
│   │   │   ├── layout.tsx             # 루트 레이아웃
│   │   │   └── globals.css
│   │   │
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx      # 로그인 폼 (Client Component)
│   │   │   │   └── SignupForm.tsx     # 회원가입 폼 (Client Component)
│   │   │   ├── dashboard/
│   │   │   │   ├── StatsCard.tsx      # 요약 통계 카드
│   │   │   │   ├── WinRateStats.tsx   # 홈/원정 승률 비교 (favoriteTeam 출전 응원경기 기준)
│   │   │   │   ├── StadiumStats.tsx   # 구장별 방문 횟수
│   │   │   │   ├── MonthlyChart.tsx   # 주차별 직관 횟수 차트 (Recharts, 월별 필터)
│   │   │   │   └── RecentGames.tsx    # 최근 5경기 목록 (전체 직관 기준)
│   │   │   ├── records/
│   │   │   │   ├── RecordCard.tsx     # 기록 목록 카드
│   │   │   │   ├── RecordForm.tsx     # 기록 입력/수정 폼 (신규·수정 공용, 점진적 공개)
│   │   │   │   ├── RecordListClient.tsx  # 기록 목록 필터/정렬 (결과·구장·날짜순, Client Component)
│   │   │   │   ├── BoxScore.tsx       # 박스스코어 테이블 (총점·안타·볼넷·실책)
│   │   │   │   └── DeleteButton.tsx   # 삭제 버튼 (확인 다이얼로그 포함)
│   │   │   └── layout/
│   │   │       └── Header.tsx         # 공통 헤더 (로고, 네비, 로그아웃)
│   │   │
│   │   ├── lib/
│   │   │   ├── supabase/
│   │   │   │   ├── client.ts          # 브라우저용 Supabase 클라이언트
│   │   │   │   └── server.ts          # 서버용 Supabase 클라이언트 (SSR)
│   │   │   ├── constants/
│   │   │   │   └── kbo.ts             # KBO 팀·구장·날씨 목록, NAVER_TEAM_MAP, HOME_STADIUM_MAP
│   │   │   ├── types/
│   │   │   │   └── index.ts           # 공통 TypeScript 타입 정의
│   │   │   └── stats.ts               # 통계 계산 유틸리티
│   │   │
│   │   └── middleware.ts              # 인증 라우트 보호 (Supabase SSR 기반)
│
└── backend/
    └── migrations/
        ├── 001_initial_schema.sql     # Supabase DB 초기 스키마 (profiles, game_records)
        └── 002_allow_neutral_result.sql  # result=NULL 허용 제약 완화 (중립 경기 지원)
```

---

## 페이지 구성

| 경로 | 페이지명 | 인증 | 핵심 기능 |
|------|----------|------|-----------|
| `/` | 랜딩 | 불필요 | 서비스 소개, 로그인/회원가입 유도 버튼 |
| `/login` | 로그인 | 불필요 (인증 시 /dashboard 리다이렉트) | 이메일·비밀번호 입력, Supabase 로그인, 에러 표시 |
| `/signup` | 회원가입 | 불필요 (인증 시 /dashboard 리다이렉트) | 이메일·비밀번호·응원팀 선택, 이메일 인증 안내 |
| `/dashboard` | 대시보드 | **필요** | 내 직관 현황 카드, 주차별 차트, 홈/원정 승률, 구장별 방문 횟수 |
| `/records` | 기록 목록 | **필요** | 기록 카드 리스트, 결과·구장 필터, 날짜 정렬, 새 기록 추가 버튼 |
| `/records/new` | 새 기록 추가 | **필요** | 점진적 공개 폼, 원정팀 자동 조회, 경기 데이터 자동 불러오기, 응원팀 선택, 우천취소 처리 |
| `/records/[id]` | 기록 상세 | **필요** | 기록 상세 조회, BoxScore 표시, 수정/삭제 버튼 |
| `/records/[id]/edit` | 기록 수정 | **필요** | RecordForm 수정 모드 (기존 데이터 pre-fill), 저장/취소 |

---

## DB 구성

### `profiles` — 사용자 프로필

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| `id` | `uuid` (PK) | `auth.users.id` 참조 |
| `favorite_team` | `text` | 응원 팀 (KBO 10개 팀 중 하나) |
| `created_at` | `timestamptz` | 생성 일시 |

- RLS: 본인 행만 SELECT / INSERT / UPDATE 가능

---

### `game_records` — 직관·시청 기록

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| `id` | `uuid` (PK) | `gen_random_uuid()` 자동 생성 |
| `user_id` | `uuid` (FK) | `auth.users.id` 참조 |
| `game_date` | `date` | 경기 날짜 (YYYY-MM-DD) |
| `home_team` | `text` | 홈 팀 |
| `away_team` | `text` | 원정 팀 |
| `result` | `text` | 결과 (`win` / `lose` / `draw`), 우천취소·중립 시 NULL |
| `is_cancelled` | `boolean` | 우천취소 여부 |
| `stadium` | `text` | 경기장명 |
| `weather` | `text` | 날씨 (맑음/흐림/비/더움/추움) |
| `rating` | `integer` | 별점 (1~5) |
| `memo` | `text` | 개인 소감 (선택) |
| `innings_data` | `jsonb` | 박스스코어 데이터 (네이버 API 응답 저장) |
| `hits_home` | `integer` | 홈팀 안타 수 |
| `hits_away` | `integer` | 원정팀 안타 수 |
| `errors_home` | `integer` | 홈팀 에러 수 |
| `errors_away` | `integer` | 원정팀 에러 수 |
| `walks_home` | `integer` | 홈팀 볼넷 수 |
| `walks_away` | `integer` | 원정팀 볼넷 수 |
| `created_at` | `timestamptz` | 생성 일시 |

- RLS: 본인 행만 SELECT / INSERT / UPDATE / DELETE 가능
- 제약 (`result_required`): `is_cancelled = true` 이면 `result IS NULL`. `is_cancelled = false` 이면 result는 NULL 또는 `win`/`lose`/`draw` 모두 허용 (중립 경기는 result=NULL로 저장)

---

## 핵심 기능

### 1. 회원가입 (`/signup`)

1. 이메일, 비밀번호, 응원팀(KBO 10개 팀) 입력
2. `supabase.auth.signUp()` 호출 → Supabase Auth에 사용자 생성
3. `profiles` 테이블에 `favorite_team` INSERT (Server Action)
4. 이메일 인증 안내 메시지 표시
5. 이메일 인증 완료 후 `/auth/callback` 콜백 처리 → `/dashboard` 리다이렉트

### 2. 로그인 (`/login`)

1. 이메일, 비밀번호 입력
2. `supabase.auth.signInWithPassword()` 호출
3. 성공 시 세션 쿠키 저장 → `/dashboard` 리다이렉트
4. 실패 시 에러 메시지 표시

### 3. 인증 미들웨어 (`middleware.ts`)

1. 모든 요청에서 `@supabase/ssr`로 세션 검증
2. `/dashboard`, `/records/**` 접근 시 미인증이면 `/login` 리다이렉트
3. `/login`, `/signup` 접근 시 인증 상태이면 `/dashboard` 리다이렉트

### 4. 대시보드 (`/dashboard`)

1. Server Component에서 `game_records` 전체 조회 + `profiles`에서 응원팀 조회
2. `stats.ts` 유틸로 통계 계산:
   - **내 직관 현황**: 총 직관 수 (응원·중립·취소 세분화), 응원 승률, 승/패/무
   - **{favoriteTeam} 경기**: 최애팀 출전 응원경기 기준 홈/원정 승률
   - 구장별 방문 횟수, 주차별 직관 횟수 (월별 필터)
   - 중립·취소 경기는 승률 계산에서 제외
3. 최근 5경기는 전체 직관(응원·중립·취소 포함) 기준 표시

### 5. 기록 목록 (`/records`)

1. Server Component에서 `game_records` 조회
2. `RecordListClient`에서 클라이언트 측 필터/정렬 처리:
   - 결과 필터: 전체 / 승 / 패 / 무 / 중립 / 우천취소
   - 구장 필터: select 드롭다운
   - 날짜 정렬: 최신순 / 오래된순 토글
3. `RecordCard` 컴포넌트 리스트 렌더링 (날짜·팀·결과·별점 표시)

### 6. 새 기록 추가 (`/records/new`)

1. `RecordForm` 컴포넌트 렌더링 (신규 모드) — 점진적 공개(progressive disclosure) 구조
2. 날짜 입력 → 홈팀 선택 시 `fetchAwayTeam()`으로 원정팀 자동 조회, 구장 자동 선택
3. 원정팀 확정 후 `fetchGameData()`로 박스스코어 자동 불러오기 (무음 실패)
4. 응원팀 선택 (홈팀 / 원정팀 / 중립) — 프로필 응원팀과 일치하면 자동 선택
5. 응원팀 선택 + 경기 데이터 있으면 결과(승/패/무) 자동 선택
6. 중립 선택 시 결과 필드 숨김, result=NULL 저장
7. 우천취소 체크 시 결과 필드 숨김, result=NULL 저장
8. 별점 선택 후 저장 버튼 활성화
9. `createRecord()` Server Action → `game_records` INSERT → `/records` 리다이렉트

### 7. 기록 상세 (`/records/[id]`)

1. `id`로 `game_records` 단건 조회 (Server Component)
2. 기본 정보 (날짜, 팀, 결과, 별점, 소감) 표시 — 중립/취소 배지 포함
3. `innings_data` 존재 시 `BoxScore` 컴포넌트로 총점·안타·볼넷·실책 표시
4. **수정** 버튼 → `/records/[id]/edit` 이동
5. **삭제** 버튼 (`DeleteButton`) → 확인 다이얼로그 → `deleteRecord()` → `/records` 리다이렉트

### 8. 기록 수정 (`/records/[id]/edit`)

1. 기존 기록 데이터 + 프로필 병렬 조회 → `RecordForm` 컴포넌트에 초기값 pre-fill (수정 모드)
2. 수정 모드에서는 모든 필드 즉시 표시 (점진적 공개 미적용)
3. 중립 경기(result=NULL, is_cancelled=false)는 응원팀 'neutral'로 자동 추론
4. `updateRecord()` Server Action → `game_records` UPDATE → `/records/[id]` 리다이렉트
5. 취소 버튼 → `/records/[id]` 복귀

---

## 네이버 스포츠 API 명세

> 비공식 API — 공식 지원 없음. 구조 변경 시 파싱 로직 수정 필요.  
> Server Action에서만 호출 (클라이언트 직접 호출 금지).

### 공통 헤더

```
accept: application/json, text/plain, */*
accept-language: ko-KR,ko;q=0.9
charset: utf-8
origin: https://m.sports.naver.com
referer: https://m.sports.naver.com/kbaseball/schedule/index
x-sports-backend: kotlin
```

### 1단계: KBO 경기 일정 조회

| 항목 | 내용 |
|------|------|
| Endpoint | `GET https://api-gw.sports.naver.com/schedule/games` |
| Query Params | `fields=basic,schedule,baseball,manualRelayUrl`, `upperCategoryId=kbaseball`, `fromDate={YYYY-MM-DD}`, `toDate={YYYY-MM-DD}`, `size=500` |
| Cache | `revalidate: 0` (항상 최신 데이터) |

**응답 구조 (관련 필드만):**
```json
{
  "result": {
    "games": [
      {
        "gameId": "20260515OBLG0",
        "homeTeamCode": "OB",
        "awayTeamCode": "LG",
        "statusCode": "RESULT"
      }
    ]
  }
}
```

**팀 코드 매핑 (`NAVER_TEAM_MAP`):**

| KBO 팀명 | 네이버 코드 |
|----------|------------|
| 두산 베어스 | `OB` |
| LG 트윈스 | `LG` |
| KT 위즈 | `KT` |
| SSG 랜더스 | `SK` |
| NC 다이노스 | `NC` |
| 키움 히어로즈 | `WO` |
| 삼성 라이온즈 | `SS` |
| 한화 이글스 | `HH` |
| 롯데 자이언츠 | `LT` |
| KIA 타이거즈 | `HT` |

**활용:**
- `fetchAwayTeam(date, homeTeam)`: 홈팀 코드로 해당 날짜 경기를 찾아 원정팀 역조회
- `fetchGameData(date, homeTeam, awayTeam)`: 홈+원정 코드로 경기 찾아 gameId 추출 후 2단계 호출

---

### 2단계: 박스스코어 조회

| 항목 | 내용 |
|------|------|
| Endpoint | `GET https://api-gw.sports.naver.com/schedule/games/{gameId}/record` |

**응답 구조 (관련 필드만):**
```json
{
  "result": {
    "recordData": {
      "teamPitchingBoxscore": {
        "away": { "r": 3, "hit": 7, "bbhp": 2 },
        "home": { "r": 5, "hit": 10, "bbhp": 3 }
      },
      "battersBoxscore": { "away": [...], "home": [...] },
      "pitchersBoxscore": { "away": [...], "home": [...] },
      "etcRecords": [{ "how": "실책", "result": "선수명1 선수명2" }]
    }
  }
}
```

> **주의**: `teamPitchingBoxscore`의 `away`/`home`은 **투수 기준**이므로 타격 결과와 역전됨.
> `away` 투수 기록 = 홈팀 타격 결과, `home` 투수 기록 = 원정팀 타격 결과.
> 실책(E)은 `etcRecords`의 선수 이름을 `battersBoxscore` + `pitchersBoxscore` 이름셋과 대조해 집계.
> 이닝별 스코어(`/linescore`)는 403 에러로 미구현.

**파싱 결과 (`GameData` 타입):**
```typescript
{
  total: {
    home: { score: 5, hits: 10, errors: 1, walks: 3 },
    away: { score: 3, hits: 7, errors: 0, walks: 2 }
  }
}
```

**예외 처리:**

| 상황 | 처리 |
|------|------|
| 해당 날짜 경기 없음 | `null` 반환 → 폼에서 수동 입력 |
| 홈/원정 팀 코드 미등록 | `null` 반환 |
| 경기 진행 중 / 미시작 | 박스스코어 불완전 → `null` 반환 |
| API 응답 실패 | `try/catch` → `null` 반환 |

---

## 진행 상황

### 완료된 작업

**2026-05-12**
- [x] Next.js 16 + TypeScript + Tailwind 프로젝트 초기화
- [x] Supabase Auth 스켈레톤 구성 (로그인/회원가입 페이지)
- [x] 아키텍처/도메인 문서 초기 생성

**2026-05-13**
- [x] DB 마이그레이션 SQL 작성 (`profiles`, `game_records` + RLS)
- [x] TypeScript 타입 & KBO 상수 정의
- [x] Middleware `/records` 보호 경로 추가
- [x] Auth Server Actions + SignupForm/LoginForm 리팩토링 (응원팀 선택 추가)
- [x] Profile Server Action 구현
- [x] Records CRUD Server Actions 구현
- [x] 네이버 스포츠 경기 데이터 조회 Action 구현
- [x] 통계 유틸(`stats.ts`) + Header 컴포넌트 + Protected Layout 구현
- [x] 랜딩 페이지 KBO 브랜딩 업데이트
- [x] 대시보드 페이지 (요약 카드, 홈/원정 승률, 구장별 방문, 월별 차트)
- [x] 직관 기록 목록 페이지
- [x] 새 기록 추가 폼 (네이버 경기 불러오기, 우천취소 처리)
- [x] 기록 상세/삭제 페이지 (BoxScore 표시, 삭제 확인)
- [x] 기록 수정 페이지 (`/records/[id]/edit`, RecordForm 수정 모드)
- [x] 최종 점검 (빌드 성공, ESLint 오류 없음)

**2026-05-17**
- [x] 네이버 스포츠 API 엔드포인트·헤더·파싱 로직 전면 수정
- [x] `NAVER_TEAM_MAP` 팀 코드 수정 (SSG→SK, 삼성→SS)
- [x] 실책(E) 집계: `etcRecords` 텍스트 파싱 + 투수 이름셋 포함
- [x] 이닝별 점수 제거 (linescore 403 확인)
- [x] 홈팀 선택 시 구장 자동 선택 (`HOME_STADIUM_MAP` 추가)
- [x] 기록 폼 응원팀 선택 필드 추가 (홈팀/원정팀/중립, 프로필 응원팀 자동 선택)
- [x] 중립 경기 지원: DB 제약 완화 (`002_allow_neutral_result.sql`), 승률 계산 제외
- [x] 대시보드 '내 직관 현황' / '{favoriteTeam} 경기' 두 섹션으로 분리
- [x] 대시보드 총 직관 서브텍스트 세분화 (응원·중립·취소 수 표시)
- [x] 최근 5경기 중립 배지 추가 (보라색), 헤더에 '전체 직관 기준' 명시
- [x] `fetchAwayTeam` 서버 액션 추가: 날짜+홈팀으로 원정팀 자동 조회
- [x] 기록 폼 점진적 공개(progressive disclosure) 구조로 재작성
- [x] 별점 초기값 0, 별점 선택 후 저장 버튼 활성화
- [x] 응원팀 선택 시 점수 비교해 결과(승/패/무) 자동 선택
- [x] 원정팀 확정 시 경기 데이터 자동 불러오기 (무음 실패)
- [x] 기록 목록 필터 추가 (결과별·구장별 필터, 날짜 정렬 토글)
- [x] RecordCard·상세 페이지 중립 배지 처리 (보라색)
- [x] 수정 모드 중립 경기 응원팀 자동 추론 (result=null → 'neutral')
- [x] 홈팀·원정팀 중복 선택 방지
- [x] 원정팀 드롭다운 → 읽기 전용 텍스트로 변경 (자동 조회 전용)
- [x] 주차별 직관 횟수 차트 (`MonthlyChart`, 'N주차' 레이블, 월별 필터 버튼)
- [x] 우천취소 경기 결과 자동 선택 race condition 수정 (`isCancelledRef`)

### 수동 작업 필요 항목

| 항목 | 상태 |
|------|------|
| Supabase 프로젝트 생성 및 `.env.local` 실제 값 입력 | 완료 |
| Supabase SQL Editor에서 `001_initial_schema.sql` 실행 | 완료 |
| Supabase SQL Editor에서 `002_allow_neutral_result.sql` 실행 | 완료 |

### 테스트 케이스

| 기능 | 케이스 | 예상 결과 |
|------|--------|-----------|
| 회원가입 | 유효한 이메일/비밀번호/응원팀 | 이메일 인증 안내 메시지 표시 |
| 회원가입 | 중복 이메일 | 에러 메시지 표시 |
| 로그인 | 올바른 자격증명 | `/dashboard` 리다이렉트 |
| 로그인 | 잘못된 비밀번호 | 에러 메시지 표시 |
| 미인증 접근 | `/dashboard` 직접 URL 입력 | `/login` 리다이렉트 |
| 경기 불러오기 | 유효한 날짜/팀 조합 | 총점·안타·볼넷·실책 자동 입력 |
| 경기 불러오기 | 경기 없는 날짜 | 수동 입력 상태 유지 |
| 응원팀 선택 | 경기 데이터 있음 | 점수 비교해 결과 자동 선택 |
| 중립 선택 | 저장 | result=null, 승률 계산 제외 |
| 우천취소 체크 | 체크 ON | 결과 필드 숨김, result=null 저장, 승률 제외 |
| 기록 삭제 | 삭제 확인 클릭 | DB 삭제 후 `/records` 이동 |
| 타인 기록 접근 | 다른 유저 ID로 조회 시도 | RLS에 의해 빈 결과 |

---

## 다음 작업 (고도화)

### 단기 (바로 작업 가능)

| 작업 | 설명 |
|------|------|
| 프로필 페이지 추가 (`/profile`) | 응원팀 변경, 계정 정보 수정 |
| 페이지네이션 | 기록 목록 무한스크롤 또는 페이지 분할 |

### 중기 (기획 후 작업)

| 작업 | 설명 |
|------|------|
| 사진 업로드 | Supabase Storage 연동, 직관 사진 첨부 |
| 소셜 로그인 | Google / Kakao OAuth 연동 |
| 비밀번호 재설정 | 이메일 기반 비밀번호 재설정 플로우 |
| 공개 기록 | 기록 공개/비공개 설정, 공유 URL 생성 |

### 장기 (소셜/커뮤니티 고도화)

| 작업 | 설명 |
|------|------|
| 커뮤니티 피드 | 다른 사용자의 공개 기록 열람 |
| 직관 동행자 모집 | 날짜/팀 기반 동행자 매칭 게시판 |
| 응원팀 팔로우 | 같은 팀 팬의 기록 모아보기 |
| 알림 기능 | 오늘 경기 알림, 동행 신청 알림 |
| 경기 일정 캘린더 | 월별 캘린더 뷰, 직관 예정 표시 |
