import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Chip, Panel, Progress, SectionTitle, StatOrb } from '@/components/ui';
import { flashcards, lessons } from '@/content';
import type { Flashcard } from '@/content/types';
import { useProgress } from '@/lib/store';
import { useSfx } from '@/components/Backdrop';

type DeckKey = 'due' | 'all' | 'new' | number;

const SESSION_SIZE = 20;

export default function Flashcards() {
  const sfx = useSfx();
  const cards = useProgress((s) => s.cards);
  const introduceCard = useProgress((s) => s.introduceCard);
  const reviewCard = useProgress((s) => s.reviewCard);
  const totalReviewed = useProgress((s) => s.totalCardsReviewed);

  const [deck, setDeck] = useState<DeckKey>('due');
  const [queue, setQueue] = useState<Flashcard[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [session, setSession] = useState<{ again: number; hard: number; good: number; easy: number } | null>(null);
  const [started, setStarted] = useState(false);

  const now = Date.now();
  const dueCards = useMemo(() => flashcards.filter((c) => cards[c.id] && cards[c.id].due <= now), [cards, now]);
  const newCards = useMemo(() => flashcards.filter((c) => !cards[c.id]), [cards]);
  const mature = useMemo(() => flashcards.filter((c) => (cards[c.id]?.interval ?? 0) >= 21), [cards]);
  const learning = useMemo(
    () => flashcards.filter((c) => cards[c.id] && cards[c.id].interval < 21).length,
    [cards],
  );

  const deckCards = useMemo(() => {
    if (deck === 'due') return dueCards;
    if (deck === 'new') return newCards;
    if (deck === 'all') return flashcards;
    return flashcards.filter((c) => c.week === deck);
  }, [deck, dueCards, newCards]);

  const start = useCallback(() => {
    const ordered =
      deck === 'due' || deck === 'new'
        ? deckCards
        : [...deckCards.filter((c) => cards[c.id] && cards[c.id].due <= now), ...deckCards.filter((c) => !cards[c.id])];
    const chosen = ordered.slice(0, SESSION_SIZE);
    chosen.forEach((c) => introduceCard(c.id));
    setQueue(chosen);
    setIdx(0);
    setFlipped(false);
    setSession({ again: 0, hard: 0, good: 0, easy: 0 });
    setStarted(true);
  }, [deck, deckCards, cards, now, introduceCard]);

  const current = queue[idx];

  const grade = useCallback(
    (g: 'again' | 'hard' | 'good' | 'easy') => {
      if (!current) return;
      reviewCard(current.id, g);
      setSession((s) => (s ? { ...s, [g]: s[g] + 1 } : s));
      sfx.flip();
      if (idx + 1 >= queue.length) {
        setStarted(false);
      } else {
        setIdx((i) => i + 1);
        setFlipped(false);
      }
    },
    [current, idx, queue.length, reviewCard, sfx],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!started || !current) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setFlipped((f) => !f);
        sfx.flip();
      }
      if (flipped) {
        if (e.key === '1') grade('again');
        if (e.key === '2') grade('hard');
        if (e.key === '3') grade('good');
        if (e.key === '4') grade('easy');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [started, current, flipped, grade, sfx]);

  const retention = totalReviewed ? Math.round((1 - (Object.values(cards).reduce((a, c) => a + c.lapses, 0) / Math.max(1, totalReviewed))) * 100) : 100;

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="spaced repetition"
        title="Flashcard Forge"
        sub="A Leitner/SM-2 style scheduler. Every card you grade updates its ease factor and interval, so the deck keeps surfacing exactly the terms you are about to forget. Keyboard: space to flip, 1–4 to grade."
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <StatOrb value={dueCards.length} label="due now" glyph="⏱" tone="psy" />
        <StatOrb value={newCards.length} label="unseen" glyph="✦" />
        <StatOrb value={learning} label="learning" glyph="↻" tone="sirius" />
        <StatOrb value={mature.length} label="mature (21d+)" glyph="🌌" tone="myco" />
        <StatOrb value={`${retention}%`} label="retention proxy" glyph="◎" />
      </div>

      {!started && (
        <>
          <Panel className="p-5">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[#f5b301]">choose a deck</div>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { k: 'due', label: `Due now (${dueCards.length})` },
                  { k: 'new', label: `Unseen (${newCards.length})` },
                  { k: 'all', label: `Everything (${flashcards.length})` },
                ] as { k: DeckKey; label: string }[]
              ).map((d) => (
                <button
                  key={String(d.k)}
                  onClick={() => setDeck(d.k)}
                  className={`rounded-lg border px-3 py-1.5 font-mono text-[11px] transition-colors ${
                    deck === d.k
                      ? 'border-[#f5b301]/60 bg-[#f5b301]/15 text-[#ffe9a8]'
                      : 'border-white/10 bg-white/[0.03] text-[#c9bde6] hover:text-white'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {lessons.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setDeck(l.week)}
                  className={`rounded-lg border px-2.5 py-1.5 font-mono text-[10.5px] transition-colors ${
                    deck === l.week
                      ? 'border-[#c026d3]/60 bg-[#c026d3]/15 text-[#f5c8ff]'
                      : 'border-white/10 bg-white/[0.03] text-[#c9bde6] hover:text-white'
                  }`}
                >
                  WK{l.week}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button onClick={start} disabled={deckCards.length === 0} className="btn btn-primary disabled:opacity-40">
                start session ({Math.min(SESSION_SIZE, deckCards.length)} cards)
              </button>
              <span className="text-[12px] text-[#c9bde6]">
                {deckCards.length === 0 ? 'Nothing in this deck right now — come back later or pick another.' : ''}
              </span>
            </div>
          </Panel>

          <Panel tone="myco" className="p-5">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#6ee7a8]">how the scheduler works</div>
            <ul className="space-y-1.5 text-[12.5px] leading-relaxed text-[#cfe9dc]">
              <li>
                <strong>Again</strong> resets the interval and drops the ease factor — the card returns this session.
              </li>
              <li>
                <strong>Hard</strong> grows the interval slowly (×1.2) and nudges ease down.
              </li>
              <li>
                <strong>Good</strong> multiplies the interval by the ease factor (default 2.5).
              </li>
              <li>
                <strong>Easy</strong> raises ease and jumps the interval by ×ease×1.3, capped at one year.
              </li>
            </ul>
          </Panel>
        </>
      )}

      {started && current && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="font-mono text-[11px] text-[#c9bde6]">
              card {idx + 1} / {queue.length} · week {current.week} · <span className="text-[#ffe9a8]">{current.tag}</span>
            </div>
            <div className="flex items-center gap-2">
              {session && (
                <>
                  <Chip tone="dim">again {session.again}</Chip>
                  <Chip tone="dim">hard {session.hard}</Chip>
                  <Chip tone="myco">good {session.good}</Chip>
                  <Chip tone="psy">easy {session.easy}</Chip>
                </>
              )}
              <button onClick={() => setStarted(false)} className="btn btn-ghost !px-3 !py-1 text-[11px]">
                end
              </button>
            </div>
          </div>

          <Progress value={(idx + (flipped ? 0.5 : 0)) / queue.length} />

          <div className="flip-scene h-[320px] w-full">
            <div className={`flip-inner ${flipped ? 'flipped' : ''}`}>
              <div className="flip-face glass panel-edge items-center justify-center text-center">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#f5b301]">question</div>
                <div className="mt-4 font-heading text-xl font-semibold leading-snug text-white md:text-2xl">
                  {current.front}
                </div>
                <button onClick={() => { setFlipped(true); sfx.flip(); }} className="btn btn-ghost mt-6 !py-1.5 text-[12px]">
                  reveal answer (space)
                </button>
              </div>
              <div className="flip-face flip-back glass-hot panel-edge items-center justify-center text-center">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#f5c8ff]">answer</div>
                <div className="mt-4 text-[15px] leading-relaxed text-[#f3e9ff] md:text-base">{current.back}</div>
                <Link to={`/lesson/${current.lessonId}`} className="mt-4 text-[11.5px] text-[#67e8f9] underline">
                  go to the lesson →
                </Link>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {flipped && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-2 md:grid-cols-4"
              >
                {(
                  [
                    { g: 'again', label: 'Again', hint: '1', cls: 'border-[#ff2fb9]/50 hover:bg-[#ff2fb9]/20' },
                    { g: 'hard', label: 'Hard', hint: '2', cls: 'border-[#ff6b1a]/50 hover:bg-[#ff6b1a]/20' },
                    { g: 'good', label: 'Good', hint: '3', cls: 'border-[#f5b301]/50 hover:bg-[#f5b301]/20' },
                    { g: 'easy', label: 'Easy', hint: '4', cls: 'border-[#6ee7a8]/50 hover:bg-[#6ee7a8]/20' },
                  ] as const
                ).map((b) => (
                  <button
                    key={b.g}
                    onClick={() => grade(b.g)}
                    className={`rounded-xl border bg-white/[0.03] px-4 py-3 font-heading text-sm text-white transition-colors ${b.cls}`}
                  >
                    {b.label}
                    <span className="ml-2 font-mono text-[10px] text-[#c9bde6]">{b.hint}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {!started && session && (
        <Panel tone="myco" className="p-5 text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#6ee7a8]">session complete</div>
          <h3 className="mt-2 font-heading text-xl text-white">
            {session.good + session.easy} of {session.again + session.hard + session.good + session.easy} recalled cleanly
          </h3>
          <p className="mt-1 text-[13px] text-[#c9bde6]">
            {session.again} again · {session.hard} hard · {session.good} good · {session.easy} easy — {totalReviewed} cards
            reviewed all time.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button onClick={start} className="btn btn-primary">
              another session
            </button>
            <Link to="/quiz" className="btn btn-ghost">
              take a quiz
            </Link>
          </div>
        </Panel>
      )}
    </div>
  );
}
