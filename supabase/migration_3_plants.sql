-- ============================================
-- 추가 기능: 식물 2개(바줘/로베르토) 구분
-- Supabase 대시보드 > SQL Editor 에서 "새 쿼리"로 실행(Run) 하세요.
-- (아래는 여러 번 실행해도 안전하게 만들어뒀어요)
-- ============================================

-- posts 테이블에 어떤 식물 이야기인지 저장하는 컬럼 추가
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'posts' and column_name = 'plant_id'
  ) then
    alter table posts add column plant_id text not null default 'basil';
  end if;
end $$;

-- plant_id는 'basil'(바줘) 또는 'tomato'(로베르토)만 허용
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'posts_plant_id_check'
  ) then
    alter table posts add constraint posts_plant_id_check check (plant_id in ('basil', 'tomato'));
  end if;
end $$;

-- 식물 2개의 성장 단계를 각각 저장 (기존 plant_growth 테이블 재사용)
insert into plant_growth (id, stage)
values ('basil', 0), ('tomato', 0)
on conflict (id) do nothing;

-- 예전에 쓰던 'main' 단계 값은 이제 사용하지 않아요 (남아있어도 무해합니다)
