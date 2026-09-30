import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Chip, Panel, SectionTitle } from '@/components/ui';
import { referenceTables, lessons } from '@/content';
import type { Block } from '@/content/types';
import { Inline } from '@/lib/rich';

const CAT_LABELS: Record<string, string> = {
  sensors: '👁 Sensors',
  actuators: '⚙ Actuators',
  compute: '🧠 Compute',
  comms: '📡 Comms',
  power: '⚡ Power',
  control: '∿ Control',
  biology: '🍄 Biology',
  frontier: '🌌 Frontier',
};

export default function Tables() {
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const [params] = useSearchParams();

  // deep link from search: /tables?t=<table id>
  useEffect(() => {
    const tid = params.get('t');
    if (!tid) return;
    setOpen(tid);
    setCat('all');
    const timer = setTimeout(() => document.getElementById('table-' + tid)?.scrollIntoView({ block: 'start' }), 120);
    return () => clearTimeout(timer);
  }, [params]);

  const cats = ['all', ...Array.from(new Set(referenceTables.map((t) => t.category)))];

  const filtered = useMemo(
    () =>
      referenceTables.filter((t) => {
        const inCat = cat === 'all' || t.category === cat;
        const text = (t.title + t.intro + t.rows.flat().join(' ')).toLowerCase();
        return inCat && (!q || text.includes(q.toLowerCase()));
      }),
    [cat, q],
  );

  const lessonTables = useMemo(
    () =>
      lessons.flatMap((l) =>
        l.blocks
          .map((b: Block, i) => ({ lesson: l, block: b, key: `${l.id}-${i}` }))
          .filter((x) => x.block.kind === 'table') as {
          lesson: typeof l;
          block: Extract<Block, { kind: 'table' }>;
          key: string;
        }[],
      ),
    [],
  );

  const lessonFiltered = useMemo(
    () =>
      lessonTables.filter(({ block, lesson }) => {
        if (!q) return true;
        const text = (lesson.title + block.title + block.rows.flat().join(' ')).toLowerCase();
        return text.includes(q.toLowerCase());
      }),
    [lessonTables, q],
  );

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="reference"
        title="Engineering Tables"
        sub="Twelve curated comparison tables plus every table authored inside the lessons. Real part numbers, real ranges and units, and an honest note on when to choose what."
      />

      <Panel className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="search parts, protocols, substrates, standards…"
            className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2 font-body text-[13px] text-white placeholder:text-[#8c82a8] focus:border-[#f5b301]/60 focus:outline-none"
          />
          <div className="flex flex-wrap gap-1.5">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`whitespace-nowrap rounded-lg border px-2.5 py-1.5 font-mono text-[11px] transition-colors ${
                  cat === c
                    ? 'border-[#f5b301]/60 bg-[#f5b301]/15 text-[#ffe9a8]'
                    : 'border-white/10 bg-white/[0.03] text-[#c9bde6] hover:text-white'
                }`}
              >
                {CAT_LABELS[c] ?? 'all'}
              </button>
            ))}
          </div>
        </div>
      </Panel>

      <div className="grid gap-4">
        {filtered.map((t) => (
          <Panel key={t.id} id={`table-${t.id}`} className="overflow-hidden">
            <button
              onClick={() => setOpen(open === t.id ? null : t.id)}
              className="flex w-full items-center gap-3 border-b border-white/10 px-4 py-3 text-left"
            >
              <span className="text-lg">{CAT_LABELS[t.category]?.split(' ')[0] ?? '▦'}</span>
              <div className="min-w-0 flex-1">
                <div className="font-heading text-sm font-semibold text-white">{t.title}</div>
                <div className="text-[12px] text-[#c9bde6]">{t.intro}</div>
              </div>
              <Chip tone="dim">{t.rows.length} rows</Chip>
              <span className="font-mono text-[11px] text-[#f5b301]">{open === t.id ? '−' : '+'}</span>
            </button>

            {(open === t.id || filtered.length <= 2) && (
              <>
                <div className="max-h-[560px] overflow-auto">
                  <table className="forge-table">
                    <thead>
                      <tr>
                        {t.columns.map((c) => (
                          <th key={c}>{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {t.rows.map((r, i) => (
                        <tr key={i}>
                          {r.map((cell, j) => (
                            <td key={j}>
                              <Inline text={cell} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="border-t border-[#6ee7a8]/20 bg-[#6ee7a8]/5 px-4 py-2.5 text-[12.5px] leading-relaxed text-[#cfe9dc]">
                  <strong className="text-[#6ee7a8]">How to choose:</strong> {t.insight}
                </div>
              </>
            )}
          </Panel>
        ))}
        {filtered.length === 0 && (
          <Panel className="p-6 text-center text-[#c9bde6]">No reference table matches that search.</Panel>
        )}
      </div>

      <SectionTitle
        eyebrow="from the lessons"
        title={`${lessonFiltered.length} tables authored inside lessons`}
        sub="These are the tables embedded in the sixteen lessons, in context with the surrounding explanation."
      />
      <div className="grid gap-4 xl:grid-cols-2">
        {lessonFiltered.map(({ lesson, block, key }) => (
          <Panel key={key} className="overflow-hidden">
            <div className="border-b border-white/10 px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <Chip tone="dim">L{lesson.number}</Chip>
                <Chip tone="psy">{lesson.track}</Chip>
              </div>
              <div className="mt-1 font-heading text-sm font-semibold text-white">{block.title}</div>
              <div className="text-[11.5px] text-[#c9bde6]">{lesson.title}</div>
            </div>
            <div className="max-h-[380px] overflow-auto">
              <table className="forge-table">
                <thead>
                  <tr>
                    {block.columns.map((c) => (
                      <th key={c}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((r, i) => (
                    <tr key={i}>
                      {r.map((cell, j) => (
                        <td key={j}>
                          <Inline text={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {block.caption && <p className="border-t border-white/5 px-4 py-2 text-[12px] text-[#c9bde6]">{block.caption}</p>}
          </Panel>
        ))}
      </div>
    </div>
  );
}
