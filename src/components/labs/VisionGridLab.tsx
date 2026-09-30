import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { LabProps } from './LabFrame';
import { LabButton, LabFrame, Readout, Slider, Toggle } from './LabFrame';

/* ==================================================================
   Perception bench — three coordinated 2-D panels on one canvas:
     1. ground-truth room (walls, pillar, two moving obstacles)
     2. sensor view: a spinning range fan with beam width, noise and
        distance-dependent dropout
     3. an occupancy grid built by log-odds fusion from the *dead
        reckoned* pose, so odometry error visibly smears the map.
   Everything is metres, radians and seconds.
   ================================================================== */

const TAU = Math.PI * 2;
const ROOM = { w: 12, h: 9 };
/** log-odds clamp — ±4 is ~98% confidence either way */
const LOG_CLAMP = 4;
const L_OCC = 0.85; // hit update (log-odds)
const L_FREE = -0.38; // traversed-cell update (log-odds)
const G = 9.81;

const C = {
  bg: '#05010f',
  deep: '#0a0420',
  gold: '#f5b301',
  green: '#6ee7a8',
  magenta: '#c026d3',
  cyan: '#67e8f9',
  text: '#c9bde6',
  orange: '#ff6b1a',
};

interface Seg {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
interface Disc {
  x: number;
  y: number;
  r: number;
  dark: boolean;
  kind: number;
}

/** room walls: an outer box plus an internal partition with a doorway */
const WALLS: Seg[] = [
  { x1: 0, y1: 0, x2: ROOM.w, y2: 0 },
  { x1: ROOM.w, y1: 0, x2: ROOM.w, y2: ROOM.h },
  { x1: ROOM.w, y1: ROOM.h, x2: 0, y2: ROOM.h },
  { x1: 0, y1: ROOM.h, x2: 0, y2: 0 },
  { x1: 4.2, y1: 0, x2: 4.2, y2: 3.1 },
  { x1: 4.2, y1: 5.2, x2: 4.2, y2: ROOM.h },
];
/* ---- outcome codes stored per ray index -------------------------- */
const K_NONE = 0; // nothing inside max range
const K_WALL = 1;
const K_PILLAR = 2;
const K_OBST = 3;
const K_DARK = 4; // matte-black obstacle: much weaker return
const K_DROP = 5; // returned nothing even though a surface was there

const PILLAR: Disc = { x: 8.6, y: 6.3, r: 0.72, dark: false, kind: K_PILLAR };

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

function gauss(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
}

function raySeg(ox: number, oy: number, dx: number, dy: number, s: Seg): number | null {
  const sx = s.x2 - s.x1;
  const sy = s.y2 - s.y1;
  const den = dx * sy - dy * sx;
  if (Math.abs(den) < 1e-9) return null;
  const t = ((s.x1 - ox) * sy - (s.y1 - oy) * sx) / den;
  if (t <= 1e-4) return null;
  const u = ((s.x1 - ox) * dy - (s.y1 - oy) * dx) / den;
  if (u < 0 || u > 1) return null;
  return t;
}

function rayDisc(ox: number, oy: number, dx: number, dy: number, d: Disc): number | null {
  const fx = ox - d.x;
  const fy = oy - d.y;
  const b = fx * dx + fy * dy;
  const cc = fx * fx + fy * fy - d.r * d.r;
  const disc = b * b - cc;
  if (disc < 0) return null;
  const sq = Math.sqrt(disc);
  const t1 = -b - sq;
  const t2 = -b + sq;
  if (t1 > 1e-4) return t1;
  if (t2 > 1e-4) return t2;
  return null;
}

function distToSeg(px: number, py: number, s: Seg): number {
  const vx = s.x2 - s.x1;
  const vy = s.y2 - s.y1;
  const wx = px - s.x1;
  const wy = py - s.y1;
  const l2 = vx * vx + vy * vy || 1;
  const t = clamp((wx * vx + wy * vy) / l2, 0, 1);
  return Math.hypot(px - (s.x1 + t * vx), py - (s.y1 + t * vy));
}

interface Trace {
  t: number;
  kind: number;
  dark: boolean;
  /** surface normal, used for the grazing-incidence (specular) test */
  nx: number;
  ny: number;
}

function traceRay(ox: number, oy: number, ang: number, maxRange: number, discs: Disc[]): Trace | null {
  const dx = Math.cos(ang);
  const dy = Math.sin(ang);
  let best: Trace | null = null;
  for (const s of WALLS) {
    const t = raySeg(ox, oy, dx, dy, s);
    if (t === null || t > maxRange) continue;
    if (best && t >= best.t) continue;
    const sx = s.x2 - s.x1;
    const sy = s.y2 - s.y1;
    const len = Math.hypot(sx, sy) || 1;
    best = { t, kind: K_WALL, dark: false, nx: -sy / len, ny: sx / len };
  }
  for (const d of discs) {
    const t = rayDisc(ox, oy, dx, dy, d);
    if (t === null || t > maxRange) continue;
    if (best && t >= best.t) continue;
    const hx = ox + dx * t;
    const hy = oy + dy * t;
    const nx = (hx - d.x) / d.r;
    const ny = (hy - d.y) / d.r;
    best = { t, kind: d.kind, dark: d.dark, nx, ny };
  }
  return best;
}

interface RayResult {
  range: number;
  kind: number;
  hit: boolean;
}

/**
 * One range measurement. A wide beam is sampled at three sub-angles and the
 * nearest return wins — that is the real corner/clutter behaviour of a wide
 * ultrasonic cone and it is why corners look "rounded" on sonar maps.
 */
function measure(
  ox: number,
  oy: number,
  ang: number,
  halfAngle: number,
  maxRange: number,
  sigma: number,
  drop: number,
  noisy: boolean,
  discs: Disc[],
): RayResult {
  let best: Trace | null = null;
  for (let k = -1; k <= 1; k++) {
    const a = ang + k * halfAngle;
    const tr = traceRay(ox, oy, a, maxRange, discs);
    if (tr && (!best || tr.t < best.t)) best = tr;
  }
  if (!best) return { range: maxRange, kind: K_NONE, hit: false };

  let r = best.t;
  let pDrop = 0;
  if (noisy) {
    r = clamp(r + gauss() * sigma, 0.03, maxRange);
    // dropout grows with distance: return energy falls as 1/r^2, so the
    // detection probability collapses long before the hard range limit
    pDrop = drop * (0.3 + 0.7 * (best.t / maxRange));
    // grazing incidence: a smooth wall mirrors the beam away from the
    // receiver (textbook specular dropout for both sonar and LiDAR)
    const cosInc = Math.abs(Math.cos(ang) * best.nx + Math.sin(ang) * best.ny);
    if (cosInc < 0.3) pDrop = Math.min(0.97, pDrop + 0.5 * (1 - cosInc / 0.3));
    // matte black absorbs the near-IR pulse
    if (best.dark) pDrop = Math.min(0.97, pDrop + 0.25 + 0.5 * drop);
  }
  if (noisy && Math.random() < pDrop) return { range: maxRange, kind: K_DROP, hit: false };
  return { range: r, kind: best.kind, hit: true };
}

function isStaticOccupied(x: number, y: number, res: number): boolean {
  for (const s of WALLS) if (distToSeg(x, y, s) < res * 0.6) return true;
  return Math.hypot(x - PILLAR.x, y - PILLAR.y) < PILLAR.r;
}

interface Sim {
  t: number;
  viewW: number;
  viewH: number;
  /* spinning scan head, in radians of accumulated rotation */
  sweep: number;
  sweepStart: number;
  fireAng: number;
  nrays: number;
  hitsSweep: number;
  shotSweep: number;
  lastHits: number;
  lastShot: number;
  sweeps: number;
  dr: { x: number; y: number; th: number };
  truthTrail: number[];
  drTrail: number[];
  trailClock: number;
  statClock: number;
  clear: boolean;
  /* stored measurement per ray index (a real scanner keeps the pose at
     which each point was measured) */
  rayRange: Float32Array;
  rayKind: Uint8Array;
  rayTime: Float32Array;
  rayOx: Float32Array;
  rayOy: Float32Array;
  rayAng: Float32Array;
  /* occupancy grid */
  grid: Float32Array;
  gres: number;
  cols: number;
  rows: number;
  img: ImageData | null;
  lastErr: number;
  lastKnown: number;
}

function newSim(): Sim {
  return {
    t: 0,
    viewW: 0,
    viewH: 0,
    sweep: 0,
    sweepStart: 0,
    fireAng: 0,
    nrays: -1,
    hitsSweep: 0,
    shotSweep: 0,
    lastHits: 0,
    lastShot: 0,
    sweeps: 0,
    dr: { x: 0, y: 0, th: 0 },
    truthTrail: [],
    drTrail: [],
    trailClock: 0,
    statClock: 0,
    clear: true,
    rayRange: new Float32Array(0),
    rayKind: new Uint8Array(0),
    rayTime: new Float32Array(0),
    rayOx: new Float32Array(0),
    rayOy: new Float32Array(0),
    rayAng: new Float32Array(0),
    grid: new Float32Array(0),
    gres: 0,
    cols: 0,
    rows: 0,
    img: null,
    lastErr: 0,
    lastKnown: 0,
  };
}

/** log-odds → heat-map colour: unknown near-black, free dark blue, occupied hot pink → gold */
function heat(l: number, px: Uint8ClampedArray, o: number) {
  if (l === 0) {
    px[o] = 6;
    px[o + 1] = 2;
    px[o + 2] = 16;
    px[o + 3] = 255;
    return;
  }
  if (l < 0) {
    const t = Math.min(1, -l / 2.5);
    px[o] = 6 + t * 24;
    px[o + 1] = 2 + t * 46;
    px[o + 2] = 16 + t * 122;
    px[o + 3] = 255;
    return;
  }
  const t = Math.min(1, l / 2.4);
  if (t < 0.5) {
    const u = t * 2;
    px[o] = 6 + u * 186;
    px[o + 1] = 2 + u * 36;
    px[o + 2] = 16 + u * 195;
  } else {
    const u = (t - 0.5) * 2;
    px[o] = 192 + u * 53;
    px[o + 1] = 38 + u * 141;
    px[o + 2] = 211 - u * 210;
  }
  px[o + 3] = 255;
}

interface Preset {
  name: string;
  rays: number;
  range: number;
  half: number;
  sigma: number;
  drop: number;
}

const PRESETS: Preset[] = [
  { name: '2-D LiDAR 360°', rays: 360, range: 12, half: 1, sigma: 0.02, drop: 0.05 },
  { name: 'ultrasonic ring ×16', rays: 16, range: 4, half: 25, sigma: 0.04, drop: 0.16 },
  { name: 'cheap ToF fan', rays: 64, range: 6, half: 6, sigma: 0.12, drop: 0.28 },
];

export default function VisionGridLab({ tasks }: LabProps) {
  const [rays, setRays] = useState(360);
  const [maxRange, setMaxRange] = useState(8);
  const [halfAngle, setHalfAngle] = useState(2);
  const [sigma, setSigma] = useState(0.03);
  const [dropout, setDropout] = useState(0.1);
  const [res, setRes] = useState(0.25);
  const [noisy, setNoisy] = useState(true);
  const [thresh, setThresh] = useState(1.0);
  const [showRays, setShowRays] = useState(true);
  const [showTruth, setShowTruth] = useState(true);
  const [drift, setDrift] = useState(true);
  const [paused, setPaused] = useState(false);
  const [focal, setFocal] = useState(700);
  const [baseline, setBaseline] = useState(0.12);
  const [disparity, setDisparity] = useState(0.25);
  const [stats, setStats] = useState({ hits: 0, shots: 0, known: 0, err: 0, hz: 0 });
  const [preset, setPreset] = useState('2-D LiDAR 360°');

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sim = useRef<Sim>(newSim());

  const params = useMemo(
    () => ({ rays, maxRange, halfAngle, sigma, dropout, res, noisy, thresh, showRays, showTruth, drift, paused }),
    [rays, maxRange, halfAngle, sigma, dropout, res, noisy, thresh, showRays, showTruth, drift, paused],
  );
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const applyPreset = (p: Preset) => {
    setRays(p.rays);
    setMaxRange(p.range);
    setHalfAngle(p.half);
    setSigma(p.sigma);
    setDropout(p.drop);
    setPreset(p.name);
  };

  /** hand-tuning a sensor parameter means it is no longer the named preset */
  const tune =
    <T,>(set: (v: T) => void) =>
    (v: T) => {
      setPreset('custom');
      set(v);
    };

  /* stereo depth error: z_err = z²·Δd / (f·B) */
  const depth = useMemo(() => {
    const out: { z: number; err: number }[] = [];
    for (let i = 0; i <= 48; i++) {
      const z = 0.5 + ((20 - 0.5) * i) / 48;
      const err = (z * z * disparity) / (focal * baseline);
      out.push({ z: Math.round(z * 100) / 100, err: Math.round(Math.min(12, err) * 1000) / 1000 });
    }
    return out;
  }, [focal, baseline, disparity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const off = document.createElement('canvas');
    const offCtx = off.getContext('2d');

    let raf = 0;
    let last = performance.now();

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.max(0, Math.floor(r.width));
      const h = Math.max(0, Math.floor(r.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sim.current.viewW = w;
      sim.current.viewH = h;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const P = paramsRef.current;
      const S = sim.current;
      const w = S.viewW;
      const h = S.viewH;
      if (w < 4 || h < 4) return; // never draw into a zero-sized canvas

      /* ---------------- sensor budget ----------------
         a real scanner trades rate against angular resolution;
         we assume a fixed ~900 points/s budget.                     */
      const rot = clamp(900 / Math.max(8, P.rays), 0.25, 2.5); // rev/s
      const n = Math.round(P.rays);

      /* ---------------- grid (re)allocation ---------------- */
      if (S.gres !== P.res || S.grid.length === 0) {
        S.gres = P.res;
        S.cols = Math.max(1, Math.round(ROOM.w / P.res));
        S.rows = Math.max(1, Math.round(ROOM.h / P.res));
        S.grid = new Float32Array(S.cols * S.rows);
        S.img = offCtx ? offCtx.createImageData(S.cols, S.rows) : null;
        S.clear = true;
      }
      if (S.nrays !== n) {
        S.nrays = n;
        S.rayRange = new Float32Array(n);
        S.rayKind = new Uint8Array(n);
        S.rayTime = new Float32Array(n).fill(-1e6);
        S.rayOx = new Float32Array(n);
        S.rayOy = new Float32Array(n);
        S.rayAng = new Float32Array(n);
        S.fireAng = S.sweep;
      }
      if (S.clear) {
        S.clear = false;
        S.grid.fill(0);
        S.sweeps = 0;
        S.hitsSweep = 0;
        S.shotSweep = 0;
        S.lastHits = 0;
        S.lastShot = 0;
        S.rayTime.fill(-1e6);
      }

      /* ---------------- world motion ---------------- */
      if (!P.paused) S.t += dt;
      const t = S.t;
      const R = 1.5;
      const w0 = TAU * 0.045;
      const truth = {
        x: 6.2 + R * Math.cos(w0 * t),
        y: 4.5 + R * Math.sin(w0 * t),
        th: w0 * t + Math.PI / 2,
      };
      if (!P.drift) {
        S.dr = { ...truth };
      } else if (!P.paused) {
        // dead reckoning: 3.5°/s heading bias + 8% speed scale error
        S.dr.th += (w0 + 0.061) * dt;
        const v = R * w0 * 1.08;
        S.dr.x += v * Math.cos(S.dr.th) * dt;
        S.dr.y += v * Math.sin(S.dr.th) * dt;
      }
      if (S.truthTrail.length === 0) {
        S.dr = { ...truth };
        S.truthTrail.push(truth.x, truth.y);
        S.drTrail.push(truth.x, truth.y);
      }
      const o1: Disc = {
        x: 7.0 + 2.0 * Math.sin(TAU * 0.055 * t),
        y: 3.2 + 1.7 * Math.sin(TAU * 0.081 * t + 1.1),
        r: 0.34,
        dark: false,
        kind: K_OBST,
      };
      const o2: Disc = {
        x: 7.6 + 1.9 * Math.sin(TAU * 0.067 * t + 2.4),
        y: 6.2 + 1.6 * Math.sin(TAU * 0.047 * t),
        r: 0.42,
        dark: true,
        kind: K_DARK,
      };
      const discs: Disc[] = [PILLAR, o1, o2];

      if (!P.paused) {
        S.trailClock += dt;
        if (S.trailClock > 0.12) {
          S.trailClock = 0;
          S.truthTrail.push(truth.x, truth.y);
          S.drTrail.push(S.dr.x, S.dr.y);
          if (S.truthTrail.length > 2600) S.truthTrail.splice(0, 2);
          if (S.drTrail.length > 2600) S.drTrail.splice(0, 2);
        }
      }

      /* ---------------- fire the rays that fall in this frame's sector ---------------- */
      if (!P.paused) {
        S.sweep += TAU * rot * dt;
        const spacing = TAU / n;
        let guard = 0;
        while (S.fireAng < S.sweep && guard < n) {
          guard++;
          const ang = S.fireAng % TAU;
          const idx = ((Math.round(S.fireAng / spacing) % n) + n) % n;
          const m = measure(truth.x, truth.y, truth.th + ang, (P.halfAngle * Math.PI) / 180, P.maxRange, P.sigma, P.dropout, P.noisy, discs);
          S.rayRange[idx] = m.range;
          S.rayKind[idx] = m.kind;
          S.rayTime[idx] = S.t;
          S.rayOx[idx] = truth.x;
          S.rayOy[idx] = truth.y;
          S.rayAng[idx] = truth.th + ang;
          S.shotSweep++;
          if (m.hit) S.hitsSweep++;

          /* inverse sensor model, applied from the DEAD-RECKONED pose */
          const rAng = S.dr.th + ang;
          const px = S.dr.x;
          const py = S.dr.y;
          const steps = Math.max(1, Math.ceil(m.range / (P.res * 0.5)));
          for (let k = 0; k < steps; k++) {
            const d = ((k + 0.5) * m.range) / steps;
            const cx = px + Math.cos(rAng) * d;
            const cy = py + Math.sin(rAng) * d;
            const ci = Math.floor(cx / P.res);
            const cj = Math.floor(cy / P.res);
            if (ci < 0 || cj < 0 || ci >= S.cols || cj >= S.rows) continue;
            const gi = cj * S.cols + ci;
            if (k < steps - 1) {
              if (m.hit || m.kind === K_NONE) S.grid[gi] = Math.max(-LOG_CLAMP, S.grid[gi] + L_FREE);
            } else if (m.hit) {
              S.grid[gi] = Math.min(LOG_CLAMP, S.grid[gi] + L_OCC);
            }
          }
          S.fireAng += spacing;
        }
        if (S.sweep - S.sweepStart >= TAU) {
          S.sweepStart += TAU;
          S.lastHits = S.hitsSweep;
          S.lastShot = S.shotSweep;
          S.hitsSweep = 0;
          S.shotSweep = 0;
          S.sweeps++;
        }
      }

      /* ---------------- statistics (throttled) ---------------- */
      S.statClock += dt;
      if (S.statClock > 0.25 && S.grid.length > 0) {
        S.statClock = 0;
        let known = 0;
        let wrong = 0;
        const knownThresh = 0.35;
        for (let cj = 0; cj < S.rows; cj++) {
          for (let ci = 0; ci < S.cols; ci++) {
            const l = S.grid[cj * S.cols + ci];
            if (Math.abs(l) < knownThresh) continue;
            known++;
            const cx = (ci + 0.5) * P.res;
            const cy = (cj + 0.5) * P.res;
            const pred = l > P.thresh;
            if (pred !== isStaticOccupied(cx, cy, P.res)) wrong++;
          }
        }
        S.lastKnown = (known / (S.cols * S.rows)) * 100;
        S.lastErr = known > 0 ? (wrong / known) * 100 : 0;
        const hz = t > 1 ? S.sweeps / t : rot;
        setStats({ hits: S.lastHits, shots: S.lastShot, known: S.lastKnown, err: S.lastErr, hz });
      }

      /* ================= draw ================= */
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, w, h);

      const wide = w / h > 1.3;
      const cols = wide ? 3 : 1;
      const rows = wide ? 1 : 3;
      const gap = 8;
      const pad = 8;
      const pw = (w - pad * 2 - gap * (cols - 1)) / cols;
      const ph = (h - pad * 2 - gap * (rows - 1)) / rows;
      const panel = (i: number) => ({
        x: pad + (i % cols) * (pw + gap),
        y: pad + Math.floor(i / cols) * (ph + gap),
        w: pw,
        h: ph,
      });

      type Panel = { x: number; y: number; w: number; h: number };
      const scaler = (p: Panel) => {
        const s = Math.min(p.w / ROOM.w, (p.h - 16) / ROOM.h);
        return {
          s,
          ox: p.x + (p.w - ROOM.w * s) / 2,
          oy: p.y + 16 + (p.h - 16 - ROOM.h * s) / 2,
        };
      };
      const mk = (p: Panel) => {
        const t2 = scaler(p);
        return {
          sx: (x: number) => t2.ox + x * t2.s,
          sy: (y: number) => t2.oy + y * t2.s,
          s: t2.s,
        };
      };
      const title = (p: Panel, label: string, colour: string) => {
        ctx.fillStyle = colour;
        ctx.font = '600 10px ui-monospace, SFMono-Regular, monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(label.toUpperCase(), p.x + 2, p.y + 2);
      };
      const frameBox = (p: Panel, colour: string) => {
        ctx.strokeStyle = colour;
        ctx.lineWidth = 1;
        ctx.strokeRect(p.x + 0.5, p.y + 0.5, p.w - 1, p.h - 1);
      };

      const drawWorld = (p: Panel, alpha: number, withDiscs: boolean) => {
        const m = mk(p);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#8b7bb8';
        ctx.lineWidth = 2;
        for (const s of WALLS) {
          ctx.beginPath();
          ctx.moveTo(m.sx(s.x1), m.sy(s.y1));
          ctx.lineTo(m.sx(s.x2), m.sy(s.y2));
          ctx.stroke();
        }
        ctx.fillStyle = '#3b2a6b';
        ctx.beginPath();
        ctx.arc(m.sx(PILLAR.x), m.sy(PILLAR.y), PILLAR.r * m.s, 0, TAU);
        ctx.fill();
        if (withDiscs) {
          ctx.fillStyle = 'rgba(245,179,1,0.55)';
          ctx.beginPath();
          ctx.arc(m.sx(o1.x), m.sy(o1.y), o1.r * m.s, 0, TAU);
          ctx.fill();
          ctx.fillStyle = 'rgba(120,120,140,0.75)';
          ctx.beginPath();
          ctx.arc(m.sx(o2.x), m.sy(o2.y), o2.r * m.s, 0, TAU);
          ctx.fill();
        }
        ctx.restore();
      };

      const trail = (p: Panel, pts: number[], colour: string, dash: number[]) => {
        if (pts.length < 4) return;
        const m = mk(p);
        ctx.save();
        ctx.setLineDash(dash);
        ctx.strokeStyle = colour;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(m.sx(pts[0]), m.sy(pts[1]));
        for (let i = 2; i < pts.length; i += 2) ctx.lineTo(m.sx(pts[i]), m.sy(pts[i + 1]));
        ctx.stroke();
        ctx.restore();
      };

      const robot = (p: Panel, x: number, y: number, th: number, colour: string, size: number) => {
        const m = mk(p);
        const px = m.sx(x);
        const py = m.sy(y);
        ctx.fillStyle = colour;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = colour;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + Math.cos(th) * size * 2.4, py + Math.sin(th) * size * 2.4);
        ctx.stroke();
      };

      /* ---- panel 1: ground truth ---- */
      const p0 = panel(0);
      frameBox(p0, 'rgba(110,231,168,0.35)');
      title(p0, 'ground truth world', C.green);
      drawWorld(p0, 1, true);
      trail(p0, S.truthTrail, '#6ee7a8', []);
      if (P.drift) trail(p0, S.drTrail, '#c026d3', [4, 3]);
      robot(p0, truth.x, truth.y, truth.th, '#6ee7a8', 5);
      if (P.drift) robot(p0, S.dr.x, S.dr.y, S.dr.th, '#c026d3', 4);
      ctx.font = '9px ui-monospace, monospace';
      ctx.fillStyle = P.drift ? C.magenta : C.text;
      ctx.fillText(P.drift ? 'solid green = truth · dashed pink = dead reckoning' : 'odometry drift off', p0.x + 3, p0.y + p0.h - 12);

      /* ---- panel 2: sensor view ---- */
      const p1 = panel(1);
      frameBox(p1, 'rgba(103,232,249,0.35)');
      title(p1, `sensor view · ${P.halfAngle.toFixed(0)}° half-angle`, C.cyan);
      if (P.showTruth) drawWorld(p1, 0.4, true);
      if (P.showRays) {
        const m = mk(p1);
        const half = (P.halfAngle * Math.PI) / 180;
        for (let i = 0; i < n; i++) {
          const age = S.t - S.rayTime[i];
          if (age > 1.1) continue;
          const fade = Math.max(0, 1 - age / 1.1);
          const ox = m.sx(S.rayOx[i]);
          const oy = m.sy(S.rayOy[i]);
          const a = S.rayAng[i];
          const kind = S.rayKind[i];
          const rr = S.rayRange[i];
          const ex = m.sx(S.rayOx[i] + Math.cos(a) * rr);
          const ey = m.sy(S.rayOy[i] + Math.sin(a) * rr);
          if (half > 0.08) {
            ctx.fillStyle = kind === K_NONE || kind === K_DROP ? `rgba(120,120,160,${0.05 * fade})` : `rgba(103,232,249,${0.07 * fade})`;
            ctx.beginPath();
            ctx.moveTo(ox, oy);
            ctx.arc(ox, oy, rr * m.s, a - half, a + half);
            ctx.closePath();
            ctx.fill();
          }
          let stroke = `rgba(200,200,230,${0.35 * fade})`;
          if (kind === K_WALL) stroke = `rgba(103,232,249,${0.9 * fade})`;
          else if (kind === K_PILLAR) stroke = `rgba(192,38,211,${0.9 * fade})`;
          else if (kind === K_OBST) stroke = `rgba(245,179,1,${0.9 * fade})`;
          else if (kind === K_DARK) stroke = `rgba(150,150,165,${0.8 * fade})`;
          ctx.strokeStyle = stroke;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(ox, oy);
          ctx.lineTo(ex, ey);
          ctx.stroke();
          if (kind >= K_WALL && kind <= K_DARK) {
            ctx.fillStyle = stroke;
            ctx.fillRect(ex - 1.2, ey - 1.2, 2.4, 2.4);
          }
        }
      }
      robot(p1, truth.x, truth.y, truth.th, C.cyan, 4);
      ctx.font = '9px ui-monospace, monospace';
      ctx.fillStyle = C.text;
      ctx.fillText(`return ${S.lastHits}/${S.lastShot || n} per sweep · dots = last scan points`, p1.x + 3, p1.y + p1.h - 12);

      /* ---- panel 3: occupancy grid ---- */
      const p2 = panel(2);
      frameBox(p2, 'rgba(245,179,1,0.35)');
      title(p2, `occupancy grid · ${P.res.toFixed(2)} m cells`, C.gold);
      if (S.img && offCtx) {
        const px = S.img.data;
        for (let i = 0; i < S.grid.length; i++) heat(S.grid[i], px, i * 4);
        offCtx.putImageData(S.img, 0, 0);
        const m = mk(p2);
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.globalAlpha = 0.96;
        ctx.drawImage(off, 0, 0, S.cols, S.rows, m.sx(0), m.sy(0), ROOM.w * m.s, ROOM.h * m.s);
        ctx.restore();
      }
      if (P.showTruth) {
        const m = mk(p2);
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = '#ded4f2';
        ctx.lineWidth = 1;
        for (const s of WALLS) {
          ctx.beginPath();
          ctx.moveTo(m.sx(s.x1), m.sy(s.y1));
          ctx.lineTo(m.sx(s.x2), m.sy(s.y2));
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(m.sx(PILLAR.x), m.sy(PILLAR.y), PILLAR.r * m.s, 0, TAU);
        ctx.stroke();
        ctx.restore();
      }
      robot(p2, S.dr.x, S.dr.y, S.dr.th, '#f5b301', 4);
      ctx.font = '9px ui-monospace, monospace';
      ctx.fillStyle = C.text;
      ctx.fillText(`known ${S.lastKnown.toFixed(0)}% · error ${S.lastErr.toFixed(1)}% · ${rot.toFixed(2)} Hz`, p2.x + 3, p2.y + p2.h - 12);
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <LabFrame
      labId="vision-grid"
      title="Perception Bench: What the Robot Actually Sees"
      brief="A robot drives a slow circle while a range finder spins. Left is the truth, middle is what the sensor returns (beam width, range noise, distance- and material-dependent dropout), right is the occupancy grid accumulated from the robot's own dead-reckoned pose. Kill the noise, then switch the drift back on and watch a perfectly good sensor build a perfectly wrong map."
      tasks={tasks}
      tone="sirius"
      controls={
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <LabButton key={p.name} onClick={() => applyPreset(p)} active={preset === p.name} tone="psy">
                {p.name}
              </LabButton>
            ))}
          </div>
          <Slider label="rays per revolution" value={rays} min={8} max={720} step={1} onChange={tune(setRays)} />
          <Slider label="max range" value={maxRange} min={1} max={20} step={0.5} unit=" m" onChange={tune(setMaxRange)} format={(v) => v.toFixed(1) + ' m'} />
          <Slider label="beam half-angle" value={halfAngle} min={1} max={30} step={0.5} onChange={tune(setHalfAngle)} format={(v) => v.toFixed(1) + '°'} />
          <Slider label="range noise σ" value={sigma} min={0} max={0.5} step={0.01} onChange={tune(setSigma)} format={(v) => v.toFixed(2) + ' m'} />
          <Slider label="dropout probability" value={dropout} min={0} max={0.4} step={0.01} onChange={tune(setDropout)} format={(v) => (v * 100).toFixed(0) + '%'} />
          <Slider label="grid resolution" value={res} min={0.1} max={1} step={0.05} onChange={setRes} format={(v) => v.toFixed(2) + ' m'} />
          <Slider label="occupancy threshold" value={thresh} min={0.2} max={3} step={0.1} onChange={setThresh} format={(v) => v.toFixed(1) + ' L' } />
          <div className="grid grid-cols-2 gap-1.5">
            <Toggle label="sensor noise" on={noisy} onClick={() => setNoisy((v) => !v)} />
            <Toggle label="show rays" on={showRays} onClick={() => setShowRays((v) => !v)} />
            <Toggle label="ground truth" on={showTruth} onClick={() => setShowTruth((v) => !v)} />
            <Toggle label="odometry drift" on={drift} onClick={() => setDrift((v) => !v)} />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <LabButton onClick={() => setPaused((v) => !v)} tone={paused ? 'myco' : 'gold'} active={paused}>
              {paused ? 'run' : 'pause'}
            </LabButton>
            <LabButton
              onClick={() => {
                sim.current.clear = true;
              }}
              tone="psy"
            >
              clear map
            </LabButton>
          </div>
          <div className="pt-1 font-mono text-[10px] uppercase tracking-widest text-[#67e8f9]">stereo depth error model</div>
          <Slider label="focal length f" value={focal} min={300} max={2000} step={10} onChange={setFocal} format={(v) => v.toFixed(0) + ' px'} />
          <Slider label="baseline B" value={baseline} min={0.05} max={0.6} step={0.01} onChange={setBaseline} format={(v) => v.toFixed(2) + ' m'} />
          <Slider label="disparity resolution Δd" value={disparity} min={0.05} max={1} step={0.01} onChange={setDisparity} format={(v) => v.toFixed(2) + ' px'} />
        </div>
      }
      readouts={
        <>
          <Readout label="ray count" value={rays + ' rays/rev'} tone="#67e8f9" />
          <Readout label="hits per sweep" value={`${stats.hits} / ${stats.shots || rays}`} tone="#6ee7a8" />
          <Readout label="cells known" value={stats.known.toFixed(1) + ' %'} />
          <Readout label="map error vs truth" value={stats.err.toFixed(1) + ' %'} tone={stats.err < 15 ? '#6ee7a8' : stats.err < 35 ? '#f5b301' : '#ff6b1a'} />
          <Readout label="sweep rate" value={stats.hz.toFixed(2) + ' Hz'} />
          <Readout label="grid cells" value={`${sim.current.cols}×${sim.current.rows}`} tone="#c9bde6" />
          <div className="rounded-xl border border-[#67e8f9]/25 bg-black/30 p-2">
            <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-[#67e8f9]">
              stereo depth error — z_err = z²Δd /(f·B)
            </div>
            <div className="h-[104px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={depth} margin={{ top: 4, right: 8, bottom: 10, left: 0 }}>
                  <CartesianGrid stroke="#1d3b4a" strokeDasharray="2 4" />
                  <XAxis
                    dataKey="z"
                    type="number"
                    domain={[0.5, 20]}
                    tick={{ fill: '#9fd9e8', fontSize: 8 }}
                    stroke="#2f5f70"
                    height={22}
                    label={{ value: 'range z (m)', position: 'insideBottom', offset: -4, fill: '#9fd9e8', fontSize: 8 }}
                  />
                  <YAxis
                    tick={{ fill: '#9fd9e8', fontSize: 8 }}
                    stroke="#2f5f70"
                    width={30}
                    label={{ value: 'error (m)', angle: -90, position: 'insideLeft', offset: 8, fill: '#9fd9e8', fontSize: 8 }}
                  />
                  <Tooltip contentStyle={{ background: '#04202a', border: '1px solid #2f5f70', fontSize: 11 }} />
                  <ReferenceLine x={maxRange} stroke="#c026d3" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="err" stroke="#f5b301" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-1 text-[10px] leading-snug text-[#8fb8c4]">
              At z = 5 m with f = 700 px, B = 0.12 m and Δd = 0.25 px the error is{' '}
              {(((5 * 5 * disparity) / (focal * baseline)) * 100).toFixed(1)} cm — quadratic, so doubling range
              quadruples error. Dashed line = current sensor max range.
            </div>
          </div>
          <div className="rounded-xl border border-[#6ee7a8]/25 bg-black/30 p-2">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#6ee7a8]">why sonar and LiDAR fail differently</div>
            <p className="mt-1 text-[11px] leading-snug text-[#c9bde6]">
              Ultrasound and light fail on almost disjoint sets of surfaces, because one is a pressure wave at 40 kHz and
              the other a near-IR pulse at 905 nm. <span className="text-[#f5b301]">Specular reflection</span> wrecks
              both but differently: a smooth wall struck at a grazing angle mirrors the pulse away from the receiver, so
              LiDAR loses the return exactly where the geometry is most useful, while sonar (whose wavelength is
              comparable to wall texture) scatters broadly but its 30–60° cone sees the nearest object in that whole
              wedge — the reason sonar maps show rounded corners and phantom arcs. <span className="text-[#f5b301]">
              Glass</span> is nearly a mirror to IR: many LiDARs report the frame or nothing at all and see straight
              through the pane, while sonar reflects off it strongly and then rings, so a robot can be certain about a
              window it will happily drive through. <span className="text-[#f5b301]">Black or dark matte surfaces</span>{' '}
              are the opposite failure: they absorb 905 nm almost perfectly (hence the near-zero return intensity that
              kills dark-clothing and dark-crate detections) but are acoustically ordinary, so sonar sees a black wall
              that LiDAR misses. <span className="text-[#f5b301]">Crosstalk</span> is a timing problem: several sonars
              chirping at once, or a second robot's echoes arriving late, produce confident ghost ranges, and a spinning
              LiDAR can be blinded by another scanner on the same wavelength; time-multiplexing or coded pulses are the
              cure. <span className="text-[#f5b301]">Sunlight</span> floods a 905 nm detector with broadband IR (and
              retro-reflectors glare), which is why outdoor scanners move to 1550 nm or use narrow-band filtering —
              sonar is immune to light but bends with temperature, since the speed of sound is 331.3 + 0.606·T m/s, so a
              hot floor or a stiff breeze shifts every range. Finally the budgets differ by orders of magnitude: sonar
              gives centimetres of accuracy but only a few metres of range and ~10–20 Hz because sound is slow (a 3 m
              round trip takes ~17 ms), while a 2-D LiDAR gives millimetre range noise, 10–100 m reach and 10–40 Hz —
              paid for with a narrow cone that needs thousands of points to cover a room. That is why serious platforms
              fuse both, and why this bench lets you break each one on its own terms.
            </p>
          </div>
        </>
      }
    >
      <div ref={wrapRef} className="absolute inset-0">
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-white/10 bg-black/55 px-2.5 py-1.5 font-mono text-[10px] leading-relaxed text-[#c9bde6]">
        <div>
          <span className="text-[#6ee7a8]">■</span> truth · <span className="text-[#c026d3]">■</span> dead reckoning ·{' '}
          <span className="text-[#f5b301]">■</span> occupancy estimate
        </div>
        <div>unknown = near-black · free = dark blue · occupied = pink→gold · grey = no return</div>
      </div>
    </LabFrame>
  );
}

/** exported for the lesson content so the numbers in the prose stay honest */
export const VISION_GRID_CONSTANTS = { ROOM, LOG_CLAMP, L_OCC, L_FREE, G };
