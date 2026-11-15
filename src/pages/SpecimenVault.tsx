import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Chip, Panel, SectionTitle, StatOrb } from '@/components/ui';
import { KAMITRON_LABS, SPECIMENS, TIERS, BUILD_XP, RANK_XP } from '@/content/kamitron';
import { useProgress } from '@/lib/store';
import { KamitronNav } from '@/components/kamitron/KamitronNav';
const SpecimenViewer = lazy(() => import('@/components/kamitron/SpecimenViewer'));

export default function SpecimenVault() {
  const [params, setParams] = useSearchParams();
  const requested = SPECIMENS.find(s => s.id === params.get('specimen'));
  const selected = requested ?? SPECIMENS.find(s => s.name === 'Hyalos GX-8')!;
  const lab = KAMITRON_LABS.find(l => l.id === params.get('lab')) ?? selected.lab;
  const xp = useProgress(s => s.xp);
  const saved = useProgress(s => s.savedProjects);
  const toggleProject = useProgress(s => s.toggleProject);
  const [file, setFile] = useState<File | null>(null);
  const location = useLocation();
  const preview = location.hash === '#owner';
  useEffect(() => { document.title = 'Specimen Vault · Ọ̀gún’s Forge'; }, []);
  const rank = RANK_XP.reduce((r, threshold, i) => xp >= threshold ? i : r, 0);

  return <div>
    <SectionTitle eyebrow="Ọ̀gún’s Forge · Kamitron Academy" title="Specimen Vault" sub="35 hands-on builds across seven living labs. Ancient intelligence. Living machines." />
    <KamitronNav />
    <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4"><StatOrb value="35" label="Specimens" /><StatOrb value="7" label="Living labs" tone="myco" /><StatOrb value={xp.toLocaleString()} label="Your Forge XP" tone="psy" /><StatOrb value={TIERS[rank]} label="Academy rank" tone="sirius" /></div>
    {preview && <Panel className="mb-4 p-4"><p className="text-sm text-[#ffd166]">Studio preview · All 35 concepts are viewable. This public preview switch does not grant membership or change your progress.</p></Panel>}
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(260px,1fr)]">
      <Suspense fallback={<Panel className="grid min-h-[430px] place-items-center p-6">Heating the specimen forge…</Panel>}><SpecimenViewer specimen={selected} file={file} /></Suspense>
      <Panel className="flex flex-col gap-4 p-6">
        <div className="font-mono text-xs uppercase tracking-widest text-[#f5b301]">{selected.lab.name} · Tier {selected.tier + 1}</div>
        <h1 className="font-heading text-2xl font-bold text-white">{selected.name}</h1>
        <div className="flex flex-wrap gap-2"><Chip>{TIERS[selected.tier]}</Chip><Chip tone="dim">Concept preview</Chip></div>
        <dl className="space-y-4 text-sm"><div><dt className="text-[#f5b301]">You build</dt><dd className="mt-1 text-[#efe7ff]">{selected.project}</dd></div><div><dt className="text-[#f5b301]">You learn</dt><dd className="mt-1 text-[#c9bde6]">{selected.learn}</dd></div></dl>
        <p className="text-sm text-[#c9bde6]">Planned build reward: <strong className="text-white">{BUILD_XP[selected.tier].toLocaleString()} XP</strong>. Build submissions and membership open at Academy launch.</p>
        <p className="text-xs text-[#c9bde6]">{selected.tier === 0 ? 'Spore builds stay free for everyone.' : `Planned learning level: ${TIERS[selected.tier]}. All concept models are available to explore.`}</p>
        <button className="btn-primary text-sm" aria-pressed={saved.includes(`kamitron:${selected.id}`)} onClick={() => toggleProject(`kamitron:${selected.id}`)}>{saved.includes(`kamitron:${selected.id}`) ? 'Saved to your Forge' : 'Save this build'}</button>
        <Link className="btn-ghost text-center text-sm" to="/manufacturing">Plan a build in Manufacturing Forge →</Link>
      </Panel>
    </div>
    <section className="mt-9"><SectionTitle eyebrow="The collection" title="Seven labs. Pick a specimen." sub={lab.line} />
      <div className="mb-5 flex flex-wrap gap-2" aria-label="Filter by lab">{KAMITRON_LABS.map(l => <button key={l.id} className="btn-ghost text-sm" aria-pressed={lab.id === l.id} onClick={() => setParams({ lab: l.id, specimen: `${l.id}-0` })}>{l.name}</button>)}</div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{SPECIMENS.filter(s => s.lab.id === lab.id).map(s => <button key={s.id} className={`glass panel-edge p-5 text-left transition-colors hover:border-[#f5b301]/60 ${selected.id === s.id ? 'border-[#f5b301]' : ''}`} aria-pressed={selected.id === s.id} onClick={() => { setFile(null); setParams({ lab: s.lab.id, specimen: s.id }); }}>
        <div className="mb-2 font-mono text-xs text-[#f5b301]">Tier {s.tier + 1} · {TIERS[s.tier]}</div><h3 className="font-heading font-bold text-white">{s.name}</h3><p className="my-3 text-sm text-[#c9bde6]">{s.project}</p><span className="font-mono text-xs text-[#6ee7a8]">{BUILD_XP[s.tier].toLocaleString()} XP · {s.tier === 0 ? 'Free at launch' : 'Academy preview'}</span>
      </button>)}</div>
    </section>
    <section className="mt-9"><SectionTitle title="Five ranks, from Spore to Elder" sub="Your current Academy rank uses your existing Forge XP. Build rewards are planned for launch." /><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{TIERS.map((tier, i) => <Panel key={tier} className={`p-4 ${rank === i ? 'border-[#f5b301]' : ''}`}><Chip>{tier}</Chip><p className="mt-3 font-mono text-xs text-[#c9bde6]">{RANK_XP[i].toLocaleString()} XP</p><p className="mt-2 text-sm">{['Household items, all ages','Basic hand tools','Soldering and microcontrollers','3D printing, power tools','Lead community projects'][i]}</p><p className="mt-2 text-xs text-[#f5b301]">{BUILD_XP[i].toLocaleString()} per build at launch</p></Panel>)}</div></section>
    <section className="mt-9" id="join"><SectionTitle title="Start free. Grow at your pace." sub="Paid levels open when the Academy launches. Spore builds stay free." /><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{[
      ['Visitor','Free','All seven Spore builds and the full Vault preview.'],['Grower','Coming soon','Sprout and Root builds, XP, badges and the community.'],['Builder','Coming soon','Canopy builds, live build calls and Guild quests.'],['Elder Cohort','Coming soon','Capstones, mentorship and a path to co-teaching.'],
    ].map(([name, price, detail]) => <Panel key={name} className="p-5"><h3 className="font-heading font-bold text-white">{name}</h3><p className="my-2 text-xs text-[#f5b301]">{price}</p><p className="text-sm text-[#c9bde6]">{detail}</p></Panel>)}</div><Link className="btn-primary mt-5 inline-flex" to="/kamitron#join">Join the Hive waitlist</Link></section>
    {preview && <Panel className="mt-9 p-6"><h2 className="font-heading font-bold text-white">Studio model tool</h2><p className="my-3 text-sm text-[#c9bde6]">Test a self-contained Meshy .glb export. It stays in this browser only.</p><label htmlFor="glb-file" className="text-sm">Load a .glb file</label><input id="glb-file" type="file" accept=".glb,model/gltf-binary" className="ml-3 max-w-full text-sm" onChange={e => setFile(e.target.files?.[0] ?? null)} />{file && <button className="btn-ghost mt-3" onClick={() => setFile(null)}>Return to concept model</button>}</Panel>}
  </div>;
}
