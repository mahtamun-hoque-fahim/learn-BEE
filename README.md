# learn-BEE

Study platform for the 2nd-semester Basic Electrical Engineering (EEE 1201) course at BGCTUB: chapter reader, animated circuit simulators, formula cheat-sheet, exam-style quizzes, a moderated certificate pipeline, and an admin/moderator console.

## Stack

- Next.js 16 (App Router, React 19, Turbopack)
- TypeScript + Tailwind CSS v4
- Neon (PostgreSQL) + Drizzle ORM
- Better Auth (email + password, role-based)
- KaTeX (math), pure-SVG animated simulators
- Vercel (primary); Cloudflare-ready

## Prerequisites

- Node.js 20+
- A Neon Postgres database
- `BETTER_AUTH_SECRET` (`openssl rand -base64 32`)

## Local setup

```bash
# 1. Install
npm install

# 2. Env — copy and fill in
cp .env.example .env.local

# 3. Push the schema to Neon (creates Better Auth + app tables)
npm run db:push

# 4. Run
npm run dev
```

To grant staff access, set a user's `role` to `moderator` or `admin` directly in the `users` table (sign-up always creates `student`).

## Env vars

`DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `NEXT_PUBLIC_APP_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `RESEND_API_KEY` (optional). See PLANNER.md → Env Vars for details.

## Commands

```bash
npm run dev          # local dev (Turbopack)
npm run build        # production build
npm run start        # serve the production build
npm run db:generate  # generate a Drizzle migration from schema
npm run db:push      # push schema to Neon (dev / first setup)
```

## Project structure (top level)

```
src/
  app/                 routes (App Router) + api/, sign-in, sign-up, icon.svg
  components/
    design/            Nav, Footer, ThemeProvider, CommandPalette, icons (BeeMark/BeeLogo)
    simulator/animated/ per-chapter SVG simulators + primitives
    math/              KaTeX wrappers (Tex, RichMath, Markdown)
    admin/             ContentCRUD
  lib/                 auth, auth-client, auth-helpers, db (Drizzle), curriculum, questions, search, seo
  proxy.ts             Next 16 proxy — session gate for /dashboard, /admin, /mod
drizzle/               generated SQL migrations
public/brand/          brand SVG sources
```

## Contributing

- Production branch: `main`. Hard rule: no emojis anywhere (code, UI, commits, docs) — SVG icons only.
- Living docs: PLANNER.md (technical blueprint), DESIGN_GUIDE.md (design system). Keep them in sync on "update repo".
