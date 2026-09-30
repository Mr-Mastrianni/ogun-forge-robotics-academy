import type { IdeaProject } from '../types';

/**
 * Idea Lab — "Nature & Natural Elements", volume B. Honesty rules:
 *  - `scienceGrounding` 80–95 = peer-reviewed and measurable; 50–70 = the biology
 *    is real but the replication is hard, lossy or slow. `realitySplit.real` is the
 *    part a sensor can be put on; `.narrative` is framing and open research.
 *  - Performance figures are targets or published ranges from the cited source;
 *    where a popular claim is weakly sourced, the file says so.
 */
export const natureProjectsB: IdeaProject[] = [
  /* 1 · ANT STIGMERGIC CONSTRUCTION SWARM vs A CENTRAL PLANNER */
  {
    id: 'nature-b-ant-stigmergic-builders-vs-planner',
    title: 'Atta\'s Ledger — Ant Stigmergic Builders Against a Central Planner',
    tagline: 'Three to six differential-drive robots build the same wall twice — once from a decaying pheromone-like probability field, once from a foreman that knows everything — and you measure which structure is better built.',
    category: 'nature', difficulty: 'journeyman',
    buildTime: '5–7 weekends (about 40 h): 3 build weekends, 2 experiment weekends, 1 write-up', costBand: '$$',
    wakandaIndex: 70, diyFeasibility: 74, scienceGrounding: 80,
    realitySplit: {
      real:
        'Stigmergy — coordination through traces written into a shared environment instead of messages between agents — is a documented mechanism in social insects (Grassé coined the term in 1959 from termite building) and a standard architecture for robot construction teams: the TERMES system built 3D structures from local rules alone and published its error behaviour. Both arms of this experiment are real engineering: the swarm arm is a decaying probability field over a shared grid; the planner arm is a centralised greedy assignment over a shared map. Throughput (blocks/min), occupancy error against a target grid, path length per placed block and recovery after a robot is removed are all directly measurable, and the head-to-head comparison is the deliverable.',
      narrative: 'The phrase "ant colony intelligence" invites you to believe the colony thinks. It does not: each ant follows local trail pheromone and the trail evaporates. Ants are the trail-laying animal, but most of the construction-stigmergy evidence is from termites, so do not present this as a model of ant cognition. The interesting claim is narrower and defensible: a shared, decaying field with no communications between agents can match a planner on structure quality at the cost of more walking.',
    },
    summary: 'Build an arena with one overhead camera, 3–6 small differential-drive robots carrying one block each, and a host-side field server. In the swarm arm each robot reads a 24 × 24 probability field, drives to the highest-value open cell, deposits a block and reinforces the neighbourhood; the field decays so early mistakes are not permanent. In the planner arm a host script computes block→site and robot→block assignments from the same camera and dispatches waypoints over the same radio link. Run both arms on the identical 40-block wall target, then repeat the swarm arm with 1, 2, 3, 4 and 6 robots. Report one table: quality, time, metres driven, and recovery after a mid-build removal.',
    science: 'Grassé\'s observation was that a termite deposits a soil pellet which itself triggers the next deposit nearby — the partly built structure is the stimulus, so the environment is the memory and the message bus. Two properties make this work as control. Positive feedback near existing structure turns many weak local decisions into coherent global order; decay in the trace stops the system freezing on an early mistake and lets it abandon dead ends. The TERMES experiments showed that a team of autonomous robots following such rules can build specified 3D structures without a central controller, and swarm-engineering reviews place stigmergic construction among the few swarm behaviours with both theory and hardware evidence. Your planner arm is the control condition that most student swarm projects omit, and it is what makes the result publishable: an auction or greedy assignment over a complete shared map is the strongest fair alternative, and it is also the arm that dies when you blindfold the camera or lose a robot. Measure the information each arm receives — swarm gets a template and two constants, planner gets every pose — and report it as a number.',
    billOfMaterials: [
      { item: 'Pololu 3pi+ 2040 robot (Turtle Edition, 75:1 motors)', qty: '3–6', note: '~$195 each; built-in encoders and IMU, RP2040, UART/Wi-Fi add-on' },
      { item: 'ESP32 or Pi Zero W radio bridge per robot', qty: '3–6', note: 'field updates and waypoints over UDP/MQTT; ~$8 each' },
      { item: '3D-printed lift fork + MG90S micro servo', qty: '3–6', note: 'must hold one block through a 90° turn' },
      { item: 'Uniform blocks 40 × 40 × 20 mm (PLA or laser-cut MDF)', qty: '120', note: 'match mass to within 2 g or the fork torque varies' },
      { item: 'Overhead 1080p USB camera + rigid gantry or clamp mount', qty: '1', note: 'global tracking for both arms' },
      { item: 'ArUco marker sheet, printed on matte paper', qty: '1 set', note: 'one tag per robot, flat on top' },
      { item: 'Foam-board arena 1.2 × 1.2 m with 50 mm grid', qty: '1', note: 'calibrated with a four-point homography' },
      { item: 'Host laptop (OpenCV + NumPy field server)', qty: '1', note: 'runs both the field and the planner' },
      { item: 'USB current shunt or INA219 logger', qty: '1', note: 'for joules per placed block' },
      { item: 'Rechargeable NiMH AAA cells (4 per robot) + smart charger', qty: '1 set', note: 'the 3pi+ 2040 battery holder takes 4× AAA' },
    ],
    buildSteps: [
      { title: 'Write the rule before you build anything', detail: 'Fix the field update law on paper: reinforcement R on deposit, neighbour gain G on the eight adjacent free cells, decay λ per second. Decide the values and freeze them before the first trial. Write down how many numbers you handed the swarm — that count is the point of the project.' },
      { title: 'Arena, blocks and calibration', detail: 'Lay the 1.2 m arena with a 50 mm grid, print 120 identical blocks and verify mass spread, then mount the camera overhead on a clamped gantry. Calibrate pixel-to-millimetre with four known points and log the residual error; without it your occupancy error numbers are meaningless.' },
      { title: 'Build and tune the robots', detail: 'Fit each robot with a top-mounted ArUco tag and a lift fork. Tune closed-loop wheel speed until a straight 1 m command drifts below 20 mm and a 90° turn overshoots below 5°. Give the fork a mechanical stop so a carried block cannot crush the servo on the way down.' },
      { title: 'Run the swarm arm', detail: 'Seed only a coarse template ("build a 0.6 m wall along x = 0"), then let the field decide every block. Log every field state, every placement and every motor command. No hard-coded block coordinates are allowed — if you add one, you have stopped doing stigmergy and become a worse planner.' },
      { title: 'Sweep the decay constant', detail: 'Run at three decay rates (for example 0.05, 0.5 and 5 %/s). With too little decay the swarm jams on the first mistake; with too much it never commits and the wall never builds. Plot completion time and final occupancy error against decay and report the cliff.' },
      { title: 'Run the planner arm', detail: 'Compute block→site and robot→block assignments centrally with a Hungarian or greedy-auction solver over the full occupancy map and dispatch waypoints. Same robots, same camera, same blocks, same radio. If the planner gets better sensing than the swarm, the comparison is void.' },
      { title: 'Remove a robot mid-build in both arms', detail: 'Lift one robot out for 60 s, put it back, and record whether the structure continues, stalls or repairs itself. Then knock over 10 blocks and record recovery in each arm. This is the experiment where stigmergy is expected to win, and the honest place to say so if it does not.' },
      { title: 'Report the negative results', detail: 'Log dropped blocks, deadlocks in narrow corridors, field saturation, camera tracking loss and every collision. A swarm project without a failure section is a demo, not an experiment.' },
    ],
    code: {
      language: 'python',
      snippet:
        '# Two arms, identical sensing. Swarm: decaying probability field.\n' +
        'import numpy as np, itertools\n' +
        'class Field:\n' +
        '    def __init__(s, n=24, decay=1e-3, gain=0.4):\n' +
        '        s.p = np.zeros((n, n)); s.occ = np.zeros((n, n), bool); s.decay, s.gain = decay, gain\n' +
        '    def tick(s, dt): s.p *= (1.0 - s.decay * dt)\n' +
        '    def place(s, i, j):\n' +
        '        s.occ[j, i] = True; s.p[j, i] += 1.0\n' +
        '        for dj, di in itertools.product((-1, 0, 1), repeat=2):\n' +
        '            y, x = j + dj, i + di\n' +
        '            if 0 <= x < s.p.shape[1] and 0 <= y < s.p.shape[0] and not s.occ[y, x]: s.p[y, x] += s.gain\n' +
        '    def best(s): return np.unravel_index(np.argmax(np.where(~s.occ, s.p, -1.0)), s.p.shape)\n' +
        '\n' +
        '# Planner arm: same camera, but it knows every pose and every free site.\n' +
        '#   cost = ||agent->block|| + ||block->site||; solve greedily or with scipy.optimize.linear_sum_assignment\n' +
        '#   then push waypoints. Count the bytes it needed: that is the price of centralisation.',
      note:
        'Keep the field under ~32 × 32 cells: scoring every cell each tick is O(n²) and at 24 × 24 you can run the whole field server in one process at 30 Hz. The parameter triple (R, G, λ) is the entire controller — there is nothing else to tune, which is exactly why the decay sweep is your main result.',
    },
    metrics: [
      { label: 'placement rate per robot', value: 'target ≥ 1.5 blocks/min/robot with 3 robots on a 1.2 m arena' },
      { label: 'occupancy error against the target grid', value: '≤ 10 % of cells wrong for a good run; report median over 10 runs' },
      { label: 'completion time for a 40-block wall', value: '10–25 min; report mean ± spread' },
      { label: 'path length per placed block, swarm vs planner', value: 'swarm typically 1.3–2.5× the planner in m/block' },
      { label: 'throughput scaling exponent from 1 → 6 robots', value: 'sublinear; report the fitted exponent and where it collapses' },
      { label: 'recovery after a 60 s mid-build removal', value: 'swarm: ≥ 80 % of baseline rate; planner: report the stall or reassignment time' },
    ],
    stretchGoals: [
      'Remove the global camera entirely: use wheel odometry, a reflectance sensor and physical depositable markers. Report how much worse the build gets — that quantifies how much the global field was doing for you.',
      'Seed two competing templates in different colours and see which one wins the reinforcement race, then explain the outcome from the field equation alone.',
      'Allow stacking on top of existing blocks and report the first height at which the structure and the robots both fail.',
      'Charge in joules per placed block for both arms and report the energy cost of decentralisation.',
    ],
    safety: [
      'Battery packs in three to six robots are a fire risk if you substitute LiPo for the AAA holder: charge NiMH on a matched smart charger, and if you do run LiPo, charge it in a bag on a non-flammable surface, never unattended, and never a puffed cell.',
      'Servo lift forks pinch fingers: set firmware travel limits, fit a mechanical stop, and cut robot power before clearing a jammed block by hand.',
      'The overhead camera gantry must be clamped or bolted, never balanced on furniture — a dropped camera is the most likely injury in this build.',
      'Arena floors are a trip hazard and wheels throw small blocks: run on the floor or a low table with a lip, tape cables down, and keep hands out of the arena while robots are armed.',
    ],
    lessonLinks: ['w7l13', 'w6l11', 'w1l1'],
    sources: [
      { label: 'Werfel, Petersen and Nagpal, Designing Collective Behavior in a Termite-Inspired Robot Construction Team (TERMES), Science 343:754–758 (2014) — PubMed record', url: 'https://pubmed.ncbi.nlm.nih.gov/24531967/' },
      { label: 'Brambilla, Ferrante, Birattari and Dorigo, Swarm robotics: a review from the swarm engineering perspective, Swarm Intelligence 7:1–41 (2013) — open-access HAL copy', url: 'https://hal.science/hal-01405919v1' },
      { label: 'Stigmergy — Grassé\'s 1959 termite observations and the mechanism as used in robotics (Wikipedia, with primary citations)', url: 'https://en.wikipedia.org/wiki/Stigmergy' },
      { label: 'Pololu 3pi+ 2040 Robot, Turtle Edition (75:1 LP motors) — robot platform used in the BOM', url: 'https://www.pololu.com/product/5002' },
    ],
  },

  /* 2 · TERMITE-MOUND VENT BAY FOR A FIELD ROBOT */
  {
    id: 'nature-b-termite-mound-vent-bay',
    title: 'Chimney and Clay — a Termite-Mound Vent Bay for a Field Robot',
    tagline: 'Give a sealed field-robot electronics bay thin, dark "flute" channels and a heavy core, then spend a hot day proving how much of the internal temperature rise you actually removed.',
    category: 'nature', difficulty: 'apprentice',
    buildTime: '3 weekends to build, then a 2-week hot-day logging campaign', costBand: '$$',
    wakandaIndex: 58, diyFeasibility: 86, scienceGrounding: 82,
    realitySplit: {
      real: 'Buoyancy-driven stack ventilation, thermal mass and the associated time lag are textbook building physics, and the termite mound itself has been measured: King, Ocko and Mahadevan instrumented the surface conduits of Odontotermes obesus mounds and found that thin outer flutes heat and cool faster than the massive central chimney, so the diurnal ambient swing drives a closed convection cell that reverses direction day to night and flushes CO2 from the nest. Your test is the same physics at 1/1000 the scale: one sealed bay, one bay with mass, one bay with mass plus a flute-to-core loop, logged against ambient on real sunny days. Internal–external temperature difference, thermal lag in hours, the mass penalty in kilograms and the time to the robot\'s first thermal throttle are all measurable with about $80 of sensors.',
      narrative: 'Eastgate Centre in Harare (Mick Pearce, completed 1996) is genuinely a passively cooled building inspired by the termite mound, and it genuinely performs: it draws cool night air through 48 brick funnels and mass concrete and reports roughly a tenth of the cooling energy of a comparable conventional building. But it was designed two decades before the 2015 in-situ flow measurements, so present it as a documented engineering landmark built on the then-current model, not as a validated copy of the mechanism King et al. later measured. And do not promise an enclosure colder than ambient in the afternoon: passive stack ventilation cannot do that. It can only cut the rise above ambient and shift the peak in time.',
    },
    summary: 'Build three identical robot electronics bays for the same measured heat load: A sealed, B sealed with 3 kg of dense thermal mass, C mass plus two thin blackened outer flute channels connected top and bottom to the core space. Put real robot electronics inside (or a 10 W resistor as a stand-in) and log internal, flute, core and outside temperature plus wind, solar irradiance and humidity every 60 s for two weeks in the sun. The deliverable is a plot of internal-minus-ambient for all three bays, the lag between the ambient peak and each internal peak, and the point at which the real robot begins to throttle.',
    science: 'A gap in a wall does not ventilate a box; a loop does. The mound\'s trick is thermal asymmetry: its slender exposed flutes have little mass and heat quickly, while the central chimney has a great deal of mass and lags. King et al. measured a flute-to-centre ΔT of a few degrees Celsius, and a closed-loop buoyancy model with that asymmetry gives internal flow speeds of a few tens of centimetres per second, with the flow reversing between day and night. They also showed the mound wall is a breathable windbreaker — 37–47 % air by volume with micron-scale pores — so bulk wind-driven flow through the wall is negligible next to the buoyancy loop. Scale that down honestly. The loop driving pressure is ΔP ≈ ρ g h ΔT / T, so for h = 0.3 m and ΔT = 3 °C you get about 0.03 Pa, a few hundredths of a pascal. That is enough to move air slowly through a well-sealed, low-resistance loop and not nearly enough to beat a leaky lid or a gust. Two consequences follow, and both belong in your write-up: seal the bay properly or the flutes do nothing, and the realistic win is a smaller afternoon peak plus a multi-hour lag, not a cooler-than-air box.',
    billOfMaterials: [
      { item: 'XPS foam board, 25 mm', qty: '3 sheets', note: 'three bay shells, cut identically' },
      { item: 'Dense clay/sand mix or 3 × 1 kg sealed water bottles', qty: '3 kg', note: 'thermal mass; water is ~4× the volumetric heat capacity of dry clay' },
      { item: 'Aluminium flashing + matte black paint', qty: '1 sheet / 1 can', note: 'low-mass, high-absorption flute liner' },
      { item: 'DS18B20 waterproof temperature probes', qty: '10', note: '±0.5 °C stock; calibrate each one in ice water' },
      { item: 'SHT31 or BME280 temperature/humidity sensor', qty: '2', note: 'one in a shaded outdoor radiation shield, one inside' },
      { item: 'ESP32 + DS3231 RTC + microSD module', qty: '1', note: 'timestamps every 60 s so a Wi-Fi drop costs no data' },
      { item: '10 W power resistor on a heatsink + 12 V 2 A supply', qty: '2', note: 'identical, shunt-measured heat load for each bay' },
      { item: 'Robot electronics payload (motor driver, SBC, DC-DC)', qty: '1 set', note: 'the actual thing being protected; log its on-die temperature if it reports one' },
      { item: 'Anemometer + pyranometer (or a cheap weather station)', qty: '1', note: 'you must be able to show wind and sun are not the drivers' },
      { item: 'Smoke pencil, thread and a small vane', qty: '1 set', note: 'cheap confirmation of flow direction at the vents' },
    ],
    buildSteps: [
      { title: 'Cut three identical bays', detail: 'Build 200 × 200 × 300 mm XPS boxes with 25 mm walls and the same internal volume. A is sealed. B gets a 3 kg central mass column. C gets the same mass plus two 15 mm flute channels on opposite outer faces lined with blackened aluminium, each connected to the core by a 10 mm bottom inlet and a 10 mm top outlet. Seal every other gap with silicone; note the measured leak area of each lid.' },
      { title: 'Install equal heat loads', detail: 'Mount one 10 W resistor per bay on a metal bracket, 20 mm clear of the foam, and measure the actual current with a shunt so you know the watts are equal. If the bays do not receive the same power, the comparison is worthless.' },
      { title: 'Calibrate every probe', detail: 'Bundle all probes in an ice-water bath with a reference thermometer and log for 20 min, then apply an individual offset per probe. Stock ±0.5 °C accuracy cannot resolve a 3 °C core-to-flute difference honestly.' },
      { title: 'Site the bays identically', detail: 'Put all three on a non-conductive stand, in the same sun and wind exposure, away from walls that reradiate, with the outdoor probe in a shaded ventilated shield. Photograph the layout and record compass orientation — a shaded bay is a confounded bay.' },
      { title: 'Log for two weeks, then check the flow', detail: 'Sample at 60 s to microSD with RTC timestamps, recording wind and irradiance alongside. On three days at three times of day, confirm flow direction at the top and bottom vents with a smoke pencil and record it next to the sign of the flute-to-core ΔT.' },
      { title: 'Compute the driving pressure and compare', detail: 'For each logged hour compute ΔP = ρ g h ΔT / T with h the vent height difference in metres and T in kelvin. Compare the predicted flow direction with what the smoke showed and state openly how often they disagree — that number is your strongest honesty result.' },
      { title: 'Run the real robot until it throttles', detail: 'Replace the resistor with the actual robot electronics and run a fixed workload. Record the minutes from power-on to the first thermal-throttle event in each bay, and the throttle-free duty cycle over a full afternoon. This is the metric a field robotics team actually cares about.' },
      { title: 'Write the one-page result', detail: 'Report bay dimensions, mass, measured heat load, per-probe calibration offsets, peak and mean offset for all three bays, lag in hours, mass penalty per litre, and the flow-direction agreement rate. A dataset, not a photo.' },
    ],
    metrics: [
      { label: 'peak afternoon rise above ambient, bay C vs bay A', value: 'target a 30–50 % reduction in ΔT; a sealed bay often reaches +15 to +25 °C' },
      { label: 'thermal lag, internal peak minus ambient peak', value: '2–5 h for 3 kg of mass; report the difference between B and C' },
      { label: 'flute-to-core ΔT', value: '0.5–3 °C with the sign inverting between day and night' },
      { label: 'predicted loop driving pressure ΔP', value: 'order 0.02–0.1 Pa at h = 0.2–0.5 m — a few hundredths of a pascal' },
      { label: 'observed vent flow speed', value: '0.05–0.5 m/s through a low-resistance 10 mm loop; report yours' },
      { label: 'time to first thermal throttle under fixed load', value: 'report in minutes for each bay, plus throttle-free duty cycle in %' },
    ],
    stretchGoals: [
      'Add a paraffin or salt-hydrate phase-change material to bay C and report the peak-offset improvement per kilogram of PCM.',
      'Build a fourth bay with the same mass but no loop connection (top vent only) to separate the contribution of thermal mass from the contribution of the convective loop.',
      'Add a 0.1 W fan and find the crossover point where forced convection beats the passive stack on watts per degree removed.',
      'Repeat at two sites, one shaded and one in full sun, and show how solar gain rewrites the flow schedule.',
    ],
    safety: [
      'The 10 W resistor and its heatsink burn skin and can ignite foam: mount on a metal bracket, keep 20 mm clear of the XPS, fuse the 12 V supply at 1 A, and never leave a new rig running unattended.',
      'Mixing cement or clay dust irritates eyes, skin and lungs: mix outdoors or with extraction, wear nitrile gloves and sealed goggles, and never wash slurry into a drain.',
      'Two weeks of outdoor logging in the weather is an electrical and physical hazard: use a fused, strain-relieved 12 V DC lead, keep all mains and the laptop indoors behind an RCD, seal the logger in an IP-rated box, and stake or weigh the bays so they cannot blow over.',
      'Smoke pencils and tracer smoke belong outdoors or in ventilation, away from anyone with asthma and never near the heated resistor.',
    ],
    lessonLinks: ['w3l6', 'w8l15', 'w2l3'],
    sources: [
      { label: 'King, Ocko and Mahadevan, Termite mounds harness diurnal temperature oscillations for ventilation, PNAS 112(37):11589–11593 (2015) — open preprint', url: 'https://arxiv.org/abs/1703.08067' },
      { label: 'The same paper at PNAS (publisher record, DOI 10.1073/pnas.1423242112)', url: 'https://www.pnas.org/doi/abs/10.1073/pnas.1423242112' },
      { label: 'Arup, Eastgate: creating more resilient buildings inspired by nature — engineer\'s project account of the Harare building', url: 'https://www.arup.com/projects/eastgate/' },
      { label: 'Eastgate Centre, Harare — passive cooling design, night-air strategy and reported energy performance (Wikipedia, with primary citations)', url: 'https://en.wikipedia.org/wiki/Eastgate_Centre,_Harare' },
    ],
  },

  /* 3 · KINGFISHER-BEAK / SHINKANSEN NOSE OPTIMISATION */
  {
    id: 'nature-b-kingfisher-beak-nose-drag',
    title: 'Alcedo Line — Three Printed Noses and the Drag You Actually Measure',
    tagline: 'A blunt nose, an ogive nose and a kingfisher-derived slender nose, printed at the same frontal area and pulled through a flume on a load cell — so the drag reduction is a number you measured, not a story you repeated.',
    category: 'nature', difficulty: 'journeyman',
    buildTime: '4–5 weekends (about 30 h): CAD, print, flume, and a full repeat-run campaign', costBand: '$$$',
    wakandaIndex: 66, diyFeasibility: 68, scienceGrounding: 74,
    realitySplit: {
      real: 'The hydrodynamic claim has been tested on the animal itself. Crandell, Howe and Falkingham printed scaled beak models of 31 kingfisher species, dropped them into a water tank with an accelerometer and ran CFD at 5 m/s: aquatic-foraging species entered the water with significantly lower peak deceleration than terrestrial ones, and the CFD attributed the largest drag contribution not to the beak tip but to the rapid increase in frontal area at the beak-to-head transition. That gives you a real, falsifiable experiment: build one body that holds interchangeable noses, match frontal area and surface finish, and measure drag force versus speed on a load cell. Percent drag reduction, the drag coefficient at your measured Reynolds number, and the repeatability of both are all numbers you own.',
      narrative: '"The Shinkansen 500 series nose is a kingfisher beak" is the most repeated biomimicry story in engineering and the weakest-sourced. It appears in the press and in the secondary literature, and the very paper that tests kingfisher beaks notes that the train link had not been directly tested at that point; the train was designed by an industrial designer and its published targets were the tunnel micro-pressure wave and wayside noise, not cruise drag. Treat the train as the motivation for the question, never as evidence for your answer. Also respect the scale gap: a train nose runs at a Reynolds number of order 10^8 and is a three-dimensional body metres long, while your flume runs at 10^4–10^5 on a 100 mm part. Your result is indicative of relative shape performance, not a prediction of train drag.',
    },
    summary: 'Design one body with three interchangeable noses of identical frontal area and identical length: a flat blunt disc, an ogive/parabolic cone, and an Alcedo-derived profile — a long slender wedge whose tip angle is low and whose transition into the body is filleted rather than stepped, which is the feature the kingfisher data actually implicate. Print them in the same material at the same layer height, then tow or hold each one in a water channel (or a small wind tunnel) on a beam load cell and sweep speed. Report drag force versus velocity, the drag coefficient at matched frontal area, the percent reduction against the blunt baseline, and the standard deviation over ten runs per condition. A free-fall descent-time test is the zero-budget cross-check.',
    science: 'Drag on a submerged body has two components you can separate experimentally. Skin friction scales with wetted area and boundary-layer state; pressure or form drag scales with how abruptly the body makes the fluid change direction, and it is what a nose shape controls. A blunt face makes the flow separate almost immediately, leaving a wide low-pressure wake; a long gradual nose keeps the flow attached longer under a favourable pressure gradient, so the wake and therefore the pressure drag shrink. The kingfisher evidence points at two geometric variables: a narrow beak base, which raises the fineness ratio, and a smooth beak-to-head transition, which Crandell et al. identified as the largest single drag site in their CFD — a finding that should redirect your design away from a decorative sharp point and towards blending the nose into the body. Expect diminishing returns: past a certain fineness ratio the added wetted area costs more friction than the pressure recovery saves, so the honest deliverable is a curve with a minimum and a statement of where you found it. Measure the flow speed with a pitot tube or a calibrated vane, not the pump setting, and report the Reynolds number for every data point because neither drag nor Cd is meaningful without it.',
    billOfMaterials: [
      { item: '3D printer + 500 g PETG or tough PLA', qty: '1 / 1 spool', note: 'same material and 0.1 mm layer height for all three noses' },
      { item: '5 kg beam load cell + HX711 24-bit ADC', qty: '1', note: '~$15; or a 500 g cell for a wind tunnel at matched speed' },
      { item: 'Aluminium extrusion rig frame + linear rail or tow line', qty: '1 set', note: 'rigid enough that the nose does not oscillate' },
      { item: 'Acrylic flume 1.5 m × 0.15 m × 0.15 m + pond pump', qty: '1', note: '12 V DC pump, flow straightener (straw bundle) at the inlet' },
      { item: 'Pitot tube or vane anemometer', qty: '1', note: 'free-stream velocity, not pump voltage' },
      { item: 'Arduino Nano or ESP32 + microSD logger', qty: '1', note: 'load cell at ≥ 80 Hz with a timestamp per sample' },
      { item: 'Calibration masses (100 g, 200 g, 500 g) + digital scale', qty: '1 set', note: 'derive counts per newton yourself' },
      { item: 'Potassium permanganate or food dye + syringe', qty: '1 set', note: 'flow visualisation and separation-point photography' },
      { item: 'Digital calipers + USB microscope', qty: '1', note: 'verify frontal area and surface finish match across the three noses' },
      { item: 'Small wind tunnel or box fan + honeycomb (wind route)', qty: '1', note: 'alternative to the flume if water is impractical' },
    ],
    buildSteps: [
      { title: 'Build one body, not three models', detail: 'Model a single 80 mm diameter cylindrical body with a keyed socket so all three noses bolt to the same mount at the same depth. Print three noses to identical 80 mm frontal area and identical 100 mm length: (a) flat disc, (b) ogive, (c) Alcedo profile with a low tip angle and a filleted shoulder into the body. Verify area within 1 % with calipers and a planimeter or image trace.' },
      { title: 'Calibrate the load cell first', detail: 'Hang three known masses, fit counts versus newtons, and record the residual. Mount the cell so the nose is in the free stream and the cable exits downstream. Log at 80 Hz or faster and report the resolution in millinewtons — a drag comparison built on an uncalibrated load cell is the most common way this project produces a wrong number.' },
      { title: 'Build the flow and straighten it', detail: 'Set the flume on a level bench, fill it, and put a straw-bundle or honeycomb straightener and a settling length upstream of the test section. Map the velocity profile across the section at three pump settings with the pitot tube and put that map in the report. Turbulent, swirling flow adds scatter that will hide your effect.' },
      { title: 'Drag sweep, three noses, ten runs each', detail: 'For each nose and each of four free-stream speeds (0.2, 0.4, 0.6, 0.8 m/s), record 20 s of steady-state force and take the mean of the middle 10 s. Randomise the order of the noses between runs to average out drift in water temperature and pump performance.' },
      { title: 'See where the flow separates', detail: 'Inject dye just upstream of the nose tip and photograph the wake at one fixed speed for each profile. This is the mechanism check: the measured drag ranking should match the visible separation point, and if it does not, you have a rig problem, not a discovery.' },
      { title: 'Reduce and normalise honestly', detail: 'Compute Cd = 2F / (ρ v² A) for every point using the measured velocity and the measured frontal area. Plot Cd against Reynolds number. Report the percent drag reduction against the blunt baseline at matched speed and area, with the standard deviation over ten runs.' },
      { title: 'Cross-check by free fall', detail: 'If you have no flume, weight each nose-body to a fixed mass and time its descent through a 1.5 m water column in a tall transparent tank, ten drops each. Terminal velocity scales with the inverse square root of drag, so a 20 % drag difference shows up as roughly 10 % in descent time — a coarse but genuinely independent check.' },
      { title: 'State the limits', detail: 'Report your Reynolds number range next to the train\'s, note that a 2D profile in a duct is not a 15 m 3D nose, and state that the kingfisher-to-Shinkansen link is motivational narrative with weak primary sourcing. The measured numbers survive the disclaimer; the story does not.' },
    ],
    code: {
      language: 'python',
      snippet:
        '# Drag reduction with uncertainty, from one CSV per condition.\n' +
        'import numpy as np, pandas as pd\n' +
        'RHO = 998.2  # kg/m^3, water at 20 C\n' +
        'A = 5.03e-3  # m^2, measured frontal area of the 80 mm body\n' +
        'def cd(csv, v, counts_per_N):\n' +
        '    f = pd.read_csv(csv)["counts"].to_numpy() / counts_per_N\n' +
        '    f = f[len(f) // 4 : 3 * len(f) // 4]          # drop start and end transients\n' +
        '    return 2 * f.mean() / (RHO * v**2 * A), 2 * f.std(ddof=1) / (RHO * v**2 * A)\n' +
        'for name in ("blunt", "ogive", "alcedo"):\n' +
        '    c, dc = cd(f"data/{name}_0p6ms.csv", 0.6, counts_per_N=21450.0)\n' +
        '    print(f"{name:7s} Cd = {c:.3f} +/- {dc:.3f}")\n' +
        '# Report reduction as (Cd_blunt - Cd_x) / Cd_blunt, with propagated uncertainty.',
      note:
        'Water temperature changes both density and viscosity and therefore Cd; log it and correct or, at minimum, keep the tank in the shade and run all three noses in the same session. The block of the CSV you average matters more than the sample rate — an unsteady 20 s window with the pump surging is not a drag measurement.',
    },
    metrics: [
      { label: 'drag coefficient Cd at matched frontal area and speed', value: 'report per profile with 10-run standard deviation; blunt 0.8–1.1 is typical' },
      { label: 'percent drag reduction, best nose vs blunt baseline', value: 'target 20–50 %; report what you measure, including zero or negative' },
      { label: 'test Reynolds number based on nose length', value: 'order 10^4–10^5 in a home flume, versus about 10^8 for a train nose' },
      { label: 'load-cell resolution after calibration', value: '≈ 1–5 mN with a 5 kg cell and a 24-bit ADC; state it' },
      { label: 'repeatability across 10 runs, same condition', value: 'report coefficient of variation; below 5 % is a rig worth trusting' },
      { label: 'free-fall descent time through 1.5 m of water', value: 'report seconds per profile as an independent cross-check' },
    ],
    stretchGoals: [
      'Add a fourth nose with the same tip angle as the Alcedo profile but a sharp shoulder into the body, and isolate how much of the gain comes from the fillet at the beak-to-body transition — this directly tests the Crandell et al. finding.',
      'Sweep fineness ratio from 2 to 8 and find the minimum-drag length; the existence of a minimum is the real engineering lesson.',
      'Run the same profiles in a wind tunnel and compare the Cd ranking with the flume; a shape that wins in both is a shape you can trust.',
      'Add surface roughness (sandpaper bands) and measure how much of the drag reduction the boundary layer state can erase — a ship-hull question, not a train question.',
    ],
    safety: [
      'Water and mains electricity do not mix: power the pump from a 12 V DC supply, keep all mains adapters and the laptop on a dry bench above the flume, and protect any mains circuit with an RCD.',
      'Pumps and impellers cut and pinch: fit a strainer on the intake, never put a hand in the sump while powered, and switch off and unplug before clearing a blockage.',
      'A wind-tunnel fan or ducted blower throws debris and can ingest loose clothing or hair: guard the intake with mesh, wear sealed goggles, tie hair back, and never reach past the guard while it turns.',
      'The load-cell rig under towing load stores energy and can recoil: use a slip clutch or a weak link in the tow line, keep the travel path clear, and add a hardware end-stop.',
      'PETG/PLA printing releases ultrafine particles and VOCs: print in a ventilated space or with filtration, and do not site the printer in a bedroom.',
    ],
    lessonLinks: ['w5l9', 'w8l15', 'w3l6'],
    sources: [
      { label: 'Crandell, Howe and Falkingham, Repeated evolution of drag reduction at the air–water interface in diving kingfishers, J. R. Soc. Interface 16:20190125 (2019) — full text, with the printed-model drop tests and CFD drag values', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6544885/' },
      { label: 'Foo, Omar and Taib, Shape optimization of high-speed rail by biomimetic, MATEC Web Conf 135:00019 (2017)', url: 'https://doi.org/10.1051/matecconf/201713500019' },
      { label: 'Nose shape optimization of high-speed train for minimization of tunnel sonic boom — university publication record, Seoul National University', url: 'https://snu.elsevierpure.com/en/publications/nose-shape-optimization-of-high-speed-train-for-minimization-of-t/' },
      { label: '500 Series Shinkansen — nose design and the kingfisher attribution as it is usually reported (Wikipedia; note the article itself flags this claim as needing a better source)', url: 'https://en.wikipedia.org/wiki/500_Series_Shinkansen' },
    ],
  },

  /* 4 · MAPLE-SEED MONOCOPTER / SAMARA DRONE */
  {
    id: 'nature-b-samara-monocopter',
    title: 'Samara One — a Laser-Cut Monocopter with Instrumented Autorotation',
    tagline: 'One balsa wing, one weighted pod, no motor: a flying seed you build, drop from a stairwell, and characterise by descent rate, spin rate and glide ratio.',
    category: 'nature', difficulty: 'journeyman',
    buildTime: '3–4 weekends (about 25 h), plus an afternoon of drop testing', costBand: '$',
    wakandaIndex: 76, diyFeasibility: 80, scienceGrounding: 85,
    realitySplit: {
      real: 'Autorotation is real, stable and measurable. A maple samara spins as it falls because its mass is concentrated at the heavy seed end while its aerodynamic centre sits behind it, so the wing settles into a steady coning autorotation that converts descent into rotation and generates enough lift to slow the fall. Lentink and co-workers showed with force measurements and flow visualisation that autorotating seeds carry a stable leading-edge vortex that raises lift well above what a fixed wing at the same angle would produce. Published simulations of printed samara replicas at 0.5× and 2× scale reproduce the scaling laws, including a longer drop height being needed for larger seeds to reach steady autorotation. Descent rate in m/s, spin rate in rpm, coning angle in degrees, glide ratio and the drop height to steady autorotation are all measurable with an IMU, a barometer and a video camera.',
      narrative: 'The word "drone" oversells this build: an unpowered monocopter always loses altitude. Real controllable monocopters such as the University of Maryland design add a powered propulsive section that separates propulsion from stability, letting the craft hover and fly under control — that is a much harder project, with a control loop, a rotor and a flight-test budget. Build the passive samara first and characterise it honestly; if you later motorise it, you will already know its coning angle, its spin rate and the wing loading, which is exactly the data a controller needs.',
    },
    summary: 'Design a single-blade autorotating flyer: a laser-cut 3 mm balsa wing with a hardwood leading edge and a slight negative pitch toward the tip, a 3D-printed pod carrying the battery and a small IMU/barometer logger, and a steel counterweight at the root that puts the centre of mass ahead of the aerodynamic centre. Trim it by dropping from 2 m into a soft mat, then run a campaign: measure descent rate and spin rate versus all-up mass, find the minimum drop height for steady autorotation, and measure lateral drift to get a glide ratio. The deliverable is a table of flight data, not a video.',
    science: 'Two conditions make autorotation work. First, the wing must be pitched so that the local flow, which is a combination of the descent velocity and the tangential velocity of rotation, arrives at a positive angle of attack over the outboard span; a small negative geometric twist toward the tip keeps the inboard section near the root from stalling. Second, the centre of mass must sit forward of the aerodynamic centre (roughly a quarter-chord), which makes any flapping motion pitch the blade to sustain the spin rather than damp it out. Once spinning, the blade produces a leading-edge vortex that stays attached over a wide range of angles of attack — the mechanism Lentink et al. measured — which is why a seed with no control surfaces can generate a lift coefficient a fixed wing would stall at. Rotation rate is set by the balance between the gravitational power available (mass × descent rate) and the aerodynamic torque the blade extracts from the flow, so adding pod mass raises the descent rate and the spin rate together. Scaling is not free: recent 6-DOF simulations of printed Acer campestre replicas found that a 2× scale flew better while a 0.5× scale lost lift and fell faster, and that bigger seeds need a longer drop to reach steady autorotation. That is the honest design tension in this project — big enough to autorotate, light enough to stay safe and portable.',
    billOfMaterials: [
      { item: 'Laser-cut 3 mm balsa sheet or 1.5 mm aircraft ply', qty: '2 sheets', note: 'cut several wings: the first will be too heavy or too floppy' },
      { item: 'Hardwood leading edge strip (spruce or bass, 3 × 6 mm)', qty: '1', note: 'the leading edge takes all the bending load' },
      { item: '3D-printed pod in PETG (IMU, battery and counterweight bay)', qty: '3', note: 'print variants for different mass distributions' },
      { item: 'MPU6050 or ICM-20948 IMU + BMP390 barometer', qty: '1 set', note: 'gyro Z aligned with the spin axis gives spin rate directly' },
      { item: 'Seeed XIAO ESP32-C3 or Adafruit QT Py + 1S 100 mAh LiPo', qty: '1 set', note: 'BLE logging so the craft stays under 40 g' },
      { item: 'Steel washers or tungsten putty for trim', qty: '1 set', note: 'centre-of-mass tuning is the whole trim procedure' },
      { item: 'Thin cyanoacrylate + kicker, balsa-safe', qty: '1', note: 'and acetone for releasing glued fingers' },
      { item: 'Hall-effect sensor + 2 mm magnet (or a reflective opto gate)', qty: '1', note: 'ground-truth spin rate without trusting the IMU' },
      { item: 'Foam landing mat 2 × 2 m + plumb line, tape measure and metre grid', qty: '1 set', note: 'drift and glide-ratio measurement from a fixed drop point' },
      { item: 'Phone with 240 fps slow-motion + tripod', qty: '1', note: 'for coning angle and spin verification' },
    ],
    buildSteps: [
      { title: 'Cut wings and check mass', detail: 'Laser-cut three wing planforms of the same span and area from 3 mm balsa, glue on the hardwood leading edge, and weigh each. Record wing mass and span so you can compute wing loading in g/cm². A wing that flexes visibly under finger pressure in torsion will not autorotate repeatably.' },
      { title: 'Build the pod and the logger', detail: 'Print a pod that holds the IMU, barometer, battery and a trim bay for washers. Mount the IMU so its Z axis is parallel to the spin axis, calibrate the gyro bias on the bench, and log at 200 Hz to RAM with a BLE dump after landing. Keep all-up mass under 40 g for the first iteration.' },
      { title: 'Trim the centre of mass', detail: 'Balance the wing-plus-pod on a knife edge to find the centre of mass and set it about 15–25 % of the mean chord ahead of the aerodynamic centre (near the quarter-chord point). Adjust by adding washers at the root. This is the single adjustment that decides whether the craft autorotates or tumbles.' },
      { title: 'Set the pitch and the twist', detail: 'Shim the wing root to roughly 6–10° of pitch and add a small negative twist so the tip runs at a lower angle of attack than the root. Verify by eye against a printed pitch gauge before gluing; changing this after assembly means cutting the wing off.' },
      { title: 'Drop into a mat and iterate until it spins', detail: 'Drop from 2 m over the foam mat in still air, indoors or in a wind shadow. A correct trim spins up within about 1–1.5 m of fall and lands flat. Expect several iterations of mass and pitch; keep a written log of every change and its effect, because this is the actual design work.' },
      { title: 'Instrument the drop', detail: 'Run the logger, drop from 4, 6 and 8 m, and record altitude, gyro Z and time. Extract the steady-state descent rate from the barometer slope, the spin rate from the mean gyro magnitude, and the coning angle from a 240 fps side view against a grid. Drop each configuration ten times.' },
      { title: 'Find the start height for steady autorotation', detail: 'Bisect the drop height until the craft reaches stable spin before landing. Report that height in metres versus all-up mass and versus wing area. Larger craft needing a longer run-up is a published scaling result, so your curve should show the same trend — say so if it does not.' },
      { title: 'Measure drift and glide ratio', detail: 'Drop from a fixed plumb line into the grid mat in still air and measure the displacement of the landing point from directly below the release point. Glide ratio is horizontal distance divided by altitude lost; it will be low and it may be dominated by trim asymmetry. Report the wind and the air density with every number.' },
    ],
    code: {
      language: 'python',
      snippet:
        '# Flight-reduction pass over one logged drop.\n' +
        'import numpy as np\n' +
        'def reduce_drop(t, alt_m, gyro_z_dps):\n' +
        '    t, alt, w = np.asarray(t), np.asarray(alt_m), np.abs(np.asarray(gyro_z_dps))\n' +
        '    steady = (t > 0.6 * t[-1])                       # discard the spin-up transient\n' +
        '    v_z = np.polyfit(t[steady], alt[steady], 1)[0]    # baro slope, m/s\n' +
        '    rpm = w[steady].mean() * 60.0 / 360.0             # mean |omega|, rev/min\n' +
        '    return v_z, rpm, w[steady].std() * 60.0 / 360.0\n' +
        '# glide_ratio = horizontal_drift_m / altitude_lost_m, from the grid mat landing point.',
      note:
        'The barometer is the weak sensor: pressure altitude jitters by tens of centimetres and drifts with weather, so fit the slope over seconds, not samples, and cross-check descent rate with video against a tape measure. Use the magnet-and-Hall pickup to verify the gyro spin rate; if the two disagree, the IMU is mounted off-axis.',
    },
    metrics: [
      { label: 'steady descent rate', value: 'target 0.6–1.5 m/s for a 20–40 g craft; report mean ± sd over 10 drops' },
      { label: 'spin rate at steady autorotation', value: 'report rpm from the gyro and from the Hall pickup; hundreds to a few thousand rpm depending on scale' },
      { label: 'glide ratio (horizontal distance / altitude lost)', value: 'report yours; a maple samara is a poor glider and a good descender' },
      { label: 'minimum drop height for steady autorotation', value: 'report in metres versus all-up mass' },
      { label: 'coning angle', value: 'typically 10–30° from horizontal; measure from a 240 fps side view' },
      { label: 'all-up mass and wing loading', value: 'report grams and g/cm²; these two numbers explain most of the flight-to-flight variation' },
    ],
    stretchGoals: [
      'Build a 2× scale wing and a 0.5× scale wing and reproduce the scaling trend from the published 6-DOF simulations on your own bench.',
      'Add a single small motor and propeller at the wing tip for spin-up only, and measure how much drop height the powered spin-up removes.',
      'Add movable trim masses on a micro-servo and test whether active trim can steer the glide — this is the first step towards a controllable monocopter.',
      'Fly in a marked wind gradient and report how descent rate and spin rate change with horizontal wind, since the samara\'s dispersal in nature is a wind phenomenon.',
    ],
    safety: [
      'A dropped mass is a falling hazard: establish a drop corridor that nobody enters, drop only into the foam mat, wear eye protection, never drop over a hard floor or near anyone\'s head, and never release from height while standing on an unsecured chair or ladder.',
      'The 1S LiPo is small but still a fire risk: charge it in a fireproof bag on a non-flammable surface, never unattended, and never use a puffed or punctured cell after a hard landing.',
      'Cyanoacrylate bonds skin in seconds and its vapour irritates eyes and airways: work in a ventilated area, wear sealed goggles, keep acetone within reach as a debonder, and never lean over the joint while the kicker flashes.',
      'A laser cutter cutting balsa or ply is a fire and fume source: never leave it running unattended, keep the air assist and extraction on, clean the bed of debris, and know where the CO2 extinguisher is.',
      'If you drop from a drone or a rooftop instead of a stairwell, keep clear of people and property, check local rules on unmanned aircraft, and never fly over anyone not involved in the test.',
    ],
    lessonLinks: ['w5l9', 'w2l3', 'w8l15'],
    sources: [
      { label: 'Lentink, Dickson, van Leeuwen and Dickinson, Leading-Edge Vortices Elevate Lift of Autorotating Plant Seeds, Science 324:1438–1440 (2009)', url: 'https://www.science.org/doi/abs/10.1126/science.1174196' },
      { label: 'Lolli, Corsi and DeSimone, Aerodynamic performance of autorotating seeds: scaling by size, Bioinspiration & Biomimetics — open-access repository record with the 6-DOF OpenFOAM study of printed samara replicas', url: 'https://www.iris.sssup.it/handle/11382/587253' },
      { label: 'University of Maryland Clark School, Maple Seeds Inspire Robotic Flight — the Ulrich/Pines controllable single-winged monocopter and its stability/propulsion split', url: 'https://eit.umd.edu/news/story/maple-seeds-inspire-robotic-flight' },
      { label: 'University of Glasgow, Scaled Samara rotor study — drop-test methodology for a single-bladed samara rotor (PDF)', url: 'https://www.gla.ac.uk/media/Media_647561_smxx.pdf' },
    ],
  },
];
