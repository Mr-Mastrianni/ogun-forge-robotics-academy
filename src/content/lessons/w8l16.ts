import type { Lesson } from '../types';

export const lesson: Lesson = {
  id: 'w8l16',
  number: 16,
  week: 8,
  track: 'frontier',
  difficulty: 'orisha',
  title: 'Capstone and Future Frontiers: Living, Swarming and Quantum Machines',
  subtitle: 'Design the machine that does not exist yet — then prove it honestly',
  duration: 85,
  xp: 230,
  hook: 'The frontier is not a list of technologies. It is a discipline: know what is measured, what is modelled, and what is only hoped for — and say which is which.',
  objectives: [
    'Run a capstone from requirements to a defended demonstration.',
    'Place a project on the TRL scale and state the evidence for that placement.',
    'Separate measured bio-hybrid and quantum results from speculative claims.',
    'Judge frontier technologies by what they can actually deliver today.',
  ],
  blocks: [
    {
      kind: 'prose',
      heading: 'The capstone is a system, not a demo',
      body:
        'A capstone that works once on your desk is an experiment. A capstone is a small engineering programme: requirements with numbers, an architecture with named interfaces, an integration order, a test plan, a risk register and a safety case.\n\n' +
        'The most common failure is **big-bang integration** — build every subsystem separately, then connect them all on the last night. The professional alternative is bottom-up integration with a stub for every interface from day one: define the message contract first, test each side against a fake, then swap in the real component. Interfaces, not components, are what break.\n\n' +
        'State the readiness honestly. TRL 3 means you demonstrated the critical function in a laboratory. TRL 6 means a representative prototype in a relevant environment. Most student capstones that claim TRL 7 are at TRL 4, and saying so in your report is what earns trust in the parts that do work.',
    },
    {
      kind: 'formula',
      title: 'Frontier engineering runs on budgets',
      tex: 'P_{in} = P_{load} + P_{loss}, \\qquad \\Delta v = I_{sp}\\,g_0\\ln\\frac{m_0}{m_f}, \\qquad \\tau_{coh} \\gg t_{gate} \\Rightarrow \\text{usable qubit}',
      explain:
        'A power budget must balance or the machine browns out. A rocket equation shows why mass is the hardest currency in space. A qubit is only useful while its coherence time is far longer than its gate time — a single number that explains most of the hype gap.',
    },
    {
      kind: 'chart',
      title: 'Eight-week capstone schedule, effort share per week',
      xLabel: 'capstone week',
      yLabel: 'planned hours',
      chartType: 'area',
      x: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
      series: [
        { key: 'design', label: 'design and interfaces', color: '#67e8f9', data: [14, 10, 4, 2, 2, 2, 2, 1] },
        { key: 'build', label: 'build and integrate', color: '#f5b301', data: [2, 8, 14, 14, 10, 6, 4, 2] },
        { key: 'test', label: 'test, measure, document', color: '#6ee7a8', data: [1, 2, 3, 5, 9, 13, 12, 8] },
        { key: 'demo', label: 'demo and defence', color: '#c026d3', data: [0, 0, 0, 0, 0, 2, 6, 12] },
      ],
      caption:
        'Front-load design and interfaces, keep test running from week three, and reserve the final week for defence rather than for debugging. Projects that start testing in week seven do not finish.',
    },
    {
      kind: 'table',
      title: 'Capstone rubric — weighted criteria',
      columns: ['Criterion', 'Weight', '1 (weak)', '3 (solid)', '5 (exceptional)'],
      rows: [
        ['Problem and requirements', '15%', 'Vague goal, no numbers', 'Measurable requirements with constraints', 'Requirements traced to a validated user need'],
        ['Architecture and interfaces', '15%', 'Monolithic, undocumented', 'Decomposed with documented interfaces', 'Interface contracts versioned and stub-tested from day one'],
        ['Working demonstration', '20%', 'Works intermittently', 'Meets the primary success metric repeatably', 'Meets all metrics and degrades gracefully under fault injection'],
        ['Measurement and evidence', '20%', 'Claims without data', 'Metrics measured with stated method and units', 'Uncertainty quantified, negative results reported honestly'],
        ['Safety, ethics, standards', '15%', 'Not considered', 'Risk assessment exists with controls implemented', 'Safety case with PL/SIL reasoning and measured verification'],
        ['Documentation and defence', '15%', 'Code only', 'Buildable by another engineer from the repo', 'Reproducible build, calibration records, and a clear limitations section'],
      ],
      insight:
        'Forty percent of the grade is evidence and integrity. A modest machine that meets its stated metric repeatably with honest limitations outscores an impressive one that cannot be reproduced.',
      caption: 'Each criterion scored 1 to 5, multiplied by weight, summed to a total out of 5.',
    },
    {
      kind: 'prose',
      heading: 'Living machines: what is actually measured',
      body:
        '**Mycelium biocomposites are real materials.** Grow a saprophytic fungus through an agricultural substrate, press it, then heat-treat it to kill the organism and stop growth. The result is a lightweight, low-density, acoustic-absorbing, fire-resistant, biodegradable composite with compressive strengths that vary by an order of magnitude depending on substrate, spawn ratio, pressing pressure and drying schedule. Use the living-materials tables in this course, cite your method, and report your own spread rather than a single number.\n\n' +
        '**Fungal electrophysiology is real but modest.** Mycelium generates action-potential-like voltage spikes, typically in the range of roughly 0.05 to 2 mV, lasting seconds to minutes, propagating at millimetres per second to centimetres per minute. These are measured with electrodes and a high-impedance amplifier. What is *not* established is that spike patterns constitute a language, a memory or a decision-making system in any sense you could engineer against. Treat the substrate as a slow, noisy, living sensor — and say so.\n\n' +
        '**Engineered living materials** — bacterial cellulose, plant and muscle-cell biohybrid actuators, microbial fuel cells — are all at TRL 2 to 4. They are slow, they die, they drift, and they can be contaminated. That is not a reason to dismiss them; it is the specification you must design against. The honest framing is: living components buy self-repair, environmental sensitivity and compostability at the cost of speed, repeatability and predictability.',
    },
    {
      kind: 'table',
      title: 'Hype versus reality on the frontier',
      columns: ['Technology', 'Real performance today', 'Main limit', 'Robotics relevance', 'Verdict'],
      rows: [
        ['Mycelium biocomposite structure', '0.1–1.2 MPa compressive, 100–400 kg/m³, tunable and cheap', 'Moisture sensitivity and wide process variance', 'Chassis, insulation, acoustic panels, disposable bodies', 'Buildable now'],
        ['Fungal electrical sensing', '0.05–2 mV spikes, seconds to minutes, mm/s propagation', 'Noise, drift, no validated encoding', 'Slow environmental and chemical sensing', 'Real but early'],
        ['Microbial fuel cell', 'Roughly 10–200 mW per square metre of electrode', 'Very low power density', 'Trickle-charging sensor nodes only', 'Real, tiny'],
        ['Soft pneumatic actuator', 'Newtons to tens of newtons, Hz-class bandwidth', 'Air supply, hysteresis, control', 'Safe grippers and human-contact robots', 'Buildable now'],
        ['Swarm robotics', 'Hundreds of agents in the lab, tens in the field', 'Verification of emergent behaviour', 'Area coverage, construction, inspection', 'Real, hard to certify'],
        ['Exoskeleton / prosthesis', 'Full-body powered suits work but need kilowatts; myoelectric hands are commodity', 'Energy, weight, comfort, cost', 'Rehabilitation, industrial assist, prosthetics', 'Deployed in niches'],
        ['NV-centre magnetometry', 'Nanotesla per root-hertz sensitivity in a bench device', 'Microwave drive, shielding, cost', 'GPS-denied navigation, subsurface mapping', 'Lab now, field soon'],
        ['Optical atomic clock', 'Fractional stability near 1e-18 in the best labs', 'Size, power, cost', 'Timing and relativity-grade navigation', 'National-lab scale'],
        ['Superconducting qubit', 'Tens to hundreds of physical qubits, gate errors around 1e-3', 'Decoherence and error correction overhead', 'Long-horizon optimisation; not a robot controller', 'Not yet'],
        ['Quantum LiDAR / radar claims', 'Mostly theoretical or modest quantum-enhanced sensing', 'Loss, noise, cost versus classical sensors', 'Possible future advantage in certain regimes', 'Treat claims sceptically'],
        ['Neuromorphic hardware', 'Event-driven inference at microwatts for sparse tasks', 'Tooling, training, ecosystem', 'Always-on perception and anomaly detection', 'Promising'],
        ['Atmospheric energy harvesting', 'Microwatts from a tall collector in the fair-weather field', 'Conduction current of a few picoamps per square metre', 'Wake-timer sensor nodes at most', 'Real but tiny'],
      ],
      insight:
        'The test to apply to any frontier claim: what is the measured number, what is the method, and what would break if the claim were false? If a technology has no number attached, it is a story.',
      caption: 'Ranges reflect published results and typical devices; always verify against current literature for a specific procurement.',
    },
    {
      kind: 'prose',
      heading: 'Quantum, honestly',
      body:
        'Three different things travel under the word quantum, and conflating them causes most of the confusion.\n\n' +
        '**Quantum sensing** is real and useful now. NV centres in diamond measure magnetic fields with nanotesla sensitivity without cryogenics. Atomic clocks and atom interferometers measure time and acceleration with a precision that matters for navigation. SQUIDs detect magnetic fields at the femtotesla level. A robot that can measure a magnetic field map, or hold time without GNSS, gets genuine capability from quantum physics.\n\n' +
        '**Quantum computing** is real but early. A qubit holds superposition and entangles, gates are unitary rotations on the Bloch sphere, and decoherence destroys the state in microseconds to milliseconds. Current machines are noisy and intermediate-scale, meaning error rates are high enough that most circuits need error correction, and error correction needs many physical qubits per logical one. Nothing in current robotics needs one.\n\n' +
        '**Post-quantum cryptography** is the part you should implement today. A future quantum computer running Shor algorithm breaks RSA and elliptic-curve key exchange, and fleets with ten-year service lives are exactly the data that gets harvested now and decrypted later. Migrate to lattice-based key encapsulation such as ML-KEM. This is a real, scheduled engineering task with a real deadline, and it needs no quantum hardware at all.',
    },
    {
      kind: 'code',
      title: 'A capstone interface contract plus a fault-tolerant supervisor',
      language: 'python',
      code: `"""Interface contract: freeze this FIRST, then build both sides against a fake."""

from dataclasses import dataclass, field
from enum import Enum
import time

class Health(Enum):
    OK = "ok"
    DEGRADED = "degraded"
    FAULT = "fault"

@dataclass(frozen=True)
class Setpoint:
    """Command from the planner to the controller. Versioned on purpose."""
    version: int
    t_sent: float
    vx: float          # m/s, body frame
    vy: float
    omega: float       # rad/s
    deadline: float    # absolute time by which this command is obsolete

    def expired(self, now: float | None = None) -> bool:
        return (now or time.monotonic()) > self.deadline

@dataclass
class Supervisor:
    """Wraps any controller. Never trusts a single source of health."""
    last_setpoint: Setpoint | None = None
    consecutive_misses: int = 0
    state: Health = Health.OK

    def step(self, sp: Setpoint | None, perception_ok: bool, battery_v: float) -> tuple[float, float, float]:
        if sp is None or sp.expired():
            self.consecutive_misses += 1
        else:
            self.consecutive_misses = 0
            self.last_setpoint = sp

        if self.consecutive_misses > 3 or not perception_ok or battery_v < 10.5:
            self.state = Health.FAULT
        elif self.consecutive_misses > 0 or battery_v < 11.0:
            self.state = Health.DEGRADED
        else:
            self.state = Health.OK

        if self.state is Health.FAULT:
            return (0.0, 0.0, 0.0)          # fail closed, always
        if self.state is Health.DEGRADED:
            return (sp.vx * 0.4, sp.vy * 0.4, sp.omega * 0.4)   # crawl home
        return (sp.vx, sp.vy, sp.omega)
`,
      note:
        'Version the contract, expire stale commands, degrade rather than stop when you can, and fail closed when you cannot. That single class is most of what separates a demo from a product.',
    },
    {
      kind: 'lab',
      labId: 'mycelium',
      title: 'Grow the living subsystem',
      brief:
        'Grow a hyphal network, inject nutrient and measure propagation delay to the electrode. This is the biological component of a capstone, with all of its slowness intact.',
      tasks: [
        'Grow a network with more than 200 nodes and record its total hyphal length',
        'Inject at three tips and compare the arrival times at the electrode',
        'State one measurement you would need before trusting this as a sensor',
      ],
    },
    {
      kind: 'lab',
      labId: 'bloch',
      title: 'The qubit, without the hype',
      brief:
        'Apply single-qubit gates and measure. Notice that everything here is a rotation, that measurement is probabilistic, and that a real device adds noise this simulator does not.',
      tasks: [
        'Prepare the equal superposition with H and measure 1000 shots',
        'Apply Z twice after H and show the state is unchanged',
        'Explain in one sentence why decoherence, not gate count, limits today machines',
      ],
    },
    {
      kind: 'callout',
      tone: 'quantum',
      title: 'The ethics of living machines',
      body:
        'If you build with organisms, four questions belong in the design review, not the appendix. **Consent and ownership**: who owns a substrate grown from community-sourced spawn? **Containment**: what stops your engineered organism leaving the bench, and how is that verified? **Reversibility**: can the device be terminated cleanly and composted, or does it persist? **Welfare**: at what point does a responsive biological system deserve consideration, and who decides? Bioreactors have biosafety levels for a reason, and "it is only a fungus" is not a risk assessment.',
    },
    {
      kind: 'steps',
      title: 'Capstone execution order',
      steps: [
        { title: 'Fix the requirements and the metric', detail: 'One primary success metric with units, plus constraints and a stated environment. Write the number you will report before you build.' },
        { title: 'Write the interface contracts', detail: 'Message schemas, units, rates, timeouts and failure semantics for every subsystem boundary. Freeze version 1.' },
        { title: 'Build stubs for everything', detail: 'A fake sensor, a fake planner, a fake actuator. The whole system runs end to end with fakes in week one.' },
        { title: 'Substitute real components one at a time', detail: 'Replace one stub, test the full loop, keep it only if the primary metric does not regress.' },
        { title: 'Instrument before you optimise', detail: 'Log the metric, the state and the faults continuously. An unmeasured system cannot be tuned.' },
        { title: 'Fault-inject on purpose', detail: 'Unplug sensors, drain the battery, block the path, corrupt a message. Record what happens and fix the fail-closed paths.' },
        { title: 'Measure, then write the limitations', detail: 'Report the metric with method and uncertainty, and list what you did not test. That section is what makes the rest credible.' },
      ],
    },
  ],
  keyTerms: [
    { term: 'Technology readiness level', definition: 'TRL 1 to 9, from basic principles to a proven operational system; a claim about evidence, not ambition.' },
    { term: 'Interface control document', definition: 'The frozen contract for a subsystem boundary: messages, units, rates, timeouts and failure semantics.' },
    { term: 'Engineered living material', definition: 'A material that contains living organisms performing a function, such as a mycelium composite or bacterial cellulose.' },
    { term: 'Decoherence', definition: 'Loss of quantum state to the environment; a qubit is only useful while coherence time greatly exceeds gate time.' },
    { term: 'NISQ', definition: 'Noisy intermediate-scale quantum: the current era of machines with high error rates and no full error correction.' },
    { term: 'Post-quantum cryptography', definition: 'Algorithms such as ML-KEM designed to resist attack by quantum computers; a current migration requirement for long-lived fleets.' },
    { term: 'NV-centre magnetometry', definition: 'Quantum magnetic sensing using nitrogen-vacancy defects in diamond, achieving nanotesla sensitivity at room temperature.' },
    { term: 'Big-bang integration', definition: 'Connecting all subsystems for the first time at the end of a project; the most reliable way to miss a deadline.' },
  ],
  quiz: [
    {
      id: 'w8l16q1',
      question: 'A team demonstrates a working prototype in a laboratory with non-final components. Which TRL is that?',
      choices: ['TRL 2', 'TRL 4', 'TRL 7', 'TRL 9'],
      answer: 1,
      explanation: 'TRL 4 is component and breadboard validation in a laboratory environment. TRL 6 requires a representative prototype in a relevant environment, and TRL 7 an operational prototype.',
      level: 'recall',
    },
    {
      id: 'w8l16q2',
      question: 'Which is the strongest reason to write interface contracts before building subsystems?',
      choices: [
        'It looks professional',
        'Both sides can be developed and tested independently against stubs, so integration failures surface early',
        'It removes the need for testing',
        'It fixes the schedule',
      ],
      answer: 1,
      explanation: 'Interfaces are where systems break. Freezing them early lets each subsystem be tested against a fake, converting a late integration risk into an early, cheap one.',
      level: 'understand',
    },
    {
      id: 'w8l16q3',
      question: 'Fungal mycelium is used as a sensor substrate. Which claim is supported by measurement?',
      choices: [
        'Mycelium communicates in a language',
        'Mycelium produces action-potential-like spikes of roughly 0.05 to 2 mV over seconds to minutes',
        'Mycelium stores digital information reliably',
        'Mycelium can be trained to classify images',
      ],
      answer: 1,
      explanation: 'Spike-like electrical activity in mycelium is measured and reported in the literature. Interpretation of those spikes as language, memory or computation is not established and must not be presented as engineering fact.',
      level: 'analyze',
    },
    {
      id: 'w8l16q4',
      question: 'Why is a superconducting qubit unsuitable as a real-time robot controller today?',
      choices: [
        'It is too fast',
        'Gate times are far longer than typical control periods, gate errors are high, and it needs millikelvin cooling',
        'It cannot be programmed',
        'It only works in simulation',
      ],
      answer: 1,
      explanation: 'Control loops need microsecond-scale determinism. Current qubit gate times, error rates and cryogenic infrastructure put quantum accelerators in a different regime entirely; classical microcontrollers remain the right tool.',
      level: 'analyze',
    },
    {
      id: 'w8l16q5',
      question: 'What is the correct present-day action for post-quantum security in a robot fleet?',
      choices: [
        'Wait until quantum computers break RSA',
        'Migrate key exchange to lattice-based post-quantum algorithms such as ML-KEM',
        'Reduce key length for speed',
        'Move all security to the cloud',
      ],
      answer: 1,
      explanation: 'Harvest-now-decrypt-later means long-lived systems are already exposed. Migration to post-quantum key encapsulation is a scheduled engineering task and requires no quantum hardware.',
      level: 'design',
    },
    {
      id: 'w8l16q6',
      question: 'An MMRTG produces 110 W electrical from roughly 2000 W thermal and masses 45 kg. What does this imply for a surface robot?',
      choices: [
        'It is an efficient way to power a small rover',
        'Conversion efficiency is only around 6%, so the technology is reserved for missions where mass, lifetime and sunlight availability justify it',
        'It outperforms solar on a small rover',
        'It can be built in a garage',
      ],
      answer: 1,
      explanation: 'About 5.5% conversion efficiency plus 45 kg of mass means RTGs suit long-duration, sun-poor, high-value missions. They also require nuclear licensing, so a garage build is both impractical and illegal.',
      level: 'apply',
    },
    {
      id: 'w8l16q7',
      question: 'Your capstone meets its primary metric but fails three of ten fault-injection tests. What is the most professional outcome?',
      choices: [
        'Report success and omit the fault tests',
        'Report the metric, report the three failures explicitly, and state the operational limits they imply',
        'Redefine the metric so the failures no longer count',
        'Retest until the failures do not appear',
      ],
      answer: 1,
      explanation: 'Credibility comes from the limitations section. Stating what fails and under which conditions is exactly the evidence a safety case and a future maintainer need, and it is worth more than an unqualified claim.',
      level: 'design',
    },
  ],
  flashcards: [
    { front: 'TRL 1 to 9 in one line each', back: '1 principles, 2 concept, 3 lab proof of critical function, 4 breadboard in lab, 5 relevant environment, 6 representative prototype in relevant environment, 7 operational prototype, 8 qualified system, 9 proven in operation.', tag: 'systems' },
    { front: 'Big-bang integration', back: 'Connecting all subsystems for the first time at the end of a project. Always replace with stubs plus incremental substitution.', tag: 'systems' },
    { front: 'Mycelium biocomposite reality check', back: 'Real material: 100 to 400 kg per cubic metre and roughly 0.1 to 1.2 MPa compressive, but highly dependent on substrate, spawn ratio, pressing and drying. Report your own spread.', tag: 'bio-hybrid' },
    { front: 'Fungal spike numbers', back: 'Action-potential-like spikes around 0.05 to 2 mV, seconds to minutes in duration, propagating at mm/s to cm/min. Measured; language and memory are not established.', tag: 'bio-hybrid' },
    { front: 'Why microbial fuel cells stay tiny', back: 'Power density around 10 to 200 mW per square metre of electrode. Enough for trickle-charged sensor nodes, never for actuators.', tag: 'energy' },
    { front: 'Quantum sensing versus computing', back: 'Sensing (NV centres, atomic clocks, atom interferometers, SQUIDs) is useful now at room or lab scale. Computing is noisy and intermediate-scale, with no robotics need today.', tag: 'quantum' },
    { front: 'Decoherence versus gate time', back: 'A qubit is useful only while coherence time far exceeds gate time. That ratio, not qubit count, explains most current limitations.', tag: 'quantum' },
    { front: 'Harvest now, decrypt later', back: 'Encrypted traffic captured today can be decrypted once quantum computers mature. Migrate long-lived fleets to post-quantum key encapsulation now.', tag: 'security' },
    { front: 'Four questions for living machines', back: 'Consent and ownership, containment and its verification, reversibility and end-of-life, and welfare. All belong in the design review, not the appendix.', tag: 'ethics' },
    { front: 'The test for any frontier claim', back: 'What is the measured number, what is the method, and what would break if the claim were false? No number means it is a story.', tag: 'rigour' },
  ],
  forgePrompts: [
    'Write a full capstone brief for a mycelium-chassis agricultural scout robot, including the interface contract between the living sensor and the flight controller.',
    'Build an honest benchmark that compares atmospheric, thermoelectric and photovoltaic harvesting for a 1 mW sensor node in your own climate, with measured data.',
    'Design a post-quantum telemetry link for a robot fleet and measure the overhead of ML-KEM key exchange on an ESP32 against the classical baseline.',
  ],
};
