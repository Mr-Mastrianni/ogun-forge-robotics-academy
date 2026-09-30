import { Canvas, useFrame } from '@react-three/fiber';
import { Line, OrbitControls } from '@react-three/drei';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { LineChart, Line as RLine, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { LabProps } from './LabFrame';
import { LabButton, LabFrame, Readout, Slider } from './LabFrame';

/* ==================================================================
   Quadrotor waypoint tracking with a per-axis PID position loop.
   The attitude inner loop is treated as instantaneous (a common and
   honest simplification for teaching outer-loop tuning).
   ================================================================== */

interface Gains {
  kp: number;
  ki: number;
  kd: number;
}

const PRESETS: { name: string; g: Gains; note: string }[] = [
  { name: 'sluggish', g: { kp: 1.1, ki: 0.05, kd: 0.9 }, note: 'low gain — slow, no overshoot' },
  { name: 'underdamped', g: { kp: 5.5, ki: 0.9, kd: 0.7 }, note: 'oscillates, overshoots, eventually settles' },
  { name: 'critical', g: { kp: 5.0, ki: 1.1, kd: 2.6 }, note: 'fast rise with minimal overshoot' },
  { name: 'aggressive', g: { kp: 11, ki: 2.6, kd: 3.6 }, note: 'very fast, saturates the accel limit' },
  { name: 'overdamped', g: { kp: 1.8, ki: 0.4, kd: 4.2 }, note: 'no overshoot, sluggish tail' },
];

function Drone({ gains, target, mass, wind, onSample, trail, trailOn }: {
  gains: Gains;
  target: THREE.Vector3;
  mass: number;
  wind: { v: THREE.Vector3 };
  onSample: (s: { t: number; err: number; x: number; z: number }) => void;
  trail: THREE.Vector3[];
  trailOn: boolean;
}) {
  const st = useRef({
    p: new THREE.Vector3(0, 0.9, 0),
    v: new THREE.Vector3(),
    e: [0, 0, 0],
    pe: [0, 0, 0],
    t: 0,
    acc: 0,
    sample: 0,
    tilt: new THREE.Vector3(),
  });
  const group = useRef<THREE.Group>(null);
  const rotors = useRef<THREE.Group>(null);
  const lastPush = useRef(0);

  useFrame((_, delta) => {
    const s = st.current;
    const dt = Math.min(0.033, delta);
    const tw = 1 / Math.max(0.4, mass);
    const aMax = 9.5 * tw;

    const pos: THREE.Vector3[] = [];
    for (let i = 0; i < 3; i++) {
      const axis = ['x', 'y', 'z'][i] as 'x' | 'y' | 'z';
      const err = target[axis] - s.p[axis];
      s.e[i] += err * dt;
      const de = (err - s.pe[i]) / dt;
      s.pe[i] = err;
      let a = gains.kp * err + gains.ki * s.e[i] + gains.kd * de;
      a = THREE.MathUtils.clamp(a, -aMax, aMax);
      pos.push(new THREE.Vector3(0, 0, 0).setComponent(i, a));
    }
    const aCmd = pos[0].add(pos[1]).add(pos[2]);
    // drag + wind
    aCmd.addScaledVector(s.v, -1.35).add(wind.v);
    s.v.addScaledVector(aCmd, dt);
    s.p.addScaledVector(s.v, dt);
    if (s.p.y < 0.35) {
      s.p.y = 0.35;
      s.v.y = Math.max(0, s.v.y);
    }
    s.t += dt;
    s.tilt.lerp(new THREE.Vector3(-aCmd.z * 0.06, 0, aCmd.x * 0.06), 0.12);

    if (group.current) {
      group.current.position.copy(s.p);
      group.current.rotation.set(s.tilt.x, 0, s.tilt.z);
    }
    if (rotors.current) rotors.current.children.forEach((r, i) => (r.rotation.y += (i % 2 ? -1 : 1) * dt * 42));

    s.acc += dt;
    if (s.acc > 0.07) {
      s.acc = 0;
      if (trailOn) {
        trail.push(s.p.clone());
        if (trail.length > 500) trail.shift();
      }
      lastPush.current++;
    }
    s.sample += dt;
    if (s.sample > 0.12) {
      s.sample = 0;
      onSample({
        t: Math.round(s.t * 10) / 10,
        err: Math.round(s.p.distanceTo(target) * 1000) / 1000,
        x: Math.round(s.p.x * 100) / 100,
        z: Math.round(s.p.z * 100) / 100,
      });
    }
  });

  return (
    <>
      <group ref={group}>
        <mesh castShadow>
          <boxGeometry args={[0.72, 0.16, 0.72]} />
          <meshStandardMaterial color="#1b1440" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.07, 0]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#f5b301" emissive="#ff6b1a" emissiveIntensity={0.9} />
        </mesh>
        {[
          [0.52, 0, 0.52],
          [-0.52, 0, 0.52],
          [0.52, 0, -0.52],
          [-0.52, 0, -0.52],
        ].map((p, i) => (
          <mesh key={i} position={p as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 1.5, 8]} />
            <meshStandardMaterial color="#3a2b2b" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
        <group ref={rotors}>
          {[
            [0.52, 0, 0.52],
            [-0.52, 0, 0.52],
            [0.52, 0, -0.52],
            [-0.52, 0, -0.52],
          ].map((p, i) => (
            <group key={i} position={p as [number, number, number]}>
              <mesh>
                <cylinderGeometry args={[0.4, 0.4, 0.012, 20]} />
                <meshStandardMaterial color="#67e8f9" transparent opacity={0.28} metalness={0.4} />
              </mesh>
              <mesh position={[0, 0.02, 0]}>
                <sphereGeometry args={[0.07, 12, 12]} />
                <meshStandardMaterial color="#c026d3" emissive="#c026d3" emissiveIntensity={0.8} />
              </mesh>
            </group>
          ))}
        </group>
        <pointLight color="#c026d3" intensity={1.4} distance={4} />
      </group>
      {trailOn && trail.length > 1 && <Line points={[...trail]} color="#6ee7a8" lineWidth={2} />}
    </>
  );
}

function analyticStep(kp: number, kd: number, ki: number) {
  // unit-mass second order: x'' + kd x' + kp x = kp * r  →  wn = sqrt(kp), zeta = kd/(2 sqrt(kp))
  const wn = Math.sqrt(Math.max(0.01, kp));
  const zeta = kd / (2 * Math.max(0.05, wn));
  const wd = wn * Math.sqrt(Math.max(1e-6, 1 - zeta * zeta));
  const out: { t: number; y: number }[] = [];
  for (let i = 0; i <= 60; i++) {
    const t = i * 0.06;
    let y: number;
    if (zeta < 1) {
      y = 1 - Math.exp(-zeta * wn * t) * (Math.cos(wd * t) + ((zeta * wn) / wd) * Math.sin(wd * t));
    } else {
      const r1 = -wn * (zeta - Math.sqrt(zeta * zeta - 1));
      const r2 = -wn * (zeta + Math.sqrt(zeta * zeta - 1));
      y = 1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
    }
    // steady-state droop from the integral term absence
    if (ki <= 0.001) y *= kp / (kp + 1);
    out.push({ t: Math.round(t * 100) / 100, y: Math.round(y * 1000) / 1000 });
  }
  return { data: out, wn, zeta };
}

export default function PidDroneLab({ tasks }: LabProps) {
  const [gains, setGains] = useState<Gains>(PRESETS[2].g);
  const [preset, setPreset] = useState('critical');
  const [target, setTarget] = useState(new THREE.Vector3(2.6, 2.2, 1.8));
  const [mass, setMass] = useState(1.0);
  const [trailOn, setTrailOn] = useState(true);
  const [data, setData] = useState<{ t: number; err: number; x: number; z: number }[]>([]);
  const [version, setVersion] = useState(0);
  const wind = useRef({ v: new THREE.Vector3() });
  const trail = useMemo(() => [] as THREE.Vector3[], [version]);

  const onSample = (s: { t: number; err: number; x: number; z: number }) => {
    setData((d) => [...d, s].slice(-160));
  };

  const { data: step, wn, zeta } = useMemo(() => analyticStep(gains.kp, gains.kd, gains.ki), [gains]);
  const overshoot = useMemo(() => Math.max(...step.map((p) => p.y)), [step]);
  const settle = useMemo(() => {
    const idx = [...step].reverse().findIndex((p) => Math.abs(p.y - 1) > 0.02);
    return idx === -1 ? 0 : step[step.length - 1 - idx].t;
  }, [step]);

  const applyPreset = (name: string) => {
    const p = PRESETS.find((x) => x.name === name);
    if (p) {
      setPresets(p.g);
    }
  };
  const setPresets = (g: Gains) => {
    setGains(g);
    setPreset(PRESETS.find((p) => p.g.kp === g.kp && p.g.kd === g.kd)?.name ?? 'custom');
  };

  const latest = data[data.length - 1];

  return (
    <LabFrame
      labId="pid-drone"
      title="PID Flight Bench"
      brief="A quadrotor chases a green waypoint using one PID position loop per axis, with acceleration saturation, drag and gust disturbance. Tune the gains live, watch the step response on the right, then hit a gust and see whether your controller can hold station. Notice that a P-only controller always leaves a steady-state droop."
      tasks={tasks}
      controls={
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <LabButton key={p.name} onClick={() => applyPreset(p.name)} active={preset === p.name} tone="psy">
                {p.name}
              </LabButton>
            ))}
          </div>
          <Slider label="Kp" value={gains.kp} min={0} max={14} step={0.1} onChange={(v) => setPresets({ ...gains, kp: v })} format={(v) => v.toFixed(1)} />
          <Slider label="Ki" value={gains.ki} min={0} max={4} step={0.05} onChange={(v) => setPresets({ ...gains, ki: v })} format={(v) => v.toFixed(2)} />
          <Slider label="Kd" value={gains.kd} min={0} max={6} step={0.05} onChange={(v) => setPresets({ ...gains, kd: v })} format={(v) => v.toFixed(2)} />
          <Slider label="airframe mass" value={mass} min={0.4} max={3} step={0.05} onChange={setMass} format={(v) => v.toFixed(2) + ' kg'} />
          <div className="grid grid-cols-3 gap-1.5">
            <LabButton
              onClick={() => {
                wind.current.v.set((Math.random() - 0.5) * 14, 1.5, (Math.random() - 0.5) * 14);
                setTimeout(() => wind.current.v.set(0, 0, 0), 420);
              }}
              tone="myco"
            >
              gust
            </LabButton>
            <LabButton
              onClick={() => {
                setTarget(new THREE.Vector3((Math.random() - 0.5) * 7, 1 + Math.random() * 3.4, (Math.random() - 0.5) * 7));
                setData([]);
              }}
              tone="psy"
            >
              new waypoint
            </LabButton>
            <LabButton
              onClick={() => {
                setData([]);
                setVersion((v) => v + 1);
              }}
            >
              reset run
            </LabButton>
          </div>
          <Slider label="waypoint X" value={target.x} min={-5} max={5} step={0.1} onChange={(v) => setTarget(new THREE.Vector3(v, target.y, target.z))} format={(v) => v.toFixed(1) + ' m'} />
          <Slider label="waypoint Y" value={target.y} min={0.5} max={5} step={0.1} onChange={(v) => setTarget(new THREE.Vector3(target.x, v, target.z))} format={(v) => v.toFixed(1) + ' m'} />
          <Slider label="waypoint Z" value={target.z} min={-5} max={5} step={0.1} onChange={(v) => setTarget(new THREE.Vector3(target.x, target.y, v))} format={(v) => v.toFixed(1) + ' m'} />
        </div>
      }
      readouts={
        <>
          <Readout label="ωₙ (closed loop)" value={wn.toFixed(2) + ' rad/s'} tone="#67e8f9" />
          <Readout
            label="ζ (damping ratio)"
            value={zeta.toFixed(3)}
            tone={zeta > 0.55 && zeta < 1.1 ? '#6ee7a8' : '#ff6b1a'}
          />
          <Readout label="step overshoot" value={((Math.max(0, overshoot - 1)) * 100).toFixed(1) + '%'} />
          <Readout label="~settling time (±2%)" value={settle.toFixed(2) + ' s'} />
          <Readout label="live position error" value={(latest?.err ?? 0).toFixed(3) + ' m'} tone="#f5b301" />
          <div className="rounded-xl border border-[#f5b301]/25 bg-black/30 p-2">
            <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-[#f5b301]">
              analytic unit step response
            </div>
            <div className="h-[96px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={step}>
                  <CartesianGrid stroke="#3a2b2b" strokeDasharray="2 4" />
                  <XAxis dataKey="t" tick={{ fill: '#e0d3b8', fontSize: 8 }} stroke="#5a4423" />
                  <YAxis domain={[0, 1.6]} tick={{ fill: '#e0d3b8', fontSize: 8 }} stroke="#5a4423" width={26} />
                  <Tooltip contentStyle={{ background: '#1a0f04', border: '1px solid #5a4423', fontSize: 11 }} />
                  <RLine type="monotone" dataKey="y" stroke="#f5b301" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-xl border border-[#6ee7a8]/25 bg-black/30 p-2">
            <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-[#6ee7a8]">
              live tracking error (m)
            </div>
            <div className="h-[96px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid stroke="#1f4d3a" strokeDasharray="2 4" />
                  <XAxis dataKey="t" tick={{ fill: '#9fd9bb', fontSize: 8 }} stroke="#2f6b52" />
                  <YAxis tick={{ fill: '#9fd9bb', fontSize: 8 }} stroke="#2f6b52" width={28} />
                  <Tooltip contentStyle={{ background: '#08201a', border: '1px solid #2f6b52', fontSize: 11 }} />
                  <RLine type="monotone" dataKey="err" stroke="#6ee7a8" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="pt-1 text-[11px] leading-snug text-[#c9bde6]">
            Analytic curve assumes a unit-mass second-order plant: ζ = K_d / (2√K_p) and ωₙ = √K_p. Real airframes add
            delays, prop wash and actuator saturation — which is why the live 3D trace is a bit messier than the maths.
          </div>
        </>
      }
    >
      <Canvas shadows camera={{ position: [7.5, 5.6, 8.5], fov: 44 }} dpr={[1, 1.7]}>
        <color attach="background" args={['#0a0420']} />
        <fog attach="fog" args={['#0a0420', 14, 32]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[8, 14, 6]} intensity={1.3} castShadow />
        <pointLight position={[-6, 2, -6]} color="#6ee7a8" intensity={1.6} distance={22} />
        <Drone gains={gains} target={target} mass={mass} wind={wind.current} onSample={onSample} trail={trail} trailOn={trailOn} />
        <mesh position={[target.x, target.y, target.z]}>
          <torusGeometry args={[0.34, 0.028, 10, 40]} />
          <meshStandardMaterial color="#6ee7a8" emissive="#16a34a" emissiveIntensity={1.4} />
        </mesh>
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[9, 40]} />
          <meshStandardMaterial color="#120a2e" roughness={0.9} />
        </mesh>
        <gridHelper args={[18, 18, '#4338ca', '#1b1440']} position={[0, 0.01, 0]} />
        <OrbitControls enablePan target={[0, 1.6, 0]} maxPolarAngle={Math.PI / 2.05} minDistance={4} maxDistance={26} />
      </Canvas>
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-white/10 bg-black/50 px-2.5 py-1.5 font-mono text-[10px] text-[#c9bde6]">
        green torus = waypoint · green line = flown path
      </div>
    </LabFrame>
  );
}
