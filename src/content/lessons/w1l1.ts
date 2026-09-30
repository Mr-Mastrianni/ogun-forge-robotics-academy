import type { Lesson } from '../types';

export const lesson: Lesson = {
  id: 'w1l1',
  number: 1,
  week: 1,
  track: 'foundations',
  title: 'What a Robot Actually Is',
  subtitle: 'Sense, plan, act — and the Afrocentric lineage of the machine',
  duration: 55,
  difficulty: 'seedling',
  xp: 140,
  hook: 'A robot is not a metal human. It is a loop that closes — and that loop is older than the word.',
  objectives: [
    'Describe any robot as a sense, plan, act loop and tell closed loop from open loop.',
    'Place a machine on the SAE 0-5 and Sheridan 10-level autonomy scales with reasons.',
    'Name the seven common robot families and one real platform in each.',
    'Trace mechanism from Ogun, Kemet and Nok through Haya steel to al-Jazari.',
    'Choose a robot from payload, reach, repeatability, cycle time, duty cycle and MTBF.',
  ],
  blocks: [
    { kind: 'prose', heading: 'The loop is the machine',
      body: 'Strip the chrome and every robot runs one three-beat cycle: **sense** (measure the world), **plan** (choose a command), **act** (push energy into the world), then sense again. Cut the loop anywhere and what is left is a machine, not a robot.\n\n' +
        'A washing machine runs an open-loop 40 min timer no matter how dirty the clothes are. A line follower reads a reflectance sensor at 1 kHz and steers on the error — 1,000 corrections per second. The difference is **error**: an open-loop system takes whatever physics delivers, a closed-loop system measures its own error and spends energy to shrink it.' },
    { kind: 'formula', title: 'Closed-loop error and the PID law',
      tex: 'e(t) = r(t) - y(t), \\qquad u(t) = K_p\\,e(t) + K_i\\int_0^{t} e(\\tau)\\,d\\tau + K_d\\,\\frac{de(t)}{dt}',
      explain: 'Error is what you asked for minus what you measured; the controller turns that error into energy. Set K_i = K_d = 0 and you have an open loop wearing a sensor.' },
    { kind: 'prose', heading: 'Autonomy is a dial with two scales',
      body: 'Autonomy is a dial, not a switch. **SAE J3016** scores road vehicles 0-5: L0 none, L1 assists steering *or* speed, L2 does both while the driver supervises, L3 drives but demands a fallback driver, L4 needs no fallback inside a defined ODD, L5 needs none anywhere.\n\n' +
        'The **Sheridan and Verplank 10-level scale** (1978) scores any human-machine team: L1 the human does everything, L4 the computer suggests one option, L6 it acts unless vetoed inside a time window, L10 it decides and acts, ignoring the human. A Mars rover sits near Sheridan 7: it plans roughly 200 m of AutoNav per sol because round-trip light time is 6-44 minutes.' },
    { kind: 'table', title: 'Automaton, teleoperation, robot',
      caption: 'Only the last two rows sense their own state and feed it back automatically.',
      columns: ['System', 'Senses', 'Plans', 'Acts', 'Closed loop?', 'Autonomy'],
      rows: [
        ['Wind-up toy', 'No', 'No (spring + cam)', 'Yes', 'No', 'Automaton'],
        ['Shaduf (c. 1500 BCE)', 'No', 'Human', 'Yes', 'No', 'Teleoperation'],
        ['RC excavator', 'Camera, human eyes', 'Human off-board', 'Yes', 'Human closes it', 'Teleoperation'],
        ['Line follower', 'IR reflectance, 1 kHz', 'Onboard, 50 Hz', 'Yes', 'Yes', 'Sheridan 3-4'],
        ['Waymo Driver', 'LiDAR + camera + radar', 'Onboard, real time', 'Yes', 'Yes', 'SAE 4 inside ODD'],
      ] },
    { kind: 'table', title: 'Seven robot families, one real platform each',
      caption: 'Families are defined by their mobility and their compliance, not by their software.',
      columns: ['Family', 'Example', 'DOF', 'Payload', 'Repeatability', 'Typical job'],
      rows: [
        ['Manipulator', 'Universal Robots UR5e', '6 revolute', '5 kg', '±0.03 mm', 'Welding, pick-and-place'],
        ['Mobile (AMR)', 'OTTO 1500', '3 (x, y, θ)', '1,500 kg', '±10 mm (SLAM)', 'Warehouse transport'],
        ['Legged', 'Boston Dynamics Spot', '12 (4 legs × 3)', '14 kg', '±20 mm (visual odom.)', 'Stairs, plant inspection'],
        ['Aerial', 'DJI Matrice 350 RTK', '6 (4 rotors)', '2.7 kg', '±0.1 m (RTK)', 'Survey, inspection'],
        ['Soft', 'Festo BionicSoftHand', '5 pneumatic fingers', 'not rated', 'not specified — compliance instead', 'Delicate produce'],
        ['Swarm', 'Kilobot, 1,024-unit demo', '2 vibration motors', '~10 g each', 'no onboard odometry', 'Coverage, self-assembly'],
        ['Modular', 'M-TRAN III', '2 per module', 'not rated', 'not specified', 'Self-reconfiguration research'],
      ] },
    { kind: 'chart', title: 'Repeatability by payload class',
      caption: 'ISO 9283 pose repeatability, datasheet values. Precision falls as the payload class grows.',
      chartType: 'bar', xLabel: 'Industrial arm (rated payload)', yLabel: 'Pose repeatability (± mm)',
      x: ['UR5e (5 kg)', 'KR 6 R900 (6 kg)', 'M-10iD/12 (12 kg)', 'UR10e (12.5 kg)', 'IRB 6700-235 (235 kg)'],
      series: [{ key: 'rep', label: 'Pose repeatability', color: '#f59e0b', data: [0.03, 0.03, 0.02, 0.05, 0.05] }] },
    { kind: 'prose', heading: 'The specifications that decide the job',
      body: 'Six numbers pick the machine. **Payload**: mass carried at full speed (UR5e, 5 kg). **Reach**: base to wrist centre (UR5e, 850 mm). **Repeatability**: ISO 9283 spread when returning to one taught point (UR5e ±0.03 mm; ABB IRB 6700-235/2.65 stays within ±0.05 mm while carrying 235 kg). **Cycle time**: seconds per pick-and-place (SCARA class, 0.3-0.5 s for a 300 mm move). **Duty cycle**: on-time fraction a motor holds thermally (25% at 2 A for a cheap gearmotor, 100% for a continuous-rated servo). **MTBF**: mean hours between failures, commonly quoted at 50,000-100,000 h for industrial arms — and the reducer usually fails before the motor.\n\n' +
        'Families matter because these numbers move together: a manipulator trades reach for repeatability, a legged platform trades payload for terrain, a swarm trades per-unit precision for coverage.' },
    { kind: 'steps', title: 'Characterize any robot in six measurements',
      steps: [
        { title: 'Payload', detail: 'Hang mass until rated speed and repeatability can no longer be held; that mass is the real payload.' },
        { title: 'Reach', detail: 'Log the maximum radial distance to the wrist centre, not to the tool tip.' },
        { title: 'Repeatability', detail: 'Command one point 30 times, record the ISO 9283 spread, then repeat with full payload.' },
        { title: 'Cycle time', detail: 'Time 100 pick-and-place cycles at spec speed; report mean and 95th percentile, never the best run.' },
        { title: 'Duty cycle', detail: 'Run at rated current and log winding temperature until it reaches thermal steady state.' },
        { title: 'MTBF', detail: 'Ask for field return data; a datasheet figure is a design target, not a measurement.' },
      ] },
    { kind: 'code', title: 'Smallest honest closed loop (1-DOF, 1 kHz)', language: 'cpp',
      note: 'Derivative on measurement, not on error, so a setpoint step does not kick the output. Replace the plant line with your encoder read.',
      code: `#include <algorithm>
#include <cstdio>
// g++ -std=c++17 loop.cpp && ./a.out   plant: 0.02 mm per PWM count
int main() {
  const double dt = 0.001, sp = 300.0, Kp = 30, Ki = 400, Kd = 0.4;
  double y = 0, I = 0, yprev = 0;
  for (int t = 0; t < 400; ++t) {
    double e = sp - y;                                    // sense
    I = std::clamp(I + e * dt, -1.0, 1.0);                // plan, anti-windup
    double u = std::clamp(Kp * e + Ki * I - Kd * (y - yprev) / dt, -255.0, 255.0);
    y += 0.02 * u;                                        // act on the plant
    yprev = y;
    if (t % 100 == 0) std::printf("t=%3d ms  y=%7.2f mm  pwm=%6.1f\\n", t, y, u);
  }
}` },
    { kind: 'prose', heading: 'The lineage of mechanism',
      body: 'Mechanism is far older than the word robot (Karel Čapek, 1920, from *robota*, forced labour). In Yoruba practice **Ọ̀gún** is the orisha of iron, tools and roads, saluted before a smith strikes. Kemet cut the outflow **water clock** (tomb of Amenhotep I, c. 1500 BCE) to hold a constant head for timekeeping, and built the **shaduf**, a 2:1 lever with a counterweight drawn in New Kingdom tomb reliefs (c. 1500-1300 BCE). A 4 L bucket at 10 strokes/min moves about 2.4 m³/h, and the counterweight removes most of the lift force — a gravity-compensated manipulator with a human as controller.\n\n' +
        '**Nok** terracotta culture (central Nigeria, c. 1500 BCE-500 CE) sits beside the earliest sub-Saharan iron smelting: Taruga furnace dates cluster near 500 BCE, while newer radiocarbon work argues for mid-second-millennium BCE smelting — still contested. In Tanzania, Haya smiths ran forced-draught furnaces with preheated tuyère air, reported at 1500-2000 °C, hot enough for carbon steel. For context, al-Jazari (d. 1206) built camshaft-driven drummer automata whose pegged drums were a reprogrammable sequence controller — the logic a PLC later replaced.' },
    { kind: 'callout', tone: 'insight', title: 'Intelligence is a spectrum, not a switch',
      body: 'A $35 Roomba owns one reflex (bump, turn) and no map. A Waymo Driver is SAE L4 inside a mapped geofence and simply refuses to drive outside it. Perseverance plans its own 20 m traverse because nobody can joystick it from 225 million km. Three machines, one word, three control stacks — score a robot by which decisions it owns and what happens when it owns them wrongly.' },
    { kind: 'lab', labId: 'robot-arm', title: 'Wake the arm',
      brief: 'Drive a 6-DOF arm in the sim and measure what it can reach, what it cannot, and what payload costs you.',
      tasks: ['Command the end effector onto the glowing target and hold it inside ±2 mm.', 'Find a pose the arm cannot reach and record whether a joint limit or a singularity blocked it.', 'Add 5 kg of payload and log how far the return point drifts over 30 repeats.'] },
  ],
  keyTerms: [
    { term: 'End effector', definition: 'The tool at the far end of the kinematic chain: gripper, welder, camera.' },
    { term: 'Degree of freedom (DOF)', definition: 'One independent joint motion; 6 DOF lets a rigid body reach any pose in 3D space.' },
    { term: 'Closed loop', definition: 'A cycle where measured output feeds back and changes the next command.' },
    { term: 'Pose repeatability', definition: 'ISO 9283 spread of returning to the same taught point, quoted as ± mm.' },
    { term: 'Duty cycle', definition: 'Fraction of time a motor can run at a given current without exceeding thermal limits.' },
    { term: 'MTBF', definition: 'Mean time between failures, in hours; a reliability estimate, not a guarantee.' },
    { term: 'Teleoperation', definition: 'A human closes the loop remotely; the machine supplies actuation, not judgement.' },
    { term: 'ODD', definition: 'Operational design domain: the roads, weather and speeds where autonomy is claimed valid.' },
  ],
  quiz: [
    { id: 'w1l1q1', question: 'Which system is genuinely closed-loop?',
      choices: ['Wind-up toy', 'RC car', 'Line-following robot', 'Hand-cranked winch'], answer: 2, level: 'recall',
      explanation: 'Only the line follower senses its own state and feeds the error back into the command.' },
    { id: 'w1l1q2', question: 'On the Sheridan and Verplank 10-level scale, level 10 means the computer...',
      choices: ['does the task only after asking permission', 'suggests a ranked list of options', 'acts automatically but must inform the human afterwards', 'decides everything and acts, ignoring the human'], answer: 3, level: 'understand',
      explanation: 'Level 10 is full autonomy with the human out of the loop; levels 7-9 still report back in some form.' },
    { id: 'w1l1q3', question: 'You command x = 300.00 mm 30 times. The arm settles at 300.04 mm every time, with ±0.01 mm spread. The ±0.01 mm is the...',
      choices: ['accuracy', 'repeatability', 'resolution', 'duty cycle'], answer: 1, level: 'apply',
      explanation: 'Repeatability is the spread of the returns; the 0.04 mm offset from the command is accuracy error.' },
    { id: 'w1l1q4', question: 'A 2,300 kg-payload arm is asked to place a 0.5 kg sensor at ±0.1 mm. Why does this usually fail?',
      choices: ['The repeatability class of a very large arm is worse than 0.1 mm', 'The sensor is too light to trip the payload sensing', 'Large arms can only be run open loop', 'Its MTBF is too low for slow moves'], answer: 0, level: 'analyze',
      explanation: 'Heavy arms trade precision for capacity: the 235 kg class already sits at ±0.05 mm, and 2,300 kg arms are worse.' },
    { id: 'w1l1q5', question: 'Which of these is a reprogrammable sequence machine rather than a fixed mechanism?',
      choices: ['Shaduf', 'Karnak water clock', 'al-Jazari camshaft-driven drummer band', 'Nok terracotta figure'], answer: 2, level: 'recall',
      explanation: 'Pegs repositioned on al-Jazari drums changed the played sequence — stored program logic in brass, 1206 CE.' },
    { id: 'w1l1q6', question: 'You must field a driverless shuttle that carries passengers with no fallback driver, but only on a mapped 60 km² route. What do you define first?',
      choices: ['Motor Kv', 'PID gains', 'The ODD', 'Gearbox ratio'], answer: 2, level: 'design',
      explanation: 'SAE L4 with no fallback is only claimable inside a stated operational design domain; everything else follows it.' },
    { id: 'w1l1q7', question: 'A 24 V gearmotor is rated 25% duty at 2 A. The cell needs 1.5 A continuously for 16 h/day. Best fix?',
      choices: ['Run it as-is; 25% applies only at stall', 'Raise the supply to 48 V', 'Raise Kp to stiffen the loop', 'Specify a motor whose 100% duty rating covers 1.5 A'], answer: 3, level: 'apply',
      explanation: 'Duty cycle is thermal, not electrical: continuous service needs a motor rated continuous at that current.' },
  ],
  flashcards: [
    { front: 'Sense, plan, act', back: 'The three-beat cycle every robot closes; remove any beat and it is just a machine.', tag: 'core' },
    { front: 'Closed loop', back: 'Measured output returns and changes the next command — error is actively reduced.', tag: 'core' },
    { front: 'SAE J3016', back: 'Road-vehicle autonomy 0-5; L4 needs no fallback inside an ODD, L5 needs none anywhere.', tag: 'autonomy' },
    { front: 'Sheridan 10 levels', back: '1978 human-machine scale from L1 human does all to L10 computer ignores the human.', tag: 'autonomy' },
    { front: 'Pose repeatability', back: 'ISO 9283 spread when returning to one taught point; UR5e is ±0.03 mm.', tag: 'specs' },
    { front: 'Duty cycle', back: 'Thermal on-time budget at a given current — 25% for a cheap gearmotor, 100% if rated continuous.', tag: 'specs' },
    { front: 'MTBF', back: 'Mean hours between failures; 50,000-100,000 h is typical for industrial arms.', tag: 'specs' },
    { front: 'Ọ̀gún', back: 'Yoruba orisha of iron, tools and roads, saluted before smiths work the metal.', tag: 'heritage' },
    { front: 'Haya furnaces', back: 'Tanzanian forced-draught smelting with preheated tuyère air, reported at 1500-2000 °C.', tag: 'heritage' },
  ],
  forgePrompts: [
    'Build a shaduf from a 1 m beam and a 4 L bucket, then measure how little force the counterweight leaves you.',
    'Close the loop on a DC gearmotor with one VL53L1X time-of-flight sensor and log the overshoot at three Kp values.',
    'Keep a one-day log of your own Sheridan level: when did you let a machine decide, and what did that decision cost?',
  ],
};
