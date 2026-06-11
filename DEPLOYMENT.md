# Deployment & Runbook

## What I changed
- Server: added admin CRUD (`createCourse`, `updateCourse`, `deleteCourse`) in `server/admin.router.ts`.
- DB: added drizzle helpers `createCourse`, `updateCourse`, `deleteCourse`, and `getUserCourseProgressByIds` in `server/db.ts`.
- LLM integrations: added retry/backoff and `provider_unavailable` mapping in `server/_core/llm.ts`.
- Learning paths: added role/domain bundles, filters, per-user progress and recommendations in `server/learning-paths.router.ts`.
- Client: Admin dashboard form + edit/delete UI in `client/src/pages/AdminDashboard.tsx` and Learning Paths filters + recommendations in `client/src/pages/LearningPaths.tsx`.

## Quick verification (run locally)
```bash
# install
pnpm install
# typecheck
pnpm check
# tests
pnpm test
# build
pnpm build
# apply DB migrations
pnpm db:push
# run the server
NODE_ENV=production node dist/index.js
```

Notes:
- If you run on Windows, run Codacy CLI from WSL or other supported environment; the in-repo Codacy tool fails on plain Windows.
- `pnpm` may be run via `corepack enable && corepack prepare pnpm@<version> --activate` if needed.

## Required environment variables
- `DATABASE_URL` (MySQL/TiDB)
- `JWT_SECRET`
- `VITE_APP_ID` (Manus OAuth)
- `OAUTH_SERVER_URL`
- `VITE_OAUTH_PORTAL_URL`
- `OWNER_OPEN_ID`, `OWNER_NAME`
- Stripe (if enabling payments): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- LLM provider: `FORGE_API_KEY` / `forgeApiKey` or whichever key(s) your environment expects

## Post-edit Codacy checks
Per repo policy run Codacy analysis on every edited file. Example from WSL:
```bash
codacy_cli_analyze --rootPath "$(pwd)" --file server/admin.router.ts
codacy_cli_analyze --rootPath "$(pwd)" --file server/db.ts
codacy_cli_analyze --rootPath "$(pwd)" --file server/_core/llm.ts
codacy_cli_analyze --rootPath "$(pwd)" --file client/src/pages/AdminDashboard.tsx
codacy_cli_analyze --rootPath "$(pwd)" --file client/src/pages/LearningPaths.tsx
codacy_cli_analyze --rootPath "$(pwd)" --file DEPLOYMENT.md
```

## Next recommended steps
- Run the verification commands above and share failures; I'll patch quickly.
- Add monitoring/health endpoints for LLM provider failures and surface user-friendly messages in the UI when `provider_unavailable` occurs.
- Wire Stripe test keys and implement webhook handlers before enabling payments.

Thank you — tell me when you've run the checks and I'll act on any test or Codacy findings.
