-- =============================================
-- SeniorJob — 기기/계정 단위 owner_id
-- Supabase > SQL Editor 에서 실행하세요
-- =============================================
-- 인증 도입 전 임시 — 클라이언트 localStorage UUID로 공고/지원자 결정 분리
-- 추후 Supabase Auth 도입 시 owner_id 를 auth.uid() 로 마이그레이션

alter table jobs                add column if not exists owner_id text;
alter table applicant_decisions add column if not exists owner_id text;

create index if not exists jobs_owner_id_idx                on jobs(owner_id);
create index if not exists applicant_decisions_owner_id_idx on applicant_decisions(owner_id);

-- applicant_id 단독 unique → (owner_id, applicant_id) 복합 unique 로 교체
-- (owner 별로 동일 시니어에 대한 결정을 각자 보유)
alter table applicant_decisions drop constraint if exists applicant_decisions_applicant_id_key;
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'applicant_decisions_owner_applicant_unique'
      and conrelid = 'applicant_decisions'::regclass
  ) then
    alter table applicant_decisions
      add constraint applicant_decisions_owner_applicant_unique
      unique (owner_id, applicant_id);
  end if;
end $$;
