import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Chip, FadeIn, Panel, SectionTitle } from '@/components/ui';
import { LABS, LAB_MAP, LabRenderer } from '@/components/labs';
import { lessons } from '@/content';
import { useProgress } from '@/lib/store';

export default function Labs() {
  const { labId } = useParams();
  const nav = useNavigate();
  const visitLab = useProgress((s) => s.visitLab);
  const labs = useProgress((s) => s.labs);
  const [filter, setFilter] = useState('all');

  const meta = labId ? LAB_MAP[labId] : undefined;

  useEffect(() => {
    if (labId && meta) visitLab(labId);
    if (labId && !meta) nav('/labs');
  }, [labId, meta, visitLab, nav]);

  const tracks = ['all', ...Array.from(new Set(LABS.map((l) => l.track)))];

  if (meta) {
    const related = lessons.filter((l) => l.blocks.some((b) => b.kind === 'lab' && b.labId === meta.id));
    const done = labs[meta.id]?.length ?? 0;
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#c9bde6]">
          <Link to="/labs" className="hover:text-[#f5b301]">
            ← all labs
          </Link>
          <span>/</span>
          <span className="text-[#f5b301]">{meta.name}</span>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0">
            <LabRenderer labId={meta.id as never} />
          </div>
          <aside className="space-y-4">
            <Panel className="p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{meta.glyph}</span>
                <h1 className="font-heading text-lg font-bold text-white">{meta.name}</h1>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-[#c9bde6]">{meta.blurb}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Chip>{meta.track}</Chip>
                {meta.threeD && <Chip tone="psy">three.js</Chip>}
                <Chip tone="myco">
                  {done}/{meta.tasks.length} challenges
                </Chip>
              </div>
            </Panel>

            {related.length > 0 && (
              <Panel tone="psy" className="p-4">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#f5c8ff]">
                  taught in
                </div>
                <ul className="space-y-2">
                  {related.map((l) => (
                    <li key={l.id}>
                      <Link to={`/lesson/${l.id}`} className="text-[12.5px] text-[#ded4f2] hover:text-[#f5b301]">
                        L{l.number} · {l.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}

            <Panel tone="myco" className="p-4">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#6ee7a8]">
                how to use this lab
              </div>
              <ol className="space-y-1.5 text-[12.5px] leading-relaxed text-[#cfe9dc]">
                <li>1. Move one control at a time and predict the result before you look.</li>
                <li>2. Break it deliberately — find the failure boundary.</li>
                <li>3. Write the number down. An intuition you cannot quantify is a guess.</li>
                <li>4. Tick the challenges when you can explain the outcome, not just produce it.</li>
              </ol>
            </Panel>

            <Panel className="p-4">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#f5b301]">other labs</div>
              <div className="grid grid-cols-2 gap-1.5">
                {LABS.filter((l) => l.id !== meta.id).map((l) => (
                  <Link
                    key={l.id}
                    to={`/labs/${l.id}`}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5 text-center font-mono text-[10.5px] text-[#c9bde6] hover:border-[#f5b301]/50 hover:text-[#f5b301]"
                  >
                    {l.glyph} {l.name.split(':')[0].split(' ')[0]}
                  </Link>
                ))}
              </div>
            </Panel>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="interactive"
        title="Ten labs, real solvers"
        sub="Each lab runs actual mathematics — damped-least-squares inverse kinematics, a four-state Kalman filter, space-colonisation growth, qubit gate algebra, thermoelectric models. Push the sliders, break the system, then explain the break."
      />

      <div className="flex flex-wrap gap-1.5">
        {tracks.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`rounded-lg border px-3 py-1.5 font-mono text-[11px] capitalize transition-colors ${
              filter === t
                ? 'border-[#f5b301]/60 bg-[#f5b301]/15 text-[#ffe9a8]'
                : 'border-white/10 bg-white/[0.03] text-[#c9bde6] hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {LABS.filter((l) => filter === 'all' || l.track === filter).map((l, i) => {
          const done = labs[l.id]?.length ?? 0;
          return (
            <FadeIn key={l.id} delay={i * 0.04}>
              <Panel hover tone={l.tone} className="flex h-full flex-col p-4">
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{l.glyph}</span>
                  <div className="text-right">
                    <div className="font-mono text-[10px] text-[#c9bde6]">{l.track}</div>
                    {l.threeD && <Chip tone="psy">3D</Chip>}
                  </div>
                </div>
                <h3 className="mt-2 font-heading text-base font-semibold text-white">{l.name}</h3>
                <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-[#c9bde6]">{l.blurb}</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#6ee7a8] to-[#f5b301]"
                    style={{ width: `${(done / l.tasks.length) * 100}%` }}
                  />
                </div>
                <Link to={`/labs/${l.id}`} className="btn btn-ghost mt-3 !py-1.5 text-[12px]">
                  open lab →
                </Link>
              </Panel>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
