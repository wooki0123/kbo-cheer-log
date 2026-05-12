# 아키텍처 핵심 원칙

1. **서버 컴포넌트 우선**: 클라이언트 상태가 필요한 경우에만 `use client` 사용
2. **Supabase SSR**: 세션은 반드시 `@supabase/ssr`을 통해 서버/클라이언트 분리 관리
3. **인증 위임**: 라우트 보호는 middleware.ts가 담당, 개별 페이지에서 중복 처리 금지
4. **단방향 의존성**: components → lib → (external). lib이 components를 참조하지 않는다
