# Content Authoring Contract — Ọ̀gún's Forge Robotics Academy

Read `src/content/types.ts` first. Every content file must be **valid TypeScript** that compiles
under `strict: true` with **no imports other than the types below**.

## Hard rules

1. Only import types, like this exactly:
   ```ts
   import type { Lesson } from '../types';
   ```
   (adjust the relative path: files in `src/content/lessons/` use `'../types'`).
2. Export a named const, never a default export. Never add extra top-level statements.
3. Use only these block `kind` values: `prose`, `callout`, `formula`, `chart`, `table`, `code`, `lab`, `steps`.
4. **Never invent a block kind or field.** Extra fields break `exactOptionalPropertyTypes`-style review.
5. `answer` is a zero-based index into `choices`. It MUST be correct and MUST vary across a quiz.
6. `series[].data` length MUST equal `x` length in every chart.
7. Inline maths inside `prose.body` uses `$...$` (rendered with KaTeX). Display maths uses a `formula` block.
8. Escape backticks and `${` correctly inside template literals; prefer normal single-quoted strings with
   `\n\n` for paragraph breaks to avoid escaping accidents. Inline markdown allowed in `prose.body`:
   `**bold**`, `*italic*`, `` `code` ``, `[text](https://url)`, `$E=mc^2$`.
9. Every lesson must be *technically correct*. Real numbers with units. No fake citations. If a claim is
   speculative (bio-hybrid, quantum, exotic energy), say so explicitly in the prose.
10. Tone: rigorous engineering, warm Afrocentric voice, no fluff, no filler sentences. Assume a smart
    beginner who wants to actually build.

## Available lab ids (`labId`)

`robot-arm` · `pid-drone` · `swarm` · `kalman` · `mycelium` · `bloch` · `gear-train` ·
`energy-field` · `vision-grid` · `gait`

Each lesson should embed **1–2 labs** and give 3 concrete `tasks` for the learner to complete in the sim.

## File layout — ONE LESSON PER FILE

Each lesson lives in its own file `src/content/lessons/<id>.ts` and exports **exactly one** const:

```ts
import type { Lesson } from '../types';

export const lesson: Lesson = {
  id: 'w1l1',
  /* ... */
};
```

**Hard size budget:** keep the file under ~190 lines of TypeScript and roughly 700–1100 words of
prose-equivalent content. Depth comes from precision, one strong worked example, real numbers and one
honest caveat — never from padding. If you are running long, cut adjectives, not numbers.

## Lesson id / numbering

`id` = `w{week}l{number}` where `number` is the global lesson number 1–16. Examples:
week 1 → `w1l1`, `w1l2`; week 8 → `w8l15`, `w8l16`. `week` is 1–8, `number` is 1–16.

## Difficulty values
`seedling` | `apprentice` | `journeyman` | `master` | `orisha`

## Track values
`foundations` | `perception` | `actuation` | `control` | `kinematics` | `embedded` | `ai` | `systems` | `frontier`

## Required shape per lesson

- 8–20 `blocks` mixing prose, callout, formula, chart, table, code, lab, steps (at least one of each of
  prose, formula-or-chart, table, code, lab, steps across the lesson).
- `keyTerms`: 6–10 entries.
- `quiz`: exactly 7 questions with mixed `level` (`recall`, `understand`, `apply`, `analyze`, `design`).
- `flashcards`: 8–12 entries with a short `tag`.
- `forgePrompts`: 3 short Idea-Lab spark lines.
- `duration`: 45–75 minutes. `xp`: 120–220.
- Charts should use realistic data you can justify (e.g. a motor torque–speed curve, a PID step response,
  a sensor noise histogram). Label axes with units.

## Worked example (copy this shape exactly)

```ts
import type { Lesson } from '../types';

export const week1Lessons: Lesson[] = [
  {
    id: 'w1l1',
    number: 1,
    week: 1,
    track: 'foundations',
    title: 'What a Robot Actually Is',
    subtitle: 'Sense, think, act — and the Afrocentric lineage of the machine',
    duration: 55,
    difficulty: 'seedling',
    xp: 140,
    hook: 'A robot is not a metal human. It is a loop that closes.',
    objectives: [
      'Define a robot with the sense–plan–act loop.',
      'Distinguish a robot from an automaton and from a remote-controlled machine.',
    ],
    blocks: [
      {
        kind: 'prose',
        heading: 'The loop is the machine',
        body:
          'Strip away the chrome and every robot is the same three-beat cycle: **sense**, **plan**, **act**.\n\n' +
          'A washing machine senses almost nothing, plans an open-loop timer, and acts. A drone...',
      },
      {
        kind: 'formula',
        title: 'Closed-loop error',
        tex: 'e(t) = r(t) - y(t), \\qquad u(t) = K_p e(t) + K_i \\int_0^t e(\\tau)\\,d\\tau + K_d \\frac{de}{dt}',
        explain: 'Error is what you want minus what you measured. Every controller is a bet on how to shrink it.',
      },
      {
        kind: 'table',
        title: 'Automaton vs robot vs remote machine',
        columns: ['System', 'Senses?', 'Decides?', 'Acts?', 'Closed loop?'],
        rows: [
          ['Wind-up toy', 'No', 'No', 'Yes', 'No'],
          ['RC car', 'No', 'No (human)', 'Yes', 'No'],
          ['Line follower', 'Yes', 'Yes', 'Yes', 'Yes'],
        ],
      },
      {
        kind: 'lab',
        labId: 'robot-arm',
        title: 'Wake the arm',
        brief: 'Drive a 6-DOF arm and watch the end-effector trace the reachable workspace.',
        tasks: ['Reach the glowing target', 'Find a configuration the arm cannot reach', 'Write down the joint limits'],
      },
      { kind: 'steps', title: 'Your first loop', steps: [{ title: 'Sense', detail: 'Read one encoder.' }] },
      {
        kind: 'code',
        title: 'Smallest possible control loop',
        language: 'cpp',
        code: 'void loop() {\n  int y = analogRead(A0);\n  ...\n}',
        note: 'Compile this against any AVR board.',
      },
    ],
    keyTerms: [{ term: 'End effector', definition: 'The tool at the far end of the kinematic chain.' }],
    quiz: [
      {
        id: 'w1l1q1',
        question: 'Which system is genuinely closed-loop?',
        choices: ['Wind-up toy', 'RC car', 'Line follower', 'Hand crank'],
        answer: 2,
        explanation: 'Only the line follower measures its own state and feeds it back.',
        level: 'recall',
      },
    ],
    flashcards: [{ front: 'End effector', back: 'The tool at the far end of the kinematic chain.', tag: 'anatomy' }],
    forgePrompts: ['Could a mycelium mat be the sensor in a line follower?'],
  },
];
```

Do not include a `sources` field — lessons have no sources field. Project files do (see their own brief).
