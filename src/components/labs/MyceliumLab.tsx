import { Canvas, useFrame } from '@react-three/fiber';
import { Line, OrbitControls } from '@react-three/drei';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { LineChart, Line as RLine, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { LabProps } from './LabFrame';
import { LabButton, LabFrame, Readout, Slider } from './LabFrame';

/* ==================================================================
   Space-colonisation growth of a mycelial network, then simulated
   electrical signalling along the hyphae.

   Honesty note carried into the UI: real fungal "action potential"
   spikes are measured at roughly 0.05–2 mV with durations of seconds
   to minutes and propagation on the order of mm/s to cm/min (Adamatzky
   et al.). The simulator is a time-lapse and its amplitude shape is a
   deliberately simplified model.
   ================================================================== */

interface Node {
  p: THREE.Vector3;
  parent: number;
  tip: boolean;
  order: number;
}
interface Edge {
  a: number;
  b: number;
  len: number;
}

function growNetwork(attractorCount: number, iterations: number, seed: number) {
  let s = seed;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  // soil hemisphere + a thin surface layer: hyphae explore a volume
  const attractors: THREE.Vector3[] = [];
  for (let i = 0; i < attractorCount; i++) {
    const r = 4.6 * Math.cbrt(rnd());
    const th = rnd() * Math.PI * 2;
    const ph = Math.acos(rnd());
    attractors.push(
      new THREE.Vector3(r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph) * 0.55 + 1.2, r * Math.sin(ph) * Math.sin(th)),
    );
  }

  const nodes: Node[] = [{ p: new THREE.Vector3(0, -0.35, 0), parent: -1, tip: true, order: 0 }];
  const seg = 0.34;
  const kill = 0.46;
  const influence = 1.5;

  for (let it = 0; it < iterations; it++) {
    const dirs = new Map<number, THREE.Vector3>();
    const counts = new Map<number, number>();
    const alive: boolean[] = new Array(attractors.length).fill(true);

    for (let ai = 0; ai < attractors.length; ai++) {
      let best = -1;
      let bestD = Infinity;
      for (let ni = 0; ni < nodes.length; ni++) {
        const d = nodes[ni].p.distanceTo(attractors[ai]);
        if (d < bestD) {
          bestD = d;
          best = ni;
        }
      }
      if (best >= 0 && bestD < influence) {
        const dir = attractors[ai].clone().sub(nodes[best].p).normalize();
        dirs.set(best, (dirs.get(best) ?? new THREE.Vector3()).add(dir));
        counts.set(best, (counts.get(best) ?? 0) + 1);
      }
    }

    const newNodes: Node[] = [];
    dirs.forEach((dir, ni) => {
      const n = counts.get(ni) ?? 1;
      const step = dir.clone().divideScalar(n).normalize();
      // slight helical wander gives the curly hyphal look
      const noise = new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(0.22);
      const p = nodes[ni].p.clone().add(step.add(noise).normalize().multiplyScalar(seg));
      nodes[ni].tip = false;
      newNodes.push({ p, parent: ni, tip: true, order: nodes[ni].order + 1 });
    });
    if (!newNodes.length) break;
    const base = nodes.length;
    nodes.push(...newNodes);
    // prune attractors consumed by the new growth
    for (let ai = 0; ai < attractors.length; ai++) {
      if (!alive[ai]) continue;
      for (let ni = base; ni < nodes.length; ni++) {
        if (nodes[ni].p.distanceTo(attractors[ai]) < kill) {
          alive[ai] = false;
          break;
        }
      }
    }
    const kept = attractors.filter((_, i) => alive[i]);
    attractors.length = 0;
    attractors.push(...kept);
    if (!attractors.length) break;
  }

  const edges: Edge[] = [];
  nodes.forEach((n, i) => {
    if (n.parent >= 0) edges.push({ a: n.parent, b: i, len: n.p.distanceTo(nodes[n.parent].p) });
  });
  // drop isolated tips (parent with no children beyond depth 1)
  return { nodes, edges };
}

function signalTimes(nodes: Node[], edges: Edge[], source: number, speed: number) {
  const adj: number[][] = nodes.map(() => []);
  edges.forEach((e) => {
    adj[e.a].push(e.b);
    adj[e.b].push(e.a);
  });
  const dist = new Array(nodes.length).fill(Infinity);
  dist[source] = 0;
  const queue = [source];
  while (queue.length) {
    const cur = queue.shift()!;
    for (const nx of adj[cur]) {
      const w = nodes[cur].p.distanceTo(nodes[nx].p);
      if (dist[cur] + w < dist[nx]) {
        dist[nx] = dist[cur] + w;
        queue.push(nx);
      }
    }
  }
  // scene units are centimetres; speed is mm/s
  const t = dist.map((d) => (isFinite(d) ? (d * 10) / speed : Infinity));
  return { dist, t };
}

function MyceliumScene({
  nodes,
  edges,
  times,
  tNow,
  electrode,
  showSignals,
}: {
  nodes: Node[];
  edges: Edge[];
  times: number[];
  tNow: number;
  electrode: number;
  showSignals: boolean;
}) {
  const lineGeoms = useMemo(() => {
    const segs: number[] = [];
    const colors: number[] = [];
    const c1 = new THREE.Color('#3f7f5c');
    const c2 = new THREE.Color('#6ee7a8');
    edges.forEach((e) => {
      const a = nodes[e.a].p;
      const b = nodes[e.b].p;
      segs.push(a.x, a.y, a.z, b.x, b.y, b.z);
      colors.push(c1.r, c1.g, c1.b, c2.r, c2.g, c2.b);
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(segs, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return g;
  }, [nodes, edges]);

  const activeNodes = useMemo(() => {
    if (!showSignals) return [] as number[];
    const out: number[] = [];
    for (let i = 0; i < times.length; i++) {
      const age = tNow - times[i];
      if (age > 0 && age < 26) out.push(i);
    }
    return out;
  }, [times, tNow, showSignals]);

  return (
    <group>
      <lineSegments geometry={lineGeoms}>
        <lineBasicMaterial vertexColors transparent opacity={0.85} />
      </lineSegments>

      {activeNodes.map((i) => {
        const age = tNow - times[i];
        const glow = Math.max(0, 1 - age / 26);
        const hue = (0.44 - glow * 0.34 + tNow * 0.008) % 1;
        return (
          <group key={i} position={nodes[i].p}>
            <mesh>
              <sphereGeometry args={[0.055 + glow * 0.09, 10, 10]} />
              <meshBasicMaterial color={new THREE.Color().setHSL(hue, 1, 0.5 + glow * 0.28)} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.12 + (1 - glow) * 0.36, 12, 12]} />
              <meshBasicMaterial
                color={new THREE.Color().setHSL(hue, 1, 0.62)}
                transparent
                opacity={0.14 * glow}
              />
            </mesh>
          </group>
        );
      })}

      {/* clickable tips */}
      {nodes.map((n, i) =>
        n.tip ? (
          <mesh
            key={`tip${i}`}
            position={n.p}
            onClick={(ev) => {
              ev.stopPropagation();
              (window as unknown as { __mycoInject?: (i: number) => void }).__mycoInject?.(i);
            }}
          >
            <sphereGeometry args={[0.13, 10, 10]} />
            <meshStandardMaterial color="#a3e635" emissive="#4d7c0f" emissiveIntensity={0.9} />
          </mesh>
        ) : null,
      )}

      {/* electrode */}
      <group position={nodes[electrode]?.p ?? new THREE.Vector3()}>
        <mesh>
          <cylinderGeometry args={[0.045, 0.045, 1.1, 8]} />
          <meshStandardMaterial color="#e0f2fe" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.62, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color="#67e8f9" emissive="#0891b2" emissiveIntensity={1.4} />
        </mesh>
      </group>

      <mesh position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[5.4, 48]} />
        <meshStandardMaterial color="#0f2e22" roughness={0.95} />
      </mesh>
      <gridHelper args={[12, 24, '#16a34a', '#0f3f2c']} position={[0, -0.68, 0]} />
    </group>
  );
}

/* ---------------- trippy living-field decorations ---------------- */

function BreathLight() {
  const ref = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.intensity = 1.6 + Math.sin(clock.elapsedTime * 0.7) * 0.8;
  });
  return <pointLight ref={ref} position={[-4, 3, -4]} color="#67e8f9" intensity={2} distance={20} />;
}

function Spores({ count = 260, radius = 6 }: { count?: number; radius?: number }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = radius * Math.cbrt(Math.random());
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(Math.random());
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = Math.random() * 6 - 0.4;
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count, radius]);

  useFrame(({ clock }, delta) => {
    const pos = geo.getAttribute('position') as THREE.BufferAttribute;
    const t = clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) + delta * (0.05 + (i % 7) * 0.012);
      if (y > 6) y = -0.4;
      pos.setY(i, y);
      pos.setX(i, pos.getX(i) + Math.sin(t * 0.4 + i) * delta * 0.05);
    }
    pos.needsUpdate = true;
    if (ref.current) ref.current.rotation.y = t * 0.02;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.035} color="#a3e635" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

/** Holographic concentric substrate rings with a slow breathing scan. */
function HyperGrid() {
  const scan = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (scan.current) {
      const r = 0.4 + ((clock.elapsedTime * 0.55) % 5);
      scan.current.scale.setScalar(r);
      (scan.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.35 - r * 0.06);
    }
  });
  return (
    <group position={[0, -0.66, 0]}>
      {[1.2, 2.4, 3.6, 4.8, 5.8].map((r) => (
        <mesh key={r} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r, 0.008, 6, 96]} />
          <meshBasicMaterial color="#6ee7a8" transparent opacity={0.22} />
        </mesh>
      ))}
      <mesh ref={scan} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.02, 6, 96]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.3} />
      </mesh>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} rotation={[0, -a, 0]}>
            <boxGeometry args={[0.006, 0.006, 11.6]} />
            <meshBasicMaterial color="#8b5cf6" transparent opacity={0.16} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function MyceliumLab({ tasks }: LabProps) {
  const [density, setDensity] = useState(320);
  const [iterations, setIterations] = useState(46);
  const [seed, setSeed] = useState(7);
  const [speed, setSpeed] = useState(6); // mm/s
  const [showSignals, setShowSignals] = useState(true);
  const [source, setSource] = useState(0);
  const [electrode, setElectrode] = useState(1);
  const [running, setRunning] = useState(true);
  const [tNow, setTNow] = useState(0);
  const traceRef = useRef<{ t: number; mv: number }[]>([]);
  const [trace, setTrace] = useState<{ t: number; mv: number }[]>([]);
  const raf = useRef<number>(0);
  const lastTs = useRef<number>(0);

  const { nodes, edges } = useMemo(() => growNetwork(density, iterations, seed), [density, iterations, seed]);

  const tips = useMemo(() => nodes.map((n, i) => (n.tip ? i : -1)).filter((i) => i >= 0), [nodes]);

  useEffect(() => {
    // electrode defaults to a deep node, not the root
    const far = nodes.reduce((best, n, i) => (i > 0 && n.p.y > nodes[best].p.y ? i : best), 0);
    setElectrode(far);
  }, [nodes]);

  useEffect(() => {
    if (tips.length) setSource(tips[Math.floor(tips.length / 2)]);
  }, [tips]);

  const { dist, t } = useMemo(() => signalTimes(nodes, edges, source, speed), [nodes, edges, source, speed]);

  useEffect(() => {
    (window as unknown as { __mycoInject?: (i: number) => void }).__mycoInject = (i: number) => {
      setSource(i);
      setTNow(0);
      traceRef.current = [];
      setTrace([]);
    };
    return () => {
      delete (window as unknown as { __mycoInject?: (i: number) => void }).__mycoInject;
    };
  }, []);

  const inject = useCallback(() => {
    const tip = tips[Math.floor(Math.random() * tips.length)];
    setSource(tip ?? 0);
    setTNow(0);
    traceRef.current = [];
    setTrace([]);
  }, [tips]);

  // simulation loop — 20x time-lapse so millimetre-per-second signalling is watchable
  useEffect(() => {
    if (!running) return;
    const loop = (ts: number) => {
      const dt = lastTs.current ? Math.min(0.06, (ts - lastTs.current) / 1000) : 0.016;
      lastTs.current = ts;
      setTNow((prev) => {
        const next = prev + dt * 20;
        // sample the electrode: one spike per arrival, then refractory
        const arr = t[electrode];
        if (isFinite(arr)) {
          const age = next - arr;
          if (age >= 0 && age < 40) {
            // two-exponential spike, ~1.2 mV peak
            const mv = 1.2 * (Math.exp(-age / 1.6) - Math.exp(-age / 0.35));
            const tr = traceRef.current;
            const tSec = Math.round(next * 10) / 10;
            if (!tr.length || tr[tr.length - 1].t !== tSec) {
              tr.push({ t: tSec, mv: Math.round(mv * 1000) / 1000 });
              if (tr.length > 90) tr.shift();
              setTrace([...tr]);
            }
          }
        }
        return next;
      });
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [running, t, electrode]);

  const totalLength = useMemo(() => edges.reduce((a, e) => a + e.len, 0), [edges]);
  const maxDist = useMemo(() => Math.max(...dist.filter((d) => isFinite(d)), 0), [dist]);
  const delay = t[electrode];

  return (
    <LabFrame
      labId="mycelium"
      title="Living Circuit: Mycelial Network & Fungal Signalling"
      brief="Grow a hyphal network with the space-colonisation algorithm used to model real fungal foraging, then inject nutrient at a tip and watch the excitation propagate. Amber-green nodes are firing; the cyan probe is your measurement electrode. Real fungal spikes are ~0.05–2 mV over seconds to minutes and travel at mm/s — this sim runs at 20x time-lapse, so treat the numbers as a model, not a measurement."
      tone="myco"
      tasks={tasks}
      controls={
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            <LabButton onClick={inject} tone="myco">
              inject nutrient
            </LabButton>
            <LabButton onClick={() => setRunning((r) => !r)} active={running}>
              {running ? 'pause' : 'run'}
            </LabButton>
            <LabButton onClick={() => setSeed((s) => s + 1)} tone="psy">
              new substrate
            </LabButton>
            <LabButton onClick={() => setShowSignals((v) => !v)} active={showSignals} tone="psy">
              signal glow
            </LabButton>
          </div>
          <Slider label="attractant density" value={density} min={120} max={700} step={20} onChange={setDensity} />
          <Slider label="growth iterations" value={iterations} min={14} max={80} onChange={setIterations} />
          <Slider
            label="propagation speed"
            value={speed}
            min={0.5}
            max={30}
            step={0.5}
            onChange={setSpeed}
            format={(v) => v.toFixed(1) + ' mm/s'}
          />
          <div className="text-[11px] leading-snug text-[#9fd9bb]">
            Click any glowing tip in the 3D view to inject there and re-measure.
          </div>
        </div>
      }
      readouts={
        <>
          <Readout label="hyphal nodes" value={String(nodes.length)} tone="#6ee7a8" />
          <Readout label="edge segments" value={String(edges.length)} tone="#6ee7a8" />
          <Readout label="total hyphal length" value={totalLength.toFixed(1) + ' cm'} />
          <Readout label="furthest reach" value={maxDist.toFixed(2) + ' cm'} />
          <Readout
            label="delay to electrode"
            value={isFinite(delay) ? delay.toFixed(1) + ' s' : 'not connected'}
            tone={isFinite(delay) ? '#ffe9a8' : '#ff6b1a'}
          />
          <Readout label="sim clock (20x)" value={tNow.toFixed(1) + ' s'} />
          <div className="rounded-xl border border-[#6ee7a8]/25 bg-black/30 p-2">
            <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-[#6ee7a8]">
              electrode potential (mV, model)
            </div>
            <div className="h-[110px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trace}>
                  <CartesianGrid stroke="#1f4d3a" strokeDasharray="2 4" />
                  <XAxis dataKey="t" tick={{ fill: '#9fd9bb', fontSize: 9 }} stroke="#2f6b52" />
                  <YAxis domain={[-0.2, 1.4]} tick={{ fill: '#9fd9bb', fontSize: 9 }} stroke="#2f6b52" width={26} />
                  <Tooltip
                    contentStyle={{ background: '#08201a', border: '1px solid #2f6b52', fontSize: 11 }}
                    labelStyle={{ color: '#9fd9bb' }}
                  />
                  <RLine type="monotone" dataKey="mv" stroke="#6ee7a8" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="pt-1 text-[11px] leading-snug text-[#c9bde6]">
            Spike shape is a difference of exponentials peaking at ~1.2 mV — inside the range reported for
            <em> Pleurotus</em> and <em>Ganoderma</em> mycelium, but simplified. Increasing temperature raises
            real conduction velocity until proteins denature (roughly above 35 °C).
          </div>
        </>
      }
    >
      <Canvas camera={{ position: [6, 5.2, 7.5], fov: 46 }} dpr={[1, 1.7]}>
        <color attach="background" args={['#04120d']} />
        <fog attach="fog" args={['#04120d', 10, 26]} />
        <ambientLight intensity={0.55} />
        <BreathLight />
        <pointLight position={[3, 6, 3]} color="#6ee7a8" intensity={2.4} distance={18} />
        <pointLight position={[-4, 2, -3]} color="#a3e635" intensity={1.2} distance={16} />
        <MyceliumScene nodes={nodes} edges={edges} times={t} tNow={tNow} electrode={electrode} showSignals={showSignals} />
        <Spores />
        <HyperGrid />
        <OrbitControls enablePan target={[0, 1.2, 0]} minDistance={3} maxDistance={22} />
      </Canvas>
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-[#6ee7a8]/20 bg-black/50 px-2.5 py-1.5 font-mono text-[10px] text-[#9fd9bb]">
        click a lime tip to inject · drag to orbit
      </div>
    </LabFrame>
  );
}
