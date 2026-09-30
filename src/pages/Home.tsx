import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Chip, FadeIn, Panel, SectionTitle, StatOrb } from '@/components/ui';
import { LABS } from '@/components/labs';
import { allProjects, colorPalettes, flashcards, lessons, weeks } from '@/content';
import { ADINKRA_GLYPHS, BADGES } from '@/lib/progression';
import { useProgress } from '@/lib/store';

const PILLARS = [
  { glyph: '⌘', title: '16 Lessons · 8 Weeks', to: '/course', text: 'From sense–plan–act to quantum sensing, each lesson is a full engineering text with formulas, worked numbers and real part numbers.', tone: 'gold' as const },
  { glyph: '⚙', title: '10 Interactive 3D Labs', to: '/labs', text: 'Tune a PID quadrotor, solve inverse kinematics, run a Kalman filter, grow a mycelial network, rotate a qubit on the Bloch sphere.', tone: 'psy' as const },
  { glyph: '⚔', title: 'Quiz Arena & Boss Trials', to: '/quiz', text: 'Seven questions per lesson, ten per weekly boss trial, with combo multipliers, timers and explanations that actually teach.', tone: 'hot' as const },
  { glyph: '✦', title: 'Flashcard SRS Engine', to: '/flashcards', text: 'A Leitner/SM-2 style scheduler tracks every term and resurfaces it exactly when you are about to forget it.', tone: 'gold' as const },
  { glyph: '∿', title: 'Charts & Data', to: '/charts', text: 'Torque–speed curves, step responses, Allan deviation, cost of transport, sensor-fusion error growth and your own mastery radar.', tone: 'sirius' as const },
  { glyph: '▦', title: '12 Engineering Tables', to: '/tables', text: 'Sensors, actuators, compute, comms, power, gearboxes, mycelium substrates, living materials, safety standards, heritage.', tone: 'gold' as const },
  { glyph: '🍄', title: 'Idea Lab · 72 Blueprints', to: '/ideas', text: 'DIY mycelium robo-tech, Jyotish cultural computing, biomimicry, atmospheric and geothermal energy, quantum sensing, Wakanda-grade systems.', tone: 'myco' as const },
  { glyph: '✵', title: 'Heritage Atlas', to: '/atlas', text: 'Ọ̀gún, Nok iron, Haya steel, Ifá binary structure, Adinkra, Ishango, Timbuktu, Afrofuturism — and the engineering idea in each.', tone: 'psy' as const },
];

export default function Home() {
  const xp = useProgress((s) => s.xp);
  const completed = useProgress((s) => Object.keys(s.completedLessons).length);
  const saved = useProgress((s) => s.savedProjects.length);

  const counts: Record<string, number> = allProjects.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-14">
      {/* ------------------------------ hero ------------------------------ */}
      <section className="relative overflow-hidden rounded-3xl border border-[#f5b301]/25 bg-gradient-to-br from-[#1b0a04] via-[#120a2e] to-[#05010f] p-6 md:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-[380px] w-[380px] rounded-full bg-[#c026d3]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-[320px] w-[320px] rounded-full bg-[#6ee7a8]/15 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Chip>◉ LIVE ONLINE COURSE</Chip>
              <Chip tone="psy">8 WEEKS · 16 LESSONS</Chip>
              <Chip tone="myco">AFROCENTRIC · GALACTIC · PSYCHEDELIC</Chip>
            </div>
            <h1 className="title-3d text-[13vw] leading-[0.86] text-[#f5b301] sm:text-6xl lg:text-7xl">
              ROBOTICS
              <br />
              <span className="text-psy">ENGINEERING</span>
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[#ded4f2] md:text-base">
              A full robotics engineering academy built as an interactive instrument. Every concept is a moving part:
              you drive the kinematics, tune the controller, fuse the sensors, grow the mycelium, rotate the qubit and
              then design the machine nobody has built yet. Iron is the ancestor of every circuit —{' '}
              <span className="text-[#f5b301]">Ọ̀gún&apos;s forge is open.</span>
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/course" className="btn btn-primary">
                ⚒ Enter the forge
              </Link>
              <Link to="/labs" className="btn btn-ghost">
                ⚙ Open a 3D lab
              </Link>
              <Link to="/ideas" className="btn btn-myco">
                🍄 Idea Lab
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatOrb value={16} label="lessons" glyph="⌘" />
              <StatOrb value={LABS.length} label="3D labs" glyph="⚙" tone="psy" />
              <StatOrb value={badgesPlus()} label="adinkra badges" glyph="✺" tone="myco" />
              <StatOrb value={`${allProjects.length}`} label="DIY blueprints" glyph="🍄" tone="sirius" />
            </div>

            {(xp > 0 || completed > 0 || saved > 0) && (
              <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-[#6ee7a8]/25 bg-[#6ee7a8]/5 px-4 py-3">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#6ee7a8]">
                  your run so far
                </span>
                <Chip tone="dim">{xp} XP</Chip>
                <Chip tone="dim">{completed}/16 lessons</Chip>
                <Chip tone="dim">{saved} saved projects</Chip>
                <Link to="/progress" className="ml-auto text-[12px] text-[#f5b301] underline">
                  see full progress →
                </Link>
              </div>
            )}
          </div>

          {/* instructor card */}
          <div className="space-y-4">
            <Panel className="p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#f5b301]">instructor</div>
              <div className="mt-2 flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-2xl border border-[#f5b301]/40 bg-gradient-to-br from-[#3a1206] to-[#120a2e] text-2xl">
                  🔥
                </div>
                <div>
                  <div className="font-display text-lg text-white">BHANU KUSHWAHA</div>
                  <div className="text-[12px] text-[#c9bde6]">Lead Robotics Engineer, OXA</div>
                </div>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-[#ded4f2]">
                Hands-on builds, simulation, sensors, control systems, AI and perception, IoT, safety, industry
                insights, teamwork, problem solving, automation, embedded systems, prototyping, real-world impact and
                future skills — the full stack of what a robotics engineer actually does in a week.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {['Hands-on builds', 'Simulation', 'Control systems', 'AI & perception', 'IoT', 'Safety', 'Embedded', 'Prototyping'].map(
                  (t) => (
                    <Chip key={t} tone="dim">
                      {t}
                    </Chip>
                  ),
                )}
              </div>
            </Panel>

            <Panel tone="myco" className="p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#6ee7a8]">
                the four threads
              </div>
              <ul className="mt-2 space-y-2 text-[13px] leading-relaxed text-[#cfe9dc]">
                <li>
                  <strong className="text-[#b8f5d0]">Iron &amp; fire</strong> — Ọ̀gún, the blacksmith orisha of tools,
                  roads and transformation. Engineering as a sacred discipline.
                </li>
                <li>
                  <strong className="text-[#b8f5d0]">Star knowledge</strong> — Dogon Sirius tracking, Nabta Playa,
                  Ishango tallies, Timbuktu astronomy. The sky as the first sensor bus.
                </li>
                <li>
                  <strong className="text-[#b8f5d0]">Living circuitry</strong> — mycelium networks, plant fuel cells,
                  slime mould optimisation. Machines that grow instead of being assembled.
                </li>
                <li>
                  <strong className="text-[#b8f5d0]">Quantum &amp; cosmic</strong> — qubits, NV-centre magnetometry,
                  atmospheric charge, geothermal heat. The physics at the edges of the map.
                </li>
              </ul>
            </Panel>
          </div>
        </div>
      </section>

      {/* --------------------------- stat marquee --------------------------- */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-black/30 py-2.5">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center gap-6 px-4 font-mono text-[11px] uppercase tracking-widest text-[#c9bde6]">
              {weeks.map((w) => (
                <span key={w.week} className="flex items-center gap-2 whitespace-nowrap">
                  <span className="text-[#f5b301]">WK{w.week}</span> {w.title}
                  <span className="text-[#c026d3]">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------ pillars ---------------------------- */}
      <section>
        <SectionTitle
          eyebrow="what is inside"
          title="Eight ways to build the skill"
          sub="Reading is the smallest part. The course is designed so that every abstract idea has a knob, a graph or a mesh you can push against."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.05}>
              <Link to={p.to}>
                <Panel hover tone={p.tone} className="h-full p-5">
                  <div className="text-2xl">{p.glyph}</div>
                  <div className="mt-2 font-heading text-base font-semibold text-white">{p.title}</div>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#c9bde6]">{p.text}</p>
                </Panel>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ---------------------------- curriculum --------------------------- */}
      <section>
        <SectionTitle
          eyebrow="the arc"
          title="Eight weeks, one closed loop"
          sub="Each week ends with a boss trial that tests both lessons at exam standard."
          right={
            <Link to="/course" className="btn btn-ghost">
              full roadmap →
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
                        className="flex items-start gap-2 text-[12.5px] leading-snug text-[#ded4f2] hover:text-[#f5b301]"
                      >
                        <span className="font-mono text-[10px] text-[#f5b301]">L{l.number}</span>
                        {l.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Panel>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ------------------------------ labs ------------------------------- */}
      <section>
        <SectionTitle
          eyebrow="hands on"
          title="Labs you can break"
          sub="Real solvers and real integrators — not animations. Every lab has three challenges worth XP."
          right={
            <Link to="/labs" className="btn btn-ghost">
              all labs →
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
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Chip tone="dim">{l.track}</Chip>
                    {l.threeD && <Chip tone="psy">3D</Chip>}
                  </div>
                </Panel>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ---------------------------- idea lab ----------------------------- */}
      <section>
        <SectionTitle
          eyebrow="beyond the syllabus"
          title="The Idea Lab: build what does not exist yet"
          sub="Every blueprint splits the engineering from the myth, with a bill of materials, build steps, metrics and safety controls."
          right={
            <Link to="/ideas" className="btn btn-myco">
              enter the lab →
            </Link>
          }
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { id: 'mycelium', name: 'Mycelium Robo-Tech', glyph: '🍄', tone: 'myco' as const, blurb: 'Living chassis, fungal signalling probes, myco-batteries, self-healing grippers, compostable robots.' },
            { id: 'nature', name: 'Nature & Biomimicry', glyph: '🌿', tone: 'myco' as const, blurb: 'Gecko adhesion, slime-mould routing, stigmergic swarms, termite cooling, monocopter seeds.' },
            { id: 'jyotish', name: 'Jyotish Cultural Computing', glyph: '✵', tone: 'gold' as const, blurb: 'Panchang schedulers over real agronomy, nakshatra task slots, fractal yantra antennas — with honest epistemic framing.' },
            { id: 'energy', name: 'Energy Frontiers', glyph: '⚡', tone: 'sirius' as const, blurb: 'Atmospheric charge, telluric currents, geothermal TEGs, plant fuel cells, RTG models, radiation mapping.' },
            { id: 'quantum', name: 'Quantum Systems', glyph: '⚛', tone: 'psy' as const, blurb: 'Bloch-sphere simulators, quantum RNG, NV-centre magnetometry, post-quantum fleet crypto.' },
            { id: 'afrofuture', name: 'Afrofuture / Wakanda', glyph: '◈', tone: 'psy' as const, blurb: 'Auxetic vibranium bumpers, kente modular robots, Adinkra error language, tensegrity obelisk walkers.' },
            { id: 'space', name: 'Space & Extreme', glyph: '🚀', tone: 'sirius' as const, blurb: 'Light-lag autonomy, radiation-hardened avionics, CubeSat ADCS, budget thermal-vacuum testing.' },
            { id: 'more', name: 'And more waiting', glyph: '✦', tone: 'gold' as const, blurb: `${allProjects.length} blueprints in total, each scored for Wakanda index, DIY feasibility and real scientific grounding.` },
          ].map((c, i) => (
            <FadeIn key={c.id} delay={i * 0.04}>
              <Link to="/ideas">
                <Panel hover tone={c.tone} className="h-full p-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl">{c.glyph}</span>
                    {counts[c.id] !== undefined && (
                      <span className="font-mono text-[11px] text-[#f5b301]">{counts[c.id]} builds</span>
                    )}
                  </div>
                  <div className="mt-2 font-heading text-sm text-white">{c.name}</div>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#c9bde6]">{c.blurb}</p>
                </Panel>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ---------------------------- palette ------------------------------ */}
      <section>
        <SectionTitle
          eyebrow="art direction"
          title="The palettes behind the look"
          sub="Each palette is drawn from a real source: forge iron, Dogon starlight, the Ilé-Ifẹ̀ cosmogony, mycelial glow, and the X-ray light of Sirius B."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {colorPalettes.map((p, i) => (
            <FadeIn key={p.id} delay={i * 0.05}>
              <Panel className="h-full p-4">
                <div className="font-heading text-sm text-white">{p.name}</div>
                <div className="mt-0.5 text-[11.5px] italic leading-snug text-[#c9bde6]">{p.inspiration}</div>
                <div className="mt-3 space-y-1.5">
                  {p.colors.map((c) => (
                    <div key={c.hex} className="flex items-center gap-2">
                      <span
                        className="h-5 w-5 shrink-0 rounded-md border border-white/20"
                        style={{ background: c.hex }}
                      />
                      <span className="truncate font-mono text-[10.5px] text-[#ded4f2]">{c.name}</span>
                      <span className="ml-auto font-mono text-[10px] text-[#8c82a8]">{c.hex}</span>
                    </div>
                  ))}
                </div>
              </Panel>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ---------------------------- adinkra ------------------------------ */}
      <section>
        <SectionTitle
          eyebrow="the badge language"
          title="Adinkra as an achievement system"
          sub="Fourteen Adinkra symbols from the Akan are the badges. Each one is earned by demonstrating something, never by logging in."
          right={
            <Link to="/achievements" className="btn btn-ghost">
              trophy room →
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {ADINKRA_GLYPHS.map((g, i) => (
            <motion.div
              key={`${g.name}-${i}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="rounded-xl border border-[#f5b301]/20 bg-white/[0.03] p-3 text-center"
            >
              <div className="text-2xl text-[#f5b301]">{g.glyph}</div>
              <div className="mt-1 font-heading text-[11px] text-white">{g.name}</div>
              <div className="text-[10px] leading-tight text-[#c9bde6]">{g.meaning}</div>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 text-center text-[12px] text-[#8c82a8]">
          {BADGES.length} badges · {flashcards.length} flashcards · {lessons.length} lessons · {LABS.length} labs
        </div>
      </section>

      <section className="text-center">
        <Panel className="mx-auto max-w-3xl p-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#f5b301]">begin</div>
          <h2 className="mt-2 font-display text-3xl text-white">Learn more</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#c9bde6]">
            8 weeks. 16 lessons. 10 labs. 8 boss trials. {allProjects.length} blueprints. One closed loop —
            from {lessons[0]?.title ?? 'first principles'} to {lessons[lessons.length - 1]?.title ?? 'the frontier'}.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to={`/lesson/${lessons[0]?.id ?? 'w1l1'}`} className="btn btn-primary">
              Start Lesson 1 →
            </Link>
            <Link to="/quiz" className="btn btn-ghost">
              Jump to the arena
            </Link>
          </div>
        </Panel>
      </section>
    </div>
  );
}

function badgesPlus() {
  return BADGES.length;
}
