import { useEffect, useRef, useState, type CSSProperties } from 'react';

/**
 * The Kamitron glyph language: original symbols that pair an ancient form
 * (sun disc, eye, pillar, anvil, water) with a modern circuit trace.
 * Each glyph draws itself stroke by stroke when it scrolls into view, then
 * carries a travelling charge of light along its lines.
 */

export type GlyphKind =
  | 'sun' | 'forge' | 'mycelium' | 'eye' | 'life' | 'flow'
  | 'pillar' | 'orbit' | 'seed' | 'lattice' | 'memory' | 'signal';

interface GlyphDef { name: string; meaning: string; paths: string[]; nodes: [number, number][] }

export const GLYPHS: Record<GlyphKind, GlyphDef> = {
  sun: {
    name: 'Sun', meaning: 'Energy',
    paths: [
      'M50 26a14 14 0 1 1 0 28a14 14 0 1 1 0-28',
      'M50 34a6 6 0 1 1 0 12a6 6 0 1 1 0-12',
      'M50 26V12', 'M36 40H20V30', 'M64 40H80V50', 'M40 50L30 62H20', 'M60 50L70 62V76',
      'M30 84H70',
    ],
    nodes: [[50, 12], [20, 30], [80, 50], [20, 62], [70, 76]],
  },
  forge: {
    name: 'Forge', meaning: 'Engineering',
    paths: [
      'M18 50H82L68 60H58V76H70V82H30V76H42V60H32Z',
      'M40 36L54 18L66 30L52 44Z', 'M52 44L46 50',
      'M70 22L78 16', 'M74 34L84 34', 'M30 30L22 24',
    ],
    nodes: [[78, 16], [84, 34], [22, 24]],
  },
  mycelium: {
    name: 'Hyphae', meaning: 'Biology',
    paths: [
      'M50 86V52',
      'M50 70L32 60L20 64', 'M50 62L70 50L82 54', 'M50 52L38 38L26 38',
      'M50 52L58 34L72 28', 'M58 34L54 18', 'M38 38L34 24',
      'M36 86Q50 78 64 86',
    ],
    nodes: [[20, 64], [82, 54], [26, 38], [72, 28], [54, 18], [34, 24]],
  },
  eye: {
    name: 'Eye', meaning: 'Perception',
    paths: [
      'M14 46Q50 16 86 46Q50 70 14 46Z',
      'M50 34a12 12 0 1 1 0 24a12 12 0 1 1 0-24',
      'M50 41a5 5 0 1 1 0 10a5 5 0 1 1 0-10',
      'M40 60L34 78H24', 'M60 60V82', 'M60 70H74',
      'M30 24L38 30', 'M50 14V22', 'M70 24L62 30',
    ],
    nodes: [[24, 78], [60, 82], [74, 70]],
  },
  life: {
    name: 'Life', meaning: 'Living systems',
    paths: [
      'M50 46C36 40 34 16 50 14C66 16 64 40 50 46Z',
      'M26 48H74', 'M50 46V86',
      'M50 62H36V72', 'M50 74H64V84',
      'M50 24a4 4 0 1 1 0 8a4 4 0 1 1 0-8',
    ],
    nodes: [[26, 48], [74, 48], [36, 72], [64, 84]],
  },
  flow: {
    name: 'Water', meaning: 'Flow',
    paths: [
      'M14 34L22 28L30 34L38 28L46 34L54 28L62 34L70 28L78 34L86 28',
      'M14 50L22 44L30 50L38 44L46 50L54 44L62 50L70 44L78 50L86 44',
      'M14 66L22 60L30 66L38 60L46 66L54 60L62 66L70 60L78 66L86 60',
      'M14 78H86',
    ],
    nodes: [[14, 78], [86, 78]],
  },
  pillar: {
    name: 'Pillar', meaning: 'Structure',
    paths: [
      'M42 86V40', 'M58 86V40',
      'M32 22H68', 'M30 30H70', 'M32 38H68',
      'M50 22V12', 'M30 86H70',
      'M42 60H24V48', 'M58 70H76V58',
    ],
    nodes: [[50, 12], [24, 48], [76, 58]],
  },
  orbit: {
    name: 'Orbit', meaning: 'Spatial systems',
    paths: [
      'M50 40a10 10 0 1 1 0 20a10 10 0 1 1 0-20',
      'M14 50a36 14 0 1 0 72 0a36 14 0 1 0 -72 0',
      'M50 14a14 36 0 1 0 0 72a14 36 0 1 0 0-72',
    ],
    nodes: [[86, 50], [50, 14], [20, 42]],
  },
  seed: {
    name: 'Seed', meaning: 'Growth',
    paths: [
      'M50 50m0-4a4 4 0 1 1-4 4a8 8 0 0 1 8-8a12 12 0 0 1 12 12a16 16 0 0 1-16 16a20 20 0 0 1-20-20a24 24 0 0 1 24-24a28 28 0 0 1 28 28',
      'M78 54V80H62',
    ],
    nodes: [[62, 80]],
  },
  lattice: {
    name: 'Lattice', meaning: 'Intelligence',
    paths: [
      'M50 16L80 68H20Z', 'M50 16V50', 'M80 68L50 50', 'M20 68L50 50',
      'M35 42H65', 'M35 42L50 68L65 42',
    ],
    nodes: [[50, 16], [80, 68], [20, 68], [50, 50]],
  },
  memory: {
    name: 'Rings', meaning: 'Ancestral memory',
    paths: [
      'M50 22a28 28 0 1 1 0 56a28 28 0 1 1 0-56',
      'M50 32a18 18 0 1 1 0 36a18 18 0 1 1 0-36',
      'M50 42a8 8 0 1 1 0 16a8 8 0 1 1 0-16',
      'M50 22V8', 'M78 50H92', 'M50 78V92', 'M22 50H8',
    ],
    nodes: [[50, 8], [92, 50], [50, 92], [8, 50]],
  },
  signal: {
    name: 'Signal', meaning: 'Communication',
    paths: [
      'M50 70V86', 'M42 86H58',
      'M50 70a6 6 0 1 1 0-12a6 6 0 1 1 0 12',
      'M38 52a16 16 0 0 1 24 0', 'M30 44a28 28 0 0 1 40 0', 'M22 36a40 40 0 0 1 56 0',
    ],
    nodes: [[22, 36], [78, 36]],
  },
};

export const GLYPH_ORDER: GlyphKind[] = ['sun', 'forge', 'mycelium', 'eye', 'life', 'flow', 'pillar', 'orbit', 'seed', 'lattice', 'memory', 'signal'];

/** Adds `is-lit` once the element has been seen. */
export function useLit<T extends Element>() {
  const ref = useRef<T>(null);
  const [lit, setLit] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setLit(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setLit(true); io.disconnect(); }
    }, { rootMargin: '0px 0px -12% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, lit] as const;
}

interface GlyphProps {
  kind: GlyphKind;
  /** Draw immediately rather than waiting to scroll into view. */
  lit?: boolean;
  className?: string;
  style?: CSSProperties;
  title?: string;
}

export function Glyph({ kind, lit, className, style, title }: GlyphProps) {
  const def = GLYPHS[kind];
  const [ref, seen] = useLit<SVGSVGElement>();
  const on = lit ?? seen;
  return (
    <svg
      ref={ref}
      viewBox="0 0 100 100"
      className={'gl' + (on ? ' is-lit' : '') + (className ? ' ' + className : '')}
      style={style}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <g className="gl-trace">
        {def.paths.map((d, k) => <path key={k} d={d} pathLength={1} style={{ ['--k' as string]: k }} />)}
      </g>
      <g className="gl-charge">
        {def.paths.map((d, k) => <path key={k} d={d} pathLength={1} style={{ ['--k' as string]: k }} />)}
      </g>
      <g className="gl-nodes">
        {def.nodes.map(([x, y], k) => <circle key={k} cx={x} cy={y} r={3.2} style={{ ['--k' as string]: k + def.paths.length }} />)}
      </g>
    </svg>
  );
}

/** A slowly travelling band of glyphs; light passes through them one by one. */
export function GlyphFrieze() {
  const [ref, lit] = useLit<HTMLDivElement>();
  const row = (copy: number) => (
    <ul className="gf-row" aria-hidden={copy > 0 ? true : undefined}>
      {GLYPH_ORDER.map((k, i) => (
        <li key={k} className="gf-cell" style={{ ['--i' as string]: i }}>
          <Glyph kind={k} lit={lit} />
          <span className="gf-name">{GLYPHS[k].name}</span>
          <span className="gf-meaning">{GLYPHS[k].meaning}</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div ref={ref} className={'gf' + (lit ? ' is-lit' : '')}>
      <div className="gf-track">{row(0)}{row(1)}</div>
    </div>
  );
}
