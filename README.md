# ⚾ KBO 직관 기록 앱

야구 직관 또는 경기 시청 후기를 작성할 수 있는 개인 일기장 플랫폼입니다.  
네이버 스포츠에서 경기 데이터를 조회해 자동으로 불러오며, Supabase 인증 기반으로 본인만 기록을 관리할 수 있습니다.

---

## 주요 기능

- **직관 기록 CRUD** — 날짜·팀·결과·별점·소감을 포함한 경기 후기 작성, 수정, 삭제
- **경기 데이터 자동 조회** — 네이버 스포츠 경기 데이터 조회를 통해 총점·안타·볼넷·실책 자동 입력 (BoxScore)
- **원정팀 자동 조회** — 날짜와 홈팀 선택만으로 원정팀 및 구장 자동 설정
- **응원팀 선택 & 결과 자동 판정** — 홈팀·원정팀·중립 선택 시 점수 비교로 승/패/무 자동 선택
- **우천취소·중립 경기 처리** — 별도 배지로 표시, 승률 계산에서 자동 제외
- **대시보드 통계** — 총 직관 수, 응원팀 승률, 홈/원정 승률 비교, 구장별 방문 횟수, 주차별 직관 차트
- **기록 필터·정렬** — 결과별(승/패/무/중립/취소)·구장별 필터, 날짜 오름차순/내림차순 정렬
- **이메일 인증 기반 회원가입** — Supabase Auth + RLS로 본인 기록만 접근 가능

---

## 화면 구성

| 페이지 | 미리보기 |
|--------|---------|
| 랜딩 | ![landing](screenshots/landing.png) |
| 대시보드 | ![dashboard](screenshots/dashboard.png) |
| 기록 목록 | ![records](screenshots/records.png) |
| 새 기록 추가 | ![new-record](screenshots/new-record.png) |
| 기록 상세 | ![record-detail](screenshots/record-detail.png) |

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router, Server Actions) |
| 언어 | TypeScript 5 |
| 스타일 | Tailwind CSS 4 |
| 차트 | Recharts 3 |
| 인증 / DB | Supabase (Auth + PostgreSQL + RLS) |
| Supabase 클라이언트 | `@supabase/ssr`, `@supabase/supabase-js` |
| 배포 | Vercel |
| 패키지 매니저 | npm |

---

## 시작하기

### Prerequisites

- Node.js 18 이상
- npm 9 이상
- Supabase 계정 및 프로젝트

### Installation

```bash
# 1. 레포지토리 클론
git clone https://github.com/{your-username}/Agent-coding.git
cd Agent-coding/frontend

# 2. 의존성 설치
npm install

# 3. 환경변수 설정 (아래 환경변수 설정 섹션 참고)
cp .env.example .env.local

# 4. Supabase DB 마이그레이션 실행
# Supabase SQL Editor에서 아래 파일 순서대로 실행
# backend/migrations/001_initial_schema.sql
# backend/migrations/002_allow_neutral_result.sql

# 5. 개발 서버 실행
npm run dev
```

---

## 실행 방법

```bash
# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build
npm start

# 린트
npm run lint
```

로컬 실행 후 `http://localhost:3000` 접속

---

## 아키텍처 / 디렉토리 구조

```
Agent-coding/
├── frontend/
│   └── src/
│       ├── actions/          # Next.js Server Actions (인증, 프로필, 기록 CRUD, 네이버 API)
│       ├── app/
│       │   ├── (auth)/       # 미인증 전용 라우트 (로그인, 회원가입)
│       │   ├── (protected)/  # 인증 필요 라우트 (대시보드, 기록 목록/상세/수정)
│       │   └── auth/         # Supabase 콜백·로그아웃 라우트
│       ├── components/
│       │   ├── auth/         # 로그인·회원가입 폼
│       │   ├── dashboard/    # 통계 카드, 차트, 승률, 구장별 방문 컴포넌트
│       │   ├── records/      # 기록 카드, 폼, BoxScore, 삭제 버튼
│       │   └── layout/       # 공통 헤더
│       └── lib/
│           ├── supabase/     # 브라우저·서버용 Supabase 클라이언트
│           ├── constants/    # KBO 팀·구장·날씨 목록, 팀 코드 매핑
│           ├── types/        # 공통 TypeScript 타입 정의
│           └── stats.ts      # 통계 계산 유틸리티
└── backend/
    └── migrations/           # Supabase DB 마이그레이션 SQL
```

---

## API 문서

> 네이버 스포츠 경기 데이터는 외부 스포츠 데이터 API를 통해 조회합니다.
API 구조 변경 시 파싱 로직 수정이 필요할 수 있습니다.

| 기능 | 엔드포인트 |
|------|-----------|
| KBO 경기 일정 조회 | `GET https://api-gw.sports.naver.com/schedule/games` |
| 박스스코어 조회 | `GET https://api-gw.sports.naver.com/schedule/games/{gameId}/record` |

**Server Actions**

| Action | 설명 |
|--------|------|
| `fetchAwayTeam(date, homeTeam)` | 날짜·홈팀으로 원정팀 자동 조회 |
| `fetchGameData(date, homeTeam, awayTeam)` | 총점·안타·볼넷·실책 박스스코어 조회 |
| `createRecord()` | 기록 생성 |
| `updateRecord()` | 기록 수정 |
| `deleteRecord()` | 기록 삭제 |

---

## 환경변수 설정

`.env.local` 파일을 생성하고 아래 값을 입력하세요.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Supabase 프로젝트의 **Settings → API** 에서 확인할 수 있습니다.

---

## 기여 방법

### 브랜치 전략

```
main        # 프로덕션 배포 브랜치
dev         # 통합 개발 브랜치
feat/{name} # 기능 개발
fix/{name}  # 버그 수정
```

### PR 규칙

1. `main` 브랜치에 직접 Push 금지
2. `dev` → `main` PR은 리뷰 후 머지
3. PR 제목 형식: `[feat] 기능명` / `[fix] 버그명` / `[refactor] 대상`
4. PR 본문에 변경 사항, 테스트 방법 기재

### 커밋 컨벤션

```
feat: 새 기능 추가
fix: 버그 수정
refactor: 코드 리팩토링
docs: 문서 수정
style: 스타일·포맷 변경
chore: 빌드·설정 변경
```
