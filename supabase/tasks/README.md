# Tasks newsroom (`/tasks`)

Private page. Tables `dl_tasks` and `dl_task_events` and the private bucket `dl-tasks` live in the
Supabase project named in `src/lib/tasks/config.ts`. An account reads only its own rows and files
(row level security); nothing can be written with the site's public key.

Tasks are written from the Mac with `scripts/task.mjs` (installed as `~/.local/bin/danslab-task`),
which uses the Supabase CLI's own sign-in. `~/.config/danslab-tasks/config.json` holds `projectRef`
and `ownerId`. Secrets are replaced before anything leaves the Mac; a film over 50 MB is made smaller.

Sign-in needs `https://danslab.vercel.app/tasks` in the project's Auth redirect URLs.
