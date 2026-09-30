import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Backdrop } from './Backdrop';
import { BADGES, rankFor, nextRank, rankProgress, levelFromXp } from '@/lib/progression';
import { useProgress } from '@/lib/store';
import { Progress } from './ui';

const NAV = [
  { to: '/', label: 'Home', glyph: '◉' },
  { to: '/course', label: 'Course', glyph: '⌘' },
  { to: '/labs', label: '3D Labs', glyph: '⚙' },
  { to: '/quiz', label: 'Quiz Arena', glyph: '⚔' },
  { to: '/flashcards', label: 'Flashcards', glyph: '✦' },
  { to: '/charts', label: 'Charts', glyph: '∿' },
  { to: '/tables', label: 'Tables', glyph: '▦' },
  { to: '/ideas', label: 'Idea Lab', glyph: '🍄' },
  { to: '/atlas', label: 'Atlas', glyph: '✵' },
  { to: '/achievements', label: 'Trophies', glyph: '🏆' },
  { to: '/progress', label: 'Progress', glyph: '📈' },
  { to: '/glossary', label: 'Glossary', glyph: '✎' },
  { to: '/beyond', label: 'What Next', glyph: '🚀' },
];

function useEarnedBadges() {
  const s = useProgress();
  return useMemo(() => {
    const earned = new Set<string>();
    const lessonsDone = Object.keys(s.completedLessons).length;
    if (lessonsDone >= 1) earned.add('gye-nyame');
    if (Object.values(s.scores).some((v) => v.total > 0 && v.best === v.total)) earned.add('dwennimmen');
    if (Object.values(s.scores).some((v) => v.attempts > 1 && v.best === v.total)) earned.add('sankofa');
    if (s.streakCount >= 3) earned.add('nyame-dua');
    if (Object.values(s.bossScores).some((v) => v >= 8)) earned.add('akoma');
    if (Object.values(s.bossScores).length >= 1) earned.add('adinkrahene');
    if (lessonsDone >= 16) earned.add('fihankra');
    const labTasks = Object.values(s.labs).reduce((a, b) => a + b.length, 0);
    if (labTasks >= 5) earned.add('nkyinkyim');
    if (s.completedLessons['w3l5'] && s.completedLessons['w3l6']) earned.add('bi-nka-bi');
    if ((s.labs['mycelium']?.length ?? 0) >= 3 && s.savedProjects.filter((p) => p.includes('myc')).length >= 3)
      earned.add('myco-bloom');
    if (s.totalCardsReviewed >= 150) earned.add('sirius-b');
    if (lessonsDone >= 16 && Object.keys(s.bossScores).length >= 8) earned.add('ogun-forge');
    if (s.savedProjects.length >= 10) earned.add('wakanda');
    if ((s.labs['bloch']?.length ?? 0) >= 2 && s.completedLessons['w8l16']) earned.add('quantum-griot');
    return earned;
  }, [s.completedLessons, s.scores, s.bossScores, s.labs, s.savedProjects, s.streakCount, s.totalCardsReviewed]);
}

export function Layout() {
  const { xp, streakCount, apprenticeName, markBadgeSeen, seenBadges, resetAll, touchStreak } = useProgress();
  const rank = rankFor(xp);
  const nxt = nextRank(xp);
  const earned = useEarnedBadges();
  const [toast, setToast] = useState<{ name: string; glyph: string } | null>(null);
  const [menu, setMenu] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    setMenu(false);
  }, [loc.pathname]);

  useEffect(() => {
    const t = setTimeout(() => touchStreak(), 500);
    return () => clearTimeout(t);
  }, [touchStreak]);

  useEffect(() => {
    const fresh = [...earned].find((id) => !seenBadges.includes(id));
    if (fresh) {
      const b = BADGES.find((x) => x.id === fresh);
      if (b) {
        setToast({ name: b.name, glyph: b.glyph });
        markBadgeSeen(fresh);
        const t = setTimeout(() => setToast(null), 5200);
        return () => clearTimeout(t);
      }
    }
  }, [earned, seenBadges, markBadgeSeen]);

  return (
    <div className="relative min-h-screen">
      <Backdrop />

      <header className="sticky top-0 z-50 border-b border-[#f5b301]/20 bg-[#05010f]/80 backdrop-blur-xl">
        <div className="kente-strip" />
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-2.5">
          <NavLink to="/" className="flex shrink-0 items-center gap-2.5">
            <span className="relative grid h-10 w-10 place-items-center rounded-xl border border-[#f5b301]/50 bg-gradient-to-br from-[#2a0d04] to-[#120a2e] text-lg text-[#f5b301] shadow-gold">
              🔥
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block font-display text-[13px] tracking-wide text-[#f5b301]">Ọ̀GÚN&apos;S FORGE</span>
              <span className="block font-mono text-[9px] uppercase tracking-[0.24em] text-[#c9bde6]">
                Robotics Engineering
              </span>
            </span>
          </NavLink>

          <nav className="hidden flex-1 items-center gap-0.5 overflow-x-auto lg:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 font-heading text-[12.5px] font-medium transition-colors ${
                    isActive
                      ? 'bg-[#f5b301]/15 text-[#ffe9a8] shadow-[inset_0_0_0_1px_rgba(245,179,1,0.4)]'
                      : 'text-[#c9bde6] hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <span className="text-[13px]">{n.glyph}</span>
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-xl border border-[#f5b301]/25 bg-white/[0.03] px-2.5 py-1.5 md:flex">
              <span className="text-base">{rank.glyph}</span>
              <div className="leading-none">
                <div className="font-heading text-[11px] text-[#ffe9a8]">{rank.name}</div>
                <div className="font-mono text-[9px] text-[#c9bde6]">
                  LVL {levelFromXp(xp)} · {xp} XP
                </div>
              </div>
              <div className="w-14">
                <Progress value={rankProgress(xp)} />
              </div>
            </div>
            <span className="chip">🔥 {streakCount}</span>
            <button
              onClick={() => setMenu((m) => !m)}
              className="btn btn-ghost !px-3 !py-1.5 lg:hidden"
              aria-label="Toggle navigation"
            >
              ☰
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menu && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-white/10 lg:hidden"
            >
              <div className="grid grid-cols-3 gap-1.5 p-3 sm:grid-cols-4">
                {NAV.map((n) => (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    end={n.to === '/'}
                    className={({ isActive }) =>
                      `flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-center font-heading text-[11px] ${
                        isActive
                          ? 'border-[#f5b301]/50 bg-[#f5b301]/15 text-[#ffe9a8]'
                          : 'border-white/10 bg-white/[0.03] text-[#c9bde6]'
                      }`
                    }
                  >
                    <span className="text-base">{n.glyph}</span>
                    {n.label}
                  </NavLink>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 pb-24 pt-6">
        <Outlet />
      </main>

      <footer className="border-t border-[#f5b301]/20 bg-[#05010f]/70 backdrop-blur">
        <div className="kente-strip" />
        <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-8 md:grid-cols-4">
          <div>
            <div className="font-display text-sm text-[#f5b301]">Ọ̀GÚN&apos;S FORGE</div>
            <p className="mt-2 text-xs leading-relaxed text-[#c9bde6]">
              An 8-week, 16-lesson robotics engineering academy with 3D labs, boss quizzes, spaced-repetition
              flashcards, and a DIY mycelium robo-tech idea lab. Taught in the spirit of the blacksmith who clears
              the road.
            </p>
          </div>
          <div>
            <div className="mb-2 font-heading text-xs uppercase tracking-widest text-[#ffe9a8]">Course</div>
            <ul className="space-y-1 text-xs text-[#c9bde6]">
              <li><NavLink className="hover:text-[#f5b301]" to="/course">8-Week Roadmap</NavLink></li>
              <li><NavLink className="hover:text-[#f5b301]" to="/labs">Interactive 3D Labs</NavLink></li>
              <li><NavLink className="hover:text-[#f5b301]" to="/quiz">Boss Quizzes</NavLink></li>
              <li><NavLink className="hover:text-[#f5b301]" to="/flashcards">Flashcard SRS</NavLink></li>
            </ul>
          </div>
          <div>
            <div className="mb-2 font-heading text-xs uppercase tracking-widest text-[#ffe9a8]">Reference</div>
            <ul className="space-y-1 text-xs text-[#c9bde6]">
              <li><NavLink className="hover:text-[#f5b301]" to="/tables">Engineering Tables</NavLink></li>
              <li><NavLink className="hover:text-[#f5b301]" to="/charts">Data &amp; Charts</NavLink></li>
              <li><NavLink className="hover:text-[#f5b301]" to="/glossary">Glossary</NavLink></li>
              <li><NavLink className="hover:text-[#f5b301]" to="/atlas">Heritage Atlas</NavLink></li>
            </ul>
          </div>
          <div>
            <div className="mb-2 font-heading text-xs uppercase tracking-widest text-[#ffe9a8]">Apprentice</div>
            <div className="text-xs text-[#c9bde6]">
              <div>
                Name: <span className="text-[#ffe9a8]">{apprenticeName}</span>
              </div>
              <div>
                Rank: <span className="text-[#ffe9a8]">{rank.name}</span>
              </div>
              <div>
                Next: <span className="text-[#ffe9a8]">{nxt ? `${nxt.name} @ ${nxt.minXp} XP` : 'Peak reached'}</span>
              </div>
              <button onClick={resetAll} className="mt-2 font-mono text-[10px] text-[#ff6b1a] underline">
                reset all progress
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 px-4 py-3 text-center font-mono text-[10px] tracking-wider text-[#8c82a8]">
          Built with Vite · React · three.js · Recharts · KaTeX — themed after Ọ̀gún&apos;s forge, the Dogon star
          fields, and living mycelium.
        </div>
      </footer>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2"
          >
            <div className="glass panel-edge flex items-center gap-3 px-5 py-3 shadow-glow">
              <span className="text-2xl">{toast.glyph}</span>
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#f5b301]">
                  Adinkra unlocked
                </div>
                <div className="font-heading text-sm text-white">{toast.name}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
