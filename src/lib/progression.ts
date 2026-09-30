import type { Badge, Rank } from '@/content/types';

/* ------------------------------------------------------------------ */
/* Ranks — an ascent from seed to cosmic knower                        */
/* ------------------------------------------------------------------ */

export const RANKS: Rank[] = [
  { id: 'iwe', name: 'Ìwé', minXp: 0, glyph: '◌', blurb: 'The seed before the sprout. Curiosity only.' },
  { id: 'eko', name: 'Akẹ́kọ̀ọ́', minXp: 250, glyph: '✦', blurb: 'Student of the forge. You know the words now.' },
  { id: 'alagbede', name: 'Alágbẹ̀dẹ̀', minXp: 700, glyph: '⚒', blurb: 'Blacksmith apprentice. You bend metal and logic.' },
  { id: 'onidin', name: 'Onídin', minXp: 1500, glyph: '⛭', blurb: 'Bronze caster. You pour systems into shape.' },
  { id: 'onise', name: 'Oníṣẹ́ Ẹ̀rọ', minXp: 2800, glyph: '⚙', blurb: 'Machine maker. Robots answer your call.' },
  { id: 'babalawo', name: 'Babaláwo Ẹ̀rọ', minXp: 4500, glyph: '✵', blurb: 'Keeper of the 256 paths of machine wisdom.' },
  { id: 'ologun', name: 'Ológun', minXp: 7000, glyph: '⚔', blurb: 'Warrior engineer. You clear the road for others.' },
  { id: 'ajose', name: 'Ajọ̀ṣe', minXp: 10000, glyph: '⌘', blurb: 'Architect of autonomous systems.' },
  { id: 'ogun-chosen', name: "Ọ̀gún's Chosen", minXp: 14000, glyph: '🔥', blurb: 'Iron itself recognizes you.' },
  { id: 'imorun', name: 'Ìmọ̀-Òrun', minXp: 20000, glyph: '🌌', blurb: 'Knower of the cosmic order. Builder of living stars.' },
];

export function rankFor(xp: number): Rank {
  let out = RANKS[0];
  for (const r of RANKS) if (xp >= r.minXp) out = r;
  return out;
}

export function nextRank(xp: number): Rank | null {
  return RANKS.find((r) => r.minXp > xp) ?? null;
}

export function rankProgress(xp: number): number {
  const cur = rankFor(xp);
  const nxt = nextRank(xp);
  if (!nxt) return 1;
  return Math.min(1, (xp - cur.minXp) / (nxt.minXp - cur.minXp));
}

export function levelFromXp(xp: number): number {
  // smooth, never-capped level curve
  return Math.floor(Math.sqrt(Math.max(0, xp) / 42)) + 1;
}

export function xpForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 42;
}

/* ------------------------------------------------------------------ */
/* Badges — Adinkra-named achievements                                  */
/* ------------------------------------------------------------------ */

export const BADGES: Badge[] = [
  {
    id: 'gye-nyame',
    name: 'Gye Nyame',
    glyph: '✺',
    adinkra: 'Except for God',
    description: 'Supremacy of the cosmic order. Awarded for starting the ascent.',
    requirement: 'Complete your first lesson.',
    tier: 'bronze',
  },
  {
    id: 'sankofa',
    name: 'Sankofa',
    glyph: '↩',
    adinkra: 'Go back and get it',
    description: 'Return to the source. Awarded for revisiting a lesson to raise your score.',
    requirement: 'Improve a previously failed quiz.',
    tier: 'bronze',
  },
  {
    id: 'nyame-dua',
    name: 'Nyame Dua',
    glyph: '⍋',
    adinkra: 'Tree of God',
    description: 'A place of sanctuary. Awarded for a 3-day study streak.',
    requirement: 'Study three days in a row.',
    tier: 'bronze',
  },
  {
    id: 'dwennimmen',
    name: 'Dwennimmen',
    glyph: '🐏',
    adinkra: "Ram's horns",
    description: 'Humility together with strength. Awarded for a perfect quiz.',
    requirement: 'Score 100% on any lesson quiz.',
    tier: 'silver',
  },
  {
    id: 'akoma',
    name: 'Akoma Ntoso',
    glyph: '♡',
    adinkra: 'Linked hearts',
    description: 'Understanding and agreement. Awarded for a flawless boss quiz.',
    requirement: 'Score 100% on a weekly boss quiz.',
    tier: 'silver',
  },
  {
    id: 'adinkrahene',
    name: 'Adinkrahene',
    glyph: '◎',
    adinkra: 'Chief of the Adinkra',
    description: 'Leadership and greatness. Awarded for completing a full week.',
    requirement: 'Complete both lessons of a week plus its boss quiz.',
    tier: 'silver',
  },
  {
    id: 'fihankra',
    name: 'Fihankra',
    glyph: '⬒',
    adinkra: 'Compound house',
    description: 'Security and completeness. Awarded for finishing all 16 lessons.',
    requirement: 'Complete every lesson in the course.',
    tier: 'gold',
  },
  {
    id: 'nkyinkyim',
    name: 'Nkyinkyim',
    glyph: '∿',
    adinkra: 'Twisting / initiative',
    description: 'Adaptability and dynamism. Awarded for completing five 3D lab challenges.',
    requirement: 'Finish 5 lab task checklists.',
    tier: 'gold',
  },
  {
    id: 'bi-nka-bi',
    name: 'Bi Nka Bi',
    glyph: '🐟',
    adinkra: 'No one should bite the other',
    description: 'Peace and harmony. Awarded for mastering swarm and control lessons.',
    requirement: 'Pass the Swarm Behaviour and Control Systems lessons.',
    tier: 'silver',
  },
  {
    id: 'myco-bloom',
    name: 'Mycelium Bloom',
    glyph: '🍄',
    adinkra: 'Living network',
    description: 'You grew a living circuit. Awarded for the mycelium lab and 3 mycelium projects.',
    requirement: 'Complete the Mycelial Network lab and save 3 mycelium projects.',
    tier: 'gold',
  },
  {
    id: 'sirius-b',
    name: 'Sirius B',
    glyph: '✧',
    adinkra: 'Hidden companion',
    description: 'The unseen mass that moves the visible star. Awarded for 150 flashcards reviewed.',
    requirement: 'Review 150 flashcards.',
    tier: 'gold',
  },
  {
    id: 'ogun-forge',
    name: "Ọ̀gún's Forge",
    glyph: '🔥',
    adinkra: 'Iron and transformation',
    description: 'Mastery of the full 16-lesson arc and every boss quiz.',
    requirement: 'Complete all lessons and all 8 boss quizzes.',
    tier: 'orisha',
  },
  {
    id: 'wakanda',
    name: 'Vibranium Mind',
    glyph: '◈',
    adinkra: 'Unbreakable',
    description: 'You designed beyond the syllabus. Awarded for 10 saved Idea Lab projects.',
    requirement: 'Save 10 projects in the Idea Lab.',
    tier: 'orisha',
  },
  {
    id: 'quantum-griot',
    name: 'Quantum Griot',
    glyph: '⚛',
    adinkra: 'Keeper of the word',
    description: 'You carry the old stories into quantum territory.',
    requirement: 'Complete the Bloch Sphere lab and the Quantum Frontiers lesson.',
    tier: 'orisha',
  },
];

export const BADGE_MAP: Record<string, Badge> = Object.fromEntries(BADGES.map((b) => [b.id, b]));

/* ------------------------------------------------------------------ */
/* XP economy                                                          */
/* ------------------------------------------------------------------ */

export const XP = {
  lessonRead: 40,
  quizBase: 20,
  quizPerCorrect: 15,
  perfectBonus: 35,
  bossBase: 90,
  bossPerCorrect: 22,
  labTask: 25,
  flashcard: 3,
  streakDay: 30,
  projectSaved: 6,
} as const;

export function quizXp(correct: number, total: number, base: number = XP.quizBase, per: number = XP.quizPerCorrect): number {
  const raw = base + correct * per;
  return correct === total && total > 0 ? raw + XP.perfectBonus : raw;
}

export const ADINKRA_GLYPHS = [
  { name: 'Gye Nyame', glyph: '✺', meaning: 'Supremacy of the cosmic order' },
  { name: 'Sankofa', glyph: '↩', meaning: 'Return and retrieve what was lost' },
  { name: 'Adinkrahene', glyph: '◎', meaning: 'Leadership and greatness' },
  { name: 'Dwennimmen', glyph: '🐏', meaning: 'Humility with strength' },
  { name: 'Nkyinkyim', glyph: '∿', meaning: 'Adaptability and initiative' },
  { name: 'Fihankra', glyph: '⬒', meaning: 'Security and completeness' },
  { name: 'Akoma Ntoso', glyph: '♡', meaning: 'Understanding and agreement' },
  { name: 'Nyame Dua', glyph: '⍋', meaning: 'Sanctuary and protection' },
  { name: 'Sankofa', glyph: '↩', meaning: 'Learn from the past' },
  { name: 'Bi Nka Bi', glyph: '🐟', meaning: 'Peace and harmony' },
  { name: 'Epa', glyph: '⛓', meaning: 'Slavery and captivity — remember' },
  { name: 'Aya', glyph: '🌿', meaning: 'Endurance and resourcefulness' },
  { name: 'Denkyem', glyph: '🐊', meaning: 'Adaptability' },
  { name: 'Duafe', glyph: '🪮', meaning: 'Care and desire for beauty' },
  { name: 'Nsaa', glyph: '⬖', meaning: 'Excellence and authenticity' },
];
