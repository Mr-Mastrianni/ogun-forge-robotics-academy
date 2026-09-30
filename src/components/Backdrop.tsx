import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ADINKRA_GLYPHS } from '@/lib/progression';
import { useUi } from '@/lib/uiStore';

/* ==================================================================
   The kinetic field.

   Three stacked layers, cheap enough to run on a phone:
     1. CSS gradient nebula + drifting starfields (see vibranium.css)
     2. A 2D canvas drawing plasma blobs, a rotating mandala and
        growing mycelial hyphae with travelling signal pulses
     3. Optional grain, scanlines and vignette

   Intensity, motion and glow come from the persisted UI store, so a
   motion-sensitive reader can switch the whole thing to a still frame.
   ================================================================== */

interface Hypha {
  pts: { x: number; y: number }[];
  offset: number;
  speed: number;
  hue: number;
  width: number;
}

function makeHyphae(w: number, h: number, count: number): Hypha[] {
  const out: Hypha[] = [];
  for (let i = 0; i < count; i++) {
    const pts: { x: number; y: number }[] = [];
    let x = Math.random() * w;
    let y = Math.random() * h;
    let a = Math.random() * Math.PI * 2;
    const steps = 40 + Math.floor(Math.random() * 60);
    for (let s = 0; s < steps; s++) {
      pts.push({ x, y });
      a += (Math.random() - 0.5) * 0.42;
      const step = 6 + Math.random() * 10;
      x += Math.cos(a) * step;
      y += Math.sin(a) * step * 0.75;
      if (x < -60 || x > w + 60 || y < -60 || y > h + 60) break;
    }
    out.push({
      pts,
      offset: Math.random(),
      speed: 0.02 + Math.random() * 0.05,
      hue: 150 + Math.random() * 60,
      width: 0.6 + Math.random() * 1.6,
    });
  }
  return out;
}

function TripField() {
  const vibe = useUi((s) => s.vibe);
  const motion = useUi((s) => s.motion);
  const glow = useUi((s) => s.glow);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let hyphae: Hypha[] = [];
    let raf = 0;
    let last = 0;
    let t = 0;

    const still = vibe === 'calm' || !motion;
    const density = (vibe === 'psychedelic' ? 1 : vibe === 'cosmic' ? 0.6 : 0.35) * (glow ? 1 : 0.75);
    const targetFps = vibe === 'psychedelic' ? 60 : 30;
    const frameMs = 1000 / targetFps;

    const resize = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      hyphae = makeHyphae(w, h, Math.round(26 * density));
    };

    const PALETTE = [
      [139, 92, 246],
      [103, 232, 249],
      [192, 38, 211],
      [110, 231, 168],
      [245, 179, 1],
    ];

    const drawPlasma = (time: number) => {
      const blobs = vibe === 'psychedelic' ? 7 : vibe === 'cosmic' ? 5 : 4;
      for (let i = 0; i < blobs; i++) {
        const ph = (i / blobs) * Math.PI * 2;
        const cx = w * 0.5 + Math.sin(time * (0.06 + i * 0.013) + ph) * w * 0.36;
        const cy = h * 0.45 + Math.cos(time * (0.05 + i * 0.017) + ph * 1.7) * h * 0.34;
        const r = Math.max(60, Math.min(w, h) * (0.22 + 0.1 * Math.sin(time * 0.1 + i)));
        const [rr, gg, bb] = PALETTE[i % PALETTE.length];
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, `rgba(${rr},${gg},${bb},${0.3 * density})`);
        grad.addColorStop(0.5, `rgba(${rr},${gg},${bb},${0.1 * density})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawMandala = (time: number) => {
      const folds = vibe === 'psychedelic' ? 12 : 8;
      const base = Math.min(w, h) * 0.42;
      ctx.save();
      ctx.translate(w * 0.5, h * 0.42);
      ctx.rotate(still ? 0.3 : time * 0.035);
      ctx.lineWidth = 1;
      for (let k = 0; k < folds; k++) {
        ctx.save();
        ctx.rotate((k / folds) * Math.PI * 2);
        const wob = Math.sin(time * 0.6 + k) * 0.09;
        const grad = ctx.createLinearGradient(0, 0, base * 0.9, 0);
        grad.addColorStop(0, `rgba(103,232,249,${0.16 * density})`);
        grad.addColorStop(0.55, `rgba(139,92,246,${0.12 * density})`);
        grad.addColorStop(1, `rgba(192,38,211,${0.05 * density})`);
        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(base * 0.3, base * (0.22 + wob), base * 0.68, base * (0.5 + wob), base * 0.92, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, base * (0.42 + 0.05 * Math.sin(time * 0.4 + k)), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(139,92,246,${0.06 * density})`;
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    };

    const drawHyphae = (time: number) => {
      for (const hy of hyphae) {
        const n = hy.pts.length;
        if (n < 3) continue;
        const prog = (time * hy.speed + hy.offset) % 1.35;
        const upto = Math.min(n, Math.max(3, Math.floor(prog * n)));
        ctx.strokeStyle = `hsla(${hy.hue}, 80%, 62%, ${0.34 * density})`;
        ctx.lineWidth = hy.width;
        ctx.beginPath();
        ctx.moveTo(hy.pts[0].x, hy.pts[0].y);
        for (let i = 1; i < upto; i++) ctx.lineTo(hy.pts[i].x, hy.pts[i].y);
        ctx.stroke();
        // travelling signal pulse at the growing tip
        const tip = hy.pts[upto - 1];
        const pulse = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, 16);
        pulse.addColorStop(0, `hsla(${hy.hue + 40}, 100%, 75%, ${0.5 * density})`);
        pulse.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = pulse;
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, 16, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - last < frameMs) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      t += dt;

      // fade the previous frame so movement leaves soft trails
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(5,1,15,0.16)';
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'lighter';
      drawPlasma(t);
      drawMandala(t);
      drawHyphae(t);
    };

    const renderStill = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      drawPlasma(1.2);
      drawMandala(0.7);
    };

    resize();
    if (still) {
      renderStill();
    } else {
      raf = requestAnimationFrame(frame);
    }

    const onResize = () => {
      resize();
      if (still) renderStill();
    };
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else if (!still) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [vibe, motion, glow]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-[1]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

/** Fixed cosmic backdrop: CSS nebula, starfields, the kinetic field and grain. */
export function Backdrop() {
  const pathname = useLocation().pathname;
  const glyphs = useMemo(() => ADINKRA_GLYPHS.slice(0, 12), []);

  return (
    <>
      <div className="cosmic-bg" aria-hidden />
      <div className="starfield" aria-hidden />
      <div className="starfield-2" aria-hidden />
      <div className="plasma-ribbon top" aria-hidden />
      <div className="plasma-ribbon bottom" aria-hidden />

      <div className="pointer-events-none fixed inset-0 -z-[2] overflow-hidden" aria-hidden>
        <svg className="absolute -right-24 top-20 h-[520px] w-[520px] opacity-[0.16]" viewBox="0 0 200 200">
          <g className="glyph-ring" fill="none" stroke="#f5b301" strokeWidth="0.6">
            <circle cx="100" cy="100" r="92" />
            <circle cx="100" cy="100" r="74" strokeDasharray="3 5" />
            <circle cx="100" cy="100" r="56" />
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={i}
                x1="100"
                y1="100"
                x2={100 + 92 * Math.cos((i * Math.PI) / 6)}
                y2={100 + 92 * Math.sin((i * Math.PI) / 6)}
                stroke="#c026d3"
              />
            ))}
          </g>
        </svg>
        <svg className="absolute -left-28 bottom-10 h-[420px] w-[420px] opacity-[0.14]" viewBox="0 0 200 200">
          <g fill="none" stroke="#6ee7a8" strokeWidth="0.7">
            {Array.from({ length: 7 }).map((_, i) => (
              <rect
                key={i}
                x={10 + i * 12}
                y={10 + i * 12}
                width={180 - i * 24}
                height={180 - i * 24}
                transform="rotate(45 100 100)"
              />
            ))}
          </g>
        </svg>
      </div>

      {/* remount per route so each page grows a fresh hyphal field */}
      <TripField key={pathname} />

      <div className="grain" aria-hidden />
      <div className="scanlines" aria-hidden />
      <div className="vignette" aria-hidden />
    </>
  );
}

/** Lightweight WebAudio SFX — forge chimes, no assets required. */
export function useSfx() {
  const [ctx, setCtx] = useState<AudioContext | null>(null);
  const loc = useLocation();
  useEffect(() => {
    return () => {
      ctx?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useMemo(() => {
    const play = (freqs: number[], dur = 0.16, type: OscillatorType = 'triangle') => {
      try {
        let audio = ctx;
        if (!audio) {
          audio = new (window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
          setCtx(audio);
        }
        const t0 = audio.currentTime;
        freqs.forEach((f, i) => {
          const osc = audio!.createOscillator();
          const gain = audio!.createGain();
          osc.type = type;
          osc.frequency.value = f;
          gain.gain.setValueAtTime(0.0001, t0 + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.09, t0 + i * 0.06 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + i * 0.06 + dur);
          osc.connect(gain).connect(audio!.destination);
          osc.start(t0 + i * 0.06);
          osc.stop(t0 + i * 0.06 + dur + 0.02);
        });
      } catch {
        /* audio is a nicety, never a failure */
      }
    };
    return {
      correct: () => play([523.25, 659.25, 783.99], 0.2),
      wrong: () => play([196, 155.56], 0.26, 'sawtooth'),
      xp: () => play([880, 1174.66], 0.14, 'sine'),
      badge: () => play([523.25, 659.25, 783.99, 1046.5], 0.3),
      flip: () => play([440], 0.06, 'sine'),
      click: () => play([330], 0.05, 'square'),
      bead: () => play([660, 990], 0.12, 'sine'),
    };
  }, [ctx, loc.pathname]);
}
