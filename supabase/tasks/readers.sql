-- Who may read the task page: an address, or a GitHub account as github:<its number> (a name can change hands).
-- They are added by hand in the database, never in this repository.
create schema if not exists dl_private;
revoke all on schema dl_private from public, anon, authenticated;

create table dl_private.task_readers (
  owner_id uuid not null references auth.users(id) on delete cascade,
  reader text not null check (reader = lower(reader) and (reader like '%_@_%' or reader ~ '^github:[0-9]+$')),
  primary key (owner_id, reader)
);
alter table dl_private.task_readers enable row level security;
revoke all on dl_private.task_readers from public, anon, authenticated;

-- The owners whose tasks this session may read: its address is listed and Google or GitHub vouches for that very
-- address, or its GitHub account is listed. The session was opened through them, never with a password or a mailed link.
create function dl_private.readable_owners() returns setof uuid
language sql stable security definer set search_path = '' as $$
  select distinct r.owner_id
  from auth.users u
  join auth.identities i on i.user_id = u.id and i.provider in ('google', 'github')
  join dl_private.task_readers r on
    (i.provider = 'github' and r.reader = 'github:' || i.provider_id)
    or (r.reader = lower(u.email) and r.reader = lower(i.identity_data->>'email') and i.identity_data->>'email_verified' = 'true')
  where u.id = (select auth.uid())
    and u.email_confirmed_at is not null
    and u.deleted_at is null
    and exists (
      select 1 from jsonb_array_elements(case when jsonb_typeof(auth.jwt()->'amr') = 'array' then auth.jwt()->'amr' else '[]'::jsonb end) a
      where a->>'method' = 'oauth'
    )
$$;
revoke all on function dl_private.readable_owners() from public, anon;
grant usage on schema dl_private to authenticated;
grant execute on function dl_private.readable_owners() to authenticated;

-- Lets the page say that this account has no access.
create function public.dl_tasks_can_read() returns boolean
language sql stable security invoker set search_path = '' as $$ select exists (select 1 from dl_private.readable_owners()) $$;
revoke all on function public.dl_tasks_can_read() from public, anon;
grant execute on function public.dl_tasks_can_read() to authenticated;

drop policy "dl_tasks read own" on public.dl_tasks;
create policy "dl_tasks read listed" on public.dl_tasks for select to authenticated using (owner_id in (select dl_private.readable_owners()));
drop policy "dl_task_events read own" on public.dl_task_events;
create policy "dl_task_events read listed" on public.dl_task_events for select to authenticated
  using (exists (select 1 from public.dl_tasks t where t.id = task_id and t.owner_id in (select dl_private.readable_owners())));
drop policy "dl_tasks files read own" on storage.objects;
create policy "dl_tasks files read listed" on storage.objects for select to authenticated
  using (bucket_id = 'dl-tasks' and (storage.foldername(name))[1] in (select o::text from dl_private.readable_owners() o));
