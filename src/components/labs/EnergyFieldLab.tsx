import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { BarChart, Bar as RBar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import type { LabProps } from './LabFrame';
import { LabButton, LabFrame, Readout, Slider, Toggle } from './LabFrame';

/* ==================================================================
   Energy frontier bench.

   Every number here is computed from a stated physical model and the
   models are deliberately honest about how little power most exotic
   harvesting actually yields. The point of the lab is that students
   leave knowing orders of magnitude, not vibes.
   ================================================================== */

type Mode = 'atmospheric' | 'geothermal' | 'isotope' | 'solar' | 'kinetic';

const POWER_BARS = [
  { name: 'atmos.', w: 2e-6, color: '#67e8f9' },
  { name: 'telluric', w: 5e-5, color: '#4338ca' },
  { name: 'piezo shoe', w: 5e-3, color: '#f5b301' },
  { name: 'plant MFC', w: 1e-4, color: '#6ee7a8' },
  { name: 'TEG 100K', w: 5, color: '#ff6b1a' },
  { name: 'solar 1 m²', w: 200, color: '#ffd166' },
  { name: 'Li-ion 1 kg', w: 250, color: '#c026d3' },
  { name: 'MMRTG', w: 110, color: '#e0f2fe' },
];

function Particles({ rate, height }: { rate: number; height: number }) {
  const ref = useRef<THREE.Points>(null);
  const N = 400;
  const geo = useMemo(() => {
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 1] = Math.random() * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  useFrame((_, delta) => {
    const pos = geo.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < N; i++) {
      let y = pos.getY(i) + delta * 0.6 * Math.min(6, rate);
      if (y > height) y = 0;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
    if (ref.current) ref.current.rotation.y += delta * 0.05;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.055} color="#67e8f9" transparent opacity={0.75} />
    </points>
  );
}

function ModeScene({ mode, field, depth, glow }: { mode: Mode; field: number; depth: number; glow: number }) {
  const heat = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (heat.current) heat.current.intensity = glow * (2.4 + Math.sin(clock.elapsedTime * 3) * 0.5);
  });
  return (
    <group>
      {mode === 'atmospheric' && (
        <>
          <mesh position={[0, 4, 0]}>
            <cylinderGeometry args={[0.07, 0.12, 8, 12]} />
            <meshStandardMaterial color="#8c82a8" metalness={0.9} roughness={0.25} />
          </mesh>
          <mesh position={[0, 8.1, 0]}>
            <sphereGeometry args={[0.34, 20, 20]} />
            <meshStandardMaterial color="#67e8f9" emissive="#0891b2" emissiveIntensity={1.6} />
          </mesh>
          <Particles rate={field / 40} height={8} />
          <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[7, 44]} />
            <meshStandardMaterial color="#0f2e22" roughness={0.95} />
          </mesh>
        </>
      )}
      {mode === 'geothermal' && (
        <>
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh key={i} position={[0, -0.6 - i * 0.9, 0]}>
              <boxGeometry args={[7, 0.86, 7]} />
              <meshStandardMaterial
                color={new THREE.Color().setHSL(0.08 - i * 0.02, 0.85, 0.1 + i * 0.075).getStyle()}
                roughness={0.9}
              />
            </mesh>
          ))}
          <mesh position={[0, -5.4, 0]}>
            <boxGeometry args={[7.4, 0.9, 7.4]} />
            <meshStandardMaterial color="#ff2fb9" emissive="#c1121f" emissiveIntensity={2} />
          </mesh>
          <pointLight ref={heat} position={[0, -5, 0]} color="#ff6b1a" intensity={2.4} distance={16} />
          {/* borehole + TEG stack */}
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 11, 12]} />
            <meshStandardMaterial color="#e0f2fe" metalness={0.85} roughness={0.2} />
          </mesh>
          {Array.from({ length: Math.max(1, Math.round(depth / 20)) }).slice(0, 8).map((_, i) => (
            <mesh key={i} position={[0, 1.1 + i * 0.34, 0]}>
              <boxGeometry args={[0.9, 0.26, 0.9]} />
              <meshStandardMaterial color="#c026d3" emissive="#7c3aed" emissiveIntensity={0.7} metalness={0.6} />
            </mesh>
          ))}
        </>
      )}
      {mode === 'isotope' && (
        <>
          <mesh position={[0, 1.6, 0]}>
            <cylinderGeometry args={[0.9, 0.9, 2.4, 28]} />
            <meshStandardMaterial color="#f5b301" emissive="#ff6b1a" emissiveIntensity={glow} metalness={0.7} roughness={0.3} />
          </mesh>
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 1.6, 1.6, Math.sin(a) * 1.6]} rotation={[0, -a, 0]}>
                <boxGeometry args={[0.9, 2.4, 0.05]} />
                <meshStandardMaterial color="#8c82a8" metalness={0.9} roughness={0.25} />
              </mesh>
            );
          })}
          <mesh position={[0, 3.1, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.4, 20]} />
            <meshStandardMaterial color="#3a2b2b" metalness={0.8} />
          </mesh>
          <pointLight position={[0, 1.6, 0]} color="#ff6b1a" intensity={glow * 5} distance={14} />
        </>
      )}
      {mode === 'solar' && (
        <>
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <mesh key={`${r}${c}`} position={[(c - 1) * 2.5, 1.4, (r - 1) * 2.5]} rotation={[-0.5, 0, 0]}>
                <boxGeometry args={[2.2, 0.08, 1.6]} />
                <meshStandardMaterial color="#4338ca" emissive="#1e1b4b" metalness={0.6} roughness={0.25} />
              </mesh>
            )),
          )}
          <mesh position={[6, 6.5, 5]}>
            <sphereGeometry args={[0.9, 24, 24]} />
            <meshBasicMaterial color="#ffd166" />
          </mesh>
          <pointLight position={[6, 6.5, 5]} color="#ffd166" intensity={4} distance={26} />
        </>
      )}
      {mode === 'kinetic' && (
        <>
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[4, 0.2, 4]} />
            <meshStandardMaterial color="#8c3b1e" metalness={0.4} roughness={0.6} />
          </mesh>
          {Array.from({ length: 9 }).map((_, i) => (
            <mesh key={i} position={[(i % 3) - 1, 0.24, Math.floor(i / 3) - 1]}>
              <boxGeometry args={[0.8, 0.14, 0.8]} />
              <meshStandardMaterial color="#f5b301" emissive="#ff6b1a" emissiveIntensity={glow * 0.6} />
            </mesh>
          ))}
          <mesh position={[0, 0.72, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#6ee7a8" emissive="#16a34a" emissiveIntensity={1.2} />
          </mesh>
        </>
      )}
    </group>
  );
}

export default function EnergyFieldLab({ tasks }: LabProps) {
  const [mode, setMode] = useState<Mode>('atmospheric');
  const [field, setField] = useState(120); // V/m fair-weather potential gradient
  const [mastHeight, setMastHeight] = useState(100); // m
  const [area, setArea] = useState(10); // m² collection area
  const [currentDensity, setCurrentDensity] = useState(2); // pA/m²
  const [deltaT, setDeltaT] = useState(100); // K across TEG
  const [modules, setModules] = useState(4);
  const [depth, setDepth] = useState(3000); // m borehole
  const [rtgCount, setRtgCount] = useState(1);
  const [irradiance, setIrradiance] = useState(1000); // W/m²
  const [panelArea, setPanelArea] = useState(1);
  const [panelEff, setPanelEff] = useState(20); // %
  const [steps, setSteps] = useState(2);
  const [showBars, setShowBars] = useState(true);

  // --- models ---
  // Atmospheric: fair-weather conduction current is ~1-3 pA/m². Power = V * I
  const atmosV = field * mastHeight;
  const atmosP = atmosV * (currentDensity * 1e-12) * area;

  // Geothermal: empirical single TEG module fit P ≈ 5 W * (ΔT/100)² for a 40×40 mm module
  const tegP = 5 * Math.pow(deltaT / 100, 2) * modules;
  const geoGradient = 27; // °C/km average continental
  const rockTemp = 15 + (geoGradient * depth) / 1000;

  // RTG: MMRTG = 110 W electrical, 2000 W thermal, 45 kg
  const rtgP = rtgCount * 110;
  const rtgMass = rtgCount * 45;
  const rtgEff = (110 / 2000) * 100;

  // Solar: STC 1000 W/m²
  const solarP = (irradiance * panelArea * panelEff) / 100;

  // Piezo: ~5 mJ per step at ~2 steps/s
  const piezoP = 0.005 * steps;

  const current =
    mode === 'atmospheric' ? atmosP : mode === 'geothermal' ? tegP : mode === 'isotope' ? rtgP : mode === 'solar' ? solarP : piezoP;

  const fmtW = (w: number) => (w >= 1 ? `${w.toFixed(2)} W` : w >= 1e-3 ? `${(w * 1e3).toFixed(2)} mW` : `${(w * 1e6).toFixed(2)} µW`);

  const bars = useMemo(() => POWER_BARS.map((b) => ({ ...b, log: Math.log10(Math.max(b.w, 1e-9)) })), []);

  const loads = [
    { name: 'RTC + wake timer', draw: 1e-6 },
    { name: 'BLE beacon (1% duty)', draw: 3e-5 },
    { name: 'LoRa sensor node (0.1% duty)', draw: 2e-4 },
    { name: 'MCU active at 3.3 V, 10 mA', draw: 3.3e-2 },
    { name: 'Small servo under load', draw: 5 },
    { name: '6-axis arm in motion', draw: 1.2e3 },
  ];
  const serviceable = loads.filter((l) => l.draw <= current);

  return (
    <LabFrame
      labId="energy-field"
      title="Energy Frontier Bench: From the Ionosphere to the Core"
      brief="Choose an energy source and see what physics actually delivers. The atmospheric column above you really does stand at ~100–300 V/m, but the fair-weather conduction current is only a few picoamps per square metre — so a 100 m mast with a 10 m² collector yields microwatts, enough for a wake-timer sensor node and nothing more. Geothermal and nuclear scale up; the honest lesson is orders of magnitude."
      tone="sirius"
      tasks={tasks}
      controls={
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {(['atmospheric', 'geothermal', 'isotope', 'solar', 'kinetic'] as const).map((m) => (
              <LabButton key={m} onClick={() => setMode(m)} active={mode === m} tone="psy">
                {m}
              </LabButton>
            ))}
          </div>

          {mode === 'atmospheric' && (
            <>
              <Slider label="field strength" value={field} min={20} max={300} step={5} onChange={setField} format={(v) => v + ' V/m'} />
              <Slider label="mast height" value={mastHeight} min={5} max={500} step={5} onChange={setMastHeight} format={(v) => v + ' m'} />
              <Slider label="collector area" value={area} min={0.1} max={100} step={0.1} onChange={setArea} format={(v) => v.toFixed(1) + ' m²'} />
              <Slider label="conduction current" value={currentDensity} min={0.5} max={6} step={0.1} onChange={setCurrentDensity} format={(v) => v.toFixed(1) + ' pA/m²'} />
              <div className="text-[11px] leading-snug text-[#9ec9e0]">
                P = V · J · A with V = E·h = {atmosV.toFixed(0)} V. Thunderstorm fields reach ~10–20 kV/m but only
                for seconds at a time.
              </div>
            </>
          )}

          {mode === 'geothermal' && (
            <>
              <Slider label="ΔT across TEG" value={deltaT} min={5} max={300} step={5} onChange={setDeltaT} format={(v) => v + ' K'} />
              <Slider label="TEG modules (40×40 mm)" value={modules} min={1} max={200} onChange={setModules} />
              <Slider label="borehole depth" value={depth} min={100} max={8000} step={100} onChange={setDepth} format={(v) => (v / 1000).toFixed(1) + ' km'} />
              <div className="text-[11px] leading-snug text-[#9ec9e0]">
                Gradient ≈ {geoGradient} °C/km → rock at {depth} m ≈ {rockTemp.toFixed(0)} °C (plus ~1 °C per 100 m
                of drilling cost). P ≈ 5 W · (ΔT/100)² per module, an empirical fit for a TEG1-127 class device.
              </div>
            </>
          )}

          {mode === 'isotope' && (
            <>
              <Slider label="MMRTG units" value={rtgCount} min={1} max={6} onChange={setRtgCount} />
              <div className="text-[11px] leading-snug text-[#9ec9e0]">
                ²³⁸Pu decays at 87.7 y half-life. Each MMRTG: ~2000 W thermal → 110 W electrical (≈{rtgEff.toFixed(1)}
                %), 45 kg. You cannot legally own one, and that is the point: this row exists so you can sanity-check
                fringe claims that a garage build is nuclear powered.
              </div>
            </>
          )}

          {mode === 'solar' && (
            <>
              <Slider label="irradiance" value={irradiance} min={200} max={1100} step={10} onChange={setIrradiance} format={(v) => v + ' W/m²'} />
              <Slider label="panel area" value={panelArea} min={0.01} max={20} step={0.01} onChange={setPanelArea} format={(v) => v.toFixed(2) + ' m²'} />
              <Slider label="panel efficiency" value={panelEff} min={5} max={40} step={0.5} onChange={setPanelEff} format={(v) => v.toFixed(1) + ' %'} />
              <div className="text-[11px] leading-snug text-[#9ec9e0]">
                Indoor lighting is 1–10 W/m², not 1000 — roughly 100–1000× less than sunlight, which is why indoor
                photovoltaics only power µW-class nodes.
              </div>
            </>
          )}

          {mode === 'kinetic' && (
            <>
              <Slider label="footsteps per second" value={steps} min={0.2} max={5} step={0.1} onChange={setSteps} format={(v) => v.toFixed(1) + ' /s'} />
              <div className="text-[11px] leading-snug text-[#9ec9e0]">
                A piezo insole converts roughly 5 mJ per step. At {steps} steps/s that is {fmtW(piezoP)} — enough to
                keep a coin cell topped up, not enough to drive a motor.
              </div>
            </>
          )}
          <Toggle label="power density chart" on={showBars} onClick={() => setShowBars((v) => !v)} />
        </div>
      }
      readouts={
        <>
          <Readout label="available power" value={fmtW(current)} tone="#67e8f9" />
          <Readout label="voltage" value={mode === 'atmospheric' ? atmosV.toFixed(0) + ' V' : mode === 'solar' ? '~18 V' : '—'} />
          <Readout
            label="energy per day"
            value={current * 86400 >= 1000 ? ((current * 86400) / 3600).toFixed(2) + ' Wh' : (current * 86400 * 1000).toFixed(1) + ' mJ'}
          />
          <Readout label="mass penalty" value={mode === 'isotope' ? rtgMass + ' kg' : mode === 'geothermal' ? 'borehole + working fluid' : 'negligible'} />
          <div className="rounded-xl border border-[#67e8f9]/25 bg-black/30 p-2">
            <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-[#67e8f9]">
              what {fmtW(current)} can actually run
            </div>
            <div className="space-y-0.5 text-[11px]">
              {serviceable.length ? (
                serviceable.map((l) => (
                  <div key={l.name} className="flex justify-between gap-2 text-[#9fd9bb]">
                    <span>✓ {l.name}</span>
                    <span className="font-mono text-[10px] opacity-70">{fmtW(l.draw)}</span>
                  </div>
                ))
              ) : (
                <div className="text-[#ff6b1a]">Nothing in this list — you are below the µW floor.</div>
              )}
            </div>
          </div>
          {showBars && (
            <div className="rounded-xl border border-white/10 bg-black/30 p-2">
              <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-[#c9bde6]">
                log₁₀ watts available (real-world)
              </div>
              <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bars} layout="vertical" margin={{ left: 4, right: 8 }}>
                    <CartesianGrid stroke="#1b1440" strokeDasharray="2 4" />
                    <XAxis type="number" domain={[-7, 3]} tick={{ fill: '#c9bde6', fontSize: 9 }} stroke="#3a2b6b" />
                    <YAxis type="category" dataKey="name" tick={{ fill: '#c9bde6', fontSize: 9 }} stroke="#3a2b6b" width={62} />
                    <Tooltip
                      contentStyle={{ background: '#0a0420', border: '1px solid #3a2b6b', fontSize: 11 }}
                      formatter={(_v: number, _n, p) => [fmtW((p.payload as { w: number }).w), 'power']}
                    />
                    <RBar dataKey="log" radius={[0, 4, 4, 0]}>
                      {bars.map((b) => (
                        <Cell key={b.name} fill={b.color} />
                      ))}
                    </RBar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          <div className="pt-1 text-[11px] leading-snug text-[#c9bde6]">
            Reading the chart left to right is the single most useful habit in frontier energy: atmospheric and
            telluric harvesting live six orders of magnitude below a lithium cell, geothermal and nuclear live above
            it but demand mass, boreholes or regulation. Design the load to the source, never the reverse.
          </div>
        </>
      }
    >
      <Canvas camera={{ position: [7.5, 5.5, 9], fov: 46 }} dpr={[1, 1.7]}>
        <color attach="background" args={['#03040f']} />
        <fog attach="fog" args={['#03040f', 16, 40]} />
        <ambientLight intensity={0.45} />
        <directionalLight position={[6, 12, 5]} intensity={1.1} />
        <pointLight position={[-6, 4, -6]} color="#4338ca" intensity={2} distance={26} />
        <ModeScene
          mode={mode}
          field={field}
          depth={depth}
          glow={mode === 'isotope' ? Math.min(1.4, 0.5 + rtgCount * 0.15) : 0.5}
        />
        <gridHelper args={[24, 24, '#1b1440', '#0d0824']} />
        <OrbitControls enablePan target={[0, mode === 'geothermal' ? -1.4 : 2, 0]} minDistance={5} maxDistance={30} />
      </Canvas>
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-white/10 bg-black/50 px-2.5 py-1.5 font-mono text-[10px] text-[#c9bde6]">
        {mode === 'atmospheric'
          ? 'cyan column = fair-weather conduction current'
          : mode === 'geothermal'
            ? 'magenta layer = hot rock · stack = thermoelectric modules'
            : mode === 'isotope'
              ? 'gold core = ²³⁸Pu heat source · fins = radiator'
              : mode === 'solar'
                ? 'amber sphere = sun, 1000 W/m² at STC'
                : 'gold tiles = piezoelectric elements'}
      </div>
    </LabFrame>
  );
}
