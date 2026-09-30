import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { LabProps } from './LabFrame';
import { LabButton, LabFrame, Readout, Slider } from './LabFrame';

/* ==================================================================
   A three-stage spur gear train. Ratios, reflected inertia and the
   torque/speed trade are computed from the tooth counts.
   ================================================================== */

function Gear({
  teeth,
  module: m,
  angle,
  thickness,
  color,
}: {
  teeth: number;
  module: number;
  angle: number;
  thickness: number;
  color: string;
}) {
  const pitchR = (m * teeth) / 2;
  const outerR = pitchR + m;
  const rootR = pitchR - 1.25 * m;
  const toothW = (Math.PI * m) / 2.1;

  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (group.current) group.current.rotation.y = angle;
  });

  const teethMeshes = useMemo(
    () =>
      Array.from({ length: teeth }, (_, i) => {
        const a = (i / teeth) * Math.PI * 2;
        return { a, key: i };
      }),
    [teeth],
  );

  return (
    <group ref={group}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[pitchR, pitchR, thickness, Math.max(24, teeth * 2)]} />
        <meshStandardMaterial color={color} metalness={0.85} roughness={0.3} />
      </mesh>
      {teethMeshes.map(({ a, key }) => (
        <mesh
          key={key}
          position={[Math.cos(a) * (pitchR + m * 0.45), 0, Math.sin(a) * (pitchR + m * 0.45)]}
          rotation={[0, -a, 0]}
        >
          <boxGeometry args={[toothW, thickness, m * 1.5]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.35} />
        </mesh>
      ))}
      {/* hub + bore */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[Math.max(0.16, pitchR * 0.3), Math.max(0.16, pitchR * 0.3), thickness * 1.5, 20]} />
        <meshStandardMaterial color="#3a2b2b" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[rootR * 0.92, rootR * 0.92, thickness * 0.35, Math.max(20, teeth)]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.25} />
      </mesh>
      {/* pitch circle */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[pitchR, 0.008, 6, 64]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

function Train({
  teeth,
  rpm,
  torque,
  animate,
}: {
  teeth: number[];
  rpm: number;
  torque: number;
  animate: boolean;
}) {
  const m = 0.16;
  const phase = useRef(0);
  const [angles, setAngles] = useState([0, 0, 0]);
  const radii = teeth.map((t) => (m * t) / 2);

  // positions along X so consecutive gears mesh at the pitch circles
  const pos = useMemo(() => {
    const out: [number, number, number][] = [[0, 1.1, 0]];
    for (let i = 1; i < teeth.length; i++) {
      out.push([out[i - 1][0] + radii[i - 1] + radii[i], 1.1, 0]);
    }
    return out;
  }, [teeth, radii]);

  const signs = useMemo(() => {
    const s = [1];
    for (let i = 1; i < teeth.length; i++) s.push(-s[i - 1]);
    return s;
  }, [teeth]);

  const ratioTo = useMemo(() => {
    const out = [1];
    for (let i = 1; i < teeth.length; i++) out.push(out[i - 1] * (teeth[i - 1] / teeth[i]));
    return out;
  }, [teeth]);

  useFrame((_, delta) => {
    if (!animate) return;
    const dt = Math.min(0.033, delta);
    phase.current += dt * rpm * 0.02; // visual scaling
    const base = phase.current;
    setAngles(teeth.map((_, i) => signs[i] * base * Math.abs(ratioTo[i]) + (i > 0 ? Math.PI / teeth[i] : 0)));
  });

  const colourFor = (i: number) => ['#c96f2b', '#f5b301', '#e0f2fe'][i % 3];
  const totalRatio = ratioTo[ratioTo.length - 1];
  const eff = Math.pow(0.975, teeth.length - 1);

  return (
    <group>
      {/* base plate */}
      <mesh position={[(pos[0][0] + pos[pos.length - 1][0]) / 2, 0.55, 0]} receiveShadow>
        <boxGeometry args={[pos[pos.length - 1][0] + 2.4, 0.16, 2.6]} />
        <meshStandardMaterial color="#1b1440" metalness={0.6} roughness={0.5} />
      </mesh>
      {pos.map((p, i) => (
        <group key={i} position={p}>
          <Gear teeth={teeth[i]} module={m} angle={angles[i]} thickness={0.34} color={colourFor(i)} />
          {/* shaft */}
          <mesh position={[0, -0.55, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 1.1, 12]} />
            <meshStandardMaterial color="#8c82a8" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* bearing block */}
          <mesh position={[0, -1.03, 0]}>
            <boxGeometry args={[0.46, 0.24, 0.6]} />
            <meshStandardMaterial color="#3a2b2b" metalness={0.7} roughness={0.4} />
          </mesh>
        </group>
      ))}
      {/* input crank marker */}
      <mesh position={[0, 1.1, 0.42]}>
        <boxGeometry args={[0.1, 0.1, 0.3]} />
        <meshStandardMaterial color="#ff6b1a" emissive="#c1121f" emissiveIntensity={0.6} />
      </mesh>
      {/* load disc on output */}
      <mesh position={[pos[pos.length - 1][0], 1.1, 0]}>
        <torusGeometry args={[radii[radii.length - 1] + 0.34, 0.05, 8, 40]} />
        <meshStandardMaterial color="#6ee7a8" emissive="#16a34a" emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[pos[pos.length - 1][0] + 1.9, 1.1, 0]}>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial color="#c026d3" metalness={0.6} roughness={0.35} />
      </mesh>
      <Line
        points={[
          new THREE.Vector3(pos[pos.length - 1][0], 1.1, 0),
          new THREE.Vector3(pos[pos.length - 1][0] + 1.9, 1.1, 0),
        ]}
        color="#6ee7a8"
        lineWidth={3}
      />
      <group />
      <mesh position={[(pos[0][0] + pos[pos.length - 1][0]) / 2, 1.1, 0]} visible={false}>
        <boxGeometry args={[0.01, 0.01, 0.01]} />
      </mesh>
      <group />
      {/* hidden carrier for readouts */}
      <group userData={{ totalRatio, eff, torque: torque * totalRatio * eff }} />
    </group>
  );
}

export default function GearTrainLab({ tasks }: LabProps) {
  const [t1, setT1] = useState(12);
  const [t2, setT2] = useState(36);
  const [t3, setT3] = useState(48);
  const [rpm, setRpm] = useState(1200);
  const [torque, setTorque] = useState(0.12);
  const [animate, setAnimate] = useState(true);

  const teeth = [t1, t2, t3];
  const ratio = teeth.reduce((a, t, i) => (i === 0 ? 1 : a * (teeth[i - 1] / t)), 1);
  const eff = Math.pow(0.975, 2);
  const outRpm = rpm * ratio;
  const outTorque = torque / ratio * eff;
  const reflectedInertia = 1 / (ratio * ratio);

  return (
    <LabFrame
      labId="gear-train"
      title="Gear Train & the Torque–Speed Trade"
      brief="Three spur gears in series. Gears never create power — they trade speed for torque, and every mesh costs you a little to friction. Change the tooth counts and watch the output shaft slow down and twist harder. Note the reflected inertia: the motor feels the load divided by the square of the ratio, which is why high-ratio gearboxes make cheap motors feel strong."
      tasks={tasks}
      controls={
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            <LabButton onClick={() => setAnimate((v) => !v)} active={animate}>
              {animate ? 'pause' : 'run'}
            </LabButton>
            <LabButton
              onClick={() => {
                setT1(12);
                setT2(36);
                setT3(48);
              }}
            >
              12 : 36 : 48
            </LabButton>
            <LabButton
              onClick={() => {
                setT1(20);
                setT2(20);
                setT3(20);
              }}
            >
              1:1 idler
            </LabButton>
            <LabButton
              onClick={() => {
                setT1(8);
                setT2(60);
                setT3(60);
              }}
              tone="psy"
            >
              high reduction
            </LabButton>
          </div>
          <Slider label="gear 1 teeth" value={t1} min={8} max={60} onChange={setT1} />
          <Slider label="gear 2 teeth" value={t2} min={8} max={60} onChange={setT2} />
          <Slider label="gear 3 teeth" value={t3} min={8} max={60} onChange={setT3} />
          <Slider label="input speed" value={rpm} min={60} max={6000} step={20} onChange={setRpm} format={(v) => v + ' rpm'} />
          <Slider label="input torque" value={torque} min={0.01} max={1.2} step={0.01} onChange={setTorque} format={(v) => v.toFixed(2) + ' N·m'} />
        </div>
      }
      readouts={
        <>
          <Readout label="overall ratio" value={`1 : ${(1 / ratio).toFixed(2)}`} tone="#f5b301" />
          <Readout label="stage ratios" value={`${(t1 / t2).toFixed(2)} × ${(t2 / t3).toFixed(2)}`} />
          <Readout label="output speed" value={outRpm.toFixed(1) + ' rpm'} tone="#67e8f9" />
          <Readout label="output torque" value={outTorque.toFixed(3) + ' N·m'} tone="#f5b301" />
          <Readout label="output power" value={((2 * Math.PI * outRpm * outTorque) / 60).toFixed(2) + ' W'} />
          <Readout label="mesh efficiency" value={(eff * 100).toFixed(1) + '%'} />
          <Readout label="reflected inertia factor" value={reflectedInertia.toExponential(2)} tone="#6ee7a8" />
          <div className="pt-1 text-[11px] leading-snug text-[#c9bde6]">
            Two meshes at 97.5% each gives ≈95% overall. Real spur stages run 97–99%; worm drives can drop to 40–70%
            but are self-locking. The idler gear reverses direction without changing the ratio — useful for layout,
            useless for speed reduction.
          </div>
        </>
      }
    >
      <Canvas shadows camera={{ position: [3.6, 4.4, 7.6], fov: 42 }} dpr={[1, 1.7]}>
        <color attach="background" args={['#0a0420']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[6, 12, 6]} intensity={1.5} castShadow />
        <pointLight position={[-5, 3, -4]} color="#c026d3" intensity={1.8} distance={20} />
        <pointLight position={[5, 2, 4]} color="#ff6b1a" intensity={1.2} distance={16} />
        <Train teeth={teeth} rpm={rpm} torque={torque} animate={animate} />
        <mesh position={[0, -1.3, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <meshStandardMaterial color="#120a2e" roughness={0.95} />
        </mesh>
        <OrbitControls enablePan target={[3.2, 1.1, 0]} minDistance={4} maxDistance={22} />
      </Canvas>
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-white/10 bg-black/50 px-2.5 py-1.5 font-mono text-[10px] text-[#c9bde6]">
        orange = input · gold = idler · white = output · cyan ring = pitch circle
      </div>
    </LabFrame>
  );
}
