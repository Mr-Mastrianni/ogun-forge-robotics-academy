import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Chip, Panel, SectionTitle, StatOrb } from '@/components/ui';
import { QuizRunner } from '@/components/QuizRunner';
import { allQuizQuestions, bossQuizzes, lessonById, lessons } from '@/content';
import { useProgress } from '@/lib/store';
import { Math as MathTex } from '@/lib/rich';

export default function QuizArena() {
  const { lessonId } = useParams();
  const nav = useNavigate();
  const recordQuiz = useProgress((s) => s.recordQuiz);
  const recordBoss = useProgress((s) => s.recordBoss);
  const scores = useProgress((s) => s.scores);
  const bossScores = useProgress((s) => s.bossScores);
  const [drill, setDrill] = useState<'mixed' | 'weak' | null>(null);

  const lesson = lessonId ? lessonById[lessonId] : undefined;

  const mixed = useMemo(() => {
    const shuffled = [...allQuizQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  }, [drill]);

  const weak = useMemo(() => {
    const weakLessons = new Set(
      Object.entries(scores)
        .filter(([, v]) => v.total > 0 && v.best / v.total < 0.85)
        .map(([k]) => k),
    );
    const pool = allQuizQuestions.filter((q) => weakLessons.has(q.lessonId));
    const base = pool.length >= 6 ? pool : allQuizQuestions;
    return [...base].sort(() => Math.random() - 0.5).slice(0, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drill, scores]);

  if (lesson) {
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#c9bde6]">
          <Link to="/quiz" className="hover:text-[#f5b301]">
            ← quiz arena
          </Link>
          <span>/</span>
          <span className="text-[#f5b301]">Lesson {lesson.number}</span>
        </div>
        <QuizRunner
          key={lesson.id}
          questions={lesson.quiz}
          title={`Lesson ${lesson.number}: ${lesson.title}`}
          subtitle="Seven questions · 40 s each · explanations included"
          onSubmit={(c, t) => recordQuiz(lesson.id, c, t)}
          onDone={() => nav(`/lesson/${lesson.id}`)}
        />
        <Panel className="p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#f5b301]">after this</div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link to={`/lesson/${lesson.id}`} className="btn btn-ghost !py-1.5 text-[12px]">
              re-read the lesson
            </Link>
            <Link to="/flashcards" className="btn btn-ghost !py-1.5 text-[12px]">
              drill the flashcards
            </Link>
            <Link to={`/boss/${lesson.week}`} className="btn btn-primary !py-1.5 text-[12px]">
              ⚔ week {lesson.week} boss trial
            </Link>
          </div>
        </Panel>
      </div>
    );
  }

  if (drill) {
    const qs = drill === 'mixed' ? mixed : weak;
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#c9bde6]">
          <button
            onClick={() => setDrill(null)}
            className="hover:text-[#f5b301]"
          >
            ← quiz arena
          </button>
          <span>/</span>
          <span className="text-[#f5b301]">{drill === 'mixed' ? 'mixed drill' : 'weak-spot drill'}</span>
        </div>
        <QuizRunner
          key={drill}
          questions={qs.map(({ lessonId: _l, lessonTitle: _t, week: _w, ...q }) => q)}
          title={drill === 'mixed' ? 'Mixed Drill — ten questions from the whole course' : 'Weak-Spot Drill'}
          subtitle={
            drill === 'mixed'
              ? 'Ten random questions across all sixteen lessons.'
              : 'Drawn from the lessons where your best score is below 85%.'
          }
          onSubmit={(c, t) => {
            // spread XP across the contributing lessons, weighted
            const per = Math.max(1, Math.round(t / Math.max(1, qs.length)));
            let gained = 0;
            qs.forEach((q) => {
              gained += recordQuiz(q.lessonId, per, per);
            });
            void c;
            return gained;
          }}
          onDone={() => setDrill(null)}
        />
      </div>
    );
  }

  const totalAttempts = Object.values(scores).reduce((a, s) => a + s.attempts, 0);

  return (
    <div className="space-y-7">
      <SectionTitle
        eyebrow="gamified assessment"
        title="The Quiz Arena"
        sub="Seven questions per lesson, ten per weekly boss trial. Combos multiply your streak, the timer keeps you honest, and every wrong answer comes with the reasoning."
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatOrb value={`${Object.keys(scores).length}/16`} label="lessons quizzed" glyph="◎" />
        <StatOrb value={totalAttempts} label="total attempts" glyph="↻" tone="psy" />
        <StatOrb value={`${Object.keys(bossScores).length}/8`} label="bosses faced" glyph="⚔" tone="myco" />
        <StatOrb
          value={`${Math.round(
            (Object.values(scores).reduce((a, s) => a + (s.total ? s.best / s.total : 0), 0) /
              Math.max(1, Object.keys(scores).length)) *
              100,
          )}%`}
          label="mean best score"
          glyph="✦"
          tone="sirius"
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Panel tone="psy" hover className="p-5">
          <div className="text-2xl">🎲</div>
          <h3 className="mt-1 font-heading text-base text-white">Mixed drill</h3>
          <p className="mt-1 text-[12.5px] text-[#c9bde6]">
            Ten questions sampled from all sixteen lessons. The fastest way to find out what you have actually
            retained.
          </p>
          <button onClick={() => setDrill('mixed')} className="btn btn-primary mt-3 !py-1.5 text-[12px]">
            start mixed drill
          </button>
        </Panel>
        <Panel tone="myco" hover className="p-5">
          <div className="text-2xl">🎯</div>
          <h3 className="mt-1 font-heading text-base text-white">Weak-spot drill</h3>
          <p className="mt-1 text-[12.5px] text-[#c9bde6]">
            Pulls questions only from lessons where your best score is under 85%. Adaptive and slightly merciless.
          </p>
          <button onClick={() => setDrill('weak')} className="btn btn-myco mt-3 !py-1.5 text-[12px]">
            target my weaknesses
          </button>
        </Panel>
      </div>

      <section>
        <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.24em] text-[#f5b301]">boss trials</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {bossQuizzes.map((b) => {
            const best = bossScores[b.id];
            const pct = best !== undefined ? best / b.questions.length : 0;
            return (
              <Panel key={b.id} hover tone="hot" className="flex h-full flex-col p-4">
                <div className="flex items-center justify-between">
                  <Chip tone="psy">WEEK {b.week}</Chip>
                  {best !== undefined && (
                    <span className={`font-mono text-[11px] ${pct >= 0.8 ? 'text-[#6ee7a8]' : 'text-[#f5b301]'}`}>
                      {best}/{b.questions.length}
                    </span>
                  )}
                </div>
                <h4 className="mt-2 font-heading text-sm font-semibold text-white">{b.title}</h4>
                <p className="mt-1 flex-1 text-[12px] leading-relaxed text-[#c9bde6]">{b.subtitle}</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#c026d3] to-[#f5b301]" style={{ width: `${pct * 100}%` }} />
                </div>
                <Link to={`/boss/${b.week}`} className="btn btn-ghost mt-3 !py-1.5 text-[12px]">
                  {best !== undefined ? 'retry trial' : 'enter trial'} →
                </Link>
              </Panel>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.24em] text-[#f5b301]">lesson quizzes</h3>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map((l) => {
            const s = scores[l.id];
            const pct = s ? s.best / s.total : 0;
            return (
              <Link key={l.id} to={`/quiz/${l.id}`}>
                <Panel hover className="flex items-center gap-3 p-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#f5b301]/35 bg-[#f5b301]/10 font-mono text-[12px] text-[#f5b301]">
                    {l.number}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-heading text-[13px] text-white">{l.title}</div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct * 100}%`,
                          background: pct >= 0.85 ? '#6ee7a8' : pct > 0 ? '#f5b301' : 'transparent',
                        }}
                      />
                    </div>
                  </div>
                  <span className="shrink-0 font-mono text-[10.5px] text-[#c9bde6]">
                    {s ? `${s.best}/${s.total}` : '—'}
                  </span>
                </Panel>
              </Link>
            );
          })}
        </div>
      </section>

      <Panel className="p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#f5b301]">how scoring works</div>
        <ul className="mt-2 space-y-1.5 text-[12.5px] leading-relaxed text-[#ded4f2]">
          <li>
            Each lesson quiz pays <MathTex tex="20 + 15c" /> XP where <MathTex tex="c" /> is your number correct, plus a
            35 XP flawless bonus.
          </li>
          <li>
            Each boss trial pays <MathTex tex="90 + 22c" /> XP across ten harder questions with a 25-second clock.
          </li>
          <li>Combos are tracked for bragging rights and best-combo stats, and the level curve is uncapped.</li>
          <li>Only your best score per quiz counts toward mastery — retries are free and encouraged.</li>
        </ul>
      </Panel>
    </div>
  );
}
