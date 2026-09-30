import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { Blocks } from '@/components/LessonBlocks';
import { Chip, DifficultyPips, Panel, Progress } from '@/components/ui';
import { bossQuizzes, flashcards, lessonById, lessons } from '@/content';
import { TRACK_LABELS } from '@/content';
import { useProgress } from '@/lib/store';
import { Math as MathTex } from '@/lib/rich';

export default function LessonPage() {
  const { lessonId } = useParams();
  const nav = useNavigate();
  const lesson = lessonId ? lessonById[lessonId] : undefined;

  const completed = useProgress((s) => (lessonId ? !!s.completedLessons[lessonId] : false));
  const markLessonRead = useProgress((s) => s.markLessonRead);
  const scores = useProgress((s) => (lessonId ? s.scores[lessonId] : undefined));
  const [scrolled, setScrolled] = useState(0);

  useEffect(() => {
    if (!lesson) return;
    const onScroll = () => {
      const h = document.documentElement;
      const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      setScrolled(Math.min(1, Math.max(0, p)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [lesson]);

  useEffect(() => {
    if (!lesson) nav('/course');
  }, [lesson, nav]);

  const { toc, index } = useMemo(() => {
    if (!lesson) return { toc: [] as { label: string; id: string }[], index: -1 };
    const items: { label: string; id: string }[] = [];
    lesson.blocks.forEach((b, i) => {
      if (b.kind === 'prose' && b.heading) items.push({ label: b.heading, id: `b${i}` });
      else if (b.kind === 'formula') items.push({ label: b.title, id: `b${i}` });
      else if (b.kind === 'chart') items.push({ label: b.title, id: `b${i}` });
      else if (b.kind === 'table') items.push({ label: b.title, id: `b${i}` });
      else if (b.kind === 'lab') items.push({ label: `Lab: ${b.title}`, id: `b${i}` });
      else if (b.kind === 'steps') items.push({ label: b.title, id: `b${i}` });
      else if (b.kind === 'callout') items.push({ label: b.title, id: `b${i}` });
    });
    return { toc: items, index: lessons.findIndex((l) => l.id === lesson.id) };
  }, [lesson]);

  if (!lesson) return null;

  const prev = index > 0 ? lessons[index - 1] : null;
  const next = index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null;
  const cards = flashcards.filter((f) => f.lessonId === lesson.id);
  const boss = bossQuizzes.find((b) => b.lessonIds.includes(lesson.id));

  return (
    <div className="space-y-6">
      <div className="fixed left-0 top-[57px] z-40 h-[3px] w-full bg-transparent">
        <div className="h-full bg-gradient-to-r from-[#6ee7a8] via-[#f5b301] to-[#c026d3] transition-all" style={{ width: `${scrolled * 100}%` }} />
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#c9bde6]">
        <Link to="/course" className="hover:text-[#f5b301]">
          ← roadmap
        </Link>
        <span>/</span>
        <span>Week {lesson.week}</span>
        <span>/</span>
        <span className="text-[#f5b301]">Lesson {lesson.number}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0">
          <header className="mb-6">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Chip tone="psy">WK{lesson.week}</Chip>
              <Chip>{TRACK_LABELS[lesson.track]}</Chip>
              <Chip tone="dim">{lesson.duration} min</Chip>
              <Chip tone="dim">+{lesson.xp} XP</Chip>
              {completed && <Chip tone="myco">✓ completed</Chip>}
            </div>
            <h1 className="font-heading text-3xl font-bold leading-tight text-white md:text-4xl">{lesson.title}</h1>
            <p className="mt-2 text-[15px] text-[#c9bde6]">{lesson.subtitle}</p>
            <div className="mt-3 flex items-center gap-2 text-[12px] text-[#c9bde6]">
              <DifficultyPips level={lesson.difficulty} />
              <span className="capitalize">{lesson.difficulty}</span>
            </div>
          </header>

          <Panel tone="psy" className="mb-6 p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#f5c8ff]">
              why this lesson exists
            </div>
            <p className="mt-1.5 font-heading text-[15px] italic leading-relaxed text-[#ffe9a8]">{lesson.hook}</p>
            <div className="mt-3 border-t border-white/10 pt-3">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#f5b301]">
                learning objectives
              </div>
              <ul className="space-y-1.5">
                {lesson.objectives.map((o, i) => (
                  <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-[#ded4f2]">
                    <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#f5b301] to-[#c026d3]" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </Panel>

          <article className="lesson-prose">
            {lesson.blocks.map((b, i) => (
              <div key={i} id={`b${i}`} className="scroll-mt-24">
                <Blocks blocks={[b]} />
              </div>
            ))}
          </article>

          {/* key terms */}
          <Panel className="mt-8 p-5">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[#f5b301]">key terms</div>
            <dl className="grid gap-3 sm:grid-cols-2">
              {lesson.keyTerms.map((t) => (
                <div key={t.term} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <dt className="font-heading text-[13px] text-[#ffe9a8]">
                    <MathTex tex={t.term} />
                  </dt>
                  <dd className="mt-1 text-[12.5px] leading-relaxed text-[#ded4f2]">{t.definition}</dd>
                </div>
              ))}
            </dl>
          </Panel>

          {/* forge prompts */}
          <Panel tone="myco" className="mt-5 p-5">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#6ee7a8]">
              forge prompts → idea lab
            </div>
            <ul className="space-y-2">
              {lesson.forgePrompts.map((f, i) => (
                <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-[#cfe9dc]">
                  <span className="text-[#6ee7a8]">🔥</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/ideas" className="mt-4 inline-flex text-[12.5px] text-[#6ee7a8] underline">
              open the Idea Lab →
            </Link>
          </Panel>

          {/* next actions */}
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <Panel hover className="p-4">
              <div className="font-heading text-sm text-white">⚔ Test yourself</div>
              <p className="mt-1 text-[12.5px] text-[#c9bde6]">{lesson.quiz.length} questions with explanations.</p>
              <Link to={`/quiz/${lesson.id}`} className="btn btn-primary mt-3 w-full !py-1.5 text-[12px]">
                take the quiz
              </Link>
            </Panel>
            <Panel hover tone="psy" className="p-4">
              <div className="font-heading text-sm text-white">✦ Drill the cards</div>
              <p className="mt-1 text-[12.5px] text-[#c9bde6]">{cards.length} flashcards from this lesson.</p>
              <Link to="/flashcards" className="btn btn-ghost mt-3 w-full !py-1.5 text-[12px]">
                open flashcards
              </Link>
            </Panel>
            <Panel hover tone="myco" className="p-4">
              <div className="font-heading text-sm text-white">{completed ? '✓ Marked complete' : '⚒ Mark complete'}</div>
              <p className="mt-1 text-[12.5px] text-[#c9bde6]">
                {completed ? 'Progress saved. Revisit anytime.' : 'Adds +40 XP and unlocks the next rank step.'}
              </p>
              <button
                onClick={() => markLessonRead(lesson.id)}
                disabled={completed}
                className={`btn mt-3 w-full !py-1.5 text-[12px] ${completed ? 'btn-ghost opacity-60' : 'btn-myco'}`}
              >
                {completed ? 'already done' : 'mark as read'}
              </button>
            </Panel>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            {prev ? (
              <Link to={`/lesson/${prev.id}`} className="btn btn-ghost">
                ← {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link to={`/lesson/${next.id}`} className="btn btn-primary">
                {next.title} →
              </Link>
            ) : (
              <Link to="/ideas" className="btn btn-myco">
                enter the Idea Lab →
              </Link>
            )}
          </div>
        </div>

        {/* ------------------------------ sidebar ------------------------------ */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <Panel className="p-4">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#f5b301]">
                on this page
              </div>
              <nav className="max-h-[280px] space-y-1 overflow-auto pr-1">
                {toc.map((t) => (
                  <a
                    key={t.id}
                    href={`#${t.id}`}
                    className="block truncate border-l-2 border-white/10 pl-2.5 text-[12px] leading-snug text-[#c9bde6] transition-colors hover:border-[#f5b301] hover:text-[#f5b301]"
                  >
                    {t.label}
                  </a>
                ))}
              </nav>
            </Panel>

            <Panel className="p-4">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#f5b301]">progress</div>
              <Progress value={scrolled} label="read" />
              <div className="mt-3 space-y-1.5 font-mono text-[11px] text-[#c9bde6]">
                <div className="flex justify-between">
                  <span>blocks</span>
                  <span>{lesson.blocks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>labs embedded</span>
                  <span>{lesson.blocks.filter((b) => b.kind === 'lab').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>best score</span>
                  <span>{scores ? `${scores.best}/${scores.total}` : '—'}</span>
                </div>
              </div>
            </Panel>

            {boss && (
              <Panel tone="hot" className="p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#ffd0b0]">week boss</div>
                <div className="mt-1 font-heading text-sm text-white">{boss.title}</div>
                <p className="mt-1 text-[12px] text-[#e8d8ff]">{boss.subtitle}</p>
                <Link to={`/boss/${boss.week}`} className="btn btn-ghost mt-3 w-full !py-1.5 text-[12px]">
                  enter trial
                </Link>
              </Panel>
            )}

            <Panel tone="myco" className="p-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#6ee7a8]">week {lesson.week}</div>
              <ul className="mt-2 space-y-1.5">
                {lessons
                  .filter((l) => l.week === lesson.week)
                  .map((l) => (
                    <li key={l.id}>
                      <Link
                        to={`/lesson/${l.id}`}
                        className={`block text-[12px] leading-snug ${l.id === lesson.id ? 'text-[#f5b301]' : 'text-[#cfe9dc] hover:text-[#6ee7a8]'}`}
                      >
                        {l.number}. {l.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </Panel>
          </div>
        </aside>
      </div>
    </div>
  );
}
