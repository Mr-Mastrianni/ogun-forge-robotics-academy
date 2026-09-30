# Idea Lab authoring contract

Read `src/content/types.ts` first — the `IdeaProject` interface there is the law.

## Hard rules

1. Your file starts with exactly:
   ```ts
   import type { IdeaProject } from '../types';
   ```
   (files in `src/content/ideas/` use `'../types'`) then one or more `export const` arrays of `IdeaProject`.
2. Valid TypeScript under `strict: true`. No other imports. No default exports.
3. Every field of `IdeaProject` is required. Do not add fields. Do not omit fields.
4. `category` must be one of `mycelium | jyotish | nature | energy | quantum | afrofuture | space`.
5. `difficulty` must be one of `seedling | apprentice | journeyman | master | orisha`.
6. `costBand` must be one of `$ | $$ | $$$ | $$$$` (a single string).
7. `wakandaIndex`, `diyFeasibility`, `scienceGrounding` are integers 0–100 and must be *honest*: a beautiful
   but unbuildable idea gets a high `wakandaIndex` and a low `diyFeasibility`; a peer-reviewed, garage-buildable
   project gets a high `scienceGrounding` and a high `diyFeasibility`.
8. `realitySplit.real` = the part that is genuine engineering you can measure. `realitySplit.narrative` = the part
   that is cultural framing, metaphor or storytelling. Never blur the two, and never claim astrology, free energy,
   or fungal consciousness as established physics.
9. `billOfMaterials`: 6–12 rows with real parts/quantities and prices where sensible.
10. `buildSteps`: 5–10 concrete steps with enough detail that a competent maker could start.
11. `metrics`: 3–6 measurable success criteria with units (e.g. `{ label: 'open-circuit voltage', value: '0.4–0.9 V' }`).
12. `safety`: 2–5 genuinely specific hazards and controls (mains, spores, LiPo fire, high voltage, lasers, UV,
    radioactive material, chemical, mechanical pinch, data ethics). "Be careful" is not a control.
13. `sources`: 2–5 real URLs you actually saw in search results. Never invent a citation. Prefer papers,
    government/standards pages, university pages and reputable manufacturers.
14. `lessonLinks`: 1–3 lesson ids in the form `w1l1` … `w8l16` that teach the relevant fundamentals.
15. `code` is optional — include it when a snippet genuinely helps (Arduino/Python/ESP32). In a template literal,
    escape backticks and `${` carefully, or use normal single-quoted strings with `\n`.

## Voice

Rigorous, warm, Afrocentric, engineering-first. Reference Ọ̀gún (iron, tools, clearing the road), Kemet,
Nok/Haya metallurgy, Ifá binary structure, Adinkra, Dogon star knowledge, Afrofuturism — accurately.
A project should read like a build brief from a very good lab, not like a pitch deck.
