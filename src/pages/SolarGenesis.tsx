import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUi } from '@/lib/uiStore';
import SolarCore from '@/components/kamitron/SolarCore';
import LiquidWordmark from '@/components/kamitron/LiquidWordmark';
import { Glyph, GlyphFrieze, type GlyphKind } from '@/components/kamitron/Glyphs';
import '@fontsource/unbounded/latin-800.css';
import '@/styles/solar-genesis.css';
import '@/styles/solar-genesis-living.css';

const divisions = [
  { n:'01', name:'The Forge of Ogun', type:'Robotics & physical engineering', text:'Study motion, control, sensors and fabrication. Take an idea from the engineering bench to the manufacturing workspace.', path:'/academy', glyph:'forge', action:'Enter the academy', color:'#ffc36e' },
  { n:'02', name:'Mycelial Intelligence', type:'Living materials & mycotechnology', text:'Explore fungal networks, substrate science, living materials and simulated biological circuits.', path:'/mycelium', glyph:'mycelium', action:'Explore living systems', color:'#a6eb9b' },
  { n:'03', name:'Ancestral Intelligence', type:'Knowledge systems & cultural computing', text:'Trace engineering heritage, African knowledge systems and traditional cosmologies. Distinguish historical evidence, tradition and speculation.', path:'/atlas', glyph:'memory', action:'Open the heritage atlas', color:'#f4c983' },
  { n:'04', name:'Spatial Laboratory', type:'Simulation & immersive technology', text:'Experiment with interactive models of kinematics, perception, locomotion and other engineering principles.', path:'/labs', glyph:'orbit', action:'Enter the simulations', color:'#81dcd4' },
  { n:'05', name:'Biosystems', type:'Biomimicry & experimental science', text:'Investigate nature-inspired design, ecological materials and energy systems through a library of clearly labeled concepts.', path:'/vault', glyph:'life', action:'Explore the specimen vault', color:'#b8da8a' },
  { n:'06', name:'Kamitron Studios', type:'Creative technology & storytelling', text:'Enter Inner Kingdom, a speculative story-world where the human body and the living Earth become mirrored cities.', path:'/kamitron#series', glyph:'eye', action:'Discover Inner Kingdom', color:'#e4a9ea' },
] as const satisfies readonly { glyph: GlyphKind; [key: string]: unknown }[];

function SolarIllustration() {
  const rings=Array.from({length:36},(_,i)=>i);
  const filaments=Array.from({length:28},(_,i)=>{
    const a=i*Math.PI*2/28, end=290+(i%4)*23, mid=190+(i%3)*19;
    const point=(r:number,t:number)=>[480+Math.cos(a+t)*r,375+Math.sin(a+t)*r];
    const [x,y]=point(136,0),[mx,my]=point(mid,.15),[ex,ey]=point(end,-.08),[bx,by]=point(end+24,.13);
    return {d:'M'+x+','+y+' Q'+mx+','+my+' '+ex+','+ey, branch:'M'+mx+','+my+' Q'+ex+','+ey+' '+bx+','+by,x:ex,y:ey};
  });
  return <svg className="sg-sun-art" viewBox="0 0 960 760" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id="sg-aura"><stop stopColor="#fff4c2" stopOpacity=".9"/><stop offset=".30" stopColor="#ffb337" stopOpacity=".7"/><stop offset=".58" stopColor="#d26019" stopOpacity=".18"/><stop offset="1" stopColor="#0a1816" stopOpacity="0"/></radialGradient>
      <radialGradient id="sg-star" cx=".38" cy=".34"><stop stopColor="#fff8cc"/><stop offset=".5" stopColor="#ffcc62"/><stop offset=".85" stopColor="#d57524"/><stop offset="1" stopColor="#733719"/></radialGradient>
      <linearGradient id="sg-metal" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f7cf8f"/><stop offset=".4" stopColor="#8d5d2f"/><stop offset=".75" stopColor="#213a2e"/><stop offset="1" stopColor="#060d0c"/></linearGradient>
      <linearGradient id="sg-wire"><stop stopColor="#ffcf75"/><stop offset=".55" stopColor="#6f9464"/><stop offset="1" stopColor="#67d6b3" stopOpacity=".15"/></linearGradient>
      <clipPath id="sg-disc"><circle cx="480" cy="375" r="135"/></clipPath>
      <filter id="sg-bloom"><feGaussianBlur stdDeviation="5"/></filter>
    </defs>
    <circle cx="480" cy="375" r="363" fill="url(#sg-aura)" className="sg-aura"/>
    <g fill="none" stroke="#b88d57" opacity=".43">
      {[180,205,239,278,312].map(r=><circle key={r} cx="480" cy="375" r={r} strokeWidth=".75" strokeDasharray={r%2?'2 9':'40 8 2 8'}/>)}
      <path d="M480 45V705M150 375H810M246 141L714 609M246 609L714 141" strokeDasharray="3 11"/>
    </g>
    <g className="sg-orbit" stroke="#eac47e" fill="none">
      {rings.map(i=><path key={i} d="M480 79v10m-6 -5h12" transform={'rotate('+i*10+' 480 375)'} opacity={i%3===0?.85:.27}/>)}
      <circle cx="480" cy="375" r="322" strokeDasharray="100 65 4 40" opacity=".4"/>
      <path d="M480 52L499 79 480 106 461 79Z M480 644L499 671 480 698 461 671Z" fill="#15231c"/>
    </g>
    <g fill="none" stroke="url(#sg-wire)" strokeWidth="1.4">
      {filaments.map((f,i)=><g key={i}><path d={f.d} className="sg-filament" style={{animationDelay:(i%8)*.22+'s'}}/><path d={f.branch} opacity=".4"/><circle cx={f.x} cy={f.y} r={i%3===0?3:1.5} fill="#b6edbb" stroke="none"/></g>)}
    </g>
    <circle cx="480" cy="375" r="141" stroke="#ffc66b" strokeWidth="6" opacity=".48" filter="url(#sg-bloom)"/>
    <circle cx="480" cy="375" r="135" fill="url(#sg-star)" stroke="#ffe1a1" strokeWidth="1.5"/>
    <g clipPath="url(#sg-disc)" fill="none" className="sg-plasma">
      {Array.from({length:16},(_,i)=><path key={i} d={'M280 '+(265+i*15)+' Q390 '+(210+i*20)+' 480 '+(285+i*12)+' T680 '+(260+i*19)} stroke={i%3===0?'#fff3bb':'#b95d24'} opacity={i%3===0?.58:.27} strokeWidth={i%3===0?2:1}/>)}
      <circle cx="480" cy="375" r="98" stroke="#fff4bd" opacity=".6" strokeWidth="1"/>
    </g>
    <g fill="url(#sg-metal)" stroke="#d4aa67" strokeWidth=".8">
      <path d="M48 678L199 510 347 678Z"/><path d="M199 510L199 678H347Z" fill="#121e18"/><path d="M657 678L776 528 925 678Z"/><path d="M776 528V678H925Z" fill="#0f1c16"/>
      <path d="M308 700L480 557 652 700Z"/><path d="M480 557V700H652Z" fill="#12261e"/>
    </g>
    <g stroke="#c9a46d" fill="none" opacity=".65"><path d="M65 684H905M100 698H860M162 711H798"/><path d="M165 550L199 586 233 550M742 569L776 601 811 569M440 600L480 637 520 600"/></g>
    <g stroke="#9ad6ab" fill="none" strokeWidth="1" opacity=".66">
      <path d="M80 235H140L168 207H230M880 235H820L792 207H730M80 495H132L159 522H210M880 495H828L801 522H750"/>
      {[80,880].map(x=><g key={x}><rect x={x-9} y="226" width="18" height="18"/><circle cx={x} cy="235" r="4"/><path d={'M'+x+' 255v27m-12 -12h24m-24 14h24'}/></g>)}
    </g>
  </svg>;
}

export default function SolarGenesis() {
  const motion = useUi(s=>s.motion);
  const toggleMotion=useUi(s=>s.toggleMotion);
  const [menu,setMenu]=useState(false);
  useEffect(()=>{
    const previous=document.title;
    document.title='KAMITRON | Ancient Roots. Living Intelligence. Future Technology.';
    if (!window.location.hash) window.scrollTo(0,0);
    return ()=>{document.title=previous;};
  },[]);
  return <div className="sg" data-sg-motion={motion?'on':'off'}>
    <a className="sg-skip" href="#sg-main">Skip to content</a>
    <header className="sg-header">
      <Link to="/" className="sg-brand" aria-label="Kamitron home"><span className="sg-brand-mark"><Glyph kind="sun" lit/></span>KAMITRON</Link>
      <button className="sg-menu" type="button" aria-expanded={menu} aria-controls="sg-nav" onClick={()=>setMenu(!menu)}>{menu?'Close':'Menu'}</button>
      <nav id="sg-nav" className={menu?'sg-nav sg-nav-open':'sg-nav'} aria-label="Primary">
        <a href="#divisions" onClick={()=>setMenu(false)}>Research</a><Link to="/academy">Academy</Link><Link to="/vault">Vault</Link><Link to="/about">About</Link><Link to="/contact">Collaborate</Link>
      </nav>
      <button type="button" className="sg-motion" onClick={toggleMotion} aria-pressed={!motion}>{motion?'Pause motion':'Resume motion'}</button>
    </header>
    <main id="sg-main">
      <section className="sg-hero" aria-labelledby="sg-title">
        <div className="sg-grid" aria-hidden="true"/>
        <SolarCore className="sg-solar" animate={motion} fallback={<div className="sg-hero-art"><SolarIllustration/></div>}/>
        <div className="sg-hero-copy">
          <p className="sg-kicker"><span/> Independent research & engineering studio</p>
          <LiquidWordmark animate={motion}/>
          <p className="sg-manifesto">Ancient roots.<br/>Living intelligence.<br/><em>Future technology.</em></p>
          <p className="sg-description">We explore the meeting point of robotics, biological systems, ancestral knowledge and digital worlds. From the forge to the forest, from the circuit to the cosmos.</p>
          <div className="sg-actions"><a href="#divisions" className="sg-cta">Explore the laboratory <span aria-hidden="true">↘</span></a><Link to="/academy" className="sg-secondary">Enter Ogun Forge <span aria-hidden="true">↗</span></Link></div>
        </div>
        <div className="sg-coordinate" aria-hidden="true"><span>FIG. 01 / SOLAR GENESIS</span><span>IRON · MYCELIUM · LIGHT</span></div>
      </section>
      <section className="sg-codex" aria-labelledby="sg-codex-title">
        <div className="sg-codex-head"><h2 id="sg-codex-title">A written language for the lab</h2><p>Each Kamitron glyph pairs an ancient form with a modern circuit, and marks one field of research.</p></div>
        <GlyphFrieze/>
      </section>
      <section id="divisions" className="sg-section">
        <div className="sg-section-intro"><p className="sg-kicker">The research constellation</p><h2>Six paths.<br/><em>One living intelligence.</em></h2><p>Explore the working educational tools and creative experiments already inside the platform. Our wider research directions are invitations to investigate, not claims of completed scientific breakthroughs.</p></div>
        <div className="sg-divisions">{divisions.map(d=><Link to={d.path} className="sg-division" key={d.n}>
          <div className="sg-division-top"><span>{d.n} / RESEARCH</span><span aria-hidden="true">↗</span></div><div className="sg-glyph" style={{color:d.color}}><Glyph kind={d.glyph}/></div><p className="sg-domain">{d.type}</p><h3>{d.name}</h3><p>{d.text}</p><span className="sg-card-action">{d.action} <span aria-hidden="true">→</span></span>
        </Link>)}</div>
      </section>
      <section className="sg-feature">
        <div className="sg-feature-visual"><Glyph kind="forge"/><span>The forge</span></div>
        <div><p className="sg-kicker">Flagship learning platform</p><h2>Iron remembers.<br/><em>Engineering evolves.</em></h2><p>Ogun Forge Robotics Academy brings theory to life through lessons, quizzes, mathematical simulations and a hands-on blueprint library. Learn, experiment, and carry your designs into the manufacturing workspace.</p><div className="sg-actions"><Link className="sg-cta" to="/course">Explore the curriculum ↗</Link><Link className="sg-secondary" to="/manufacturing">Manufacturing Forge</Link></div></div>
      </section>
      <section className="sg-section sg-method"><p className="sg-kicker">Our research standard</p><h2>Wonder without confusion.</h2><ul className="sg-principles"><li>Learn from nature</li><li>Build with evidence</li><li>Imagine responsibly</li></ul><p>Established science, engineering simulations, experimental concepts, traditional knowledge and speculative storytelling belong in conversation. They do not belong under the same evidence label.</p><Link className="sg-secondary" to="/atlas">Explore the knowledge atlas ↗</Link></section>
      <section className="sg-section sg-invite"><p className="sg-kicker">Build with us</p><h2>The next horizon<br/><em>is a collective work.</em></h2><div className="sg-actions"><Link className="sg-cta" to="/contact">Start a collaboration ↗</Link><Link className="sg-secondary" to="/community">Join the Hive</Link></div></section>
    </main>
    <footer className="sg-footer"><Link to="/" className="sg-brand">KAMITRON</Link><span>Nature · intelligence · technology</span><Link to="/services">Services</Link><Link to="/contact">Contact</Link><Link to="/kamitron">Original factory</Link></footer>
  </div>;
}
