/**
 * Plain-language study guides: one entry per lesson.
 * Written for a confused beginner: what it is, why it matters, what to remember.
 */

export interface LessonGuide {
  lessonId: string;
  /** 2-3 sentences in plain English: what this lesson is actually about, no jargon, no formulas */
  plain: string;
  /** a concrete everyday analogy that makes the core idea click */
  analogy: string;
  /** the single sentence to remember if they forget everything else */
  remember: string;
  /** a real-world job or product where this material is used, with a specific company or machine if possible */
  realWorld: string;
  /** the specific lesson ids that must make sense first, empty array if none */
  prereqs: string[];
  /** 3 short bullets: the minimum viable things to be able to do after the lesson */
  canDo: string[];
  /** the one misconception beginners most often have about this topic */
  misconception: string;
}

export const lessonGuides: LessonGuide[] = [
  {
    lessonId: 'w1l1',
    plain:
      'A robot is any machine that repeats one three-beat cycle: it senses the world, decides what to do, then acts, and then does it all again. This lesson shows how to spot that loop in real machines, how much decision-making a machine is allowed to keep for itself, and the different shapes robots come in.',
    analogy:
      'A home thermostat: it reads the room, compares that with the number you set, and switches the boiler on or off; the loop is the machine, not the plastic box.',
    remember: 'No feedback loop, no robot — just a machine going through the motions.',
    realWorld:
      'Waymo self-driving cars (SAE Level 4 inside a mapped area) and Universal Robots UR5e arms on factory lines.',
    prereqs: [],
    canDo: [
      'Label any machine as open loop or closed loop and say which part senses, plans and acts.',
      'Place a robot on the SAE J3016 0-5 levels and justify the level from what it can decide alone.',
      'Compare two arms on payload, reach, repeatability and duty cycle and pick one for a job.',
    ],
    misconception:
      'That a robot must look human and be intelligent; most useful robots are single-purpose loops with no cleverness at all.',
  },
  {
    lessonId: 'w1l2',
    plain:
      'A robot is a chain of rigid parts connected by joints, and each joint takes away one way the tool could move while leaving others free. This lesson teaches you to count those freedoms, work out where the tool can reach, and choose the right gripper or tool for the end of the chain.',
    analogy:
      'A bicycle frame: each tube is rigid, each moving part at the handlebars or pedals adds one specific motion, and the frame flexes a little under load.',
    remember: 'Count the joints and you have counted the robot, but stiffness decides what it can hold.',
    realWorld:
      'Universal Robots UR5e (six revolute joints) and ABB Delta parallel robots for fast pick-and-place.',
    prereqs: ['w1l1'],
    canDo: [
      'Name the standard joint types and count how many freedoms each one adds.',
      'Apply the mobility formula to a simple planar mechanism and check the answer by hand.',
      'Explain backlash and compliance and say which one hurts accuracy versus repeatability.',
    ],
    misconception:
      'That more joints always means a better robot; each joint adds weight, flex and its own error, so six is usually plenty.',
  },
  {
    lessonId: 'w2l3',
    plain:
      'This lesson is about a robot sensing its own body: how far each joint has turned, how fast it is turning, and which way it is tilting. It also explains why those readings are never perfectly true — they are fuzzy, they slowly drift, and they change with temperature — and how calibration and mixing two sensors can fix a lot of that.',
    analogy:
      'A bicycle odometer plus a compass: the odometer tracks how far you have rolled but never tells you where you started, and the compass slowly wanders off north.',
    remember: 'All body sensing drifts, so calibrate it and fuse two sensors that fail differently.',
    realWorld:
      'Magnetic and optical encoders from Broadcom and CUI Devices on robot joints, and Bosch and TDK MEMS IMUs inside drones and phones.',
    prereqs: ['w1l1'],
    canDo: [
      'Read an encoder datasheet and compute angular resolution in degrees per count.',
      'Read an Allan deviation plot and name the drift figure that matters for a chosen run time.',
      'Calibrate an accelerometer in six positions and combine it with a gyro in a complementary filter.',
    ],
    misconception:
      'That an expensive sensor removes the need for calibration; bias, scale error and temperature drift affect good sensors too.',
  },
  {
    lessonId: 'w2l4',
    plain:
      'This lesson covers outward-facing senses: distance sensors that time a sound or light pulse, cameras in pairs that judge depth, and spinning laser scanners that draw a 3D map of a room. The main lesson is that each sensor works inside narrow conditions and fails in a specific, predictable way, so you pick deliberately and calibrate before you trust it.',
    analogy:
      'A flashlight in fog: it shows you something close and straight ahead, but it misses anything off to the side, and a mirror or a black wall can fool it.',
    remember: 'Every sensor is a contract that includes its failure mode — read the fine print.',
    realWorld:
      'RPLIDAR scanners on warehouse robots, Velodyne and Ouster LiDAR on vehicles, and Sony IMX camera sensors with the OpenCV toolkit.',
    prereqs: ['w2l3'],
    canDo: [
      'Compute range from pulse travel time and correct it for air temperature.',
      'Choose between ultrasonic, time-of-flight, LiDAR, radar and stereo for a stated job with reasons.',
      'Calibrate camera intrinsics with a checkerboard and state the calibration error in pixels.',
    ],
    misconception:
      'That a depth camera records true distance everywhere; depth error grows with the square of distance, and glass and mirrors break it.',
  },
  {
    lessonId: 'w3l5',
    plain:
      'Motors convert electrical energy into turning force, and this lesson explains the trade: ask for more turning force and you get less speed, and whatever is not turning into motion becomes heat. It also covers gearboxes that swap speed for force, the electronics that drive motors smoothly, and how to size a motor so the winding survives the mission.',
    analogy:
      'A car engine: flooring it from standstill makes torque and heat but no speed, and coasting at the redline makes noise and almost no useful pull.',
    remember: 'A motor makes heat first and motion second — the leftover is your torque.',
    realWorld:
      'Dynamixel servos in hobby and research arms, ODrive brushless controllers, and Tesla and Bosch traction motors using field-oriented control.',
    prereqs: ['w1l2'],
    canDo: [
      'Read a torque-speed curve and mark stall torque, no-load speed and peak power.',
      'Size a motor and gearbox for a stated load and check the reflected inertia.',
      'Estimate winding temperature rise at a duty cycle and say whether the motor survives.',
    ],
    misconception:
      'That a stalled motor is safe because it is not spinning; at stall all the electrical power becomes heat and the winding burns.',
  },
  {
    lessonId: 'w3l6',
    plain:
      'A controller watches the gap between what you asked for and what you actually got, then nudges the machine to shrink that gap. This lesson explains the three classic nudges — push harder when the gap is big, push a little more while the gap persists, and ease off when the gap is closing fast — plus how to stop the machine from shaking itself apart.',
    analogy:
      'Shower taps: the first turn is the main push, small repeated tweaks fix a stubborn trickle, and you stop overshooting by easing back before the water is hot enough.',
    remember: 'Tune for the worst delay, not the average one — late corrections cause the ringing.',
    realWorld:
      'PID loops in drone flight controllers such as PX4 and ArduPilot, and temperature and motion loops in industrial machines.',
    prereqs: ['w3l5'],
    canDo: [
      'Explain what proportional, integral and derivative action each contribute and what each ruins.',
      'Implement a fixed-rate PID with anti-windup and a filtered derivative term.',
      'Tune a loop by hand or by a relay test and read phase margin to judge stability.',
    ],
    misconception:
      'That the goal is the fastest possible response; a loop tuned right at the edge of stability rings and fails on the day the load changes.',
  },
  {
    lessonId: 'w4l7',
    plain:
      'This lesson is about describing where a robot tool is and which way it is pointing, and about working out the tool position from the joint angles. It introduces the standard bookkeeping tools — rotation matrices and quaternions — and how to chain them from the base of the robot out to the tool tip.',
    analogy:
      'Folding a paper map: each fold moves the next drawable line relative to the last one, so you walk from the base outward to find where the tip ends up.',
    remember: 'Fix the frames first and the geometry becomes arithmetic you can chain.',
    realWorld:
      'Universal Robots controllers and ROS 2 using URDF files, plus quaternions in every drone autopilot.',
    prereqs: ['w1l2'],
    canDo: [
      'Write a pose as six numbers and state which frame they are measured in.',
      'Build a DH table for a simple arm and compute forward kinematics numerically.',
      'Convert one attitude between rotation matrix, Euler angles and a unit quaternion.',
    ],
    misconception:
      'That rotation order does not matter; rotating about x then y lands somewhere different from y then x.',
  },
  {
    lessonId: 'w4l8',
    plain:
      'This lesson runs the geometry backwards: given where you want the tool to be, work out the joint angles that get it there. It explains why the same spot can often be reached several ways, why some poses are traps where the arm must move impossibly fast, and how to plan the motion so it is smooth instead of jerky.',
    analogy:
      'A chess piece: you care where the piece lands, not how the rook got there, but some routes are illegal and one square makes the piece useless.',
    remember: 'Inverse kinematics has many answers, and the hard part is choosing one the arm can follow.',
    realWorld:
      'FANUC and KUKA arm controllers running joint-space interpolation, and ROS 2 MoveIt for motion planning.',
    prereqs: ['w4l7'],
    canDo: [
      'Solve inverse kinematics for a 2R planar arm and verify the answer with forward kinematics.',
      'Read a Jacobian, compute its condition number and identify a singular pose.',
      'Plan a trapezoidal or S-curve trajectory and state its peak velocity and acceleration.',
    ],
    misconception:
      'That inverse kinematics always has one exact answer; outside the workspace there is none, and inside it there are often several.',
  },
  {
    lessonId: 'w5l9',
    plain:
      'Kinematics says where to move; this lesson works out what the motors must pay in force and heat to move there. It covers the forces and torques in a moving machine, how wheels, legs and rotors actually get a body around, and the energy cost of each way of travelling.',
    analogy:
      'Rock climbing: the route up is the geometry, but your burning forearms are the dynamics, and resting on a good hold is a gait choice.',
    remember: 'Torque sizing starts at gravity plus inertia — motion is never free.',
    realWorld:
      'Boston Dynamics Spot and Unitree quadrupeds tuning gaits, and quadcopter thrust mixing in every DJI airframe.',
    prereqs: ['w4l8'],
    canDo: [
      'Write the equations of motion and identify the inertia, velocity and gravity terms.',
      'Model differential drive and Ackermann steering and state where each slips.',
      'Compare two gaits or two transport modes on cost of transport and pick one with reasons.',
    ],
    misconception:
      'That a walking robot only needs to place its feet; balance is dynamic, and an unstable machine must actively catch itself.',
  },
  {
    lessonId: 'w5l10',
    plain:
      'This lesson is about the small computer inside the robot and the promise it must keep: finish each control step inside a fixed time, every single time. It covers timers, interrupts, direct memory access, real-time operating systems, the fieldbus wiring between boards, and the sneaky failure modes that work on a bench and die in the field.',
    analogy:
      'A hospital shift handover: it must happen on time, every time, with a written record — being fast most nights is not good enough.',
    remember: 'Real-time means the deadline holds on the worst day, not on the average one.',
    realWorld:
      'STM32 and TI microcontrollers, CAN bus in cars and John Deere tractors, and Zephyr or FreeRTOS in industrial controllers.',
    prereqs: ['w3l6'],
    canDo: [
      'Explain worst-case execution time and jitter and say which one breaks a derivative term.',
      'Configure a timer, an interrupt and a DMA transfer for a fixed-rate control loop.',
      'Choose bare-metal, an RTOS or embedded Linux for a stated robot and justify the choice.',
    ],
    misconception:
      'That a fast processor fixes timing; average speed is irrelevant, and one late step can crash the machine.',
  },
  {
    lessonId: 'w6l11',
    plain:
      'This lesson is about turning raw sensor readings into a confident belief about the world: what objects are where, and where the robot itself is. It covers image recognition with neural networks, the maths that blends noisy measurements over time, and the mapping systems that keep a robot located as it drives.',
    analogy:
      'Finding your way in a strange city using a phone that is only 80 per cent accurate plus your own sense of direction — you blend both and trust the blend less the longer it has been.',
    remember: 'Measurements become belief, and a belief is useless without an uncertainty attached.',
    realWorld:
      'YOLO detectors from Ultralytics, Kalman filters in PX4 and ArduPilot, and SLAM in ROS 2 Nav2.',
    prereqs: ['w2l4'],
    canDo: [
      'Split a dataset without leakage and diagnose overfitting from train versus test error.',
      'Write the Kalman predict and update steps and interpret the gain as a trust ratio.',
      'Choose a filter representation and fuse two sensors into one pose estimate with uncertainty.',
    ],
    misconception:
      'That a neural network output is the answer; every estimate needs an uncertainty attached, or the controller cannot use it safely.',
  },
  {
    lessonId: 'w6l12',
    plain:
      'This lesson is about deciding what the robot should do next: searching for a route through a cluttered space, predicting a short way ahead so the motion stays smooth and legal, and organising behaviour so the robot fails politely. It also covers learning from trial and error and why a policy trained in simulation often trips in the real world.',
    analogy:
      'A taxi route: the destination is obvious, but the useful route depends on traffic, fuel, road rules and how far ahead you can see.',
    remember: 'A plan is only useful if the robot can follow it in real time, safely.',
    realWorld:
      'ROS 2 Nav2 planners, model predictive control in autonomous mining trucks, and domain randomisation used by OpenAI and NVIDIA Isaac Sim.',
    prereqs: ['w5l9', 'w6l11'],
    canDo: [
      'Choose between A*, RRT* and MPC from the structure of the problem.',
      'Sketch a behaviour tree that degrades safely when a subsystem fails.',
      'State when reinforcement learning is the right tool and when it is a liability.',
    ],
    misconception:
      'That reinforcement learning will simply learn the whole robot; real deployments keep a classical planner and a safety shield around any learned policy.',
  },
  {
    lessonId: 'w7l13',
    plain:
      'A modern robot is many small programs talking to each other, and this lesson covers that plumbing: how the parts find each other and pass messages, how to keep the delay inside budget, and how the robot talks to the wider world. It also covers updating software on machines you cannot physically reach, and where security has to hold.',
    analogy:
      'A postal system with a delivery deadline: addresses, sorting rules, size limits and a tracking number decide whether the parcel arrives in time.',
    remember: 'A robot is a distributed system with a deadline — miss it and the plumbing is the fault.',
    realWorld:
      'ROS 2 over Fast DDS or Cyclone DDS, micro-ROS on microcontrollers, and MQTT and LoRaWAN links in industrial IoT.',
    prereqs: ['w5l10'],
    canDo: [
      'Draw a ROS 2 graph and pick a sensible QoS profile for each link.',
      'Compute an end-to-end latency budget and a camera bandwidth estimate.',
      'Design an over-the-air update with A/B partitions, health gates and rollback.',
    ],
    misconception:
      'That ROS 2 is the robot; it is middleware, and a mismatched QoS setting silently delivers nothing while looking perfectly healthy.',
  },
  {
    lessonId: 'w7l14',
    plain:
      'This lesson is the engineering that exists to prevent the worst day: finding what could hurt someone, reducing that risk in the right order, and proving the reduction with numbers. It covers the safety standards a real robot must satisfy, how far a person must stay from a moving machine, and the harder human questions about autonomous and living machines.',
    analogy:
      'A fire drill: everyone knows the alarm sound, the routes are marked and practised, and the plan is tested rather than assumed.',
    remember: 'Design out the hazard first; guarding and warnings are the last resort, not the first.',
    realWorld:
      'Universal Robots cobots certified to ISO/TS 15066, FANUC cells with safety PLCs, and ISO 13849 performance-level ratings.',
    prereqs: ['w1l1', 'w3l6'],
    canDo: [
      'Run a risk assessment and apply the ISO 12100 reduction hierarchy in the right order.',
      'Compute a stopping distance and a protective separation distance for a cell with numbers.',
      'Map a design onto ISO 10218, ISO/TS 15066 and ISO 13849 and name the required performance level.',
    ],
    misconception:
      'That a collaborative robot is inherently safe and needs no guarding; every collaborative application still needs its own risk assessment.',
  },
  {
    lessonId: 'w8l15',
    plain:
      'This lesson turns a design into something a factory can actually make: choosing materials, setting tolerances, and picking a process that fits the quantity. It covers drawing standards, the difference between an idea drawing and a manufacturing drawing, building the first circuit board, and recording what you built and how it is licensed.',
    analogy:
      'A tailor drafting a pattern from body measurements: the numbers decide the cut, and a millimetre of sloppy seam allowance ruins the fit.',
    remember: 'A part you cannot build is not a design — tolerances and process are part of the decision.',
    realWorld:
      'Onshape and SolidWorks for CAD, Prusa and Bambu Lab for 3D printing, Xometry for CNC, and CERN-OHL licensing for open hardware.',
    prereqs: ['w1l2', 'w3l5'],
    canDo: [
      'Specify an ISO 286 fit such as Ø10 H7/g6 and state the clearance it gives.',
      'Add tolerances worst-case and by root-sum-square, then judge which the assembly can survive.',
      'Write a bill of materials and a manufacturing note that another engineer could build from.',
    ],
    misconception:
      'That 3D printing is free of constraints; orientation, draft and shrink change the part, and printed holes come out undersized.',
  },
  {
    lessonId: 'w8l16',
    plain:
      'The capstone lesson treats your final build as a proper engineering programme: one measurable success target, frozen interfaces between subsystems, and honest testing rather than a last-night scramble. It also surveys the frontier — living materials, swarms, soft robots, space power and quantum — and separates what has been measured from what is only hoped for.',
    analogy:
      'Opening night of a stage play: the show only works if the scenes were rehearsed separately, the cues were frozen early, and the understudies know what to do.',
    remember: 'Write down which numbers are measured and which are hoped for, and put your readiness level in writing.',
    realWorld:
      'NASA uses technology readiness levels to grade missions, and IBM and Google build superconducting quantum processors.',
    prereqs: ['w7l13', 'w7l14', 'w8l15'],
    canDo: [
      'State one primary success metric with units and a test method before you start building.',
      'Place your own project on the TRL scale and cite the evidence for that placement.',
      'Separate a measured frontier result from a speculative one and say what would falsify the claim.',
    ],
    misconception:
      'That a working demo equals a finished product; a demo works once on your desk, while a system is reproducible and states its limitations.',
  },
];
