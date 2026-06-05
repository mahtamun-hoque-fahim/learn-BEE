# PLANNER.md — learn-BEE

The technical blueprint for learn-BEE. Living document — sync on "update repo".

## Overview

- **Purpose:** a single home for the BGCTUB 2nd-semester Basic Electrical Engineering (EEE 1201, 3-credit) course — notes, interactive simulators, formula reference, exam practice, and a verifiable certificate.
- **Target user:** BGCTUB students (45th batch onward); staff (moderators/admins) manage content and the certificate pipeline.
- **Key value:** one organised, exam-aligned resource (Sadiku + Boylestad) with live circuit simulators and randomized quizzes, replacing scattered Drive links.
- **Authoritative counts (computed dynamically from `lib/curriculum`):** 6 in-scope chapters (ch1–4, 6, 7), 39 topics, 41 formulas, 142 questions, 6 simulators.

## Architecture

- **Framework:** Next.js 16 (App Router, React 19, Turbopack). TypeScript. Tailwind CSS v4.
- **Data:** Neon Postgres via Drizzle ORM (`neon-http` driver, lazy `getDb()`).
- **Auth:** Better Auth (email + password), Drizzle adapter, `role` additional field (`student | moderator | admin`), 7-day sessions refreshed daily. Session gate via `src/proxy.ts` (Next 16 proxy convention) over `/dashboard`, `/admin`, `/mod`; role enforced server-side in pages + API helpers.
- **Math:** KaTeX through `components/math` (`Tex`, `RichMath`, `Markdown`).
- **Simulators:** pure-SVG animated circuits in `components/simulator/animated`, one per in-scope chapter, sharing a `C` colour constant + `primitives`.
- **Theme:** "dy/dx" dark-first design, light variant derived (`[data-theme="light"]`). See DESIGN_GUIDE.md.
- **SEO:** `app/sitemap.ts`, `app/robots.ts`, metadata + JSON-LD (Organization/WebSite/Course/LearningResource); config in `lib/seo.ts`.
- **Deploy:** Vercel (primary), Cloudflare-ready.

Folder structure: see README.md → Project structure.

## User Flows

### Flow 1 — Student studies a chapter
Landing → `/learn` → `/learn/[chapterId]` reader: sticky TOC (scrollspy), flowing article (topics, eqn/callout/steps), key-formula blocks, full-width **simulator + graphs**, in-page **quiz**, sticky rail (progress + stats + cross-links), prev/next pager.

### Flow 2 — Exam preparation
`/bonus` → pick a preset (Midterm / Final / CT-1 / CT-2 / Full mock) → timed or practice → score + review → on pass, link to `/certificate`.

### Flow 3 — Certificate (moderated)
Student signs in → registers via `/dashboard` (`/api/cert-registration`) → status `pending` → moderator/admin reviews in `/mod` (`/api/mod/submissions`) → admin approves (`/api/admin/approve`) → `/certificate` unlocks (fixed light-paper printable artifact).

### Flow 4 — Reference & search
`/cheat-sheet` (all formulas, per-chapter anchors) and global **Cmd+K command palette** / `/search` across chapters, topics, formulas, questions.

### Flow 5 — Auth
`/sign-up` (name, email, password) → session. `/sign-in` honours `?redirect=`. Gated routes redirect unauthenticated users to `/sign-in`; wrong-role users to `/dashboard`.

## DB Schema (Drizzle — `src/lib/db/schema.ts`)

Better Auth core:
- `users` — id (text pk), email (unique), emailVerified (bool), name, image, **role** (enum student|moderator|admin), createdAt, updatedAt
- `sessions` — id, userId→users, token (unique), expiresAt, ipAddress, userAgent, timestamps
- `accounts` — id, userId→users, accountId, providerId, password, access/refresh/idToken (+expiries), scope, timestamps
- `verifications` — id, identifier, value, expiresAt, timestamps

App:
- `user_progress` — per-user per-chapter progress (FK users)
- `quiz_attempts` — chapter quiz attempts (FK users)
- `bonus_attempts` — bonus/exam attempts (FK users)
- `cert_registrations` — certificate pipeline (status enum pending|reviewing|approved|rejected; FKs users/reviewer)
- `default_quotes` — certificate quote pool (gender/semester targeted)
- `email_log` — outbound email log (FK users)
- `admin_settings` — key/value settings
- `lectures`, `labs`, `papers` — content listings (admin-managed)
- `books` — textbooks: cover image, external URL, and **file_url** (uploaded PDF); available = PDF or link

## API Routes

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET/POST | `/api/auth/[...all]` | — | Better Auth handler (Node runtime) |
| GET/POST | `/api/progress` | session | read/update chapter progress |
| GET/POST | `/api/quiz` | session | chapter quiz attempts |
| GET/POST | `/api/bonus` | session | bonus/exam attempts |
| GET/POST | `/api/certificate` | session | issued certificate data |
| POST | `/api/cert-registration` | session | submit certificate registration |
| GET | `/api/mod/submissions` | mod+ | review queue |
| GET/POST | `/api/mod/submissions/[id]` | mod+ | open / act on a submission |
| POST | `/api/admin/approve` | admin | approve registration |
| POST | `/api/admin/reject` | admin | reject with reason |
| CRUD | `/api/admin/quotes` | admin | certificate quotes |
| CRUD | `/api/admin/{lectures,labs,papers,books}` | admin | content management |
| POST | `/api/admin/upload` | admin | file/cover/PDF upload |

Role checks: `lib/auth-helpers.ts` → `requireAuth` / `requireMod` / `requireAdmin` (read the Better Auth session).

## Env Vars

| Name | Required | Description |
|---|---|---|
| `DATABASE_URL` | yes | Neon pooled connection (app runtime) |
| `DATABASE_URL_UNPOOLED` | yes (migrations) | Neon direct connection — used by `drizzle.config.ts` |
| `NEXT_PUBLIC_APP_URL` | yes | canonical origin (SEO canonical/OG, auth fallback). `NEXT_PUBLIC_SITE_URL` accepted as fallback |
| `BETTER_AUTH_SECRET` | yes | 32+ random chars (`openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | yes (prod) | auth base URL; falls back to `NEXT_PUBLIC_APP_URL` |
| `RESEND_API_KEY` | optional | email; falls back to console logging when unset |

## Timeline / Phases

- [x] Curriculum, scope (6 in-scope chapters), question bank, simulators
- [x] LaTeX/KaTeX throughout; cheat-sheet + search
- [x] "dy/dx" dark redesign (foundation, chapter reader, dashboards, certificate, Cmd+K palette)
- [x] Books modal + PDF upload (`books.file_url`)
- [x] Large full-width simulators with graphs; counts audit (6/39/41/142)
- [x] Airborne SEO (sitemap, robots, metadata, JSON-LD)
- [x] Nav/footer wiring (Dashboard/Moderator/Admin); connectivity audit (no orphans)
- [x] Auth migration: **Clerk → Better Auth** (schema, client, route, proxy, sign-in/up)
- [x] Brand assets wired (BeeMark icon, BeeLogo wordmark, mint favicon); admin/mod server role-gating
- [x] OG image route (`app/opengraph-image.tsx`)
- [x] Role-gate all `/admin/*` pages server-side (`lib/page-guards.ts` → `gateAdmin`)

## Next Steps

1. Set prod env in Vercel: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`, `DATABASE_URL`, `DATABASE_URL_UNPOOLED`.
2. `npm run db:push` to create Better Auth tables + the `books.file_url` column on Neon.
3. Promote first staff: set `users.role` = `admin` / `moderator` in the DB.
4. Submit `sitemap.xml` in Search Console; request reindex (clears the stale snippet).

## Notes / Decisions Log

- Auth is Better Auth (not Clerk). The old client-side admin password gate is removed; staff routes are session-gated by `proxy.ts` and role-gated server-side.
- `kysely` is pinned to `0.28.17` via `overrides` (0.29 dropped an export Better Auth's bundled adapter imports); `better-auth`/`kysely` are in `serverExternalPackages`.
- The certificate is an intentionally fixed light-paper artifact (theme-independent) so it prints cleanly.
- Hard rule: no emojis anywhere — SVG icons only.
