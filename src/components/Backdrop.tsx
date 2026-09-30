import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ADINKRA_GLYPHS } from '@/lib/progression';

/** Fixed psychedelic cosmic backdrop: plasma ribbons, starfields, adinkra watermark. */
export function Backdrop() {
  const glyphs = useMemo(() => ADINKRA_GLYPHS.slice(0, 12), []);
  return (
    <>
      <div className="cosmic-bg" aria-hidden />
      <div className="starfield" aria-hidden />
      <div className="starfield-2" aria-hidden />
      <div className="plasma-ribbon top" aria-hidden />
      <div className="plasma-ribbon bottom" aria-hidden />
      <div className="pointer-events-none fixed inset-0 -z-[1] overflow-hidden" aria-hidden>
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
        <div className="absolute inset-0 flex flex-wrap content-start justify-between gap-6 p-6">
          {glyphs.map((g, i) => (
            <span
              key={i}
              className="animate-drift text-3xl text-[#f5b301]"
              style={{ opacity: 0.07, animationDelay: `${i * 0.7}s` }}
            >
              {g.glyph}
            </span>
          ))}
        </div>
      </div>
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
          audio = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
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
    };
  }, [ctx, loc.pathname]);
}
