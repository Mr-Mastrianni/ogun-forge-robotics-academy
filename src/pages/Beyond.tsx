import { Chip, FadeIn, Meter, Panel, SectionTitle, StatOrb } from '@/components/ui';
import { allProjects, bossQuizzes, flashcards, lessons } from '@/content';
import { LABS } from '@/components/labs';

interface Upgrade {
  title: string;
  glyph: string;
  category: 'hardware' | 'learning' | 'social' | 'content' | 'platform' | 'frontier';
  impact: number;
  effort: number;
  summary: string;
  how: string[];
  why: string;
}

const UPGRADES: Upgrade[] = [
  {
    title: 'Live mycelium telemetry over WebSerial',
    glyph: '🍄',
    category: 'hardware',
    impact: 92,
    effort: 55,
    summary:
      'Stream a real fungal-electrophysiology rig into the 3D mycelium lab: an ESP32 with an INA333 front end pushes millivolt samples to the browser through the Web Serial API, and the lab plots your own substrate instead of a model.',
    how: [
      'Add a `useSerialProbe()` hook wrapping navigator.serial with a 250 Hz line protocol (`t,mV,ch`).',
      'Overlay the live trace on the simulated electrode chart and add a residual metric between model and organism.',
      'Ship a printable probe jig (electrode spacing, guard ring, conformal-coated board) as an STL in the repo.',
    ],
    why: 'Turns the flagship lab from simulation into a real biological instrument — the single most Wakanda thing this course could do with a $40 bill of materials.',
  },
  {
    title: 'Hardware kit with a one-click BOM cart',
    glyph: '📦',
    category: 'hardware',
    impact: 84,
    effort: 40,
    summary:
      'Every lesson already names real parts. Aggregate the union of all lab and project BOMs into a tiered kit — Starter (Arduino/RP2040 + sensors), Arm, Drone, Mycelium, Energy — with live pricing and a printable pick list.',
    how: [
      'Extract BOM items from all 80+ blueprints into a normalised parts table with supplier SKUs.',
      'Add a `/kit` route with per-tier pricing, budget sliders and a copy-to-clipboard order list.',
      'Print per-lab checklists so a learner can verify the bench before starting.',
    ],
    why: 'Closes the gap between reading and building. The most common failure in online robotics courses is that nobody ever buys the parts.',
  },
  {
    title: 'Peer code and design review for capstones',
    glyph: '🤝',
    category: 'social',
    impact: 88,
    effort: 65,
    summary:
      'A rubric-driven review queue where apprentices submit a capstone repository, schematics and a 90-second demo, and three peers plus one mentor score it against the same weighted rubric the lesson teaches.',
    how: [
      'Add an auth layer (Supabase or Clerk) and a submissions table keyed to the capstone rubric criteria.',
      'Implement blind assignment (3 reviewers per submission), and merge reviewer scores with a disagreement flag.',
      'Feed the aggregate back into the Progress page as a "capstone readiness" score.',
    ],
    why: 'Reviewing other people’s work is the fastest way to internalise the rubric — and it makes the course a cohort, not a PDF.',
  },
  {
    title: 'Live cohort: streaks, duels and a boss ladder',
    glyph: '⚔',
    category: 'social',
    impact: 80,
    effort: 50,
    summary:
      'Real-time head-to-head boss trials — both apprentices get the same ten questions from a week’s material, first correct answer wins the exchange, XP is staked.',
    how: [
      'Add a WebSocket room per boss trial; server-authoritative question stream and timing.',
      'Use a lightweight presence store (PartyKit, Ably or Supabase Realtime) so no long-lived backend is needed.',
      'Keep the local-only mode as the default so the app still works offline.',
    ],
    why: 'Competitive pressure at exam standard is the cheapest known way to make retrieval practice stick.',
  },
  {
    title: 'AR assembly guidance for the labs',
    glyph: '🕶',
    category: 'hardware',
    impact: 78,
    effort: 75,
    summary:
      'The robot-arm and gear-train labs become overlay guides: point a phone at the bench and see the next assembly step anchored to the part, with torque values and torque-sequence ordering.',
    how: [
      'Export each assembly step as a glTF with named anchors; render with WebXR or model-viewer in AR mode.',
      'Drive step advance by voice ("next") and by a QR marker on the base plate.',
      'Log which steps needed the most retries to feed back into the lesson copy.',
    ],
    why: 'Mechanical assembly is where beginners lose hours. Anchored instructions remove the spatial reasoning bottleneck.',
  },
  {
    title: 'Griot mode: the whole course as audio',
    glyph: '🥁',
    category: 'learning',
    impact: 74,
    effort: 35,
    summary:
      'A spoken-word layer read by a griot narrator with talking-drum rhythm beds, generated from the lesson blocks, plus auto-generated audio flashcards for commutes.',
    how: [
      'Generate an SSML script per lesson from the block structure (headings, prose, formula read-outs).',
      'Cache MP3s beside the content and serve them as a `LessonAudio` component with a waveform scrubber.',
      'Ship a hands-free drill mode that plays front, pauses two seconds, plays back.',
    ],
    why: 'Accessibility and time-on-task. Audio turns dead commute time into spaced-repetition time.',
  },
  {
    title: 'Adaptive mastery engine (real IRT)',
    glyph: '📈',
    category: 'learning',
    impact: 86,
    effort: 60,
    summary:
      'Replace fixed 7-question quizzes with an item-response-theory engine that estimates ability per concept, targets the ~85% success band, and schedules both quizzes and flashcards from the same ability estimate.',
    how: [
      'Tag every question with concept ids and difficulty; store responses as a sparse matrix.',
      'Fit a 2PL or Elo-style model client-side (or nightly in a serverless job) and select items by information gain.',
      'Surface per-concept ability in the Charts page and use it to pick the next lesson.',
    ],
    why: 'The current drill is adaptive by lesson; concept-level adaptation is what makes practice feel psychic.',
  },
  {
    title: 'Gazebo / MuJoCo sandbox in the browser',
    glyph: '🤖',
    category: 'platform',
    impact: 82,
    effort: 80,
    summary:
      'A sandbox where learners edit a URDF, tune a controller and watch a physics-accurate simulation — then export the exact ROS 2 launch files to run the same thing locally.',
    how: [
      'Start with Rapier or a WASM MuJoCo build running in a worker; keep the same control-panel language as the existing labs.',
      'Expose a URDF editor with live validation and TF2 tree visualisation.',
      'Emit a downloadable package with package.xml, launch files and a controller config.',
    ],
    why: 'ROS 2 is the industry entry ticket, and the gap between "I read about DDS" and "I ran nav2" is exactly this sandbox.',
  },
  {
    title: 'Offline-first PWA with installable lessons',
    glyph: '📲',
    category: 'platform',
    impact: 70,
    effort: 30,
    summary:
      'Service-worker caching of all lesson text, charts, flashcards and lab code so the course works in low-bandwidth and offline settings — with a background sync when connectivity returns.',
    how: [
      'Add vite-plugin-pwa with a Workbox runtime cache for content chunks and fonts.',
      'Precache the content chunk and KaTeX, and lazy-load three.js on demand only when a lab opens.',
      'Add an install prompt and a "downloaded for offline" indicator per week.',
    ],
    why: 'This course is explicitly for learners in places with expensive or intermittent data. Offline is not a nice-to-have here.',
  },
  {
    title: 'Multilingual knowledge layer',
    glyph: '🗣',
    category: 'learning',
    impact: 79,
    effort: 55,
    summary:
      'Yoruba, Swahili, Amharic, isiZulu, French, Portuguese and Arabic UI plus glossary terms, with the Adinkra and heritage content translated by named community reviewers rather than machine-only.',
    how: [
      'Extract all UI strings and key terms into a message catalogue keyed by locale.',
      'Route content fields through a translation manifest so a lesson can be partially translated safely.',
      'Credit every translator on the lesson page.',
    ],
    why: 'A course about African technological heritage that only speaks English is a contradiction.',
  },
  {
    title: 'Instructor dashboard and cohort analytics',
    glyph: '🧑‍🏫',
    category: 'social',
    impact: 76,
    effort: 58,
    summary:
      'For OXA cohorts: per-student mastery heat maps, question-level discrimination indices, drop-off points inside lessons, and an auto-generated "teach this again" list for the next live session.',
    how: [
      'Emit anonymous telemetry events (lesson opened, block reached, quiz item result) to a small analytics table.',
      'Compute item difficulty and discrimination to retire bad questions automatically.',
      'Add a print-friendly cohort report for the weekly live session.',
    ],
    why: 'It is the difference between a course and a curriculum — and it improves the questions themselves.',
  },
  {
    title: 'Verifiable certificates tied to demonstrated skill',
    glyph: '🎖',
    category: 'social',
    impact: 72,
    effort: 45,
    summary:
      'Issue a certificate only when the recorded evidence exists: lesson completion, boss trials passed, lab challenges ticked, and a capstone reviewed by peers — with a signed, verifiable credential and a public evidence page.',
    how: [
      'Hash the evidence bundle (scores, lab tasks, capstone review) and sign it; publish a W3C Verifiable Credential.',
      'Give each graduate a public page rendering their mastery radar and capstone.',
      'Let employers verify without an account.',
    ],
    why: 'Certificates that cannot be faked because they point at evidence are worth more than PDFs with a logo.',
  },
  {
    title: 'Autonomous field-robot simulation with real terrain',
    glyph: '🛰',
    category: 'frontier',
    impact: 81,
    effort: 78,
    summary:
      'A GPS-denied outdoor mission: load a real DEM tile of a farm or a Karoo ridge, drive a rover with noisy IMU and wheel slip, and require Return-to-Home using only visual-inertial odometry and a magnetometer.',
    how: [
      'Import elevation tiles as a height field; add soil-dependent slip parameters from published terramechanics data.',
      'Run the existing Kalman lab code but with the full 15-state INS error model.',
      'Score by metres of vertical error at return-to-home.',
    ],
    why: 'It is the exact problem agri-robotics companies in Africa are hiring for right now.',
  },
  {
    title: 'Living-materials materials database',
    glyph: '🧬',
    category: 'content',
    impact: 77,
    effort: 42,
    summary:
      'A structured, citable database of measured mycelium biocomposite properties (substrate, spawn ratio, press, density, compressive and flexural strength, absorption, thermal conductivity) that grows as learners contribute their own test data.',
    how: [
      'Normalise the existing mycelium substrate table into a schema with provenance per row.',
      'Add a submission form with mandatory method fields (ASTM/ISO test used) and photo evidence.',
      'Render a comparison chart per property with error bars.',
    ],
    why: 'The literature is fragmented and full of unverifiable numbers. A clean, attributed dataset would be genuinely useful to the field.',
  },
  {
    title: 'Real quantum hardware access',
    glyph: '⚛',
    category: 'frontier',
    impact: 74,
    effort: 68,
    summary:
      'Run the Bloch-sphere gates on an actual superconducting or trapped-ion backend and show the difference between ideal unitary evolution and noisy hardware — gate error, decoherence, readout error.',
    how: [
      'Add a provider adapter (IBM Quantum / Amazon Braket / IQM) behind a "run on hardware" button with a queue indicator.',
      'Plot ideal vs noisy histograms side by side and fit a depolarising noise parameter.',
      'Keep the local simulator as the default so nothing depends on a network.',
    ],
    why: 'The honest lesson about NISQ hardware lands far harder when the learner sees their own circuit come back at 88% fidelity.',
  },
];

const CATS: Record<string, { label: string; color: string }> = {
  hardware: { label: 'Hardware & Bench', color: '#f5b301' },
  learning: { label: 'Learning Science', color: '#6ee7a8' },
  social: { label: 'Cohort & Social', color: '#c026d3' },
  content: { label: 'Content Depth', color: '#67e8f9' },
  platform: { label: 'Platform & Access', color: '#ff6b1a' },
  frontier: { label: 'Frontier', color: '#f5c8ff' },
};

export default function Beyond() {
  const highImpactLowEffort = UPGRADES.filter((u) => u.impact >= 74 && u.effort <= 55);

  return (
    <div className="space-y-7">
      <SectionTitle
        eyebrow="brainstorm"
        title="What would make this course even better"
        sub="Fifteen concrete upgrades, each with an honest impact and effort estimate and a stated implementation path. The app you are using is the current version; this is the forge list for the next one."
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <StatOrb value={UPGRADES.length} label="upgrades scoped" glyph="✦" />
        <StatOrb value={highImpactLowEffort.length} label="high impact, low effort" glyph="🎯" tone="myco" />
        <StatOrb value={lessons.length} label="lessons shipped" glyph="⌘" />
        <StatOrb value={LABS.length} label="labs shipped" glyph="⚙" tone="psy" />
        <StatOrb value={allProjects.length} label="blueprints shipped" glyph="🍄" tone="sirius" />
      </div>

      <Panel className="p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#6ee7a8]">
          do these first — highest leverage per unit of work
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {highImpactLowEffort.map((u) => (
            <div key={u.title} className="rounded-xl border border-[#6ee7a8]/25 bg-[#6ee7a8]/5 p-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{u.glyph}</span>
                <span className="font-heading text-[13px] text-white">{u.title}</span>
              </div>
              <div className="mt-1 font-mono text-[10.5px] text-[#6ee7a8]">
                impact {u.impact} · effort {u.effort}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        {UPGRADES.map((u, i) => (
          <FadeIn key={u.title} delay={Math.min(i * 0.04, 0.4)}>
            <Panel className="flex h-full flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{u.glyph}</span>
                  <div>
                    <h3 className="font-heading text-[15px] font-semibold leading-snug text-white">{u.title}</h3>
                    <span
                      className="font-mono text-[10px] uppercase tracking-widest"
                      style={{ color: CATS[u.category].color }}
                    >
                      {CATS[u.category].label}
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-[13px] leading-relaxed text-[#ded4f2]">{u.summary}</p>

              <div className="mt-4 space-y-2">
                <Meter label="impact" value={u.impact} tone="psy" />
                <Meter label="effort" value={u.effort} tone="gold" />
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#c9bde6]">how to build it</div>
                <ol className="mt-2 space-y-1.5">
                  {u.how.map((h, hi) => (
                    <li key={hi} className="flex gap-2 text-[12.5px] leading-relaxed text-[#ded4f2]">
                      <span className="font-mono text-[10px] text-[#f5b301]">{hi + 1}</span>
                      {h}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-3 border-l-2 border-[#c026d3]/50 pl-3 text-[12.5px] italic leading-relaxed text-[#c9bde6]">
                {u.why}
              </div>
            </Panel>
          </FadeIn>
        ))}
      </div>

      <Panel tone="myco" className="p-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#6ee7a8]">
          the through-line
        </div>
        <h3 className="mt-2 font-heading text-xl text-white">
          Every upgrade moves the course from reading to measuring
        </h3>
        <p className="mt-2 max-w-4xl text-[13.5px] leading-relaxed text-[#cfe9dc]">
          The current build has {lessons.length} lessons, {LABS.length} labs, {bossQuizzes.length} boss trials,{' '}
          {flashcards.length} flashcards and {allProjects.length} blueprints. The next version should make the bench
          real: a serial probe in the mycelium rig, a parts kit you can actually order, a Gazebo sandbox that exports
          runnable ROS 2 packages, an adaptive engine that knows which concept is weak, and a cohort that reviews your
          capstone. Simulation teaches the mathematics; measurement teaches engineering.
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {Object.entries(CATS).map(([k, v]) => (
            <Chip key={k} tone="dim">
              <span style={{ color: v.color }}>■</span> {v.label}
            </Chip>
          ))}
        </div>
      </Panel>
    </div>
  );
}
