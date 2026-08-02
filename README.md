# Pinrepo

Pinterest-style discovery for **AI god-mode** git repositories — Top / Newest / Popular repos that make Claude, Cursor, and agent stacks unfairly powerful.

**Live:** [https://pinrepo.vercel.app](https://pinrepo.vercel.app)

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Anime-panel cover art + screentone UI chrome
- Boards persist in `localStorage`

## Run locally

```bash
npm install
npm run dev
```

## Viral refresh

`.github/workflows/refresh-viral.yml` runs every 6 hours, rescans GitHub via
`scripts/refresh-viral.cjs`, and commits the result to `src/data/viral-repos.json`.

That JSON is a **build-time import** (`src/lib/catalog.ts`), so the pages are fully
static and the commit alone is invisible to readers — the deployment has to be
rebuilt for a refresh to actually reach the site. The workflow therefore pings a
Vercel Deploy Hook after every data commit.

Required repository secret:

| Secret | Where to get it |
| --- | --- |
| `VERCEL_DEPLOY_HOOK_URL` | Vercel project → Settings → Git → Deploy Hooks → create one for branch `main` |

Without it the refresh job fails loudly rather than pushing data that never ships.

Note: GitHub runs scheduled workflows on a best-effort queue and routinely starts
them 1–2 hours after the nominal cron slot, so "every 6 hours" is approximate.

## Notes

- Catalog is curated sample data (stars/dates for demo ranking).
- Covers are original anime-inspired illustrations for demo use.
