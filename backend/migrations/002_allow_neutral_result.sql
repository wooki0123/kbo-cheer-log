-- result_required 제약 완화: 중립 경기(is_cancelled=false, result=NULL) 허용
-- 기존: 취소가 아니면 반드시 result가 있어야 함
-- 변경: 취소된 경기만 result=NULL 강제, 미취소 경기는 result=NULL 허용(중립)
ALTER TABLE public.game_records
  DROP CONSTRAINT result_required,
  ADD CONSTRAINT result_required CHECK (
    (is_cancelled = true AND result IS NULL) OR
    (is_cancelled = false)
  );
