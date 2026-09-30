import type { Lesson } from '../types';

export const lesson: Lesson = {
  id: 'w4l8',
  number: 8,
  week: 4,
  track: 'kinematics',
  title: 'Kinematics II: Inverse Kinematics, Jacobians and Smooth Motion',
  subtitle: 'Where the arm can go, where it cannot, and how to get there without tearing itself apart',
  duration: 80,
  difficulty: 'master',
  xp: 210,
  hook: 'One pose can be reached by many joint vectors — the inverse problem is choosing between them.',
  objectives: [
    'Derive closed-form IK for 2R and 3R planar arms and state the Pieper condition for a spherical wrist.',
    'Implement damped least squares IK and compare it with Newton, CCD and FABRIK on cost and convergence.',
    'Read singularities, condition number and √det(JJᵀ) from the Jacobian and predict the lost motion.',
    'Plan trapezoidal, S-curve, cubic and quintic trajectories and state the TCP error of Cartesian straight-line motion.',
    'Resolve redundancy in the null space while respecting joint limits.',
  ],
  blocks: [
    { kind: 'prose', heading: 'The inverse problem',
      body: 'Forward kinematics sends joint angles to a pose; inverse kinematics sends a pose back to angles, and that direction is the difficult one. A welding arm holds its TCP to ±0.1 mm while the elbow angle changes by 60° between two taught points: the tool path is a straight line, the joint path is not, and both are solutions.\n\n' +
        'Two families of method exist. **Closed form** when the geometry allows it: a 2R planar arm has two solutions, a 3R planar arm with a free elbow has a one-parameter family, and a 6R arm with three consecutive axes meeting at a point has closed-form solutions. **Numerical** when it does not: Newton–Raphson, the Jacobian pseudo-inverse, damped least squares, CCD and FABRIK.' },
    { kind: 'prose', heading: 'Analytic 2R: law of cosines, elbow up or down',
      body: 'Take $L_1 = 0.40$ m, $L_2 = 0.30$ m, target $\\mathbf{p} = (0.35, 0.45)$ m. Then $x^2 + y^2 = 0.3250$ m² and $\\cos\\theta_2 = (0.3250 - 0.1600 - 0.0900)/(2\\cdot 0.40\\cdot 0.30) = 0.0750/0.2400 = 0.31250$, so $\\theta_2 = \\pm 71.79°$.\n\n' +
        'Take the negative branch first: $k_1 = L_1 + L_2\\cos\\theta_2 = 0.4000 + 0.0937 = 0.4937$, $k_2 = L_2\\sin\\theta_2 = -0.2849$, and $\\theta_1 = \\operatorname{atan2}(0.45, 0.35) - \\operatorname{atan2}(k_2, k_1) = 52.13° + 30.00° = 82.12°$. Check it: elbow $(0.40\\cos 82.12°, 0.40\\sin 82.12°) = (0.0549, 0.3962)$, TCP $(0.0549 + 0.30\\cos 10.33°,\\; 0.3962 + 0.30\\sin 10.33°) = (0.350, 0.450)$ m. The other branch, $\\theta_2 = +71.79°$ with $\\theta_1 = 22.13°$, reaches the same point and 63 mm lower — elbow down against elbow up. Both are valid; the sign of $\\theta_2$ is your selection variable.' },
    { kind: 'callout', tone: 'warning', title: 'Verify an IK solution with forward kinematics — always',
      body: 'A plausible-looking inverse solution is the most common error in this lesson. My first pass at the 2R case paired $\\theta_1 = 25.69°$ with $\\theta_2 = +54.90°$: forward kinematics then puts the elbow at $(0.3605, 0.1734)$ and the TCP at $(0.4095, 0.4694)$ m, **63 mm** from the target. Branch sign and angle formula have to agree — here the correct elbow-down pair is $\\theta_1 = 22.13°$, $\\theta_2 = +71.79°$. Push every candidate through your own forward function, not through the one that produced it.' },
    { kind: 'formula', title: 'Planar 2R closed form (law of cosines)',
      tex: 'c_2 = \\frac{x^2 + y^2 - L_1^2 - L_2^2}{2L_1L_2}, \\qquad \\theta_2 = \\pm\\arccos(c_2), \\qquad \\theta_1 = \\operatorname{atan2}(y,x) \\mp \\operatorname{atan2}\\!\\big(L_2\\sin\\theta_2,\\; L_1 + L_2\\cos\\theta_2\\big)',
      explain: 'The plus branch is elbow down, the minus branch elbow up. Both hit the same point; the sign budget must be spent exactly once. If |x² + y²| falls outside [(L₁-L₂)², (L₁+L₂)²] there is no real solution — the target is outside the workspace.' },
    { kind: 'prose', heading: 'Analytic 3R, redundancy and the Pieper condition',
      body: 'A 3R planar arm adds a degree of freedom, so one target admits a one-parameter family: choose the elbow interior angle $\\varphi$ freely, set $L_{\\text{virtual}} = \\sqrt{x^2+y^2}$ as the first link and solve the 2R sub-problem, then $\\theta_3 = \\varphi - \\theta_1 - \\theta_2$. Sweeping $\\varphi$ sweeps the whole posture family at constant TCP — the first taste of redundancy.\n\n' +
        'For a 6R arm no general closed form exists. The **Pieper condition** (Pieper, 1968) supplies one: a closed-form solution exists when three consecutive joint axes intersect at a point, or when three consecutive axes are parallel. Industrial arms satisfy it by construction — a **spherical wrist** puts the last three axes through one point, so the wrist centre depends on joints 1–3 alone. Solve position with a 3-DOF sub-problem, then orientation as a 3-DOF Euler extraction. This is why the spherical wrist is the dominant industrial geometry.' },
    { kind: 'prose', heading: 'Numerical IK: Newton, pseudo-inverse, damped least squares',
      body: 'Strip the problem to its differential form: find the joint step $\\Delta\\mathbf{q}$ that removes the pose error $\\mathbf{e}$. Newton–Raphson linearises and iterates; the pseudo-inverse $\\Delta\\mathbf{q} = \\mathbf{J}^{+}\\mathbf{e}$ is the minimum-norm Newton step and converges quadratically near a solution: a 6R solve in about 4–6 iterations, 0.5–2 ms per iteration in Python.\n\n' +
        'Near a singularity $\\mathbf{J}^{+}$ blows up. **Damped least squares** (Levenberg–Marquardt) adds $\\lambda^2\\mathbf{I}$: $\\Delta\\mathbf{q} = \\mathbf{J}^{T}(\\mathbf{J}\\mathbf{J}^{T} + \\lambda^2\\mathbf{I})^{-1}\\mathbf{e}$. The step stays finite, at the price of a residual on the order of $\\lambda^2$ — so shrink $\\lambda$ as the error falls. **Cyclic coordinate descent** rotates one joint at a time and converges slowly but needs no matrix; **FABRIK** reaches forward to the target then back to the base, hits roughly 1 mm in 10 iterations and handles joint limits by clamping between passes.' },
    { kind: 'code', title: 'Damped least squares IK for a 2R planar arm', language: 'python',
      note: 'Converges in 6 iterations from a 441 mm error to 1.5e-9 m. From a singular start (θ2 = 0) it takes 7 iterations and lands on the mirror branch. Set damping = 0.0 to watch it thrash.',
      code: `import math

L = (0.40, 0.30)

def fk(q):
    t1, t2 = q
    return (L[0]*math.cos(t1) + L[1]*math.cos(t1 + t2),
            L[0]*math.sin(t1) + L[1]*math.sin(t1 + t2))

def jacobian(q):
    t1, t2 = q
    return ((-L[0]*math.sin(t1) - L[1]*math.sin(t1+t2), -L[1]*math.sin(t1+t2)),
            ( L[0]*math.cos(t1) + L[1]*math.cos(t1+t2),  L[1]*math.cos(t1+t2)))

def ik(target, q=(0.0, 0.0), damping=1e-3, tol=1e-6, iters=50):
    """delta_q = J^T (J J^T + lambda^2 I)^-1 e  -- the damped least squares step."""
    for i in range(iters):
        x, y = fk(q)
        e = (target[0] - x, target[1] - y)
        if math.hypot(*e) < tol:
            return q, i
        (a, b), (c, d) = jacobian(q)
        # J J^T + lambda^2 I, then its 2x2 inverse applied to e
        f = damping * damping
        m00, m01, m11 = a*a + b*b + f, a*c + b*d, c*c + d*d + f
        det = m00*m11 - m01*m01
        u = ( m11*e[0] - m01*e[1]) / det
        v = (-m01*e[0] + m00*e[1]) / det
        q = (q[0] + a*u + c*v, q[1] + b*u + d*v)
    return q, iters

print(ik((0.35, 0.45)))      # ((0.38629, 1.25297), 6) rad = (22.13, 71.79) deg
print(fk((0.38629, 1.25297)))  # (0.35000000, 0.44999999) m -- error 1.5e-9 m` },
    { kind: 'prose', heading: 'The Jacobian: differential kinematics and force duality',
      body: 'The Jacobian is the derivative of the whole kinematic map: $\\dot{\\mathbf{x}} = \\mathbf{J}(\\mathbf{q})\\dot{\\mathbf{q}}$. Build column $i$ geometrically as $[\\mathbf{z}_i \\times (\\mathbf{p}_{\\text{tcp}} - \\mathbf{o}_i);\\; \\mathbf{z}_i]$ for a revolute joint, where $\\mathbf{z}_i$ is axis $i$ and $\\mathbf{o}_i$ its origin. The **geometric** Jacobian maps to linear plus angular velocity; the **analytic** Jacobian relates $\\dot{\\mathbf{q}}$ to the rate of change of a minimal orientation triple such as ZYX Euler angles, and the two differ by an orientation-dependent matrix that itself degenerates at 90°.\n\n' +
        'Power must balance in both directions, so the transpose is the force map: $\\boldsymbol{\\tau} = \\mathbf{J}^{T}\\mathbf{F}$. Every entry of that identity is useful. A 10 N push along $z$ at a pose where the third-column $z$-moment arm is 0.60 m needs 6 N·m at that joint. And a singular direction turns the other way: the same 10 N can demand unbounded torque, which is why a fully extended arm is both fast and fragile.' },
    { kind: 'formula', title: 'Force–torque duality: τ = JᵀF',
      tex: '\\boldsymbol{\\tau} = \\mathbf{J}^{T}\\mathbf{F}, \\qquad \\mathbf{F} = \\mathbf{J}^{-T}\\boldsymbol{\\tau}, \\qquad \\mathbf{J} = \\begin{bmatrix} \\mathbf{z}_1\\times(\\mathbf{p}-\\mathbf{o}_1) & \\cdots & \\mathbf{z}_n\\times(\\mathbf{p}-\\mathbf{o}_n) \\\\ \\mathbf{z}_1 & \\cdots & \\mathbf{z}_n \\end{bmatrix}',
      explain: 'The same matrix that maps joint rates to TCP velocity maps TCP wrench back to joint torque — virtual work in one line. Read it at a singularity: a bounded wrench maps to unbounded torque.' },
    { kind: 'prose', heading: 'Singularities: wrist, boundary, gimbal lock',
      body: 'A singularity is a pose where $\\mathbf{J}$ loses rank, so $\\sqrt{\\det(\\mathbf{J}\\mathbf{J}^{T})} = 0$ and the condition number $\\kappa = \\sigma_{\\max}/\\sigma_{\\min}$ diverges. Three kinds matter.\n\n' +
        '**Boundary**: the arm is stretched out, $\\theta_2 = 0$ for the 2R case with equal links, and the TCP can only move radially — I lose tangential motion. **Wrist**: $\\theta_5 = 0$ or $180°$ makes the first and third wrist axes collinear, so two rotation axes become one; position control survives, orientation control does not. **Gimbal lock** is the same degeneracy seen in orientation coordinates rather than in the mechanism: at $\\pm 90°$ of Euler pitch, yaw and roll turn into one axis and a solver chasing angles can command huge joint rates. A small margin helps everywhere: stay below $\\kappa \\approx 20$ and above a manipulability of roughly 0.05. Push an arm through a singularity with plain pseudo-inverse and $\\|\\dot{\\mathbf{q}}\\|$ diverges; the cure is damping, a slightly bent posture, or a posture chosen in the null space.' },
    { kind: 'formula', title: 'Manipulability and the damped pseudo-inverse',
      tex: 'w(\\mathbf{q}) = \\sqrt{\\det\\!\\big(\\mathbf{J}\\mathbf{J}^{T}\\big)}, \\qquad \\Delta\\mathbf{q} = \\mathbf{J}^{T}\\big(\\mathbf{J}\\mathbf{J}^{T} + \\lambda^{2}\\mathbf{I}\\big)^{-1}\\mathbf{e}, \\qquad \\Delta\\mathbf{q} = \\mathbf{J}^{+}\\mathbf{e} + \\big(\\mathbf{I} - \\mathbf{J}^{+}\\mathbf{J}\\big)\\mathbf{z}',
      explain: 'w is the volume the Jacobian maps the unit joint ball onto — zero exactly at a singularity. The last term is null-space motion: z changes posture while (I − J⁺J) guarantees zero TCP velocity, which is how you dodge joint limits without moving the tool.' },
    { kind: 'prose', heading: 'Trajectory generation: trapezoid, S-curve, quintic',
      body: 'A move of 0.5 m in 0.4 s at 1.56 m/s peak with a 0.08 s acceleration ramp is a **trapezoidal velocity profile**: full speed for the middle, acceleration steps at the corners. Those steps excite drivetrain resonance. Bound jerk $j = 200$ m/s³ instead and every corner becomes a ramp — an **S-curve** that adds about 0.14 s to the same move, roughly 35% more time for a spectrum that stops ringing.\n\n' +
        'For point-to-point joint moves, polynomials in time are cheaper than any planning grid. **Cubic** splines match position and velocity at both ends ($a_0 = q_0$, $a_1 = 0$, $a_2 = 3\\Delta q/T^2$, $a_3 = -2\\Delta q/T^3$). **Quintic** splines also match acceleration, so every move starts and ends with zero acceleration — no torque step. Both are computed here in closed form; no iteration, no memory.' },
    { kind: 'formula', title: 'Quintic polynomial point-to-point spline',
      tex: 'q(t) = q_0 + \\Delta q\\left[10\\left(\\tfrac{t}{T}\\right)^{3} - 15\\left(\\tfrac{t}{T}\\right)^{4} + 6\\left(\\tfrac{t}{T}\\right)^{5}\\right], \\qquad \\dot q_{\\max} = \\frac{15\\,\\Delta q}{8\\,T}',
      explain: 'With zero velocity and acceleration at both ends. The t³/t⁴/t⁵ blend peaks at 15Δq/8T — 1.875× the average speed, so it costs 50% more time than a true trapezoid over a short move, and buys a jerk-free start.' },
    { kind: 'chart', title: 'Trapezoidal versus quintic velocity profiles',
      caption: 'Normalised: unit move distance and unit move time, so both curves have mean velocity 1. The trapezoid saturates at 1.25 and holds it; the quintic peaks at 1.875 and never holds a constant rate. Acceleration is a step for the trapezoid, continuous for the quintic.',
      chartType: 'line', xLabel: 'Move progress t/T', yLabel: 'Normalised velocity  v·T/Δq',
      x: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      series: [
        { key: 'trap', label: 'Trapezoidal (0.2T ramp)', color: '#f59e0b', data: [0, 0.5, 1.0, 1.25, 1.25, 1.25, 1.25, 1.25, 1.0, 0.5, 0] },
        { key: 'quintic', label: 'Quintic polynomial', color: '#38bdf8', data: [0, 0.07, 0.29, 0.57, 0.85, 1.00, 0.91, 0.61, 0.23, 0.02, 0] },
      ] },
    { kind: 'prose', heading: 'Joint space or Cartesian space — and why the TCP bows',
      body: 'Cartesian straight-line motion interpolates the pose and runs inverse kinematics at every servo tick, typically 500 Hz–1 kHz: the TCP tracks a straight line to ±0.05 mm, but the configuration is whatever IK returns, so the path can cross a singularity or walk into a joint limit mid-move. Joint-interpolated motion interpolates the angles, so no IK is needed on the fly and no inverse-singularity can occur; the cost is that the TCP bows away from the straight line. On a 400 mm diagonal move with a 45° change at the shoulder, the bow runs 3–8 mm depending on the start posture — fine for a pick-and-place, unacceptable for a weld or a glue bead.\n\n' +
        'Blending joins segments with a corner radius of 0.5–2 mm, or with a **tolerance sphere** at the via point: switch early when the TCP is inside the sphere. Then scale the whole path in time by the tightest velocity and acceleration limit along it — time-optimal scaling that keeps every joint legal. A quintic blend is what makes the corner look continuous to the motors even though the geometric path is not.' },
    { kind: 'table', title: 'IK method comparison',
      caption: 'Cost is per solve on a 6R arm with 6-DOF targets, measured in Python on one core. Convergence is the observed behaviour; the trade is accuracy near singularities against cost.',
      columns: ['Method', 'Closed form?', 'Typical convergence', 'Cost per solve', 'Fails when'],
      rows: [
        ['Analytic 2R/3R (law of cosines)', 'Yes', 'Exact, no iteration', '< 1 µs', 'Target outside the workspace, or geometry does not factor'],
        ['Analytic 6R + spherical wrist (Pieper)', 'Yes', 'Exact, up to 8 branches', '5–20 µs', 'Wrist is not spherical; offsets break the decoupling'],
        ['Newton–Raphson', 'No', 'Quadratic near solution, 4–6 iterations', '0.5–2 ms', 'Singularity, bad initial guess, wrong branch'],
        ['Jacobian pseudo-inverse', 'No', 'Quadratic, minimum-norm step', '0.5–2 ms', 'Singular J: unbounded Δq'],
        ['Damped least squares (LM)', 'No', 'Linear–quadratic, converges from far', '1–3 ms', 'λ too large: residual ≈ λ² stalls above tolerance'],
        ['Cyclic coordinate descent', 'No', 'Linear, 20–50 sweeps', '0.1–1 ms', 'Local minima, slow near limits'],
        ['FABRIK', 'No', '~1 mm in 10 iterations, linear after', '0.05–0.3 ms', 'Angle limits distort the reach; may not converge exactly'],
      ] },
    { kind: 'steps', title: 'Solving IK in practice',
      steps: [
        { title: 'Classify the arm', detail: 'Six revolute joints with a spherical wrist? Try closed form first — it is 100× cheaper and always exact.' },
        { title: 'Check reachability', detail: 'Compare ‖p‖ against r_min = |L₁ − L₂| and r_max = L₁ + L₂ for the last three links. Outside that annulus there is no solution at any cost.' },
        { title: 'Enumerate the branches', detail: 'A spherical-wrist 6R arm yields up to 8 solutions. Discard the ones outside joint limits, then rank the rest by manipulability and joint travel.' },
        { title: 'Pick a posture criterion', detail: 'Elbow up or down, wrist flip or not. Apply it as a sign choice in closed form, or as a penalty in the numerical cost.' },
        { title: 'Iterate numerically with damping', detail: 'Quit at 0.05 mm and 0.01°. Use λ ≈ 0.05 near singularities and 1e-3 elsewhere — never a fixed large λ.' },
        { title: 'Project out the null space', detail: 'Fold posture and joint-limit gradients through (I − J⁺J) so the TCP does not move while the arm reconfigures.' },
        { title: 'Verify with FK', detail: 'Feed the answer back through forward kinematics and assert the error before the command reaches a motor.' },
      ] },
    { kind: 'callout', tone: 'insight', title: 'Singularities are not bugs — they are the shape of the workspace',
      body: 'The set of achievable TCP velocities is an ellipsoid whose axes are the singular values of $\\mathbf{J}$. Its longest axis is the direction the arm can exploit for speed; its shortest axis is the direction that needs enormous torque. Skilled motion planning does not avoid that geometry, it uses it: accelerate along the long axis, approach the target along the short one, and keep $\\sqrt{\\det(\\mathbf{J}\\mathbf{J}^{T})}$ above 0.05 so the servo loop never sees a command it cannot track.' },
    { kind: 'lab', labId: 'robot-arm', title: 'IK and singularities on the 6-DOF arm',
      brief: 'Command an end-effector pose and compare a closed-form and a damped-least-squares solution in the same sim.',
      tasks: [
        'Reach a given point with elbow up and elbow down; log both joint vectors and the TCP error of each.',
        'Teach a 300 mm straight-line path and note where the manipulability measure √det(JJᵀ) passes below 0.05.',
        'Push the target to the workspace boundary and classify the refusal: joint limit, out of reach, or singularity.',
      ] },
    { kind: 'lab', labId: 'gait', title: 'Smooth trajectories on the gait rig',
      brief: 'Drive a leg with trapezoidal and quintic profiles and measure what the profile costs in tracking error.',
      tasks: [
        'Run the hip and knee through a 0.5 s swing with a trapezoidal profile, then with a quintic; log peak velocity and RMS torque.',
        'Switch the same swing between Cartesian and joint interpolation and record TCP deviation from the straight line at mid-swing.',
        'Find the joint limit that truncates the swing and re-plan it in the null space rather than shortening the stride.',
      ] },
  ],
  keyTerms: [
    { term: 'Inverse kinematics (IK)', definition: 'Mapping from a desired pose to joint values; multi-valued, or empty outside the workspace.' },
    { term: 'Pieper condition', definition: 'A 6R arm has a closed-form IK when three consecutive axes intersect at a point or are parallel.' },
    { term: 'Geometric Jacobian', definition: 'Matrix whose column i is [z_i × (p_tcp − o_i); z_i] for a revolute joint; maps q̇ to TCP velocity.' },
    { term: 'Singularity', definition: 'A pose where J loses rank: manipulability is 0, condition number diverges, a Cartesian direction is lost.' },
    { term: 'Manipulability', definition: 'w(q) = √det(JJᵀ), the volume of the velocity ellipsoid; 0 exactly at a singularity.' },
    { term: 'Null space', definition: 'The (I − J⁺J) set of joint velocities that produce zero TCP motion — used for posture and limit avoidance.' },
    { term: 'Damped least squares', definition: 'Levenberg–Marquardt IK step that trades a λ²-scale residual for finite joint rates at singularities.' },
    { term: 'FABRIK', definition: 'Forward-and-backward reaching IK: no matrix inverse, roughly 1 mm accuracy in 10 iterations.' },
  ],
  quiz: [
    { id: 'w4l8q1', question: 'The Pieper condition guarantees a closed-form inverse kinematic solution when three consecutive joint axes...',
      choices: ['are parallel to gravity', 'intersect at a single point or are mutually parallel', 'are all prismatic', 'span exactly 90°'], answer: 1, level: 'recall',
      explanation: 'Axes through one point (a spherical wrist) or three parallel axes let the chain decouple into a position sub-problem and an orientation sub-problem.' },
    { id: 'w4l8q2', question: 'Joint step Δq = Jᵀ(JJᵀ + λ²I)⁻¹e. As λ is raised from 1e-3 toward 0.2...',
      choices: ['the step becomes exact but the joint rates grow without bound', 'nothing changes; λ only affects numerical precision', 'the step stays finite through singularities but a residual on the order of λ² remains', 'the arm becomes redundant and gains a degree of freedom'], answer: 2, level: 'understand',
      explanation: 'Damping is a deliberate trade: finite joint rates everywhere, but the converged pose sits about λ² away from the target.' },
    { id: 'w4l8q3', question: 'A 6R arm must hold its tool still while the elbow is moved away from a joint limit. Which command does this?',
      choices: ['τ = JᵀF', 'Δq = J⁺e with e = 0', 'Δq = (I − J⁺J)z for any z', 'Δq = J⁻¹e with a full 6×6 inverse'], answer: 2, level: 'apply',
      explanation: 'The null-space projector guarantees zero TCP velocity while z reshapes the posture — the whole point of redundancy.' },
    { id: 'w4l8q4', question: 'L₁ = L₂ = 0.30 m and θ₂ = 0. What has the arm lost?',
      choices: ['tangential TCP motion; only radial motion survives', 'all motion, since the Jacobian is zero', 'a full degree of freedom, so the TCP cannot move at all', 'nothing; θ₂ = 0 is the most dexterous posture'], answer: 0, level: 'analyze',
      explanation: 'At full extension the Jacobian is rank 1: √det(JJᵀ) = L₁L₂|sin θ₂| = 0, and the reachable velocity set collapses to the radial direction.' },
    { id: 'w4l8q5', question: 'A 3R planar arm targets a point 0.30 m away with L₁ = 0.40 m, L₂ = 0.30 m, L₃ = 0.20 m. Which families of solution exist?',
      choices: ['exactly one solution', 'exactly two, elbow up and elbow down', 'a one-parameter family of postures, the elbow interior angle free', 'no solution: the point is outside the reachable annulus'], answer: 2, level: 'understand',
      explanation: 'Redundancy costs a parameter: r = 0.30 m lies between |L₁−L₂−L₃| and L₁+L₂+L₃, so sweeping the elbow angle traces a continuous posture family at a fixed TCP.' },
    { id: 'w4l8q6', question: 'A 400 mm diagonal move is joint-interpolated instead of Cartesian straight-line. Why does the TCP bow by millimetres?',
      choices: ['The servo loop lags, so the TCP trails the command', 'The Jacobian is not constant along the path, so constant joint rates give non-constant TCP velocity', 'Joint encoders quantise to 1 mm, so the error accumulates', 'Joint limits clip the intermediate waypoints'], answer: 1, level: 'apply',
      explanation: 'ẋ = J(q)q̇ with q̇ constant still gives a curved path, because J changes with configuration; only the endpoints are guaranteed.' },
    { id: 'w4l8q7', question: 'You are welding a 600 mm seam at 8 mm/s with a ±1 mm allowance near obstacles. Cartesian or joint interpolation — and what do you have to guard?',
      choices: ['Joint interpolation: it is cheaper and keeps the bead straight', 'Cartesian: the bead stays straight, but IK must be checked at every tick for singularity and joint limits', 'Either one; the TCP path is identical by construction', 'Cartesian only if the arm has fewer than 6 joints'], answer: 1, level: 'design',
      explanation: 'A straight bead requires Cartesian interpolation at the servo rate; the price is a per-tick IK that can pass through a wrist singularity or hit a limit mid-seam, so the path must be pre-checked.' },
  ],
  flashcards: [
    { front: 'Pieper condition', back: 'Closed-form IK when three consecutive axes intersect at a point or are parallel — the spherical-wrist assumption.', tag: 'analytic-ik' },
    { front: 'Pieper', back: 'D. Pieper, 1968: the geometric conditions under which a 6R arm has a closed-form inverse solution.', tag: 'heritage' },
    { front: '2R elbow up vs down', back: 'θ₂ = ±arccos(c₂) gives two postures for one point; the sign must be spent exactly once across θ₂ and θ₁.', tag: 'analytic-ik' },
    { front: 'Geometric Jacobian', back: 'Column i = [z_i × (p_tcp − o_i); z_i] for a revolute joint; ẋ = J(q)q̇.', tag: 'jacobian' },
    { front: 'Force–torque duality', back: 'τ = JᵀF: the transpose of the velocity Jacobian maps TCP wrench to joint torque.', tag: 'jacobian' },
    { front: 'Manipulability', back: 'w(q) = √det(JJᵀ); zero at a singularity, kept above about 0.05 in practice.', tag: 'singularity' },
    { front: 'Condition number', back: 'κ = σ_max/σ_min of J; diverges at a singularity. Stay below about 20.', tag: 'singularity' },
    { front: 'Damped least squares', back: 'Δq = Jᵀ(JJᵀ + λ²I)⁻¹e — finite joint rates near singularities at the cost of a λ² residual.', tag: 'numerical-ik' },
    { front: 'Null-space control', back: '(I − J⁺J)z moves the posture with zero TCP motion: limit avoidance while holding the tool.', tag: 'redundancy' },
    { front: 'Trapezoid vs quintic', back: 'Trapezoid holds peak 1.25× mean with acceleration steps; quintic peaks at 1.875× and is jerk-free.', tag: 'trajectory' },
  ],
  forgePrompts: [
    'Build a 3R planar arm from hobby servos and a ruler, then map every point where the null space fails to save you from a joint limit.',
    'Estimate the Jacobian of a real arm by nudging each joint 1° and photographing the TCP with a phone camera — a €0 kinematic calibration rig.',
    'Reproduce the trapezoidal-versus-quintic comparison on one mycelium-driven actuator and measure which profile the substrate actually tolerates.',
  ],
};
