# Airborne SEO Report — learnBEE

> Run at the post-redesign milestone (feat/redesign-v2 merged to main). Next.js 16.2.6, App Router.

## 1. Executive Summary
- **Headline:** the site was live and indexed at `learn-basic-electrical-engineering.vercel.app` but shipped with **no sitemap, robots, canonical, OpenGraph or schema** — Google had only a stale snippet ("200+ questions", emoji). This pass adds the full technical SEO layer.
- **Site-wide primary keyword:** `BGCTUB basic electrical engineering` (and `EEE 1201`) — institution-specific, winnable. Generic `basic electrical engineering notes` is dominated by Studocu, Poriyaan, eduengineering and publisher pages; do not fight for it head-on.
- **Biggest opportunity:** per-chapter topic long-tail (`thevenin theorem example`, `nodal analysis supernode`, `RC charging time constant`) + the genuinely rare angle: **interactive circuit simulators** with live current flow. No competitor in the BEE-notes SERP offers that.
- **Top blocker:** single canonical host. Set `NEXT_PUBLIC_SITE_URL` to the production domain so sitemap/canonical/OG resolve correctly.
- **Next milestone:** author 2–3 cornerstone guide pages (see §9) to capture the topic long-tail that the chapter pages only partially serve.

## 2. Stack Audit
- **Framework:** Next.js 16.2.6, App Router, React 19. Turbopack build.
- **Runtime:** mostly static/SSG; content listing routes (`/lectures /labs /papers /books`) are dynamic (DB-backed), `/learn/[chapterId]` is SSG.
- **Database:** Neon Postgres + Drizzle. **Auth:** Clerk. **Hosting:** Vercel (Cloudflare-ready).
- **Content source:** curriculum + question bank in `src/lib` / `knowledge-base/`; admin CMS rows for lectures/labs/papers/books.
- **Existing SEO assets (before this pass):** none — no `sitemap.ts`, no `robots.ts`, no `metadataBase`, no JSON-LD, only a bare title/description.
- **Added this pass:** `app/sitemap.ts`, `app/robots.ts`, `metadataBase` + title template + OG/Twitter + keywords in `app/layout.tsx`, `EducationalOrganization` + `WebSite` JSON-LD site-wide, `Course` JSON-LD on `/`, per-chapter `generateMetadata` + `LearningResource` JSON-LD, `src/lib/seo.ts` config.

## 3. Site Map & Route Inventory
| Route | File | Type | Est. URLs |
|---|---|---|---|
| `/` | app/page.tsx | Static | 1 |
| `/syllabus` | app/syllabus/page.tsx | Static | 1 |
| `/lectures` `/labs` `/papers` `/books` | app/*/page.tsx | Dynamic (DB) | 4 |
| `/cheat-sheet` | app/cheat-sheet/page.tsx | Static | 1 |
| `/learn` | app/learn/page.tsx | Static | 1 |
| `/learn/[chapterId]` | app/learn/[chapterId]/page.tsx | SSG | 6 (ch1–4, 6, 7) |
| `/bonus` | app/bonus/page.tsx | Static | 1 |
| `/contributors` | app/contributors/page.tsx | Static | 1 |
| `/search` | app/search/page.tsx | Client | 1 (noindex) |
| `/dashboard` | app/dashboard/page.tsx | Dynamic | 1 (noindex) |
| `/admin` `/admin/*` `/mod` | app/*/page.tsx | Client/Dynamic | 6 (noindex) |
| `/certificate` | app/certificate/page.tsx | Client | 1 (noindex) |
| `/api/*` | route handlers | — | excluded |

## 4. Route Classification (Tone Modes)
| Route | Tone | Index? | Primary keyword |
|---|---|---|---|
| `/` | Best Mix | Yes | BGCTUB basic electrical engineering |
| `/learn` | Best Mix | Yes | basic electrical engineering chapters |
| `/learn/[chapterId]` | SEO-First | Yes | per chapter (see §5) |
| `/cheat-sheet` | SEO-First | Yes | basic electrical engineering formula sheet |
| `/syllabus` | SEO-First | Yes | EEE 1201 syllabus BGCTUB |
| `/lectures` `/labs` `/papers` `/books` | Best Mix | Yes | BEE lecture notes / lab manual / past papers / textbooks |
| `/bonus` | Best Mix | Yes | basic electrical engineering mock exam |
| `/contributors` | Best Mix | Yes | learnBEE contributors |
| `/search` `/dashboard` `/admin*` `/mod` `/certificate` | User-First | No (noindex) | — |

## 5. Keyword Strategy
**Site-wide primary:** `BGCTUB basic electrical engineering` · secondary: `EEE 1201`, `BEE 2nd semester notes`, `Sadiku circuits notes`, `Boylestad circuit analysis`.

Per indexable chapter (primary → long-tail cluster):
- **ch1 Basic Concepts** — `electric circuit basic concepts` → charge/current/voltage/power definitions, sign convention, ohm's law basics.
- **ch2 Basic Laws** — `KVL KCL examples` → voltage divider, current divider, series/parallel resistance, Wye-Delta.
- **ch3 Methods of Analysis** — `nodal analysis examples` → mesh analysis, supernode, supermesh, node voltage method steps.
- **ch4 Circuit Theorems** — `thevenin theorem example` → norton, superposition, maximum power transfer, source transformation.
- **ch6 Capacitors** — `capacitor energy formula` → series/parallel capacitors, capacitance, stored energy.
- **ch7 First-Order Circuits** — `RC time constant charging` → discharging, natural/step response, tau = RC.

> Volumes not asserted — competitor SERP (Studocu, Poriyaan, university PDFs) suggests these long-tails are low-competition and answer-shaped, which the chapter reader + cheat-sheet already match. Validate with Search Console after indexing.

## 6. On-Page Content Package (implemented)
- **`/` (Best Mix):** title "Basic Electrical Engineering, organised — BGCTUB 2nd semester"; SEO description; `Course` JSON-LD listing the 6 chapters; marketing hero already in place; dynamic stat band (6/39/41/142).
- **`/learn/[chapterId]` (SEO-First):** `generateMetadata` builds title `"{title} — Chapter N"` and a description seeded with the topic list + formula/quiz counts; `LearningResource` JSON-LD with `teaches` = topics, `isPartOf` the Course.
- **`/learn`, `/cheat-sheet`, section pages, `/contributors`:** descriptive titles via the `%s — learnBEE` template + canonicals.
- All titles 50–60 chars target; descriptions answer-shaped; no emoji, no placeholders.

## 7. Technical SEO (Next.js 16)
- **`app/sitemap.ts`** — indexable statics + the 6 chapter URLs (`MetadataRoute.Sitemap`).
- **`app/robots.ts`** — allow `/`, disallow `/api/ /admin /mod /dashboard /certificate /search`; references `sitemap.xml`.
- **`app/layout.tsx`** — `metadataBase`, title template, OG/Twitter, keywords, `EducationalOrganization` + `WebSite` JSON-LD.
- **Canonical strategy** — `alternates.canonical` per route; one host via `NEXT_PUBLIC_SITE_URL`.
- **OpenGraph image** — TODO: add `app/opengraph-image.tsx` (dynamic OG via `next/og`) rendering the wordmark + chapter title. Currently text-only OG.
- **Core Web Vitals levers** — fonts already `next/font` with `display:swap`; chapter pages SSG; simulators are `lazy()`-loaded; keep the body grid/glow as CSS (no JS). Add `priority` to any future hero image.
- **Version note** — `generateMetadata({ params }: { params: Promise<…> })` (async params, Next 16). `sitemap.ts`/`robots.ts` use the `MetadataRoute` types.

## 8. Implementation Priority
| # | Action | Tone | Impact | Effort | Why |
|---|---|---|---|---|---|
| 1 | Set `NEXT_PUBLIC_SITE_URL` to prod domain | — | High | Trivial | Makes canonical/sitemap/OG correct |
| 2 | sitemap + robots + metadata + JSON-LD | all | High | Done | Was entirely missing |
| 3 | `app/opengraph-image.tsx` dynamic OG | Marketing | Med | Low | Social/CTR lift |
| 4 | Cornerstone guides (§9) | SEO-First | High | Med | Capture topic long-tail |
| 5 | Submit sitemap in Search Console; request reindex | — | High | Low | Clears the stale emoji snippet |

## 9. Content Roadmap (Future Scope)
- **Cornerstone (30 days):** "BGCTUB EEE 1201 complete guide", "Thévenin & Norton, step by step (with simulator)", "Nodal vs Mesh analysis — when to use which".
- **Blog cluster (90 days):** one explainer per chapter long-tail, each linking to its `/learn/[chapter]` reader and `/cheat-sheet#chapter`.
- **Feature gaps (un-coded):** a public, shareable per-chapter formula image; a free "circuit solver" mini-tool; printable PDF notes per chapter.
- **Adjacent markets (6+ months):** the same engine for the next BGCTUB courses (Electronics, Signals), and other Bangladeshi university BEE syllabi (DIU, AIUB) as separate scoped instances.
