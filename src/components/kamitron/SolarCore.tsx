import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * SolarCore: a real-time shader sun for the Kamitron homepage.
 *
 * One full-hero quad, one fragment shader: a rotating plasma sphere with
 * granulation, sunspots and limb darkening; prominences lifting off the limb;
 * a streaming corona that leans toward the pointer; and orbital rings carrying
 * small living-light nodes. three.js is imported lazily so it never blocks
 * first paint or server rendering.
 *
 * - Paused motion or prefers-reduced-motion: renders one still frame.
 * - Offscreen: stops rendering.
 * - No WebGL: renders `fallback` instead.
 */

const vertex = /* glsl */ `
void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const fragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uIntro;
uniform vec2  uCenter;
uniform float uRadius;
uniform vec2  uMouse;
uniform float uHover;

// Ashima / Stefan Gustavson 3D simplex noise (MIT)
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p){
  float f=0.0, a=0.5;
  for(int i=0;i<5;i++){ f+=a*snoise(p); p=p*2.03+vec3(1.7,9.2,3.1); a*=0.5; }
  return f*0.5+0.5;
}

const float TAU = 6.2831853;

float ring(float r, float R, float w){ return smoothstep(w, 0.0, abs(r - R)); }

void main(){
  float ign = 1.0 - pow(1.0 - clamp(uIntro, 0.0, 1.0), 3.0);
  float t = uTime;
  vec2 center = uCenter + (uMouse - uCenter) * 0.012 * uHover;
  vec2 p = (gl_FragCoord.xy - center) / (uRadius * mix(0.55, 1.0, ign));
  float r = length(p);
  if (r > 3.4) { gl_FragColor = vec4(0.0); return; }
  float a = atan(p.y, p.x);
  vec2 dir = p / max(r, 1e-4);
  float px = 1.0 / uRadius;

  vec3 col = vec3(0.0);
  float alpha = 0.0;

  // ---------- photosphere ----------
  float discA = 0.0;
  vec3 disc = vec3(0.0);
  if (r < 1.02) {
    float rr = min(r, 0.9999);
    float z = sqrt(1.0 - rr * rr);
    vec3 sp = vec3(p / max(r, 1.0) , z);
    float rot = t * 0.035;
    vec3 q = vec3(sp.x * cos(rot) - sp.z * sin(rot), sp.y, sp.x * sin(rot) + sp.z * cos(rot));
    float warp = fbm(q * 2.6 + vec3(0.0, 0.0, t * 0.07));
    float heat = fbm(q * 5.5 + warp * 1.8 + vec3(t * 0.04, 0.0, -t * 0.03));
    float gran = snoise(q * 34.0 + vec3(0.0, t * 0.35, 0.0)) * 0.5 + 0.5;
    heat = heat * 0.78 + gran * 0.22;
    float limb = pow(z, 0.5);
    vec3 deep  = vec3(0.50, 0.12, 0.03);
    vec3 ember = vec3(0.95, 0.40, 0.08);
    vec3 gold  = vec3(1.00, 0.74, 0.32);
    vec3 white = vec3(1.00, 0.96, 0.84);
    disc = mix(deep, ember, smoothstep(0.18, 0.48, heat));
    disc = mix(disc, gold, smoothstep(0.42, 0.70, heat));
    disc = mix(disc, white, smoothstep(0.66, 0.90, heat) * limb);
    disc *= mix(0.62, 1.28, limb);
    float spot = smoothstep(0.70, 0.82, snoise(q * 1.9 + vec3(4.0, t * 0.015, 0.0)));
    disc = mix(disc, vec3(0.20, 0.05, 0.02), spot * 0.75);
    // ignition flash
    disc += vec3(1.0, 0.9, 0.7) * smoothstep(0.85, 0.0, abs(uIntro - 0.35) * 3.0) * 0.6;
    discA = smoothstep(1.0, 1.0 - 2.0 * px, r);
  }

  // ---------- corona ----------
  float d = max(r - 1.0, 0.0);
  float lean = 0.0;
  if (uHover > 0.0) {
    vec2 md = normalize(uMouse - center + 1e-4);
    lean = max(dot(dir, md), 0.0) * uHover;
  }
  float streams = fbm(vec3(dir * 2.2, t * 0.10));
  float strands = pow(snoise(vec3(dir * 7.0, t * 0.06 - d * 0.55)) * 0.5 + 0.5, 3.0);
  float corona = exp(-d * 3.4) * (0.55 + 1.0 * streams)
               + exp(-d * 1.15) * strands * 0.65
               + exp(-d * 0.6) * 0.10;
  corona *= (1.0 + lean * 0.6) * ign;
  vec3 cc = mix(vec3(1.0, 0.42, 0.10), vec3(1.0, 0.86, 0.55), exp(-d * 5.0));
  cc = mix(cc, vec3(0.51, 0.86, 0.83), smoothstep(0.7, 2.4, d) * 0.45);

  // prominences: loops of plasma lifting off the limb
  float band = smoothstep(0.0, 0.02, d) * smoothstep(0.42, 0.04, d);
  float prom = smoothstep(0.50, 0.88, snoise(vec3(a * 2.6, d * 5.0 - t * 0.22, t * 0.08)));
  prom *= smoothstep(0.35, 0.75, snoise(vec3(a * 1.3 + 3.0, t * 0.05, 1.0)) * 0.5 + 0.5);
  vec3 promC = vec3(1.0, 0.36, 0.12) * prom * band * 1.6 * ign;

  // ---------- orbital rings ----------
  float rings = 0.0;
  vec3 ringC = vec3(0.0);
  float wob = 0.0;
  float R1 = 1.62, R2 = 2.18, R3 = 2.78;
  float dash1 = step(0.55, fract(a / TAU * 72.0 + t * 0.02));
  float dash3 = step(0.80, fract(a / TAU * 36.0 - t * 0.008));
  rings += ring(r, R1, 1.1 * px) * (0.35 + 0.35 * dash1);
  rings += ring(r, R2, 0.9 * px) * 0.32;
  rings += ring(r, R3, 1.0 * px) * 0.25 + smoothstep(0.02, 0.0, abs(r - R3 - 0.035)) * dash3 * 0.55;
  ringC = vec3(0.92, 0.77, 0.49) * rings;
  // living-light nodes riding the rings
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float R = fi < 0.5 ? R1 : (fi < 1.5 ? R2 : R3);
    float ang = t * (0.22 - fi * 0.06) + fi * 2.1;
    vec2 node = vec2(cos(ang), sin(ang)) * R;
    float nd = length(p - node);
    float glow = exp(-nd * 26.0) * 0.9 + smoothstep(0.035, 0.02, nd);
    ringC += vec3(0.51, 0.86, 0.83) * glow;
    rings += glow * 0.8;
  }
  rings *= smoothstep(0.25, 0.9, uIntro);
  ringC *= smoothstep(0.25, 0.9, uIntro);

  // ---------- composite (premultiplied) ----------
  float coronaA = clamp(corona, 0.0, 1.0);
  vec3 light = cc * coronaA + promC + ringC;
  float lightA = clamp(coronaA + length(promC) * 0.6 + rings, 0.0, 1.0);
  col = disc * discA + light * (1.0 - discA);
  alpha = discA + lightA * (1.0 - discA);
  col *= smoothstep(0.0, 0.15, uIntro);
  alpha *= smoothstep(0.0, 0.15, uIntro);
  gl_FragColor = vec4(min(col, vec3(1.0)), clamp(alpha, 0.0, 1.0));
}
`;

type Mode = 'pending' | 'gl' | 'fallback';

export interface SolarCoreProps {
  /** Animate continuously. When false a single still frame is drawn. */
  animate: boolean;
  /** Rendered when WebGL is unavailable. */
  fallback: ReactNode;
  className?: string;
}

/** Where the sun sits inside the hero, in CSS pixels from the top-left. */
function layout(w: number, h: number) {
  if (w < 900) {
    const r = Math.min(w * 0.19, 108);
    return { x: w * 0.5, y: Math.min(180 + (w - 390) * 0.12, h * 0.26), r };
  }
  const r = Math.min(h * 0.19, w * 0.12, 190);
  return { x: w * 0.71, y: h * 0.47, r };
}

export default function SolarCore({ animate, fallback, className }: SolarCoreProps) {
  const host = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>('pending');
  const animateRef = useRef(animate);
  animateRef.current = animate;
  const kick = useRef<() => void>(() => {});

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    const probe = document.createElement('canvas');
    const ok = !!(probe.getContext('webgl2') || probe.getContext('webgl'));
    if (!ok) { setMode('fallback'); return; }

    import('three').then(THREE => {
      if (disposed) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'high-performance' });
      } catch {
        setMode('fallback');
        return;
      }
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.setAttribute('aria-hidden', 'true');
      el.appendChild(renderer.domElement);

      const uniforms = {
        uTime: { value: 0 },
        uIntro: { value: 0 },
        uCenter: { value: new THREE.Vector2() },
        uRadius: { value: 150 },
        uMouse: { value: new THREE.Vector2() },
        uHover: { value: 0 },
      };
      const material = new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms, transparent: true, depthTest: false, depthWrite: false });
      const scene = new THREE.Scene();
      const camera = new THREE.Camera();
      const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
      scene.add(quad);

      let dpr = 1;
      let height = 0;
      const resize = () => {
        const w = el.clientWidth, h = el.clientHeight;
        dpr = Math.min(window.devicePixelRatio || 1, w < 900 ? 1.5 : 1.25);
        renderer.setPixelRatio(dpr);
        renderer.setSize(w, h, false);
        renderer.domElement.style.width = w + 'px';
        renderer.domElement.style.height = h + 'px';
        height = h;
        const s = layout(w, h);
        uniforms.uCenter.value.set(s.x * dpr, (h - s.y) * dpr);
        uniforms.uRadius.value = s.r * dpr;
        if (!running) draw();
      };

      const start = performance.now();
      let raf = 0;
      let running = false;
      let visible = true;
      let hoverTarget = 0;

      const draw = () => {
        renderer.render(scene, camera);
      };
      const frame = (now: number) => {
        const t = (now - start) / 1000;
        uniforms.uTime.value = 40 + t;
        uniforms.uIntro.value = Math.min(1, t / 2.4);
        uniforms.uHover.value += (hoverTarget - uniforms.uHover.value) * 0.05;
        draw();
        raf = requestAnimationFrame(frame);
      };
      const still = () => {
        uniforms.uTime.value = 46;
        uniforms.uIntro.value = 1;
        uniforms.uHover.value = 0;
        draw();
      };
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
      const sync = () => {
        const want = animateRef.current && visible && !reduce.matches && !document.hidden;
        if (want && !running) { running = true; raf = requestAnimationFrame(frame); }
        if (!want && running) { running = false; cancelAnimationFrame(raf); }
        if (!want) still();
      };
      kick.current = sync;

      const onMove = (e: PointerEvent) => {
        const b = el.getBoundingClientRect();
        uniforms.uMouse.value.set((e.clientX - b.left) * dpr, (height - (e.clientY - b.top)) * dpr);
        hoverTarget = 1;
      };
      const onLeave = () => { hoverTarget = 0; };
      const hero = el.parentElement ?? el;
      hero.addEventListener('pointermove', onMove);
      hero.addEventListener('pointerleave', onLeave);

      const ro = new ResizeObserver(resize);
      ro.observe(el);
      const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
      io.observe(el);
      document.addEventListener('visibilitychange', sync);
      reduce.addEventListener?.('change', sync);
      renderer.domElement.addEventListener('webglcontextlost', e => { e.preventDefault(); setMode('fallback'); });

      resize();
      sync();
      setMode('gl');

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        document.removeEventListener('visibilitychange', sync);
        reduce.removeEventListener?.('change', sync);
        hero.removeEventListener('pointermove', onMove);
        hero.removeEventListener('pointerleave', onLeave);
        material.dispose();
        quad.geometry.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }).catch(() => { if (!disposed) setMode('fallback'); });

    return () => { disposed = true; cleanup(); };
  }, []);

  useEffect(() => { kick.current(); }, [animate]);

  return (
    <div ref={host} className={className} data-solar={mode}>
      {mode === 'fallback' && fallback}
    </div>
  );
}
