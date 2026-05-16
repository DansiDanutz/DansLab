# Contributing

Quick start for working on YouTube Pipeline.

## Branching

- Work on a feature branch, not `main`. Branch names: `feat/...`, `fix/...`,
  `chore/...`, `docs/...`, `security/...`.
- Open a PR against `main`. CI runs lint + build + test on every PR.

## Commits

Conventional commit format:

```
<type>: <short summary>

<optional body explaining why, not what>
```

Types in use: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`,
`ci`, `security`.

## Code style

- TypeScript: strict mode is on. No `any` without justification.
- Python: target 3.13. Run `ruff` and `mypy` before pushing once those are wired.
- React/Next.js: App Router only (no Pages Router). Client components opt in
  with `"use client"`.
- Immutable patterns. Avoid in-place mutation of arrays/objects you didn't create.

## Tests

- New behavior gets new tests. `node:test` for TS/middleware, `pytest` for Python.
- Aim for >= 80% coverage on changed modules.
- Run locally before pushing:

```bash
npm run lint
npm run build
npm test
```

## Security

If you find a vulnerability:

- **Do not open a public issue.**
- Email the maintainer privately or open a private security advisory on GitHub.
- See `AUDIT_REPORT_2026-05-16.md` for the current threat model.

## Adding a new env var

1. Reference it in code via `process.env.X` (TS) or `os.environ["X"]` (Python).
2. Document it in `.env.example` with:
   - A comment explaining what it's for
   - A safe placeholder or generation hint (e.g. `openssl rand -hex 32`)
   - A `REQUIRED` marker if the app refuses to start without it
3. If it carries a secret, never commit a real value. CI scans for common
   credential patterns.

## Pull request checklist

- [ ] CI is green
- [ ] New behavior has tests
- [ ] `.env.example` updated if new env vars added
- [ ] No `console.log` / `print` debug noise left behind
- [ ] Commit messages follow the format above
- [ ] No secrets in code, logs, or commit messages
