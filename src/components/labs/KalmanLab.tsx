import { Canvas, useFrame } from '@react-three/fiber';
import { Line, OrbitControls } from '@react-three/drei';
import { useCallback, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { LineChart, Line as RLine, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import type { LabProps } from './LabFrame';
import { LabButton, LabFrame, Readout, Slider, Toggle } from './LabFrame';

/* ==================================================================
   Sensor fusion bench: a 4-state (x, y, vx, vy) constant-velocity
   Kalman filter fusing GNSS-like position fixes with IMU-like
   acceleration into a dead-reckoning baseline that drifts.
   ================================================================== */

type Mat = number[][];

const mul = (A: Mat, B: Mat): Mat => {
  const n = A.length;
  const m = B[0].length;
  const k = B.length;
  const C: Mat = Array.from({ length: n }, () => new Array(m).fill(0));
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) for (let p = 0; p < k; p++) C[i][j] += A[i][p] * B[p][j];
  return C;
};
const T = (A: Mat): Mat => A[0].map((_, j) => A.map((r) => r[j]));
const add = (A: Mat, B: Mat): Mat => A.map((r, i) => r.map((v, j) => v + B[i][j]));
const sub = (A: Mat, B: Mat): Mat => A.map((r, i) => r.map((v, j) => v - B[i][j]));
const eye = (n: number): Mat => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
const inv2 = (M: Mat): Mat => {
  const det = M[0][0] * M[1][1] - M[0][1] * M[1][0];
  const d = Math.abs(det) < 1e-12 ? 1e-12 : det;
  return [
    [M[1][1] / d, -M[0][1] / d],
    [-M[1][0] / d, M[0][0] / d],
  ];
};

let gaussSeed = 12345;
function gauss(): number {
  gaussSeed = (gaussSeed * 1664525 + 1013904223) % 4294967296;
  const u = gaussSeed / 4294967296;
  gaussSeed = (gaussSeed * 1664525 + 1013904223) % 4294967296;
  const v = gaussSeed / 4294967296;
  return Math.sqrt(-2 * Math.log(Math.max(u, 1e-9))) * Math.cos(2 * Math.PI * v);
}

/** Analytic ground truth: a lemniscate the "robot" drives at constant speed. */
function truth(t: number): { p: THREE.Vector3; a: THREE.Vector3 } {
  const s = t * 0.55;
  const A = 4.2;
  const x = A * Math.sin(s);
  const z = A * Math.sin(s) * Math.cos(s) * 1.6;
  const h = 1.4 + Math.sin(s * 2) * 0.25;
  const dt = 1e-3;
  const p = new THREE.Vector3(x, h, z);
  const s2 = (t + dt) * 0.55;
  const p2 = new THREE.Vector3(A * Math.sin(s2), 1.4 + Math.sin(s2 * 2) * 0.25, A * Math.sin(s2) * Math.cos(s2) * 1.6);
  const v = p2.clone().sub(p).divideScalar(dt);
  const s3 = (t + 2 * dt) * 0.55;
  const p3 = new THREE.Vector3(A * Math.sin(s3), 1.4 + Math.sin(s3 * 2) * 0.25, A * Math.sin(s3) * Math.cos(s3) * 1.6);
  const v2 = p3.clone().sub(p2).divideScalar(dt);
  const a = v2.clone().sub(v).divideScalar(dt);
  return { p, a };
}

interface Sample {
  t: number;
  measErr: number;
  drErr: number;
  kfErr: number;
}

function Sim({
  params,
  onSample,
  paths,
  outage,
}: {
  params: { sigma: number; q: number; bias: number; rate: number };
  onSample: (s: Sample) => void;
  paths: { meas: THREE.Vector3[]; dr: THREE.Vector3[]; kf: THREE.Vector3[]; real: THREE.Vector3[] };
  outage: boolean;
}) {
  const state = useRef({
    t: 0,
    sinceFix: 0,
    x: [0, 0, 0, 0] as number[],
    P: eye(4).map((r) => r.map((v) => v * 4)),
    dr: new THREE.Vector3(),
    drV: new THREE.Vector3(),
    biasX: 0,
    biasZ: 0,
    errMeas: 0,
    errDr: 0,
    errKf: 0,
    n: 0,
    started: false,
    acc: 0,
  });
  const lastPush = useRef(0);
  const lastSample = useRef(0);

  useFrame((_, delta) => {
    const s = state.current;
    const steps = 4;
    const dt = Math.min(0.033, delta) / steps;
    for (let k = 0; k < steps; k++) {
      s.t += dt;
      const { p, a } = truth(s.t);
      if (!s.started) {
        s.x = [p.x, p.z, 0, 0];
        s.dr.copy(p);
        s.drV.set(0, 0, 0);
        s.started = true;
      }
      // ---- IMU-like measurement (biased, noisy acceleration) ----
      const axM = a.x + s.biasX + gauss() * 0.35;
      const azM = a.z + s.biasZ + gauss() * 0.35;
      s.drV.x += axM * dt;
      s.drV.z += azM * dt;
      s.dr.x += s.drV.x * dt;
      s.dr.z += s.drV.z * dt;

      // ---- Kalman predict (constant velocity) ----
      const F: Mat = [
        [1, 0, dt, 0],
        [0, 1, 0, dt],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ];
      const Qv = params.q * dt;
      const Q: Mat = [
        [Qv * dt * 0.5, 0, 0, 0],
        [0, Qv * dt * 0.5, 0, 0],
        [0, 0, Qv, 0],
        [0, 0, 0, Qv],
      ];
      const xc: Mat = [[s.x[0]], [s.x[1]], [s.x[2]], [s.x[3]]];
      const xn = mul(F, xc);
      s.x = [xn[0][0], xn[1][0], xn[2][0], xn[3][0]];
      s.P = add(mul(mul(F, s.P), T(F)), Q);

      // ---- GNSS-like fix at the configured rate ----
      s.sinceFix += dt;
      const period = 1 / params.rate;
      if (!outage && s.sinceFix >= period) {
        s.sinceFix = 0;
        const z = [[p.x + gauss() * params.sigma], [p.z + gauss() * params.sigma]];
        const H: Mat = [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
        ];
        const Hx = mul(H, [[s.x[0]], [s.x[1]], [s.x[2]], [s.x[3]]]);
        const y = sub(z, Hx);
        const S = add(mul(mul(H, s.P), T(H)), [
          [params.sigma * params.sigma, 0],
          [0, params.sigma * params.sigma],
        ]);
        const K = mul(mul(s.P, T(H)), inv2(S));
        const Ky = mul(K, y);
        s.x = [s.x[0] + Ky[0][0], s.x[1] + Ky[1][0], s.x[2] + Ky[2][0], s.x[3] + Ky[3][0]];
        s.P = mul(sub(eye(4), mul(K, H)), s.P);
      }

      // ---- error metrics ----
      const drP = new THREE.Vector3(s.dr.x, p.y, s.dr.z);
      const kfP = new THREE.Vector3(s.x[0], p.y, s.x[1]);
      const measP = new THREE.Vector3(p.x + gauss() * params.sigma, p.y, p.z + gauss() * params.sigma);
      s.errMeas += measP.distanceTo(p);
      s.errDr += drP.distanceTo(p);
      s.errKf += kfP.distanceTo(p);
      s.n++;

      // ---- trail bookkeeping (throttled) ----
      s.acc += dt;
      if (s.acc > 0.08) {
        s.acc = 0;
        paths.real.push(p.clone());
        paths.meas.push(measP);
        paths.dr.push(drP);
        paths.kf.push(kfP);
        if (paths.real.length > 420) {
          paths.real.shift();
          paths.meas.shift();
          paths.dr.shift();
          paths.kf.shift();
        }
      }
      if (s.n % 24 === 0) {
        onSample({
          t: Math.round(s.t * 10) / 10,
          measErr: Math.round((s.errMeas / s.n) * 1000) / 1000,
          drErr: Math.round((s.errDr / s.n) * 1000) / 1000,
          kfErr: Math.round((s.errKf / s.n) * 1000) / 1000,
        });
      }
    }
    lastPush.current++;
  });

  const [, force] = useState(0);
  useFrame(() => {
    if (lastPush.current % 2 === 0) force((v) => (v + 1) % 1000);
  });

  return null;
}

export default function KalmanLab({ tasks }: LabProps) {
  const [sigma, setSigma] = useState(0.65);
  const [q, setQ] = useState(1.1);
  const [bias, setBias] = useState(0.28);
  const [rate, setRate] = useState(5);
  const [outage, setOutage] = useState(false);
  const [showMeas, setShowMeas] = useState(true);
  const [showDr, setShowDr] = useState(true);
  const [chart, setChart] = useState<Sample[]>([]);
  const [version, setVersion] = useState(0);

  const paths = useMemo(
    () => ({ real: [] as THREE.Vector3[], meas: [] as THREE.Vector3[], dr: [] as THREE.Vector3[], kf: [] as THREE.Vector3[] }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [version],
  );

  const onSample = useCallback((s: Sample) => {
    setChart((c) => [...c, s].slice(-120));
  }, []);

  const restart = () => {
    setChart([]);
    setVersion((v) => v + 1);
  };

  const latest = chart[chart.length - 1];

  return (
    <LabFrame
      labId="kalman"
      title="Sensor Fusion Bench: Kalman Filter vs Dead Reckoning"
      brief="A robot follows the gold path. Grey dots are noisy GNSS-style fixes, red is pure inertial dead reckoning, cyan is a 4-state Kalman filter fusing both. Raise the accelerometer bias and watch dead reckoning peel away within seconds; switch on the GNSS outage and watch the filter coast on its velocity estimate instead of snapping to noise."
      tone="sirius"
      tasks={tasks}
      controls={
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            <LabButton onClick={restart} tone="psy">
              restart run
            </LabButton>
            <LabButton onClick={() => setOutage((o) => !o)} active={outage} tone="myco">
              GNSS outage
            </LabButton>
            <LabButton onClick={() => setShowMeas((v) => !v)} active={showMeas}>
              fixes
            </LabButton>
            <LabButton onClick={() => setShowDr((v) => !v)} active={showDr}>
              dead reckoning
            </LabButton>
          </div>
          <Slider label="GNSS noise σ" value={sigma} min={0.05} max={2.5} step={0.05} onChange={setSigma} format={(v) => v.toFixed(2) + ' m'} />
          <Slider label="process noise Q" value={q} min={0.05} max={6} step={0.05} onChange={setQ} format={(v) => v.toFixed(2)} />
          <Slider label="accel bias" value={bias} min={0} max={1.2} step={0.02} onChange={setBias} format={(v) => v.toFixed(2) + ' m/s²'} />
          <Slider label="fix rate" value={rate} min={0.5} max={25} step={0.5} onChange={setRate} format={(v) => v.toFixed(1) + ' Hz'} />
          <Toggle label="dead reckoning layer" on={showDr} onClick={() => setShowDr((v) => !v)} />
        </div>
      }
      readouts={
        <>
          <Readout label="mean |GNSS error|" value={(latest?.measErr ?? 0).toFixed(3) + ' m'} tone="#c9bde6" />
          <Readout label="mean |DR error|" value={(latest?.drErr ?? 0).toFixed(3) + ' m'} tone="#ff6b1a" />
          <Readout label="mean |KF error|" value={(latest?.kfErr ?? 0).toFixed(3) + ' m'} tone="#6ee7a8" />
          <div className="rounded-xl border border-[#67e8f9]/25 bg-black/30 p-2">
            <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-[#67e8f9]">
              cumulative mean error (m)
            </div>
            <div className="h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chart}>
                  <CartesianGrid stroke="#1b3a52" strokeDasharray="2 4" />
                  <XAxis dataKey="t" tick={{ fill: '#9ec9e0', fontSize: 9 }} stroke="#2b5a7a" />
                  <YAxis tick={{ fill: '#9ec9e0', fontSize: 9 }} stroke="#2b5a7a" width={30} />
                  <Tooltip contentStyle={{ background: '#04141f', border: '1px solid #2b5a7a', fontSize: 11 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <RLine type="monotone" dataKey="measErr" name="GNSS" stroke="#8c82a8" dot={false} strokeWidth={1.6} />
                  <RLine type="monotone" dataKey="drErr" name="dead reckoning" stroke="#ff6b1a" dot={false} strokeWidth={1.8} />
                  <RLine type="monotone" dataKey="kfErr" name="Kalman" stroke="#6ee7a8" dot={false} strokeWidth={2.2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="pt-1 text-[11px] leading-snug text-[#c9bde6]">
            Dead-reckoning error grows without bound because a constant bias integrates into a quadratic position
            error. The filter wins not by better sensors but by refusing to trust any single one completely — the
            Kalman gain is literally a ratio of uncertainties.
          </div>
        </>
      }
    >
      <Canvas camera={{ position: [10, 8.5, 12], fov: 46 }} dpr={[1, 1.7]}>
        <color attach="background" args={['#02060f']} />
        <fog attach="fog" args={['#02060f', 18, 40]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[6, 12, 5]} intensity={1.1} />
        <pointLight position={[-6, 3, -6]} color="#4338ca" intensity={2} distance={26} />
        <Sim params={{ sigma, q, bias, rate }} onSample={onSample} paths={paths} outage={outage} />
        {paths.real.length > 1 && <Line points={[...paths.real]} color="#f5b301" lineWidth={3} />}
        {showMeas && paths.meas.length > 1 && (
          <Line points={[...paths.meas]} color="#8c82a8" lineWidth={1} dashed dashSize={0.18} gapSize={0.14} transparent opacity={0.7} />
        )}
        {showDr && paths.dr.length > 1 && <Line points={[...paths.dr]} color="#ff6b1a" lineWidth={2} />}
        {paths.kf.length > 1 && <Line points={[...paths.kf]} color="#6ee7a8" lineWidth={2.6} />}
        <gridHelper args={[26, 26, '#1b3a52', '#0b1d2b']} />
        <OrbitControls enablePan target={[0, 1, 0]} minDistance={6} maxDistance={34} />
      </Canvas>
      <div className="pointer-events-none absolute bottom-3 left-3 space-y-0.5 rounded-lg border border-white/10 bg-black/50 px-2.5 py-1.5 font-mono text-[10px]">
        <div style={{ color: '#f5b301' }}>■ ground truth</div>
        <div style={{ color: '#8c82a8' }}>■ noisy GNSS fixes</div>
        <div style={{ color: '#ff6b1a' }}>■ dead reckoning</div>
        <div style={{ color: '#6ee7a8' }}>■ Kalman fused</div>
      </div>
    </LabFrame>
  );
}
