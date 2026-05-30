# PLANNER.md — learn-BEE

> Living technical document. Refreshed on every `update repo`.
> Last updated: 2026-05-29 (after iteration #3)

---

## Overview

| Field | Value |
|---|---|
| Project | learn-BEE |
| Purpose | University-level Basic Electrical Engineering platform for BGCTUB 2nd-semester students — animated theory, KaTeX-typeset formulas, per-chapter interactive simulators, randomised quizzes, exam-mode prep, and moderator-reviewed completion certificates |
| Target User | BGCTUB CSE/EEE 2nd-semester undergrads; secondary: any BEE student following Sadiku 5th Ed. / Boylestad |
| Key Value | Six in-scope chapters fully built with animated SVG simulators (current literally flows along the wires), 142 verified questions, instant cheat-sheet, exam-mode bonus prep matching the real BGCTUB exam structure |
| Status | 🟢 Production-ready feature-complete for in-scope syllabus; deploy + remaining auxiliary features pending |
| Repo | `https://github.com/mahtamun-hoque-fahim/learn-BEE` |
| Live URL | _not yet deployed_ |
| Build | `npx next build` passes clean (28 routes, 6 chapter pages SSG, full TypeScript) |

---

## Scope

In-scope chapters (per `instruction.txt`, BGCTUB 2nd-semester syllabus):

| ID | Title | Topics | Formulas | Questions |
|---|---|---:|---:|---:|
| ch1 | Basic Concepts                  | 8 | 5  | 28 |
| ch2 | Basic Laws                      | 9 | 10 | 27 |
| ch3 | Methods of Analysis             | 7 | 4  | 21 |
| ch4 | Circuit Theorems                | 6 | 6  | 22 |
| ch6 | Capacitors and Inductors        | 7 | 10 | 22 |
| ch7 | First-Order Circuits (RC)       | 7 | 6  | 22 |
| | **Totals**                          | **44** | **41** | **142** |

Out-of-scope chapters (ch5 Op-Amps, ch8 Second-Order, ch9–ch19 AC/Laplace/Fourier/two-port) are marked `inScope: false` in `curriculum.json` and excluded from listings, `generateStaticParams`, and the bonus exam pool. ~34 legacy questions for those chapters remain in `lib/questions.ts` as reference material but never surface in UI.

---

## Architecture

**Stack:**
- Framework: **Next.js 16.2** App Router (TypeScript), **React 19.2**
- Styling: **Tailwind CSS 4**
- Database: **Neon (PostgreSQL)** via **Drizzle ORM** (`drizzle-orm@^0.45`)
- Auth: **Clerk** (`@clerk/nextjs@^7.3`)
- Math typesetting: **KaTeX** (`katex@^0.16.22`) — server-rendered, no client JS for math
- Charts: **Recharts** (`^3.8`); custom SVG primitives for animated circuits
- PDF / canvas: **jsPDF** + **html2canvas** (certificate render)
- Email: hand-rolled `lib/email/send.ts` (Resend-compatible; falls back to `console.log` if `RESEND_API_KEY` unset)
- Deployment target: Vercel (per Fahim defaults; not yet configured)

**Folder Structure:**
```
/
├── knowledge-base/                    # Content single-source-of-truth
│   ├── curriculum.json                # 19 chapters; key_formulas in LaTeX (+ formula_ascii fallback); inScope flag
│   ├── question-bank.json             # JSON mirror — valid (line comments stripped iter#3)
│   ├── simulators.json                # Per-chapter simulator metadata
│   └── cheat-sheet.md                 # Reference; live page now driven from curriculum.json
│
├── src/
│   ├── app/                           # Next.js routes
│   │   ├── page.tsx                   # Landing — shows only in-scope chapters
│   │   ├── layout.tsx                 # Root layout (imports katex.min.css once)
│   │   ├── learn/page.tsx             # Chapter index + quick-nav (Search · Cheat sheet · Exam prep)
│   │   ├── learn/[chapterId]/
│   │   │   ├── page.tsx               # Server component; generateStaticParams = in-scope only
│   │   │   └── ChapterClient.tsx      # Theory / Simulator / Quiz tabs; all math via RichMath
│   │   ├── cheat-sheet/               # All formulas, KaTeX, real-time search
│   │   │   ├── page.tsx
│   │   │   └── CheatSheetClient.tsx
│   │   ├── search/page.tsx            # Unified search (chapters/topics/formulas/questions)
│   │   ├── bonus/                     # Exam prep — five modes (midterm/final/CT1/CT2/full)
│   │   │   ├── page.tsx
│   │   │   └── BonusClient.tsx
│   │   ├── dashboard/                 # Student progress
│   │   ├── certificate/               # Certificate generator
│   │   ├── admin/                     # Admin (quote management, approvals)
│   │   ├── mod/                       # Moderator review queue
│   │   └── api/                       # API routes
│   │
│   ├── components/
│   │   ├── math/Tex.tsx               # ⭐ Tex (KaTeX server-render) + RichMath (auto-detect mixed prose+math)
│   │   └── simulator/
│   │       ├── CircuitSimulator.tsx   # Legacy fallback (unused for in-scope chapters)
│   │       └── animated/              # ⭐ Per-chapter animated SVG sims
│   │           ├── primitives.tsx     # AnimatedWire (stroke-dashoffset flow), Capacitor, Resistor,
│   │           │                      # Battery, Lamp, CurrentArrow, Slider, Readout, CircuitAnimStyles
│   │           ├── AnimatedSim.tsx    # Dispatcher: chapterId → simulator component (lazy-loaded)
│   │           ├── Ch1BasicCircuitSim.tsx    # Lamp + battery + switch; brightness ∝ V·i
│   │           ├── Ch2DividerSim.tsx         # Voltage divider with KVL bar gauge
│   │           ├── Ch3NodalSim.tsx           # Two-source nodal solver; arrows flip with sign
│   │           ├── Ch4TheveninSim.tsx        # Thévenin equivalent + max-power transfer curve
│   │           ├── Ch6CapacitorSim.tsx       # Series/parallel cap combiner + energy split
│   │           └── Ch7RCTransientSim.tsx     # Real-time RC charging/discharging with run/pause/reset
│   │
│   └── lib/
│       ├── curriculum.ts              # JSON loader + types + IN_SCOPE_IDS + TOTAL_CHAPTERS
│       ├── questions.ts               # Question bank + getRandomQuestions + getBonusQuestions(count, mode)
│       ├── search.ts                  # Client-side full-text index across curriculum + questions
│       ├── auth-helpers.ts            # Clerk session helpers
│       ├── db/{index,schema}.ts       # Drizzle client + 8-table schema
│       └── email/send.ts              # Outbound email
│
├── public/                            # Static assets
├── .env.example                       # All env vars with placeholders
├── AGENTS.md                          # "This is NOT the Next.js you know"
├── CLAUDE.md                          # → @AGENTS.md
├── PLANNER.md                         # ⬅ this file
├── DESIGN_GUIDE.md                    # Design system
├── README.md                          # Lean dev setup
└── TODO.md                            # Flat checklist
```

---

## Math Rendering (cross-cutting)

All formulas, options, answers, and explanations on `/learn/*`, `/bonus`, `/cheat-sheet`, `/search` route through `<RichMath>` or `<Tex>` from `src/components/math/Tex.tsx`.

- **`<Tex>`** — server-rendered KaTeX; pass `block` for display math.
- **`<RichMath>`** — for mixed prose. Detects explicit `$…$` and `$$…$$` delimiters; falls back to whole-string auto-conversion via `asciiToLatex` for any string containing unicode math glyphs (`Ω`, `ρ`, `×`, `²`, `⁻¹⁹`, etc.) or LaTeX commands. Plain text is returned untouched.
- KaTeX CSS imported once in `src/app/layout.tsx`. No client-side bundle cost for math.

The 41 key formulas in `curriculum.json` are stored as KaTeX-ready LaTeX in `formula`, with the original ASCII preserved in `formula_ascii` for accessibility and tooltip-hover. Audit: 360/360 strings in the question bank render either as plain text (~56%) or correct math (~44%) — **zero failures**.

---

## Animated Simulators

Built on `src/components/simulator/animated/primitives.tsx`. The visual signature is `<AnimatedWire>` — two stacked SVG paths, the upper one with `stroke-dasharray` and a CSS `@keyframes bee-flow` that animates `stroke-dashoffset`. Result: dashed segments **literally flow along the wire**, speed inversely proportional to `1/|I|`, direction set by current sign. When current ≈ 0 the overlay fades to invisible.

Other primitives:
- `Capacitor` — plate-fill opacity ∝ charge (`v/Vs`)
- `Lamp` — brightness halo with `bee-glow` pulse keyframe when powered
- `Battery`, `Resistor` (h or v), `CurrentArrow`, `NodeDot`
- `Slider`, `Readout` for control panels

The reference quality bar is **Ch7 RC Transient**: real-time clock (Run/Pause/Reset), scrubbable `t`, current animation speed bound to the actual exponential equation `(Vs/R)·e^(−t/τ)`, capacitor plates filling to `v_C(t)/Vs`, dual `v(t)` and `i(t)` plots with a moving dot, τ markers at 1τ through 5τ.

---

## User Flows

### Flow 1: Student studies a chapter
1. `/learn` → pick an in-scope chapter (`/learn/ch7` etc.). Out-of-scope IDs return 404.
2. Theory tab — formulas render via KaTeX; topics can be ticked off (client-side).
3. Simulator tab — runs the per-chapter animated SVG demo from `AnimatedSim` (lazy-loaded).
4. Quiz tab — randomised questions from `getRandomQuestions(chapterId, n)`; instant feedback + LaTeX-typeset explanation on submit.
5. Progress persists via `/api/progress` (Clerk session → Drizzle `user_progress`).

### Flow 2: Exam preparation
1. `/bonus` shows five preset cards.

   | Mode | Pool | Marks | Q | Time |
   |---|---|---:|---:|---:|
   | Midterm    | Ch1, Ch2, Ch3  | 20 | 15 | 90 min |
   | Final term | Ch4, Ch6, Ch7  | 50 | 25 | 180 min |
   | CT-1       | Midterm pool   | 10 |  8 | 30 min |
   | CT-2       | Final pool     | 10 |  8 | 30 min |
   | Full mock  | All in-scope   |  — | 20 | 150 min |

2. Each card has Practice (per-question feedback) and Timed (countdown clock) entries.
3. Score, breakdown, and per-question review at the end, all KaTeX-rendered.

### Flow 3: Certificate request (moderator-gated)
1. Eligible student visits `/certificate` after completing all 6 in-scope chapters + bonus.
2. Form posts to `/api/certificate` → inserts a `cert_registrations` row (status `pending`).
3. Moderator reviews at `/mod` → `/api/mod/submissions[/id]`. Approve, reject, or request changes.
4. Admin assigns a quote (custom or auto-picked from `default_quotes` pool keyed by gender) via `/api/admin/approve`.
5. Approved students download via `/api/certificate` (jsPDF render).

### Flow 4: Cheat-sheet & search
1. `/cheat-sheet` shows all 41 formulas grouped by chapter, KaTeX-rendered, with sticky search input.
2. `/search` provides unified search across chapter titles, topics, formulas, and questions. Grouped results, click-through to source.

---

## DB Schema

Drizzle (PostgreSQL). All defined in `src/lib/db/schema.ts`.

```
roleEnum            'student' | 'moderator' | 'admin'
genderEnum          'male' | 'female' | 'other'
certStatusEnum      'pending_mod_review' | 'pending_admin_quote' | 'approved' | 'rejected'

users               Clerk-linked profile (name, gender, role, ...)
userProgress        (userId, chapterId, completed, quizScore, theoryRead, simRan, updatedAt)
quizAttempts        (userId, chapterId, score, total, durationMs, createdAt)
bonusAttempts       Exam-prep attempts (mode, score, total, createdAt)
certRegistrations   Certificate request lifecycle — includes studentName, university,
                    department, semester, gender, adminCustomQuote, finalQuote,
                    bonusScore, chaptersCompleted, status, reviewedBy, approvedBy
defaultQuotes       (quote, gender, isActive, addedBy, createdAt) — pool keyed by gender + 'all'
emailLog            (registrationId, recipient, type, sentAt)
adminSettings       k/v config

Backward-compat aliases (older imports):
certificates  → certRegistrations
adminQuotes   → defaultQuotes
```

Migrations: currently using `drizzle-kit push` (no migration history). Switching to `generate` is on TODO.

---

## API Routes

| Method | Path | Auth | Description |
|---|---|---|---|
| GET / POST | `/api/progress` | Clerk | Read / upsert per-chapter progress |
| GET / POST | `/api/quiz` | Clerk | Submit quiz attempts; retrieve history |
| GET / POST | `/api/bonus` | Clerk | Bonus-problem attempts (mode-aware) |
| POST | `/api/cert-registration` | Clerk | Student submits cert registration |
| GET / POST | `/api/certificate` | Clerk | Read / create cert; jsPDF render on GET (rewritten iter#2 to match real schema) |
| GET | `/api/mod/submissions` | Moderator | Review queue |
| GET / PATCH | `/api/mod/submissions/[id]` | Moderator | Approve / reject / request changes (params upgraded to `Promise<{id}>` per Next 16) |
| GET / POST | `/api/admin/quotes` | Admin | Manage motivational quote pool |
| POST | `/api/admin/approve` | Admin | Final admin approval + quote assignment |
| POST | `/api/admin/reject` | Admin | Final admin rejection |

---

## Env Vars

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Neon PostgreSQL connection string |
| `NEXT_PUBLIC_APP_URL` | ✅ | Public base URL (no trailing slash) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ | Clerk frontend key |
| `CLERK_SECRET_KEY` | ✅ | Clerk backend secret |
| `RESEND_API_KEY` | ⚠️ Optional | Outbound email; falls back to `console.log` if unset |

All listed in `.env.example`.

---

## Build & Routes

`npx next build` produces **28 routes**, all clean:
- Static (`○`): all marketing pages, `/cheat-sheet`, `/search`, `/bonus`, `/certificate`, `/admin*`, `/mod`.
- SSG with `generateStaticParams` (`●`): the 6 in-scope chapter pages.
- Dynamic server-rendered (`ƒ`): all `/api/*` routes plus `/dashboard`.

---

## Phases & Timeline

| Phase | Name | Status | Notes |
|---|---|---|---|
| 1 | Foundation — Next.js + schema + scaffolding | ✅ | Prior session |
| 2 | Content single-source-of-truth | ✅ | `lib/curriculum.ts` imports JSON |
| 3 | LaTeX (KaTeX) rollout | ✅ | Iteration #1 (`feat/latex-throughout`) |
| 4 | Scope filter + animated simulators + question bank | ✅ | Iteration #2 (`feat/scope-and-simulators`) |
| 5 | Cheat-sheet · search · exam modes · env · JSON cleanup | ✅ | Iteration #3 (`feat/cheatsheet-search-polish`) |
| 6 | Deploy (Vercel + Neon prod branch) | ⏳ | Next priority |
| 7 | Auxiliary features (bookmarks, streaks, weak-area recs, admin PDF upload) | ⏳ | Decisions needed per item |

---

## Notes / Decisions Log

- **2026-05-29 (iter #3)** — Bonus exam modes derived directly from the BGCTUB exam structure in `instruction.txt`: Midterm covers ch1–ch3 ("beginning → supernode"), Final covers ch4/6/7 ("supernode onward"). CT-1 and CT-2 mirror those syllabuses with 10-mark / 8-question / 30-min sessions.
- **2026-05-29 (iter #3)** — `/cheat-sheet` and `/search` are **static** pages — index is built client-side from the bundled JSON, so no server round-trip per keystroke.
- **2026-05-29 (iter #2)** — Animated wires use `stroke-dashoffset` **CSS** animation, not JS `requestAnimationFrame`, so they run smoothly on mobile and pause when the tab is backgrounded.
- **2026-05-29 (iter #2)** — Out-of-scope chapters kept in `curriculum.json` (and ~34 legacy questions kept in `lib/questions.ts`) instead of being deleted, so the file remains a complete BEE reference even though only 6 chapters surface in the UI.
- **2026-05-29 (iter #1)** — KaTeX server-render chosen over MathJax/client-side: zero client JS for math, works in Server and Client Components alike. Pre-converted all 41 in-scope formulas to LaTeX with KaTeX validation; hand-curated the ones where heuristics would lose meaning (matrices, Fourier sums, `√(LC)`, etc.).
- **2026-05-29 (iter #1)** — `lib/curriculum.ts` rewritten to import from `knowledge-base/curriculum.json` instead of inlining a duplicate.
- **Pre-existing bug fixes in passing**: `api/certificate/route.ts` rewritten against real schema; `api/mod/submissions/[id]/route.ts` upgraded to Next 16's `params: Promise<...>`; `StudentDashboard` curriculum.filter bug; nullable `curriculum.parts`.
- **Security**: GitHub PAT in `instruction.txt` (`ghp_K5Lq…`) returned HTTP 401 — pre-rotated. Subsequent PATs used in chat have been single-use; rotation after each merge is recommended.
