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
import { LabButton, LabFrame, Readout, Slider } from './LabFrame';

/* ==================================================================
   Locomotion bench — a sagittal-plane quadruped.

   • Each foot follows an explicit world-frame trajectory: pinned to
     the ground through stance, then a cubic-ease swing one full stride
     forward, so take-off and touch-down both happen at zero ground
     speed — which is what a real leg does to avoid impact.
   • Stance feet do NOT move in the world frame, so the table is built
     over one absolute cycle window and the whole gait repeats with a
     one-stride offset per cycle (the machine actually travels).
   • The body surges because swinging a leg forward pushes back on it:
     ẍ_body = −(m_leg/M_body)·Σ ẍ_foot,swing  (reaction argument; legs
     are otherwise massless for the IK).
   • ZMP from the linear inverted pendulum
     x_zmp = x_com − (z_com/g)·ẍ_com
     and the support polygon is the fore–aft span of the stance feet.
   The animation, the readouts and the chart all share this one model.
   ================================================================== */

const G = 9.81;
const TAU = Math.PI * 2;
const SAMPLES = 384;
/** leg mass / body mass — four legs at ~2 % each */
const M_RATIO = 0.08;
const BODY_LEN = 0.7;
const MARGIN_CLIP = 0.6;

type GaitName = 'walk' | 'trot' | 'pace' | 'bound';

interface GaitDef {
  offsets: [number, number, number, number];
  note: string;
}

/** leg order: 0 = front-right, 1 = front-left, 2 = back-left, 3 = back-right */
const GAITS: Record<GaitName, GaitDef> = {
  walk: { offsets: [0, 0.5, 0.25, 0.75], note: 'lateral sequence — three feet down most of the cycle, slow but the most forgiving' },
  trot: { offsets: [0, 0.5, 0, 0.5], note: 'diagonal pairs — the workhorse gait of quadrupeds and of most legged robots' },
  pace: { offsets: [0, 0.5, 0.5, 0], note: 'same-side pairs — sagittally it matches trot, but it rolls the body laterally' },
  bound: { offsets: [0, 0, 0.5, 0.5], note: 'front pair then back pair — fast, with genuine flight phases' },
};

const LEG_NAMES = ['FR', 'FL', 'BL', 'BR'];
const HIP_OFF: [number, number, number, number] = [0.3, 0.3, -0.3, -0.3];
/** far-side legs are drawn dimmer and thinner so the side view reads correctly */
const NEAR = [false, true, true, false];

const C = {
  bg: '#05010f',
  green: '#6ee7a8',
  gold: '#f5b301',
  magenta: '#c026d3',
  cyan: '#67e8f9',
  text: '#c9bde6',
  far: '#4338ca',
};

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

/* ---------------- ground profile and body bob ---------------- */

function groundH(x: number, rough: number): number {
  return rough * (0.05 * Math.sin(1.7 * x) + 0.03 * Math.sin(4.3 * x + 1.1) + 0.02 * Math.sin(9.1 * x + 2.2));
}
function bobAmp(stride: number): number {
  return 0.03 * stride + 0.008;
}
/** quadrupeds bob at twice the step frequency */
function bobAt(phase: number, stride: number): number {
  return bobAmp(stride) * Math.sin(2 * TAU * phase);
}

interface GaitParams {
  pattern: GaitName;
  cycle: number;
  stride: number;
  height: number;
  duty: number;
  l1: number;
  l2: number;
  rough: number;
}

/** foot on the ground at this *relative* cycle phase? */
function onGround(leg: number, phase: number, p: GaitParams): boolean {
  let local = phase - GAITS[p.pattern].offsets[leg];
  local -= Math.floor(local);
  return local < p.duty;
}

interface GaitTable {
  samples: number;
  phase0: number;
  bodyX: Float64Array;
  surge: Float64Array;
  comAcc: Float64Array;
  footX: Float64Array; // [sample*4 + leg], absolute world metres
  footY: Float64Array;
  stance: Uint8Array;
  zmp: Float64Array;
  margin: Float64Array;
  count: Uint8Array;
  minStance: number;
  minMargin: number;
  meanMargin: number;
  reachFaults: number;
}

/**
 * Tabulate one full cycle starting at absolute cycle index `phase0`.
 * Absolute phases matter: the body really travels one stride per cycle,
 * so the terrain each foot lands on is different every step.
 */
function buildTable(p: GaitParams, phase0 = 0, samples = SAMPLES): GaitTable {
  const dt = p.cycle / samples;
  const v = p.stride / p.cycle;
  const offs = GAITS[p.pattern].offsets;
  const tSw = Math.max(0.02, (1 - p.duty) * p.cycle);

  const bodyX = new Float64Array(samples);
  const surge = new Float64Array(samples);
  const comAcc = new Float64Array(samples);
  const footX = new Float64Array(samples * 4);
  const footY = new Float64Array(samples * 4);
  const stance = new Uint8Array(samples * 4);
  const zmp = new Float64Array(samples);
  const margin = new Float64Array(samples);
  const count = new Uint8Array(samples);

  /** world-frame foot position at absolute cycle phase gph */
  const footAt = (leg: number, gph: number) => {
    const o = offs[leg];
    let local = gph - o;
    const n = Math.floor(local);
    local -= n;
    const s = p.stride * p.duty; // backward travel relative to the body
    const xTd = p.stride * (n + o) + HIP_OFF[leg] + s / 2;
    if (local < p.duty) return { x: xTd, y: groundH(xTd, p.rough), up: true, u: 0 };
    const u = (local - p.duty) / Math.max(1e-6, 1 - p.duty);
    const e = u * u * (3 - 2 * u);
    const x1 = xTd + p.stride;
    const lift = 0.22 * p.stride + 0.05;
    return {
      x: xTd + p.stride * e,
      y: (1 - e) * groundH(xTd, p.rough) + e * groundH(x1, p.rough) + lift * Math.sin(Math.PI * u),
      up: false,
      u,
    };
  };

  /* pass 1 — foot trajectories and the swing reaction on the body */
  const force = new Float64Array(samples);
  for (let k = 0; k < samples; k++) {
    const gph = phase0 + k / samples;
    let aSum = 0;
    for (let leg = 0; leg < 4; leg++) {
      const fo = footAt(leg, gph);
      const i = k * 4 + leg;
      footX[i] = fo.x;
      footY[i] = fo.y;
      stance[i] = fo.up ? 1 : 0;
      if (!fo.up) {
        // d²/dt² of  stride·(3u² − 2u³)  =  stride·(6 − 12u)/t_sw²
        aSum += (p.stride * (6 - 12 * fo.u)) / (tSw * tSw);
      }
    }
    force[k] = -M_RATIO * aSum;
  }

  /* mean removal + double integration → a periodic, zero-mean surge */
  let mf = 0;
  for (let k = 0; k < samples; k++) mf += force[k];
  mf /= samples;
  for (let k = 0; k < samples; k++) force[k] -= mf;

  const vel = new Float64Array(samples);
  let vv = 0;
  for (let k = 0; k < samples; k++) {
    vv += force[k] * dt;
    vel[k] = vv;
  }
  let mv = 0;
  for (let k = 0; k < samples; k++) mv += vel[k];
  mv /= samples;
  let xx = 0;
  for (let k = 0; k < samples; k++) {
    xx += (vel[k] - mv) * dt;
    surge[k] = xx;
  }
  let mx = 0;
  for (let k = 0; k < samples; k++) mx += surge[k];
  mx /= samples;
  for (let k = 0; k < samples; k++) {
    surge[k] -= mx;
    bodyX[k] = p.stride * (phase0 + k / samples) + surge[k];
    comAcc[k] = force[k];
  }

  /* pass 2 — ZMP, support polygon, margin, reach faults */
  let minStance = 4;
  let minMargin = Infinity;
  let sumMargin = 0;
  let reachFaults = 0;
  const reach = p.l1 + p.l2;
  for (let k = 0; k < samples; k++) {
    const ph = k / samples;
    const zc = p.height + bobAt(ph, p.stride);
    zmp[k] = bodyX[k] - (zc / G) * comAcc[k];
    let lo = Infinity;
    let hi = -Infinity;
    let n = 0;
    for (let leg = 0; leg < 4; leg++) {
      if (!stance[k * 4 + leg]) continue;
      const fx = footX[k * 4 + leg];
      if (fx < lo) lo = fx;
      if (fx > hi) hi = fx;
      n++;
    }
    count[k] = n;
    margin[k] = n === 0 ? -MARGIN_CLIP : Math.min(zmp[k] - lo, hi - zmp[k]);
    if (n < minStance) minStance = n;
    if (margin[k] < minMargin) minMargin = margin[k];
    sumMargin += margin[k];

    const hy = groundH(bodyX[k], p.rough) + zc;
    for (let leg = 0; leg < 4; leg++) {
      const dx = footX[k * 4 + leg] - (bodyX[k] + HIP_OFF[leg]);
      const dy = footY[k * 4 + leg] - hy;
      if (Math.hypot(dx, dy) > reach) reachFaults++;
    }
  }

  return {
    samples,
    phase0,
    bodyX,
    surge,
    comAcc,
    footX,
    footY,
    stance,
    zmp,
    margin,
    count,
    minStance,
    minMargin: Number.isFinite(minMargin) ? minMargin : -MARGIN_CLIP,
    meanMargin: sumMargin / samples,
    reachFaults,
  };
}

/* linear interpolation inside one tabulated cycle (the window is not periodic:
   the machine has moved a full stride by the end of it) */
function lerpCell(arr: Float64Array, leg: number, n: number, phase: number): number {
  const f = clamp(phase, 0, 1) * (n - 1);
  const i0 = Math.floor(f);
  const i1 = Math.min(i0 + 1, n - 1);
  const w = f - i0;
  return arr[i0 * 4 + leg] * (1 - w) + arr[i1 * 4 + leg] * w;
}
function lerpAt(arr: Float64Array, n: number, phase: number): number {
  const f = clamp(phase, 0, 1) * (n - 1);
  const i0 = Math.floor(f);
  const i1 = Math.min(i0 + 1, n - 1);
  const w = f - i0;
  return arr[i0] * (1 - w) + arr[i1] * w;
}

interface Ik {
  kx: number;
  ky: number;
  reached: boolean;
}

/** 2-link inverse kinematics for one leg (planar, side view) */
function ik(hx: number, hy: number, fx: number, fy: number, l1: number, l2: number, kneeForward: boolean): Ik {
  const dx = fx - hx;
  const dy = fy - hy;
  const d = Math.hypot(dx, dy);
  const dMin = Math.abs(l1 - l2) + 1e-3;
  const dMax = Math.max(dMin + 1e-3, l1 + l2 - 1e-3);
  const dc = clamp(d, dMin, dMax);
  const phi = Math.atan2(dy, dx);
  const alpha = Math.acos(clamp((dc * dc + l1 * l1 - l2 * l2) / (2 * dc * l1), -1, 1));
  const th1 = kneeForward ? phi + alpha : phi - alpha;
  return {
    kx: hx + l1 * Math.cos(th1),
    ky: hy + l1 * Math.sin(th1),
    reached: d <= dMax + 1e-3 && d >= dMin - 1e-3,
  };
}

export default function GaitLab({ tasks }: LabProps) {
  const [pattern, setPattern] = useState<GaitName>('trot');
  const [cycle, setCycle] = useState(0.6);
  const [stride, setStride] = useState(0.5);
  const [height, setHeight] = useState(0.55);
  const [duty, setDuty] = useState(0.55);
  const [l1, setL1] = useState(0.34);
  const [l2, setL2] = useState(0.36);
  const [rough, setRough] = useState(0.15);
  const [running, setRunning] = useState(true);
  const [live, setLive] = useState({ margin: 0, stance: 0, phase: 0 });

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const phaseRef = useRef(0);
  const lapsRef = useRef(0);
  const viewRef = useRef({ w: 0, h: 0 });
  const liveClock = useRef(0);

  const params: GaitParams = useMemo(
    () => ({ pattern, cycle, stride, height, duty, l1, l2, rough }),
    [pattern, cycle, stride, height, duty, l1, l2, rough],
  );
  /** reference cycle (phase0 = 0) — used for the readouts and the duty sweep */
  const table = useMemo(() => buildTable(params, 0, SAMPLES), [params]);
  const tableRef = useRef(table);
  tableRef.current = table;
  const paramsRef = useRef(params);
  paramsRef.current = params;
  const runningRef = useRef(running);
  runningRef.current = running;
  /** absolute-cycle table the animation is currently rendering */
  const animRef = useRef<{ src: GaitTable | null; laps: number; abs: GaitTable | null }>({
    src: null,
    laps: -1,
    abs: null,
  });

  const speed = stride / cycle;
  const freq = 1 / cycle;
  const legLen = l1 + l2;
  const froude = speed / Math.sqrt(G * legLen);
  const faultPct = (table.reachFaults / (table.samples * 4)) * 100;

  /* stability margin vs duty factor, from the same model */
  const dutyCurve = useMemo(() => {
    const out: { duty: number; margin: number }[] = [];
    for (let i = 0; i <= 12; i++) {
      const d = 0.3 + (0.6 * i) / 12;
      const t = buildTable({ ...params, duty: d }, 0, 192);
      out.push({ duty: Math.round(d * 100) / 100, margin: Math.round(clamp(t.minMargin, -MARGIN_CLIP, MARGIN_CLIP) * 1000) / 1000 });
    }
    return out;
  }, [params]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
      viewRef.current = { w, h };
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const P = paramsRef.current;
      const { w, h } = viewRef.current;
      if (w < 8 || h < 8) return; // never draw into a zero-sized canvas

      if (runningRef.current) {
        phaseRef.current += dt / P.cycle;
        while (phaseRef.current >= 1) {
          phaseRef.current -= 1;
          lapsRef.current += 1;
        }
      }
      const phase = clamp(phaseRef.current, 0, 0.9999);

      /* rebuild the absolute-cycle table when the parameters or the cycle change */
      const A = animRef.current;
      if (!A.abs || A.src !== tableRef.current || A.laps !== lapsRef.current) {
        A.abs = buildTable(P, lapsRef.current, SAMPLES);
        A.src = tableRef.current;
        A.laps = lapsRef.current;
      }
      const T = A.abs;
      const n = T.samples;

      const bodyX = lerpAt(T.bodyX, n, phase);
      const zmp = lerpAt(T.zmp, n, phase);
      const margin = lerpAt(T.margin, n, phase);
      const hipY = groundH(bodyX, P.rough) + P.height + bobAt(phase, P.stride);

      /* -------- readouts, throttled to ~7 Hz -------- */
      liveClock.current += dt;
      if (liveClock.current > 0.15) {
        liveClock.current = 0;
        let sc = 0;
        for (let leg = 0; leg < 4; leg++) if (onGround(leg, phase, P)) sc++;
        setLive({
          margin: Math.round(margin * 1000) / 1000,
          stance: sc,
          phase: Math.round(phase * 1000) / 1000,
        });
      }

      /* ================= draw ================= */
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, w, h);

      const mainH = h * 0.72;
      const gy = mainH * 0.84; // screen y of world y = 0
      const scale = clamp(Math.min(w / 5.0, mainH / 2.4), 24, 260);
      const cx = w * 0.5;
      const SX = (wx: number) => cx + (wx - bodyX) * scale;
      const SY = (wy: number) => gy - wy * scale;

      /* terrain */
      ctx.strokeStyle = P.rough > 0.02 ? '#c026d3' : '#4338ca';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let sx = -4; sx <= w + 4; sx += 3) {
        const wx = bodyX + (sx - cx) / scale;
        const yy = SY(groundH(wx, P.rough));
        if (sx === -4) ctx.moveTo(sx, yy);
        else ctx.lineTo(sx, yy);
      }
      ctx.stroke();
      ctx.fillStyle = 'rgba(67,56,202,0.12)';
      ctx.fillRect(0, gy, w, h - gy);

      /* support polygon = fore–aft span of the feet currently in stance */
      let lo = Infinity;
      let hi = -Infinity;
      let nStance = 0;
      for (let leg = 0; leg < 4; leg++) {
        if (!onGround(leg, phase, P)) continue;
        const fx = lerpCell(T.footX, leg, n, phase);
        if (fx < lo) lo = fx;
        if (fx > hi) hi = fx;
        nStance++;
      }
      if (nStance > 0) {
        const tipping = margin < 0;
        ctx.fillStyle = tipping ? 'rgba(255,60,60,0.35)' : 'rgba(110,231,168,0.28)';
        const bw = Math.max(3, (hi - lo) * scale);
        ctx.fillRect(SX(lo), gy - 5, bw, 8);
        ctx.strokeStyle = tipping ? '#ff3c3c' : C.green;
        ctx.lineWidth = 1;
        ctx.strokeRect(SX(lo), gy - 5, bw, 8);
      }

      /* legs — 2-link IK driven by the tabulated foot trajectory */
      const drawLeg = (leg: number) => {
        const fx = lerpCell(T.footX, leg, n, phase);
        const fy = lerpCell(T.footY, leg, n, phase);
        const hx = bodyX + HIP_OFF[leg];
        const near = NEAR[leg];
        const j = ik(hx, hipY, fx, fy, P.l1, P.l2, leg < 2);
        const px = SX(hx);
        const py = SY(hipY);
        const kx = SX(j.kx);
        const ky = SY(j.ky);
        const ex = SX(fx);
        const ey = SY(fy);
        const colour = !j.reached ? '#ff3c3c' : near ? C.green : C.far;
        ctx.lineCap = 'round';
        ctx.strokeStyle = colour;
        ctx.lineWidth = near ? 7 : 5;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(kx, ky);
        ctx.stroke();
        ctx.lineWidth = near ? 5 : 3.5;
        ctx.beginPath();
        ctx.moveTo(kx, ky);
        ctx.lineTo(ex, ey);
        ctx.stroke();
        ctx.fillStyle = near ? '#ded4f2' : '#7c6bb0';
        ctx.beginPath();
        ctx.arc(kx, ky, near ? 3.6 : 2.6, 0, TAU);
        ctx.fill();
        ctx.fillStyle = '#1b1440';
        ctx.beginPath();
        ctx.arc(px, py, near ? 4 : 3, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = colour;
        ctx.lineWidth = 1.4;
        ctx.stroke();
        const up = onGround(leg, phase, P);
        ctx.beginPath();
        ctx.arc(ex, ey, near ? 5 : 4, 0, TAU);
        if (up) {
          ctx.fillStyle = C.gold;
          ctx.fill();
        } else {
          ctx.strokeStyle = C.cyan;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.fillStyle = near ? '#ded4f2' : '#8f83b8';
        ctx.font = '9px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(LEG_NAMES[leg], ex, ey + (near ? -9 : -7));
      };
      const farLegs = [0, 3];
      const nearLegs = [1, 2];
      for (const leg of farLegs) drawLeg(leg);

      /* body */
      const bx0 = SX(bodyX - BODY_LEN / 2);
      const by0 = SY(hipY + 0.16);
      const bw2 = BODY_LEN * scale;
      const bh = 0.16 * scale;
      ctx.fillStyle = '#1b1440';
      ctx.strokeStyle = '#7c3aed';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(bx0, by0, bw2, bh, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = C.gold;
      ctx.beginPath();
      ctx.arc(SX(bodyX), SY(hipY + 0.08), 4.5, 0, TAU);
      ctx.fill();
      ctx.font = '9px ui-monospace, monospace';
      ctx.fillStyle = C.gold;
      ctx.textAlign = 'center';
      ctx.fillText('CoM', SX(bodyX), by0 - 4);

      for (const leg of nearLegs) drawLeg(leg);

      /* ZMP and its inverted-pendulum line to the CoM */
      const zx = SX(zmp);
      const zy = SY(groundH(zmp, P.rough));
      const tipping = margin < 0;
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = tipping ? '#ff3c3c' : 'rgba(245,179,1,0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(SX(bodyX), SY(hipY + 0.08));
      ctx.lineTo(zx, zy);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = tipping ? '#ff3c3c' : C.magenta;
      ctx.beginPath();
      ctx.arc(zx, zy, 5, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.font = '9px ui-monospace, monospace';
      ctx.fillStyle = tipping ? '#ff3c3c' : C.magenta;
      ctx.textAlign = 'left';
      ctx.fillText(tipping ? 'ZMP outside support — tipping' : 'ZMP', zx + 8, zy - 8);

      /* HUD */
      ctx.textAlign = 'left';
      ctx.font = '600 10px ui-monospace, monospace';
      ctx.fillStyle = C.gold;
      ctx.fillText(
        `${P.pattern.toUpperCase()} · T ${P.cycle.toFixed(2)} s · duty ${P.duty.toFixed(2)} · v ${(P.stride / P.cycle).toFixed(2)} m/s · Fr ${(
          P.stride / P.cycle / Math.sqrt(G * (P.l1 + P.l2))
        ).toFixed(2)}`,
        8,
        12,
      );
      ctx.fillStyle = C.text;
      ctx.font = '9px ui-monospace, monospace';
      ctx.fillText(
        `${nStance} feet in stance · φ ${(phase * 360).toFixed(0)}° · step ${lapsRef.current} · ${runningRef.current ? 'running' : 'paused'}`,
        8,
        25,
      );

      /* ---------------- gait phase strip ---------------- */
      const stripY = h * 0.76;
      const stripH = Math.max(24, h - stripY - 6);
      const barX = 34;
      const barW = Math.max(20, w - barX - 10);
      const rowH = stripH / 4;
      const offs = GAITS[P.pattern].offsets;
      ctx.font = '9px ui-monospace, monospace';
      for (let leg = 0; leg < 4; leg++) {
        const ry = stripY + leg * rowH;
        ctx.fillStyle = NEAR[leg] ? '#ded4f2' : '#8f83b8';
        ctx.textAlign = 'left';
        ctx.fillText(LEG_NAMES[leg], 6, ry + rowH * 0.72);
        const cells = 120;
        for (let j = 0; j < cells; j++) {
          const ph = j / cells;
          let local = ph - offs[leg];
          local -= Math.floor(local);
          const up = local < P.duty;
          const x0 = barX + (j / cells) * barW;
          const x1 = barX + ((j + 1) / cells) * barW;
          if (up) {
            ctx.fillStyle = NEAR[leg] ? 'rgba(245,179,1,0.95)' : 'rgba(245,179,1,0.5)';
            ctx.fillRect(x0, ry + rowH * 0.3, Math.max(1, x1 - x0), rowH * 0.42);
          } else {
            ctx.fillStyle = 'rgba(103,232,249,0.08)';
            ctx.fillRect(x0, ry + rowH * 0.3, Math.max(1, x1 - x0), rowH * 0.42);
            ctx.strokeStyle = NEAR[leg] ? 'rgba(103,232,249,0.9)' : 'rgba(103,232,249,0.45)';
            ctx.lineWidth = 1;
            ctx.strokeRect(x0 + 0.5, ry + rowH * 0.3 + 0.5, Math.max(1, x1 - x0) - 1, rowH * 0.42 - 1);
          }
        }
      }
      ctx.strokeStyle = 'rgba(192,38,211,0.9)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(barX + phase * barW, stripY);
      ctx.lineTo(barX + phase * barW, stripY + stripH);
      ctx.stroke();
      ctx.fillStyle = C.text;
      ctx.textAlign = 'left';
      ctx.fillText('stance = solid · swing = hollow · one full bar = one cycle', barX, stripY - 4);
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const marginText = (m: number) => (m < -MARGIN_CLIP ? `< −${MARGIN_CLIP.toFixed(3)} m` : `${m >= 0 ? '+' : ''}${m.toFixed(3)} m`);

  return (
    <LabFrame
      labId="gait"
      title="Locomotion Bench: Gait, Duty Factor and Stability"
      brief="A four-legged machine walks a procedurally rough floor. Every foot follows a real stance/swing trajectory and both joints are solved by 2-link inverse kinematics from that foot position — nothing is faked. The body surges because swinging a leg forward pushes back on it, and the ZMP readout says whether the feet currently on the ground can support that motion. Change the gait, shorten the duty factor, then lengthen the stride and watch the support polygon lose the argument."
      tasks={tasks}
      tone="myco"
      controls={
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(GAITS) as GaitName[]).map((g) => (
              <LabButton key={g} onClick={() => setPattern(g)} active={pattern === g} tone={g === 'trot' ? 'myco' : 'psy'}>
                {g}
              </LabButton>
            ))}
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[11px] leading-snug text-[#c9bde6]">
            {GAITS[pattern].note}
            <div className="mt-0.5 font-mono text-[10px] text-[#8f83b8]">
              offsets FR/FL/BL/BR = {GAITS[pattern].offsets.join(' / ')}
            </div>
          </div>
          <Slider label="cycle time" value={cycle} min={0.2} max={2} step={0.02} onChange={setCycle} format={(v) => v.toFixed(2) + ' s'} />
          <Slider label="stride length" value={stride} min={0.1} max={1.2} step={0.02} onChange={setStride} format={(v) => v.toFixed(2) + ' m'} />
          <Slider label="body height" value={height} min={0.3} max={1} step={0.01} onChange={setHeight} format={(v) => v.toFixed(2) + ' m'} />
          <Slider label="duty factor β" value={duty} min={0.3} max={0.9} step={0.01} onChange={setDuty} format={(v) => v.toFixed(2)} />
          <Slider label="thigh l₁" value={l1} min={0.2} max={0.7} step={0.01} onChange={setL1} format={(v) => v.toFixed(2) + ' m'} />
          <Slider label="shank l₂" value={l2} min={0.2} max={0.7} step={0.01} onChange={setL2} format={(v) => v.toFixed(2) + ' m'} />
          <Slider label="terrain roughness" value={rough} min={0} max={1} step={0.01} onChange={setRough} format={(v) => v.toFixed(2)} />
          <div className="grid grid-cols-2 gap-1.5">
            <LabButton onClick={() => setRunning((v) => !v)} tone={running ? 'gold' : 'myco'} active={!running}>
              {running ? 'pause' : 'run'}
            </LabButton>
            <LabButton
              onClick={() => {
                phaseRef.current = 0;
                lapsRef.current = 0;
              }}
              tone="psy"
            >
              reset phase
            </LabButton>
          </div>
        </div>
      }
      readouts={
        <>
          <Readout label="forward speed (stride/cycle)" value={speed.toFixed(3) + ' m/s'} tone="#67e8f9" />
          <Readout label="step frequency" value={freq.toFixed(2) + ' Hz'} />
          <Readout
            label="feet in stance (critical)"
            value={`${table.minStance} of 4`}
            tone={table.minStance >= 2 ? '#6ee7a8' : '#ff6b1a'}
          />
          <Readout
            label="stability margin (now)"
            value={marginText(live.margin)}
            tone={live.margin > 0.05 ? '#6ee7a8' : live.margin > 0 ? '#f5b301' : '#ff3c3c'}
          />
          <Readout
            label="worst margin in cycle"
            value={table.minStance === 0 ? 'flight phase' : marginText(table.minMargin)}
            tone={table.minMargin > 0 ? '#6ee7a8' : '#ff3c3c'}
          />
          <Readout label="Froude number v/√(g·L)" value={froude.toFixed(3)} tone={froude < 0.5 ? '#6ee7a8' : '#ff6b1a'} />
          <Readout label="leg reach faults" value={faultPct.toFixed(1) + ' %'} tone={faultPct < 0.5 ? '#6ee7a8' : '#ff3c3c'} />
          {faultPct >= 0.5 && (
            <div className="rounded-lg border border-[#ff3c3c]/40 bg-[#ff3c3c]/10 px-2.5 py-1.5 text-[11px] leading-snug text-[#ffd7d7]">
              A leg cannot reach its foot: the hip sits {(height + bobAmp(stride)).toFixed(2)} m up and the foot swings
              ±{((stride * duty) / 2).toFixed(2)} m fore–aft, which needs more than l₁+l₂ = {legLen.toFixed(2)} m.
              Lengthen the links, lower the body or shorten the stride.
            </div>
          )}
          <div className="rounded-xl border border-[#6ee7a8]/25 bg-black/30 p-2">
            <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-[#6ee7a8]">
              stability margin vs duty factor ({pattern})
            </div>
            <div className="h-[106px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dutyCurve} margin={{ top: 4, right: 8, bottom: 10, left: 0 }}>
                  <CartesianGrid stroke="#1f4d3a" strokeDasharray="2 4" />
                  <XAxis
                    dataKey="duty"
                    type="number"
                    domain={[0.3, 0.9]}
                    tick={{ fill: '#9fd9bb', fontSize: 8 }}
                    stroke="#2f6b52"
                    height={22}
                    label={{ value: 'duty factor β', position: 'insideBottom', offset: -4, fill: '#9fd9bb', fontSize: 8 }}
                  />
                  <YAxis
                    domain={[-0.65, 0.65]}
                    ticks={[-0.6, -0.3, 0, 0.3, 0.6]}
                    tick={{ fill: '#9fd9bb', fontSize: 8 }}
                    stroke="#2f6b52"
                    width={30}
                    label={{ value: 'margin (m)', angle: -90, position: 'insideLeft', offset: 8, fill: '#9fd9bb', fontSize: 8 }}
                  />
                  <Tooltip contentStyle={{ background: '#08201a', border: '1px solid #2f6b52', fontSize: 11 }} />
                  <ReferenceLine y={0} stroke="#ff3c3c" strokeDasharray="3 3" />
                  <ReferenceLine x={duty} stroke="#f5b301" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="margin" stroke="#6ee7a8" strokeWidth={2} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-1 text-[10px] leading-snug text-[#8fbfa6]">
              Worst margin over a full cycle, clipped at ±0.6 m; the floor at −0.6 is a flight phase with no feet down
              at all. Dashed yellow = your current duty factor.
            </div>
          </div>
          <div className="rounded-xl border border-[#6ee7a8]/25 bg-black/30 p-2">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#6ee7a8]">
              duty factor: the speed / stability / energy trade
            </div>
            <p className="mt-1 text-[11px] leading-snug text-[#c9bde6]">
              Duty factor β is the fraction of the cycle a foot spends on the ground, and it sets almost everything
              else. Raise β and more feet share the load, so the support polygon is longer and the ZMP has room to move:
              static stability is easy and a walking machine can even stop mid-stride. But the swing time is only
              (1 − β)·T, so the same stride has to be covered in less time, foot acceleration grows roughly as
              stride/((1 − β)T)², and the swinging legs react back on the body — so the ZMP swings hardest exactly when
              the polygon you shortened has least room. Push β toward 0.9 and the numbers here explode because no real
              limb can recirculate in 60 ms; the honest reading is not that the model is broken but that fast
              high-duty walking is a torque problem, which is why walkers are slow and their stride is short. Lower β
              buys speed: below about 0.5 per pair the machine is running, with ballistic flight phases where nothing
              is in contact and control is briefly open-loop, which is how cheetahs and bounding robots reach several
              body lengths per second — and why they cannot stop on a coin. The second half of the trade is energy. A
              stance leg is a nearly isometric strut and cheap to hold; a swing leg is pure inertial cost that grows
              with the square of swing speed, so a fast, low-duty gait burns energy accelerating limbs instead of moving
              the body. Trot is the practical middle for robots because the diagonal pair gives a long fore–aft support
              line with only one symmetry to control, while walk is the efficient, stable, slow corner. Note what this
              sagittal model cannot see: pace scores identically to trot here because its problem is lateral roll, and
              bound scores badly at every duty because a fore–aft criterion punishes a gait whose front and back pairs
              touch down together — a bounder stays up by managing pitch angular momentum, which needs a dynamic model
              and a body with real rotational inertia, not a point-mass ZMP. Treat the number below as the honest
              quasi-static answer, and the paragraph above as the reason real gait libraries are tuned on hardware.
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
          <span className="text-[#f5b301]">●</span> stance foot · <span className="text-[#67e8f9]">○</span> swing foot ·{' '}
          <span className="text-[#c026d3]">●</span> ZMP · dashed line = CoM above it
        </div>
        <div>green band = support polygon (red when the ZMP has left it) · far-side legs drawn dimmer</div>
      </div>
    </LabFrame>
  );
}

export { buildTable, groundH, ik, GAITS, bobAt, bobAmp };
export type { GaitParams, GaitTable, GaitName };
