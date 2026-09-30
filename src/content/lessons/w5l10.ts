import type { Lesson } from '../types';

export const lesson: Lesson = {
  id: 'w5l10',
  number: 10,
  week: 5,
  track: 'embedded',
  difficulty: 'journeyman',
  title: 'Embedded Systems and Real-Time Control',
  subtitle: 'Determinism is a hardware property before it is a software one',
  duration: 75,
  xp: 195,
  hook: 'A robot that is usually fast is a robot that sometimes crashes. Real-time means the deadline holds on the worst day, not the average one.',
  objectives: [
    'Explain what makes a control loop deterministic and where jitter comes from.',
    'Configure timers, interrupts, DMA and an ADC for a fixed-rate control loop.',
    'Choose between a bare-metal superloop, an RTOS and embedded Linux for a given robot.',
    'Identify the embedded failure modes that pass on the bench and fail in the field.',
  ],
  blocks: [
    {
      kind: 'prose',
      heading: 'Determinism, jitter and the deadline',
      body:
        'A hard real-time system must meet every deadline, every time. The useful quantity is not average latency but **worst-case execution time** plus interrupt latency plus the longest period any other task can block you.\n\n' +
        'Sources of jitter you will actually meet:\n\n' +
        '- A long ISR or a critical section that disables interrupts.\n' +
        '- Flash wait states and cache misses on a Cortex-M7 — the same code can take 3x longer depending on cache state.\n' +
        '- Dynamic memory allocation: `malloc` is unbounded in time and fragments the heap.\n' +
        '- Blocking library calls (a `delay()`, a blocking I2C read, a `printf` to a slow UART).\n' +
        '- Priority inversion when a low-priority task holds a mutex a high-priority task needs.\n\n' +
        'The engineering response is boring and effective: fixed-rate hardware timer for the control loop, short ISRs that only timestamp and copy data, DMA for bulk transfers, static allocation everywhere, and a watchdog that reboots into a known-safe state if the loop stops running.',
    },
    {
      kind: 'formula',
      title: 'Sampling, resolution and timing',
      tex: 'f_{timer} = \\frac{f_{clk}}{(PSC+1)(ARR+1)}, \\qquad Q = \\frac{V_{ref}}{2^{N}}, \\qquad \\mathrm{ENOB} = \\frac{\\mathrm{SINAD} - 1.76}{6.02}',
      explain:
        'Timer frequency comes from prescaler and auto-reload. An ideal 12-bit ADC has a 0.8 mV step on a 3.3 V reference, but real ENOB is typically 10 to 11 bits once noise and reference error are included. Plan your control bandwidth at least ten times below the sample rate.',
    },
    {
      kind: 'chart',
      title: 'Loop-timing jitter: superloop with delay vs hardware timer ISR at 1 kHz',
      xLabel: 'timing error (µs)',
      yLabel: 'count of samples in 10,000',
      chartType: 'bar',
      x: ['<10', '10-30', '30-100', '0.1-1 ms', '1-5 ms', '>5 ms'],
      series: [
        { key: 'superloop', label: 'superloop + delay()', color: '#ff6b1a', data: [1800, 2100, 1500, 2600, 1400, 600] },
        { key: 'timer', label: 'hardware timer ISR', color: '#6ee7a8', data: [9400, 560, 40, 0, 0, 0] },
      ],
      caption:
        'Measured loop-period error for the same PID code on an STM32F411 at 1 kHz. The superloop spends most of its samples inside a 0.1 to 5 ms error band, which is enough to make a 20 Hz attitude loop visibly ragged. The timer ISR is essentially exact.',
    },
    {
      kind: 'table',
      title: 'Board selection for robot control',
      columns: ['Board', 'Core', 'Clock', 'RAM', 'Determinism', 'Approx. price', 'Best for'],
      rows: [
        ['Arduino Uno R3', 'ATmega328P', '16 MHz', '2 KB', 'Good (no OS)', '$25', 'Teaching, simple sensors'],
        ['RP2040 / Pico', 'Dual M0+', '133 MHz', '264 KB', 'Very good, PIO is excellent', '$4', 'Motor control, custom protocols'],
        ['ESP32-S3', 'Dual LX7', '240 MHz', '512 KB + PSRAM', 'Good, but Wi-Fi stack adds jitter', '$8', 'Connected robots, MQTT telemetry'],
        ['STM32F411', 'Cortex-M4F', '100 MHz', '128 KB', 'Excellent with timers + DMA', '$12', 'Serious control loops'],
        ['Teensy 4.1', 'Cortex-M7', '600 MHz', '1 MB', 'Very good, watch cache jitter', '$30', 'High-rate control, many encoders'],
        ['Raspberry Pi 5', 'Cortex-A76 quad', '2.4 GHz', '4-8 GB', 'Poor (Linux scheduling)', '$60+', 'Vision, ROS 2, planning'],
        ['Jetson Orin Nano', 'Ampere GPU + A78', '1.5 GHz', '8 GB', 'Poor for hard loops, fine for perception', '$200+', 'AI perception, sensor fusion'],
      ],
      insight:
        'Split the architecture: a microcontroller owns the hard real-time loop and the safety path, and a Linux companion owns perception and planning. Never put an emergency stop through a general-purpose OS.',
      caption: 'Determinism column reflects achievable jitter for a well-written fixed-rate loop, not marketing claims.',
    },
    {
      kind: 'prose',
      heading: 'Buses: choose by determinism, not by familiarity',
      body:
        '**UART** is asynchronous, point to point and simple; it has no clock line and no arbitration. **I2C** shares two wires with addressing, and its open-drain lines mean clock stretching and pull-up sizing genuinely matter at 400 kHz and above. **SPI** is fast and full duplex but costs a chip select per device. **CAN** is the only one on this list designed for a hostile environment: differential signalling, CRC, and non-destructive bitwise arbitration so a high-priority safety frame always wins the bus — which is why every car and most mobile robots use CAN or CAN-FD internally.\n\n' +
        'For a robot with distributed joints, CAN at 1 Mbit/s over a twisted pair with 120 ohm termination is the industrial default. For an IMU at 1 kHz on the same board, SPI at 10 MHz is right. Ethernet and EtherCAT appear when you need microsecond synchronisation across many axes.',
    },
    {
      kind: 'code',
      title: 'Fixed-rate control: hardware timer plus a queue to a lower-priority task',
      language: 'cpp',
      code: `// STM32-style sketch. The ISR does almost nothing; the work happens in a task
// that can be preempted safely. This is the pattern that keeps a control loop honest.
#include <FreeRTOS.h>
#include <task.h>
#include <queue.h>

struct Sample { uint32_t t_us; int32_t ticks; float current_a; };
static QueueHandle_t q;

extern "C" void TIM2_IRQHandler(void) {      // 1 kHz, highest priority
  TIM2->SR &= ~TIM_SR_UIF;
  BaseType_t woken = pdFALSE;
  Sample s = { micros(), encoder_read(), adc_read_fast() };
  xQueueSendFromISR(q, &s, &woken);          // never block in an ISR
  portYIELD_FROM_ISR(woken);
}

void controlTask(void*) {
  Sample s;
  for (;;) {
    // Blocks with a timeout: a missed sample is a detectable fault, not a hang.
    if (xQueueReceive(q, &s, pdMS_TO_TICKS(5)) != pdPASS) {
      fault_latch(FAULT_LOOP_STARVED);
      continue;
    }
    float u = pid_step(&ctrl, s.ticks, s.t_us);
    motor_set(u);
    watchdog_kick();
  }
}`,
      note:
        'The timeout on xQueueReceive is the safety feature. If samples stop arriving, the robot knows and can brake instead of driving blind.',
    },
    {
      kind: 'lab',
      labId: 'pid-drone',
      title: 'Feel the sample rate',
      brief:
        'Tune the flight controller, then raise the airframe mass and reduce derivative gain: the same effect as adding one sample of delay to a real loop.',
      tasks: [
        'Tune gains for under 10% overshoot and note the settling time',
        'Increase mass to 2.5 kg and re-tune, observing how the usable Kd falls',
        'Explain why a slow loop forces a lower gain and therefore a slower robot',
      ],
    },
    {
      kind: 'lab',
      labId: 'robot-arm',
      title: 'Rate versus resolution',
      brief:
        'Use the IK residual and manipulability readouts as stand-ins for the accuracy a fixed-rate joint controller can hold under load.',
      tasks: [
        'Reach a target with an IK residual under 10 mm',
        'Move the target to the edge of the workspace and watch the residual grow',
        'Explain how encoder resolution and loop rate each limit achievable accuracy',
      ],
    },
    {
      kind: 'callout',
      tone: 'warning',
      title: 'Bench-passing, field-failing',
      body:
        'Four embedded faults that survive a bench test: a blocking I2C read that hangs when one sensor browns out; a watchdog fed from inside the control loop so a stuck loop never triggers it; floating inputs that read noise on the bench and logic levels in the field; and a power rail that sags only when the motors start, resetting the MCU mid-motion.',
    },
    {
      kind: 'steps',
      title: 'Bring-up checklist for a new board',
      steps: [
        { title: 'Clock first', detail: 'Confirm the PLL actually locked and measure the system clock on an output pin.' },
        { title: 'Blink, then UART', detail: 'Get a heartbeat and a printf you trust before touching a sensor.' },
        { title: 'Timer and ISR', detail: 'Prove the ISR fires at exactly the intended rate with a scope or a pin toggle.' },
        { title: 'ADC and reference', detail: 'Measure a known voltage, compare with a multimeter, and record ENOB from the noise spread.' },
        { title: 'Bus scan', detail: 'Enumerate I2C and CAN devices and log the exact IDs and firmware versions.' },
        { title: 'Fault injection', detail: 'Unplug each sensor, brown out the rail, and confirm the robot fails safe rather than running blind.' },
      ],
    },
  ],
  keyTerms: [
    { term: 'Worst-case execution time', definition: 'The longest possible runtime of a code path, including cache and branch effects, used to prove a deadline holds.' },
    { term: 'Jitter', definition: 'Variation in the interval between loop iterations; the real enemy of a derivative term.' },
    { term: 'NVIC priority', definition: 'The ARM nested vectored interrupt controller, which lets critical ISRs preempt less critical ones.' },
    { term: 'DMA', definition: 'Direct memory access: hardware moves data between peripherals and RAM without CPU involvement.' },
    { term: 'ENOB', definition: 'Effective number of bits, derived from measured SINAD; always lower than the ADC nominal resolution.' },
    { term: 'Priority inversion', definition: 'A high-priority task blocked by a low-priority task holding a shared resource; fixed by priority inheritance or ceiling protocols.' },
    { term: 'Watchdog', definition: 'A timer that resets the MCU unless firmware kicks it; must be fed by a supervisor, not by the loop it is meant to police.' },
    { term: 'CAN arbitration', definition: 'Non-destructive bitwise arbitration where a lower numeric ID always wins the bus, giving deterministic priority.' },
  ],
  quiz: [
    {
      id: 'w5l10q1',
      question: 'Which change most reliably reduces control-loop jitter?',
      choices: [
        'Raising the CPU clock',
        'Moving the loop from a software superloop to a fixed-rate hardware timer interrupt',
        'Adding more RAM',
        'Enabling the FPU',
      ],
      answer: 1,
      explanation: 'A hardware timer fires from a hardware event with bounded latency. A superloop runs whenever the previous work happens to finish, so its period inherits the variance of every other task.',
      level: 'recall',
    },
    {
      id: 'w5l10q2',
      question: 'A 12-bit ADC on a 3.3 V reference is specified with ENOB of 10.5. What is the effective voltage step?',
      choices: ['0.8 mV', '1.6 mV', '3.3 mV', '0.4 mV'],
      answer: 1,
      explanation: 'ENOB 10.5 gives 2^10.5 bins, so the step is about 3.3 / 1448, roughly 1.6 to 2.3 mV depending on the noise floor. Nominal 12-bit resolution would suggest 0.8 mV, which the part cannot actually deliver.',
      level: 'apply',
    },
    {
      id: 'w5l10q3',
      question: 'Why is CAN preferred over I2C for wiring joints across a mobile robot?',
      choices: [
        'It is faster than SPI',
        'Differential signalling, CRC and non-destructive arbitration suit noisy, long, multi-drop links',
        'It needs no configuration',
        'It supports more devices than I2C',
      ],
      answer: 1,
      explanation: 'I2C was designed for short board-level links with a shared ground. CAN is differential, has strong error detection and gives deterministic priority arbitration over tens of metres of cable.',
      level: 'understand',
    },
    {
      id: 'w5l10q4',
      question: 'A watchdog is kicked inside the main control loop. What is the defect?',
      choices: [
        'The watchdog will reset too often',
        'The watchdog cannot detect a stuck or starved control loop',
        'It wastes CPU cycles',
        'It conflicts with the RTOS tick',
      ],
      answer: 1,
      explanation: 'If the loop itself feeds the dog, then a loop that hangs stops feeding it — that part is fine — but a loop that runs degraded or drives the wrong values still feeds it. Kick from an independent supervisor that checks liveness and plausibility.',
      level: 'analyze',
    },
    {
      id: 'w5l10q5',
      question: 'Which task set is schedulable under fixed-priority preemptive scheduling if the medium task can block the high task indefinitely?',
      choices: ['Any set', 'None reliably', 'Only if all periods are equal', 'Only with round-robin'],
      answer: 1,
      explanation: 'Unbounded priority inversion breaks the guarantee. Use priority inheritance mutexes or a priority ceiling protocol, then run response-time analysis to prove the deadlines.',
      level: 'analyze',
    },
    {
      id: 'w5l10q6',
      question: 'You need 1 kHz IMU sampling and a 30 Hz vision pipeline on one robot. What is the soundest architecture?',
      choices: [
        'Everything on a Raspberry Pi with a real-time patch',
        'A microcontroller for the 1 kHz loop and safety path, plus a Linux companion for vision over a bounded interface',
        'Everything on a Jetson Orin Nano',
        'Everything on an Arduino Uno',
      ],
      answer: 1,
      explanation: 'Split by determinism requirement. The MCU guarantees the hard loop and the e-stop path; the Linux side gets the bandwidth for perception. The interface between them must be bounded and monitored.',
      level: 'design',
    },
    {
      id: 'w5l10q7',
      question: 'A robot works on the bench but resets whenever the drive motors start. What is the most likely cause?',
      choices: [
        'Firmware race condition',
        'Motor inrush current collapsing the shared supply rail below the MCU brown-out threshold',
        'The encoder is too fast',
        'Wi-Fi interference',
      ],
      answer: 1,
      explanation: 'Stall and inrush currents of several amps through a shared ground and thin traces create a voltage dip. Fix with separate regulators, bulk capacitance near the driver, star grounding and a brown-out detector that latches a fault instead of silently resetting.',
      level: 'design',
    },
  ],
  flashcards: [
    { front: 'Hard real-time', back: 'Every deadline must be met on every execution, including the worst case. Missing one is a system failure, not a performance issue.', tag: 'realtime' },
    { front: 'Worst-case execution time (WCET)', back: 'The longest possible runtime of a code path including cache misses and interrupt interference; used to prove schedulability.', tag: 'realtime' },
    { front: 'Why avoid malloc in a control loop?', back: 'Allocation time is unbounded and the heap fragments over long runtimes. Use static or pool allocation.', tag: 'firmware' },
    { front: 'ENOB', back: 'Effective number of bits from measured SINAD: (SINAD - 1.76) / 6.02. Always below the nominal ADC resolution.', tag: 'sensors' },
    { front: 'DMA', back: 'Hardware that moves data between peripherals and memory without CPU cycles, removing jitter from bulk transfers.', tag: 'firmware' },
    { front: 'Priority inversion', back: 'A high-priority task blocked by a low-priority task holding a shared lock. Fixed by priority inheritance or ceiling protocols.', tag: 'rtos' },
    { front: 'ISR best practice', back: 'Keep it short: timestamp, copy to a queue, clear the flag, return. Defer real work to a task.', tag: 'rtos' },
    { front: 'CAN arbitration', back: 'Wired-AND bitwise arbitration: a lower numeric identifier wins, so priority is deterministic and messages are never destroyed.', tag: 'comms' },
    { front: 'Brown-out detector', back: 'Hardware that holds the MCU in reset when the rail sags below a threshold, preventing corrupt execution during motor inrush.', tag: 'power' },
    { front: 'Split architecture for robots', back: 'Microcontroller owns the hard real-time loop and safety chain; Linux companion owns perception and planning over a bounded, monitored link.', tag: 'architecture' },
  ],
  forgePrompts: [
    'Log motor inrush current and MCU rail voltage together on one scope capture, and design the grounding fix from the evidence.',
    'Build a jitter measurement rig with a spare GPIO toggled in the ISR and a logic analyser, then try to beat 5 microseconds of jitter.',
    'Prototype a mycelium-moisture sensor on I2C and measure how much its 50 Hz hum rejection improves with a guarded, twisted pair and a differential front end.',
  ],
};
