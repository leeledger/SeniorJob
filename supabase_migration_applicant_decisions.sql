-- =============================================
-- SeniorJob — 지원자 결정 테이블
-- Supabase > SQL Editor 에서 실행하세요
-- =============================================
-- 고용주가 시니어 풀에서 수락/거절한 결정을 저장.
-- (특정 공고 단위 지원은 applications 테이블에서 별도 관리)

create table if not exists applicant_decisions (
  id                  uuid primary key default gen_random_uuid(),
  applicant_id        integer not null unique,    -- mock APPLICANTS.id (추후 senior_id FK로 교체 예정)
  applicant_name      text,
  applicant_age       integer,
  applicant_region    text,
  applicant_badge     text,
  applicant_rating    numeric,
  applicant_jobs      integer,
  applicant_available text,
  applicant_phone     text,
  status              text not null check (status in ('accepted', 'rejected')),
  matched_at          timestamptz,
  note                text,
  decided_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

create index if not exists applicant_decisions_status_idx on applicant_decisions(status);
create index if not exists applicant_decisions_decided_at_idx on applicant_decisions(decided_at desc);

-- updated_at 자동 갱신 트리거
create or replace function applicant_decisions_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists trg_applicant_decisions_updated_at on applicant_decisions;
create trigger trg_applicant_decisions_updated_at
  before update on applicant_decisions
  for each row execute function applicant_decisions_touch_updated_at();

-- 실시간 구독에 필요: DELETE 이벤트의 old row 전체 정보 보장
alter table applicant_decisions replica identity full;

-- 실시간 publication 등록 (이미 등록돼 있으면 무시)
do $$
begin
  begin
    execute 'alter publication supabase_realtime add table applicant_decisions';
  exception when duplicate_object then null;
  end;
end $$;

-- RLS: 인증 전까지 전체 공개 (개발 단계)
alter table applicant_decisions enable row level security;

drop policy if exists "applicant_decisions_public_read"   on applicant_decisions;
drop policy if exists "applicant_decisions_public_write"  on applicant_decisions;
drop policy if exists "applicant_decisions_public_update" on applicant_decisions;
drop policy if exists "applicant_decisions_public_delete" on applicant_decisions;

create policy "applicant_decisions_public_read"   on applicant_decisions for select using (true);
create policy "applicant_decisions_public_write"  on applicant_decisions for insert with check (true);
create policy "applicant_decisions_public_update" on applicant_decisions for update using (true);
create policy "applicant_decisions_public_delete" on applicant_decisions for delete using (true);
