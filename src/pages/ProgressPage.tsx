import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { Chip, Panel, Progress, SectionTitle, StatOrb } from '@/components/ui';
import { LABS } from '@/components/labs';
import { TRACK_LABELS, allProjects, bossQuizzes, flashcards, lessons, projectById, weeks } from '@/content';
import type { TrackId } from '@/content/types';
import { useProgress } from '@/lib/store';
import { RANKS, levelFromXp, nextRank, rankFor, rankProgress } from '@/lib/progression';

export default function ProgressPage() {
  const s = useProgress();
  const done = Object.keys(s.completedLessons).length;
  const rank = rankFor(s.xp);
  const nxt = nextRank(s.xp);

  const trackStats = useMemo(
    () =>
      Object.entries(TRACK_LABELS).map(([track, label]) => {
        const ls = lessons.filter((l) => l.track === track);
        const read = ls.filter((l) => s.completedLessons[l.id]).length;
        const scored = ls.filter((l) => s.scores[l.id]);
        const mastery = scored.length
          ? Math.round((scored.reduce((a, l) => a + s.scores[l.id].best / s.scores[l.id].total, 0) / scored.length) * 100)
          : 0;
        return { track, label, total: ls.length, read, mastery };
      }),
    [s.completedLessons, s.scores],
  );

  const weakLessons = useMemo(
    () =>
      lessons
        .map((l) => ({ l, score: s.scores[l.id] }))
        .filter(({ score }) => !score || score.best / score.total < 0.85)
        .sort((a, b) => {
          const av = a.score ? a.score.best / a.score.total : -1;
          const bv = b.score ? b.score.best / b.score.total : -1;
          return av - bv;
        })
        .slice(0, 5),
    [s.scores],
  );

  const dueCards = useMemo(() => flashcards.filter((c) => s.cards[c.id] && s.cards[c.id].due <= Date.now()).length, [s.cards]);

  const heat = useMemo(() => {
    const days: { day: string; n: number }[] = [];
    const now = new Date();
    for (let i = 27; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const key = d.toISOString().slice(0, 10);
      const n = s.quizHistory.filter((q) => q.day === key).length;
      days.push({ day: key, n });
    }
    return days;
  }, [s.quizHistory]);

  const labChallenges = Object.values(s.labs).reduce((a, b) => a + b.length, 0);
  const totalLabTasks = LABS.reduce((a, l) => a + l.tasks.length, 0);

  const nextLesson = lessons.find((l) => !s.completedLessons[l.id]);
  const nextBoss = bossQuizzes.find((b) => s.bossScores[b.id] === undefined);

  return (
    <div className="space-y-7">
      <SectionTitle
        eyebrow="your run"
        title="Progress & Next Moves"
        sub="Everything the app has recorded about your ascent, plus exactly what to do next — the single most useful page when you sit down to study."
        right={
          <div className="flex flex-wrap gap-2">
            <Link to="/flashcards" className="btn btn-ghost">
              ✦ {dueCards} cards due
            </Link>
            <Link to="/quiz" className="btn btn-primary">
              ⚔ arena
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
        <StatOrb value={`${done}/16`} label="lessons read" glyph="⌘" />
        <StatOrb value={s.xp} label="XP" glyph="✦" tone="myco" />
        <StatOrb value={levelFromXp(s.xp)} label="level" glyph="◎" tone="psy" />
        <StatOrb value={`${s.streakCount}d`} label="streak" glyph="🔥" tone="sirius" />
        <StatOrb value={`${labChallenges}/${totalLabTasks}`} label="lab challenges" glyph="⚙" />
        <StatOrb value={`${Object.keys(s.bossScores).length}/8`} label="boss trials" glyph="⚔" tone="gold" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <Panel className="p-5">
            <div className="mb-3 font-heading text-sm text-white">Week by week</div>
            <div className="space-y-3">
              {weeks.map((w) => {
                const read = w.lessons.filter((l) => s.completedLessons[l.id]).length;
                const boss = bossQuizzes.find((b) => b.week === w.week);
                const bossScore = boss ? s.bossScores[boss.id] : undefined;
                const bossPct = boss && bossScore !== undefined ? bossScore / boss.questions.length : 0;
                return (
                  <div key={w.week} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-lg border border-[#f5b301]/40 font-mono text-[11px] text-[#f5b301]">
                        W{w.week}
                      </span>
                      <span className="font-heading text-[13px] text-white">{w.title}</span>
                      <div className="ml-auto flex items-center gap-2">
                        <Chip tone="dim">
                          {read}/{w.lessons.length} lessons
                        </Chip>
                        {bossScore !== undefined && (
                          <Chip tone={bossPct >= 0.8 ? 'myco' : 'psy'}>
                            boss {bossScore}/{boss?.questions.length}
                          </Chip>
                        )}
                      </div>
                    </div>
                    <div className="mt-2">
                      <Progress value={(read + (bossPct >= 0.8 ? 1 : 0)) / (w.lessons.length + 1)} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel className="p-5">
            <div className="mb-3 font-heading text-sm text-white">Track mastery</div>
            <div className="grid gap-3 sm:grid-cols-2">
              {trackStats.map((t) => (
                <div key={t.track}>
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="font-heading text-[12.5px] text-[#ded4f2]">{t.label}</span>
                    <span className="font-mono text-[10.5px] text-[#c9bde6]">
                      {t.read}/{t.total} read · {t.mastery}%
                    </span>
                  </div>
                  <Progress value={t.mastery / 100} />
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="p-5">
            <div className="mb-3 font-heading text-sm text-white">Study activity — last 28 days</div>
            <div className="flex flex-wrap gap-1.5">
              {heat.map((d) => (
                <span
                  key={d.day}
                  title={`${d.day}: ${d.n} quiz attempt${d.n === 1 ? '' : 's'}`}
                  className="h-6 w-6 rounded-md border"
                  style={{
                    background: d.n === 0 ? 'rgba(255,255,255,0.04)' : d.n < 3 ? 'rgba(245,179,1,0.4)' : 'rgba(110,231,168,0.75)',
                    borderColor: d.n === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(245,179,1,0.4)',
                  }}
                />
              ))}
            </div>
            <p className="mt-2 text-[12px] text-[#c9bde6]">
              Each square is a day. Streaks pay +30 XP and, more importantly, they are the only thing that makes
              spaced repetition work.
            </p>
          </Panel>

          <Panel tone="myco" className="p-5">
            <div className="mb-3 font-heading text-sm text-white">Your forge list — saved blueprints</div>
            {s.savedProjects.length === 0 ? (
              <p className="text-[12.5px] text-[#cfe9dc]">
                Nothing saved yet. Browse the Idea Lab and star the builds you want to attempt — saving earns +6 XP each
                and shapes your capstone.
              </p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {s.savedProjects.map((id) => {
                  const p = projectById[id];
                  if (!p) return null;
                  return (
                    <Link
                      key={id}
                      to={`/ideas/${id}`}
                      className="rounded-xl border border-[#6ee7a8]/25 bg-[#6ee7a8]/5 p-2.5 text-[12.5px] text-[#cfe9dc] hover:border-[#6ee7a8]/60"
                    >
                      <div className="font-heading text-[12.5px] text-white">{p.title}</div>
                      <div className="mt-0.5 font-mono text-[10px] text-[#6ee7a8]">
                        {p.category} · {p.buildTime} · {p.costBand}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
            <Link to="/ideas" className="btn btn-myco mt-4 w-full !py-1.5 text-[12px]">
              {s.savedProjects.length >= 10 ? 'Vibranium Mind unlocked ★' : `add ${10 - s.savedProjects.length} more for Vibranium Mind`}
            </Link>
          </Panel>
        </div>

        <aside className="space-y-4">
          <Panel className="p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#f5b301]">rank</div>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-3xl">{rank.glyph}</span>
              <div>
                <div className="font-display text-lg text-white">{rank.name}</div>
                <div className="text-[11.5px] text-[#c9bde6]">{rank.blurb}</div>
              </div>
            </div>
            <div className="mt-3">
              <Progress value={rankProgress(s.xp)} label={nxt ? `next: ${nxt.name}` : 'peak rank'} />
            </div>
            <div className="mt-3 space-y-1">
              {RANKS.map((r) => (
                <div
                  key={r.id}
                  className={`flex items-center gap-2 text-[11.5px] ${
                    s.xp >= r.minXp ? 'text-[#ded4f2]' : 'text-[#8c82a8]'
                  }`}
                >
                  <span>{r.glyph}</span>
                  <span className="flex-1">{r.name}</span>
                  <span className="font-mono text-[10px]">{r.minXp}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel tone="psy" className="p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#f5c8ff]">do this next</div>
            <ul className="mt-2 space-y-3">
              {nextLesson && (
                <li>
                  <Link to={`/lesson/${nextLesson.id}`} className="block">
                    <div className="font-heading text-[13px] text-white">→ Read L{nextLesson.number}: {nextLesson.title}</div>
                    <div className="text-[11.5px] text-[#e8d8ff]">the next unread lesson in the sequence</div>
                  </Link>
                </li>
              )}
              {dueCards > 0 && (
                <li>
                  <Link to="/flashcards" className="block">
                    <div className="font-heading text-[13px] text-white">→ Clear {dueCards} due flashcards</div>
                    <div className="text-[11.5px] text-[#e8d8ff]">takes about {Math.ceil(dueCards * 0.3)} minutes</div>
                  </Link>
                </li>
              )}
              {weakLessons[0] && (
                <li>
                  <Link to={`/quiz/${weakLessons[0].l.id}`} className="block">
                    <div className="font-heading text-[13px] text-white">
                      → Re-quiz L{weakLessons[0].l.number}: {weakLessons[0].l.title}
                    </div>
                    <div className="text-[11.5px] text-[#e8d8ff]">
                      your weakest area
                      {weakLessons[0].score
                        ? ` (${weakLessons[0].score.best}/${weakLessons[0].score.total})`
                        : ' (not attempted)'}
                    </div>
                  </Link>
                </li>
              )}
              {nextBoss && (
                <li>
                  <Link to={`/boss/${nextBoss.week}`} className="block">
                    <div className="font-heading text-[13px] text-white">→ Face {nextBoss.title}</div>
                    <div className="text-[11.5px] text-[#e8d8ff]">week {nextBoss.week} boss trial, 10 questions</div>
                  </Link>
                </li>
              )}
              {LABS.filter((l) => (s.labs[l.id]?.length ?? 0) < l.tasks.length)[0] && (
                <li>
                  <Link
                    to={`/labs/${LABS.filter((l) => (s.labs[l.id]?.length ?? 0) < l.tasks.length)[0].id}`}
                    className="block"
                  >
                    <div className="font-heading text-[13px] text-white">
                      → Finish the {LABS.filter((l) => (s.labs[l.id]?.length ?? 0) < l.tasks.length)[0].name}
                    </div>
                    <div className="text-[11.5px] text-[#e8d8ff]">lab challenges still open</div>
                  </Link>
                </li>
              )}
            </ul>
          </Panel>

          <Panel className="p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#f5b301]">weakest five</div>
            <ul className="mt-2 space-y-2">
              {weakLessons.map(({ l, score }) => (
                <li key={l.id} className="flex items-center gap-2">
                  <Link to={`/lesson/${l.id}`} className="flex-1 text-[12px] leading-snug text-[#ded4f2] hover:text-[#f5b301]">
                    L{l.number} · {l.title}
                  </Link>
                  <span
                    className="font-mono text-[10.5px]"
                    style={{ color: !score ? '#ff6b1a' : score.best / score.total >= 0.7 ? '#f5b301' : '#ff2fb9' }}
                  >
                    {score ? `${Math.round((score.best / score.total) * 100)}%` : 'new'}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel className="p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#f5b301]">content available</div>
            <div className="mt-2 space-y-1 font-mono text-[11.5px] text-[#c9bde6]">
              <div className="flex justify-between">
                <span>lessons</span>
                <span>{lessons.length}</span>
              </div>
              <div className="flex justify-between">
                <span>flashcards total</span>
                <span>{flashcards.length}</span>
              </div>
              <div className="flex justify-between">
                <span>cards in rotation</span>
                <span>{Object.keys(s.cards).length}</span>
              </div>
              <div className="flex justify-between">
                <span>cards reviewed</span>
                <span>{s.totalCardsReviewed}</span>
              </div>
              <div className="flex justify-between">
                <span>blueprints</span>
                <span>{allProjects.length}</span>
              </div>
              <div className="flex justify-between">
                <span>labs visited</span>
                <span>
                  {s.labsVisited.length}/{LABS.length}
                </span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {LABS.map((l) => (
                <Link key={l.id} to={`/labs/${l.id}`} title={l.name}>
                  <Chip tone={s.labsVisited.includes(l.id) ? 'myco' : 'dim'}>{l.glyph}</Chip>
                </Link>
              ))}
            </div>
          </Panel>

          <Panel tone="hot" className="p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#ffd0b0]">danger zone</div>
            <p className="mt-2 text-[12px] leading-relaxed text-[#f3e9ff]">
              Reset clears XP, scores, streaks, flashcard scheduling and saved blueprints. There is no undo.
            </p>
            <button
              onClick={() => {
                if (confirm('Reset all progress? This cannot be undone.')) s.resetAll();
              }}
              className="btn btn-ghost mt-3 w-full !py-1.5 text-[12px]"
            >
              reset everything
            </button>
          </Panel>
        </aside>
      </div>
    </div>
  );
}
