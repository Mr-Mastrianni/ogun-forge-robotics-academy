import type { Lesson } from '../types';

export const lesson: Lesson = {
  id: 'w7l14',
  number: 14,
  week: 7,
  track: 'systems',
  difficulty: 'master',
  title: 'Safety, Standards, Ethics and Human Factors',
  subtitle: 'The engineering that exists to prevent the worst day',
  duration: 80,
  xp: 215,
  hook: 'Nobody becomes an engineer in order to write a risk assessment. That document is the reason the machine can be switched on at all.',
  objectives: [
    'Run a risk assessment and apply the ISO 12100 risk reduction hierarchy.',
    'Map a design onto ISO 10218, ISO/TS 15066, ISO 13849 and IEC 61508 requirements.',
    'Compute stopping distance and specify safeguarding for a real cell.',
    'Reason about human factors, dual use and the ethics of autonomous and living machines.',
  ],
  blocks: [
    {
      kind: 'prose',
      heading: 'Risk reduction has an order, and the order matters',
      body:
        'ISO 12100 defines the process: identify hazards, estimate risk as severity times probability of occurrence times possibility of avoidance, then reduce. The reduction hierarchy is not a menu — you work down it:\n\n' +
        '1. **Inherently safe design.** Remove the hazard. Reduce force, reduce speed, remove the pinch point, limit energy. Nothing else you do will be as effective.\n' +
        '2. **Safeguarding and protective measures.** Guards, light curtains, safety-rated monitored stop, force and pressure limiting.\n' +
        '3. **Information for use.** Warnings, training, procedures, markings.\n\n' +
        'The reason warnings sit last is that they depend on a human behaving correctly under time pressure, which is the least reliable component in the entire system. A design whose safety case rests on a warning label has already failed at steps one and two.',
    },
    {
      kind: 'formula',
      title: 'Stopping distance for a collaborative cell',
      tex: 'S = v\\,(t_r + t_s) + \\frac{v^2}{2 a}, \\qquad S_{min} = S + C + Z_d + Z_r',
      explain:
        'Total stopping distance is the distance travelled during the reaction and control-response times plus the braking distance. ISO/TS 15066 then adds the human approach contribution, a measurement tolerance and a robot position tolerance to get the protective separation distance. Doubling speed quadruples the braking term — which is why speed limiting is such a powerful safety control.',
    },
    {
      kind: 'chart',
      title: 'Protective separation distance vs speed for a 20 kg payload cobot',
      xLabel: 'TCP speed (m/s)',
      yLabel: 'minimum separation (mm)',
      chartType: 'line',
      x: [0.1, 0.25, 0.5, 0.75, 1.0, 1.5, 2.0],
      series: [
        { key: 'stop', label: 'required separation (mm)', color: '#ff6b1a', data: [110, 165, 275, 400, 540, 880, 1290] },
        { key: 'human', label: 'human approach distance (mm)', color: '#67e8f9', data: [80, 170, 320, 460, 600, 880, 1160] },
      ],
      caption:
        'Assumes a 20 kg payload, reaction plus response time of 150 ms, deceleration of 5 m/s squared and a 1.6 m/s human walking speed. At 2 m/s the cell needs well over a metre of clearance, which is precisely why practical cobot cells run slow.',
    },
    {
      kind: 'table',
      title: 'Standards map for a robot project',
      columns: ['Standard', 'Scope', 'Applies to', 'Key requirement', 'What you must produce'],
      rows: [
        ['ISO 12100', 'Risk assessment methodology', 'Every machine', 'Hazard identification and the three-step reduction hierarchy', 'A risk assessment file with residual risks listed'],
        ['ISO 10218-1 / -2', 'Industrial robot safety', 'Robot and integration', 'Safety-rated functions, e-stop, limiting spaces, verification', 'Cell layout review and functional test records'],
        ['ISO/TS 15066', 'Collaborative operation', 'Cobot cells', 'One of four collaboration modes plus biomechanical force and pressure limits', 'Force and pressure measurements at contact points'],
        ['ISO 13849-1', 'Safety-related control systems', 'Safety functions', 'Performance level PL a to e from category, MTTFd and diagnostic coverage', 'PL calculation per safety function'],
        ['IEC 61508 / 62061', 'Functional safety', 'Electrical and electronic systems', 'SIL 1 to 4 with hardware fault tolerance and systematic capability', 'Safety requirements specification and verification'],
        ['IEC 60204-1', 'Electrical equipment of machines', 'Power and control', 'Stop categories 0, 1 and 2, emergency stop as a complementary protective measure', 'Stop category declaration and wiring diagram'],
        ['ISO 3691-4', 'Driverless industrial trucks', 'AMRs and AGVs', 'Speed, braking, personnel detection and clearance requirements', 'Braking distance test on the actual floor'],
        ['ISO 21448 (SOTIF)', 'Safety of the intended functionality', 'Autonomy and AI', 'Handle performance limitations and triggering conditions, not just failures', 'Scenario analysis and residual risk argument'],
        ['UL 4600', 'Autonomous products', 'Fully autonomous systems', 'Safety case with a claim, argument and evidence structure', 'A written safety case, not just a test report'],
        ['ISO 9283', 'Robot performance criteria', 'Manipulators', 'Defined pose accuracy, repeatability and path tests', 'Measurement protocol and results'],
      ],
      insight:
        'You do not need to memorise clause numbers to be safe. You do need to know which standard governs your product, what evidence it demands, and that the evidence is measurements on the actual machine rather than a table from a datasheet.',
      caption: 'Always verify the current edition and any regional deviations before applying a standard in production.',
    },
    {
      kind: 'prose',
      heading: 'Human factors: the failure mode with a pulse',
      body:
        'Most industrial accidents are not caused by a robot doing something unexpected in isolation. They happen at the boundary where a human and an automated system share a task, and they are predictable:\n\n' +
        '- **Automation complacency** — an operator who has watched the machine work correctly for 400 cycles stops checking by cycle 401.\n' +
        '- **Alarm fatigue** — if nuisance alarms fire hourly, the real one gets silenced like all the rest.\n' +
        '- **Trust miscalibration** — over-trust in an autonomous feature produces inattention; under-trust produces bypassed safeguards.\n' +
        '- **Mode confusion** — the operator believes the robot is in teach mode when it is in run mode. Mode indication is a safety function.\n' +
        '- **Teleoperation latency** — above roughly 200 ms round trip, telepresence degrades and operators over-correct; above a second, they adopt move-and-wait strategies.\n\n' +
        'Accessible, universal design is not a separate topic: heavier emergency stops, clear colour contrast and voice-plus-visual feedback are safety controls that also make the machine usable by more people.',
    },
    {
      kind: 'code',
      title: 'A latched safety supervisor, deliberately outside the behaviour tree',
      language: 'cpp',
      code: `// Safety supervisor: highest-priority task, no dynamic allocation, fails closed.
enum Fault { F_BRAKE, F_ESTOP, F_GEOFENCE, F_WATCHDOG, F_HUMAN_PROXIMITY, F_COUNT };
static volatile uint32_t fault_bits = 0;

// Safety-rated inputs are read every cycle and must all agree before motion is allowed.
static bool permits_motion() {
  return estop_channel_a_closed() && estop_channel_b_closed() &&   // dual channel
         guard_closed() && light_curtain_clear() &&
         !fault_bits;                                             // never auto-cleared
}

static void enter_safe_state() {
  motor_set(0.0f);
  brake_engage();
  watchdog_stop();               // stop kicking the dog: reset is deliberate
  announce(F_FAULT_TRANSMITTED);
}

void safetyTask(void*) {
  for (;;) {
    if (!dual_channel_consistent()) fault_bits |= (1u << F_ESTOP);
    if (read_distance_to_human() < SPEED_DEPENDENT_MIN()) fault_bits |= (1u << F_HUMAN_PROXIMITY);
    if (outside_geofence()) fault_bits |= (1u << F_GEOFENCE);
    if (!control_loop_alive()) fault_bits |= (1u << F_WATCHDOG);   // police the loop, do not trust it

    if (fault_bits) enter_safe_state();
    else { watchdog_kick(); motion_enable(true); }
    vTaskDelay(pdMS_TO_TICKS(2));    // 500 Hz supervisor, independent of the control loop
  }
}

// Cleared only by an explicit, logged human action at the machine after the hazard is gone.
void fault_reset_requires_operator() {
  if (physical_reset_pressed() && hazard_absent()) { fault_bits = 0; log_event("fault reset"); }
}`,
      note:
        'The reset is manual and logged. Automatic recovery from a safety fault is how a machine hurts the same person twice.',
    },
    {
      kind: 'lab',
      labId: 'pid-drone',
      title: 'Speed is a safety control',
      brief:
        'Reduce the maximum acceleration limit and observe how much slower the controller must be to remain stable — the same trade a cobot makes when it enters collaborative mode.',
      tasks: [
        'Tune for fast settling at full acceleration authority',
        'Halve the acceleration limit and re-tune, recording the new settling time',
        'State the safety argument for limiting speed near a human, in two sentences',
      ],
    },
    {
      kind: 'lab',
      labId: 'swarm',
      title: 'Emergent behaviour and verification',
      brief:
        'Ninety agents with local rules create global patterns. Now imagine certifying that system: you cannot test every trajectory, so you must reason about invariants.',
      tasks: [
        'Produce a stable polarised flock and record the order parameter',
        'Enable predator mode and watch the formation break, then recover',
        'Identify one invariant you could actually prove about this system',
      ],
    },
    {
      kind: 'callout',
      tone: 'warning',
      title: 'Ethics is a design input, not a paragraph at the end',
      body:
        'Dual use: the same perception stack that guides a surgical robot can guide a weapon. Meaningful human control is the standard most defence-ethics frameworks converge on, and it is an architecture decision about where the human sits in the loop. Labour: automation is a productivity story for the buyer and a livelihood story for the operator — reskilling budget belongs in the project plan. Data: fleet telemetry often contains identifiable workers, which makes consent and retention a real engineering requirement. Bias: a perception model trained mostly on one skin tone or one lighting condition has a measurable, reportable failure rate that you are obliged to characterise before deployment.',
    },
    {
      kind: 'steps',
      title: 'Building a safety case you can defend',
      steps: [
        { title: 'Scope the machine and its limits', detail: 'Intended use, foreseeable misuse, operating environment, lifespan and who is exposed.' },
        { title: 'Identify hazards systematically', detail: 'Walk the energy sources: mechanical, electrical, thermal, chemical, radiation, software and human interaction. Use a checklist plus a physical walkthrough.' },
        { title: 'Estimate and reduce in order', detail: 'Apply inherent design first, then safeguarding, then information for use, and record the residual risk after each step.' },
        { title: 'Specify safety functions with integrity', detail: 'For each function state the required PL or SIL and show the calculation (category, MTTFd, diagnostic coverage, common cause).' },
        { title: 'Verify by measurement', detail: 'Measure stopping time and distance, contact forces and pressures, detection zones and braking performance on the real machine.' },
        { title: 'Write the safety case', detail: 'Claim, argument, evidence. Include FMEA and fault tree results, validation records and the residual risk statement.' },
        { title: 'Plan for change', detail: 'Any modification invalidates the assessment. Put change control, incident reporting, postmortems and periodic revalidation in the process, not in someone memory.' },
      ],
    },
  ],
  keyTerms: [
    { term: 'Risk reduction hierarchy', definition: 'ISO 12100 order: inherently safe design, then safeguarding, then information for use.' },
    { term: 'ISO/TS 15066', definition: 'Technical specification for collaborative robot operation, defining four collaboration modes and biomechanical force and pressure limits.' },
    { term: 'Protective separation distance', definition: 'Minimum distance a human may approach before the robot must have stopped, comprising stopping distance plus human approach and tolerances.' },
    { term: 'Performance level (PL)', definition: 'ISO 13849-1 rating a to e for a safety function, derived from category, MTTFd, diagnostic coverage and common cause failure.' },
    { term: 'Safety integrity level (SIL)', definition: 'IEC 61508 target failure measure from 1 to 4 for a safety function, with hardware fault tolerance and systematic capability requirements.' },
    { term: 'Stop category 0, 1 and 2', definition: 'IEC 60204-1: immediate removal of power, controlled stop then removal of power, or controlled stop with power maintained.' },
    { term: 'SOTIF', definition: 'ISO 21448, safety of the intended functionality: addressing hazards from performance limitations and triggering conditions rather than from failures.' },
    { term: 'Meaningful human control', definition: 'The principle that a human must retain genuine, informed authority over lethal or high-consequence autonomous action.' },
  ],
  quiz: [
    {
      id: 'w7l14q1',
      question: 'According to ISO 12100, which risk reduction measure comes first?',
      choices: ['Warning labels', 'Training', 'Inherently safe design', 'Light curtains'],
      answer: 2,
      explanation: 'Eliminate or reduce the hazard by design before adding protective measures, and treat information for use as the last resort because it depends on human behaviour.',
      level: 'recall',
    },
    {
      id: 'w7l14q2',
      question: 'A robot moves at 1.0 m/s, reaction plus response time is 0.15 s and deceleration is 5 m/s squared. What is the stopping distance approximately?',
      choices: ['0.10 m', '0.25 m', '0.50 m', '1.00 m'],
      answer: 1,
      explanation: 'Reaction distance is 1.0 x 0.15 = 0.15 m; braking distance is 1.0 squared / (2 x 5) = 0.10 m; total about 0.25 m before adding human approach and tolerances.',
      level: 'apply',
    },
    {
      id: 'w7l14q3',
      question: 'Which ISO/TS 15066 collaboration mode uses a safety-rated monitored stop while the human is inside the collaborative space?',
      choices: ['Hand guiding', 'Speed and separation monitoring', 'Safety-rated monitored stop', 'Power and force limiting'],
      answer: 2,
      explanation: 'In safety-rated monitored stop the robot halts and stays halted, with the stop itself monitored by a safety-rated function, until the human leaves and a resume condition is met.',
      level: 'understand',
    },
    {
      id: 'w7l14q4',
      question: 'Why must an emergency stop circuit not depend on the general-purpose control software?',
      choices: [
        'It would be slower to program',
        'Because that software can be in an arbitrary state, including wedged, and safety must remain effective',
        'Because software resets are expensive',
        'Because standards forbid all software in safety',
      ],
      answer: 1,
      explanation: 'Safety functions may use software, but only software developed and rated for the required PL or SIL, with architecture preventing a single fault from defeating the function.',
      level: 'analyze',
    },
    {
      id: 'w7l14q5',
      question: 'An operator has monitored 400 correct cycles and stops checking. Which phenomenon is this?',
      choices: ['Alarm fatigue', 'Automation complacency', 'Mode confusion', 'Vigilance decrement only'],
      answer: 1,
      explanation: 'Complacency is over-reliance on the automated system after a history of reliable performance. The countermeasures are varied task demands, forcing functions and periodic verification rather than more warnings.',
      level: 'understand',
    },
    {
      id: 'w7l14q6',
      question: 'A perception model performs well in testing but fails more often on darker skin tones in bright sunlight. What is the correct engineering response?',
      choices: [
        'Deploy and monitor',
        'Characterise the failure rate across the affected population, treat it as a safety-relevant performance limitation under SOTIF, and mitigate before deployment',
        'Add a warning label',
        'Lower the confidence threshold',
      ],
      answer: 1,
      explanation: 'This is a known performance limitation with unequal consequences, not a random failure. It must be measured per subgroup, treated as a triggering condition, and mitigated with sensor diversity, targeted data or operational limits.',
      level: 'design',
    },
    {
      id: 'w7l14q7',
      question: 'Which artefact does UL 4600 require that a test report does not provide?',
      choices: [
        'A bill of materials',
        'A structured safety case with claims, arguments and evidence, including handling of residual risk',
        'A CE mark',
        'A firmware checksum',
      ],
      answer: 1,
      explanation: 'UL 4600 is about the argument, not just the tests. It requires a defensible structure connecting claims about safety to the evidence, and explicit treatment of what remains unproven.',
      level: 'analyze',
    },
  ],
  flashcards: [
    { front: 'ISO 12100 reduction order', back: 'Inherently safe design, then safeguarding and protective measures, then information for use. Warnings are last because they depend on human behaviour.', tag: 'safety' },
    { front: 'Protective separation distance', back: 'Stopping distance plus human approach distance plus measurement and position tolerances; the minimum gap before the robot must be stopped.', tag: 'safety' },
    { front: 'Four ISO/TS 15066 collaboration modes', back: 'Safety-rated monitored stop, hand guiding, speed and separation monitoring, power and force limiting.', tag: 'cobot' },
    { front: 'PL versus SIL', back: 'PL a to e comes from ISO 13849 (category, MTTFd, DC, CCF); SIL 1 to 4 comes from IEC 61508/62061 with hardware fault tolerance and systematic capability.', tag: 'functional-safety' },
    { front: 'IEC 60204-1 stop categories', back: 'Category 0: immediate power removal. Category 1: controlled stop then power removal. Category 2: controlled stop with power maintained.', tag: 'safety' },
    { front: 'SOTIF', back: 'ISO 21448: safety of the intended functionality, covering hazards from performance limits and triggering conditions rather than from failures.', tag: 'autonomy' },
    { front: 'Automation complacency', back: 'Reduced monitoring after sustained reliable automation performance. Counter with varied demands and forcing functions, not more alarms.', tag: 'human-factors' },
    { front: 'Meaningful human control', back: 'A human must retain genuine informed authority over high-consequence autonomous action; an architecture decision, not a policy statement.', tag: 'ethics' },
    { front: 'Why should fault reset be manual?', back: 'Automatic recovery means the machine can hurt the same person twice. Reset must require a deliberate logged action after the hazard is confirmed absent.', tag: 'safety' },
  ],
  forgePrompts: [
    'Write a full ISO 12100 risk assessment for a mycelium-monitoring agricultural robot and identify which hazards cannot be designed out.',
    'Measure contact force and pressure for a soft robotic gripper against ISO/TS 15066 limits and publish the contact-point map.',
    'Design a consent and retention policy for oral-history data collected by a community archivist robot, and implement it as an enforceable schema.',
  ],
};
