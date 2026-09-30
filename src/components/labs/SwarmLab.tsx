import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { LabProps } from './LabFrame';
import { LabButton, LabFrame, Readout, Slider, Toggle } from './LabFrame';

/* ==================================================================
   Reynolds boids with the three classic steering rules, plus optional
   formation goals. Runs at a fixed 60 Hz substep.
   ================================================================== */

interface Boid {
  p: THREE.Vector3;
  v: THREE.Vector3;
}

const BOUND = 9;

function Flock({
  params,
  running,
  mode,
  showLinks,
  onMetrics,
}: {
  params: { sep: number; ali: number; coh: number; speed: number; perception: number; sepRadius: number };
  running: boolean;
  mode: 'flock' | 'ring' | 'grid' | 'predator';
  showLinks: boolean;
  onMetrics: (m: { speed: number; spread: number; alignment: number }) => void;
}) {
  const COUNT = 90;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const lineRef = useRef<THREE.LineSegments>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const acc = useRef(0);
  const predator = useRef(new THREE.Vector3(8, 4, 8));

  const boids = useMemo<Boid[]>(() => {
    let s = 42;
    const rnd = () => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };
    return Array.from({ length: COUNT }, () => ({
      p: new THREE.Vector3((rnd() - 0.5) * 8, (rnd() - 0.5) * 6, (rnd() - 0.5) * 8),
      v: new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize().multiplyScalar(2.5),
    }));
  }, []);

  const lineGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(COUNT * 6), 3));
    return g;
  }, []);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(0.033, delta);
    if (!running) {
      // keep rendering current state
    } else {
      const { sep, ali, coh, speed, perception, sepRadius } = params;
      const step = mode === 'predator' ? 2 : 1;
      for (let i = 0; i < COUNT; i++) {
        const b = boids[i];
        const sepV = new THREE.Vector3();
        const aliV = new THREE.Vector3();
        const cohV = new THREE.Vector3();
        const goal = new THREE.Vector3();
        let nSep = 0;
        let nAli = 0;
        let nCoh = 0;

        for (let j = 0; j < COUNT; j++) {
          if (i === j) continue;
          const d = b.p.distanceTo(boids[j].p);
          if (d < sepRadius && d > 1e-4) {
            sepV.add(b.p.clone().sub(boids[j].p).divideScalar(d * d));
            nSep++;
          }
          if (d < perception) {
            aliV.add(boids[j].v);
            cohV.add(boids[j].p);
            nAli++;
            nCoh++;
          }
        }
        if (nSep) sepV.divideScalar(nSep);
        if (nAli) aliV.divideScalar(nAli);
        if (nCoh) cohV.divideScalar(nCoh).sub(b.p);

        if (mode === 'ring') {
          const r = Math.sqrt(b.p.x * b.p.x + b.p.z * b.p.z) || 1e-3;
          const targ = new THREE.Vector3((b.p.x / r) * 6, Math.sin(clock.elapsedTime * 0.6 + r) * 1.2, (b.p.z / r) * 6);
          goal.copy(targ.sub(b.p)).multiplyScalar(1.4);
        } else if (mode === 'grid') {
          const gx = Math.round(b.p.x / 3) * 3;
          const gz = Math.round(b.p.z / 3) * 3;
          const gy = Math.round(b.p.y / 3) * 3;
          goal.set(gx - b.p.x, gy - b.p.y, gz - b.p.z).multiplyScalar(1.1);
        } else if (mode === 'predator') {
          const away = b.p.clone().sub(predator.current);
          const d = away.length();
          if (d < 5) goal.copy(away.normalize().multiplyScalar((5 - d) * 4));
        }

        const steer = new THREE.Vector3()
          .addScaledVector(sepV, sep)
          .addScaledVector(aliV, ali * 0.45)
          .addScaledVector(cohV, coh)
          .addScaledVector(goal, 1.2);

        b.v.addScaledVector(steer, dt * step);
        // clamp speed
        const sp = b.v.length();
        const maxSp = params.speed;
        if (sp > maxSp) b.v.multiplyScalar(maxSp / sp);
        if (sp < 0.6) b.v.multiplyScalar(0.6 / Math.max(sp, 1e-3));
        b.p.addScaledVector(b.v, dt);

        // soft spherical confinement
        const r = b.p.length();
        if (r > BOUND) {
          const inward = b.p.clone().normalize().multiplyScalar(-(r - BOUND) * 3);
          b.v.addScaledVector(inward, dt * 4);
          b.p.setLength(BOUND);
        }
      }
      // predator wanders
      if (mode === 'predator') {
        predator.current.set(
          Math.sin(clock.elapsedTime * 0.45) * 8,
          Math.sin(clock.elapsedTime * 0.7) * 3.2,
          Math.cos(clock.elapsedTime * 0.33) * 8,
        );
      }
    }

    // draw
    if (meshRef.current) {
      for (let i = 0; i < COUNT; i++) {
        const b = boids[i];
        dummy.position.copy(b.p);
        const look = b.p.clone().add(b.v);
        dummy.lookAt(look);
        const s = 0.16;
        dummy.scale.set(s, s, s * 2.4);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
      const col = new THREE.Color();
      for (let i = 0; i < COUNT; i++) {
        const sp = boids[i].v.length() / Math.max(0.5, params.speed);
        col.setHSL(0.78 - sp * 0.32, 0.85, 0.45 + sp * 0.2);
        meshRef.current.setColorAt(i, col);
      }
      if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    }

    if (lineRef.current && showLinks) {
      const pos = lineRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
      let k = 0;
      for (let i = 0; i < COUNT && k < COUNT * 2 - 1; i += 2) {
        const a = boids[i];
        const b = boids[i + 1];
        pos.setXYZ(k++, a.p.x, a.p.y, a.p.z);
        pos.setXYZ(k++, b.p.x, b.p.y, b.p.z);
      }
      for (; k < COUNT; k++) pos.setXYZ(k, 0, 0, 0);
      pos.needsUpdate = true;
      lineRef.current.geometry.setDrawRange(0, COUNT);
    }

    acc.current += dt;
    if (acc.current > 0.35) {
      acc.current = 0;
      const centre = new THREE.Vector3();
      boids.forEach((b) => centre.add(b.p));
      centre.divideScalar(COUNT);
      let spread = 0;
      let align = 0;
      boids.forEach((b) => {
        spread += b.p.distanceTo(centre);
        align += b.v.clone().normalize().dot(new THREE.Vector3(0, 0, 1));
      });
      onMetrics({
        speed: boids.reduce((a, b) => a + b.v.length(), 0) / COUNT,
        spread: spread / COUNT,
        alignment: Math.abs(align / COUNT),
      });
    }
  });

  return (
    <group>
      <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
        <coneGeometry args={[0.5, 1.4, 6]} />
        <meshStandardMaterial metalness={0.6} roughness={0.3} emissiveIntensity={0.4} />
      </instancedMesh>
      {showLinks && (
        <lineSegments ref={lineRef} geometry={lineGeom}>
          <lineBasicMaterial color="#c026d3" transparent opacity={0.35} />
        </lineSegments>
      )}
      <mesh>
        <sphereGeometry args={[BOUND, 26, 18]} />
        <meshBasicMaterial color="#4338ca" wireframe transparent opacity={0.09} />
      </mesh>
    </group>
  );
}

export default function SwarmLab({ tasks }: LabProps) {
  const [sep, setSep] = useState(1.6);
  const [ali, setAli] = useState(1.0);
  const [coh, setCoh] = useState(0.7);
  const [speed, setSpeed] = useState(5);
  const [perception, setPerception] = useState(3.0);
  const [sepRadius, setSepRadius] = useState(1.4);
  const [running, setRunning] = useState(true);
  const [mode, setMode] = useState<'flock' | 'ring' | 'grid' | 'predator'>('flock');
  const [showLinks, setShowLinks] = useState(false);
  const [metrics, setMetrics] = useState({ speed: 0, spread: 0, alignment: 0 });

  const order = metrics.speed > 0 ? Math.min(1, metrics.alignment) : 0;

  return (
    <LabFrame
      labId="swarm"
      title="Swarm Bench: Reynolds Boids & Emergent Order"
      brief="Ninety agents, three steering rules, no leader. Separation pushes apart, alignment matches neighbours' headings, cohesion pulls to the local centroid. This is the algorithmic skeleton behind drone light shows, warehouse fleets and stigmergic construction — scale comes from rules, not from a central planner."
      tone="psy"
      tasks={tasks}
      controls={
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            <LabButton onClick={() => setRunning((r) => !r)} active={running}>
              {running ? 'pause' : 'run'}
            </LabButton>
            {(['flock', 'ring', 'grid', 'predator'] as const).map((m) => (
              <LabButton key={m} onClick={() => setMode(m)} active={mode === m} tone="psy">
                {m}
              </LabButton>
            ))}
          </div>
          <Slider label="separation weight" value={sep} min={0} max={5} step={0.1} onChange={setSep} format={(v) => v.toFixed(1)} />
          <Slider label="alignment weight" value={ali} min={0} max={5} step={0.1} onChange={setAli} format={(v) => v.toFixed(1)} />
          <Slider label="cohesion weight" value={coh} min={0} max={5} step={0.1} onChange={setCoh} format={(v) => v.toFixed(1)} />
          <Slider label="perception radius" value={perception} min={1} max={7} step={0.1} onChange={setPerception} format={(v) => v.toFixed(1) + ' m'} />
          <Slider label="separation radius" value={sepRadius} min={0.5} max={3} step={0.1} onChange={setSepRadius} format={(v) => v.toFixed(1) + ' m'} />
          <Slider label="max speed" value={speed} min={1} max={12} step={0.5} onChange={setSpeed} format={(v) => v.toFixed(1) + ' m/s'} />
          <Toggle label="draw neighbour links" on={showLinks} onClick={() => setShowLinks((v) => !v)} />
        </div>
      }
      readouts={
        <>
          <Readout label="agents" value="90" tone="#f5c8ff" />
          <Readout label="mean speed" value={metrics.speed.toFixed(2) + ' m/s'} />
          <Readout label="mean spread" value={metrics.spread.toFixed(2) + ' m'} />
          <Readout label="order parameter" value={order.toFixed(3)} tone={order > 0.7 ? '#6ee7a8' : '#f5b301'} />
          <div className="pt-1 text-[11px] leading-snug text-[#c9bde6]">
            The order parameter is the mean alignment of headings with +Z: near 1 means the flock is polarised like a
            bird murmuration, near 0 means it is gas-like. Try raising alignment with separation at zero — the flock
            collapses into a single clump. Real drone swarms add collision cones and geofences on top of these rules
            because pure boids will happily fly through each other.
          </div>
        </>
      }
    >
      <Canvas camera={{ position: [14, 10, 16], fov: 45 }} dpr={[1, 1.7]}>
        <color attach="background" args={['#0a0420']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[8, 14, 6]} intensity={1.2} />
        <pointLight position={[-8, 4, -8]} color="#c026d3" intensity={2} distance={28} />
        <Flock
          params={{ sep, ali, coh, speed, perception, sepRadius }}
          running={running}
          mode={mode}
          showLinks={showLinks}
          onMetrics={setMetrics}
        />
        <OrbitControls enablePan target={[0, 0, 0]} minDistance={6} maxDistance={44} />
      </Canvas>
    </LabFrame>
  );
}
