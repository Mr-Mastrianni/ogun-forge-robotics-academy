import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { KAMITRON_LABS, KAMITRON_PAGES, SPECIMENS, TIERS, BUILD_XP, RANK_XP } from '@/content/kamitron';
import { useProgress } from '@/lib/store';
import { PageHero } from '@/components/kamitron/KamitronShell';
const SpecimenViewer = lazy(() => import('@/components/kamitron/SpecimenViewer'));

const HERO = KAMITRON_PAGES.find(p => p.key === 'vault')!;
const TIER_TOOLS = ['Household items, all ages', 'Basic hand tools', 'Soldering and microcontrollers', '3D printing, power tools', 'Lead community projects'];
const PLANS = [
  ['Visitor', 'Free', 'All seven Spore builds and the full Vault preview.'],
  ['Grower', 'Coming soon', 'Sprout and Root builds, XP, badges and the community.'],
  ['Builder', 'Coming soon', 'Canopy builds, live build calls and Guild quests.'],
  ['Elder cohort', 'Coming soon', 'Capstones, mentorship and a path to co-teaching.'],
] as const;

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
  useEffect(() => { document.title = 'Specimen Vault · Kamitron'; }, []);
  const rank = RANK_XP.reduce((r, threshold, i) => xp >= threshold ? i : r, 0);
  const isSaved = saved.includes(`kamitron:${selected.id}`);

  return <>
    <PageHero glyph={HERO.glyph} kicker={HERO.kicker} title={HERO.heading} lead={HERO.lead}>
      <a className="sg-cta" href="#viewer">Explore a specimen</a>
      <a className="sg-secondary" href="#join">See membership levels</a>
    </PageHero>

    <div className="kp">
      <section className="kp-sec kv-stats" aria-label="Vault at a glance">
        <dl className="kv-stat-row">
          <div><dt>Specimens</dt><dd>35</dd></div>
          <div><dt>Living labs</dt><dd>7</dd></div>
          <div><dt>Your Forge XP</dt><dd>{xp.toLocaleString()}</dd></div>
          <div><dt>Academy rank</dt><dd>{TIERS[rank]}</dd></div>
        </dl>
      </section>

      {preview && <p className="kp-sec kp-note">Studio preview: all 35 concepts are viewable. This switch does not grant membership or change your progress.</p>}

      <section className="kp-sec kv-main" id="viewer">
        <div className="kv-viewer">
          <Suspense fallback={<div className="kv-wait">Loading the specimen…</div>}><SpecimenViewer specimen={selected} file={file} /></Suspense>
        </div>
        <aside className="kp-card kv-detail">
          <span className="kp-pill soon">{selected.lab.name} · tier {selected.tier + 1}</span>
          <h2 className="kv-name">{selected.name}</h2>
          <div className="kp-chips"><span className="kp-chip">{TIERS[selected.tier]}</span><span className="kp-chip">Concept preview</span></div>
          <dl className="kv-learn">
            <div><dt>You build</dt><dd>{selected.project}</dd></div>
            <div><dt>You learn</dt><dd>{selected.learn}</dd></div>
          </dl>
          <p>Planned build reward: <strong>{BUILD_XP[selected.tier].toLocaleString()} XP</strong>. Build submissions and membership open at Academy launch.</p>
          <p className="kp-note">{selected.tier === 0 ? 'Spore builds stay free for everyone.' : `Planned learning level: ${TIERS[selected.tier]}. All concept models are available to explore.`}</p>
          <div className="kp-actions">
            <button type="button" className="sg-cta" aria-pressed={isSaved} onClick={() => toggleProject(`kamitron:${selected.id}`)}>{isSaved ? 'Saved to your Forge' : 'Save this build'}</button>
            <Link className="sg-secondary" to="/manufacturing">Plan it in Manufacturing Forge</Link>
          </div>
        </aside>
      </section>

      <section className="kp-sec">
        <div className="kp-head"><h2>Seven labs. Pick a specimen.</h2><p>{lab.line}</p></div>
        <div className="kv-filters" role="group" aria-label="Filter by lab">
          {KAMITRON_LABS.map(l => <button key={l.id} type="button" className="kv-filter" aria-pressed={lab.id === l.id} onClick={() => setParams({ lab: l.id, specimen: `${l.id}-0` })}>{l.name}</button>)}
        </div>
        <div className="kp-grid g3">
          {SPECIMENS.filter(s => s.lab.id === lab.id).map(s => (
            <button key={s.id} type="button" className="kp-card kv-pick" aria-pressed={selected.id === s.id}
              onClick={() => { setFile(null); setParams({ lab: s.lab.id, specimen: s.id }); document.getElementById('viewer')?.scrollIntoView({ behavior: 'smooth' }); }}>
              <span className="kv-tier">Tier {s.tier + 1} · {TIERS[s.tier]}</span>
              <h3>{s.name}</h3>
              <p>{s.project}</p>
              <span className="kv-xp">{BUILD_XP[s.tier].toLocaleString()} XP · {s.tier === 0 ? 'Free at launch' : 'Academy preview'}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="kp-sec">
        <div className="kp-head"><h2>Five ranks, from Spore to Elder</h2><p>Your current Academy rank uses your existing Forge XP. Build rewards are planned for launch.</p></div>
        <ol className="kp-timeline">
          {TIERS.map((tier, i) => <li key={tier} className={rank === i ? 'is-now' : undefined}>
            <span className="kp-year">{tier}</span>
            <h3>{RANK_XP[i].toLocaleString()} XP</h3>
            <p>{TIER_TOOLS[i]}</p>
            <p className="kp-note">{BUILD_XP[i].toLocaleString()} XP per build at launch</p>
          </li>)}
        </ol>
      </section>

      <section className="kp-sec" id="join">
        <div className="kp-head"><h2>Start free. Grow at your pace.</h2><p>Paid levels open when the Academy launches. Spore builds stay free.</p></div>
        <div className="kp-grid g4">
          {PLANS.map(([name, price, detail]) => <article key={name} className="kp-card">
            <span className={`kp-pill ${price === 'Free' ? 'ok' : 'soon'}`}>{price}</span>
            <h3>{name}</h3>
            <p>{detail}</p>
          </article>)}
        </div>
        <div className="kp-actions"><Link className="sg-cta" to="/kamitron#join">Join the Hive waitlist</Link></div>
      </section>

      {preview && <section className="kp-sec">
        <div className="kp-callout">
          <h2>Studio model tool</h2>
          <p>Test a self-contained Meshy .glb export. It stays in this browser only.</p>
          <div className="kp-field"><label htmlFor="glb-file">Load a .glb file</label><input id="glb-file" type="file" accept=".glb,model/gltf-binary" onChange={e => setFile(e.target.files?.[0] ?? null)} /></div>
          {file && <div className="kp-actions"><button type="button" className="sg-secondary" onClick={() => setFile(null)}>Return to concept model</button></div>}
        </div>
      </section>}
    </div>
  </>;
}
