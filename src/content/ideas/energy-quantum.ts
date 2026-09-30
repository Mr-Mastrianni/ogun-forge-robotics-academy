import type { IdeaProject } from '../types';

/* ------------------------------------------------------------------ */
/* ENERGY — exotic-sounding energy, grounded in measured physics       */
/* ------------------------------------------------------------------ */

export const energyProjects: IdeaProject[] = [
  {
    id: 'energy-atmos-potential-probe',
    title: 'Fair-Weather Field Mill',
    tagline: 'Measure the 100–300 V/m sky-to-earth potential gradient without a kite, a storm or a Darwin Award.',
    category: 'energy',
    difficulty: 'journeyman',
    buildTime: '3–5 weekends',
    costBand: '$$',
    wakandaIndex: 55,
    diyFeasibility: 78,
    scienceGrounding: 92,
    realitySplit: {
      real:
        'The fair-weather potential gradient is a measured, textbook quantity: about 100 V/m at the surface, closer to 120 V/m over flat clear ground, driven by the global atmospheric electric circuit. The air-earth conduction current is about 2 pA/m², the electrosphere sits near +400 kV relative to the ground, and the whole circuit is maintained by roughly 1–2 kA of thunderstorm charging worldwide. A field mill or a shielded collector plus a femtoampere-class electrometer resolves all of it.',
      narrative:
        'The "free energy from the sky" story. The circuit is real, but the extractable power is minuscule: current density times field is 2 pA/m² × 100 V/m = 0.2 nW/m². Even a 100 m conducting tether with a 100 m² collector reaches only the low microwatt range, which is why nobody powers a city this way. Treat any "µW from a small plate" claim as scale-dependent optimism, not a discovery.',
    },
    summary:
      'Build a rotating-shutter field mill or a guarded shielded collector and log the fair-weather field, its diurnal Carnegie-curve variation and its perturbation by charged objects — then compute the honest harvesting ceiling.',
    science:
      'A field mill chops the ambient field with a grounded rotating shutter; the induced charge on a sensing plate appears as an AC current that is synchronously demodulated, which avoids the drift of a DC electrometer. A shielded collector does the same job electrostatically: a plate behind a perforated shield charges to the local potential, and an op-amp with sub-picoampere input bias (LMC6001, OPA129 or AD549 class) buffers it into an ADC. Guard rings, PTFE standoffs and cleaning matter more than the op-amp part number, because surface leakage at 10 GΩ feedback is the real error term. The diurnal minimum near 03 UT and afternoon maximum is the Carnegie curve — the electrical heartbeat of the planet.',
    billOfMaterials: [
      { item: 'Sensing plate, 100 mm aluminium or brass disc', qty: '1', note: 'Polished, solvent-cleaned, mounted on PTFE' },
      { item: 'LMC6001 or OPA129 electrometer op-amp', qty: '2', note: 'Sub-pA input bias; buy a spare' },
      { item: 'AD549-class femtoampere op-amp', qty: '1', note: 'Alternative front end for comparison' },
      { item: '10 GΩ and 100 GΩ glass-bodied resistors', qty: '2 each', note: 'Feedback network; keep flux off the body' },
      { item: 'ADS1115 16-bit ADC breakout', qty: '1', note: 'Or an ADS1256 if you want 24-bit logging' },
      { item: 'Small geared DC motor + chopper blade', qty: '1', note: 'Field-mill variant, 20–60 Hz chop' },
      { item: 'Perforated Faraday shield, 10 mm mesh', qty: '1 sheet', note: 'Ground it to the local earth rod only' },
      { item: 'PTFE standoffs, guard-ring prototyping board', qty: '1 set', note: 'Leakage is the whole game' },
      { item: 'ESP32 or Raspberry Pi Pico logger', qty: '1', note: 'Timestamped CSV at 1–10 Hz' },
      { item: 'Copper earth rod, 1.2 m + clamp', qty: '1', note: 'Single-point earth, never mains earth' },
    ],
    buildSteps: [
      { title: 'Build the guarded front end first', detail: 'Mount the electrometer op-amp on a clean board with a guard ring driven to the same potential as the input. Clean with isopropyl alcohol and dry with warm air. With the input floating, you should see a stable offset, not a wandering ramp; a ramp means leakage or humidity and the fix is cleaning and conformal coating, not a new chip.' },
      { title: 'Add the sensing plate and shield', detail: 'Mount the plate on PTFE so only the guarded node sees it. Place the grounded perforated shield 5–10 mm above the plate. The shield defines the local potential; the plate measures the field through the holes. Keep cable runs short and use a triaxial or air-spaced connection.' },
      { title: 'Calibrate against a known field', detail: 'Put the sensor between two large parallel plates and apply a known voltage to make a known field (E = V/d). Sweep 0–1000 V/m and fit volts-out per V/m. Record the zero offset with the plates shorted, and repeat the zero check at the start and end of every session.' },
      { title: 'Make the field mill variant', detail: 'For the rotating version, drive a slotted grounded blade over a segmented sensing plate at 20–60 Hz and lock-in amplify at the blade frequency. The AC path rejects DC drift and 1/f noise far better than the shielded collector, at the cost of a motor and mechanical balance.' },
      { title: 'Log a 24-hour fair-weather run', detail: 'Site the sensor away from buildings, trees and vehicles, which distort the local field by factors of two or more. Log field and weather for at least 24 hours. Plot the smoothed magnitude against UTC and identify the Carnegie-curve minimum near 03 UT.' },
      { title: 'Perturb and verify', detail: 'Bring a charged acrylic rod or a balloon rubbed on wool to a fixed distance and confirm the sign and magnitude response. Then compute the ceiling: integrate J·E over your collector area and compare with the measured harvested power through a matched load. The gap between the two is your instrumentation and leakage loss.' },
    ],
    code: {
      language: 'python',
      snippet:
        'import numpy as np, time\n\n# Field mill: synchronous demodulation of the induced AC signal\n# fs sampling rate, f_chop blade frequency, block = whole chop cycles\nfs = 5000.0\nf_chop = 40.0\nblock = int(round(fs / f_chop)) * 20\n\ndef field_from_block(v, fs, f_chop, gain_v_per_vm):\n    v = np.asarray(v, dtype=float)\n    v = v - v.mean()\n    n = len(v)\n    t = np.arange(n) / fs\n    ref_i = np.sin(2 * np.pi * f_chop * t)\n    ref_q = np.cos(2 * np.pi * f_chop * t)\n    i = 2.0 / n * np.dot(v, ref_i)\n    q = 2.0 / n * np.dot(v, ref_q)\n    amp = np.hypot(i, q)\n    return amp / gain_v_per_vm  # volts per metre\n\n# Calibration: apply E = V/d between plates, fit gain_v_per_vm\nprint(field_from_block(np.random.randn(block), fs, f_chop, 1.0))',
      note: 'Lock-in demodulation is the difference between a field mill and a random number generator. Calibrate gain with parallel plates before trusting any absolute number.',
    },
    metrics: [
      { label: 'fair-weather field', value: '100–300 V/m (about 120 V/m over flat clear ground)' },
      { label: 'noise floor', value: '< 20 V/m rms after 60 s averaging' },
      { label: 'Carnegie-curve peak-to-trough ratio', value: '≥ 1.3 over a 24 h run' },
      { label: 'input leakage current', value: '< 1 pA at the guarded node' },
      { label: 'harvesting ceiling', value: '≈ 0.2 nW/m² (J·E at 2 pA/m² and 100 V/m)' },
    ],
    stretchGoals: [
      'Run three sensors 200 m apart and correlate the field with a local lightning-detection network.',
      'Add a slow electrometer channel measuring the air conductivity via a Gerdien condenser.',
      'Compare a field mill head-to-head with a shielded collector over a full weather front passage.',
    ],
    safety: [
      'Never fly a kite, balloon, rocket or tethered conductor near or under a thunderstorm. The historical kite experiment is a documented way to die; the electrosphere is not a lab supply.',
      'Use a single dedicated earth rod for the sensor and never tie it to mains earth or a building ground, which can inject fault current into your instrumentation.',
      'Clean high-impedance nodes with solvent only in a ventilated area and let them dry fully; residual flux plus humidity creates leakage paths that look like real field drift.',
      'The field mill motor and chopper blade are a pinch hazard. Enclose the head or keep fingers clear while it spins.',
    ],
    lessonLinks: ['w2l3', 'w6l12', 'w8l15'],
    sources: [
      { label: 'Atmospheric electricity — global circuit, 100 V/m, 2 pA/m²', url: 'https://en.wikipedia.org/wiki/Atmospheric_electricity' },
      { label: 'Global atmospheric electrical circuit — Carnegie curve and thunderstorm current', url: 'https://en.wikipedia.org/wiki/Global_atmospheric_electrical_circuit' },
      { label: 'Field mill — rotating-shutter field measurement principle', url: 'https://en.wikipedia.org/wiki/Field_mill' },
      { label: 'ARM field-mill sensor field campaign report (OSTI)', url: 'https://www.osti.gov/biblio/1810309' },
    ],
  },
  {
    id: 'energy-telluric-current-sensor',
    title: 'Telluric Current Listening Post',
    tagline: 'Non-polarising electrodes, a zero-drift amplifier, and millivolts per kilometre from the planet itself.',
    category: 'energy',
    difficulty: 'journeyman',
    buildTime: '2–4 weekends',
    costBand: '$$',
    wakandaIndex: 62,
    diyFeasibility: 58,
    scienceGrounding: 84,
    realitySplit: {
      real:
        'Telluric currents are a standard geophysical signal. Natural geomagnetic variation — solar wind driving the magnetosphere, plus worldwide thunderstorm activity above 1 Hz — induces electric fields in the Earth, and magnetotellurics (MT) infers subsurface conductivity from the ratio of electric to magnetic field. Surveys span 10 kHz to 0.1 mHz and depths from about 100 m to 200 km. MT is used commercially for geothermal exploration and has identified hundreds of megawatts of reservoir potential in Japan and the Philippines.',
      narrative:
        'The "Earth battery" and ley-line framing. Sticking two rods in the ground does produce a voltage, and almost all of it is electrode polarisation and soil chemistry, not planetary power. Telluric signals are microvolts to millivolts with a source impedance high enough that you cannot extract useful bulk power. The prize is information about the subsurface, not watts.',
    },
    summary:
      'Build a two-electrode telluric dipole with non-polarising Cu/CuSO4 half-cells, amplify with a chopper-stabilised instrumentation amplifier, and log the natural electric field alongside a magnetometer to estimate apparent resistivity.',
    science:
      'A bare metal electrode in soil develops a drifting half-cell potential as its surface chemistry changes, and that drift buries the signal. A copper rod in saturated copper sulfate inside a porous pot fixes the half-cell reaction to the well-known Cu/Cu²⁺ couple (about +0.316 V vs SHE) and drops drift to fractions of a millivolt per day. The telluric signal itself is small: strong MT events reach tens to hundreds of millivolts per kilometre, quiet days are far below that, and the band of interest runs from about 0.001 Hz to 10 kHz. Skin depth, δ ≈ 503 √(ρ/f) metres for resistivity ρ in Ω·m and frequency f in Hz, sets how deep a given frequency sees — conductive clay shields you and resistive granite lets you see deep. Pairing E with B from a coil magnetometer gives the impedance tensor and hence apparent resistivity and phase.',
    billOfMaterials: [
      { item: 'Copper rod electrodes, 12 mm × 300 mm', qty: '4', note: 'Two in service, two as spares; clean with scotchbrite' },
      { item: 'Copper sulfate (CuSO4·5H2O), 500 g', qty: '1', note: 'Make a saturated solution; irritant and an environmental hazard' },
      { item: 'Porous ceramic pots or PVC cups with gypsum plug', qty: '4', note: 'Home-made non-polarising half-cells' },
      { item: 'Bentonite clay', qty: '2 kg', note: 'Backfill to keep contact and moisture stable' },
      { item: 'ADA4522 or LTC2050 zero-drift op-amp', qty: '3', note: 'Chopper-stabilised front end, < 1 µV offset drift' },
      { item: 'INA333 or AD8220 instrumentation amp', qty: '2', note: 'Differential input for the dipole pair' },
      { item: 'ADS1256 24-bit ADC board', qty: '1', note: 'Low-noise, 30 kSPS, differential' },
      { item: 'Insulated field wire, 100 m', qty: '2', note: 'Twisted pair reduces magnetic pickup' },
      { item: 'Induction-coil magnetometer, 10–100 mH ferrite', qty: '1', note: 'Reference B channel for MT' },
      { item: 'GPS-disciplined logger (Pi + GPS module)', qty: '1', note: 'Timestamping matters for remote reference' },
    ],
    buildSteps: [
      { title: 'Make the non-polarising electrodes', detail: 'Fill a porous pot with saturated CuSO4 solution and stand a cleaned copper rod in it. The pot must be wet but not dripping. Soak overnight. Measure the potential between two new electrodes in a bucket of soil; anything above about 2 mV drift per day means contamination or a dry pot.' },
      { title: 'Lay out the dipole', detail: 'Drive the electrodes 30–100 m apart on a roughly straight line, backfill with bentonite and water. Keep the wire off the surface where animals and vehicles can snag it, and away from power lines. Record the exact spacing, because everything scales with it.' },
      { title: 'Build a guarded differential front end', detail: 'Use a zero-drift instrumentation amplifier with a gain of 1000 in the first stage, then a second stage for band-limiting to 0.001–100 Hz. Guard the input traces, use a metal enclosure tied to the common electrode, and power from batteries to avoid ground loops.' },
      { title: 'Shorted-input noise test', detail: 'Short the two inputs together at the electrode end and log for an hour. You need the shorted noise floor to be well under the signal you hope to see. If it is not, the problem is almost always thermal EMF from connectors or 1/f drift, not the ADC.' },
      { title: 'Add the magnetic reference channel', detail: 'Wind a coil on a ferrite core with a known area-turns product, amplify with a low-noise op-amp, and log it in the same timebase. Coherence between E and B is what distinguishes real telluric signal from local electrode noise.' },
      { title: 'Estimate apparent resistivity', detail: 'Compute the E/B spectral ratio with a robust estimator over several hours. Convert to apparent resistivity and phase versus frequency, then invert a simple two-layer model. Compare a quiet day with a geomagnetically active day and confirm the signal rises with Kp index.' },
    ],
    code: {
      language: 'python',
      snippet:
        'import numpy as np\n\n# Apparent resistivity from the MT impedance, one frequency at a time\n# E in V/m (dipole voltage / spacing), B in T\ndef skin_depth(rho_ohm_m, f_hz):\n    return 503.0 * np.sqrt(rho_ohm_m / f_hz)\n\ndef apparent_resistivity(E, B, f_hz, mu0=4e-7 * np.pi):\n    E = np.asarray(E, dtype=float)\n    B = np.asarray(B, dtype=float)\n    # cross-spectral impedance Z = <E B*> / <B B*>\n    EB = np.mean(E * np.conj(B))\n    BB = np.mean(B * np.conj(B))\n    Z = EB / BB\n    rho_a = np.abs(Z) ** 2 / (mu0 * 2 * np.pi * f_hz)\n    phase_deg = np.degrees(np.angle(Z))\n    return rho_a, phase_deg, skin_depth(rho_a, f_hz)\n\nprint(apparent_resistivity([1e-6, 2e-6], [1e-9, 2e-9], 0.1))',
      note: 'A resistive half-space gives a phase near 45 degrees; conductive sediments drop it. Phase is the more robust diagnostic when amplitudes are noisy.',
    },
    metrics: [
      { label: 'electrode drift', value: '< 1 mV/day after 48 h soak' },
      { label: 'shorted-input noise floor', value: '< 5 µV rms in a 0.01–10 Hz band' },
      { label: 'signal detected', value: '0.1–100 mV/km in the MT band on an active day' },
      { label: 'E–B coherence', value: '≥ 0.8 at the signal peak' },
      { label: 'depth of investigation', value: 'tens of metres to kilometres depending on frequency' },
    ],
    stretchGoals: [
      'Run two dipoles in an L and compute a 2-D apparent-resistivity pseudosection.',
      'Correlate telluric noise with a nearby DC railway or tram and document the anthropogenic interference.',
      'Build a remote-reference channel 10 km away over the internet to cancel local noise.',
    ],
    safety: [
      'Copper sulfate is harmful if swallowed, an eye and skin irritant, and toxic to aquatic life. Wear nitrile gloves and eye protection, mix outdoors or in a fume hood, and never pour waste down a drain — collect and dispose as chemical waste.',
      'Long field wires are a trip and vehicle hazard. Mark them, run them along fences where possible, and never string them across a road.',
      'Call the underground utility locate service before driving any stake. Hitting a gas or power line with a ground rod can kill you.',
      'Long spans pick up lightning-induced surges. Disconnect and shunt the input at the first sign of a storm, and never work the electrodes during one.',
    ],
    lessonLinks: ['w2l3', 'w6l12', 'w8l15'],
    sources: [
      { label: 'Magnetotellurics — method, depth range, geothermal exploration', url: 'https://en.wikipedia.org/wiki/Magnetotellurics' },
      { label: 'Telluric current — origin and measurement', url: 'https://en.wikipedia.org/wiki/Telluric_current' },
      { label: 'Copper–copper(II) sulfate electrode — reference half-cell potential', url: 'https://en.wikipedia.org/wiki/Copper%E2%80%93copper(II)_sulfate_electrode' },
    ],
  },
  {
    id: 'energy-teg-thermal-probe',
    title: 'Borehole ΔT Harvester',
    tagline: 'Seebeck physics, zT honesty, and a real watt-hour budget for a buried sensor.',
    category: 'energy',
    difficulty: 'apprentice',
    buildTime: '2–3 weekends',
    costBand: '$$',
    wakandaIndex: 58,
    diyFeasibility: 82,
    scienceGrounding: 90,
    realitySplit: {
      real:
        'The Seebeck effect converts a temperature difference directly into a voltage, and commercial Bi₂Te₃ modules have a dimensionless figure of merit zT near 1 with module-level values around 0.3–0.6, giving 5–8% conversion efficiency. The continental geothermal gradient is 25–30 °C per kilometre, mean continental heat flow is about 65 mW/m², and a compost heap or shallow borehole easily gives 20–50 K across a module. A matched load then yields 100 mW to a few watts, enough for a remote sensor.',
      narrative:
        'The "unlimited geothermal power from a garden hole" fantasy. A single module in soil harvests milliwatts to watts because heat flow is small and the thermal path is dominated by the soil and the heat sink, not by the module. Scaling to kilowatts means kilometres of drilling and industrial plants, not a bigger TEG.',
    },
    summary:
      'Bury or compost-mount a Bi₂Te₃ thermoelectric module across a real temperature difference, characterise its open-circuit voltage and matched-load power curve, and size a remote sensor duty cycle from the measured watt-hours.',
    science:
      'For a thermoelectric module, open-circuit voltage is V_oc = S ΔT with an effective Seebeck coefficient S of roughly 100–300 µV/K per junction and tens of millivolts per kelvin at the module level. The maximum power into a matched load is P_max = V_oc² / (4 R_int), so internal resistance dominates the design. The thermodynamic ceiling is the Carnot efficiency, and the material ceiling is set by zT = S²σT/κ, which is why commercial modules sit near 5–8% while the best laboratory materials (SnSe at zT ≈ 2.6) promise more but are not in modules you can buy. In the ground, the usable ΔT is limited by soil thermal conductivity and the heat sink: a module pressed between a 55 °C compost core and a 10 °C surface, with a good finned sink, is a realistic and legal experiment.',
    billOfMaterials: [
      { item: 'Bi₂Te₃ TEG module (TEG1-241 or SP1848-27145)', qty: '2–4', note: 'Match modules electrically; note the hot-side limit' },
      { item: 'Aluminium heat sink, 100 × 100 mm finned', qty: '2', note: 'One per module; thermal paste both faces' },
      { item: 'Thermal paste, high conductivity', qty: '1 tube', note: 'Interface resistance is the usual efficiency thief' },
      { item: 'DS18B20 waterproof temperature probes', qty: '4', note: 'Measure both module faces and ambient' },
      { item: 'INA219 or INA226 current/voltage monitor', qty: '2', note: 'Log the I–V curve under load' },
      { item: 'bq25570 energy-harvesting boost charger', qty: '1', note: 'Cold-starts from microwatts, 488 nA quiescent' },
      { item: '1 F / 5.5 V supercapacitor', qty: '1', note: 'Buffer for sensor bursts' },
      { item: 'ESP32-C3 or nRF52 sensor node', qty: '1', note: 'Deep sleep between measurements' },
      { item: 'Compost bin or 1 m soil auger hole', qty: '1', note: 'The heat source; turn the heap for a steady 55–65 °C' },
    ],
    buildSteps: [
      { title: 'Characterise a module on the bench', detail: 'Clamp one module between a hot plate and an ice-water heat sink. Measure V_oc and I_sc at ΔT = 5, 10, 20, 40 K, then sweep a decade of load resistors and record power. The peak of the power curve gives R_int. Do this before you bury anything so you have a reference.' },
      { title: 'Build the buried stack', detail: 'Sandwich each module between a copper spreader in the hot zone and a heat sink in the cool zone. Use thermal paste and even clamping pressure; a bowed module cracks. Seal the assembly against moisture with silicone, leaving the fins exposed.' },
      { title: 'Install into the heat source', detail: 'For a compost heap, push the hot side into the core where thermophilic bacteria hold 55–70 °C. For a borehole, drop the hot junction and run the sink to the surface. Record depths and temperatures; do not backfill with dry sand, which is a thermal insulator.' },
      { title: 'Log the power curve in situ', detail: 'Use the INA219 to sweep load resistance once an hour and record the full power curve, not just one operating point. The matching resistance changes with ΔT, which is exactly why a fixed load wastes power.' },
      { title: 'Design the sensor duty cycle from data', detail: 'Measure how long the bq25570 takes to charge the supercapacitor to 3.3 V, then compute how many sensor-and-radio bursts fit per hour. Set the node to sleep at a few microamps and wake only to sample and transmit.' },
      { title: 'Quantify the losses', detail: 'Compare measured power with the model P = (SΔT)²/(4R_int). Attribute the shortfall to interface resistance, fin effectiveness and parasitic heat flow around the module, and improve the worst term.' },
    ],
    code: {
      language: 'python',
      snippet:
        'import numpy as np\n\n# TEG matched-load model and power budget\ndef teg_power(S_v_per_k, dT, R_int):\n    v_oc = S_v_per_k * dT\n    return v_oc ** 2 / (4.0 * R_int), v_oc\n\ndef duty_cycle(power_w, energy_per_burst_j, awake_s):\n    # bursts per hour for a node whose radio+sensor draws power_w while awake\n    e_awake = power_w * awake_s\n    return 3600.0 * (power_w / max(e_awake, 1e-12)) if False else (power_w * 3600.0) / max(energy_per_burst_j, 1e-12)\n\nS = 0.05      # 50 mV/K module-level effective Seebeck\nR = 3.0       # ohms internal resistance\nfor dT in (5, 10, 20, 40):\n    p, v = teg_power(S, dT, R)\n    print(f"dT={dT:2d} K  Voc={v:5.2f} V  Pmax={p*1000:7.1f} mW")',
      note: 'The square law in ΔT is why doubling the temperature difference quadruples the power. Chase ΔT, not module count.',
    },
    metrics: [
      { label: 'temperature difference', value: '20–50 K across the module in service' },
      { label: 'open-circuit voltage', value: '1–3 V for a 20–40 K ΔT module stack' },
      { label: 'matched-load power', value: '100 mW–2 W depending on stack and heat sink' },
      { label: 'conversion efficiency', value: '3–6% measured, against a 5–8% catalogue figure' },
      { label: 'node autonomy', value: '≥ 48 h of scheduled bursts on the supercapacitor alone' },
    ],
    stretchGoals: [
      'Compare two heat-sink geometries and quantify fin effectiveness against the model.',
      'Run a year-long log and correlate harvested energy with heap temperature and rainfall.',
      'Add a second stage using a Peltier module in reverse to hold the cold side below ambient passively at night.',
    ],
    safety: [
      'Thermophilic compost holds 55–70 °C and can release CO₂ and mould spores. Wear gloves and a dust mask when turning the heap, and never put your head into the core.',
      'Hot module faces and heat sinks cause contact burns. Use gloves and let the stack cool before disassembly.',
      'A hand-dug borehole can collapse. Never enter a hole deeper than your knees, and shore or case anything deeper.',
      'Do not drill or auger near buried services. Check for gas, water and power lines and get permission for the land.',
    ],
    lessonLinks: ['w3l6', 'w2l4', 'w8l15'],
    sources: [
      { label: 'Thermoelectric generator — Seebeck effect, 5–8% efficiency, zT', url: 'https://en.wikipedia.org/wiki/Thermoelectric_generator' },
      { label: 'Thermoelectric materials — zT records and module performance', url: 'https://en.wikipedia.org/wiki/Thermoelectric_materials' },
      { label: 'Geothermal gradient — 25–30 °C/km and heat flow', url: 'https://en.wikipedia.org/wiki/Geothermal_gradient' },
      { label: 'Seebeck effect — physical mechanism', url: 'https://en.wikipedia.org/wiki/Seebeck_effect' },
    ],
  },
  {
    id: 'energy-geothermal-heatflow-sim',
    title: 'Heat-Flow Simulator Driving a Real TEG',
    tagline: 'Solve the 1-D heat equation, then let the model switch a real thermoelectric stack.',
    category: 'energy',
    difficulty: 'journeyman',
    buildTime: '3–4 weekends',
    costBand: '$$',
    wakandaIndex: 64,
    diyFeasibility: 80,
    scienceGrounding: 86,
    realitySplit: {
      real:
        'Fourier conduction, heat capacity and thermal resistance networks are exact engineering, and the numbers are measured: 25–30 °C/km gradient, 65 mW/m² mean continental heat flow (a newer 38,000-station compilation gives 91.6 mW/m² and 47 TW total heat loss), 47 ± 2 TW of global heat flow with roughly half radiogenic. A finite-difference model of a borehole or compost heap can predict the hot-side temperature within a few kelvin, and that prediction can drive a real relay switching a TEG into its matched load.',
      narrative:
        'The "simulate it and you have built a power plant" leap. The model is a design tool, not an energy source. The simulator will happily predict temperatures for heat flows you cannot reach without a drilling rig.',
    },
    summary:
      'Write a 1-D finite-difference heat-conduction model of a soil column or compost heap, calibrate it against buried thermocouples, then let the live model drive a load-switching circuit on a real TEG stack and log the predicted-versus-measured power curve.',
    science:
      'The governing equation is the transient heat equation with a source term, ∂T/∂t = α ∂²T/∂z² + q/(ρc), where α = k/(ρc) is thermal diffusivity. A soil column is discretised into layers with k in the 0.3–1.5 W/(m·K) range for dry to wet soil, and the surface boundary condition is a convective and radiative exchange with air temperature. The geothermal flux enters as a fixed bottom gradient. Adding a TEG means adding a thermal resistance and a heat pump load: the module removes heat at P_electric/η, so the model and the electrical load are coupled. Calibrating k against measured thermocouple data is the real experiment; the payoff is a model that predicts harvestable power for a site before you dig.',
    billOfMaterials: [
      { item: 'DS18B20 waterproof probes', qty: '6', note: 'One per 200 mm depth plus surface and air' },
      { item: 'Bi₂Te₃ TEG module', qty: '2', note: 'Driven by the model through a relay or MOSFET' },
      { item: 'DHT22 temperature/humidity sensor', qty: '1', note: 'Surface boundary condition' },
      { item: 'ESP32 or Pi Pico with Wi-Fi', qty: '1', note: 'Runs the model and logs' },
      { item: 'Relay or logic-level MOSFET load switch', qty: '1', note: 'Switches the TEG into a matched resistor bank' },
      { item: 'Resistor bank, 1–100 Ω, 5 W', qty: '1 set', note: 'Programmable load for the power curve' },
      { item: 'Soil auger and 1 m PVC liner', qty: '1', note: 'Access for probes; case the hole' },
      { item: 'Saturated soil or compost media', qty: '1 bin', note: 'Known moisture beats field variability for calibration' },
    ],
    buildSteps: [
      { title: 'Build the soil column and instrument it', detail: 'Fill a tall bin or a cased hole with soil at a measured moisture content. Place thermocouples at known depths and insulate the sides so heat flow is predominantly vertical. Record the bottom and surface temperatures continuously.' },
      { title: 'Write the finite-difference solver', detail: 'Discretise the column into 20–50 nodes and step the heat equation explicitly or implicitly. Use an implicit scheme so you can take large time steps without instability. Fit k and the surface heat-transfer coefficient to the measured transient.' },
      { title: 'Validate the model', detail: 'Drive the surface temperature with a step change and compare the modelled and measured depth response. A correct k makes the thermal wave arrive at the right time; a correct heat-transfer coefficient makes the amplitude right. Report the residual in kelvin.' },
      { title: 'Couple the model to the harvester', detail: 'Add the TEG as a thermal resistance between hot and cold nodes and compute P_max = (SΔT)²/(4R_int). Feed that prediction to the microcontroller, which switches the real module into the resistor that the model says is matched.' },
      { title: 'Run a model-versus-hardware experiment', detail: 'For a week, log predicted and measured hot-side temperature, predicted and measured power, and the switching decisions. Plot both on one axis and report the error statistics rather than a single best-case number.' },
      { title: 'Publish the power curve', detail: 'Produce a measured power-versus-ΔT curve with the model overlaid, plus the site\'s estimated gradient. That curve is the deliverable a remote-sensing team would actually use to size a harvester.' },
    ],
    code: {
      language: 'python',
      snippet:
        'import numpy as np\n\n# 1-D implicit finite difference for soil heat conduction\n# C dT/dt = k d2T/dz2 ; surface convective, bottom fixed flux\ndef build_system(n, dz, k, rho_c, dt, h_surf, q_bottom):\n    a = k / rho_c * dt / dz ** 2\n    A = np.zeros((n, n))\n    b = np.zeros(n)\n    for i in range(1, n - 1):\n        A[i, i - 1] = -a\n        A[i, i] = 1 + 2 * a\n        A[i, i + 1] = -a\n    A[0, 0] = 1 + a + h_surf * dt / (rho_c * dz)\n    A[0, 1] = -a\n    A[-1, -1] = 1\n    A[-1, -2] = -1\n    b[-1] = q_bottom * dz / k\n    return A, b\n\ndef step(T, A, b, T_air):\n    rhs = b.copy()\n    rhs[0] += h_surf * dt_placeholder(T_air)\n    return np.linalg.solve(A, rhs)\n\ndef dt_placeholder(x):\n    return 0.0\n\nn, dz, dt = 30, 0.05, 10.0\nA, b = build_system(n, dz, 1.0, 2.0e6, dt, 8.0, 0.065)\nprint(A.shape, "nodes", n)',
      note: 'Use an implicit scheme: explicit stepping on a fine soil grid forces impractically small time steps and blows up overnight.',
    },
    metrics: [
      { label: 'model hot-side temperature error', value: '< 3 K RMS over a week' },
      { label: 'power prediction error', value: '< 20% at matched load' },
      { label: 'estimated gradient', value: '20–35 °C/km from the fitted model' },
      { label: 'thermal diffusivity fit', value: '0.3–1.0 mm²/s for moist soil' },
      { label: 'simulation stability', value: 'no oscillation over 10⁶ steps' },
    ],
    stretchGoals: [
      'Add a soil-moisture-dependent k and validate against a wetting event.',
      'Run the same model for a lunar regolith column using published k ≈ 0.01 W/(m·K) in vacuum.',
      'Close the loop: let the model choose the load resistance in real time and compare against a fixed load.',
    ],
    safety: [
      'Compost heat and spores: gloves and a dust mask when handling media, and never breathe the core gases.',
      'Wet soil plus electronics is a shock and corrosion hazard. Use extra-low-voltage DC only, and keep mains far from the column.',
      'Do not auger near buried services, and never enter an unsupported hole.',
      'Hot TEG faces and resistor banks burn. Mount them where they cannot be brushed and let them cool before handling.',
    ],
    lessonLinks: ['w4l7', 'w6l11', 'w8l15'],
    sources: [
      { label: 'Geothermal gradient — 25–30 °C/km, thermal conductivity context', url: 'https://en.wikipedia.org/wiki/Geothermal_gradient' },
      { label: "Earth's internal heat budget — 47 TW, 91.6 mW/m² compilation", url: 'https://en.wikipedia.org/wiki/Earth%27s_internal_heat_budget' },
      { label: 'Thermoelectric generator — matched-load power and efficiency', url: 'https://en.wikipedia.org/wiki/Thermoelectric_generator' },
    ],
  },
  {
    id: 'energy-piezo-floor-tile',
    title: 'Footstep Piezo Tile',
    tagline: 'Bridge rectifier, supercapacitor, and an honest millijoule-per-step budget.',
    category: 'energy',
    difficulty: 'apprentice',
    buildTime: '2 weekends',
    costBand: '$',
    wakandaIndex: 50,
    diyFeasibility: 88,
    scienceGrounding: 80,
    realitySplit: {
      real:
        'Lead zirconate titanate (PZT) discs under a footstep generate a short high-voltage, high-impedance AC burst, and a bridge rectifier plus a supercapacitor can capture a few millijoules per step. Piezoelectricity is a well-characterised material effect, the rectifier and storage maths is exact, and a low-duty-cycle BLE beacon genuinely can be powered by a busy doorway.',
      narrative:
        'The viral "these tiles power the whole station" claim. Commercial tile-array reviews keep finding that measured energy is millijoules per step, and that the "watts per step" numbers circulating online are instantaneous peak power or plain fiction. A doorway harvests milliwatts averaged over a day.',
    },
    summary:
      'Build a PZT-disc floor tile with a Schottky bridge rectifier and supercapacitor buffer, measure the energy captured per footstep, and close the loop with a duty-cycle calculator for a BLE beacon.',
    science:
      'A PZT disc is a capacitor that also generates charge when strained: the open-circuit voltage can reach tens of volts per disc for a few millimetres of deflection, but the source impedance is capacitive and large, so the delivered energy is small. Energy per step is roughly E = ½ C V² stored after rectification, minus diode drops and dielectric loss; a 70 kg person compressing a stack through a few millimetres yields order 1–10 mJ. Because the pulse is short and spiky, you must rectify into a capacitor rather than try to run a load directly, and you must clamp the voltage so the piezo does not exceed the rectifier or storage rating. The duty-cycle calculation is then simple: bursts per hour = harvested power × 3600 / energy per burst.',
    billOfMaterials: [
      { item: 'PZT discs, 27 mm brass-backed', qty: '20', note: 'Stack in parallel groups to raise current' },
      { item: 'BAT54S Schottky diodes', qty: '12', note: 'Low forward drop bridge rectifiers' },
      { item: '1 F / 5.5 V supercapacitor', qty: '2', note: 'Buffer; watch the leakage current' },
      { item: '5.1 V Zener or TVS clamp', qty: '4', note: 'Protects storage from voltage spikes' },
      { item: 'bq25570 boost charger breakout', qty: '1', note: 'Extracts down to microwatts and regulates 3.3 V' },
      { item: 'nRF52840 or ESP32-C3 BLE module', qty: '1', note: 'Beacon with a deep-sleep timer' },
      { item: 'Plywood, rubber mat, springs or foam', qty: '1 set', note: 'Mechanical deflection and return' },
      { item: 'INA219 current/voltage monitor', qty: '1', note: 'Measures charge into the capacitor' },
    ],
    buildSteps: [
      { title: 'Measure one disc properly', detail: 'Clamp a single disc under a known load and record open-circuit voltage and short-circuit charge with an oscilloscope and a high-impedance probe. Compute its capacitance and charge coefficient. Do not extrapolate from a datasheet number; your mounting changes everything.' },
      { title: 'Build the rectifier and clamp', detail: 'Wire each group of discs into a Schottky bridge and clamp the output with a Zener or TVS. Verify on the scope that the clamp holds under the hardest stomp; a 100 V spike will kill a 5.5 V capacitor and the charger.' },
      { title: 'Assemble the tile', detail: 'Mount the discs between rigid plates so the load is compressive and evenly distributed. Add foam or springs for return travel and to stop the stack from being crushed. Any bending mode will crack discs quickly.' },
      { title: 'Measure millijoules per step', detail: 'Discharge the supercapacitor to a known voltage, deliver a fixed number of steps, and measure the voltage rise. E = ½ C (V₂² − V₁²) gives the captured energy per step with no hand-waving about peak power.' },
      { title: 'Close the energy budget', detail: 'Measure the beacon current and duration per advertising event, then compute energy per burst. Divide the measured harvested power by that to get bursts per minute, and verify the prediction over an hour of walking.' },
      { title: 'Publish the honest number', detail: 'Report joules per step, average harvested power over a realistic footfall rate, and the beacon duty cycle. Contrast it with the "watts per step" claim and explain the difference between peak and average power.' },
    ],
    code: {
      language: 'python',
      snippet:
        'C = 1.0            # farads\nV1, V2 = 3.00, 3.20\nsteps = 50\nE_step = 0.5 * C * (V2**2 - V1**2) / steps\nprint(f"{E_step*1000:.2f} mJ per step")\n\n# BLE beacon budget: 3.3 V, 8 mA for 2 ms per advertising event\nE_burst = 3.3 * 0.008 * 0.002\nrate = E_step * 2.0  # 2 steps per second walking\nprint(f"max burst rate = {rate / E_burst:.1f} events/s")',
      note: 'This is the whole argument in six lines. Peak voltage is not energy; the capacitor equation is.',
    },
    metrics: [
      { label: 'energy per footstep', value: '1–10 mJ captured at the capacitor' },
      { label: 'per-disc open-circuit peak', value: '10–60 V under a 70 kg step' },
      { label: 'rectifier efficiency into the capacitor', value: '40–70% at these voltage levels' },
      { label: 'supercapacitor charge time', value: 'to 3.3 V in 100–500 steps' },
      { label: 'BLE beacon duty cycle', value: '1–10 advertising events per minute from a busy doorway' },
    ],
    stretchGoals: [
      'Compare series and parallel disc wiring for the same mechanical input.',
      'Add a maximum-power-point tracker and show the improvement over a directly connected load.',
      'Run a 24-hour doorway trial and report true average power, including idle leakage.',
    ],
    safety: [
      'PZT contains lead. Handle with gloves, do not sand or break discs, and dispose of failed discs as hazardous waste rather than household rubbish.',
      'The piezo voltage spike can exceed 100 V. Clamp it, discharge the storage capacitor through a resistor before touching the circuit, and keep the tile wiring enclosed.',
      'A floor tile with moving plates is a pinch and trip hazard. Cover it with a non-slip mat and keep edges flush.',
      'Do not install a harvestable tile in a fire escape or accessibility route where the added height or deflection could cause a fall.',
    ],
    lessonLinks: ['w3l6', 'w2l3', 'w6l12'],
    sources: [
      { label: 'Piezoelectricity — mechanism, materials and energy conversion', url: 'https://en.wikipedia.org/wiki/Piezoelectricity' },
      { label: 'Energy harvesting — piezoelectric and storage overview', url: 'https://en.wikipedia.org/wiki/Energy_harvesting' },
      { label: 'Lead zirconate titanate — the PZT material used in tiles', url: 'https://en.wikipedia.org/wiki/Lead_zirconate_titanate' },
      { label: 'Walk-to-Watt: physics-based review of piezoelectric floor tile arrays', url: 'https://zenodo.org/records/20918740' },
    ],
  },
  {
    id: 'energy-triboelectric-nanogenerator',
    title: 'Contact-Separation TENG',
    tagline: 'Kilovolts at nanoamps: where the triboelectric effect really lives.',
    category: 'energy',
    difficulty: 'apprentice',
    buildTime: '1–2 weekends',
    costBand: '$',
    wakandaIndex: 66,
    diyFeasibility: 84,
    scienceGrounding: 82,
    realitySplit: {
      real:
        'Contact electrification is a reproducible physical effect: two materials with different affinities exchange surface charge on contact and separate, and the resulting electrostatic field drives a tiny current through an external circuit. Contact-separation triboelectric nanogenerators routinely produce hundreds to thousands of volts open-circuit with nanoamp to microamp short-circuit currents, and the literature reports optimised power densities from fractions of a watt to several watts per square metre.',
      narrative:
        'The "TENG powers a city" framing. Voltage is not power. A simple proof-of-concept with foil and PTFE delivers microwatts to milliwatts because the source is a small capacitor charged to a large voltage, and the current is limited by how fast charge can move across a high impedance. Humidity destroys reproducibility, which is why university demonstrations are run in dry gloves and a dry room.',
    },
    summary:
      'Build a contact-separation TENG from PTFE and aluminium, measure its open-circuit voltage, short-circuit charge and matched-load power honestly, and explain why the kilovolt reading is not a kilowatt.',
    science:
      'In contact-separation mode, pressing two triboelectrically dissimilar surfaces together equalises their surface charge density σ, typically 10–100 µC/m² for a good pair. Separating them raises the voltage as the capacitance falls: V = Q/C, so a large gap gives a large voltage for a tiny charge. Short-circuit current is set by the rate of charge transfer, I = dQ/dt, hence kilohertz mechanical excitation and thin dielectrics are what raise current. The device behaves as a voltage source behind a large capacitive impedance, so the matched condition is not a simple resistor, and the maximum extractable energy per cycle is approximately ½ Q V. Surface treatment (nanostructuring, ionised corona charging) is what turns a demo into a real generator, and it is also what makes results hard to repeat in humid air.',
    billOfMaterials: [
      { item: 'PTFE or FEP film, 50–100 µm', qty: '2 sheets', note: 'The negative triboelectric partner' },
      { item: 'Aluminium foil or tape', qty: '1 roll', note: 'Positive electrode and back contact' },
      { item: 'Acrylic or 3-D printed frame', qty: '1 set', note: 'Keeps the plates parallel and the gap controlled' },
      { item: 'Foam or spring spacers', qty: '1 set', note: 'Defines the separation and return force' },
      { item: 'High-impedance buffer: LMC6001 or INA116', qty: '2', note: 'Do not load the TENG with a normal voltmeter' },
      { item: '10 GΩ and 1 GΩ resistors', qty: '2 each', note: 'Divider for scope measurement' },
      { item: 'Oscilloscope or high-impedance DAQ', qty: '1', note: '≥ 10 MΩ input, preferably 100 MΩ' },
      { item: 'Servo or shaker for repeatable excitation', qty: '1', note: 'Repeatability beats hand tapping' },
      { item: 'Hygrometer', qty: '1', note: 'Relative humidity is a first-order variable' },
    ],
    buildSteps: [
      { title: 'Build a parallel-plate stack', detail: 'Glue aluminium foil to one rigid plate and PTFE film to the other, with the foil as the contact surface and a second foil as the PTFE back electrode. Mount them in a frame with foam spacers so the gap is a few millimetres and the plates stay parallel.' },
      { title: 'Measure voltage without loading it', detail: 'Connect a 1 GΩ or 10 GΩ divider and an oscilloscope, or a high-impedance electrometer buffer. A standard 10 MΩ scope probe will drain the device faster than it charges and give a misleadingly small reading.' },
      { title: 'Excite it repeatably', detail: 'Drive the moving plate with a servo or a shaker at 1–20 Hz with a fixed travel. Record V_oc and the charge transferred per cycle (integrate current). Hand tapping makes the data unusable for a power claim.' },
      { title: 'Measure the matched-load curve', detail: 'Sweep load resistance from 1 kΩ to 100 GΩ and record delivered power. The peak identifies the source impedance and gives an honest maximum power. Report the load at which it occurs, not just the peak value.' },
      { title: 'Quantify humidity effects', detail: 'Run the same experiment at 30%, 50% and 70% relative humidity. Surface charge leaks away faster in damp air, and the drop is often an order of magnitude. This is why TENG demos are run in a dry box.' },
      { title: 'Harvest into a capacitor', detail: 'Rectify with a bridge and charge a small capacitor to run a clock or a single LED pulse. Measure the time to reach a usable voltage and compute average power, which is the only number that matters.' },
    ],
    code: {
      language: 'python',
      snippet:
        'import numpy as np\n\n# TENG as a voltage source behind a capacitive impedance\n# V_oc = sigma * d / eps0  (parallel-plate, small gap model)\neps0 = 8.854e-12\ndef v_open_circuit(sigma_c_per_m2, gap_m):\n    return sigma_c_per_m2 * gap_m / eps0\n\nsigma = 50e-6      # 50 uC/m^2, good tribo pair\ngap = 1e-3         # 1 mm\nV = v_open_circuit(sigma, gap)\nC = eps0 * 1e-4 / gap      # 10 cm^2 plate, 1 mm gap\nQ = C * V\nE_per_cycle = 0.5 * Q * V\nprint(f"Voc = {V:,.0f} V, Q = {Q*1e9:.2f} nC, E/cycle = {E_per_cycle*1e6:.2f} uJ")',
      note: 'The model shows the trade: a larger gap raises voltage linearly but lowers capacitance, so energy per cycle saturates. Voltage alone is not the goal.',
    },
    metrics: [
      { label: 'open-circuit voltage', value: '100–1500 V depending on gap and surface treatment' },
      { label: 'short-circuit current', value: '10 nA–5 µA at 1–20 Hz' },
      { label: 'charge per cycle', value: '0.1–20 nC for a 10 cm² plate' },
      { label: 'matched-load power', value: '1–100 µW for a hand-built unit' },
      { label: 'humidity sensitivity', value: 'output falls by 5–20× from 30% to 70% RH' },
    ],
    stretchGoals: [
      'Corona-charge the PTFE and quantify how much the surface treatment raises output.',
      'Build a stacked multi-layer TENG and measure whether the layers add in parallel or in series.',
      'Power a wireless temperature node from footstep excitation and report true average microwatts.',
    ],
    safety: [
      'The device stores kilovolts on a small capacitance. It can give a sharp shock: discharge through a 1 MΩ resistor before handling, and never touch the plates while the shaker is running.',
      'Do not use a TENG near anyone with a pacemaker or implanted electronic device; the high-voltage transient can interfere.',
      'PTFE fumes are hazardous if overheated. Do not machine, laser-cut or burn the film; cut it with scissors and ventilate.',
      'Metallic foil edges are sharp. Deburr them and tape the frame so nobody cuts a finger on the electrode.',
    ],
    lessonLinks: ['w2l3', 'w6l12', 'w8l15'],
    sources: [
      { label: 'Triboelectric effect — contact electrification and charge transfer', url: 'https://en.wikipedia.org/wiki/Triboelectric_effect' },
      { label: 'Nanogenerator — triboelectric and piezoelectric energy conversion', url: 'https://en.wikipedia.org/wiki/Nanogenerator' },
      { label: 'Conductive elastomer-integrated TENG for self-powered sensing (AIP Advances)', url: 'https://pubs.aip.org/aip/adv/article-split/16/2/025111/3378797/' },
    ],
  },
  {
    id: 'energy-plant-microbial-fuel-cell',
    title: 'Plant Microbial Fuel Cell',
    tagline: 'Rhizodeposition feeds electrogenic bacteria; you get 10–200 mW/m² and a very patient sensor.',
    category: 'energy',
    difficulty: 'apprentice',
    buildTime: '6–10 weeks (biology is slow)',
    costBand: '$',
    wakandaIndex: 64,
    diyFeasibility: 82,
    scienceGrounding: 86,
    realitySplit: {
      real:
        'A plant microbial fuel cell is a documented, peer-reviewed device. Living roots release rhizodeposits — sugars, organic acids and dead root cells — which electrogenic bacteria such as Geobacter and Shewanella oxidise at a carbon-felt anode, sending electrons through an external circuit to an oxygen-reducing cathode. Typical power densities are 10–200 mW/m² with open-circuit voltages of 0.4–0.9 V, and soil-based cells are sold as classroom kits.',
      narrative:
        'The "grow a power plant in your garden" framing. A PMFC is a sensor battery, not a generator. Internal resistance is kilo-ohms, output drifts with temperature and plant health, and it takes weeks to stabilise. It will run a duty-cycled sensor; it will not run a motor.',
    },
    summary:
      'Build a planted sediment fuel cell with a carbon-felt anode and an air-breathing cathode, characterise its power density and internal resistance over six weeks, and use it to run a low-duty-cycle environmental sensor through a bq25570 boost charger.',
    science:
      'The anode reaction is bacterial oxidation of organic matter to CO₂, protons and electrons; the cathode reduces oxygen at the water-air interface. The cell voltage is the difference between the anode and cathode potentials, typically 0.4–0.8 V, and the current is limited by the rate at which bacteria transfer electrons and by the internal resistance of the soil, membrane and electrode. Power density is normalised per square metre of anode projection: PMFCs commonly deliver tens of milliwatts per square metre, with the best reported devices reaching a few hundred. Because a sensor sleeps at microamps and wakes for milliseconds, the figure of merit is energy per day, not continuous power — that mismatch is exactly why a PMFC is a good robot-sensor battery and a bad robot motor supply.',
    billOfMaterials: [
      { item: 'Carbon felt anode, 200 × 200 mm', qty: '1', note: 'High surface area; the bacterial habitat' },
      { item: 'Activated-carbon or carbon-cloth cathode', qty: '1', note: 'Floats at the water-air interface' },
      { item: 'Titanium or graphite wire', qty: '3 m', note: 'Corrosion-resistant current collector' },
      { item: 'Reed sweetgrass, rice or Spartina plant', qty: '1–3', note: 'Rhizodeposition drives the cell' },
      { item: 'Potting soil, organic-rich', qty: '10 L', note: 'Inoculum plus nutrient buffer' },
      { item: 'bq25570 boost charger', qty: '1', note: 'Cold-starts at microwatts and regulates 3.3 V' },
      { item: '1 F / 5.5 V supercapacitor', qty: '1', note: 'Stores energy for the transmit burst' },
      { item: 'INA219 + resistor bank 10 Ω–10 kΩ', qty: '1', note: 'Polarisation curve measurement' },
      { item: 'BME280 + nRF52 sensor node', qty: '1', note: 'Temperature, humidity, pressure; BLE or LoRa burst' },
      { item: 'Reference electrode (Ag/AgCl), optional', qty: '1', note: 'Separates anode and cathode behaviour' },
    ],
    buildSteps: [
      { title: 'Assemble the cell', detail: 'Put a layer of soil, then the carbon-felt anode, then more soil, and plant into it. Float the cathode on the water surface or sandwich it just below the waterline where oxygen is available. Keep the anode anoxic and the cathode aerated; that separation is the whole device.' },
      { title: 'Let it colonise', detail: 'Fill with water and leave it for two to four weeks without drawing power. A PMFC is a biofilm reactor first. Expect the open-circuit voltage to climb and then plateau at 0.4–0.8 V as electrogenic bacteria establish.' },
      { title: 'Measure the polarisation curve', detail: 'Sweep load resistance from 10 Ω to 10 kΩ and record voltage and current after a few minutes at each point. Plot power versus current; the peak gives the maximum power and the slope of the V-I line gives internal resistance.' },
      { title: 'Normalise honestly', detail: 'Divide power by anode projected area in square metres to get mW/m². Report temperature and days since inoculation with every figure, because both move the number by 2–5×.' },
      { title: 'Wire the sensor node', detail: 'Connect the cell to the bq25570 so it accumulates charge in the supercapacitor, and configure the node to wake only when the capacitor crosses a threshold. Log wake events and energy per burst.' },
      { title: 'Run a six-week trial', detail: 'Log cell voltage, capacitor charge time, temperature and plant condition daily. Plot energy per day and identify the stabilisation time. Report the duty cycle the cell actually sustained, not the one the datasheet promised.' },
    ],
    code: {
      language: 'python',
      snippet:
        'import numpy as np\n\n# Polarisation curve -> internal resistance and max power density\ndef analyse_polarisation(load_ohm, v_cell, area_m2):\n    load_ohm = np.asarray(load_ohm, dtype=float)\n    v_cell = np.asarray(v_cell, dtype=float)\n    i = v_cell / load_ohm\n    p = v_cell * i\n    # linear fit V = Voc - I*Rint over the ohmic region\n    fit = np.polyfit(i, v_cell, 1)\n    r_int = -fit[0]\n    v_oc = fit[1]\n    p_max_theory = v_oc ** 2 / (4 * r_int)\n    idx = int(np.argmax(p))\n    return {\n        "R_int_ohm": r_int,\n        "V_oc": v_oc,\n        "P_max_mW_per_m2": p[idx] / area_m2 * 1000.0,\n        "P_max_model_mW_per_m2": p_max_theory / area_m2 * 1000.0,\n    }\n\nprint(analyse_polarisation([10, 100, 1000, 10000], [0.05, 0.30, 0.52, 0.70], 0.04))',
      note: 'The linear-region fit is only valid below the mass-transport knee. Discard points where the curve bends over before fitting R_int.',
    },
    metrics: [
      { label: 'open-circuit voltage', value: '0.4–0.8 V after colonisation' },
      { label: 'power density', value: '10–200 mW/m² anode (report temperature and age)' },
      { label: 'internal resistance', value: '< 2 kΩ after four weeks' },
      { label: 'sustained sensor duty cycle', value: 'one measurement and transmit burst every 5–15 min' },
      { label: 'stabilisation time', value: '2–4 weeks to plateau' },
    ],
    stretchGoals: [
      'Compare a planted cell against an unplanted control to isolate the rhizodeposition contribution.',
      'Add a second cell in series and quantify the voltage gain versus the increased internal resistance.',
      'Run a full year and correlate daily energy with photosynthetically active radiation.',
    ],
    safety: [
      'Stagnant water grows mould, algae and potentially Legionella. Wear gloves, do not aerosolise or drink the water, and wash hands after handling.',
      'Never use manure or sewage as an inoculum in a home or classroom; use commercial potting soil and keep the vessel covered.',
      'The electrical output is below 1 V and safe, but the bq25570 and any LiFePO4 cell you add can deliver significant current. Fuse the battery and use a protected cell.',
      'Dispose of spent soil and water responsibly; do not pour it into a storm drain.',
    ],
    lessonLinks: ['w2l4', 'w6l12', 'w8l15'],
    sources: [
      { label: 'Microbial fuel cell — plant MFC, power generation and applications', url: 'https://en.wikipedia.org/wiki/Microbial_fuel_cell' },
      { label: 'Bioenergy generation and rhizodegradation in coupled wetland-MFC systems', url: 'https://www.sciencedirect.com/science/article/abs/pii/S0048969717316625' },
      { label: 'Frontiers in Bioengineering — plant microbial fuel cell review (repository copy)', url: 'https://uwe-repository.worktribe.com/OutputFile/11884446' },
    ],
  },
  {
    id: 'energy-solar-supercap-node',
    title: 'Solar-Supercapacitor Field Node',
    tagline: 'Indoor and outdoor irradiance differ by 100×; MPPT and duty cycle are how you survive it.',
    category: 'energy',
    difficulty: 'apprentice',
    buildTime: '1–2 weekends',
    costBand: '$$',
    wakandaIndex: 38,
    diyFeasibility: 92,
    scienceGrounding: 94,
    realitySplit: {
      real:
        'Photovoltaics, maximum power point tracking and duty-cycled sensing are completely established engineering. Standard outdoor irradiance is about 1000 W/m² at AM1.5; indoor artificial lighting delivers roughly 1–10 W/m², and deep indoor corners can be below 0.1 W/m². A bq25570-class harvester cold-starts at around 330 mV and 15 µW with 488 nA quiescent current and up to 93% boost efficiency, which is exactly what makes a battery-free node possible.',
      narrative:
        'The "solar-powered forever robot" pitch. Indoors, a 10 cm² panel collects a few milliwatts, so the robot is a sensor that sleeps 99.9% of the time, not a rover. Compute the duty cycle or the project is fiction.',
    },
    summary:
      'Build a battery-free sensor node powered by a small panel and a supercapacitor, implement MPPT with a bq25570, and close the duty-cycle mathematics that predicts exactly how often it can transmit.',
    science:
      'A photovoltaic cell has a current-voltage curve with a single maximum-power point that moves with irradiance and temperature, so a fixed load wastes energy and an MPPT tracker samples the open-circuit voltage (typically 75–80% of V_oc is the MPP) or uses a fractional-open-circuit or perturb-and-observe algorithm. Indoor light is not just dimmer, it is spectrally different — fluorescent and LED light peaks where some cells are inefficient, and amorphous silicon or GaAs cells often outperform crystalline silicon indoors. Storage matters too: supercapacitors tolerate deep cycling and cold, but leak microamps, while LiFePO4 holds charge better but needs a proper charge profile. The node design is therefore an energy audit: harvested power times duty fraction must exceed sleep current plus the amortised burst energy.',
    billOfMaterials: [
      { item: '5 V 1 W crystalline silicon panel, 110 × 70 mm', qty: '1', note: 'Outdoor baseline' },
      { item: 'Indoor-optimised panel or GaAs/amorphous cell', qty: '1', note: 'For comparison under artificial light' },
      { item: 'bq25570 harvester breakout', qty: '1', note: 'Programmable MPPT, 330 mV cold start' },
      { item: '1 F / 5.5 V supercapacitor', qty: '2', note: 'Energy buffer; measure its leakage' },
      { item: 'LiFePO4 500 mAh cell + protection, optional', qty: '1', note: 'For multi-day autonomy' },
      { item: 'TPL5110 nano-timer', qty: '1', note: 'Hardware wake timer at tens of nanoamps' },
      { item: 'ESP32-C3 or nRF52840', qty: '1', note: 'Deep-sleep capable radio node' },
      { item: 'BME280 + INA219', qty: '1 each', note: 'Environment sensing and energy telemetry' },
      { item: 'IP65 enclosure and cable glands', qty: '1', note: 'Weatherproofing is a failure mode, not an accessory' },
    ],
    buildSteps: [
      { title: 'Measure the actual irradiance', detail: 'Put a calibrated small panel or a pyranometer at the intended site and log short-circuit current, which is proportional to irradiance, for a week. Site irradiance varies by more than an order of magnitude between a windowsill and a shaded shelf.' },
      { title: 'Characterise the panel', detail: 'Sweep a resistor decade and plot the I-V and power curves at your measured irradiance. Record V_oc and the MPP voltage as a fraction of V_oc. Confirm whether your bq25570 MPPT sample ratio (typically 80%) is close enough.' },
      { title: 'Build the harvesting chain', detail: 'Panel into the bq25570, storage on the supercapacitor or LiFePO4, and a regulated 3.3 V rail. Set the under-voltage lockout above the level where your radio browns out, not at zero.' },
      { title: 'Measure sleep current first', detail: 'Before optimising anything else, measure the node in sleep with a µA meter. A design that sleeps at 200 µA instead of 5 µA loses more energy than the panel collects indoors. Fix the quiescent budget first.' },
      { title: 'Compute and verify the duty cycle', detail: 'Measure energy per sense-and-transmit burst, then predict bursts per hour from measured harvested power. Run for 24 hours and compare predicted versus actual burst count.' },
      { title: 'Stress-test autonomy', detail: 'Cover the panel for two days and confirm the node recovers and resumes its schedule without a human reset. If it does not, the under-voltage lockout or the burst budget is wrong.' },
    ],
    code: {
      language: 'python',
      snippet:
        'import numpy as np\n\n# Duty-cycle budget for a battery-free node\ndef duty_budget(p_harvest_w, i_sleep_a, v_rail, e_burst_j, hours=24.0):\n    e_harvest = p_harvest_w * hours * 3600.0\n    e_sleep = i_sleep_a * v_rail * hours * 3600.0\n    usable = e_harvest - e_sleep\n    if usable <= 0:\n        return 0\n    return usable / e_burst_j\n\ndef irradiance_from_isc(i_sc_a, i_sc_ref_a=0.10, g_ref=1000.0):\n    return g_ref * i_sc_a / i_sc_ref_a\n\nfor g in (1000.0, 100.0, 10.0, 1.0):\n    p = g * 0.01 * 0.18   # 100 cm^2 panel at 18% efficiency\n    print(f"G={g:7.1f} W/m2 -> P={p*1000:8.3f} mW, bursts/day={duty_budget(p, 5e-6, 3.3, 5e-3):.0f}")\n\nprint(irradiance_from_isc(0.001))',
      note: 'The table is the project. Indoor light turns a "forever" node into a handful of transmissions per day, and that is a design fact, not a failure.',
    },
    metrics: [
      { label: 'outdoor harvested power', value: '0.5–1 W from a 1 W panel at 1000 W/m²' },
      { label: 'indoor harvested power', value: '0.2–10 mW from the same panel at 1–10 W/m²' },
      { label: 'cold-start threshold', value: '≈ 330 mV and 15 µW' },
      { label: 'sleep current', value: '< 5 µA including the wake timer' },
      { label: 'error between predicted and actual burst count', value: '< 15% over 24 h' },
      { label: 'autonomy with the panel covered', value: '≥ 48 h on storage alone' },
    ],
    stretchGoals: [
      'Implement perturb-and-observe MPPT on a microcontroller and compare it with fractional-V_oc against a fixed load.',
      'Compare crystalline silicon, amorphous silicon and GaAs cells under the same LED fixture.',
      'Add a second node and log a multi-day energy-balance comparison across two sites.',
    ],
    safety: [
      'Lithium cells can catch fire if overcharged, punctured or shorted. Use a protected cell with the correct charge profile, fuse the output, and never charge a LiFePO4 cell below freezing.',
      'A supercapacitor can deliver hundreds of amps into a short. Fuse it, and discharge through a resistor before rework.',
      'Weatherproof enclosures are an electrical-safety control: water ingress into a LiFePO4 pack is a fire risk, so use glands and a sealed box.',
      'Mount outdoor panels and masts so they cannot fall on people or overhead lines, and secure them against wind loading.',
    ],
    lessonLinks: ['w3l6', 'w6l12', 'w5l9'],
    sources: [
      { label: 'Maximum power point tracking — algorithms and fractional-V_oc', url: 'https://en.wikipedia.org/wiki/Maximum_power_point_tracking' },
      { label: 'Solar cell — irradiance, efficiency and indoor performance', url: 'https://en.wikipedia.org/wiki/Solar_cell' },
      { label: 'bq25570 datasheet — 330 mV cold start, 488 nA quiescent, MPPT', url: 'https://www.ti.com/product/BQ25570' },
      { label: 'Low-power PV cells under indoor artificial lighting (UPC)', url: 'https://upcommons.upc.edu/bitstream/handle/2117/426663/ieee_i2mtc_1.pdf' },
      { label: 'AlGaAs photovoltaics for indoor energy harvesting in mm-scale nodes', url: 'http://blaauw.engin.umich.edu/wp-content/uploads/sites/342/2017/11/TeranAlGaAsPhotovoltaicsforIndoorEnerg2015.pdf' },
    ],
  },
  {
    id: 'energy-betavoltaic-monte-carlo',
    title: 'Betavoltaic Monte-Carlo (Simulation Only)',
    tagline: 'Model beta capture and electron–hole pair yield — and never touch a radioisotope.',
    category: 'energy',
    difficulty: 'master',
    buildTime: '2–3 weekends',
    costBand: '$',
    wakandaIndex: 80,
    diyFeasibility: 76,
    scienceGrounding: 68,
    realitySplit: {
      real:
        'The conversion physics is genuine: beta particles from tritium (12.3 year half-life, 18.6 keV endpoint) or nickel-63 (100 years, 66 keV) create electron–hole pairs in a semiconductor junction, and a tritium cell the size of a coin produces about 100 µW at around 20 g (City Labs NanoTritium). A C-14 cell has been measured at 2.86% efficiency. The Monte-Carlo model of stopping power, pair generation and self-absorption is fully buildable in software.',
      narrative:
        'The "nuclear battery that runs your robot for 50 years" pitch, including unverified 2024 claims of 100 µW at 3 V in a 15 mm cube. Real betavoltaics deliver nanowatts to microwatts per cubic centimetre, power density falls as half-life rises, and any physical source is legally controlled. This project is explicitly simulation-only: students model the physics and do not acquire, open or fabricate a source.',
    },
    summary:
      'Build a Monte-Carlo simulation of beta emission, self-absorption and electron–hole pair creation in a semiconductor, predict power density for tritium and nickel-63, and pair every result with the regulatory rules that forbid handling the sources.',
    science:
      'A beta emitter has a continuous spectrum with an endpoint energy; the average energy for tritium is about 5.7 keV against an 18.6 keV endpoint. As a beta traverses the semiconductor it loses energy through ionisation, and each generated electron–hole pair costs roughly 2–3 times the bandgap, about 3.6 eV in silicon. Only carriers generated inside or within a diffusion length of the depletion region are collected, so the design trades source activity against self-absorption and junction depth. Power density scales inversely with half-life for a fixed activity budget: Ni-63 lasts centuries but produces far less current per gram than tritium. Radiation damage creates deep levels that reduce carrier lifetime, so long-life cells face a degradation the simulation should model.',
    billOfMaterials: [
      { item: 'Python 3 with NumPy and Matplotlib', qty: '1', note: 'All you need; no hardware' },
      { item: 'NIST ESTAR stopping-power tables (downloaded)', qty: '1', note: 'Validate the simulated stopping power' },
      { item: 'Semiconductor parameters: Si, SiC, GaN', qty: '1 set', note: 'Bandgap and pair-creation energy' },
      { item: 'Beta endpoint spectra for H-3, Ni-63, C-14', qty: '1 set', note: 'Use published spectra, not invented shapes' },
      { item: 'Spreadsheet for the regulatory checklist', qty: '1', note: '10 CFR 30.15/30.70 and IAEA equivalents' },
    ],
    buildSteps: [
      { title: 'Implement the beta spectrum sampler', detail: 'Sample endpoint energies from a published normalised beta spectrum for each isotope. Verify that the mean energy matches the tabulated value (about 5.7 keV for tritium) before proceeding.' },
      { title: 'Implement a CSDA transport model', detail: 'Use the continuous-slowing-down approximation with stopping power from a tabulated or fitted model. Track each particle through the source layer and into the semiconductor, recording the energy deposited in the active volume.' },
      { title: 'Convert deposited energy to carriers', detail: 'Divide deposited energy by the pair-creation energy for each material and apply a collection efficiency based on the generation depth relative to the depletion width and diffusion length. This is where most real losses live.' },
      { title: 'Self-absorption and geometry sweep', detail: 'Sweep source thickness and junction depth. Thin sources waste activity, thick ones self-absorb; there is an optimum, and finding it is the main result of the simulation.' },
      { title: 'Predict power density and compare', detail: 'Compute µW/cm² and W/kg for tritium and Ni-63 and compare with published values, including the 2.86% C-14 cell. Report the disagreement honestly rather than tuning parameters to match.' },
      { title: 'Write the safety and legal section as an output', detail: 'Produce a one-page summary of why the student must not handle the sources: external and internal dose, contamination control, and the licence regime. This page is a required deliverable, not an appendix.' },
    ],
    code: {
      language: 'python',
      snippet:
        'import numpy as np\n\nE_PAIR_SI = 3.6      # eV per electron-hole pair\nE_MEAN_H3 = 5.7e3    # eV, tritium mean beta energy\n\n# Simple CSDA slab model: fraction of beta energy deposited in the active layer\ndef deposited_fraction(thickness_um, range_um):\n    # uniform straight-line approximation, valid as a first cut only\n    x = min(thickness_um / range_um, 1.0)\n    return x * (2 - x) / 1.0 if x > 0 else 0.0\n\ndef pairs_per_decay(e_dep_ev):\n    return e_dep_ev / E_PAIR_SI\n\nfor t_um, r_um in [(0.1, 0.5), (0.3, 0.5), (0.5, 0.5)]:\n    f = deposited_fraction(t_um, r_um)\n    print(f"thickness {t_um} um -> deposited {f:.2f}, pairs/decay {pairs_per_decay(f*E_MEAN_H3):.0f}")',
      note: 'This is deliberately crude. Replace the straight-line range with a tabulated stopping power and a real beta spectrum before quoting any efficiency.',
    },
    metrics: [
      { label: 'simulated mean beta energy', value: 'within 5% of the tabulated value per isotope' },
      { label: 'pair yield at the optimum thickness', value: 'compare with the published C-14 cell at 2.86%' },
      { label: 'predicted power density', value: 'nW–µW per cm², matching the published range' },
      { label: 'self-absorption optimum', value: 'source thickness that maximises collected pairs' },
      { label: 'regulatory section', value: 'complete citation of the applicable licence category' },
    ],
    stretchGoals: [
      'Add radiation-damage accumulation and predict end-of-life power after 10 years.',
      'Model a three-dimensional interdigitated junction and compare with a planar cell.',
      'Reproduce the Betavolt 100 µW claim and state precisely which assumptions it requires.',
    ],
    safety: [
      'Do not acquire, possess, open or fabricate any radioactive source. Tritium, nickel-63 and carbon-14 are regulated byproduct or radioactive material; in the United States a general or specific licence is required and 10 CFR 30.15 exempts only specific tiny quantities in specific consumer items.',
      'Never open a tritium exit sign, a gaseous tritium light source or a smoke detector to extract material. Breakage causes internal contamination and creates radioactive waste you cannot legally dispose of.',
      'Do not follow online "DIY nuclear battery" instructions or buy unlicensed isotope samples from marketplaces. This is a legal and a health matter, and possession alone can be an offence.',
      'If you believe a source is damaged or leaking, stop, ventilate, restrict access, and contact your national regulator or a licensed radiation safety officer. Do not attempt cleanup yourself. In the United States the NRC and the IAEA publish the applicable rules and dose limits.',
    ],
    lessonLinks: ['w8l16', 'w2l3', 'w6l12'],
    sources: [
      { label: 'Betavoltaic device — conversion physics and measured cell performance', url: 'https://en.wikipedia.org/wiki/Betavoltaic_device' },
      { label: 'NRC 10 CFR 30.15 — exemptions for certain items containing byproduct material', url: 'https://www.nrc.gov/reading-rm/doc-collections/cfr/part030/part030-0015' },
      { label: 'eCFR 10 CFR 30.15 — text of the exemption', url: 'https://www.ecfr.gov/current/title-10/chapter-I/part-30/subject-group-ECFR0ed895f01b8b498/section-30.15' },
      { label: 'City Labs NanoTritium — commercial tritium betavoltaic', url: 'https://citylabs.net/' },
    ],
  },
  {
    id: 'energy-rtg-thermal-model',
    title: 'RTG Thermal and Power Model',
    tagline: 'Reproduce MMRTG and KRUSTY on paper before you ever say "nuclear robot".',
    category: 'energy',
    difficulty: 'master',
    buildTime: '3–5 weekends',
    costBand: '$',
    wakandaIndex: 88,
    diyFeasibility: 74,
    scienceGrounding: 92,
    realitySplit: {
      real:
        'Radioisotope thermoelectric generators are measured, flown hardware. Plutonium-238 has an 87.7 year half-life and produces about 0.54 W/g of decay heat with a 0.787% per year power decline. The MMRTG delivers about 110 W electrical from roughly 2000 W thermal at under 45 kg, and NASA KRUSTY demonstrated a 1–10 kWe fission system from 4.3–43.3 kW thermal at 850 °C using sodium heat pipes and free-piston Stirling converters. Radiator sizing by Stefan-Boltzmann is textbook.',
      narrative:
        'The "put a reactor on your rover" daydream. The model is the project: you will not own Pu-238, you cannot legally assemble a critical assembly, and the flight systems took decades and hundreds of millions of dollars. What you can do is validat your model against published numbers and understand exactly why the specific mass is 2.4 W/kg.',
    },
    summary:
      'Build a coupled decay-heat, Seebeck-conversion and radiator-area model, validate it against the MMRTG and KRUSTY published figures, and extend it to a fission surface power trade study.',
    science:
      'Decay heat follows P(t) = P₀ · 2^(−t/T½) with T½ = 87.7 years for Pu-238, and the electrical output is that heat times the conversion efficiency, roughly 6–7% for a thermoelectric RTG. The hot junction temperature is set by the heat source, the cold junction by the radiator, and the radiator must reject Q_rad = ε σ A (T_h⁴ − T_sink⁴). Because a Stirling converter runs at 20–25% of Carnot rather than the 5–8% of a thermoelectric, the specific mass collapses — that is precisely why KRUSTY and the 40 kWe Fission Surface Power design use Stirling. A correct model will reproduce the MMRTG\'s 110 W at beginning of life, its degradation to about 100 W at 14 years, and the 2.4–2.8 W/kg specific mass, then show how a 40 kWe FSP system at a 6000 kg mass limit fits.',
    billOfMaterials: [
      { item: 'Python with NumPy, SciPy and Matplotlib', qty: '1', note: 'The whole build' },
      { item: 'Published MMRTG and GPHS-RTG data sheets', qty: '1 set', note: 'BOL and EOL power, mass, dimensions' },
      { item: 'NASA KRUSTY and FSP 2.0 presentations', qty: '1 set', note: 'Thermal power, mass, temperature' },
      { item: 'Stefan-Boltzmann and material property tables', qty: '1 set', note: 'Emissivity, thermal conductivity' },
      { item: 'Optional: Peltier + heater benchtop demo', qty: '1', note: 'Demonstrates the converter only, with no nuclear material' },
    ],
    buildSteps: [
      { title: 'Model decay heat and validate on Pu-238', detail: 'Implement the exponential decay with the 87.7 year half-life, check the 0.787%/yr loss and the 0.54 W/g specific power, and compare with the GPHS pellet figure of about 62 W thermal at beginning of life.' },
      { title: 'Add the thermoelectric conversion stage', detail: 'Model the module as a Seebeck source with an internal resistance and a temperature-dependent efficiency. Tune the model to the MMRTG\'s 110 W electrical from 2000 W thermal and state the implied efficiency, around 5.5%.' },
      { title: 'Size the radiator', detail: 'Compute the area needed to reject the unconverted heat at the cold-junction temperature using Stefan-Boltzmann with a realistic emissivity and sink temperature. Compare with the MMRTG fin dimensions and explain the difference.' },
      { title: 'Predict the 14-year mission curve', detail: 'Combine fuel decay with thermocouple degradation. The published Voyager data show output falling faster than decay alone, because the thermocouples degrade too; capture that in the model and report the gap.' },
      { title: 'Swap in a Stirling converter', detail: 'Replace the thermoelectric stage with a Stirling efficiency of 20–25% of Carnot and recompute mass and radiator area. Compare with KRUSTY (1–10 kWe, 4.3–43.3 kW thermal, 850 °C) and with the 40 kWe / 6000 kg FSP design.' },
      { title: 'Write the policy and safety page', detail: 'Add a page on launch safety, the security of special nuclear material and why a student project stops at the model. Cite the NASA and DOE sources.' },
    ],
    code: {
      language: 'python',
      snippet:
        'import numpy as np\n\nSIGMA = 5.670374419e-8\ndef decay_power(p0_w, years, half_life=87.7):\n    return p0_w * 0.5 ** (years / half_life)\n\ndef radiator_area(q_reject_w, t_hot_k, t_sink_k, emissivity=0.9):\n    return q_reject_w / (emissivity * SIGMA * (t_hot_k**4 - t_sink_k**4))\n\ndef mmrtg(years=0.0):\n    q_th = decay_power(2000.0, years)\n    p_e = 0.055 * q_th\n    area = radiator_area(q_th - p_e, 500.0, 200.0)\n    return q_th, p_e, area\n\nfor y in (0, 5, 14, 20):\n    q, p, a = mmrtg(y)\n    print(f"year {y:2d}: Qth={q:7.1f} W  Pe={p:6.1f} W  radiator={a:.2f} m^2")',
      note: 'The model reproduces the MMRTG BOL numbers to a few percent with a single fitted efficiency, which is the point: the published data constrain the model, not the other way round.',
    },
    metrics: [
      { label: 'MMRTG BOL electrical power', value: '110 ± 5 W from 2000 W thermal' },
      { label: 'implied conversion efficiency', value: '5.5–6.5% thermoelectric' },
      { label: 'radiator area prediction', value: 'within 20% of the published fin envelope' },
      { label: '14-year power prediction', value: 'compare with the published ~100 W' },
      { label: 'Stirling specific mass', value: 'compare 2.4 W/kg (MMRTG) with 4.1 W/kg (ASRG) and 400 kg/kWe (KRUSTY)' },
    ],
    stretchGoals: [
      'Add a multi-node thermal network with temperature-dependent material properties.',
      'Model the 40 kWe Fission Surface Power system and check it against the 6000 kg mass limit.',
      'Compare RTG, solar and fission power for a Mars surface mission with a real dust-storm duty cycle.',
    ],
    safety: [
      'This project is a paper and software model. Do not attempt to obtain plutonium-238, highly enriched uranium or any special nuclear material, and do not attempt a critical assembly under any circumstances.',
      'If you demonstrate the converter half of the model, use electrical heaters rather than combustion or any radioactive source, and guard the hot surfaces against contact burns.',
      'Radiator and heat-pipe demonstrations involve high temperatures and, in real systems, alkali metals that ignite in air. Keep any bench demo below 200 °C and away from flammables.',
      'Respect the export-control and security rules around space nuclear technology; do not publish design details that would assist weaponisation, and keep to civil power architecture at the level of this course.',
    ],
    lessonLinks: ['w3l6', 'w8l15', 'w8l16'],
    sources: [
      { label: 'MMRTG — 110 W electrical, ~2000 W thermal, under 45 kg', url: 'https://en.wikipedia.org/wiki/Multi-mission_radioisotope_thermoelectric_generator' },
      { label: 'Radioisotope thermoelectric generator — Pu-238 properties and degradation', url: 'https://en.wikipedia.org/wiki/Radioisotope_thermoelectric_generator' },
      { label: 'Kilopower / KRUSTY — 1–10 kWe, 4.3–43.3 kWth, 850 °C', url: 'https://en.wikipedia.org/wiki/Kilopower' },
      { label: 'NASA MMRTG factsheet', url: 'https://science.nasa.gov/wp-content/uploads/2024/02/mmrtg-factsheet-updated-5-18-20-1.pdf' },
      { label: 'NASA Fission Surface Power overview, NETS-2023', url: 'https://ntrs.nasa.gov/api/citations/20230006731/downloads/NETS%202023%20FSP%20Presentation%20FINAL.pdf' },
    ],
  },
  {
    id: 'energy-radiation-mapping-rover',
    title: 'Radiation and UV Mapping Rover',
    tagline: 'Geiger–Müller or scintillator plus SiPM, a UV photodiode, ALARA, and a legal checklist.',
    category: 'energy',
    difficulty: 'journeyman',
    buildTime: '3–4 weekends',
    costBand: '$$$',
    wakandaIndex: 66,
    diyFeasibility: 74,
    scienceGrounding: 90,
    realitySplit: {
      real:
        'Ionising-radiation detection is mature instrumentation. Geiger–Müller tubes have a defined operating-voltage plateau, a measurable plateau slope and a dead time that can be corrected for; scintillators coupled to silicon photomultipliers give energy information and are used in real robotic radiation-mapping systems. UV index photodiodes are calibrated consumer parts. Dose limits, ALARA and the ALI/DAC framework are published regulation, not opinion.',
      narrative:
        'The "build a Geiger counter and hunt for hotspots" adventure story. A cheap tube measures count rate, not isotope identity, and without calibration it reports arbitrary units. Mapping a real site also usually requires permission and a radiation safety officer; this project is a bench and schoolyard instrument, not a survey instrument.',
    },
    summary:
      'Build a rover-mounted radiation and UV monitor with a Geiger–Müller tube or a scintillator plus SiPM, calibrate its plateau and dead time, and map count rate, dose-rate estimate and UV index across a site under strict ALARA discipline.',
    science:
      'A Geiger–Müller tube avalanches on each ionising event and produces a fixed-size pulse, so it counts particles but cannot measure their energy. Its operating point sits on a plateau where the count rate changes little with applied voltage; a plateau slope under about 10% per 100 V indicates a healthy tube. Because the tube is paralysable, high count rates saturate, and the dead-time correction n_true = n_measured / (1 − n_measured τ) matters near a source. Converting counts to dose requires a calibration factor traceable to a known field. A scintillator plus SiPM preserves energy information, so you can set an energy window and reject background; a SiPM needs a bias of tens of volts and temperature compensation. The UV channel is simpler: a UV photodiode with a calibrated responsivity gives an approximate UV index. ALARA — time, distance, shielding — is the operating doctrine, and the legal limits (in the United States, 50 mSv/yr occupational and 1 mSv/yr public) define what you may do.',
    billOfMaterials: [
      { item: 'SBM-20 or J305 Geiger–Müller tube', qty: '1', note: '400–500 V operating point for the SBM-20' },
      { item: 'Adjustable high-voltage module, 0–1000 V', qty: '1', note: 'Current-limited; treat as a shock hazard' },
      { item: 'Alternative: CsI(Tl) or plastic scintillator + SiPM', qty: '1 set', note: 'Gives energy information; needs temperature compensation' },
      { item: 'GUVA-S12SD UV photodiode module', qty: '1', note: 'UV index estimate; needs its own calibration' },
      { item: 'STM32 or ESP32 with hardware timers', qty: '1', note: 'Pulse counting and dead-time handling' },
      { item: 'GPS module', qty: '1', note: 'Geotagged readings for the map' },
      { item: 'Differential-drive rover chassis with encoders', qty: '1', note: 'Slow and stable beats fast for mapping' },
      { item: 'LiFePO4 pack with protection and fuse', qty: '1', note: 'Fire-safe field power' },
      { item: 'NIST-traceable check source (exempt quantity, supervised)', qty: '1', note: 'For calibration only, under a radiation safety officer' },
      { item: 'Lead or tungsten shielding offcuts', qty: '1 set', note: 'For a shielding experiment, not for the rover' },
    ],
    buildSteps: [
      { title: 'Find and verify the tube plateau', detail: 'With the tube well away from sources, sweep the high voltage from below to above the recommended operating point and plot count rate versus voltage. Identify a plateau at least 100 V wide with a slope under about 10% per 100 V. If there is no plateau, the tube or the quench circuit is faulty.' },
      { title: 'Measure dead time', detail: 'Use the two-source method or a calibrated pulser to estimate the paralysable dead time, typically around 100 µs for a halogen-quenched tube. Implement the correction in firmware and verify that the corrected rate linearises.' },
      { title: 'Calibrate against a known field', detail: 'With a radiation safety officer and a licensed sealed source, record the count rate at several distances and fit a calibration factor to dose rate. Without this step your readings are counts, not µSv/h, and the map must be labelled accordingly.' },
      { title: 'Add the UV channel', detail: 'Mount the UV photodiode with a diffuser and calibrate the analogue output against a reference UV meter or a clear-sky model. Report UV index against the standard 0–11+ scale.' },
      { title: 'Build the mapping rover', detail: 'Mount the detectors forward of the electronics, run slow laps of a grid with position from encoders plus GPS, and log count rate, dose estimate, UV index and position at fixed intervals.' },
      { title: 'Map, then stress-test the data', detail: 'Interpolate the readings into a heat map, then run the same route three times and report the repeatability. A map without an uncertainty estimate is a poster, not a measurement.' },
    ],
    code: {
      language: 'python',
      snippet:
        'import numpy as np\n\n# GM dead-time correction and dose estimate\ndef corrected_rate(n_measured_cps, tau_s):\n    denom = 1.0 - n_measured_cps * tau_s\n    if denom <= 0:\n        return float("inf")\n    return n_measured_cps / denom\n\ndef dose_rate(n_corrected_cps, cps_per_usv_per_h):\n    return n_corrected_cps / cps_per_usv_per_h\n\ntau = 100e-6                 # 100 us paralysable dead time\ncal = 2.0                    # counts per second per uSv/h, from the sealed source\nfor cps in (1, 50, 500, 5000, 9000):\n    c = corrected_rate(cps, tau)\n    print(f"measured {cps:5d} cps -> corrected {c:8.1f} cps -> {dose_rate(c, cal):8.2f} uSv/h")',
      note: 'The correction diverges as the measured rate approaches 1/tau. That divergence is the instrument telling you it is saturated, not a real dose rate.',
    },
    metrics: [
      { label: 'plateau slope', value: '< 10% per 100 V over a ≥ 100 V plateau' },
      { label: 'dead time estimate', value: '70–150 µs for a halogen-quenched tube' },
      { label: 'background count rate', value: '0.1–0.3 µSv/h equivalent, site dependent' },
      { label: 'map repeatability', value: '< 25% variation across three identical passes' },
      { label: 'UV index accuracy', value: 'within ±1 index unit of a reference meter' },
    ],
    stretchGoals: [
      'Add an energy window with a scintillator plus SiPM and separate a check source from background.',
      'Compare a lead, aluminium and plastic shield at fixed geometry and report attenuation versus thickness.',
      'Log a 24-hour background series and look for the cosmic-ray barometer effect.',
    ],
    safety: [
      'The Geiger tube bias of 400–900 V can give a painful shock and destroy the tube. Use a current-limited supply, insulate all high-voltage nodes, and never touch the tube anode.',
      'Use only a licensed, sealed, exempt-quantity check source under the supervision of a radiation safety officer, and follow ALARA — minimise time, maximise distance, use shielding. Never create or handle unsealed radioactive material.',
      'Do not disassemble Geiger tubes: they contain halogen or organic quench gas under pressure and may contain a thin window that is easily punctured.',
      'Publish radiation maps with their uncertainty and with the calibration basis stated. Uncalibrated maps can cause panic or false reassurance, which is a data-ethics failure, not just a technical one.',
      'LiFePO4 or Li-ion packs can catch fire if shorted. Fuse the pack, use a protected cell and do not charge it unattended.',
    ],
    lessonLinks: ['w2l3', 'w5l10', 'w8l16'],
    sources: [
      { label: 'Geiger–Müller tube — plateau, dead time and quenching', url: 'https://en.wikipedia.org/wiki/Geiger%E2%80%93M%C3%BCller_tube' },
      { label: 'Silicon photomultiplier — SiPM operation for scintillation readout', url: 'https://en.wikipedia.org/wiki/Silicon_photomultiplier' },
      { label: 'NRC 10 CFR Part 20 — radiation protection standards and dose limits', url: 'https://www.nrc.gov/reading-rm/doc-collections/cfr/part020/' },
      { label: 'EPA UV Index — the standard 0–11+ scale', url: 'https://www.epa.gov/sunsafety/uv-index-1' },
      { label: 'Geiger counter laboratory procedure (Stony Brook)', url: 'https://mini.physics.sunysb.edu/~xudu/files/252-09%20The%20Geiger%20Counter.pdf' },
    ],
  },
  {
    id: 'energy-lightning-detection-faraday',
    title: 'Lightning Ranging Station in a Faraday Cage',
    tagline: 'Study kiloamps and gigajoules from the literature; build a magnetometer and cage that never attract a strike.',
    category: 'energy',
    difficulty: 'journeyman',
    buildTime: '3–4 weekends',
    costBand: '$$$',
    wakandaIndex: 74,
    diyFeasibility: 66,
    scienceGrounding: 82,
    realitySplit: {
      real:
        'Lightning physics is measured: an average bolt carries about 30–40 kA with some strokes above 100 kA, transfers several coulombs and dissipates hundreds of megajoules, with channel temperatures approaching 28,000 K. Laser-guided lightning was demonstrated on Säntis in 2023 using a high-repetition-rate femtosecond laser to guide discharges. Sferic ranging with magnetic-field sensors and time-of-arrival across stations is standard lightning-location technique, and a Faraday cage is exact electrostatic engineering.',
      narrative:
        'The "harvest the lightning bolt" fantasy and any scheme that attracts strikes. Triggering or capturing lightning requires institutional facilities, rocketry or lasers, and it kills people who improvise it. This project measures lightning from a distance, inside a cage, and never tries to catch it.',
    },
    summary:
      'Build a shielded magnetic-field station in a Faraday cage that detects and ranges distant lightning via sferics, and use it with two remote stations to demonstrate time-of-arrival localisation — with zero attempt to attract or harvest a strike.',
    science:
      'A lightning return stroke radiates a broadband electromagnetic pulse; below about 100 kHz the magnetic field from the vertical channel dominates and can be picked up by an induction coil. The sferic amplitude falls roughly as 1/d in the near field and its waveform shape evolves with distance, which supports single-station ranging, but accurate location uses the time difference of arrival at three or more stations with GPS-disciplined clocks. A Faraday cage of continuous or mesh conductor attenuates external electric fields by orders of magnitude while allowing the low-frequency magnetic field to pass, so a coil inside a cage measures B but not the destructive E-field or the induced surge on long cables. Lightning location networks have run on exactly this principle for decades.',
    billOfMaterials: [
      { item: 'Ferrite rod or laminated-core induction coil', qty: '3', note: '10–100 mH, 1–100 kHz band' },
      { item: 'Low-noise op-amps (OPA1612 or LT1028)', qty: '6', note: 'Two-stage preamp per channel' },
      { item: '24-bit ADC (ADS1256) or fast 16-bit ADC', qty: '3', note: 'One per station' },
      { item: 'GPS modules with 1PPS output', qty: '3', note: 'Timing accuracy is the localisation accuracy' },
      { item: 'Aluminium mesh and a rigid frame', qty: '1 set', note: 'Faraday cage around each station' },
      { item: 'Copper earth rod and heavy bonding strap', qty: '1 set', note: 'Single-point earth for each cage' },
      { item: 'Raspberry Pi or ESP32 loggers', qty: '3', note: 'Buffered capture with GPS timestamps' },
      { item: 'Battery packs and weatherproof boxes', qty: '3', note: 'Battery power avoids ground loops and surge paths' },
    ],
    buildSteps: [
      { title: 'Build and test one sensor station', detail: 'Wind or select an induction coil, amplify it with a low-noise two-stage front end band-limited to 1–100 kHz, and digitise at 100 kSPS or more. Verify the response against a known Helmholtz-coil field so you have volts per tesla.' },
      { title: 'Build the Faraday cage', detail: 'Enclose the electronics in an aluminium mesh cage with overlapping seams and bond it to a single earth rod. Keep the sensor coil inside the cage and bring power in on battery or through a properly filtered feedthrough. Test the cage by bringing a charged rod near it and confirming the sensor does not respond.' },
      { title: 'Implement GPS timing', detail: 'Use the 1PPS output to discipline sample timestamps and measure the residual jitter. Localisation error in kilometres equals timing error in microseconds times the speed of light in the appropriate units, so a 1 µs error is roughly 300 m. Log the jitter and report it.' },
      { title: 'Deploy three stations', detail: 'Place them 3–20 km apart with clear sky view for GPS. Verify time sync by injecting a pulse simultaneously, or by comparing the arrival time of the same sferic. Calibrate the baseline distances with GPS coordinates.' },
      { title: 'Detect and classify sferics', detail: 'Implement a trigger on a fast rise, capture a window around it, and store waveform plus timestamp. Correlate the three stations and solve for the source position by time difference of arrival.' },
      { title: 'Validate against a public network', detail: 'Compare your fixes with a public lightning-location service. Report the median error and the fraction of detections you can match. A station that never produces a usable fix has a timing or triggering bug, not a detection.' },
    ],
    code: {
      language: 'python',
      snippet:
        'import numpy as np\n\nC_KM_PER_S = 299792.458\n\n# Time-difference-of-arrival localisation in a plane\ndef tdoa_position(stations_km, t_arrival_s):\n    stations_km = np.asarray(stations_km, dtype=float)\n    t = np.asarray(t_arrival_s, dtype=float)\n    t = t - t.min()\n    # grid search over a plausible region\n    xs = np.linspace(-100, 100, 401)\n    ys = np.linspace(-100, 100, 401)\n    best = None\n    for x in xs:\n        for y in ys:\n            d = np.hypot(stations_km[:, 0] - x, stations_km[:, 1] - y)\n            pred = (d - d.min()) / C_KM_PER_S\n            err = np.sum((pred - t) ** 2)\n            if best is None or err < best[0]:\n                best = (err, x, y)\n    return best[1], best[2], np.sqrt(best[0] / len(t)) * C_KM_PER_S\n\nprint(tdoa_position([[0, 0], [10, 0], [0, 12]], [0.0, 1.2e-5, 9.0e-6]))',
      note: 'A three-station fix gives a position and a residual. If the residual is hundreds of microseconds, your clocks are not actually synchronised and the map is decoration.',
    },
    metrics: [
      { label: 'sferic detection range', value: '30–200 km depending on stroke current' },
      { label: 'front-end sensitivity', value: '1–10 pT/√Hz in the 1–100 kHz band' },
      { label: 'timing jitter', value: '< 1 µs RMS after GPS discipline' },
      { label: 'localisation error', value: '< 2 km median against a public network' },
      { label: 'Faraday cage attenuation', value: '> 40 dB at 50 Hz for external E-fields' },
    ],
    stretchGoals: [
      'Add a second coil axis and estimate stroke bearing as well as range.',
      'Correlate sferic rate with local weather radar and build a storm-approach alarm.',
      'Measure the ELF Schumann resonances of the Earth-ionosphere cavity with a long integration.',
    ],
    safety: [
      'Never launch rockets, kites, balloons, drones or tethered wires into or near a thunderstorm, and never erect a tall conductor to "catch" a strike. This is the single most dangerous mistake in the field and it is fatal.',
      'Bond every cage and enclosure to one earth point and keep all signal cables inside the shielded volume. Long unshielded runs are surge paths that destroy equipment and can injure you.',
      'Stop work and disconnect antennas and outdoor runs at the first thunder heard. Apply the 30/30 rule: if the flash-to-bang is under 30 s, go indoors and stay there until 30 minutes after the last thunder.',
      'Battery-powered stations only; do not run mains to an outdoor lightning sensor. Fuse every pack and keep electronics out of standing water.',
    ],
    lessonLinks: ['w2l3', 'w6l12', 'w8l16'],
    sources: [
      { label: 'Lightning — currents, charge transfer and energy per stroke', url: 'https://en.wikipedia.org/wiki/Lightning' },
      { label: 'Lightning detection — sferics, time-of-arrival and networks', url: 'https://en.wikipedia.org/wiki/Lightning_detection' },
      { label: 'Faraday cage — electrostatic shielding principle', url: 'https://en.wikipedia.org/wiki/Faraday_cage' },
      { label: 'Laser-guided lightning (Nature Photonics, 2023)', url: 'https://www.nature.com/articles/s41566-022-01139-z' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* QUANTUM — honest, mostly-simulation or cold-atom-free projects      */
/* ------------------------------------------------------------------ */

export const quantumProjects: IdeaProject[] = [
  {
    id: 'quantum-bloch-gate-sim',
    title: 'Bloch-Sphere Gate Simulator',
    tagline: 'Real complex amplitudes on a microcontroller — including the noise that ruins them.',
    category: 'quantum',
    difficulty: 'apprentice',
    buildTime: '1–2 weekends',
    costBand: '$',
    wakandaIndex: 46,
    diyFeasibility: 96,
    scienceGrounding: 88,
    realitySplit: {
      real:
        'Single-qubit quantum mechanics is exact two-dimensional complex linear algebra, and it is completely reproducible on a laptop or a microcontroller. The Bloch vector, rotation gates, measurement probabilities and the Kraus-operator description of amplitude damping and dephasing are standard, peer-reviewed formalism. Nothing here is speculative.',
      narrative:
        'The "quantum computer on an ESP32" framing. You are simulating the mathematics of a qubit, not building one. There is no superposition in the microcontroller; there are two complex numbers and a rotation matrix. That distinction is the most important thing the project teaches.',
    },
    summary:
      'Implement a single-qubit state as two complex amplitudes and render it on a Bloch sphere, then add T1 amplitude damping and T2 dephasing so the vector visibly shrinks — the honest picture of a real qubit.',
    science:
      'A pure qubit state is |ψ⟩ = α|0⟩ + β|1⟩ with |α|² + |β|² = 1. The Bloch vector is (x, y, z) = (2 Re(α*β), 2 Im(α*β), |α|² − |β|²), and single-qubit gates are 2×2 unitary matrices: R_x(θ) rotates about x by θ, R_y about y, R_z about z, and any unitary is a product of these up to a global phase. Decoherence is not a mysterious process: amplitude damping (T1, energy relaxation toward |0⟩) and phase damping (T2, loss of coherence) are completely positive trace-preserving maps expressible as Kraus operators. A pure state has Bloch-vector length 1; decoherence shrinks the vector inside the sphere, and at full dephasing the state sits on the z-axis with no off-diagonal coherence at all.',
    billOfMaterials: [
      { item: 'Laptop or Raspberry Pi', qty: '1', note: 'Browser or Python is enough to start' },
      { item: 'ESP32-S3 or RP2040 dev board', qty: '1', note: 'For the embedded version with an OLED display' },
      { item: '128×64 OLED or small TFT', qty: '1', note: 'Renders the sphere in the embedded build' },
      { item: 'Two rotary encoders or a joystick', qty: '1 set', note: 'Sets gate angles interactively' },
      { item: 'USB power bank', qty: '1', note: 'Makes it a stand-alone teaching demo' },
    ],
    buildSteps: [
      { title: 'Represent the state honestly', detail: 'Store α and β as pairs of floats. Do not store probabilities; store amplitudes, because interference only appears in the amplitudes. Normalise after every operation and display any drift as a numerical bug.' },
      { title: 'Implement the gates as matrices', detail: 'Write R_x, R_y, R_z, Hadamard and phase gates as 2×2 complex matrices and multiply them into the state vector. Verify unitarity by checking that the matrix times its conjugate transpose is the identity to within 1e-12.' },
      { title: 'Render the Bloch sphere', detail: 'Draw a unit sphere with axes and place the state vector from the Bloch coordinates. In the browser use SVG or canvas; on the microcontroller project the 3-D sphere to 2-D with a simple orthographic transform.' },
      { title: 'Compose gates and test interference', detail: 'Apply H then Z then H and confirm the result differs from applying H twice. This is the experiment that shows amplitudes are doing real work: a probability-only simulator gets it wrong.' },
      { title: 'Add decoherence channels', detail: 'Implement amplitude damping with parameter γ = 1 − exp(−t/T1) and phase damping with λ = 1 − exp(−t/T2). Show the Bloch vector length decaying and measure the T2/T1 ratio for which coherence disappears first.' },
      { title: 'Make it teach', detail: 'Add a mode that prints the state before and after each gate and a mode that runs a Ramsey-style sequence with a variable delay. The shrinking fringe visibility versus delay is the visual definition of T2.' },
    ],
    code: {
      language: 'python',
      snippet:
        'import numpy as np\n\nI = np.eye(2, dtype=complex)\nX = np.array([[0, 1], [1, 0]], dtype=complex)\nZ = np.array([[1, 0], [0, -1]], dtype=complex)\nH = np.array([[1, 1], [1, -1]], dtype=complex) / np.sqrt(2)\n\ndef rx(theta):\n    c, s = np.cos(theta / 2), np.sin(theta / 2)\n    return np.array([[c, -1j * s], [-1j * s, c]], dtype=complex)\n\ndef bloch(psi):\n    a, b = psi[0], psi[1]\n    return np.array([2 * (a.conjugate() * b).real,\n                     2 * (a.conjugate() * b).imag,\n                     abs(a) ** 2 - abs(b) ** 2])\n\ndef amplitude_damping(gamma):\n    return [np.array([[1, 0], [0, np.sqrt(1 - gamma)]], dtype=complex),\n            np.array([[0, np.sqrt(gamma)], [0, 0]], dtype=complex)]\n\npsi = np.array([1, 0], dtype=complex)\npsi = H @ psi\npsi = rx(np.pi / 2) @ psi\nprint("Bloch vector:", np.round(bloch(psi), 4))\nfor K in amplitude_damping(0.3):\n    print("Kraus branch norm:", np.round(np.linalg.norm(K @ psi), 4))',
      note: 'Storing amplitudes rather than probabilities is what makes interference appear. If H-Z-H looks the same as H-H you have thrown away the phase.',
    },
    metrics: [
      { label: 'unitarity error', value: '< 1e-12 for every gate matrix' },
      { label: 'state norm drift over 10⁶ gates', value: '< 1e-9' },
      { label: 'Bloch vector length after pure gates', value: '1.000 ± 1e-6' },
      { label: 'T2 decay fit', value: 'within 2% of the programmed value' },
      { label: 'embedded frame rate', value: '≥ 30 fps on an ESP32-S3 OLED' },
    ],
    stretchGoals: [
      'Add a density-matrix mode and visualise the shrinking Bloch vector directly.',
      'Implement a two-qubit CNOT and simulate a Bell state, then measure the correlation.',
      'Add a noise-injection mode with adjustable T1, T2 and gate error and plot fidelity versus circuit depth.',
    ],
    safety: [
      'This is a low-voltage software and dev-board project. The only real hazards are soldering fumes and a lithium power bank, so solder with ventilation and use a protected battery.',
      'Do not oversell the result. A Bloch sphere on a screen is a simulation of qubit mathematics, not a quantum device, and a course that blurs this loses credibility.',
    ],
    lessonLinks: ['w8l15', 'w7l13'],
    sources: [
      { label: 'Bloch sphere — state representation and rotation gates', url: 'https://en.wikipedia.org/wiki/Bloch_sphere' },
      { label: 'Quantum gate — unitary matrices and single-qubit gates', url: 'https://en.wikipedia.org/wiki/Quantum_gate' },
      { label: 'Quantum decoherence — T1, T2 and Kraus operators', url: 'https://en.wikipedia.org/wiki/Quantum_decoherence' },
    ],
  },
  {
    id: 'quantum-rng-swarm-ids',
    title: 'Avalanche-Noise Quantum RNG',
    tagline: 'Real entropy from a reverse-biased junction, then NIST-style tests to prove it.',
    category: 'quantum',
    difficulty: 'journeyman',
    buildTime: '2–3 weekends',
    costBand: '$$',
    wakandaIndex: 60,
    diyFeasibility: 82,
    scienceGrounding: 84,
    realitySplit: {
      real:
        'Reverse-biased junctions in avalanche breakdown are a genuine physical entropy source: carrier multiplication is a stochastic process, and a silicon or photodiode junction biased past breakdown produces measurable avalanche noise. Extracting bits from a physical source, conditioning them, and testing them with the NIST SP 800-22 statistical test suite is exactly how real hardware random number generators are qualified.',
      narrative:
        'The "quantum RNG app" problem. Many services labelled quantum RNG are classical deterministic generators with a quantum logo, and some are seeded from a single photon detector whose raw output is heavily biased and correlated. A student project should state its entropy source, show the raw min-entropy estimate and show the conditioned output passing tests, or it should not claim quantum randomness at all.',
    },
    summary:
      'Build an entropy source from an avalanching junction or a reverse-biased photodiode, condition the raw bits, and qualify them with NIST SP 800-22 style tests so a robot swarm can draw IDs that are not guessable from a seed.',
    science:
      'A junction biased into avalanche breakdown conducts through a chain of stochastic impact-ionisation events, so the current has a broad noise spectrum with a large variance. Amplify that noise, compare it against a slow-moving reference to remove DC drift, and sample the comparator output; the result is a raw bit stream with a bias and with correlations from the amplifier bandwidth. A von Neumann debiasing step or a cryptographic conditioner (for example AES-CMAC or SHA-3) removes those defects, but conditioning cannot create entropy, so the raw source must be measured: estimate min-entropy from the value distribution and from the longest repeated run. The NIST SP 800-22 suite then tests the conditioned output with statistics such as frequency, block frequency, runs, longest run of ones, discrete Fourier transform, serial, approximate entropy and cumulative sums. Passing means "no detected deviation from random", not "provably quantum", which is a distinction worth writing on the enclosure.',
    billOfMaterials: [
      { item: '2N3904 or BC547 transistor (B-E junction in avalanche)', qty: '4', note: 'Vebo is typically 6–9 V; run one device only' },
      { item: 'Alternative: reverse-biased photodiode or APD', qty: '1', note: 'A true single-photon source is a bigger build' },
      { item: 'Low-noise op-amp preamp (OPA1612 or AD797)', qty: '2', note: 'Gain of 1000 in two stages' },
      { item: 'Fast comparator (LM319 or ADCMP600)', qty: '1', note: 'Converts noise to a bit stream' },
      { item: 'ESP32 or STM32 with a hardware RNG as a health check', qty: '1', note: 'Compare, do not trust' },
      { item: 'Current-limiting resistor and 12 V supply', qty: '1 set', note: 'Avalanche current must stay in the safe range' },
      { item: 'BNC shielded enclosure', qty: '1', note: 'Prevents mains hum and radio pickup from dominating' },
      { item: 'PC with Python and the NIST STS', qty: '1', note: 'For the test campaign' },
    ],
    buildSteps: [
      { title: 'Find the avalanche point', detail: 'Bias a transistor collector-emitter with the base open, or use the base-emitter junction in reverse, and raise the voltage until the current jumps. Note the breakdown voltage; it varies part to part, so measure yours.' },
      { title: 'Amplify without adding structure', detail: 'AC-couple the avalanche noise into a two-stage low-noise amplifier with a bandwidth of at least 100 kHz and a gain of 1000. Shield the whole front end. Any periodic pickup will create correlations that no conditioner can honestly remove.' },
      { title: 'Digitise and debias', detail: 'Compare the amplified noise against a slow-moving mean and take one bit per sample at a clock rate below the amplifier bandwidth. Apply von Neumann debiasing to pairs: 01 gives 0, 10 gives 1, 00 and 11 are discarded. Expect to throw away half the raw bits.' },
      { title: 'Estimate min-entropy', detail: 'Collect at least 10 million bits, estimate the most probable byte value and compute min-entropy per byte. Also run a compression test. Report the raw number before conditioning, because that is the honest entropy claim.' },
      { title: 'Condition and test', detail: 'Run the debiased stream through SHA-3 or AES-CMAC to produce the final output, then run the NIST tests on at least 1 Mbit and report every p-value. A pass requires p > 0.01 on the tests and a uniform distribution of p-values across runs.' },
      { title: 'Integrate with the swarm', detail: 'Use the conditioned bytes to seed a per-robot identity and key. Verify on the bench that two robots powered from the same firmware never produce the same ID, and that the ID is not recoverable from the firmware image.' },
    ],
    code: {
      language: 'python',
      snippet:
        'import hashlib, math\nfrom collections import Counter\n\n# Von Neumann debiasing then SHA-3 conditioning\ndef von_neumann(bits):\n    out = []\n    for i in range(0, len(bits) - 1, 2):\n        a, b = bits[i], bits[i + 1]\n        if a != b:\n            out.append(a)\n    return out\n\ndef min_entropy_per_byte(data):\n    counts = Counter(data)\n    n = len(data)\n    pmax = max(counts.values()) / n\n    return -math.log2(pmax)\n\ndef condition(raw):\n    return hashlib.sha3_256(bytes(raw)).digest()\n\nraw_bits = [int(c) for c in bin(int.from_bytes(b"\\x5a" * 64, "big"))[2:]]\nprint("debias ratio:", len(von_neumann(raw_bits)) / len(raw_bits))\nprint("min-entropy/byte:", round(min_entropy_per_byte(bytes(64)), 3))\nprint("conditioned:", condition(bytes(64)).hex()[:16])',
      note: 'Conditioning cannot create entropy. If the estimate after debiasing is below 1 bit per sample, no hash will save the design; fix the source.',
    },
    metrics: [
      { label: 'raw min-entropy', value: '≥ 5 bits per byte before conditioning' },
      { label: 'bias after debiasing', value: '< 0.1%' },
      { label: 'NIST SP 800-22 pass rate', value: 'p > 0.01 on ≥ 10 tests over 1 Mbit' },
      { label: 'autocorrelation', value: '< 0.01 at all lags up to 1000' },
      { label: 'throughput', value: '1–100 kbit/s of conditioned output' },
    ],
    stretchGoals: [
      'Compare avalanche noise with a ring-oscillator jitter source and quantify which is more robust to temperature.',
      'Run the NIST tests weekly for a month and plot p-value stability.',
      'Build a two-source health check that disables output if the two sources disagree.',
    ],
    safety: [
      'Avalanche breakdown runs at 6–12 V but can pass tens of milliamps and heat the transistor. Use a current-limiting resistor, a fused supply, and do not leave the junction in breakdown unattended.',
      'Shield and decouple the front end; a high-gain amplifier that picks up mains hum can produce a bit stream with hidden periodicity, which is a security failure rather than a physics result.',
      'Treat entropy as key material. Store raw and conditioned streams securely, zeroise buffers, and never ship a firmware image that contains a fixed seed.',
      'If you use an APD or photodiode with a high bias, treat the supply as a shock hazard and follow the same insulation rules as any high-voltage circuit.',
    ],
    lessonLinks: ['w6l12', 'w8l16'],
    sources: [
      { label: 'Hardware random number generator — physical entropy sources and conditioning', url: 'https://en.wikipedia.org/wiki/Hardware_random_number_generator' },
      { label: 'Avalanche photodiode — avalanche multiplication and noise', url: 'https://en.wikipedia.org/wiki/Avalanche_photodiode' },
      { label: 'NIST Random Bit Generation — SP 800-22 test suite and documentation', url: 'https://csrc.nist.gov/projects/random-bit-generation/documentation-and-software' },
    ],
  },
  {
    id: 'quantum-nv-magnetometer',
    title: 'NV-Centre Magnetometer Reconnaissance',
    tagline: 'Optically detected magnetic resonance at 2.87 GHz — price it honestly before you buy a diamond.',
    category: 'quantum',
    difficulty: 'master',
    buildTime: '6–12 months',
    costBand: '$$$$',
    wakandaIndex: 94,
    diyFeasibility: 32,
    scienceGrounding: 92,
    realitySplit: {
      real:
        'The nitrogen-vacancy centre is one of the best-characterised quantum sensors in existence. Its negative charge state has a spin-triplet ground state with a zero-field splitting of 2.87 GHz, a 1.945 eV (637 nm) zero-phonon optical transition, and spin-dependent fluorescence that makes optically detected magnetic resonance possible at room temperature. Ensemble devices reach nanotesla per root-hertz sensitivity at DC, and a diamond magnetometer has operated aboard the International Space Station.',
      narrative:
        'The "build a quantum magnetometer in a garage" pitch. A working NV magnetometer needs a 532 nm laser, a microwave chain at 2.87 GHz, a low-noise photodetector, magnetic shielding and a lot of optical alignment. The honest garage build is a simulation plus a shielding and microwave-drive prototype, with a written cost and complexity assessment — not a finished sensor.',
    },
    summary:
      'Model spin-dependent fluorescence and the ODMR lineshape, build the magnetic shielding and microwave-drive concept, and produce a transparent cost and complexity assessment of what a real nT/√Hz NV magnetometer requires.',
    science:
      'In the NV⁻ ground-state triplet, the ms = 0 and ms = ±1 levels are split by 2.87 GHz even at zero field. A static magnetic field further splits ms = ±1 by about 2.8 MHz per gauss along the defect axis, so measuring the ODMR dip positions yields the field. Green 532 nm light pumps the spin into ms = 0; microwaves at the resonance reduce the ms = 0 population, and because ms = ±1 has a higher probability of decaying through a non-radiative singlet path, resonance shows up as a dip in red fluorescence. Sensitivity improves with the collected photon rate, the ODMR contrast and the linewidth, and with a.c. lock-in techniques it reaches the picotesla per root-hertz regime. Bias-field control and magnetic shielding matter because the Earth field splits the lines by roughly 1.4 MHz, which is comparable to the linewidth of an unshielded ensemble.',
    billOfMaterials: [
      { item: 'CVD diamond with a nitrogen-vacancy ensemble', qty: '1', note: 'The single most expensive item; a bare electronic-grade stone is useless' },
      { item: '532 nm laser or high-power green LED', qty: '1', note: 'Class 3B laser needs goggles and a beam block' },
      { item: '650–800 nm long-pass filter and dichroic', qty: '1 set', note: 'Separates red fluorescence from pump light' },
      { item: 'Photodiode plus low-noise transimpedance amp', qty: '1', note: 'Collect as many fluorescence photons as possible' },
      { item: '2.87 GHz microwave synthesizer and amplifier', qty: '1 set', note: 'The second large cost; must be stable and low-phase-noise' },
      { item: 'Loop or stripline microwave antenna', qty: '1', note: 'Delivers the drive field to the diamond' },
      { item: 'Helmholtz coil pair and current supply', qty: '1 set', note: 'Bias field to separate the ODMR lines' },
      { item: 'Mu-metal shield or a multilayer shielded enclosure', qty: '1', note: 'Attenuates the Earth field and lab noise' },
      { item: 'Lock-in amplifier or FPGA-based demodulator', qty: '1', note: 'Needed for sensitivities below a microtesla' },
      { item: 'Optical breadboard, mounts and irises', qty: '1 set', note: 'Alignment stability is the long pole' },
    ],
    buildSteps: [
      { title: 'Simulate before you spend', detail: 'Model the ground-state triplet, the microwave Rabi dynamics and the fluorescence contrast to produce a predicted ODMR lineshape versus field. Use it to decide what linewidth and photon count you need, then price the hardware against that specification.' },
      { title: 'Build the fluorescence path first', detail: 'Pump the diamond with green light, collect the red fluorescence through a long-pass filter onto a photodiode, and confirm you can see a signal change when you change the pump power. This is the cheapest part of the build and it validates the optics.' },
      { title: 'Add the microwave drive', detail: 'Connect a synthesizer through an amplifier to a loop antenna near the diamond. Sweep the frequency across 2.82–2.92 GHz and look for the ODMR dip. Without a bias field you will see a single dip near 2.87 GHz.' },
      { title: 'Shield and bias', detail: 'Place the assembly in a mu-metal enclosure and add Helmholtz coils along one NV axis. Apply a bias field of a few gauss and watch the single dip split into two. The splitting in megahertz divided by 2.8 gives the field in gauss.' },
      { title: 'Measure sensitivity honestly', detail: 'Record the ODMR contrast, the linewidth in megahertz and the photon count rate. Compute the shot-noise-limited sensitivity and compare it with what you actually achieve in a one-second measurement. The ratio is your technical noise, not a mystery.' },
      { title: 'Write the cost and complexity assessment', detail: 'Produce a table of every part with price, lead time and the failure modes you hit, plus an explicit statement of what a research-grade nT/√Hz instrument additionally requires. That assessment is a legitimate and valuable project output.' },
    ],
    code: {
      language: 'python',
      snippet:
        'import numpy as np\n\n# ODMR lineshape for an NV ensemble with a bias field\nGAMMA_MHZ_PER_GAUSS = 2.8\ndef odmr_dips(f_mhz, b_gauss, linewidth_mhz=10.0, contrast=0.03, bz_axis_gauss=0.0):\n    f0 = 2870.0\n    split = GAMMA_MHZ_PER_GAUSS * np.sqrt(b_gauss ** 2 + bz_axis_gauss ** 2)\n    total = np.ones_like(f_mhz)\n    for sign in (+1, -1):\n        centre = f0 + sign * split\n        total -= contrast * (0.5 * linewidth_mhz) ** 2 / ((f_mhz - centre) ** 2 + (0.5 * linewidth_mhz) ** 2)\n    return total\n\nf = np.linspace(2800, 2940, 2000)\nfor b in (0.0, 5.0, 10.0):\n    y = odmr_dips(f, b)\n    print(f"B={b:4.1f} G  min fluorescence={y.min():.4f} at {f[np.argmin(y)]:.1f} MHz")',
      note: 'The Earth field is about 0.5 G, a splitting near 1.4 MHz — smaller than a typical unshielded linewidth, which is exactly why shielding is not optional.',
    },
    metrics: [
      { label: 'ODMR contrast', value: '2–10% for an ensemble, higher for a single centre' },
      { label: 'ODMR linewidth', value: '1–10 MHz depending on diamond quality' },
      { label: 'demonstrated sensitivity', value: '10–1000 nT/√Hz for a careful ensemble build' },
      { label: 'shield attenuation', value: '> 40 dB for the quasi-static field' },
      { label: 'microwave stability', value: '< 1 ppm drift over an hour' },
    ],
    stretchGoals: [
      'Add a lock-in amplifier and demonstrate a.c. magnetometry below the 1/f noise knee.',
      'Compare diamonds with different nitrogen concentrations and quantify the contrast-linewidth trade.',
      'Measure a known current in a wire and reconstruct the field profile to validate the calibration.',
    ],
    safety: [
      'A 532 nm laser is a serious eye hazard, often Class 3B or 4. Wear wavelength-matched goggles, enclose the beam path, use a beam block, never align at eye level, and appoint a laser safety officer if the beam leaves the enclosure.',
      'The microwave drive at 2.87 GHz can cause localised heating. Keep average power low and within exposure limits, enclose the antenna, and keep anyone with a metallic implant away from the drive.',
      'Some diamonds are irradiated to create defects and remain weakly radioactive. Ask the supplier for a statement and treat unknown stones as potentially controlled material.',
      'Mu-metal enclosures and cryogenic dewars present pinch and cold-burn hazards. Use gloves when handling cryogens and never seal a dewar.',
    ],
    lessonLinks: ['w8l15', 'w8l16', 'w2l4'],
    sources: [
      { label: 'Nitrogen-vacancy center — 2.87 GHz splitting, 637 nm ZPL, spin-dependent fluorescence', url: 'https://en.wikipedia.org/wiki/Nitrogen-vacancy_center' },
      { label: 'Optically detected magnetic resonance — ODMR measurement principle', url: 'https://en.wikipedia.org/wiki/Optically_detected_magnetic_resonance' },
      { label: 'Diamond-based magnetometer aboard the International Space Station (Phys. Rev. Applied)', url: 'https://journals.aps.org/prapplied/pdf/10.1103/483m-8hfc' },
    ],
  },
  {
    id: 'quantum-safe-fleet-crypto',
    title: 'Post-Quantum Fleet Link',
    tagline: 'ML-KEM between robot and base station, and exactly why Shor kills RSA-2048.',
    category: 'quantum',
    difficulty: 'journeyman',
    buildTime: '2–3 weekends',
    costBand: '$',
    wakandaIndex: 62,
    diyFeasibility: 88,
    scienceGrounding: 94,
    realitySplit: {
      real:
        'Shor\u2019s algorithm solves integer factorisation and discrete logarithms in polynomial time on a fault-tolerant quantum computer, which breaks RSA and elliptic-curve cryptography. ML-KEM, standardised as FIPS 203 and derived from CRYSTALS-Kyber, is a module-lattice key-encapsulation mechanism with published parameters and open reference implementations. Building a hybrid X25519 plus ML-KEM handshake between a robot and a base station is real, testable engineering.',
      narrative:
        '"Quantum-proof your fleet" marketing. ML-KEM is standardised but young, the migration is ongoing, and a lattice scheme can still fall to a future classical or quantum attack. Hybrid key exchange exists precisely because nobody wants to bet everything on one family.',
    },
    summary:
      'Implement a hybrid post-quantum key exchange between a robot and a base station using ML-KEM alongside a classical scheme, benchmark it, and demonstrate that the session fails cleanly against a tampered ciphertext.',
    science:
      'ML-KEM is built on the hardness of the module learning-with-errors problem over polynomial rings. Key generation produces a public and private key; encapsulation takes the public key and a random seed and outputs a shared secret plus a ciphertext; decapsulation recovers the same secret from the ciphertext and private key. Security relies on the ciphertext being indistinguishable from random without the private key. Sizes matter on a robot: ML-KEM-512 has a 800-byte public key and a 768-byte ciphertext, ML-KEM-768 has 1184 and 1088 bytes, and ML-KEM-1024 has 1568 and 1568. That is far larger than an X25519 exchange, so the handshake cost and the fragmenting over a low-rate link are the practical engineering problems. Hybrid groups concatenate a classical and a post-quantum secret, so the session stays secure if either one holds. Signatures for authentication need a separate scheme such as ML-DSA under FIPS 204.',
    billOfMaterials: [
      { item: 'Two Raspberry Pi boards (or a Pi and a laptop)', qty: '2', note: 'Robot node and base station' },
      { item: 'One microcontroller with crypto acceleration (ESP32-S3)', qty: '1', note: 'To measure the constrained-device cost' },
      { item: 'Wi-Fi or LoRa link', qty: '1', note: 'LoRa exposes the fragmentation problem' },
      { item: 'liboqs or a FIPS 203 reference implementation', qty: '1', note: 'Do not hand-roll the lattice arithmetic' },
      { item: 'TLS 1.3 stack with hybrid group support', qty: '1', note: 'OpenSSL 3.x or equivalent' },
      { item: 'Logic analyser or packet capture tool', qty: '1', note: 'Measures handshake bytes and latency' },
      { item: 'SD card or SSD for logs', qty: '1', note: 'Record timing distributions, not single runs' },
    ],
    buildSteps: [
      { title: 'Build a baseline classical handshake', detail: 'Stand up a TLS 1.3 session between the two nodes with X25519 only. Measure key-generation, handshake and data-transfer times over the real link, and record the bytes on the wire. This is your control.' },
      { title: 'Add ML-KEM in a hybrid group', detail: 'Use a library that offers X25519-ML-KEM-768. Verify the negotiated group in the handshake trace. Confirm that the shared secret differs from the classical-only case, which proves the post-quantum leg is actually contributing.' },
      { title: 'Measure the constrained end', detail: 'Repeat on the microcontroller and record key generation, encapsulation, decapsulation, stack usage and energy per handshake. The public key and ciphertext sizes dominate the radio time on a low-rate link.' },
      { title: 'Break it on purpose', detail: 'Flip one bit in an encapsulated ciphertext and confirm decapsulation fails or produces a different secret, and that the session aborts rather than proceeding with a wrong key. This is the implicit-rejection property and it is worth demonstrating.' },
      { title: 'Add authentication', detail: 'Use ML-DSA or a hybrid signature so each side authenticates the other. Show that an impostor base station without the private key cannot complete the handshake.' },
      { title: 'Write the threat model', detail: 'State clearly what this does and does not protect: it defends against a future quantum adversary recording traffic today, and it does nothing against a compromised robot, a weak random number generator or a flawed implementation.' },
    ],
    code: {
      language: 'python',
      snippet:
        'import time, hashlib\n\n# Illustrative ML-KEM flow using an oqs-style binding.\n# Replace with the real library call; sizes are the FIPS 203 values.\nML_KEM_768 = {"pk": 1184, "sk": 2400, "ct": 1088, "ss": 32}\n\ndef handshake_sizes():\n    total = 2 * ML_KEM_768["pk"] + 2 * ML_KEM_768["ct"]\n    return total\n\ndef hybrid_secret(ss_classical: bytes, ss_pq: bytes) -> bytes:\n    # both legs must be combined; never use the PQ leg alone during migration\n    return hashlib.sha256(b"hybrid" + ss_classical + ss_pq).digest()\n\nprint("ML-KEM-768 public key:", ML_KEM_768["pk"], "bytes")\nprint("ML-KEM-768 ciphertext:", ML_KEM_768["ct"], "bytes")\nprint("two-way key material on the wire:", handshake_sizes(), "bytes")\nprint("hybrid secret:", hybrid_secret(b"x25519-secret", b"pq-secret").hex()[:16])\n\nstart = time.perf_counter()\n_ = hybrid_secret(b"a" * 32, b"b" * 32)\nprint("combine time: %.1f us" % ((time.perf_counter() - start) * 1e6))',
      note: 'The sizes are the story on a robot. ML-KEM-768 costs about 4.5 kB of two-way key material per handshake, which is a real constraint on LoRa.',
    },
    metrics: [
      { label: 'ML-KEM-768 key generation', value: 'typically 30–200 µs on a Pi-class CPU' },
      { label: 'encapsulation plus decapsulation', value: 'under 1 ms on a Pi, tens of ms on an MCU' },
      { label: 'handshake key material', value: 'about 4.5 kB two-way for ML-KEM-768' },
      { label: 'tampered ciphertext rejection', value: '100% of injected faults abort the session' },
      { label: 'hybrid handshake latency', value: '< 100 ms on Wi-Fi, link-dependent on LoRa' },
    ],
    stretchGoals: [
      'Add ML-DSA signatures and compare the certificate-chain size against Ed25519.',
      'Simulate a "harvest now, decrypt later" adversary and document what the hybrid handshake protects.',
      'Profile energy per handshake on the microcontroller and size a battery budget for key rotation.',
    ],
    safety: [
      'Never implement lattice cryptography yourself for anything that matters. Side channels, faulty sampling and timing leaks have broken real deployments; use a vetted library and keep it updated.',
      'Treat keys as the most sensitive data on the robot. Zeroise buffers after use, disable core dumps, do not log secrets, and store private keys in a secure element where possible.',
      'Secure the software supply chain: pin library versions, verify hashes, and build from source. A post-quantum handshake on a compromised binary protects nothing.',
      'Comply with radio regulations for the link, especially for LoRa duty-cycle limits, and do not operate a base station on frequencies you are not licensed to use.',
    ],
    lessonLinks: ['w6l12', 'w8l16', 'w8l15'],
    sources: [
      { label: 'NIST announces approval of the FIPS post-quantum standards, including FIPS 203', url: 'https://www.nist.gov/news-events/news/2024/08/announcing-approval-three-federal-information-processing-standards-fips' },
      { label: "Shor's algorithm — polynomial-time factoring and the threat to RSA/ECC", url: 'https://en.wikipedia.org/wiki/Shor%27s_algorithm' },
      { label: 'Open Quantum Safe — liboqs post-quantum library', url: 'https://github.com/open-quantum-safe/liboqs' },
      { label: 'CRYPTREC report on post-quantum cryptography migration', url: 'https://www.cryptrec.go.jp/report/cryptrec-mt-1011-2025.pdf' },
    ],
  },
  {
    id: 'quantum-bb84-photon-bench',
    title: 'Photon Polarisation and BB84 Bench',
    tagline: 'Attenuated laser, polarisers and a SiPM — plus the honest cost of single-photon detection.',
    category: 'quantum',
    difficulty: 'master',
    buildTime: '4–8 weeks',
    costBand: '$$$$',
    wakandaIndex: 92,
    diyFeasibility: 36,
    scienceGrounding: 88,
    realitySplit: {
      real:
        'BB84 is a real, implementable protocol. It encodes each bit in one of two non-orthogonal bases, and the no-cloning theorem plus the disturbance caused by measurement give it its security. Attenuated lasers, polarising beamsplitters, half-wave plates and silicon photomultipliers are all purchasable, and a benchtop demonstration with a measured quantum bit error rate is a genuine quantum-optics experiment.',
      narrative:
        'The "unbreakable quantum internet in a shoebox" pitch. A weak coherent source is not a single-photon source: it emits Poissonian photon numbers, so a photon-number-splitting attack is possible unless you implement decoy states. Detectors are the dominant cost, free-space alignment drifts, and a 1 m bench demonstration is not a deployed secure link.',
    },
    summary:
      'Build a free-space BB84 demonstration with an attenuated laser source, polarisation encoding and single-photon detection, measure the quantum bit error rate, and show that an intercept-resend eavesdropper raises it.',
    science:
      'BB84 uses four states in two mutually unbiased bases: rectilinear (0° and 90°) and diagonal (±45°). The sender transmits a random bit in a random basis; the receiver measures in a random basis and they keep only the cases where the bases agree, forming the sifted key. Because the bases are non-orthogonal, an eavesdropper who measures in the wrong basis disturbs the state and introduces errors, so the observed error rate bounds the information leaked. An attenuated laser produces a weak coherent state with a Poisson distribution of photon number, so at a mean photon number near 0.1 most non-vacuum pulses contain exactly one photon — but some contain two, which enables a photon-number-splitting attack; decoy states fix this by randomising the intensity. Silicon photomultipliers or SPADs at visible wavelengths offer detection efficiencies of roughly 10–40% with dark counts of tens of thousands per second, and those two numbers together with the loss budget set the achievable key rate.',
    billOfMaterials: [
      { item: '650 nm or 850 nm laser diode with a stable driver', qty: '1', note: 'Attenuate to a mean photon number near 0.1' },
      { item: 'Neutral density filters and a calibrated attenuator', qty: '1 set', note: 'You must know the mean photon number' },
      { item: 'Polarising beamsplitter and half-wave plate', qty: '1 each', note: 'For state preparation and basis choice' },
      { item: 'Calcite or polarising-film analyser', qty: '1', note: 'The measurement basis' },
      { item: 'SPAD or silicon photomultiplier with a quench circuit', qty: '1', note: 'The dominant cost; 200–400 V bias' },
      { item: 'FPGA or fast counter for coincidence timing', qty: '1', note: 'Time-tags each detection' },
      { item: 'Free-space optical rail, irises and mounts', qty: '1 set', note: 'Alignment stability is the long pole' },
      { item: 'Blackout enclosure and beam dumps', qty: '1 set', note: 'Background light raises the error rate' },
      { item: 'Temperature-stabilised mounts', qty: '2', note: 'Reduces polarisation drift over a long run' },
    ],
    buildSteps: [
      { title: 'Calibrate the source intensity', detail: 'Measure the laser power, filter it down, and compute the mean photon number per pulse from the pulse repetition rate and wavelength. Verify with a calibrated detector that you are near 0.1 photons per pulse. Then confirm that almost every non-vacuum pulse is a single photon, and write down the multi-photon probability.' },
      { title: 'Build the state preparer', detail: 'Use a half-wave plate before a polarising beamsplitter to set the polarisation to one of the four BB84 states under electronic control. Verify each state with an analyser and record the extinction ratio.' },
      { title: 'Build the measurement stage', detail: 'Add a randomly switched analyser to choose the basis, and focus the transmitted light onto the SPAD. Measure the detection efficiency and the dark count rate with the source off, because both enter the key-rate model.' },
      { title: 'Synchronise and sift', detail: 'Time-tag detections against the pulse clock, discard pulses where no photon was detected, then sift by basis and compute the quantum bit error rate. With a good setup you should be well under 5%.' },
      { title: 'Attack your own link', detail: 'Implement intercept-resend by measuring every pulse in a random basis and re-preparing it. Watch the QBER rise above the security threshold, usually quoted near 11% for BB84 with one-way reconciliation. The rising error rate is the demonstration that the protocol detects eavesdropping.' },
      { title: 'Add decoy states or bound the claim', detail: 'Either implement two or three random intensities so photon-number-splitting is detectable, or state explicitly in the write-up that your weak-coherent source without decoys is insecure against that attack. Honesty about the gap is the point.' },
    ],
    code: {
      language: 'python',
      snippet:
        'import numpy as np\n\n# BB84 sifting and QBER estimation\nBASES = ["R", "D"]\nSTATES = {("R", 0): 0.0, ("R", 1): 90.0, ("D", 0): 45.0, ("D", 1): 135.0}\n\ndef run(n_bits=20000, qber_target=0.02, seed=7):\n    rng = np.random.default_rng(seed)\n    alice_bits = rng.integers(0, 2, n_bits)\n    alice_bases = rng.integers(0, 2, n_bits)\n    bob_bases = rng.integers(0, 2, n_bits)\n    sift = alice_bases == bob_bases\n    bob_bits = alice_bits.copy()\n    flip = rng.random(n_bits) < qber_target\n    bob_bits[flip] ^= 1\n    sifted_a = alice_bits[sift]\n    sifted_b = bob_bits[sift]\n    qber = np.mean(sifted_a != sifted_b)\n    return sift.sum(), qber\n\nkept, qber = run()\nprint(f"sifted bits: {kept}, QBER: {qber:.3%}")',
      note: 'QBER above about 11% means an eavesdropper (or a badly aligned bench) has more information than the privacy amplification can remove. The number is the security statement.',
    },
    metrics: [
      { label: 'quantum bit error rate', value: '< 5% over a 1 m free-space link' },
      { label: 'polarisation extinction ratio', value: '> 100:1 per basis' },
      { label: 'SPAD detection efficiency', value: '10–40% at the operating wavelength' },
      { label: 'dark count rate', value: '10–100 kcps for a typical SiPM' },
      { label: 'sifted key rate', value: 'kHz range at 1 MHz pulse rate and 0.1 photons per pulse' },
    ],
    stretchGoals: [
      'Implement decoy states and compare the secure key rate with the no-decoy case.',
      'Run the link over 100 m of fibre or free space and measure the loss-limited key rate.',
      'Add a polarisation drift tracker and extend the run time to hours.',
    ],
    safety: [
      'The laser is the primary hazard, often Class 3B at these powers. Wear wavelength-matched goggles, enclose the beam, use beam dumps, never align at eye level, and never let the beam leave the optical table or the room.',
      'The SPAD bias supply is 200–400 V. Insulate it, current-limit it, discharge the detector module before handling, and keep it away from the beam path where a reflected beam could reach a connector.',
      'Some detectors and cooled housings use cryogens or Peltier stacks; cold surfaces cause burns and condensation can short high voltage. Use gloves and control humidity.',
      'Enclose the optical path in a light-tight box. A stray laser reflection into the room is both an eye hazard and a source of background counts that ruins the measurement.',
    ],
    lessonLinks: ['w2l4', 'w8l16', 'w8l15'],
    sources: [
      { label: 'BB84 — the four-state protocol and security intuition', url: 'https://en.wikipedia.org/wiki/BB84' },
      { label: 'Quantum key distribution — decoy states, QBER and security thresholds', url: 'https://en.wikipedia.org/wiki/Quantum_key_distribution' },
      { label: 'Silicon photomultiplier — single-photon detection, efficiency and dark counts', url: 'https://en.wikipedia.org/wiki/Silicon_photomultiplier' },
    ],
  },
  {
    id: 'quantum-dot-spectrometer',
    title: 'Quantum-Dot Spectrometer',
    tagline: 'Size-tuned fluorescence that makes quantum confinement visible on a cheap spectrometer.',
    category: 'quantum',
    difficulty: 'journeyman',
    buildTime: '3–5 weekends',
    costBand: '$$$',
    wakandaIndex: 78,
    diyFeasibility: 52,
    scienceGrounding: 86,
    realitySplit: {
      real:
        'Quantum confinement is textbook physics with commercial products built on it. Cadmium selenide nanocrystals a few nanometres across emit at wavelengths set by their size, and a zinc sulfide shell passivates the surface and raises the fluorescence quantum yield. The shift is large, monotonic and measurable with a UV LED, a cuvette and a cheap grating spectrometer.',
      narrative:
        'The "quantum dots are magic" gloss. The dots are toxic colloids that need careful handling, the emission depends on surface chemistry as much as on size, and a home-built spectrometer without wavelength calibration produces pretty but meaningless curves. The physics is real; the romance is not.',
    },
    summary:
      'Measure the size-tuned fluorescence of CdSe/ZnS (or safer InP/ZnS) quantum dots with a UV LED excitation source and a grating spectrometer, extract the emission peak, and compare the confinement shift against a particle-in-a-sphere model.',
    science:
      'A semiconductor nanocrystal smaller than the bulk exciton Bohr radius confines both electron and hole, so its bandgap grows as the size shrinks. The simplest model is a particle in a sphere: E(R) ≈ E_g + ħ²π²/(2R²)(1/m_e* + 1/m_h*), which predicts a blue shift that scales as one over radius squared. For CdSe the bulk gap corresponds to about 712 nm and the Bohr radius is roughly 5 nm, so cores in the 2–6 nm range emit across roughly 500–650 nm. The measured peak is also shifted by the Stokes shift of 20–40 nm and broadened by size dispersity, giving a full width at half maximum of 25–40 nm for good samples. A ZnS shell raises the quantum yield by passivating surface traps, which is why core-shell dots are far brighter than bare cores.',
    billOfMaterials: [
      { item: 'CdSe/ZnS quantum dots in toluene, or InP/ZnS in water', qty: '1 mL', note: 'InP/ZnS is the lower-toxicity choice and still shows confinement' },
      { item: '365 nm UV LED with a current-controlled driver', qty: '1', note: 'Excitation source; UV eye hazard' },
      { item: 'Quartz or glass cuvette', qty: '4', note: 'One for the sample, others for blanks' },
      { item: 'USB grating spectrometer, 350–800 nm', qty: '1', note: 'A cheap one works if you calibrate it' },
      { item: 'Long-pass filter, 420 nm', qty: '1', note: 'Blocks scattered UV from the detector' },
      { item: 'Blackout box and optical mounts', qty: '1 set', note: 'Stray light is the biggest error term' },
      { item: 'Calibration lamp (mercury or neon) or a known laser', qty: '1', note: 'Wavelength calibration is mandatory' },
      { item: 'Nitrile gloves, safety glasses, waste container', qty: '1 set', note: 'Cadmium and toluene handling' },
    ],
    buildSteps: [
      { title: 'Calibrate the spectrometer', detail: 'Record the emission lines of a mercury or neon lamp and fit the pixel-to-wavelength map. A cheap spectrometer is often off by several nanometres; without this step the confinement shift you measure is your instrument error.' },
      { title: 'Take a blank and a baseline', detail: 'Record the spectrum of the pure solvent in the same cuvette and subtract it. Record the dark spectrum with the LED off. Do this every session, because detector offsets drift.' },
      { title: 'Measure the excitation and emission', detail: 'Excite the sample at 365 nm, filter the scattered pump light with a long-pass filter, and record the emission spectrum. Keep the LED current constant and the integration time fixed so samples are comparable.' },
      { title: 'Extract the peak and width', detail: 'Fit a Gaussian or log-normal to the emission band and report the peak wavelength, the full width at half maximum and the integrated intensity. Those three numbers are the measurement.' },
      { title: 'Compare sizes and the model', detail: 'Measure several dot sizes if available and plot emission energy against inverse radius squared. Fit the effective mass term and compare with literature values. A monotonic blue shift with decreasing size is the confinement signature.' },
      { title: 'Quantify the shell and the Stokes shift', detail: 'Compare a bare core with a core-shell sample at equal optical density. The shell should raise the intensity without moving the peak much. Measure the Stokes shift as the gap between the absorption onset and the emission peak.' },
    ],
    code: {
      language: 'python',
      snippet:
        'import numpy as np\n\n# Confinement shift: particle in a sphere plus bulk gap\nHBAR = 1.054571817e-34\nM_E = 9.1093837015e-31\nE_CHARGE = 1.602176634e-19\n\ndef confinement_ev(radius_nm, eg_ev=1.74, me_eff=0.13, mh_eff=0.45):\n    r = radius_nm * 1e-9\n    kinetic_j = (np.pi ** 2 * HBAR ** 2 / (2 * r ** 2)) * (1 / (me_eff * M_E) + 1 / (mh_eff * M_E))\n    return eg_ev + kinetic_j / E_CHARGE\n\ndef nm_from_ev(e_ev):\n    return 1239.84193 / e_ev\n\nfor d in (2.0, 3.0, 4.0, 5.0, 6.0):\n    e = confinement_ev(d / 2)\n    print(f"diameter {d:.1f} nm -> Eg {e:.3f} eV -> {nm_from_ev(e):.0f} nm")',
      note: 'The model overestimates the shift because it ignores Coulomb attraction and finite barriers, but it captures the correct inverse-square trend. Report both.',
    },
    metrics: [
      { label: 'emission peak', value: '500–650 nm for CdSe cores of 2–6 nm' },
      { label: 'full width at half maximum', value: '25–40 nm for a good sample' },
      { label: 'Stokes shift', value: '20–40 nm between absorption onset and emission' },
      { label: 'wavelength calibration error', value: '< 1 nm after lamp calibration' },
      { label: 'shell effect on intensity', value: '2–10× brighter than a bare core at equal optical density' },
    ],
    stretchGoals: [
      'Measure the absorption spectrum as well and extract the band-edge energy versus size.',
      'Compare CdSe/ZnS with InP/ZnS and discuss the trade between performance and toxicity.',
      'Build a simple fluorimeter with a photodiode and a filter to show that a full spectrometer is not always needed.',
    ],
    safety: [
      'Cadmium selenide is toxic and a suspected carcinogen. Wear nitrile gloves, work over a tray, never pipette by mouth, never heat dots to dryness, and collect all waste as hazardous chemical waste.',
      'Toluene is flammable and neurotoxic. Work in a fume hood or a well-ventilated area away from ignition sources, and keep the vial capped.',
      'A 365 nm UV LED is an eye and skin hazard even at modest power. Enclose the excitation path in a blackout box, wear UV-blocking goggles, and never look into the LED or its reflection.',
      'If a dot solution spills, absorb it with inert material and dispose of it as hazardous waste. Do not pour quantum dots or solvents down a drain.',
    ],
    lessonLinks: ['w2l4', 'w8l15'],
    sources: [
      { label: 'Quantum dot — size-tuned emission and quantum confinement', url: 'https://en.wikipedia.org/wiki/Quantum_dot' },
      { label: 'Quantum confinement — particle-in-a-sphere energy shift', url: 'https://en.wikipedia.org/wiki/Quantum_confinement' },
      { label: 'Cadmium selenide — material properties and toxicity', url: 'https://en.wikipedia.org/wiki/Cadmium_selenide' },
      { label: 'Correlation of size and photoluminescence of single CdSe/ZnS quantum dots', url: 'https://www.diva-portal.org/smash/record.jsf?pid=diva2%3A542421' },
    ],
  },
  {
    id: 'quantum-atom-interferometer-gravimeter',
    title: 'Atom-Interferometer Gravimeter Concept',
    tagline: 'Why cold atoms measure g to 1e-9 — and how a gravimeter finds a void under a robot.',
    category: 'quantum',
    difficulty: 'journeyman',
    buildTime: '2–4 weekends (simulation)',
    costBand: '$',
    wakandaIndex: 96,
    diyFeasibility: 20,
    scienceGrounding: 88,
    realitySplit: {
      real:
        'Atom interferometry is a measured technique. A Mach-Zehnder interferometer made of laser pulses splits, redirects and recombines atomic wavepackets, and the accumulated phase scales as the effective wavevector times gravity times the square of the interrogation time. State-of-the-art cold-atom gravimeters reach sensitivities around 1e-9 g and are used in absolute gravimetry and geodesy. Subsurface void detection from microgravity anomalies is established geophysics.',
      narrative:
        'The "quantum gravimeter on your rover" pitch. A real cold-atom instrument needs a vacuum system, laser cooling, magnetic shielding, vibration isolation and a metre-scale baseline. The garage version is a simulation of the phase and noise budget plus a study of what a gravimeter survey could detect — not a cold-atom apparatus.',
    },
    summary:
      'Simulate the three-pulse atom-interferometer sequence, recover g from noisy fringes, and model the microgravity anomaly produced by a subsurface void to see whether a rover-mounted gravimeter could resolve it.',
    science:
      'A Mach-Zehnder atom interferometer applies a π/2 pulse to split the wavepacket, a π pulse to reverse the momentum difference, and a final π/2 pulse to recombine. The phase difference is Δφ = k_eff · g · T² plus terms from rotations, magnetic gradients and laser phase noise, where k_eff is the effective two-photon wavevector and T is the time between pulses. Because the gravity term scales as T², sensitivity improves rapidly with longer interrogation, which is why cold atoms — moving slowly enough to be interrogated for hundreds of milliseconds — beat thermal beams. A gravimeter measures the vertical gradient of g, and a buried void or tunnel produces a small negative anomaly whose magnitude falls as depth squared; detecting it requires both high sensitivity and careful subtraction of terrain and building effects. Shot noise, vibration and wavefront distortion set the practical floor.',
    billOfMaterials: [
      { item: 'Laptop with Python, NumPy and Matplotlib', qty: '1', note: 'The entire simulation build' },
      { item: 'Published gravimeter sensitivity and survey datasets', qty: '1 set', note: 'For validation and comparison' },
      { item: 'Optional: a MEMS accelerometer or phone IMU', qty: '1', note: 'For a classical gravimetry comparison' },
      { item: 'Access to a real gravimeter (university visit)', qty: 'optional', note: 'The only way to see the hardware' },
    ],
    buildSteps: [
      { title: 'Simulate the pulse sequence', detail: 'Represent the atomic wavepacket as two momentum states with a relative phase. Apply π/2, π and π/2 pulses with a free-evolution time T between them, tracking the phase accumulated by each arm. Verify that the final phase contains the k_eff g T² term.' },
      { title: 'Produce fringes', detail: 'Scan the laser phase and plot the transition probability as a cosine. The fringe period and the phase offset are the measurement; noise on the offset is the sensitivity.' },
      { title: 'Add the noise budget', detail: 'Add shot noise from the detected atom number, vibration noise from the platform, and a magnetic-field gradient term. Show how the sensitivity improves as the square root of the detected atom number and degrades as T rises into the vibration-dominated regime.' },
      { title: 'Recover g from noisy data', detail: 'Fit the fringe phase over many shots and extract g. Compare the recovered value with the true value and report the uncertainty. Repeat for several T values and show the sensitivity scaling.' },
      { title: 'Model the subsurface void', detail: 'Compute the vertical gravity anomaly of a buried sphere or tunnel as a function of depth and density contrast, then compare the signal with your simulated instrument noise. State the depth at which the void becomes undetectable.' },
      { title: 'Design the rover survey', detail: 'Propose a survey pattern, a station spacing and a repeat-observation strategy, and estimate the total survey time for a real target. The result is a credible mission concept rather than a hardware claim.' },
    ],
    code: {
      language: 'python',
      snippet:
        'import numpy as np\n\nK_EFF = 1.6e7      # rad/m, typical two-photon effective wavevector\nG = 9.80665\n\ndef interferometer_phase(T, g=G, k_eff=K_EFF):\n    return k_eff * g * T ** 2\n\ndef fringe(phi_laser, phase_gravity, contrast=0.5):\n    return 0.5 * (1 - contrast * np.cos(phi_laser + phase_gravity))\n\nfor T in (0.01, 0.05, 0.1, 0.5, 1.0):\n    print(f"T={T:4.2f} s -> dphi/g = {interferometer_phase(T):.3e} rad per m/s^2")\n\n# recover g from a noisy fringe scan\nrng = np.random.default_rng(1)\nphi = np.linspace(0, 2 * np.pi, 60)\np_true = interferometer_phase(0.1)\nprob = fringe(phi, p_true) + rng.normal(0, 0.01, phi.size)\nprint("phase recovered ~", np.round(np.arctan2(np.sum(prob * np.sin(phi)), np.sum(prob * np.cos(phi))), 4), "true", round(p_true, 4))',
      note: 'The T-squared scaling is the entire reason cold atoms win. A thermal beam cannot be interrogated for a second without flying out of the apparatus.',
    },
    metrics: [
      { label: 'simulated phase sensitivity', value: 'matches k_eff g T² to within 0.1%' },
      { label: 'recovered g error', value: '< 1e-6 relative from noisy fringes' },
      { label: 'fringe contrast at long T', value: 'degrades with vibration as modelled' },
      { label: 'void detection depth', value: 'state the depth at which signal falls below noise' },
      { label: 'survey time estimate', value: 'hours for a hectare at 10 m station spacing' },
    ],
    stretchGoals: [
      'Add rotation (Sagnac) sensitivity and show how a rotating rover platform corrupts the gravity measurement.',
      'Implement a simple Bayesian estimator for g and compare its uncertainty with the least-squares fit.',
      'Model a gradiometer configuration with two vertically separated interferometers and show the common-mode vibration rejection.',
    ],
    safety: [
      'This project is software only. Do not attempt to build a cold-atom apparatus: it combines Class 4 lasers, high vacuum, high voltage and cryogenics.',
      'If you visit a laboratory that operates an atom interferometer, follow the laser and vacuum safety rules exactly, never touch optics, and stay out of the beam path.',
      'If you ever conduct a real gravity survey, get land access permission, do not enter mine workings or unstable ground, and do not use the instrument near explosives or during blasting.',
      'Publish survey locations responsibly. High-resolution gravity maps can reveal tunnels, utilities or archaeological sites and can be sensitive data.',
    ],
    lessonLinks: ['w8l15', 'w4l8', 'w2l4'],
    sources: [
      { label: 'Atom interferometer — light-pulse sequence and phase accumulation', url: 'https://en.wikipedia.org/wiki/Atom_interferometer' },
      { label: 'Gravimeter — absolute and relative gravity measurement', url: 'https://en.wikipedia.org/wiki/Gravimeter' },
      { label: 'Mach-Zehnder interferometer — the optical analogue', url: 'https://en.wikipedia.org/wiki/Mach%E2%80%93Zehnder_interferometer' },
    ],
  },
  {
    id: 'quantum-annealing-fleet-scheduling',
    title: 'Fleet Job-Shop as a QUBO',
    tagline: 'Formulate multi-robot allocation as binary quadratic cost, solve it locally with simulated annealing today.',
    category: 'quantum',
    difficulty: 'journeyman',
    buildTime: '2–3 weekends',
    costBand: '$',
    wakandaIndex: 72,
    diyFeasibility: 92,
    scienceGrounding: 82,
    realitySplit: {
      real:
        'Quadratic unconstrained binary optimisation is a standard formulation for assignment and scheduling, and simulated annealing on a QUBO is a well-defined classical algorithm that you can run on a laptop. Encoding a robot-to-task assignment with cover and capacity penalties, solving it, and comparing with a mixed-integer reference is genuine combinatorial optimisation. QAOA circuits can be simulated for small instances, and the comparison is instructive.',
      narrative:
        'The "quantum speedup for robot fleets" claim. Quantum advantage for realistic scheduling instances is not established; current annealers are limited by connectivity, embedding overhead and noise, and a well-tuned classical heuristic often wins. Any project that reports a quantum win on a six-variable toy problem is overclaiming.',
    },
    summary:
      'Formulate multi-robot task allocation as a QUBO, solve it with simulated annealing and a small QAOA circuit, and benchmark both against an exact or mixed-integer baseline on identical instances.',
    science:
      'A QUBO minimises xᵀQx over binary x. A task-allocation problem becomes: one variable per robot-task pair, a penalty for leaving a task uncovered, a penalty for assigning a robot beyond its capacity, and a cost term for travel distance or time. The penalties must be large enough to make infeasible solutions expensive but not so large that they dominate the cost landscape and flatten the useful gradient. Simulated annealing explores that landscape with a temperature schedule; it is a classical algorithm and it can be excellent. QAOA prepares a parameterised superposition and measures an expectation value, with the classical optimiser tuning the angles; at small depth on a noisy device or simulator it is broadly comparable to a heuristic. The honest experiment is to fix the instance, the penalty weights and the time budget, then compare solution quality and time to target across methods.',
    billOfMaterials: [
      { item: 'Python with NumPy and SciPy', qty: '1', note: 'QUBO construction and classical baselines' },
      { item: 'Qiskit or a similar circuit simulator', qty: '1', note: 'For the QAOA comparison on small instances' },
      { item: 'Optional: a D-Wave Leap account', qty: '1', note: 'For a real annealer run, if available' },
      { item: 'Optional: a small robot fleet or a simulator', qty: '1', note: 'To execute the resulting schedule' },
      { item: 'Plotting and logging tools', qty: '1', note: 'Benchmarking discipline is the deliverable' },
    ],
    buildSteps: [
      { title: 'Write the instance generator', detail: 'Generate random task sets with N tasks and M robots, each task with a location and duration, each robot with a capacity. Fix a seed so every method sees the same instances, and store them to disk.' },
      { title: 'Build the QUBO', detail: 'Create binary variables for robot-task assignment and encode the objective plus penalty terms. Document each penalty weight and its units. Check on tiny instances that the ground state of the QUBO corresponds to the known optimal assignment.' },
      { title: 'Solve with simulated annealing', detail: 'Implement or import a simulated annealing solver with a geometric cooling schedule. Run at least 1000 restarts per instance and record the best, the median and the time to reach a target quality.' },
      { title: 'Solve with QAOA in simulation', detail: 'Build the QAOA circuit for instances small enough to simulate, optimise the angles, and sample. Record the approximation ratio. Do not extrapolate to large instances; say so explicitly.' },
      { title: 'Benchmark against exact and greedy baselines', detail: 'Solve small instances exactly by brute force or a mixed-integer solver, and run a greedy or auction-based heuristic on all instances. Compare feasibility rate, objective value and runtime across methods.' },
      { title: 'Execute a schedule on hardware or a simulator', detail: 'Take the best schedule, dispatch it to a small fleet or a simulator, and measure the achieved makespan against the predicted one. The gap is the cost of ignoring real dynamics.' },
    ],
    code: {
      language: 'python',
      snippet:
        'import numpy as np\n\n# Minimal QUBO: assign 3 tasks to 2 robots, minimise distance + penalties\ndef build_qubo(dist, capacity_penalty=50.0, cover_penalty=50.0):\n    n_tasks, n_robots = dist.shape\n    n = n_tasks * n_robots\n    def idx(t, r):\n        return t * n_robots + r\n    Q = np.zeros((n, n))\n    for t in range(n_tasks):\n        for r in range(n_robots):\n            Q[idx(t, r), idx(t, r)] += dist[t, r]\n            for r2 in range(n_robots):\n                if r2 != r:\n                    Q[idx(t, r), idx(t, r2)] += cover_penalty\n    return Q, idx\n\ndef energy(Q, x):\n    x = np.asarray(x, dtype=float)\n    return float(x @ Q @ x)\n\nrng = np.random.default_rng(0)\ndist = rng.random((3, 2)) * 10\nQ, idx = build_qubo(dist)\nx = np.zeros(Q.shape[0])\nfor t in range(3):\n    x[idx(t, int(np.argmin(dist[t])))] = 1\nprint("feasible assignment energy:", round(energy(Q, x), 3))',
      note: 'Penalty weights are the craft. Too small and the solver returns infeasible assignments; too large and the landscape becomes a penalty wall that hides the real objective.',
    },
    metrics: [
      { label: 'feasibility rate', value: '100% coverage of every task in the returned schedule' },
      { label: 'objective gap to exact optimum', value: '< 10% on small instances' },
      { label: 'simulated annealing restarts to target quality', value: 'record the distribution, not one lucky run' },
      { label: 'QAOA approximation ratio', value: 'report it for the largest simulable instance only' },
      { label: 'predicted versus achieved makespan', value: 'within 20% after dispatch' },
    ],
    stretchGoals: [
      'Add time windows and precedence constraints and measure how much the penalty tuning degrades.',
      'Compare against a market-based auction heuristic and report where the QUBO wins or loses.',
      'Study embedding overhead by mapping the same problem to a sparse annealer topology.',
    ],
    safety: [
      'If you dispatch a schedule to real robots, enforce speed limits, keep people out of the work envelope, and keep a hardware emergency stop that is independent of the optimiser.',
      'Test schedules on hardware with dummy payloads before carrying anything heavy or fragile, and never let a plan command a manipulator over a person.',
      'Fuse and monitor robot battery packs; a scheduling experiment that runs unattended overnight is a fire risk if the pack is unprotected.',
      'Be honest in reporting. A small-instance comparison is not evidence of quantum advantage, and presenting it as one damages the credibility of the whole field.',
    ],
    lessonLinks: ['w7l14', 'w8l15', 'w5l9'],
    sources: [
      { label: 'Quantum annealing — physical approach and limitations', url: 'https://en.wikipedia.org/wiki/Quantum_annealing' },
      { label: 'Quadratic unconstrained binary optimization — problem formulation', url: 'https://en.wikipedia.org/wiki/Quadratic_unconstrained_binary_optimization' },
      { label: 'Simulated annealing — classical baseline algorithm', url: 'https://en.wikipedia.org/wiki/Simulated_annealing' },
      { label: 'Trust-aware task allocation with quantum optimization in multi-agent systems', url: 'https://par.nsf.gov/servlets/purl/10674552' },
    ],
  },
  {
    id: 'quantum-cryogenics-reality-check',
    title: 'Superconducting-Qubit Cryogenics Reality Check',
    tagline: 'Price the millikelvin plumbing for five qubits, then design the semiconductor analogue.',
    category: 'quantum',
    difficulty: 'master',
    buildTime: '3–4 weekends',
    costBand: '$$$',
    wakandaIndex: 88,
    diyFeasibility: 62,
    scienceGrounding: 90,
    realitySplit: {
      real:
        'Dilution refrigeration is mature cryogenic engineering. A ³He/⁴He dilution refrigerator reaches 10–20 mK continuously, and its cooling power, heat-load budget and staged temperature profile are all published and measurable. The heat load from coaxial control lines, attenuators and amplifiers sets how many qubits a given fridge can support, and the market price of a dry dilution refrigerator is a real number that dominates the cost of any small superconducting-qubit machine.',
      narrative:
        'The "five qubits in a garage" claim. Even a five-qubit superconducting machine needs a dilution refrigerator, dozens of filtered coaxial lines, room-temperature control electronics and a shielded room. The honest project models the heat load and the cost, then builds a semiconductor analogue that demonstrates interference-like behaviour without pretending to be a qubit.',
    },
    summary:
      'Model the heat-load budget of a dilution refrigerator across its temperature stages for a small superconducting-qubit machine, cost it honestly, and then design and build a room-temperature semiconductor analogue that reproduces the observable behaviour without the cryogenics.',
    science:
      'A dilution refrigerator exploits the fact that a ³He/⁴He mixture phase-separates below about 0.87 K, and pumping ³He across the phase boundary absorbs heat, giving continuous cooling to around 10 mK. Cooling power is small at the coldest stage — hundreds of microwatts at 100 mK and tens of milliwatts at 1 K for a typical dry system — so every coaxial line, attenuator and amplifier must be budgeted. A single filtered line can conduct and radiate a few microwatts to the mixing chamber, and a qubit control architecture needs many lines, which is why scaling beyond tens of qubits is a wiring problem as much as a materials problem. The alternative demonstrated here is a classical analogue: coupled resonant circuits or a single-electron device can show interference and state-dependent response at room temperature, which teaches the signal-processing intuition while making no claim to quantum coherence.',
    billOfMaterials: [
      { item: 'Python heat-load model and spreadsheet', qty: '1', note: 'The core deliverable' },
      { item: 'Vendor datasheets for a dry dilution refrigerator', qty: '1 set', note: 'Cooling power versus stage temperature' },
      { item: 'Indicative market price quotes for the cryostat', qty: '1 set', note: 'The number that kills the project' },
      { item: 'Coaxial cable, attenuator and filter loss data', qty: '1 set', note: 'Per-line heat load and signal budget' },
      { item: 'Optional analogue: two coupled LC tanks and a lock-in', qty: '1 set', note: 'Demonstrates resonant interference at 300 K' },
      { item: 'Optional analogue: a single-electron transistor simulation', qty: '1', note: 'Coulomb blockade without the helium' },
      { item: 'Thermal camera or thermocouples', qty: '1 set', note: 'For the room-temperature analogue only' },
    ],
    buildSteps: [
      { title: 'Build the staged heat-load budget', detail: 'List every line entering the fridge with its thermal conductance and its radiative load, and assign each to a stage. Sum the loads and compare with the published cooling power at 100 mK, 1 K and 4 K. The stage where load exceeds cooling power is your qubit ceiling.' },
      { title: 'Add the signal budget', detail: 'For each control line, compute attenuation at the qubit frequency and the resulting drive amplitude at the mixing chamber. High attenuation reduces noise but also reduces the drive; find the operating point that satisfies both.' },
      { title: 'Cost the machine honestly', detail: 'Price the cryostat, the compressor, the shielded room, the control electronics and the wiring, and add integration labour. State the total as a range and compare it with the cost of the analogue build.' },
      { title: 'Model the coherence ceiling', detail: 'Using published T1 and T2 for a real qubit technology, compute the number of gates possible within the coherence time for your gate speed. That number, not the qubit count, is the useful specification.' },
      { title: 'Design the semiconductor analogue', detail: 'Build two coupled resonant circuits or a switched-capacitor network that exhibits a state-dependent interference fringe. Drive it with a lock-in, measure the fringe, and map the measurement onto the qubit readout analogy explicitly.' },
      { title: 'Write the honest conclusion', detail: 'State plainly that the analogue is not a qubit, that it has no superposition and no entanglement, and that what it does demonstrate is the measurement and control signal chain that surrounds a real qubit.' },
    ],
    code: {
      language: 'python',
      snippet:
        'import numpy as np\n\n# Staged heat-load budget for a small superconducting-qubit machine\nSTAGES_K = [0.02, 0.1, 1.0, 4.0]\nCOOLING_W = {0.02: 2e-5, 0.1: 3e-4, 1.0: 2e-2, 4.0: 0.5}   # indicative dry-fridge values\n\ndef line_load_w(n_lines, per_line_w_by_stage):\n    return {s: n_lines * w for s, w in per_line_w_by_stage.items()}\n\ndef headroom(n_lines, per_line_w_by_stage):\n    load = line_load_w(n_lines, per_line_w_by_stage)\n    return {s: COOLING_W[s] - load[s] for s in STAGES_K}\n\nper_line = {0.02: 2e-6, 0.1: 2e-5, 1.0: 2e-4, 4.0: 5e-3}\nfor n in (8, 24, 64, 128):\n    h = headroom(n, per_line)\n    print(f"{n:3d} lines -> headroom at 20 mK: {h[0.02]*1e6:8.2f} uW",\n          "OK" if h[0.02] > 0 else "OVER BUDGET")',
      note: 'The mixing-chamber headroom goes negative at a surprisingly small line count. That crossover is the practical qubit ceiling of a given cryostat, and it is a wiring number, not a physics one.',
    },
    metrics: [
      { label: 'mixing-chamber headroom', value: 'positive at the target line count' },
      { label: 'cryostat cost estimate', value: 'indicate a six-figure range and cite the basis' },
      { label: 'gate count within coherence', value: 'report T2 divided by gate time' },
      { label: 'analogue fringe visibility', value: '> 50% at room temperature' },
      { label: 'analogue frequency stability', value: '< 1% drift over an hour' },
    ],
    stretchGoals: [
      'Compare two qubit modalities and show how their wiring and heat-load requirements differ.',
      'Design a filtered line with a calculated noise budget and estimate the resulting qubit dephasing.',
      'Extend the analogue to a two-node coupled network and demonstrate a classical avoided crossing.',
    ],
    safety: [
      'Cryogens are the main hazard if you work near a real system. Liquid nitrogen and helium cause cold burns and displace oxygen in enclosed spaces; use gloves, work in ventilated areas and fit an oxygen monitor in any small room.',
      'Never seal a cryostat or a dewar. Trapped cryogen expands by hundreds of times and can rupture the vessel. Always provide a relief path.',
      'A dilution refrigerator compresses helium-3 in a closed circuit. Do not attempt to service the gas handling system; recover the gas according to the manufacturer procedure. Helium-3 is scarce and expensive.',
      'The room-temperature analogue is benign, but a lock-in and function generator on mains power still require proper earthing and fused distribution. Keep liquids away from the instrument rack.',
    ],
    lessonLinks: ['w8l15', 'w6l11'],
    sources: [
      { label: 'Dilution refrigerator — ³He/⁴He cooling to millikelvin temperatures', url: 'https://en.wikipedia.org/wiki/Dilution_refrigerator' },
      { label: 'Superconducting quantum computing — control wiring and coherence', url: 'https://en.wikipedia.org/wiki/Superconducting_quantum_computing' },
      { label: 'Dilution refrigerator technology for multi-qubit devices (arXiv)', url: 'https://arxiv.org/pdf/2512.15001' },
    ],
  },
  {
    id: 'quantum-inspired-path-planning',
    title: 'Quantum-Inspired Path Planning',
    tagline: 'Tensor-network and annealer-style solvers benchmarked against A* on the same grid.',
    category: 'quantum',
    difficulty: 'journeyman',
    buildTime: '2–3 weekends',
    costBand: '$',
    wakandaIndex: 68,
    diyFeasibility: 92,
    scienceGrounding: 84,
    realitySplit: {
      real:
        'Tensor networks, matrix-product states, simulated quantum annealing and the whole family of "quantum-inspired" solvers are classical algorithms with well-understood mathematics. A* and Dijkstra are exact baselines with proven optimality on the right graph. Benchmarking a tensor-network contraction or an annealer-style sampler against A* on identical grids is a rigorous, reproducible experiment.',
      narrative:
        'The "quantum-inspired means faster" assumption. Quantum-inspired methods are classical, and their advantage is problem- and instance-dependent; on many grid path-planning problems A* with a good heuristic wins outright. Reporting a win from a single hand-picked instance is not a result.',
    },
    summary:
      'Implement A*, Dijkstra, simulated annealing over path permutations and a small tensor-network contraction for the same path-planning problem, then benchmark optimality gap, nodes expanded and runtime across grid sizes.',
    science:
      'A* finds a least-cost path on a graph by expanding nodes in order of f = g + h, where g is the cost so far and h is an admissible heuristic; with a consistent heuristic it is optimal and typically expands far fewer nodes than Dijkstra. A tensor-network approach represents the cost function as a contracted tensor graph and finds a low-energy configuration by approximate contraction or by a sweeping optimiser; the bond dimension controls the accuracy and the cost. Simulated annealing over permutations of waypoints explores a different landscape and can handle constraints that break the A* heuristic. The interesting engineering question is not which is "quantum" but where each method\'s resource scaling crosses over, and the answer depends on grid connectivity, obstacle density and the cost model.',
    billOfMaterials: [
      { item: 'Python with NumPy and a plotting library', qty: '1', note: 'The whole build' },
      { item: 'Optional: TensorNetwork or quimb library', qty: '1', note: 'For the tensor contraction' },
      { item: 'Optional: a ROS 2 or similar robot simulator', qty: '1', note: 'To execute the planned paths' },
      { item: 'Benchmark harness and fixed-seed instance generator', qty: '1', note: 'Reproducibility is the point' },
    ],
    buildSteps: [
      { title: 'Define the problem precisely', detail: 'Fix the grid, the cost model, the obstacle distribution and the start and goal sets. Generate instances with a fixed seed and save them. Every method must see byte-identical inputs.' },
      { title: 'Implement the exact baselines', detail: 'Write Dijkstra and A* with a consistent heuristic and verify that A* returns the same cost as Dijkstra on every instance while expanding fewer nodes. That check validates the heuristic.' },
      { title: 'Implement the quantum-inspired solvers', detail: 'Encode the path as a sequence of waypoints and run simulated annealing over that sequence. Separately, build a small matrix-product-state representation of the cost and contract it with increasing bond dimension, recording accuracy versus cost.' },
      { title: 'Benchmark across sizes', detail: 'Sweep grid size and obstacle density. Record optimality gap, nodes expanded, runtime and peak memory for each method. Plot scaling curves, not single numbers.' },
      { title: 'Find the crossover', detail: 'Identify the regime, if any, where a quantum-inspired solver beats A* on time to a target quality. Report the instance family and the parameter range rather than generalising.' },
      { title: 'Execute and validate on a robot', detail: 'Run the best path on a real or simulated robot, measure the achieved traversal cost, and compare it with the plan. Unmodelled friction, turning cost and dynamic obstacles will explain most of the gap.' },
    ],
    code: {
      language: 'python',
      snippet:
        'import heapq, numpy as np\n\n# A* on a 4-connected grid with an admissible Manhattan heuristic\ndef astar(cost, start, goal):\n    n, m = cost.shape\n    def h(p):\n        return abs(p[0] - goal[0]) + abs(p[1] - goal[1])\n    open_set = [(h(start), 0.0, start)]\n    best = {start: 0.0}\n    expanded = 0\n    while open_set:\n        _, g, u = heapq.heappop(open_set)\n        if u == goal:\n            return g, expanded\n        expanded += 1\n        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):\n            v = (u[0] + dx, u[1] + dy)\n            if 0 <= v[0] < n and 0 <= v[1] < m:\n                ng = g + cost[v]\n                if ng < best.get(v, np.inf):\n                    best[v] = ng\n                    heapq.heappush(open_set, (ng + h(v), ng, v))\n    return np.inf, expanded\n\nrng = np.random.default_rng(0)\ncost = 1.0 + rng.random((60, 60))\nprint("A* cost, nodes:", astar(cost, (0, 0), (59, 59)))',
      note: 'Validate the heuristic before you criticise the solver: if A* and Dijkstra disagree on cost, the heuristic is not admissible and the benchmark is meaningless.',
    },
    metrics: [
      { label: 'A* vs Dijkstra cost agreement', value: 'identical on 100% of instances' },
      { label: 'optimality gap of quantum-inspired solvers', value: 'report per instance family' },
      { label: 'nodes expanded versus A*', value: 'report the ratio across grid sizes' },
      { label: 'tensor-network bond dimension for 1% accuracy', value: 'record it and the resulting runtime' },
      { label: 'executed versus planned path cost', value: 'within 20% on the robot' },
    ],
    stretchGoals: [
      'Add dynamic obstacles and compare replanning latency across methods.',
      'Benchmark on a real occupancy grid from a SLAM run rather than synthetic noise.',
      'Compare against a mixed-integer formulation solved exactly for small instances.',
    ],
    safety: [
      'Software-only work is low risk, but if you deploy a planner on a real robot, keep an independent emergency stop, impose speed and acceleration limits, and never plan through a region occupied by a person.',
      'Validate every path against the map and against a live obstacle sensor before the robot moves. A planner with a stale map will confidently drive into a wall.',
      'If the robot carries a battery or a payload, fuse and secure it, and do not leave autonomous runs unattended until you have logged many fault-free hours.',
    ],
    lessonLinks: ['w7l14', 'w8l15'],
    sources: [
      { label: 'Tensor network — matrix-product states and contraction cost', url: 'https://en.wikipedia.org/wiki/Tensor_network' },
      { label: 'A* search algorithm — optimality and admissible heuristics', url: 'https://en.wikipedia.org/wiki/A*_search_algorithm' },
      { label: 'Knapsack and shortest-path generalisations from a quantum-inspired tensor-network perspective', url: 'https://arxiv.org/pdf/2502.05981' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* SPACE — light-lag autonomy, avionics, ADCS, TVAC, ISRU, optical     */
/* ------------------------------------------------------------------ */

export const spaceProjects: IdeaProject[] = [
  {
    id: 'space-mars-light-lag-autonomy',
    title: 'Rover Under 24-Minute Light Lag',
    tagline: 'No ground commands: pick your own science target with the loop closed on board.',
    category: 'space',
    difficulty: 'journeyman',
    buildTime: '3–4 weeks',
    costBand: '$$',
    wakandaIndex: 78,
    diyFeasibility: 88,
    scienceGrounding: 88,
    realitySplit: {
      real:
        'Mars one-way light time ranges from about 3 to 22 minutes, so a round trip can take 6 to 45 minutes. Flight rovers cope with autonomous navigation and on-board target selection: Curiosity and Perseverance can drive themselves over terrain and can choose interesting rocks by spectral class without waiting for Earth. Simulating that lag and requiring the rover to complete a science task with zero ground commands is a faithful reproduction of the core constraint.',
      narrative:
        'The "just joystick the rover" assumption. Teleoperation is impossible at Mars distances, which is precisely why autonomy is not a nice-to-have but the enabling technology. The project does not claim to reproduce flight software; it reproduces the constraint.',
    },
    summary:
      'Run a rover that must complete a multi-target science task with every uplink delayed by a simulated 6–45 minute round trip, choosing and marking its own targets on board.',
    science:
      'The engineering consequence of light lag is that command sequences, not control sticks, drive planetary robots. A sol of activity is built as a timed sequence, uploaded, executed, and the results returned hours later, so the rover must recognise failures and safely stop on its own. On-board target selection works by scoring candidate rocks with a classifier, usually a spectral or colour signature plus a geometric criterion such as reachability and sun angle, and then placing the instrument without human input. Autonomy also has to be conservative: a false positive wastes a sol, and a navigation error can end the mission, so the cost function must trade science yield against risk. That risk trade is the heart of the simulation, and it is measurable as targets attempted, targets validated and safe stops per sol.',
    billOfMaterials: [
      { item: 'Differential-drive rover or a physics simulator', qty: '1', note: 'Real hardware teaches the failure modes' },
      { item: 'Camera plus companion computer (Jetson or Pi)', qty: '1', note: 'Runs the on-board target classifier' },
      { item: 'IMU and wheel encoders', qty: '1 set', note: 'Odometry and slip detection' },
      { item: 'AprilTags or fiducial markers', qty: '1 set', note: 'Ground-truth localisation for scoring' },
      { item: 'Turret or marker for target designation', qty: '1', note: 'Shows the chosen target physically' },
      { item: 'Base station with a delay simulator', qty: '1', note: 'Injects 6–45 min round-trip latency' },
      { item: 'LiFePO4 pack with protection', qty: '1', note: 'Fused, monitored, fire-safe' },
    ],
    buildSteps: [
      { title: 'Build the delay simulator first', detail: 'Insert a queue between the operator console and the rover that delays every message by a configurable one-way time, defaulting to 12 minutes. Block all real-time teleoperation. If the human can still nudge the rover, the experiment is invalid.' },
      { title: 'Implement on-board target selection', detail: 'Run a classifier on camera frames that scores candidate targets and selects the best reachable one based on colour or spectral signature, distance and sun angle. Log every candidate and its score, not just the chosen one.' },
      { title: 'Close the loop on the rover', detail: 'Let the rover drive to the chosen target, place or point the instrument, and record a measurement, all without a ground command. Add a confidence threshold below which it defers rather than acting.' },
      { title: 'Add safe-stop behaviour', detail: 'Implement watchdog timeouts, tilt and slip limits, and a rule that aborts the sol if localisation uncertainty exceeds a threshold. Every abort must be logged with its cause.' },
      { title: 'Run a multi-sol science campaign', detail: 'Give the rover a task such as "find and characterise three distinct target classes". Run for several simulated sols with the delay active and score targets attempted, validated, science value and safe stops.' },
      { title: 'Analyse the human cost', detail: 'Compare a sol planned with full knowledge against the autonomous sol. Quantify the extra time and the missed targets that autonomy costs, because that gap is the real price of light lag.' },
    ],
    code: {
      language: 'python',
      snippet:
        'import heapq, time\n\n# Latency-injecting command queue: every uplink costs the configured light time\ndef one_way_seconds(earth_mars_distance_au):\n    AU_KM = 149_597_870.7\n    C_KM_S = 299_792.458\n    return earth_mars_distance_au * AU_KM / C_KM_S\n\nclass DelayedLink:\n    def __init__(self, one_way_s):\n        self.one_way_s = one_way_s\n        self.q = []\n        self.t = 0.0\n    def send(self, payload):\n        heapq.heappush(self.q, (self.t + self.one_way_s, payload))\n    def poll(self):\n        out = []\n        while self.q and self.q[0][0] <= self.t:\n            out.append(heapq.heappop(self.q)[1])\n        return out\n\nfor au in (0.37, 0.52, 1.0, 2.0):\n    ow = one_way_seconds(au)\n    print(f"{au:.2f} AU -> one way {ow/60:5.1f} min, round trip {2*ow/60:5.1f} min")\n\nlink = DelayedLink(one_way_seconds(0.52))\nlink.send("drive to waypoint 3")\nlink.t += 60\nprint("commands available after 60 s of execution:", link.poll())',
      note: 'The round-trip table is the design driver. Any command architecture that assumes a human in the loop is dead on arrival at these numbers.',
    },
    metrics: [
      { label: 'science targets completed with zero ground commands', value: '3 of 3 target classes in a multi-sol run' },
      { label: 'round-trip delay injected', value: '6–45 min, matched to the simulated distance' },
      { label: 'target classifier precision', value: '> 80% on the validation set' },
      { label: 'safe stops per sol', value: '< 1, each with a logged cause' },
      { label: 'energy per sol', value: 'within 15% of the budgeted value' },
    ],
    stretchGoals: [
      'Add a dust-storm scenario that reduces solar input and forces the rover to reprioritise its sol.',
      'Run two rovers sharing a base station and resolve their target-selection conflicts autonomously.',
      'Compare a spectral classifier with a learned one and report the false-positive cost in sols.',
    ],
    safety: [
      'A rover with a manipulator or turret can pinch or strike a person. Keep a hardware emergency stop, run it in an enclosure, and never test target marking at eye level.',
      'Fuse and monitor the battery pack. An autonomous multi-hour run with an unprotected lithium pack is a fire risk, and charging must be supervised.',
      'If the classifier can command motion toward an object, validate its decisions in simulation for many hours before letting it drive on hardware, and cap the maximum speed.',
      'Label the setup clearly as a simulation of light lag, not a Mars mission. Do not present simulated science results as real planetary data.',
    ],
    lessonLinks: ['w7l14', 'w2l4', 'w5l10'],
    sources: [
      { label: 'ExoMars software passes ESA Mars yard driving test (autonomy validation)', url: 'https://spacenews.com/exomars-software-passes-esa-mars-yard-driving-test/' },
      { label: 'On-board data processing for planetary missions (ESA workshop)', url: 'https://zenodo.org/records/5521575/files/09.04_OBDP2021_Kuligowski.pdf' },
      { label: 'NASA Mars 2020 Perseverance mission — rover autonomy', url: 'https://mars.nasa.gov/mars2020/' },
    ],
  },
  {
    id: 'space-radhard-avionics-fault-injection',
    title: 'Rad-Hard Avionics and Fault Injection',
    tagline: 'TID, SEU, watchdogs and triple modular redundancy — then break your own MCU on purpose.',
    category: 'space',
    difficulty: 'master',
    buildTime: '3–5 weekends',
    costBand: '$$$',
    wakandaIndex: 72,
    diyFeasibility: 74,
    scienceGrounding: 90,
    realitySplit: {
      real:
        'Radiation effects on electronics are measured and quantified. Total ionising dose is quoted in krad(Si) with commercial parts typically surviving 5–30 krad, rad-tolerant parts around 100 krad and rad-hard parts beyond 300 krad; a low Earth orbit CubeSat may accumulate roughly 1–10 krad over five years behind modest shielding. Single-event upsets are bit flips caused by a single particle, and the standard mitigations — triple modular redundancy with voting, error-detecting and correcting memory, watchdogs and latch-up current limiting — are all testable on a bench.',
      narrative:
        'The "space-grade means indestructible" story. Rad-hard parts are expensive, slow and often decades behind commercial silicon, and no mitigation makes a part immune: it changes the failure rate. A single-event latch-up can destroy a device in milliseconds regardless of the software running on it.',
    },
    summary:
      'Build a triple-modular-redundant MCU system with a watchdog and memory protection, then run a deliberate fault-injection campaign that flips bits and trips supplies to measure how the system recovers.',
    science:
      'Total ionising dose accumulates as trapped charge in oxides, shifting thresholds and eventually causing functional failure; it is a slow, cumulative process mitigated by shielding and by part selection. Single-event effects are stochastic and immediate: an energetic particle deposits charge along its track and can flip a latch (SEU), trigger a transient (SET), or open a parasitic thyristor path and cause a latch-up (SEL) that only a power cycle clears and that can be destructive if current is not limited. Triple modular redundancy runs three copies of a computation and votes; it converts a single upset into no error, but correlated upsets in shared resources defeat it, which is why the three channels need separate clocks and memory. Error-correcting codes protect storage, and a watchdog with an independent clock recovers the processor from a hang. Fault injection — forcing bit flips in RAM or registers and measuring detection and recovery — is the standard ground test that quantifies all of this without a beam.',
    billOfMaterials: [
      { item: 'Three identical MCUs (RP2040 or AVR) for TMR', qty: '3', note: 'Separate clock sources, shared bus only where unavoidable' },
      { item: 'Voter logic or a fourth MCU as the voter', qty: '1', note: 'Majority vote on every output word' },
      { item: 'External watchdog timer (TPS3813 class)', qty: '1', note: 'Independent clock, resets the processor on a missed kick' },
      { item: 'EDAC-protected SRAM or an ECC memory', qty: '1', note: 'Corrects single-bit errors, detects double' },
      { item: 'Current-limited supply with a latch-up trip', qty: '1', note: 'Cuts power before a SEL destroys the part' },
      { item: 'Fault injector (relay, MOSFET or GPIO-driven)', qty: '1 set', note: 'Forces bit flips and power glitches' },
      { item: 'Logic analyser with deep capture', qty: '1', note: 'To see the voter output versus the injected fault' },
      { item: 'Neutron or proton beam time (optional)', qty: 'optional', note: 'The only way to measure a real cross-section' },
    ],
    buildSteps: [
      { title: 'Establish a single-channel baseline', detail: 'Run the target computation on one MCU and characterise it: execution time, memory footprint, power and behaviour under a forced bit flip. You cannot measure the benefit of TMR without this control.' },
      { title: 'Build the triplicated system', detail: 'Run the same computation on three MCUs with independent clocks and separate RAM. Feed all three outputs to a voter and take the majority. Keep shared resources to a minimum, because shared buses are a correlated-failure path.' },
      { title: 'Add EDAC and a watchdog', detail: 'Protect memory with an error-correcting code and add an external watchdog with its own oscillator. Verify that a deliberately hung program is reset and that a single-bit memory error is corrected silently.' },
      { title: 'Build the fault injector', detail: 'Use a microcontroller-driven relay or MOSFET to corrupt a RAM location or glitch a supply rail at a controlled time. Synchronise the injection with the computation so you know exactly which operation was hit.' },
      { title: 'Run an injection campaign', detail: 'Inject thousands of faults across the code and memory space. For each, record whether the output was correct, corrected by EDAC, masked by the voter, or wrong. That table is the result.' },
      { title: 'Model the mission dose', detail: 'Combine a published environment model with a shielding estimate to compute the mission TID, and combine a measured or literature cross-section with the particle flux to estimate upsets per day. Compare with your injection-derived error rate.' },
    ],
    code: {
      language: 'python',
      snippet:
        'import numpy as np\nfrom itertools import combinations\n\n# Triple modular redundancy with a majority voter and EDAC-style scrub\ndef voter(a, b, c):\n    return (a & b) | (b & c) | (a & c)\n\ndef tmr_corrects(n_channels, flips):\n    return flips <= (n_channels - 1) // 2\n\ndef seu_rate(cross_section_cm2, flux_per_cm2_s, bits=1):\n    return cross_section_cm2 * flux_per_cm2_s * bits\n\nrng = np.random.default_rng(3)\nfor flips in range(0, 4):\n    vals = [0b1011] * 3\n    for i in range(flips):\n        ch = rng.integers(0, 3)\n        vals[ch] ^= 1 << int(rng.integers(0, 16))\n    print(f"{flips} upsets -> voter output {voter(*vals):04b}, corrected={tmr_corrects(3, flips)}")\n\nprint("upsets/day:", round(seu_rate(1e-10, 1e4, bits=8) * 86400, 3))',
      note: 'TMR corrects single upsets and fails on double upsets in different channels. The cross-section term is what converts that fact into an expected error rate per day.',
    },
    metrics: [
      { label: 'TMR correction of single-bit upsets', value: '100% with no output glitch' },
      { label: 'watchdog recovery time', value: '< 100 ms from hang to resumed operation' },
      { label: 'latch-up trip threshold', value: '< 300 mA supply current' },
      { label: 'double-upset detection rate', value: 'measured and reported from the campaign' },
      { label: 'modelled SEU rate', value: 'upsets per day from cross-section times flux' },
    ],
    stretchGoals: [
      'Add a reconfigurable FPGA voter and compare scrubbing strategies.',
      'Run a beam test or use a published cross-section and validate the injection-derived error rate.',
      'Add a redundant sensor bus and study common-mode failures when two channels share a power rail.',
    ],
    safety: [
      'Fault injection destroys hardware by design. Use a current-limited bench supply, keep the injector isolated from the mains, and expect to lose boards.',
      'A single-event latch-up test on a real irradiated part can cause rapid heating and even fire. Never test a device in a beam facility without the facility safety officer and a thermal cut-out.',
      'Do not use a real radioactive source to irradiate parts at home. Only a licensed facility with proper dosimetry may do this, and the dose limits of 10 CFR Part 20 apply.',
      'If you model a mission for a real spacecraft, keep the radiation-environment and shielding data under the appropriate export and security controls.',
    ],
    lessonLinks: ['w6l11', 'w8l16'],
    sources: [
      { label: 'Radiation hardening — TID, SEE classes and mitigation techniques', url: 'https://en.wikipedia.org/wiki/Radiation_hardening' },
      { label: 'Single-event upset — mechanism and cross-section', url: 'https://en.wikipedia.org/wiki/Single-event_upset' },
      { label: 'Triple modular redundancy — voting and correlated failure limits', url: 'https://en.wikipedia.org/wiki/Triple_modular_redundancy' },
      { label: 'Radiation effects on electronics and mitigation (thesis, NTNU)', url: 'https://ntnuopen.ntnu.no/ntnu-xmlui/bitstream/handle/11250/2371107/747981_FULLTEXT01.pdf' },
    ],
  },
  {
    id: 'space-cubesat-adcs-sim',
    title: 'CubeSat ADCS: B-dot to Pointing',
    tagline: 'Magnetorquer detumbling and quaternion attitude control you can fly in simulation tonight.',
    category: 'space',
    difficulty: 'journeyman',
    buildTime: '4–6 weekends',
    costBand: '$$$',
    wakandaIndex: 80,
    diyFeasibility: 72,
    scienceGrounding: 92,
    realitySplit: {
      real:
        'Attitude determination and control is mature spacecraft engineering. Rigid-body quaternion kinematics, the Euler equations with the gyroscopic coupling term, B-dot magnetorquer detumbling and reaction-wheel pointing with momentum dumping are all standard, published and simulable to high fidelity. A CubeSat-class ADCS can be modelled accurately enough that the simulation predicts real detumble times of orbits.',
      narrative:
        'The "point anywhere with a magnetometer" assumption. A three-axis magnetometer measures two angles, not three, because rotation about the field vector is invisible to it; without sun sensors or star trackers the yaw is unobservable. Reaction wheels also saturate, and dumping momentum back through magnetorquers couples the control to the orbit geometry.',
    },
    summary:
      'Build a quaternion-based ADCS simulation with a B-dot detumble controller and a reaction-wheel pointing controller that dumps momentum through magnetorquers, then validate it on a Helmholtz cage or air-bearing table.',
    science:
      'Attitude is represented by a unit quaternion q, propagated by q̇ = ½ q ⊗ ω in the body frame. The rotational dynamics are I ω̇ = τ − ω × (I ω), where the cross-product term is the gyroscopic coupling that makes a spinning spacecraft precess. A magnetorquer of dipole moment m in a field B produces torque τ = m × B, so a B-dot controller that sets m proportional to the negative time derivative of the measured field extracts energy from the tumble and drives the rate down without needing an attitude estimate at all. Reaction wheels exchange angular momentum with the body to point precisely, but their stored momentum grows as they fight external torques, so a magnetorquer must periodically dump it. Magnetometer-only attitude is underdetermined about the field direction, which is why a sun sensor is the cheapest way to add the missing axis.',
    billOfMaterials: [
      { item: '1U or 2U structure or a 3-DOF air-bearing table', qty: '1', note: 'Air bearing gives hours of free rotation' },
      { item: 'Three-axis magnetorquer coils or rods', qty: '1 set', note: 'Dipole moment in A·m²; drive with H-bridges' },
      { item: 'Three-axis magnetometer', qty: '1', note: 'Also used as the B-dot sensor' },
      { item: 'IMU with gyroscopes', qty: '1', note: 'The primary rate measurement' },
      { item: 'Reaction wheel module or a DIY brushless wheel', qty: '1–3', note: 'One wheel per controlled axis' },
      { item: 'Sun sensors or photodiodes', qty: '4–6', note: 'Adds the axis the magnetometer cannot see' },
      { item: 'STM32 or similar flight-like MCU', qty: '1', note: 'Runs the control loop at 1–10 Hz' },
      { item: 'Helmholtz cage for ground testing', qty: '1', note: 'Uniform field with a known magnitude and direction' },
    ],
    buildSteps: [
      { title: 'Implement quaternion kinematics and dynamics', detail: 'Propagate q with the quaternion derivative and integrate the Euler equations with an RK4 step. Verify that a torque-free axisymmetric body conserves angular momentum and precesses at the predicted rate. If it does not, your inertia tensor is wrong.' },
      { title: 'Model the magnetic field', detail: 'Use a tilted-dipole or IGRF model to compute the field along the orbit. Propagate the orbit with a Keplerian model so the field varies realistically at orbital rate rather than staying constant.' },
      { title: 'Implement B-dot detumbling', detail: 'Differentiate the measured field, low-pass filter it, and command m = −k Ḃ. Verify that the body rates fall roughly exponentially and that the commanded dipoles stay within the coil rating. Tune k for the fastest convergence that does not saturate the drivers.' },
      { title: 'Add reaction-wheel pointing', detail: 'Implement a quaternion error and a PD controller that commands wheel torque. Include wheel saturation: track stored momentum and stop pretending the wheels are infinite.' },
      { title: 'Add momentum dumping', detail: 'When wheel momentum exceeds a threshold, command magnetorquer dipoles that produce a torque opposing the stored momentum, projected onto the plane perpendicular to the field. Verify that the wheels desaturate without exciting a large attitude error.' },
      { title: 'Validate on hardware', detail: 'Put the flight board on an air-bearing table inside a Helmholtz cage, feed it a synthetic field, and compare the measured detumble time and pointing error with the simulation. The mismatch is your model fidelity.' },
    ],
    code: {
      language: 'python',
      snippet:
        'import numpy as np\n\n# Quaternion kinematics and a B-dot detumble law\ndef qdot(q, w):\n    q = np.asarray(q, dtype=float)\n    w = np.asarray(w, dtype=float)\n    qw, qv = q[0], q[1:]\n    dq = 0.5 * np.array([-np.dot(qv, w), qw * w + np.cross(qv, w)])\n    return dq\n\ndef rk4_step(q, w, dt, torque_fn, inertia):\n    def f(state):\n        qq, ww = state[:4], state[4:]\n        Iw = inertia @ ww\n        tau = torque_fn(qq, ww)\n        dw = np.linalg.solve(inertia, tau - np.cross(ww, Iw))\n        return np.concatenate([qdot(qq, ww), dw])\n    s = np.concatenate([q, w])\n    k1 = f(s)\n    k2 = f(s + 0.5 * dt * k1)\n    k3 = f(s + 0.5 * dt * k2)\n    k4 = f(s + dt * k3)\n    s = s + dt / 6.0 * (k1 + 2 * k2 + 2 * k3 + k4)\n    q, w = s[:4], s[4:]\n    return q / np.linalg.norm(q), w\n\nI = np.diag([0.003, 0.003, 0.001])\nB = np.array([2e-5, 0.0, 3e-5])\nBdot = np.array([1e-6, 0.0, -2e-6])\nk = 1e6\nm = -k * Bdot\ntau = np.cross(m, B)\nprint("commanded dipole A m^2:", m, "torque N m:", tau)',
      note: 'B-dot works without any attitude knowledge because it only needs the field derivative. That is why nearly every CubeSat detumbles before it knows where it is pointing.',
    },
    metrics: [
      { label: 'detumble rate', value: 'from 10°/s to < 1°/s within 3 orbits' },
      { label: 'pointing error with wheels', value: '< 2° (2σ)' },
      { label: 'wheel momentum dumped per orbit', value: '≥ the accumulated external torque impulse' },
      { label: 'magnetorquer dipole', value: 'within the coil rating (typically 0.1–1 A·m²)' },
      { label: 'simulation energy drift over 10 orbits', value: '< 1% for a torque-free body' },
    ],
    stretchGoals: [
      'Add a star tracker model and quantify the pointing improvement over magnetometer plus sun sensors.',
      'Model a deployable solar panel and study how the changing inertia affects detumble.',
      'Implement an extended Kalman filter for attitude estimation with gyro bias estimation.',
    ],
    safety: [
      'Fast-spinning reaction wheels store significant energy. Enclose them, balance them, and never touch a spinning wheel or place loose items near it.',
      'An air-bearing table is a pinch and fall hazard. Restrain the test article with a soft tether, keep feet clear, and stop the rotation before removing it.',
      'Magnetorquer coils draw amps and get hot during a long detumble. Fuse the drivers, monitor coil temperature and enforce a duty limit.',
      'The Helmholtz cage produces a modest field but its power supply is mains-fed. Earth the frame, fuse the supply, and keep the current safely inside the coil rating.',
    ],
    lessonLinks: ['w4l8', 'w5l9', 'w8l15'],
    sources: [
      { label: 'Attitude control — quaternion kinematics, wheels and magnetorquers', url: 'https://en.wikipedia.org/wiki/Attitude_control' },
      { label: 'Magnetorquer — torque from a dipole in the geomagnetic field', url: 'https://en.wikipedia.org/wiki/Magnetorquer' },
      { label: 'Reaction wheel — momentum storage and saturation', url: 'https://en.wikipedia.org/wiki/Reaction_wheel' },
      { label: 'A framework for developing an ADCS simulator for CubeSats', url: 'https://www.sciencedirect.com/science/article/pii/S2590123024004559' },
    ],
  },
  {
    id: 'space-tvac-bell-jar',
    title: 'Budget Thermal-Vacuum Chamber',
    tagline: 'Bell jar, Peltier plate, −40 to +85 °C — and an honest list of what it cannot reproduce.',
    category: 'space',
    difficulty: 'master',
    buildTime: '4–6 weekends',
    costBand: '$$$',
    wakandaIndex: 76,
    diyFeasibility: 62,
    scienceGrounding: 88,
    realitySplit: {
      real:
        'Thermal-vacuum testing is a standard qualification step, and a competent amateur can reproduce its essential physics on a small scale. In vacuum, convection vanishes, so heat transfer is by conduction and radiation only; the resulting temperature distribution is very different from air, and it changes the behaviour of electronics, lubricants and adhesives. Peltier stacks can reach roughly −40 °C on the cold side with proper heat-sink management, resistive heaters reach +85 °C easily, and a two-stage pump with a decent bell jar reaches a low enough pressure to demonstrate the difference.',
      narrative:
        'The "space simulator in a jar" claim. A bell jar cannot reproduce solar ultraviolet and vacuum-ultraviolet flux, atomic oxygen, plasma charging, the 10⁻⁸ torr of deep space, the vibration and acoustic loads of launch, or the large temperature gradients of a real spacecraft. Saying so explicitly is part of the build, not a disclaimer bolted on at the end.',
    },
    summary:
      'Build a bell-jar thermal-vacuum chamber with a two-stage Peltier cold plate and a resistive heater, cycle a rover component from −40 °C to +85 °C, and publish an explicit list of the space-environment effects the rig cannot reproduce.',
    science:
      'At pressures below roughly 10⁻³ torr the mean free path of gas exceeds the chamber dimensions and convection stops, so a component in vacuum can only lose heat by conduction through its mounts and by radiation to the chamber walls. That is why a part in vacuum runs hotter than the same part in air, and why thermal-vacuum testing finds failures that a bench test misses. A single-stage Peltier module can hold a 40–70 K temperature difference between its faces, and a two-stage stack reaches lower temperatures but with much less heat-pumping capacity, so the achievable cold-side temperature depends on the load and the heat sink. Outgassing becomes visible in vacuum: adhesives, tapes and plastics release volatiles that can condense on cold surfaces, which is exactly the contamination mechanism that space hardware must avoid. A PID controller with a K-type thermocouple on the device under test closes the loop.',
    billOfMaterials: [
      { item: 'Polycarbonate or thick-glass bell jar with a base plate', qty: '1', note: 'Polycarbonate is safer under vacuum; inspect for scratches' },
      { item: 'Two-stage Peltier assembly plus a large heat sink and fan', qty: '1', note: 'Cold side at −40 °C requires aggressive hot-side cooling' },
      { item: 'Two-stage rotary-vane vacuum pump and gauge', qty: '1', note: 'Target < 1e-4 torr; use a cold trap to protect the pump' },
      { item: 'Resistive heater pad with a solid-state relay', qty: '1', note: 'For the +85 °C end of the cycle' },
      { item: 'K-type thermocouples and a PID controller', qty: '3', note: 'One on the device, one on the plate, one on the wall' },
      { item: 'Vacuum-rated feedthroughs for power and signals', qty: '1 set', note: 'Seal properly or you will never reach pressure' },
      { item: 'Polycarbonate blast shield and a reinforced chamber base', qty: '1', note: 'Implosion containment' },
      { item: 'Desiccant and a vent valve', qty: '1 set', note: 'Prevents condensation on warm-up and protects the pump' },
    ],
    buildSteps: [
      { title: 'Build the chamber and prove the vacuum', detail: 'Assemble the bell jar on its base with a fresh gasket and a cold trap. Pump down with the chamber empty and record the pressure against time. A leak rate that plateaus above your target means a seal problem, not a pump problem, so find it before adding hardware.' },
      { title: 'Characterise the cold plate', detail: 'Run the Peltier stack with no load and record the cold-side temperature and the hot-side temperature against time at several currents. Then add a known thermal load and repeat. The curve of achievable cold-side temperature versus heat load is the specification you must design against.' },
      { title: 'Wire the device and the sensors', detail: 'Mount the component on the cold plate with a known thermal interface, run its power and signals through vacuum feedthroughs, and attach a thermocouple directly to the component, not to the plate. The component temperature is the test, not the plate temperature.' },
      { title: 'Run a qualification cycle', detail: 'Soak at +85 °C for 30 minutes, ramp to −40 °C at no more than 5 °C per minute, soak again, and return to ambient. Log the component\'s function throughout; a communication drop or a parameter shift that recovers on warm-up is a real finding.' },
      { title: 'Test in air and in vacuum', detail: 'Repeat the same cycle at atmospheric pressure and compare the component temperature with the same plate setpoint. The difference is the convection term, and demonstrating it is the core physics lesson of the rig.' },
      { title: 'Document the limits honestly', detail: 'Write the list of what is not reproduced: solar UV and VUV, atomic oxygen, plasma charging, deep-space pressure, launch vibration and acoustics, and large multi-node gradients. State which of these could change the conclusion of your test.' },
    ],
    code: {
      language: 'python',
      snippet:
        'import numpy as np\n\nSIGMA = 5.670374419e-8\n\ndef radiation_only_equilibrium(q_in_w, area_m2, emissivity=0.85, t_wall_k=293.15):\n    # solve q_in = eps*sigma*A*(T^4 - T_wall^4) for the device temperature\n    t4 = q_in_w / (emissivity * SIGMA * area_m2) + t_wall_k ** 4\n    return t4 ** 0.25\n\ndef conduction_leak(q_w, delta_t_k, length_m=0.05, area_m2=1e-4, k_w_per_mk=15.0):\n    return k_w_per_mk * area_m2 * delta_t_k / length_m\n\nfor q in (0.05, 0.2, 0.5, 1.0, 2.0):\n    t = radiation_only_equilibrium(q, 0.002)\n    print(f"{q:4.2f} W dissipated -> radiation-only device temperature {t-273.15:6.1f} C")\n\nprint("conduction through a mount at 60 K delta:", round(conduction_leak(0, 60), 3), "W")',
      note: 'In vacuum a small dissipation raises the device temperature far more than in air, because radiation is the only escape. Sizing the mounts is therefore part of the thermal design.',
    },
    metrics: [
      { label: 'chamber pressure', value: '< 1e-4 torr for the vacuum test' },
      { label: 'cold-plate temperature', value: '−40 °C or below at the test load' },
      { label: 'hot soak temperature', value: '+85 °C ± 2 °C' },
      { label: 'ramp rate', value: '≤ 5 °C/min to avoid thermal shock' },
      { label: 'in-air versus in-vacuum component ΔT', value: 'measured and reported at the same setpoint' },
      { label: 'component function after 10 cycles', value: 'no parameter shift greater than 5%' },
    ],
    stretchGoals: [
      'Add a cold finger cooled by dry ice or liquid nitrogen and extend the cold end below −60 °C.',
      'Measure outgassing by weighing the component before and after and by inspecting a cold plate for condensate.',
      'Add a small resistive heater to a second node and study a two-node thermal gradient.',
    ],
    safety: [
      'A bell jar under vacuum stores energy and can implode. Use polycarbonate or an annealed glass jar, never a scratched or chipped one, wrap it in a blast shield or mesh, and never lean over it while it is evacuated.',
      'Vacuum pump oil mist is a respiratory and skin hazard and oil can backstream into the chamber. Use a cold trap or an oil-free pump, and vent the exhaust to a ventilated area.',
      'A Peltier hot side can exceed 100 °C and the cold side causes contact burns. Insulate the surfaces, label them, and let the assembly reach ambient before handling.',
      'Never pressurise a bell jar or a vacuum vessel. These chambers are designed for internal vacuum only, and positive pressure can rupture the base or launch the jar.',
      'If you add liquid nitrogen for a colder test, fit an oxygen monitor in the room and never work alone in a small, poorly ventilated space.',
    ],
    lessonLinks: ['w6l11', 'w8l15'],
    sources: [
      { label: 'Thermal vacuum chamber — function and test conditions', url: 'https://en.wikipedia.org/wiki/Thermal_vacuum_chamber' },
      { label: 'NASA Langley 6 ft × 6 ft thermal vacuum chamber capability upgrades', url: 'https://ntrs.nasa.gov/api/citations/20150000594/downloads/20150000594.pdf' },
      { label: 'Thermoelectric cooling — Peltier stack performance and limits', url: 'https://en.wikipedia.org/wiki/Thermoelectric_cooling' },
      { label: 'NASA space environment chamber documentation', url: 'http://oim.hq.nasa.gov/oia/scap/docs/SCAP_CHAMBER_V20_112508_508.pdf' },
    ],
  },
  {
    id: 'space-isru-regolith-rover',
    title: 'Regolith ISRU Rover Concept',
    tagline: 'Sinter, dig or extract water — with real NASA power and mass numbers in the ledger.',
    category: 'space',
    difficulty: 'master',
    buildTime: '6–10 weeks (concept plus benchtop)',
    costBand: '$$$',
    wakandaIndex: 88,
    diyFeasibility: 40,
    scienceGrounding: 84,
    realitySplit: {
      real:
        'In-situ resource utilisation is a funded NASA technology area with published power, mass and process numbers. Microwave and solar sintering of regolith into bricks and landing pads has been demonstrated, water can be extracted by heating icy regolith, MOXIE produced oxygen from Martian carbon dioxide at roughly 6–12 grams per hour, and fission surface power designs deliver 40 kWe within a 6000 kg mass budget. A benchtop sintering and excavation rig with a real energy budget is buildable.',
      narrative:
        'The "print a base on Mars with a rover" pitch. Excavation, beneficiation and sintering at scale demand kilowatts and tonnes of machinery, and the specific energy for heating regolith is large. A student project can measure the specific energy for a small sintered brick and close a budget; it cannot demonstrate a habitat.',
    },
    summary:
      'Measure the specific energy and compressive strength of sintered regolith simulant with a benchtop rig, then close a rover-scale power and mass budget for a sintering or water-extraction mission using published NASA figures.',
    science:
      'Sintering binds regolith grains by heating them until diffusion and partial melting fuse the contacts, and it can be driven by microwaves (which couple to iron-bearing phases), by concentrated sunlight, or by a resistive kiln. The controlling number is specific energy: the energy required per kilogram of processed regolith, which sets the power plant size for a given production rate. Water extraction from icy regolith requires heating the material to sublimate the ice and then condensing it, and the yield depends on the ice concentration, which varies enormously — permanently shadowed lunar regions show elevated hydrogen, with ejecta measurements indicating a few weight percent water in some deposits, while most of the Moon is far drier. Oxygen from regolith via molten regolith electrolysis or from the Martian atmosphere via solid-oxide electrolysis (the MOXIE approach) has been demonstrated at gram-per-hour scale. Mass and power closure is the real design work: every kilogram of hardware must be launched, and every watt must come from solar panels that suffer dust storms or from a fission reactor with its own radiator.',
    billOfMaterials: [
      { item: 'Lunar or Martian regolith simulant (JSC-1A class)', qty: '5 kg', note: 'Respirable silica hazard; use a respirator and a glovebox' },
      { item: 'Microwave oven or a Fresnel solar concentrator', qty: '1', note: 'Sintering heat source; concentrated sunlight is eye-hazardous' },
      { item: 'Alumina crucible and refractory brick', qty: '1 set', note: 'Containment at temperature' },
      { item: 'K-type thermocouple and data logger', qty: '2', note: 'Measure the thermal cycle, not just the setpoint' },
      { item: 'Load frame or a hydraulic press with a gauge', qty: '1', note: 'Compressive strength measurement' },
      { item: 'Energy meter on the heat source', qty: '1', note: 'The specific-energy calculation depends on it' },
      { item: 'Small auger or bucket-drum excavator on a rover chassis', qty: '1', note: 'Measures the digging energy per kilogram' },
      { item: 'Scale, 0.1 g resolution', qty: '1', note: 'Mass balance for the energy calculation' },
      { item: 'Vacuum or inert-gas enclosure (optional)', qty: '1', note: 'Sintering behaviour differs in vacuum' },
    ],
    buildSteps: [
      { title: 'Characterise the simulant', detail: 'Measure the bulk density, particle size distribution and moisture content of your simulant. Specific energy is meaningless without a known feed mass and moisture, and simulants vary batch to batch.' },
      { title: 'Sinter a series of bricks', detail: 'Process identical masses at several temperatures and hold times, recording the total energy drawn by the heat source. Weigh each brick and measure its dimensions to get density and shrinkage. The specific energy in megajoules per kilogram is the headline number.' },
      { title: 'Measure the compressive strength', detail: 'Load each brick in a press to failure and compute the compressive strength in megapascals. Plot strength against specific energy; the design point is where additional energy stops buying strength.' },
      { title: 'Measure the excavation energy', detail: 'Run the auger or drum on the rover and record the electrical energy per kilogram of simulant moved. Excavation, not sintering, is often the dominant term in the budget, and it is the term amateurs forget.' },
      { title: 'Close the mass and power budget', detail: 'Combine excavation, transport, processing and (if applicable) water condensation into an energy per kilogram of product. Scale to a target production rate and compare the required power with a realistic source: a 40 kWe fission surface power unit at 6000 kg, or a solar array with a dust-storm derating.' },
      { title: 'Compare with NASA numbers', detail: 'Put your measured specific energy beside published ISRU process figures and MOXIE\'s oxygen production rate. State where your benchtop result sits and which losses a flight system would add.' },
    ],
    code: {
      language: 'python',
      snippet:
        'import numpy as np\n\n# Specific energy and mission-level power/mass budget\ndef specific_energy_mj_per_kg(energy_j, mass_kg):\n    return energy_j / mass_kg / 1e6\n\ndef required_power_w(production_kg_per_sol, sec_per_sol, specific_mj_per_kg, efficiency=0.5):\n    energy_per_kg_j = specific_mj_per_kg * 1e6 / efficiency\n    return production_kg_per_sol * energy_per_kg_j / sec_per_sol\n\ndef fission_mass_kg(power_w, specific_mass_kg_per_kwe=150.0):\n    return power_w / 1000.0 * specific_mass_kg_per_kwe\n\nSEC_PER_SOL = 88775.0\nse = specific_energy_mj_per_kg(4.0e6, 0.5)      # 4 MJ into 0.5 kg of simulant\nprint(f"specific energy: {se:.1f} MJ/kg")\nfor rate in (5.0, 50.0, 500.0):\n    p = required_power_w(rate, SEC_PER_SOL, se, efficiency=0.4)\n    print(f"{rate:6.0f} kg/sol -> {p/1000:7.2f} kWe -> fission mass {fission_mass_kg(p):8.0f} kg (at 150 kg/kWe)")',
      note: 'The scaling is brutal: a tonne per sol of sintered product needs a power plant measured in tens of kilowatts. That is the honest reason ISRU is a megaproject.',
    },
    metrics: [
      { label: 'specific sintering energy', value: '2–15 MJ/kg depending on process and simulant' },
      { label: 'sintered compressive strength', value: 'target > 5 MPa for a structural brick' },
      { label: 'excavation energy', value: 'measure joules per kilogram moved' },
      { label: 'water yield from icy simulant', value: '0.5–5 wt% for a representative mixture' },
      { label: 'power for the target production rate', value: 'report kWe and the source mass it implies' },
    ],
    stretchGoals: [
      'Compare microwave, resistive and concentrated-solar sintering on the same simulant.',
      'Add a condenser and measure the water actually recovered from an icy simulant.',
      'Run the excavator autonomously and log energy per kilogram over a full battery discharge.',
    ],
    safety: [
      'Regolith simulant contains crystalline silica and fine dust. Wear a fitted respirator, work in a glovebox or with local extraction, never dry-sweep, and wet-clean surfaces. Silicosis is a permanent injury.',
      'Microwave and concentrated-solar heating can cause burns, eye damage and fire. Use a shielded enclosure, never look into a solar concentrator or a microwave cavity, and keep flammables clear.',
      'Sintering rigs reach many hundreds of degrees. Use refractory containment, heat-resistant gloves, and let the crucible cool in a designated area.',
      'Simulants may contain metals or oxides that are hazardous as dust; check the safety data sheet for your specific batch and dispose of waste according to it.',
    ],
    lessonLinks: ['w3l5', 'w8l15', 'w5l9'],
    sources: [
      { label: 'NASA ISRU plans and technology overview (COSPAR presentation)', url: 'https://ntrs.nasa.gov/api/citations/20220008799/downloads/NASA%20ISRU%20Plans_Sanders_COSPAR-Final.pdf' },
      { label: 'In-situ resource utilization — processes and mission context', url: 'https://en.wikipedia.org/wiki/In-situ_resource_utilization' },
      { label: 'NASA ASCEND ISRU and regolith construction presentation', url: 'https://ntrs.nasa.gov/api/citations/20205008303/downloads/AIAA_ASCEND2020_Kleinhenz_presentation_final.pdf' },
      { label: 'Radioisotope and fission power for surface missions (Aerospace Corp.)', url: 'https://spw.aerospace.org/files/2025/07/2_AC_V.-Jovovic_Presentation.pdf' },
    ],
  },
  {
    id: 'space-deep-space-optical-qkd',
    title: 'Deep-Space Optical Link and QKD Ground Station',
    tagline: 'Link-budget maths, turbulence, and a tabletop laser that proves the pointing problem.',
    category: 'space',
    difficulty: 'orisha',
    buildTime: '6–10 weeks',
    costBand: '$$$',
    wakandaIndex: 94,
    diyFeasibility: 32,
    scienceGrounding: 84,
    realitySplit: {
      real:
        'Free-space optical communication is operational. NASA demonstrated high-rate optical downlinks from deep space as part of the Deep Space Optical Communications project, and the link budget — transmit power, antenna gain, space loss, receive aperture and detector efficiency — is standard engineering. Atmospheric turbulence, scintillation and beam wander are measured effects with established mitigation by adaptive optics and by site and time selection. Free-space quantum key distribution is likewise demonstrable, and satellite QKD has been flown.',
      narrative:
        'The "unhackable quantum internet from any rooftop" pitch. Optical links are highly directional and weather-dependent, so availability is poor from a random site; a single-photon detector with good efficiency is expensive and needs cryogenics; and background light in daylight can swamp a QKD link. The ground station is a concept plus a tabletop demonstration, not a deployed secure network.',
    },
    summary:
      'Compute a deep-space optical link budget and validate it against published demonstration rates, model the effect of atmospheric turbulence, and build a tabletop laser link that measures pointing error and received power against prediction.',
    science:
      'The received power in a free-space optical link is P_rx = P_tx G_tx G_rx (λ/4πR)² η, where the gains depend on aperture diameter and wavelength, the inverse-square term is the space loss, and η collects pointing, atmospheric and detector losses. Because the beam diverges only by diffraction, a small pointing error translates into a large fraction of lost power, which is why fine pointing and a beacon are central to any deep-space optical terminal. Atmospheric turbulence creates index-of-refraction fluctuations that cause intensity scintillation, beam wander and phase distortion; the coherence diameter and the Rytov variance quantify the strength, and adaptive optics can correct the phase but not the deep fades. For QKD, the same channel is used to transmit single photons in non-orthogonal polarisation states, and background photons from the sky add errors, so QKD links are typically run at night and with narrow spectral and temporal filtering. The link budget and the error budget together determine whether a given key rate is achievable at all.',
    billOfMaterials: [
      { item: '1550 nm or 650 nm laser diode with a stable driver', qty: '1', note: 'Eye hazard; align under a strict laser safety protocol' },
      { item: 'Collimator and a 50–100 mm receive lens or small telescope', qty: '1 set', note: 'Aperture gain is the cheapest link improvement' },
      { item: 'Quadrant photodiode and pointing controller', qty: '1', note: 'Measures and corrects pointing error' },
      { item: 'SPAD or SiPM with a quench circuit', qty: '1', note: 'For photon counting; 200–400 V bias' },
      { item: 'Beam profiler or a camera with a neutral-density filter', qty: '1', note: 'Measures the beam waist and divergence' },
      { item: 'Turbulence generator: hot plate or a phase screen', qty: '1', note: 'Reproduces scintillation on the bench' },
      { item: 'Optical rail, irises, mounts and beam dumps', qty: '1 set', note: 'Stability and containment' },
      { item: 'FPGA or fast time-tagger', qty: '1', note: 'For coincidence and QKD timing' },
      { item: 'Neutral-density filters and a calibrated power meter', qty: '1 set', note: 'You cannot claim a link budget without measuring power' },
    ],
    buildSteps: [
      { title: 'Measure the source and the optics', detail: 'Record the laser output power, wavelength, beam diameter and divergence after the collimator. Compute the transmit gain from the aperture and compare with the measured far-field profile. Every later number depends on these measurements.' },
      { title: 'Compute the link budget', detail: 'Implement the range equation for a deep-space distance and compare the result with a published demonstration rate and aperture. Then recompute for your tabletop distance and verify that your measured received power matches the prediction to within a few decibels.' },
      { title: 'Build the pointing loop', detail: 'Use a quadrant photodiode and a piezo or galvo mount to close a pointing loop. Measure the residual pointing error and compute the resulting power loss. Then deliberately mispoint by a known angle and verify the loss matches the diffraction calculation.' },
      { title: 'Add turbulence', detail: 'Insert a hot plate or a phase screen in the beam and record the received power time series. Compute the scintillation index (normalised variance) and the fade statistics. Compare a still-air baseline with the turbulent case.' },
      { title: 'Demonstrate a quantum channel', detail: 'Attenuate the source to a mean photon number near 0.1, encode polarisation in two non-orthogonal bases, and count coincidences with the SPAD. Measure the quantum bit error rate in the dark and with background light added, and identify the background level at which the link becomes unusable.' },
      { title: 'Specify the ground station honestly', detail: 'Produce a site requirement: aperture, adaptive-optics need, detector technology, daylight availability and weather statistics. State the key rate you could support and the conditions under which it collapses.' },
    ],
    code: {
      language: 'python',
      snippet:
        'import numpy as np\n\n# Free-space optical link budget\nC = 299792458.0\n\ndef link_budget(p_tx_w, d_tx_m, d_rx_m, wavelength_m, range_m, eta=0.5):\n    gain_tx = (np.pi * d_tx_m / wavelength_m) ** 2\n    gain_rx = (np.pi * d_rx_m / wavelength_m) ** 2\n    space_loss = (wavelength_m / (4 * np.pi * range_m)) ** 2\n    p_rx = p_tx_w * gain_tx * gain_rx * space_loss * eta\n    return p_rx\n\ndef photons_per_second(p_w, wavelength_m):\n    e_photon = 6.62607015e-34 * C / wavelength_m\n    return p_w / e_photon\n\nfor r_km in (1.0, 1e3, 1e6, 1e8):\n    p = link_budget(1.0, 0.1, 1.0, 1550e-9, r_km * 1e3)\n    print(f"range {r_km:9.0e} km -> P_rx {p:9.3e} W, {photons_per_second(p, 1550e-9):9.3e} photons/s")',
      note: 'At deep-space ranges the received photon rate collapses to a trickle, which is exactly why photon-counting detectors and precise pointing dominate the design.',
    },
    metrics: [
      { label: 'link budget error versus measurement', value: '< 3 dB over a tabletop path' },
      { label: 'residual pointing error', value: '< 100 µrad with the loop closed' },
      { label: 'scintillation index with turbulence', value: 'measured and compared with the still-air case' },
      { label: 'QBER in the dark', value: '< 5% at a mean photon number near 0.1' },
      { label: 'QBER with background light', value: 'report the level at which it exceeds 11%' },
    ],
    stretchGoals: [
      'Add a simple adaptive-optics correction with a deformable mirror or a tip-tilt mirror and measure the Strehl improvement.',
      'Run the link across a real outdoor path and log availability against weather.',
      'Implement decoy states and compute the secure key rate from the measured error rate.',
    ],
    safety: [
      'Laser radiation is the dominant hazard. Use enclosed beam paths, interlocks, beam dumps and wavelength-matched eyewear, and never allow a collimated beam to travel at eye level or leave the room. An outdoor beam requires aviation notification and a laser safety officer.',
      'The single-photon detector bias is 200–400 V. Insulate and current-limit the supply, discharge modules before handling, and keep the high-voltage section away from the optical path.',
      'Some detectors need cryogenic cooling. Follow cryogen handling rules: gloves, ventilation, an oxygen monitor in small rooms, and never seal a dewar.',
      'A mains-powered optical bench with water or cryogenic cooling is an electrical and slip hazard. Use earth-leakage protection, keep liquids below the optics, and tidy cabling.',
      'Ground-station concepts that involve satellites require spectrum and laser licensing, and international coordination. Modelling is fine; transmitting to orbit is not a student activity.',
    ],
    lessonLinks: ['w2l4', 'w8l16', 'w8l15'],
    sources: [
      { label: 'Free-space optical communication — link geometry and atmospheric effects', url: 'https://en.wikipedia.org/wiki/Free-space_optical_communication' },
      { label: 'Link budget — the range equation and loss terms', url: 'https://en.wikipedia.org/wiki/Link_budget' },
      { label: 'Satellite-to-ground QKD with adaptive optics (arXiv)', url: 'http://export.arxiv.org/pdf/2111.06747' },
      { label: 'Operational results from the NASA Deep Space Optical Communications ground laser transmitter (IEEE)', url: 'https://ieeexplore.ieee.org/document/11267050' },
    ],
  },
];
