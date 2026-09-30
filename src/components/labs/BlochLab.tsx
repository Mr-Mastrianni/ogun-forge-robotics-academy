import { Canvas } from '@react-three/fiber';
import { Line, OrbitControls } from '@react-three/drei';
import { useMemo, useState } from 'react';
import * as THREE from 'three';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { LabProps } from './LabFrame';
import { LabButton, LabFrame, Readout, Slider } from './LabFrame';

/* ==================================================================
   Bloch sphere + single-qubit gate algebra.
   |psi> = cos(t/2)|0> + e^{i phi} sin(t/2)|1>
   ================================================================== */

type C = { re: number; im: number };
const c = (re: number, im = 0): C => ({ re, im });
const cadd = (a: C, b: C): C => ({ re: a.re + b.re, im: a.im + b.im });
const cmul = (a: C, b: C): C => ({ re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re });
const cabs = (a: C) => Math.hypot(a.re, a.im);
const cscale = (a: C, s: number): C => ({ re: a.re * s, im: a.im * s });

type Mat2 = [C, C, C, C];
const mapply = (M: Mat2, v: [C, C]): [C, C] => [
  cadd(cmul(M[0], v[0]), cmul(M[1], v[1])),
  cadd(cmul(M[2], v[0]), cmul(M[3], v[1])),
];
const mmul = (A: Mat2, B: Mat2): Mat2 => {
  const out: C[] = [];
  for (let i = 0; i < 2; i++)
    for (let j = 0; j < 2; j++) {
      out.push(cadd(cmul(A[i * 2], B[j]), cmul(A[i * 2 + 1], B[2 + j])));
    }
  return out as Mat2;
};

const I2: Mat2 = [c(1), c(0), c(0), c(1)];
const X: Mat2 = [c(0), c(1), c(1), c(0)];
const Y: Mat2 = [c(0), c(0, -1), c(0, 1), c(0)];
const Z: Mat2 = [c(1), c(0), c(0), c(-1)];
const S: Mat2 = [c(1), c(0), c(0), c(0, 1)];
const T: Mat2 = [c(1), c(0), c(0), { re: Math.SQRT1_2, im: Math.SQRT1_2 }];
const H: Mat2 = [
  c(Math.SQRT1_2),
  c(Math.SQRT1_2),
  c(Math.SQRT1_2),
  c(-Math.SQRT1_2),
];
const rot = (axis: 'x' | 'y' | 'z', th: number): Mat2 => {
  const co = Math.cos(th / 2);
  const si = Math.sin(th / 2);
  if (axis === 'x') return [c(co), c(0, -si), c(0, -si), c(co)];
  if (axis === 'y') return [c(co), c(-si), c(si), c(co)];
  return [c(co, -si), c(0), c(0), c(co, si)];
};

const GATES: { name: string; m: Mat2; blurb: string }[] = [
  { name: 'X', m: X, blurb: 'π rotation about X — the bit flip' },
  { name: 'Y', m: Y, blurb: 'π rotation about Y — flip with a phase twist' },
  { name: 'Z', m: Z, blurb: 'π rotation about Z — phase flip, invisible to |0>/|1> measurement' },
  { name: 'H', m: H, blurb: 'Hadamard — creates equal superposition' },
  { name: 'S', m: S, blurb: 'π/2 phase gate' },
  { name: 'T', m: T, blurb: 'π/4 phase gate — the magic state ingredient' },
];

function sampleMeasurement(p0: number, shots: number) {
  let zeros = 0;
  let seed = 987654321;
  for (let i = 0; i < shots; i++) {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    if (seed / 4294967296 < p0) zeros++;
  }
  return zeros;
}

function BlochSphere({ theta, phi, arc }: { theta: number; phi: number; arc: number }) {
  const circles = useMemo(() => {
    const out: THREE.Vector3[][] = [];
    const N = 96;
    const addCircle = (fn: (a: number) => THREE.Vector3) => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= N; i++) pts.push(fn((i / N) * Math.PI * 2));
      out.push(pts);
    };
    addCircle((a) => new THREE.Vector3(Math.cos(a), 0, Math.sin(a)));
    addCircle((a) => new THREE.Vector3(Math.cos(a), Math.sin(a), 0));
    addCircle((a) => new THREE.Vector3(0, Math.cos(a), Math.sin(a)));
    for (const lat of [-0.6, -0.3, 0.3, 0.6]) {
      const r = Math.sqrt(1 - lat * lat);
      addCircle((a) => new THREE.Vector3(r * Math.cos(a), lat, r * Math.sin(a)));
    }
    return out;
  }, []);

  const vec = new THREE.Vector3(
    Math.sin(theta) * Math.cos(phi),
    Math.cos(theta),
    Math.sin(theta) * Math.sin(phi),
  );

  return (
    <group>
      <mesh>
        <sphereGeometry args={[1, 32, 24]} />
        <meshStandardMaterial color="#4c1d95" transparent opacity={0.13} roughness={0.4} metalness={0.4} />
      </mesh>
      {circles.map((pts, i) => (
        <Line key={i} points={pts} color="#6d5bb8" lineWidth={0.7} transparent opacity={0.42} />
      ))}
      <Line points={[new THREE.Vector3(-1.35, 0, 0), new THREE.Vector3(1.35, 0, 0)]} color="#67e8f9" lineWidth={1} transparent opacity={0.6} />
      <Line points={[new THREE.Vector3(0, -1.35, 0), new THREE.Vector3(0, 1.35, 0)]} color="#67e8f9" lineWidth={1} transparent opacity={0.6} />
      <Line points={[new THREE.Vector3(0, 0, -1.35), new THREE.Vector3(0, 0, 1.35)]} color="#67e8f9" lineWidth={1} transparent opacity={0.6} />

      {/* state vector */}
      <Line points={[new THREE.Vector3(0, 0, 0), vec]} color="#f5b301" lineWidth={4} />
      <mesh position={vec}>
        <sphereGeometry args={[0.085, 18, 18]} />
        <meshStandardMaterial color="#ff2fb9" emissive="#c026d3" emissiveIntensity={1.8} />
      </mesh>

      {/* precession arc near the equator showing the phase */}
      <Line
        points={Array.from({ length: 40 }, (_, i) => {
          const a = (i / 39) * phi;
          const r = Math.sin(theta) || 0.001;
          return new THREE.Vector3(r * Math.cos(a), Math.cos(theta), r * Math.sin(a));
        })}
        color="#6ee7a8"
        lineWidth={2}
      />

      <mesh position={[0, 1.16, 0]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshBasicMaterial color="#e0f2fe" />
      </mesh>
      <mesh position={[0, -1.16, 0]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshBasicMaterial color="#ff6b1a" />
      </mesh>

      {/* faint trail of the last rotation */}
      <Line
        points={Array.from({ length: 32 }, (_, i) => {
          const u = i / 31;
          const th = theta * (1 - u) + arc * u;
          return new THREE.Vector3(Math.sin(th) * Math.cos(phi), Math.cos(th), Math.sin(th) * Math.sin(phi));
        })}
        color="#c026d3"
        lineWidth={1.4}
        transparent
        opacity={0.55}
      />
    </group>
  );
}

export default function BlochLab({ tasks }: LabProps) {
  const [state, setState] = useState<[C, C]>([c(1), c(0)]);
  const [shots, setShots] = useState(500);
  const [hist, setHist] = useState<{ label: string; count: number }[]>([]);
  const [lastGate, setLastGate] = useState('|0⟩ prepared');

  const p0 = state[0].re * state[0].re + state[0].im * state[0].im;
  const p1 = state[1].re * state[1].re + state[1].im * state[1].im;
  const theta = 2 * Math.acos(Math.min(1, Math.max(-1, Math.sqrt(p0))));
  const phi = Math.atan2(state[1].im, state[1].re) - Math.atan2(state[0].im, state[0].re);
  const norm = Math.sqrt(p0 + p1) || 1;

  const applyGate = (name: string, m: Mat2, blurb: string) => {
    const next = mapply(m, state);
    const n = Math.hypot(cabs(next[0]), cabs(next[1])) || 1;
    setState([cscale(next[0], 1 / n), cscale(next[1], 1 / n)]);
    setLastGate(`${name} applied — ${blurb}`);
    setHist([]);
  };

  const applyRot = (axis: 'x' | 'y' | 'z', deg: number) => {
    const m = rot(axis, (deg * Math.PI) / 180);
    const next = mapply(m, state);
    const n = Math.hypot(cabs(next[0]), cabs(next[1])) || 1;
    setState([cscale(next[0], 1 / n), cscale(next[1], 1 / n)]);
    setLastGate(`R${axis}(${deg}°) applied`);
    setHist([]);
  };

  const measure = () => {
    const zeros = sampleMeasurement(p0, shots);
    setHist([
      { label: '|0⟩', count: zeros },
      { label: '|1⟩', count: shots - zeros },
    ]);
    setLastGate(`measured ${shots} shots`);
  };

  const bloch = new THREE.Vector3(
    Math.sin(theta) * Math.cos(phi),
    Math.cos(theta),
    Math.sin(theta) * Math.sin(phi),
  );

  return (
    <LabFrame
      labId="bloch"
      title="Bloch Sphere & Single-Qubit Gates"
      brief="Every pure state of one qubit is a point on this sphere. The north pole is |0⟩, the south pole |1⟩, and the equator is equal superposition with phase given by the longitude. Gates are rotations: X flips through the sphere, Z spins about the vertical axis (measuring in the Z basis cannot see it), H takes |0⟩ to the equator. Measuring collapses the state — the histogram is sampled from the Born rule P(0) = |α|²."
      tone="psy"
      tasks={tasks}
      controls={
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-1.5">
            {GATES.map((g) => (
              <LabButton key={g.name} onClick={() => applyGate(g.name, g.m, g.blurb)} tone="psy">
                {g.name}
              </LabButton>
            ))}
          </div>
          <Slider label="rotate about X" value={0} min={-180} max={180} step={15} onChange={(v) => v !== 0 && applyRot('x', v)} format={() => 'drag to apply'} />
          <div className="grid grid-cols-3 gap-1.5">
            {[30, 90, 180].map((d) => (
              <LabButton key={`rx${d}`} onClick={() => applyRot('x', d)}>
                Rx {d}°
              </LabButton>
            ))}
            {[30, 90, 180].map((d) => (
              <LabButton key={`ry${d}`} onClick={() => applyRot('y', d)}>
                Ry {d}°
              </LabButton>
            ))}
            {[30, 90, 180].map((d) => (
              <LabButton key={`rz${d}`} onClick={() => applyRot('z', d)}>
                Rz {d}°
              </LabButton>
            ))}
          </div>
          <Slider label="measurement shots" value={shots} min={10} max={4000} step={10} onChange={setShots} />
          <div className="flex flex-wrap gap-1.5">
            <LabButton onClick={measure} tone="myco">
              measure in Z basis
            </LabButton>
            <LabButton
              onClick={() => {
                setState([c(1), c(0)]);
                setHist([]);
                setLastGate('|0⟩ prepared');
              }}
            >
              reset to |0⟩
            </LabButton>
            <LabButton
              onClick={() => {
                applyGate('H', H, 'Hadamard');
              }}
              tone="myco"
            >
              prepare |+⟩
            </LabButton>
          </div>
        </div>
      }
      readouts={
        <>
          <Readout label="α (|0⟩ amplitude)" value={`${state[0].re.toFixed(3)} ${state[0].im >= 0 ? '+' : '−'} ${Math.abs(state[0].im).toFixed(3)}i`} />
          <Readout label="β (|1⟩ amplitude)" value={`${state[1].re.toFixed(3)} ${state[1].im >= 0 ? '+' : '−'} ${Math.abs(state[1].im).toFixed(3)}i`} />
          <Readout label="P(0) = |α|²" value={(p0 / (norm * norm)).toFixed(4)} tone="#67e8f9" />
          <Readout label="P(1) = |β|²" value={(p1 / (norm * norm)).toFixed(4)} tone="#ff6b1a" />
          <Readout label="θ (polar)" value={((theta * 180) / Math.PI).toFixed(1) + '°'} />
          <Readout label="φ (azimuth)" value={((phi * 180) / Math.PI).toFixed(1) + '°'} />
          <Readout label="Bloch vector" value={`(${bloch.x.toFixed(2)}, ${bloch.y.toFixed(2)}, ${bloch.z.toFixed(2)})`} tone="#f5c8ff" />
          {hist.length > 0 && (
            <div className="rounded-xl border border-[#c026d3]/25 bg-black/30 p-2">
              <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-[#f5c8ff]">
                measurement histogram
              </div>
              <div className="h-[100px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hist}>
                    <CartesianGrid stroke="#3b1d52" strokeDasharray="2 4" />
                    <XAxis dataKey="label" tick={{ fill: '#f5c8ff', fontSize: 10 }} stroke="#5b2d7a" />
                    <YAxis tick={{ fill: '#f5c8ff', fontSize: 9 }} stroke="#5b2d7a" width={34} />
                    <Tooltip contentStyle={{ background: '#160726', border: '1px solid #5b2d7a', fontSize: 11 }} />
                    <Bar dataKey="count" fill="#c026d3" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          <div className="pt-1 text-[11px] leading-snug text-[#c9bde6]">{lastGate}</div>
          <div className="text-[11px] leading-snug text-[#c9bde6]">
            Apply Z twice in a row after H: you return exactly to where you started — that is a global phase you can
            never measure. This is why the sphere is a sphere and not a ball of arrows.
          </div>
        </>
      }
    >
      <Canvas camera={{ position: [2.6, 1.9, 2.9], fov: 42 }} dpr={[1, 1.8]}>
        <color attach="background" args={['#0b0318']} />
        <ambientLight intensity={0.7} />
        <pointLight position={[3, 3, 3]} color="#c026d3" intensity={2.6} distance={14} />
        <pointLight position={[-3, -2, -2]} color="#67e8f9" intensity={1.6} distance={12} />
        <BlochSphere theta={theta} phi={phi} arc={theta * 0.5} />
        <OrbitControls enablePan={false} minDistance={2.4} maxDistance={9} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-[#c026d3]/20 bg-black/50 px-2.5 py-1.5 font-mono text-[10px] text-[#f5c8ff]">
        |0⟩ = north pole (white) · |1⟩ = south pole (orange)
      </div>
    </LabFrame>
  );
}
