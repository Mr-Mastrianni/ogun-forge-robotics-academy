import type { Lesson } from '../types';

export const lesson: Lesson = {
  id: 'w3l6',
  number: 6,
  week: 3,
  track: 'control',
  title: 'Control Systems: PID and the Art of Not Oscillating',
  subtitle: 'Feedback is a bet on how to shrink error without ringing',
  duration: 75,
  difficulty: 'journeyman',
  xp: 195,
  hook: 'A loop that rings is a loop that lied about its own delay.',
  objectives: [
    'Derive a closed-loop transfer function and read its ωn, ζ, poles, zeros, overshoot and settling time.',
    'Use Routh–Hurwitz and Bode gain and phase margins to certify stability before touching hardware.',
    'Implement a fixed-rate PID with anti-windup, derivative filtering and setpoint weighting.',
    'Tune by Ziegler–Nichols, Cohen–Coon or relay test, and decide when to replace PID with LQR, MPC, gain scheduling or fuzzy logic.',
  ],
  blocks: [
    { kind: 'prose', heading: 'Open loop, closed loop, and the s-plane',
      body: 'A 0.5 m/s wheel command that never checks its own speed is open loop: load the robot with 2 kg and it delivers something else. Closed loop turns the guess into arithmetic on error, $e = r - y$, and the price is that the correction can arrive late and ring.\n\n' +
        'Laplace turns the plant ODE into a ratio. A motor with inertia $J$ and damping $b$ is $G(s) = 1/(Js+b)$: first order, gain $K$ and time constant $\\tau$, at 63% of its step at $t=\\tau$ and within 2% near $4\\tau$. A mass on a spring, or an inverted pendulum, is second order — natural frequency $\\omega_n$, damping ratio $\\zeta$. The poles are the roots of $1 + C(s)G(s) = 0$: their real part sets decay, their imaginary part sets ringing, and a zero bends the response without moving a pole.\n\n' +
        'Test stability symbolically first. For $G(s) = 1/(s(s+1)(s+2))$ with gain $K_p$ the characteristic polynomial is $s^3 + 3s^2 + 2s + K_p = 0$. Routh–Hurwitz gives $0 < K_p < 6$: at $K_p = 6$ the loop sits on the imaginary axis and rings forever. Frequency-domain checks do the same job with a margin: crossover gain 0 dB, phase margin 45-60°, gain margin at least 6 dB.' },
    { kind: 'formula', title: 'The PID law, parallel and industrial form',
      tex: 'u(t) = K_p e(t) + K_i\\int_0^t e(\\tau)\\,d\\tau + K_d \\frac{de}{dt}, \\qquad C(s) = K_p\\left(1 + \\frac{1}{T_i s} + T_d s\\right)',
      explain: 'The two forms are the same controller: K_i = K_p/T_i and K_d = K_p T_d. Set K_i = K_d = 0 and you have an open loop wearing a sensor.' },
    { kind: 'prose', heading: 'P, I, D as three physical bets',
      body: '**P** is a spring: more push the further you are, but alone it holds a standing offset, $e_{ss} = r/(1+K_pK)$ for a type-0 plant. **I** is memory: it integrates the offset away — which is why a quad with $K_i = 12$ N m⁻¹ s⁻¹ reaches the commanded altitude exactly, and why it also overshoots after a long saturation. **D** is a brake that reads velocity rather than error: it adds damping, and it must be low-pass filtered, because differentiating a 12-bit encoder over 5 ms amplifies one count into 0.015 m/s of rate noise.\n\n' +
        'Four practical guards. **Anti-windup** clamps the integrator and back-calculates with a tracking time $T_t \\approx 0.1$ s so the state re-enters the linear region already agreeing with the saturated output. **Derivative on measurement** plus setpoint weighting ($b$ on P, no setpoint through D) removes the derivative kick after a step. **Deadband** (a 0.5 °C thermostat band) and hysteresis stop chatter. **Feedforward** adds the torque you already know — 11.8 N of hover thrust for a 1.2 kg quad — leaving PID to correct only model error. **Cascade** splits the job: position 100 Hz → velocity 1 kHz → current 20 kHz, each loop 10-20× faster than the one it serves.' },
    { kind: 'formula', title: 'Second-order step response and overshoot',
      tex: 'G(s) = \\frac{\\omega_n^2}{s^2 + 2\\zeta\\omega_n s + \\omega_n^2}, \\qquad y(t) = 1 - e^{-\\zeta\\omega_n t}\\left[\\cos\\omega_d t + \\frac{\\zeta}{\\sqrt{1-\\zeta^2}}\\sin\\omega_d t\\right], \\qquad M_p = e^{-\\pi\\zeta/\\sqrt{1-\\zeta^2}}',
      explain: 'ωd = ωn√(1-ζ²). At ζ = 0.2 the first peak is 1.52 (52% overshoot); at ζ = 0.7 it is 1.046 (4.6%) and ts ≈ 4/(ζωn) = 1.43 s for ωn = 4 rad/s. ζ ≥ 1 never overshoots and feels slow.' },
    { kind: 'chart', title: 'Step response at ωn = 4 rad/s for three damping ratios',
      caption: 'Numerical solution of the closed loop; the ±2% band is reached near 5 s at ζ = 0.2 and near 1.5 s at ζ = 1.',
      chartType: 'line', xLabel: 'time (s)', yLabel: 'output y (unit step)',
      x: [0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0],
      series: [
        { key: 'u', label: 'underdamped ζ = 0.2', color: '#ef4444', data: [0, 0.4051, 1.1275, 1.5151, 1.3845, 1.0055, 0.7473, 0.7657, 0.9557, 1.1166, 1.1361, 1.046, 0.9508] },
        { key: 'c', label: 'critical ζ = 1.0', color: '#f59e0b', data: [0, 0.2643, 0.594, 0.8009, 0.9084, 0.9596, 0.9826, 0.9927, 0.997, 0.9988, 0.9995, 0.9998, 0.9999] },
        { key: 'o', label: 'overdamped ζ = 2.0', color: '#38bdf8', data: [0, 0.1777, 0.3696, 0.5178, 0.6311, 0.7178, 0.7842, 0.8349, 0.8737, 0.9034, 0.9261, 0.9435, 0.9568] },
      ] },
    { kind: 'formula', title: 'Ziegler–Nichols closed loop from a relay test',
      tex: 'K_u = \\frac{4d}{\\pi a}, \\qquad K_p = 0.6K_u, \\qquad T_i = 0.5T_u, \\qquad T_d = 0.125T_u',
      explain: 'Relay amplitude d = 5% and measured oscillation a = 2% give Ku = 4(0.05)/(π·0.02) = 3.18; with Tu = 2.0 s the PID set is Kp = 1.91, Ti = 1.0 s, Td = 0.25 s.' },
    { kind: 'table', title: 'Tuning methods for a plant modelled as K e^(-Ls)/(Ts+1)',
      caption: 'Open-loop rows use K = 1.5, T = 12 s, L = 3 s; the closed-loop row uses Ku = 3.18, Tu = 2.0 s; SIMC uses Tc = L. Aggressive rules assume you can afford 25% overshoot.',
      columns: ['Method', 'Model needed', 'Rule', 'Example Kp, Ti, Td', 'Use when'],
      rows: [
        ['Manual step test', 'none', 'raise Kp to ringing, back off 30%, then add Ti, Td', '3.0, 4.0 s, 0.8 s', 'one axis, hardware on the bench'],
        ['ZN open loop (reaction curve)', 'K, T, L', 'Kp = 1.2T/(KL), Ti = 2L, Td = 0.5L', '3.2, 6.0 s, 1.5 s', 'L/T below 0.3, low noise'],
        ['ZN closed loop (ultimate)', 'Ku, Tu', 'Kp = 0.6Ku, Ti = 0.5Tu, Td = 0.125Tu', '1.91, 1.0 s, 0.25 s', 'a limit-cycle test is acceptable'],
        ['Cohen–Coon', 'K, T, L', 'Kp = (1.35T/L + 0.27)/K', '3.78, 3.78 s, 0.63 s', 'dead time dominates, L/T above 1'],
        ['Relay autotune (Åström–Hägglund)', 'relay d, amplitude a', 'Ku = 4d/(πa), then ZN closed loop', 'Ku = 3.18, Tu = 2.0 s', 'commissioning many identical axes'],
        ['SIMC / AMIGO (robust)', 'K, T, L', 'Kp = T/(K(L+Tc)), Ti = min(T, 4(L+Tc))', '1.33, 12 s, 0', 'margins matter more than speed'],
      ] },
    { kind: 'code', title: 'Fixed-rate PID with dt from a timer, anti-windup and filtered derivative', language: 'cpp',
      note: 'Derivative acts on measurement so a setpoint step does not kick the output; the clamp error is fed back through Tt so the integrator unwinds during saturation. Add the 11.8 N hover feedforward after this function.',
      code: `#include <algorithm>
struct Pid {                       // 1.2 kg quad, altitude loop at 50 Hz
  double kp = 19.2, ki = 12.0, kd = 6.72;   // N/m, N/(m s), N s/m
  double tf = 0.02, tt = 0.10;              // D filter, tracking time (s)
  double b = 1.0, I = 0.0, D = 0.0, yprev = 0.0;
  double imin = -2.0, imax = 2.0, umin = 0.0, umax = 23.5;
};
double pidStep(Pid& p, double sp, double y, double dt) {
  const double e = p.b * sp - y;                     // P on weighted setpoint
  const double dy = y - p.yprev;                     // measurement, not error
  p.yprev = y;
  p.D = (p.tf * p.D - p.kd * dy) / (p.tf + dt);      // first-order filtered D
  const double u_raw = p.kp * e + p.I + p.D;
  const double u = std::clamp(u_raw, p.umin, p.umax);
  p.I = std::clamp(p.I + p.ki * e * dt + (u - u_raw) * dt / p.tt, p.imin, p.imax);
  return u + 11.8;                                   // hover feedforward
}` },
    { kind: 'steps', title: 'From the s-plane to firmware',
      steps: [
        { title: 'Sample 10-20× the bandwidth', detail: 'The altitude loop closes near 0.64 Hz (ωn = 4 rad/s), so 50 Hz is ample; the 5 Hz inner rate loop runs at 400 Hz, roughly 80×.' },
        { title: 'Discretise with Tustin', detail: 's ≈ (2/T)(z-1)/(z+1). At 100 Hz a 1 Hz pole maps to 6.284 rad/s against the exact 6.283 rad/s, a 0.02% error; prewarp only when a notch sits near Nyquist.' },
        { title: 'Budget the delay', detail: 'Every T of dead time costs 57.3·ωc·T degrees. At ωc = 31.4 rad/s a 20 ms sensor costs 36° and eats most of a 45° phase margin, so either sample faster or lower the loop.' },
        { title: 'Check quantisation against Kd', detail: 'A 12-bit ADC over 3.3 V is 0.806 mV/LSB; a 4096 CPR encoder on a 100 mm wheel is 0.077 mm/count, and one count over 5 ms is 0.015 m/s, which Kd = 6.72 converts into 0.10 N of thrust noise. Filter D at 8 Hz first.' },
        { title: 'Verify, then retune at the edges', detail: 'Sweep the Bode plot and confirm PM 45-60° and GM ≥ 6 dB, then repeat loaded, unloaded, hot and cold; keep 2-5 dB of extra margin for the worst case.' },
      ] },
    { kind: 'callout', tone: 'insight', title: 'Three robots, three loops',
      body: '**Line follower**: 8 IR sensors 20 mm apart, sampled at 1 kHz, loop at 200 Hz with Kp = 0.8 and Kd = 0.02; past Kp ≈ 2.5 the 5 ms loop at 0.5 m/s oscillates because D sees 3 mm sensor quantisation.\n\n' +
        '**Balancing robot**: 0.3 m tall, ωn = 6 rad/s and ζ = 0.8 give 4/(ζωn) = 0.83 s settling; the 500 Hz IMU loop adds a 2 ms delay, only 57.3·6·0.002 = 0.7° of phase at crossover.\n\n' +
        '**Drone altitude hold**: 1.2 kg, 11.8 N hover feedforward, Kp = 19.2, Kd = 6.72, Ki = 12; a 3 s saturation at 23.5 N without clamping at ±2 N lets the integrator wind to a 4 m drop before it recovers.' },
    { kind: 'lab', labId: 'pid-drone', title: 'Tune the altitude loop',
      brief: 'Hold a 1.2 kg quad at 5 m through a step, a 2 N gust and a 3 s thrust saturation.',
      tasks: [
        'Pick Kp and Kd for at most 10% overshoot and 2 s settling, then report the resulting ωn and ζ.',
        'Clamp the integrator at ±2 N, saturate the throttle for 3 s and measure the recovery time with and without back-calculation.',
        'Raise Kp until the gain margin falls below 6 dB and log the crossover frequency and phase margin at that point.',
      ] },
    { kind: 'lab', labId: 'gait', title: 'Close the loop on a leg',
      brief: 'Tune joint-level PID on a walking gait and watch tracking error grow when contact disturbs the plant.',
      tasks: [
        'Tune the hip position loop for at most 5% overshoot at a 1.5 Hz step rate and record its phase margin.',
        'Add 10 ms of sensor delay and find the phase margin at which the foot begins to bounce on contact.',
        'Compare a single 100 Hz position loop with a cascaded 1 kHz velocity loop on the same step and chart the error.',
      ] },
  ],
  keyTerms: [
    { term: 'Transfer function G(s)', definition: 'Laplace ratio of output to input; the plant and controller algebra that replaces an ODE.' },
    { term: 'Natural frequency ωn', definition: 'Undamped ringing rate of a second-order loop, in rad/s; with ζ it fixes overshoot and settling time.' },
    { term: 'Damping ratio ζ', definition: 'Energy removal per cycle; ζ = 0.7 gives 4.6% overshoot, ζ ≥ 1 none.' },
    { term: 'Percent overshoot Mp', definition: 'exp(-πζ/√(1-ζ²)) as a percentage; the first peak above the setpoint.' },
    { term: 'Integral windup', definition: 'Integrator growth during actuator saturation; fixed by clamping and back-calculation.' },
    { term: 'Derivative kick', definition: 'A spike from differentiating a setpoint step; removed by acting on measurement and weighting b.' },
    { term: 'Phase margin', definition: 'Phase above -180° where loop gain crosses 0 dB; 45-60° is the working band.' },
    { term: 'Dead time L', definition: 'Transport or sensor delay that costs 57.3·ωc·L degrees of phase and caps achievable bandwidth.' },
  ],
  quiz: [
    { id: 'w3l6q1', question: 'For a controller C(s) and plant G(s) with unity feedback, the closed-loop transfer function is...',
      choices: ['C G / (1 + C G)', 'C G / (1 - C G)', 'G / (1 + C)', 'C / (1 + C G)'], answer: 0, level: 'recall',
      explanation: 'y = C G (r - y) gives y/r = C G/(1 + C G); the denominator 1 + C G is the characteristic polynomial.' },
    { id: 'w3l6q2', question: 'A second-order loop has ζ = 0.2 and ωn = 4 rad/s. What does the step response do?',
      choices: ['Settles without overshoot in about 1 s', 'Overshoots by about 5%', 'Rises slowly and never reaches the setpoint', 'Overshoots by about 52% and rings at 3.9 rad/s'], answer: 3, level: 'understand',
      explanation: 'Mp = exp(-π(0.2)/√(1-0.04)) = 0.527, and ωd = ωn√(1-ζ²) = 3.92 rad/s sets the ring rate.' },
    { id: 'w3l6q3', question: 'G(s) = 1/(s(s+1)(s+2)) with proportional gain Kp. What is the largest Kp that stays stable?',
      choices: ['2', '4', '6', '12'], answer: 2, level: 'apply',
      explanation: '1 + Kp G = 0 gives s³ + 3s² + 2s + Kp; Routh requires Kp > 0 and (3·2 - Kp)/3 > 0, so Kp < 6.' },
    { id: 'w3l6q4', question: 'A position loop spikes the motor command for one sample whenever the operator steps the setpoint. Best fix?',
      choices: ['Raise Kp', 'Derivative on measurement, with setpoint weighting b on P', 'Lower the sampling rate', 'Remove the integrator'], answer: 1, level: 'analyze',
      explanation: 'The kick is Kd·d(setpoint)/dt acting on a step; differentiating the measurement and weighting the P term removes it without losing damping.' },
    { id: 'w3l6q5', question: 'ζ = 0.7 and ωn = 4 rad/s. Using ts ≈ 4/(ζωn), the 2% settling time is about...',
      choices: ['0.36 s', '0.70 s', '5.71 s', '1.43 s'], answer: 3, level: 'apply',
      explanation: '4/(0.7·4) = 1.43 s. The 4 in the numerator is the 2% band; use 3 for the 5% band.' },
    { id: 'w3l6q6', question: 'A 1.2 kg quad holds altitude but the throttle saturates for 3 s during a climb, then it drops 4 m. First fix?',
      choices: ['Clamp the integrator and add back-calculation plus hover feedforward', 'Double Kp', 'Delete the derivative term', 'Sample the barometer faster'], answer: 0, level: 'design',
      explanation: 'The integrator wound up while the actuator could not follow; clamping, tracking-time back-calculation and 11.8 N of feedforward remove the wind-up excursion.' },
    { id: 'w3l6q7', question: 'A relay test with amplitude d = 5% produces a limit cycle of amplitude a = 2% at period Tu = 2.0 s. The ultimate gain Ku is about...',
      choices: ['0.64', '1.59', '3.18', '6.37'], answer: 2, level: 'understand',
      explanation: 'Ku = 4d/(πa) = 4(0.05)/(π·0.02) = 3.18; ZN closed loop then gives Kp = 0.6Ku = 1.91, Ti = 1.0 s, Td = 0.25 s.' },
  ],
  flashcards: [
    { front: 'Closed-loop transfer function', back: 'T(s) = C(s)G(s)/(1 + C(s)G(s)); the denominator is the characteristic polynomial.', tag: 'stability' },
    { front: 'Natural frequency ωn', back: 'Undamped ring rate in rad/s; with ζ it sets overshoot and settling time.', tag: 'second-order' },
    { front: 'Damping ratio ζ', back: '0.2 gives 52% overshoot and a 1.52 peak; 0.7 gives 4.6%; 1 and above none.', tag: 'second-order' },
    { front: 'Overshoot formula', back: 'Mp = exp(-πζ/√(1-ζ²)); use it before running the loop.', tag: 'second-order' },
    { front: 'Settling time', back: 'ts ≈ 4/(ζωn) for the ±2% band, 3/(ζωn) for ±5%.', tag: 'second-order' },
    { front: 'Routh–Hurwitz', back: 'Sign test on the first column of the Routh array; for s³+3s²+2s+Kp it gives 0 < Kp < 6.', tag: 'stability' },
    { front: 'Bode margins', back: 'PM 45-60° where gain crosses 0 dB; GM at least 6 dB where phase crosses -180°.', tag: 'stability' },
    { front: 'ZN closed loop', back: 'From Ku and Tu: Kp = 0.6Ku, Ti = 0.5Tu, Td = 0.125Tu.', tag: 'tuning' },
    { front: 'Relay autotune', back: 'Ku = 4d/(πa) from relay amplitude d and oscillation a; Tu is the oscillation period.', tag: 'tuning' },
    { front: 'Back-calculation anti-windup', back: 'I += (u_sat - u_raw)·dt/Tt with Tt ≈ 0.1 s so the integrator tracks the real actuator limit.', tag: 'implementation' },
  ],
  forgePrompts: [
    'Build a 1-DOF pendulum with a $12 encoder and a hobby servo, then run a relay autotune by hand and compare Ku with the one you find by raising Kp.',
    'Log your thermostat for a day: measure the 0.5 °C deadband and hysteresis, then add feedforward from outdoor temperature and see the cycling time change.',
    'Write a 20-line Python MPC for a 1.2 kg quad altitude hold with a 23.5 N thrust limit and race it against your tuned PID on the same 2 N gust.',
  ],
};
