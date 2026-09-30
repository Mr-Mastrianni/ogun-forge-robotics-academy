import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Chip, Panel, SectionTitle } from '@/components/ui';
import { TRACK_LABELS, allKeyTerms, lessons } from '@/content';
import type { TrackId } from '@/content/types';
import { Math as MathTex } from '@/lib/rich';
import { useProgress } from '@/lib/store';

export default function Glossary() {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [openId, setOpenId] = useState<string | null>(null);
  const cards = useProgress((s) => s.cards);

  const tracks = ['all', ...Array.from(new Set(lessons.map((l) => l.track)))];

  const terms = useMemo(
    () =>
      allKeyTerms
        .filter((t) => (filter === 'all' ? true : t.track === (filter as TrackId)))
        .filter((t) => !q || (t.term + t.definition).toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) => a.term.localeCompare(b.term)),
    [q, filter],
  );

  const grouped = useMemo(() => {
    const map: Record<string, typeof terms> = {};
    terms.forEach((t) => {
      const letter = t.term.replace(/[^A-Za-z0-9]/g, '').charAt(0).toUpperCase() || '#';
      map[letter] = map[letter] ?? [];
      map[letter].push(t);
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [terms]);

  const studied = terms.filter((t) => {
    const f = allKeyTerms.find((k) => k.term === t.term);
    if (!f) return false;
    const lesson = lessons.find((l) => l.id === f.lessonId);
    if (!lesson) return false;
    const idx = lesson.keyTerms.findIndex((k) => k.term === f.term);
    return !!cards[`${lesson.id}-f${Math.min(idx, lesson.flashcards.length - 1)}`];
  }).length;

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="reference"
        title={`Glossary — ${allKeyTerms.length} terms`}
        sub="Every key term from all sixteen lessons, alphabetised, searchable and linked back to the lesson that teaches it."
      />

      <Panel className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="search terms and definitions…"
            className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2 font-body text-[13px] text-white placeholder:text-[#8c82a8] focus:border-[#f5b301]/60 focus:outline-none"
          />
          <div className="flex flex-wrap gap-1.5">
            {tracks.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`whitespace-nowrap rounded-lg border px-2.5 py-1.5 font-mono text-[11px] transition-colors ${
                  filter === t
                    ? 'border-[#f5b301]/60 bg-[#f5b301]/15 text-[#ffe9a8]'
                    : 'border-white/10 bg-white/[0.03] text-[#c9bde6] hover:text-white'
                }`}
              >
                {TRACK_LABELS[t as TrackId] ?? 'all'}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 text-[12px] text-[#c9bde6]">
          showing <span className="text-[#ffe9a8]">{terms.length}</span> terms · {studied} already in your flashcard
          rotation
        </div>
      </Panel>

      <div className="space-y-6">
        {grouped.map(([letter, items]) => (
          <div key={letter}>
            <div className="mb-2 flex items-center gap-3">
              <span className="font-display text-2xl text-[#f5b301]">{letter}</span>
              <div className="h-px flex-1 bg-gradient-to-r from-[#f5b301]/40 to-transparent" />
            </div>
            <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
              {items.map((t) => {
                const id = `${t.lessonId}-${t.term}`;
                const isOpen = openId === id;
                return (
                  <Panel
                    key={id}
                    hover
                    className="cursor-pointer p-3.5"
                    tone={isOpen ? 'hot' : 'gold'}
                  >
                    <button className="w-full text-left" onClick={() => setOpenId(isOpen ? null : id)}>
                      <div className="font-heading text-[13.5px] text-[#ffe9a8]">
                        <MathTex tex={t.term} />
                      </div>
                      <div className={`mt-1 text-[12.5px] leading-relaxed text-[#ded4f2] ${isOpen ? '' : 'line-clamp-3'}`}>
                        {t.definition}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <Chip tone="dim">L{t.week}</Chip>
                        <Chip tone="psy">{TRACK_LABELS[t.track]}</Chip>
                        <Link
                          to={`/lesson/${t.lessonId}`}
                          onClick={(e) => e.stopPropagation()}
                          className="ml-auto text-[10.5px] text-[#67e8f9] underline"
                        >
                          lesson →
                        </Link>
                      </div>
                    </button>
                  </Panel>
                );
              })}
            </div>
          </div>
        ))}
        {grouped.length === 0 && <Panel className="p-6 text-center text-[#c9bde6]">No term matches that search.</Panel>}
      </div>
    </div>
  );
}
