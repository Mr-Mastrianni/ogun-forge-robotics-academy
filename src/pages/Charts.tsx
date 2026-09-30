import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Chip, Panel, SectionTitle, StatOrb } from '@/components/ui';
import { TRACK_LABELS, allQuizQuestions, flashcards, lessons } from '@/content';
import type { Block, TrackId } from '@/content/types';
import { useProgress } from '@/lib/store';
import { XP } from '@/lib/progression';

export default function Charts() {
  const scores = useProgress((s) => s.scores);
  const xp = useProgress((s) => s.xp);
  const quizHistory = useProgress((s) => s.quizHistory);
  const bossScores = useProgress((s) => s.bossScores);
  const completed = useProgress((s) => s.completedLessons);
  const labs = useProgress((s) => s.labs);
  const [tab, setTab] = useState<'mine' | 'concepts'>('mine');

  /* ------------------------- personal analytics ------------------------- */

  const trackMastery = useMemo(() => {
    const byTrack: Record<string, { correct: number; total: number; count: number }> = {};
    lessons.forEach((l) => {
      const s = scores[l.id];
      const cur = byTrack[l.track] ?? { correct: 0, total: 0, count: 0 };
      byTrack[l.track] = {
        correct: cur.correct + (s ? s.best : 0),
        total: cur.total + (s ? s.total : 0),
        count: cur.count + 1,
      };
    });
    return Object.entries(byTrack).map(([track, v]) => ({
      track: TRACK_LABELS[track as TrackId] ?? track,
      mastery: v.total ? Math.round((v.correct / v.total) * 100) : 0,
      lessons: v.count,
    }));
  }, [scores]);

  const xpCurve = useMemo(() => {
    let running = 0;
    const points: { i: number; label: string; xp: number; accuracy: number }[] = [];
    quizHistory.forEach((q, i) => {
      running += XP.quizBase + q.correct * XP.quizPerCorrect + (q.correct === q.total ? XP.perfectBonus : 0);
      points.push({
        i: i + 1,
        label: q.day.slice(5),
        xp: running,
        accuracy: Math.round((q.correct / q.total) * 100),
      });
    });
    if (!points.length) {
      points.push({ i: 0, label: 'start', xp: 0, accuracy: 0 });
    }
    return points;
  }, [quizHistory]);

  const lessonBars = useMemo(
    () =>
      lessons.map((l) => {
        const s = scores[l.id];
        return {
          name: `L${l.number}`,
          title: l.title,
          best: s ? Math.round((s.best / s.total) * 100) : 0,
          attempts: s?.attempts ?? 0,
          read: completed[l.id] ? 1 : 0,
        };
      }),
    [scores, completed],
  );

  const levelBars = useMemo(() => {
    const byLevel: Record<string, { correct: number; total: number }> = {};
    allQuizQuestions.forEach((q) => {
      const s = scores[q.lessonId];
      if (!s) return;
      const cur = byLevel[q.level] ?? { correct: 0, total: 0 };
      byLevel[q.level] = { correct: cur.correct, total: cur.total + 1 };
    });
    return Object.entries(byLevel).map(([level, v]) => ({ level, questions: v.total }));
  }, [scores]);

  const radarData = trackMastery.length
    ? trackMastery
    : [{ track: 'Foundations', mastery: 0, lessons: 2 }];

  /* --------------------------- concept charts --------------------------- */

  const conceptCharts = useMemo(
    () =>
      lessons.flatMap((l) =>
        l.blocks
          .map((b: Block, i) => ({ lesson: l, block: b, key: `${l.id}-${i}` }))
          .filter((x) => x.block.kind === 'chart') as { lesson: typeof l; block: Extract<Block, { kind: 'chart' }>; key: string }[],
      ),
    [],
  );

  const overallMastery = trackMastery.length
    ? Math.round(trackMastery.reduce((a, t) => a + t.mastery, 0) / trackMastery.length)
    : 0;

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="data"
        title="Charts & Analytics"
        sub="Two kinds of graph matter in this course: the physics you must be able to read at a glance, and your own learning curve so you can see exactly where the iron is still cold."
      />

      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setTab('mine')}
          className={`rounded-lg border px-3 py-1.5 font-mono text-[11px] ${
            tab === 'mine' ? 'border-[#f5b301]/60 bg-[#f5b301]/15 text-[#ffe9a8]' : 'border-white/10 bg-white/[0.03] text-[#c9bde6]'
          }`}
        >
          my analytics
        </button>
        <button
          onClick={() => setTab('concepts')}
          className={`rounded-lg border px-3 py-1.5 font-mono text-[11px] ${
            tab === 'concepts' ? 'border-[#c026d3]/60 bg-[#c026d3]/15 text-[#f5c8ff]' : 'border-white/10 bg-white/[0.03] text-[#c9bde6]'
          }`}
        >
          concept charts ({conceptCharts.length})
        </button>
      </div>

      {tab === 'mine' ? (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <StatOrb value={`${overallMastery}%`} label="mean mastery" glyph="◎" />
            <StatOrb value={xp} label="total XP" glyph="✦" tone="myco" />
            <StatOrb value={`${Object.keys(completed).length}/16`} label="lessons read" glyph="⌘" />
            <StatOrb
              value={Object.values(labs).reduce((a, b) => a + b.length, 0)}
              label="lab challenges"
              glyph="⚙"
              tone="psy"
            />
            <StatOrb value={`${Object.values(bossScores).length}/8`} label="boss trials" glyph="⚔" tone="sirius" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel className="p-4">
              <div className="mb-2 font-heading text-sm text-white">Track mastery radar</div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius="70%">
                    <PolarGrid stroke="#4a3d7a" />
                    <PolarAngleAxis dataKey="track" tick={{ fill: '#c9bde6', fontSize: 10 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#8c82a8', fontSize: 9 }} stroke="#4a3d7a" />
                    <Radar dataKey="mastery" name="mastery %" stroke="#f5b301" fill="#f5b301" fillOpacity={0.3} />
                    <Tooltip contentStyle={{ background: '#0a0420', border: '1px solid #4a3d7a', fontSize: 11 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-1 text-[12px] text-[#c9bde6]">
                Each axis is the mean of your best scores across that track's lessons. A spiky radar is normal early —
                the goal is a full, even ring.
              </p>
            </Panel>

            <Panel className="p-4">
              <div className="mb-2 font-heading text-sm text-white">XP and accuracy over attempts</div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={xpCurve}>
                    <CartesianGrid stroke="#2a1f4d" strokeDasharray="3 5" />
                    <XAxis dataKey="i" tick={{ fill: '#c9bde6', fontSize: 10 }} stroke="#4a3d7a" />
                    <YAxis tick={{ fill: '#c9bde6', fontSize: 10 }} stroke="#4a3d7a" />
                    <Tooltip contentStyle={{ background: '#0a0420', border: '1px solid #4a3d7a', fontSize: 11 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="xp" name="cumulative quiz XP" stroke="#6ee7a8" fill="#6ee7a8" fillOpacity={0.25} />
                    <Area type="monotone" dataKey="accuracy" name="accuracy %" stroke="#c026d3" fill="#c026d3" fillOpacity={0.15} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-1 text-[12px] text-[#c9bde6]">
                The gap between the two curves is the interesting part: rising XP with flat accuracy means you are
                grinding, not learning. Slow down and re-run the labs.
              </p>
            </Panel>

            <Panel className="p-4">
              <div className="mb-2 font-heading text-sm text-white">Best score by lesson</div>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lessonBars}>
                    <CartesianGrid stroke="#2a1f4d" strokeDasharray="3 5" />
                    <XAxis dataKey="name" tick={{ fill: '#c9bde6', fontSize: 10 }} stroke="#4a3d7a" />
                    <YAxis domain={[0, 100]} tick={{ fill: '#c9bde6', fontSize: 10 }} stroke="#4a3d7a" />
                    <Tooltip
                      contentStyle={{ background: '#0a0420', border: '1px solid #4a3d7a', fontSize: 11 }}
                      formatter={(v: number, _n, p) => [`${v}%`, (p.payload as { title: string }).title]}
                    />
                    <Bar dataKey="best" radius={[4, 4, 0, 0]}>
                      {lessonBars.map((b, i) => (
                        <Cell key={i} fill={b.best >= 85 ? '#6ee7a8' : b.best > 0 ? '#f5b301' : '#312a52'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-1 text-[12px] text-[#c9bde6]">
                Dark bars are lessons you have not quizzed. Green is 85% or better — the threshold where the material
                is reliably yours.
              </p>
            </Panel>

            <Panel className="p-4">
              <div className="mb-2 font-heading text-sm text-white">Coverage by cognitive level</div>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={levelBars} layout="vertical">
                    <CartesianGrid stroke="#2a1f4d" strokeDasharray="3 5" />
                    <XAxis type="number" tick={{ fill: '#c9bde6', fontSize: 10 }} stroke="#4a3d7a" />
                    <YAxis type="category" dataKey="level" tick={{ fill: '#c9bde6', fontSize: 11 }} stroke="#4a3d7a" width={80} />
                    <Tooltip contentStyle={{ background: '#0a0420', border: '1px solid #4a3d7a', fontSize: 11 }} />
                    <Bar dataKey="questions" fill="#67e8f9" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-1 text-[12px] text-[#c9bde6]">
                This grows as you quiz more lessons and shows which cognitive levels you have actually been assessed on
                — recall through design.
              </p>
            </Panel>
          </div>

          <Panel className="p-5">
            <div className="mb-3 font-heading text-sm text-white">Study record</div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#c9bde6]">cards in rotation</div>
                <div className="font-heading text-xl text-white">{Object.keys(useProgress.getState().cards).length}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#c9bde6]">cards reviewed</div>
                <div className="font-heading text-xl text-white">{useProgress.getState().totalCardsReviewed}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#c9bde6]">flashcards authored</div>
                <div className="font-heading text-xl text-white">{flashcards.length}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#c9bde6]">quiz questions</div>
                <div className="font-heading text-xl text-white">{allQuizQuestions.length}</div>
              </div>
            </div>
          </Panel>
        </>
      ) : (
        <div className="space-y-5">
          <Panel className="p-4">
            <p className="text-[13px] leading-relaxed text-[#c9bde6]">
              Every chart authored into the sixteen lessons, collected in one place. These are the graphs an engineer
              should be able to sketch from memory — torque–speed curves, step responses, noise spectra, cost of
              transport, error growth and power densities.
            </p>
          </Panel>
          <div className="grid gap-4 xl:grid-cols-2">
            {conceptCharts.map(({ lesson, block, key }) => {
              const data = block.x.map((x, i) => {
                const row: Record<string, string | number> = { x };
                block.series.forEach((s) => (row[s.key] = s.data[i] ?? 0));
                return row;
              });
              return (
                <Panel key={key} className="p-4">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <Chip tone="dim">L{lesson.number}</Chip>
                    <Chip tone="psy">{lesson.track}</Chip>
                  </div>
                  <div className="font-heading text-sm font-semibold text-white">{block.title}</div>
                  <div className="text-[11.5px] text-[#c9bde6]">{lesson.title}</div>
                  <div className="mt-2 h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      {block.chartType === 'bar' ? (
                        <BarChart data={data}>
                          <CartesianGrid stroke="#2a1f4d" strokeDasharray="3 5" />
                          <XAxis dataKey="x" tick={{ fill: '#c9bde6', fontSize: 10 }} stroke="#4a3d7a" />
                          <YAxis tick={{ fill: '#c9bde6', fontSize: 10 }} stroke="#4a3d7a" />
                          <Tooltip contentStyle={{ background: '#0a0420', border: '1px solid #4a3d7a', fontSize: 11 }} />
                          <Legend wrapperStyle={{ fontSize: 11 }} />
                          {block.series.map((s) => (
                            <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[4, 4, 0, 0]} />
                          ))}
                        </BarChart>
                      ) : block.chartType === 'area' ? (
                        <AreaChart data={data}>
                          <CartesianGrid stroke="#2a1f4d" strokeDasharray="3 5" />
                          <XAxis dataKey="x" tick={{ fill: '#c9bde6', fontSize: 10 }} stroke="#4a3d7a" />
                          <YAxis tick={{ fill: '#c9bde6', fontSize: 10 }} stroke="#4a3d7a" />
                          <Tooltip contentStyle={{ background: '#0a0420', border: '1px solid #4a3d7a', fontSize: 11 }} />
                          <Legend wrapperStyle={{ fontSize: 11 }} />
                          {block.series.map((s) => (
                            <Area key={s.key} dataKey={s.key} name={s.label} stroke={s.color} fill={s.color} fillOpacity={0.25} />
                          ))}
                        </AreaChart>
                      ) : block.chartType === 'radar' ? (
                        <RadarChart data={data} outerRadius="70%">
                          <PolarGrid stroke="#4a3d7a" />
                          <PolarAngleAxis dataKey="x" tick={{ fill: '#c9bde6', fontSize: 10 }} />
                          <PolarRadiusAxis tick={{ fill: '#8c82a8', fontSize: 9 }} stroke="#4a3d7a" />
                          {block.series.map((s) => (
                            <Radar key={s.key} dataKey={s.key} name={s.label} stroke={s.color} fill={s.color} fillOpacity={0.25} />
                          ))}
                          <Legend wrapperStyle={{ fontSize: 11 }} />
                        </RadarChart>
                      ) : (
                        <LineChart data={data}>
                          <CartesianGrid stroke="#2a1f4d" strokeDasharray="3 5" />
                          <XAxis dataKey="x" tick={{ fill: '#c9bde6', fontSize: 10 }} stroke="#4a3d7a" />
                          <YAxis tick={{ fill: '#c9bde6', fontSize: 10 }} stroke="#4a3d7a" />
                          <Tooltip contentStyle={{ background: '#0a0420', border: '1px solid #4a3d7a', fontSize: 11 }} />
                          <Legend wrapperStyle={{ fontSize: 11 }} />
                          {block.series.map((s) => (
                            <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color} strokeWidth={2.2} dot={false} />
                          ))}
                        </LineChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-1 flex justify-between font-mono text-[10px] text-[#8c82a8]">
                    <span>x: {block.xLabel}</span>
                    <span>y: {block.yLabel}</span>
                  </div>
                  {block.caption && <p className="mt-2 text-[12px] leading-relaxed text-[#c9bde6]">{block.caption}</p>}
                </Panel>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
