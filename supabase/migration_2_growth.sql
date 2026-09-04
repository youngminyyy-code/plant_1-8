-- ============================================
-- 추가 기능: 식물 성장 단계 저장용 테이블
-- Supabase 대시보드 > SQL Editor 에서 실행(Run) 하세요.
-- (schema.sql을 이미 실행하셨다면 이 파일만 추가로 실행하면 됩니다)
-- ============================================

create table if not exists plant_growth (
  id text primary key default 'main',
  stage integer not null default 0 check (stage >= 0 and stage <= 5),
  updated_at timestamptz not null default now()
);

-- 초기 데이터 한 줄 생성 (이미 있으면 건너뜀)
insert into plant_growth (id, stage)
values ('main', 0)
on conflict (id) do nothing;

alter table plant_growth enable row level security;

-- 누구나 현재 단계를 읽을 수 있음
create policy "누구나 성장 단계 읽기" on plant_growth for select using (true);

-- 수정은 정책을 두지 않음 -> 관리자 API(서버, service role 키)에서만 변경 가능
