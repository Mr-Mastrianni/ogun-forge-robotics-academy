import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Backdrop } from './Backdrop';
import { CommandPalette } from './CommandPalette';
import { BADGES, levelFromXp, nextRank, rankFor, rankProgress } from '@/lib/progression';
import { useProgress } from '@/lib/store';
import { allProjects } from '@/content';
import { VIBE_META, VIBE_ORDER, applyUiToDom, systemPrefersReducedMotion, useUi } from '@/lib/uiStore';
import { Progress } from './ui';

/* ------------------------------------------------------------------ */
/* Navigation map — grouped so the app is scannable, not a wall of tabs */
/* ------------------------------------------------------------------ */

interface NavEntry {
  to: string;
  label: string;
  glyph: string;
  hint: string;
}

const NAV_GROUPS: { label: string; items: NavEntry[] }[] = [
  {
    label: 'Start here',
    items: [
      { to: '/', label: 'Home', glyph: '◉', hint: 'The guided 4-step path' },
      { to: '/course', label: 'Course roadmap', glyph: '⌘', hint: '16 lessons across 8 weeks' },
    ],
  },
  {
    label: 'Learn',
    items: [
      { to: '/labs', label: '3D Labs', glyph: '⚙', hint: 'Ten simulators you can break' },
      { to: '/mycelium', label: 'Mycelium Tech', glyph: '🍄', hint: 'Living machines and protocols' },
      { to: '/glossary', label: 'Glossary', glyph: '✎', hint: 'Every term, explained simply' },
    ],
  },
  {
    label: 'Practise',
    items: [
      { to: '/quiz', label: 'Quiz Arena', glyph: '⚔', hint: 'Lesson quizzes and boss trials' },
      { to: '/flashcards', label: 'Flashcards', glyph: '✦', hint: 'Spaced repetition, 155 cards' },
      { to: '/progress', label: 'Progress', glyph: '📈', hint: 'What to do next' },
    ],
  },
  {
    label: 'Reference',
    items: [
      { to: '/charts', label: 'Charts', glyph: '∿', hint: 'Your data and every graph' },
      { to: '/tables', label: 'Tables', glyph: '▦', hint: 'Compare real parts' },
      { to: '/atlas', label: 'Heritage Atlas', glyph: '✵', hint: 'Afro-technical lineage' },
    ],
  },
  {
    label: 'Build',
    items: [
      { to: '/ideas', label: 'Idea Lab', glyph: '🧬', hint: `${allProjects.length} blueprints to build` },
      { to: '/achievements', label: 'Trophies', glyph: '🏆', hint: 'Badges and ranks' },
      { to: '/beyond', label: 'What next', glyph: '🚀', hint: 'How to make it better' },
    ],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

const MOBILE_TABS: NavEntry[] = [
  { to: '/', label: 'Home', glyph: '◉', hint: '' },
  { to: '/course', label: 'Course', glyph: '⌘', hint: '' },
  { to: '/labs', label: 'Labs', glyph: '⚙', hint: '' },
  { to: '/ideas', label: 'Ideas', glyph: '🧬', hint: '' },
  { to: '/progress', label: 'You', glyph: '📈', hint: '' },
];

function sectionLabel(pathname: string): string {
  if (pathname === '/') return 'Home';
  const hit = [...ALL_ITEMS]
    .filter((i) => i.to !== '/')
    .sort((a, b) => b.to.length - a.to.length)
    .find((i) => pathname === i.to || pathname.startsWith(`${i.to}/`));
  if (hit) return hit.label;
  if (pathname.startsWith('/lesson')) return 'Lesson';
  if (pathname.startsWith('/boss')) return 'Boss trial';
  if (pathname.startsWith('/ideas/')) return 'Blueprint';
  return 'Ọ̀gún’s Forge';
}

/* ------------------------------------------------------------------ */

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

function FieldControls({ compact = false }: { compact?: boolean }) {
  const {
    vibe,
    setVibe,
    fontScale,
    bumpFontScale,
    motion: motionOn,
    toggleMotion,
    glow,
    toggleGlow,
    wideReading,
    toggleWideReading,
  } = useUi();

  return (
    <div className={`space-y-2 ${compact ? '' : 'holo-well p-2.5'}`}>
      {!compact && <div className="holo-kicker">Kinetic field</div>}
      <div className="grid grid-cols-3 gap-1">
        {VIBE_ORDER.map((v) => (
          <button
            key={v}
            onClick={() => setVibe(v)}
            title={VIBE_META[v].blurb}
            className={`rounded-lg border px-1 py-1.5 text-center font-mono text-[10px] transition-colors ${
              vibe === v
                ? 'border-[#67e8f9]/60 bg-[#67e8f9]/15 text-[#d8fbff]'
                : 'border-white/10 bg-white/[0.03] text-[#c9bde6] hover:text-white'
            }`}
          >
            <span className="mr-0.5">{VIBE_META[v].glyph}</span>
            {VIBE_META[v].label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#c9bde6]">Text</span>
        <button
          onClick={() => bumpFontScale(-0.05)}
          className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] py-1 font-mono text-[11px] text-[#ded4f2] hover:text-white"
          aria-label="Smaller text"
        >
          A−
        </button>
        <span className="w-9 text-center font-mono text-[10px] text-[#67e8f9]">{Math.round(fontScale * 100)}%</span>
        <button
          onClick={() => bumpFontScale(0.05)}
          className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] py-1 font-mono text-[11px] text-[#ded4f2] hover:text-white"
          aria-label="Larger text"
        >
          A+
        </button>
      </div>
      <div className="grid grid-cols-2 gap-1">
        <button
          onClick={toggleMotion}
          className={`rounded-lg border px-1.5 py-1 font-mono text-[10px] ${
            motionOn ? 'border-[#6ee7a8]/50 bg-[#6ee7a8]/12 text-[#b8f5d0]' : 'border-white/10 text-[#8c82a8]'
          }`}
        >
          motion {motionOn ? 'on' : 'off'}
        </button>
        <button
          onClick={toggleGlow}
          className={`rounded-lg border px-1.5 py-1 font-mono text-[10px] ${
            glow ? 'border-[#c026d3]/50 bg-[#c026d3]/12 text-[#f5c8ff]' : 'border-white/10 text-[#8c82a8]'
          }`}
        >
          glow {glow ? 'on' : 'off'}
        </button>
        <button
          onClick={toggleWideReading}
          className={`col-span-2 rounded-lg border px-1.5 py-1 font-mono text-[10px] ${
            wideReading ? 'border-[#f5b301]/50 bg-[#f5b301]/12 text-[#ffe9a8]' : 'border-white/10 text-[#8c82a8]'
          }`}
        >
          reading width: {wideReading ? 'wide' : 'comfortable'}
        </button>
      </div>
      {!compact && <p className="text-[10.5px] leading-snug text-[#8c82a8]">{VIBE_META[vibe].blurb}</p>}
    </div>
  );
}

function Brand({ small = false }: { small?: boolean }) {
  return (
    <NavLink to="/" className="flex items-center gap-2.5">
      <span className="relative grid h-10 w-10 place-items-center rounded-xl border border-[#67e8f9]/50 bg-gradient-to-br from-[#1b0a3a] to-[#05010f] text-lg shadow-[0_0_18px_rgba(103,232,249,0.35)]">
        🔥
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#6ee7a8] shadow-[0_0_10px_rgba(110,231,168,0.9)]" />
      </span>
      {!small && (
        <span className="leading-tight">
          <span className="block font-display text-[13px] tracking-wide text-vibranium">Ọ̀GÚN&apos;S FORGE</span>
          <span className="block font-mono text-[9px] uppercase tracking-[0.22em] text-[#8c82a8]">
            Robotics Engineering
          </span>
        </span>
      )}
    </NavLink>
  );
}

export function Layout() {
  const { xp, streakCount, apprenticeName, markBadgeSeen, seenBadges, resetAll, touchStreak } = useProgress();
  const rank = rankFor(xp);
  const nxt = nextRank(xp);
  const earned = useEarnedBadges();
  const [toast, setToast] = useState<{ name: string; glyph: string } | null>(null);
  const [sheet, setSheet] = useState(false);
  const [palette, setPalette] = useState(false);
  const loc = useLocation();
  // NOTE: the store flag is aliased so it does not shadow framer-motion's motion component
  const { vibe, fontScale, motion: motionOn, glow, wideReading } = useUi();

  useEffect(() => {
    applyUiToDom({ vibe, fontScale, motion: motionOn, glow, wideReading });
  }, [vibe, fontScale, motionOn, glow, wideReading]);

  useEffect(() => {
    const key = 'ogun-forge-ui-init';
    try {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(key, '1');
    } catch {
      return;
    }
    if (systemPrefersReducedMotion()) {
      const ui = useUi.getState();
      ui.setVibe('calm');
      if (ui.motion) ui.toggleMotion();
      applyUiToDom(useUi.getState());
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    setSheet(false);
  }, [loc.pathname]);

  useEffect(() => {
    const t = setTimeout(() => touchStreak(), 500);
    return () => clearTimeout(t);
  }, [touchStreak]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement)?.tagName ?? '');
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPalette((p) => !p);
      } else if (e.key === '/' && !typing) {
        e.preventDefault();
        setPalette(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

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

      <div className="mx-auto flex w-full max-w-[1620px]">
        {/* ------------------------------- sidebar ------------------------------ */}
        <aside className="sticky top-0 hidden h-screen w-[272px] flex-none flex-col border-r border-[#8b5cf6]/20 bg-[#06031a]/60 px-3 py-4 backdrop-blur-xl lg:flex">
          <Brand />

          <button
            onClick={() => setPalette(true)}
            className="mt-4 flex items-center gap-2 rounded-xl border border-[#67e8f9]/25 bg-white/[0.04] px-3 py-2 text-left transition-colors hover:border-[#67e8f9]/60"
          >
            <span className="text-[#67e8f9]">⌕</span>
            <span className="flex-1 font-body text-[12.5px] text-[#8c82a8]">Search everything…</span>
            <kbd className="rounded border border-white/15 px-1.5 py-0.5 font-mono text-[9.5px] text-[#c9bde6]">⌘K</kbd>
          </button>

          <nav className="side-nav mt-4 flex-1 space-y-4 overflow-y-auto pr-1">
            {NAV_GROUPS.map((g) => (
              <div key={g.label}>
                <div className="nav-group-label">{g.label}</div>
                <div className="space-y-0.5">
                  {g.items.map((it) => (
                    <NavLink
                      key={it.to}
                      to={it.to}
                      end={it.to === '/'}
                      className="nav-item"
                      data-active={loc.pathname === it.to || (it.to !== '/' && loc.pathname.startsWith(`${it.to}/`))}
                      title={it.hint}
                    >
                      <span className="nav-glyph">{it.glyph}</span>
                      <span className="flex-1 truncate">{it.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="mt-3 space-y-3">
            <div className="holo-well p-3">
              <div className="font-heading text-[12.5px] text-white">
                {rank.glyph} {rank.name}
              </div>
              <div className="font-mono text-[10px] text-[#8c82a8]">
                LVL {levelFromXp(xp)} · {xp} XP · 🔥 {streakCount}
              </div>
              <div className="mt-2">
                <Progress value={rankProgress(xp)} />
              </div>
              <div className="mt-1.5 font-mono text-[9.5px] text-[#8c82a8]">
                {nxt ? `${nxt.minXp - xp} XP to ${nxt.name}` : 'Peak rank reached'}
              </div>
            </div>
            <FieldControls />
            <button
              onClick={() => {
                if (confirm('Reset all progress? XP, scores, streaks and saved blueprints are cleared.')) resetAll();
              }}
              className="w-full rounded-lg border border-white/10 py-1.5 font-mono text-[10px] text-[#8c82a8] hover:text-[#ff6b1a]"
            >
              reset progress
            </button>
          </div>
        </aside>

        {/* -------------------------------- main -------------------------------- */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-50 border-b border-[#8b5cf6]/25 bg-[#05010f]/85 backdrop-blur-xl">
            <div className="kente-strip" />
            <div className="flex items-center gap-2 px-3 py-2 sm:px-4">
              <div className="lg:hidden">
                <Brand small />
              </div>

              <div className="hidden min-w-0 flex-1 items-center gap-3 lg:flex">
                <span className="holo-kicker">{sectionLabel(loc.pathname)}</span>
                <span className="h-4 w-px bg-white/10" />
                <button
                  onClick={() => setPalette(true)}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 font-mono text-[11px] text-[#c9bde6] hover:border-[#67e8f9]/50 hover:text-white"
                >
                  ⌕ search <kbd className="text-[9px] text-[#8c82a8]">⌘K</kbd>
                </button>
              </div>

              <div className="ml-auto flex items-center gap-1.5">
                <span className="stat-bead" title="XP earned">
                  ✦ {xp}
                </span>
                <span className="stat-bead" title="Days studied in a row">
                  🔥 {streakCount}
                </span>
                <button
                  onClick={() => useUi.getState().cycleVibe()}
                  title={`Kinetic field: ${VIBE_META[vibe].label}. Click to change.`}
                  className="rounded-lg border border-[#c026d3]/40 bg-[#c026d3]/10 px-2 py-1.5 font-mono text-[10.5px] text-[#f5c8ff] hover:border-[#c026d3]"
                >
                  {VIBE_META[vibe].glyph} {VIBE_META[vibe].label}
                </button>
                <button
                  onClick={() => setPalette(true)}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[13px] text-[#c9bde6] lg:hidden"
                  aria-label="Search"
                >
                  ⌕
                </button>
                <button
                  onClick={() => setSheet(true)}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[13px] text-[#c9bde6] lg:hidden"
                  aria-label="Open menu"
                >
                  ☰
                </button>
              </div>
            </div>
          </header>

          <main className="relative z-10 min-w-0 flex-1 px-3 pb-28 pt-5 sm:px-5 lg:pb-16">
            <Outlet />
          </main>

          <footer className="relative z-10 mt-8 border-t border-[#8b5cf6]/20 bg-[#05010f]/70 backdrop-blur">
            <div className="kente-strip" />
            <div className="grid gap-6 px-5 py-8 md:grid-cols-4">
              <div>
                <div className="font-display text-sm text-vibranium">Ọ̀GÚN&apos;S FORGE</div>
                <p className="mt-2 text-xs leading-relaxed text-[#c9bde6]">
                  An 8-week robotics engineering academy with 3D labs, boss trials, spaced-repetition flashcards and a
                  living-materials blueprint library. Built in the spirit of the blacksmith who clears the road.
                </p>
              </div>
              {[
                { title: 'Learn', items: [...NAV_GROUPS[0].items, ...NAV_GROUPS[1].items] },
                { title: 'Practise', items: NAV_GROUPS[2].items },
                { title: 'Reference & build', items: [...NAV_GROUPS[3].items, ...NAV_GROUPS[4].items] },
              ].map((col) => (
                <div key={col.title}>
                  <div className="mb-2 font-heading text-xs uppercase tracking-widest text-[#d8fbff]">{col.title}</div>
                  <ul className="space-y-1 text-xs text-[#c9bde6]">
                    {col.items.map((i) => (
                      <li key={i.to}>
                        <NavLink className="hover:text-[#67e8f9]" to={i.to}>
                          {i.glyph} {i.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t border-white/5 px-5 py-3 text-center font-mono text-[10px] tracking-wider text-[#8c82a8]">
              Built with Vite · React · three.js · Recharts · KaTeX — themed after Ọ̀gún&apos;s forge, Dogon starlight and
              living mycelium. Press <span className="text-[#67e8f9]">⌘K</span> anywhere to search. Apprentice:{' '}
              <span className="text-[#c9bde6]">{apprenticeName}</span>.
            </div>
          </footer>
        </div>
      </div>

      {/* ---------------------------- mobile tab bar ---------------------------- */}
      <nav className="tabbar fixed bottom-0 left-0 right-0 z-50 grid grid-cols-5 gap-1 px-2 py-1.5 lg:hidden">
        {MOBILE_TABS.map((t) => {
          const active = loc.pathname === t.to || (t.to !== '/' && loc.pathname.startsWith(t.to));
          return (
            <NavLink key={t.to} to={t.to} className="tab-item" data-active={active}>
              <span className="tab-glyph">{t.glyph}</span>
              <span>{t.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* ------------------------------ nav sheet ------------------------------ */}
      <AnimatePresence>
        {sheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] lg:hidden"
            onClick={() => setSheet(false)}
          >
            <div className="absolute inset-0 bg-[#02000a]/85 backdrop-blur-sm" />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-3xl border-t border-[#8b5cf6]/40 bg-[#07031c]/95 p-4 pb-24"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="holo-kicker">Navigate</span>
                <button
                  onClick={() => setSheet(false)}
                  className="rounded-lg border border-white/15 px-3 py-1 font-mono text-[11px] text-[#c9bde6]"
                >
                  close
                </button>
              </div>
              <button
                onClick={() => {
                  setSheet(false);
                  setPalette(true);
                }}
                className="mb-4 flex w-full items-center gap-2 rounded-xl border border-[#67e8f9]/30 bg-white/[0.04] px-3 py-2.5 text-left"
              >
                <span className="text-[#67e8f9]">⌕</span>
                <span className="font-body text-[13px] text-[#c9bde6]">Search everything…</span>
              </button>
              <div className="space-y-4">
                {NAV_GROUPS.map((g) => (
                  <div key={g.label}>
                    <div className="nav-group-label">{g.label}</div>
                    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                      {g.items.map((it) => (
                        <NavLink key={it.to} to={it.to} end={it.to === '/'} className="nav-item" data-active={false}>
                          <span className="nav-glyph">{it.glyph}</span>
                          <span className="flex-1">
                            <span className="block font-heading text-[13px] text-white">{it.label}</span>
                            <span className="block text-[11px] text-[#8c82a8]">{it.hint}</span>
                          </span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <FieldControls />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CommandPalette open={palette} onClose={() => setPalette(false)} />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            className="fixed bottom-20 left-1/2 z-[60] -translate-x-1/2 lg:bottom-6"
          >
            <div className="glass panel-edge flex items-center gap-3 px-5 py-3">
              <span className="text-2xl">{toast.glyph}</span>
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#67e8f9]">Adinkra unlocked</div>
                <div className="font-heading text-sm text-white">{toast.name}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
