# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DansLab is a Next.js 15 + Supabase dashboard for monitoring and managing the "DansLab" autonomous AI agent fleet (team members, project pipelines, revenue, and integration health). Frontend in `src/`, REST API in `src/app/api/` (App Router), persistence in Supabase Postgres, deployed to Vercel (`iad1`). Live URL: `https://danslab.vercel.app`.

The broader DansLab ecosystem (Mac Studio control plane, droplet gateways, OpenClaw, Paperclip dispatcher) is described in `SYSTEM.md`. This repo is the dashboard surface only.

## Architecture

### Data model — `schema.sql` (Supabase)
Eight tables; everything in the API is a thin read over these:
- `team_members` — agent/person profiles (status, location, connected_devices).
- `piperclip_teams` — sub-teams that map agents to a member and track workload.
- `projects` — top-level products (NERVIX, CrawdBot, MyWork, Smarty Chat).
- `project_tasks` — `status: todo | in_progress | completed | blocked`.
- `project_roadmap` — phase tracking with completion %.
- `revenue_tracking` — revenue records, sourced from one of the projects.
- `system_connections` — health rows for Doctor, Monitor, GSD, Vector, Vercel, GitHub, PopeBot.
- `real_time_metrics` — refreshed every 5s.

Indexes cover all FK columns plus a handful of hot query paths: `revenue_tracking(date)`, `real_time_metrics(metric_name)`, `real_time_metrics(timestamp DESC)`, and `team_members(status)`. Migrations live in `supabase/`; `lib/seed.ts` populates dev data and is the source of truth for seeded shapes.

### API — `src/app/api/` (Next.js App Router)
All endpoints are read-only `GET`s today:
- `/api/team`, `/api/team/[id]`
- `/api/projects`, `/api/projects/[id]` (joins roadmap + tasks + revenue)
- `/api/revenue` (monthly breakdown)
- `/api/metrics` (real-time + task stats)
- `/api/connections` (integration health)

Realtime is handled client-side via Supabase Realtime in `lib/hooks/useRealtimeSubscriptions.ts` (see `BACKEND_SETUP.md`). New subscriptions belong there, not in components.

### Frontend — `src/app/`
Routes: `/` (home dashboard), `/lab`, `/evolution`, `/ecosystem`, `/daily-news`, `/semeclaw`. Heavy visualizations live in `src/components/ecosystem/` (`nodes/`, `panels/`, `connections/`, `scenarios/`, `data/`) and `src/components/lab/` (`LabCanvas`, `LabDetailPanel`). Shared shell: `PageWrapper.tsx`, `Navbar.tsx`. Per-agent avatars in `src/components/avatars/`.

UI primitives are shadcn/ui (style: default; base color: slate; CSS variables enabled) under `src/components/ui/`. Use the `@/*` import alias (mapped to `src/*` in `tsconfig.json`).

## Common commands

```bash
npm run dev      # Next.js dev server on http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint     # next lint (extends next/core-web-vitals)
npm run seed     # tsx lib/seed.ts — seeds Supabase from local creds
```

No test framework is configured. If you add one, wire it through `package.json` so `npm test` works as expected.

### Database setup
1. Copy `.env.example` → `.env.local` and fill in Supabase keys.
2. Run `schema.sql` in the Supabase SQL editor to create the eight tables.
3. `npm run seed` to populate.

`SUPABASE_SERVICE_ROLE_KEY` is server-only — keep it out of any file that ships to the client (anything imported from `'use client'` modules or non-route components).

## Conventions

- TypeScript strict mode. JSX is `preserve` (Next handles transform).
- Tailwind 3 with class-based dark mode and CSS variables; the design tokens live in `tailwind.config.ts` — don't hand-roll colors that already exist there.
- Components: PascalCase files (`LabCanvas.tsx`); per-agent avatar files use kebab-case (`dexter-avatar.tsx`).
- Database identifiers: `snake_case` (e.g. `project_tasks`, `connected_devices`).
- `.1code/worktree.json` runs `npm install` automatically when a new worktree is created.

## Deployment

Vercel, configured by `vercel.json` (framework `nextjs`, region `iad1`). Push to `main` triggers an auto-deploy. Required env vars on Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`

## References

- `README.md` — quick start.
- `BACKEND_SETUP.md` — full Supabase + realtime setup, including subscription hook layout.
- `SYSTEM.md` — surrounding ecosystem (Mac Studio, droplets, OpenClaw, Paperclip) that this dashboard observes.
- `schema.sql` — authoritative table definitions.
