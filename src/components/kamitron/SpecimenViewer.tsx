import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { buildSpecimen } from './specimenModels';
import type { Specimen } from '@/content/kamitron';
import { useUi } from '@/lib/uiStore';

export default function SpecimenViewer({ specimen, file }: { specimen: Specimen; file: File | null }) {
  const stage = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls>();
  const partsRef = useRef<ReturnType<typeof buildSpecimen>['parts']>([]);
  const [error, setError] = useState('');
  const [explode, setExplode] = useState(0);
  const motion = useUi(s => s.motion);
  const [spin, setSpin] = useState(false);
  useEffect(() => {
    if (!stage.current) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
    catch { setError('3D is unavailable on this device. Every specimen and its learning details are still available below.'); return; }
    const host = stage.current;
    let disposed = false;
    let frame = 0;
    let model: THREE.Group | undefined;
    let concept: ReturnType<typeof buildSpecimen> | undefined;
    setError(''); setExplode(0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    host.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-label', `Interactive concept model: ${specimen.name}. Drag to rotate, scroll to zoom.`);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, .1, 100);
    camera.position.set(0, 1.1, 6.2);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.enablePan = false;
    controls.minDistance = 3.5; controls.maxDistance = 10;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches || !motion;
    controls.autoRotate = !reduce; controls.autoRotateSpeed = 1.4;
    setSpin(!reduce); controlsRef.current = controls;
    scene.add(new THREE.HemisphereLight(0xffffff, 0x4338ca, 2));
    const light = new THREE.DirectionalLight(0xffffff, 3); light.position.set(3, 5, 4); scene.add(light);
    const rim = new THREE.DirectionalLight(0xf5b301, 2); rim.position.set(-4, 2, -3); scene.add(rim);
    function release(group: THREE.Group) {
      const materials = new Set<THREE.Material>();
      group.traverse(o => {
        if (o instanceof THREE.Mesh) { o.geometry.dispose(); (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => materials.add(m)); }
      });
      materials.forEach(m => { Object.values(m).forEach(v => { if (v instanceof THREE.Texture) v.dispose(); }); m.dispose(); });
    }
    function show(group: THREE.Group) {
      if (disposed) { release(group); return; }
      if (model) { scene.remove(model); release(model); }
      const box = new THREE.Box3().setFromObject(group);
      const size = box.getSize(new THREE.Vector3());
      group.position.sub(box.getCenter(new THREE.Vector3()));
      model = new THREE.Group(); model.add(group); model.scale.setScalar(2.9 / Math.max(size.x, size.y, size.z, .001)); scene.add(model);
    }
    concept = buildSpecimen(specimen.arch, specimen.lab.color);
    partsRef.current = concept.parts;
    show(concept.group);
    if (file || specimen.glb) {
      const loader = new GLTFLoader();
      const done = (g: { scene: THREE.Group }) => { if (!disposed) partsRef.current = []; show(g.scene); };
      const fail = () => { if (!disposed) setError('That model could not be read. Showing the concept preview. Try a self-contained .glb export.'); };
      if (file) file.arrayBuffer().then(buffer => { if (!disposed) loader.parse(buffer, '', done, fail); }).catch(fail);
      else loader.load(specimen.glb!, done, undefined, fail);
    }
    const resize = () => {
      const width = host.clientWidth, height = host.clientHeight;
      renderer.setSize(width, height, false); camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize); observer.observe(host); resize();
    const clock = new THREE.Clock();
    function tick() {
      const t = clock.getElapsedTime(), m = reduce ? 0 : 1;
      if (concept && partsRef.current.length) {
        concept.waves.forEach(w => {
          if(w.seg) { w.seg.rotation.z = -w.curl - Math.sin(t*1.6-w.i*.45+w.phase)*.12*m; w.seg.rotation.y = Math.sin(t*1.1-w.i*.3+w.phase*2)*.05*m; }
          else if(w.spin) { w.spin.rotation.y=t*.6*m; w.spin.rotation.x=Math.sin(t*.4)*.2*m; }
          else if(w.tail) w.tail.rotation.y=Math.sin(t*2-w.i*.5)*.12*m;
          else if(w.orbit) w.orbit.rotation.z=t*(.3+w.i*.15)*m;
          else if(w.ring) w.ring.rotation.z=t*(w.i%2?.4:-.4)*m;
        });
        concept.flaps.forEach(f => { f.piv.rotation.z=f.side*Math.sin(t*6)*.35*m; });
      }
      controls.update(); renderer.render(scene, camera); frame = requestAnimationFrame(tick);
    }
    tick();
    return () => {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect(); controls.dispose();
      if(model) release(model);
      concept?.materials.forEach(m => m.dispose());
      partsRef.current = []; controlsRef.current = undefined;
      renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
    };
  }, [specimen, file, motion]);

  return <div className="glass panel-edge overflow-hidden">
    <div className="flex flex-wrap items-center justify-between gap-2 p-4 font-mono text-xs text-[#f5b301]"><span>{file ? `Local model · ${file.name}` : `Concept preview · ${specimen.name}`}</span><span className="text-[#c9bde6]">Drag to orbit · scroll to zoom</span></div>
    <div ref={stage} className="h-[360px] w-full bg-gradient-to-b from-[#151036] to-[#05010f] sm:h-[430px]" />
    {error && <p role="status" className="px-4 text-sm text-[#ffd166]">{error}</p>}
    <div className="flex flex-wrap items-center gap-3 p-4">
      <label htmlFor="specimen-explode" className="text-sm">Take it apart</label>
      <input id="specimen-explode" className="min-w-0 flex-1 accent-[#f5b301]" type="range" min="0" max="100" value={explode} onChange={e => { const value = Number(e.target.value); setExplode(value); partsRef.current.forEach(p => p.obj.position.copy(p.base).addScaledVector(p.dir, value / 100 * 1.1)); }} />
      <button className="btn-ghost text-xs" aria-pressed={spin} onClick={() => { const c = controlsRef.current; if (c) { c.autoRotate = !c.autoRotate; setSpin(c.autoRotate); } }}>Auto-spin</button>
    </div>
  </div>;
}
