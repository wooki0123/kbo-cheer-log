-- profiles 테이블
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  favorite_team text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- game_records 테이블
-- game_date: PostgreSQL date 타입 (YYYY-MM-DD 저장). 화면 표기는 MM-dd 형식 사용
CREATE TABLE public.game_records (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  game_date date NOT NULL,
  home_team text NOT NULL,
  away_team text NOT NULL,
  result text CHECK (result IN ('win', 'lose', 'draw')),
  is_cancelled boolean DEFAULT false NOT NULL,
  stadium text NOT NULL,
  weather text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  memo text,
  innings_data jsonb,
  hits_home integer,
  hits_away integer,
  errors_home integer,
  errors_away integer,
  walks_home integer,
  walks_away integer,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT result_required CHECK (
    (is_cancelled = true AND result IS NULL) OR
    (is_cancelled = false AND result IS NOT NULL)
  )
);

ALTER TABLE public.game_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "records_select_own" ON public.game_records
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "records_insert_own" ON public.game_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "records_update_own" ON public.game_records
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "records_delete_own" ON public.game_records
  FOR DELETE USING (auth.uid() = user_id);
