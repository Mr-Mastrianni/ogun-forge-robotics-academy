import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { XP, quizXp } from './progression';

export interface CardState {
  ease: number;
  interval: number; // days
  due: number; // epoch ms
  reps: number;
  lapses: number;
}

export interface ScoreRecord {
  correct: number;
  total: number;
  attempts: number;
  best: number;
}

export interface LabTaskState {
  [labId: string]: number[]; // completed task indices
}

interface ProgressState {
  xp: number;
  completedLessons: Record<string, true>;
  scores: Record<string, ScoreRecord>;
  bossScores: Record<string, number>;
  cards: Record<string, CardState>;
  labs: LabTaskState;
  labsVisited: string[];
  savedProjects: string[];
  seenBadges: string[];
  streakCount: number;
  lastStudyDay: string | null;
  xpToday: number;
  xpTodayDay: string | null;
  quizHistory: { day: string; correct: number; total: number }[];
  bonusXp: number;
  apprenticeName: string;
  soundOn: boolean;

  totalCardsReviewed: number;

  addXp: (n: number, reason?: string) => void;
  markLessonRead: (id: string) => void;
  recordQuiz: (lessonId: string, correct: number, total: number) => number;
  recordBoss: (bossId: string, correct: number, total: number) => number;
  reviewCard: (id: string, grade: 'again' | 'hard' | 'good' | 'easy') => void;
  introduceCard: (id: string) => void;
  toggleLabTask: (labId: string, index: number) => void;
  visitLab: (labId: string) => void;
  toggleProject: (id: string) => void;
  touchStreak: () => void;
  markBadgeSeen: (id: string) => void;
  setApprenticeName: (n: string) => void;
  toggleSound: () => void;
  resetAll: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

function dayDiff(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00Z').getTime();
  const db = new Date(b + 'T00:00:00Z').getTime();
  return Math.round((db - da) / 86400000);
}

const initial = {
  xp: 0,
  completedLessons: {} as Record<string, true>,
  scores: {} as Record<string, ScoreRecord>,
  bossScores: {} as Record<string, number>,
  cards: {} as Record<string, CardState>,
  labs: {} as LabTaskState,
  labsVisited: [] as string[],
  savedProjects: [] as string[],
  seenBadges: [] as string[],
  streakCount: 0,
  lastStudyDay: null as string | null,
  xpToday: 0,
  xpTodayDay: null as string | null,
  quizHistory: [] as { day: string; correct: number; total: number }[],
  bonusXp: 0,
  apprenticeName: 'Apprentice',
  soundOn: true,
  totalCardsReviewed: 0,
};

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initial,

      addXp: (n, _reason) =>
        set((s) => {
          const d = today();
          const sameDay = s.xpTodayDay === d;
          return {
            xp: s.xp + n,
            xpToday: sameDay ? s.xpToday + n : n,
            xpTodayDay: d,
            bonusXp: s.bonusXp + n,
          };
        }),

      markLessonRead: (id) =>
        set((s) => {
          if (s.completedLessons[id]) return s;
          return { completedLessons: { ...s.completedLessons, [id]: true }, xp: s.xp + XP.lessonRead };
        }),

      recordQuiz: (lessonId, correct, total) => {
        const gained = quizXp(correct, total);
        set((s) => {
          const prev = s.scores[lessonId];
          const best = Math.max(prev?.best ?? 0, correct);
          return {
            xp: s.xp + gained,
            scores: {
              ...s.scores,
              [lessonId]: { correct, total, attempts: (prev?.attempts ?? 0) + 1, best },
            },
            quizHistory: [...s.quizHistory, { day: today(), correct, total }].slice(-200),
            completedLessons: { ...s.completedLessons, [lessonId]: true },
          };
        });
        return gained;
      },

      recordBoss: (bossId, correct, total) => {
        const gained = quizXp(correct, total, XP.bossBase, XP.bossPerCorrect);
        set((s) => ({
          xp: s.xp + gained,
          bossScores: { ...s.bossScores, [bossId]: Math.max(s.bossScores[bossId] ?? 0, correct) },
          quizHistory: [...s.quizHistory, { day: today(), correct, total }].slice(-200),
        }));
        return gained;
      },

      introduceCard: (id) =>
        set((s) => {
          if (s.cards[id]) return s;
          return {
            cards: {
              ...s.cards,
              [id]: { ease: 2.5, interval: 0, due: Date.now(), reps: 0, lapses: 0 },
            },
          };
        }),

      reviewCard: (id, grade) =>
        set((s) => {
          const c = s.cards[id] ?? { ease: 2.5, interval: 0, due: Date.now(), reps: 0, lapses: 0 };
          let { ease, interval, lapses, reps } = c;
          reps += 1;
          if (grade === 'again') {
            ease = Math.max(1.3, ease - 0.2);
            interval = 0;
            lapses += 1;
          } else if (grade === 'hard') {
            ease = Math.max(1.3, ease - 0.15);
            interval = interval === 0 ? 1 : interval * 1.2;
          } else if (grade === 'good') {
            interval = interval === 0 ? 1 : interval * ease;
          } else {
            ease = Math.min(3.2, ease + 0.1);
            interval = interval === 0 ? 3 : interval * ease * 1.3;
          }
          interval = Math.min(365, Math.round(interval * 10) / 10);
          return {
            cards: { ...s.cards, [id]: { ease, interval, due: Date.now() + interval * 86400000, reps, lapses } },
            xp: s.xp + XP.flashcard,
            totalCardsReviewed: s.totalCardsReviewed + 1,
          };
        }),

      toggleLabTask: (labId, index) =>
        set((s) => {
          const cur = s.labs[labId] ?? [];
          const has = cur.includes(index);
          const next = has ? cur.filter((i) => i !== index) : [...cur, index];
          return {
            labs: { ...s.labs, [labId]: next },
            xp: has ? s.xp : s.xp + XP.labTask,
          };
        }),

      visitLab: (labId) =>
        set((s) => (s.labsVisited.includes(labId) ? s : { labsVisited: [...s.labsVisited, labId] })),

      toggleProject: (id) =>
        set((s) => {
          const has = s.savedProjects.includes(id);
          return {
            savedProjects: has ? s.savedProjects.filter((p) => p !== id) : [...s.savedProjects, id],
            xp: has ? s.xp : s.xp + XP.projectSaved,
          };
        }),

      touchStreak: () =>
        set((s) => {
          const d = today();
          if (s.lastStudyDay === d) return s;
          let streak = 1;
          if (s.lastStudyDay) {
            const diff = dayDiff(s.lastStudyDay, d);
            streak = diff === 1 ? s.streakCount + 1 : 1;
          }
          return {
            streakCount: streak,
            lastStudyDay: d,
            xp: s.xp + XP.streakDay,
            xpToday: s.xpTodayDay === d ? s.xpToday : XP.streakDay,
            xpTodayDay: d,
          };
        }),

      markBadgeSeen: (id) =>
        set((s) => (s.seenBadges.includes(id) ? s : { seenBadges: [...s.seenBadges, id] })),

      setApprenticeName: (n) => set({ apprenticeName: n.slice(0, 24) }),
      toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),

      resetAll: () => set({ ...initial }),
    }),
    {
      name: 'ogun-forge-progress-v1',
      version: 1,
      partialize: (s) => {
        const { ...rest } = s as unknown as ProgressState & Record<string, unknown>;
        const out: Record<string, unknown> = {};
        for (const k of Object.keys(initial)) out[k] = rest[k];
        return out as unknown as ProgressState;
      },
    },
  ),
);

/* ---------------------------- selectors ---------------------------- */

export function useDueCards() {
  return useProgress((s) =>
    Object.entries(s.cards)
      .filter(([, c]) => c.due <= Date.now())
      .map(([id]) => id),
  );
}

export function masteryPercent(scores: Record<string, ScoreRecord>): number {
  const vals = Object.values(scores);
  if (!vals.length) return 0;
  const sum = vals.reduce((a, b) => a + (b.total ? b.best / b.total : 0), 0);
  return Math.round((sum / vals.length) * 100);
}

export function getStreakInfo(s: { streakCount: number; lastStudyDay: string | null }) {
  const d = today();
  const active = s.lastStudyDay === d || (s.lastStudyDay ? dayDiff(s.lastStudyDay, d) <= 1 : false);
  return { count: s.streakCount, activeToday: s.lastStudyDay === d, alive: active };
}
