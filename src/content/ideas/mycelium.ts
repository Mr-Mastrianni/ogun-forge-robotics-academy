import type { IdeaProject } from '../types';

/**
 * Idea Lab — "Mycelium Robo-Tech".
 *
 * House rules for this file, so the reader can trust every number:
 *  - Anything tagged (measured) is a published or directly measured figure with a source.
 *  - Anything tagged (modelled) is a first-order estimate this brief asks you to verify yourself.
 *  - Mechanical properties of mycelium biocomposites vary by an order of magnitude with species,
 *    substrate, particle size, moisture, pressing and drying. We quote ranges, never single truths.
 *  - We never claim fungal consciousness, fungal "free energy", or silicon-class fungal computing.
 */
export const myceliumProjects: IdeaProject[] = [
  {
    id: 'myc-chassis',
    title: 'Ọ̀gún Frame — Grown Mycelium Biocomposite Robot Chassis',
    tagline:
      'Grow the frame in a bag, kill it with heat, bolt on the motors. Then weigh it against PLA and 6061 aluminium and admit what it lost.',
    category: 'mycelium',
    difficulty: 'apprentice',
    buildTime: '4–6 weeks (3 weeks of that is waiting)',
    costBand: '$$',
    wakandaIndex: 72,
    diyFeasibility: 74,
    scienceGrounding: 82,
    realitySplit: {
      real:
        'A load-bearing chassis whose stiffness, density and damping you measure yourself on a kitchen scale, a caliper and a three-point bend rig. Mycelium biocomposite is a genuine, peer-reviewed structural material with density ~100–400 kg/m³ (measured) and compressive strength ~0.1–1.2 MPa (measured, and it really does vary this widely).',
      narrative:
        'That the grown frame replaces machined aluminium. It does not. It replaces foam, balsa and injection-moulded shells in low-load, high-damping applications — and it disappears in a compost heap, which the aluminium never will.',
    },
    summary:
      'You build the same small differential-drive rover twice: once with a laser-cut plywood deck, once with a mycelium biocomposite deck grown in a mould. You instrument both with the same motors, wheels and battery, then measure mass, static stiffness, first resonance and vibration damping. The project is deliberately comparative — the point is not "mycelium wins", it is "mycelium wins exactly here and loses exactly there", with your own numbers on the table.',
    science:
      'Grow a white-rot basidiomycete (Trametes versicolor or Pleurotus ostreatus, bought as grain or sawdust spawn) through a lignocellulosic substrate — hemp hurd, sawdust or straw — at 60–75% moisture content and 25 ± 2 °C (measured standard practice; most substrates fully colonise in 10–21 days, and Pleurotus/Trametes demould cleanly at 7–8 days). The mycelium acts as a self-assembling binder: hyphae wrap every particle and fuse into a continuous network. You then dry or heat-press it. Heat pressing at roughly 0.2–5 MPa and 60–120 °C for 10–60 minutes collapses the hyphal network and densifies the panel; the mechanical result is highly non-uniform and process-sensitive, so you must press identically for every specimen or your data is noise. The heat treatment also deactivates the organism (the material becomes inert, non-viable composite — an important buildability and regulatory distinction), which is what makes this a robot and not a pet. Expect specific stiffness roughly 20–100× lower than 6061-T6 and 3–15× lower than solid PLA, but internal damping several times higher — mycelium composite behaves like a constrained-layer damping material, which is genuinely useful on a vibrating rover deck.',
    billOfMaterials: [
      { item: 'Trametes versicolor or Pleurotus ostreatus grain spawn (2 kg)', qty: '1 bag', note: 'Buy from a reputable supplier; never culture wild moulds' },
      { item: 'Hemp hurd or hardwood sawdust, 3–8 mm', qty: '5 kg', note: 'Kiln-dried; pasteurise at 70–80 °C for 60 min' },
      { item: 'Mould: HDPE or silicone-lined plywood form, 250 × 180 × 22 mm', qty: '2', note: 'One per material variant' },
      { item: '28 qt monotub + micropore tape + HEPA filter patch', qty: '1', note: 'Colonisation chamber, 25 °C' },
      { item: 'Inkbird ITC-308 temperature controller + seedling heat mat', qty: '1', note: 'Hold incubation at 25 ± 2 °C' },
      { item: 'Calibrated load cell 5 kg + HX711 + Arduino Nano', qty: '1 set', note: 'Three-point bend rig' },
      { item: '12 V N20 gearmotors with encoders (300 rpm)', qty: '2', note: 'Identical drivetrain on both decks' },
      { item: 'INA219 current monitor + 2S 18650 pack', qty: '1 set', note: 'Energy cost per metre comparison' },
      { item: 'Digital hygrometer (calibrated against 75% NaCl reference)', qty: '1' },
      { item: 'M3 threaded inserts, M3 × 12 bolts, cyanoacrylate', qty: '1 pack', note: 'Insert with epoxy, not thread-cutting force' },
    ],
    buildSteps: [
      {
        title: 'Pasteurise the substrate',
        detail:
          'Hydrate hemp hurd to 65% moisture (squeeze test: a few drops, not a stream). Pasteurise at 75 °C for 60 minutes in a covered pot, then cool to below 30 °C before adding spawn — above 35 °C you cook the inoculum. Mix spawn at 10–20% by wet mass.',
      },
      {
        title: 'Fill and incubate',
        detail:
          'Pack the mix into the mould to a consistent bulk density (record it — it drives everything). Cover, add a filter patch, hold at 25 ± 2 °C in the dark. Watch for full white colonisation in 10–21 days. Break up and re-pack at day 7 to even out the density.',
      },
      {
        title: 'Deactivate and dry',
        detail:
          'Demould at 7–10 days for Pleurotus/Trametes, then dry at 60–70 °C for 12–24 h (or heat-press at 0.5–2 MPa, 80–100 °C, 20 min). The part is inert when the core is bone-dry. Log the mass every hour; the drying curve is your process control.',
      },
      {
        title: 'Machine and seal',
        detail:
          'Sand to size. Drill motor mounts with a brad-point bit at low speed and back the hole with tape to stop tear-out. Seal with two coats of shellac or linseed oil — unsealed composite absorbs water and swells (measured water uptake can approach 200% by mass in some formulations), which destroys both stiffness and dimensional accuracy.',
      },
      {
        title: 'Instrument both decks',
        detail:
          'Assemble identical drivetrains on the mycelium and plywood decks. Use the same bolts, same standoffs, same wheelbase. Weigh each deck alone on a scale with 1 g resolution.',
      },
      {
        title: 'Three-point bend test',
        detail:
          'Support the deck on two 10 mm rods 200 mm apart, press at the centre with the load cell at 1 mm/s, log force and deflection. Compute flexural modulus from E = FL³/(48·I·d) and record the peak load before failure. Test three specimens per material; report mean ± spread, not a single number.',
      },
      {
        title: 'Modal / damping test',
        detail:
          'Mount an MPU-6050 at the deck centre, tap the deck with a solenoid, and log the decay. Estimate damping ratio by log decrement. This is where the mycelium deck should win.',
      },
      {
        title: 'Drive and compare',
        detail:
          'Run the same figure-eight path on both rovers, logging INA219 current × time. Report Wh/m, and normalise by payload mass. Write down where mycelium lost and by how much.',
      },
    ],
    code: {
      language: 'cpp',
      snippet: [
        '// Three-point bend logger: HX711 + load cell, 10 Hz, with stall guard',
        '#include "HX711.h"',
        'HX711 scale;',
        'const int DT = 3, SCK = 2;',
        'const float CAL = 21400.0f;      // counts per kg, calibrate with known masses',
        'const float SPAN = 0.200f;        // m between supports',
        'const float WIDTH = 0.020f;       // m specimen width',
        'const float THICK = 0.018f;       // m specimen thickness',
        '',
        'void setup() { Serial.begin(115200); scale.begin(DT, SCK); scale.set_scale(CAL); scale.tare(); }',
        '',
        'void loop() {',
        '  // deflection is driven by a lead screw; ASSUME 1 mm per step, verify with a dial gauge',
        '  static int step = 0;',
        '  float force = scale.get_units(5) * 9.80665f;     // N',
        '  float defl = step * 0.001f;                       // m',
        '  float I = WIDTH * pow(THICK, 3) / 12.0f;          // m^4',
        '  float E = (defl > 1e-5f) ? (force * pow(SPAN, 3)) / (48.0f * I * defl) : 0.0f;',
        '  Serial.print(defl * 1000.0f, 3); Serial.print(",");',
        '  Serial.print(force, 3);          Serial.print(",");',
        '  Serial.println(E / 1e6f, 2);     // MPa',
        '  step++;',
        '  if (step > 40) { while (1) { delay(1000); } }      // specimen has failed, stop',
        '  delay(100);',
        '}',
      ].join('\n'),
      note:
        'Calibrate CAL with two known masses before every session — load cells drift with temperature and so does the composite. Report flexural modulus (MPa), not just peak force.',
    },
    metrics: [
      { label: 'dry density of deck', value: 'target 150–350 kg/m³ (measured, oven-dry)' },
      { label: 'flexural modulus', value: 'expect 20–150 MPa (measured) vs ~2000–3500 MPa PLA' },
      { label: 'compressive strength, 10% strain', value: '0.1–1.2 MPa (measured — this range is real, report your mean and spread)' },
      { label: 'damping ratio at first mode', value: '0.04–0.12 (measured) vs <0.02 for plywood deck' },
      { label: 'colonisation time to full white', value: '10–21 days at 25 ± 2 °C (measured)' },
      { label: 'energy cost of transport', value: 'Wh/m normalised per kg payload (measured, both decks)' },
    ],
    stretchGoals: [
      'Grow the motor mounts into the deck in one piece (see the bio-welded joints brief) and delete the fasteners entirely.',
      'Add a second skin of pure mycelium mat as a damping layer and measure the shift in damping ratio.',
      'Repeat with three substrate particle sizes and produce a real process–property map for your own workshop.',
      'Compost the losing prototype on camera and weigh what is left after 8 weeks.',
    ],
    safety: [
      'Buy spawn from a reputable commercial supplier (grain or sawdust spawn of a known species). Do not culture wild moulds or clone supermarket mushrooms — you cannot identify what you grow, and Aspergillus and other toxigenic moulds look like white mycelium to the untrained eye.',
      'Wear an N95/P2 respirator, nitrile gloves and eye protection when handling dry spawn, dry substrate or any mouldy colonisation bag. Dry spawn dust and mould spores are the main inhalation hazard in this build; work near a HEPA filter or outdoors, never in a bedroom.',
      'If anyone in the household is immunocompromised, pregnant, or has asthma or a transplant history, do not run this build indoors at all. Invasive aspergillosis is a real risk for those groups from ordinary mould exposure, and no HEPA tent makes a home mycology lab safe for them.',
      'Never grow edible mushrooms on this experimental substrate and never eat anything from a failed or mouldy bag — contamination you cannot see can be toxigenic.',
      'Keep the incubation chamber on a ground-fault-protected circuit with the heat mat on a thermostat and a hard thermal cut-out at 32 °C — heat mats under sealed tubs are a documented fire scenario — and never run mains-powered electronics into the wet chamber. All sensing (HX711, thermistors) runs from isolated low-voltage supplies with conformal coating on any board that lives in the humid box. Never combine wet organic substrate with mains voltage.',
    ],
    lessonLinks: ['w7l14', 'w5l10', 'w1l2'],
    sources: [
      { label: 'Elsacker et al., Biomimetics 2022 — tensile strength of pure Ganoderma/Pleurotus mycelium biofilms (0.7–1.1 MPa)', url: 'https://cris.vub.be/ws/files/85051094/Elsacker_et_al_2022_Biomimetics.pdf' },
      { label: 'Elsacker PhD thesis (VUB) — heat-pressed mycelium composite properties and process sensitivity', url: 'https://cris.vub.be/ws/files/67445971/Elsacker_PhD_for_share_small.pdf' },
      { label: 'Alemu et al., Int. J. Polym. Sci. 2022 — mycelium-based composite review; 280 kg/m³ and 570 kPa sawdust composites', url: 'https://onlinelibrary.wiley.com/doi/10.1155/2022/8401528' },
      { label: 'Motamedi thesis (ÉTS Montréal) — demoulding windows of 7–8 days for Pleurotus and Trametes', url: 'https://espace.etsmtl.ca/id/eprint/3847/1/MOTAMEDI_Seyedsina_Th%C3%A8se.pdf' },
      { label: 'Springer J. Mater. Sci. 2026 — non-uniform effect of hot/cold pressing on mycelium composite mechanics', url: 'https://link.springer.com/content/pdf/10.1007/s10853-026-13104-0.pdf' },
    ],
  },

  {
    id: 'myc-living-skin',
    title: 'Living Skin — A Mycelium Mat That Feels Moisture and Touch',
    tagline:
      'A colonised mat is a humidity sensor, a touch sensor and a slow thermometer rolled into one — if you can read a few percent impedance shift out of a wet, drifty, living resistor.',
    category: 'mycelium',
    difficulty: 'journeyman',
    buildTime: '3–5 weeks',
    costBand: '$$',
    wakandaIndex: 78,
    diyFeasibility: 58,
    scienceGrounding: 68,
    realitySplit: {
      real:
        'The impedance of a colonised mycelium mat genuinely changes with moisture content and with mechanical compression, because the conductive path is an ionic, water-mediated network through hyphae and substrate. You can measure that with a known excitation current, a lock-in style synchronous detector, and good electrode hygiene.',
      narrative:
        'Calling it "skin" and "sensing touch like a living creature". It is a slow, hysteretic, humidity-dominated variable resistor. Its response to touch is largely a moisture/SSC (solid–solution contact) artefact, and it needs ten to sixty minutes to recover. Demonstrating that honestly is the project.',
    },
    summary:
      'You laminate a thin living mycelium mat onto a flexible Kapton electrode array, drive it with a 1 kHz, 100 µA AC excitation (never DC — DC polarises the electrodes and electrolyses the mat), and demodulate with a synchronous detector into a real impedance reading. Then you run a proper characterisation: impedance vs relative humidity, vs temperature, vs applied normal force, and vs time since watering. The deliverable is a sensor model and an honest limits-of-detection report, plus a rover skin that reports "wet", "dry" and "pressed".',
    science:
      'The conduction mechanism in wet mycelium composite is electrolytic, not electronic: charge moves as ions in the water film and within the hyphal cytoplasm, so the measured impedance is dominated by moisture content and ionic strength, with a phase angle that betrays the capacitive double-layer at the electrode interface. That is why a DC ohmmeter gives you garbage (drifting, polarised, electrolysing) and why AC excitation with a synchronous detector is mandatory. Expect the impedance magnitude at fixed geometry to swing by an order of magnitude or more between 40% and 95% RH (modelled; verify). Separating a genuine mechanotransduction signal from the moisture artefact requires the control experiment: press the mat under a saturated humidity dome where evaporation cannot change, and see whether anything is left. Published work on mycelium as a sensing material is real but young — mycelium composites have been shown to be sensitive to humidity, gases and mechanical stimuli, though the mechanisms are usually electrochemical and the response times long.',
    billOfMaterials: [
      { item: 'Living mycelium mat, 1–3 mm thick, grown on a flat tray', qty: '3', note: 'Trametes versicolor on hemp hurd; harvest at 10–14 days' },
      { item: 'Flexible PI (Kapton) sheet, 50 µm, plus Pyralux adhesive', qty: '2 sheets', note: 'Substrate for the electrode array' },
      { item: 'Electrode options: gold-plated PCB, conductive carbon ink, 316 stainless mesh', qty: '1 of each', note: 'Compare polarisation behaviour; gold is best, carbon is cheapest' },
      { item: 'AD5933 impedance analyser breakout (or AD5941)', qty: '1', note: 'Real/imaginary at a chosen frequency' },
      { item: 'INA333 instrumentation amplifier module + REF5025 reference', qty: '1 set', note: 'For the 4-wire synchronous detector variant' },
      { item: 'ADG419 analog switches or AD630 lock-in modulator', qty: '2', note: 'Synchronous demodulation of the 1 kHz carrier' },
      { item: 'ESP32-S3 with ADS1115 16-bit ADC', qty: '1 set', note: 'ADS1115 alone is enough for the simple magnitude reading' },
      { item: 'Sensirion SHT45 temperature + RH reference sensor', qty: '1', note: 'Your ground truth for the humidity model' },
      { item: 'Saturated salt humidity references: MgCl₂ (33% RH), NaCl (75% RH), K₂SO₄ (97% RH)', qty: '1 set', note: 'Calibration standards' },
      { item: 'Desiccator jar + 0.1 g scale', qty: '1', note: 'Gravimetric moisture measurement' },
      { item: 'Conformal coating (silicone, e.g. MG 422B) + 3M 5952 tape', qty: '1', note: 'Protect every PCB that lives near the mat' },
    ],
    buildSteps: [
      {
        title: 'Grow a flat mat, not a block',
        detail:
          'Spread colonised substrate 3–8 mm deep in a flat tray and let the mycelium knit for 10–14 days at 25 °C. A thin mat gives you a shorter ionic path and a faster response; a thick block drags moisture gradients for days and ruins repeatability.',
      },
      {
        title: 'Fabricate the electrode array',
        detail:
          'Make co-planar interdigitated electrodes with 1 mm gaps on Kapton. Photolithography is ideal but a vinyl cutter plus conductive carbon ink works. Keep the total electrode area constant between specimens — impedance scales with geometry and you want material, not layout, in your data.',
      },
      {
        title: 'Laminate with a defined contact pressure',
        detail:
          'Bond the mat to the array under a fixed, recorded mass (say 200 g over 30 × 30 mm ≈ 2.2 kPa) so contact resistance is reproducible. Not doing this is the single most common reason these experiments fail.',
      },
      {
        title: 'Build the AC front end',
        detail:
          'Drive with 1 kHz at 100 µA peak through a precision resistor. Amplify the mat voltage with an INA333 set to G = 101, band-pass 800–1200 Hz, then demodulate with an ADG419 into a low-pass at 1 Hz to get |Z|. Take a second channel with a 90° phase-shifted carrier to get the reactive part.',
      },
      {
        title: 'Characterise against humidity',
        detail:
          'Hold the mat in a sealed jar over each saturated salt for 2 hours, then record |Z|, phase, temperature and gravimetric moisture. Fit a model. Report hysteresis by stepping up and back down.',
      },
      {
        title: 'Separate touch from moisture',
        detail:
          'Apply known normal forces (10, 50, 200 g) with a calibrated weight stack. Run the whole test twice: once in room air, once inside a saturated-humidity chamber where evaporation is suppressed. The difference between those curves is the honest mechanotransduction signal.',
      },
      {
        title: 'Measure drift and recovery',
        detail:
          'Log for 24 hours without touching anything. Quantify the baseline drift in %/hour and the recovery time after each stimulus. These numbers decide whether the sensor is usable at all.',
      },
      {
        title: 'Mount on a rover and use it',
        detail:
          'Wrap the mat around a bumper and drive the rover at a wall. Threshold on d|Z|/dt to trigger a stop. A slow sensor is fine for a bumper if you drive slowly — state the maximum speed at which detection still works.',
      },
    ],
    code: {
      language: 'cpp',
      snippet: [
        '// ADS1115 + synchronous demodulation of a 1 kHz mycelium impedance signal.',
        '// The carrier is generated on GPIO 25 and the demodulator switches on GPIO 26/27.',
        '#include <Adafruit_ADS1X15.h>',
        'Adafruit_ADS1115 ads;',
        '',
        'const float I_PEAK = 100e-6f;   // A, set by the drive resistor; verify with a scope',
        'const float FS = 860.0f;        // ADS1115 samples per second at gain 1',
        '',
        '// Goertzel-style single-bin magnitude estimate, robust to 50/60 Hz hum',
        'float carrierMagnitude(const int16_t *x, int n, float f, float fs) {',
        '  float k = 2.0f * cosf(2.0f * PI * f / fs);',
        '  float s1 = 0, s2 = 0;',
        '  for (int i = 0; i < n; i++) { float s0 = x[i] + k * s1 - s2; s2 = s1; s1 = s0; }',
        '  float re = s1 - s2 * cosf(2.0f * PI * f / fs);',
        '  float im = s2 * sinf(2.0f * PI * f / fs);',
        '  return 2.0f * sqrtf(re * re + im * im) / n;   // volts peak',
        '}',
        '',
        'int16_t buf[256];',
        '',
        'void loop() {',
        '  for (int i = 0; i < 256; i++) { buf[i] = ads.readADC_SingleEnded(0); delayMicroseconds(1160); }',
        '  float v = carrierMagnitude(buf, 256, 1000.0f, FS);',
        '  float z = v / I_PEAK;                 // ohms',
        '  Serial.print(millis()); Serial.print(","); Serial.println(z, 1);',
        '  delay(1000);',
        '}',
      ].join('\n'),
      note:
        'Never drive the mat with DC. Even 100 µA of DC through a wet ionic sample polarises the electrodes within seconds and electrolyses water within minutes — the reading becomes an artefact of your own measurement.',
    },
    metrics: [
      { label: '|Z| at 1 kHz, 75% RH', value: 'typically 1 kΩ–1 MΩ depending on mat moisture and electrode geometry (measured, report your geometry)' },
      { label: 'humidity sensitivity', value: 'target >2× change in |Z| between 33% and 97% RH (measured)' },
      { label: 'baseline drift', value: 'report %/hour over 24 h (measured)' },
      { label: 'touch response above the moisture artefact', value: 'report Δ|Z|/|Z| in the saturated-humidity control; if it is under 0.5%, say so (measured)' },
      { label: 'recovery time after a 200 g press', value: 'expect 10–60 min (measured)' },
      { label: 'bumper detection speed limit', value: 'max rover speed at which a wall stop is <5 cm of travel (measured)' },
    ],
    stretchGoals: [
      'Add a four-electrode (Kelvin) measurement and show how much of the impedance was electrode polarisation.',
      'Move to a swept-frequency measurement (1 Hz–100 kHz) and fit a Randles equivalent circuit; report the fitted double-layer capacitance.',
      'Run a long-duration experiment: does the mat get more or less sensitive as it dries out over two weeks?',
      'Publish the negative result if mechanotransduction disappears under saturated humidity.',
    ],
    safety: [
      'Buy spawn from a reputable supplier; do not culture wild moulds. You are deliberately growing a fungus at high humidity, which is also the ideal condition for contaminants.',
      'Wear an N95/P2 respirator and gloves whenever you handle or trim dry mycelium mat, and when you open any colonisation container. Mycelium mats shed spores and hyphal fragments; the dose is highest when the mat is dried or disturbed.',
      'Keep the entire experiment on an isolated low-voltage supply (≤12 V, current-limited to 1 mA) and put a 1 MΩ series resistor in every electrode line. Wet organic substrates are conductive, and the moment a mains-referenced supply touches a damp mat you have created a shock path across the whole bench. Never combine wet organic substrates with mains voltage.',
      'Anyone immunocompromised must not handle the mats or the humid chamber; invasive mould infection risk is the reason commercial mycology labs exclude these people from spawn handling areas.',
      'Conformal-coat every board in the humid chamber and power it from a battery or an isolated DC/DC converter, so a condensation event cannot bridge to anything referenced to earth.',
    ],
    lessonLinks: ['w2l4', 'w7l14', 'w5l10'],
    sources: [
      { label: 'Frontiers in Fungal Biology 2025 — biohybrid robots and living mycelium materials for sensing', url: 'https://www.frontiersin.org/journals/fungal-biology/articles/10.3389/ffunb.2025.1739847/full' },
      { label: 'Advanced Engineering Materials — biosensing abilities of living mycelium materials', url: 'https://advanced.onlinelibrary.wiley.com/doi/pdf/10.1002/adem.202501759' },
      { label: 'MDPI Biosensors 2026 — filamentous fungi in (bio)sensing across domains (review)', url: 'https://www.mdpi.com/2079-6374/16/2/131/pdf' },
      { label: 'Adamatzky, arXiv:2112.09907 — extracellular potential recording methods and electrode geometry in fungi', url: 'https://ar5iv.labs.arxiv.org/html/2112.09907' },
    ],
  },

  {
    id: 'myc-spike-probe',
    title: 'Ọ̀rọ̀ Ayé — The Fungal Electrical Signalling Probe',
    tagline:
      'Differential needle electrodes into a colonised block, an INA333 at G = 1000, a 16-bit ADC, and a fight to the death with 50/60 Hz hum to see spikes of a few hundred microvolts.',
    category: 'mycelium',
    difficulty: 'master',
    buildTime: '2–3 weeks (plus 2 weeks of substrate colonisation)',
    costBand: '$$$',
    wakandaIndex: 86,
    diyFeasibility: 52,
    scienceGrounding: 88,
    realitySplit: {
      real:
        'Fungi produce genuine, reproducible, extracellularly measurable electrical potential spikes. Adamatzky recorded four species with average spike amplitudes of 0.007 mV to 0.3 mV, bursts to 2.1 mV, average inter-spike intervals of 41–116 minutes, and spike durations from seconds to over an hour. That is a real electrophysiology dataset, and you can reproduce it.',
      narrative:
        '"Mycelium is thinking / speaking a language." The published linguistic analysis is an analogy applied to spike trains. Words, sentences and complexity hierarchies are a framework imposed on the data, not a decoding of semantic content. Build the instrument; be sceptical of the translation.',
    },
    summary:
      'A precision, low-noise differential amplifier front end for recording extracellular electrical activity from a colonised substrate. Two iridium or stainless subdermal needle electrodes 1–2 cm apart feed an INA333 instrumentation amplifier with a guarded input, active common-mode drive, a 0.05 Hz–30 Hz passband and a mains notch, into an ADS1115 (or better, an ADS1256) at 16–24 bits. Software does baseline estimation, adaptive threshold spike detection and inter-spike interval statistics — reproducing the published analysis pipeline so you can compare your numbers directly with the literature.',
    science:
      'The measured quantity is a differential extracellular potential between two electrodes in the same colonised block. Amplitude is tiny: published averages run 0.007 mV (Omphalotus nidiformis), 0.03 mV (Schizophyllum commune), 0.2 mV (Cordyceps militaris) and 0.3 mV (Flammulina velutipes), with high-frequency bursts reaching 2.1 mV and spike durations from under a minute to 21 hours. Inter-spike intervals average 41–116 minutes and are highly variable. Separate work on Pleurotus djamor found rhythmic oscillations with periods near 2.6 minutes and 14 minutes, and Ganoderma resinaceum spikes most commonly 5–8 minutes wide. Reference recordings used 1–2 cm electrode spacing, 1 sample/s, a 78 mV acquisition range and galvanic isolation. The engineering consequence: at 0.007 mV you need sub-microvolt noise and better than 100 dB rejection of the local mains field, because a bare electrode pair on a wet block is an excellent capacitive antenna. Everything else in this project is hum control: twisted pair, driven guard/shield, a Faraday enclosure, common-mode feedback to a third electrode, and a battery supply so the whole front end floats.',
    billOfMaterials: [
      { item: 'INA333 instrumentation amplifier (DIP or SOIC adapter)', qty: '3', note: 'G = 1 + 100 kΩ/Rg; G = 1001 with Rg = 100 Ω' },
      { item: 'AD620ANZ as an alternative front end', qty: '2', note: 'Classic, lower bandwidth, more noise; good comparison' },
      { item: 'ADS1115 16-bit ADC breakout', qty: '1', note: '±0.256 V range gives ~7.8 µV/LSB — marginal; use ADS1256 for real work' },
      { item: 'ADS1256 24-bit ADC module', qty: '1', note: 'Recommended; ~30 nV noise at low data rates' },
      { item: 'Iridium-coated stainless subdermal needle electrodes, 0.4 mm', qty: '1 pack', note: 'Single-use; do not re-sterilise and reuse on another block' },
      { item: 'Precision resistors: 0.1% 100 Ω, 10 kΩ, 100 kΩ metal film', qty: '1 set', note: 'Rg tolerance sets CMRR; matched to 0.01%' },
      { item: 'OPA333 driving the shield / guard electrode', qty: '2', note: 'Bootstrapped guard kills cable capacitance' },
      { item: 'Aluminium die-cast enclosure + copper tape + ferrite clamp', qty: '1 set', note: 'Faraday cage, single-point ground' },
      { item: '12 V sealed lead-acid battery (SLA) or 6×AA pack', qty: '1', note: 'Float the entire front end; no mains anywhere near the block' },
      { item: 'ADS1115 + ESP32-S3 or Raspberry Pi Pico for logging', qty: '1 set', note: '1–10 Hz sustained logging, microSD' },
      { item: 'Precision reference: REF5025 + ADR4525', qty: '1 each', note: 'ADC reference stability sets your drift floor' },
      { item: 'Belden 8451 shielded twisted pair, 1 m', qty: '1', note: 'Short, twisted, shielded, and never near a switched-mode supply' },
    ],
    buildSteps: [
      {
        title: 'Colonise the substrate and let it settle',
        detail:
          'Grow the fungus through a block at 25 °C until fully white (10–21 days), then move it into the recording enclosure and let it equilibrate for 48 hours. Freshly moved blocks produce huge movement and moisture artefacts that swamp real spikes.',
      },
      {
        title: 'Build the front end on a ground plane',
        detail:
          'INA333 with Rg = 100 Ω for G ≈ 1001, referenced to a mid-supply virtual ground. Set the gain-set resistor tolerance to 0.01% and match the two input bias paths; CMRR degrades directly with source-impedance mismatch, and a wet block has mismatched source impedances by nature.',
      },
      {
        title: 'Add the guard and the common-mode drive',
        detail:
          'Buffer the average of the two inputs with an OPA333 and drive a third needle electrode (or the copper shield around the block) with it. This bootstrapped common-mode drive can buy you 20–40 dB of hum rejection on a wet, high-impedance sample.',
      },
      {
        title: 'Band-limit hard',
        detail:
          'Passband 0.05 Hz to 30 Hz. Fungal spikes are slow — the fast ones are minutes wide — so there is no signal above 30 Hz and everything above it is interference. Add a twin-T notch at 50 Hz or 60 Hz depending on your region, and verify the notch depth with a signal generator, not by eye.',
      },
      {
        title: 'Shield and float',
        detail:
          'Put the whole front end, the block and the battery in a die-cast aluminium box. The box is the only ground reference. Run no mains cable into the box. Confirm with a scope probe that the box is actually floating relative to earth.',
      },
      {
        title: 'Establish the noise floor before the biology',
        detail:
          'Record 24 hours with electrodes in a sterile, uncolonised block of the same substrate at the same moisture. Report peak-to-peak noise and its spectrum. Without this baseline, no spike you detect means anything.',
      },
      {
        title: 'Record and detect',
        detail:
          'Switch to the colonised block. Log at 1–10 Hz for 3–5 days. Implement the published detector: local average a_i over a window w, spike when |x_i| − |a_i| > δ, with a refractory distance d. Use species-appropriate w and δ and state them — for slow species w = 200 samples at 1 Hz.',
      },
      {
        title: 'Stimulate and observe',
        detail:
          'Apply controlled stimuli: a 2 g weight dropped on the block, a 5 °C cold pack on one corner, a puff of CO₂-enriched air. Then compare spike rate and amplitude in a 30-minute window before and after. This is the experiment that turns an instrument into a result — and sometimes the result is "nothing happened".',
      },
    ],
    code: {
      language: 'python',
      snippet: [
        '"""Spike detection for slow fungal extracellular recordings (1 Hz).',
        '',
        'Pipeline mirroring Adamatzky et al. (arXiv:2112.09907): local-average baseline,',
        'adaptive threshold, then a refractory-distance filter.',
        '"""',
        'import numpy as np',
        'import pandas as pd',
        '',
        'FS = 1.0            # Hz, samples per second',
        'W = 200             # baseline half-window in samples (200 s for slow species)',
        'DELTA_MV = 0.10     # threshold in mV, species specific: 0.003-0.10',
        'D = 300             # refractory distance in samples',
        '',
        'def detect_spikes(x_mv: np.ndarray, w: int = W, delta: float = DELTA_MV, d: int = D):',
        '    n = len(x_mv)',
        '    # centred local average, edge-safe',
        '    kernel = np.ones(4 * w + 1) / (4 * w + 1)',
        '    a = np.convolve(x_mv, kernel, mode="same")',
        '    score = np.abs(x_mv) - np.abs(a)',
        '    candidates = np.flatnonzero(score > delta)',
        '    kept = []',
        '    for i in candidates:',
        '        if not kept or (i - kept[-1]) >= d:',
        '            kept.append(int(i))',
        '    return np.array(kept, dtype=int), score',
        '',
        'if __name__ == "__main__":',
        '    df = pd.read_csv("recording.csv")   # columns: t_s, mv',
        '    x = df["mv"].to_numpy()',
        '    spikes, score = detect_spikes(x)',
        '    amp = np.abs(x[spikes]) if len(spikes) else np.array([0.0])',
        '    isi = np.diff(spikes) / FS / 60.0 if len(spikes) > 1 else np.array([np.nan])',
        '    print(f"spikes={len(spikes)}")',
        '    print(f"mean amplitude = {amp.mean():.4f} mV  (published averages: 0.007-0.3 mV)")',
        '    print(f"mean inter-spike interval = {np.nanmean(isi):.1f} min  (published: 41-116 min)")',
      ].join('\n'),
      note:
        'Never report a spike you have not seen in the raw trace with the detector parameters written down. Re-run the identical detector on the sterile-block control and report its false-positive rate.',
    },
    metrics: [
      { label: 'input-referred noise, 0.05–30 Hz', value: 'target <1 µV RMS with inputs shorted; <5 µV with electrodes in a sterile block (measured)' },
      { label: 'common-mode rejection at 50/60 Hz', value: 'target >100 dB with matched source impedance, >80 dB with the real wet block (measured)' },
      { label: 'spike amplitude detected', value: '0.05–2 mV (measured; literature averages 0.007–0.3 mV with bursts to 2.1 mV)' },
      { label: 'spike duration', value: 'seconds to tens of minutes (measured; published range 1 min to 21 h)' },
      { label: 'inter-spike interval', value: '40–120 min mean with high variance (measured; literature 41–116 min)' },
      { label: 'false-positive rate on the sterile control', value: 'report spikes/hour from the uncolonised block (measured)' },
    ],
    stretchGoals: [
      'Record two electrode pairs simultaneously and test for the cross-correlation / synchronisation seen between neighbouring fruiting bodies.',
      'Swap in an ADS1256 at 24 bits and see how much of your noise floor was the ADC.',
      'Drive a mechanical stimulus with a solenoid on a schedule and compute a peri-stimulus spike histogram over 200 trials.',
      'Repeat with a second species and build your own amplitude/interval comparison table against the published four.',
    ],
    safety: [
      'Buy spawn from a reputable supplier. Do not collect wild specimens and do not culture wild moulds for a project that keeps a colonised block open on a bench for five days — that is how you aerosolise an unidentified mould.',
      'Wear an N95/P2 respirator when handling dry spawn or any block that has gone mouldy (green, black or pink patches). Fungal spores from contaminated substrate are the dominant inhalation risk here, and Aspergillus in particular is dangerous to immunocompromised people, who should not be in the room.',
      'The electrode needles are sharp: use a sharps container, never recap by hand, and never re-use a needle electrode between blocks. Biological material plus a skin-piercing needle is a sharps-injury protocol, not a hobby.',
      'Power the entire acquisition from a battery inside a grounded enclosure, current-limited to 1 mA. Never connect the recording electronics or the block to anything mains-referenced — a damp ionic substrate is a resistive path to whatever you touch. Never combine wet organic substrates with mains voltage.',
      'Keep the shielded enclosure away from switched-mode supplies, LED drivers and fluorescent ballasts; not just for noise, but because a mains fault in a bare ballast next to a wet block is the electrical hazard in this build.',
    ],
    lessonLinks: ['w2l4', 'w7l13', 'w4l8'],
    sources: [
      { label: 'Adamatzky, "Language of fungi derived from electrical spiking activity" (arXiv:2112.09907) — amplitudes, intervals, electrode method', url: 'https://ar5iv.labs.arxiv.org/html/2112.09907' },
      { label: 'Trichoderma reesei voltage spiking synchronicity with growth transitions (ACS Applied Bio Materials)', url: 'https://pubs.acs.org/aabmcb/article-pdf/doi/10.1021/acsabm.6c01286/67407836/mt-2026-01286r.pdf' },
      { label: 'Utrecht University review — electronic properties of fungi and sensorial/computing circuits in mycelium', url: 'https://dspace.library.uu.nl/bitstream/handle/1874/416274/1_s2.0_S0303264721002288_main.pdf' },
      { label: 'Adamatzky et al., "Mem-fractive Properties of Mushrooms" (IOP Bioinspir. Biomim.)', url: 'https://beta.iopscience.iop.org/article/10.1088/1748-3190/ac2e0c' },
    ],
  },

  {
    id: 'myc-soil-cell',
    title: 'Ìwà-Elémi — Soil Mycelium Battery for a Sensor Node',
    tagline:
      'A carbon felt anode buried in colonised soil, a stainless mesh cathode in the aerobic layer, and a brutally honest power budget measured in microwatts.',
    category: 'mycelium',
    difficulty: 'journeyman',
    buildTime: '1–2 weeks',
    costBand: '$$',
    wakandaIndex: 74,
    diyFeasibility: 72,
    scienceGrounding: 76,
    realitySplit: {
      real:
        'A soil microbial fuel cell produces a genuine DC open-circuit potential of roughly 0.3–0.9 V and a real but small current. Power densities in the literature span roughly 1–200 mW/m² of electrode area depending on design and substrate, and the honest answer for a compost-fed cell is usually at the bottom of that range. It is enough to run a duty-cycled sensor node with a supercapacitor, not enough to run a motor.',
      narrative:
        '"The mycelium powers the robot." The electricity comes from a mixed microbial community — electrogenic bacteria oxidising organic matter at the anode — with fungal mycelium contributing to the decomposition chain and the biofilm structure. Calling it a "mycelium battery" is a useful shorthand, not a mechanism. The project should show that distinction with an abiotic control.',
    },
    summary:
      'Build a terrestrial microbial fuel cell in a compost-and-mycelium substrate, and use it to power a genuinely useful node: an ENS210 or SHT45 temperature/humidity logger that wakes every 60 seconds, takes a reading, and stores it to FRAM. You characterise the cell properly — polarisation curve, internal resistance by the two-resistance method, power density in mW/m², and 30-day degradation with and without nutrient dosing. The deliverable is a real energy budget in joules per day and an honest statement of what it can and cannot power.',
    science:
      'At the anode, electroactive bacteria (Geobacter, Shewanella and others) oxidise acetate and other fermentation products and transfer electrons to the electrode. At the cathode, oxygen is reduced. The thermodynamic ceiling is around 1.1 V; real cells sit far below because of activation overpotential, ohmic loss and — the killer — mass transport limitation in a waterlogged, low-conductivity, low-surface-area environment. Measured soil MFC power densities are commonly in the range of a few to a few tens of mW/m² for simple buried-electrode designs, with reported maxima reaching ~100–200 mW/m² under well-engineered conditions. Mycelium helps by pre-digesting lignocellulose into fermentation products the electrogens can use and by building a conductive, high-surface-area biofilm scaffold, but it does not itself export electrons to an electrode in a way you can rely on. You must run an abiotic control: identical cell, sterile substrate, no inoculum. If the control produces comparable power, your "mycelium battery" is just a soil battery.',
    billOfMaterials: [
      { item: 'Carbon felt electrode, 5 mm, 100 × 100 mm', qty: '2', note: 'Anode; anneal at 400 °C in air for 1 h to improve wettability' },
      { item: '316 stainless steel woven mesh, 100 × 100 mm', qty: '2', note: 'Cathode; keep in the aerobic zone, partially exposed to air' },
      { item: 'Titanium wire, 0.8 mm, + PTFE-insulated copper', qty: '2 m', note: 'Never use bare copper as an electrode — it corrodes and is toxic to the biofilm' },
      { item: 'Garden compost + hemp hurd, colonised with Pleurotus spawn', qty: '10 L', note: 'The "mycelium" half of the cell' },
      { item: 'Sterile control substrate (autoclaved, no inoculum)', qty: '5 L', note: 'Non-negotiable control cell' },
      { item: '10 Ω / 100 Ω / 1 kΩ / 10 kΩ 1% resistors for the polarisation curve', qty: '1 set' },
      { item: 'ADS1115 16-bit ADC + INA226 (current shunt monitor)', qty: '1 set', note: 'Log V and I simultaneously' },
      { item: '1 F / 5.5 V supercapacitor + BQ25570 energy harvester', qty: '1 set', note: 'Cold-start from ~330 mV' },
      { item: 'ESP32-C3 or STM32L0 + SHT45 + FRAM (MB85RC256V)', qty: '1 set', note: 'Deep sleep at ~1–5 µA' },
      { item: 'Airtight HDPE container, 20 L, with a gas vent', qty: '2', note: 'One per cell; keep the cathode in the oxic zone' },
      { item: 'Conformal coating + IP67 cable gland', qty: '1 set', note: 'The cell is wet forever; the electronics must not be' },
    ],
    buildSteps: [
      {
        title: 'Design for the oxic/anoxic split',
        detail:
          'The anode must be buried in anoxic, waterlogged substrate; the cathode must breathe. A layered container — saturated compost at the bottom, a wicking barrier, a moist but aerated layer with the mesh cathode at the top — beats a homogeneous bucket every time.',
      },
      {
        title: 'Prepare and condition the electrodes',
        detail:
          'Anneal carbon felt at 400 °C for 1 hour in air to add surface oxygen groups. Solder or crimp titanium current collectors, and seal the metal/substrate junction with silicone. Condition the cell for 5–10 days under open circuit before measuring anything; fresh cells read nonsense.',
      },
      {
        title: 'Build the abiotic control',
        detail:
          'Assemble a second, identical cell with autoclaved substrate and no mycelium inoculum. Run both in parallel, same temperature, same logging. This control is the entire scientific value of the project.',
      },
      {
        title: 'Measure open-circuit voltage and internal resistance',
        detail:
          'Log Voc daily. Then measure internal resistance two ways: (1) sweep a resistor decade box and fit the linear region of V vs I; (2) the two-resistance method, Rint = (V1 − V2)/I2 − R1 adjust per your circuit. Report both and note the disagreement.',
      },
      {
        title: 'Trace the polarisation and power curve',
        detail:
          'From open circuit down to short circuit in 20 steps, waiting 10 minutes per step for the cell to settle. Compute P = V·I and P/A in mW/m². Cells are hysteretic — sweep down and back up and show both branches.',
      },
      {
        title: 'Run the 30-day degradation test',
        detail:
          'Log power density daily. Around day 10–20 the easily available substrate runs out and power falls. Then dose 5 g of spent coffee grounds or a glucose solution and record whether it recovers. This is the single most informative curve in the project.',
      },
      {
        title: 'Build the energy budget',
        detail:
          'Measure your node: sleeping current, wake current, wake duration, and the total charge per wake. Compute joules per day. Size the supercapacitor so the node survives 48 hours of zero cell output. If the cell cannot cover it, reduce the duty cycle rather than pretending.',
      },
      {
        title: 'Deploy outdoors for two weeks',
        detail:
          'Put the cell in a shaded outdoor spot with the logger attached and no external power. The number of successful wake cycles over 14 days with no battery change is the headline result.',
      },
    ],
    code: {
      language: 'cpp',
      snippet: [
        '// Duty-cycled soil-MFC node: wake, measure cell V/I, store to FRAM, sleep.',
        '// Budget example (measure your own): 4 mA for 600 ms = 2.4 mAs = 0.67 uAh per wake.',
        '// At 1 wake/min that is 40 uAh/hour = 0.96 mAh/day. A 1 F supercap at 3.3 V holds',
        '// ~4.5 J, which covers ~48 h of this duty cycle with zero input - IF the harvester',
        '// can cold-start. Log the real numbers; do not trust this comment.',
        '#include <Adafruit_ADS1X15.h>',
        'Adafruit_ADS1115 ads;',
        '',
        'const float R_SHUNT = 10.0f;          // ohms, in series with the cell',
        'const float A_ELECTRODE = 0.01f;      // m^2, 100 x 100 mm felt',
        '',
        'void measureAndLog() {',
        '  float v_cell = ads.readADC_Differential_0_1() * 0.000125f;  // +/-0.256 V FSR',
        '  float v_shunt = ads.readADC_Differential_2_3() * 0.000125f;',
        '  float i = v_shunt / R_SHUNT;',
        '  float p = v_cell * i;                                  // W',
        '  float pd = p / A_ELECTRODE * 1000.0f;                  // mW/m^2',
        '  Serial.print(v_cell, 4); Serial.print(",");',
        '  Serial.print(i * 1e6f, 2); Serial.print(",");          // uA',
        '  Serial.println(pd, 3);                                // mW/m^2',
        '}',
        '',
        'void loop() {',
        '  measureAndLog();',
        '  esp_sleep_enable_timer_wakeup(60ULL * 1000000ULL);',
        '  esp_deep_sleep_start();      // ~5 uA asleep on a good board; verify with a uCurrent',
        '}',
      ].join('\n'),
      note:
        'Put a resistor in series with the cell and measure the voltage across it — measuring current directly with a multimeter in ammeter mode short-circuits the cell and destroys hours of conditioning.',
    },
    metrics: [
      { label: 'open-circuit voltage', value: '0.3–0.9 V (measured; thermodynamic ceiling ~1.1 V)' },
      { label: 'internal resistance', value: 'expect 100 Ω–10 kΩ in soil substrate (measured, two methods)' },
      { label: 'power density at matched load', value: 'a few to tens of mW/m² typical, up to ~100–200 mW/m² best case (measured; literature range ~1–200 mW/m²)' },
      { label: 'abiotic control power density', value: 'report as a fraction of the live cell — if >50%, your mechanism claim is wrong (measured)' },
      { label: 'node duty cycle sustained for 14 days', value: 'wakes/day with no battery change (measured)' },
      { label: 'power decay over 30 days', value: '% of day-3 power at day 30, plus recovery after a substrate dose (measured)' },
    ],
    stretchGoals: [
      'Build a stacked array of 4 cells in series and characterise the voltage/current trade-off and the reverse-cell problem.',
      'Try a laccase-producing white-rot fungus on the cathode (published approach for azo-dye cathodes) and compare to a plain mesh.',
      'Replace the supercapacitor with a 10 mF film cap and see how low you can push energy per wake with a comparators-only wake circuit.',
      'Run a 6-month deployment and correlate power with soil temperature and rainfall.',
    ],
    safety: [
      'Buy spawn from a reputable supplier; never culture wild moulds, and never use spawn that has gone green, black or pink. A contaminated compost cell is an aerosol generator.',
      'Wear an N95/P2 respirator and gloves whenever you turn or open the substrate, and never run a soil MFC in a living space or bedroom. Wet compost plus a warm room is a mould farm, and Aspergillus exposure is a specific hazard for immunocompromised household members.',
      'Do not grow food crops in the substrate used for the fuel cell, and do not use the spent substrate on edible plants — you cannot guarantee what has colonised it.',
      'The cell is a permanently wet electrochemical device: keep all electronics in a separate IP67 enclosure with cable glands and conformal coating, power the node from the cell/supercapacitor only, and never connect it to a mains-referenced supply. Never put wet organic substrate in contact with mains wiring.',
      'Stainless mesh and carbon felt edges are sharp; cut them with tin snips and deburr. Titanium and stainless swarf is a cut and eye hazard.',
    ],
    lessonLinks: ['w7l13', 'w8l16', 'w1l1'],
    sources: [
      { label: 'Marcano et al., "Soil Power? Can Microbial Fuel Cells Power Non-Trivial Sensors?" (ACM) — real sensor-node power budgets', url: 'https://patpannuto.com/pubs/marcano2021einkbiobattery.pdf' },
      { label: 'MDPI Energies 2025 — soil microbial fuel cells: performance and application potential', url: 'https://mdpi-res.com/d_attachment/energies/energies-18-00970/article_deploy/energies-18-00970.pdf' },
      { label: 'RSC Sustainable Energy & Fuels 2023 — biofilm growth on anodes in soil microbial fuel cells', url: 'https://pubs.rsc.org/aa/content/articlepdf/2023/su/d2su00079b' },
      { label: 'Applied Energy — laccase-producing white-rot fungus on a cathode in an MFC', url: 'https://www.sciencedirect.com/science/article/abs/pii/S0306261916318086' },
    ],
  },

  {
    id: 'myc-air-payload',
    title: 'Afẹ́fẹ́ Watch — Mycelium VOC/CO₂ Biosensor Drone Payload',
    tagline:
      'Fly a living mat into a plume and watch its respiration change. Then find out how much of the "response" was just the propeller cooling it.',
    category: 'mycelium',
    difficulty: 'master',
    buildTime: '4–6 weeks',
    costBand: '$$$',
    wakandaIndex: 88,
    diyFeasibility: 42,
    scienceGrounding: 66,
    realitySplit: {
      real:
        'Fungal respiration rate — measured as CO₂ production and O₂ consumption — genuinely responds to the composition of the surrounding headspace, including volatile organic compounds and toxicants. A small, sealed, flow-through chamber with a CO₂ sensor and a differential-pressure-tolerant pump is a real instrument, and it can be flown.',
      narrative:
        '"A drone that smells with fungus." The mycelium is a slow, integrative, non-specific biological transducer with a response time of minutes to hours. It is not an electronic nose, it cannot identify compounds, and a drone in flight is a hostile environment for a living sensor. The honest framing is a slow biosensor that happens to be airborne.',
    },
    summary:
      'A removable payload pod for a small multirotor: a sealed 200 mL chamber containing a living mycelium mat, a miniature diaphragm pump pulling air through it at a controlled 50–200 mL/min, and an SCD41 photoacoustic CO₂ sensor plus an SGP41 VOC index sensor measuring the headspace. The drone flies a lawnmower pattern over a test grid with a known VOC source in one cell, and you compare the airborne mat response against a stationary reference mat and against the electronic sensors. The core engineering is not the fungus — it is vibration isolation, temperature/CO₂ baseline control, and a calibration protocol.',
    science:
      'Fungal respiration is a metabolic rate: substrate oxidation produces CO₂ at a rate that depends on temperature, moisture and substrate availability, and it is perturbed by inhibitors and by the carbon source in the headspace. A mat at 25 °C in a sealed chamber will drive headspace CO₂ measurably above ambient within 10–40 minutes (modelled from typical substrate respiration rates; measure it). A toxic or stimulatory VOC shifts that rate. The confounders are severe and they are the whole project: temperature changes respiration exponentially (roughly a doubling per 10 °C over the mesophilic range), the pump flow rate changes the washout time constant, and propeller downwash changes both. The SCD41 has a specified accuracy of ±(50 ppm + 5%) — that sets your real detection limit against a background that swings by hundreds of ppm. The reference sensor is not optional.',
    billOfMaterials: [
      { item: 'Living mycelium mat, 10 × 10 × 2 cm, on hemp hurd', qty: '3', note: 'Trametes versicolor or Pleurotus; let them stabilise 7 days post-colonisation' },
      { item: 'SCD41 photoacoustic CO₂ sensor module', qty: '2', note: 'One in the chamber, one measuring outside air as reference' },
      { item: 'SGP41 VOC index + NOx sensor', qty: '2', note: 'Reference electronic nose; cross-calibration partner' },
      { item: 'SHT45 temperature/humidity sensor', qty: '2', note: 'Inside and outside the chamber' },
      { item: 'Micro diaphragm pump, 12 V, 100–300 mL/min with PWM driver', qty: '1', note: 'Plus a mass flow sensor if budget allows' },
      { item: 'Sealed polycarbonate chamber, 200 mL, with a gas-tight lid and three ports', qty: '1', note: 'Inlet, outlet, sensor feed-through' },
      { item: 'Silicone vibration isolators (4 mm, 8 pieces) + 3D-printed gimbal mount', qty: '1 set', note: 'Keeps mat agitation and air sloshing down' },
      { item: 'ESP32-S3 with microSD, logging at 1 Hz', qty: '1 set', note: 'Logs all four sensors plus IMU' },
      { item: 'ICM-42688-P IMU', qty: '1', note: 'Correlate sensor noise with airframe vibration' },
      { item: 'VOC source set: isopropanol, limonene, acetic acid (sealed vials + syringe)', qty: '1 set', note: 'Known-concentration challenges' },
      { item: '450 mm quadcopter with a 6S 5000 mAh pack and 1.5 kg payload capacity', qty: '1', note: 'Payload must be under 25% of AUW for stable tune' },
      { item: 'Permeation-tube or diffusion-tube calibration standard', qty: '1', note: 'For a real ppm calibration of the CO₂ channel' },
    ],
    buildSteps: [
      {
        title: 'Characterise the mat on the bench first',
        detail:
          'Before it flies, put the chamber on a bench and measure CO₂ accumulation rate at 20, 25 and 30 °C, at two moisture levels. You need the temperature coefficient and the moisture dependence before any field data means anything.',
      },
      {
        title: 'Build the flow-through head',
        detail:
          'Pull air through the chamber, not push. Negative pressure keeps VOC-laden air from leaking out around the seals and keeps the sensors at ambient pressure. Set 100 mL/min and measure the chamber washout time constant with a step change in CO₂.',
      },
      {
        title: 'Establish the detection limit against the reference',
        detail:
          'Run a blank: chamber with sterile substrate, no mycelium, same flow, same sensors. Log for 6 hours. Your detection limit is three times the standard deviation of that blank, expressed in µL CO₂/min.',
      },
      {
        title: 'Run the VOC challenge series',
        detail:
          'Inject 1, 10 and 100 µL of isopropanol into the inlet stream through a septum. Record the respiration response for 2 hours. Do the same with limonene and acetic acid. Plot dose–response for each. Some will do nothing — write that down.',
      },
      {
        title: 'Isolate the pod from the airframe',
        detail:
          'Mount the pod on silicone isolators and add a gimbal. Measure IMU vibration with the motors at hover RPM, pod on and pod off. If vibration correlates with CO₂ noise, add mass damping before flying.',
      },
      {
        title: 'Ground-truth the flight',
        detail:
          'Set up a 6 × 6 m grid with a 20 mL/min evaporating VOC source in one cell. Fly a 20 m lawnmower at 2 m altitude, 2 m/s, 60 m per pass. Simultaneously log the SGP41 and a stationary reference mat.',
      },
      {
        title: 'Compare and report honestly',
        detail:
          'For each grid cell, plot the airborne mat signal, the reference mat signal, the VOC index and the CO₂ reference. Compute the correlation. If the airborne sensor is not distinguishable from downwash and thermal effects, that is the result: state it, with the data.',
      },
      {
        title: 'Iterate the flow and residence time',
        detail:
          'If the response is too slow, raise the flow; if it is too noisy, lower it. There is a real optimum. Report it as a design parameter — it is the most transferable output of the project.',
      },
    ],
    code: {
      language: 'cpp',
      snippet: [
        '// Payload logger: SCD41 x2, SGP41, SHT45 x2, ICM-42688, 1 Hz to microSD.',
        '// The important part is the derived respiration rate, not the raw ppm.',
        '#include <SensirionI2CScd4x.h>',
        '#include <SensirionI2CSgp41.h>',
        '',
        'SensirionI2CScd4x co2In, co2Ref;',
        '',
        'struct Sample { float t_in, rh_in, co2_in, co2_ref, voc, ax, ay, az; };',
        '',
        '// Respiration rate d(CO2)/dt in the chamber gives the metabolic signal.',
        '// With flow Q (mL/min) and chamber volume V (mL), the washout constant is tau = V/Q.',
        '// At Q = 100 mL/min, V = 200 mL -> tau = 2 min. Any biology slower than that',
        '// shows up as a real offset; anything faster is filtered out. Choose Q for the',
        '// respiration timescale you care about, not for the sensor.',
        'float respirationRate(float co2Now, float co2Prev, float dt_s, float V_mL, float Q_mLmin) {',
        '  float tau = V_mL / (Q_mLmin / 60.0f);            // s',
        '  // first-order chamber balance: V*dC/dt = prod - Q*(C - C_in)',
        '  float prod = V_mL * (co2Now - co2Prev) / dt_s + (Q_mLmin / 60.0f) * (co2Now - co2Prev);',
        '  (void)tau;',
        '  return prod;                                      // uL CO2 per minute (approx)',
        '}',
      ].join('\n'),
      note:
        'Record the reference CO₂ sensor in free air on the same airframe. Without it you cannot separate a biological response from a change in ambient CO₂ as the drone flies over vegetation.',
    },
    metrics: [
      { label: 'chamber respiration rate, sterile control', value: 'blank mean ± σ in µL CO₂/min (measured — sets the detection limit)' },
      { label: 'chamber respiration rate, live mat at 25 °C', value: 'expect several times the blank (measured)' },
      { label: 'temperature coefficient of respiration', value: 'Q10 estimate from 20/25/30 °C runs (measured; expect ~2 over the mesophilic range)' },
      { label: 'VOC dose–response slope', value: 'Δrespiration per µL of isopropanol (measured)' },
      { label: 'washout time constant', value: 'V/Q seconds; 120 s at 200 mL and 100 mL/min (modelled, verify with a step test)' },
      { label: 'airborne vs stationary signal correlation', value: "Pearson r on the flight grid (measured — report it even if it's 0.1)" },
    ],
    stretchGoals: [
      'Add a second chamber with a different species and look for differential selectivity between them.',
      'Fly an adaptive path that steers up the measured gradient with a simple chemotaxis controller.',
      'Replace the SCD41 with an NDIR CO₂ sensor cross-checked against the photoacoustic one and quantify the disagreement.',
      'Repeat the grid at 1 m and 4 m altitude to measure the effective plume detection envelope.',
    ],
    safety: [
      'Buy spawn from a reputable supplier rather than culturing wild moulds, and inspect the mat before every flight. A contaminated mat in a closed pod that is opened on a bench is a direct spore exposure.',
      'Wear an N95/P2 when handling dry spawn or mouldy substrate and when cleaning the pod. Anyone immunocompromised should not handle the mycelium payload at all — Aspergillus and other mould spores are a serious risk for them, and a drone pod is a confined aerosol environment.',
      'Do not grow moulds on food you intend to eat, and never use a kitchen surface or fridge for substrate work. Keep all substrate and spawn work in a dedicated, ventilated area.',
      'LiPo flight packs are the dominant fire hazard in this build: charge on a fireproof bag on a non-flammable surface, never leave charging unattended, inspect for puffing after every hard landing, and store at 3.8 V/cell in a metal ammo box away from the mycelium chamber.',
      'Never place the wet chamber in the same compartment as the flight electronics or the pack — a condensation event plus a 6S pack is a short-circuit fire. Conformal-coat the boards, use an IP54 pod, keep the pack in a separate bay, and never charge the pack near the mycelium chamber. Do not fly a biological payload over people or water without confirming local rules; some jurisdictions regulate the release of viable biological material from aircraft. Deactivate the mat (dry it) before disposal unless you can confirm the species is non-pathogenic and locally non-invasive.',
    ],
    lessonLinks: ['w6l12', 'w2l4', 'w8l15'],
    sources: [
      { label: 'Frontiers in Fungal Biology 2025 — biohybrid robots, living mycelium materials and biosensing', url: 'https://www.frontiersin.org/journals/fungal-biology/articles/10.3389/ffunb.2025.1739847/full' },
      { label: 'MDPI Biosensors 2026 — filamentous fungi for (bio)sensing across domains', url: 'https://www.mdpi.com/2079-6374/16/2/131/pdf' },
      { label: 'IEEE — MVOC index for detecting microbial volatile organic compounds from moulds on building materials', url: 'https://www.infona.pl/resource/bwmeta1.element.ieee-art-000007968854' },
      { label: 'Adamatzky et al. — stimulation of fungal electrical activity by mechanical, chemical and optical means (cited in arXiv:2112.09907)', url: 'https://ar5iv.labs.arxiv.org/html/2112.09907' },
    ],
  },

  {
    id: 'myc-self-heal-gripper',
    title: 'Ìmúsìn — Self-Healing Mycelium Soft Gripper',
    tagline:
      'Soft pneumatic fingers wrapped in living mycelium that closes its own small tears overnight. Ten days later, measure exactly how much strength came back.',
    category: 'mycelium',
    difficulty: 'master',
    buildTime: '5–8 weeks',
    costBand: '$$$',
    wakandaIndex: 90,
    diyFeasibility: 48,
    scienceGrounding: 72,
    realitySplit: {
      real:
        'Engineered living materials with a mycelium component do re-establish mechanical continuity across a cut or tear, given moisture, nutrients and time — this is the actual demonstrated result in the literature on mycelium-based living materials. The recovery is partial and slow (days), and you can measure it with a tensile rig.',
      narrative:
        '"A robot that heals like a living creature." The healing is fungal regrowth across a gap in a nutrient-rich matrix, not a wound response. It happens over days at room temperature and it stops the moment the material dries out. Any tear in the pressurised bladder beneath the mycelium does not heal at all — the fungus does not patch silicone.',
    },
    summary:
      'A three-finger soft pneumatic gripper: silicone bellows bladders for actuation, each wrapped in a 3–5 mm living mycelium composite sleeve grown in situ. You deliberately cut the sleeves to controlled depths, incubate them in a humid chamber for 3, 7 and 14 days, and measure recovery of tensile strength on a strip rig and grip force on the assembled gripper. You compare against a dead (heat-treated) sleeve control. The honest deliverable is a healing-versus-time curve with error bars and a clear statement of what does not heal.',
    science:
      'Mycelium-based living materials have been shown to restore a significant fraction of tensile strength across a cut after re-incubation, with the extent depending on the matrix, the nutrient availability and the incubation time — published work on mycelium living materials reports partial strength recovery in the days-to-weeks range, and the mechanism is hyphal regrowth and re-fusion across the interface rather than any kind of scar tissue. New hyphae grow into the gap and fuse with the existing network, which is why a fresh cut with a rough surface heals better than a smooth one, and why moisture is non-negotiable. Your measurement plan must separate two things: the healing of the mycelium sleeve itself, and the grip force of the gripper. Grip force depends on the bladder pressure, the sleeve stiffness and the finger kinematics, so a healed sleeve that is also stiffer can reduce grip force even as its tensile strength rises. Report both.',
    billOfMaterials: [
      { item: 'Silicone for soft pneumatic bellows: Smooth-On Dragon Skin 30 or Ecoflex 00-30', qty: '1 kg', note: 'Pneumatic bladders; cast in a 3D-printed mould' },
      { item: '2-part platinum-cure silicone + mould release + vacuum degassing chamber', qty: '1 set', note: 'Degas or you get pinholes that burst at 100 kPa' },
      { item: 'Mycelium composite sleeve mix: hemp hurd + Pleurotus spawn', qty: '3 L', note: 'Grown as a 3–5 mm sheet in a flat tray' },
      { item: 'Sterile dead-sleeve control (autoclaved composite)', qty: '1 set', note: 'Identical geometry, no living organism' },
      { item: 'Humid incubator: monotub + 90% RH controller + 25 °C thermostat', qty: '1', note: 'Healing happens at high humidity' },
      { item: 'Controlled cutting jig: 0.5 / 1.0 / 2.0 mm depth blade stop', qty: '1 set', note: 'Standardised injury is the entire method' },
      { item: 'Tensile test rig: 2 kg load cell + HX711 + stepper-driven lead screw', qty: '1 set', note: 'ASTM D638-style dogbones, 10 mm/min' },
      { item: 'Differential pressure sensor (MPX5010DP) + precision regulator 0–100 kPa', qty: '1 set', note: 'Grip force vs bladder pressure' },
      { item: 'Pinch-force sensor (Tekscan FlexiForce A201) + INA333', qty: '3', note: 'Direct contact force at the fingertips' },
      { item: 'ESP32 + solenoid valves (SMC VQ110) for PWM pressure control', qty: '1 set', note: 'Closed-loop grip force' },
      { item: 'N95/P2 respirator, nitrile gloves, lab coat, HEPA bench filter', qty: '1 set', note: 'Mandatory for every dry handling step' },
    ],
    buildSteps: [
      {
        title: 'Grow the sleeve, not the finger',
        detail:
          'Cast or grow a 3–5 mm flat composite sheet in a tray at 25 °C for 10–14 days. When the sheet is fully white, press it lightly to a consistent thickness and dry it to a stable mass. Grown sheets have variable thickness — reject anything outside ±15% and record the thickness of every specimen.',
      },
      {
        title: 'Cast the pneumatic bladders',
        detail:
          'Mould three bellows fingers with a single air channel each. Vacuum-degas the silicone before curing, cure per datasheet, and pressure-test each finger to 150 kPa submerged in water before it goes near the gripper. A pinhole that only leaks at 80 kPa will fail mid-grip.',
      },
      {
        title: 'Wrap and bond the sleeves',
        detail:
          'Bond the sleeve to the finger only at the base and tip so the mid-length can slide. If you glue it along its length, the sleeve takes all the bending strain and tears at the bond line within a few cycles — you have built a test rig for the bond, not the material.',
      },
      {
        title: 'Inflict standardised injuries',
        detail:
          'Use the depth-stopped blade to cut each sleeve transversely 50% and 90% through its thickness. Cut three specimens per condition. Photograph every cut under a ruler and quantify the gap width; a "self-healing" claim without a measured initial gap is worthless.',
      },
      {
        title: 'Heal in the humid chamber',
        detail:
          'Incubate cut sleeves at 25 °C and >90% RH for 3, 7 and 14 days. Mist with sterile water every 48 hours; do not flood. Run the identical schedule on the dead-sleeve control in a parallel chamber.',
      },
      {
        title: 'Measure tensile recovery',
        detail:
          'Test uncut, freshly cut, and healed specimens in tension at 10 mm/min to failure. Compute recovered strength as (σ_healed − σ_cut) / (σ_uncut − σ_cut) × 100%. Report mean ± σ across three specimens; single-specimen mycelium data is noise.',
      },
      {
        title: 'Measure grip force, not just strength',
        detail:
          'Assemble the gripper with healed sleeves and measure pinch force at the fingertips versus bladder pressure from 0 to 80 kPa. Compare against fresh sleeves and dead controls. This is where you find out that a stiffer healed sleeve holds a tomato differently.',
      },
      {
        title: 'Cycle and re-heal',
        detail:
          'Run 500 open/close cycles at 60 kPa and re-measure. Then cut the same specimen again and heal it a second time. Does healing capacity degrade with age? That is the most interesting question in the build.',
      },
    ],
    code: {
      language: 'cpp',
      snippet: [
        '// Closed-loop grip force: PWM the solenoid valve, read FlexiForce through INA333.',
        '// FlexiForce is a variable resistance; use it in a divider with a fixed 10k.',
        'const int PWM_PIN = 18, FF_PIN = 34;',
        'const float TARGET_N = 1.5f;              // never bruise the fruit: keep it low',
        'const float KP = 0.08f;',
        '',
        'float readForceN() {',
        '  int raw = analogRead(FF_PIN);                 // 12-bit, 0-4095',
        '  float v = raw * 3.3f / 4095.0f;',
        '  float r_ff = 10000.0f * (3.3f - v) / v;       // divider with 10k to 3V3',
        '  // Calibrate slope/intercept with known weights; FlexiForce is far from linear.',
        '  const float SLOPE = -0.00021f, INTERCEPT = 6.4f;   // ohms -> newtons, MEASURE THIS',
        '  return SLOPE * r_ff + INTERCEPT;',
        '}',
        '',
        'void loop() {',
        '  static float integral = 0.0f;',
        '  float f = readForceN();',
        '  float err = TARGET_N - f;',
        '  integral += err * 0.02f;',
        '  integral = constrain(integral, 0.0f, 1.0f);',
        '  float duty = constrain(KP * err + integral, 0.0f, 1.0f);',
        '  ledcWrite(0, (int)(duty * 255));',
        '  Serial.print(f, 3); Serial.print(","); Serial.println(duty, 3);',
        '  delay(20);',
        '}',
      ].join('\n'),
      note:
        'Force-control a soft gripper with the sleeve pressure ramped from zero, never with a bang-bang valve. The peak pressure transient on a bang-bang valve is what bruises produce, not the steady-state force.',
    },
    metrics: [
      { label: 'tensile strength recovery at 14 days, 50% cut', value: 'target >30% of uncut strength (measured; report yours, it may be lower)' },
      { label: 'tensile strength recovery at 14 days, 90% cut; dead-sleeve control', value: 'expect much lower or zero, and ~0% for the control; if the control heals, your measurement is wrong (measured)' },
      { label: 'healing rate', value: '% strength recovered per day over 3/7/14 days (measured)' },
      { label: 'grip force at 60 kPa, fresh vs healed', value: 'N, with 3-specimen spread (measured)' },
      { label: 'cycles to sleeve failure at 60 kPa', value: 'open/close cycles (measured)' },
      { label: 'healing window before desiccation stops it', value: 'hours at <60% RH before recovery drops off (measured)' },
    ],
    stretchGoals: [
      'Embed a sacrificial nutrient thread (hemp twine soaked in malt extract) along the cut line and measure whether it accelerates healing.',
      'Compare a rough cut (scalpel tear) against a smooth cut and quantify the surface-area effect.',
      'Add an in-sleeve impedance sensor that reports healing progress electrically, using the living-skin method.',
      'Try healing under load — a spring holding the cut open — to see whether mechanical tension suppresses or guides hyphal bridging.',
    ],
    safety: [
      'Buy spawn from a reputable supplier. Do not culture wild moulds, and do not attempt to "heal" a sleeve with visible green, black or pink contamination — discard it sealed.',
      'Wear an N95/P2 respirator, gloves and eye protection for every cutting, trimming and tensile-test step. Dry mycelium composite fractures into spore- and dust-laden fragments and the tensile rig throws them.',
      'Exclude immunocompromised people from the workspace at all times. Repeated handling of sporulating fungal material over weeks is a materially higher exposure than a single mycology project, and Aspergillus is a specific invasive risk for that group.',
      'The pneumatic system stores energy: a burst silicone bladder at 150 kPa can eject fragments at eye speed. Pressure-test behind a polycarbonate shield, wear safety glasses, and put a 200 kPa mechanical relief valve plus a software pressure ceiling in the loop. Never run the gripper above the bladder manufacturer’s rating.',
      'Keep the humid healing chamber and its sensors on an isolated ≤12 V supply with conformal coating, and never combine that wet chamber with mains voltage. Do not put a mains-powered humidifier inside a sealed plastic tub without a thermal cut-out — those units are a documented fire and scald risk when they run dry.',
    ],
    lessonLinks: ['w3l5', 'w7l14', 'w5l10'],
    sources: [
      { label: 'Gantenbein et al. (ETH Zürich) — self-healing behaviour of mycelium-based living materials, tensile tests', url: 'https://www.research-collection.ethz.ch/bitstream/handle/20.500.11850/591873/Gantenbein_20220930.pdf' },
      { label: 'Frontiers in Fungal Biology 2025 — biohybrid robots and living mycelium materials', url: 'https://www.frontiersin.org/journals/fungal-biology/articles/10.3389/ffunb.2025.1739847/full' },
      { label: 'Advanced Engineering Materials — versatile biosensing abilities of living mycelium materials (moisture loss as a healing limiter)', url: 'https://advanced.onlinelibrary.wiley.com/doi/pdf/10.1002/adem.202501759' },
      { label: 'Elsacker et al., Biomimetics 2022 — pure mycelium biofilm tensile strengths, 0.7–1.1 MPa', url: 'https://cris.vub.be/ws/files/85051094/Elsacker_et_al_2022_Biomimetics.pdf' },
    ],
  },

  {
    id: 'myc-compostbot',
    title: 'CompostBot — Drive-Over Inoculator with a Colonisation CNN',
    tagline:
      'A field rover that drives over crop residue, injects spawn slurry, and then watches its own work through a thermal camera and a small CNN.',
    category: 'mycelium',
    difficulty: 'journeyman',
    buildTime: '6–8 weeks',
    costBand: '$$$',
    wakandaIndex: 82,
    diyFeasibility: 62,
    scienceGrounding: 62,
    realitySplit: {
      real:
        'Inoculating crop residue with spawn and tracking colonisation through temperature, humidity and CO₂ is standard mushroom-cultivation practice wrapped in a robot. The colonisation stages are identifiable from sensor data, and a small CNN on thermal imagery can classify them.',
      narrative:
        '"An autonomous farm robot that turns waste into a mycelium network." The agronomy is real but slow — colonisation runs over weeks, and the robot can only place and monitor inoculum, not accelerate fungal biology. The CNN classifies; it does not understand.',
    },
    summary:
      'A 4WD rover with a hopper, a peristaltic dosing pump and an injector tine array that lays spawn slurry into a windrow of maize stover or straw at 15–25% spawn by wet mass. On the return pass it carries a thermal camera (MLX90640 or a Lepton), a CO₂ sensor in a hood, and a humidity/temperature probe, and it classifies each 1 m segment of the windrow into one of five colonisation stages using a small CNN trained on your own labelled data. You also validate the classifier against destructive sampling — digging up segments and scoring them by hand.',
    science:
      'Mycelium colonisation is exothermic and hygric: as hyphae grow through lignocellulose they release metabolic heat, so a colonising windrow runs measurably warmer than an uninoculated control (typically 1–5 °C above ambient during active growth, more during the thermophilic phase of a compost-dominated pile). Colonisation is a race against competitors: a 15–25% spawn rate, a substrate moisture of 60–75%, and a substrate temperature held between about 20 and 28 °C give the inoculated fungus the advantage. The remote sensing problem is that surface temperature is dominated by solar gain, wind and evaporation, so the biologically interesting signal is the difference between the inoculated windrow and an adjacent uninoculated control, measured at the same time. That differential is the model input, not raw temperature. Five stages — inert, inoculation, spreading (patchy white), full colonisation (uniform white), and fruiting/contaminated — are visually distinguishable and have different thermal and CO₂ signatures.',
    billOfMaterials: [
      { item: '4WD aluminium chassis with 100 mm wheels and 4× 12 V 30 rpm gearmotors', qty: '1', note: 'Needs ground clearance for a crop windrow' },
      { item: 'BTS7960 or Cytron MDD10A motor drivers + ESP32', qty: '2 + 1', note: 'Differential drive with encoders' },
      { item: 'Peristaltic dosing pump, 12 V, 30–100 mL/min', qty: '1', note: 'Spawn slurry is abrasive; peristaltic avoids clogging' },
      { item: 'Hopper, 20 L, with a slow agitator (12 V geared motor)', qty: '1', note: 'Spawn + water + 1% molasses slurry' },
      { item: 'Injector tine array: 5 spring-steel tines at 100 mm spacing', qty: '1', note: 'Drops slurry into the top 50 mm' },
      { item: 'MLX90640 32×24 thermal array or FLIR Lepton 3.5', qty: '1', note: 'Lepton is 160×120 and worth the extra cost' },
      { item: 'SCD41 CO₂ + SHT45 in a small sampling hood with a 12 V fan', qty: '1 set', note: 'Hood keeps the sampling volume controlled' },
      { item: 'RTK or at least a u-blox NEO-M9N GPS + wheel odometry fusion', qty: '1 set', note: 'You must relocate each 1 m segment for resampling' },
      { item: 'Thermocouple probes (MAX31855, type K) for ground truth', qty: '8', note: 'Insert 100 mm into the windrow' },
      { item: 'Reference: hand-held IR thermometer and a soil moisture probe', qty: '1 each', note: 'Calibration and ground truth' },
      { item: 'GPU or a laptop with a modest CUDA GPU for CNN training', qty: '1', note: 'MobileNetV3-small or a 4-layer CNN is enough' },
      { item: 'Spent mushroom substrate + Pleurotus spawn, 50 kg', qty: '1', note: 'Buy spawn from a commercial supplier' },
    ],
    buildSteps: [
      {
        title: 'Define the five stages and make them measurable by hand',
        detail:
          'Write an explicit scoring rubric with photographs: 0 inert, 1 inoculated (substrate visible, no white), 2 spreading (<50% white coverage), 3 colonised (>50% uniform white), 4 fruiting or contaminated. Ambiguous rubrics produce an unlearnable dataset — spend a day on this before writing any code.',
      },
      {
        title: 'Build the inoculation pass',
        detail:
          'Lay a windrow of maize stover 300 mm high. Mix spawn slurry at 15–25% wet mass, dose at 200 mL/m with the peristaltic pump, and inject to 50 mm depth. Record position and dose per metre in a CSV — that is your label alignment.',
      },
      {
        title: 'Build the sensing pass',
        detail:
          'Thermal camera at 400 mm above the windrow, CO₂ hood sampled for 5 seconds per metre, humidity probe every 2 m. Log everything with GPS timestamp. Sample an uninoculated control strip immediately adjacent, every time.',
      },
      {
        title: 'Build the ground-truth dataset',
        detail:
          'At days 0, 3, 7, 14, 21 and 28, walk the transect and score 100 segments by hand with photos. Cut three segments open per stage and photograph the interior. You need at least 500 labelled segments for a CNN to be worth training; if you only have 100, use a decision tree on the differential temperature and be honest about why.',
      },
      {
        title: 'Engineer the features',
        detail:
          'Feed the CNN a 32×24 thermal patch normalised by the control-strip temperature, plus the CO₂ differential, the elapsed time and the cumulative degree-days. Degree-days matter more than any single reading — colonisation is a time × temperature process.',
      },
      {
        title: 'Train and validate with a spatial split',
        detail:
          'Split train/test by windrow section, not randomly by sample. Random splits leak spatially correlated data and give you a beautiful, useless accuracy. Report a confusion matrix and per-class F1.',
      },
      {
        title: 'Re-run the transect autonomously',
        detail:
          'Have the rover re-drive the same waypoints every three days for four weeks, logging predicted stage per segment. Compare the predicted progression timeline against the hand-scored timeline.',
      },
      {
        title: 'Report the agronomy too',
        detail:
          'Which spawn rate gave the fastest full colonisation? Which segments got contaminated? The robot is the vehicle; the agronomic result is the point.',
      },
    ],
    code: {
      language: 'python',
      snippet: [
        '"""Stage classifier on differential thermal + CO2 + degree-days features.',
        '',
        'Start here, not with a CNN. If a gradient-boosted tree cannot separate the',
        'five stages, a CNN will only overfit your 500 samples.',
        '"""',
        'import numpy as np',
        'from sklearn.ensemble import GradientBoostingClassifier',
        'from sklearn.model_selection import GroupKFold',
        'from sklearn.metrics import confusion_matrix, classification_report',
        '',
        'STAGES = ["inert", "inoculated", "spreading", "colonised", "fruiting_or_contam"]',
        '',
        'def features(seg):',
        '    """seg: one windrow segment with t_ambient, t_sub, co2, co2_ctrl, days, t_hist."""',
        '    dt = seg["t_sub"] - seg["t_ambient"]                 # differential temperature, C',
        '    dco2 = seg["co2"] - seg["co2_ctrl"]                 # differential CO2, ppm',
        '    # degree-days above a 10 C biological baseline, capped at 30 C',
        '    t_eff = np.clip(seg["t_hist"] - 10.0, 0.0, 20.0)',
        '    dd = float(np.sum(t_eff)) / 24.0',
        '    return [dt, dt ** 2, dco2, seg["days"], dd, seg["dose_ml_per_m"], seg["moisture_pct"]]',
        '',
        '# Group by windrow section so spatially correlated samples never straddle the split.',
        'X = np.array([features(s) for s in SEGMENTS])          # noqa: F821',
        'y = np.array([s["stage"] for s in SEGMENTS])            # noqa: F821',
        'groups = np.array([s["section"] for s in SEGMENTS])     # noqa: F821',
        '',
        'gkf = GroupKFold(n_splits=5)',
        'for tr, te in gkf.split(X, y, groups):',
        '    clf = GradientBoostingClassifier(n_estimators=200, max_depth=3, random_state=0)',
        '    clf.fit(X[tr], y[tr])',
        '    print(confusion_matrix(y[te], clf.predict(X[te])))',
        '    print(classification_report(y[te], clf.predict(X[te]), target_names=STAGES, zero_division=0))',
      ].join('\n'),
      note:
        'A random train/test split on spatially correlated windrow data will report 90%+ accuracy and mean nothing. Always split by physical section.',
    },
    metrics: [
      { label: 'inoculation rate accuracy', value: 'mL spawn slurry per metre of windrow, target 200 ± 20 (measured)' },
      { label: 'colonisation time to stage 3', value: 'days at 20–28 °C substrate; typical 14–28 days (measured, your climate)' },
      { label: 'differential substrate temperature at peak growth', value: '1–5 °C above an uninoculated control (measured)' },
      { label: 'classifier macro-F1 on a spatial split', value: 'target >0.7 with 5 classes (measured)' },
      { label: 'contamination rate at day 28', value: '% of segments scored stage 4-contaminated (measured)' },
      { label: 'inoculated vs control yield of fruit bodies', value: 'g per metre of windrow at 6 weeks, if you go that far (measured)' },
    ],
    stretchGoals: [
      'Close the loop: let the rover re-dose segments that are falling behind the predicted colonisation curve.',
      'Add a multispectral channel (red/IR) and test whether it adds anything over thermal.',
      'Run a full season and correlate colonisation speed with local rainfall and degree-days to build a predictive model.',
      'Add a small on-board NPU (e.g. an ESP32-S3 with TFLite Micro) and fly the classifier at the edge at 1 Hz.',
    ],
    safety: [
      'Buy spawn from a reputable supplier; never culture wild moulds. Field inoculation is a dispersal event — check with local authorities before releasing a non-native fungal species outdoors, and use a species already present in your region.',
      'Wear an N95/P2 respirator, gloves and eye protection when filling the hopper and when the agitator is running. Dry spawn and spent substrate dust is the main inhalation hazard and it is worst at exactly the moment you are loading a machine.',
      'Do not grow moulds on food you will eat. If you take this to a crop field, keep inoculated residue away from the edible harvest and from irrigation water; do not use the spent substrate on salad crops.',
      'The rover is a 20 kg machine with an exposed injector tine array and rotating agitator: fit an emergency stop within reach, guard the tines, and never service it with the battery connected. Spring-steel tines under load can flick and cut. Keep all electronics in an IP65 enclosure with conformal coating, fuse the traction pack at the battery, and never combine wet organic substrate handling with mains voltage — and never charge the pack in the field on a damp surface.',
    ],
    lessonLinks: ['w6l11', 'w6l12', 'w1l1'],
    sources: [
      { label: 'Motamedi thesis (ÉTS Montréal) — colonisation windows and demoulding for Pleurotus and Trametes', url: 'https://espace.etsmtl.ca/id/eprint/3847/1/MOTAMEDI_Seyedsina_Th%C3%A8se.pdf' },
      { label: 'Alemu et al., Int. J. Polym. Sci. 2022 — mycelium-based composite review, substrate and process parameters', url: 'https://onlinelibrary.wiley.com/doi/10.1155/2022/8401528' },
      { label: 'MDPI Journal of Fungi 2025 — compressive strength by substrate and species (parameter table)', url: 'https://www.mdpi.com/2309-608X/11/8/549/pdf' },
      { label: 'Mahidol University — mycelium blocks from bamboo residues, spent coffee grounds and rice husks with P. ostreatus vs T. virens', url: 'https://murex.mahidol.ac.th/en/publications/assessing-mycelium-based-blocks-utilizing-pleurotus-ostreatus-ver/' },
    ],
  },

  {
    id: 'myc-acoustic-effector',
    title: 'Ìdákẹ́jẹ́ — Mycelium Acoustic Absorber End-Effector',
    tagline:
      'A robot arm that maps sound absorption across a wall, using a mycelium foam puck as the absorber and an impedance tube as the referee.',
    category: 'mycelium',
    difficulty: 'journeyman',
    buildTime: '4–6 weeks',
    costBand: '$$',
    wakandaIndex: 70,
    diyFeasibility: 60,
    scienceGrounding: 70,
    realitySplit: {
      real:
        'Porous, low-density mycelium composites absorb sound. Measured absorption coefficients in the literature are low to moderate overall, rising in the mid and high bands, with thicker samples and an air gap behind the sample absorbing more. Both of those effects are textbook porous-absorber physics.',
      narrative:
        '"Mycelium acoustic panels replace mineral wool in a studio." They can replace some foam in some positions, but a 2-inch mycelium panel is not a broadband absorber. Anyone claiming 0.9 absorption across the band has measured a different sample or a different rig.',
    },
    summary:
      'You build a two-microphone impedance tube (transfer-function method, ISO 10534-2) and measure the normal-incidence absorption coefficient of mycelium composite samples from 200 Hz to 4 kHz. Then you mount a small absorber puck on a 6-DOF arm or a 2-axis pan-tilt head, use it as a movable absorber, and map absorption across a test wall with a loudspeaker and a microphone grid. The robot adds value in exactly one way: it can reposition a sample with millimetre repeatability and change the cavity depth between the sample and the wall, which is the single biggest lever on low-frequency absorption.',
    science:
      'Sound absorption in a porous material comes from viscous and thermal losses as air oscillates in the pores. Two parameters govern it: flow resistivity and porosity, with thickness and backing cavity setting the frequency range. A thin, low-flow-resistivity absorber is a velocity absorber and works best near a quarter wavelength from a hard wall, which is why an air gap dramatically improves low-frequency performance. Mycelium composite has an open, interconnected pore structure inherited from the substrate particles, with densities around 100–400 kg/m³. Published impedance-tube measurements on mycelium-based materials report low to moderate absorption overall, best in the mid-to-high bands, improving with thickness and with an air gap — the 2-inch samples in one study showed the highest absorption of the set. Do not expect mineral-wool numbers: flow resistivity in a coarse, heterogeneous composite is hard to control and varies sample to sample, which is itself a finding worth reporting.',
    billOfMaterials: [
      { item: 'Mycelium composite samples: 30 mm and 60 mm thick, 100 mm diameter cores', qty: '6', note: 'Vary substrate particle size and pressing pressure' },
      { item: 'Acrylic tube, 100 mm ID, 1 m long, smooth bore', qty: '1', note: 'ISO 10534-2 two-microphone tube' },
      { item: '1/4" condenser measurement microphones, matched pair', qty: '2', note: 'Behringer ECM8000 works for a first pass; calibrate the pair against each other' },
      { item: 'USB audio interface with phantom power, 24-bit/48 kHz', qty: '1', note: 'Focusrite Scarlett 2i2 or similar' },
      { item: 'Full-range driver 50–100 mm + 30 W amplifier + rigid termination', qty: '1 set', note: 'Rigid back plate for the tube' },
      { item: 'REW (Room EQ Wizard) or a Python transfer-function script', qty: '1', note: 'Free; do the maths yourself so you understand it' },
      { item: 'Pan-tilt head (2× NEMA 17 + TMC2209) or a 6-DOF arm', qty: '1', note: 'Sample positioning with <1 mm repeatability' },
      { item: 'Measurement mic on a 1 m boom + stepper-driven X-Y gantry', qty: '1 set', note: 'Maps the sound field in front of the wall' },
      { item: 'Calibrated reference absorber (melamine foam or mineral wool, 50 mm)', qty: '1', note: 'Your sanity check — you must reproduce its published curve' },
      { item: 'Digital calipers + 0.1 g scale + vacuum bag for thickness control', qty: '1 set', note: 'Thickness and density are your variables; measure both' },
      { item: 'Sound level meter or calibrated SPL reference', qty: '1', note: 'Absolute level check' },
    ],
    buildSteps: [
      {
        title: 'Calibrate the tube before any specimen',
        detail:
          'Measure the reference mineral-wool absorber and compare against its published absorption curve. If you cannot reproduce it within ±0.1 in the 500 Hz–2 kHz band, your microphone spacing, transfer function or termination is wrong. Fix that first — everything else depends on it.',
      },
      {
        title: 'Make a controlled sample set',
        detail:
          'Cut 100 mm cores from composite grown with three substrate particle sizes and pressed at three pressures. Measure and record dry density and thickness of every core to 0.1 g and 0.1 mm. Absorption correlates strongly with both.',
      },
      {
        title: 'Measure absorption vs frequency',
        detail:
          'For each sample, measure at 5, 10, 20, 30 and 50 mm backing cavity depths. Compute the normal-incidence absorption coefficient from the transfer function between the two microphones. Plot 200 Hz–4 kHz for every combination.',
      },
      {
        title: 'Extract flow resistivity',
        detail:
          'Fit a Delany–Bazley or Johnson–Champoux–Allard model to your curves and extract flow resistivity. This single number is what a materials engineer needs, and it is what makes your result reusable.',
      },
      {
        title: 'Characterise the arm',
        detail:
          'Measure the positioning repeatability of your pan-tilt or arm with a dial indicator. You need <1 mm to make a meaningful cavity-depth sweep. If your robot is worse than that, fix the mechanics before doing acoustics.',
      },
      {
        title: 'Map the wall',
        detail:
          'Set up a loudspeaker 2 m from a hard wall and a microphone grid on a 200 mm pitch. The robot sweeps the absorber puck over the grid at three cavity depths; you log the SPL reduction at each grid point and each depth.',
      },
      {
        title: 'Compare against a simulation',
        detail:
          'Model the wall as an image source and predict the SPL reduction for each puck position. The difference between prediction and measurement tells you how much of your result is real absorption and how much is diffraction and edge effects.',
      },
      {
        title: 'Report the honest panel number',
        detail:
          'State the single-number weighted absorption coefficient (αw, ISO 11654) for your best sample. That is the number a buyer asks for, and it is usually lower than the peak value people quote.',
      },
    ],
    code: {
      language: 'python',
      snippet: [
        '"""Normal-incidence absorption coefficient, ISO 10534-2 transfer-function method."""',
        'import numpy as np',
        '',
        'C = 343.0        # m/s, speed of sound at 20 C',
        'S = 0.05         # m, microphone spacing (check against your tube)',
        'X1 = 0.35        # m, distance from sample face to mic 1',
        '',
        'def absorption(h12: np.ndarray, freqs: np.ndarray) -> np.ndarray:',
        '    """h12: transfer function mic2/mic1 from your measurement."""',
        '    k = 2.0 * np.pi * freqs / C',
        '    # r = (H12 - e^{-j k s}) / (e^{+j k s} - H12) * e^{j 2 k x1}',
        '    r = (h12 - np.exp(-1j * k * S)) / (np.exp(1j * k * S) - h12) * np.exp(2j * k * X1)',
        '    return 1.0 - np.abs(r) ** 2',
        '',
        '# Validity limits of the two-microphone method:',
        '#   upper: f < C / (2*S)  -> with S = 50 mm that is 3430 Hz',
        '#   lower: f > C / (20*S) -> with S = 50 mm that is ~343 Hz',
        '# Report ONLY the valid band, or state that you are extrapolating.',
        'f_hi = C / (2.0 * S)',
        'f_lo = C / (20.0 * S)',
        'print(f"valid band: {f_lo:.0f} Hz to {f_hi:.0f} Hz for S = {S*1000:.0f} mm")',
      ].join('\n'),
      note:
        'Always publish the microphone spacing and the valid frequency band. Absorption curves outside the valid band of a two-microphone tube are the most common false result in student acoustics.',
    },
    metrics: [
      { label: 'reference absorber agreement', value: 'within ±0.1 of published α in 500 Hz–2 kHz (measured)' },
      { label: 'peak absorption coefficient, 60 mm sample', value: 'expect 0.4–0.8 in the mid/high band (measured; thicker samples absorb more)' },
      { label: 'α at 250 Hz, 50 mm cavity', value: 'expect <0.3 — report it honestly (measured)' },
      { label: 'weighted absorption coefficient αw', value: 'single number per ISO 11654 (measured, computed)' },
      { label: 'flow resistivity', value: 'Pa·s/m², fitted from the JCA model (modelled fit to measured data)' },
      { label: 'arm positioning repeatability', value: '<1 mm (measured, dial indicator)' },
    ],
    stretchGoals: [
      'Build a 3D-printed Helmholtz resonator array in front of the mycelium panel and measure the low-frequency gain.',
      'Melt-and-repress samples at two pressures and quantify how much flow resistivity you can tune.',
      'Add a diffuse-field reverberation-room-style estimate with a small enclosure and compare to the normal-incidence result.',
      'Robot-scan a real room, produce a 3D absorption map, and place absorbers where the map says they matter.',
    ],
    safety: [
      'Buy spawn from a reputable supplier, never culture wild moulds, and discard any sample with contamination. You will be cutting dry samples with a hole saw, which is the highest spore-release moment in the build.',
      'Wear an N95/P2 respirator, safety glasses and gloves for hole-sawing and sanding mycelium composite. Dry composite dust is a respiratory irritant and carries spores; do it outdoors or under a HEPA extraction hood, never in the room where you sleep.',
      'Never combine wet organic substrate with mains voltage. Cure all samples bone-dry before they go near the measurement rig, and keep the amplifier, interface and any mains-powered driver physically separated from the incubation chamber.',
      'Anyone immunocompromised must not handle the samples at all — repeated aerosol-generating cutting of mould-grown material is precisely the exposure to avoid.',
      'The loudspeaker rig is a sound hazard: sustained test tones above 90 dB(A) at 1 m will damage hearing. Run sweeps at moderate level, use closed-back headphones for monitoring, and never put your head inside the tube or in front of the driver at full level.',
    ],
    lessonLinks: ['w7l14', 'w2l3', 'w5l10'],
    sources: [
      { label: 'Euronoise/FA2025 — measurements of the acoustic properties of mycelium-based materials using an impedance tube', url: 'https://dael.euracoustics.org/confs/fa2025/data/articles/000553.pdf' },
      { label: 'KU Leuven — acoustic characterisation of coffee-grounds-based mycelium composites', url: 'https://lirias.kuleuven.be/retrieve/b14bbb44-d657-4307-9f7e-9af7a16e01c2' },
      { label: 'Research Portal Belgium — acoustic applications of bio-mycelium composites: systematic review', url: 'https://www.researchportal.be/en/publication/acoustic-applications-bio-mycelium-composites-current-trends-and-opportunities' },
      { label: 'Indiana University ScholarWorks — low-to-moderate absorption in mycelium samples, thickness dependence', url: 'https://scholarworks.indianapolis.iu.edu/server/api/core/bitstreams/7080020d-c117-4835-8af4-feda5fafe02d/content' },
    ],
  },

  {
    id: 'myc-bio-weld-joints',
    title: 'Àjọṣepọ̀ — Bio-Welded Mycelium Joints',
    tagline:
      'Stop bolting. Grow two parts together and then try to pull them apart on a load cell.',
    category: 'mycelium',
    difficulty: 'journeyman',
    buildTime: '5–7 weeks',
    costBand: '$$',
    wakandaIndex: 80,
    diyFeasibility: 70,
    scienceGrounding: 74,
    realitySplit: {
      real:
        'Two separately colonised mycelium composite parts, placed in contact with a fresh nutrient bridge and re-incubated, fuse into a single continuous material. This is a real, well-known technique in mycelium fabrication, and joint strength is measurable and comparable to adhesive and mechanically fastened joints.',
      narrative:
        '"Welding." There is no heat, no melt, no filler metal. It is hyphal regrowth across an interface over 7–14 days at high humidity. Calling it bio-welding is fair shorthand for the process; calling it welding invites the wrong mental model of cycle time.',
    },
    summary:
      'A comparative joint study. You make three joint types in identical geometry — a bolted lap joint, an epoxy-bonded lap joint, and a bio-welded lap joint grown with a fresh spawn bridge — and test all three in lap shear and T-peel with a 20 kg load cell. You also test the bio-weld with bridge variables: plain spawn, spawn plus 5% molasses, and spawn plus a hemp-fibre reinforcement. The output is a design chart telling a future mycelium robot builder when growing a joint beats bolting it.',
    science:
      'Mycelium composites are held together by a continuous hyphal network, so two parts pressed together with a nutrient-rich interface will, given time and humidity, grow a new network that spans the seam. Bond strength depends on three things: the intimacy of contact (surface roughness and contact pressure), the amount of fresh, vigorous inoculum at the interface, and the re-incubation time. It is essentially a biological analogue of diffusion bonding, and it obeys the same rule — defects at the interface dominate failure. Expect the bio-weld to be weaker than epoxy in absolute terms (epoxy on a porous substrate forms a mechanical interlock that is hard to beat), but to be competitive in specific strength when you account for the fact that it adds essentially no mass and no metal hardware, and it composts with the rest of the part. Your load cell data will show whether that is true for your process; published mycelium composite compressive strengths of 0.1–1.2 MPa set a realistic ceiling for any bonded joint in the same material.',
    billOfMaterials: [
      { item: 'Colonised mycelium composite panels, 20 × 60 × 10 mm', qty: '36', note: 'Grown in a flat mould, all from one batch to reduce variance' },
      { item: 'Fresh grain spawn for the bridge', qty: '1 kg', note: 'Plus a variation with 5% molasses' },
      { item: 'Peel-ply or coir reinforcement for the reinforced variant', qty: '1 m²', note: 'Loose fibre laid in the wet bridge' },
      { item: 'Glass-fibre-reinforced epoxy (e.g. WEST SYSTEM 105/206) for the bonded baseline', qty: '1 kit', note: 'Wear nitrile gloves; epoxy sensitisation is cumulative' },
      { item: 'M4 stainless bolts, washers, nyloc nuts + torque wrench', qty: '24 sets', note: 'Torque all bolted joints identically, e.g. 2 N·m' },
      { item: '20 kg load cell (TAL220 or S-type) + HX711 + Arduino', qty: '1 set', note: 'Lap shear and T-peel rig' },
      { item: 'Stepper-driven lead screw, 1 mm/s, with a linear rail and clamps', qty: '1 set', note: 'Displacement-controlled testing' },
      { item: 'Digital calipers + 0.01 g scale + micrometer', qty: '1 each', note: 'Bond-line thickness must be recorded' },
      { item: 'Flat-press jig with calibrated weights (0.5, 1, 2 kg)', qty: '1 set', note: 'Contact pressure during the weld: 3–30 kPa' },
      { item: 'Humid incubation chamber at 25 °C / >90% RH', qty: '1', note: 'Plus a fan for still-air exchange' },
      { item: 'N95/P2 respirator + gloves + HEPA bench filter', qty: '1 set', note: 'Mandatory for all dry cutting and testing' },
    ],
    buildSteps: [
      {
        title: 'Grow one big batch of identical panels',
        detail:
          'All specimens from the same substrate, spawn lot, mould and incubation run. Panel-to-panel variance in mycelium composite is large; if you mix batches you will not be able to attribute any difference to the joint type. Record the bulk density of every panel.',
      },
      {
        title: 'Prepare matched interfaces',
        detail:
          'Sand all bond faces with 120 grit, then dust off. Measure surface roughness if you can. Keep the overlap area identical (20 × 20 mm) across all three joint types so lap shear stress is directly comparable.',
      },
      {
        title: 'Make the bio-weld bridge',
        detail:
          'Spread 2 g of fresh grain spawn (and 5% molasses in the nutrient variant, plus loose coir in the reinforced variant) over the overlap. Press at 3–30 kPa with the jig. Record the exact contact pressure for every specimen.',
      },
      {
        title: 'Re-incubate',
        detail:
          'Hold at 25 °C and >90% RH for 7, 14 and 21 days. Do not disturb. If the joint dries, the interface dies — this is the most common failure mode in the whole build.',
      },
      {
        title: 'Make the control joints',
        detail:
          'Bolt the bolted joints to 2 N·m with a torque wrench. Bond the epoxy joints with a 0.5 mm bond line, clamped for 24 hours. Note that epoxy on a porous composite wicks — weigh the assembly before and after to quantify uptake.',
      },
      {
        title: 'Test in lap shear',
        detail:
          'Pull at 1 mm/s to failure. Compute shear stress τ = F/(overlap width × length) in MPa. Test six specimens per condition and report mean ± standard deviation.',
      },
      {
        title: 'Test in T-peel',
        detail:
          'Separate the panel ends 90° apart and peel at 10 mm/min. Record peak force per unit width (N/mm). Peel exposes interface defects that lap shear hides.',
      },
      {
        title: 'Examine the failure surface',
        detail:
          'Photograph every fracture surface at 10× and classify it: coherent substrate failure, adhesive failure at the seam, or mixed. Coherent failure means the joint is stronger than the material, which is the actual design goal.',
      },
    ],
    code: {
      language: 'cpp',
      snippet: [
        '// Lap-shear / peel logger with HX711, 20 kg cell, and automatic peak capture.',
        '// Logs force, displacement (from stepper steps) and computes shear stress in MPa.',
        '#include "HX711.h"',
        'HX711 cell;',
        'const float COUNTS_PER_N = 21400.0f / 9.80665f;   // calibrate with known masses',
        'const float OVERLAP_MM2 = 400.0f;                 // 20 mm x 20 mm',
        'const float PEAK_DROP = 0.6f;                     // failure = force falls below 60% of peak',
        '',
        'float peak = 0.0f;',
        'int step = 0;',
        '',
        'void loop() {',
        '  float f = cell.get_units(3) * 9.80665f;          // N',
        '  float defl = step * 0.001f;                      // 1 mm per step, verify',
        '  float tau = f / OVERLAP_MM2;                     // N/mm^2 = MPa',
        '  if (f > peak) peak = f;',
        '  Serial.print(defl, 4); Serial.print(",");',
        '  Serial.print(f, 3);    Serial.print(",");',
        '  Serial.println(tau, 4);',
        '  step++;',
        '  if (peak > 1.0f && f < PEAK_DROP * peak) {',
        '    Serial.print("# FAIL shear_stress_MPa="); Serial.println(peak / OVERLAP_MM2, 4);',
        '    while (1) { delay(1000); }',
        '  }',
        '  delay(100);',
        '}',
      ].join('\n'),
      note:
        'Never compare a bio-weld against epoxy without also reporting the mass added at the joint. The epoxy baseline wins on strength and loses on the 3 g of resin it adds — show both numbers.',
    },
    metrics: [
      { label: 'lap shear strength, bio-weld at 14 days', value: 'MPa, 6 specimens mean ± σ (measured)' },
      { label: 'lap shear strength, epoxy and bolted baselines', value: 'MPa each (measured; expect epoxy to win outright, and normalise the bolted figure by hardware mass)' },
      { label: 'T-peel force per width', value: 'N/mm for each joint type (measured)' },
      { label: 'coherent-failure fraction', value: '% of specimens failing in the substrate rather than the seam (measured — this is the real success criterion)' },
      { label: 'joint mass penalty', value: 'g added per joint: bio-weld ~0.2 g, epoxy ~3 g, bolted ~6 g (measured)' },
      { label: 'days to full weld', value: 'strength vs 7/14/21 days re-incubation (measured)' },
    ],
    stretchGoals: [
      'Add a scarf or stepped joint geometry and test whether a larger bond area actually helps or just moves the failure.',
      'Weld a full robot arm link from three parts and measure the assembly stiffness against a bolted equivalent.',
      'Grow the joint under a continuous tensile preload and see whether tension aligns the hyphae and improves strength.',
      'Put the best bio-welded joint in a compost heap for 8 weeks and measure how much of the joint survives.',
    ],
    safety: [
      'Buy spawn from a reputable supplier and never culture wild moulds. You are pressing wet spawn against a large surface area 36 times over — a contaminated batch ruins weeks of work and aerosolises on the bench.',
      'Wear an N95/P2 respirator and eye protection for every sanding and cutting step, and for the tensile tests themselves. Mycelium composite fractures with a snap that throws fragments and dust.',
      'Never grow moulds on food you will eat and never share a bench with food preparation. Keep the spawn, the substrate and the humid chamber out of the kitchen.',
      'Epoxy resin is a cumulative sensitiser: wear nitrile gloves, work with ventilation, and never handle uncured resin with bare hands. Once sensitised, you are sensitised for life.',
      'Anyone immunocompromised must not handle dry spawn, dried composite or the testing rig. Repeated aerosol-generating work with fungal material is the specific exposure pattern to avoid for that group. The load cell rig also stores elastic energy — a brittle composite specimen failing at 200 N releases it suddenly — so fit a polycarbonate shield in front of the specimen and keep hands out of the plane of the specimen.',
    ],
    lessonLinks: ['w7l14', 'w1l2', 'w5l10'],
    sources: [
      { label: 'Elsacker et al., Biomimetics 2022 — mycelium biofilm tensile properties and interface behaviour', url: 'https://cris.vub.be/ws/files/85051094/Elsacker_et_al_2022_Biomimetics.pdf' },
      { label: 'Elsacker PhD thesis (VUB) — mycelium composite fabrication and heat pressing', url: 'https://cris.vub.be/ws/files/67445971/Elsacker_PhD_for_share_small.pdf' },
      { label: 'MDPI Journal of Fungi 2025 — compressive strength by species and substrate (joint strength ceiling)', url: 'https://www.mdpi.com/2309-608X/11/8/549/pdf' },
      { label: 'TU Eindhoven ICSBM 2025 proceedings — mycelium-based composites as engineered materials', url: 'https://pure.tue.nl/ws/portalfiles/portal/380536871/ICSBM_2025_Proceedings_-_Vol2.pdf' },
    ],
  },

  {
    id: 'myc-memristor-mythbust',
    title: 'The Memristor That Wasn’t — Mycelium Logic Gate, Tested Honestly',
    tagline:
      'The negative-result build. Replicate the viral "mushroom computer" claim, measure what is actually there, and publish the failure with the same care as a success.',
    category: 'mycelium',
    difficulty: 'master',
    buildTime: '3–4 weeks',
    costBand: '$$$',
    wakandaIndex: 94,
    diyFeasibility: 44,
    scienceGrounding: 40,
    realitySplit: {
      real:
        'Mycelium and fungal tissue show voltage-dependent, hysteretic conductance — the same signature that gets called "memristive" for a wide range of disordered materials. That hysteresis is measurable with a source-measure unit and an oscilloscope, and replicating it is a genuine, worthwhile afternoon.',
      narrative:
        'The claim that fungi are "living computers" running logic, memory and neural computation. Published work on memristive behaviour in mushrooms is a phenomenological report of hysteresis in a biological sample, not a demonstrated logic fabric. No one has shown a cascadable fungal gate array that holds state reliably for hours at room temperature and humidity. The headline claim is a category error between "responds nonlinearly to voltage" and "computes".',
    },
    summary:
      'A deliberately adversarial experiment whose stated goal is to try to falsify a viral claim and report the outcome whatever it is. You build a source-measure rig around two electrodes in a mycelium block, run the standard hysteresis protocol, attempt to operate the sample as an AND and an OR gate with defined logic levels and a noise margin, and then do the controls that the viral videos omit: a dead (autoclaved) sample, a moist sterile substrate sample, a wet paper sample, and a carbon resistor. You measure state retention, cycle-to-cycle variability and the failure modes. The expected headline is: "we reproduced hysteresis; we could not build a usable gate; here is exactly where it broke, with data."',
    science:
      'Hysteresis in a voltage-vs-current loop means the conductance depends on the history of the applied voltage, which is the defining phenomenological signature of a memristor and also what you get from a huge range of artefacts: ionic drift in a wet medium, electrochemical electrode polarisation, water films, and capacitive settling. That last set is the problem. A wet biological sample between two electrodes is an electrochemical cell, and it will produce a pinched hysteresis loop from electrode polarisation alone. The decisive control is therefore an abiotic one: two identical electrodes in sterile substrate at the same moisture and temperature. If the abiotic control produces a comparable loop, the memristive claim for the living sample is not established. Retention is the second killer. A real memory element holds state for a specified time under a specified read voltage; the state of a fungal sample relaxes as it dries, ferments and is consumed, on a timescale of minutes to hours. You will report retention time, and it will be short.',
    billOfMaterials: [
      { item: 'Source-measure unit: Keithley 2400/2450, or a DIY Howland current source + ADS1115', qty: '1', note: 'You need a controlled voltage/current sweep and simultaneous readback' },
      { item: 'ADALM2000 or a 2-channel oscilloscope with an XY mode', qty: '1', note: 'For the classic pinched-loop display' },
      { item: 'Platinum or gold wire electrodes, 0.5 mm, 2 mm exposed', qty: '6', note: 'Inert electrodes are non-negotiable: bare copper or steel electrodes generate the hysteresis you are trying to test' },
      { item: 'Living mycelium block, 30 × 30 × 15 mm', qty: '6', note: 'Trametes versicolor on hemp hurd, fully colonised' },
      { item: 'Autoclaved dead control blocks from the same batch', qty: '6', note: 'Killed at 80 °C for 1 hour, same moisture' },
      { item: 'Sterile substrate control blocks, never inoculated', qty: '6', note: 'Same moisture, same geometry' },
      { item: 'Wet filter paper control + 1 kΩ metal-film resistor control', qty: '6 each', note: 'The artefact controls that decide everything' },
      { item: 'Precision voltage reference + 0.1% sense resistors', qty: '1 set', note: 'Current accuracy sets your loop quality' },
      { item: 'Temperature and RH logger inside the test chamber', qty: '1', note: 'You must report the conditions; hysteresis depends on them' },
      { item: 'ADC + logic-level front end for the gate test (74HC series + ADS1115)', qty: '1 set', note: 'Defined logic levels: 0 = 0 V, 1 = 200 mV' },
      { item: 'Faraday enclosure + battery supply for the sample', qty: '1 set', note: 'Same hum discipline as the spike-probe brief' },
    ],
    buildSteps: [
      {
        title: 'Write the falsification criteria BEFORE you measure',
        detail:
          'State in writing: "The claim is supported only if (a) the living sample shows a pinched hysteresis loop with a normalised area at least 3× the abiotic control, (b) the state is distinguishable after a 60-second zero-bias retention interval on at least 8 of 10 trials, and (c) a two-input gate achieves a noise margin above 20% of the logic swing." Pre-registering the criteria is what makes this a result rather than a story.',
      },
      {
        title: 'Build the source-measure rig',
        detail:
          'Use a Keithley 2400 if you have one; otherwise a Howland current pump driven by a DAC with the sample current sensed by an INA333 across a 1 kΩ shunt. Sweep ±1 V at 10 mV/s (slow — the ionic response is slow) and log I vs V for the full cycle.',
      },
      {
        title: 'Run the classic hysteresis protocol on the living sample',
        detail:
          'Apply a triangular wave, plot I–V, and look for the pinched loop. Photograph the XY trace. Measure the loop area numerically. Do this on six living specimens and record the spread.',
      },
      {
        title: 'Run every control, in the same session',
        detail:
          'Dead block, sterile wet substrate, wet filter paper, and a 1 kΩ resistor. Same sweep, same electrodes, same temperature. This is the step the viral demonstrations skip, and it is the whole project.',
      },
      {
        title: 'Attempt retention',
        detail:
          'Write a state with a 1 V, 60 s pulse. Set the sample to zero bias for 1, 10, 60 and 600 s. Read at 50 mV (below the write threshold) and see whether the conductance is still distinguishable from the unwritten state. Report the fraction of successful retentions.',
      },
      {
        title: 'Attempt a logic gate',
        detail:
          'Wire two input electrodes and one output electrode with defined levels (0 V and 200 mV) and a 10 kΩ pull-down. Enumerate all four input combinations, 20 trials each, and record the output distribution. Compute the noise margin as the separation between the lowest logic-1 output and the highest logic-0 output, divided by the logic swing.',
      },
      {
        title: 'Measure drift and lifetime',
        detail:
          'Log the low-bias conductance for 24 hours with no stimulation. Report drift in %/hour and the time to a 50% change. This number alone usually kills the gate claim, because the "state" drifts as fast as the signal.',
      },
      {
        title: 'Write the negative result honestly',
        detail:
          'Report what reproduced, what did not, and where the failure occurred. Include the raw loops, the control loops overlaid, the retention table and the gate truth table with its noise margins. If the answer is "hysteresis yes, gate no", that is a genuinely useful contribution and worth more than a hyped success.',
      },
    ],
    code: {
      language: 'python',
      snippet: [
        '"""Memristor claim test: pinched-loop area vs abiotic control, and gate noise margin.',
        '',
        'Claim is SUPPORTED only if live/control area ratio >= 3.0 AND retention >= 0.8',
        'AND noise margin >= 0.20. Otherwise: NOT SUPPORTED. No partial credit, no',
        'moving the goalposts after seeing the data.',
        '"""',
        'import numpy as np',
        '',
        'AREA_RATIO_MIN = 3.0',
        'RETENTION_MIN = 0.8',
        'NOISE_MARGIN_MIN = 0.20',
        '',
        'def loop_area(v: np.ndarray, i: np.ndarray) -> float:',
        '    """Absolute area enclosed by the I-V loop, in V*A. Trapezoid on the closed path."""',
        '    return float(abs(np.trapezoid(i, v)))',
        '',
        'def retention_fraction(bit_written: np.ndarray, bit_read: np.ndarray) -> float:',
        '    """Fraction of trials where the read state matches the written state."""',
        '    return float(np.mean(bit_written == bit_read))',
        '',
        'def noise_margin(out_low: np.ndarray, out_high: np.ndarray, swing: float) -> float:',
        '    """Separation between worst logic-1 and best logic-0, normalised by the swing."""',
        '    worst_one = float(np.min(out_high))',
        '    best_zero = float(np.max(out_low))',
        '    return (worst_one - best_zero) / swing',
        '',
        'def verdict(live_area, ctrl_area, retention, margin):',
        '    ratio = live_area / max(ctrl_area, 1e-12)',
        '    ok = (ratio >= AREA_RATIO_MIN and retention >= RETENTION_MIN',
        '          and margin >= NOISE_MARGIN_MIN)',
        '    print(f"loop area ratio live/control = {ratio:.2f}  (need >= {AREA_RATIO_MIN})")',
        '    print(f"retention fraction           = {retention:.2f}  (need >= {RETENTION_MIN})")',
        '    print(f"noise margin                 = {margin:.3f} (need >= {NOISE_MARGIN_MIN})")',
        '    print("VERDICT:", "CLAIM SUPPORTED" if ok else "CLAIM NOT SUPPORTED — report the negative result")',
        '',
        '# Expect to reach the else-branch. That is a legitimate outcome, not a failure of the build.',
      ].join('\n'),
      note:
        'Pre-register the thresholds. Publishing a negative result with a pre-registered protocol is real science; deciding the threshold after seeing the data is not.',
    },
    metrics: [
      { label: 'pinched-loop area, living sample', value: 'V·A, mean of 6 specimens (measured)' },
      { label: 'loop area ratio, live / abiotic control', value: 'the decisive number; if <3 the memristive claim is not established (measured)' },
      { label: 'state retention at 60 s zero bias', value: 'fraction of successful retentions out of 10 (measured)' },
      { label: 'low-bias conductance drift', value: '%/hour over 24 h (measured)' },
      { label: 'gate noise margin', value: 'fraction of logic swing; need >0.20 for a usable gate (measured)' },
      { label: 'cycle-to-cycle loop area variability', value: 'coefficient of variation over 100 cycles (measured)' },
    ],
    stretchGoals: [
      'Repeat with a dried (deactivated) sample at 40% RH and show whether the hysteresis survives dehydration.',
      'Try the same protocol on a slime mould (Physarum polycephalum) and on a mycelium block and compare — the literature often conflates them.',
      'Test whether the loop area scales with electrode spacing as an ionic (bulk) or an interfacial (electrode) effect; that single experiment usually identifies the mechanism.',
      'Write up the negative result and post the raw data. A well-documented "we could not replicate the gate" is a genuine contribution to an over-hyped field.',
    ],
    safety: [
      'Buy spawn from a reputable supplier. Do not culture wild moulds, and do not use a "mystery" mushroom from a market — you cannot know the species and the experiment does not require a specific one.',
      'Wear an N95/P2 respirator whenever you handle, cut or dispose of the blocks, and for every autoclaving step. Repeated handling of colonised substrate over a three-week experiment is a cumulative spore exposure.',
      'Do not grow moulds on food you will eat and never work with substrate in a kitchen. Autoclave or pressure-cook spent blocks before disposal to avoid dumping live cultures.',
      'Keep the electrical test voltage and current limited: set the source compliance to 1 mA and the voltage ceiling to ±2 V, and put a 100 kΩ series resistor in the electrode path. A wet ionic sample plus a lab supply that can source amps is a burn and gas-evolution hazard, and any mains-referenced instrument on an open wet sample is a shock path. Never combine wet organic substrates with mains voltage.',
      'Anyone immunocompromised must not handle the blocks. This build deliberately keeps moist substrate at room temperature for weeks, which is when contaminant moulds appear. Autoclave spent blocks before disposal, vent the pressure vessel properly, never open it while pressurised, and keep it away from the spawn area to avoid cross-contamination.',
    ],
    lessonLinks: ['w1l1', 'w4l8', 'w2l4'],
    sources: [
      { label: 'Adamatzky et al., "Mem-fractive Properties of Mushrooms" (IOP Bioinspiration & Biomimetics) — the paper behind the viral claim', url: 'https://beta.iopscience.iop.org/article/10.1088/1748-3190/ac2e0c' },
      { label: 'Utrecht University — review of the electronic properties of fungi; practical implementations and their limits', url: 'https://dspace.library.uu.nl/bitstream/handle/1874/416274/1_s2.0_S0303264721002288_main.pdf' },
      { label: 'Adamatzky, arXiv:2112.09907 — the "language of fungi" analysis, explicitly framed as analogy', url: 'https://ar5iv.labs.arxiv.org/html/2112.09907' },
      { label: 'Frontiers in Materials 2026 — fungal-derived functional carbons for batteries (note: these are carbonised, not living)', url: 'https://www.frontiersin.org/journals/materials/articles/10.3389/fmats.2026.1796209/full' },
    ],
  },

  {
    id: 'myc-circuit-pattern',
    title: 'Spore-Print Lithography — Grown Channels for Wiring',
    tagline:
      'Use the fungus as a living template, then measure the resistance of what you actually get. The honest version involves carbonised mycelium and a lot of four-point-probe readings.',
    category: 'mycelium',
    difficulty: 'master',
    buildTime: '4–6 weeks',
    costBand: '$$$',
    wakandaIndex: 92,
    diyFeasibility: 34,
    scienceGrounding: 46,
    realitySplit: {
      real:
        'You can grow mycelium along a physically or chemically patterned track, and you can then either (a) use the mycelium as a sacrificial template that is carbonised or metallised, or (b) measure the ionic conductivity of the living track. Both are real experiments with real four-point-probe numbers. Mycelium-derived functional carbons are a genuine, published materials research area used for battery electrodes.',
      narrative:
        'Spore prints themselves are electrically insulating — a spore print is a deposit of spores, not a circuit. "Mycelium-grown wiring" as a drop-in replacement for copper is not a thing, and the honest brief says so. The interesting claim is template-assisted patterning, not biological copper.',
    },
    summary:
      'A patterning experiment with an honest title. You make tracks three ways: a physical microchannel milled in agar, a chemical track written with a nutrient ink, and a spore-print-seeded track. Mycelium follows the tracks. You then measure the living track with a four-point probe, carbonise a second set in a tube furnace under nitrogen at 600–900 °C, and measure again. You compare resistance against a copper trace of identical geometry and report the ratio, in orders of magnitude, on the wall.',
    science:
      'Filamentous fungi grow by apical extension and can be guided by topography, nutrient gradients and electric fields — this is well documented and is the basis of real work on fungal growth in microfluidic channels. A physical microchannel of 100–500 µm width constrains hyphae effectively, which gives you a patterned mycelium network. Living hyphae conduct ionically through a water film and cytoplasm, so their resistance is high, humidity-dependent and polarising. To get an electronic conductor you must carbonise the biomass: pyrolysis at 600–900 °C in an inert atmosphere converts fungal cell walls into a nitrogen-doped, porous carbon with genuine electronic conductivity. That is the published route behind "fungal-derived functional carbons" for battery electrodes — and note that the end product is carbon, not a living organism. That distinction is the honest core of this brief: the interesting material is dead and pyrolysed.',
    billOfMaterials: [
      { item: 'PDMS (Sylgard 184) + 3D-printed master for microchannel casting', qty: '1 kit', note: 'Channels 200 µm wide × 100 µm deep' },
      { item: 'Agar plates (2% agar, 1% malt extract) + Petri dishes', qty: '20', note: 'Nutrient base for guided growth' },
      { item: 'Pleurotus or Trametes spawn, plus liquid culture for spore-print seeding', qty: '1 set', note: 'Buy from a reputable supplier' },
      { item: 'Nutrient ink: 3% malt extract + 1% xanthan gum, in a 0.5 mm nozzle syringe', qty: '1', note: 'For chemically patterned tracks' },
      { item: 'Four-point probe head: 4× gold spring pins at 1 mm pitch', qty: '1', note: 'Critical — two-point probe on a wet sample measures contact resistance' },
      { item: 'Keithley 2400 or a DIY constant-current source + ADS1256', qty: '1 set', note: 'For R = V/I with a known forced current' },
      { item: 'Tube furnace, 1200 °C, with N₂ or Ar flow', qty: '1', note: 'Carbonisation at 600–900 °C. Check whether your lab already has one — do not buy one for this' },
      { item: 'Quartz or alumina boats + ceramic crucibles', qty: '4', note: 'For the pyrolysis' },
      { item: 'SEM or optical microscope access (or a good USB microscope)', qty: '1', note: 'To verify the mycelium actually followed the channel' },
      { item: 'Silver conductive epoxy for contact pads', qty: '1', note: 'Cure per datasheet; keep it away from the living sample' },
      { item: 'Copper-clad FR4 + ferric chloride for the comparison trace', qty: '1', note: 'Identical geometry reference' },
      { item: 'N95/P2 respirator, nitrile gloves, safety glasses, HEPA extraction', qty: '1 set', note: 'Spore and pyrolysis fume protection' },
    ],
    buildSteps: [
      {
        title: 'Verify guidance first, with a cheap experiment',
        detail:
          'Before anything expensive, cast a straight 300 µm channel in agar, inoculate one end, and image daily. You should see hyphae following the channel within 3–7 days. If they will not follow a straight channel, nothing downstream will work.',
      },
      {
        title: 'Pattern the tracks three ways',
        detail:
          'Physical microchannels in agar, nutrient ink drawn on plain agar, and spore-print-seeded lines (press a spore print onto tape, then transfer a line). Grow all three at 25 °C for 7–14 days and image the coverage.',
      },
      {
        title: 'Measure the living tracks with four points',
        detail:
          'Force 1 µA between the outer two pins and measure the voltage between the inner two with a high-impedance amplifier. Use AC or reverse the polarity every reading — ionically conducting wet tracks polarise and your reading will drift. Report resistance and normalise by track length.',
      },
      {
        title: 'Harvest and dry the tracks',
        detail:
          'Peel the mycelium track off the agar, dry at 60 °C for 12 hours, and weigh it. Record the mass per unit length — that is the number that predicts the carbon yield.',
      },
      {
        title: 'Carbonise',
        detail:
          'Pyrolyse in a tube furnace under flowing nitrogen: ramp 5 °C/min to 700 °C, hold 60 minutes, cool under nitrogen. Do not open the furnace hot and do not run this without the inert gas flow — you will just burn the sample and produce a lot of smoke.',
      },
      {
        title: 'Re-measure, four-point',
        detail:
          'Contact the carbonised track with silver epoxy pads and measure with the four-point probe. This is the number that matters. Compare it against the copper reference trace of identical geometry and report the ratio in orders of magnitude.',
      },
      {
        title: 'Characterise the variation',
        detail:
          'Measure 10 tracks per patterning method. Report mean and spread. Biological templating has poor dimensional control and the resistance spread will be your headline limitation.',
      },
      {
        title: 'Attempt one functional circuit',
        detail:
          'Make a carbonised mycelium track drive an LED through a 1 kΩ resistor from a 9 V supply, and measure the voltage drop across the track. If it works, you have a genuine pyrolysed-biomass conductor. If it does not, you have a genuine measurement of why not.',
      },
    ],
    code: {
      language: 'python',
      snippet: [
        '"""Four-point-probe resistance for a track of known geometry.',
        '',
        'Two-point probing of a wet ionic track measures mostly contact resistance. If',
        'your two-point and four-point numbers differ by more than 2x, you have not',
        'measured the material. Report both and say which one you trust.',
        '"""',
        'import numpy as np',
        '',
        'def four_point_resistance(v_inner_v: np.ndarray, i_forced_a: float, spacing_m: float):',
        '    """Returns sheet resistance (ohm/sq) and resistivity (ohm*m) for a thin track."""',
        '    r_meas = float(np.mean(v_inner_v)) / i_forced_a      # ohms across the inner pair',
        '    # For a thin track of width w and thickness t, rho = R * w * t / L.',
        '    # With no thickness measurement, report sheet resistance instead of guessing.',
        '    return r_meas',
        '',
        'def report(living_two_point, living_four_point, carbon_four_point, copper_ref):',
        '    print(f"living, two-point   : {living_two_point:.3g} ohm")',
        '    print(f"living, four-point  : {living_four_point:.3g} ohm")',
        '    print(f"carbonised, 4-point : {carbon_four_point:.3g} ohm")',
        '    print(f"copper reference    : {copper_ref:.3g} ohm")',
        '    print(f"carbon / copper     : {carbon_four_point / copper_ref:.3g} x")',
        '    print(f"carbon / living     : {carbon_four_point / living_four_point:.3g} x")',
        '    # Expected: living is dominated by ionic conduction and is humidity dependent;',
        '    # carbonised is 1e3-1e6 x more conductive than living but many orders worse',
        '    # than copper. Say so plainly on the poster.',
      ].join('\n'),
      note:
        'A spore print is an insulating deposit of spores. Any claim that spore prints themselves conduct is false; the conductive material in this project is pyrolysed carbon, and the honest write-up says so.',
    },
    metrics: [
      { label: 'channel-guided growth success', value: '% of channels with continuous hyphal coverage at 7 days (measured)' },
      { label: 'living track four-point resistance', value: 'kΩ–MΩ per cm, humidity dependent (measured)' },
      { label: 'carbonised track sheet resistance', value: 'Ω/sq, mean of 10 tracks (measured)' },
      { label: 'carbonised-to-copper resistance ratio', value: 'expect 10³–10⁶× worse (measured; state it plainly)' },
      { label: 'dimensional spread of track width', value: 'coefficient of variation in µm (measured — the templating limitation)' },
      { label: 'carbon yield', value: '% of dry track mass retained after pyrolysis (measured)' },
    ],
    stretchGoals: [
      'Dope the substrate with iron or nitrogen precursors before pyrolysis and measure the change in sheet resistance — this is the real published route to functional carbon.',
      'Pattern a 3-element resistor network and characterise its transfer function as a crude filter.',
      'Try electrohydrodynamic guidance: apply 1–5 V/cm across the agar and see whether you can steer hyphae without physical channels.',
      'Attempt a fully compostable pyrolysed-carbon temperature sensor and calibrate it.',
    ],
    safety: [
      'Buy spawn from a reputable supplier and never culture wild moulds. Spore-print work means deliberately creating spore aerosol — do it in a still-air box or under HEPA extraction, never at an open bench in a living space — and wear an N95/P2 respirator, gloves and safety glasses for every step that disturbs a spore print or dry mycelium. Spore concentrations from prints are high enough to cause real respiratory symptoms, so dispose of spore-print tape sealed, and anyone immunocompromised must not be in the room for this work at all.',
      'Tube furnace safety is the dominant hazard in this build: high temperature, inert gas asphyxiation risk, and pyrolysis fumes. Use a certified furnace with an over-temperature cut-out, in a fume hood or vented enclosure, with a gas alarm if you use nitrogen or argon in a closed room. Never load a wet sample, never open hot, and never run the furnace unattended.',
      'Ferric chloride etchant for the copper reference is corrosive and stains: nitrile gloves, eye protection, a dedicated plastic tray, and neutralise with baking soda before disposal. Never pour it down a sink.',
      'Never combine wet organic substrate processing with mains-powered equipment on the same bench, and keep all mycelium work on isolated low-voltage supplies with conformal coating. Never put wet substrate near mains wiring.',
    ],
    lessonLinks: ['w1l2', 'w7l14', 'w8l16'],
    sources: [
      { label: 'Frontiers in Materials 2026 — fungal-derived functional carbons for secondary batteries (carbonised, not living)', url: 'https://www.frontiersin.org/journals/materials/articles/10.3389/fmats.2026.1796209/full' },
      { label: 'Adamatzky, arXiv:2112.09907 — methods for interfacing electrodes with colonised fungal substrates', url: 'https://ar5iv.labs.arxiv.org/html/2112.09907' },
      { label: 'Utrecht University — electronic properties of fungi: sensorial and computing circuits embedded in mycelium', url: 'https://dspace.library.uu.nl/bitstream/handle/1874/416274/1_s2.0_S0303264721002288_main.pdf' },
      { label: 'MDPI Biosensors 2026 — filamentous fungi in biosensing and materials (review)', url: 'https://www.mdpi.com/2079-6374/16/2/131/pdf' },
    ],
  },

  {
    id: 'myc-farm-rover',
    title: 'Oko Rover — Greenhouse Humidity Patroller for a Mushroom Farm',
    tagline:
      'A small rail or floor rover that patrols a fruiting room, measures humidity and temperature at canopy height, and reports colonisation stage block by block.',
    category: 'mycelium',
    difficulty: 'apprentice',
    buildTime: '2–4 weeks',
    costBand: '$$',
    wakandaIndex: 62,
    diyFeasibility: 84,
    scienceGrounding: 68,
    realitySplit: {
      real:
        'Mushroom fruiting rooms have tight, well-understood environmental windows, and the colonisation-to-fruiting transition is detectable from block temperature, substrate moisture and CO₂. A rover that measures at canopy height and logs per-rack data is straightforward, useful engineering.',
      narrative:
        '"The robot grows the mushrooms." The grower grows the mushrooms. The rover measures, and its real value is catching a stalled or contaminated block days earlier than a daily walk-round.',
    },
    summary:
      'A battery-powered rover that drives a painted line or a floor rail down a growing room, stops at each rack position, and measures air temperature, relative humidity, CO₂ and block surface temperature (IR) at three heights. It reports a per-block colonisation stage and flags deviations from the room’s setpoint. The build is deliberately modest and genuinely shippable: the hard parts are sensor calibration at 85–95% RH and surviving the condensation.',
    science:
      'The cultivation windows are well established. Spawn run (colonisation) is typically 20–25 °C with low fresh-air exchange; fruiting is induced by dropping to roughly 15–19 °C with 85–95% RH and higher fresh-air exchange to bring CO₂ below about 800–1000 ppm. Getting CO₂ right is the difference between long stems and proper caps — CO₂ above roughly 1000 ppm suppresses pin formation and elongates stipes. Per-block colonisation progress shows up as a small temperature rise above room air (metabolic heat, typically 1–3 °C during active growth) and as a shift in surface emissivity and colour. Your value is a per-block time series that a grower can trend, not a single snapshot.',
    billOfMaterials: [
      { item: 'Small differential-drive chassis + 2× 12 V gearmotors with encoders', qty: '1', note: 'Or a V-slot rail gantry for a permanent install' },
      { item: 'ESP32-S3 with LoRa (SX1262) or Wi-Fi', qty: '1', note: 'Farm buildings rarely have good Wi-Fi at rack level' },
      { item: 'Sensirion SHT45 temperature/RH sensors, 3× at 200/500/800 mm heights', qty: '3', note: 'Repurpose an SCD41 for CO₂ separately' },
      { item: 'SCD41 CO₂ sensor', qty: '1', note: 'Photoacoustic, ±(50 ppm + 5%)' },
      { item: 'MLX90614 or MLX90640 IR thermometer for block surface temperature', qty: '1', note: 'Non-contact, avoids contaminating blocks' },
      { item: 'Calibrated salt references for RH (33/75/97%) + a CO₂ reference', qty: '1 set', note: 'Non-negotiable at 90% RH' },
      { item: 'TOF distance sensor (VL53L1X) for rack position/stop detection', qty: '2', note: 'Or magnetic tape + hall sensors' },
      { item: 'LiFePO4 12 V 6 Ah pack + BMS + IP65 enclosure', qty: '1', note: 'LiFePO4 is safer than LiPo in a damp farm building' },
      { item: 'Conformal coating (silicone) + Gore vent plugs + desiccant', qty: '1 set', note: 'The electronics will see 95% RH; plan for it' },
      { item: 'MicroSD + RTC (DS3231) for offline logging', qty: '1 set', note: 'Log when the link drops; farms have dead spots' },
      { item: 'Reference: hand-held aspirated psychrometer + grower’s own controller readings', qty: '1', note: 'Your calibration ground truth' },
    ],
    buildSteps: [
      {
        title: 'Calibrate every RH sensor against saturated salts',
        detail:
          'Seal each SHT45 in a jar over MgCl₂ (33%), NaCl (75%) and K₂SO₄ (97%) for 2 hours at 20 °C and record the reading. Keep the offset in firmware. Uncalibrated RH sensors at 90% RH are routinely 5–10% off, which is the difference between a good flush and a stalled crop.',
      },
      {
        title: 'Build the sensor mast',
        detail:
          'Three SHT45s at canopy, mid and floor height on a single mast. Aspirate them with a small 5 V fan through a Gore vent so you measure air, not the radiated heat of the rack. A sensor sitting still in still air reads the wall, not the room.',
      },
      {
        title: 'Design for condensation',
        detail:
          'The rover enters a 90% RH room from a dry corridor. Put the electronics in an IP65 box with a Gore vent, conformal-coat every board, and add a desiccant cartridge you can swap weekly. Test by leaving the rover in the room for 24 hours and checking for condensation inside the box.',
      },
      {
        title: 'Build the patrol route',
        detail:
          'Use floor tape or a magnetic strip and a VL53L1X-based stop at each rack bay. Log the bay ID with every sample. A rover that does not know which rack it is at is a thermometer on wheels.',
      },
      {
        title: 'Log per-block time series',
        detail:
          'Sample 60 seconds at each bay every 4 hours. Store temperature, RH, CO₂, block IR and battery voltage with an RTC timestamp. Push over LoRa when in range, otherwise buffer to microSD.',
      },
      {
        title: 'Implement the stage estimator',
        detail:
          'Classify each block as colonising, pinning, fruiting or suspect using block ΔT above room air, days since spawning and CO₂. Keep it simple and explainable — a grower will not trust a black box and does not need one.',
      },
      {
        title: 'Flag the anomalies that matter',
        detail:
          'Alert on: block ΔT collapsing to zero (dead block), ΔT spiking high (contaminant thermogenesis), RH below setpoint for 2 hours, and CO₂ above 1200 ppm. Each alert should name the specific grown-room consequence, not just "out of range".',
      },
      {
        title: 'Run it for a full crop cycle',
        detail:
          'Deploy for one complete cycle (roughly 6–8 weeks including spawn run and two flushes) and compare your alerts against the grower’s log of problems. The number of real problems caught early is the only metric that matters.',
      },
    ],
    code: {
      language: 'cpp',
      snippet: [
        '// Per-block stage estimator and alerting for a mushroom fruiting room.',
        '// Deliberately rule-based and explainable - a grower must be able to argue with it.',
        'struct Block {',
        '  int bay;',
        '  float t_air_c;      // aspirated air temperature at canopy height',
        '  float rh_pct;',
        '  float co2_ppm;',
        '  float t_block_c;    // MLX90614 non-contact surface temperature',
        '  int   days_since_spawn;',
        '};',
        '',
        'const char* stage(const Block& b) {',
        '  float dT = b.t_block_c - b.t_air_c;',
        '  if (dT > 3.0f)                 return "CONTAMINANT? (thermal spike)";',
        '  if (dT < 0.3f && b.days_since_spawn > 14) return "STALLED/DEAD";',
        '  if (b.co2_ppm < 1000.0f && b.rh_pct > 85.0f && b.t_air_c < 19.0f) return "PINNING/FRUITING";',
        '  if (dT > 0.8f)                 return "COLONISING (metabolic heat)";',
        '  return "COLONISING (slow)";',
        '}',
        '',
        '// Harvest window guidance (typical Agaricus/Pleurotus practice, verify for your strain):',
        '//   spawn run      20-25 C, low fresh air exchange, CO2 can rise freely',
        '//   pinning        15-19 C, RH 85-95%, CO2 below ~800-1000 ppm',
        '//   fruiting       15-19 C, RH 85-92%, CO2 below ~1000 ppm or stipes elongate',
        'bool harvestAlert(const Block& b) {',
        '  return b.co2_ppm > 1200.0f || b.rh_pct < 85.0f;',
        '}',
      ].join('\n'),
      note:
        'The setpoints above are typical commercial practice for common Agaricus and Pleurotus strains. Your strain, substrate and room will differ — calibrate the thresholds against the grower’s own records before making any recommendation.',
    },
    metrics: [
      { label: 'RH sensor agreement after salt calibration', value: 'within ±2% RH of the reference at 75% and 97% (measured)' },
      { label: 'avoided condensation inside the enclosure', value: 'no visible moisture after 24 h at 90% RH, IP65 box (measured)' },
      { label: 'per-bay positioning repeatability', value: '±20 mm with tape and TOF stop detection (measured)' },
      { label: 'block ΔT during active colonisation', value: '0.8–3 °C above aspirated room air (measured)' },
      { label: 'stage estimator agreement with the grower', value: '% of blocks where your call matched the grower’s at the same visit (measured)' },
      { label: 'crop cycle uptime', value: 'days of continuous logging out of 45 without a battery swap (measured)' },
    ],
    stretchGoals: [
      'Add a small camera and count pins per block with a classical blob detector — no CNN needed for dark pins on white substrate.',
      'Add a per-block mass estimate from a load cell under one rack and correlate mass loss with flush timing.',
      'Integrate with the grower’s existing climate controller over Modbus or MQTT rather than duplicating sensors.',
      'Add a swab-and-image station so a suspect block can be photographed and logged without the grower touching it.',
    ],
    safety: [
      'In a working mushroom farm, respiratory protection is a farm rule, not a suggestion: wear an N95/P2 in the growing rooms. Spore loads during harvest are high, and mushroom worker’s lung is a documented occupational disease from repeated inhalation of spore-laden organic dust. Anyone immunocompromised must not enter the growing rooms or handle colonised blocks.',
      'Buy spawn from a reputable supplier and never culture wild moulds. A "green mould" outbreak in a fruiting room is a Trichoderma problem that costs the grower a crop — do not bring unverified cultures into a commercial facility. Do not eat food grown in any experimental substrate, and keep the robot’s test blocks physically separate from the commercial crop.',
      'LiFePO4 pack: charge with the correct CC/CV charger in a dry place, never in the humid room, and never leave charging unattended. A wet room plus a charging battery is a fire scenario.',
      'Keep the rover on an isolated 12 V bus with an IP65 enclosure, conformal coating and a 5 A fuse at the pack. Never run mains cabling on the rover, and never let the rover’s damp chassis touch mains-powered irrigation or lighting circuits. Never combine wet organic substrate and mains voltage.',
    ],
    lessonLinks: ['w2l3', 'w6l11', 'w8l15'],
    sources: [
      { label: 'Motamedi thesis (ÉTS Montréal) — colonisation and fruiting conditions for Pleurotus and Trametes', url: 'https://espace.etsmtl.ca/id/eprint/3847/1/MOTAMEDI_Seyedsina_Th%C3%A8se.pdf' },
      { label: 'Frontiers in Fungal Biology 2025 — living mycelium materials as sensors and biohybrid systems', url: 'https://www.frontiersin.org/journals/fungal-biology/articles/10.3389/ffunb.2025.1739847/full' },
      { label: 'MDPI Journal of Fungi 2025 — mycelium composite properties by substrate and species', url: 'https://www.mdpi.com/2309-608X/11/8/549/pdf' },
      { label: 'CDC — mold infections after hurricanes and flooding (respirator and exposure guidance)', url: 'https://www.cdc.gov/mold/306718-A_FS_MoldInfectionsPostHurricaneandFlood-H.pdf' },
    ],
  },

  {
    id: 'myc-soft-harvest-gripper',
    title: 'Ẹ̀wà Harvest — Non-Bruising Mushroom Gripper with a Mycelium Pad',
    tagline:
      'Grip a mushroom hard enough to twist it off and soft enough not to mark it. The mycelium composite pad is what distributes the load.',
    category: 'mycelium',
    difficulty: 'apprentice',
    buildTime: '3–4 weeks',
    costBand: '$$',
    wakandaIndex: 66,
    diyFeasibility: 78,
    scienceGrounding: 70,
    realitySplit: {
      real:
        'Bruising is a mechanical property: local contact pressure above the tissue’s yield threshold, plus shear from a sliding grip. A compliant pad reduces peak contact pressure by spreading load over a larger area, and you can measure that with a pressure-sensitive film or an array sensor and a load cell. Force-controlled harvesting at 1–3 N is real, shippable agricultural robotics.',
      narrative:
        '"The mycelium pad keeps the mushroom alive." It does not. The pad is a compliant, disposable, compostable interface material. Its interesting property is that it is soft, conformable and can be grown to shape — not that it is alive.',
    },
    summary:
      'A two-finger or three-finger soft gripper on a small arm, with interchangeable tips: a rigid 3D-printed tip, a silicone tip, and a moulded mycelium composite tip. You characterise contact pressure distribution against a pressure-sensitive film, grip force via a load cell on a stalk-mounted specimen, and bruise damage by imaging the cap before and after (a $30 USB microscope and a simple colour/threshold analysis will do). You then run a harvest trial of 50 mushrooms per tip type and count visible damage.',
    science:
      'Button and oyster mushrooms bruise when contact stress exceeds the tissue’s local yield stress, and the damage is worse with a small contact area and with any sliding motion. A compliant pad of lower elastic modulus than the tissue increases the contact patch and lowers peak pressure for the same total force — the standard Hertzian contact result, and the reason a mycelium composite pad works. Mycelium composite has a compressive modulus in the low tens of MPa at densities of 100–400 kg/m³ (measured range; highly process dependent), which is softer than most 3D-printed plastics and comparable to a firm silicone. It is also mouldable to the exact shape of a mushroom cap, which is the real design trick: a shaped pad gives a conformal fit and eliminates the point contacts that do the damage. Force control matters more than force magnitude — the impulse at first contact is what bruises, so ramp the grip pressure and hold it.',
    billOfMaterials: [
      { item: '3-finger soft gripper or a 2-finger parallel gripper with interchangeable tips', qty: '1', note: 'Servo-driven is fine; force control matters more than DOF' },
      { item: 'Load cell 1 kg (TAL221) + HX711 + ESP32', qty: '1 set', note: 'In-line with the specimen stalk for grip force measurement' },
      { item: 'FlexiForce A201 pressure sensors + INA333', qty: '3', note: 'Real-time fingertip force feedback' },
      { item: 'Pressure-sensitive film (Fujifilm Prescale or equivalent)', qty: '1 pack', note: 'Static contact pressure mapping; the killer measurement for this project' },
      { item: 'Moulded mycelium composite tips grown in mushroom-shaped moulds', qty: '12', note: 'Hemp hurd + Pleurotus; press to 2 different densities' },
      { item: 'Silicone tips (Shore 30A and 10A) and rigid PLA tips for comparison', qty: '12 each', note: 'Shore 10A is the strong competitor — say so if it wins' },
      { item: 'USB microscope with a measurement stand + LED ring', qty: '1', note: 'Bruise imaging with a fixed stand-off' },
      { item: 'Digital force gauge 5 N with a flat 10 mm probe', qty: '1', note: 'Independent cross-check of the load cell' },
      { item: 'Fresh mushrooms (button or oyster), same size grade', qty: '150', note: 'Buy from a shop; keep them refrigerated and test within 24 h' },
      { item: 'Stalk clamp fixture + a 2-axis manual stage', qty: '1 set', note: 'Standardise the grip point on every specimen' },
      { item: 'Servo driver (PCA9685) + 6 V 5 A isolated supply for the gripper', qty: '1 set', note: 'Isolated; the gripper is not on the same rail as any mains-referenced instrument' },
    ],
    buildSteps: [
      {
        title: 'Grow shaped tips, not flat pads',
        detail:
          'Make silicone negative moulds from real mushrooms, then cast the mycelium composite into them by packing colonised substrate at 25 °C for 10–14 days. A tip that matches the cap geometry is the whole advantage. Dry to stable mass, then seal with a food-safe shellac so it does not absorb mushroom juice.',
      },
      {
        title: 'Calibrate all three force paths',
        detail:
          'Calibrate the load cell with known masses, the FlexiForce sensors against the force gauge, and verify that the two agree in a static press. FlexiForce is heavily nonlinear and drifts — characterise it or your control loop will be lying to you.',
      },
      {
        title: 'Map contact pressure with film',
        detail:
          'Clamp each tip type against the pressure-sensitive film at 1 N, 2 N and 4 N. Scan the film and quantify the contact area and the peak pressure. The compliant mycelium tip should show a larger area and a lower peak pressure. Quantify it; do not describe it.',
      },
      {
        title: 'Measure the bruise threshold',
        detail:
          'For each tip type, apply a controlled static force from 0.5 N to 5 N to a mushroom cap for 5 seconds, then image the cap under the microscope and score visible damage on a 0–3 scale. This gives you the force that must not be exceeded.',
      },
      {
        title: 'Build the force ramp controller',
        detail:
          'Ramp the servo position at a controlled rate, read the fingertip force at 100 Hz, and stop when either the target force is reached or the force rate exceeds a limit (that second condition prevents the contact impulse that actually bruises).',
      },
      {
        title: 'Add the twist-and-pull harvest motion',
        detail:
          'Mushrooms are harvested with a combined twist and gentle pull. Implement a 90° twist and a 2 N pull, and measure whether the stalk separates cleanly at the base without tearing the substrate. Tearing is a yield loss, not a quality issue — measure it.',
      },
      {
        title: 'Run the 50-mushroom trial per tip',
        detail:
          'Harvest 50 mushrooms with each tip type, image every cap, and score damage blind — have someone else label the images so you do not bias the score. Report the damage rate per tip type.',
      },
      {
        title: 'Cycle test the pad',
        detail:
          'Run 2,000 grip cycles at 2 N on a dummy specimen, measuring tip stiffness and surface condition every 500 cycles. Mycelium composite will compact and abrade — quantify the drift, then replace the tip and quantify the cost per 1,000 harvests.',
      },
    ],
    code: {
      language: 'cpp',
      snippet: [
        '// Force-controlled grip with an impulse guard. The impulse is what bruises.',
        'const float TARGET_N     = 2.0f;',
        'const float DFS_LIMIT    = 8.0f;    // N/s; above this, back off immediately',
        'const float RAMP_STEP    = 0.004f;  // servo units per tick',
        'float servo = 0.0f;',
        '',
        'float readGripN() {',
        '  // HX711 on a 1 kg cell, calibrated: N = counts / COUNTS_PER_N',
        '  return hx.get_units(2) * 9.80665f;',
        '}',
        '',
        'void grip() {',
        '  float prev = readGripN();',
        '  unsigned long t0 = micros();',
        '  while (true) {',
        '    float f = readGripN();',
        '    float dt = (micros() - t0) / 1e6f;',
        '    t0 = micros();',
        '    float dfs = (dt > 1e-6f) ? (f - prev) / dt : 0.0f;',
        '    prev = f;',
        '    if (dfs > DFS_LIMIT) { servo -= 3.0f * RAMP_STEP; }   // back off: impact detected',
        '    else if (f < TARGET_N) { servo += RAMP_STEP; }',
        '    else { break; }                                        // settled at target',
        '    servo = constrain(servo, 0.0f, 1.0f);',
        '    setServo(servo);',
        '    delay(10);',
        '  }',
        '}',
      ].join('\n'),
      note:
        'The force-rate limit does more work than the force limit. A soft pad touching at speed still spikes the local pressure for a few milliseconds, and that spike is what leaves the mark.',
    },
    metrics: [
      { label: 'peak contact pressure at 2 N grip force', value: 'kPa, from pressure film; lower is better (measured)' },
      { label: 'contact area at 2 N', value: 'mm², mycelium vs silicone vs rigid (measured)' },
      { label: 'harvest damage rate over 50 mushrooms; force at first bruise', value: '% caps damaged per tip type (blind-scored) plus the static force threshold in N (measured)' },
      { label: 'stalk tear rate', value: '% of harvests leaving substrate attached (measured)' },
      { label: 'pad stiffness drift over 2,000 cycles', value: '% change in force at fixed servo position (measured)' },
      { label: 'cost per 1,000 harvests', value: 'tip replacement cost in local currency (measured — the adoption metric)' },
    ],
    stretchGoals: [
      'Grow the pad directly onto the gripper finger so there is no bond line, using the bio-weld method.',
      'Add a tiny camera and close the loop on bruise prediction before the grip completes.',
      'Compare a mycelium pad against a 3D-printed lattice pad of the same effective modulus — the lattice may win on repeatability.',
      'Take the best configuration to a real grower and count their damage rate over a full harvest day.',
    ],
    safety: [
      'Buy spawn from a reputable supplier; never culture wild moulds, and never use a pad grown with a contaminated substrate on food. Grow the pads in a dedicated space away from any food preparation area.',
      'Do not grow moulds on food you will eat. The mushrooms in this project are bought produce used as test specimens — do not eat any mushroom that has been gripped, pressed or imaged, and dispose of all test specimens as waste. Grow the pads in a dedicated space away from any food preparation area.',
      'Wear an N95/P2 when handling dry spawn or trimming dry pads, and wear gloves when handling the fresh mushrooms and any shellac or silicone. Repeated silicone and epoxy exposure causes sensitisation; silicone mould-making and shellac also involve solvent vapours, so work with ventilation, keep away from the humidity chamber and any spark source, and store solvents in a flammables cabinet.',
      'The gripper is a pinching hazard — servo-driven fingers at 2 N will still not break skin, but a 6 V 5 A servo can drive a mechanism with real force at the linkage. Keep fingers clear, fit a mechanical end-stop, and cut power before changing tips.',
    ],
    lessonLinks: ['w3l5', 'w2l4', 'w8l15'],
    sources: [
      { label: 'Elsacker et al., Biomimetics 2022 — pure mycelium biofilm mechanics, the pad material basis', url: 'https://cris.vub.be/ws/files/85051094/Elsacker_et_al_2022_Biomimetics.pdf' },
      { label: 'Alemu et al., Int. J. Polym. Sci. 2022 — mycelium composite density and compressive properties', url: 'https://onlinelibrary.wiley.com/doi/10.1155/2022/8401528' },
      { label: 'Frontiers in Fungal Biology 2025 — biohybrid robots and living mycelium materials', url: 'https://www.frontiersin.org/journals/fungal-biology/articles/10.3389/ffunb.2025.1739847/full' },
      { label: 'MDPI Journal of Fungi 2025 — compressive strength parameter table across species and substrates', url: 'https://www.mdpi.com/2309-608X/11/8/549/pdf' },
    ],
  },

  {
    id: 'myc-bioreactor-rig',
    title: 'Ilé-Ìdàgbàsókè — Mycelium Bioreactor Monitoring Rig',
    tagline:
      'Peristaltic dosing, PID temperature control, continuous CO₂ logging. The unglamorous instrument that makes every other mycelium project reproducible.',
    category: 'mycelium',
    difficulty: 'journeyman',
    buildTime: '3–5 weeks',
    costBand: '$$$',
    wakandaIndex: 58,
    diyFeasibility: 76,
    scienceGrounding: 78,
    realitySplit: {
      real:
        'Temperature, humidity, CO₂ evolution rate and dosing volume are the four variables that determine whether a mycelium culture grows, stalls or ferments. Controlling and logging them with a PID loop, a peristaltic pump and a CO₂ sensor is standard bioprocess engineering and it is entirely buildable.',
      narrative:
        'Calling it a "bioreactor" when it is a temperature-controlled box with a pump. That is fine — a controlled box with a pump is what most benchtop bioprocess work actually is, and honest naming stops people expecting stirred-tank performance.',
    },
    summary:
      'A benchtop environmental control and logging rig for solid-state mycelium cultivation: a sealed chamber with a PID-controlled heater and Peltier cooler, a humidifier on a second PID, a peristaltic nutrient dosing pump on a schedule or on a feedback trigger, and continuous CO₂ logging that yields a respiration curve. The rig then runs a designed experiment — three temperatures × two moisture levels — and produces a growth-rate response surface from CO₂ evolution and dry-mass sampling. This is the project that turns mycelium robotics from craft into process.',
    science:
      'Solid-state fungal cultivation is governed by temperature, substrate moisture, oxygen/CO₂ and nutrient availability. Most cultivated basidiomycetes grow fastest between roughly 24 and 28 °C, stall below about 15 °C and above about 32 °C, and are damaged above 35 °C. Substrate moisture of 60–75% is standard. CO₂ evolution rate is a direct proxy for metabolic rate: in a sealed chamber with known free volume and a measured air exchange rate, d[CO₂]/dt gives you respiration after subtracting the washout term. The initial exponential phase of CO₂ evolution is the best non-destructive growth measure you have — it correlates with biomass accumulation before you can see it. A PID on temperature is easy; a PID on humidity in a sealed chamber with condensation is not, and the tuning work is a real part of the project.',
    billOfMaterials: [
      { item: 'Insulated chamber, 40 L, with a clear lid and sealed cable glands', qty: '1', note: 'Polycarbonate or an insulated cool box' },
      { item: 'Peltier module TEC1-12706 ×2 + heatsink + fan + H-bridge driver', qty: '1 set', note: 'Bidirectional control: heat and cool' },
      { item: 'PT1000 or DS18B20 temperature sensors ×3 (air, substrate, wall)', qty: '3', note: 'Substrate temperature is the controlled variable, not air' },
      { item: 'SCD41 CO₂ sensor with a sealed sampling path', qty: '1', note: 'Photoacoustic; ±(50 ppm + 5%)' },
      { item: 'SHT45 humidity sensor + ultrasonic humidifier (12 V) or a bubbler', qty: '1 set', note: 'Humidifier on a separate relay/PWM driver' },
      { item: 'Peristaltic pump, 12 V, 1–50 mL/min, with silicone tubing', qty: '1', note: 'Sterile, replaceable tubing; never pump through the same tube twice' },
      { item: 'Load cell 5 kg under the substrate tray + HX711', qty: '1', note: 'Continuous mass loss/gain: water use and CO₂ loss in one signal' },
      { item: 'ESP32-S3 + microSD + RTC + SSR relay board (or MOSFETs for DC)', qty: '1 set', note: 'Log at 0.2 Hz; PID at 1 Hz' },
      { item: 'Nutrient solution: 2% malt extract or a defined glucose/ammonium salts medium', qty: '1 L', note: 'Autoclave before use' },
      { item: 'Substrate bags with filter patches + Pleurotus spawn, 5 kg', qty: '1 set', note: 'Reputable supplier' },
      { item: 'Graphing/analysis environment (Python + pandas + matplotlib)', qty: '1', note: 'You will produce a response surface; plan for it' },
      { item: 'CO₂ calibration gas or a soda-lime zero reference', qty: '1', note: 'Zero the SCD41 properly for absolute respiration rates' },
    ],
    buildSteps: [
      {
        title: 'Build the chamber and characterise it before any biology',
        detail:
          'Seal the box, add a known CO₂ source (a sachet of bicarbonate plus acid), and measure the leak rate as a time constant. You cannot compute a respiration rate without knowing the chamber’s air exchange rate. This is the single most important calibration in the build.',
      },
      {
        title: 'Commission the Peltier loop',
        detail:
          'Peltier modules are bidirectional with the right H-bridge, which makes them ideal for a PID that must both heat and cool. Tune with a Ziegler–Nichols step test. Watch the hot-side heatsink: an unstalled Peltier with a bad heatsink will cook itself and then cook your culture.',
      },
      {
        title: 'Commission the humidity loop',
        detail:
          'Humidity control in a sealed chamber fights condensation. Put the humidity sensor in an aspirated pocket away from the walls, and drive the humidifier with a slow PWM. Expect oscillation and tune conservatively — a humidity loop that hunts is worse than no loop.',
      },
      {
        title: 'Commission the dosing pump',
        detail:
          'Calibrate mL per revolution with water by weighing ten doses. Then set a maintenance dose of 5–20 mL per day per kg of substrate, plus a feedback trigger if the tray load cell shows the mass dropping faster than the expected water loss.',
      },
      {
        title: 'Instrument the substrate, not the air',
        detail:
          'Insert the substrate thermocouple 30 mm into the centre of the block. Air temperature leads substrate temperature by hours, and it is the substrate that governs growth. Log both and report the difference.',
      },
      {
        title: 'Run the designed experiment',
        detail:
          'Three temperatures (21, 25, 29 °C) × two moisture levels (60%, 72%) × three replicates = 18 runs. Each run logs CO₂, temperature, humidity, mass and dose for 7 days. Randomise run order to avoid a systematic drift.',
      },
      {
        title: 'Extract growth rates',
        detail:
          'Fit an exponential to the first 72 hours of CO₂ evolution rate to get a specific growth rate (per hour). Correlate it against final dry mass at day 7, destructively measured on three sacrificial blocks. If CO₂ does not predict mass, report that.',
      },
      {
        title: 'Publish the response surface',
        detail:
          'Plot growth rate against temperature and moisture with confidence intervals. That surface is a reusable artefact: every other mycelium project in this Idea Lab should be able to read its incubation setpoints off your chart.',
      },
    ],
    code: {
      language: 'python',
      snippet: [
        '"""CO2 evolution rate -> specific growth rate, from sealed-chamber logging.',
        '',
        'The chamber has free volume V and a measured air-exchange rate k (1/h) from the',
        'leak test. The CO2 balance is:  V dC/dt = P - Q (C - C_ambient)',
        'so production rate P = V dC/dt + k V (C - C_ambient).  Note that deriving P from',
        'raw dC/dt without the washout term overestimates production whenever C > ambient.',
        '"""',
        'import numpy as np',
        'import pandas as pd',
        '',
        'V_L = 40.0          # chamber free volume, litres (measure by water displacement)',
        'K_PER_H = 0.05      # air-exchange rate from the leak test, 1/h (MEASURE THIS)',
        'C_AMB = 420.0       # ppm ambient CO2 reference',
        '',
        'def production_rate(c_ppm: np.ndarray, t_h: np.ndarray):',
        '    dcdt = np.gradient(c_ppm, t_h)                       # ppm per hour',
        '    washout = K_PER_H * (c_ppm - C_AMB)                  # ppm per hour',
        '    return V_L * (dcdt + washout) / 1e6 * 1e3            # mL CO2 per hour',
        '',
        'def specific_growth_rate(t_h: np.ndarray, p_ml_h: np.ndarray, window_h: float = 72.0):',
        '    m = (t_h <= window_h) & (p_ml_h > 0)',
        '    slope, intercept = np.polyfit(t_h[m], np.log(p_ml_h[m]), 1)',
        '    mu = slope                                            # per hour',
        '    doubling_h = np.log(2.0) / mu if mu > 0 else float("inf")',
        '    return mu, doubling_h',
        '',
        'df = pd.read_csv("run_T25_M72_rep1.csv")   # columns: t_h, co2_ppm, temp_c, rh_pct, mass_g',
        'df["P"] = production_rate(df["co2_ppm"].to_numpy(), df["t_h"].to_numpy())',
        'mu, td = specific_growth_rate(df["t_h"].to_numpy(), df["P"].to_numpy())',
        'print(f"mu = {mu:.4f} /h   doubling time = {td:.1f} h")',
        '# Expect doubling times in the tens of hours for a solid-state block;',
        '# if you compute minutes, your leak-rate constant is wrong.',
      ].join('\n'),
      note:
        'Measuring CO₂ evolution without measuring the chamber leak rate is the most common error in DIY respiration work. Do the leak test first; it takes twenty minutes and it makes every subsequent number meaningful.',
    },
    metrics: [
      { label: 'temperature control error at setpoint', value: '±0.3 °C substrate, steady state (measured)' },
      { label: 'RH control error at setpoint', value: '±3% RH (measured — this is hard in a sealed chamber, report the real number)' },
      { label: 'chamber air-exchange time constant', value: 'hours, from the leak test (measured)' },
      { label: 'specific growth rate from CO₂; doubling time', value: 'per hour and hours, exponential phase, 18 runs (measured; expect tens of hours for solid-state substrate)' },
      { label: 'CO₂ vs dry-mass correlation', value: 'R² between integrated CO₂ and day-7 dry mass (measured — report it even if weak)' },
      { label: 'dosing accuracy', value: 'measured mL per commanded mL, ±5% target (measured)' },
    ],
    stretchGoals: [
      'Add a cheap off-gas O₂ sensor and compute a respiratory quotient — it distinguishes aerobic growth from fermentation.',
      'Add a full CO₂ mass balance: integrate total evolved CO₂ and compare against measured substrate dry-mass loss.',
      'Automate a maintenance-dose trigger from the tray load cell and demonstrate a 14-day unattended run.',
      'Open-source the response surface and the control firmware so other Idea Lab builders can reuse the setpoints.',
    ],
    safety: [
      'Buy spawn from a reputable supplier and never culture wild moulds. A bioreactor concentrates whatever is growing inside it — if the block is contaminated, the chamber is a spore incubator.',
      'Open the chamber in a ventilated space and wear an N95/P2 whenever you do. Venting a colonised chamber can release a concentrated spore aerosol, and the rig should have a filter patch on its exhaust, not an open port.',
      'Never run a sealed chamber with a live culture and no ventilation path; CO₂ can accumulate to levels that are dangerous to you when you open it, and the culture will stall. Fit a filtered vent and log CO₂ before opening.',
      'Anyone immunocompromised must not open or service the rig. This build deliberately creates the highest spore concentration of any project here.',
      'Peltier modules get very hot on the reject side: fit a proper heatsink and fan, thermal-cut-out at 70 °C, and never run one without airflow. Keep the 12 V DC for the Peltier and the pump on an isolated, fused supply and physically separated from any mains-referenced instrument. If you use mains SSRs for a heater, put the whole chamber on one RCD-protected circuit, earth the metal parts, and never let the wet chamber contents touch mains wiring — never combine wet organic substrate with mains voltage. Peristaltic tubing is also single-use: do not re-use nutrient tubing between runs, as it is the most likely contamination path in the rig.',
    ],
    lessonLinks: ['w3l6', 'w1l1', 'w7l13'],
    sources: [
      { label: 'Alemu et al., Int. J. Polym. Sci. 2022 — substrate moisture and temperature ranges for mycelium composites', url: 'https://onlinelibrary.wiley.com/doi/10.1155/2022/8401528' },
      { label: 'Motamedi thesis (ÉTS Montréal) — incubation and demoulding practice across species and substrates', url: 'https://espace.etsmtl.ca/id/eprint/3847/1/MOTAMEDI_Seyedsina_Th%C3%A8se.pdf' },
      { label: 'MDPI Journal of Fungi 2025 — species and substrate effects on mycelium composite properties', url: 'https://www.mdpi.com/2309-608X/11/8/549/pdf' },
      { label: 'CDC — mold infections after hurricanes and flooding; respiratory protection guidance', url: 'https://www.cdc.gov/mold/306718-A_FS_MoldInfectionsPostHurricaneandFlood-H.pdf' },
    ],
  },

  {
    id: 'myc-compostable-robot',
    title: 'Ìparí Ọ̀rọ̀ — The Robot Designed to Be Composted',
    tagline:
      'Design for end-of-life from the first sketch: every part is either compostable, recoverable, or explicitly listed as landfill. Then actually compost it and weigh the residue.',
    category: 'mycelium',
    difficulty: 'journeyman',
    buildTime: '6–8 weeks (plus 12 weeks of composting)',
    costBand: '$$',
    wakandaIndex: 84,
    diyFeasibility: 64,
    scienceGrounding: 72,
    realitySplit: {
      real:
        'You can build a small functioning robot whose structural parts are mycelium composite, whose fasteners are minimal and recovered, and whose electronics are designed to be removed in ten minutes. Then you can compost the structure and measure mass loss over 12 weeks. Material passports and design-for-disassembly are established industrial practice, not speculation.',
      narrative:
        '"A robot that returns to the earth." The electronics do not compost, the motors do not compost, the battery does not compost. An honest end-of-life design states exactly which fraction of the mass goes to compost, which to e-waste recycling, and which to landfill — and then proves it by actually doing it and weighing the outputs.',
    },
    summary:
      'A complete end-of-life-engineered robot: a mycelium composite chassis and shell, PLA or mycelium brackets, no adhesives anywhere, captive-but-accessible fasteners, a single connector for the whole electrical harness, and a material passport printed on the shell listing every material, its mass, and its disposal route. You then execute the end-of-life plan for real: dismantle it on camera, weigh each stream, compost the structural material for 12 weeks, and report the mass balance and the disintegration rate.',
    science:
      'Mycelium composite is biodegradable because its matrix is fungal biomass plus lignocellulose, both of which soil organisms metabolise. Disintegration rate depends on the material’s density, the degree of heat treatment (heat-pressed, densified composites break down more slowly because the hyphal network is collapsed and the accessible surface area is lower), the compost conditions, and the piece’s thickness. Published biodegradation studies on mycelium composites show substantial mass loss over weeks to months in active compost, faster for low-density samples. This gives you a real design tension: denser material is stronger but composts more slowly and less completely. The material passport turns that tension into an explicit engineering choice — you state the required service life, pick the density that meets it, and accept the corresponding end-of-life time.',
    billOfMaterials: [
      { item: 'Mycelium composite chassis panels, grown and pressed at two densities', qty: '1 set', note: 'Low-density for the shell, higher-density for the load path' },
      { item: 'PLA brackets (or mycelium brackets) — no epoxy, no cyanoacrylate', qty: '8', note: 'Any adhesive makes disassembly destructive' },
      { item: 'Stainless M3 bolts and threaded inserts, all the same head size', qty: '30', note: 'One tool for the entire robot is a design rule' },
      { item: 'Single 8-way JST-XH harness connector + labelled keyed plugs', qty: '1 set', note: 'The electrical harness leaves as one unit' },
      { item: 'Electronics module on a removable tray: ESP32, drivers, sensors', qty: '1 set', note: 'The tray screws out as one assembly' },
      { item: '2S LiFePO4 pack with a documented take-back route', qty: '1', note: 'Never compostable; plan its return before you buy it' },
      { item: 'NEMA 17 or N20 gearmotors with recoverable windings', qty: '2', note: 'Copper recovery is the real e-waste value' },
      { item: 'Kitchen scale 5 kg / 1 g + a 500 g reference mass', qty: '1', note: 'Mass balance measurement' },
      { item: 'Compost bin or mesh litter bag (2 mm mesh), 30 L', qty: '1', note: 'Mesh bags let you retrieve and weigh residues' },
      { item: 'Thermocouple loggers in the compost pile ×3', qty: '3', note: 'Prove the pile was actually active (55–65 °C thermophilic phase)' },
      { item: 'Laser-printed material passport plaque (engraved PLA or stamped metal)', qty: '1', note: 'Permanently attached to the shell' },
      { item: 'N95/P2 respirator + gloves', qty: '1 set', note: 'For handling the compost and the spent material' },
    ],
    buildSteps: [
      {
        title: 'Write the end-of-life plan before the first sketch',
        detail:
          'A table with every material, its mass, its disposal route and who accepts it. If a part has no route, redesign it or justify it explicitly. This one page is the project.',
      },
      {
        title: 'Design for one tool and one harness',
        detail:
          'Every fastener is the same M3 hex head. Every electrical connection routes to a single harness connector. Target: full disassembly in under 15 minutes with no cutting. Time yourself at the end.',
      },
      {
        title: 'Grow the structure at two densities',
        detail:
          'Shell panels at low density (~120–180 kg/m³) for fast composting; the load-bearing base pressed harder (~300–400 kg/m³) for service life. Mark the density on each panel.',
      },
      {
        title: 'Assemble with no adhesives',
        detail:
          'Use bolted and snap-fit joints only. Where a bond is unavoidable, use a reversible one and document it. Re-check the bio-weld brief: a bio-welded joint would mean composting the whole assembly, which is a legitimate alternative design — pick one and state the trade.',
      },
      {
        title: 'Machine the material passport',
        detail:
          'A plaque listing each material, its mass in grams, its disposal route, and the date of manufacture. Print it in a form that survives the product’s life — a laser-engraved plate or a stamped metal tag, not a paper label.',
      },
      {
        title: 'Commission the robot',
        detail:
          'Make it actually do something: a 30-minute line-following or teleoperated drive, logging its own duty cycle. A robot that cannot perform earns no end-of-life credit.',
      },
      {
        title: 'Execute the end-of-life plan on camera',
        detail:
          'Disassemble to the plan, timing it. Weigh each stream separately: compostable structure, recoverable metals, electronics for WEEE recycling, and residual landfill. Report the four numbers as a percentage of total mass.',
      },
      {
        title: 'Compost and measure disintegration',
        detail:
          'Seal the structural material in a 2 mm mesh bag inside an active compost pile (log the pile temperature; you want a thermophilic phase of 55–65 °C). Retrieve and weigh at 2, 4, 8 and 12 weeks. Report mass loss over time and photograph the residue. Sieve and report any fragments above 2 mm — microplastic-style residue is the honest caveat.',
      },
    ],
    code: {
      language: 'python',
      snippet: [
        '"""Material passport mass balance and compost disintegration tracker."""',
        'from dataclasses import dataclass, field',
        '',
        '@dataclass',
        'class Part:',
        '    name: str',
        '    material: str',
        '    mass_g: float',
        '    route: str          # "compost" | "weee" | "metal" | "battery-takeback" | "landfill"',
        '',
        'PASSPORT = [',
        '    Part("chassis base",  "mycelium composite, 350 kg/m3", 412.0, "compost"),',
        '    Part("shell",         "mycelium composite, 150 kg/m3", 188.0, "compost"),',
        '    Part("brackets x8",   "PLA",                            96.0, "compost"),',
        '    Part("fasteners x30", "A2 stainless",                   54.0, "metal"),',
        '    Part("motors x2",     "steel/copper/aluminium",        180.0, "weee"),',
        '    Part("controller",    "PCB + components",              120.0, "weee"),',
        '    Part("battery",       "LiFePO4 2S",                    310.0, "battery-takeback"),',
        '    Part("tyres x2",      "TPU",                            44.0, "landfill"),',
        ']',
        '',
        'def mass_balance(parts):',
        '    total = sum(p.mass_g for p in parts)',
        '    routes = {}',
        '    for p in parts:',
        '        routes[p.route] = routes.get(p.route, 0.0) + p.mass_g',
        '    print(f"total mass: {total:.0f} g")',
        '    for r, m in sorted(routes.items(), key=lambda kv: -kv[1]):',
        '        print(f"  {r:18s} {m:7.0f} g  {100.0 * m / total:5.1f}%")',
        '    return total, routes',
        '',
        'def disintegration(initial_g: float, measurements):',
        '    """measurements: list of (week, mass_g) from the mesh-bag compost trial."""',
        '    for wk, m in measurements:',
        '        print(f"week {wk:2d}: {m:7.1f} g  ({100.0 * (1 - m / initial_g):5.1f}% mass loss)")',
        '    # A credible 12-week result for low-density mycelium composite in active compost',
        '    # is substantial mass loss; a densified, heat-pressed panel will be much slower.',
        '    # Whatever you measure is the answer. If it is 8%, say 8% and show the photo.',
        '',
        'mass_balance(PASSPORT)',
      ].join('\n'),
      note:
        'The headline number is not "it composts" — it is the four-way mass split (compost / metal / WEEE / landfill) and the measured 12-week disintegration curve. Publish both.',
    },
    metrics: [
      { label: 'compostable fraction of total mass', value: '%, by design and as built (measured)' },
      { label: 'disassembly time to the plan', value: 'minutes with one tool, no cutting (measured)' },
      { label: '12-week mass loss in active compost', value: '% of initial dry mass, low density vs heat-pressed high density (measured; expect the trade-off to be large)' },
      { label: 'residue fragments >2 mm after 12 weeks', value: 'g and count (measured — the honest micro-residue number)' },
      { label: 'compost pile thermophilic phase', value: 'days above 55 °C (measured)' },
      { label: 'battery and WEEE mass routed to certified take-back', value: '% (measured — needs a receipt, not an intention)' },
    ],
    stretchGoals: [
      'Make the shell itself the shipping box and the packaging, so nothing is discarded at unboxing.',
      'Grow the chassis with an embedded nutrient channel that accelerates composting at end of life.',
      'Persuade the motor supplier to document a take-back route and put that document in the passport.',
      'Build a second unit and run a 12-month service-life trial to find the real durability limit of the low-density shell.',
    ],
    safety: [
      'Buy spawn from a reputable supplier and never culture wild moulds, even for a part you plan to compost. You are producing material that will be handled at end of life by someone who did not grow it.',
      'Wear an N95/P2 respirator, gloves and eye protection for all cutting, sanding and composting work. Retrieving and sieving a 12-week-old mycelium composite block in a compost pile is a high-spore-aerosol operation — do it outdoors or under extraction.',
      'Anyone immunocompromised must not handle the compost trials. Aspergillus and other thermophilic moulds are enriched in compost, and the mesh-bag retrieval deliberately disturbs them.',
      'Do not compost the electronics, the battery or the motors. LiFePO4/LiPo packs are a fire and chemical hazard if punctured — take them to a certified battery take-back point, and never put a pack in a compost heap or household waste.',
      'Keep the compost bin away from the house, from food-growing beds and from any edible crop, and do not use the resulting compost on food crops — you cannot verify what has colonised the pile. The robot is also a machine during its service life: fuse the battery, guard the drivetrain, and use an isolated conformal-coated low-voltage supply. Never combine wet organic substrate handling with mains voltage, and never charge the pack on a damp surface.',
    ],
    lessonLinks: ['w8l15', 'w8l16', 'w7l14'],
    sources: [
      { label: 'Alemu et al., Int. J. Polym. Sci. 2022 — mycelium composites as biodegradable materials; water uptake and degradation', url: 'https://onlinelibrary.wiley.com/doi/10.1155/2022/8401528' },
      { label: 'Elsacker PhD thesis (VUB) — densification, heat pressing and material durability trade-offs', url: 'https://cris.vub.be/ws/files/67445971/Elsacker_PhD_for_share_small.pdf' },
      { label: 'TU Eindhoven ICSBM 2025 — mycelium-based composites as engineered biodegradable materials', url: 'https://pure.tue.nl/ws/portalfiles/portal/380536871/ICSBM_2025_Proceedings_-_Vol2.pdf' },
      { label: 'MDPI Fibers 2024 — mycelium composite characterisation and durability (open-access review section)', url: 'https://mdpi-res.com/d_attachment/fibers/fibers-12-00057/article_deploy/fibers-12-00057.pdf' },
    ],
  },

  {
    id: 'myc-pond-boat',
    title: 'Omi Ẹ̀rọ — Mycofilter Water-Quality Robot Boat',
    tagline:
      'A pond robot that samples water and passes it through a living mycelium filtration module, measuring what the fungus actually removes — and what it adds.',
    category: 'mycelium',
    difficulty: 'master',
    buildTime: '6–8 weeks',
    costBand: '$$$',
    wakandaIndex: 88,
    diyFeasibility: 44,
    scienceGrounding: 62,
    realitySplit: {
      real:
        'Dead fungal biomass and mycelium composites genuinely adsorb heavy metals, dyes and some organic pollutants through biosorption — this is a large, real literature grounded in the chemistry of chitin, chitosan and glucans in the cell wall. You can measure a real concentration decrease across a filter module with a colorimeter or an ISE.',
      narrative:
        '"A living mycelium filter cleans the pond." A living module also releases organic carbon, spores and nutrients into the water, and its capacity saturates and then reverses. A credible project measures removal efficiency AND leaching AND saturation, and states that the module is a research filter, not a water treatment device.',
    },
    summary:
      'A small catamaran robot that navigates to GPS waypoints on a pond, draws 500 mL samples, runs them through a mycelium filtration module at a controlled flow rate, and measures turbidity, pH, conductivity, temperature, and one target analyte (nitrate by ISE, or a metal by colorimetric assay) before and after. You characterise the module properly: breakthrough curve, saturation capacity, and the honest control — the same module with dead biomass and the same module with an inert filter. The robot is the sampling platform; the science is the adsorption isotherm.',
    science:
      'Fungal cell walls are a composite of chitin, chitosan, glucans and proteins, presenting amine, hydroxyl, carboxyl and phosphate groups that bind metal cations and many dyes by ion exchange, complexation and physical adsorption. This is biosorption, and it is well documented for a wide range of fungal biomass, including spent mushroom substrate. The kinetics are usually fast initially and then slow, following pseudo-first or pseudo-second order, and the equilibrium is described by Langmuir or Freundlich isotherms. The engineering limits are unambiguous: capacity is finite, it saturates, and at low pH the amine groups protonate and release the bound cations back into solution. That last point is not a footnote — it is the failure mode that turns a filter into a source. Your project must show the breakthrough curve and the desorption test, not just a single removal percentage.',
    billOfMaterials: [
      { item: 'Catamaran hull (2× 500 mm pontoons) + 2× 12 V thrusters', qty: '1', note: 'Stable enough to carry a 2 L sample reservoir without pitching' },
      { item: 'Pixhawk or an ESP32 + GPS + compass autopilot stack', qty: '1', note: 'Waypoint navigation with a 3 m acceptance radius' },
      { item: 'Peristaltic pump 12 V, 10–100 mL/min + silicone tubing', qty: '1', note: 'Single-use tubing per sampling day' },
      { item: 'Mycelium filtration module: 60 mm ID column, 100 mm bed of mycelium composite granules', qty: '3', note: 'Granules 2–5 mm; also make a dead-biomass control and an inert sand control' },
      { item: 'Turbidity: DFRobot SEN0189 or a DIY 850 nm LED + photodiode pair', qty: '1', note: 'DIY gives you the calibration curve, which is the point' },
      { item: 'Atlas Scientific pH, conductivity and nitrate ISE probes', qty: '1 set', note: 'The nitrate ISE is the target analyte; calibrate daily' },
      { item: 'Colorimetric reagent kit for one metal (e.g. iron or copper) + a 525 nm LED photometer', qty: '1 set', note: 'Gives you a second, independent analyte' },
      { item: 'DS18B20 waterproof temperature probe', qty: '1', note: 'Adsorption is temperature dependent; log it' },
      { item: 'Sample bottles 250 mL × 6 + a 2 L reservoir + a rinse pump', qty: '1 set', note: 'Rinse the line with sample before collecting' },
      { item: 'Sterile gloves, 70% IPA, and a cool box for sample transport', qty: '1 set', note: 'Sample integrity is a lab skill, not a robot feature' },
      { item: 'Conformal coating + IP67 enclosures for all electronics', qty: '1 set', note: 'It is a boat' },
      { item: 'Reference lab analysis: send 6 split samples to a certified lab', qty: '1 set', note: 'The only way to validate your DIY sensors against reality' },
    ],
    buildSteps: [
      {
        title: 'Build the mycelium filtration module and measure its hydraulics first',
        detail:
          'Granulate dried mycelium composite to 2–5 mm, pack a 60 mm column to a 100 mm bed, and measure the pressure drop versus flow. Set your operating flow at the point where the bed is not channelling. Report the empty bed contact time — without it, removal percentages are not comparable to anything.',
      },
      {
        title: 'Validate your sensors against split samples',
        detail:
          'Before you trust a single reading, split 6 water samples, measure them with your DIY sensors and send duplicates to a certified lab. Report the disagreement. This step is what makes the project credible and it is the step that amateurs skip.',
      },
      {
        title: 'Build the sampling system',
        detail:
          'A submersible intake 200 mm below the surface, a rinse cycle that discards the first 100 mL, then a 500 mL sample. Pump the sample through the module at a fixed flow and collect the effluent in a second bottle. Log the pump volume by timed calibration.',
      },
      {
        title: 'Autopilot the waypoints',
        detail:
          'Define 5 waypoints across the pond, including one near an inflow and one in open water. Tune the position controller until the boat holds within 3 m. A boat that cannot hold station is not sampling the same water twice.',
      },
      {
        title: 'Run the baseline survey',
        detail:
          'Measure the raw pond water at each waypoint with no module inline: turbidity, pH, conductivity, temperature, nitrate and the target metal. This is your spatial baseline, and it will surprise you by varying more between waypoints than your filter changes.',
      },
      {
        title: 'Trace the breakthrough curve',
        detail:
          'Recirculate 2 L of spiked water through the module at a fixed flow and log effluent concentration every 5 minutes for 4 hours. Plot C_out/C_in versus bed volumes. Report the bed volumes to 10% and 50% breakthrough — those two numbers are the module’s real specification.',
      },
      {
        title: 'Fit the isotherm',
        detail:
          'Run batch tests at 5, 10, 25, 50 and 100 mg/L of the target analyte with a fixed biomass dose. Fit Langmuir and Freundlich and report q_max and the affinity constant. Batch isotherms plus a column breakthrough curve is a complete, publishable characterisation.',
      },
      {
        title: 'Run the desorption test — the honest one',
        detail:
          'Take a saturated module and pass pH 4 water through it. Measure how much of the bound analyte comes back. If the answer is "most of it", that is the headline finding and the reason the module cannot be deployed as a treatment device without pH control.',
      },
      {
        title: 'Quantify what the module adds',
        detail:
          'Measure effluent COD or organic carbon, turbidity and spore count. A living module leaches organic matter and spores into the water. Report the increase — releasing fungal spores into a water body is an ecological question you must at least measure.',
      },
    ],
    code: {
      language: 'cpp',
      snippet: [
        '// Boat sampler: waypoint navigation + timed sample/filter cycle with sensor logging.',
        '// Written for an ESP32 + GPS + compass, differential thrust.',
        'const float ACCEPT_RADIUS_M = 3.0f;',
        'const float SAMPLE_ML_PER_S = 4.0f;      // peristaltic, calibrated by weighing water',
        'const int   RINSE_ML = 100;',
        'const int   SAMPLE_ML = 500;',
        '',
        'void takeSampleAt(float lat, float lon) {',
        '  steerTo(lat, lon);',
        '  while (distanceTo(lat, lon) > ACCEPT_RADIUS_M) { updateNav(); }',
        '  stopThrusters();',
        '  delay(5000);                            // let the wake settle before sampling',
        '  pumpDose(RINSE_ML / SAMPLE_ML_PER_S);   // discard the rinse volume',
        '  pumpDose(SAMPLE_ML / SAMPLE_ML_PER_S);  // collect the sample',
        '  // Then pass the sample through the module and log pre/post sensors.',
        '  logTurbidity("raw");',
        '  runFilterModule();',
        '  logTurbidity("filtered");',
        '  logProbes();                            // pH, EC, temperature, nitrate, metal assay',
        '}',
        '',
        '// Sample volume is derived from time x calibrated flow. Recalibrate the flow every',
        '// session by pumping into a graduated cylinder for 60 s and weighing it. Tubing',
        '// creep changes the flow by 10-20% over a day, which silently corrupts your',
        '// concentrations and therefore every removal percentage you report.',
      ].join('\n'),
      note:
        'Report bed volumes to breakthrough, not a single removal percentage. "Removed 80% of copper" without a bed volume and an empty bed contact time is not a result.',
    },
    metrics: [
      { label: 'DIY vs certified-lab sensor disagreement', value: '% for turbidity, nitrate and the target metal (measured — report it)' },
      { label: 'bed volumes to 10% breakthrough', value: 'BV (measured, the module’s real specification)' },
      { label: 'Langmuir q_max for the target analyte', value: 'mg/g of dry biomass (measured, batch isotherm)' },
      { label: 'desorption at pH 4', value: '% of bound analyte released (measured — the honest failure mode)' },
      { label: 'effluent organic carbon increase; waypoint holding accuracy', value: 'mg/L leached across the module, and m RMS on station (measured — the module is a source of carbon as well as a filter)' },
      { label: 'spatial variation between waypoints', value: 'coefficient of variation of raw turbidity and nitrate across 5 waypoints (measured)' },
    ],
    stretchGoals: [
      'Run the module in a real pond for 7 days and measure biofouling of the bed — real water fouls filters in ways tap water does not.',
      'Try a chitosan-extracted variant of the biomass and compare q_max to the raw composite.',
      'Add a second module in series and measure whether the second one does anything at all (usually very little).',
      'Build a closed-loop path planner that samples more densely where the measured turbidity gradient is steepest.',
    ],
    safety: [
      'Never drink water from the pond and never let the sampling system touch drinking water. Pond water carries pathogenic bacteria, protozoa and cyanotoxins; treat every surface the water touches as contaminated, wear gloves, and disinfect the boat and tubing with 70% IPA or dilute bleach after each session — in a ventilated area, never mixing bleach with acid or ammonia.',
      'Buy spawn from a reputable supplier. Do not introduce a living fungal module into a natural water body without checking local environmental rules — releasing spores and organic carbon into a pond is a real ecological intervention and some jurisdictions regulate it. The sensible design flies the module as a closed, removable cartridge.',
      'Wear an N95/P2 when handling dry granulated mycelium composite while packing the column, and when retrieving a spent module. A saturated module is a wet, mouldy, spore-laden object.',
      'Anyone immunocompromised must not handle the water samples, the spent modules or the compost of them. Pond water plus fungal biomass is a combined microbiological risk.',
      'The boat is a 12 V DC system near water: fuse the pack, use IP67 enclosures with cable glands, conformal-coat every board, and never charge the battery on board or near the water. Never run mains-powered equipment on a dock next to a wet boat, and never combine wet organic substrate or pond water with mains voltage.',
      'LiPo/LiFePO4 pack: charge in a fireproof bag, never unattended, and inspect after any water ingress event. A swamped pack is a fire risk — if the hull floods, remove the pack and dispose of it.',
      'Alcohol and bleach disinfection: use in a ventilated area, never mix bleach with acid or ammonia, and store bleach away from the peroxide or IPA you may also be using.',
    ],
    lessonLinks: ['w6l12', 'w8l16', 'w2l4'],
    sources: [
      { label: 'MDPI Agronomy 2025 — microbial fuel cell / bio-electrochemical treatment tables and electrode materials', url: 'https://mdpi-res.com/d_attachment/agronomy/agronomy-15-01392/article_deploy/agronomy-15-01392.pdf' },
      { label: 'Frontiers in Fungal Biology 2025 — living mycelium materials: sensing and environmental function', url: 'https://www.frontiersin.org/journals/fungal-biology/articles/10.3389/ffunb.2025.1739847/full' },
      { label: 'ScienceDirect — decolorisation of azo dye and electricity generation with a white-rot fungus cathode (biosorption and enzymatic treatment)', url: 'https://www.sciencedirect.com/science/article/abs/pii/S0306261916318086' },
      { label: 'Frontiers in Materials 2026 — fungal-derived functional carbons: adsorption and electrochemical performance (review)', url: 'https://www.frontiersin.org/journals/materials/articles/10.3389/fmats.2026.1796209/full' },
    ],
  },
];
