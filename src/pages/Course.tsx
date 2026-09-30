import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { Chip, DifficultyPips, FadeIn, Panel, Progress, SectionTitle, StatOrb } from '@/components/ui';
import { LAB_MAP } from '@/components/labs';
import { TRACK_LABELS, bossQuizzes, flashcards, lessons, weeks } from '@/content';
import { useProgress } from '@/lib/store';
import { rankFor, rankProgress } from '@/lib/progression';

export default function Course() {
  const completedLessons = useProgress((s) => s.completedLessons);
  const scores = useProgress((s) => s.scores);
  const bossScores = useProgress((s) => s.bossScores);
  const xp = useProgress((s) => s.xp);

  const totalMinutes = useMemo(() => lessons.reduce((a, l) => a + l.duration, 0), []);
  const doneCount = Object.keys(completedLessons).length;
  const rank = rankFor(xp);

  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="the roadmap"
        title="Robotics Engineering — 8 weeks, 16 lessons"
        sub={`${Math.round(totalMinutes / 60)} hours of guided study, ${flashcards.length} flashcards, ${lessons.reduce((a, l) => a + l.quiz.length, 0)} quiz questions and ${Object.keys(LAB_MAP).length} interactive labs. Work in order; each week's boss trial assumes both lessons.`}
        right={
          <div className="flex flex-wrap gap-2">
            <Link to="/quiz" className="btn btn-ghost">
              ⚔ arena
            </Link>
            <Link to={`/lesson/${lessons[0]?.id ?? 'w1l1'}`} className="btn btn-primary">
              start L1 →
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <StatOrb value={`${doneCount}/16`} label="lessons read" glyph="⌘" />
        <StatOrb value={`${Object.keys(bossScores).length}/8`} label="boss trials" glyph="⚔" tone="psy" />
        <StatOrb value={`${Object.values(scores).reduce((a, s) => a + s.attempts, 0)}`} label="quiz attempts" glyph="◎" tone="sirius" />
        <StatOrb value={`${xp}`} label="total XP" glyph="✦" tone="myco" />
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="font-mono text-[10px] uppercase tracking-widest text-[#c9bde6]">rank</div>
          <div className="font-heading text-lg text-[#f5b301]">
            {rank.glyph} {rank.name}
          </div>
          <div className="mt-2">
            <Progress value={rankProgress(xp)} />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {weeks.map((w, wi) => {
          const boss = bossQuizzes.find((b) => b.week === w.week);
          const weekDone = w.lessons.every((l) => completedLessons[l.id]);
          const bossScore = boss ? bossScores[boss.id] : undefined;
          return (
            <FadeIn key={w.week} delay={wi * 0.03}>
              <div className="relative">
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#f5b301]/40 bg-gradient-to-br from-[#3a1206] to-[#120a2e] font-display text-lg text-[#f5b301]">
                    {String(w.week).padStart(2, '0')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading text-lg font-bold text-white">{w.title}</h3>
                      {weekDone && <Chip tone="myco">✓ week complete</Chip>}
                      {boss && bossScore !== undefined && (
                        <Chip tone="psy">
                          boss best {bossScore}/{boss.questions.length}
                        </Chip>
                      )}
                    </div>
                    <div className="text-[12.5px] text-[#c9bde6]">{w.theme}</div>
                  </div>
                  {boss && (
                    <Link
                      to={`/boss/${w.week}`}
                      className={`btn ${bossScore !== undefined && bossScore / boss.questions.length >= 0.8 ? 'btn-myco' : 'btn-ghost'}`}
                    >
                      ⚔ {boss.title}
                    </Link>
                  )}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {w.lessons.map((l) => {
                    const score = scores[l.id];
                    const done = !!completedLessons[l.id];
                    const labIds = l.blocks.filter((b) => b.kind === 'lab').map((b) => (b.kind === 'lab' ? b.labId : ''));
                    return (
                      <Panel key={l.id} hover className="flex h-full flex-col p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] uppercase tracking-widest text-[#f5b301]">
                                Lesson {l.number}
                              </span>
                              <Chip tone="dim">{TRACK_LABELS[l.track]}</Chip>
                              {done && <Chip tone="myco">✓</Chip>}
                            </div>
                            <h4 className="mt-1 font-heading text-base font-semibold leading-snug text-white">{l.title}</h4>
                            <p className="mt-1 text-[12.5px] leading-relaxed text-[#c9bde6]">{l.subtitle}</p>
                          </div>
                          <div className="shrink-0 text-right">
                            <div className="font-mono text-[10px] text-[#c9bde6]">{l.duration} min</div>
                            <div className="font-mono text-[10px] text-[#ffe9a8]">+{l.xp} XP</div>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[#c9bde6]">
                          <DifficultyPips level={l.difficulty} />
                          <span className="capitalize">{l.difficulty}</span>
                          <span>·</span>
                          <span>{l.blocks.length} blocks</span>
                          <span>·</span>
                          <span>{l.quiz.length} questions</span>
                          <span>·</span>
                          <span>{l.flashcards.length} cards</span>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {labIds.map((id) => (
                            <Link key={id} to={`/labs/${id}`}>
                              <Chip tone="psy">
                                {LAB_MAP[id]?.glyph ?? '⚙'} {LAB_MAP[id]?.name ?? id}
                              </Chip>
                            </Link>
                          ))}
                        </div>

                        <p className="mt-3 border-l-2 border-[#c026d3]/50 pl-3 text-[12.5px] italic leading-snug text-[#ded4f2]">
                          {l.hook}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <Link to={`/lesson/${l.id}`} className="btn btn-ghost !px-3 !py-1.5 text-[12px]">
                            {done ? 'revisit' : 'open lesson'}
                          </Link>
                          <Link to={`/quiz/${l.id}`} className="btn btn-ghost !px-3 !py-1.5 text-[12px]">
                            quiz
                          </Link>
                          {score && (
                            <span className="ml-auto font-mono text-[11px] text-[#c9bde6]">
                              best {score.best}/{score.total}
                            </span>
                          )}
                        </div>
                      </Panel>
                    );
                  })}
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>

      <Panel className="p-6 text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#f5b301]">after week 8</div>
        <h3 className="mt-2 font-heading text-xl text-white">The Idea Lab is where the syllabus ends</h3>
        <p className="mx-auto mt-2 max-w-2xl text-[13px] leading-relaxed text-[#c9bde6]">
          Twenty-four heritage entries, seventy-plus blueprints and ten labs feed a capstone in which you design a
          machine that has never existed. Nothing in the course is decoration.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link to="/ideas" className="btn btn-myco">
            🍄 open the Idea Lab
          </Link>
          <Link to="/atlas" className="btn btn-ghost">
            ✵ heritage atlas
          </Link>
          <Link to="/lesson/w8l16" className="btn btn-ghost">
            capstone brief
          </Link>
        </div>
      </Panel>
    </div>
  );
}
