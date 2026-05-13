# KBO 직관 기록 앱 — 전체 설계 문서

작성일: 2026-05-13

---

## 서비스 개요

KBO 경기 직관 이력을 회원이 개인적으로 기록·관리하는 웹 앱.
소셜 기능 없음. 내 기록만 관리.

---

## 기술 스택

- **Frontend**: Next.js 15 (App Router, Server Components 우선)
- **Auth**: Supabase Auth (이메일/비밀번호)
- **DB**: Supabase (PostgreSQL)
- **데이터 접근**: Server Actions
- **스타일**: Tailwind CSS
- **반응형**: 모바일/데스크탑 모두 지원

---

## 페이지 구성

| 경로 | 페이지 | 인증 필요 |
|------|--------|----------|
| `/` | 랜딩 | 없음 |
| `/login` | 로그인 | 없음 |
| `/signup` | 회원가입 | 없음 |
| `/dashboard` | 대시보드 | 필요 |
| `/records` | 직관 기록 목록 | 필요 |
| `/records/new` | 새 기록 추가 | 필요 |
| `/records/[id]` | 기록 상세/수정/삭제 | 필요 |

---

## DB 스키마

### profiles

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | auth.users.id FK |
| favorite_team | text | 응원팀 (KBO 10개 팀) |
| created_at | timestamptz | 생성 시각 |

### game_records

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| user_id | uuid | auth.users.id FK |
| game_date | date | 경기 날짜 |
| home_team | text | 홈팀 |
| away_team | text | 원정팀 |
| result | text | 'win' / 'lose' / 'draw' (응원팀 기준), 우천취소 시 NULL |
| is_cancelled | boolean | 우천취소 여부 (DEFAULT false) |
| stadium | text | 구장명 |
| weather | text | 날씨 |
| rating | integer | 별점 (1~5) |
| memo | text | 메모 (nullable) |
| created_at | timestamptz | 생성 시각 |

**RLS 정책**: `user_id = auth.uid()` — 본인 데이터만 접근 가능

---

## KBO 데이터 (고정값)

### 팀 목록 (10개)
두산 베어스, LG 트윈스, KT 위즈, SSG 랜더스, NC 다이노스,
키움 히어로즈, 삼성 라이온즈, 한화 이글스, 롯데 자이언츠, KIA 타이거즈

### 구장 목록 (9개)
잠실야구장, 수원KT위즈파크, 인천SSG랜더스필드, 창원NC파크,
고척스카이돔, 대구삼성라이온즈파크, 대전한화생명이글스파크,
사직야구장, 광주-기아챔피언스필드

### 날씨 옵션
맑음, 흐림, 비, 더움, 추움

---

## Server Actions 구성

| 파일 | 액션 |
|------|------|
| `src/actions/auth.ts` | login, signup, signout |
| `src/actions/records.ts` | createRecord, updateRecord, deleteRecord, getRecords, getRecordById |
| `src/actions/profile.ts` | getProfile, updateFavoriteTeam |

---

## 아키텍처 원칙 준수

- 서버 컴포넌트 우선, `use client`는 인터랙션 필요 시에만 사용
- Supabase SSR 클라이언트로 서버/클라이언트 세션 분리
- 라우트 보호는 `middleware.ts`가 담당
- Server Actions에서만 DB 접근, 컴포넌트에서 직접 Supabase 호출 금지

---

## 페이지별 상세 문서

- [랜딩 페이지](../pages/PAGE-LANDING.md)
- [로그인 페이지](../pages/PAGE-LOGIN.md)
- [회원가입 페이지](../pages/PAGE-SIGNUP.md)
- [대시보드](../pages/PAGE-DASHBOARD.md)
- [직관 기록 목록](../pages/PAGE-RECORDS-LIST.md)
- [새 기록 추가](../pages/PAGE-RECORDS-NEW.md)
- [기록 상세/수정/삭제](../pages/PAGE-RECORDS-DETAIL.md)
