# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Documentation
- Rewrote README for YouTube Pipeline product focus
- Added LICENSE (MIT), CHANGELOG, CONTRIBUTING
- Aligned `packages/video-pipeline/pyproject.toml` version with `package.json`

### CI / Ops
- Added `.github/workflows/ci.yml` (Node 20, lint + build + test, advisory audit)
- Added `.github/dependabot.yml` (weekly npm, monthly GitHub Actions, grouped minor/patch)
- Bumped `actions/checkout@v4 → v6`, `actions/setup-node@v4 → v6`
- Bumped npm minor/patch group: `@supabase/supabase-js`, `framer-motion`,
  `lucide-react`, `@types/node`, `autoprefixer`, `tsx`

### Security
- **API auth**: bearer-token middleware on `/api/pipeline/:path*`,
  constant-time compare, fail-closed if `PIPELINE_API_TOKEN` is unset
- **Rate limiting**: 60 req/min per (token, IP) composite key with
  `X-RateLimit-*` headers and `Retry-After` on 429
- **Next.js 15.1.6 → 15.5.18**: closes 8 HIGH CVEs (DoS, SSRF,
  middleware bypass, content disposition, image optimization, etc.)
- **Redis lockdown**: `127.0.0.1`-only port bind, `--requirepass` required,
  `--protected-mode yes`, healthcheck uses authenticated ping
- **Hardcoded credential removal**: stripped Supabase project URL fallback
  from `packages/openclaw-logger/scripts/deploy-all.sh`; script now
  fails-closed without `OPENCLAW_SUPABASE_URL` and validates URL shape
- **Dead surface removal**: moved 5 unauthed Supabase-backed API routes
  (`metrics`, `projects` + `[id]`, `team` + `[id]`, `revenue`, `connections`)
  out of the live build into `src/_deprecated/api/`
- **CVE batch**: `npm audit fix` closed `brace-expansion`, `flatted`,
  `picomatch`; total vulns 13 → 2 (remaining 2 are postcss-via-Next.js
  transitives, blocked by an absurd Next.js → 9.x downgrade)

### Tests
- Added `tests/api/auth-middleware.test.ts` (10 cases — fail-closed,
  missing/malformed/wrong/empty bearer, valid pass-through, lowercase
  scheme, JSON shape)
- Added `tests/api/rate-limit-middleware.test.ts` (6 cases — under cap,
  over cap, 429 headers, per-IP isolation, 401s don't burn budget,
  pass-through headers)
- Added `tests/lib/rate-limit.test.ts` (6 cases — under limit, at limit,
  key independence, remaining countdown, reset window, time-based expiry)
- Added `npm test` script using built-in `node:test` runner (zero new deps)

### Product
- Renamed package `danslab → youtube-pipeline` (v2.0.0)
- Stripped homepage + navbar to Dashboard + Studio only
- Moved non-pipeline pages and components to `src/_deprecated/`
- Removed 642 lines of orphan dead code (home/, lab/ components)

---

## [2.0.0] — 2026-05-16 (pre-changelog)

Initial unified product. Pipeline + web app merged into one monorepo.
History prior to the changelog format is recoverable via `git log`.
