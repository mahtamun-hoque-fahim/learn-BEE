# PLANNER.md — learn-BEE

> Living technical document. Updated whenever `update repo` is triggered.
> Last updated: 2026-05-29

---

## Overview

| Field | Value |
|---|---|
| Project | learn-BEE |
| Purpose | University-level Basic Electrical Engineering platform — theory, interactive simulators, quizzes, and certified completion for BGCTUB 2nd-semester students |
| Target User | BGCTUB CSE/EEE undergraduates (2nd-semester BEE course); secondary: any university BEE student following Sadiku / Boylestad |
| Key Value | Single source covering 19 chapters of BEE with LaTeX-typeset formulas, hands-on circuit simulators, randomised quizzes, mod-reviewed certificates with personalised quotes |
| Status | 🔄 In Progress — LaTeX rollout complete; question bank expansion + chapters 15–19 content pending |
| Repo | `https://github.com/mahtamun-hoque-fahim/learn-BEE` |
| Live URL | _not yet deployed_ |

---

## Architecture

**Stack:**
- Framework: Next.js 16 App Router (TypeScript), React 19
- Styling: Tailwind CSS 4
- Database: Neon (PostgreSQL) via Drizzle ORM (`drizzle-orm@^0.45`)
- Auth: Clerk (`@clerk/nextjs@^7.3`)
- Math typesetting: KaTeX (`katex@^0.16.22`) — server-rendered, no client JS needed
- Charts: Recharts
- PDF / canvas: jsPDF + html2canvas (used for certificate render)
- Email: hand-rolled `lib/email/send.ts`
- Deployment: target Vercel (per Fahim defaults; not yet configured)

**Folder Structure:**
```
/
├── knowledge-base/                  # Single source of truth for content
│   ├── curriculum.json              # 19 chapters, key_formulas now in LaTeX
│   ├── question-bank.json           # Mirrors lib/questions.ts (JSON, not yet wired as primary)
│   ├── simulators.json              # Per-chapter simulator demo definitions
│   └── cheat-sheet.md               # Aggregated formulas for the cheat-sheet page
│
├── src/
│   ├── app/                         # Next.js routes
│   │   ├── page.tsx                 # Landing page
│   │   ├── layout.tsx               # Root layout — imports katex CSS once
│   │   ├── learn/page.tsx           # Chapter index
│   │   ├── learn/[chapterId]/
│   │   │   ├── page.tsx             # Server component (data fetch)
│   │   │   └── ChapterClient.tsx    # Tabs: Theory / Simulator / Quiz; renders LaTeX
│   │   ├── dashboard/               # Student progress dashboard
│   │   ├── bonus/                   # Bonus-problems exam-prep page
│   │   ├── certificate/             # Certificate generator
│   │   ├── admin/                   # Admin pages (quote management, approvals)
│   │   ├── mod/                     # Moderator review queue
│   │   └── api/                     # API routes (admin, mod, progress, quiz, certificate, bonus)
│   │
│   ├── components/
│   │   ├── math/Tex.tsx             # ⭐ KaTeX wrapper + RichMath auto-detect prose/math
│   │   └── simulator/CircuitSimulator.tsx
│   │
│   └── lib/
│       ├── curriculum.ts            # Types + JSON loader (single source of truth)
│       ├── questions.ts             # Question bank (TS; 81 verified questions across ch1–ch14)
│       ├── auth-helpers.ts          # Clerk session helpers
│       ├── db/{index,schema}.ts     # Drizzle client + schema
│       └── email/send.ts            # Email sender
│
├── public/
├── AGENTS.md                        # "This is NOT the Next.js you know" — caution flag
├── CLAUDE.md                        # → @AGENTS.md
├── PLANNER.md                       # This file
├── DESIGN_GUIDE.md                  # Design tokens
└── README.md                        # Lean dev setup
```

---

## User Flows

### Flow 1: Student takes a chapter
1. Visits `/learn` and picks a chapter (`/learn/ch7` etc.).
2. Lands on Theory tab — checks off topics; reads LaTeX-typeset key formulas.
3. Switches to Simulator tab — runs the per-chapter circuit demo (currently a generic `CircuitSimulator`; per-chapter wiring is a future step).
4. Switches to Quiz tab — answers randomised MCQ / numerical / fill-blank from `lib/questions.ts`; explanation reveals on submit.
5. Progress persists via `/api/progress` (Clerk session → Drizzle `user_progress`).
6. After all 19 chapters complete + bonus + cert-registration → eligible for certificate.

### Flow 2: Certificate request (moderator-gated)
1. Student finishes everything → `/certificate` page.
2. Submits a cert registration (`cert_registrations` row, status `pending_mod_review`).
3. Moderator sees it in `/mod`, can approve / reject / add notes (`/api/mod/submissions`).
4. Admin assigns a quote (custom or from `default_quotes` pool keyed by gender) (`/api/admin/quotes`, `/api/admin/approve`).
5. Approved certificate becomes downloadable (`/api/certificate` → jsPDF + html2canvas).

### Flow 3: Exam prep
1. `/bonus` page — bonus problems for midterm (chapters before super-node) / final (super-node onward) / 2 CTs.
2. Admin can upload previous-year question PDFs (planned — drag-drop, not yet built).
3. After bonus complete → cheat-sheet page surfaces aggregated formulas.

---

## DB Schema

> Drizzle ORM format. Existing tables in `src/lib/db/schema.ts`:

```ts
roleEnum                    // 'student' | 'moderator' | 'admin'
genderEnum                  // 'male' | 'female' | 'other'
certStatusEnum              // 'pending_mod_review' | 'pending_admin_quote' | 'approved' | 'rejected'

users                       // Clerk-linked profile (name, gender, role, etc.)
userProgress                // (userId, chapterId, completed, quizScore, theoryRead, simRan, updatedAt)
quizAttempts                // (userId, chapterId, score, total, durationMs, createdAt)
bonusAttempts               // Exam-prep attempts
certRegistrations           // ⭐ Certificate request lifecycle
defaultQuotes               // Pool of motivational quotes keyed by gender
emailLog                    // Outbound email audit
adminSettings               // K/V config

// Compat aliases (older routes import these names):
certificates  → certRegistrations
adminQuotes   → defaultQuotes
```

**Known issue (carried from prior session):**
`src/app/api/certificate/route.ts` inserts into `certificates` with fields (`userId`, `quote`, `semester`) that do not exist on `certRegistrations`. Route currently does not type-check. Needs either a schema migration adding those columns, or the route rewritten against the existing column set. See *Next Steps*.

---

## API Routes

| Method | Path | Auth | Description |
|---|---|---|---|
| GET / POST | `/api/progress` | Clerk | Read / upsert per-chapter progress |
| GET / POST | `/api/quiz` | Clerk | Submit quiz attempts, retrieve history |
| GET / POST | `/api/bonus` | Clerk | Bonus-problem attempts |
| POST | `/api/cert-registration` | Clerk | Student submits cert registration |
| GET | `/api/certificate` | Clerk | Generate / download approved certificate (⚠️ broken — see schema issue) |
| GET / POST | `/api/mod/submissions` | Moderator | Review queue |
| GET / PUT | `/api/mod/submissions/[id]` | Moderator | Approve / reject single submission |
| GET / POST | `/api/admin/quotes` | Admin | Manage motivational quote pool |
| POST | `/api/admin/approve` | Admin | Final admin approval + quote assignment |
| POST | `/api/admin/reject` | Admin | Final admin rejection |

---

## Env Vars

| Variable | Required | Description | Example |
|---|---|---|---|
| `DATABASE_URL` | ✅ | Neon PostgreSQL connection string | `postgresql://…@…neon.tech/learnbee?sslmode=require` |
| `NEXT_PUBLIC_APP_URL` | ✅ | Public base URL | `https://learnbee.vercel.app` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ | Clerk frontend key | `pk_test_…` |
| `CLERK_SECRET_KEY` | ✅ | Clerk backend secret | `sk_test_…` |
| `RESEND_API_KEY` | ⚠️ Optional | Outbound email (only if `lib/email/send.ts` is wired to Resend) | — |

> Full `.env.example` not yet committed — TODO.

---

## Phases & Timeline

| Phase | Name | Status | Key Tasks |
|---|---|---|---|
| 1 | Foundation (repo, schema, routes scaffolded) | ✅ | Next.js 16 + Clerk + Drizzle + Neon; 19-chapter curriculum scaffolded |
| 2 | Content layer single-source-of-truth | ✅ | `lib/curriculum.ts` now imports `knowledge-base/curriculum.json` (no duplication) |
| 3 | **LaTeX rollout** (this PR) | ✅ | KaTeX server-render component; 114 formulas converted with KaTeX validation; auto-detection wraps math in question bank prose |
| 4 | Question bank expansion | ⏳ | 81 / target 500+ verified questions; ch15–ch19 have 0 |
| 5 | Per-chapter simulators | ⏳ | Currently one generic `CircuitSimulator`; need per-topic demos (RC transient, KVL/KCL solver, mesh/nodal, phasor, etc.) |
| 6 | Admin PDF drag-drop for past papers | ⏳ | Spec mentions admin uploads PDFs; not built |
| 7 | Cheat-sheet auto-generation | 🔄 | `cheat-sheet.md` exists, not yet wired as a page consuming `curriculum.json` |
| 8 | Certificate route bug fix | ⏳ | Schema/route mismatch (see DB Schema known issue) |
| 9 | Deploy + smoke test | ⏳ | Vercel project + Neon prod DB |

---

## Next Steps

> Ordered by priority. Rewritten fresh on each `update repo`.

1. [ ] **Fix `api/certificate/route.ts` schema mismatch** — decide: extend `certRegistrations` with `quote` and `semester` columns (Drizzle migration), or rewrite the route to use existing columns. Blocking certificate download flow.
2. [ ] **Reconcile question source** — `question-bank.json` and `lib/questions.ts` both exist; the JSON has invalid `//` comments. Pick one as canonical; the JSON path is cleaner if we want admin-edited questions.
3. [ ] **Expand question bank to chapters 15–19** (Laplace, Fourier, two-port) — currently 0 questions; need ~25 per chapter minimum.
4. [ ] **Per-chapter simulator demos** — author RC charging/discharging, KVL/KCL solver, mesh-current solver, source-transformation, Thevenin/Norton equivalent finder, RLC second-order, phasor calculator, power-triangle.
5. [ ] **Wire cheat-sheet page** — `/cheat-sheet` route that consumes `curriculum.json` and renders all key_formulas with KaTeX.
6. [ ] **Admin past-paper PDF drag-drop** — `S3`/`R2` upload + a `past_papers` table; show on `/bonus`.
7. [ ] **Replace `defaultTopics: string[]` with rich topic objects** in `curriculum.json` so each topic carries `body` (markdown w/ LaTeX), `examples`, `pitfalls` — currently topics are just titles.
8. [ ] **Commit `.env.example`** with all variables listed above.
9. [ ] **Deploy preview to Vercel** + connect Neon production branch.

---

## Notes / Decisions Log

- **2026-05-29** — LaTeX rollout chose **KaTeX server-render** over MathJax/client-side render. Reasons: zero client JS for math (faster), works in Server Components and Client Components alike (`katex.renderToString` is pure), and `react-katex` adds 30KB for what amounts to a one-line wrapper.
- **2026-05-29** — `curriculum.ts` rewritten to import from `knowledge-base/curriculum.json` instead of inlining a duplicate copy. Single source of truth.
- **2026-05-29** — `RichMath` component does **auto-detection**: explicit `$...$` and `$$...$$`, plus a fallback that detects unicode math glyphs and auto-converts ASCII to LaTeX. Tested across all 360 strings in the question bank — 100% render either as plain text or correct math.
- **2026-05-29** — Hand-curated LaTeX for ~30 formulas where heuristic auto-conversion lost meaning (matrix forms for Z/T parameters, Fourier sums with limits, `\sqrt{LC}`, `V_{Th}^{2}/(4R_{Th})`, etc.). Kept original ASCII in `formula_ascii` field for accessibility/fallback.
- **2026-05-29** — Pre-existing PAT in `instruction.txt` (`ghp_K5Lq…`) returned HTTP 401 against GitHub API. Push attempt deferred until a new fine-grained PAT is provided.
