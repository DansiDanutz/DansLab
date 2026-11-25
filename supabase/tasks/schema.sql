create table public.dl_tasks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  key text not null unique check (char_length(key) between 1 and 120),
  source text not null check (source in ('claude','semeos')),
  kind text not null default 'other' check (char_length(kind) <= 40),
  title text not null check (char_length(title) between 1 and 200),
  request text not null default '' check (char_length(request) <= 4000),
  status text not null default 'open' check (status in ('open','working','waiting','done','unfinished','stopped')),
  result text not null default '' check (char_length(result) <= 20000),
  skill_name text check (char_length(skill_name) <= 200),
  skill_is_new boolean not null default false,
  files jsonb not null default '[]'::jsonb check (jsonb_typeof(files) = 'array'),
  opened_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  finished_at timestamptz
);
create index dl_tasks_owner_opened on public.dl_tasks (owner_id, opened_at desc);

create table public.dl_task_events (
  id bigint generated always as identity primary key,
  task_id uuid not null references public.dl_tasks(id) on delete cascade,
  at timestamptz not null default now(),
  status text not null check (status in ('open','working','waiting','done','unfinished','stopped')),
  who text not null default '' check (char_length(who) <= 80),
  text text not null default '' check (char_length(text) <= 4000)
);
create index dl_task_events_task on public.dl_task_events (task_id, at);

alter table public.dl_tasks enable row level security;
alter table public.dl_task_events enable row level security;
revoke all on public.dl_tasks, public.dl_task_events from anon, authenticated;
grant select on public.dl_tasks, public.dl_task_events to authenticated;
create policy "dl_tasks read own" on public.dl_tasks for select to authenticated using (owner_id = (select auth.uid()));
create policy "dl_task_events read own" on public.dl_task_events for select to authenticated
  using (exists (select 1 from public.dl_tasks t where t.id = task_id and t.owner_id = (select auth.uid())));

insert into storage.buckets (id, name, public, file_size_limit) values ('dl-tasks', 'dl-tasks', false, 52428800);
create policy "dl_tasks files read own" on storage.objects for select to authenticated
  using (bucket_id = 'dl-tasks' and (storage.foldername(name))[1] = (select auth.uid())::text);
