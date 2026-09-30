import type { Lesson } from '../types';

export const lesson: Lesson = {
  id: 'w2l3',
  number: 3,
  week: 2,
  track: 'perception',
  title: 'Proprioception: Encoders, IMUs and the Truth About Noise',
  subtitle: 'How a robot knows its own body — and why that knowledge drifts',
  duration: 65,
  difficulty: 'apprentice',
  xp: 165,
  hook: 'A robot with perfect eyes and no sense of its own body falls over the moment the lights go out.',
  objectives: [
    'Decode incremental quadrature into counts, and counts into angular resolution in degrees and milliradians.',
    'Choose among incremental, absolute, magnetic, optical, Hall and resolver feedback for a given joint.',
    'Read an Allan deviation curve for angle random walk, bias instability and rate random walk.',
    'Separate gyro bias, random walk, temperature drift, scale-factor error and quantisation in a MEMS IMU.',
    'Calibrate an accelerometer in six positions, correct magnetometer hard and soft iron, then fuse with a complementary filter.',
  ],
  blocks: [
    { kind: 'prose', heading: 'Incremental encoders count change; absolute encoders report place',
      body: 'An incremental encoder emits two square waves, A and B, 90 degrees out of phase, one **cycle** per slit on the disc. Direction is simply which channel leads. Counting all four edges of A and B within each cycle is **4x decoding**, so a 1024-cycle-per-revolution (CPR) disc yields 4096 counts/rev, and one count is $360^\\circ/4096 = 0.0879^\\circ = 1.534$ mrad. On a 0.1 m arm, one count is a 0.153 mm arc at the tool. The index pulse (Z) marks one position per turn, so every incremental axis must home before it can trust a number.\n\n' +
        'Absolute encoders report place directly and survive a power cycle. A 17-bit single-turn SSI or BiSS-C unit resolves 131,072 counts (0.00275°); a multi-turn version adds 12 bits of turn count, so 4096 output turns are known without homing. Cruder and cheaper: three latching **Hall** sensors at 120 electrical degrees on a brushless motor give six states per electrical revolution, a 60-degree electrical step that is enough to commutate and not enough to control. A **resolver** is a rotary transformer with sine and cosine secondaries; with an AD2S1210 tracking converter it delivers 10-16 bits and holds 2-5 arcmin to 155 °C, which is why it survives on aircraft and on the joints of large servo motors.' },
    { kind: 'table', title: 'Joint feedback: what each technology actually delivers',
      caption: 'Resolution is the smallest step the device can report; accuracy is how far that report sits from truth.',
      columns: ['Device', 'Principle', 'Resolution', 'Accuracy / INL', 'Interface'],
      rows: [
        ['AS5600 (ams)', 'Magnetic absolute, 6 mm diametric magnet', '12-bit = 0.088°', '±0.5° class INL uncalibrated', 'I²C'],
        ['AS5048A (ams)', 'Magnetic absolute, differential Hall', '14-bit = 0.022°', '±0.05° class after linearisation', 'SPI / PWM'],
        ['1024-line disc, 4x decoded', 'Optical incremental, transmissive', '4096 counts = 0.088°', '±5 arcsec with a clean scale', 'A/B/Z'],
        ['3x Hall at 120° electrical', 'Latching magnetic switches', '60° electrical, 6 states', '±5° electrical', '3 digital lines'],
        ['Resolver + AD2S1210', 'Rotary transformer, sin/cos', '16-bit = 0.0055°', '±2-5 arcmin, −55 to 155 °C', 'Sin/cos to R/D'],
        ['10 kΩ pot, 340° travel', 'Resistive contact', 'ADC-limited, 12-bit = 0.083°', '±1-2% full scale, wears out', 'Analog'],
      ] },
    { kind: 'prose', heading: 'Resolution, accuracy, repeatability — three different numbers',
      body: 'A 12-bit magnetic encoder reports 4096 distinct values, so its **resolution** is 0.0879°. Its **accuracy** is worse: an AS5600-class part carries about ±0.5° of integral nonlinearity, and a 6 mm magnet mounted 0.5 mm off centre adds a once-per-turn eccentricity error of a few tenths of a degree. Its **repeatability** — the spread when the shaft returns to the same angle — beats both, often ±0.02°, because the same error repeats and cancels in a relative move. A robot that only ever moves *relative* to a taught point can live with terrible accuracy; one that must report an absolute joint angle cannot.\n\n' +
        'Magnetic parts are contactless, indifferent to dust, oil and 20,000 rpm, and sensitive to stray fields and Hall front-end drift; the magnet itself loses about 0.12% of remanence per °C as NdFeB (0.03%/°C as SmCo). Optical parts trade the other way: a 2048-line disc or a 20 µm reflective scale interpolated 4x gives arcsecond-class accuracy, and a smear of grease ends the measurement. Choose magnetic for a dirty wheel joint, optical for a metrology axis, a resolver for a hot high-vibration servo, and Hall sensors when you only need to know which of six sectors the rotor occupies.' },
    { kind: 'chart', title: 'Allan deviation of two gyroscopes, 1 h of static data',
      caption: 'Log-log slope −1/2 is angle random walk, the flat minimum is bias instability, slope +1/2 is rate random walk. Lower is better at every τ.',
      chartType: 'line', xLabel: 'Averaging time τ (s)', yLabel: 'Allan deviation σ(τ) (°/h)',
      x: [0.01, 0.03, 0.1, 0.3, 1, 3, 10, 30, 100, 300, 1000],
      series: [
        { key: 'consumer', label: 'Consumer MEMS gyro (0.2 °/√h ARW)', color: '#f59e0b', data: [120, 69.3, 37.9, 21.9, 12.0, 6.9, 4.0, 10.0, 10.1, 10.0, 31.6] },
        { key: 'tactical', label: 'Tactical MEMS gyro (0.09 °/√h ARW)', color: '#38bdf8', data: [54.0, 31.2, 17.1, 9.86, 5.40, 3.12, 1.71, 0.99, 0.80, 0.82, 2.53] },
      ] },
    { kind: 'formula', title: 'Allan variance and what each slope means',
      tex: '\\sigma_y^2(\\tau) = \\frac{1}{2(N-1)}\\sum_{k=1}^{N-1}\\left(\\bar{y}_{k+1}(\\tau) - \\bar{y}_k(\\tau)\\right)^2',
      explain: 'Bin the static rate record into clusters of length τ, average each cluster, then measure how far neighbouring averages move. Plot σ (not σ²) against τ on log-log axes: slope −1 is quantisation, −1/2 is angle random walk, 0 is bias instability at the curve minimum, +1/2 is rate random walk, +1 is a rate ramp. The minimum is the honest long-term floor of the sensor.' },
    { kind: 'prose', heading: 'Inside a MEMS IMU: three sensors, five failure modes',
      body: 'A **MEMS accelerometer** is a proof mass on silicon springs whose deflection is read capacitively; ranges run ±2/4/8/16 g, noise is 70-100 µg/√Hz on a modern part such as the TDK InvenSense ICM-42688-P, and a 16-bit converter over ±2 g puts one LSB at 61 µg = $6.0\\times10^{-4}$ m/s². It measures specific force, so it senses gravity plus acceleration and cannot tell them apart. A **MEMS gyroscope** is a vibrating tuning fork whose Coriolis deflection reveals angular rate over ±250 to ±2000 °/s; a 16-bit word over ±250 °/s makes an LSB 0.0076 °/s. A **magnetometer** (Bosch BMM150 at about 0.3 µT, PNI RM3100 at 13 nT) senses the 25-65 µT geomagnetic field, which is a weak signal easily buried by a motor or a speaker.\n\n' +
        'Five errors decide whether you can navigate. **Bias** is a constant rate offset, and a 1 °/h bias becomes 1° of heading error after one hour. **Angle random walk** is white noise: 0.2 °/√h means σ = 0.2° after 1 h and 0.63° after 10 h. **Temperature drift** moves a consumer bias by about 0.01 °/s/°C, so a 20 °C warm-up shifts it by 0.2 °/s = 720 °/h unless compensated. **Scale-factor error** is 0.1-3% on consumer parts, 0.02% on a tactical part such as the ADIS16495, and it is invisible on a static test because it multiplies motion. **Quantisation** sets the smallest step and adds a slope −1 Allan region at short τ.' },
    { kind: 'callout', tone: 'warning', title: 'No nine-axis IMU measures position',
      body: 'Integration is a drift amplifier: velocity error is the time integral of acceleration error, and position error is the second integral, so tiny biases become metres. A consumer gyro at 10 °/h bias instability plus 0.2 °/√h random walk loses heading and then loses the route. Fuse with a wheel odometer, a GNSS fix, a camera or a LiDAR — or accept that the estimate is only valid for seconds.' },
    { kind: 'formula', title: 'Complementary filter: high-pass the gyro, low-pass the accelerometer',
      tex: '\\hat{\\theta}(s) = \\underbrace{\\frac{\\tau s}{1+\\tau s}}_{\\text{gyro}}\\cdot\\frac{\\omega(s)}{s} + \\underbrace{\\frac{1}{1+\\tau s}}_{\\text{accel}}\\cdot\\theta_a(s), \\qquad \\alpha = \\frac{\\tau}{\\tau+\\Delta t}',
      explain: 'The gyro is trusted above the corner f_c = 1/(2πτ) and the accelerometer below it; at DC the accelerometer path has gain 1 and the gyro path 0, which is exactly why the estimate cannot drift. Pick τ = 0.5 s to get f_c = 0.318 Hz and α = 0.5/0.51 = 0.980 at Δt = 10 ms. Too large a τ and the accelerometer correction lags; τ = 10 s gives α = 0.999 and a 10 s recovery from a bump.' },
    { kind: 'code', title: 'Quadrature decode plus complementary filter (runs as-is)', language: 'python',
      note: 'Direction falls out of the decoded edge order; the filter state is one float. 360/4096 = 0.0879°, 2π/4096 = 1.534 mrad.',
      code: `# python3, standard library only
TABLE = {(0, 0): 0, (0, 1): 1, (1, 1): 2, (1, 0): 3}   # Gray order for forward rotation

def decode(state, a, b):
    nxt = TABLE[(a, b)]
    d = (nxt - state) % 4            # 1 = forward, 3 = reverse, 0 or 2 = bounce
    return nxt, 1 if d == 1 else (-1 if d == 3 else 0)

CPR = 1024 * 4                       # 1024-line disc, 4x decoding -> 4096 counts/rev

class Tilt:                          # alpha = tau / (tau + dt)
    def __init__(self, dt=0.01, tau=0.5):
        self.dt, self.a, self.theta = dt, tau / (tau + dt), 0.0
    def update(self, gyro_dps, accel_deg):
        self.theta = self.a * (self.theta + gyro_dps * self.dt) + (1.0 - self.a) * accel_deg
        return self.theta

if __name__ == '__main__':
    print('one count =', 360.0 / CPR, 'deg =', round(6283.185 / CPR, 3), 'mrad')  # 0.0879, 1.534
    f = Tilt(0.01, 0.5)              # alpha = 0.980
    print([round(f.update(0.0, 2.0), 3) for _ in range(3)])` },
    { kind: 'steps', title: 'Calibrate an IMU you can defend',
      steps: [
        { title: 'Warm up before you trust anything', detail: 'Run 10 min, log zero-rate output and die temperature, and wait until the bias slope falls below 0.5 °/h per minute.' },
        { title: 'Six positions for the accelerometer', detail: 'Rest each axis up then down (+X, −X, +Y, −Y, +Z, −Z), 100 samples per pose. Bias b = (a+ + a−)/2 and scale s = (a+ − a−)/(2g); a perfect part reads ±1 g in all six.' },
        { title: 'Kill cross-axis terms', detail: 'The two off-axis readings in each pose give the frame misalignment; apply the 3x3 matrix and verify that residual cross-axis coupling falls below 0.5%.' },
        { title: 'Fit gyro bias against temperature', detail: 'Soak at 25, 40 and 60 °C and fit b(T) = b0 + k(T − T0). Uncompensated, k = 0.01 °/s/°C costs 0.2 °/s = 720 °/h across a 20 °C warm-up.' },
        { title: 'Hard iron: rotate and find the centre', detail: 'Sweep the magnetometer through a 3D figure-8; the centre of the fitted sphere is the constant offset. Earth field is 25-65 µT, and a speaker 0.3 m away can add 100 µT.' },
        { title: 'Soft iron: fit the ellipsoid', detail: 'Fit the 3x3 matrix W from the ellipsoid and apply H = W⁻¹(Hm − b); after correction the field magnitude should stay within a few µT of the local value and tilt-compensated heading should repeat within 1°.' },
      ] },
    { kind: 'formula', title: 'Dead reckoning dies as a quadratic in time',
      tex: 'e(t) \\approx \\tfrac{1}{2} v\\,b\\,t^{2} + \\frac{v\\,\\sigma_{\\mathrm{ARW}}}{\\sqrt{3}}\\,t^{3/2}, \\qquad b = 1^\\circ/\\mathrm{h} = 4.85\\times10^{-6}\\ \\mathrm{rad/s}',
      explain: 'A constant bias makes heading error grow linearly, and position error is its integral, so it grows as t². At v = 1 m/s a 1 °/h bias gives 8.7 mm after 60 s, 0.87 m after 600 s and 3.5 m after 1200 s; the 0.2 °/√h random walk adds 0.49 m at 600 s. Halve the bias and you quarter the position error — which is why calibration beats filtering.' },
    { kind: 'lab', labId: 'kalman', title: 'Watch a lie grow',
      brief: 'Fuse a noisy accelerometer with a drifting gyro in the sim and watch the position error grow as a quadratic in time.',
      tasks: [
        'Set gyro bias to 1 °/h and find the time at which the fused heading drifts 1°; compare it with the unfused gyro.',
        'Sweep the filter time constant τ from 0.05 s to 5 s under 3 Hz vibration and report the phase lag and the accelerometer noise passed through.',
        'Drive a 600 s, 1 m/s square path, plot cross-track error against ½vb t², and hold the residual under 0.5 m.',
      ] },
  ],
  keyTerms: [
    { term: 'Quadrature decoding', definition: 'Reading channels A and B 90° apart; four edges per cycle give 4x counting and a direction sign.' },
    { term: 'Counts per revolution (CPR)', definition: 'Encoder cycles per shaft turn; with 4x decoding the count total is 4x that, so 1024 CPR = 4096 counts.' },
    { term: 'Repeatability', definition: 'Spread of returning to the same angle, e.g. ±0.02° on a magnetic encoder; distinct from accuracy and resolution.' },
    { term: 'Quantisation error', definition: 'Half an LSB of unavoidable error; 16-bit over ±2 g is 61 µg = 6.0e-4 m/s².' },
    { term: 'Angle random walk (ARW)', definition: 'White-noise integration rate in °/√h; 0.2 °/√h yields 0.2° of heading error after 1 h.' },
    { term: 'Bias instability', definition: 'The flat minimum of the Allan deviation curve, in °/h; 1-10 °/h consumer, 0.1-1 °/h tactical.' },
    { term: 'Scale-factor error', definition: 'Gain error in proportion to the true rate: 0.1-3% consumer, 0.02% tactical, invisible on a static test.' },
    { term: 'Complementary filter', definition: 'Gyro high-pass plus accelerometer low-pass, α = τ/(τ + Δt) = 0.980 at τ = 0.5 s and Δt = 10 ms.' },
  ],
  quiz: [
    { id: 'w2l3q1', question: 'A 1024-line incremental encoder is decoded on all four edges of A and B. How many counts per revolution?',
      choices: ['512', '1024', '4096', '8192'], answer: 2, level: 'recall',
      explanation: 'Four edges per cycle times 1024 cycles is 4096 counts, so one count is 0.0879°.' },
    { id: 'w2l3q2', question: 'A joint returns to the same commanded angle within ±0.01°, but always sits 0.3° away from the commanded value. Which specification is bad?',
      choices: ['Accuracy', 'Repeatability', 'Resolution', 'Update rate'], answer: 0, level: 'understand',
      explanation: 'The spread of returns is repeatability and it is excellent; the 0.3° offset from truth is accuracy error.' },
    { id: 'w2l3q3', question: 'An AS5600 gives 4096 counts/rev and is mounted on a 0.1 m arm. One count is how much tool arc?',
      choices: ['0.015 mm', '0.153 mm', '1.53 mm', '15.3 mm'], answer: 1, level: 'apply',
      explanation: '0.0879° = 1.534 mrad, and 1.534 mrad x 0.1 m = 0.153 mm at the tool.' },
    { id: 'w2l3q4', question: 'On a log-log Allan deviation plot, the flat minimum of the curve identifies...',
      choices: ['quantisation, slope −1', 'angle random walk, slope −1/2', 'rate random walk, slope +1/2', 'bias instability, slope 0'], answer: 3, level: 'analyze',
      explanation: 'Bias instability is the τ-independent floor; the surrounding slopes are random walk at short τ and rate random walk at long τ.' },
    { id: 'w2l3q5', question: 'Which error source makes dead-reckoned position error grow as t² rather than t or √t?',
      choices: ['Angle random walk', 'Quantisation', 'Constant gyro bias', 'Sensor vibration'], answer: 2, level: 'apply',
      explanation: 'A constant bias makes heading error grow linearly and position error is its integral, giving ½vb t²: 0.87 m at 600 s for 1 m/s and 1 °/h.' },
    { id: 'w2l3q6', question: 'A magnetometer on a vehicle reads heading 40° off. A 100 µT hard-iron offset sits beside a 50 µT Earth field. Best fix?',
      choices: ['Low-pass the heading to 1 Hz', 'Raise the magnetometer full-scale range', 'Use wheel odometry for heading instead', 'Rotate through 3D, fit the ellipsoid, subtract the hard-iron centre and apply the soft-iron inverse'], answer: 3, level: 'design',
      explanation: 'Hard iron shifts the sphere centre and soft iron skews it into an ellipsoid; both are removed by a full ellipsoid calibration, which a filter or a range change cannot do.' },
    { id: 'w2l3q7', question: 'A complementary filter uses τ = 10 s at Δt = 10 ms, so α = 0.999. What is the consequence?',
      choices: ['The accelerometer dominates and the tilt is noisy', 'The gyro dominates, accelerometer correction takes about 10 s, and drift returns', 'The filter becomes numerically unstable', 'Quantisation error disappears'], answer: 1, level: 'analyze',
      explanation: 'α near 1 means a 10 s corner (f_c = 0.016 Hz), so a bump or a bias takes about 10 s to correct — effectively open-loop for normal motion.' },
  ],
  flashcards: [
    { front: 'Quadrature 4x counting', back: 'Two channels 90° apart, four edges per cycle: 1024 CPR becomes 4096 counts/rev.', tag: 'encoders' },
    { front: 'Counts to angle', back: 'Δθ = 360°/(CPR x 4); 4096 counts/rev gives 0.0879° = 1.534 mrad, or 0.153 mm on a 0.1 m arm.', tag: 'encoders' },
    { front: 'Resolution vs accuracy vs repeatability', back: 'Smallest step, closeness to truth, spread on return: 0.088°, ±0.5°, ±0.02° on the same magnetic part.', tag: 'metrics' },
    { front: 'AS5600 / AS5048A', back: 'Magnetic absolute encoders: 12-bit (0.088°) over I²C and 14-bit (0.022°) over SPI, both with ~±0.5° class INL before calibration.', tag: 'parts' },
    { front: 'Resolver', back: 'Rotary transformer with sin/cos secondaries; 2-5 arcmin to 155 °C, read by an AD2S1210 to 10-16 bits.', tag: 'parts' },
    { front: 'Hall commutation', back: 'Three latching sensors at 120° electrical give 6 states per electrical revolution, a 60° step.', tag: 'parts' },
    { front: 'Allan deviation', back: 'σ(τ) on log-log axes: slope −1 quantisation, −1/2 ARW, 0 bias instability at the minimum, +1/2 rate random walk.', tag: 'imu' },
    { front: 'Consumer vs tactical gyro', back: 'ARW 0.2 vs 0.09 °/√h, bias instability 10 vs ~1 °/h, scale factor 1% vs 0.02%.', tag: 'imu' },
    { front: 'Six-position calibration', back: 'Each axis up then down: b = (a+ + a−)/2, s = (a+ − a−)/(2g), plus a 3x3 misalignment matrix.', tag: 'calibration' },
    { front: 'Hard vs soft iron', back: 'Hard iron shifts the field sphere centre (remove by subtraction); soft iron skews it into an ellipsoid (remove by W⁻¹).', tag: 'calibration' },
  ],
  forgePrompts: [
    'Strap an AS5600 to a 3D-printed cycloidal reducer and measure where resolution stops being the limiting error.',
    'Log one hour of a phone IMU at rest on a table, compute the Allan deviation in Python, and find its bias instability in °/h.',
    'Build a two-wheel dead-reckoning cart with no camera, drive it 100 m, and plot the cross-track error against ½vb t².',
  ],
};
