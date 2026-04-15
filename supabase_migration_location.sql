-- jobs 테이블에 좌표 컬럼 추가
-- Supabase > SQL Editor 에서 실행

alter table jobs add column if not exists lat double precision;
alter table jobs add column if not exists lng double precision;
