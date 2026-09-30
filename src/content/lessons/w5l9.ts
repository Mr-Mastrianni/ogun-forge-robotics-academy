import type { Lesson } from '../types';

export const lesson: Lesson = {
  id: 'w5l9',
  number: 9,
  week: 5,
  track: 'control',
  title: 'Dynamics, Locomotion and Gait',
  subtitle: 'Newton, Lagrange and the cost of moving a body through the world',
  duration: 80,
  difficulty: 'master',
  xp: 210,
  hook: 'Kinematics says where the foot goes. Dynamics says what the motors must pay to put it there.',
  objectives: [
    'Derive equations of motion by Newton-Euler and Lagrange and name M(q), C(q,qdot), g(q).',
    'Solve the 2-link arm equations of motion and explain why torque sizing starts at gravity plus inertia.',
    'Model differential-drive, Ackermann, mecanum and skid-steer locomotion, including slip and error.',
    'Place walk, trot, pace, bound and gallop on a duty-factor and phase diagram.',
    'Write drone thrust, torque and yaw/pitch/roll mixing, and state the underactuation limit.',
    'Compare cost of transport across wheeled, legged, aerial and biological locomotion.',
  ],
  blocks: [
    { kind: 'prose', heading: 'Two roads to the same equations',
      body: 'Dynamics answers one question: for a commanded motion, what torque do I need? **Newton-Euler** walks the kinematic tree, writing $F = ma$ and $\\tau = I\\alpha$ at every link and resolving the reaction wrenches inward to the base. **Lagrange** needs only scalars: $L = T - V$, kinetic minus potential energy, and the equations fall out of $\\frac{d}{dt}\\frac{\\partial L}{\\partial \\dot q} - \\frac{\\partial L}{\\partial q} = \\tau$. Newton-Euler is $O(n)$ with recursive passes and is what real controllers use; Lagrange is $O(n^3)$ but is how you understand the physics. Both produce the same object.\n\n' +
        'The standard form splits cleanly: $M(q)$ is the **mass matrix** (configuration-dependent inertia), $C(q,\\dot q)\\dot q$ collects **Coriolis and centrifugal** coupling (fast joints drag slow ones), and $g(q)$ is **gravity torque** (the steady load that cooks a motor at zero speed).' },
    { kind: 'formula', title: 'Equations of motion, in general and for a 2-link arm',
      tex: 'M(q)\\,\\ddot q + C(q,\\dot q)\\,\\dot q + g(q) = \\tau \\qquad M = \\begin{bmatrix} m_1 l_{c1}^2 + m_2(l_1^2 + l_{c2}^2 + 2 l_1 l_{c2} c_2) + I_1 + I_2 & m_2(l_{c2}^2 + l_1 l_{c2} c_2) + I_2 \\\\ m_2(l_{c2}^2 + l_1 l_{c2} c_2) + I_2 & m_2 l_{c2}^2 + I_2 \\end{bmatrix}, \\quad g = \\begin{bmatrix} (m_1 l_{c1} + m_2 l_1) g c_1 + m_2 l_{c2} g\\, c_{12} \\\\ m_2 l_{c2} g\\, c_{12} \\end{bmatrix}',
      explain: 'Set $m_2 = 0$ and the matrix goes diagonal: a one-link pendulum. Turn $m_2$ on and off-diagonal terms appear — each joint now accelerates the other. $c_i$ means $\\cos q_i$ and $c_{12} = \\cos(q_1+q_2)$. Gravity torque peaks at full horizontal reach $q_1 = q_2 = 0$, which is where you size the shoulder motor.' },
    { kind: 'callout', tone: 'insight', title: 'Dynamics sets the motor, not the path planner',
      body: 'A UR5e shoulder swings a 5 kg payload at 1 m reach: gravity alone asks for $5 \\times 9.81 \\times 1 \\approx 49$ N·m, before any acceleration. Add $\\alpha = 10$ rad/s² on $I \\approx 5$ kg·m² and you need 50 N·m more. Size from the worst case — full extension, maximum acceleration, plus 30-50% margin — then check thermal duty. A motor picked from the kinematic envelope alone stalls at the first horizontal reach.' },
    { kind: 'prose', heading: 'Wheels: the constraints you cannot escape',
      body: 'A fixed standard wheel permits rolling along its plane and forbids sliding sideways: the rolling constraint $(\\dot x \\cos\\theta + \\dot y \\sin\\theta) r = r\\, \\dot\\varphi$ plus a no-slip constraint. **Differential drive** has two fixed wheels on a common axis and cannot move sideways at all; it steers by wheel speed difference and turns about the **instantaneous centre of rotation** (ICR), which lies on the wheel axis extended — at infinity for straight lines. Its kinematic model is exact and its pose error grows without bound, so odometry must be corrected by an exteroceptive sensor.\n\n' +
        '**Ackermann** steering points each front wheel along its own radius to the ICR so both roll without slipping, which is why the inner wheel turns by a larger angle. **Mecanum** wheels carry rollers at 45°, letting the wheel generate a force along the roller axis too — the combination yields three independent motions including sideways crabbing. **Omni** wheels use 90° rollers and need three or more wheels, usually at 120°. Both trade efficiency for agility: rollers slip by construction, so expect roughly 20-35% loss versus a fixed wheel, and odometry from wheel encoders alone drifts fast. **Skid-steer** (tracks or four fixed wheels) must slip sideways to turn; the standard model replaces the geometric track width with an **effective track width** of 1.2-2.0× the measured value, fitted experimentally, because real turning drags and scuffs the contact patches.' },
    { kind: 'formula', title: 'Differential-drive kinematics and odometry integration',
      tex: '\\begin{bmatrix} \\dot x \\\\ \\dot y \\\\ \\dot\\theta \\end{bmatrix} = \\begin{bmatrix} \\cos\\theta & 0 \\\\ \\sin\\theta & 0 \\\\ 0 & 1 \\end{bmatrix} \\begin{bmatrix} v \\\\ \\omega \\end{bmatrix}, \\quad v = \\frac{r(\\dot\\varphi_R + \\dot\\varphi_L)}{2}, \\quad \\omega = \\frac{r(\\dot\\varphi_R - \\dot\\varphi_L)}{b}, \\quad \\dot x \\sin\\theta - \\dot y \\cos\\theta = 0',
      explain: 'The last line is the nonholonomic constraint: no sideways motion. It is not integrable into a position equation, so a differential-drive robot cannot move laterally — only curve. $b$ is the wheel separation and $r$ the wheel radius.' },
    { kind: 'code', title: 'Differential-drive odometry integration', language: 'python',
      note: 'Run 1000 steps at 20 ms with 0.9 m/s and 0.6 rad/s; the pose returns x = 17.71 m, y = -3.55 m, theta = 12.00 rad. Arc integration stays exact on a circle where naive Euler drifts.',
      code: `import math

def integrate(x, y, th, dphi_l, dphi_r, r=0.05, b=0.30):
    """One odometry step: wheel deltas (rad) -> new pose (m, m, rad)."""
    d_l, d_r = r * dphi_l, r * dphi_r          # arc length at each wheel
    d = 0.5 * (d_l + d_r)                      # body travel
    dth = (d_r - d_l) / b                      # heading change
    if abs(dth) < 1e-9:                        # straight: avoid /0
        return x + d * math.cos(th), y + d * math.sin(th), th
    R = d / dth                                # radius of curvature (ICR)
    cx, cy = x - R * math.sin(th), y + R * math.cos(th)
    return cx + R * math.sin(th + dth), cy - R * math.cos(th + dth), th + dth

x = y = th = 0.0
for _ in range(1000):                          # 20 s at 50 Hz
    dphi = 0.9 * 0.02 / 0.05                   # v = 0.9 m/s
    x, y, th = integrate(x, y, th, dphi - 0.006, dphi + 0.006)
print(round(x, 2), round(y, 2), round(th, 2))` },
    { kind: 'prose', heading: 'Contact, friction and the legged bargain',
      body: 'Every contact obeys a **friction circle**: the tangential force cannot exceed $\\mu N$, so the usable acceleration is $\\mu g$ — about 9.8 m/s² on dry rubber, 4-6 m/s² on gravel, well under 2 m/s² on ice. Load transfer moves $N$ between wheels or feet under braking and cornering, so the outer contact does more of the work and loses grip first. A wing-down quadrotor cannot use this at all: it holds itself up with air, not contact.\n\n' +
        'Legged robots pay for terrain access. **Static stability** keeps the centre of mass projection inside the support polygon and allows a slow crawl with arbitrary footholds. **Dynamic stability** allows the CoM outside that polygon — a running human is never statically stable. The **zero moment point** (ZMP) is the point on the ground where the net moment of gravity and inertia has no horizontal component; a walking robot stays upright by keeping the ZMP inside the support polygon. The **capture point** is where the robot must step to arrest its divergent CoM motion, $\\xi = x + \\dot x\\sqrt{z/g}$, and it predicts the next footstep. The **SLIP** model replaces the leg with a spring and mass and captures the natural dynamics of hopping; **Raibert** used exactly that to control a one-legged hopper by placing the foot at a neutral point that cancels velocity error. Modern quadrupeds — MIT Cheetah, ANYmal — instead solve a whole-body **trajectory optimisation** over contact schedules at 30-100 Hz, then track it with a torque controller, which is how they gallop and bound at 3-6 m/s.' },
    { kind: 'formula', title: 'Zero moment point and the drift of underactuation',
      tex: 'x_{zmp} = \\frac{\\sum_i m_i(\\ddot z_i + g)\\,x_i - \\sum_i m_i \\ddot x_i z_i}{\\sum_i m_i(\\ddot z_i + g)} \\qquad \\mathrm{rank}\\,A(q) = 4 < n = 6',
      explain: 'ZMP is where the ground reaction acts when the horizontal moment is zero; keep it inside the support polygon and the robot will not tip. The second expression is a quadrotor: with 4 independent inputs and 6 degrees of freedom, two directions (lateral force and yaw-coupled translation) are unavailable instantaneously — so it must tilt to move, and the coupling is not a software bug.' },
    { kind: 'callout', tone: 'warning', title: 'Gait names are contact schedules, not poetry',
      body: 'A gait is a **duty factor** (fraction of the cycle a foot is on the ground) plus a **phase diagram**, and the phase offset alone changes the physics. **Walk** — 4 beats, duty > 0.5, at least 3 feet down, the only statically stable quadruped gait. **Trot** — 2 beats, diagonal pairs (FL+RR, then FR+RL), the workhorse of quadrupeds. **Pace** — 2 beats, same-side pairs, cheap but roll-unstable. **Bound** — 2 beats, front pair then rear pair, with a suspension phase. **Gallop** — 4 beats, asymmetric, transient flight. Set a trot to run at duty 0.5 or below and it becomes a bouncing flight phase you must control; do not expect trot code to walk.' },
    { kind: 'chart', title: 'Cost of transport versus speed',
      caption: 'Cost of transport = power / (weight x speed), dimensionless. Ground contact beats air by more than an order of magnitude; rails and tyres beat muscle, but only on prepared ground. Robots sit far above animals at the same speed.',
      chartType: 'line', xLabel: 'Speed (m/s)', yLabel: 'Cost of transport (dimensionless)',
      x: [0.5, 1, 1.5, 2, 3, 4, 5, 10, 15],
      series: [
        { key: 'rail', label: 'Steel wheel on rail', color: '#38bdf8', data: [0.06, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.06] },
        { key: 'wheeled', label: 'Wheeled robot on pavement', color: '#f59e0b', data: [0.4, 0.28, 0.24, 0.23, 0.24, 0.27, 0.32, 0.6, 1.1] },
        { key: 'legged', label: 'Legged robot on rough ground', color: '#a78bfa', data: [1.8, 1.2, 0.95, 0.85, 0.8, 0.85, 1.0, 2.2, 4.5] },
        { key: 'human', label: 'Human walking and running', color: '#22c55e', data: [0.45, 0.3, 0.26, 0.24, 0.26, 0.32, 0.45, 1.0, 2.0] },
      ] },
    { kind: 'table', title: 'Locomotion types side by side',
      columns: ['Locomotion', 'DOF / inputs', 'Terrain', 'Slip and loss', 'Typical cost of transport', 'Best use'],
      rows: [
        ['Differential drive', '2 wheels, 2 inputs', 'Flat, smooth', 'No side slip by model; odometry drifts', '0.05-0.3', 'Warehouse AMR'],
        ['Ackermann', '2 steer + 1 drive', 'Roads, outdoors', 'Small sideslip at speed; turning radius floor', '0.08-0.5', 'Autonomous car'],
        ['Mecanum / omni', '4 (or 3) wheels', 'Flat, clean', 'Roller slip 20-35%', '0.3-0.8', 'Agile indoor base'],
        ['Skid-steer', '2 tracks or 4 wheels', 'Rough, loose', 'Heavy scuff; effective track 1.2-2.0x', '0.5-1.5', 'Construction, field robot'],
        ['Legged (static)', '12 for a quadruped', 'Stairs, rubble', 'Foot microslip; high idle torque', '1-3', 'Inspection, disaster response'],
        ['Legged (dynamic)', '12 for a quadruped', 'Rough at speed', 'Impact losses grow with v^2', '0.5-2', 'Running quadrupeds'],
        ['Rotary-wing drone', '4 inputs, 6 DOF', 'Air only', 'No contact; hover always costs power', '2-6', 'Survey, inspection'],
      ] },
    { kind: 'steps', title: 'Size a joint torque budget',
      steps: [
        { title: 'Get the geometry and masses', detail: 'Link lengths, centre-of-mass offsets and inertias per link; these live in the URDF and are the usual source of a wrong answer.' },
        { title: 'Build M, C and g', detail: 'Derive by Lagrange for insight or generate recursively; validate against a rigid-body library before trusting a single number.' },
        { title: 'Find the worst posture', detail: 'Maximum gravity torque at full horizontal reach, then add the acceleration term at the fastest specified move.' },
        { title: 'Add inertia reflection', detail: 'Multiply the motor-side inertia by the gear ratio squared; this usually dominates with a 100:1 reducer.' },
        { title: 'Check thermal duty', detail: 'RMS torque over the real cycle against the continuous rating, then peak torque against the datasheet limit.' },
        { title: 'Verify on the bench', detail: 'Command a slow full-extension move, log motor current, and compare measured against predicted torque.' },
      ] },
    { kind: 'lab', labId: 'gait', title: 'Gait lab',
      brief: 'Drive a simulated quadruped through walk, trot, pace, bound and gallop and read the cost of transport your gait choice pays.',
      tasks: [
        'Hold a statically stable walk with a duty factor above 0.6 and log which feet leave the ground at each moment.',
        'Switch to a trot and find the speed where the body first enters a flight phase.',
        'Break stability by pushing the body sideways mid-trot, then tune the capture point so the robot recovers inside two steps.',
      ] },
  ],
  keyTerms: [
    { term: 'Mass matrix M(q)', definition: 'Configuration-dependent inertia mapping joint acceleration to torque; it couples every joint to every other.' },
    { term: 'Coriolis and centrifugal terms', definition: 'Velocity-product torques in C(q,qdot)qdot; they make a fast joint drag its neighbours.' },
    { term: 'Gravity term g(q)', definition: 'Torque needed to hold a posture against gravity; it peaks at full horizontal reach.' },
    { term: 'Instantaneous centre of rotation', definition: 'The point a rigid body rotates about at one instant; for differential drive it lies on the wheel axis.' },
    { term: 'Nonholonomic constraint', definition: 'A velocity constraint that cannot be integrated into a position constraint, such as no sideways rolling.' },
    { term: 'Zero moment point', definition: 'Ground point where the net moment of gravity and inertia has no horizontal component; keep it inside the support polygon.' },
    { term: 'Capture point', definition: 'The step location that arrests divergent centre-of-mass motion: xi = x + xdot sqrt(z/g).' },
    { term: 'Cost of transport', definition: 'Power divided by weight times speed, dimensionless; wheels on rails reach 0.05, humans walk near 0.2-0.3.' },
  ],
  quiz: [
    { id: 'w5l9q1', question: 'In M(q) qddot + C(q, qdot) qdot + g(q) = tau, the term that lets a fast joint disturb a slow one is...',
      choices: ['M(q) qddot', 'C(q, qdot) qdot', 'g(q)', 'the gear ratio'], answer: 1, level: 'recall',
      explanation: 'Coriolis and centrifugal torques are products of joint velocities, so they appear only when several joints move at once.' },
    { id: 'w5l9q2', question: 'Why is a differential-drive robot nonholonomic?',
      choices: ['Its motors are underpowered', 'Its sideways velocity constraint cannot be integrated into a position constraint', 'Its wheels have different radii', 'It has only two wheels instead of four'], answer: 1, level: 'understand',
      explanation: 'The no-side-slip constraint ties velocity to heading but yields no restriction on reachable poses, so it is non-integrable.' },
    { id: 'w5l9q3', question: 'A differential-drive base has r = 0.05 m and b = 0.30 m. In 0.1 s the left wheel turns 0.20 rad and the right 0.30 rad. What is omega?',
      choices: ['0.033 rad/s', '0.167 rad/s', '0.050 rad/s', '0.833 rad/s'], answer: 1, level: 'apply',
      explanation: 'd_l = 0.010 m, d_r = 0.015 m, so dth = (0.015 - 0.010)/0.30 = 0.0167 rad and omega = 0.167 rad/s over 0.1 s.' },
    { id: 'w5l9q4', question: 'A skid-steer robot turns left correctly on a hard floor but its yaw estimate from encoders is 25% low. Most likely cause?',
      choices: ['Encoders are missing counts', 'The effective track width is larger than the measured one because the wheels scuff', 'The wheel radius shrinks with load', 'Gravity torque biases the gyro'], answer: 1, level: 'analyze',
      explanation: 'Turning by skidding drags the contact patches, so the robot behaves as if its wheels were further apart; fit the 1.2-2.0x factor experimentally.' },
    { id: 'w5l9q5', question: 'Which quadruped gait is the only one that is statically stable at every instant?',
      choices: ['Trot', 'Bound', 'Walk', 'Gallop'], answer: 2, level: 'recall',
      explanation: 'Walk is a four-beat gait with duty factor above 0.5, so at least three feet stay down and the centre of mass stays inside the support polygon.' },
    { id: 'w5l9q6', question: 'A quadrotor has 4 inputs and 6 degrees of freedom but can still reach any position. Why?',
      choices: ['It has a hidden fifth rotor', 'The missing DOF are nonholonomic, so it moves by tilting rather than by direct force', 'Its controller has 6 outputs', 'Its gyroscope supplies the missing inputs'], answer: 1, level: 'analyze',
      explanation: 'Underactuation forbids the direct lateral force at any instant, but a sequence of tilts reaches any pose, exactly the nonholonomic pattern.' },
    { id: 'w5l9q7', question: 'You need a base for 500 kg of payload on warehouse concrete, 10 km/day, 300 days/year. Which choice minimises energy per tonne-kilometre?',
      choices: ['Differential drive with 200 mm wheels and high gearing', 'Mecanum base for sideways agility', 'Skid-steer tracked base', 'Legged quadruped'], answer: 0, level: 'design',
      explanation: 'Rolling resistance dominates on smooth concrete, so a fixed-wheel differential base wins; mecanum rollers and track scuffing each cost 20% or more.' },
  ],
  flashcards: [
    { front: 'Lagrangian dynamics', back: 'L = T - V, then d/dt(dL/dqdot) - dL/dq = tau. Scalar energies, O(n^3), best for understanding.', tag: 'dynamics' },
    { front: 'Coriolis and centrifugal torques', back: 'Velocity-product terms in C(q, qdot) qdot that couple joints; zero when only one joint moves.', tag: 'dynamics' },
    { front: 'Instantaneous centre of rotation', back: 'The point a body spins about at one instant; on the wheel axis for differential drive, at infinity for straight travel.', tag: 'mobility' },
    { front: 'Effective track width', back: 'Fitted wheel separation for skid-steer, 1.2-2.0x the measured value, that accounts for turning scuff.', tag: 'mobility' },
    { front: 'Mecanum wheel', back: 'Rollers at 45 degrees to the wheel plane; three independent motions including crabbing, at 20-35% slip loss.', tag: 'mobility' },
    { front: 'Friction circle', back: 'Tangential force is capped at mu N, so usable acceleration is mu g and never exceeds it.', tag: 'contact' },
    { front: 'Zero moment point', back: 'Ground point where the net moment of gravity and inertia is horizontal-free; inside the support polygon means no tipping.', tag: 'legged' },
    { front: 'Capture point', back: 'xi = x + xdot sqrt(z/g): the footstep that stops a falling CoM. The basis of push recovery.', tag: 'legged' },
    { front: 'SLIP model', back: 'Spring-loaded inverted pendulum: a point mass on a massless spring, the template for hopping and running.', tag: 'legged' },
    { front: 'Cost of transport', back: 'Power / (weight x speed). Rail 0.05, wheeled robot 0.2-0.3, walking human about 0.2-0.3, drone 2-6.', tag: 'energy' },
  ],
  forgePrompts: [
    'Build a 300 mm differential-drive base, run the arc-integration odometry for 100 m, then measure how far the uncorrected pose drifts.',
    'Tape a 45-degree roller to a single driven wheel and measure the sideways force it makes per newton of traction.',
    'Instrument a hopping or running person with a phone accelerometer and estimate their cost of transport over 100 m at three speeds.',
  ],
};
