-- ============================================
-- 우리 반 식물 키우기 사이트 - 데이터베이스 설정 스크립트
-- Supabase 대시보드 > SQL Editor 에서 전체 복사 후 실행(Run) 하세요.
-- ============================================

create extension if not exists "pgcrypto";

-- 게시글 (학생이 올리는 식물 관찰 이야기)
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  content text not null,
  photo_url text,
  created_at timestamptz not null default now()
);

-- 댓글 (응원 메시지)
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  student_name text not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- 응원(좋아요)
create table if not exists likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  student_name text not null,
  created_at timestamptz not null default now(),
  unique (post_id, student_name)
);

-- 행 수준 보안(RLS) 활성화
alter table posts enable row level security;
alter table comments enable row level security;
alter table likes enable row level security;

-- 누구나 읽고 쓸 수 있도록 허용 (로그인 없이 사용하는 학급용 설정)
-- 수정/삭제 권한은 일부러 열어두지 않았어요 -> 선생님이 Supabase 대시보드에서 직접 관리(모니터링/삭제)
create policy "누구나 게시글 읽기" on posts for select using (true);
create policy "누구나 게시글 작성" on posts for insert with check (true);

create policy "누구나 댓글 읽기" on comments for select using (true);
create policy "누구나 댓글 작성" on comments for insert with check (true);

create policy "누구나 응원 읽기" on likes for select using (true);
create policy "누구나 응원 작성" on likes for insert with check (true);

-- ============================================
-- 사진 저장(Storage) 설정
-- 1) 이 스크립트 실행 전에 대시보드 좌측 메뉴 Storage > New bucket 에서
--    이름 "plant-photos", Public bucket 체크 로 버킷을 먼저 만들어주세요.
-- 2) 버킷을 만든 후 아래 정책을 실행하세요.
-- ============================================

create policy "누구나 사진 업로드"
on storage.objects for insert
with check (bucket_id = 'plant-photos');

create policy "누구나 사진 보기"
on storage.objects for select
using (bucket_id = 'plant-photos');
