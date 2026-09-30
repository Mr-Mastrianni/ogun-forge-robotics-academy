import { useMemo, useState } from 'react';
import { Chip, FadeIn, Panel, SectionTitle, StatOrb } from '@/components/ui';
import { colorPalettes, heritageEntries } from '@/content';
import { ADINKRA_GLYPHS } from '@/lib/progression';

const STATUS_META: Record<string, { label: string; color: string; note: string }> = {
  documented: { label: 'documented', color: '#6ee7a8', note: 'well attested in scholarship' },
  archaeological: { label: 'archaeological', color: '#f5b301', note: 'evidence is material/stratigraphic' },
  'living-tradition': { label: 'living tradition', color: '#c026d3', note: 'practised today; handle with respect' },
  disputed: { label: 'disputed', color: '#ff6b2a', note: 'contested claims — treat with care' },
};

export default function Atlas() {
  const [status, setStatus] = useState('all');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      heritageEntries
        .filter((e) => (status === 'all' ? true : e.status === status))
        .filter((e) => {
          if (!q) return true;
          const t = (e.title + e.culture + e.region + e.detail + e.engineeringLesson + e.tags.join(' ')).toLowerCase();
          return t.includes(q.toLowerCase());
        }),
    [status, q],
  );

  const counts = useMemo(
    () =>
      heritageEntries.reduce((acc, e) => {
        acc[e.status] = (acc[e.status] ?? 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    [],
  );

  const regions = useMemo(
    () => Array.from(new Set(heritageEntries.map((e) => e.region))).length,
    [],
  );

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="heritage"
        title="The Heritage Atlas"
        sub="Iron smelting, binary divination systems, mortarless stone engineering, fractal design, star tracking, manuscript astronomy — the technological lineage this course stands on, mapped to the modern engineering idea inside each one."
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <StatOrb value={heritageEntries.length} label="entries" glyph="✵" />
        <StatOrb value={regions} label="regions" glyph="◉" tone="psy" />
        <StatOrb value={counts.documented ?? 0} label="documented" glyph="✓" tone="myco" />
        <StatOrb value={counts['living-tradition'] ?? 0} label="living traditions" glyph="🕯" tone="sirius" />
        <StatOrb value={counts.disputed ?? 0} label="flagged disputed" glyph="⚠" tone="gold" />
      </div>

      <Panel className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="search cultures, inventions, engineering lessons…"
            className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2 font-body text-[13px] text-white placeholder:text-[#8c82a8] focus:border-[#f5b301]/60 focus:outline-none"
          />
          <div className="flex flex-wrap gap-1.5">
            {['all', 'documented', 'archaeological', 'living-tradition', 'disputed'].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`whitespace-nowrap rounded-lg border px-2.5 py-1.5 font-mono text-[11px] transition-colors ${
                  status === s
                    ? 'border-[#f5b301]/60 bg-[#f5b301]/15 text-[#ffe9a8]'
                    : 'border-white/10 bg-white/[0.03] text-[#c9bde6] hover:text-white'
                }`}
              >
                {s === 'all' ? 'all' : STATUS_META[s]?.label ?? s}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-[#c9bde6]">
          Every entry carries an epistemic status. Where claims are contested — most famously the Dogon/Sirius material —
          the entry is labelled <span style={{ color: STATUS_META.disputed.color }}>disputed</span> and the dispute is
          described rather than resolved in the course's favour. Heritage deserves accuracy, not inflation.
        </p>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((e, i) => {
          const meta = STATUS_META[e.status];
          const isOpen = open === e.id;
          return (
            <FadeIn key={e.id} delay={Math.min(i * 0.03, 0.4)}>
              <Panel hover className="flex h-full flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-3xl text-[#f5b301]">{e.glyph}</span>
                  <div className="text-right">
                    <span
                      className="rounded-full border px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-widest"
                      style={{ borderColor: `${meta.color}66`, color: meta.color }}
                    >
                      {meta.label}
                    </span>
                  </div>
                </div>
                <h3 className="mt-2 font-heading text-base font-semibold leading-snug text-white">{e.title}</h3>
                <div className="mt-0.5 font-mono text-[10.5px] text-[#c9bde6]">
                  {e.culture} · {e.region} · {e.era}
                </div>
                <p className="mt-2 text-[12.5px] italic leading-relaxed text-[#ded4f2]">{e.hook}</p>

                <div className={`mt-2 text-[12.5px] leading-relaxed text-[#c9bde6] ${isOpen ? '' : 'line-clamp-3'}`}>
                  {e.detail}
                </div>

                {isOpen && (
                  <>
                    <div className="mt-3 rounded-xl border border-[#6ee7a8]/25 bg-[#6ee7a8]/5 p-3">
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6ee7a8]">
                        engineering idea worth stealing
                      </div>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-[#cfe9dc]">{e.engineeringLesson}</p>
                    </div>
                    {e.sources.length > 0 && (
                      <div className="mt-3">
                        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#f5b301]">sources</div>
                        <ul className="mt-1 space-y-1">
                          {e.sources.map((s, si) => (
                            <li key={si}>
                              <a
                                href={s.url}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="text-[11.5px] text-[#67e8f9] underline"
                              >
                                {s.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {e.tags.slice(0, 4).map((t) => (
                    <Chip key={t} tone="dim">
                      {t}
                    </Chip>
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => setOpen(isOpen ? null : e.id)}
                    className="btn btn-ghost !px-3 !py-1 text-[11.5px]"
                  >
                    {isOpen ? 'collapse' : 'read more'}
                  </button>
                  {e.lessonLinks[0] && (
                    <a href={`/lesson/${e.lessonLinks[0]}`} className="text-[11.5px] text-[#f5b301] underline">
                      related lesson →
                    </a>
                  )}
                </div>
              </Panel>
            </FadeIn>
          );
        })}
      </div>

      <SectionTitle
        eyebrow="art direction"
        title="The five palettes"
        sub="Pulled from iron oxide, Dogon starlight, the Ilé-Ifẹ̀ cosmogony, mycelial bioluminescence and the X-ray spectrum of Sirius B."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {colorPalettes.map((pal) => (
          <Panel key={pal.id} className="p-4">
            <div className="flex h-14 overflow-hidden rounded-xl border border-white/15">
              {pal.colors.map((c) => (
                <div key={c.hex} className="flex-1" style={{ background: c.hex }} title={`${c.name} ${c.hex}`} />
              ))}
            </div>
            <div className="mt-3 font-heading text-sm text-white">{pal.name}</div>
            <div className="text-[11.5px] italic leading-snug text-[#c9bde6]">{pal.inspiration}</div>
            <div className="mt-3 space-y-1.5">
              {pal.colors.map((c) => (
                <div key={c.hex} className="text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm border border-white/20" style={{ background: c.hex }} />
                    <span className="font-mono text-[10.5px] text-[#ded4f2]">{c.name}</span>
                    <span className="ml-auto font-mono text-[10px] text-[#8c82a8]">{c.hex}</span>
                  </div>
                  <div className="pl-5 text-[10.5px] text-[#c9bde6]">{c.use}</div>
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </div>

      <Panel className="p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#f5b301]">
          the adinkra vocabulary used across this app
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {ADINKRA_GLYPHS.map((g, i) => (
            <div key={`${g.name}-${i}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
              <div className="flex items-center gap-2">
                <span className="text-lg text-[#f5b301]">{g.glyph}</span>
                <span className="font-heading text-[12px] text-white">{g.name}</span>
              </div>
              <div className="mt-1 text-[11px] leading-snug text-[#c9bde6]">{g.meaning}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
