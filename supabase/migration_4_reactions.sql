-- ============================================
-- 추가 기능: 응원 -> 공감(이모티콘 여러 개) 으로 변경
-- Supabase 대시보드 > SQL Editor 에서 "새 쿼리"로 실행(Run) 하세요.
-- (여러 번 실행해도 안전해요)
-- ============================================

-- likes 테이블에 어떤 이모티콘으로 공감했는지 저장하는 컬럼 추가
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'likes' and column_name = 'emoji'
  ) then
    alter table likes add column emoji text not null default '👍';
  end if;
end $$;

-- 기존에는 "한 사람당 한 글에 1번"만 가능했는데,
-- 이제 "한 사람당 한 글에 이모티콘 종류별로 1번씩" 가능하도록 제약을 바꿔요
do $$
begin
  if exists (
    select 1 from pg_constraint where conname = 'likes_post_id_student_name_key'
  ) then
    alter table likes drop constraint likes_post_id_student_name_key;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'likes_post_student_emoji_key'
  ) then
    alter table likes add constraint likes_post_student_emoji_key unique (post_id, student_name, emoji);
  end if;
end $$;
