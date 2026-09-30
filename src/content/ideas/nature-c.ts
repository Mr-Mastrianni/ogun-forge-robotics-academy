import type { IdeaProject } from '../types';

/**
 * Idea Lab — "Nature & Natural Elements", volume C. Four organism-to-machine
 * briefs: honeybee tau-dot landing, sunflower phototropism as a heliostat,
 * moth pheromone anemotaxis, weakly electric fish electroreception.
 * `scienceGrounding` 88–92 means both the biology and the engineering
 * replication are peer-reviewed and repeatable; 76–82 means the biology is
 * solid but the hardware substitute is lossy.
 */
export const natureProjectsC: IdeaProject[] = [
  {
    id: 'nature-oyin-tau-optic-flow-landing',
    title: "Oyin's Descent — Tau-Dot Optic-Flow Landing",
    tagline: "A downward global-shutter camera, one divergence estimate per frame and Lee's tau-dot law: land a small drone softly with no sonar, no LiDAR and no barometric altitude.",
    category: 'nature',
    difficulty: 'master',
    buildTime: '5–7 weekends (about 45 h), then 3 tethered and netted flight sessions',
    costBand: '$$',
    wakandaIndex: 71,
    diyFeasibility: 60,
    scienceGrounding: 92,
    realitySplit: {
      real: "Tau theory is a quantitative, falsifiable control law and tau-dot is one measurable number. For a downward camera the optical-flow field diverges radially at D = v_z / h (units 1/s), so tau = 1/D is time-to-contact and holding tau-dot at c requires the acceleration v_z-dot = -(1+c)·D·v_z. That integrates to v_z = v_z0·exp(-(1+c)·∫D dt), so the whole descent profile follows from flow divergence plus one known scale — the commanded speed at the start of the descent. No rangefinder, no absolute altitude, no map. Touchdown velocity, tau-dot tracking error and flow-dropout fraction are all directly loggable from your own flight data.",
      narrative: "The drone-lands-like-a-bee framing is the story, not the result. A honeybee has a compound eye with far higher temporal resolution, a head that counter-rotates, and roughly 100 million years of loop tuning; a 30 fps camera on a vibrating airframe is a poor imitation. Bees also use more than tau, and tau-dot control does not by itself guarantee a soft touchdown: near the ground the image motion becomes too fast to track, so every real implementation hands over to a fixed slow descent or a terminal sensor. Report the handover height honestly — that is where the biomimicry stops.",
    },
    summary: "Point a global-shutter camera straight down, estimate the radial expansion of the optical-flow field between frames, and close the vertical loop on tau-dot instead of on altitude. Build the 2 m vertical rail rig first — a counterweighted carriage carrying camera, IMU and flight-controller stack — so the loop is tuned with nothing at risk. Then fly it on a small quadcopter inside a netted enclosure over a textured mat and log 20 landings. The deliverable is a touchdown-velocity distribution and a tau-dot tracking plot, plus a baseline using the sonar you deliberately did not use.",
    science: "Lee's 1976 tau theory starts from a simple observation: tau = x / x-dot (distance over closing speed) equals the time remaining before contact, and it is available directly from the retina because it is the inverse of the relative rate of expansion of the image. Its derivative tau-dot is dimensionless. tau-dot = -0.5 means constant deceleration and a zero-velocity arrival in finite time; -1 < tau-dot < 0 means you decelerate and stop; tau-dot at or below -1 means you cannot stop and will impact; tau-dot = 0 is constant velocity. Honeybees landing on a horizontal surface were found by Srinivasan and colleagues to regulate the angular velocity of the image of the surface so that expansion is held at a constant rate — equivalent to holding tau-dot near -0.5 — and the same group proposed the scheme for autonomous aircraft. It is a working example of sensorimotor intelligence that needs no depth sensor and no map: the control variable is a dimensionless time, not a distance. The engineering caveats are real. Divergence estimation needs trackable texture, a global shutter (rolling shutter shears the features and biases D), and enough frame rate that inter-frame displacement stays small; motion blur, prop-wash dust and a uniform concrete floor all break it.",
    billOfMaterials: [
      { item: 'Global-shutter mono camera module (Arducam OV9281, 1 MP, USB or MIPI)', qty: '1', note: 'about $30; global shutter is non-negotiable, rolling shutter biases divergence' },
      { item: 'Companion computer (Raspberry Pi Zero 2 W or Pi 4)', qty: '1', note: 'about $20–60; runs the flow estimator at 30–60 fps' },
      { item: 'Small quadcopter frame + flight controller (PX4 or ArduPilot, e.g. Kakute H7)', qty: '1', note: 'about $80–150; must accept an external vertical-velocity setpoint' },
      { item: '6-axis IMU (ICM-42688) with microSD logging', qty: '1', note: 'about $15; vertical velocity and the touchdown transient at 200 Hz' },
      { item: '2 m vertical guide rail + linear carriage + counterweight, and a 2 × 2 m textured mat', qty: '1 set', note: 'about $60 built from hardware-store parts; camera stays nadir' },
      { item: 'Baseline sensors for the A/B run: TF-Luna LiDAR or HC-SR04 + BMP280', qty: '1', note: 'about $25; shows what you gave up by removing the rangefinder' },
      { item: 'Netted flight enclosure (3 × 3 × 2.5 m) or an indoor hall booking', qty: '1', note: 'about $40; the net and prop guards are the primary safety system' },
      { item: 'ND filter + matte lens hood for the downward camera', qty: '1', note: 'about $15; stops exposure saturation that silently kills feature tracking' },
    ],
    buildSteps: [
      { title: 'Build the rail rig and characterise the estimator on it',
        detail: 'A 2 m drawer slide with a counterweighted carriage carrying camera, IMU and flight-controller stack; a hand winch or stepper pulls it down and the controller only reads the motion. Then translate it at known speeds and compare the divergence your estimator reports against ground truth D = v / h from a tape measure and a stopwatch. Target within 10% over D = 0.2 to 5 per second.' },
      { title: 'Implement the divergence estimator',
        detail: 'Per frame pair: detect 80–150 corners with Shi-Tomasi, track them with pyramidal Lucas-Kanade, then fit the model u = c + D·(x - x0) plus a small rotation term and take D from the fit. Reject frames with fewer than 40 surviving tracks and log the residual, the track count and D for every frame.' },
      { title: 'Close the tau-dot loop',
        detail: 'Compute tau = 1/D, median-filter it over 5 frames, estimate tau-dot by finite difference over 0.2 s, and run a PI loop whose setpoint is c = -0.5. The output is a vertical velocity setpoint clamped to ±1.5 m/s. Run the loop at 20–30 Hz, deliberately slower than the flow estimator.' },
      { title: 'Handle the terminal phase explicitly',
        detail: 'Below the height where the tracker starts losing features — measure it, typically 0.2–0.4 m — switch to a constant 0.15 m/s descent and log the handover height and the value of D at handover. Two of the three numbers in a good landing report come from this switch.' },
      { title: 'Break it on purpose on the rail',
        detail: 'Run the rail with a plain painted floor, a glossy floor, low light, and dust blown into the field of view. Record the fraction of frames with a valid divergence in each case. If more than 20% of frames drop out, do not fly yet — fix the texture or the lighting instead.' },
      { title: 'Fly and log 20 landings',
        detail: 'In the netted enclosure from 2.0 m: 20 landings on the tau-dot law and 20 on the sonar baseline, IMU logged at 200 Hz plus the full divergence stream. Report the touchdown velocity distribution (median and 90th percentile), horizontal drift at contact, bounce count, and every flight where you had to take manual control.' },
    ],
    code: {
      language: 'python',
      snippet:
        '# Tau-dot vertical controller: D is the flow divergence, v_z the vertical velocity.\n' +
        'C_TARGET = -0.5                       # constant deceleration == tau-dot of -0.5\n' +
        'def v_setpoint(D, v_z, c=C_TARGET):\n' +
        '    return clamp(v_z - (1.0 + c) * D * v_z * DT, -1.5, 1.5)\n' +
        '# v_z = v_z0 * exp(-(1+c) * integral(D dt)): the initial speed is the only scale needed.',
      note: 'C_TARGET is the experiment, not a constant to tune for prettiness: run the rail at -0.3, -0.5 and -0.7 and report how the landing profile changes. Anything at or below -1.0 is a collision controller.',
    },
    metrics: [
      { label: 'touchdown vertical velocity, tau-dot law', value: '0.10–0.35 m/s median, 90th percentile under 0.5 m/s (target)' },
      { label: 'tau-dot tracking error above 0.4 m', value: 'mean |c_measured - (-0.5)| < 0.15' },
      { label: 'divergence accuracy on the rail', value: 'within 10% of v_z / h for D = 0.2–5 s^-1' },
      { label: 'terminal handover height', value: 'report it (expect 0.2–0.4 m) with the D value at handover' },
      { label: 'touchdown position accuracy', value: 'within 25 cm of the pad centre over 20 landings' },
    ],
    stretchGoals: [
      'Fly descents at three constant divergence setpoints and test whether the measured velocity profile matches the deceleration shape reported for landing honeybees, or only the qualitative claim.',
      'Use only the ventral band of the image (the lowest 30% of rows, the bee equivalent of its ventral eye region) and see how much accuracy you lose against the full field.',
      'Test the scale-free profile assumption: derive v_z by integrating the exponential of D and see whether it survives a downdraft or a deliberate gust from a fan.',
    ],
    safety: [
      'Spinning propellers are the main hazard: fit prop guards, close the net before arming, never run a props-on tuning session indoors without both the net and eye protection, and fit a hardware kill switch plus a battery disconnect reachable without putting a hand near the props.',
      'LiPo fire: charge on a non-flammable surface inside a LiPo-safe bag, never unattended, never charge a puffed or dented cell, and keep a bucket of dry sand — not water — beside the bench.',
      'The counterweighted rail carriage stores real energy: add a mechanical end-stop and a top clamp, keep fingers out of the carriage path, and never stand or lean under the carriage at any point in travel.',
      'A downward-facing camera on a drone sees other people and private property: fly only inside the enclosure, never above a person, and delete any logged video of a shared space when the experiment ends.',
    ],
    lessonLinks: ['w2l4', 'w3l6', 'w6l11'],
    sources: [
      { label: 'Srinivasan, Zhang, Chahl, Barth and Venkatesh, Landing strategies in honeybees, and possible applications to autonomous airborne vehicles (Biological Bulletin 2001) — PubMed record', url: 'https://pubmed.ncbi.nlm.nih.gov/11341587/' },
      { label: 'Lee, A theory of visual control of braking based on information about time-to-collision (Perception 1976) — PubMed record', url: 'https://pubmed.ncbi.nlm.nih.gov/1005020/' },
      { label: 'Tau as a potential control variable for visually guided braking (J. Exp. Psychol. Hum. Percept. Perform. 2006) — PubMed record', url: 'https://pubmed.ncbi.nlm.nih.gov/16634669/' },
    ],
  },
  {
    id: 'nature-sunmo-phototropic-osmotic-heliostat',
    title: 'Súnmọ́ Ìmọ́lẹ̀ — Phototropic Osmotic Heliostat',
    tagline: "Yoruba: sún mọ́ ìmọ́lẹ̀, draw near the light. A mirror that leans toward the sun the way a shoot does — differential length change on the shaded flank — with a McKibben twin as the honest strong baseline and a full day of angle error as the verdict.",
    category: 'nature',
    difficulty: 'journeyman',
    buildTime: '4–6 weekends (about 35 h), plus one full clear-sky tracking day per variant',
    costBand: '$$',
    wakandaIndex: 68,
    diyFeasibility: 66,
    scienceGrounding: 80,
    realitySplit: {
      real: "Differential actuation as a control law, and the measured consequence. Two light sensors give a signed irradiance asymmetry; the controller integrates it with a deadband — the growth rate — and drives two actuators in antiphase while an encoder or IMU measures the mirror normal. Sun position is computed independently from the NREL Solar Position Algorithm, so mean and peak angle error in degrees, actuator energy in joules per day, and the clock-on versus clock-off comparison are all numbers from your own logs. The McKibben force model is textbook and you can verify it on a load cell.",
      narrative: "The plant story — the machine grows toward the light — is framing, not mechanism. A hydrogel does not photosynthesise a purpose and a heliostat is not alive; the accurate claim is that you implemented one documented mechanism, asymmetric length change, with two inorganic actuators and a clock. Beware the heliostat romance generally: real concentrating heliostats need arc-second-class pointing, and a soft actuator will not get within two orders of magnitude of that. Present this as a characterisation of slow soft actuation, never as a power plant.",
    },
    summary: "Build a phototropic tracker: a four-quadrant light sensor on a two-axis mirror mount, two actuators that change length differentially, and a growth-law controller that integrates the light asymmetry the way auxin-driven elongation does. Version A is an osmotic actuator — a superabsorbent-polymer or pNIPAM pouch inside a semipermeable membrane, swelling and shrinking as an ionic gradient is driven across it. Version B is a pair of antagonistic McKibben pneumatic muscles. Run both against the sun for a full day, log mirror angle against the solar position algorithm, and report angle error, actuator energy and each actuator time constant.",
    science: "Phototropism is molecularly characterised. Unilateral blue light is absorbed by phototropin 1 and 2 at the shoot tip; the signal redistributes the auxin efflux carrier PIN3 so auxin accumulates on the shaded flank, and auxin drives acid-growth cell-wall loosening, so the shaded side elongates more and the organ bends toward the light. This Cholodny–Went account is now well supported. Sunflower heliotropism adds a clock: Atamian and colleagues showed that young sunflowers track the sun from east to west by day and reorient east at night, and that the asymmetry comes from a circadian rhythm of stem elongation — the west side grows more by day, the east side more at night — rather than from light alone. That is the idea worth stealing: a slow differential-length actuator plus a circadian feed-forward term. The McKibben muscle is the honest muscle. With braid angle theta and pressure P the force is F = (pi·D^2/4)·P·(3·cos^2(theta) - 1), so it produces zero force at the 54.7 degree null angle and cannot contract past it; a 10 mm-bore muscle at 300–500 kPa develops roughly 30–60 N at low contraction, with 10–20% free contraction and a response time of tens of milliseconds. Osmotic actuation is the opposite trade: constrained swelling pressures reach hundreds of kPa, but free swelling takes minutes to hours and blocked force depends entirely on how you cage the pouch. That is precisely why a plant can hold up a stem and not a mirror in a gust.",
    billOfMaterials: [
      { item: 'pNIPAM or sodium polyacrylate + dialysis membrane, plus distilled water, NaCl and a 60 mL syringe', qty: '1 set', note: 'about $40; cage the pouch between perforated plates so swelling becomes force' },
      { item: 'McKibben muscle, 10 mm bore × 150 mm, braided sleeve', qty: '2', note: 'about $20 each; DIY from latex tube + PET braid is cheaper' },
      { item: 'Compressor + regulator + 0–1 MPa gauge + pressure-relief valve + 5 µm filter', qty: '1 set', note: 'about $80; relief valve set below the sleeve rating' },
      { item: 'Solenoid valves (3/2) + MOSFET drivers + flyback diodes', qty: '2', note: 'about $10 each; pressurise and vent each muscle, PWM for proportional control' },
      { item: 'Four-quadrant photodiode, or 4 × BPW34 with a shadow bar', qty: '1', note: 'about $15; the eye: a signed asymmetry straight out of the sensor' },
      { item: 'Two-axis gimbal mirror mount + 300 × 300 mm acrylic-fronted mirror', qty: '1', note: 'about $50; cover the mirror when adjusting, beam dump downstream' },
      { item: 'AS5600 magnetic encoders or MPU6050 IMU on both axes', qty: '2', note: 'about $5 each; mirror-normal ground truth, two axes' },
      { item: '20 kg load cell + HX711 + ESP32 + microSD logger', qty: '1 set', note: 'about $25; blocked-force measurement and the day-long log' },
    ],
    buildSteps: [
      { title: 'Characterise both actuators, then choose the honest one',
        detail: 'Mount each candidate in a rigid frame with a load cell and a displacement sensor. Sweep the McKibben muscle 0–500 kPa at three loads and plot force and contraction; check the predicted null angle. Log the osmotic pouch mass uptake, blocked force and free strain against time and salt gradient — expect minutes to hours and hysteresis on the return. Then decide: McKibben plus a cable reduction for a tracker that works today, or two osmotic pouches for a tracker that moves in minutes. Say which and why.' },
      { title: 'Build the light-sensing head',
        detail: 'Mount a shadow bar over a four-quadrant photodiode so a tilt produces a signed difference between opposite quadrants. Calibrate on a dividing table: record quadrant asymmetry against known angle. The slope is your sensor gain; the noise floor sets the smallest tilt you can resolve.' },
      { title: 'Mount the mirror and control the beam path',
        detail: 'Two-axis gimbal, mirror on the moving plate, one encoder per axis. Aim the reflected beam into a fixed blackened steel beam dump or a plastered wall section above head height, fenced off, and never let the beam cross a walking route, a window or a doorway.' },
      { title: 'Write the growth law',
        detail: 'u = K·(E_shaded - E_lit) integrated with a deadband and a leak term, plus a circadian feed-forward: a stored sun-course model that drives the mirror open-loop while the sensor only trims. Drive the two muscles in antiphase with valve duty proportional to u, and clamp the integrator so it cannot wind up overnight.' },
      { title: 'Run the tracking day',
        detail: 'Log mirror normal from the encoders, quadrant asymmetry, irradiance and actuator energy at 1 Hz from sunrise to sunset. Compute the sun vector independently with the NREL Solar Position Algorithm, then plot angle error across the whole day for the McKibben variant, the osmotic variant and a geared-servo baseline.' },
      { title: 'Measure the night return',
        detail: 'After sunset, run the circadian feed-forward alone with the sensors dark and record whether the mirror returns east and how long it takes. Then repeat a day with the clock disabled and compare energy and hunting cycles. That difference is the measured value of the biological clock — the most interesting number this project produces.' },
    ],
    code: {
      language: 'python',
      snippet:
        '# Phototropic growth law: differential length change from light asymmetry.\n' +
        'u = 0.0\n' +
        'def tropism_step(dE, dt, clock_rate=0.0):\n' +
        '    global u; u += (K_GAIN * dE - LEAK * u) * dt   # slow integrator == auxin elongation\n' +
        '    return clamp(u + clock_rate, -1.0, 1.0)        # clock_rate = circadian feed-forward',
      note: 'Keep the integrator and the clock term as separate log channels. If the clock term does most of the work you have built an open-loop solar tracker with a light sensor attached — a legitimate result, but say so.',
    },
    metrics: [
      { label: 'mean sun-tracking angle error, McKibben pair', value: '2–8 degrees over a 10 h day; a hobby servo baseline reaches 0.5–2 degrees' },
      { label: 'mean angle error, osmotic pouch variant', value: '5–20 degrees with a lag of minutes; report both variants' },
      { label: 'McKibben blocked force at 400 kPa, 10 mm bore', value: '30–60 N at low contraction; verify against the cosine braid model' },
      { label: 'osmotic pouch swelling pressure, constrained', value: '100–600 kPa at full swelling; measure on the load cell' },
      { label: 'actuator energy per tracking day', value: 'hundreds of joules to a few kilojoules — the number that decides if soft tracking is worth it' },
    ],
    stretchGoals: [
      'Add an elastic antagonist spring on the same axis and compare PWM-proportional control against bang-bang plus spring return, in force, energy and angle error.',
      'Replace the quadrant sensor with a two-channel blue-light model near 460 and 485 nm, mimicking phot1 and phot2, and test whether a wavelength ratio carries usable directional information.',
      'Run the tracker through a partly cloudy day and separate how much tracking came from closed-loop correction versus the stored sun model.',
    ],
    safety: [
      'A mirror tracking the sun is an eye hazard and a fire hazard: keep the reflected beam inside a fenced beam dump above head height, cover the mirror with an opaque cloth before every adjustment, never look along the reflected beam or at it through optics, and keep a CO2 extinguisher within reach.',
      'Compressed air at 300–600 kPa can whip a failed fitting into an eye: use rated tubing and fittings within their rating, fit a relief valve below the sleeve rating, guard the muscle with a clear shroud, wear sealed safety glasses, and never exceed the braid manufacturer rating.',
      'A compressor is loud enough to damage hearing over a long session (above 85 dB(A)): site it outside the test area, wear hearing protection, and never leave it running unattended.',
      'Sodium polyacrylate gel is very slippery when wet and the dry powder irritates eyes and airways: wear goggles and a dust mask when handling powder, clean spills dry before wetting them, and never wash gel down a drain — it sets and blocks it.',
    ],
    lessonLinks: ['w3l6', 'w2l4', 'w8l15'],
    sources: [
      { label: 'Atamian et al., Circadian regulation of sunflower heliotropism, floral orientation, and pollinator visits, Science 353(6299):587–590 (2016)', url: 'https://www.science.org/doi/10.1126/science.aaf9793' },
      { label: 'Chou and Hannaford, Measurement and Modeling of McKibben Pneumatic Artificial Muscles — technical report PDF (DTIC)', url: 'https://apps.dtic.mil/sti/tr/pdf/ADA299458.pdf' },
      { label: 'Materials for osmotic actuators: osmotic responsiveness and reversible volume change — Chemical Reviews review article (ACS)', url: 'https://pubs.acs.org/doi/10.1021/acs.chemrev.5c00258' },
    ],
  },
  {
    id: 'nature-filament-chaser-moth-odour-localisation',
    title: 'Filament Chaser — Moth-Antenna Odour Source Localisation',
    tagline: "Two metal-oxide VOC sensors, a fan-driven plume tunnel and a surge-and-cast controller: find the source upwind the way a male moth does, and report honestly how much slower cheap sensors make you.",
    category: 'nature',
    difficulty: 'journeyman',
    buildTime: '4–5 weekends (about 30 h), then 2 evenings of 20-trial runs',
    costBand: '$$',
    wakandaIndex: 66,
    diyFeasibility: 74,
    scienceGrounding: 88,
    realitySplit: {
      real: "The algorithm and its statistics. Surge-casting with an upwind reference is implementable, wind direction is measurable with a vane or anemometer, and success rate, time-to-source, path-length ratio and first-declaration position error are all directly loggable over 20 trials in a tunnel you built. The laminar-versus-turbulent comparison is a real, controlled manipulation of plume structure — add a vortex-shedding cylinder and the plume becomes filamentary — and it will show a measurable difference, because that is the condition the biology evolved for.",
      narrative: "The robot-with-a-moths-nose headline is the story. You have two slow, drifting, humidity-sensitive industrial sensors and a wind tunnel; the moth has thousands of receptor neurons, a 100-million-year-old control law and a turbulent forest to solve. Do not claim biomimetic equivalence, and do not claim field navigation: the tunnel does most of the work by holding the wind steady, which is exactly why the turbulent run matters.",
    },
    summary: "Build a 1.5 m flow tunnel with a fan, a straw honeycomb straightener, a mesh screen and a point source. Put two VOC sensors on a small differential-drive robot with a wind vane and implement surge-casting: surge upwind while odour is present, cast across the wind when it is lost, and re-centre on every re-acquisition. Measure success rate and time-to-source over 20 trials in a smooth plume, then repeat with a vortex-shedding grid in the tunnel to make the plume filamentary — the condition a real moth faces.",
    science: "Male moths locate a female by tracking a pheromone plume, and the behaviour resolves into two coupled reflexes. Contact with pheromone filaments triggers upwind surging driven by optomotor anemotaxis — the moth holds a course upwind by watching the ground image move beneath it — while loss of contact triggers casting: a crosswind zigzag whose amplitude grows with the time since the last hit. Mafra-Neto and Cardé showed that the fine-scale filament structure of the plume, not its mean concentration, modulates upwind orientation in flying moths. Balkovsky and Shraiman analysed olfactory search at high Reynolds number and showed the search is limited by the intermittent, rare large concentration fluctuations of a turbulent plume rather than by a smooth gradient. The engineering translation: an odour source is not a gradient to climb. The useful signal is a binary, intermittent detection, so the controller must keep working through long stretches of no information. Two costs dominate on a robot. A cheap metal-oxide sensor has a t90 response of roughly 10–60 s and drifts with humidity, whereas a moth olfactory receptor neuron responds in tens of milliseconds to a handful of molecules and resolves individual filaments; your robot therefore tracks the plume envelope, and that single substitution is why your success rate will sit below a moth's. Second, sensor spacing of 3–10 cm gives only a coarse left-right cue, where the two antennae are a high-bandwidth differential array.",
    billOfMaterials: [
      { item: 'Brushless axial fan, 120 mm, or a small box fan + PWM driver', qty: '1', note: 'about $15–30; brushless on purpose, brushed sparks are an ignition risk' },
      { item: 'Flow straightener: 150 mm bundle of drinking straws or aluminium honeycomb', qty: '1', note: 'about $5; kills the swirl, and add a mesh screen 100 mm upstream' },
      { item: 'Tunnel body: 1.5 m of 300 × 300 mm duct in foam board or acrylic', qty: '1', note: 'about $25; working section with a clear lid for the overhead camera' },
      { item: 'Odour source: 50 mm petri dish, filter-paper wick, food-grade volatile', qty: '1 set', note: 'about $10; eugenol or vanillin solution, small wick volume only' },
      { item: 'Metal-oxide VOC sensors (Figaro TGS2600 or MQ-135 breakouts)', qty: '2', note: 'about $15 each; burn in 24–48 h and log humidity for drift correction' },
      { item: 'Differential-drive robot (Pololu 3pi+ or N20 motors + caster + ESP32)', qty: '1', note: 'about $40–100; must hold 0.1 m/s and turn 60 deg/s repeatably' },
      { item: 'Wind vane with AS5600 magnetic encoder, plus a hot-wire or vane anemometer', qty: '1 set', note: 'about $40; the upwind reference that makes surge-casting possible' },
      { item: 'ADS1115 16-bit ADC + ESP32 + microSD, and an overhead USB camera with an ArUco tag', qty: '1 set', note: 'about $45; sensor channels, the vane, and ground-truth trajectory' },
    ],
    buildSteps: [
      { title: 'Build the tunnel and prove the flow',
        detail: 'Fan at the downstream end pulling rather than pushing, so the working section sits at slight negative pressure and odour cannot leak into the room. Honeycomb plus two screens. Measure the velocity profile at 5 heights × 5 widths and report uniformity: target 0.2–1.0 m/s with under 5% deviation from the mean across the central 60% of the section.' },
      { title: 'Characterise the sensors before trusting them',
        detail: 'Burn in both sensors for 24–48 h, then measure each response to a step change in source concentration at fixed humidity and temperature. Record t90 rise and recovery times and the zero-air baseline drift over one hour. This curve sets your detection threshold and your minimum surge duration.' },
      { title: 'Build the source and map the plume',
        detail: 'A fixed volume of volatile on a filter-paper wick in a 50 mm dish at the tunnel inlet. Sample the plume on a 10-point grid with a third sensor to map centreline concentration and its decay with distance. You need this map to interpret where the robot first detects odour and how steep the real gradient is.' },
      { title: 'Implement surge-casting, including the lost state',
        detail: 'Threshold each sensor against a running baseline plus 3 sigma. On detection: surge upwind along the vane with a small crosswind bias toward the stronger sensor at 0.15–0.25 m/s. On loss: cast ±25 degrees about the current wind direction on a 1–2 s period and creep upwind at 0.05 m/s, widening the amplitude the longer you have been out of contact, to a cap; re-centre the cast on every re-acquisition. If there is no contact for 20 s, turn crosswind and sweep laterally for 30 s. Timestamp every state transition — most failures are threshold problems visible only in that trace.' },
      { title: 'Run 20 trials in the smooth plume',
        detail: 'Robot starts 1.2 m downwind with a random ±100 mm lateral offset; place the source, then hide it. Success means stopping within 100 mm of the source. Log time, path length, acquisition count and the position where the robot first declared a find. Then run 20 more with a 20 mm vortex-shedding cylinder in the tunnel and compare.' },
      { title: 'Score honestly',
        detail: 'Report success rate with a confidence interval rather than a bare percentage, median time-to-source, path over straight-line ratio, and the false-success rate (stopping in the wrong place). Then say how many failures were caused by sensor drift rather than by the algorithm — that split is the most honest sentence in the write-up.' },
    ],
    code: {
      language: 'python',
      snippet:
        '# Surge-casting state machine. c_left/c_right are VOC readings, wind_dir in degrees.\n' +
        'IN_PLUME, CASTING, LOST = 0, 1, 2\n' +
        'def step(c_left, c_right, wind_dir, t_since_hit):\n' +
        '    if max(c_left, c_right) > BASELINE + 3 * SIGMA:\n' +
        '        return IN_PLUME, wind_dir + 12.0 * (c_right - c_left) / max(c_left + c_right, 1e-6), 0.20\n' +
        '    if t_since_hit < 20.0:\n' +
        '        return CASTING, wind_dir + min(CAST_MAX, CAST0 + CAST_GROWTH * t_since_hit) * sin(2 * pi * t / CAST_PERIOD), 0.05\n' +
        '    return LOST, wind_dir + 90.0, 0.08   # sweep crosswind, then retry',
      note: 'The cast-amplitude growth term is the part that is genuinely moth-like and the part most people omit. Run the trials with CAST_GROWTH at zero and at its tuned value; the difference is the result.',
    },
    metrics: [
      { label: 'success rate, smooth plume (20 trials)', value: 'target 75% or better; report the 95% confidence interval' },
      { label: 'success rate, vortex-shedding plume', value: 'expect a significant drop — this is the headline comparison' },
      { label: 'median time to source, 1.2 m tunnel', value: '40–150 s with metal-oxide sensors; a sub-second sensor would be far faster' },
      { label: 'path length ratio (path / straight-line distance)', value: '1.5–4 for a good surge-casting run' },
      { label: 'minimum detectable concentration', value: 'roughly 1–10 ppm for an MQ-135 or TGS2600; measure your own' },
    ],
    stretchGoals: [
      'Add a photoionisation detector as a third channel and quantify exactly how much of the performance gap is sensor bandwidth rather than control law.',
      'Give the robot a filament-resolving sampler — a small pump and a short tube sniffing at 5 Hz — and compare filament statistics against the envelope-tracking baseline.',
      'Run the same code in a real room with a box fan and a thermal, then report the degradation honestly. This is the experiment that shows what the tunnel was hiding.',
    ],
    safety: [
      'VOC vapour is flammable: use a brushless fan, keep every ignition source (brushed motors, relays, hot irons) out of the tunnel and its exhaust, use only the small wick volume you need, and vent the exhaust outdoors or into extraction.',
      'Metal-oxide sensors run an internal heater at 200–400 °C: do not touch the sensor can while powered, let it cool before handling, and never expose it to a flammable concentration above about 10% of the lower explosive limit.',
      'Use only identified, low-hazard volatiles. Clove oil (eugenol) is a skin and respiratory sensitiser; vanillin or dilute ethanol is gentler. Never use an unlabelled solvent, and never use real insect pheromone or live insects in a teaching lab.',
      'A 120 mm fan blade at full speed cuts: keep the factory guard fitted, never reach into the duct while the fan is powered, and fit a lockable isolation switch before any maintenance.',
    ],
    lessonLinks: ['w6l11', 'w2l4', 'w7l13'],
    sources: [
      { label: 'Farrell et al., Moth-Inspired Chemical Plume Tracing on an Autonomous Underwater Vehicle — full text PDF (DTIC)', url: 'https://apps.dtic.mil/sti/pdfs/ADA507397.pdf' },
      { label: 'Balkovsky and Shraiman, Olfactory search at high Reynolds number, PNAS 99(20) (2002) — PubMed record', url: 'https://pubmed.ncbi.nlm.nih.gov/12228727/' },
      { label: 'Pyk et al., An artificial moth: chemical source localization using a robot based neuronal model of moth optomotor anemotactic search, Autonomous Robots 20(3) (2006) — publisher record', url: 'https://pure.mpg.de/view/item_1849320' },
    ],
  },
  {
    id: 'nature-ina-manamana-dipole-electroreception',
    title: 'Iná Mànàmàná — Weak-Field Dipole Electroreception Head',
    tagline: "Yoruba: iná mànàmàná, electricity. Transmit a 1 kHz dipole into water or wet soil, receive its distortion with a differential pair and a lock-in amplifier, and map an object you cannot see — the way a mormyrid does, and an electric eel emphatically does not.",
    category: 'nature',
    difficulty: 'journeyman',
    buildTime: '4–6 weekends (about 32 h), then 2 weeks of mapping runs',
    costBand: '$$',
    wakandaIndex: 76,
    diyFeasibility: 74,
    scienceGrounding: 90,
    realitySplit: {
      real: "Field distortion is measurable physics and lock-in detection is standard instrumentation. You can build a transmitter with a known current, measure receiver amplitude and phase, and show a conductor producing a bright anomaly and an insulator a dark one, both quantified against a measured noise floor. The four-electrode Wenner comparison gives an independent, textbook-validated apparent resistivity in ohm-metres from the same electrodes, and detection depth versus noise floor is a clean, falsifiable result.",
      narrative: "The electric-sixth-sense framing is the hook, not a performance claim. Your head has four electrodes, one frequency and centimetre-scale resolution; a mormyrid has thousands of receptors, active self-generated-noise cancellation and can tell a live worm from a dead one a few centimetres away. Do not imply the rig works in seawater or can find buried pipes at metres of depth. Real geophysical resistivity surveys use much larger electrode spacings, higher currents and multi-channel inversion; this is a tabletop analogue of the measurement principle, not of the instrument.",
    },
    summary: "Build a battery-powered current-source transmitter driving two electrodes, and a differential receiver on two more electrodes feeding a lock-in detector that measures amplitude and phase at the transmit frequency. Map a steel rod and a PVC rod in a water tank at known offsets, log the amplitude and phase anomaly, then bury objects under wet sand and report the depth at which they vanish into the noise. Validate the electronics chain by building a textbook four-electrode Wenner array on the same rig and checking its apparent resistivity against theory.",
    science: "Weakly electric fish — mormyrids such as Gnathonemus petersii and the gymnotiform knifefish — generate an electric organ discharge of a few volts at most and a few hundred hertz to a few kilohertz, setting up a dipole-like field in the surrounding water. Their skin carries a dense array of electroreceptors that measure the local transdermal voltage, on the order of tens of microvolts to millivolts. An object whose impedance differs from the water distorts the field: a conductor is electrically bright and locally raises the transdermal voltage, an insulator is electrically dark and lowers it, and because the receptors are phase-sensitive the fish also uses complex impedance to judge material and, in von der Emde experiments, distance and capacitance. The essential trick is that the fish knows the waveform it just emitted — an electromotor command is copied to the electrosensory lobe as a corollary discharge — so the self-generated field can be subtracted and only the perturbation remains. Your lock-in amplifier is that corollary discharge: demodulating at exactly the transmit frequency with a known phase rejects everything else regardless of amplitude. Three honest biophysical limits. Weakly electric fish are essentially absent from the sea, because seawater is roughly 100 to 10,000 times more conductive than the fresh water they inhabit, which short-circuits the field. A small object must sit within about a body length, because the perturbation falls off steeply with distance. And no DIY rig approaches the fish millimetre resolution. Electric eels sit three orders of magnitude higher — up to a few hundred volts per pulse, and about 860 V in the recently described Electrophorus voltai — which is exactly why this project stays at a milliamp and never touches mains.",
    billOfMaterials: [
      { item: 'AD9833 DDS module + Arduino Nano or ESP32', qty: '1 set', note: 'about $15; 1 kHz default, swept 100 Hz–10 kHz for the phase experiment' },
      { item: 'Howland current-pump op-amp (OPA551, or TL072 + push-pull) + 0.1% resistors', qty: '1 set', note: 'about $15; voltage-controlled current source, output 1–10 mA RMS' },
      { item: 'Instrumentation amplifier INA128 or AD8220, plus precision op-amps and 1% film caps for the band-pass stages', qty: '1 set', note: 'about $25; CMRR is the whole ballgame, so match the electrode leads' },
      { item: 'Graphite electrodes (4) plus 2 Ag/AgCl reference electrodes', qty: '1 set', note: 'about $30; graphite avoids metal-ion contamination of tank and soil' },
      { item: 'Fast-enough ADC: MCP3208 over SPI (100 kSps) or an I2S/audio ADC at 48 kSps', qty: '1', note: 'about $8; an ADS1115 at 860 Sps is too slow for phase at 1 kHz' },
      { item: 'Water tank (20 L clear box) + aquarium salt + conductivity/TDS meter', qty: '1 set', note: 'about $35; target 200–800 µS/cm, the weakly-electric-fish range' },
      { item: 'Soil tray 500 × 300 × 150 mm + washed builder sand + moisture meter', qty: '1 set', note: 'about $30; wet and pack each layer identically' },
      { item: 'Multimeter (0.1 mV resolution) + 100 ohm 0.1% current-sense resistor', qty: '1 set', note: 'about $30; verify transmit current before every single run' },
    ],
    buildSteps: [
      { title: 'Prove the transmitter current',
        detail: 'Build the Howland pump and measure current through a 100 ohm sense resistor on a scope at 1 kHz. Target 1–10 mA RMS, flat within 5% from 200 Hz to 10 kHz, and confirm DC content is under a few microamps before the electrodes ever touch water.' },
      { title: 'Build and calibrate the receiver',
        detail: 'Buffered differential inputs into the INA128, a 1 kHz band-pass, then a digital lock-in: sample at 20–48 kSps, multiply by sin and cos of the reference, low-pass with a 1 s time constant. Short the inputs and measure the noise floor in microvolts RMS; then inject a 100 microvolt reference from a divider and check gain and phase against calculation.' },
      { title: 'Do the electrochemistry first',
        detail: 'Electrolysis is the failure mode. With the DC-blocking capacitor in place, run the transmitter in saline for an hour and check for bubbles at the electrodes, pH drift and electrode pitting. If you see bubbles, the DC block is not working — fix it before going any further.' },
      { title: 'Map the empty tank, then characterise two objects',
        detail: 'Fill to a fixed depth, add salt to a logged conductivity, place the transmit pair 100 mm apart and the receive pair at a fixed offset, then scan the head over a 200 × 200 mm grid at 10 mm pitch: that empty-tank map is the baseline. Repeat with a 20 mm steel rod and a 20 mm PVC rod in the same position and plot delta-amplitude and delta-phase — a conductor should brighten the field and an insulator darken it, and phase should separate them further.' },
      { title: 'Bury and find the depth limit',
        detail: 'In the soil tray bury a 20 mm steel pipe at 10, 30, 50 and 80 mm, wetting and packing each layer identically. Repeat the scan at each depth and report the depth at which the peak anomaly falls below three times the noise floor. That number, not the demo, is the project result.' },
      { title: 'Validate against the textbook and write the limits down',
        detail: 'Build a four-electrode Wenner array with spacing a = 50 mm on the same tray, drive the outer pair from the same current source, measure the inner-pair voltage and compute apparent resistivity as 2·pi·a·V/I. Compare against a reference conductivity meter and published soil ranges. Then report the empty-tank falloff against the expected steep decay, the noise floor, the lateral resolution in millimetres and the depth limit in centimetres, and state plainly that seawater and metre-scale burial are out of scope.' },
    ],
    code: {
      language: 'python',
      snippet:
        '# Digital lock-in: the engineering equivalent of the fish corollary discharge.\n' +
        'import numpy as np\n' +
        'def lockin(x, fs, f_ref, tau=1.0):\n' +
        '    n = np.arange(len(x)) / fs\n' +
        '    i = lowpass(x * np.cos(2 * np.pi * f_ref * n), fs, tau)\n' +
        '    q = lowpass(x * np.sin(2 * np.pi * f_ref * n), fs, tau)\n' +
        '    return np.hypot(i, q), np.degrees(np.arctan2(q, i))  # amplitude (V), phase (deg)',
      note: 'The amplitude and phase maps are your data. Averaging length is the one free knob: a 1 s time constant buys about 30 dB over a 30 ms one and costs scan speed — plot the trade-off rather than picking a number.',
    },
    metrics: [
      { label: 'receiver noise floor at 1 kHz, 1 Hz bandwidth', value: '1–10 µV RMS with careful shielding; measure and report yours' },
      { label: 'SNR of a 20 mm steel rod at 30 mm offset', value: 'target 20 dB or better above the noise floor' },
      { label: 'phase difference between the steel and PVC rods', value: 'report in degrees; amplitude and phase should both separate them' },
      { label: 'maximum burial depth for a 20 mm object in wet sand', value: 'report in cm; expect single-digit cm' },
      { label: 'Wenner apparent resistivity vs reference meter', value: 'within 10%, or explain the geometry error explicitly' },
    ],
    stretchGoals: [
      'Add a second receive axis in a crossed quadrupole and reconstruct a two-dimensional field-distortion vector rather than a scalar amplitude — the physical analogue of the fish receptor array.',
      'Sweep 100 Hz to 10 kHz and fit the complex impedance of each object; mormyrids and gymnotiforms both use capacitance cues, so metal and wet plastic may separate best at different frequencies.',
      'Replace the manual scan with a two-axis stepper gantry and produce an automated 5 mm-resolution map, trading per-pixel lock-in averaging time against total scan duration.',
    ],
    safety: [
      'Never connect electrodes in water or wet soil to mains, and never use a mains supply without an isolation transformer: run everything from a battery pack, put a 1 kohm series resistor and a 100 mA fast fuse in the transmit lead, block DC with a series capacitor, keep current below 10 mA RMS, and fit a physical on/off switch. Even 10 mA can be dangerous across the chest, so never hold one electrode in each hand and keep electrodes away from people.',
      'Electrolysis produces hydrogen and, in chlorinated water, chlorine and hypochlorite: never seal the tank, always run in a ventilated space, keep transmit current low, and stop if you see bubbles. Use graphite or 316 stainless electrodes only — copper ions are toxic to aquatic life and lead is a neurotoxin — and never pour saline or soil slurry down a drain.',
      'This project stays near a milliamp on purpose. Do not attempt to replicate a strongly electric eel: Electrophorus can produce several hundred volts per pulse (about 860 V in Electrophorus voltai) and that is lethal. Never work with live electric eels or build a high-voltage electric-organ analogue.',
      'Charging the rig battery: charge on a non-flammable surface, never unattended, and keep chargers well away from the water tank — a spill next to a live charger turns a mess into an electrocution.',
    ],
    lessonLinks: ['w2l4', 'w2l3', 'w6l11'],
    sources: [
      { label: 'von der Emde, Non-visual environmental imaging and object detection through active electrolocation in weakly electric fish — PubMed review record', url: 'https://pubmed.ncbi.nlm.nih.gov/16645886/' },
      { label: 'Distance and shape: perception of the 3-dimensional world by weakly electric fish — PubMed review record', url: 'https://pubmed.ncbi.nlm.nih.gov/15477023/' },
      { label: 'Catania, The shocking predatory strike of the electric eel, Science 346(6214):1231–1234 (2014)', url: 'https://www.science.org/doi/10.1126/science.1260807' },
    ],
  },
];
