import type { IdeaProject } from '../types';

/**
 * Idea Lab — "Nature & Natural Elements", batch D.
 *
 * Four builds that each pair one real organism with one measurable number:
 * a lateral-line vortex frequency meter, a continuum arm with a workspace map,
 * a living-light bioreactor whose lux you actually report, and a burrowing
 * robot with a joules-per-cubic-centimetre ledger.
 *
 * Honesty rules: `scienceGrounding` is 76–86 here — every project rests on
 * peer-reviewed mechanism, but every one also has a hard part the literature
 * does not hand you (turbulence, cable hysteresis, photometry, granular drag).
 * `realitySplit.narrative` says plainly which sentence in the pitch is theatre.
 * No engineered organisms with antibiotic-resistance markers, no invented
 * performance figures, no citation that was not opened first.
 */
export const natureProjectsD: IdeaProject[] = [
  /* ================================================================== */
  /* 1 · ARTIFICIAL LATERAL LINE                                        */
  /* ================================================================== */
  {
    id: 'nature-lateral-line-vortex-rangefinder',
    title: 'Ripple Spine — Artificial Lateral-Line Vortex Rangefinder',
    tagline:
      'A cylinder of differential pressure taps that hears the von Kármán street of an upstream obstacle, measures its shedding frequency against the Strouhal prediction, and converts the downstream convection lag into a distance.',
    category: 'nature',
    difficulty: 'journeyman',
    buildTime: '4–6 weekends (about 30 h), plus one long day of flume tuning',
    costBand: '$$',
    wakandaIndex: 70,
    diyFeasibility: 62,
    scienceGrounding: 86,
    realitySplit: {
      real:
        'Differential pressure taps on either side of a cylinder in cross-flow see the alternating pressure field of a shed vortex, and the shedding frequency follows f = St·U/D with St ≈ 0.2 for a smooth circular cylinder over roughly 300 < Re < 2×10⁵. Two axially separated tap rings see the same vortex train with a delay, and that delay times the flow speed gives a downstream distance. All three claims become numbers from a home flume: a spectral peak in pascals, a linear f-versus-U slope, and a lag-to-distance calibration you fit yourself.',
      narrative:
        '"The fish\'s sixth sense, rebuilt" oversells it. A trout lateral line carries hundreds to thousands of neuromasts, canal and superficial, read out by a dedicated hindbrain map; six pressure taps on a printed cylinder give a coarse bearing and one range along the flow axis, and only while the flow is steady, the obstacle sits in the same streamtube, and the water is bubble-free. You are not building flow vision. You are building a vortex frequency meter with a ranging trick attached — and saying exactly where it stops working.',
    },
    summary:
      'Print an 80 mm cylinder with two rings of six flush pressure taps, pipe each tap to a short air standpipe so the gas-only sensor never sees water, and read six differential channels at 100 Hz from a bilge-pump flume or a hand-towed tank. Tow the array past fixed cylinders of three diameters at four speeds, extract the shedding peak, and check it against St = 0.2. Then place a cylinder upstream at known distances and fit a range curve from the cross-correlation lag between the two tap rings. The deliverable is a table of frequency error, Strouhal number, and range error against truth.',
    science:
      'The lateral line is a hair-cell mechanosensory system: superficial neuromasts sit in the boundary layer and sense local flow velocity, while canal neuromasts sit in fluid-filled subdermal canals that filter out steady pressure and pass the fluctuating component — a biological high-pass filter, which is what a differential tap pair does electrically. Behavioural work on blind cavefish showed they detect and avoid obstacles hydrodynamically, and the PNAS artificial-lateral-line experiment reproduced the sensing principle on a robot body with a hot-film array, localising a vibrating dipole source. The fluid physics is textbook: a bluff body sheds vortices alternately from each side, and the non-dimensional shedding rate is nearly constant at St ≈ 0.2 across a wide Reynolds band, so f depends on U and D alone. Two consequences matter for a builder. First, vortices are convected downstream at roughly the free-stream speed, so the farther the obstacle, the longer the delay and the weaker and more diffuse the signal — range resolution degrades quickly. Second, turbulence and bubbles are not noise you can filter: they occupy the same frequency band as the signal. That is why the honest result is a detection envelope in metres and a stated failure mode, not a range number.',
    billOfMaterials: [
      { item: 'Sensirion SDP810-125Pa or SDP31 differential pressure sensor (I²C)', qty: '6', note: '≈ $40 each; the ±125 Pa range is the whole point — a 1 kPa MAP sensor cannot resolve this' },
      { item: '3D-printed sensor cylinder, tap rings and air-standpipe manifold', qty: '1 set', note: 'PETG or ASA, 0.8 mm flush tap orifices, plus a hydrophobic filter per port' },
      { item: 'Silicone tubing 2 mm ID + barbed fittings', qty: '5 m', note: 'equal lengths per pair, or you build a phase error into your own sensor' },
      { item: 'ESP32-S3 dev board + microSD module', qty: '1', note: 'six I²C channels logged at 100 Hz' },
      { item: '12 V bilge pump, 2 m plastic gutter, honeycomb flow straightener, stilling tank', qty: '1 set', note: 'open-channel flume; a 2 m hand-towed carriage tank gives a known U with less turbulence' },
      { item: '3D-printed obstacle cylinders, 20 / 40 / 80 mm diameter, on a sting', qty: '3', note: 'the upstream targets, smooth walls only' },
      { item: 'Stopwatch over a measured tow, or a propeller flow meter', qty: '1', note: 'independent U measurement; a timed tow beats a guessed speed' },
    ],
    buildSteps: [
      { title: 'Print the sensing cylinder', detail: 'Model an 80 mm × 300 mm cylinder with two azimuthal rings of six 0.8 mm taps, spaced 45° apart and 150 mm apart axially, each flush with the surface. Sand and polish the leading edge: a moulding burr trips the boundary layer early and swamps the vortex signal with its own separation noise.' },
      { title: 'Build the dry manifold', detail: 'The SDP8xx is a gas sensor and water will destroy it. Give every tap a vertical air standpipe so the water column stops below the sensor, mount all six sensors in a dry block above the waterline, and seal the block behind a hydrophobic filter. Leak-test under water and log the still-water offset before anything moves.' },
      { title: 'Build the flume or tow tank', detail: 'A 150 mm-deep gutter with a 12 V bilge pump, a stilling tank and a honeycomb straightener gives variable U with real turbulence. A 2 m hand-towed tank with a weighted carriage gives a known U with almost no turbulence. Build both if you can: the difference between them is your turbulence-sensitivity result.' },
      { title: 'Calibrate the pressure chain', detail: 'With the array still, log 60 s per channel and compute the RMS noise floor — if it is above 1 Pa you cannot resolve a 0.3 m/s wake. Then tow at 0.1, 0.2, 0.3 and 0.5 m/s and check the mean differential against ½ρU² for the tap geometry: the ratio is your effective pressure coefficient, and it should be stable and repeatable.' },
      { title: 'Hunt the shedding peak and test the Strouhal law', detail: 'Tow past the 40 mm and 80 mm cylinders at each speed, log 60 s at 100 Hz, and take a Hann-windowed FFT — a clean 0.5–10 Hz peak is shedding, a 1/f slope is not. Repeat each condition five times and report the spread. Then plot f against U for each diameter: the strongest evidence you are seeing real shedding is a straight line through the origin with slope St/D and a St near 0.2 across a 5× speed range. If f tracks the pump rather than the flow, you are measuring your own plumbing — say so.' },
      { title: 'Fit the range curve and map the failure envelope', detail: 'Cross-correlate the two tap rings for the convection lag, place the obstacle at 0.2, 0.5, 1.0, 1.5 and 2.0 m upstream, and record the true total delay. Fit range = U·τ and report the residual and the distance at which the correlation peak falls below your noise floor. Then repeat with a bubbler on, with two obstacles present, and with the array yawed 10° off the flow, and keep dye photographs of the street as the control that proves a wake existed when your sensor missed it.' },
    ],
    metrics: [
      { label: 'measured shedding frequency, U = 0.3 m/s, D = 80 mm', value: '0.75 Hz predicted from St = 0.2; report yours within ±20%' },
      { label: 'Strouhal number, f·D/U', value: '0.18–0.22 across 0.1–0.5 m/s (Re ≈ 8×10³–4×10⁴ with these diameters)' },
      { label: 'pressure-channel noise floor, still water', value: '≤ 0.5 Pa RMS at 100 Hz sampling' },
      { label: 'upstream range error over 0.2–1.5 m', value: '≤ 25% of true distance; report the distance where error exceeds 25%' },
      { label: 'detection rate, single smooth cylinder in a clean flume', value: '≥ 90% of 20 trials; report the bubbly and yawed cases separately' },
    ],
    stretchGoals: [
      'Add a second array on the opposite side of the body and fuse the two bearings into a range-and-bearing estimate, then compare its accuracy with the lag method.',
      'Keep the array stationary and move the obstacle instead, at the same relative speed, to test the rarely reported assumption that the wake is the same either way.',
      'Measure the convection speed directly by timing the dye crossing against the pressure peak, instead of assuming vortices travel at U.',
    ],
    safety: [
      'Water plus mains-powered pumps is a shock hazard: run the pump and logger from the same RCD/GFCI-protected supply, keep all electronics in a dry box above the waterline, use drip loops on every cable, and never probe a live flume by hand.',
      'A bilge pump can empty 50 L in under a minute and a tow carriage can fall: put the flume low, bound the tank volume with an overflow, cordon the tow path, and fit a fuse on the pump circuit so a jam does not cook the motor.',
      'Dye and any surfactant you add are a chemical exposure and a disposal problem: food dye only unless you know the chemistry, nitrile gloves, and dispose of tank water per local rules rather than into a drain or garden.',
      'Cut and sanded PETG/ASA leaves sharp dust and burrs: sand wet or with extraction, wear eye protection and a dust mask, and de-burr every tap orifice before it touches the water.',
    ],
    lessonLinks: ['w2l4', 'w6l11', 'w5l9'],
    sources: [
      { label: 'Yang et al., Distant touch hydrodynamic imaging with an artificial lateral line, PNAS 2006 — full text (PMC)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC1748147/' },
      { label: 'Xie and Zheng, Artificial lateral line based local sensing between two adjacent robotic fish, Bioinspiration & Biomimetics 2017', url: 'https://iopscience.iop.org/article/10.1088/1748-3190/aa8f2e' },
      { label: 'Lateral line — neuromast types, canal filtering and hydrodynamic imaging (Wikipedia, with primary citations)', url: 'https://en.wikipedia.org/wiki/Lateral_line' },
      { label: 'Kármán vortex street — shedding mechanism and the Strouhal relation (Wikipedia, with primary citations)', url: 'https://en.wikipedia.org/wiki/K%C3%A1rm%C3%A1n_vortex_street' },
      { label: 'Strouhal number — definition and the ≈ 0.2 cylinder value (Wikipedia, with primary citations)', url: 'https://en.wikipedia.org/wiki/Strouhal_number' },
    ],
  },

  /* ================================================================== */
  /* 2 · ELEPHANT-TRUNK CONTINUUM MANIPULATOR                           */
  /* ================================================================== */
  {
    id: 'nature-elephant-trunk-continuum-arm',
    title: 'Proboscis Loom — Cable-Driven Elephant-Trunk Continuum Arm',
    tagline:
      'Three spring-backed sections, nine tendons, one honest map: a piecewise-constant-curvature arm that picks and places, then reports in millimetres exactly how badly it repeats.',
    category: 'nature',
    difficulty: 'master',
    buildTime: '6–9 weekends (about 50 h)',
    costBand: '$$',
    wakandaIndex: 74,
    diyFeasibility: 60,
    scienceGrounding: 85,
    realitySplit: {
      real:
        'A continuum section bends into a circular arc under differential tendon pull, and the piecewise-constant-curvature (PCC) model — each section described by arc length, bending angle and plane angle — gives closed-form forward kinematics, a closed-form Jacobian away from the straight configuration, and a computable reachable workspace. Tendon displacement maps linearly to curvature through the tendon offset radius. Every output is measurable: arc angles from a camera-tracked centreline, tip position against the model, a convex-hull workspace volume in litres, and an ISO 9283-style repeatability spread over 30 cycles.',
      narrative:
        'The trunk is a muscular hydrostat with no skeleton, antagonistic muscle groups, local stiffening, and skin dense with mechanoreceptors; it pinches at the tip and wraps and lifts with the whole organ. A three-section tendon arm with nine hobby servos reproduces one of those behaviours, reach-and-curve, and none of the rest. Do not claim the arm "thinks like a trunk", has trunk-like compliance control, or is safe around people: with no joint-torque sensing and no shape sensing, the honest description is a soft-bodied cable robot with a good kinematic model and poor disturbance rejection.',
    },
    summary:
      'Build three 100 mm sections of alternating spacer discs on a compression spring, each driven by three tendons at 120°, wound on servo drums. Calibrate tendon displacement to section curvature with a camera-tracked centreline, implement PCC forward and inverse kinematics, and validate the model against 100 measured tip poses. Then grid the tendon space, compute and experimentally verify the reachable workspace, fit a soft tip gripper and run 50 pick-and-place cycles. You finish with a workspace volume, a model error in millimetres, and a repeatability figure you would be willing to publish.',
    science:
      'The trunk is a constant-volume hydrostat: muscle contraction in one direction must be balanced by lengthening elsewhere, which is why it can bend, shorten, stiffen and twist with the same tissue. Continuum robotics abstracts that into a serial chain of arcs. For a section of arc length L bending through angle θ in plane φ, with n tendons at radius d, a tendon pull of Δl produces curvature κ = θ/L ≈ Δl / (d·L) when the section stays inextensible, so motor position to shape is linear and cheap to invert. Forward kinematics composes rigid transforms and rotations about each arc (a product-of-exponentials form), and the Jacobian is analytic except exactly at θ = 0, where the standard closed form divides by zero — a numerical singularity that bites every first implementation and is fixed with a series expansion. The model has blind spots you will measure directly: cable friction and sheath compliance make the achieved arc lag the commanded arc, sections couple through the shared backbone, and gravity sags the arm as a function of payload and orientation. Published systems report continuum-arm repeatability of a few percent of length without shape sensing, and far better with fibre-Bragg or camera shape feedback, which is why the deliverable here is a measured error and repeatability table plus an explicit statement of what PCC does not capture.',
    billOfMaterials: [
      { item: 'Hobby servos with metal gears (DS3218 or MG996R class), 20 kg·cm', qty: '9', note: 'three tendons per section; ≈ $15 each' },
      { item: '3D-printed spacer discs (6 per section) and tendon anchors', qty: '1 set', note: 'PETG; 30 mm diameter, 2 mm tendon holes at 120°' },
      { item: 'Compression springs, 8 mm OD, 0.8 mm wire, 100 mm free length', qty: '3', note: 'the flexible backbone; gentler than a printed flexure and it returns to straight' },
      { item: 'Braided fishing line or 0.5 mm Dyneema + PTFE liner tube', qty: '10 m', note: 'low stretch and low friction; sheathed tendons cut hysteresis' },
      { item: 'PCA9685 servo driver + 6 V 10 A current-limited supply + microcontroller', qty: '1 set', note: 'nine channels; any ESP32/Pico-class board runs the kinematics and the log' },
      { item: 'USB camera on a fixed jig + ArUco markers', qty: '1 set', note: 'centreline and tip ground truth; print markers at known disc spacing' },
      { item: 'Spring scale 0–50 N + digital calipers', qty: '1 each', note: 'set tendon pretension; measure tendon travel honestly' },
      { item: 'Fin Ray or silicone tip gripper + micro vacuum pump', qty: '1 set', note: 'the trunk-tip analogue; soft enough to forgive 5 mm of model error' },
      { item: 'Aluminium base plate, clamps, polycarbonate cable guard', qty: '1 set', note: 'the guard is a safety item, not decoration' },
    ],
    buildSteps: [
      { title: 'Build one section and measure it', detail: 'Thread six spacer discs onto a compression spring, run three tendons through PTFE liners at 120°, and anchor them at the tip. Cable drive is the garage route (quiet, cheap, no air supply); pneumatic bellows bend more smoothly but need a regulated compressor with a relief valve. Pull one tendon by a measured amount with the spring scale and photograph the arc against a grid — the tendon-to-curvature gain you measure here is the constant every later calculation uses.' },
      { title: 'Assemble the three-section arm', detail: 'Stack sections with rigid inter-section plates so each can be modelled independently, clamp the base plate to a bench, and wind each tendon on its own 12 mm servo drum. Set every tendon to the same pretension; unequal pretension biases the whole workspace to one side.' },
      { title: 'Calibrate tendon travel to curvature', detail: 'For each section, command a grid of tendon displacements, track the centreline with the camera plus ArUco markers, and fit a circle to the visible arc. Extract θ and φ per trial, then regress them on tendon lengths. Report the residual: that residual is the part of the shape your PCC model will never predict.' },
      { title: 'Implement and validate the kinematics', detail: 'Write PCC forward kinematics and the analytic Jacobian; handle the θ → 0 branch with a series expansion rather than a divide-by-zero guard. Sample 100 random configurations, command each, measure the tip with the camera, and report model error in millimetres against reach and payload. Compare Jacobian inverse kinematics against a damped least-squares solve near straight configurations.' },
      { title: 'Map the reachable workspace', detail: 'Grid the tendon space at 10% resolution, compute the tip for each point, and take the convex-hull volume in litres. Then verify 40 boundary points experimentally and report how many were actually reachable — commanded tendon travel is not achieved tendon travel once friction is included.' },
      { title: 'Fit the gripper and run pick-and-place', detail: 'Mount the soft tip gripper and pick 30 g and 100 g boxes from three approach directions. Log success, cycle time, and tip position at each placement from the overhead camera. Fifty cycles on the 30 g object, then fifty with 100 g, and report the payload at which model error exceeds the gripper compliance.' },
      { title: 'Measure repeatability and the model\'s limits', detail: 'Command one point 30 times from different approach directions and speeds; report repeatability (the ±3σ spread) and accuracy (the offset from commanded) separately, then repeat with 100 g and at full extension. Quantify hysteresis by approaching the same curvature from above and below and recording the tendon-length difference, and quantify gravity sag as tip drop against payload at a fixed configuration. State the envelope inside which PCC is a good model, and the envelope that would need shape sensing.' },
    ],
    code: {
      language: 'python',
      snippet:
`import numpy as np

def section_points(L, theta, phi, n=12):
    """Points along one constant-curvature section, in the section frame."""
    s = np.linspace(0, L, n)
    if abs(theta) < 1e-6:                      # straight: avoid the 1/theta blow-up
        return np.c_[s, np.zeros((n, 2))]
    r = L / theta
    x = r * np.sin(s / r)
    y = r * (1.0 - np.cos(s / r)) * np.cos(phi)
    z = r * (1.0 - np.cos(s / r)) * np.sin(phi)
    return np.c_[x, y, z]

def tendon_gain(Delta_l, d, L):
    """theta ~ Delta_l / (d * L) for an inextensible, constant-length section."""
    return Delta_l / (d * L)
`,
      note:
        'The theta -> 0 branch is not optional: every trajectory that starts from a straight arm passes through it. Implement it as the straight case above and unit-test it, because a NaN at the home configuration looks like a hardware fault and will cost you an evening.',
    },
    metrics: [
      { label: 'PCC model error vs camera-tracked tip, 300 mm reach, no payload', value: 'target ≤ 8 mm RMS; report the distribution over 100 poses' },
      { label: 'repeatability at one commanded point, 30 cycles', value: 'expect ±2–6 mm (±3σ); report the accuracy offset separately' },
      { label: 'reachable workspace volume', value: 'convex-hull estimate in litres; report the verified reachable fraction of sampled boundary points' },
      { label: 'pick-and-place success, 30 g box, 50 cycles', value: 'target ≥ 80%; report the 100 g result and the dominant failure mode' },
      { label: 'tendon hysteresis, same curvature approached both ways', value: 'report the tendon-length difference in mm — the PCC model\'s main error source' },
    ],
    stretchGoals: [
      'Add a second camera or an IMU chain along the backbone to estimate shape in real time, then close the loop on tip position and report how much repeatability improves.',
      'Compare cable drive against a silicone pneumatic bellows section on the same base and report bend range, bandwidth and step-response settling time for each.',
      'Demonstrate a whole-arm wrapping grasp on a 60 mm cylinder and report the contact-force distribution with pressure-sensitive film, honestly including the sections that never touched.',
    ],
    safety: [
      'Tendons store elastic energy and a failed anchor whips: wear sealed eye protection whenever the arm is powered, route cables inside the sections or behind the polycarbonate guard, proof-test anchors at 2× working tension, and cut servo power before reaching into the arm.',
      'Winch drums and section joints pinch and shear: guard the drums, set software travel limits below the mechanical stops, add a hardware e-stop that removes motor power, and never clear a jam with the arm energised.',
      'Nine servos at stall draw large current and get hot enough to burn skin or ignite a flammable bench: use a current-limited supply sized for worst case, fit a fuse, log supply current, and give the base a metal heat path rather than foam.',
      'If you go the pneumatic route, compressed air is the dangerous subsystem: regulate to the lowest pressure that works, fit a relief valve set below the tube rating, secure every push-fit connection or replace it with barbed and clamped fittings, and never point a nozzle at skin — a pressurised air jet can cause an air embolism.',
    ],
    lessonLinks: ['w4l7', 'w4l8', 'w1l2'],
    sources: [
      { label: 'Webster and Jones, Design and Kinematic Modeling of Constant Curvature Continuum Robots: A Review, IJRR 2010', url: 'https://doi.org/10.1177/0278364910368147' },
      { label: 'Mahl, Hildebrandt and Sawodny, Constant curvature continuum kinematics as fast approximate model for the Bionic Handling Assistant, IEEE/RSJ IROS 2012', url: 'https://ieeexplore.ieee.org/document/6385596' },
      { label: 'Continuum robot — kinematic models, actuation routes and shape sensing (Wikipedia, with primary citations)', url: 'https://en.wikipedia.org/wiki/Continuum_robot' },
      { label: 'Elephant trunk — muscular hydrostat anatomy, tip pinch and whole-organ wrap (Wikipedia, with primary citations)', url: 'https://en.wikipedia.org/wiki/Elephant_trunk' },
    ],
  },

  /* ================================================================== */
  /* 3 · BIOLUMINESCENT SIGNALLING ROBOT                                */
  /* ================================================================== */
  {
    id: 'nature-bioluminescent-signalling-robot',
    title: 'Mareel — Bioluminescent Signalling Robot',
    tagline:
      'A sealed living-light bioreactor on a mobile base, with a calibrated low-light sensor and a blunt report on how dim, how slow and how information-free the glow really is.',
    category: 'nature',
    difficulty: 'journeyman',
    buildTime: '4–6 weekends (about 35 h), then a 2-week culture and light-logging campaign',
    costBand: '$$',
    wakandaIndex: 78,
    diyFeasibility: 64,
    scienceGrounding: 78,
    realitySplit: {
      real:
        'Both light-producing systems are well characterised and the light is measurable. Aliivibrio fischeri is a BSL-1 marine bacterium whose lux operon is switched on by quorum sensing at high cell density, so a dense sealed culture glows steadily, dims as oxygen or nutrients run out, and re-brightens when aerated. Pyrocystis fusiformis is a BSL-1 marine dinoflagellate that emits a roughly 0.1 s blue flash when its membrane is mechanically deformed, with a flash capacity that follows a circadian rhythm. A TSL2591-class sensor in a light-tight box resolves both, and culture temperature, growth and light are all loggable numbers.',
      narrative:
        '"The robot speaks in living light" is theatre, and it should be labelled as theatre. The bacteria respond to their own population density and to oxygen, not to the robot; the dinoflagellates respond to shear, not to meaning. The glow is dimmer than a phone screen by orders of magnitude and far slower than the electronics around it — the flash is over before a servo has moved 10°, and the bacterial response lags by hours. In the information-theoretic sense the channel capacity is approximately zero. What you have built is a beautiful biological transducer with an honest photometric characterisation.',
    },
    summary:
      'Culture one BSL-1 marine organism in a sealed, vented 250 mL bioreactor, mount it on a mobile base with a secondary containment tray, and stimulate it from the robot: a servo-driven paddle for dinoflagellate shear, or a peristaltic aeration loop for the bacteria. Calibrate a TSL2591 in a light-tight box against known dim sources, then log lux through 30 stimulus cycles per session, across four sessions in a day, with culture temperature. You finish with a lux-versus-time curve, a stimulus-to-peak latency, a recovery time, a circadian ratio, and a decontamination procedure you actually followed.',
    science:
      'A. fischeri makes light with a two-subunit luciferase (LuxAB) that oxidises a reduced flavin and a long-chain aldehyde, emitting blue-green light near 490 nm; the operon is controlled by the LuxI/LuxR quorum-sensing pair, so output rises sharply once autoinducer accumulates at high cell density and, critically, only when oxygen is available. That gives you two independent knobs — population and aeration — and it also means "motion makes it glow" is false for the bacteria: motion can only change the glow indirectly, by stirring and aerating. Dinoflagellates are the opposite case: Pyrocystis emits a flash when shear deforms the cell, via a proton flux through voltage-gated channels that acidifies the scintillon and triggers luciferin oxidation. The flash peaks in tens of milliseconds and decays in well under a second, and the cell needs seconds to minutes to recharge. Its flash capacity is also gated by a circadian clock, so it is bright at subjective night and nearly absent at subjective day even with identical stimulation — an effect large enough that you must control for it or the data is nonsense. Photometry is the third real subject: at these levels a BH1750 (1 lux resolution) is useless, so you need a high-dynamic-range sensor, a dark box, a fixed geometry, and a calibration against a known source. Report lux with the distance, sensor, integration time and gain attached, or the number means nothing.',
    billOfMaterials: [
      { item: 'Aliivibrio fischeri (ATCC 7744 class) or Pyrocystis fusiformis culture', qty: '1', note: 'BSL-1 marine; choose one. Wild-type organism only, never a strain carrying an antibiotic-resistance marker' },
      { item: 'Marine Broth 2216 (A. fischeri) or f/2 medium + 30–35 ppt artificial seawater (Pyrocystis)', qty: '1 set', note: 'autoclaved or 0.2 µm filter-sterilised' },
      { item: 'Borosilicate bioreactor 250–500 mL, butyl stopper, 0.2 µm PTFE vent filter', qty: '1', note: 'sealed and vented: gas exchange without aerosol release' },
      { item: 'TSL2591 high-dynamic-range lux/IR breakout + 3D-printed light-tight box', qty: '2', note: 'one at a fixed 20 mm port with a matte black interior, one as an outside reference; add ND filters and a dim LED for calibration' },
      { item: 'ESP32 + microSD logger + DS18B20 waterproof probe', qty: '1 set', note: 'lux and culture temperature at 10 Hz during a stimulus, 1/min between' },
      { item: '12 V peristaltic dosing pump + autoclavable silicone tubing', qty: '1', note: 'medium exchange, or the aeration/stirring actuator for the bacterial route' },
      { item: 'Micro servo + 3D-printed paddle (or a small vibration motor)', qty: '1 set', note: 'calibrated mechanical shear stimulus for the dinoflagellate route' },
      { item: '2WD mobile base + caster, motor driver, 12 V 2 Ah LiFePO4 pack', qty: '1 set', note: 'the robot half; keep it slow and stable' },
      { item: 'Secondary containment tray, 10% bleach, 70% ethanol, nitrile gloves, biohazard bags', qty: '1 set', note: 'containment and the kill step are mandatory, not optional' },
      { item: '12 h timer + dim white LED for the photocycle', qty: '1', note: 'required for a dinoflagellate circadian result' },
    ],
    buildSteps: [
      { title: 'Choose one organism and write its containment plan', detail: 'A. fischeri grows in 12–24 h and rewards fast iteration; P. fusiformis needs clean seawater, a 12/12 light cycle and about a week to entrain, but gives a fast mechanical response. Pick one, write down the BSL-1 handling, sterilisation and disposal steps, and set up a dedicated bench that is never used for food.' },
      { title: 'Grow the culture', detail: 'A. fischeri: inoculate 200 mL of Marine Broth 2216 at 25 °C with gentle shaking, and expect visible turbidity and a glow at high cell density after 8–24 h. P. fusiformis: maintain in f/2 at 20 °C under a 12 h light / 12 h dark cycle for at least 7 days before any light measurement, or your circadian data is meaningless.' },
      { title: 'Build and calibrate the photometer', detail: 'Put the TSL2591 at a fixed 20 mm port inside the light-tight box, set a fixed gain and integration time, and measure the dark noise floor with the box sealed. Then calibrate across at least three decades using a dim LED through neutral-density filters and record the fit. Report every later lux value with gain, integration time and distance attached.' },
      { title: 'Build and mount the sealed bioreactor', detail: 'Fill to 60% of volume, stopper with a butyl bung carrying a 0.2 µm PTFE vent, and add a stir bar or a peristaltic loop. Seat the vessel in a secondary containment tray, isolate it from chassis vibration with foam or silicone standoffs, and route tubing so it cannot kink or siphon when the robot turns. Run a full-speed lap with plain water before any culture goes near it.' },
      { title: 'Run the motion-to-stimulus protocol', detail: 'Dinoflagellate route: after 60 s of darkness, the robot drives a fixed 1 m path, then a servo paddle delivers one calibrated 200 ms shear pulse while you log lux at 10 Hz for 10 s. Bacterial route: the robot drives a fixed path while the peristaltic pump runs a 10 s aeration and mixing cycle, and you log for 60 min afterwards to capture the oxygen and quorum response. Thirty stimuli per session, four sessions across a day, culture temperature logged throughout; run a second night session at the same stimulus amplitude, because a night/day flash ratio of 3:1 or more is the evidence that you are measuring a circadian organism rather than a stimulus artefact.' },
      { title: 'Report the photometry honestly, then decontaminate', detail: 'Give peak lux, integrated lux·seconds, rise time, decay time, recovery to 50% of the previous flash, and the dark-adapted baseline, with distance and sensor settings, and state how the peak compares to a dim night-time room and a phone screen at 30 cm. Then treat all liquid and wetted tubing with 10% bleach for 30 min (or autoclave), bag solids as biohazard waste, wipe the bench with 70% ethanol, and wash hands.' },
    ],
    metrics: [
      { label: 'peak flash illuminance, dense P. fusiformis culture at the 20 mm port', value: 'expect 10⁻² – 1 lux; measure yours and state gain and integration time' },
      { label: 'steady A. fischeri glow, dark-adapted', value: 'expect below 10⁻² lux; the sensor noise floor must be below 10⁻³ lux to be meaningful' },
      { label: 'flash rise and decay time, and recovery to 50% (dinoflagellate)', value: 'rise tens of ms, full decay well under 1 s, recovery seconds to minutes' },
      { label: 'circadian night/day flash ratio at equal stimulus', value: '≥ 3:1 for an entrained culture; a ratio near 1 means the light cycle failed' },
      { label: 'time from 1% inoculum to visible glow (A. fischeri, 25 °C)', value: '8–24 h; log turbidity and stimulus-to-peak latency (minutes to hours) alongside' },
    ],
    stretchGoals: [
      'Add a 470 nm bandpass filter and confirm the emission peak spectrally, then compare it with the published dinoflagellate and LuxAB emission wavelengths.',
      'Run a shear dose-response curve (paddle stroke duration vs flash amplitude) and report the saturation point and any habituation you observe.',
      'Make the robot genuinely interactive without pretending there is communication: have it approach a dark corner and trigger a stimulus only when ambient light is below a threshold, and report the measured lux in both cases.',
    ],
    safety: [
      'Biosafety is the primary control: use only BSL-1 wild-type marine organisms, never an engineered strain carrying an antibiotic-resistance marker, and never attempt plasmid transformation at home. If you want a lux reporter in E. coli, do it in a licensed teaching lab with institutional biosafety approval. Use a sealed vented vessel, a secondary containment tray, nitrile gloves, a dedicated bench away from food, no eating or drinking in the room, and label every vessel with organism and date.',
      'Sterilise before disposal, every time: 10% bleach for 30 min or autoclave for all liquid, tubing and wetted surfaces, biohazard bags for solids, then 70% ethanol on the bench and soap-and-water hand washing. Never pour cultures or broth down a sink, and never store live cultures in a food fridge.',
      'Aliivibrio fischeri is BSL-1 and not a recognised human pathogen, but related Vibrio species are opportunistic wound pathogens: cover cuts before handling, wear gloves, clean any spill with bleach, and if culture liquid enters a wound, wash for 15 minutes and seek medical advice.',
      'A vessel of liquid sitting above electronics on a moving robot is a combined corrosion, containment and short-circuit hazard: use a latching drip tray with a lip, keep the electronics in a separate sealed enclosure below the vessel, strain-relieve every tube and cable, and never run the robot with a known leak.',
      'The battery is the other fire risk: use LiFePO4 or a protected Li-ion pack, charge it on a non-flammable surface with a balance charger and cell-voltage cutoff, never leave it charging unattended, and never charge a puffed cell. If you run a photocycle LED, do not stare into it and keep it out of the dark box during measurements.',
    ],
    lessonLinks: ['w2l4', 'w8l16', 'w7l13'],
    sources: [
      { label: 'Aliivibrio fischeri — the lux operon, quorum sensing and the squid light-organ symbiosis (Wikipedia, with primary citations)', url: 'https://en.wikipedia.org/wiki/Aliivibrio_fischeri' },
      { label: 'Quorum sensing — autoinducer, LuxI/LuxR and density-dependent gene expression (Wikipedia, with primary citations)', url: 'https://en.wikipedia.org/wiki/Quorum_sensing' },
      { label: 'Pyrocystis fusiformis — dinoflagellate bioluminescence, mechanical stimulation and circadian gating (Wikipedia, with primary citations)', url: 'https://en.wikipedia.org/wiki/Pyrocystis_fusiformis' },
      { label: 'Measuring Pyrocystis fusiformis lux levels with a TSL25911 — a published maker build doing exactly this measurement', url: 'https://projecthub.arduino.cc/biotronicmaker/measuring-pyrocystis-fusiformis-lux-levels-using-an-arduino-uno-r4-wifi-and-a-tsl25911-3441a4' },
      { label: 'iGEM Safety and Responsibility — containment, risk assessment and the rules on resistance markers', url: 'https://responsibility.igem.org/safety' },
    ],
  },

  /* ================================================================== */
  /* 4 · BIODEGRADABLE BURROWING / SAND-SWIMMING ROBOT                  */
  /* ================================================================== */
  {
    id: 'nature-biodegradable-burrowing-robot',
    title: 'Burrow Ledger — Biodegradable Burrowing Robot and Its Digging Energy Audit',
    tagline:
      'A segmented worm-bot that burrows and sand-swims in real sand, with real excavation rates and a joules-per-cubic-centimetre ledger set beside a wheeled scoop and a published machine figure.',
    category: 'nature',
    difficulty: 'master',
    buildTime: '7–10 weekends (about 60 h), plus 6 weeks of soil-burial mass-loss measurement',
    costBand: '$$',
    wakandaIndex: 80,
    diyFeasibility: 56,
    scienceGrounding: 76,
    realitySplit: {
      real:
        'Sand-swimming and burrowing are measured phenomena. The sandfish lizard Scincus scincus swims under loose sand by propagating an undulatory travelling wave down the body at a few hertz, with the granular drag on that body measured and modelled in published work. Ant excavation is quantified too, including the energetic cost of digging per worker. Everything this project reports is directly measurable: excavated volume from the mass of sand removed and its measured bulk density, motor energy from a bus-voltage-and-current integral, advance per cycle from video, and mass loss of a bio-based body in a soil-burial test on a 0.01 g balance.',
      narrative:
        'Two sentences in the usual pitch are false and should be struck. First, "biodegradable" without a standard and an environment is marketing: PLA is compostable only under industrial conditions (sustained high temperature and humidity) and will barely move in a home garden over months, while PHA and starch composites degrade faster but are weaker and water-sensitive. State which parts degraded and which survived. Second, an ant colony is not a robot: it excavates with a division of labour, soil-conditioning secretions, and nest-scale architecture that no 2 kg machine reproduces. Claim a measured rate and a measured energy per cubic centimetre, not ecological mimicry.',
    },
    summary:
      'Build a five- or six-segment worm-bot with soft joints that can undulate in the horizontal plane and expand radially, instrument the motor bus with an INA226, and sink it in a 600 × 400 × 300 mm box of sand whose bulk density you measured yourself. Run burrow trials across three sand conditions and three frequencies, weighing the excavated sand to get cm³/min and integrating V·I to get J/cm³. Then repeat the identical run with a wheeled scoop on the same chassis and motors, and place both against a published machine specific-energy figure. Bury the bio-based shell samples for six weeks and report the mass loss next to the digging ledger.',
    science:
      'Dry granular media is a frictional, history-dependent material, not a fluid: drag depends on depth and on whether the grains were recently disturbed, so a robot that has just loosened the sand moves more easily through it, and a robot repeating the same track finds a different medium each pass. The sandfish exploits this with a travelling wave down the body at a few hertz; resistive force theory predicts the qualitative thrust asymmetry and gets the trend right while missing the absolute drag, so simulation is a design aid and the sand box is the arbiter. Peristaltic burrowing in saturated or cohesive soil is a different problem: the body must expand radially to anchor against the burrow wall before it extends, which is why earthworm-inspired robots move in centimetres per minute rather than metres per second, and why a burrow that collapses behind you removes your own anchor. Energetically the right metric is specific energy — joules per cubic centimetre of material moved — a concept formalised for rock cutting by Teale and standard in excavation engineering. For a hobby robot the losses are dominated by motor copper loss, gearbox friction, repeated re-lifting of grains that fall back, and the cost of dragging the body through the same medium. Published excavators and planetary diggers are several orders of magnitude better per cubic centimetre, and the honest deliverable reports that gap rather than hiding it. Biodegradation is measured as mass loss of a known specimen in a known soil at known moisture, with the residue photographed, because a degradation claim without an environment and a standard is not a result.',
    billOfMaterials: [
      { item: 'Metal-gear servos (DS3218 class) or NEMA 17 steppers with drivers', qty: '6', note: 'servos are cheaper and stall-friendly; steppers give repeatable position and better energy logging' },
      { item: 'Segmented body: 3D-printed rigid rings + TPU/silicone bellows joints', qty: '6 + 5', note: 'joints must survive abrasion and cyclic bend in sand' },
      { item: 'Bio-based shell materials: PHA filament, a PLA control, and a starch/agar-jute sleeve', qty: '1 set', note: 'three materials so the burial test has a real comparison' },
      { item: 'ESP32-S3 + INA226 bus monitor + MPU6050 IMU + microSD module', qty: '1 set', note: 'energy = ∫V·I dt on the motor bus at 100 Hz, plus body kinematics' },
      { item: '5 kg load cell + HX711 amplifier, and a 0.01 g resolution scale', qty: '1 each', note: 'excavated mass per run; specimen mass for the burial test' },
      { item: 'Sand box 600 × 400 × 300 mm with transparent acrylic front panel', qty: '1', note: 'grid the panel in 10 mm increments so depth and advance can be digitised from video' },
      { item: 'Kiln-dried play sand or washed silica sand, 60 kg', qty: '2 bags', note: 'dust-free and consistent; record moisture content per trial' },
      { item: '12 V 5 A supply, current-limited driver (BTS7960 or TB6612), fuse, e-stop', qty: '1 set', note: 'sand jams stall motors; the fuse is a design element' },
      { item: 'Wheeled scoop baseline: 2-wheel chassis and 3D-printed bucket on the same motors', qty: '1', note: 'the apples-to-apples comparison; build it early, it is the control' },
      { item: 'Burial test kit: mesh bags, soil containers, moisture meter, labels', qty: '1 set', note: 'control moisture and temperature or the mass loss is uninterpretable' },
    ],
    buildSteps: [
      { title: 'Characterise the sand before you build anything', detail: 'Measure bulk density by filling a 1 L beaker and weighing it, measure moisture with a meter or by oven-drying a sample, and estimate the angle of repose by pouring a cone. Kiln-dried sand near 1.6 g/cm³ and damp sand near 2.0 g/cm³ change every downstream number by 25%, so this is not a formality.' },
      { title: 'Build the box and the baseline scoop', detail: 'Assemble the box with a transparent front panel and a 10 mm grid, and build the wheeled scoop on the same chassis with the same motors and driver first. Doing the baseline early forces you to instrument the energy chain once, identically, for both machines.' },
      { title: 'Build the segmented body and characterise its gait in air', detail: 'Alternate rigid rings with soft joints so the body can undulate horizontally and expand radially, route all wiring through the neutral axis of the joints, and make the shell panels in three materials (PHA, PLA, starch/jute) so they can be swapped for the burial test without rebuilding. Then hang the robot so it touches nothing, drive each frequency, and log body kinematics with the IMU: measure the standing-wave amplitude and wavelength and confirm the commanded frequency. If the in-air gait is already a wobble, burrowing will not fix it.' },
      { title: 'Install and calibrate the energy instrumentation', detail: 'Put the INA226 on the motor bus, sample at 100 Hz, and integrate V·I continuously with a cycle marker in the log. Calibrate the chain against a known resistive load and a bench meter: an uncalibrated energy number is the single most common way this project ends up wrong.' },
      { title: 'Run burrow trials across conditions, with depth and advance measured', detail: 'For each of three sand conditions (dry loose, damp tamped, saturated) and three frequencies, run a 300 mm burrow, weigh the sand removed, and compute excavation rate in cm³/min and specific energy in J/cm³ from the energy integral: five runs per condition, a fresh surface each time, with temperature and moisture logged. Digitise the front-panel video against the grid for depth and progress per cycle, then compute advance in body lengths per cycle and slip, and compare your kinematics with the published sandfish travelling-wave measurements rather than with any memorised speed — reporting the gap, not the best trial.' },
      { title: 'Run the wheeled scoop baseline, then look up a machine', detail: 'Repeat the identical run with the wheeled scoop on the same sand and the same integrator. Then compare both against a published specific-energy figure for real excavation or planetary digging (Teale for the concept; a robotic digger paper for a modern machine) and state the order-of-magnitude gap explicitly, including the diesel-to-electricity and drivetrain caveats.' },
      { title: 'Run the six-week burial test and publish the ledger', detail: 'Weigh PHA, PLA and starch/jute specimens to 0.01 g, bury them in the same soil at controlled moisture, and recover triplicates at 2, 4 and 6 weeks. Rinse, dry, weigh, photograph, and report mass loss with the environment named — report the PLA result even when it is essentially zero, especially then. Finish with one table: machine, sand condition, rate (cm³/min), energy (J/cm³), advance per cycle, and a column for what the energy number excludes (standby, carrying the robot, refilling the box), so no reader can be misled by the headline.' },
    ],
    metrics: [
      { label: 'excavation rate, loose dry sand', value: '20–200 cm³/min for a hobby-scale worm-bot; report yours per condition' },
      { label: 'specific energy of burrowing', value: 'expect 1–50 J/cm³ for the worm-bot and lower for the wheeled scoop; published machine figures are commonly one to three orders of magnitude lower on comparable material — find one yourself and state the basis of the comparison' },
      { label: 'advance per cycle', value: '0.1–0.5 body lengths per cycle in loose sand; report slip as the complement' },
      { label: 'measured sand bulk density and moisture per trial', value: '1.55–2.05 g/cm³ dry to damp, moisture to ±1% — without these the rate is not a measurement' },
      { label: 'six-week soil-burial mass loss', value: 'report PHA, PLA and starch/jute separately to 0.01 g; expect a large spread and state the soil environment' },
    ],
    stretchGoals: [
      'Add a second robot moving in the same box and measure whether the loosened sand left by the first reduces the second\'s specific energy — a direct test of granular history dependence.',
      'Implement closed-loop depth control from an IMU plus a force cue and report the depth-holding error under two sand conditions.',
      'Compare a peristaltic mode against an undulatory mode on the same body, in the same sand, and report rate and specific energy for each.',
    ],
    safety: [
      'Crystalline silica dust is a respiratory carcinogen: use washed, dust-free play sand, wear an N95/P2 respirator and sealed eye protection when pouring or sifting, never dry-sweep the area (wet-mop or HEPA-vacuum), and work outdoors or with extraction.',
      'Sand destroys bearings and jams mechanisms, and a stalled motor draws locked-rotor current into a hot driver: fuse the motor bus, current-limit the driver, thermal-check the driver after each run, and never reach into the box while the robot is powered — isolate at the switch first.',
      'The electrical side is 12 V at several amps in a wet, abrasive, earthed environment: use an RCD/GFCI-protected earthed supply, drip loops and sealed connectors, keep electronics in a box above the sand line, and site a clearly reachable power switch outside the tank.',
      'A full sand box weighs tens of kilograms and a burrowing robot can pin a hand under the surface: work in pairs, keep hands out of the active zone, free a buried robot with a tool rather than fingers, and never backfill with the robot powered.',
      'The burial test handles soil and possibly compost additives: gloves on, no soil from a site with unknown contamination, keep specimens away from food areas, and wash hands afterwards.',
    ],
    lessonLinks: ['w5l9', 'w8l15', 'w3l6'],
    sources: [
      { label: 'Maladen et al., Undulatory swimming in sand: subsurface locomotion of the sandfish lizard, Science 2009 (PubMed record)', url: 'https://pubmed.ncbi.nlm.nih.gov/19608917/' },
      { label: 'Winter et al., Razor clam to RoboClam: burrowing drag reduction mechanisms and their robotic adaptation, Bioinspiration & Biomimetics 2014', url: 'https://doi.org/10.1088/1748-3182/9/3/036009' },
      { label: 'Teale, The concept of specific energy in rock drilling, Int. J. Rock Mech. Min. Sci. 1965 — the origin of the joules-per-volume metric', url: 'https://doi.org/10.1016/0148-9062(65)90016-1' },
      { label: 'Energetic cost of digging behavior in workers of the leaf-cutting ant Atta sexdens, Revista Brasileira de Entomologia 2013', url: 'https://doi.org/10.1590/s0085-56262013005000035' },
      { label: 'Multistimuli-responsive actuators from natural materials for entirely biodegradable untethered soft robots, ACS Nano 2023', url: 'https://doi.org/10.1021/acsnano.3c08665' },
    ],
  },
];
