import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Chip, FadeIn, Meter, Panel, SectionTitle, StatOrb } from '@/components/ui';
import { allProjects } from '@/content';
import type { Difficulty, IdeaCategory } from '@/content/types';
import { useProgress } from '@/lib/store';

const CATS: { id: IdeaCategory | 'all'; label: string; glyph: string }[] = [
  { id: 'all', label: 'Everything', glyph: '✦' },
  { id: 'mycelium', label: 'Mycelium Robo-Tech', glyph: '🍄' },
  { id: 'nature', label: 'Nature & Biomimicry', glyph: '🌿' },
  { id: 'jyotish', label: 'Jyotish Cultural Computing', glyph: '✵' },
  { id: 'energy', label: 'Energy Frontiers', glyph: '⚡' },
  { id: 'quantum', label: 'Quantum Systems', glyph: '⚛' },
  { id: 'afrofuture', label: 'Afrofuture / Wakanda', glyph: '◈' },
  { id: 'space', label: 'Space & Extreme', glyph: '🚀' },
];

const DIFFS: (Difficulty | 'all')[] = ['all', 'seedling', 'apprentice', 'journeyman', 'master', 'orisha'];

export default function Ideas() {
  const [cat, setCat] = useState<IdeaCategory | 'all'>('all');
  const [diff, setDiff] = useState<Difficulty | 'all'>('all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<'wakanda' | 'diy' | 'science' | 'title'>('wakanda');
  const saved = useProgress((s) => s.savedProjects);
  const toggleProject = useProgress((s) => s.toggleProject);

  const filtered = useMemo(() => {
    const list = allProjects
      .filter((p) => (cat === 'all' ? true : p.category === cat))
      .filter((p) => (diff === 'all' ? true : p.difficulty === diff))
      .filter((p) => {
        if (!q) return true;
        const t = (p.title + p.tagline + p.summary + p.science + p.billOfMaterials.map((b) => b.item).join(' ')).toLowerCase();
        return t.includes(q.toLowerCase());
      });
    const sorted = [...list];
    if (sort === 'wakanda') sorted.sort((a, b) => b.wakandaIndex - a.wakandaIndex);
    if (sort === 'diy') sorted.sort((a, b) => b.diyFeasibility - a.diyFeasibility);
    if (sort === 'science') sorted.sort((a, b) => b.scienceGrounding - a.scienceGrounding);
    if (sort === 'title') sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }, [cat, diff, q, sort]);

  const avgWakanda = Math.round(allProjects.reduce((a, p) => a + p.wakandaIndex, 0) / Math.max(1, allProjects.length));
  const buildableNow = allProjects.filter((p) => p.diyFeasibility >= 65).length;
  const peerGrounded = allProjects.filter((p) => p.scienceGrounding >= 70).length;

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="beyond the syllabus"
        title={`Idea Lab — ${allProjects.length} buildable blueprints`}
        sub="Living chassis, fungal signalling rigs, panchang schedulers over real agronomy, geothermal probes, NV-centre magnetometry, auxetic vibranium bumpers, CubeSat ADCS. Every blueprint separates the engineering from the myth, lists a bill of materials, and names real safety controls."
        right={
          <div className="flex flex-wrap gap-2">
            <Link to="/tables" className="btn btn-ghost">
              ▦ mycelium substrate table
            </Link>
            <Link to="/labs/mycelium" className="btn btn-myco">
              🍄 open the mycelium lab
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <StatOrb value={allProjects.length} label="blueprints" glyph="✦" />
        <StatOrb value={buildableNow} label="garage-buildable" glyph="🔧" tone="myco" />
        <StatOrb value={peerGrounded} label="peer-grounded" glyph="📄" tone="sirius" />
        <StatOrb value={avgWakanda} label="mean Wakanda index" glyph="◈" tone="psy" />
        <StatOrb value={saved.length} label="saved by you" glyph="★" tone="gold" />
      </div>

      <Panel className="p-4">
        <div className="flex flex-col gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="search blueprints, materials, mechanisms…"
            className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2 font-body text-[13px] text-white placeholder:text-[#8c82a8] focus:border-[#6ee7a8]/60 focus:outline-none"
          />
          <div className="flex flex-wrap gap-1.5">
            {CATS.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`rounded-lg border px-2.5 py-1.5 font-mono text-[11px] transition-colors ${
                  cat === c.id
                    ? 'border-[#6ee7a8]/60 bg-[#6ee7a8]/15 text-[#b8f5d0]'
                    : 'border-white/10 bg-white/[0.03] text-[#c9bde6] hover:text-white'
                }`}
              >
                {c.glyph} {c.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-1.5">
              {DIFFS.map((d) => (
                <button
                  key={String(d)}
                  onClick={() => setDiff(d)}
                  className={`rounded-lg border px-2.5 py-1 font-mono text-[10.5px] capitalize transition-colors ${
                    diff === d
                      ? 'border-[#c026d3]/60 bg-[#c026d3]/15 text-[#f5c8ff]'
                      : 'border-white/10 bg-white/[0.03] text-[#c9bde6] hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="font-mono text-[10.5px] uppercase tracking-widest text-[#c9bde6]">sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="rounded-lg border border-white/15 bg-[#0a0420] px-2 py-1 font-mono text-[11px] text-[#ded4f2] focus:outline-none"
              >
                <option value="wakanda">Wakanda index</option>
                <option value="diy">DIY feasibility</option>
                <option value="science">Scientific grounding</option>
                <option value="title">Title A–Z</option>
              </select>
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p, i) => {
          const isSaved = saved.includes(p.id);
          const catMeta = CATS.find((c) => c.id === p.category);
          return (
            <FadeIn key={p.id} delay={Math.min(i * 0.03, 0.4)}>
              <Panel hover tone={p.category === 'mycelium' ? 'myco' : p.category === 'quantum' ? 'hot' : 'gold'} className="flex h-full flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Chip tone={p.category === 'mycelium' ? 'myco' : 'psy'}>
                      {catMeta?.glyph} {p.category}
                    </Chip>
                    <Chip tone="dim">{p.difficulty}</Chip>
                  </div>
                  <button
                    onClick={() => toggleProject(p.id)}
                    title={isSaved ? 'remove from your forge list' : 'save to your forge list'}
                    className={`shrink-0 rounded-lg border px-2 py-1 text-[12px] transition-colors ${
                      isSaved ? 'border-[#f5b301]/60 bg-[#f5b301]/20 text-[#ffe9a8]' : 'border-white/15 text-[#c9bde6] hover:text-white'
                    }`}
                  >
                    {isSaved ? '★ saved' : '☆ save'}
                  </button>
                </div>

                <h3 className="mt-2 font-heading text-base font-semibold leading-snug text-white">{p.title}</h3>
                <p className="text-[12px] italic text-[#c9bde6]">{p.tagline}</p>
                <p className="mt-2 flex-1 text-[12.5px] leading-relaxed text-[#ded4f2]">{p.summary}</p>

                <div className="mt-3 space-y-2">
                  <Meter label="Wakanda index" value={p.wakandaIndex} tone="psy" />
                  <Meter label="DIY feasibility" value={p.diyFeasibility} tone="myco" />
                  <Meter label="scientific grounding" value={p.scienceGrounding} tone="sirius" />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[10.5px] text-[#c9bde6]">
                  <span>⏱ {p.buildTime}</span>
                  <span>·</span>
                  <span>{p.costBand}</span>
                  <span>·</span>
                  <span>{p.billOfMaterials.length} BOM items</span>
                </div>

                <Link to={`/ideas/${p.id}`} className="btn btn-ghost mt-3 !py-1.5 text-[12px]">
                  open blueprint →
                </Link>
              </Panel>
            </FadeIn>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Panel className="p-6 text-center text-[#c9bde6]">No blueprint matches those filters — widen the search.</Panel>
      )}

      <Panel className="p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#f5b301]">how the scores work</div>
        <div className="mt-2 grid gap-3 md:grid-cols-3">
          <div>
            <div className="font-heading text-[13px] text-[#f5c8ff]">◈ Wakanda index</div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[#c9bde6]">
              How far past a normal maker project this sits — ambition, elegance and system-level thinking. High is not
              the same as easy.
            </p>
          </div>
          <div>
            <div className="font-heading text-[13px] text-[#6ee7a8]">🔧 DIY feasibility</div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[#c9bde6]">
              How realistically a determined person with a workbench, a modest budget and a 3D printer can build it
              this year.
            </p>
          </div>
          <div>
            <div className="font-heading text-[13px] text-[#67e8f9]">📄 Scientific grounding</div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[#c9bde6]">
              How much of the mechanism is measured and peer-reviewed versus modelled, extrapolated or speculative.
            </p>
          </div>
        </div>
        <p className="mt-3 text-[12.5px] leading-relaxed text-[#ded4f2]">
          Each blueprint also carries a <strong className="text-[#ffe9a8]">reality split</strong>: the part that is
          genuine engineering you can measure, and the part that is cultural framing or narrative. The course never
          blurs the two — a Jyotish scheduling layer is a beautiful interface, not a physics principle; a mycelium
          chassis is a real material, not a conscious machine.
        </p>
      </Panel>
    </div>
  );
}
