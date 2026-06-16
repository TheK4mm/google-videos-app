# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A video search app over Google Videos. A React 19 / Vite frontend (repo root) talks to an Express 5 backend (`server/`) that proxies queries to **SerpApi**'s `google_videos` engine. The backend exists primarily to hide the SerpApi key and to normalize/cache responses.

## Two separate packages, two module systems

This is the single most important structural fact:

- **Root package** (`package.json`) is the frontend. It is ESM (`"type": "module"`) and has its own `node_modules`.
- **`server/` package** (`server/package.json`) is the backend. It is **CommonJS** (`"type": "commonjs"`) with its own separate `node_modules`.

So backend files use `require`/`module.exports`, frontend files use `import`/`export`. Don't mix them. Dependencies must be installed in both places:

```bash
npm install                 # frontend deps (root)
npm install --prefix server # backend deps
```

## Commands

```bash
npm run dev:all   # run frontend + backend together (most common during dev)
npm run dev       # frontend only (Vite, port 5173)
npm run server    # backend only (Express, port 3000) — delegates to server/ npm start
npm run build     # production build of the frontend
npm run lint      # ESLint over the whole repo
```

There is **no test framework** configured — no `npm test`, no test files. Don't assume one exists; verify changes by running the app.

Backend env lives in `server/.env` (copy from `server/.env.example`). `SERP_API_KEY` is **required** — `server/src/config.js` calls `process.exit(1)` on startup if it's missing or blank.

## How a search flows end to end

1. **`useVideoSearch`** (`src/hooks/useVideoSearch.js`) is the central state machine and owns *all* search state: query, filters, paginated results, and a `status` of `idle | loading | loadingMore | success | error`. It aborts in-flight requests when a new one starts (via `AbortController`) and dedupes appended pages by `video.id`. `App.jsx` is mostly a thin renderer driven by this hook's `status`.
2. It calls **`searchVideos`** (`src/lib/api.js`), which hits `GET /api/videos`. In dev, Vite proxies `/api` → `http://localhost:3000` (`vite.config.js`), so the frontend always uses relative URLs.
3. The backend route (`server/src/routes/videos.js`) validates params against allow-list `Set`s, checks the in-memory cache, then calls **`fetchVideos`** (`server/src/services/serpapi.js`).
4. **`normalizeResponse`** (`server/src/services/normalize.js`) maps SerpApi's raw, inconsistent fields into a stable `Video` shape before it's cached and returned.

### The Video contract is duplicated, keep both in sync

The `Video` typedef appears in **both** `server/src/services/normalize.js` (where it's produced) and `src/lib/api.js` (where it's consumed). They are not shared via import — if you add/rename a field on a video, update both, plus the normalizer's mapping and any consuming component (`VideoCard`, `VideoModal`, `VideoDetail`).

### Filters map to Google's native `tbs` parameter

User-facing filters (`duration`, `date`, `sort`) are translated in `server/src/services/serpapi.js` via `buildTbs` into Google's `tbs` string (`dur:s`, `qdr:w`, `sbd:1`, etc.). The frontend's filter values, the route's validation `Set`s, and these maps must all agree on the same vocabulary.

### Pagination & caching

- Page-based: `start = (page - 1) * pageSize`, `pageSize` is 10 (`server/src/config.js`). `hasMore` is derived from SerpApi's `serpapi_pagination.next`.
- `TtlCache` (`server/src/lib/cache.js`) is an in-memory TTL + LRU map keyed by `JSON.stringify({query, duration, date, sort, page})`. Responses carry an `X-Cache: HIT|MISS` header. It's process-local, so it resets on restart and isn't shared across instances.

## Error handling conventions

- Backend errors flow through `server/src/middleware/errorHandler.js` and always return `{ error: { code, message } }`. Validation errors set `err.status`/`err.code` before throwing; anything without a status is treated as a 502 `UPSTREAM_ERROR` (SerpApi failure) in the route's catch block.
- Frontend `searchVideos` throws a typed `ApiError` carrying that `code`, distinguishing network failures (`"NETWORK"`) from backend error envelopes.
- User-facing strings are in **Spanish** — match that for any new UI/error text.

## Frontend styling

CSS Modules per component (`*.module.css`) on top of global design tokens in `src/styles/tokens.css` (consumed by `src/styles/global.css`). Theme is light/dark via `useTheme` toggling a data attribute; prefer existing CSS variables over hardcoded colors. Components are grouped by role under `src/components/{layout,search,videos,feedback}/`.

## Lint scoping

`eslint.config.js` is a flat config with three scopes that must stay aligned with the module systems above: `src/**` (browser globals, ESM, React Hooks rules), `server/**` (Node globals, CommonJS), and `*.config.js` (Node globals, ESM). The frontend rule `no-unused-vars` ignores names matching `^[A-Z_]` (e.g. unused capitalized imports).
