import { Canvas, useFrame } from '@react-three/fiber';
import { Grid, Line, OrbitControls } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { LabProps } from './LabFrame';
import { LabButton, LabFrame, Readout, Slider, Toggle } from './LabFrame';

/* ================================================================== */
/* Kinematics of a planar 3R arm on a yaw base.                        */
/* Joint convention: q1 = base yaw about +Y; q2/q3/q4 measured from    */
/* the +Y axis inside the arm plane.                                   */
/* ================================================================== */

const LINK = [2.2, 1.9, 0.95];
const LIMITS: [number, number][] = [
  [-Math.PI, Math.PI],
  [-1.6, 1.6],
  [-2.5, 2.5],
  [-1.7, 1.7],
];

type Q = [number, number, number, number];

function fk(q: Q): THREE.Vector3 {
  const [q1, q2, q3, q4] = q;
  const a = q2;
  const b = q2 + q3;
  const c = q2 + q3 + q4;
  const r = LINK[0] * Math.sin(a) + LINK[1] * Math.sin(b) + LINK[2] * Math.sin(c);
  const h = LINK[0] * Math.cos(a) + LINK[1] * Math.cos(b) + LINK[2] * Math.cos(c);
  return new THREE.Vector3(r * Math.cos(q1), h, r * Math.sin(q1));
}

function joints(q: Q): THREE.Vector3[] {
  const [q1, q2, q3, q4] = q;
  const p0 = new THREE.Vector3(0, 0.55, 0);
  const plane = (r: number, h: number) => new THREE.Vector3(r * Math.cos(q1), h, r * Math.sin(q1));
  const r1 = LINK[0] * Math.sin(q2);
  const h1 = LINK[0] * Math.cos(q2) + p0.y;
  const r2 = r1 + LINK[1] * Math.sin(q2 + q3);
  const h2 = h1 + LINK[1] * Math.cos(q2 + q3);
  const r3 = r2 + LINK[2] * Math.sin(q2 + q3 + q4);
  const h3 = h2 + LINK[2] * Math.cos(q2 + q3 + q4);
  return [p0, plane(r1, h1), plane(r2, h2), plane(r3, h3)];
}

function solve3(A: number[][], b: number[]): number[] {
  const M = A.map((row, i) => [...row, b[i]]);
  for (let col = 0; col < 3; col++) {
    let piv = col;
    for (let r = col + 1; r < 3; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
    if (Math.abs(M[piv][col]) < 1e-12) return [0, 0, 0];
    [M[col], M[piv]] = [M[piv], M[col]];
    for (let r = 0; r < 3; r++) {
      if (r === col) continue;
      const f = M[r][col] / M[col][col];
      for (let c = col; c < 4; c++) M[r][c] -= f * M[col][c];
    }
  }
  return [M[0][3] / M[0][0], M[1][3] / M[1][1], M[2][3] / M[2][2]];
}

/** Damped least squares IK over joints 1-3 (yaw, shoulder, elbow). */
function solveIK(target: THREE.Vector3, q0: Q, iters = 90): { q: Q; err: number; rank: number } {
  const q: Q = [...q0] as Q;
  const idx = [0, 1, 2];
  let err = Infinity;
  let w = 0;
  for (let it = 0; it < iters; it++) {
    const p = fk(q);
    const e = target.clone().sub(p);
    err = e.length();
    if (err < 0.008) break;
    const J: number[][] = [[], [], []];
    const dq = 1e-4;
    for (let c = 0; c < 3; c++) {
      const qp: Q = [...q] as Q;
      qp[idx[c]] += dq;
      const d = fk(qp).sub(p).divideScalar(dq);
      J[0][c] = d.x;
      J[1][c] = d.y;
      J[2][c] = d.z;
    }
    // manipulability w = sqrt(det(J J^T))
    const JJt = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 3; c++) {
        let s = 0;
        for (let k = 0; k < 3; k++) s += J[r][k] * J[c][k];
        JJt[r][c] = s;
      }
    const det =
      JJt[0][0] * (JJt[1][1] * JJt[2][2] - JJt[1][2] * JJt[2][1]) -
      JJt[0][1] * (JJt[1][0] * JJt[2][2] - JJt[1][2] * JJt[2][0]) +
      JJt[0][2] * (JJt[1][0] * JJt[2][1] - JJt[1][1] * JJt[2][0]);
    w = Math.sqrt(Math.max(0, det));

    const lambda = 0.06 + (err > 0.5 ? 0.25 : 0);
    const A = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 3; c++) {
        let s = 0;
        for (let k = 0; k < 3; k++) s += J[k][r] * J[k][c];
        A[r][c] = s + (r === c ? lambda * lambda : 0);
      }
    const bb = [0, 0, 0];
    for (let r = 0; r < 3; r++) {
      let s = 0;
      for (let k = 0; k < 3; k++) s += J[k][r] * e.getComponent(k);
      bb[r] = s;
    }
    const d = solve3(A, bb);
    for (let c = 0; c < 3; c++) {
      const lim = LIMITS[idx[c]];
      q[idx[c]] = Math.min(lim[1], Math.max(lim[0], q[idx[c]] + THREE.MathUtils.clamp(d[c], -0.4, 0.4)));
    }
  }
  return { q, err, rank: w };
}

/* ---------------------------- meshes ------------------------------ */

function Segment({ a, b, radius, color }: { a: THREE.Vector3; b: THREE.Vector3; radius: number; color: string }) {
  const { mid, quat, len } = useMemo(() => {
    const dir = b.clone().sub(a);
    const len = Math.max(0.001, dir.length());
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    return { mid, quat, len };
  }, [a.x, a.y, a.z, b.x, b.y, b.z]);
  return (
    <mesh position={mid} quaternion={quat} castShadow>
      <cylinderGeometry args={[radius, radius * 0.92, len, 14]} />
      <meshStandardMaterial color={color} metalness={0.85} roughness={0.28} />
    </mesh>
  );
}

function Arm({ q, trail, showTrail }: { q: Q; trail: THREE.Vector3[]; showTrail: boolean }) {
  const pts = useMemo(() => joints(q), [q]);
  const tip = pts[3];
  const colors = ['#c96f2b', '#f5b301', '#e0f2fe', '#67e8f9'];
  return (
    <group>
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.78, 0.95, 0.55, 28]} />
        <meshStandardMaterial color="#3a2b2b" metalness={0.7} roughness={0.4} />
      </mesh>
      {pts.slice(0, 3).map((p, i) => (
        <Segment key={i} a={p} b={pts[i + 1]} radius={0.19 - i * 0.03} color={colors[i]} />
      ))}
      {pts.map((p, i) => (
        <mesh key={`j${i}`} position={p}>
          <sphereGeometry args={[i === 3 ? 0.2 : 0.25 - i * 0.02, 20, 20]} />
          <meshStandardMaterial color="#f5b301" metalness={0.9} roughness={0.2} emissive="#7a4a00" emissiveIntensity={0.5} />
        </mesh>
      ))}
      {/* gripper */}
      <group position={tip}>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.16, -0.24, 0]}>
            <boxGeometry args={[0.08, 0.42, 0.1]} />
            <meshStandardMaterial color="#e0f2fe" metalness={0.8} roughness={0.25} />
          </mesh>
        ))}
      </group>
      {showTrail && trail.length > 1 && (
        <Line points={trail} color="#ff2fb9" lineWidth={2.4} transparent opacity={0.85} />
      )}
    </group>
  );
}

function WorkspaceCloud({ show }: { show: boolean }) {
  const geo = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < 26; i++)
      for (let j = 0; j < 26; j++) {
        const q: Q = [
          (i / 25) * Math.PI * 2 - Math.PI,
          -1.4 + (j / 25) * 3.0,
          -2.2 + ((i * 7) % 25) / 25 * 4.4,
          0,
        ];
        const p = fk(q);
        positions.push(p.x, p.y, p.z);
      }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, []);
  if (!show) return null;
  return (
    <points geometry={geo}>
      <pointsMaterial size={0.035} color="#4338ca" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function TargetMarker({ p }: { p: THREE.Vector3 }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const s = 0.16 + Math.sin(clock.elapsedTime * 4) * 0.02;
      ref.current.scale.setScalar(s / 0.16);
      ref.current.rotation.y = clock.elapsedTime;
    }
  });
  return (
    <group position={p}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.16, 1]} />
        <meshStandardMaterial color="#6ee7a8" emissive="#16a34a" emissiveIntensity={1.6} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.012, 8, 40]} />
        <meshBasicMaterial color="#6ee7a8" transparent opacity={0.5} />
      </mesh>
      <pointLight color="#6ee7a8" intensity={2.4} distance={3.2} />
    </group>
  );
}

/**
 * Tool-centre-point trail recorder. This MUST live inside <Canvas>: useFrame is
 * an R3F hook and throws if it is called from a component outside the canvas tree.
 */
function TrailTracker({
  tip,
  enabled,
  resetKey,
  store,
  onUpdate,
}: {
  tip: THREE.Vector3;
  enabled: boolean;
  resetKey: number;
  store: { current: THREE.Vector3[] };
  onUpdate: (pts: THREE.Vector3[]) => void;
}) {
  const last = useRef(0);
  // Reset only when the user clears the trace — never when the pose changes.
  useEffect(() => {
    const pts = [tip.clone()];
    store.current = pts;
    onUpdate(pts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);
  useFrame(({ clock }) => {
    if (!enabled) return;
    const now = clock.elapsedTime;
    if (now - last.current < 0.06) return;
    last.current = now;
    const pts = store.current;
    if (pts.length && pts[pts.length - 1].distanceTo(tip) < 0.02) return;
    pts.push(tip.clone());
    if (pts.length > 900) pts.shift();
    onUpdate(pts.slice());
  });
  return null;
}

/* ------------------------------ lab ------------------------------- */

export default function RobotArmLab({ tasks }: LabProps) {
  const [q, setQ] = useState<Q>([0.5, 0.55, -0.9, 0.25]);
  const [ikMode, setIkMode] = useState(true);
  const [target, setTarget] = useState<THREE.Vector3>(new THREE.Vector3(2.4, 2.0, 1.2));
  const [trailOn, setTrailOn] = useState(true);
  const [wsOn, setWsOn] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [status, setStatus] = useState({ err: 0, w: 0 });

  const tip = useMemo(() => fk(q), [q]);
  const [trail, setTrail] = useState<THREE.Vector3[]>([]);
  const trailStore = useRef<THREE.Vector3[]>([]);

  useEffect(() => {
    if (!ikMode) return;
    const { q: sol, err, rank } = solveIK(target, q);
    setQ(sol);
    setStatus({ err, w: rank });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.x, target.y, target.z, ikMode]);

  const reach = LINK[0] + LINK[1] + LINK[2];
  const d = Math.sqrt(target.x ** 2 + target.z ** 2);

  return (
    <LabFrame
      labId="robot-arm"
      title="6-Axis Kinematics Bench"
      brief="A planar 3R manipulator on a yaw base. Switch between joint-space driving (forward kinematics) and Cartesian targets (damped-least-squares inverse kinematics). Watch manipulability collapse near singularities."
      tasks={tasks}
      controls={
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            <LabButton onClick={() => setIkMode(true)} active={ikMode} tone="myco">
              IK mode
            </LabButton>
            <LabButton onClick={() => setIkMode(false)} active={!ikMode}>
              FK mode
            </LabButton>
            <LabButton onClick={() => setTrailOn((v) => !v)} active={trailOn} tone="psy">
              TCP trail
            </LabButton>
            <LabButton onClick={() => setWsOn((v) => !v)} active={wsOn} tone="psy">
              Workspace
            </LabButton>
            <LabButton onClick={() => setResetKey((k) => k + 1)}>clear</LabButton>
          </div>

          {ikMode ? (
            <>
              <Slider label="target X" value={target.x} min={-reach} max={reach} step={0.05} unit=" m" onChange={(v) => setTarget(new THREE.Vector3(v, target.y, target.z))} format={(v) => v.toFixed(2) + ' m'} />
              <Slider label="target Y (height)" value={target.y} min={-0.5} max={reach} step={0.05} onChange={(v) => setTarget(new THREE.Vector3(target.x, v, target.z))} format={(v) => v.toFixed(2) + ' m'} />
              <Slider label="target Z" value={target.z} min={-reach} max={reach} step={0.05} onChange={(v) => setTarget(new THREE.Vector3(target.x, target.y, v))} format={(v) => v.toFixed(2) + ' m'} />
              <Slider label="wrist q4" value={q[3]} min={LIMITS[3][0]} max={LIMITS[3][1]} step={0.02} onChange={(v) => setQ([q[0], q[1], q[2], v])} format={(v) => ((v * 180) / Math.PI).toFixed(0) + '°'} />
            </>
          ) : (
            (['base yaw q1', 'shoulder q2', 'elbow q3', 'wrist q4'] as const).map((label, i) => (
              <Slider
                key={label}
                label={label}
                value={q[i]}
                min={LIMITS[i][0]}
                max={LIMITS[i][1]}
                step={0.02}
                onChange={(v) => {
                  const n = [...q] as Q;
                  n[i] = v;
                  setQ(n);
                }}
                format={(v) => ((v * 180) / Math.PI).toFixed(0) + '°'}
              />
            ))
          )}
          <div className="grid grid-cols-2 gap-1.5">
            <Toggle label="trail" on={trailOn} onClick={() => setTrailOn((v) => !v)} />
            <Toggle label="cloud" on={wsOn} onClick={() => setWsOn((v) => !v)} />
          </div>
        </div>
      }
      readouts={
        <>
          <Readout label="TCP X" value={tip.x.toFixed(3) + ' m'} tone="#67e8f9" />
          <Readout label="TCP Y" value={tip.y.toFixed(3) + ' m'} tone="#67e8f9" />
          <Readout label="TCP Z" value={tip.z.toFixed(3) + ' m'} tone="#67e8f9" />
          <Readout label="planar radius" value={d.toFixed(3) + ' m'} />
          <Readout label="max reach" value={reach.toFixed(2) + ' m'} />
          <Readout
            label="IK residual"
            value={(status.err * 1000).toFixed(1) + ' mm'}
            tone={status.err < 0.01 ? '#6ee7a8' : status.err < 0.1 ? '#f5b301' : '#ff6b1a'}
          />
          <Readout
            label="manipulability"
            value={status.w.toFixed(3)}
            tone={status.w > 1 ? '#6ee7a8' : status.w > 0.15 ? '#f5b301' : '#ff2fb9'}
          />
          <div className="pt-1 text-[11px] leading-snug text-[#c9bde6]">
            {d > reach
              ? 'Target is outside the reachable workspace — the solver saturates at full extension.'
              : status.w < 0.15
                ? 'Near a singularity: small Cartesian moves demand huge joint speeds.'
                : 'Well-conditioned pose. Jacobian is invertible and force transmission is good.'}
          </div>
        </>
      }
    >
      <Canvas shadows camera={{ position: [6.4, 4.6, 7.4], fov: 42 }} dpr={[1, 1.8]}>
        <color attach="background" args={['#07021a']} />
        <fog attach="fog" args={['#07021a', 16, 34]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[7, 12, 6]} intensity={1.5} castShadow />
        <pointLight position={[-6, 3, -6]} color="#c026d3" intensity={2.2} distance={20} />
        <pointLight position={[6, 2, 6]} color="#6ee7a8" intensity={1.4} distance={18} />
        <gridHelper args={[24, 24, '#4338ca', '#1b1440']} position={[0, 0, 0]} />
        <Arm q={q} trail={trail} showTrail={trailOn} />
        <TrailTracker tip={tip} enabled={trailOn} resetKey={resetKey} store={trailStore} onUpdate={setTrail} />
        <WorkspaceCloud show={wsOn} />
        {ikMode && <TargetMarker p={target} />}
        <OrbitControls enablePan target={[0, 1.6, 0]} maxPolarAngle={Math.PI / 2.03} minDistance={4} maxDistance={24} />
      </Canvas>
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-white/10 bg-black/50 px-2.5 py-1.5 font-mono text-[10px] text-[#c9bde6]">
        drag to orbit · scroll to zoom · green icosahedron = IK target
      </div>
    </LabFrame>
  );
}
