# Ọ̀GÚN'S FORGE — Robotics Engineering Academy

An interactive, gamified robotics engineering course in an **Afrocentric galactic psychedelic robotic** theme.
Built from the **8 weeks / 16 lessons / live online** course outline, then pushed far past it: real solvers,
real 3D labs, and a large blueprint library fusing robotics with mycelium, biomimicry, Jyotish cultural
computing, exotic energy, quantum sensing and Afrofuturist systems.

> Iron is the ancestor of every circuit. Ọ̀gún's forge is open.

---

## What is in the app

| Section | What it does |
| --- | --- |
| **Course** (`/course`) | 8-week roadmap, 16 full lessons, per-lesson progress and boss-trial gates |
| **Lessons** (`/lesson/:id`) | Engineering text with KaTeX formulas, Recharts charts, real reference tables, code, and embedded 3D labs |
| **3D Labs** (`/labs`) | 10 interactive simulators running genuine mathematics (see below) |
| **Quiz Arena** (`/quiz`) | 7 questions per lesson, mixed drill, weak-spot drill, 8 weekly boss trials with a 25 s clock |
| **Flashcards** (`/flashcards`) | SM-2 style spaced repetition with ease factors, intervals and keyboard grading |
| **Charts** (`/charts`) | Personal analytics (mastery radar, XP/accuracy curves, per-lesson bars) plus every concept chart in the course |
| **Tables** (`/tables`) | 12 curated reference tables + every table authored inside lessons, searchable |
| **Idea Lab** (`/ideas`) | 80+ buildable blueprints with BOM, steps, metrics, safety controls and honest reality splits |
| **Atlas** (`/atlas`) | 24 Afrocentric science and technology heritage entries with epistemic status labels, plus 5 design palettes |
| **Trophies** (`/achievements`) | 14 Adinkra badges and a 10-rank ladder from Ìwé to Ìmọ̀-Òrun |
| **Progress** (`/progress`) | Week-by-week completion, track mastery, 28-day activity heat map, and concrete next moves |
| **Glossary** (`/glossary`) | Every key term, alphabetised, searchable, linked to its lesson |

### The 10 labs (all run real mathematics)

`robot-arm` — planar 3R manipulator with forward kinematics, damped-least-squares inverse kinematics,
manipulability and a workspace point cloud.
`pid-drone` — quadrotor waypoint tracking with per-axis PID, saturation, drag, gust disturbance and an
analytic second-order step response.
`swarm` — 90 Reynolds boids with separation/alignment/cohesion, ring and grid formations and a predator mode.
`kalman` — 4-state Kalman filter fusing GNSS-like fixes with inertial dead reckoning, with bias, noise,
configurable fix rate and outage handling.
`mycelium` — space-colonisation growth of a hyphal network plus simulated action-potential-like spike
propagation and electrode recording.
`bloch` — single-qubit gate algebra (X, Y, Z, H, S, T, rotations), Bloch sphere, Born-rule measurement histograms.
`gear-train` — three-stage spur gear train with live ratios, mesh losses and reflected inertia.
`energy-field` — atmospheric, geothermal, radioisotope, solar and kinetic harvesting in honest orders of magnitude.
`vision-grid` — ground truth vs sensor view vs occupancy grid with beam width, noise, dropout and odometry drift.
`gait` — walk/trot/pace/bound gaits with IK-consistent legs, ZMP tracking and duty-factor stability.

---

## Stack

- **Vite 5** + **React 18** + **TypeScript** (strict)
- **Tailwind CSS 3** with a custom Afrocentric-galactic design system (`src/styles/globals.css`)
- **three.js** via **@react-three/fiber** + **@react-three/drei** for the 3D labs
- **Recharts** for charts, **KaTeX** for mathematics
- **Zustand** with `persist` for XP, streaks, quiz scores, flashcard scheduling and lab progress
- **framer-motion** for transitions

No backend. All progress lives in `localStorage` under `ogun-forge-progress-v1`.

---

## Local development

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # tsc -b && vite build  → dist/
pnpm preview      # serve the production build on :4173
pnpm typecheck    # tsc --noEmit
```

## Deployment

The repo ships a `vercel.json` that declares the Vite framework preset, the `dist` output directory and an
SPA rewrite to `index.html`, so client-side routes such as `/lesson/w4l8` resolve correctly.

```bash
vercel deploy --prod
```

---

## Content architecture

```
src/content/
  types.ts              # the content schema (Lesson, Block, IdeaProject, AtlasEntry, …)
  SCHEMA.md             # authoring contract for lesson files
  IDEAS_SCHEMA.md       # authoring contract for blueprint files
  bossAndTables.ts      # 8 weekly boss trials + 12 reference tables
  heritage.ts           # Heritage Atlas entries + design palettes
  lessons/w1l1.ts … w8l16.ts   # one file per lesson
  ideas/mycelium.ts, nature*.ts, jyotish-afrofuture.ts, energy-quantum.ts
  index.ts              # aggregation and derived collections
```

Every lesson is typed, every chart's data arrays must match its `x` axis length, and quiz `answer` indices
are validated by review — the schema is enforced by `tsc`.

---

## Honesty rules baked into the content

- **No magic materials.** Every Afrofuturist blueprint names the real material or mechanism standing in for
  the myth (auxetic lattices instead of vibranium, fractal antennas instead of yantra magic).
- **Reality splits.** Each blueprint separates *genuine engineering you can measure* from *cultural framing
  and narrative*.
- **Jyotish is cultural computing, not physics.** Astrology has no demonstrated predictive validity; the
  Jyotish projects compute real ephemerides and real agronomy, and say so.
- **Frontier energy is quantified.** Atmospheric harvesting is microwatts, not kilowatts, and the labs compute it.
- **Heritage entries carry epistemic status**: documented, archaeological, living tradition, or disputed
  (the Dogon/Sirius material is flagged disputed).
- **Biosafety and legal limits are stated** for spores, bacteria, radiation, UV, high voltage and mains.

---

## Credits

Course outline and instructor credit: **Bhanu Kushwaha, Lead Robotics Engineer, OXA** — 8 weeks, 16 lessons,
hands-on builds, simulation, sensors, control systems, AI and perception, IoT, safety, industry insights,
teamwork, problem solving, automation, embedded systems, prototyping, real-world impact, future skills.
