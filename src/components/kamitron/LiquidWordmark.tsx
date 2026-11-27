import { useEffect, useRef } from 'react';

/**
 * LiquidWordmark: letters ignite one by one in a burst of sunlight, then
 * fill from the bottom with molten gold. The surface of the metal is a real
 * wave (two layers moving at different speeds, with a bright meniscus), and an
 * SVG turbulence field makes the liquid slosh while it pours, then settles so
 * the finished mark is crisp. A sheen passes over the metal now and then.
 *
 * The fill level and wave travel are registered CSS properties, so browsers
 * without @property simply show the letters already full.
 */

type Stop = [offset: number, color: string, opacity?: number];

/** Gradient offsets run from the wave surface (0) to the bottom of the pour (1). */
function waveImage(stops: Stop[], surface: string, line: number) {
  const s = stops.map(([o, c, a = 1]) => `<stop offset='${o}' stop-color='${c}' stop-opacity='${a}'/>`).join('');
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 480' preserveAspectRatio='none'>` +
    `<defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'>${s}</linearGradient></defs>` +
    `<path d='M0 240 Q30 226 60 240 T120 240 T180 240 T240 240 V480 H0Z' fill='url(%23g)'/>` +
    `<path d='M0 240 Q30 226 60 240 T120 240 T180 240 T240 240' fill='none' stroke='${surface}' stroke-width='${line}'/>` +
    `</svg>`;
  return `url("data:image/svg+xml;utf8,${svg.replace(/#/g, '%23').replace(/"/g, "'")}")`;
}

const FRONT = waveImage(
  [[0, '#fff8dc'], [0.05, '#ffe49a'], [0.22, '#ffc85e'], [0.5, '#f4a03e'], [0.8, '#d97a2c'], [1, '#a9521c']],
  '#fffbe9', 5,
);

const BACK = waveImage(
  [[0, '#ffd27a'], [0.3, '#e08a34'], [1, '#86401a']],
  '#ffe2a2', 3,
);

const SHEEN = 'linear-gradient(105deg, transparent 38%, rgba(255,252,236,.0) 42%, rgba(255,252,236,.85) 50%, rgba(255,252,236,0) 58%, transparent 62%)';

export default function LiquidWordmark({ text = 'KAMITRON', animate }: { text?: string; animate: boolean }) {
  const pour = useRef<SVGAnimateElement>(null);
  const slosh = useRef<SVGAnimateElement>(null);

  useEffect(() => {
    if (!animate) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try {
      pour.current?.beginElement();
      slosh.current?.beginElement();
    } catch {
      /* SMIL unavailable: the liquid still rises, just without the slosh */
    }
  }, [animate]);

  const letters = Array.from(text);
  return (
    <h1 className="lw" id="sg-title">
      <span className="lw-sr">{text}</span>
      <svg className="lw-defs" aria-hidden="true" focusable="false" width="0" height="0">
        <filter id="lw-molten" x="-10%" y="-20%" width="120%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.011 0.045" numOctaves="2" seed="7" result="n">
            <animate ref={slosh} attributeName="baseFrequency" dur="3.6s" begin="indefinite" fill="freeze"
              values="0.011 0.045;0.016 0.07;0.009 0.03" keyTimes="0;0.5;1" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G">
            <animate ref={pour} attributeName="scale" dur="3.6s" begin="indefinite" fill="freeze"
              values="0;22;14;0" keyTimes="0;0.25;0.7;1" calcMode="spline" keySplines=".4 0 .2 1;.4 0 .2 1;.4 0 .2 1" />
          </feDisplacementMap>
        </filter>
      </svg>
      <span className="lw-flare" aria-hidden="true" />
      <span className="lw-word" aria-hidden="true">
        {letters.map((ch, i) => (
          <span className="lw-l" key={i} style={{ ['--i' as string]: i, ['--n' as string]: letters.length }}>
            <span className="lw-burst" />
            <span className="lw-mold">{ch}</span>
            <span className="lw-metal" style={{ backgroundImage: `${SHEEN}, ${FRONT}, ${BACK}` }}>{ch}</span>
          </span>
        ))}
      </span>
    </h1>
  );
}
