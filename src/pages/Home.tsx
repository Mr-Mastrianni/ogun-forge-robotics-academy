import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Chip, FadeIn, Panel, SectionTitle, StatOrb } from '@/components/ui';
import { LABS } from '@/components/labs';
import { allProjects, colorPalettes, flashcards, lessons, weeks } from '@/content';
import { ADINKRA_GLYPHS, BADGES } from '@/lib/progression';
import { useProgress } from '@/lib/store';
import { useUi, VIBE_META } from '@/lib/uiStore';

/* ------------------------------------------------------------------ */
/* The guided path: four steps, each one a real action in the app       */
/* ------------------------------------------------------------------ */

interface Step {
  n: number;
  title: string;
  why: string;
  doThis: string;
  to: string;
  cta: string;
  done: boolean;
  glyph: string;
  minutes: string;
}

const PILLARS = [
  { glyph: '⌘', title: '16 lessons · 8 weeks', to: '/course', text: 'Each lesson is a complete engineering text: plain-English summary, formulas, real data tables, code and interactive labs.', tone: 'gold' as const },
  { glyph: '⚙', title: '10 interactive labs', to: '/labs', text: 'Real solvers, not animations — inverse kinematics, a Kalman filter, a PID flight controller, a growing mycelial network, a qubit.', tone: 'sirius' as const },
  { glyph: '🍄', title: 'Mycelium Tech hub', to: '/mycelium', text: 'Living materials as engineering: grow protocol, substrate data, biosafety, and 24 blueprints from a chassis to myco-computing.', tone: 'myco' as const },
  { glyph: '⚔', title: 'Quiz Arena', to: '/quiz', text: '7 questions per lesson, 10 per weekly boss trial, plus mixed drills and a weak-spot drill that targets what you keep getting wrong.', tone: 'hot' as const },
  { glyph: '✦', title: 'Flashcards', to: '/flashcards', text: '155 terms on a spaced-repetition schedule: again, hard, good, easy. The deck resurfaces exactly what you are about to forget.', tone: 'gold' as const },
  { glyph: '▦', title: 'Tables & charts', to: '/tables', text: 'Compare real sensors, motors, boards, batteries and substrates — then see every concept graph in one gallery.', tone: 'sirius' as const },
  { glyph: '🧬', title: 'Idea Lab', to: '/ideas', text: '88 buildable blueprints with parts lists, build steps and measurable success criteria — each split into engineering vs story.', tone: 'myco' as const },
  { glyph: '✵', title: 'Heritage Atlas', to: '/atlas', text: 'Nok iron, Haya steel, Ifá structure, Adinkra, Timbuktu astronomy — with the engineering idea inside each and honest status labels.', tone: 'psy' as const },
];

const MYCO_FACTS = [
  { label: 'Grow time', value: '10–21 days', note: 'from spawn to a load-bearing block' },
  { label: 'Signal size', value: '0.05–2 mV', note: 'the electrical spikes you can actually measure' },
  { label: 'Fuel cell output', value: '10–200 mW/m²', note: 'enough for sensors, never for motors' },
];

export default function Home() {
  const xp = useProgress((s) => s.xp);
  const completedLessons = useProgress((s) => s.completedLessons);
  const labs = useProgress((s) => s.labs);
  const scores = useProgress((s) => s.scores);
  const saved = useProgress((s) => s.savedProjects);
  const vibe = useUi((s) => s.vibe);

  const done = Object.keys(completedLessons).length;
  const labTasks = Object.values(labs).reduce((a, b) => a + b.length, 0);
  const quizzes = Object.keys(scores).length;

  const counts: Record<string, number> = allProjects.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const nextLesson = lessons.find((l) => !completedLessons[l.id]) ?? lessons[0];
  const nextLab = LABS.find((l) => (labs[l.id]?.length ?? 0) < l.tasks.length) ?? LABS[0];

  const STEPS: Step[] = [
    {
      n: 1,
      glyph: '📖',
      title: 'Read one lesson',
      why: 'Every lesson now opens with a Plain English panel: what it is about, an analogy, the one thing to remember and the mix-up to avoid.',
      doThis: `Start with L${nextLesson.number}: ${nextLesson.title}`,
      to: `/lesson/${nextLesson.id}`,
      cta: 'Read the lesson',
      done: done > 0,
      minutes: '~15 min the first time',
    },
    {
      n: 2,
      glyph: '⚙',
      title: 'Break a lab',
      why: 'Move one slider at a time, predict what happens, then push it until the system fails. That failure is the lesson.',
      doThis: `${nextLab.name} — ${nextLab.tasks.length} challenges worth XP`,
      to: `/labs/${nextLab.id}`,
      cta: 'Open the lab',
      done: labTasks > 0,
      minutes: '~20 min',
    },
    {
      n: 3,
      glyph: '⚔',
      title: 'Prove it with a quiz',
      why: 'Seven questions with explanations. A wrong answer tells you exactly which section to re-read — that is the whole point.',
      doThis: `${quizzes}/16 lessons quizzed so far`,
      to: quizzes > 0 ? '/quiz' : `/quiz/${nextLesson.id}`,
      cta: 'Take the quiz',
      done: quizzes > 0,
      minutes: '~8 min',
    },
    {
      n: 4,
      glyph: '🍄',
      title: 'Build something',
      why: 'Pick a blueprint, copy the parts list, and run the success criteria. Your capstone in week 8 comes from this list.',
      doThis: `${saved.length} blueprint${saved.length === 1 ? '' : 's'} saved to your forge list`,
      to: '/ideas',
      cta: 'Browse blueprints',
      done: saved.length > 0,
      minutes: 'weekend and beyond',
    },
  ];

  const completedSteps = STEPS.filter((s) => s.done).length;

  return (
    <div className="space-y-12">
      {/* ------------------------------- hero ------------------------------- */}
      <section className="relative overflow-hidden rounded-3xl border border-[#67e8f9]/25 bg-gradient-to-br from-[#150735] via-[#0a0422] to-[#05010f] p-6 md:p-10">
        <div className="pointer-events-none absolute -right-28 -top-28 h-[420px] w-[420px] rounded-full bg-[#8b5cf6]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-[340px] w-[340px] rounded-full bg-[#6ee7a8]/15 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Chip tone="psy">◈ LIVE ONLINE COURSE</Chip>
              <Chip>8 WEEKS · 16 LESSONS</Chip>
              <Chip tone="myco">LIVING MACHINES</Chip>
            </div>

            <h1 className="font-display text-[13vw] leading-[0.86] sm:text-6xl lg:text-7xl">
              <span className="text-vibranium">ROBOTICS</span>
              <br />
              <span className="text-afro">ENGINEERING</span>
            </h1>

            <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-[#e6dcff] md:text-base">
              An interactive academy where every concept is something you can push, break and rebuild: drive the
              kinematics, tune the controller, fuse the sensors, grow the mycelium, rotate the qubit. Written plainly,
              measured honestly, and themed after the forge that clears the road.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={`/lesson/${nextLesson.id}`} className="btn btn-primary">
                {done > 0 ? '▶ Continue' : '▶ Start lesson 1'}
              </Link>
              <Link to="/mycelium" className="btn btn-myco">
                🍄 Mycelium Tech
              </Link>
              <Link to="/labs" className="btn btn-ghost">
                ⚙ Browse labs
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2 text-[12px] text-[#c9bde6]">
              <span className="stat-bead">✦ {xp} XP</span>
              <span className="stat-bead">📖 {done}/16 lessons</span>
              <span className="stat-bead">⚙ {labTasks} lab challenges</span>
              <span className="stat-bead">🍄 {saved} saved blueprints</span>
            </div>
          </div>

          {/* instructor + a quick legend */}
          <div className="space-y-4">
            <Panel className="p-5">
              <div className="holo-kicker">Instructor</div>
              <div className="mt-2 flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-2xl border border-[#67e8f9]/40 bg-gradient-to-br from-[#1b0a3a] to-[#05010f] text-2xl">
                  🔥
                </div>
                <div>
                  <div className="font-display text-lg text-white">BHANU KUSHWAHA</div>
                  <div className="text-[12px] text-[#c9bde6]">Lead Robotics Engineer, OXA</div>
                </div>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-[#ded4f2]">
                Hands-on builds, simulation, sensors, control systems, AI and perception, IoT, safety, industry insights,
                teamwork, problem solving, automation, embedded systems, prototyping, real-world impact and future skills.
              </p>
            </Panel>

            <Panel tone="psy" className="p-5">
              <div className="holo-kicker">Finding your way around</div>
              <ul className="mt-2 space-y-2 text-[12.5px] leading-relaxed text-[#f3e9ff]">
                <li>
                  <strong className="text-white">The sidebar</strong> groups everything: Start here, Learn, Practise,
                  Reference, Build. On a phone it becomes five tabs plus a menu.
                </li>
                <li>
                  <strong className="text-white">Press ⌘K</strong> (or <kbd className="rounded border border-white/20 px-1">/</kbd>)
                  to search every lesson, lab, blueprint, table and term at once.
                </li>
                <li>
                  <strong className="text-white">The field button</strong> in the header changes how alive the
                  background is. Currently <span className="text-[#f5c8ff]">{VIBE_META[vibe].label}</span> — switch to
                  Calm if motion bothers you.
                </li>
                <li>
                  <strong className="text-white">A+ / A−</strong> resizes every piece of text in the app, including
                  lessons, for comfortable reading.
                </li>
              </ul>
            </Panel>
          </div>
        </div>
      </section>

      {/* ---------------------------- guided path ---------------------------- */}
      <section>
        <SectionTitle
          eyebrow="start here"
          title="The four-step path"
          sub="If you only do one thing today, do step one. The app tracks all four automatically — nothing to configure."
          right={
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-[#c9bde6]">{completedSteps}/4 done</span>
              <div className="flex gap-1">
                {STEPS.map((s) => (
                  <span key={s.n} className="step-dot" data-on={s.done} />
                ))}
              </div>
            </div>
          }
        />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((s, i) => (
            <FadeIn key={s.n} delay={i * 0.05}>
              <Panel hover tone={s.done ? 'myco' : 'gold'} className="flex h-full flex-col p-4">
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl text-[#67e8f9]">{String(s.n).padStart(2, '0')}</span>
                  <span className="text-xl">{s.glyph}</span>
                </div>
                <h3 className="mt-2 font-heading text-[15px] font-semibold text-white">{s.title}</h3>
                <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-[#ded4f2]">{s.why}</p>
                <div className="mt-3 rounded-xl border border-white/10 bg-black/25 px-3 py-2">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[#8c82a8]">{s.minutes}</div>
                  <div className="mt-0.5 text-[12.5px] text-[#ffe9a8]">{s.doThis}</div>
                </div>
                <Link to={s.to} className={`btn mt-3 !py-1.5 text-[12px] ${s.done ? 'btn-ghost' : 'btn-primary'}`}>
                  {s.done ? '✓ revisit' : s.cta}
                </Link>
              </Panel>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* --------------------------- mycelium spotlight ---------------------- */}
      <section className="relative overflow-hidden rounded-3xl border border-[#6ee7a8]/30 bg-gradient-to-br from-[#04160f] via-[#061a2e] to-[#05010f] p-6 md:p-8">
        <div className="pointer-events-none absolute -right-16 -bottom-20 h-[300px] w-[300px] rounded-full bg-[#6ee7a8]/20 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Chip tone="myco">🍄 FEATURED</Chip>
              <Chip tone="dim">advanced tier</Chip>
            </div>
            <h2 className="font-display text-3xl text-[#6ee7a8] md:text-4xl">Mycelium robo-tech</h2>
            <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-[#cfe9dc]">
              The oldest technology on Earth is also the most advanced idea in this course. A fungal network grows its own
              structure, senses chemistry, routes nutrients, repairs itself and composts at end of life. The hub gives you
              the grow protocol, the substrate data, the biosafety rules, the living-circuit lab and{' '}
              <strong className="text-[#b8f5d0]">{counts['mycelium'] ?? 0} blueprints</strong> — each split into what has
              been measured versus what is still story.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/mycelium" className="btn btn-myco">
                Enter the hub →
              </Link>
              <Link to="/labs/mycelium" className="btn btn-ghost">
                ⚡ Grow a network
              </Link>
            </div>
          </div>
          <div className="grid gap-3">
            {MYCO_FACTS.map((f) => (
              <div key={f.label} className="holo-well flex items-center gap-4 p-3">
                <div className="font-heading text-lg text-[#6ee7a8]">{f.value}</div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[#8c82a8]">{f.label}</div>
                  <div className="text-[12px] text-[#cfe9dc]">{f.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ pillars ------------------------------ */}
      <section>
        <SectionTitle
          eyebrow="what is inside"
          title="Eight ways to build the skill"
          sub="Reading is the smallest part. Everything else has a knob, a graph or a mesh you can push against."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.04}>
              <Link to={p.to}>
                <Panel hover tone={p.tone} className="h-full p-4">
                  <div className="text-2xl">{p.glyph}</div>
                  <div className="mt-2 font-heading text-[15px] font-semibold text-white">{p.title}</div>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#c9bde6]">{p.text}</p>
                </Panel>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ---------------------------- curriculum ----------------------------- */}
      <section>
        <SectionTitle
          eyebrow="the arc"
          title="Eight weeks, one closed loop"
          sub="Each week ends with a boss trial that tests both lessons at exam standard."
          right={
            <Link to="/course" className="btn btn-ghost">
              Full roadmap →
            </Link>
          }
        />
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {weeks.map((w, i) => (
            <FadeIn key={w.week} delay={i * 0.04}>
              <Panel hover className="h-full p-4">
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-2xl text-[#f5b301]">{String(w.week).padStart(2, '0')}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#c9bde6]">
                    {w.lessons.length} lessons
                  </span>
                </div>
                <div className="mt-1 font-heading text-sm font-semibold text-white">{w.title}</div>
                <div className="mt-0.5 text-[12px] text-[#c9bde6]">{w.theme}</div>
                <ul className="mt-3 space-y-1.5">
                  {w.lessons.map((l) => (
                    <li key={l.id}>
                      <Link
                        to={`/lesson/${l.id}`}
                        className="flex items-start gap-2 text-[12.5px] leading-snug text-[#ded4f2] hover:text-[#67e8f9]"
                      >
                        <span className="font-mono text-[10px] text-[#67e8f9]">L{l.number}</span>
                        <span className="flex-1">{l.title}</span>
                        {completedLessons[l.id] && <span className="text-[#6ee7a8]">✓</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Panel>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* -------------------------------- labs ------------------------------- */}
      <section>
        <SectionTitle
          eyebrow="hands on"
          title="Labs you can break"
          sub="Real solvers and real integrators. Every lab carries three challenges worth XP."
          right={
            <Link to="/labs" className="btn btn-ghost">
              All ten labs →
            </Link>
          }
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LABS.slice(0, 6).map((l, i) => (
            <FadeIn key={l.id} delay={i * 0.05}>
              <Link to={`/labs/${l.id}`}>
                <Panel hover tone={l.tone} className="h-full p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{l.glyph}</span>
                    <span className="font-heading text-sm text-white">{l.name}</span>
                  </div>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-[#c9bde6]">{l.blurb}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <Chip tone="dim">{l.track}</Chip>
                    {l.threeD && <Chip tone="psy">3D</Chip>}
                    <span className="ml-auto font-mono text-[10.5px] text-[#c9bde6]">
                      {(labs[l.id]?.length ?? 0)}/{l.tasks.length}
                    </span>
                  </div>
                </Panel>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ------------------------------ idea lab ----------------------------- */}
      <section>
        <SectionTitle
          eyebrow="beyond the syllabus"
          title="The Idea Lab"
          sub="Every blueprint splits the engineering from the story, with a parts list, build steps, measurable success criteria and safety controls."
          right={
            <Link to="/ideas" className="btn btn-myco">
              Enter the lab →
            </Link>
          }
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { id: 'mycelium', name: 'Mycelium robo-tech', glyph: '🍄', tone: 'myco' as const },
            { id: 'nature', name: 'Nature & biomimicry', glyph: '🌿', tone: 'myco' as const },
            { id: 'jyotish', name: 'Jyotish cultural computing', glyph: '✵', tone: 'gold' as const },
            { id: 'energy', name: 'Energy frontiers', glyph: '⚡', tone: 'sirius' as const },
            { id: 'quantum', name: 'Quantum systems', glyph: '⚛', tone: 'psy' as const },
            { id: 'afrofuture', name: 'Afrofuture / Wakanda', glyph: '◈', tone: 'psy' as const },
            { id: 'space', name: 'Space & extreme', glyph: '🚀', tone: 'sirius' as const },
            { id: 'all', name: 'See everything', glyph: '✦', tone: 'gold' as const },
          ].map((c, i) => (
            <FadeIn key={c.id} delay={i * 0.03}>
              <Link to="/ideas">
                <Panel hover tone={c.tone} className="flex h-full items-center gap-3 p-3.5">
                  <span className="text-2xl">{c.glyph}</span>
                  <div className="min-w-0">
                    <div className="font-heading text-[13px] text-white">{c.name}</div>
                    <div className="font-mono text-[10.5px] text-[#c9bde6]">
                      {c.id === 'all' ? `${allProjects.length} total` : `${counts[c.id] ?? 0} blueprints`}
                    </div>
                  </div>
                </Panel>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ------------------------------ palettes ----------------------------- */}
      <section>
        <SectionTitle
          eyebrow="art direction"
          title="The five palettes"
          sub="Forge iron, Dogon starlight, the Ilé-Ifẹ̀ cosmogony, mycelial bioluminescence and the X-ray spectrum of Sirius B."
        />
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {colorPalettes.map((p, i) => (
            <FadeIn key={p.id} delay={i * 0.05}>
              <Panel className="h-full p-4">
                <div className="flex h-12 overflow-hidden rounded-xl border border-white/15">
                  {p.colors.map((c) => (
                    <div key={c.hex} className="flex-1" style={{ background: c.hex }} title={`${c.name} ${c.hex}`} />
                  ))}
                </div>
                <div className="mt-3 font-heading text-sm text-white">{p.name}</div>
                <div className="text-[11.5px] italic leading-snug text-[#c9bde6]">{p.inspiration}</div>
              </Panel>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ------------------------------- adinkra ----------------------------- */}
      <section>
        <SectionTitle
          eyebrow="the badge language"
          title="Adinkra as an achievement system"
          sub="Fourteen Akan symbols are the badges. Each one is earned by demonstrating something, never by logging in."
          right={
            <Link to="/achievements" className="btn btn-ghost">
              Trophy room →
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {ADINKRA_GLYPHS.map((g, i) => (
            <motion.div
              key={`${g.name}-${i}`}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="rounded-xl border border-[#67e8f9]/20 bg-white/[0.03] p-3 text-center"
            >
              <div className="text-2xl text-[#67e8f9]">{g.glyph}</div>
              <div className="mt-1 font-heading text-[11px] text-white">{g.name}</div>
              <div className="text-[10px] leading-tight text-[#c9bde6]">{g.meaning}</div>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 text-center font-mono text-[11px] text-[#8c82a8]">
          {BADGES.length} badges · {flashcards.length} flashcards · {lessons.length} lessons · {LABS.length} labs ·{' '}
          {allProjects.length} blueprints
        </div>
      </section>

      {/* -------------------------------- end -------------------------------- */}
      <section className="text-center">
        <Panel tone="psy" className="mx-auto max-w-3xl p-8">
          <div className="holo-kicker">Begin</div>
          <h2 className="mt-2 font-display text-3xl text-white">Pick your next move</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#c9bde6]">
            {done === 0
              ? 'Start with lesson 1. It takes about fifteen minutes and it sets up everything else.'
              : `You have ${done} of 16 lessons and ${xp} XP. The fastest way to grow from here is a quiz on your weakest lesson, then a lab.`}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to={`/lesson/${nextLesson.id}`} className="btn btn-primary">
              {done === 0 ? 'Start lesson 1' : `Continue L${nextLesson.number}`} →
            </Link>
            <Link to="/progress" className="btn btn-ghost">
              📈 What should I do next?
            </Link>
          </div>
        </Panel>
      </section>
    </div>
  );
}
