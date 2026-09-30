import type { Lesson } from '../types';

export const lesson: Lesson = {
  id: 'w8l15',
  number: 15,
  week: 8,
  track: 'frontier',
  title: 'Prototyping, CAD and Manufacturing',
  subtitle: 'A design that cannot be built is a drawing, not an engineering decision',
  duration: 75,
  difficulty: 'journeyman',
  xp: 190,
  hook: 'Geometry is a claim about the factory that will make it. Prove the claim or ship scrap.',
  objectives: [
    'Run a design from requirements through concept, embodiment and detail, with Pugh screening and a V-model verification trail.',
    'Read ISO 286 fits, pick materials from density, modulus, yield, temperature and cost, and choose a process by volume.',
    'Stack tolerances worst-case and by root-sum-square, then act on which one the assembly can tolerate.',
    'Specify a printable, machinable or mouldable part: orientation, draft, kerf, bend allowance, DFM rules.',
    'Take a board from breadboard to reflow, bring it up safely, and document revision, BOM and licence.',
  ],
  blocks: [
    { kind: 'prose', heading: 'Requirements are the only honest starting point',
      body: 'Write functional requirements as a number plus a test: *"lift 1.5 kg at 0.2 m/s for 30 min at 20-30 °C, verified by run 12 of the acceptance script."* Then move down three levels of concreteness: **concept** (2-4 architectures, sketched, no dimensions), **embodiment** (one architecture, layout, force paths, bearing and motor volume reserved), **detail** (every dimension toleranced, every fastener specified). The **V-model** is the discipline: each decomposition step on the left leg creates its own verification on the right leg, from unit test up to system acceptance.\n\n' +
        'Screen concepts with a **Pugh matrix**: score each option against a datum on weighted criteria as +1, 0 or -1. It ranks, it does not decide — physics and cost close the argument. Then hold real reviews: SRR, PDR, CDR, TRR. A review without a fixed agenda, a numbered drawing set and a written action list is a meeting.' },
    { kind: 'prose', heading: 'CAD that survives change',
      body: 'Model **top-down**: a skeleton sketc or master part owns the interface geometry (hole patterns, axis positions, envelope), and every child part references it. Change the skeleton and the assembly re-solves. Make the model **parametric** — a bracket whose width is `w = plate + 2*wall` — so a redesign is a number, not a rebuild. Constrain sketches fully and use assembly **mates** (coincident, concentric, distance, angle); every unconstrained degree of freedom is a part that will move in the interference check you did not run. Run **interference detection** on the closed assembly at both ends of every tolerance band, and check a swept envelope wherever a link rotates.' },
    { kind: 'prose', heading: 'Tolerance is a budget, not an apology',
      body: 'ISO 286 fits pair a hole letter and a shaft letter. **H7/g6** is a snug sliding fit: for Ø10 mm, H7 is +0.000/+0.015 mm and g6 is -0.014/-0.005 mm, so clearance runs from 0.005 mm (tightest) to 0.029 mm (loosest). H7/p6 is a press fit; H7/h6 a locational clearance. Distributions are not guesses: five independent ±0.10 mm links give ±0.50 mm worst-case but only ±0.224 mm root-sum-square, because independent random errors add in quadrature. Use worst-case when failure is dangerous or the stack is short; use RSS when the links are many, independent and centred. Then **GD&T** states intent: a position callout ⌀0.2 M on a bolt circle controls location with a bonus tolerance at MMC, where ± dimensions cannot.' },
    { kind: 'formula', title: 'Worst-case and RSS tolerance stack-up',
      tex: 'T_{wc} = \\sum_{i=1}^{n} t_i, \\qquad T_{rss} = \\sqrt{\\sum_{i=1}^{n} t_i^{2}}, \\qquad C = H_{min} - S_{max}',
      explain: 'Add half-tolerances arithmetically for the guarantee, in quadrature for the statistical estimate; clearance is smallest hole minus largest shaft. Five ±0.10 mm links: ±0.50 mm guaranteed, ±0.224 mm typical.' },
    { kind: 'formula', title: 'Cantilever deflection and motor sizing with a safety factor',
      tex: '\\delta = \\frac{F L^{3}}{3 E I}, \\qquad I = \\frac{b h^{3}}{12}, \\qquad \\tau_{req} = S_f \\left( J\\ddot{\\theta} + \\frac{m g r}{\\eta} \\right)',
      explain: 'Deflection grows with the cube of length and the cube of thickness, so a 25% thinner wall nearly halves stiffness. Motor torque is the sum of inertia and gravity load, scaled by a safety factor S_f = 1.5-2 and divided by drivetrain efficiency.' },
    { kind: 'table', title: 'Materials, with units',
      caption: 'Indicative room-temperature values; carbon fibre is a quasi-isotropic laminate, not dry fibre. Cost is 2024 small-quantity pricing and moves with form, grade and volume.',
      columns: ['Material', 'ρ (g/cm³)', 'E (GPa)', 'Yield (MPa)', 'T max (°C)', 'Cost (USD/kg)'],
      rows: [
        ['6061-T6 aluminium', '2.70', '68.9', '276', '150', '4-8'],
        ['1018 steel', '7.87', '205', '370', '400', '1-3'],
        ['PLA (FDM)', '1.24', '2.5-3.5', '50-60', '55', '20-30'],
        ['PETG (FDM)', '1.27', '2.0-2.2', '48-53', '70', '22-32'],
        ['ABS (FDM)', '1.04', '2.0-2.6', '40', '95', '20-30'],
        ['ASA (FDM)', '1.07', '2.1-2.6', '44', '98', '25-35'],
        ['Nylon PA12 (SLS)', '1.01', '1.7-2.0', '45-48', '120', '70-110'],
        ['Polycarbonate', '1.20', '2.3-2.4', '60-70', '115', '30-50'],
        ['Carbon fibre/epoxy', '1.55', '50-70', '600', '120', '40-80'],
      ] },
    { kind: 'prose', heading: 'Processes, and the numbers that rule them',
      body: '**FDM** melts a bead onto the layer below, so the bond is thermal, not chemical: a part is anisotropic — typically 50-80% of in-plane tensile strength across the layers — and tolerances run ±0.2 to ±0.5 mm, with ABS/ASA shrinking 0.5-0.8% and nylon worse. Orientation is therefore a design decision: put tensile load in the XY plane, avoid layer-plane peel. **SLA/DLP** cures resin at 0.025-0.1 mm layers for smooth, brittle parts. **SLS/MJF** sinter nylon powder with no support, ±0.2-0.3 mm, good for living hinges and ducts.\n\n' +
        '**Laser cutting** removes a kerf of 0.1-0.3 mm, so hole patterns must be offset by half the kerf if they are to assemble; **waterjet** cuts 50 mm steel with a 0.8-1.2 mm kerf and no heat-affected zone. **CNC milling** holds ±0.05 mm on 3 axes and reaches 5 faces in one setup on 5 axes at roughly double the rate. DFM rules: internal corners take the tool radius (a Ø6 mm end mill cannot cut a 1 mm corner), pockets stay under 4× tool diameter deep, and thin floors chatter. **Sheet metal** needs a bend allowance — $BA = \\theta (R + K T)$ with K ≈ 0.33-0.5 — or the flat pattern is short. **Injection moulding** demands 1-2° draft per side, uniform walls (2-3 mm) to avoid sink marks, and a steel tool costing USD 3,000-50,000, which only pays below a few dollars per part in high volume. **Composites** lay plies in a balanced, symmetric stack ([0/±45/90]s) or the laminate warps as it cures.' },
    { kind: 'chart', title: 'Injection-moulding unit cost against production volume',
      caption: 'Classic learning curve: tooling dominates below ~1,000 parts, cycle cost dominates above ~100,000. Values assume a 100 g part.',
      chartType: 'line', xLabel: 'Annual production volume (parts)', yLabel: 'Unit cost (USD)',
      x: [100, 1000, 10000, 100000, 1000000],
      series: [
        { key: 'tool50k', label: 'Mould USD 50,000', color: '#f59e0b', data: [505, 55, 10, 5.5, 5.05] },
        { key: 'tool10k', label: 'Mould USD 10,000', color: '#38bdf8', data: [105, 15, 6, 5.1, 5.01] },
        { key: 'cnc', label: 'CNC milling (no tooling)', color: '#a3e635', data: [12, 12, 12, 12, 12] },
      ] },
    { kind: 'table', title: 'Design for the machine: the details that fail in the field',
      columns: ['Item', 'Rule or number', 'Failure it prevents'],
      rows: [
        ['Cable chain', 'Bend radius ≥ 7.5 × cable OD', 'Conductor fatigue after ~10⁶ cycles'],
        ['Bearing preload', '5-15% of static load rating, or a wave washer', 'Axial rattle and false encoder counts'],
        ['Thread engagement', '1.5 × diameter in steel, 2 × in aluminium', 'Stripped threads at torque'],
        ['Heat-set insert', 'Boss OD ≥ 2 × insert OD, boss depth ≥ insert length', 'Hoop-stress cracking when hot'],
        ['Fastener retention', 'Medium-strength threadlocker + nyloc on any vibrating joint', 'Back-out under vibration'],
        ['Alignment', 'Two dowel pins, or shims of 0.05-0.5 mm', 'Servo horn misalignment and belt walk'],
        ['Sealing', 'IP67 = dust-tight, 30 min at 1 m; O-ring squeeze 15-30%', 'Ingress and corrosion'],
        ['Harness', '20 AWG ≈ 11 A chassis wiring; use 2× area for long runs', 'Voltage drop and hot insulation'],
      ] },
    { kind: 'code', title: 'Parametric bracket in OpenSCAD — one number to change', language: 'openscad',
      note: 'Rerun with w = 6 and add 0.25 mm per side for a loose FDM fit; add a 45° chamfer on the bottom flange for an unsupported overhang.',
      code: `// Bracket: L-section, parametric, printed flange-down
export = "bracket";
w  = 5;      // wall thickness, mm
hw = 40;     // horizontal leg, mm
vw = 30;     // vertical leg, mm
d  = 20;     // depth, mm
r  = 3;      // fillet, mm
holeD = 4.2; // M4 clearance for FDM

module bracket() {
  difference() {
    union() {
      cube([hw, d, w]);
      cube([w, d, vw]);
      translate([w, 0, w]) rotate([-90, 0, 0]) cylinder(r = r, h = d, $fn = 48);
    }
    // two clearance holes, boss-free for a washer face
    translate([hw - 8, d / 2, -1]) cylinder(d = holeD, h = w + 2, $fn = 64);
    translate([w / 2, d / 2, vw - 8]) rotate([90, 0, 0]) cylinder(d = holeD, h = d + 2, $fn = 64);
  }
}
linear_extrude(w) projection() bracket();` },
    { kind: 'lab', labId: 'gear-train', title: 'Tolerance in motion',
      brief: 'Build a two-stage gear train in the sim and watch how backlash, centre distance and bearing preload move the output angle.',
      tasks: [
        'Set the centre distance 0.1 mm long and log output backlash in degrees.',
        'Swap to an H7/g6 bore on the idler and compare backlash with the H7/p6 press fit.',
        'Add 2° of shaft misalignment and record the peak tooth load from the sim.',
      ] },
    { kind: 'lab', labId: 'robot-arm', title: 'Interference and envelope check',
      brief: 'Assemble a 6-DOF arm with a gripper and tool plate, then sweep the joint limits to find every collision before you cut metal.',
      tasks: [
        'Find one pose where the gripper intersects the base and record the joint values.',
        'Re-mate the tool plate from the wrist face to the skeleton datum and re-run the check.',
        'Add 0.3 mm to every mating face and confirm the assembly still clears.',
      ] },
    { kind: 'steps', title: 'Breadboard to board: bring-up without smoke',
      steps: [
        { title: 'Freeze the schematic', detail: 'One netlist, one BOM with part numbers, one revision tag in git (v0.3.1). Every part has a second source or an explicit single-source note with lead time and MOQ.' },
        { title: 'Breadboard the risky blocks', detail: 'Prove the switching regulator, the sensor bus and the connector pinout on a breadboard or breakout before layout. Breadboards add 2-10 pF and 0.1-0.5 Ω per contact; keep switching and high-current paths off them.' },
        { title: 'Layout and order', detail: 'JLCPCB, PCBWay or OSH Park accept KiCad Gerbers: 2 layers, 0.15 mm trace / 0.15 mm space, 0.3 mm drill is stock-cheap; 5-10 boards land in 5-15 days. Add test points on every rail and 0.1 µF per IC.' },
        { title: 'Stencil and reflow', detail: 'Order a stainless stencil with the boards. Lead-free paste: ramp 1-3 °C/s, soak 150-180 °C for 60-90 s, reflow above 217 °C for 45-90 s, peak 235-245 °C, then cool under 4 °C/s.' },
        { title: 'Smoke test', detail: 'Unpowered: check every rail to ground for a short. Power from a current-limited supply at 50 mA, 5 V. Only then raise the limit. Feel every package for heat, then verify rails with a scope, not a multimeter alone.' },
        { title: 'Document and tag', detail: 'Photograph the board, write the ECO if anything changed, tag the release, and log the bring-up results against the requirements they were meant to verify.' },
      ] },
    { kind: 'callout', tone: 'warning', title: 'Version control, supply chain and licences are engineering',
      body: 'A hardware revision is a git tag plus a physical label plus an ECO: change a resistor and the board becomes v0.4.0, and old assemblies are scrapped or reworked, never relabelled. Single-source a custom sensor and one tariff or one factory fire stops your line — carry alternates, know each lead time and MOQ, and buy the long-lead part first. Licence deliberately: **CERN-OHL-S/W/P** is built for hardware (reciprocal, weakly reciprocal, permissive), **MIT/Apache-2.0** covers firmware, and **GPL** reaches the software you ship but not the enclosure you print. Open-source hardware certification (OSHWA) requires you to publish the files that let someone rebuild exactly what you shipped.\n\n' +
        'Validate with **DOE** (vary factors together, not one at a time), **HALT** to find limits beyond spec, **HASS** to screen production, **FMEA** with RPN = severity × occurrence × detection to rank risk, and **accelerated life testing** with a Weibull fit. For a Weibull shape β = 2 and characteristic life η = 10,000 h, $B_{10} = \\eta\\,(\\ln(1/0.9))^{1/\\beta} \\approx 3{,}246$ h — the point where 10% have failed, which is what a warranty actually costs.' },
  ],
  keyTerms: [
    { term: 'Pugh matrix', definition: 'Weighted +1/0/-1 concept screen scored against a datum concept; it ranks, it does not decide.' },
    { term: 'V-model', definition: 'Decomposition down the left leg, verification up the right leg, level by level.' },
    { term: 'GD&T', definition: 'Geometric dimensioning and tolerancing: position, flatness, runout, with MMC bonus tolerance.' },
    { term: 'ISO 286 fit', definition: 'Hole/shaft letter pair such as H7/g6 that fixes clearance; Ø10 H7/g6 gives 0.005-0.029 mm.' },
    { term: 'RSS stack-up', definition: 'Root-sum-square tolerance: independent errors add in quadrature, so five ±0.1 links give ±0.224 mm.' },
    { term: 'Kerf', definition: 'Material a cutting process removes: 0.1-0.3 mm laser, 0.8-1.2 mm waterjet.' },
    { term: 'Bend allowance', definition: 'Flat length consumed by a bend: BA = θ(R + KT), K ≈ 0.33-0.5.' },
    { term: 'DFM', definition: 'Design for manufacturing: draft, uniform walls, tool-radius corners and tolerances the process actually holds.' },
    { term: 'ECO', definition: 'Engineering change order: the document that authorises and records a revision change.' },
  ],
  quiz: [
    { id: 'w8l15q1', question: 'Which symbol marks a position tolerance in a GD&T feature control frame?',
      choices: ['⏥ flatness', '⌖ position', '⌭ cylindricity', '⌰ total runout'], answer: 1, level: 'recall',
      explanation: 'Position is the crosshair-in-circle; flatness, cylindricity and runout have their own symbols.' },
    { id: 'w8l15q2', question: 'A stack of five independent dimensions is toleranced ±0.10 mm each. What are the worst-case and RSS totals?',
      choices: ['±0.50 mm and ±0.224 mm', '±0.50 mm and ±0.100 mm', '±0.10 mm and ±0.022 mm', '±0.50 mm and ±0.500 mm'], answer: 0, level: 'apply',
      explanation: 'Worst case sums the half-tolerances (0.50); RSS adds them in quadrature, √(5 × 0.01) = 0.224 mm.' },
    { id: 'w8l15q3', question: 'An FDM bracket bends in service. Which orientation gives the strongest part?',
      choices: ['Layers perpendicular to the bending stress', 'Layers parallel to the bending stress', 'Layers at 45° to every stress', 'Orientation does not matter for FDM'], answer: 1, level: 'understand',
      explanation: 'FDM bonds are weakest across layers; tension in the XY plane keeps load in the stronger extruded strands, and a 45° tilt still splits the load across bonds.' },
    { id: 'w8l15q4', question: 'A bracket needs the lightest possible part with the same bending stiffness. Where do you add material?',
      choices: ['Thicken both flanges uniformly', 'Add a triangular gusset at the corner', 'Drill lightening holes in the web', 'Switch to a denser material'], answer: 1, level: 'analyze',
      explanation: 'A gusset raises h at the outer fibre so I = bh³/12 grows fastest exactly where the moment peaks; uniform thickening is the heaviest way to buy stiffness.' },
    { id: 'w8l15q5', question: 'You need 50,000 ABS enclosures per year with painted cosmetic faces. Which process?',
      choices: ['FDM printing', 'Injection moulding from one steel tool', 'SLA resin printing', 'Laser-cut acrylic panels'], answer: 1, level: 'design',
      explanation: 'At 10⁴-10⁵ parts the amortised tool cost is a few cents each while FDM and SLA unit cost barely moves; 1-2° draft and uniform 2-3 mm walls make it mouldable.' },
    { id: 'w8l15q6', question: 'A Ø10 mm hole is H7 (+0.000/+0.015) and the shaft is g6 (-0.014/-0.005). The minimum clearance is...',
      choices: ['0.005 mm', '0.015 mm', '0.029 mm', '0.034 mm'], answer: 0, level: 'apply',
      explanation: 'Minimum clearance is smallest hole minus largest shaft: 10.000 - 9.995 = 0.005 mm; the maximum is 10.015 - 9.986 = 0.029 mm.' },
    { id: 'w8l15q7', question: 'Sizing a joint motor, required continuous torque computes to 0.40 N·m and the gearbox is 70% efficient. With which torque do you select the motor?',
      choices: ['0.40 N·m', '0.28 N·m', '0.57 N·m', '0.80 N·m'], answer: 3, level: 'design',
      explanation: 'Divide by efficiency (0.57) then apply a safety factor of about 1.4-2 for the unknown duty: 0.80 N·m nominal, and check peak and thermal limits separately.' },
  ],
  flashcards: [
    { front: 'Concept, embodiment, detail', back: 'The three design stages: architectures, then one layout, then every dimension toleranced.', tag: 'process' },
    { front: 'Pugh matrix', back: 'Weighted +1/0/-1 screen of concepts against a datum; ranks, never decides.', tag: 'process' },
    { front: 'Skeleton model', back: 'Top-down master geometry that owns interfaces, so children update when it changes.', tag: 'cad' },
    { front: 'H7/g6', back: 'Sliding fit: Ø10 mm gives 0.005-0.029 mm clearance; H7/p6 is a press fit.', tag: 'tolerance' },
    { front: 'RSS vs worst case', back: 'Five ±0.10 mm links: ±0.50 mm guaranteed, ±0.224 mm statistically.', tag: 'tolerance' },
    { front: 'FDM anisotropy', back: 'Layer bonds are thermal, so Z strength is typically 50-80% of in-plane: orient load in XY.', tag: 'manufacturing' },
    { front: 'Draft angle', back: '1-2° per side on moulded walls so the part releases without dragging.', tag: 'manufacturing' },
    { front: 'Thread engagement', back: '1.5 × diameter in steel, 2 × in aluminium, or the thread strips first.', tag: 'design' },
    { front: 'B10 life', back: 'Time at which 10% of units fail; from Weibull, B10 = η(ln(1/0.9))^(1/β).', tag: 'reliability' },
    { front: 'CERN-OHL', back: 'Hardware licence family: S reciprocal, W weakly reciprocal, P permissive.', tag: 'licensing' },
  ],
  forgePrompts: [
    'Redesign a printed gear-train housing top-down from a single skeleton sketch and print two variants at 0.2 mm and 0.3 mm layer height, then measure backlash.',
    'Build the bracket from the code block in a 6061-T6 and an ASA version, load both to failure, and compare measured deflection with δ = FL³/3EI.',
    'Write a one-page ECO for a board revision you actually made: what changed, why, which requirement it touched, and how you verified it.',
  ],
};
