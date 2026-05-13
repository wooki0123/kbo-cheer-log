# 외부 경기 데이터 조회

관련 Action: `src/actions/naver.ts`

---

## 목적

날짜 + 홈팀 + 원정팀을 기반으로 네이버 스포츠에서 KBO 경기 박스스코어를 가져온다.

---

## 조회 흐름

1. 사용자가 날짜 + 홈팀 + 원정팀 입력 후 "경기 불러오기" 클릭
2. `fetchGameData(date, homeTeam, awayTeam)` Server Action 호출
3. 네이버 스포츠 비공식 API로 해당 날짜 KBO 경기 목록 조회
4. 팀명으로 매칭하여 해당 경기의 게임 ID 추출
5. 게임 ID로 박스스코어 상세 데이터 조회
6. 결과 반환

---

## 반환 데이터 구조

```ts
type GameData = {
  innings: {
    inning: number
    home: number | null  // null = 미진행
    away: number | null
  }[]
  total: {
    home: { score: number; hits: number; errors: number; walks: number }
    away: { score: number; hits: number; errors: number; walks: number }
  }
}
```

---

## 예외 처리

| 상황 | 처리 |
|------|------|
| 경기 데이터 없음 | null 반환, 폼에 안내 메시지 표시 |
| API 응답 오류 | 오류 메시지 표시, 폼 저장은 정상 진행 |
| 우천취소 경기 | null 반환 (데이터 없음으로 처리) |

---

## 주의사항

- 네이버 스포츠 비공식 API 사용 — 구조 변경 시 파싱 로직 수정 필요
- Server Action에서만 호출 (클라이언트 직접 호출 금지)
- 실제 API 엔드포인트는 구현 단계에서 네이버 스포츠 네트워크 탭 분석 후 확정
