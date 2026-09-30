import type { BossQuiz } from './types';

export const bossQuizzes: BossQuiz[] = [
  {
    id: 'boss-w1',
    week: 1,
    title: 'Trial of the First Spark',
    subtitle: 'Definitions, autonomy, and the geometry of joints and reach',
    lessonIds: ['w1l1', 'w1l2'],
    xp: 450,
    badgeId: 'gye-nyame',
    questions: [
      {
        id: 'boss-w1q1',
        question: 'Which feature most reliably separates a robot from a programmable automaton?',
        choices: [
          'It runs on electricity',
          'It closes a sense-plan-act loop and can respond to conditions its designer did not enumerate',
          'It contains a microcontroller',
          'It can be reprogrammed',
        ],
        answer: 1,
        explanation:
          'Automata and PLCs execute fixed sequences. A robot measures its own state and its world, then chooses actions, and that closed loop is what makes it a robot.',
        level: 'recall',
      },
      {
        id: 'boss-w1q2',
        question:
          'A crane operator drives a boom with joysticks while a computer only limits swing. In the usual autonomy taxonomy this machine is:',
        choices: [
          'Fully autonomous',
          'Rule-based autonomous',
          'Supervised autonomous',
          'Teleoperated with safety augmentation',
        ],
        answer: 3,
        explanation:
          'A human generates every motion command, so the system sits at the teleoperation end of the scale. The computer constrains unsafe inputs rather than deciding the task.',
        level: 'understand',
      },
      {
        id: 'boss-w1q3',
        question:
          'A planar four-bar linkage has n = 4 links, four single-DOF revolute joints and no higher pairs. Using the Grübler criterion M = 3(n - 1) - 2j1, its mobility is:',
        choices: ['0', '1', '2', '3'],
        answer: 1,
        explanation: 'M = 3(4 - 1) - 2(4) = 9 - 8 = 1, so one input fully determines the configuration.',
        level: 'apply',
      },
      {
        id: 'boss-w1q4',
        question:
          'Why does a 6R arm whose three wrist axes intersect at one point admit a closed-form inverse kinematic solution?',
        choices: [
          'Because every joint is revolute',
          'Because the Jacobian is always square',
          'Because the wrist centre position depends only on the first three joints, so position and orientation decouple',
          'Because 6 DOF guarantees no singularities',
        ],
        answer: 2,
        explanation:
          'The spherical wrist means the tool position fixes the wrist centre. Solving the first three joints for that point leaves a pure orientation problem, which is the Pieper decoupling condition.',
        level: 'analyze',
      },
      {
        id: 'boss-w1q5',
        question:
          'A geared joint has roughly 0.5 deg of backlash. The most direct consequence for a position-controlled arm is:',
        choices: [
          'Lower peak torque',
          'Loss of encoder counts',
          'Higher motor inductance',
          'A dead band and limit cycling whenever the joint reverses direction',
        ],
        answer: 3,
        explanation:
          'Backlash adds hysteresis between motor and load, so small reverse commands produce no motion until the teeth re-engage and the loop can hunt.',
        level: 'apply',
      },
      {
        id: 'boss-w1q6',
        question: 'How many independent degrees of freedom does a spherical (ball-and-socket) joint provide?',
        choices: ['1', '2', '3', '6'],
        answer: 2,
        explanation:
          'A ball joint allows three independent rotations about a common centre but no translation, so it contributes three DOF.',
        level: 'recall',
      },
      {
        id: 'boss-w1q7',
        question:
          'You must pick ripe mangoes at 1-2 N of contact force without bruising them. Which end effector fits best?',
        choices: [
          'A compliant soft pneumatic gripper with force feedback',
          'A rigid two-finger parallel gripper rated at 50 N',
          'A vacuum cup on a rigid arm',
          'An electromagnet',
        ],
        answer: 0,
        explanation:
          'Low-force handling of irregular, delicate fruit needs compliance plus force sensing. A stiff 50 N gripper crushes the payload and a vacuum cup needs a smooth sealing surface.',
        level: 'design',
      },
      {
        id: 'boss-w1q8',
        question: 'In the standard industrial taxonomy, a SCARA robot is:',
        choices: [
          'A cartesian robot with only prismatic axes',
          'A parallel delta robot',
          'A redundant 7-DOF humanoid arm',
          'A horizontal-arm assembly robot with two revolute joints in the horizontal plane plus a prismatic vertical axis',
        ],
        answer: 3,
        explanation:
          'SCARA stands for Selective Compliance Assembly Robot Arm. Two horizontal revolute joints give fast planar motion and the vertical prismatic axis gives stiff insertion.',
        level: 'understand',
      },
      {
        id: 'boss-w1q9',
        question:
          'Two arms share a 1 m reach: a 6R spatial arm and a 3R planar arm. Which statement is correct?',
        choices: [
          'The 3R planar arm sweeps an area, while the 6R arm sweeps a three-dimensional volume',
          'Both have identical workspace volume',
          'The 6R arm has no workspace holes',
          'Workspace does not depend on joint limits',
        ],
        answer: 0,
        explanation:
          'Planar mechanisms are confined to a plane, so their workspace is two-dimensional. Spatial chains add out-of-plane motion and hence volume, though joint limits and self-collision create voids.',
        level: 'analyze',
      },
      {
        id: 'boss-w1q10',
        question:
          'A task needs a camera posed at arbitrary orientations inside a 0.3 m sphere with sub-millimetre repeatability. Which structure is most suitable?',
        choices: [
          'A 3-DOF cartesian gantry',
          'A 2-DOF pan-tilt head',
          'A 6-DOF arm with a spherical wrist and low-backlash harmonic-drive joints',
          'A single long prismatic rail',
        ],
        answer: 2,
        explanation:
          'Arbitrary orientation needs three wrist rotations on top of three position axes, and sub-millimetre repeatability demands low-backlash, high-ratio gearing.',
        level: 'design',
      },
    ],
  },
  {
    id: 'boss-w2',
    week: 2,
    title: 'Nebula of Perception',
    subtitle: 'Encoders, inertial sensing, ranging tradeoffs and the maths of seeing',
    lessonIds: ['w2l3', 'w2l4'],
    xp: 500,
    badgeId: 'sankofa',
    questions: [
      {
        id: 'boss-w2q1',
        question: 'A 1000 CPR incremental encoder is decoded in 4x quadrature. How many counts are produced per revolution?',
        choices: ['1000', '2000', '4000', '8000'],
        answer: 2,
        explanation: 'Quadrature decoding counts all four edges of the two channels, so counts = 4 x CPR = 4000.',
        level: 'recall',
      },
      {
        id: 'boss-w2q2',
        question: 'A 12-bit absolute magnetic encoder has 4096 counts per revolution. Its angular resolution is about:',
        choices: ['0.044 deg', '0.088 deg', '0.18 deg', '0.35 deg'],
        answer: 1,
        explanation:
          '360 / 4096 = 0.0879 deg per count. That is mechanical resolution; magnetic noise and mounting eccentricity usually limit accuracy to a few counts.',
        level: 'apply',
      },
      {
        id: 'boss-w2q3',
        question: 'On an Allan deviation plot for a MEMS gyroscope, what does the minimum of the curve tell you?',
        choices: [
          'The maximum sample rate of the device',
          'The total noise power of the sensor',
          'The temperature coefficient of the bias',
          'The averaging time at which bias instability is smallest, so a useful filter time constant',
        ],
        answer: 3,
        explanation:
          'Short averages are dominated by white noise with slope -0.5, long averages by bias drift. The minimum marks the best averaging window before drift dominates.',
        level: 'understand',
      },
      {
        id: 'boss-w2q4',
        question:
          'Stereo depth error scales as sigma_z ~ z^2 sigma_d / (f B). If you double the baseline B at fixed focal length and matching error, at the same distance the error becomes:',
        choices: ['Half as large', 'The same', 'Twice as large', 'Four times as large'],
        answer: 0,
        explanation:
          'Error is inversely proportional to f B, so doubling B halves the depth error. The quadratic z^2 factor still makes error grow quickly with range.',
        level: 'apply',
      },
      {
        id: 'boss-w2q5',
        question:
          'A wheeled robot dead-reckons at 0.5 m/s with a gyro bias that drifts heading by 2 deg per minute. Over several minutes the lateral position error grows approximately:',
        choices: [
          'Linearly',
          'As the square root of time',
          'Not at all, because speed is constant',
          'Quadratically, because heading error integrates into lateral displacement',
        ],
        answer: 3,
        explanation:
          'Heading error grows linearly, and lateral offset is the integral of speed times heading error, so position error grows with time squared. This is why dead reckoning needs absolute corrections.',
        level: 'analyze',
      },
      {
        id: 'boss-w2q6',
        question: 'Why can a 1550 nm LiDAR emit far more optical power than a 905 nm unit at the same eye-safety class?',
        choices: [
          '1550 nm light is invisible',
          '1550 nm diodes are more efficient',
          'Water absorption in the cornea and lens blocks 1550 nm before it reaches the retina, so retinal hazard is much lower',
          '1550 nm spreads over a wider beam',
        ],
        answer: 2,
        explanation:
          'The anterior eye absorbs 1550 nm, allowing far higher permitted exposure. At 905 nm light reaches the retina, so power is tightly limited even though that wavelength is also invisible.',
        level: 'understand',
      },
      {
        id: 'boss-w2q7',
        question: 'In the pinhole model u = f_x X/Z + c_x, doubling f_x in pixels while sensor size is fixed will:',
        choices: [
          'Double the field of view',
          'Halve the field of view and double the apparent size of an object at the same depth',
          'Leave the image unchanged',
          'Only halve the depth of field',
        ],
        answer: 1,
        explanation:
          'f_x sets pixel magnification. Doubling it at fixed resolution halves the angular field of view, which is exactly why a telephoto lens sees less but larger.',
        level: 'apply',
      },
      {
        id: 'boss-w2q8',
        question: 'A robot must measure a flat glass window at 3 m. Which sensor is most reliable?',
        choices: [
          'Ultrasonic ranger',
          'Infrared triangulation sensor',
          '905 nm LiDAR',
          'Structured-light depth camera',
        ],
        answer: 0,
        explanation:
          'Glass is specular and often transparent at optical wavelengths, so triangulation, LiDAR and structured light miss or pass through the pane. Ultrasound reflects from the air-glass impedance mismatch.',
        level: 'analyze',
      },
      {
        id: 'boss-w2q9',
        question: 'You must run a 224x224 person detector at 30 FPS on a 2 W embedded budget. The most effective first step is:',
        choices: [
          'Train a larger model',
          'Increase input resolution to 640x640',
          'Run the float32 model on the CPU',
          'Quantise the network to int8 and prune to a smaller backbone',
        ],
        answer: 3,
        explanation:
          'int8 quantisation typically gives 2-4x speed and memory gains with small accuracy loss, and a slimmer backbone cuts work per frame. Raising resolution increases cost quadratically.',
        level: 'design',
      },
      {
        id: 'boss-w2q10',
        question: 'Why is multi-position static calibration with the IMU held at known orientations so effective?',
        choices: [
          'It removes sensor noise entirely',
          'It increases the sample rate',
          'Gravity provides a known reference in each pose, so each axis bias and scale factor can be separated',
          'It eliminates the need for a magnetometer',
        ],
        answer: 2,
        explanation:
          'In every static pose the accelerometer should read a known gravity vector. Fitting all poses jointly separates offset from scale and axis misalignment, which a single pose cannot do.',
        level: 'understand',
      },
    ],
  },
  {
    id: 'boss-w3',
    week: 3,
    title: 'The Iron Ordeal',
    subtitle: 'Motor laws, gearing and the discipline of feedback',
    lessonIds: ['w3l5', 'w3l6'],
    xp: 520,
    badgeId: 'nyame-dua',
    questions: [
      {
        id: 'boss-w3q1',
        question:
          'A DC motor has 0.5 N·m stall torque and 3000 rpm no-load speed. Roughly what is its mechanical power at the maximum-power point?',
        choices: ['19.6 W', '39.3 W', '78.5 W', '157 W'],
        answer: 1,
        explanation:
          'Maximum power occurs at half no-load speed and half stall torque: 0.25 N·m x (1500 x 2pi/60) rad/s = 39.3 W.',
        level: 'apply',
      },
      {
        id: 'boss-w3q2',
        question: 'In SI units, how are the torque constant Kt and back-EMF constant Ke related for an ideal DC machine?',
        choices: [
          'Ke = 2 pi Kt',
          'Ke = Kt / 60',
          'They are unrelated',
          'Ke = Kt, because V·s/rad and N·m/A are numerically equal in SI',
        ],
        answer: 3,
        explanation:
          'Energy conservation forces the two constants to be numerically equal in SI. Datasheets that quote Ke in V per 1000 rpm must be converted before comparing.',
        level: 'recall',
      },
      {
        id: 'boss-w3q3',
        question: 'Why does a DC motor draw only a small current at no load?',
        choices: [
          'Back-EMF rises until it nearly cancels the supply, leaving voltage only for friction and iron losses',
          'Armature resistance increases with speed',
          'The brushes disconnect at high speed',
          'Inductance blocks DC',
        ],
        answer: 0,
        explanation:
          'Current is (V - Ke omega)/R. At no load omega is high enough that the remaining voltage covers only friction, so current is small.',
        level: 'understand',
      },
      {
        id: 'boss-w3q4',
        question: 'A 10:1 gearbox drives a load whose inertia is 0.01 kg·m². What inertia does the motor see?',
        choices: ['0.1 kg·m²', '0.01 kg·m²', '0.0001 kg·m²', '0.001 kg·m²'],
        answer: 2,
        explanation:
          'Reflected inertia is J_load / N^2 = 0.01 / 100 = 0.0001 kg·m². Large reductions massively cut the load inertia felt by the motor, which improves controllability.',
        level: 'apply',
      },
      {
        id: 'boss-w3q5',
        question: 'A step change in setpoint causes a large spike in the derivative term. The standard fix is:',
        choices: [
          'Increase Kd further',
          'Differentiate the measurement instead of the error',
          'Remove the integral term',
          'Lower the sample rate',
        ],
        answer: 1,
        explanation:
          'Derivative on measurement keeps the setpoint step out of the derivative path, removing the kick while preserving damping on the feedback signal.',
        level: 'apply',
      },
      {
        id: 'boss-w3q6',
        question: 'An integrator in a velocity controller winds up during a long current-limited acceleration. The best remedy is:',
        choices: [
          'Set Kp to zero',
          'Increase the integral gain',
          'Low-pass filter the setpoint',
          'Clamp the integrator or back-calculate it from the saturated actuator output',
        ],
        answer: 3,
        explanation:
          'Windup is the integrator accumulating error the actuator cannot act on. Conditional integration or back-calculation keeps it consistent with saturation and prevents the overshoot that follows.',
        level: 'analyze',
      },
      {
        id: 'boss-w3q7',
        question:
          'Why does a servo drive usually run its current loop at 10-20 kHz while the position loop runs at about 1 kHz?',
        choices: [
          'Because position sensors are slow',
          'Because current loops matter less',
          'Because electrical dynamics are far faster than mechanical dynamics, so the inner loop must be much faster for the cascade to be stable',
          'Because PWM cannot run slowly',
        ],
        answer: 2,
        explanation:
          'Electrical time constants are a millisecond or less while mechanical motion is much slower. Cascade design requires the inner loop to have far higher bandwidth than the outer one.',
        level: 'apply',
      },
      {
        id: 'boss-w3q8',
        question: 'In the Ziegler-Nichols ultimate-gain method, the classic PID settings from ultimate gain Ku and period Tu are:',
        choices: [
          'Kp = 0.6 Ku, Ti = Tu/2, Td = Tu/8',
          'Kp = Ku, Ti = Tu, Td = Tu',
          'Kp = 0.2 Ku, Ti = Tu/4, Td = Tu/16',
          'Kp = 0.8 Ku, Ti = 2 Tu, Td = Tu/4',
        ],
        answer: 0,
        explanation:
          'The ultimate-gain rules target roughly quarter-amplitude decay and are deliberately aggressive. Treat them as a starting point and retune for your plant and actuator limits.',
        level: 'recall',
      },
      {
        id: 'boss-w3q9',
        question: 'A 1.8 deg stepper is microstepped at 1/16. What is the nominal microstep angle?',
        choices: ['0.9 deg', '0.1125 deg', '0.225 deg', '0.05625 deg'],
        answer: 1,
        explanation:
          '200 full steps per revolution times 16 microsteps gives 3200 microsteps per revolution, so 360/3200 = 0.1125 deg. Microstepping smooths motion but does not deliver that resolution under load.',
        level: 'design',
      },
      {
        id: 'boss-w3q10',
        question: 'What is the main reason to use field-oriented control (FOC) on a BLDC or PMSM?',
        choices: [
          'It removes the need for a position sensor in all cases',
          'It raises the DC bus voltage',
          'It transforms currents into the rotor frame so torque and flux are controlled independently, giving smooth torque and lower losses',
          'It eliminates PWM switching losses',
        ],
        answer: 2,
        explanation:
          'Clarke and Park transforms map stator currents onto dq axes fixed to the rotor, so q-axis current commands torque directly. The result is smooth torque, low ripple and better efficiency than six-step commutation.',
        level: 'design',
      },
    ],
  },
  {
    id: 'boss-w4',
    week: 4,
    title: 'Casting the Bronze Hand',
    subtitle: 'Rotations, frames, Jacobians and the mathematics of reaching',
    lessonIds: ['w4l7', 'w4l8'],
    xp: 540,
    badgeId: 'dwennimmen',
    questions: [
      {
        id: 'boss-w4q1',
        question: 'Which set of properties must a valid rotation matrix R satisfy?',
        choices: [
          'R is symmetric with det R = 0',
          'R has integer entries and trace 3',
          'R is orthogonal with det R = +1, so R^T R = I and handedness is preserved',
          'R is orthogonal with det R = -1',
        ],
        answer: 2,
        explanation:
          'Rotation matrices are orthonormal and proper, with determinant +1. A determinant of -1 is a reflection, which no rigid rotation can produce.',
        level: 'recall',
      },
      {
        id: 'boss-w4q2',
        question: 'A point p is expressed in frame 2. To express it in frame 0 through the chain 0 -> 1 -> 2, you compute:',
        choices: ['p0 = T01 T12 p2', 'p0 = T12 T01 p2', 'p0 = (T01)^T T12 p2', 'p0 = T01 + T12 + p2'],
        answer: 0,
        explanation:
          'Homogeneous transforms compose in chain order, innermost frame first. Order matters because rotations do not commute.',
        level: 'apply',
      },
      {
        id: 'boss-w4q3',
        question: 'What exactly is gimbal lock in a three-parameter Euler angle representation?',
        choices: [
          'The mechanism jams physically',
          'The sensor loses power',
          'All three angles become undefined',
          'A configuration where the first and third rotation axes align, so one rotational degree of freedom is lost in the parameterisation',
        ],
        answer: 3,
        explanation:
          'At a middle rotation of about 90 deg the outer axes coincide, leaving only two independent rotations representable. The physical orientation is fine; the parameterisation is singular, which quaternions avoid.',
        level: 'understand',
      },
      {
        id: 'boss-w4q4',
        question: 'In the standard Denavit-Hartenberg convention, a revolute joint is described by four parameters. Which set is correct?',
        choices: [
          'x, y, z and theta only',
          'a_i link length, alpha_i link twist, d_i link offset, theta_i joint angle',
          'Kp, Ki, Kd and N',
          'length, mass, inertia and damping',
        ],
        answer: 1,
        explanation:
          'Each DH row uses the two constant link dimensions a and alpha plus the variable joint angle theta, with the constant offset d. That gives a minimal four-parameter description per link.',
        level: 'apply',
      },
      {
        id: 'boss-w4q5',
        question: 'The Pieper condition states that a closed-form inverse kinematic solution exists when:',
        choices: [
          'All joints are prismatic',
          'The robot has fewer than six joints',
          'The Jacobian is never singular',
          'Three consecutive joint axes intersect at a point or are parallel',
        ],
        answer: 3,
        explanation:
          'That geometric structure decouples position from orientation, which is exactly the spherical-wrist and parallel-axis case solved in closed form.',
        level: 'analyze',
      },
      {
        id: 'boss-w4q6',
        question: 'What happens at a kinematic singularity of a serial manipulator?',
        choices: [
          'The Jacobian loses rank, so some Cartesian directions require unbounded joint velocities',
          'The arm cannot move at all',
          'Joint torques drop to zero',
          'The end effector leaves the workspace',
        ],
        answer: 0,
        explanation:
          'Rank loss makes the joint-to-Cartesian velocity map non-invertible, so a finite Cartesian velocity can demand infinite joint rates. It appears as manipulability sqrt(det(J J^T)) falling to zero.',
        level: 'analyze',
      },
      {
        id: 'boss-w4q7',
        question: 'Which technique gives stable inverse kinematics when the arm passes near a singularity?',
        choices: [
          'Plain Jacobian inverse',
          'Transpose-only control with very high gain',
          'Damped least squares, J^T (J J^T + lambda^2 I)^-1',
          'Ignoring the Jacobian',
        ],
        answer: 2,
        explanation:
          'The damping term limits joint velocities near rank loss at the cost of a small tracking error, trading exactness for continuity. Choosing lambda balances accuracy against stability.',
        level: 'design',
      },
      {
        id: 'boss-w4q8',
        question: 'A quintic polynomial joint trajectory has six coefficients. Which boundary conditions does it satisfy?',
        choices: [
          'Position only at both ends',
          'Position, velocity and acceleration at both ends',
          'Jerk only at both ends',
          'Position and jerk at both ends',
        ],
        answer: 1,
        explanation:
          'Six unknowns match three constraints at each end. Continuous acceleration means far less excitation of structural vibration than a cubic, which matches only position and velocity.',
        level: 'apply',
      },
      {
        id: 'boss-w4q9',
        question: 'Why is an S-curve velocity profile preferred over a trapezoidal profile for a heavy arm?',
        choices: [
          'It is faster in every case',
          'It needs no trajectory planning',
          'It removes the need for feedback',
          'It bounds jerk, avoiding the acceleration steps that shake the structure',
        ],
        answer: 3,
        explanation:
          'Trapezoidal profiles change acceleration instantaneously, implying infinite jerk. S-curves ramp acceleration and thus excite far less vibration in flexible arms and gearboxes.',
        level: 'analyze',
      },
      {
        id: 'boss-w4q10',
        question: 'A 7-DOF redundant arm must reach behind an obstacle. Which inverse kinematic approach fits best?',
        choices: [
          'Numerical IK with a task-priority null-space term and randomised restarts',
          'Closed-form IK for the wrist centre only',
          'Purely analytic IK with no redundancy handling',
          'Open-loop joint interpolation from the home pose',
        ],
        answer: 0,
        explanation:
          'Redundancy means infinitely many joint solutions for one tool pose. Numerical solvers with null-space projection use the extra DOF for obstacle, joint-limit and posture objectives.',
        level: 'design',
      },
    ],
  },
  {
    id: 'boss-w5',
    week: 5,
    title: 'The 256-Path Gauntlet',
    subtitle: 'Dynamics, mobile platforms and the real-time machinery underneath',
    lessonIds: ['w5l9', 'w5l10'],
    xp: 560,
    badgeId: 'akoma',
    questions: [
      {
        id: 'boss-w5q1',
        question: 'Which statement about the two standard formulations of manipulator dynamics is correct?',
        choices: [
          'Lagrangian dynamics cannot include gravity',
          'Newton-Euler cannot handle closed chains',
          'Both ignore Coriolis effects',
          'Newton-Euler recursion computes inverse dynamics in O(n) for real-time control, while the Lagrangian gives the closed form M(q)qdd + C(q,qd)qd + g(q) = tau',
        ],
        answer: 3,
        explanation:
          'The recursive Newton-Euler algorithm is linear in the number of links and is what real controllers run. The Lagrangian form exposes structure such as the mass matrix and Coriolis terms, which is valuable for analysis.',
        level: 'recall',
      },
      {
        id: 'boss-w5q2',
        question: 'Which property must the manipulator mass matrix M(q) have?',
        choices: [
          'It is always diagonal and constant',
          'It is symmetric and positive definite, so it is always invertible',
          'It is skew-symmetric',
          'It is singular at every configuration',
        ],
        answer: 1,
        explanation:
          'Kinetic energy is a positive-definite quadratic form, which makes M symmetric positive definite. Its inverse is needed to compute joint accelerations from applied torques.',
        level: 'apply',
      },
      {
        id: 'boss-w5q3',
        question:
          'A differential-drive robot has wheel radius 0.05 m and wheel separation 0.3 m. With wheel speeds 10 rad/s and 6 rad/s, its linear and angular velocity are approximately:',
        choices: [
          'v = 0.2 m/s, omega = 0.67 rad/s',
          'v = 0.8 m/s, omega = 0.33 rad/s',
          'v = 0.4 m/s, omega = 0.67 rad/s',
          'v = 0.4 m/s, omega = 0.13 rad/s',
        ],
        answer: 2,
        explanation:
          'v = r(omega_r + omega_l)/2 = 0.05 x 16/2 = 0.4 m/s, and omega = r(omega_r - omega_l)/L = 0.05 x 4/0.3 = 0.67 rad/s.',
        level: 'apply',
      },
      {
        id: 'boss-w5q4',
        question: 'What is the main practical drawback of a mecanum-wheel platform compared with a differential drive?',
        choices: [
          'It cannot move sideways',
          'It cannot rotate in place',
          'It has no kinematic model',
          'Roller slip makes odometry unreliable and wastes energy, and each wheel needs independent closed-loop speed control',
        ],
        answer: 3,
        explanation:
          'Mecanum rollers slip continuously by design, so wheel-speed odometry is poor and efficiency is low. The payoff is omnidirectional motion, which requires four independently controlled wheels.',
        level: 'analyze',
      },
      {
        id: 'boss-w5q5',
        question: 'For an Ackermann-steered vehicle, the inner front wheel must:',
        choices: [
          'Turn by the same angle as the outer wheel',
          'Turn more than the outer wheel, because it follows a tighter radius',
          'Stay straight',
          'Turn through 90 degrees',
        ],
        answer: 1,
        explanation:
          'The inner wheel tracks a tighter radius, so Ackermann geometry makes it steer through a larger angle than the outer wheel. Equal angles would make the tyres scrub sideways.',
        level: 'understand',
      },
      {
        id: 'boss-w5q6',
        question: 'For a legged robot, the zero-moment point (ZMP) criterion requires that:',
        choices: [
          'The centre of mass stays fixed',
          'Both feet are always on the ground',
          'Joint torques are zero',
          'The ZMP stays inside the support polygon, meaning the ground reaction can be modelled as a single point under the foot area',
        ],
        answer: 3,
        explanation:
          'The ZMP is where the resultant ground reaction acts. Keeping it inside the support polygon guarantees the foot does not need to roll or tip for a walking gait.',
        level: 'analyze',
      },
      {
        id: 'boss-w5q7',
        question:
          'A 10 kg robot consumes 50 W while travelling at 1 m/s. Its dimensionless cost of transport is about:',
        choices: ['0.05', '0.51', '5.1', '50'],
        answer: 1,
        explanation:
          'CoT = P / (m g v) = 50 / (10 x 9.81 x 1) = 0.51. Humans walk at roughly 0.2 and wheeled vehicles are far lower, so the number is only meaningful with its locomotion class stated.',
        level: 'apply',
      },
      {
        id: 'boss-w5q8',
        question:
          'A car-like robot has three configuration variables (x, y, heading) but only two control inputs (drive and steer). What does this imply?',
        choices: [
          'It is uncontrollable',
          'It can move directly sideways',
          'It is nonholonomic: it cannot follow arbitrary paths, though it can still reach any pose through manoeuvres',
          'It has no kinematic constraints',
        ],
        answer: 2,
        explanation:
          'The velocity constraint forbids sideways motion, so the robot cannot track arbitrary curves. It remains controllable, but parking or docking needs multi-step manoeuvres.',
        level: 'analyze',
      },
      {
        id: 'boss-w5q9',
        question: 'A high-priority control task blocks on a mutex held by a low-priority task, letting a medium-priority task run. The remedy is:',
        choices: [
          'Disable all interrupts',
          'Increase the medium task priority',
          'Add a delay to the control task',
          'Use a priority-inheritance or priority-ceiling mutex so the low-priority holder is boosted and releases quickly',
        ],
        answer: 3,
        explanation:
          'This is unbounded priority inversion. Priority inheritance temporarily raises the holder to the waiter priority, bounding the blocking time; a priority-ceiling protocol prevents the situation by construction.',
        level: 'design',
      },
      {
        id: 'boss-w5q10',
        question:
          'A 12-bit ADC with 3.3 V reference measures a signal with 5 mV RMS noise, and the sensor output swings over only 0.5 V. The most useful improvement is:',
        choices: [
          'Use a 16-bit ADC and keep the same front end',
          'Amplify and level-shift the signal to fill the input range before conversion',
          'Increase the sample rate alone',
          'Average more samples without changing anything else',
        ],
        answer: 1,
        explanation:
          'Effective number of bits is set by noise and by how much of the input range the signal uses. Conditioning the signal to span the full range lifts ENOB far more cheaply than swapping to a wider converter, whose extra bits would sit in noise.',
        level: 'design',
      },
    ],
  },
  {
    id: 'boss-w6',
    week: 6,
    title: 'Griot of the Swarm',
    subtitle: 'Estimation, mapping, planning and learning to act under uncertainty',
    lessonIds: ['w6l11', 'w6l12'],
    xp: 580,
    badgeId: 'adinkrahene',
    questions: [
      {
        id: 'boss-w6q1',
        question: 'In a recursive Bayes filter, what happens in the two alternating steps?',
        choices: [
          'Prediction smooths the measurement, update removes noise',
          'Prediction computes the Kalman gain, update inverts the covariance',
          'Prediction propagates belief through the motion model, update corrects it with the measurement likelihood',
          'Prediction is only used offline, update only online',
        ],
        answer: 2,
        explanation:
          'The motion model spreads belief forward in time; the measurement model reweights it by how likely each state is given the observation. Every Kalman, histogram and particle filter is this loop with a different belief representation.',
        level: 'recall',
      },
      {
        id: 'boss-w6q2',
        question: 'In a Kalman filter, if the measurement noise covariance R grows very large, the Kalman gain K tends to:',
        choices: [
          'Zero, so the estimate trusts the model prediction',
          'One, so the estimate equals the measurement',
          'Infinity',
          'It is unaffected',
        ],
        answer: 0,
        explanation:
          'The gain weighs prediction against measurement by their relative uncertainty. A very noisy sensor therefore barely moves the estimate.',
        level: 'apply',
      },
      {
        id: 'boss-w6q3',
        question: 'Which comparison of EKF, UKF and particle filters is correct?',
        choices: [
          'The EKF is exact for all nonlinear systems',
          'The UKF requires no model',
          'Particle filters are cheaper than an EKF in high dimensions',
          'The EKF linearises about the current estimate, the UKF propagates sigma points through the true nonlinearity, and particle filters represent arbitrary multimodal beliefs at O(N) cost',
        ],
        answer: 3,
        explanation:
          'Linearisation error is the EKF weakness; sigma points capture curvature without derivatives. Particle filters handle multimodality and non-Gaussian noise but scale badly with state dimension.',
        level: 'analyze',
      },
      {
        id: 'boss-w6q4',
        question: 'Why is loop closure essential in SLAM?',
        choices: [
          'It increases the LiDAR scan rate',
          'It removes the need for odometry',
          'It prevents the map from becoming a graph',
          'Recognising a previously visited place lets the optimiser distribute accumulated drift across the whole trajectory instead of letting it grow without bound',
        ],
        answer: 3,
        explanation:
          'Odometry drift is unavoidable, so a long loop returns to a misplaced pose. Adding the loop constraint and solving the pose graph pulls the trajectory back into consistency.',
        level: 'analyze',
      },
      {
        id: 'boss-w6q5',
        question: 'Which condition is a classic failure mode for visual-inertial odometry?',
        choices: [
          'Textured surfaces with good lighting',
          'Slow, smooth motion',
          'Feature-poor or repeating texture, motion blur, and IMU saturation during hard impacts',
          'Having both a camera and an IMU',
        ],
        answer: 2,
        explanation:
          'VIO needs trackable features and a well-scaled inertial signal. Blank walls, aliased textures, rolling-shutter blur and clipped accelerometers all break the estimator, often silently.',
        level: 'analyze',
      },
      {
        id: 'boss-w6q6',
        question: 'Which statement about A* and RRT* is correct?',
        choices: [
          'A* is optimal on a graph given an admissible heuristic, while RRT* is asymptotically optimal in continuous spaces through sampling and rewiring',
          'A* always beats RRT* in continuous spaces',
          'RRT* cannot handle obstacles',
          'Neither can handle joint-limit constraints',
        ],
        answer: 0,
        explanation:
          'A* exhausts a discretised graph, so its optimality is only as good as the grid. RRT* handles high-dimensional continuous spaces and converges to an optimal path as samples increase, at the cost of slower early solutions.',
        level: 'apply',
      },
      {
        id: 'boss-w6q7',
        question: 'What defines model predictive control?',
        choices: [
          'A lookup table indexed by error',
          'A purely reactive policy with no model',
          'An offline optimiser run once at design time',
          'It solves a constrained optimisation over a receding horizon at every control step, applies only the first input, then repeats',
        ],
        answer: 3,
        explanation:
          'The receding-horizon loop gives constraint handling and preview, which PID cannot provide. The cost is that a model and a real-time optimisation must both exist and be trustworthy.',
        level: 'understand',
      },
      {
        id: 'boss-w6q8',
        question:
          'You must learn a continuous joint-torque policy for a 7-DOF arm. Which algorithm class is appropriate?',
        choices: [
          'DQN, because it is value-based',
          'PPO or SAC, because they handle continuous action spaces directly',
          'A tabular Q-learning agent',
          'A classifier trained on expert labels only',
        ],
        answer: 1,
        explanation:
          'DQN requires a discrete, enumerable action set, which is hopeless for continuous torques. PPO and SAC output continuous action distributions; SAC is typically more sample-efficient because it is off-policy.',
        level: 'design',
      },
      {
        id: 'boss-w6q9',
        question: 'What is the purpose of domain randomisation in sim-to-real transfer?',
        choices: [
          'To make the simulator faster',
          'To remove the need for real-world testing',
          'To randomise physical and visual parameters during training so the policy generalises to the unknown real parameters',
          'To reduce the number of training episodes',
        ],
        answer: 2,
        explanation:
          'The real system is one sample from a distribution over masses, frictions, delays and lighting. Training across that distribution turns the reality gap into a robustness requirement the policy already satisfies.',
        level: 'design',
      },
      {
        id: 'boss-w6q10',
        question: 'A safety shield or control barrier function is used with a learned policy in order to:',
        choices: [
          'Filter the proposed action so the system stays inside a certified safe set, overriding the policy when necessary',
          'Speed up policy inference',
          'Replace the reward function',
          'Increase exploration during training',
        ],
        answer: 0,
        explanation:
          'The learned policy proposes and the shield disposes. A CBF gives a provable forward-invariance condition, so safety no longer depends on the neural network being correct.',
        level: 'design',
      },
    ],
  },
  {
    id: 'boss-w7',
    week: 7,
    title: 'Standard of the Living Machine',
    subtitle: 'Robot middleware, industrial networks and the law of safe collaboration',
    lessonIds: ['w7l13', 'w7l14'],
    xp: 600,
    badgeId: 'fihankra',
    questions: [
      {
        id: 'boss-w7q1',
        question: 'In ROS 2, which statement about quality of service is correct?',
        choices: [
          'QoS only affects logging',
          'QoS is fixed for all topics',
          'Reliable QoS is always required for control',
          'QoS policies such as reliability, durability and history depth must be compatible between publisher and subscriber, and sensor streams often use best-effort to avoid stale data',
        ],
        answer: 3,
        explanation:
          'Reliable delivery retries lost samples, which can add latency to a high-rate sensor stream. Best-effort plus a shallow history keeps the newest data flowing, and mismatched QoS silently prevents a connection.',
        level: 'recall',
      },
      {
        id: 'boss-w7q2',
        question: 'What is a hard requirement of the TF2 frame tree?',
        choices: [
          'Every frame must be a sensor frame',
          'Each frame has exactly one parent, so the tree cannot contain cycles',
          'All transforms must be static',
          'Transforms may only be published at 1 Hz',
        ],
        answer: 1,
        explanation:
          'A single-parent tree guarantees exactly one transform chain between any two frames. Cycles make lookups ambiguous and are rejected by TF2.',
        level: 'understand',
      },
      {
        id: 'boss-w7q3',
        question: 'Which three security features does SROS2 provide for DDS traffic?',
        choices: [
          'Compression, caching and logging',
          'Firewalling, NAT and VPN',
          'Authentication, encryption and access control',
          'Rate limiting, retries and batching',
        ],
        answer: 2,
        explanation:
          'Authentication proves node identity, encryption protects payloads, and access control limits which nodes may publish or subscribe to which topics.',
        level: 'apply',
      },
      {
        id: 'boss-w7q4',
        question: 'You must link 5000 low-power soil sensors across a 10 km farm with tiny payloads. The best fit is:',
        choices: [
          'LoRaWAN, because it trades data rate for long range and years of battery life',
          'Wi-Fi 6 mesh, because it has high throughput',
          'EtherCAT, because it is deterministic',
          'USB 3, because it is simple',
        ],
        answer: 0,
        explanation:
          'LoRaWAN provides kilometres of range at 0.3-50 kbit/s with very low duty cycles, ideal for sparse telemetry. Wi-Fi and wired fieldbuses fail on range, power and wiring cost respectively.',
        level: 'apply',
      },
      {
        id: 'boss-w7q5',
        question: 'Which practice is essential for safe over-the-air updates across a robot fleet?',
        choices: [
          'Updating all robots simultaneously',
          'Removing signatures to reduce update size',
          'Storing the update only in RAM',
          'Signed images with A/B partitions, a staged rollout and an automatic rollback path',
        ],
        answer: 3,
        explanation:
          'A/B partitions keep a known-good image to fall back on, and staged rollout limits blast radius. Signing prevents an attacker or a corrupted download from bricking the fleet.',
        level: 'understand',
      },
      {
        id: 'boss-w7q6',
        question: 'ISO 12100 defines the risk assessment process for machinery as:',
        choices: [
          'A one-off check performed after installation',
          'An iterative loop of hazard identification, risk estimation and risk reduction, repeated until residual risk is acceptable',
          'A calculation of mean time between failures only',
          'A purchasing guideline for robots',
        ],
        answer: 1,
        explanation:
          'The standard is explicit that assessment continues after each protective measure, because reducing one risk can introduce another. It is the umbrella framework that the type-A, B and C standards plug into.',
        level: 'recall',
      },
      {
        id: 'boss-w7q7',
        question:
          'Under ISO/TS 15066 power-and-force limiting, quasi-static contact with a hand or finger is generally limited to around:',
        choices: ['14 N', '40 N', '140 N', '1400 N'],
        answer: 2,
        explanation:
          'Annex A gives body-region limits; the hand and finger quasi-static value is about 140 N, with roughly double that permitted for transient contact. Limits are lower for the face and higher for the back and legs.',
        level: 'apply',
      },
      {
        id: 'boss-w7q8',
        question: 'In IEC 60204-1, a stop category 1 means:',
        choices: [
          'Power is removed immediately by electromechanical means',
          'Power is never removed',
          'The machine stops under power, then power is removed once standstill is confirmed',
          'Only the control electronics are reset',
        ],
        answer: 2,
        explanation:
          'Category 0 is an uncontrolled immediate removal of power, category 1 is a controlled stop followed by removal, and category 2 is a controlled stop with power left on for a monitored restart.',
        level: 'apply',
      },
      {
        id: 'boss-w7q9',
        question: 'How do ISO 13849-1 performance levels map onto IEC 61508 safety integrity levels?',
        choices: [
          'PL a equals SIL 3',
          'PL d corresponds to roughly SIL 2 and PL e to roughly SIL 3',
          'There is no relationship at all',
          'Every PL maps to SIL 1',
        ],
        answer: 1,
        explanation:
          'PL d / SIL 2 and PL e / SIL 3 are the standard equivalences used when integrating a robot safety function. The mapping is approximate because the two frameworks assess architecture differently.',
        level: 'analyze',
      },
      {
        id: 'boss-w7q10',
        question: 'What does ISO 21448 (SOTIF) address that functional-safety standards do not?',
        choices: [
          'Hazards from performance limitations and reasonably foreseeable misuse, in the absence of any component fault',
          'Electrical wiring colours',
          'Robot payload ratings',
          'Network cable shielding',
        ],
        answer: 0,
        explanation:
          'SOTIF targets insufficiencies such as an object detector failing in low sun, where nothing is broken. UL 4600 then covers the full autonomy safety case, including validation arguments.',
        level: 'understand',
      },
    ],
  },
  {
    id: 'boss-w8',
    week: 8,
    title: 'Coronation at the Core',
    subtitle: 'Design for manufacture, hard reliability, frontier energy and honest judgement',
    lessonIds: ['w8l15', 'w8l16'],
    xp: 600,
    badgeId: 'nkyinkyim',
    questions: [
      {
        id: 'boss-w8q1',
        question: 'In GD&T, what does a position tolerance with a maximum-material-condition modifier allow?',
        choices: [
          'A larger tolerance always',
          'No tolerance at all at MMC',
          'Bonus tolerance as the actual feature departs from maximum material condition, up to the stated limit',
          'The datum to be ignored',
        ],
        answer: 2,
        explanation:
          'The MMC modifier grants extra positional tolerance equal to the departure from MMC, which better matches how a clearance hole actually functions and reduces scrap without weakening assembly.',
        level: 'recall',
      },
      {
        id: 'boss-w8q2',
        question:
          'Three stacked dimensions have independent tolerances of ±0.1 mm each. Worst-case and statistical (RSS) stack-ups give approximately:',
        choices: [
          '±0.3 mm worst case and ±0.17 mm RSS',
          '±0.3 mm for both',
          '±0.1 mm worst case and ±0.3 mm RSS',
          '±0.03 mm for both',
        ],
        answer: 0,
        explanation:
          'Worst case adds absolute values: 0.1 + 0.1 + 0.1 = 0.3 mm. RSS adds variances: sqrt(0.01 + 0.01 + 0.01) = 0.173 mm, valid only for independent, centred distributions.',
        level: 'apply',
      },
      {
        id: 'boss-w8q3',
        question: 'Why is an FDM-printed part typically weaker along its build direction?',
        choices: [
          'The plastic cures differently on the top surface',
          'Gravity compresses the lower layers',
          'The nozzle is hotter for the first layer',
          'Layer-to-layer bonding is weaker than the extruded road itself, so strength in Z can be roughly half of the in-plane strength',
        ],
        answer: 3,
        explanation:
          'Bead-to-bead welds are partial and cool before the next layer arrives. Orient the part so service loads run in-plane, and anneal or use a different process when Z loads are unavoidable.',
        level: 'understand',
      },
      {
        id: 'boss-w8q4',
        question: 'Which feature is a design-for-injection-moulding problem?',
        choices: [
          'Uniform 2 mm wall thickness',
          'A 1.5 deg draft angle on all vertical faces',
          'Screw bosses with generous radii',
          'Thick sections next to thin ones, creating sink marks and warping',
        ],
        answer: 3,
        explanation:
          'Non-uniform walls cool at different rates, causing sink and warp. Uniform walls, adequate draft and cored-out thick regions keep the part mouldable and dimensionally stable.',
        level: 'analyze',
      },
      {
        id: 'boss-w8q5',
        question: 'What does HALT contribute to a reliability programme?',
        choices: [
          'It replaces field testing entirely',
          'It proves compliance with EMC limits',
          'It applies stepped stress beyond specification to find operating and destruct limits quickly, guiding design margins',
          'It measures only cosmetic wear',
        ],
        answer: 2,
        explanation:
          'HALT is a qualitative, fast method that exposes weaknesses by stressing temperature, vibration and voltage until failure. Quantitative MTBF figures then come from modelling and reliability growth testing, not from HALT alone.',
        level: 'apply',
      },
      {
        id: 'boss-w8q6',
        question: 'On an Ashby chart, selecting a material for a stiff, lightweight beam uses which performance index?',
        choices: ['rho / E', 'E x rho', 'rho / E^2', 'E^(1/2) / rho'],
        answer: 3,
        explanation:
          'Minimising mass for a given stiffness and length gives an index proportional to the square root of Young modulus over density. This is why carbon-fibre composites win for stiffness-critical links.',
        level: 'design',
      },
      {
        id: 'boss-w8q7',
        question: 'In the standard Technology Readiness Level scale, TRL 6 means:',
        choices: [
          'Basic principles observed',
          'A prototype demonstrated in a relevant environment',
          'A system proven in operational environment',
          'A concept formulated on paper',
        ],
        answer: 1,
        explanation:
          'TRL 4 is lab validation, TRL 6 is a relevant environment, and TRL 9 is proven in operations. Investors and grant reviewers use the level to judge what evidence still has to be produced.',
        level: 'understand',
      },
      {
        id: 'boss-w8q8',
        question: 'Which statement about space power for a lunar surface robot is accurate?',
        choices: [
          'An MMRTG delivers about 110 W electrical while a fission surface power unit can deliver kilowatts to tens of kilowatts',
          'RTGs deliver megawatts',
          'Solar power is equally available during the lunar night',
          'Fission surface power has already flown on every rover',
        ],
        answer: 0,
        explanation:
          'The MMRTG produces roughly 110 W electrical from about 2000 W thermal. Fission surface power aims at 10 kWe class units, and the 1 kWe KRUSTY test ran in 2018; nothing fission-powered has flown on a rover.',
        level: 'apply',
      },
      {
        id: 'boss-w8q9',
        question: 'Which claim about quantum technology in robotics is honest?',
        choices: [
          'Quantum computers already plan robot paths faster than classical CPUs',
          'Quantum LiDAR beats classical LiDAR for every range and condition',
          'NV-centre magnetometry gives real nT-level magnetometry in a room-temperature solid, while quantum computing offers no demonstrated advantage for mainstream robotics today',
          'Quantum sensors need no calibration',
        ],
        answer: 2,
        explanation:
          'Sensing is the mature side: NV centres, atomic clocks and atom interferometers have measured performance. Quantum computing advantages remain narrow and hardware-limited, so claims of general robotics speedups are hype.',
        level: 'analyze',
      },
      {
        id: 'boss-w8q10',
        question: 'A mycelium-based bio-hybrid robot is proposed for soil monitoring. Which is the correct ethical and engineering position?',
        choices: [
          'Ethics do not apply to fungi',
          'Containment is unnecessary because the organism is natural',
          'The robot should be sterilised only at end of life',
          'Containment, substrate sterilisation and a genetic or thermal kill-switch are design requirements, and any claim of sensing or actuation must be backed by measured performance',
        ],
        answer: 3,
        explanation:
          'A living machine can reproduce and escape, so biosafety is part of the design, not an afterthought. Living materials are slow and variable, so their real capability must be measured rather than assumed from the metaphor.',
        level: 'design',
      },
    ],
  },
];

