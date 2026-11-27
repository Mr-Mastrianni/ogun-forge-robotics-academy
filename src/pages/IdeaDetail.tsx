import { Link, useNavigate, useParams } from 'react-router-dom';
import { Chip, Meter, Panel, Progress } from '@/components/ui';
import { allProjects, lessonById, projectById } from '@/content';
import { useManufacturing } from '@/lib/manufacturingStore';
import { newProject } from '@/lib/manufacturing';
import { useProgress } from '@/lib/store';

export default function IdeaDetail() {
  const { projectId } = useParams();
  const nav = useNavigate();
  const p = projectId ? projectById[projectId] : undefined;
  const production = useManufacturing(s => s.projects.find(p => p.blueprintId === projectId));
  const addProduction = useManufacturing(s => s.add);
  const saved = useProgress((s) => s.savedProjects);
  const toggleProject = useProgress((s) => s.toggleProject);

  if (!p) {
    return (
      <Panel className="p-6 text-center">
        <p className="text-k-muted">That blueprint does not exist.</p>
        <button onClick={() => nav('/ideas')} className="btn btn-primary mt-4">
          back to the Idea Lab
        </button>
      </Panel>
    );
  }

  const isSaved = saved.includes(p.id);
  const related = allProjects.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-[12px] text-k-muted">
        <Link to="/ideas" className="hover:text-k-moss">
          ← idea lab
        </Link>
        <span>/</span>
        <span className="text-k-moss">{p.category}</span>
        <span>/</span>
        <span>{p.title}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-5">
          <header>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Chip tone="myco">{p.category}</Chip>
              <Chip tone="dim">{p.difficulty}</Chip>
              <Chip tone="dim">⏱ {p.buildTime}</Chip>
              <Chip tone="dim">cost {p.costBand}</Chip>
            </div>
            <h1 className="font-heading text-2xl font-bold leading-tight text-white md:text-3xl">{p.title}</h1>
            <p className="mt-1.5 text-[15px] italic text-k-muted">{p.tagline}</p>
          </header>

          <Panel className="p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-k-gold">the build</div>
            <p className="mt-2 text-[14px] leading-relaxed text-k-text">{p.summary}</p>
          </Panel>

          <div className="grid gap-4 md:grid-cols-2">
            <Panel tone="myco" className="p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-k-moss">
                the engineering (measurable)
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-k-mint">{p.realitySplit.real}</p>
            </Panel>
            <Panel tone="hot" className="p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-k-sand">
                the narrative (cultural framing)
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-k-paper">{p.realitySplit.narrative}</p>
            </Panel>
          </div>

          <Panel className="p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-k-light">the science</div>
            <p className="mt-2 text-[14px] leading-relaxed text-k-text">{p.science}</p>
          </Panel>

          <Panel className="overflow-hidden">
            <div className="border-b border-white/10 px-4 py-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-k-gold">
                bill of materials
              </div>
              <div className="font-heading text-sm text-white">{p.billOfMaterials.length} line items</div>
            </div>
            <table className="forge-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {p.billOfMaterials.map((b, i) => (
                  <tr key={i}>
                    <td className="font-medium text-k-glint">{b.item}</td>
                    <td className="font-mono text-[12px]">{b.qty}</td>
                    <td className="text-[12.5px] text-k-muted">{b.note ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <Panel className="p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-k-gold">build steps</div>
            <ol className="mt-3 space-y-3">
              {p.buildSteps.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-k-gold/50 bg-k-gold/10 font-mono text-[11px] text-k-gold">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-heading text-[14px] text-k-glint">{s.title}</div>
                    <div className="text-[13px] leading-relaxed text-k-text">{s.detail}</div>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>

          {p.code && (
            <Panel className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-k-moss">starter code</span>
                <Chip tone="dim">{p.code.language}</Chip>
              </div>
              <pre className="max-h-[420px] overflow-auto bg-[#060e0b] p-4 font-mono text-[12px] leading-relaxed text-[#a9ece5]">
                <code>{p.code.snippet}</code>
              </pre>
              <p className="border-t border-white/5 px-4 py-2 text-[12px] text-k-muted">{p.code.note}</p>
            </Panel>
          )}

          <Panel className="p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-k-light">
              success metrics — what to measure
            </div>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {p.metrics.map((m, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-k-muted">{m.label}</div>
                  <div className="font-heading text-[13.5px] text-k-glint">{m.value}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel tone="psy" className="p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-k-sand">
              stretch goals — take it further
            </div>
            <ul className="mt-2 space-y-2">
              {p.stretchGoals.map((g, i) => (
                <li key={i} className="flex gap-2.5 text-[13px] leading-relaxed text-k-paper">
                  <span className="text-k-ember">◆</span>
                  {g}
                </li>
              ))}
            </ul>
          </Panel>

          {p.sources.length > 0 && (
            <Panel className="p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-k-gold">sources</div>
              <ul className="mt-2 space-y-1.5">
                {p.sources.map((s, i) => (
                  <li key={i}>
                    <a href={s.url} target="_blank" rel="noreferrer noopener" className="text-[12.5px] text-k-light underline">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>

        <aside className="space-y-4">
          <Panel className="p-4">
            <button onClick={() => toggleProject(p.id)} className={`btn w-full ${isSaved ? 'btn-myco' : 'btn-primary'}`}>
              {isSaved ? '★ saved to your forge' : '☆ save blueprint'}
            </button>
            <button className="btn btn-myco w-full mt-3" onClick={() => {
              if (production) { nav(`/manufacturing/project/${production.id}`); return; }
              const project = newProject(p.title, p.id, `${p.summary}\n\nEngineering reality: ${p.realitySplit.real}\n\nSafety considerations: ${p.safety.join('; ')}`, p.billOfMaterials.map(b => `${b.qty} × ${b.item}${b.note ? ` — ${b.note}` : ''}`).join('\n'));
              addProduction(project); nav(`/manufacturing/project/${project.id}`);
            }}>{production ? 'Open production project →' : 'Start production project →'}</button>
            <p className="mt-2 text-xs text-k-muted">Copies this blueprint and BOM into a production workspace. Validate feasibility and demand before spending.</p>
            <div className="mt-4 space-y-3">
              <Meter label="Wakanda index" value={p.wakandaIndex} tone="psy" />
              <Meter label="DIY feasibility" value={p.diyFeasibility} tone="myco" />
              <Meter label="scientific grounding" value={p.scienceGrounding} tone="sirius" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-[11px] text-k-muted">
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
                <div className="text-[9.5px] uppercase tracking-widest">build time</div>
                <div className="text-k-glint">{p.buildTime}</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
                <div className="text-[9.5px] uppercase tracking-widest">cost band</div>
                <div className="text-k-glint">{p.costBand}</div>
              </div>
            </div>
          </Panel>

          <Panel tone="hot" className="p-4">
            <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#ffd0b0]">
              ⚠ safety &amp; legal controls
            </div>
            <ul className="space-y-2">
              {p.safety.map((s, i) => (
                <li key={i} className="flex gap-2 text-[12.5px] leading-relaxed text-k-paper">
                  <span className="text-k-forge">▸</span>
                  {s}
                </li>
              ))}
            </ul>
          </Panel>

          {p.lessonLinks.length > 0 && (
            <Panel className="p-4">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-k-gold">
                learn the fundamentals
              </div>
              <ul className="space-y-2">
                {p.lessonLinks.map((id) => {
                  const l = lessonById[id];
                  return (
                    <li key={id}>
                      <Link to={`/lesson/${id}`} className="block text-[12.5px] text-k-text hover:text-k-gold">
                        {l ? `L${l.number} · ${l.title}` : id}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          )}

          {related.length > 0 && (
            <Panel tone="myco" className="p-4">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-k-moss">
                more {p.category} builds
              </div>
              <ul className="space-y-2">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link to={`/ideas/${r.id}`} className="text-[12.5px] leading-snug text-k-mint hover:text-k-moss">
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          <Panel className="p-4">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-k-gold">
              capstone linkage
            </div>
            <p className="text-[12px] leading-relaxed text-k-muted">
              Week 8 turns one of these blueprints into a full capstone: requirements, architecture, interfaces, risk
              register, safety case and a demo.
            </p>
            <Progress value={isSaved ? 1 : 0.2} />
            <Link to="/lesson/w8l16" className="btn btn-ghost mt-3 w-full !py-1.5 text-[12px]">
              capstone brief →
            </Link>
          </Panel>
        </aside>
      </div>
    </div>
  );
}
