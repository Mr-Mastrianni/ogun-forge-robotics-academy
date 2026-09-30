import type { IdeaProject } from '../types';

/**
 * Idea Lab — "Nature & Natural Elements".
 *
 * Fourteen projects that map a real organism or a real physical phenomenon onto
 * a machine you can actually build and measure. Every biological claim and every
 * performance number below is tied to a source in the project's `sources` array.
 *
 * Honesty rules used throughout:
 *  - `scienceGrounding` 80–95 means peer-reviewed and measurable; 50–70 means the
 *    biology is real but the engineering replication is hard, slow or lossy.
 *  - `realitySplit.real` is the part you can put a sensor on. `.narrative` is the
 *    framing, the metaphor, and the part that is still open research.
 *  - African and Indigenous ecological knowledge appears only where there is a
 *    documented engineering account of it, and it is labelled as documented.
 */
export const natureProjects: IdeaProject[] = [
  /* ================================================================== */
  /* 1 · GECKO DRY ADHESION                                             */
  /* ================================================================== */
  {
    id: 'nature-gecko-dry-adhesive-gripper',
    title: 'Ọ̀gún\'s Palm — Gecko Dry-Adhesion Gripper',
    tagline:
      'A PDMS micro-wedge pad that grips glass with van der Waals forces alone, plus the load-cell rig that proves how much it really holds.',
    category: 'nature',
    difficulty: 'journeyman',
    buildTime: '4–6 weekends (about 35 h), plus 2 weeks of mould cure-and-retry',
    costBand: '$$',
    wakandaIndex: 72,
    diyFeasibility: 68,
    scienceGrounding: 90,
    realitySplit: {
      real:
        'Directional dry adhesion: a soft angled-microstructure pad loaded in shear holds far more normal pull-off load than the same pad loaded in pure tension, and that ratio (adhesion ratio) is a single number you can measure on a tensiometer you build from a 5 kg load cell, a stepper-driven linear stage and an HX711 amplifier. Fabrication of angled PDMS microwedges from a micromachined silicon master, and the pull-off-force measurement itself, are both well-published and repeatable.',
      narrative:
        'The Stickybot story ("a gecko on glass, therefore a robot on glass") is inspiring but oversells the general case. Gecko-inspired adhesives are strongly surface- and roughness-dependent, degrade with dust, and the famous tokay whole-animal figures are for a compliant, hierarchically structured, self-cleaning system we have not replicated. Treat your pad as an excellent shear gripper on smooth, clean, dry surfaces — not as a universal climbing foot.',
    },
    summary:
      'Build a mould master with angled micro-wedges, cast a PDMS pad on a thin compliant backing, then characterise it on a home-made pull-off rig. The deliverable is not the gripper — it is the adhesion ratio curve: normal pull-off force as a function of the shear preload you applied first. You will also build a two-finger shear gripper that picks up a glass slide, a phone screen and a ceramic tile, and report where it fails.',
    science:
      'A tokay gecko foot carries on the order of 5 million setae, each roughly 110 µm long and 4–5 µm in diameter, and each seta splits at its tip into about 1,000 spatulae roughly 200 nm across. The sheer density of contacting tips is what makes a weak per-atom force add up: single-setae experiments in 2000 and the 2002 demonstration that the mechanism is van der Waals (not suction, not glue, not capillary action) established the physics. Because attraction depends on the number of spatulae in intimate contact, adhesion is directional: the animal drags its toes slightly toward itself to load the setae in shear, then peels from the tips inward to release — a peeling problem, where release force is set by the peel angle, not by the bond strength. Synthetic versions replace keratin hairs with moulded polymers. Angled, tapered wedge or fibre structures on a compliant backing reproduce the key behaviour: a small shear displacement rotates the contact into alignment, increasing real contact area and therefore normal adhesion by a factor of several, and reversing the shear releases it almost instantly. Adhesion is also humidity- and roughness-sensitive, which is exactly why the honest deliverable is a characterisation curve rather than a climbing demo.',
    billOfMaterials: [
      { item: 'Sylgard 184 PDMS kit (base + curing agent)', qty: '1', note: '10:1 ratio, ~$40' },
      { item: 'Silicon wafer or polished aluminium master blank', qty: '2', note: 'the micromachining substrate' },
      { item: 'Photoresist + transparency mask (or CNC-engraved master)', qty: '1 set', note: 'angled cut ~20–30°' },
      { item: '5 kg bar/beam load cell + HX711 24-bit ADC', qty: '1', note: '~$12-20 total' },
      { item: 'NEMA 17 stepper + A4988 driver + 8 mm leadscrew stage', qty: '1', note: 'shear preload and pull-off motion' },
      { item: 'Arduino Nano or ESP32', qty: '1', note: 'reads load cell, drives stage' },
      { item: 'Glass slides, ceramic tile, acrylic, 320–2000 grit paper', qty: '1 set', note: 'substrate roughness sweep' },
      { item: 'Petri dish, vacuum desiccator or bell jar, 60 °C oven/hotplate', qty: '1', note: 'degassing and cure' },
      { item: '3D-printed two-finger gripper body + servo (MG996R)', qty: '1', note: 'for the pick-and-place demo' },
      { item: 'Digital calipers + 0.01 mm dial indicator', qty: '1', note: 'measure shear displacement honestly' },
      { item: 'Isopropyl alcohol, lint-free wipes', qty: '1', note: 'surface prep is half the experiment' },
    ],
    buildSteps: [
      {
        title: 'Make the master',
        detail:
          'Produce an array of angled micro-wedges on a flat master. The cheap route is a CNC-milled or 3D-printed (high-resolution resin) master with 100–300 µm wedges at a 20–30° tilt; the precise route is SU-8 or thick photoresist patterned on silicon and diced at an angle. Measure the wedge tip radius with a USB microscope — tip radius dominates performance.',
      },
      {
        title: 'Cast the PDMS pad',
        detail:
          'Mix Sylgard 184 at 10:1, degas under vacuum until bubbles stop, pour 2–5 mm thick over the master, degas again, and cure 2 h at 60 °C (or 24 h at room temperature). Peel slowly. Cast a second, thinner pad (0.5–1 mm) and bond it to a 0.5 mm stiff backing: the compliant backing is what lets the pad share load evenly across the array.',
      },
      {
        title: 'Clean and condition',
        detail:
          'Wash pads in IPA, dry with nitrogen or a lint-free wipe, and handle only by the backing. Contamination is the single largest source of run-to-run scatter. Never touch the working surface; never store the pad face-down on a bench.',
      },
      {
        title: 'Build the pull-off rig',
        detail:
          'Mount the load cell on the fixed frame with the pad hanging beneath it. The stepper stage moves the substrate horizontally (shear) and a second manual or stepper axis moves it vertically (normal). Read the load cell at 80 Hz through the HX711. Calibrate with known masses at three points and record the linear fit.',
      },
      {
        title: 'Calibrate and characterise',
        detail:
          'For each trial: bring the pad into contact under a fixed normal preload (say 1 N), apply a controlled shear displacement (0, 0.25, 0.5, 1.0, 2.0 mm), then pull normal to failure at a constant rate. Log peak normal force. Repeat 10× per condition on glass, acrylic and grit-blasted aluminium. Plot adhesion ratio vs shear displacement.',
      },
      {
        title: 'Find the release direction',
        detail:
          'Reverse the shear past zero and record the force at which the pad releases. A well-made directional pad should drop to a small fraction of its peak hold within 1–2 mm of reverse shear. Report that release stroke in millimetres — it is the number that decides your gripper\'s cycle time.',
      },
      {
        title: 'Integrate the gripper',
        detail:
          'Print a two-finger parallel gripper where one finger carries the dry-adhesive pad on a small sprung flexure. On grasp, drive the servo to load the pad in shear; on release, reverse the servo past neutral. This "load in shear, release by reversal" sequence is the whole control law.',
      },
      {
        title: 'Pick-and-place test',
        detail:
          'Run 50 automated pick-place cycles on a glass slide, then on a dusty slide, then on a wet slide. Record success rate and the peak force during each pick. Failure modes on dusty/wet surfaces are a result, not a bug — quantify them.',
      },
      {
        title: 'Self-cleaning check',
        detail:
          'Press the pad onto a clean surface and peel 20 times, measuring peak force every fifth cycle. If force recovers toward baseline, you have reproduced a documented property of the biological system (self-cleaning).',
      },
    ],
    code: {
      language: 'arduino',
      snippet:
        '// Load-cell read + stepper shear sequence for the pull-off rig.\n' +
        '// HX711 on D2/D3, A4988 STEP on D4, DIR on D5, ENABLE on D6.\n' +
        '#include "HX711.h"\n' +
        'HX711 scale;\n' +
        'const float CAL = 21450.0;   // counts per newton, from your own mass calibration\n' +
        'const int STEP_PIN = 4, DIR_PIN = 5, EN_PIN = 6;\n' +
        'const float MM_PER_STEP = 0.0125;  // 8 mm lead, 200 steps, 1/16 microstep\n' +
        '\n' +
        'void moveShear(float mm, bool toward) {\n' +
        '  digitalWrite(DIR_PIN, toward ? HIGH : LOW);\n' +
        '  long n = (long)(fabs(mm) / MM_PER_STEP);\n' +
        '  for (long i = 0; i < n; i++) {\n' +
        '    digitalWrite(STEP_PIN, HIGH); delayMicroseconds(200);\n' +
        '    digitalWrite(STEP_PIN, LOW);  delayMicroseconds(200);\n' +
        '  }\n' +
        '}\n' +
        '\n' +
        'float peakPullOff(float shear_mm) {\n' +
        '  moveShear(shear_mm, true);          // preload in shear\n' +
        '  float peak = 0.0;\n' +
        '  for (int i = 0; i < 800; i++) {     // ~10 s of normal pull\n' +
        '    float f = scale.get_units(1) * 9.80665 / CAL;  // N\n' +
        '    if (f > peak) peak = f;\n' +
        '    delay(12);\n' +
        '  }\n' +
        '  moveShear(shear_mm, false);         // reverse to release\n' +
        '  return peak;\n' +
        '}\n' +
        '\n' +
        'void setup() {\n' +
        '  pinMode(STEP_PIN, OUTPUT); pinMode(DIR_PIN, OUTPUT); pinMode(EN_PIN, OUTPUT);\n' +
        '  digitalWrite(EN_PIN, LOW);\n' +
        '  Serial.begin(115200);\n' +
        '  scale.begin(2, 3); scale.set_scale(CAL); scale.tare();\n' +
        '  const float shears[] = {0.0, 0.25, 0.5, 1.0, 2.0};\n' +
        '  for (int k = 0; k < 5; k++) {\n' +
        '    float p = peakPullOff(shears[k]);\n' +
        '    Serial.print(shears[k]); Serial.print(" mm -> ");\n' +
        '    Serial.print(p, 3); Serial.println(" N peak");\n' +
        '  }\n' +
        '}\n' +
        'void loop() {}',
      note:
        'CAL is deliberately a placeholder: derive it from your own masses (hang 200 g, 500 g, 1 kg, fit counts vs newtons). Reporting a pull-off force with an uncalibrated load cell is the single most common way this project produces a wrong number.',
    },
    metrics: [
      { label: 'peak normal pull-off force, no shear', value: '0.3–1.5 N for a 25 × 25 mm pad (target; report your own)' },
      { label: 'peak normal pull-off force at 1 mm shear', value: '2–4× the zero-shear value' },
      { label: 'adhesion ratio (shear-loaded / unloaded)', value: '≥ 2.0 is a good result, ≥ 4 is excellent' },
      { label: 'release stroke under reverse shear', value: '< 2 mm to drop below 20% of peak hold' },
      { label: 'load-cell resolution after calibration', value: '≈ 0.5–2 mN with a 5 kg cell and 24-bit ADC' },
      { label: 'pick-and-place success rate, clean glass', value: '≥ 90 / 100 cycles (report dusty and wet separately)' },
    ],
    stretchGoals: [
      'Add a second pad layer at a different scale (hierarchical: 300 µm wedges over 30 µm fibrils) and test whether the adhesion ratio improves — this is the multi-scale hypothesis the biology actually uses.',
      'Instrument a humidity chamber and sweep 20–80% RH: published work disagrees on whether water helps or hurts, so your dataset is genuinely useful.',
      'Replace the flat stage with a rotary peel rig and measure peel force vs peel angle (0°, 30°, 60°, 90°) to map the release law.',
      'Mount the gripper on a small wheeled robot and climb a 15° glass incline, reporting slip velocity vs payload.',
    ],
    safety: [
      'PDMS and its curing agent are skin and eye irritants and the platinum catalyst is a sensitizer: mix and degas in a ventilated area, wear nitrile gloves and sealed goggles, and never cure PDMS in a food oven.',
      'Photoresist and SU-8 developers (PGMEA, TMAH-based) are toxic and flammable: use a fume hood, nitrile gloves, and a dedicated solvent waste container — never the sink.',
      'Hydrofluoric acid or XeF2 used to release silicon masters is lethal on skin contact; if you use either, work only under supervision with calcium gluconate gel and an eyewash within reach. The CNC-milled master route avoids this entirely and is recommended for a garage build.',
      'A stepper-driven stage is a finger-crushing hazard: use a belt or leadscrew with a slip clutch, keep hands out of the travel path, add a hardware end-stop and a software travel limit, and fit an emergency stop that cuts motor power.',
      'Isopropyl alcohol and uncured PDMS are flammable: no open flames, no hotplate above the flash point nearby, and keep a CO2 extinguisher within reach.',
    ],
    lessonLinks: ['w5l9', 'w5l10', 'w2l3'],
    sources: [
      { label: 'Autumn et al., Evidence for van der Waals adhesion in gecko setae, PNAS 2002 (PubMed record)', url: 'https://pubmed.ncbi.nlm.nih.gov/12181479/' },
      { label: 'Autumn et al., Adhesive force of a single gecko foot-hair, Nature 2000 (PubMed record)', url: 'https://pubmed.ncbi.nlm.nih.gov/10866201/' },
      { label: 'Gecko — morphology of setae, spatulae and the hierarchical adhesive system (Wikipedia, with primary citations)', url: 'https://en.wikipedia.org/wiki/Gecko' },
      { label: 'Synthetic setae — tokay whole-animal adhesion and artificial dry-adhesive research (Wikipedia, with primary citations)', url: 'https://en.wikipedia.org/wiki/Synthetic_setae' },
      { label: 'Christensen et al., Whole body adhesion: hierarchical, directional and distributed control of adhesive forces for a climbing robot (Stanford Stickybot), ICRA 2007 (IEEE record)', url: 'https://ieeexplore.ieee.org/document/4209263' },
    ],
  },

  /* ================================================================== */
  /* 2 · SLIME MOULD NETWORK OPTIMISER                                  */
  /* ================================================================== */
  {
    id: 'nature-slime-mould-network-optimiser',
    title: 'Yellow Conduit — Physarum Network Optimiser vs Dijkstra',
    tagline:
      'Grow a slime mould on an oat-flake map of a real bus or rail network, photograph what it builds, digitise it, and score it against the graph-theoretic optimum.',
    category: 'nature',
    difficulty: 'apprentice',
    buildTime: '3 weekends of build, then 7–14 days of live growth per map',
    costBand: '$',
    wakandaIndex: 66,
    diyFeasibility: 82,
    scienceGrounding: 88,
    realitySplit: {
      real:
        'The plasmodium of Physarum polycephalum forages by building and then pruning a tubular network, and under starvation it reliably leaves a short, well-connected path between food sources. That network is measurable: length ratio to the Dijkstra shortest path, plus an edge-count/loop-count comparison against the real network and against a minimum-spanning-tree baseline. The 2010 Tero et al. experiment placed oat flakes at positions representing Tokyo and 36 surrounding towns and recovered a network with "comparable efficiency, fault tolerance, and cost" to the real rail system.',
      narrative:
        '"The slime mould solves Tokyo\'s subway" is a headline, not a mechanism. P. polycephalum is not optimising a cost function with intent, it has no memory, and it is not consciousness or computation in the sense a robotics course means. What it does is a decentralised, feedback-driven flow-and-prune process — a real adaptive network algorithm that is biologically implemented and can be reimplemented in software (and that is the interesting half of the project).',
    },
    summary:
      'Photograph a real transport corridor (a city bus network, a national rail map, or your campus footpaths), place oat flakes at the node positions on a 1.5–2% agar plate, inoculate with a small plasmodium piece, and let it run for a week in the dark. Then photograph the result against a grid, skeletonise it, and compare total network length, connectivity and fault tolerance to Dijkstra (shortest path), a Steiner-like near-optimal solution you compute yourself, and the real network. You will end with a table that says how close biology got.',
    science:
      'Physarum polycephalum is a single-celled, multinucleate amoeba whose feeding stage (the plasmodium) is a bright-yellow interlaced tube network. Contractions of the tube walls drive rhythmic shuttle streaming of cytoplasm; wider tubes carry more flow, and the streaming plus the diffusion of a signalling molecule across the network drives tube growth where flow is high and retraction where flow is low. That feedback loop — flow thickens, no-flow atrophies — is what lets the organism find short paths through a maze and build efficient multiple-source networks. In the 2010 experiment the researchers mapped 36 towns around Tokyo to oat flakes, let the plasmodium connect them, and found the resulting network shared key topological features with the actual rail network, including comparable efficiency, fault tolerance and total cost. The critical honesty point: the mould is not fast and not repeatable in the sense a solver is. Growth and pruning take days, results vary between plates, and the final network depends on agar moisture, temperature, and how the plasmodium was cut. That variability is exactly why you must run at least three plates and report the spread, not a single hero photo.',
    billOfMaterials: [
      { item: 'Physarum polycephalum sclerotium or live culture', qty: '1', note: 'from a supplier or a biology teaching lab; sclerotium keeps for months dry' },
      { item: 'Petri dishes, 120–150 mm', qty: '6', note: 'one per map plus controls' },
      { item: 'Agar powder (bacteriological)', qty: '50 g', note: '1.5–2% w/v plates' },
      { item: 'Rolled oats (plain, no sugar, no flavouring)', qty: '1 bag', note: 'food sources = network nodes' },
      { item: 'Distilled water + 70% ethanol', qty: '1 L each', note: 'sterile technique' },
      { item: 'Pressure cooker or autoclave access', qty: '1', note: 'sterilise agar; or use a microwave + sterile pour method' },
      { item: 'Dark cupboard or opaque box, 22–25 °C', qty: '1', note: 'plasmodium avoids light' },
      { item: 'Phone camera or webcam on a fixed overhead jig + ruler', qty: '1', note: 'for calibrated top-down photos' },
      { item: 'Python + NumPy, SciPy, scikit-image, NetworkX', qty: '1', note: 'all free; skeletonisation and Dijkstra' },
      { item: 'Transfer pipettes, scalpel, parafilm', qty: '1 set', note: 'inoculation and sealing' },
    ],
    buildSteps: [
      {
        title: 'Pick a real network and get its geometry',
        detail:
          'Choose something with 15–40 nodes: your city\'s bus rapid-transit lines, a national rail map, or the footpaths on your campus. Trace the node positions (stations) and edge lengths (inter-station distances) from an open map. Store them as a JSON graph with edges weighted in metres. This file is the ground truth you will compare against.',
      },
      {
        title: 'Compute the baselines',
        detail:
          'In Python, compute (a) the Dijkstra shortest path between the two designated "capital" nodes, (b) a minimum spanning tree over all nodes, and (c) a near-optimal Steiner-style network using a simple heuristic. Record total length and number of edges for each. You now have three numbers to beat or lose to.',
      },
      {
        title: 'Pour and dry the plates',
        detail:
          'Make 1.5–2% agar, sterilise, pour 5 mm deep into 150 mm dishes, and cool. Do not over-dry: a slightly moist surface lets the plasmodium move. Mark the dish lid with a grid so you can register the photo to real coordinates, and label each plate with the map id and date.',
      },
      {
        title: 'Lay the map',
        detail:
          'Place one oat flake at each node position, scaled so the whole network fits with 15–20 mm of margin. The largest oat flake goes at the capital node. Keep flake size roughly proportional to node importance if you want to mimic the rail experiment, but keep it consistent between plates for fair comparison.',
      },
      {
        title: 'Inoculate',
        detail:
          'Place a 5–10 mm square of plasmodium (or rehydrated sclerotium) at the capital node. Seal the dish with parafilm to slow drying but leave a little gas exchange. Put it in the dark at 22–25 °C. Do not shake it.',
      },
      {
        title: 'Photograph on a schedule',
        detail:
          'Shoot a calibrated top-down photo every 12 h for 7–14 days with the same camera, lens, distance and lighting. Fix the jig so frames register. Log temperature and humidity each time. The time series is worth more than any single frame — the pruning is the algorithm.',
      },
      {
        title: 'Digitise',
        detail:
          'Threshold the yellow plasmodium, skeletonise it with scikit-image, and vectorise the skeleton into a graph. Snap skeleton junctions and endpoints to the nearest oat node when within tolerance. Save the graph as edges with pixel lengths, then scale pixel length to metres using the dish grid.',
      },
      {
        title: 'Score honestly',
        detail:
          'Compare your mould graph with the three baselines on total length, mean node-to-node path length, number of loops, and fault tolerance (delete the highest-degree edge and recompute mean path length). Run at least 3 plates and report mean ± spread. Also state the growth time to reach each score — biological optimality is paid for in days.',
      },
      {
        title: 'Write the software analogue',
        detail:
          'Implement the flow-and-prune rule yourself: build a dense mesh, assign each edge a conductance, solve the flow for a source-sink pair, increase conductance where flux is high, decrease it where flux is low, and prune edges below a threshold. Iterate. Compare your simulated network to the biological one and to Dijkstra. This is the robotics payoff: an adaptive network optimiser you can run on a robot team.',
      },
    ],
    code: {
      language: 'python',
      snippet:
        '# Flow-and-prune: the Physarum rule as an implementable algorithm.\n' +
        'import numpy as np, networkx as nx\n' +
        '\n' +
        'def physarum_prune(G, source, sink, iters=400, mu=1.0, decay=0.02, prune=0.01):\n' +
        '    for e in G.edges: G[e[0]][e[1]]["D"] = 1.0   # conductivity\n' +
        '    for _ in range(iters):\n' +
        '        # solve for node pressures with unit current from source to sink\n' +
        '        A = np.zeros((len(G), len(G))); b = np.zeros(len(G))\n' +
        '        idx = {n: i for i, n in enumerate(G.nodes)}\n' +
        '        for u, v in G.edges:\n' +
        '            D = G[u][v]["D"]\n' +
        '            A[idx[u], idx[u]] += D; A[idx[v], idx[v]] += D\n' +
        '            A[idx[u], idx[v]] -= D; A[idx[v], idx[u]] -= D\n' +
        '        b[idx[source]] = 1.0; b[idx[sink]] = -1.0\n' +
        '        A[-1, :] = 0.0; A[-1, idx[sink]] = 1.0; b[-1] = 0.0  # ground the sink\n' +
        '        p = np.linalg.solve(A, b)\n' +
        '        for u, v in list(G.edges):\n' +
        '            Q = abs(G[u][v]["D"] * (p[idx[u]] - p[idx[v]]))\n' +
        '            G[u][v]["D"] = np.clip(G[u][v]["D"] + mu * Q - decay * G[u][v]["D"], 0, None)\n' +
        '            if G[u][v]["D"] < prune:\n' +
        '                G.remove_edge(u, v)\n' +
        '    return G\n' +
        '\n' +
        'def score(G, node_m):\n' +
        '    L = sum(G[u][v]["length_m"] for u, v in G.edges)\n' +
        '    return dict(total_length_m=L, edges=G.number_of_edges(),\n' +
        '                loops=G.number_of_edges() - G.number_of_nodes() + nx.number_connected_components(G))\n' +
        '\n' +
        '# Rebuild G from your digitised skeleton graph, then compare G_physarum vs G_dijkstra vs G_mst.',
      note:
        'The pressures solve is a tiny linear system so keep the graph under a few hundred nodes. The parameters mu and decay are the whole tuning problem: small mu gives slow pruning, large mu overshoots into a tree.',
    },
    metrics: [
      { label: 'network length ratio: mould / Dijkstra shortest path', value: 'typically 1.0–1.6 (report yours)' },
      { label: 'length ratio: mould / minimum spanning tree', value: 'typically > 1 (mould keeps loops; an MST does not)' },
      { label: 'loop count (cyclomatic number) of the mould graph', value: '≥ 1 for a robust network; 0 means it built a tree, not a network' },
      { label: 'fault tolerance: mean path length after removing the top edge', value: 'report the % increase; lower is more robust' },
      { label: 'time to reach stable network', value: '5–14 days at 22–25 °C' },
      { label: 'plate-to-plate variability', value: 'report ± spread over ≥ 3 plates; expect double-digit % scatter' },
      { label: 'simulated flow-and-prune agreement with the mould', value: 'report % edge overlap with the digitised mould graph' },
    ],
    stretchGoals: [
      'Add a "congestion" experiment: drop a salt barrier or a small piece of blotting paper soaked in a repellent on one edge and measure whether the network reroutes and how long rerouting takes.',
      'Run the same 14-node map on 6 plates at two temperatures (20 °C and 26 °C) and test whether temperature changes the length ratio.',
      'Compare your digitised mould graph to the published Tokyo result by running the same 36-node geometry and reporting your length ratio against the real rail figure.',
      'Deploy the flow-and-prune algorithm on three ground robots as a distributed network-repair routine and report convergence rounds vs graph size.',
    ],
    safety: [
      'Physarum polycephalum is a Biosafety Level 1 organism and is not a plant or animal pathogen, but plates can grow environmental moulds and bacteria: work on a wipeable surface, seal plates with parafilm, wash hands after handling, and autoclave or bleach all plates and agar before disposal.',
      'Do not pour agar down a sink: it sets and blocks drains. Let plates solidify and bin them, or sterilise and bag them.',
      'Pressure cookers and autoclaves scald: vent and cool before opening, use heat gloves, and never autoclave sealed containers.',
      '70% ethanol is flammable: no open flame near the pour, and keep the bottle closed when not in use.',
      'If you culture on an open bench over days, keep plates away from food preparation areas and away from anyone who is immunocompromised.',
    ],
    lessonLinks: ['w7l13', 'w3l5', 'w8l16'],
    sources: [
      { label: 'Tero et al., Rules for Biologically Inspired Adaptive Network Design, Science 327:439–442 (2010) — PubMed record', url: 'https://pubmed.ncbi.nlm.nih.gov/20093430/' },
      { label: 'Physarum polycephalum — shuttle streaming, network pruning and the Tokyo rail experiment (Wikipedia, with primary citations)', url: 'https://en.wikipedia.org/wiki/Physarum_polycephalum' },
      { label: 'Alim et al., Random network peristalsis in Physarum polycephalum organizes fluid flows across an individual, PNAS 2013', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3752286/' },
    ],
  },

  /* ================================================================== */
  /* 3 · ANT STIGMERGIC CONSTRUCTION SWARM                              */
  /* ================================================================== */
  {
    id: 'nature-stigmergic-builder-swarm',
    title: 'Ògún\'s Termites — Stigmergic Block-Builder Swarm',
    tagline:
      'Three cheap differential-drive robots build a wall they were never told the shape of, using nothing but a pheromone-like probability field they write into the floor.',
    category: 'nature',
    difficulty: 'journeyman',
    buildTime: '5–7 weekends (about 40 h)',
    costBand: '$$',
    wakandaIndex: 74,
    diyFeasibility: 70,
    scienceGrounding: 82,
    realitySplit: {
      real:
        'Stigmergy — coordination through traces left in a shared environment rather than messages between agents — is a documented mechanism in social insects (the term was coined by Pierre-Paul Grassé in 1959 from termite building behaviour) and is a standard, well-published control architecture for robot construction swarms. You can implement it with real robots, a real shared field (camera-tracked, or an ArUco-tagged arena), and measure placement rate, structural error against a target shape, and recovery after an agent is removed.',
      narrative:
        'The "smart swarm, stupid individuals" framing is true as an architecture and false as a story about termites: the mounds are built by a fungus-farming insect with a rich repertoire of local cues, not by automata following one rule. Do not claim your three robots reproduce termite cognition. Claim they implement one documented coordination mechanism and that you measured what that mechanism can build.',
    },
    summary:
      'Build three small differential-drive robots with a lift fork or gripper that can carry one 40 mm block. They share a floor-referenced "pheromone" grid — a digital probability field updated from an overhead camera, or a real UV-fluorescent trail laid on the floor. Each robot reads the field, picks a block, carries it to the highest-probability open site, deposits it, and reinforces that site. A shape is specified only as a coarse template. You measure how fast and how accurately the swarm converges, and how it degrades when you remove a robot mid-build.',
    science:
      'Grassé\'s observation was that termites deposit a soil pellet, which itself triggers the next deposit nearby — the stimulus is the partly-built structure. That is stigmergy: the environment is the memory and the message bus, so agents need no direct communication, no shared map, and no central planner. Three properties matter for robotics. First, positive feedback near existing structure produces coherent large-scale order from simple rules. Second, decay in the trace (pheromone evaporation) prevents the system from freezing at an early mistake and lets the swarm abandon dead ends. Third, because the trace is shared, adding an agent increases throughput without changing the algorithm. Published robot-construction work (Werfel and Nagpal\'s TERMES system and three-dimensional construction with mobile robots and modular blocks) demonstrated stigmergic multi-robot building with measurable error rates and showed the same qualitative behaviour: local rules, global structure, graceful degradation. Your physical test adds the part simulations omit: block placement tolerances, navigation error, and a field that updates at camera frame rate rather than instantly.',
    billOfMaterials: [
      { item: 'Differential-drive robot base (e.g. Pololu 3pi+, micro:bit Maqueen, or a custom N20 + caster chassis)', qty: '3', note: '~$40-80 each' },
      { item: 'Microcontroller with Wi-Fi (ESP32) or radio link', qty: '3', note: 'field updates over UDP/MQTT' },
      { item: 'Overhead USB camera, 1080p, fixed jig', qty: '1', note: 'for global tracking; alternatively on-robot odometry + ArUco markers' },
      { item: 'ArUco or AprilTag markers, printed', qty: '1 set', note: 'pose ground truth for each robot' },
      { item: '3D-printed lift fork or servo gripper', qty: '3', note: 'must not drop the block while turning' },
      { item: 'Uniform blocks, 40 × 40 × 20 mm (3D-printed or laser-cut MDF)', qty: '120', note: 'identical mass is essential' },
      { item: 'Foam-board arena 1.2 × 1.2 m with 50 mm black grid lines', qty: '1', note: 'or plain white with projected grid' },
      { item: 'Host laptop running the field server (Python)', qty: '1', note: 'OpenCV for tracking, NumPy for the field' },
      { item: 'UV LED torch + fluorescent chalk or paint (physical-trace variant)', qty: '1 set', note: 'optional: make the pheromone literal' },
      { item: 'LiPo 2S 850 mAh + USB charger', qty: '3', note: 'with balance leads' },
    ],
    buildSteps: [
      {
        title: 'Choose your field representation',
        detail:
          'Digital route: a 24 × 24 numpy array of "pheromone" values on a laptop, updated from the overhead camera. Physical route: a UV-fluorescent powder trail that robots deposit and a UV torch + camera reads back. The digital route is faster to debug and lets you log every field state; the physical route is more honest about sensing limits and much slower. Pick one and say why in your write-up.',
      },
      {
        title: 'Build the arena and the blocks',
        detail:
          'Lay out a 1.2 m square arena with a 50 mm grid. Print or cut 120 identical 40 × 40 × 20 mm blocks and confirm mass equality to within 2 g. Mark a block staging area. Fix the camera overhead with a rigid jig, then calibrate the pixel-to-millimetre homography with four known points.',
      },
      {
        title: 'Build and identify the robots',
        detail:
          'Each robot carries an ArUco tag flat on top for pose, a lift fork sized to one block, and a radio link. Tune the wheel controller so a straight-line command drifts less than 20 mm over 1 m and a 90° turn overshoots less than 5°. Place a small magnet or infrared beacon on the staging area so a robot can find it without global position.',
      },
      {
        title: 'Implement the placement rule',
        detail:
          'The rule: if a block lies within reach of a candidate site, the site\'s deposition probability rises; if no block is adjacent, probability decays. Each robot moves to the highest-probability site it can sense, deposits, and adds reinforcement R to that cell. This single rule produces clustering, walls and columns depending on the template you seed.',
      },
      {
        title: 'Seed a template, not a blueprint',
        detail:
          'Give the swarm only a coarse goal: for example, "build a 0.6 m wall along x = 0" or "build a 5 × 5 enclosure". Do not give coordinates per block. Note in your log how many bits of information you actually handed the swarm — this number is the point of the project.',
      },
      {
        title: 'Add evaporation',
        detail:
          'Decay every cell by a factor per second (start at 0.1% per second). Run builds at three decay rates. With no decay the swarm tends to jam on early mistakes; with too much decay it never commits. Plot build completion time and final shape error against decay rate — this is your main experimental result.',
      },
      {
        title: 'Run the build trials',
        detail:
          'Run 10 builds of the same target with the same 3 robots. Log time to complete, blocks placed per minute, blocks misplaced, and final occupancy error versus the target occupancy grid. Then run 5 builds with only 2 robots and 5 with 4 robots to show the throughput scaling.',
      },
      {
        title: 'Test degradation and recovery',
        detail:
          'Mid-build, lift one robot out of the arena for 60 s and put it back. Record whether the structure continues, stalls, or gets repaired. Then knock over part of the wall and record how the same rule repairs it. Degradation and self-repair are the strongest evidence the mechanism (not a script) is doing the work.',
      },
      {
        title: 'Write the negative result down',
        detail:
          'Record every failure mode: blocks dropped on turns, robots deadlocking in a corridor, the field saturating, camera tracking loss. A swarm-robotics project without a failure section is a demo, not an experiment.',
      },
    ],
    code: {
      language: 'python',
      snippet:
        '# Stigmergic field server: decays, senses, reinforces. Runs on the host laptop.\n' +
        'import numpy as np\n' +
        '\n' +
        'GRID_MM = 50.0          # cell size\n' +
        'W = H = 24              # 1.2 m arena\n' +
        'DECAY = 0.001           # fraction lost per second\n' +
        'REINFORCE = 1.0         # pheromone added per placed block\n' +
        'NEIGHBOUR_GAIN = 0.4    # probability gained by cells adjacent to a block\n' +
        '\n' +
        'class Field:\n' +
        '    def __init__(self):\n' +
        '        self.p = np.zeros((H, W))          # pheromone\n' +
        '        self.occ = np.zeros((H, W), bool)  # occupancy\n' +
        '    def tick(self, dt):\n' +
        '        self.p *= (1.0 - DECAY * dt)\n' +
        '    def place(self, ix, iy):\n' +
        '        self.occ[iy, ix] = True\n' +
        '        self.p[iy, ix] += REINFORCE\n' +
        '        for dy in (-1, 0, 1):\n' +
        '            for dx in (-1, 0, 1):\n' +
        '                j, i = iy + dy, ix + dx\n' +
        '                if 0 <= i < W and 0 <= j < H and not self.occ[j, i]:\n' +
        '                    self.p[j, i] += NEIGHBOUR_GAIN\n' +
        '    def best_site(self, restricted_to=None):\n' +
        '        mask = ~self.occ\n' +
        '        if restricted_to is not None:\n' +
        '            mask &= restricted_to\n' +
        '        scored = np.where(mask, self.p, -1.0)\n' +
        '        j, i = np.unravel_index(np.argmax(scored), scored.shape)\n' +
        '        return i, j, float(scored[j, i])\n' +
        '\n' +
        '# Loop: read ArUco poses -> for each idle robot, best_site() -> drive -> place() -> tick()',
      note:
        'Track the "information given to the swarm" as a single number: template cells seeded, plus reinforcement and decay constants. Everything else must emerge. If you find yourself hard-coding block coordinates, you have stopped doing stigmergy.',
    },
    metrics: [
      { label: 'blocks placed per minute, 3 robots', value: 'target ≥ 4 blocks/min on a 1.2 m arena' },
      { label: 'build completion time for a 60-block wall', value: '10–25 min (report your spread over 10 runs)' },
      { label: 'final occupancy error vs target grid', value: '≤ 10% of cells wrong for a good run' },
      { label: 'throughput scaling from 2 → 4 robots', value: 'sublinear (report the exponent); collisions cap it' },
      { label: 'recovery time after one robot is removed for 60 s', value: 'report % of baseline rate on return' },
      { label: 'maximum tolerable decay rate before the build stalls', value: 'sweep 0.01–5 %/s and report the cliff' },
      { label: 'pose tracking accuracy of the overhead camera', value: '≈ 2–5 mm and 1–2° with ArUco at 1080p' },
    ],
    stretchGoals: [
      'Give the robots no global camera at all: use wheel odometry, a depositable physical trace and a local reflectance sensor. Report how much worse the build gets — this quantifies how much the global field was cheating for you.',
      'Run 6 robots and quantify the collision-driven collapse in throughput. Find the swarm size where adding a robot makes the build slower.',
      'Seed two competing templates (a wall and an enclosure) in different colours and see which one wins the reinforcement race.',
      'Make the swarm 3D: allow stacking on top of existing blocks and report the first height at which stability fails.',
    ],
    safety: [
      'LiPo batteries in three small robots are a real fire risk: charge on a non-flammable surface in a LiPo-safe bag, never leave charging unattended, never charge a puffed cell, and use a balance charger with a cell-voltage cutoff.',
      'Servo-driven lift forks and grippers pinch fingers: set servo travel limits in firmware, add a mechanical stop, and cut power before clearing a jammed block by hand.',
      'Arena floors are a trip hazard and wheels throw small parts: run the arena on the floor or a low table with a lip, keep cables taped down, and stop the run before anyone reaches into the arena.',
      'The overhead camera jig must be clamped or gantry-mounted, never balanced: a dropped camera on a person or a robot is the most likely injury in this build.',
      'If you use the UV-trace variant, do not look into the UV torch or shine it at skin or eyes; UV-A exposure is a cataract and skin-damage risk. Wear UV-blocking safety glasses.',
    ],
    lessonLinks: ['w7l13', 'w6l11', 'w1l1'],
    sources: [
      { label: 'Stigmergy — Grassé\'s original termite observations and the general coordination mechanism (Wikipedia, with primary citations)', url: 'https://en.wikipedia.org/wiki/Stigmergy' },
      { label: 'Werfel, Petersen and Nagpal, Designing Collective Behavior in a Termite-Inspired Robot Construction Team (TERMES), Science 2014', url: 'https://pubmed.ncbi.nlm.nih.gov/24503852/' },
      { label: 'Petersen, Nagpal et al., TERMES project page, Harvard Self-Organizing Systems Research Group', url: 'https://www.eecs.harvard.edu/ssr/projects/construction/termes.html' },
      { label: 'Bonabeau, Dorigo and Theraulaz, Swarm Intelligence: From Natural to Artificial Systems (Oxford, 1999) — publisher page', url: 'https://global.oup.com/academic/product/swarm-intelligence-9780195131598' },
    ],
  },

  /* ================================================================== */
  /* 4 · TERMITE-MOUND PASSIVE COOLING                                  */
  /* ================================================================== */
  {
    id: 'nature-termite-mound-passive-cooling',
    title: 'Mound Logic — Termite-Mound Passive Cooling for a Robot Enclosure',
    tagline:
      'A stack-ventilated, thermally massive enclosure that keeps a robot\'s electronics cooler than ambient on a hot day — with a logged internal vs external temperature record.',
    category: 'nature',
    difficulty: 'apprentice',
    buildTime: '3–4 weekends, then a 2-week logging campaign',
    costBand: '$$',
    wakandaIndex: 62,
    diyFeasibility: 84,
    scienceGrounding: 84,
    realitySplit: {
      real:
        'The mound of Odontotermes obesus ventilates by a measured mechanism: thin, exposed outer flutes and a massive, thermally damped central chimney are connected top and bottom, so the diurnal swing in ambient temperature drives a closed convection cell that reverses day to night. King, Ocko and Mahadevan measured the flow directly inside the conduits, along with the flute-vs-centre temperature difference and nest CO2, and ruled out wind and metabolic heating as the primary drivers. The building physics you will use — buoyancy-driven stack ventilation, thermal mass and time lag, and the difference between a porous-but-tight wall and an open hole — is textbook, and all of it is measurable with $30 of sensors.',
      narrative:
        'Eastgate Centre in Harare (Mick Pearce, 1996) is the famous "building that breathes like a termite mound". It is genuinely a passive-cooled building with documented energy performance, and it is genuinely inspired by termite mounds — but the honest position is that its design predates the 2015 flow measurements and rests on a different (steady-convection) model than the one the termites actually use. Do not present Eastgate as a validated copy of the mound mechanism. Present it as a documented engineering landmark, note the model it was designed on, and let your own measurements speak.',
    },
    summary:
      'Build two identical small enclosures for the same thermal load (a sealed box with an always-on resistive heater standing in for robot electronics). One is a plain sealed box; the other has an insulated central column of thermal mass, thin exposed "flute" channels on two opposite faces, and small top and bottom vents connecting the two. Log internal and external temperature, plus the flute-vs-core temperature difference, for two weeks with a fanless ESP32 and a set of DS18B20 probes, then plot the internal-external offset over the diurnal cycle.',
    science:
      'Ventilation needs bulk flow, not diffusion: gas takes on the order of four days to diffuse 2 m, far too slow to serve a colony. The mounds solve this with geometry. King et al. found wall porosity of 37–47% air by volume with a mean pore diameter of about 5 µm — the wall is a breathable windbreaker: diffusive transport passes, but pressure-driven bulk flow across the wall is essentially blocked, and a measured permeability test showed maximum wind-driven surface flow of about 0.01 mm/s for the 0–5 m/s winds at the site, which is far too small to drive the observed internal flow. What matters is the thermal asymmetry. The slender, exposed flutes heat and cool quickly; the bulk of the central chimney lags. With a flute-to-centre ΔT of roughly 3 °C, a simplified closed-loop buoyancy model gives flow speeds of about 35 cm/s, and the measured in-conduit flows were centimetres per second, reversing direction between day and night. Nest CO2 built up toward 6% by day and fell to a fraction of a percent at night. The engineering translation is direct: separate a low-thermal-mass, high-surface-area channel from a high-thermal-mass core, connect them in a loop, and let ambient temperature oscillation, not a fan, drive the flow. The stack-ventilation driving pressure is ΔP = ρ α ΔT g h for a loop of height h; wind adds a term of order ½ρv² but the mound data show wind is a minor player at the speeds that matter.',
    billOfMaterials: [
      { item: 'Extruded polystyrene (XPS) foam board, 25 mm', qty: '2 sheets', note: 'enclosure shell, both variants' },
      { item: 'Cement or dense clay/sand mix (thermal mass fill)', qty: '5 kg', note: 'the "chimney" core; water content affects heat capacity' },
      { item: 'Aluminium foil + matte black paint', qty: '1 roll / 1 can', note: 'high-emissivity, low-thermal-mass flute surfaces' },
      { item: 'DS18B20 waterproof temperature probes', qty: '8', note: '±0.5 °C stock accuracy; calibrate in ice water' },
      { item: 'ESP32 dev board + 4.7 kΩ pull-up + microSD or Wi-Fi logging', qty: '1', note: 'logs every 60 s for two weeks' },
      { item: 'Power resistor 10 W, 10 Ω + heatsink', qty: '1', note: 'the simulated electronics load' },
      { item: 'Bench PSU or 12 V 2 A adapter', qty: '1', note: 'constant, measured heat input' },
      { item: 'Inkbird/DS3231 real-time clock module', qty: '1', note: 'needed for timestamped logs through power cuts' },
      { item: 'SHT31 or BME280 temperature/humidity sensor', qty: '2', note: 'one inside, one outside' },
      { item: 'Anemometer + pyranometer (or a cheap weather station)', qty: '1', note: 'to record wind and solar — you must show wind is not the driver' },
      { item: 'Smoke pencil or a 3D-printed vane + thread', qty: '1 set', note: 'cheap visual confirmation of flow direction' },
    ],
    buildSteps: [
      {
        title: 'Build the two enclosures side by side',
        detail:
          'Cut and glue two identical 200 × 200 × 300 mm XPS boxes with 25 mm walls. Box A is sealed. Box B gets a 80 mm diameter central column filled with the cement/clay mass, two 15 mm flute channels formed on the outer faces of two opposite walls with a thin foil-and-black-paint liner, and 10 mm vents at the top and bottom connecting the flutes to the core space. Seal all other gaps. Identical internal volumes otherwise.',
      },
      {
        title: 'Install identical heat loads',
        detail:
          'Mount a 10 W resistor on a heatsink in each box, driven from the same supply at the same measured current. Measure actual dissipation with a current shunt and record it. If the two boxes do not receive the same wattage, the comparison is meaningless.',
      },
      {
        title: 'Calibrate every probe',
        detail:
          'Bundle all eight DS18B20 probes, plus the SHT31, in an ice-water bath with a reference thermometer and log for 20 min. Compute an individual offset for each probe. Stock ±0.5 °C is far too coarse to resolve a 3 °C flute-to-core difference honestly.',
      },
      {
        title: 'Place probes consistently',
        detail:
          'Box B: one probe in the core centre, one at mid-height in each flute, one in the top vent, one at the bottom vent, one in the head space. Box A: one in the head space and one at the core equivalent height. Outside: one in a shaded, ventilated radiation shield plus SHT31 for humidity and ambient.',
      },
      {
        title: 'Log for two weeks',
        detail:
          'Sample every 60 s. Timestamp with the RTC and write to microSD so a Wi-Fi drop does not cost you data. Record wind speed and solar irradiance alongside. Siting matters: both boxes must sit in the same sun and wind exposure, on a non-conductive stand, away from walls that reradiate.',
      },
      {
        title: 'Verify the flow, not just the temperature',
        detail:
          'On three days, at three times of day, confirm flow direction and speed with a smoke pencil or a thread-and-vane at the top and bottom vents. Measure the core-to-flute ΔT at the same moment. The claim "buoyancy drives the flow" requires flow direction to follow the sign of ΔT.',
      },
      {
        title: 'Compute the theoretical driving pressure',
        detail:
          'For each hour, compute the loop driving pressure ΔP = ρ α ΔT g h with h the flute-to-core height difference, ρ ≈ 1.16 kg/m³ and α ≈ 1/300 per °C. Compare the predicted flow direction with the observed one, and state openly how often they disagree.',
      },
      {
        title: 'Quantify the benefit, honestly',
        detail:
          'Plot internal minus external temperature for both boxes over the full two weeks. Report the daily peak offset, the mean offset, the thermal time lag in hours, and the day-night internal swing for each box. A good passive design shows a smaller swing and a negative daytime offset; it will not show the enclosure being cooler than ambient all day.',
      },
      {
        title: 'Produce the build note',
        detail:
          'Write up the two-week dataset as a one-page result: dimensions, mass, measured heat load, sensor calibration offsets, peak offsets, and the flow-direction check. This is the deliverable a real course would grade — a dataset, not a photo.',
      },
    ],
    code: {
      language: 'python',
      snippet:
        '# Post-processing: diurnal offset, thermal lag, and the buoyancy check.\n' +
        'import numpy as np, pandas as pd\n' +
        '\n' +
        'df = pd.read_csv("enclosure_log.csv", parse_dates=["t"]).set_index("t")\n' +
        'df = df.resample("5min").mean(numeric_only=True)\n' +
        '\n' +
        '# per-probe calibration offsets measured in the ice bath\n' +
        'OFF = {"core": -0.21, "flute_a": 0.13, "flute_b": 0.08, "top": -0.05,\n' +
        '       "bottom": 0.17, "box_a_head": 0.04, "amb": -0.11}\n' +
        'for k, o in OFF.items():\n' +
        '    if k in df: df[k] = df[k] - o\n' +
        '\n' +
        'df["dT_flute_core"] = 0.5 * (df.flute_a + df.flute_b) - df.core\n' +
        'df["offset_cool_box"] = df.core - df.amb\n' +
        'df["offset_sealed_box"] = df.box_a_head - df.amb\n' +
        '\n' +
        'rho, alpha, g, h = 1.16, 1.0 / 300.0, 9.81, 0.22   # h in metres\n' +
        'df["dP_Pa"] = rho * alpha * df.dT_flute_core * g * h\n' +
        '\n' +
        'daily = df.groupby(df.index.date)\n' +
        'print("peak daytime offset  (cool box):", df.offset_cool_box.groupby(df.index.date).max().mean())\n' +
        'print("peak daytime offset (sealed):", df.offset_sealed_box.groupby(df.index.date).max().mean())\n' +
        'print("mean internal swing cool/sealed:", df.core.groupby(df.index.date).apply(lambda s: s.max()-s.min()).mean(),\n' +
        '      df.box_a_head.groupby(df.index.date).apply(lambda s: s.max()-s.min()).mean())\n' +
        'print("hours of positive dT (flute warmer -> expect upward flute flow):",\n' +
        '      (df.dT_flute_core > 0).sum() * 5 / 60.0)',
      note:
        'The correlation between the sign of dT_flute_core and the observed smoke direction is the one test that separates "passive stack ventilation" from "it just has vents". Report disagreements.',
    },
    metrics: [
      { label: 'peak daytime internal-minus-external offset, vented box', value: 'target −1 to −4 °C (cooler than ambient)' },
      { label: 'peak daytime offset, sealed control box', value: 'typically +5 to +15 °C at 10 W in a 12 L box' },
      { label: 'daily internal temperature swing', value: 'vented box should be 40–70% of the sealed box swing' },
      { label: 'thermal time lag, core vs ambient peak', value: '2–6 h for a 5 kg clay core' },
      { label: 'flute-to-core ΔT', value: '0.5–3 °C, sign inverting day to night' },
      { label: 'measured loop driving pressure ΔP', value: '≈ 0.5–3 Pa for ΔT = 1–3 °C and h = 0.22 m' },
      { label: 'observed conduit flow speed', value: '2–35 cm/s depending on ΔT and restriction' },
      { label: 'logging continuity', value: '≥ 95% of expected 60 s samples over 14 days' },
    ],
    stretchGoals: [
      'Add a phase-change material (paraffin or a salt hydrate) inside the core and measure whether the peak offset improves and by how much per kilogram of PCM.',
      'Build a third box with the same thermal mass but no loop connection (open top vent only) and separate the contribution of mass from the contribution of the convective loop.',
      'Run the full experiment at two sites — one shaded, one in full sun — and show how solar gain changes the flow schedule.',
      'Add a low-power fan at 0.1 W and find the crossover point where a fan beats the passive stack on watts-per-degree.',
      'Apply the same instrumented enclosure to a real outdoor robot and report the electronics temperature over a two-week deployment.',
    ],
    safety: [
      'The 10 W resistor and its heatsink reach temperatures that cause burns and can ignite foam: mount it on a metal bracket, keep it clear of the XPS by 20 mm, fuse the supply at 1 A, and never leave the rig running unattended in the first hours of testing.',
      'Mixing cement releases alkaline dust that irritates eyes, skin and lungs: mix outdoors or under extraction, wear nitrile gloves and sealed goggles, and do not wash cement slurry into a drain.',
      'Mains-powered bench supplies and unenclosed wiring in a wet outdoor logging campaign are a shock and fire risk: use a 12 V DC supply with a fused, strain-relieved lead, keep all mains connections indoors and RCD-protected, and put the logger in a sealed IP-rated box.',
      'Outdoor logging over two weeks means weather: weigh or stake the enclosures so they do not blow over, keep the solar-shielded ambient probe above standing water, and do not leave LiPo cells or a laptop outdoors in the sun.',
      'Smoke pencils and any tracer smoke should be used outdoors or with ventilation, away from anyone with asthma, and never near the heated resistor.',
    ],
    lessonLinks: ['w5l10', 'w8l16', 'w2l3'],
    sources: [
      { label: 'King, Ocko and Mahadevan, Termite mounds harness diurnal temperature oscillations for ventilation, PNAS 112(37):11589–11593 (2015) — full preprint', url: 'https://arxiv.org/abs/1703.08067' },
      { label: 'Eastgate Centre, Harare — passive cooling, documented energy performance (Wikipedia, with primary citations)', url: 'https://en.wikipedia.org/wiki/Eastgate_Centre,_Harare' },
      { label: 'Termite mound — architecture, climate control and the ongoing debate over ventilation mechanisms (Wikipedia, with primary citations)', url: 'https://en.wikipedia.org/wiki/Termite_mound' },
      { label: 'Odontotermes — the genus whose mounds were instrumented in the 2015 study', url: 'https://en.wikipedia.org/wiki/Odontotermes' },
    ],
  },
];
