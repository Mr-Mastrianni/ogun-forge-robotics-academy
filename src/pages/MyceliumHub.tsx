import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Chip, FadeIn, Meter, Panel, SectionTitle, StatOrb } from '@/components/ui';
import { LabRenderer } from '@/components/labs';
import { myceliumProjects, referenceTables } from '@/content';
import type { Difficulty } from '@/content/types';
import { Term } from '@/components/Term';
import { useProgress } from '@/lib/store';

/* ------------------------------------------------------------------ */
/* Static, hand-written protocol content — the part a student needs to */
/* read before touching spawn. Numbers are honest ranges, not promises */
/* ------------------------------------------------------------------ */

const PATH = [
  {
    step: '01',
    title: 'Grow it',
    time: '10–21 days',
    glyph: '🌱',
    body:
      'Hydrate your substrate to roughly 60–75% moisture, pasteurise it, then mix in 20–30% spawn by mass. Pack it into a mould, cover it, and keep it at 24–27 °C in the dark. White hyphae should knit the whole block together in one to three weeks depending on substrate and species. You are not growing mushrooms — you are growing a foam.',
    checks: ['Block holds its shape when unmoulded', 'Surface is uniformly white, no green or black patches', 'Faint mushroom smell, not sour or fermented'],
  },
  {
    step: '02',
    title: 'Harden it',
    time: '2–5 days',
    glyph: '⛓',
    body:
      'Press the colonised block to set density, then dry it slowly at 60–80 °C until the mass stops falling. Heating does two jobs: it drives out water and it kills the organism so the part stops growing and stops wanting to fruit. A live composite will slowly change shape and eventually push out mushrooms indoors. A deactivated one behaves like a stiff, light, slightly springy wood.',
    checks: ['Mass stable over two consecutive weighings', 'No further white growth after 48 hours', 'Part rings dull, not hollow, when tapped'],
  },
  {
    step: '03',
    title: 'Instrument it',
    time: '1 weekend',
    glyph: '⚡',
    body:
      'This is where it becomes robotics. Either use it as a structure (bolt, clamp, glue — it takes wood screws well and machines like soft MDF), or use it as a sensor. For sensing, insert two stainless or carbon electrodes a fixed distance apart, amplify the millivolt difference with an instrumentation amplifier, and digitise it with a 16-bit ADC. The signal you are chasing is small: expect 0.05–2 mV spikes lasting seconds to minutes.',
    checks: ['Baseline noise below 0.1 mV with the electrodes in damp substrate', 'A detectable response to a drop of nutrient solution', 'Readings repeatable across three separate insertions'],
  },
];

const HONEST = [
  {
    glyph: '✅',
    tone: 'myco' as const,
    title: 'Measured, you can build on it',
    items: [
      'Mycelium biocomposites are real materials: roughly 100–400 kg/m³, 0.1–1.2 MPa compressive, tunable by substrate and press.',
      'They absorb sound, insulate thermally, char rather than flash-burn, and compost in weeks to months.',
      'Mycelium does produce action-potential-like electrical spikes, measured in the 0.05–2 mV range with seconds-to-minutes durations.',
      'Fungal networks forage efficiently: Physarum and mycelial networks repeatedly approximate near-optimal transport routes.',
      'Microbial and fungal fuel cells do generate power — tens to a couple of hundred milliwatts per square metre of electrode.',
    ],
  },
  {
    glyph: '⚠',
    tone: 'hot' as const,
    title: 'Hype, treat it as a story',
    items: [
      'Mycelium is not a brain, does not think, and has no demonstrated language or memory you can compute with.',
      'Spike trains have no agreed encoding. A classifier trained on them is measuring your setup as much as the organism.',
      'Fungal robots are slow: response in seconds to minutes, growth in days. Nothing about this is real-time control.',
      'Numbers vary by an order of magnitude between labs because process dominates. Your number is the only one that matters.',
      'Self-healing and self-replication work in demos at tiny scale and have not been shown to beat conventional manufacturing.',
    ],
  },
];

const CONCEPTS = [
  {
    glyph: '🧬',
    term: 'Engineered living materials',
    body:
      'Materials that contain living organisms doing a job: growing, sensing, repairing or filtering. The engineering shift is that the material has a lifecycle — you design its birth, its maintenance and its death.',
  },
  {
    glyph: '🕸',
    term: 'Mycelial network optimisation',
    body:
      'A foraging mat reinforces paths that carry nutrients and prunes the rest, converging on efficient transport. It is a physical optimiser with no algorithm — slow, but remarkably good at routing problems.',
  },
  {
    glyph: '♻',
    term: 'Bio-welding',
    body:
      'Two colonised parts pressed together will knit into one continuous piece if the organism is still alive. No fasteners, no adhesive, and the joint is as strong as the bulk material.',
  },
  {
    glyph: '🔋',
    term: 'Myco-batteries and fuel cells',
    body:
      'Bacteria and fungi stripping electrons from organic matter can drive a trickle current. Honest scale: microwatts to low milliwatts, enough to keep a sensor node alive, never enough to move a motor.',
  },
  {
    glyph: '🧠',
    term: 'Reservoir computing on living substrate',
    body:
      'Instead of training the organism, you use its rich internal dynamics as a fixed random reservoir and train only a simple linear readout. Real methodology, applied to a slow noisy biological medium.',
  },
  {
    glyph: '🛡',
    term: 'Melanised shielding',
    body:
      'Radiation-tolerant fungi produce melanin that scatters and absorbs ionising radiation. Published work is early but real; treat any shielding claim as unproven until you measure dose reduction yourself.',
  },
];

const BIOSAFETY = [
  'Buy spawn or cultures from a reputable supplier. Never culture an unknown wild mould indoors.',
  'Wear an N95/P2 mask when handling dry spawn, dry substrate or anything mouldy. Spores are the hazard, not the mycelium.',
  'People who are immunocompromised should not do this work: Aspergillus and other moulds are opportunistic pathogens.',
  'Keep wet organic substrate away from mains voltage. Run low-voltage DC only, with a conformal-coated board and a drip loop.',
  'Seal spent substrate in a bag and either compost it outdoors or sterilise it before disposal so nothing escapes.',
  'Never grow moulds on food you intend to eat, and never reuse a food container for food afterwards.',
];

export default function MyceliumHub() {
  const [diff, setDiff] = useState<Difficulty | 'all'>('all');
  const saved = useProgress((s) => s.savedProjects);
  const toggleProject = useProgress((s) => s.toggleProject);
  const labs = useProgress((s) => s.labs);

  const projects = useMemo(
    () => myceliumProjects.filter((p) => diff === 'all' || p.difficulty === diff),
    [diff],
  );

  const substrateTable = referenceTables.find((t) => t.id === 'mycelium-substrates');
  const livingTable = referenceTables.find((t) => t.id === 'living-materials');

  const avgWakanda = Math.round(myceliumProjects.reduce((a, p) => a + p.wakandaIndex, 0) / Math.max(1, myceliumProjects.length));
  const buildable = myceliumProjects.filter((p) => p.diyFeasibility >= 60).length;
  const mycoLabDone = labs['mycelium']?.length ?? 0;

  return (
    <div className="space-y-8">
      {/* ------------------------------- hero ------------------------------- */}
      <section className="relative overflow-hidden rounded-3xl border border-[#6ee7a8]/30 bg-gradient-to-br from-[#04160f] via-[#071c33] to-[#05010f] p-6 md:p-9">
        <div className="pointer-events-none absolute -right-20 -top-24 h-[360px] w-[360px] rounded-full bg-[#6ee7a8]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-16 h-[300px] w-[300px] rounded-full bg-[#67e8f9]/15 blur-3xl" />
        <div className="relative grid gap-7 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Chip tone="myco">🍄 LIVING MACHINES</Chip>
              <Chip tone="psy">HIGH-ADVANCED TIER</Chip>
              <Chip tone="dim">{myceliumProjects.length} blueprints</Chip>
            </div>
            <h1 className="font-display text-4xl leading-[0.95] md:text-5xl">
              <span className="text-vibranium">MYCELIUM</span>
              <br />
              <span className="text-afro">ROBO-TECH</span>
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#ded4f2]">
              The most advanced idea in this course is also the oldest technology on Earth. A fungal network grows its own
              structure, senses chemistry, routes nutrients, repairs itself and composts at end of life. You cannot
              machine it into a servo, and that is the point: it is a different kind of material, and it asks a
              different kind of engineering.
            </p>
            <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-[#9fd9bb]">
              Everything below is split into <strong className="text-[#6ee7a8]">what has been measured</strong> and{' '}
              <strong className="text-[#ff8fd6]">what is still story</strong>. Build the measured half first — that is
              where the real capability lives.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#protocol" className="btn btn-myco">
                🌱 Start the grow protocol
              </a>
              <Link to="/labs/mycelium" className="btn btn-ghost">
                ⚡ Open the living-circuit lab
              </Link>
              <Link to="/tables" className="btn btn-ghost">
                ▦ Substrate data
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <StatOrb value={myceliumProjects.length} label="mycelium blueprints" glyph="🧬" tone="myco" />
              <StatOrb value={buildable} label="buildable now" glyph="🔧" tone="gold" />
              <StatOrb value={avgWakanda} label="mean Wakanda index" glyph="◈" tone="psy" />
              <StatOrb value={`${mycoLabDone}/3`} label="lab challenges done" glyph="⚡" tone="sirius" />
            </div>
            <Panel tone="myco" className="p-4">
              <div className="holo-kicker">Three numbers to remember</div>
              <ul className="mt-2 space-y-2 text-[13px] leading-relaxed text-[#cfe9dc]">
                <li>
                  <strong className="text-[#b8f5d0]">10–21 days</strong> to grow a structural block from spawn.
                </li>
                <li>
                  <strong className="text-[#b8f5d0]">0.05–2 mV</strong> is the size of the electrical spikes you will be
                  measuring. Your wiring matters more than your organism.
                </li>
                <li>
                  <strong className="text-[#b8f5d0]">10–200 mW/m²</strong> is what a microbial fuel cell realistically
                  delivers. Sensors, never motors.
                </li>
              </ul>
            </Panel>
          </div>
        </div>
      </section>

      {/* --------------------------- honest split --------------------------- */}
      <section>
        <SectionTitle
          eyebrow="read this first"
          title="Measured versus story"
          sub="Living materials attract more hype than almost any other technology. This is the boundary, and you should hold it in every project report you write."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {HONEST.map((col) => (
            <Panel key={col.title} tone={col.tone} className="p-5">
              <div className="flex items-center gap-2">
                <span className="text-xl">{col.glyph}</span>
                <h3 className="font-heading text-[15px] text-white">{col.title}</h3>
              </div>
              <ul className="mt-3 space-y-2.5">
                {col.items.map((it, i) => (
                  <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-[#ded4f2]">
                    <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
                    {it}
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
      </section>

      {/* ----------------------------- protocol ----------------------------- */}
      <section id="protocol" className="scroll-mt-24">
        <SectionTitle
          eyebrow="protocol"
          title="Grow → harden → instrument"
          sub="The whole craft in three stages. Each stage has a go/no-go check: do not move on until the check passes, because defects compound."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {PATH.map((s, i) => (
            <FadeIn key={s.step} delay={i * 0.06}>
              <Panel tone="myco" className="flex h-full flex-col p-5">
                <div className="flex items-center justify-between">
                  <span className="font-display text-3xl text-[#6ee7a8]">{s.step}</span>
                  <Chip tone="myco">⏱ {s.time}</Chip>
                </div>
                <h3 className="mt-2 font-heading text-lg text-white">
                  {s.glyph} {s.title}
                </h3>
                <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-[#ded4f2]">{s.body}</p>
                <div className="mt-4 rounded-xl border border-[#6ee7a8]/25 bg-[#6ee7a8]/5 p-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6ee7a8]">go / no-go</div>
                  <ul className="mt-1.5 space-y-1">
                    {s.checks.map((c, ci) => (
                      <li key={ci} className="flex gap-2 text-[12.5px] leading-relaxed text-[#cfe9dc]">
                        <span className="text-[#6ee7a8]">✓</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </Panel>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* -------------------------------- lab ------------------------------- */}
      <section>
        <SectionTitle
          eyebrow="hands on"
          title="The living-circuit lab"
          sub="Grow a simulated hyphal network with the space-colonisation algorithm, inject nutrient at a tip, and measure the delay and waveform at your electrode. The simulator runs 20× time-lapse because real fungal signalling is measured in millimetres per second."
        />
        <LabRenderer labId="mycelium" />
      </section>

      {/* ---------------------------- concepts ------------------------------ */}
      <section>
        <SectionTitle
          eyebrow="advanced concepts"
          title="What the frontier actually means"
          sub="Six ideas that separate a mycelium craft project from mycelium engineering — each explained without jargon."
        />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {CONCEPTS.map((c, i) => (
            <FadeIn key={c.term} delay={i * 0.04}>
              <Panel tone="psy" className="h-full p-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{c.glyph}</span>
                  <h3 className="font-heading text-[13.5px] text-white">
                    <Term term={c.term}>{c.term}</Term>
                  </h3>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-[#ded4f2]">{c.body}</p>
              </Panel>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* --------------------------- blueprint list ------------------------- */}
      <section>
        <SectionTitle
          eyebrow="build these"
          title={`${myceliumProjects.length} mycelium blueprints`}
          sub="Every blueprint lists parts, steps, measurable success criteria and the safety controls you must follow. Save a few to your forge list — they become capstone candidates."
          right={
            <div className="flex flex-wrap gap-1.5">
              {(['all', 'seedling', 'apprentice', 'journeyman', 'master', 'orisha'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDiff(d)}
                  className={`rounded-lg border px-2.5 py-1 font-mono text-[10.5px] capitalize transition-colors ${
                    diff === d
                      ? 'border-[#6ee7a8]/60 bg-[#6ee7a8]/15 text-[#b8f5d0]'
                      : 'border-white/10 bg-white/[0.03] text-[#c9bde6] hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          }
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => {
            const isSaved = saved.includes(p.id);
            return (
              <Panel key={p.id} hover tone="myco" className="flex h-full flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    <Chip tone="myco">{p.difficulty}</Chip>
                    <Chip tone="dim">{p.costBand}</Chip>
                    <Chip tone="dim">⏱ {p.buildTime}</Chip>
                  </div>
                  <button
                    onClick={() => toggleProject(p.id)}
                    className={`shrink-0 rounded-lg border px-2 py-1 text-[11.5px] transition-colors ${
                      isSaved ? 'border-[#6ee7a8]/60 bg-[#6ee7a8]/20 text-[#b8f5d0]' : 'border-white/15 text-[#c9bde6] hover:text-white'
                    }`}
                  >
                    {isSaved ? '★' : '☆'}
                  </button>
                </div>
                <h3 className="mt-2 font-heading text-[15px] font-semibold leading-snug text-white">{p.title}</h3>
                <p className="mt-1 flex-1 text-[12.5px] leading-relaxed text-[#ded4f2]">{p.summary}</p>
                <div className="mt-3 space-y-2">
                  <Meter label="Wakanda index" value={p.wakandaIndex} tone="psy" />
                  <Meter label="DIY feasibility" value={p.diyFeasibility} tone="myco" />
                  <Meter label="grounded in measurement" value={p.scienceGrounding} tone="sirius" />
                </div>
                <Link to={`/ideas/${p.id}`} className="btn btn-myco mt-3 !py-1.5 text-[12px]">
                  open blueprint →
                </Link>
              </Panel>
            );
          })}
        </div>
      </section>

      {/* ----------------------------- data tables -------------------------- */}
      <section>
        <SectionTitle
          eyebrow="reference data"
          title="Substrates and living materials"
          sub="Process dominates outcome, so treat every published number as a starting range and report your own substrate, spawn ratio, press pressure and drying schedule alongside your result."
        />
        <div className="space-y-4">
          {[substrateTable, livingTable].filter(Boolean).map((t) => (
            <Panel key={t!.id} className="overflow-hidden">
              <div className="border-b border-white/10 px-4 py-3">
                <div className="font-heading text-sm font-semibold text-white">{t!.title}</div>
                <div className="text-[12px] text-[#c9bde6]">{t!.intro}</div>
              </div>
              <div className="max-h-[460px] overflow-auto">
                <table className="forge-table">
                  <thead>
                    <tr>
                      {t!.columns.map((c) => (
                        <th key={c}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t!.rows.map((r, ri) => (
                      <tr key={ri}>
                        {r.map((cell, ci) => (
                          <td key={ci}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-[#6ee7a8]/20 bg-[#6ee7a8]/5 px-4 py-2.5 text-[12.5px] leading-relaxed text-[#cfe9dc]">
                <strong className="text-[#6ee7a8]">How to choose:</strong> {t!.insight}
              </div>
            </Panel>
          ))}
        </div>
      </section>

      {/* ------------------------------ safety ------------------------------ */}
      <section>
        <SectionTitle
          eyebrow="do not skip"
          title="Biosafety and bench discipline"
          sub="The organism is harmless. The spores, the contamination and the wet electronics are not."
        />
        <Panel tone="hot" className="p-5">
          <ul className="grid gap-3 md:grid-cols-2">
            {BIOSAFETY.map((b, i) => (
              <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-[#f3e9ff]">
                <span className="text-[#ff8fd6]">▸</span>
                {b}
              </li>
            ))}
          </ul>
        </Panel>
      </section>

      {/* ----------------------------- next steps --------------------------- */}
      <section className="grid gap-4 md:grid-cols-3">
        <Panel className="p-5">
          <div className="holo-kicker">Learn the theory</div>
          <ul className="mt-2 space-y-2 text-[13px]">
            <li>
              <Link to="/lesson/w2l3" className="text-[#ded4f2] hover:text-[#67e8f9]">
                L3 · Proprioception — measuring millivolt signals without noise
              </Link>
            </li>
            <li>
              <Link to="/lesson/w8l16" className="text-[#ded4f2] hover:text-[#67e8f9]">
                L16 · Capstone and living machines
              </Link>
            </li>
            <li>
              <Link to="/lesson/w7l14" className="text-[#ded4f2] hover:text-[#67e8f9]">
                L14 · Safety, standards and ethics of living systems
              </Link>
            </li>
          </ul>
        </Panel>
        <Panel tone="myco" className="p-5">
          <div className="holo-kicker">Practise the maths</div>
          <ul className="mt-2 space-y-2 text-[13px]">
            <li>
              <Link to="/labs/mycelium" className="text-[#cfe9dc] hover:text-[#6ee7a8]">
                ⚡ Living-circuit lab — grow, inject, measure
              </Link>
            </li>
            <li>
              <Link to="/labs/kalman" className="text-[#cfe9dc] hover:text-[#6ee7a8]">
                ∿ Sensor fusion — extracting signal from a noisy living sensor
              </Link>
            </li>
            <li>
              <Link to="/flashcards" className="text-[#cfe9dc] hover:text-[#6ee7a8]">
                ✦ Drill the living-materials cards
              </Link>
            </li>
          </ul>
        </Panel>
        <Panel tone="psy" className="p-5">
          <div className="holo-kicker">Make it a capstone</div>
          <p className="mt-2 text-[13px] leading-relaxed text-[#f3e9ff]">
            Pick one blueprint, write its primary success metric with units before you build, and treat the grow time as
            schedule risk rather than a weekend. Living projects fail on the calendar, not on the electronics.
          </p>
          <Link to="/ideas" className="btn btn-myco mt-3 !py-1.5 text-[12px]">
            Browse all blueprints →
          </Link>
        </Panel>
      </section>
    </div>
  );
}
