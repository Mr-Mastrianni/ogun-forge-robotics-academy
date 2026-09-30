import { Link, useNavigate, useParams } from 'react-router-dom';
import { Chip, Panel, Progress } from '@/components/ui';
import { QuizRunner } from '@/components/QuizRunner';
import { bossQuizzes, lessonById } from '@/content';
import { useProgress } from '@/lib/store';
import { BADGE_MAP } from '@/lib/progression';

export default function BossQuizPage() {
  const { week } = useParams();
  const nav = useNavigate();
  const boss = bossQuizzes.find((b) => String(b.week) === String(week));
  const recordBoss = useProgress((s) => s.recordBoss);
  const bossScores = useProgress((s) => s.bossScores);

  if (!boss) {
    return (
      <Panel className="p-6 text-center">
        <p className="text-[#c9bde6]">No boss trial for that week.</p>
        <Link to="/quiz" className="btn btn-primary mt-4">
          back to the arena
        </Link>
      </Panel>
    );
  }

  const badge = BADGE_MAP[boss.badgeId];
  const best = bossScores[boss.id];
  const passed = best !== undefined && best / boss.questions.length >= 0.8;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#c9bde6]">
        <Link to="/quiz" className="hover:text-[#f5b301]">
          ← quiz arena
        </Link>
        <span>/</span>
        <span className="text-[#f5b301]">boss trial · week {boss.week}</span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0">
          <div className="mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <Chip tone="psy">BOSS TRIAL</Chip>
              <Chip tone="dim">{boss.questions.length} questions</Chip>
              <Chip tone="dim">25 s each</Chip>
              <Chip tone="dim">+{boss.xp} XP</Chip>
              {passed && <Chip tone="myco">✓ passed</Chip>}
            </div>
            <h1 className="mt-2 font-display text-3xl text-[#f5b301] md:text-4xl">{boss.title}</h1>
            <p className="mt-2 text-[14px] text-[#c9bde6]">{boss.subtitle}</p>
          </div>

          <QuizRunner
            key={boss.id}
            questions={boss.questions}
            title={`Week ${boss.week} · ${boss.title}`}
            subtitle={`Tests: ${boss.lessonIds.map((id) => lessonById[id]?.title ?? id).join(' + ')}`}
            secondsPerQuestion={25}
            bossMode
            onSubmit={(c, t) => recordBoss(boss.id, c, t)}
            onDone={() => nav('/quiz')}
          />
        </div>

        <aside className="space-y-4">
          <Panel tone="hot" className="p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#ffd0b0]">stakes</div>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-3xl">{badge?.glyph ?? '⚔'}</span>
              <div>
                <div className="font-heading text-sm text-white">{badge?.name ?? 'Trial badge'}</div>
                <div className="text-[11px] text-[#e8d8ff]">{badge?.adinkra}</div>
              </div>
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-[#e8d8ff]">
              Pass with 80% or more to claim <strong>{badge?.name}</strong> — {badge?.description}
            </p>
            <div className="mt-3">
              <Progress value={best !== undefined ? best / boss.questions.length : 0} label="best score" />
            </div>
          </Panel>

          <Panel className="p-4">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#f5b301]">covers</div>
            <ul className="space-y-1.5">
              {boss.lessonIds.map((id) => {
                const l = lessonById[id];
                return (
                  <li key={id}>
                    <Link to={`/lesson/${id}`} className="text-[12.5px] text-[#ded4f2] hover:text-[#f5b301]">
                      L{l?.number} · {l?.title ?? id}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Panel>

          <Panel tone="myco" className="p-4">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#6ee7a8]">before you enter</div>
            <ul className="space-y-1.5 text-[12.5px] leading-relaxed text-[#cfe9dc]">
              <li>· Run both lessons' labs at least once.</li>
              <li>· Read the key terms; the boss quizzes definitions.</li>
              <li>· The clock is real — 25 seconds is enough to think, not to derive.</li>
            </ul>
          </Panel>

          <Panel className="p-4">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#f5b301]">other trials</div>
            <div className="grid grid-cols-4 gap-1.5">
              {bossQuizzes.map((b) => (
                <Link
                  key={b.id}
                  to={`/boss/${b.week}`}
                  className={`rounded-lg border px-1.5 py-1.5 text-center font-mono text-[11px] ${
                    b.week === boss.week
                      ? 'border-[#f5b301]/60 bg-[#f5b301]/15 text-[#ffe9a8]'
                      : 'border-white/10 bg-white/[0.03] text-[#c9bde6] hover:text-white'
                  }`}
                >
                  W{b.week}
                </Link>
              ))}
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}
