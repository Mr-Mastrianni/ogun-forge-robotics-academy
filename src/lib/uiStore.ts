import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Vibe = 'calm' | 'cosmic' | 'psychedelic';

export const VIBE_ORDER: Vibe[] = ['calm', 'cosmic', 'psychedelic'];

export const VIBE_META: Record<Vibe, { label: string; glyph: string; blurb: string }> = {
  calm: {
    label: 'Calm',
    glyph: '◌',
    blurb: 'Still background, no animation. Best for reading and for motion sensitivity.',
  },
  cosmic: {
    label: 'Cosmic',
    glyph: '✧',
    blurb: 'Slow drifting nebula and starfield. The default: alive, but not distracting.',
  },
  psychedelic: {
    label: 'Vibranium',
    glyph: '◈',
    blurb: 'Full kinetic field: plasma, kaleidoscope mandala, living hyphae, grain and scanlines.',
  },
};

interface UiState {
  vibe: Vibe;
  /** multiplies the root rem size, so every Tailwind size scales with it */
  fontScale: number;
  /** master switch for decorative motion */
  motion: boolean;
  /** extra bloom on panels and headings */
  glow: boolean;
  /** width of the reading column on lesson pages */
  wideReading: boolean;

  setVibe: (v: Vibe) => void;
  cycleVibe: () => void;
  setFontScale: (n: number) => void;
  bumpFontScale: (delta: number) => void;
  toggleMotion: () => void;
  toggleGlow: () => void;
  toggleWideReading: () => void;
}

const initial = {
  vibe: 'cosmic' as Vibe,
  fontScale: 1,
  motion: true,
  glow: true,
  wideReading: false,
};

export const useUi = create<UiState>()(
  persist(
    (set, get) => ({
      ...initial,
      setVibe: (vibe) => set({ vibe }),
      cycleVibe: () => {
        const i = VIBE_ORDER.indexOf(get().vibe);
        set({ vibe: VIBE_ORDER[(i + 1) % VIBE_ORDER.length] });
      },
      setFontScale: (n) => set({ fontScale: Math.min(1.35, Math.max(0.85, Math.round(n * 100) / 100)) }),
      bumpFontScale: (delta) =>
        set((s) => ({ fontScale: Math.min(1.35, Math.max(0.85, Math.round((s.fontScale + delta) * 100) / 100)) })),
      toggleMotion: () => set((s) => ({ motion: !s.motion })),
      toggleGlow: () => set((s) => ({ glow: !s.glow })),
      toggleWideReading: () => set((s) => ({ wideReading: !s.wideReading })),
    }),
    { name: 'ogun-forge-ui-v1', version: 1 },
  ),
);

/** Push the preferences onto <html> so CSS can react to them. */
export function applyUiToDom(s: Pick<UiState, 'vibe' | 'fontScale' | 'motion' | 'glow' | 'wideReading'>) {
  if (typeof document === 'undefined') return;
  const el = document.documentElement;
  el.dataset.vibe = s.vibe;
  el.dataset.motion = s.motion ? 'on' : 'off';
  el.dataset.glow = s.glow ? 'on' : 'off';
  el.dataset.reading = s.wideReading ? 'wide' : 'normal';
  el.style.setProperty('--ui-font-scale', String(s.fontScale));
}

export function systemPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
