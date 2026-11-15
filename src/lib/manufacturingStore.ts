import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProductionProject } from './manufacturing';
interface ForgeState {
  projects: ProductionProject[];
  learned: string[];
  quizBest: Record<string, number>;
  add: (p: ProductionProject) => void;
  update: (id: string, patch: Partial<ProductionProject>) => void;
  remove: (id: string) => void;
  complete: (id: string) => void;
  score: (id: string, n: number) => void;
}
export const useManufacturing = create<ForgeState>()(
  persist(
    (set) => ({
      projects: [],
      learned: [],
      quizBest: {},
      add: (p) => set((s) => ({ projects: [...s.projects, p] })),
      update: (id, patch) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...patch,
                  id: p.id,
                  payments:
                    patch.costs &&
                    (patch.costs.quantity !== p.costs.quantity || patch.costs.unitPrice !== p.costs.unitPrice)
                      ? p.payments.map((m) => ({ ...m, paid: false }))
                      : (patch.payments ?? p.payments),
                }
              : p,
          ),
        })),
      remove: (id) => set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),
      complete: (id) => set((s) => ({ learned: s.learned.includes(id) ? s.learned : [...s.learned, id] })),
      score: (id, n) => set((s) => ({ quizBest: { ...s.quizBest, [id]: Math.max(n, s.quizBest[id] ?? 0) } })),
    }),
    {
      name: 'ogun-manufacturing-v1',
      version: 1,
      partialize: (s) => ({ projects: s.projects, learned: s.learned, quizBest: s.quizBest }),
    },
  ),
);
