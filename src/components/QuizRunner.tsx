import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { QuizQuestion } from '@/content/types';
import { Chip, Panel } from './ui';
import { useSfx } from './Backdrop';

export interface QuizResult {
  correct: number;
  total: number;
  byLevel: Record<string, { correct: number; total: number }>;
  bestCombo: number;
}

const LEVEL_COLORS: Record<string, string> = {
  recall: '#81dcd4',
  understand: '#a6eb9b',
  apply: '#f7c77c',
  analyze: '#f2853a',
  design: '#e0782f',
};

export function QuizRunner({
  questions,
  title,
  subtitle,
  secondsPerQuestion = 40,
  bossMode = false,
  onSubmit,
  onDone,
  pageHeading = false,
}: {
  /** true when the quiz title is the page's main heading */
  pageHeading?: boolean;
  questions: QuizQuestion[];
  title: string;
  subtitle?: string;
  secondsPerQuestion?: number;
  bossMode?: boolean;
  onSubmit: (correct: number, total: number) => number;
  onDone?: () => void;
}) {
  const TitleTag = pageHeading ? 'h1' : 'h2';
  const sfx = useSfx();
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [byLevel, setByLevel] = useState<Record<string, { correct: number; total: number }>>({});
  const [timeLeft, setTimeLeft] = useState(secondsPerQuestion);
  const [finished, setFinished] = useState(false);
  const [gained, setGained] = useState(0);
  const [shake, setShake] = useState(false);
  const timerRef = useRef<number>(0);

  const q = questions[idx];
  const total = questions.length;

  useEffect(() => {
    setIdx(0);
    setChosen(null);
    setLocked(false);
    setCorrect(0);
    setCombo(0);
    setBestCombo(0);
    setByLevel({});
    setTimeLeft(secondsPerQuestion);
    setFinished(false);
    setGained(0);
  }, [questions, secondsPerQuestion]);

  const commit = (pick: number | null) => {
    if (locked) return;
    setLocked(true);
    setChosen(pick);
    const isRight = pick === q.answer;
    setByLevel((b) => {
      const cur = b[q.level] ?? { correct: 0, total: 0 };
      return { ...b, [q.level]: { correct: cur.correct + (isRight ? 1 : 0), total: cur.total + 1 } };
    });
    if (isRight) {
      setCorrect((c) => c + 1);
      setCombo((c) => {
        const n = c + 1;
        setBestCombo((b) => Math.max(b, n));
        return n;
      });
      sfx.correct();
    } else {
      setCombo(0);
      setShake(true);
      window.setTimeout(() => setShake(false), 420);
      sfx.wrong();
    }
  };

  useEffect(() => {
    if (locked || finished) return;
    const t = window.setInterval(() => {
      setTimeLeft((v) => {
        if (v <= 1) {
          window.clearInterval(t);
          commit(null);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    timerRef.current = t;
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locked, finished, idx]);

  useEffect(() => {
    return () => window.clearInterval(timerRef.current);
  }, []);

  const next = () => {
    if (idx + 1 >= total) {
      const xp = onSubmit(correct, total);
      setGained(xp);
      setFinished(true);
      sfx.xp();
    } else {
      setIdx((i) => i + 1);
      setChosen(null);
      setLocked(false);
      setTimeLeft(secondsPerQuestion);
      sfx.flip();
    }
  };

  const grade = useMemo(() => {
    const pct = total ? correct / total : 0;
    if (pct === 1) return { label: 'Flawless — Dwennimmen', color: '#a6eb9b', note: 'Humility with strength. No corrections needed.' };
    if (pct >= 0.8) return { label: 'Forged well', color: '#a3e635', note: 'Strong command. Review the misses and move on.' };
    if (pct >= 0.6) return { label: 'Heated but not hardened', color: '#f7c77c', note: 'Re-read the lesson sections behind your misses.' };
    if (pct >= 0.4) return { label: 'Back to the anvil', color: '#f2853a', note: 'Revisit the lesson and re-run the lab before retrying.' };
    return { label: 'Cold iron', color: '#ff8a4c', note: 'Start the lesson again from the objectives — the loop has not closed yet.' };
  }, [correct, total]);

  if (!q) return null;

  if (finished) {
    return (
      <Panel className="p-6 md:p-8" tone={bossMode ? 'hot' : 'gold'}>
        <div className="mx-auto max-w-2xl text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-k-gold">result</div>
          <h2 className="mt-2 font-display text-3xl text-white md:text-4xl" style={{ color: grade.color }}>
            {grade.label}
          </h2>
          <p className="mt-2 text-sm text-k-muted">{grade.note}</p>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="font-heading text-2xl text-white">
                {correct}/{total}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-k-muted">score</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="font-heading text-2xl text-white">{Math.round((correct / total) * 100)}%</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-k-muted">accuracy</div>
            </div>
            <div className="rounded-xl border border-k-gold/30 bg-k-gold/10 p-3">
              <div className="font-heading text-2xl text-k-glint">+{gained}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-k-muted">XP earned</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="font-heading text-2xl text-white">×{bestCombo}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-k-muted">best combo</div>
            </div>
          </div>

          <div className="mt-6 text-left">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-k-gold">
              performance by cognitive level
            </div>
            <div className="space-y-2">
              {Object.entries(byLevel).map(([lvl, v]) => (
                <div key={lvl} className="flex items-center gap-3">
                  <span className="w-24 font-mono text-[11px] uppercase" style={{ color: LEVEL_COLORS[lvl] }}>
                    {lvl}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(v.correct / v.total) * 100}%`, background: LEVEL_COLORS[lvl] }}
                    />
                  </div>
                  <span className="w-12 text-right font-mono text-[11px] text-k-muted">
                    {v.correct}/{v.total}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {onDone && (
            <button onClick={onDone} className="btn btn-primary mt-7">
              continue →
            </button>
          )}
        </div>
      </Panel>
    );
  }

  return (
    <Panel className={`overflow-hidden ${shake ? 'animate-[pulseGlow_0.4s_ease-in-out]' : ''}`} tone={bossMode ? 'hot' : 'gold'}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-k-gold">
            {bossMode ? 'boss trial' : 'lesson quiz'}
          </div>
          <TitleTag className="font-heading text-base font-normal text-white">{title}</TitleTag>
          {subtitle && <div className="text-[12px] text-k-muted">{subtitle}</div>}
        </div>
        <div className="flex items-center gap-2">
          {combo > 1 && <Chip tone="psy">🔥 combo ×{combo}</Chip>}
          <Chip tone="dim">
            {idx + 1} / {total}
          </Chip>
        </div>
      </div>

      <div className="h-1 w-full bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-k-gold to-k-ember transition-all"
          style={{ width: `${((idx + (locked ? 1 : 0)) / total) * 100}%` }}
        />
      </div>

      <div className="p-4 md:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <span
            className="rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest"
            style={{ borderColor: `${LEVEL_COLORS[q.level]}66`, color: LEVEL_COLORS[q.level] }}
          >
            {q.level}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-k-muted">⏱ {timeLeft}s</span>
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${(timeLeft / secondsPerQuestion) * 100}%`,
                  background: timeLeft < 8 ? '#ff8a4c' : '#a6eb9b',
                }}
              />
            </div>
          </div>
        </div>

        <h3 className="font-heading text-lg leading-snug text-white md:text-xl">{q.question}</h3>

        <div className="mt-5 grid gap-2.5">
          {q.choices.map((c, i) => {
            const isAnswer = i === q.answer;
            const isChosen = i === chosen;
            const state = !locked ? 'idle' : isAnswer ? 'right' : isChosen ? 'wrong' : 'dim';
            const styles: Record<string, string> = {
              idle: 'border-white/12 bg-white/[0.03] hover:border-k-gold/60 hover:bg-k-gold/10',
              right: 'border-k-moss bg-k-moss/15 text-white',
              wrong: 'border-[#ff8a4c] bg-[#ff8a4c]/15 text-white',
              dim: 'border-white/8 bg-white/[0.02] opacity-50',
            };
            return (
              <button
                key={i}
                disabled={locked}
                onClick={() => commit(i)}
                className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all ${styles[state]}`}
              >
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg border border-white/20 font-mono text-[11px] text-k-muted">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-[14px] leading-snug text-k-text">{c}</span>
                {locked && isAnswer && <span className="ml-auto text-k-moss">✓</span>}
                {locked && isChosen && !isAnswer && <span className="ml-auto text-[#ff8a4c]">✗</span>}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {locked && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="overflow-hidden"
            >
              <div
                className="mt-4 rounded-xl border p-4"
                style={{
                  borderColor: chosen === q.answer ? '#a6eb9b66' : '#ff8a4c66',
                  background: chosen === q.answer ? 'rgba(166,235,155,0.08)' : 'rgba(255,138,76,0.07)',
                }}
              >
                <div className="mb-1 font-heading text-[13px] font-semibold" style={{ color: chosen === q.answer ? '#a6eb9b' : '#ffb27a' }}>
                  {chosen === q.answer ? 'Correct' : chosen === null ? 'Time expired' : 'Not quite'}
                </div>
                <p className="text-[13.5px] leading-relaxed text-k-text">{q.explanation}</p>
              </div>
              <div className="mt-4 flex justify-end">
                <button onClick={next} className="btn btn-primary">
                  {idx + 1 >= total ? 'see result' : 'next question'} →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Panel>
  );
}
