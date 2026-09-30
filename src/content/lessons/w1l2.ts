import type { Lesson } from '../types';

export const lesson: Lesson = {
  id: 'w1l2',
  number: 2,
  week: 1,
  track: 'foundations',
  difficulty: 'seedling',
  title: 'Anatomy of a Robot: Links, Joints and Degrees of Freedom',
  subtitle: 'Rigid bodies, mobility, workspace and the tools at the end of the chain',
  duration: 60,
  xp: 150,
  hook: 'A robot is a chain of rigid bodies joined by joints. Count the joints and you have counted its freedom.',
  objectives: [
    'Name the standard joint types and count the degrees of freedom each contributes.',
    'Apply the Grubler-Kutzbach mobility criterion to planar and spatial mechanisms.',
    'Compare serial, parallel and hybrid architectures on stiffness, workspace and payload.',
    'Choose an end effector and an actuation scheme for a stated task.',
  ],
  blocks: [
    {
      kind: 'prose',
      heading: 'Rigid bodies, frames, and degrees of freedom',
      body:
        'A robot is modelled as **rigid bodies** (links) joined by **joints**. A rigid body cannot stretch or bend: the distance between any two of its points is fixed, so its whole geometry lives in one **frame** — an origin plus three axes bolted to the body. Forward kinematics is the bookkeeping that walks frames from base to tool.\n\n' +
        'A **degree of freedom (DOF)** is one independently commanded coordinate. A free rigid body in a plane has 3: $x$, $y$, $\\theta$. In space it has 6: three translations plus roll, pitch and yaw. Every joint is a *constraint* that removes freedoms; what survives is the mechanism\'s **mobility**.\n\n' +
        'Real links are not perfectly rigid. A 1 m cantilever of 25 mm OD x 2 mm wall 6061-T6 tube ($I = 9.63\\times10^{-9}\\,\\text{m}^4$, $E = 68.9\\,\\text{GPa}$) deflects $\\delta = FL^3/3EI \\approx 5\\,\\text{mm}$ under a 10 N tip load. That lands directly on tool position, so stiffness is a design variable, not an assumption.',
    },
    {
      kind: 'prose',
      heading: 'The joint alphabet',
      body:
        'Joints are classified by the freedoms they leave. A **revolute (R)** joint is one rotation about a fixed axis: an industrial axis turns ±170°, a UR5e axis turns ±360°. A **prismatic (P)** joint is one translation along an axis — 0–100 mm on a ball-screw stage. A **helical (H)** joint couples the two: one turn advances the nut by the lead, so a 5 mm lead screw moves 5 mm per 360°. A **universal (U)** joint (two yokes and a cross) leaves 2 rotations, about ±45° each. A **spherical (S)** joint leaves 3 rotations; a rod end delivers a cone of roughly ±25–30°, not a full sphere. A **cylindrical (C)** joint allows rotation and translation on the same axis (2 DOF). A **planar (E)** joint allows $x$, $y$ and $\\theta$ (3 DOF). A **fixed** joint — welded or bolted — has 0 DOF.',
    },
    {
      kind: 'table',
      title: 'Joint types: mobility and usable range',
      columns: ['Joint', 'DOF', 'Motion', 'Typical range', 'Real example'],
      rows: [
        ['Revolute (R)', '1', 'Rotation about one axis', '±170°; ±360° with slip ring', 'UR5e shoulder; ABB IRB 6700 axis 1'],
        ['Prismatic (P)', '1', 'Translation along one axis', '0–100 mm', 'THK KR ball-screw stage; SCARA Z axis'],
        ['Helical (H)', '1', 'Rotation coupled to translation', '5 mm lead per 360°', 'Lead screw on a printer Z axis'],
        ['Universal (U)', '2', 'Two orthogonal rotations', '±45° per axis', 'Stewart platform base joints'],
        ['Spherical (S)', '3', 'Three rotations', '≈±25–30° cone', 'SKF POS rod end'],
        ['Cylindrical (C)', '2', 'Rotation + translation, one axis', '±180° and 0–50 mm', 'Drill-press quill'],
        ['Planar (E)', '3', 'x, y translation + rotation', 'Set by the stage', 'XY-theta alignment stage'],
        ['Fixed', '0', 'None', '—', 'Welded chassis; bolted flange'],
      ],
    },
    {
      kind: 'prose',
      heading: 'Serial, parallel, hybrid — and where the motors live',
      body:
        'A **serial** arm is an open chain: base, link, joint, link, tool. Six revolute joints give a 6-DOF arm with full position and orientation control. The ABB IRB 6700-150/3.20 lifts 150 kg to 3.20 m and repeats to 0.05 mm; a UR5e reaches 850 mm with a 5 kg payload and ±0.03 mm repeatability. Serial arms reach far and program easily, but joint errors add and the arm carries its own motors, so stiffness falls as the chain grows.\n\n' +
        'A **parallel** robot closes loops. The **Delta** drives three parallelogram arms from the base to hold one platform in pure translation: 3 DOF, 100+ pick-and-place cycles per minute, small workspace. The **Stewart platform** (6-UPS) is a base, a platform and six legs: 6 DOF, exceptional stiffness and payload for its size, but a small and twisty workspace with coupled kinematics — one leg moves every output. **Hybrid** machines stack both, e.g. a serial wrist on a parallel positioning stage (Tricept, Exechon).\n\n' +
        'Motor placement is a second decision. **Direct drive** removes backlash and stays back-drivable, at low torque. **Geared** joints buy torque density: harmonic drives hold lost motion under 1 arcmin, planetary boxes run 8–16 arcmin. **Cable or remote actuation** moves mass off the link — the da Vinci surgical arms and the Barrett WAM drive joints through cables. **Series elastic** actuators insert a known spring between motor and load (Baxter), turning force into measured deflection and making contact soft.',
    },
    {
      kind: 'formula',
      title: 'Grubler-Kutzbach mobility criterion',
      tex: 'M = 6(n-1) - 5j_1 - 4j_2 - 3j_3 - 2j_4 - j_5 \\qquad M = 3(n-1) - 2j_1 - j_2',
      explain: 'Left is spatial, right is planar. n counts every link including ground; j_k is the number of k-DOF joints. A 1-DOF joint removes five of a body\'s six spatial freedoms and two of its three planar ones.',
    },
    {
      kind: 'prose',
      heading: 'Worked mobility: four-bar to Stewart',
      body:
        '**Planar four-bar** (n = 4, four R joints): $M = 3(4-1) - 2(4) = 1$. One motor drives it.\n\n' +
        '**Planar five-bar** (n = 5, five R joints, two of them at the base): $3(4) - 2(5) = 2$. Two motors — the 2-DOF parallel arm used in high-speed pickers.\n\n' +
        '**Stewart platform** (n = 14 = base + platform + 6 legs x 2 bodies; j1 = 6 prismatic, j2 = 6 universal, j3 = 6 spherical): $6(13) - 5(6) - 4(6) - 3(6) = 78 - 30 - 24 - 18 = 6$. Six legs, six DOF, fully actuated, no redundancy.\n\n' +
        '**Delta**: three identical parallelogram arms cancel rotation, leaving 3 translational DOF from three base motors. **SCARA** (2 R + 1 P + 1 R) has 4 DOF: stiff vertically, compliant horizontally — exactly what peg insertion wants.\n\n' +
        'Grubler counts *generic* mechanisms. Special geometry can add passive or redundant motion, so always sanity-check the number against the real machine.',
    },
    {
      kind: 'code',
      title: 'Mobility calculator',
      language: 'python',
      code:
        'def mobility_planar(n, j1, j2=0):\n' +
        '    """n = links including ground; j1/j2 = 1-DOF and 2-DOF joints."""\n' +
        '    return 3 * (n - 1) - 2 * j1 - j2\n\n' +
        'def mobility_spatial(n, j1=0, j2=0, j3=0, j4=0, j5=0):\n' +
        '    """Grubler-Kutzbach for a spatial mechanism."""\n' +
        '    return 6 * (n - 1) - 5 * j1 - 4 * j2 - 3 * j3 - 2 * j4 - j5\n\n' +
        'assert mobility_planar(4, 4) == 1                    # four-bar\n' +
        'assert mobility_planar(5, 5) == 2                    # planar five-bar\n' +
        'assert mobility_spatial(14, j1=6, j2=6, j3=6) == 6   # 6-UPS Stewart\n' +
        'print(mobility_spatial(7, j1=6))                     # 6R serial arm -> 6',
      note: 'Runs on stock Python 3; the asserts double as a regression test for your own link counts.',
    },
    {
      kind: 'chart',
      title: 'Joint backlash becomes tool error',
      caption: 'Error = reach x backlash in radians (1 arcmin = 2.909e-4 rad); a long arm amplifies the same gearbox.',
      chartType: 'line',
      xLabel: 'Joint backlash (arcmin)',
      yLabel: 'Tool position error (mm)',
      x: [1, 2, 5, 8, 12, 16],
      series: [
        { key: 'r05', label: 'Reach 0.5 m', color: '#f59e0b', data: [0.145, 0.291, 0.727, 1.164, 1.745, 2.327] },
        { key: 'r10', label: 'Reach 1.0 m', color: '#38bdf8', data: [0.291, 0.582, 1.455, 2.327, 3.491, 4.654] },
      ],
    },
    {
      kind: 'callout',
      tone: 'warning',
      title: 'Singularities, and why repeatability beats accuracy',
      body:
        'A **singularity** is a pose where the Jacobian loses rank: the wrist lines up (on a 6R arm, J5 = 0° makes the J4 and J6 axes collinear) or the arm stretches fully straight. There, a small Cartesian move demands near-infinite joint speed and inverse kinematics goes ill-conditioned. Work near a singularity, never at it.\n\n' +
        '**Backlash** is lost motion in a transmission. It is repeatable, so it damages accuracy more than repeatability. An arm repeating to ±0.02 mm but accurate only to ±0.5 mm hits the *same wrong point* every cycle — calibration can find and cancel that offset. An arm that is accurate but not repeatable cannot be fixed in software. For assembly work, buy repeatability first and calibrate accuracy later.',
    },
    {
      kind: 'steps',
      title: 'Pick an end effector',
      steps: [
        { title: 'Parallel jaw', detail: 'Two fingers, fixed orientation: a Robotiq 2F-85 gives 85 mm stroke and 20–235 N grip. The default for boxes and cylinders; needs a clear approach axis.' },
        { title: 'Angular jaw', detail: 'Fingers pivot instead of sliding — compact and fast for small parts, but grip force drops as the jaws open.' },
        { title: 'Vacuum', detail: 'A venturi at 0.6 MPa reaches about -60 kPa, so a 40 mm cup holds F = dP x A = 60 kPa x 1.26e-3 m^2 = 75 N. Size cups for at least 2x payload; flat, non-porous parts only.' },
        { title: 'Magnetic', detail: 'Switchable permanent magnets need no air line and hold ferrous steel (a Magswitch MagJig 150 holds roughly 68 kg on 12 mm plate). Steel only, and no force control.' },
        { title: 'Soft / compliant', detail: 'Silicone or bellows fingers forgive ±2 mm of misplacement and grip delicate items below 1 N. Position accuracy can be sloppy; force models and cycle life are the weak points.' },
        { title: 'Tool changer', detail: 'An ATI QC-series coupling lets one arm swap grippers, welders and cameras, re-mating to about ±0.013 mm (0.0005 in). Every added interface costs payload and stiffness.' },
      ],
    },
    {
      kind: 'lab',
      labId: 'robot-arm',
      title: 'Drive the 6-DOF arm',
      brief: 'Command six joints and watch the tool frame sweep reachable and dexterous space.',
      tasks: [
        'Home the arm and log each joint limit in degrees.',
        'Move the tool 200 mm in +X only and record the joint angles that got you there.',
        'Park the wrist at J5 = 0° and note what the tool orientation does near that singularity.',
      ],
    },
    {
      kind: 'lab',
      labId: 'gear-train',
      title: 'Gearbox backlash and stiffness',
      brief: 'Compare 1:1 direct drive, 100:1 planetary and 100:1 harmonic joints under the same load.',
      tasks: [
        'Measure tool error at 0.5 m and 1.0 m reach and check it against 1 arcmin = 0.29 mm at 1 m.',
        'Reverse the load and record lost motion; identify the train with the largest backlash.',
        'Raise stiffness until 20 N of side load deflects the tool under 0.1 mm, and note the mass penalty.',
      ],
    },
  ],
  keyTerms: [
    { term: 'Degree of freedom', definition: 'One independently commanded coordinate of a mechanism: 3 for a body in a plane, 6 in space.' },
    { term: 'Kinematic pair (joint)', definition: 'A connection between two links that removes freedoms; classified R, P, H, U, S, C, E or fixed.' },
    { term: 'Mobility (Grubler criterion)', definition: 'M = 6(n-1) - 5j1 - 4j2 - 3j3 - 2j4 - j5 in space, M = 3(n-1) - 2j1 - j2 in the plane.' },
    { term: 'Serial manipulator', definition: 'Open kinematic chain; joint errors and compliance accumulate from base to tool.' },
    { term: 'Parallel manipulator', definition: 'Closed-chain machine (Delta, Stewart): high stiffness and payload, coupled kinematics, small workspace.' },
    { term: 'Dexterous workspace', definition: 'Poses the tool can reach with every orientation; always smaller than the reachable workspace.' },
    { term: 'Singularity', definition: 'Pose where the Jacobian loses rank, so small Cartesian moves need huge joint speeds.' },
    { term: 'Backlash', definition: 'Lost motion from clearance in a transmission; repeatable, so it degrades accuracy more than repeatability.' },
  ],
  quiz: [
    { id: 'w1l2q1', question: 'How many degrees of freedom does a spherical (ball) joint contribute to a spatial mechanism?', choices: ['0', '1', '2', '3'], answer: 3,
      explanation: 'It leaves three rotations and no translation — 3 DOF.', level: 'recall' },
    { id: 'w1l2q2', question: 'Which joint couples rotation to translation at a fixed lead?', choices: ['Helical (screw)', 'Prismatic', 'Revolute', 'Universal'], answer: 0,
      explanation: 'A helical joint advances one lead per turn, so it has 1 DOF, not 2.', level: 'understand' },
    { id: 'w1l2q3', question: 'A planar four-bar linkage has n = 4 links and four 1-DOF joints. What is its mobility?', choices: ['0', '1', '2', '3'], answer: 1,
      explanation: 'M = 3(4-1) - 2(4) = 1: a single input drives it.', level: 'understand' },
    { id: 'w1l2q4', question: 'A 6-UPS Stewart platform has 14 links, 6 prismatic, 6 universal and 6 spherical joints. Grubler gives:', choices: ['3', '4', '6', '9'], answer: 2, explanation: '6(13) - 5(6) - 4(6) - 3(6) = 78 - 30 - 24 - 18 = 6.', level: 'apply' },
    { id: 'w1l2q5', question: 'On a 6R industrial arm, the wrist singularity specifically occurs when:', choices: ['the arm is fully extended', 'J1 and J2 axes intersect', 'the gripper reaches a joint limit', 'J4 and J6 axes become collinear at J5 = 0°'], answer: 3,
      explanation: 'Full extension is the elbow singularity; the wrist one is J5 = 0°, where J4 and J6 align and orientation control degenerates.', level: 'analyze' },
    { id: 'w1l2q6', question: 'A robot repeats to ±0.02 mm but is accurate to only ±0.5 mm. What follows?', choices: ['Its encoders are open-loop', 'It cannot be used for assembly at all', 'It returns to the same point precisely, but that point sits about 0.5 mm from the commanded one', 'Its backlash is zero'], answer: 2,
      explanation: 'Repeatability is hardware; accuracy is a calibration offset. A consistent 0.5 mm error can be measured and cancelled in software.', level: 'analyze' },
    { id: 'w1l2q7', question: 'You must place a 0.4 kg raw egg on a moving conveyor with ±2 mm of placement error. Best first choice:', choices: ['Parallel jaw at 235 N grip force', 'Magnetic gripper', 'Rigid vacuum cup at -60 kPa', 'Soft compliant pneumatic gripper'], answer: 3,
      explanation: 'Soft fingers absorb the misplacement and hold under 1 N; a 235 N jaw or a hard vacuum cup cracks the shell.', level: 'design' },
  ],
  flashcards: [
    { front: 'DOF of a free rigid body in space', back: '6 — three translations plus roll, pitch and yaw.', tag: 'dof' },
    { front: 'Revolute joint', back: '1 DOF: a single rotation about a fixed axis.', tag: 'joints' },
    { front: 'Spherical vs universal joint', back: 'Spherical = 3 rotations (rod ends give roughly a ±25–30° cone); universal = 2 rotations, about ±45° each.', tag: 'joints' },
    { front: 'Grubler mobility, planar form', back: 'M = 3(n-1) - 2j1 - j2, with n counting every link including ground.', tag: 'mobility' },
    { front: 'Stewart platform mobility', back: '6, from n = 14 with j1 = 6, j2 = 6 and j3 = 6.', tag: 'mobility' },
    { front: 'Delta robot DOF', back: '3 translational — the parallelogram arms cancel rotation.', tag: 'architectures' },
    { front: 'Reachable vs dexterous workspace', back: 'Reachable = reachable in at least one orientation; dexterous = reachable in every orientation.', tag: 'workspace' },
    { front: 'Wrist singularity of a 6R arm', back: 'J5 = 0°, so J4 and J6 become collinear and tool orientation is indeterminate.', tag: 'singularity' },
    { front: '1 arcmin of joint backlash at 1 m', back: '0.29 mm of tool error — 1 arcmin = 2.909e-4 rad.', tag: 'backlash' },
    { front: 'Series elastic actuator', back: 'A known spring (about 100–1000 N·m/rad) between motor and load; force is read from deflection and contact is softened.', tag: 'actuation' },
  ],
  forgePrompts: [
    'Build a 2-DOF planar five-bar from scrap and measure how far its repeatability beats its accuracy.',
    'Swap a rigid gripper for a silicone soft finger on the same arm and log how much placement error it forgives.',
    'Design a magnetic tool changer for a mycelium-block gripper head — what does the extra interface cost in stiffness and payload?',
  ],
};
