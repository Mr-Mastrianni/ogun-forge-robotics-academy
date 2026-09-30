import type { Lesson } from '../types';

export const lesson: Lesson = {
  id: 'w3l5',
  number: 5,
  week: 3,
  track: 'actuation',
  difficulty: 'journeyman',
  title: 'Actuators, Motors and Drives: Torque, Speed and Heat',
  subtitle: 'Every motor is a thermal device pretending to be a mechanical one',
  duration: 75,
  xp: 190,
  hook: 'A motor does not produce torque and speed. It produces heat, and you get to keep whatever mechanical output is left over.',
  objectives: [
    'Read a torque-speed curve and locate stall torque, no-load speed and peak power.',
    'Select a motor, gearbox and driver for a stated load using real numbers.',
    'Explain field-oriented control and why BLDC motors need it.',
    'Estimate thermal duty cycle so the winding survives the mission.',
  ],
  blocks: [
    {
      kind: 'prose',
      heading: 'The torque-speed line is the motor',
      body:
        'A brushed DC motor at constant voltage behaves almost exactly like a linear source: torque falls as speed rises, hitting **stall torque** $\\tau_s$ at zero speed and **no-load speed** $\\omega_0$ at zero torque.\n\n' +
        'Two constants define everything. The torque constant $K_t$ (N·m/A) and the back-EMF constant $K_e$ (V·s/rad). In SI units they are numerically equal, which is the single most useful identity in actuator work. Electrical power in equals mechanical power out plus copper loss:\n\n' +
        '- At stall, all electrical power becomes heat in the winding — this is why a stalled motor burns.\n' +
        '- At no-load, nearly all power is friction and iron loss.\n' +
        '- **Maximum mechanical power occurs at half stall torque and half no-load speed**, and efficiency there is only about 50%.\n\n' +
        'Design practice: pick a motor whose continuous operating point sits well below the torque-speed line, and let the gearbox move that point into the region your load actually needs.',
    },
    {
      kind: 'formula',
      title: 'The motor equations',
      tex: '\\omega = \\frac{V - I R}{K_e}, \\qquad \\tau = K_t I, \\qquad \\tau_{stall} = \\frac{K_t V}{R}, \\qquad P_{max} = \\frac{\\tau_s \\omega_0}{4}',
      explain:
        'Back-EMF subtracts from the supply as speed rises, so current — and therefore torque — falls linearly. Gear ratio n multiplies torque by n, divides speed by n, and divides reflected load inertia by n squared.',
    },
    {
      kind: 'chart',
      title: 'Torque-speed curve: 12 V geared DC motor vs direct-drive hub motor',
      xLabel: 'shaft speed (rpm)',
      yLabel: 'torque (N·m)',
      chartType: 'line',
      x: [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000],
      series: [
        { key: 'geared', label: 'Geared DC, 1:50 (N·m)', color: '#f5b301', data: [2.4, 2.05, 1.7, 1.35, 1.0, 0.65, 0.3, 0.1, 0] },
        { key: 'hub', label: 'Hub motor, direct (N·m)', color: '#c026d3', data: [28, 26, 23, 20, 16, 12, 7.5, 3, 0] },
      ],
      caption:
        'The geared motor trades speed for torque through 50:1 reduction and therefore has a much lower no-load speed. The hub motor makes far more torque directly but at low speed and high current. Neither is better; they are different operating regions.',
    },
    {
      kind: 'table',
      title: 'Motor families for robotics',
      columns: ['Type', 'Torque density', 'Control', 'Efficiency', 'Weakness', 'Typical use'],
      rows: [
        ['Brushed DC + gearbox', 'Medium', 'Voltage/PWM, encoder for speed', '60–80%', 'Brush wear, heat at stall', 'Cheap mobile bases, hobby arms'],
        ['BLDC / PMSM + FOC', 'High', 'Field-oriented, needs rotor angle', '80–92%', 'Driver complexity, sensor or observer needed', 'Drones, e-bikes, legged joints, cobots'],
        ['Stepper', 'Medium at low speed', 'Open loop step/dir, microstepping', '50–70%', 'Torque collapses with speed, resonance, position loss', '3D printers, CNC, camera sliders'],
        ['RC servo', 'Low', 'Internal position loop over PWM', '40–60%', 'Backlash, plastic gears, no feedback out', 'Steering, pan-tilt, small grippers'],
        ['Smart serial servo', 'Medium', 'Digital bus, position/velocity/current modes', '60–80%', 'Cost', 'Quadrupeds, humanoids, research arms'],
        ['Series elastic actuator', 'Medium', 'Force control through spring deflection', '60–80%', 'Bandwidth limited by spring', 'Legged robots, safe physical interaction'],
        ['Harmonic drive joint', 'Very high', 'Zero-backlash, high ratio', '70–85%', 'Cost, torsional compliance, efficiency loss', 'Cobot joints, industrial wrists'],
      ],
      insight:
        'Choose the family from the control problem, not the spec sheet headline. If you need to command torque rather than position, a stepper is the wrong tool no matter how cheap it is.',
      caption: 'Efficiencies are typical ranges at rated operating points, not peaks.',
    },
    {
      kind: 'prose',
      heading: 'BLDC and field-oriented control',
      body:
        'A brushless motor cannot run on DC: the coils must be energised in step with the rotor position. Six-step (trapezoidal) commutation switches the three phases using Hall sensors, which is simple and produces torque ripple at each commutation.\n\n' +
        'Sinusoidal drive with **field-oriented control** removes that ripple. Measure the three phase currents, transform them into the rotor frame with the Clarke and Park transforms, and you get two DC quantities: $i_d$ (flux-producing) and $i_q$ (torque-producing). Set $i_d = 0$ and $i_q$ to the current your requested torque needs, run two PI loops, transform back, and drive the bridge with space-vector PWM. The motor now behaves like a clean DC machine — which is exactly what lets a quadrotor hold attitude at 8 kHz.\n\n' +
        'You need the rotor angle: an absolute encoder, Hall sensors with interpolation, or a sensorless observer that estimates back-EMF at speed (and fails near zero speed, which is why sensorless drives struggle to start under load).',
    },
    {
      kind: 'table',
      title: 'Gearbox comparison',
      columns: ['Type', 'Ratio range', 'Backlash', 'Efficiency', 'Self-locking', 'Best for'],
      rows: [
        ['Spur', '1:1 – 1:8 per stage', 'Moderate', '96–98% per stage', 'No', 'Cheap reductions, 3D-printed robots'],
        ['Helical', '1:1 – 1:10 per stage', 'Moderate', '95–98%', 'No', 'Quieter, higher load spur replacement'],
        ['Worm', '1:5 – 1:100', 'Low', '40–85%', 'Usually yes', 'Holding loads without power, lifting axes'],
        ['Planetary', '1:3 – 1:100', 'Low–moderate', '90–97%', 'No', 'High torque density, NEMA frames'],
        ['Harmonic / strain wave', '1:30 – 1:320', 'Near zero', '65–85%', 'No', 'Cobot joints, precision wrists'],
        ['Cycloidal', '1:10 – 1:200', 'Low', '80–92%', 'No', 'High shock loads, legged robot knees'],
      ],
      insight:
        'Backlash is the enemy of repeatability, not of accuracy. A 1-degree backlash joint can still be accurate on average and useless for a 0.1-degree pick.',
      caption: 'Efficiency listed at rated torque and moderate speed; low-load efficiency is worse.',
    },
    {
      kind: 'code',
      title: 'ESP32 velocity loop with encoder feedback and current limiting',
      language: 'cpp',
      code: `// 1 kHz velocity PID around a geared DC motor with a quadrature encoder.
static const float KP = 0.9f, KI = 3.2f, KD = 0.01f;
static const float I_MAX = 6.0f;          // amps, protects the winding
static const float TICKS_PER_REV = 11.0f * 4.0f * 30.0f;  // encoder * quadrature * gearbox

volatile long ticks = 0;
float integ = 0, prevErr = 0, targetRadS = 0;

void IRAM_ATTR onEncoderA() { ticks += digitalRead(2) == digitalRead(3) ? 1 : -1; }

void setup() {
  pinMode(2, INPUT_PULLUP); pinMode(3, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(2), onEncoderA, CHANGE);
  ledcAttachPin(9, 0); ledcSetup(0, 20000, 10);   // 20 kHz keeps the motor acoustically quiet
}

void controlISR() {
  static long last = 0;
  long now = ticks;
  float dTicks = (float)(now - last); last = now;
  float vel = (dTicks / TICKS_PER_REV) * 2.0f * PI / 0.001f;   // rad/s at 1 kHz
  float err = targetRadS - vel;
  integ += err * 0.001f;
  integ = constrain(integ, -I_MAX / KI, I_MAX / KI);           // anti-windup clamp
  float out = KP * err + KI * integ + KD * (err - prevErr) / 0.001f;
  prevErr = err;
  ledcWrite(0, (int)constrain(out * 102.3f, 0, 1023));         // duty 0..1023
}`,
      note:
        'Attach controlISR to a hardware timer at 1 kHz, never to loop(). The integral clamp is the difference between a controller and a smoke generator.',
    },
    {
      kind: 'lab',
      labId: 'gear-train',
      title: 'Design a reduction',
      brief:
        'Drive the three-stage gear train and use the live ratio, efficiency and reflected-inertia readouts to match a motor to a load.',
      tasks: [
        'Build a train with an overall reduction above 20:1 and record the output torque',
        'Set all three gears to 20 teeth and explain why the ratio does not change',
        'Compute the output torque by hand from the input torque and the ratio, and match the readout within 5%',
      ],
    },
    {
      kind: 'lab',
      labId: 'robot-arm',
      title: 'Where the torque goes',
      brief:
        'Drive the 3R arm to full extension and watch manipulability collapse — the same joint torque produces less and less Cartesian force.',
      tasks: [
        'Extend the arm horizontally and note the manipulability value',
        'Fold the arm and compare the manipulability at the same target distance',
        'Explain why the shoulder torque needed to hold a payload rises with extension',
      ],
    },
    {
      kind: 'callout',
      tone: 'warning',
      title: 'The three ways actuators die',
      body:
        '**Thermal**: continuous current above the winding rating cooks the insulation. **Mechanical**: shock loads and misalignment destroy gear teeth and bearings long before the motor stalls. **Electrical**: back-EMF during regenerative braking plus a disconnected battery spikes the driver above its voltage rating. Size for all three, not just for stall torque.',
    },
    {
      kind: 'steps',
      title: 'Sizing procedure you can defend in a review',
      steps: [
        { title: 'Estimate the load', detail: 'Gravity torque, acceleration torque, friction and payload: sum them at the worst pose with a safety factor of 1.5 to 2.' },
        { title: 'Pick the operating speed', detail: 'Continuous duty point should sit at 30 to 50% of no-load speed for efficiency and thermal headroom.' },
        { title: 'Compute required motor torque', detail: 'Divide load torque by ratio and efficiency, and add the torque needed to accelerate reflected inertia.' },
        { title: 'Check the reflected inertia', detail: 'Load inertia divided by ratio squared should be within roughly 10x the rotor inertia for stable control.' },
        { title: 'Verify thermal duty', detail: 'RMS current over the real duty cycle must stay under the continuous rating; otherwise add cooling or accept a lower rating.' },
        { title: 'Verify the driver', detail: 'Peak current, continuous current, voltage headroom, regeneration path and braking resistor if needed.' },
      ],
    },
    {
      kind: 'callout',
      tone: 'insight',
      title: 'Regenerative braking is not free energy',
      body:
        'When a joint decelerates, the motor becomes a generator. If the battery is full or the driver cannot push current back, the DC bus voltage climbs until something fails. Industrial drives dump that energy into a braking resistor. Hobby ESCs often just let the bus rise — which is why a quadrotor descending hard can cook an ESC.',
    },
  ],
  keyTerms: [
    { term: 'Back-EMF', definition: 'The voltage a spinning motor generates against the supply, proportional to speed via K_e.' },
    { term: 'K_t and K_e', definition: 'Torque and back-EMF constants; numerically equal in SI units.' },
    { term: 'Stall torque', definition: 'Torque at zero speed with full voltage applied — the thermal worst case.' },
    { term: 'Reflected inertia', definition: 'Load inertia divided by the square of the gear ratio, as seen by the motor.' },
    { term: 'Field-oriented control', definition: 'Sinusoidal drive that regulates flux and torque currents independently in the rotor frame.' },
    { term: 'Microstepping', definition: 'Sinusoidal current shaping in a stepper to interpolate between full steps and reduce resonance.' },
    { term: 'Series elastic actuator', definition: 'A compliant spring placed deliberately between motor and load to enable force control and absorb shock.' },
    { term: 'Self-locking', definition: 'A gearbox property, typical of worm drives, where the load cannot back-drive the motor.' },
  ],
  quiz: [
    {
      id: 'w3l5q1',
      question: 'Where does a DC motor produce maximum mechanical power?',
      choices: ['At stall', 'At no-load speed', 'At half stall torque and half no-load speed', 'At rated continuous torque'],
      answer: 2,
      explanation: 'Power is the product of torque and speed; on a linear torque-speed line that product peaks at the midpoint, where efficiency is only about 50%.',
      level: 'recall',
    },
    {
      id: 'w3l5q2',
      question: 'A gearbox with a 40:1 ratio and 95% efficiency is driven by a motor making 0.2 N·m. What is the output torque?',
      choices: ['0.2 N·m', '7.6 N·m', '8.0 N·m', '760 N·m'],
      answer: 1,
      explanation: 'Torque multiplies by ratio and loses efficiency: 0.2 x 40 x 0.95 = 7.6 N·m.',
      level: 'apply',
    },
    {
      id: 'w3l5q3',
      question: 'Why does a stepper lose position at high speed?',
      choices: [
        'Its magnets demagnetise',
        'Torque falls with speed until it cannot accelerate the load within one step period',
        'Microstepping is disabled above 500 rpm',
        'The driver switches to voltage mode',
      ],
      answer: 1,
      explanation: 'Stepper torque collapses as the step rate rises because the winding inductance limits how fast current can build. Once load torque exceeds available torque the rotor slips and the controller never notices, because it is open loop.',
      level: 'understand',
    },
    {
      id: 'w3l5q4',
      question: 'In field-oriented control, which current component produces torque?',
      choices: ['i_d', 'i_q', 'The DC bus current', 'The phase sum i_a + i_b + i_c'],
      answer: 1,
      explanation: 'In the rotor frame the q-axis current produces torque and the d-axis current produces flux. Standard practice is to regulate i_d to zero for a surface PM machine.',
      level: 'understand',
    },
    {
      id: 'w3l5q5',
      question: 'You double the gear ratio on the same motor and load. What happens to reflected load inertia at the motor?',
      choices: ['It doubles', 'It halves', 'It quarters', 'It is unchanged'],
      answer: 2,
      explanation: 'Reflected inertia scales with 1/n squared, so doubling n divides it by four — which is why high ratios make even heavy loads feel light to the controller.',
      level: 'apply',
    },
    {
      id: 'w3l5q6',
      question: 'A worm drive is specified as self-locking. What does that buy you?',
      choices: [
        'Higher efficiency',
        'The load holds position without motor power',
        'Zero backlash',
        'Higher maximum speed',
      ],
      answer: 1,
      explanation: 'Self-locking means the load cannot back-drive the gearbox, so a vertical axis can hold position with the driver disabled. The cost is efficiency, often only 40 to 70%.',
      level: 'analyze',
    },
    {
      id: 'w3l5q7',
      question: 'A quadrotor ESC fails during aggressive descents. Which mechanism is most plausible?',
      choices: [
        'Motor windings overheat from excess current',
        'Regenerative braking raises the DC bus voltage above the ESC rating',
        'The PWM frequency drifts',
        'The battery voltage sags below cutoff',
      ],
      answer: 1,
      explanation: 'Descending under load back-drives the props, so the motors generate. With no braking resistor or recharge path, bus voltage can exceed the ESC capacitor and FET ratings.',
      level: 'design',
    },
  ],
  flashcards: [
    { front: 'Why does a stalled DC motor burn?', back: 'At zero speed back-EMF is zero, so current is limited only by winding resistance and all electrical power becomes heat. Stall is the thermal worst case.', tag: 'motors' },
    { front: 'K_t versus K_e', back: 'Torque constant and back-EMF constant. Numerically equal in SI units, which is why motor datasheets quote either one.', tag: 'motors' },
    { front: 'Peak mechanical power point on a torque-speed curve', back: 'Half stall torque and half no-load speed, at roughly 50% efficiency.', tag: 'motors' },
    { front: 'Reflected inertia', back: 'Load inertia divided by the gear ratio squared, as seen from the motor shaft. High ratios make heavy loads easy to control.', tag: 'gearbox' },
    { front: 'Clarke and Park transforms', back: 'Clarke maps three phase currents to a stationary two-axis frame; Park rotates that frame with the rotor so d and q currents become DC quantities.', tag: 'FOC' },
    { front: 'Backlash versus repeatability', back: 'Backlash is lost motion when reversing direction. It destroys repeatability while leaving average accuracy intact — fatal for precision pick-and-place.', tag: 'gearbox' },
    { front: 'Self-locking gearbox', back: 'A high-ratio worm drive that the load cannot back-drive. Holds position unpowered at the cost of efficiency.', tag: 'gearbox' },
    { front: 'Series elastic actuator', back: 'A deliberate spring between motor and load: measures force by deflection and absorbs shock, at the cost of control bandwidth.', tag: 'actuators' },
    { front: 'Why 20 kHz PWM for motors?', back: 'It moves switching noise above human hearing and reduces current ripple, at the cost of higher switching losses in the driver.', tag: 'drivers' },
    { front: 'Three failure modes to design against', back: 'Thermal (continuous overcurrent), mechanical (shock and misalignment), electrical (regenerative overvoltage on the DC bus).', tag: 'reliability' },
  ],
  forgePrompts: [
    'Design a mycelium-composite robot arm where the compliant link absorbs shock and doubles as a force sensor.',
    'Build a worm-drive lifting axis for a solar tracker and measure how long it holds position with the driver disabled.',
    'Instrument a geared motor with a thermocouple and plot winding temperature against RMS current for a real duty cycle.',
  ],
};
