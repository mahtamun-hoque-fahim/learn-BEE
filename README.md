# learn-BEE

University-level Basic Electrical Engineering platform: animated theory, KaTeX-typeset formulas, per-chapter interactive simulators (current literally flows along the wires), randomised quizzes, exam-mode prep, and moderator-reviewed completion certificates. Built for BGCTUB 2nd-semester students; aligned with Sadiku 5th Ed. & Boylestad.

---

## Stack

- Next.js 16 App Router (TypeScript), React 19
- Tailwind CSS 4
- Neon (PostgreSQL) + Drizzle ORM
- Clerk auth
- KaTeX (server-rendered math)
- Recharts (charts); custom SVG primitives for animated circuits
- jsPDF + html2canvas (certificate render)

---

## Prerequisites

- Node.js 18+
- npm
- Neon account + database
- Clerk application (publishable + secret keys)

---

## Local Setup

```bash
# 1. Clone
git clone https://github.com/mahtamun-hoque-fahim/learn-BEE.git
cd learn-BEE

# 2. Install
npm install

# 3. Env
cp .env.example .env.local
# Fill in DATABASE_URL and Clerk keys.

# 4. Push DB schema to Neon
npx drizzle-kit push

# 5. Run
npm run dev
```

Open <http://localhost:3000>.

---

## Commands

```bash
npm run dev              # Dev server on localhost:3000
npm run build            # Production build
npm start                # Production server
npm run lint             # ESLint
npx drizzle-kit push     # Apply Drizzle schema to Neon
npx drizzle-kit studio   # Drizzle Studio UI
```

---

## Project Structure (brief)

```
knowledge-base/   # JSON content (curriculum, questions, simulators, cheat-sheet)
src/app/          # Next.js routes (learn, cheat-sheet, search, bonus, dashboard, admin, mod, api)
src/components/   # math/Tex (KaTeX), simulator/animated/* (per-chapter)
src/lib/          # curriculum loader, questions, search, db schema, auth helpers
public/           # Static assets
```

Full details → `PLANNER.md`. Design tokens → `DESIGN_GUIDE.md`. Remaining work → `TODO.md`.

---

## Math Rendering

All formulas — in the cheat-sheet, theory cards, question text, options, and explanations — render via KaTeX. The `<RichMath>` component auto-detects math: explicit `$...$` / `$$...$$` delimiters, plus any string containing unicode math glyphs (`Ω`, `ρ`, `×`, `²`, …) is converted to LaTeX automatically. See `src/components/math/Tex.tsx`.

---

## Animated Simulators

Every in-scope chapter has a topic-tailored animated SVG simulator under `src/components/simulator/animated/`. The visual signature is `AnimatedWire` — dashed-stroke `stroke-dashoffset` animation makes current literally flow along the wires; speed scales with `|I|`, direction with sign. The reference quality bar is `Ch7RCTransientSim` (real-time RC charging/discharging with run/pause/reset). See `DESIGN_GUIDE.md` for the primitive vocabulary.
