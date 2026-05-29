# TODO — learn-BEE

> Flat checklist of remaining work. PLANNER.md has the full context behind each item.
> Status legend: ✅ done · 🔄 in progress · ⏳ not started · ⚠️ blocked
> Last updated: 2026-05-29

---

## ✅ Done in iteration #2 (2026-05-29)

- [x] Mark in-scope chapters per `instruction.txt`: ch1–ch4, ch6, ch7 (6 chapters). Out-of-scope (ch5, ch8–ch19) marked `inScope: false`.
- [x] Scope-filter chapter listings (`/learn`, `/`), hide out-of-scope chapters; pre-render only in-scope chapter pages via `generateStaticParams`; out-of-scope IDs → `notFound()`.
- [x] Bonus exam pool restricted to in-scope chapters.
- [x] **Question bank expanded**: +90 verified questions across the 6 in-scope chapters (Ch1: 13→27, Ch2: 12→27, Ch3: 6→21, Ch4: 7→21, Ch6: 7→22, Ch7: 7→21). Mix of MCQ / numerical / true_false / fill_blank, easy/medium/hard.
- [x] Hand-verified a tricky math item (q_ch3_020 — KCL solver answer corrected from 4.8 V to 6 V before merge).
- [x] **Animated circuit simulators** built per in-scope chapter:
  - Ch1 — battery + lamp with brightness pulsing with P = vi
  - Ch2 — voltage divider with KVL bar gauges
  - Ch3 — nodal analysis (two sources → common node → ground)
  - Ch4 — Thévenin equivalent + max-power transfer with P_L vs R_L curve
  - Ch6 — series/parallel capacitor combiner with energy split
  - Ch7 — RC charging/discharging with **real-time current flow animation**, capacitor plate fill bound to v_C(t)/V_s, scrubbable t, dual v(t) / i(t) plots
- [x] Animation primitives module (`primitives.tsx`): `AnimatedWire` (stroke-dashoffset flow), `Capacitor` with charge fill, `Resistor`, `Battery`, `Lamp` with halo, `CurrentArrow`, `Slider`, `Readout`. CSS keyframes `bee-flow`, `bee-glow`, `bee-pulse`.
- [x] Pre-existing carry-over bugs fixed (cleared blockers for production build):
  - `api/certificate/route.ts` — rewritten against actual schema (uses `finalQuote`, `chaptersCompleted`, `additionalNote`; pre-picks `autoQuote` from `defaultQuotes` pool).
  - `api/mod/submissions/[id]/route.ts` — `params` upgraded to `Promise<{id}>` for Next 16 App Router.
- [x] **Full `npx next build` passes** end-to-end. 26 pages generated. 6 chapter pages pre-rendered.

---

## ✅ Done this iteration (2026-05-29)

- [x] Audit existing repo (Next.js 16 + Clerk + Neon + Drizzle, 19-chapter curriculum, 81-question bank).
- [x] Add KaTeX (`katex@^0.16.22`) and `react-katex` to deps.
- [x] Build `src/components/math/Tex.tsx` — `Tex` (display/inline) + `RichMath` (auto-detect prose+math).
- [x] Convert all **114 key formulas** in `curriculum.json` to LaTeX; KaTeX-validated; original ASCII preserved in `formula_ascii` field.
- [x] Hand-curate ~30 formulas where heuristics lost meaning (matrix Z/T params, Fourier sums with limits, capacitor energy, max-power, phase sequence, coupling coefficient, etc.).
- [x] Verify all 360 strings in question bank render correctly via `RichMath` (201 plain text, 159 math — 0 failures).
- [x] Refactor `lib/curriculum.ts` to import from `knowledge-base/curriculum.json` (single source of truth).
- [x] Wire `<RichMath>` into `ChapterClient.tsx` — formula cards, question text, options, answer reveal, explanations, results summary.
- [x] Import `katex/dist/katex.min.css` once in root layout.
- [x] Fix pre-existing TS errors blocking the build:
  - `StudentDashboard.tsx`: `curriculum.filter(...)` → `curriculum.chapters.filter(c => c.part === 'partN')`.
  - `learn/page.tsx` + `app/page.tsx`: guard `curriculum.parts` against undefined.
  - Schema aliases: `certificates` → `certRegistrations`, `adminQuotes` → `defaultQuotes`.
- [x] Write `PLANNER.md`, `DESIGN_GUIDE.md`, lean `README.md`, this `TODO.md` per `repo-maintainer` skill.

---


## ⚠️ Blockers (need Fahim input before push)

- [ ] **GitHub PAT in `instruction.txt` is dead** — returns HTTP 401. Push aborted. Need a fresh fine-grained PAT (Contents: read/write on `mahtamun-hoque-fahim/learn-BEE` only) before commits can land.

---

## 🔧 Carry-over bugs from prior sessions

- [ ] **`src/app/api/certificate/route.ts` doesn't type-check** — it `.insert`s into `certificates` (alias of `certRegistrations`) with `userId`, `quote`, `semester` fields that don't exist on the table. Two options:
  - Add columns to `cert_registrations` (Drizzle migration) and keep route as-is.
  - Rewrite route against existing columns. Decision needed.
- [ ] `knowledge-base/question-bank.json` contains `//` line comments → **invalid JSON**. Either strip comments, or formally adopt `lib/questions.ts` as canonical and delete the JSON.

---

## 🔄 In progress / partial

- [ ] **Cheat-sheet page** — `knowledge-base/cheat-sheet.md` exists. Wire a `/cheat-sheet` route that reads `curriculum.json` and renders all `key_formulas` via `<Tex block>` grouped by chapter.
- [ ] **Per-chapter simulators** — currently one generic `CircuitSimulator.tsx`. Need a registry: `simulators/{rc-transient, kvl-kcl-solver, mesh-current, source-transform, thevenin-norton, rlc-second-order, phasor-calc, power-triangle, transformer-turns}.tsx`. The `Capacitors` HTML demo I built earlier this session is the reference quality bar for the RC transient simulator.

---

## ⏳ Content — chapters and topics

- [ ] **Question bank — chapters 15–19 have 0 questions.** Author with verification from Sadiku source:
  - ch15 Laplace Transform: ≥25 questions (Q15.1–Q15.25)
  - ch16 Applications of Laplace: ≥20
  - ch17 Fourier Series: ≥20
  - ch18 Fourier Transform: ≥20
  - ch19 Two-Port Networks: ≥20
- [ ] **Topic bodies** — `curriculum.json` topics are bare titles. Promote to `{ title, body (markdown+LaTeX), worked_examples[], pitfalls[] }`. This is the big content lift.
- [ ] **Question types beyond MCQ/numerical** — spec mentioned fill-blank (have it), true/false (don't have it), short answer (don't), long answer (don't).
- [ ] **Difficulty rebalance** — spec wants 50 MCQ + 30 fill-blank + 20 T/F + 15 short + 10 long + 20 numerical per topic. Currently averaging ~5 questions per chapter.

---

## ⏳ Features

- [ ] **Admin past-paper PDF drag-drop** — upload to R2 / S3, store metadata in a new `past_papers` table, show on `/bonus`. Spec calls out midterm (≤super-node) / final (super-node onward) / 2×CT separation.
- [ ] **Bonus problems flow** — review existing `BonusClient.tsx`; verify it splits exam-prep by term as spec requires.
- [ ] **Search across content** — chapter titles, topics, formulas, questions. Use simple substring on the JSON; no infra needed.
- [ ] **Bookmarking + notes** — new tables `bookmarks(userId, topicRef)` + `notes(userId, topicRef, body)`. Per-topic UI in `ChapterClient`.
- [ ] **Streaks / gamification** — store `last_active_date` on user; compute streak server-side.
- [ ] **Weak-area recommendations** — derive from `quiz_attempts` (which topics had < 60% correct).
- [ ] **Mastery certificates** with admin-assigned personal quote (per spec) — partially wired through `defaultQuotes` + `certRegistrations`; finish the admin UI to override the auto-pick.
- [ ] **`.env.example`** committed at repo root.

---

## ⏳ Infrastructure

- [ ] Add `drizzle-kit generate` migration files (currently using `push` which skips migration history).
- [ ] Vercel project + Neon production branch wiring.
- [ ] Sentry / minimal error logging on API routes.
- [ ] CI: GitHub Actions for `npm run lint && npx tsc --noEmit && npm run build` on PRs.
