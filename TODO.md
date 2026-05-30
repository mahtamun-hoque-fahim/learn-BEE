## ✅ Done in iteration #4 (2026-05-29)

- [x] **Topic bodies authored** for all 6 in-scope chapters — ~40,000 chars of textbook-style prose, sourced from Sadiku & Boylestad.
  - ch1: 8 topics  ·  ch2: 8 topics  ·  ch3: 7 topics  ·  ch4: 6 topics  ·  ch6: 6 topics  ·  ch7: 4 topics  →  **39 fully-bodied topics**
  - Each topic carries `{title, body (markdown+LaTeX), examples[], pitfalls[]}`. Out-of-scope inductor/RL/op-amp topics dropped per `instruction.txt`.
- [x] **Markdown renderer** (`src/components/math/Markdown.tsx`) — custom 130-line component with paragraphs / **bold** / bullets / numbered lists / tables and full LaTeX via `<RichMath>`. Replaces the need for `react-markdown` + plugins (would have added ~25 KB to the bundle).
- [x] **Expandable topic accordion** in `ChapterClient`'s Theory tab — checkbox marks-as-read, chevron expands body/examples/pitfalls. Solved examples have green numbered steps; pitfalls have amber bulleted warnings.
- [x] **Curriculum types** extended: `TopicBody`, `TopicExample` added to `lib/curriculum.ts`; `topics` is now `Array<string | TopicBody>` (back-compat preserved).
- [x] **Authoring script** committed at `scripts/author_topics.py` — regenerates topic bodies from Python data. Future content edits happen there, not in the JSON.
- [x] **472 / 472 math expressions** in topic bodies, examples, and pitfalls validated through KaTeX (0 failures, 0 warnings after cleaning `µF` inside `\text{}`).
- [x] `npx next build` clean: 28 pages, no TypeScript errors.

---

# TODO — learn-BEE

> Flat checklist of remaining work. `PLANNER.md` has the full context behind each item.
> Status: ✅ done · 🔄 in progress · ⏳ not started · ⚠️ blocked
> Last updated: 2026-05-29 (after iteration #3)

---

## ✅ Shipped to date

### Iteration #3 — Cheat-sheet · Search · Exam modes · Polish
- [x] **`/cheat-sheet`** — all 41 in-scope formulas KaTeX-rendered, grouped by chapter, sticky search input with hits counter and per-chapter "study →" deep links.
- [x] **`/search`** — unified search across chapter titles, topics, formulas, and the entire in-scope question bank. Grouped results, KaTeX in formula hits.
- [x] **Exam-mode bonus** — five presets per BGCTUB structure (Midterm 20 marks · Final 50 marks · CT-1 10 marks · CT-2 10 marks · Full mock). `getBonusQuestions(count, mode)`; `chaptersForMode(mode)`.
- [x] **RichMath in BonusClient** — question, options, answer reveal, explanation, review summary.
- [x] **`.env.example`** committed.
- [x] **`question-bank.json`** line comments stripped → valid JSON.
- [x] **`/learn` quick-nav** — Search · Cheat sheet · Exam prep.
- [x] `npx next build` clean: 28 routes including the two new static pages.

### Iteration #2 — Scope · Simulators · Question bank
- [x] In-scope chapters marked per `instruction.txt`: ch1–ch4, ch6, ch7. Out-of-scope marked `inScope: false`.
- [x] Listings filtered; `generateStaticParams` only pre-renders in-scope; out-of-scope IDs → `notFound()`. Bonus pool restricted to in-scope.
- [x] **Question bank +90** (52 → 142 in-scope). All hand-verified; mix of MCQ / numerical / true_false / fill_blank; easy/medium/hard.
- [x] Manual correctness pass — caught and corrected `q_ch3_020` answer before merge.
- [x] **Per-chapter animated simulators** in `src/components/simulator/animated/`:
  - Ch1 — battery + lamp; brightness ∝ V·i; openable switch
  - Ch2 — voltage divider with KVL bar gauge
  - Ch3 — nodal analysis (two sources → node A → ground), current arrows flip with sign
  - Ch4 — Thévenin equivalent + max-power transfer curve
  - Ch6 — series/parallel capacitor combiner + energy split
  - Ch7 — RC charge/discharge with **real-time current animation**, scrubbable t, dual v(t) / i(t) plots
- [x] Primitives module (`AnimatedWire` flow, `Capacitor` charge-fill, `Lamp` halo, etc.) + CSS keyframes (`bee-flow`, `bee-glow`, `bee-pulse`).
- [x] Pre-existing carry-over bugs cleared so build passes:
  - `api/certificate/route.ts` rewritten against real schema.
  - `api/mod/submissions/[id]/route.ts` upgraded to Next 16 `params: Promise<{id}>`.

### Iteration #1 — KaTeX rollout
- [x] KaTeX (`^0.16.22`) + `react-katex` added; CSS imported once at root.
- [x] `<Tex>` (server-rendered) + `<RichMath>` (auto-detect mixed prose+math with `asciiToLatex` helper).
- [x] All 114 formulas in `curriculum.json` migrated to LaTeX; KaTeX-validated; ASCII preserved in `formula_ascii`.
- [x] ~30 formulas hand-curated where heuristics would lose meaning (matrix Z/T params, Fourier sums, `√(LC)`, max-power, capacitor integrals, etc.).
- [x] 360/360 question-bank strings audited via `RichMath` — zero failures.
- [x] `lib/curriculum.ts` rewritten to import from JSON (single source of truth).
- [x] RichMath wired into ChapterClient (formula cards, question text, options, answers, explanations, summary).
- [x] Pre-existing TS bugs fixed: `StudentDashboard.curriculum.filter`, nullable `curriculum.parts`, schema aliases.

---

## ⚠️ Blockers

_None currently. Latest build is green._

---

## ⏳ Next priority — Deploy

- [ ] Create Vercel project, link to `mahtamun-hoque-fahim/learn-BEE`.
- [ ] Provision Neon production branch; copy `DATABASE_URL` to Vercel.
- [ ] Set Clerk production keys + production redirect URLs in Vercel.
- [ ] First deploy + smoke test:
  - [ ] Landing loads, in-scope chapters listed
  - [ ] `/learn/ch7` simulator runs smoothly on mobile
  - [ ] Cheat-sheet search returns results
  - [ ] Bonus exam starts, timer runs, score reports
  - [ ] Sign-up flow + progress persists
- [ ] Add deployed URL to `PLANNER.md` overview row.

---

## ⏳ Features (no urgent blocker, in priority order)

- [ ] **Bookmarking + notes** — new tables `bookmarks(userId, topicRef)` + `notes(userId, topicRef, body)`. Per-topic UI in `ChapterClient`. Spec called these out and they meaningfully help students review.
- [ ] **Streaks / gamification** — store `last_active_date` on user; compute current/longest streak server-side; surface in dashboard.
- [ ] **Weak-area recommendations** — derive from `quiz_attempts` per topic: topics with < 60% correct surfaced as "review this".
- [ ] **Admin past-paper PDF drag-drop** — upload to R2 / S3, store metadata in a new `past_papers` table, show on `/bonus`. Spec asks for midterm / final / 2×CT separation when admin uploads.
- [ ] **Mastery certificate quote UI** — admin can override the auto-picked quote per submission in `/admin`; partially wired through `defaultQuotes` + `certRegistrations.adminCustomQuote`.

---

## ⏳ Content polish

- [ ] **Promote topic strings to objects** — `curriculum.json` topics are currently bare titles for the in-scope chapters. Promote to `{ title, body: markdown+LaTeX, examples[], pitfalls[] }`. This is the big remaining content lift; do it chapter by chapter alongside teaching sessions.
- [ ] **More question types** — currently MCQ / numerical / true_false / fill_blank. Spec also lists short-answer and long-answer; both need a free-text input UI and admin-grading workflow.

---

## ⏳ Infrastructure

- [ ] Move from `drizzle-kit push` to `drizzle-kit generate` so migrations have version history.
- [ ] Minimal error logging on API routes (Sentry free tier or a simple `console.error` wrapper).
- [ ] GitHub Actions CI: `npm run lint && npx tsc --noEmit && npm run build` on PRs.
- [ ] Delete the legacy `CircuitSimulator.tsx` once we're certain no out-of-scope chapter will be reactivated.

---

## 🗒️ Carry-overs that are now obsolete

The following items in earlier TODOs are no longer applicable:
- ~~"Cheat-sheet page"~~ — shipped in iter #3.
- ~~"Per-chapter simulators"~~ — shipped in iter #2 for all in-scope chapters.
- ~~"Chapters 15–19 question banks"~~ — chapters 15–19 are out of scope.
- ~~"Question bank invalid JSON"~~ — fixed in iter #3.
- ~~".env.example missing"~~ — fixed in iter #3.
- ~~"Certificate route schema mismatch"~~ — fixed in iter #2.
- ~~"Bonus exam needs midterm/final split"~~ — shipped in iter #3.
- ~~"Search across content"~~ — shipped in iter #3.
