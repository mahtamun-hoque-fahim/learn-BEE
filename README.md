# learn-BEE

University-level Basic Electrical Engineering platform: theory, interactive circuit simulators, randomised quizzes, and moderator-reviewed certificates. Built for BGCTUB 2nd-semester students; aligned with Sadiku 5th Ed. & Boylestad.

---

## Stack

- Next.js 16 App Router (TypeScript), React 19
- Tailwind CSS 4
- Neon (PostgreSQL) + Drizzle ORM
- Clerk auth
- KaTeX (server-rendered math)
- Recharts (charts); jsPDF + html2canvas (certificate render)

---

## Prerequisites

- Node.js 18+
- npm (or pnpm)
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
cp .env.example .env.local   # (file pending — see Env Vars below)
# Fill in DATABASE_URL, Clerk keys, etc.

# 4. Push DB schema
npx drizzle-kit push

# 5. Run
npm run dev
```

---

## Env Vars

```env
DATABASE_URL=
NEXT_PUBLIC_APP_URL=

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

Full descriptions → `PLANNER.md` → Env Vars section.

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

## Folder Structure

```
knowledge-base/   # JSON sources for curriculum, questions, simulators, cheat-sheet
src/app/          # Next.js routes — learn, dashboard, admin, mod, api
src/components/   # math/Tex (KaTeX), simulator/CircuitSimulator
src/lib/          # curriculum, questions, db schema, auth helpers
public/           # Static assets
```

Full architecture → `PLANNER.md`. Design tokens → `DESIGN_GUIDE.md`.

---

## Math Rendering

All formulas — in the key-formula cards, question text, options, and explanations — render via KaTeX. The `<RichMath>` component auto-detects math: explicit `$...$` / `$$...$$` delimiters, plus any string containing unicode math glyphs (Ω, ρ, ×, ², etc.) is converted to LaTeX automatically. See `src/components/math/Tex.tsx`.
