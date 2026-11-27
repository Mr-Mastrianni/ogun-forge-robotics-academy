import { Suspense, useEffect, useState, type ReactNode } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useUi } from '@/lib/uiStore';
import { Glyph, type GlyphKind } from '@/components/kamitron/Glyphs';
import '@/styles/solar-genesis.css';
import '@/styles/solar-genesis-living.css';
import '@/styles/kamitron.css';

/** Shared frame for the homepage and every Kamitron studio page. */

const NAV = [
  { to: '/#divisions', label: 'Research' },
  { to: '/academy', label: 'Academy' },
  { to: '/vault', label: 'Vault' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const FOOTER = [
  { heading: 'Explore', links: [['/#divisions', 'Research divisions'], ['/kamitron', 'Living labs'], ['/vault', 'Specimen Vault'], ['/academy', 'Ogun Forge Academy']] },
  { heading: 'Studio', links: [['/services', 'Services'], ['/community', 'The Hive'], ['/about', 'About'], ['/contact', 'Contact']] },
] as const;

const ACADEMY_PREFIXES = ['/academy', '/course', '/lesson', '/labs', '/quiz', '/boss', '/flashcards', '/charts', '/tables',
  '/ideas', '/atlas', '/achievements', '/progress', '/glossary', '/beyond', '/manufacturing', '/mycelium'];
const isAcademyPath = (p: string) => ACADEMY_PREFIXES.some(a => p === a || p.startsWith(a + '/'));

/** Scroll to the hash target once the (possibly lazy) page has rendered it. */
function useRouteScroll() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return; }
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    let raf = 0;
    const seek = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ block: 'start' });
      else if (tries++ < 30) raf = requestAnimationFrame(seek);
    };
    raf = requestAnimationFrame(seek);
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);
}

/** The site-wide header: Kamitron brand, primary navigation and the motion switch. */
export function SiteHeader() {
  const motion = useUi(s => s.motion);
  const toggleMotion = useUi(s => s.toggleMotion);
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  useEffect(() => { setMenu(false); }, [location.pathname, location.hash]);
  const academy = isAcademyPath(location.pathname);
  return (
    <header className="sg-header">
      <Link to="/" className="sg-brand" aria-label="Kamitron home"><span className="sg-brand-mark"><Glyph kind="sun" lit /></span>KAMITRON</Link>
      <button className="sg-menu" type="button" aria-expanded={menu} aria-controls="sg-nav" onClick={() => setMenu(!menu)}>{menu ? 'Close' : 'Menu'}</button>
      <nav id="sg-nav" className={menu ? 'sg-nav sg-nav-open' : 'sg-nav'} aria-label="Primary">
        {NAV.map(n => {
          const current = n.to === '/academy' ? academy : location.pathname === n.to;
          return <Link key={n.to} to={n.to} className={current ? 'is-current' : undefined} aria-current={current ? 'page' : undefined}>{n.label}</Link>;
        })}
      </nav>
      <button type="button" className="sg-motion" onClick={toggleMotion} aria-pressed={!motion}>{motion ? 'Pause motion' : 'Resume motion'}</button>
    </header>
  );
}

/** The site-wide footer. */
export function SiteFooter() {
  return (
    <footer className="kf">
      <div className="kf-brand">
        <Link to="/" className="sg-brand"><span className="sg-brand-mark"><Glyph kind="sun" lit /></span>KAMITRON</Link>
        <p>An independent research and engineering studio. Ancient roots, living intelligence, future technology.</p>
      </div>
      {FOOTER.map(col => (
        <nav key={col.heading} className="kf-col" aria-label={col.heading}>
          <h2>{col.heading}</h2>
          {col.links.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
        </nav>
      ))}
      <div className="kf-col">
        <h2>Sister company</h2>
        <a href="https://caake.org" target="_blank" rel="noopener">CAAKE</a>
        <p>Healthcare and enterprise technology, AI consulting and automation.</p>
      </div>
      <p className="kf-base">© {new Date().getFullYear()} Kamitron · <a href="mailto:hello@kamitron.com">hello@kamitron.com</a> · <Link to="/privacy">Privacy policy</Link></p>
    </footer>
  );
}

export default function KamitronShell() {
  const motion = useUi(s => s.motion);
  useRouteScroll();
  return (
    <div className="sg" data-sg-motion={motion ? 'on' : 'off'}>
      <a className="sg-skip" href="#sg-main">Skip to content</a>
      <SiteHeader />
      <main id="sg-main">
        <Suspense fallback={<div className="kp-loading" role="status">Loading…</div>}>
          <Outlet />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}

/** Opening band for every studio page: copy on the left, the page's glyph drawn on the right. */
export function PageHero({ glyph, kicker, title, lead, children }: { glyph: GlyphKind; kicker: string; title: string; lead: string; children?: ReactNode }) {
  return (
    <section className="kp-hero">
      <div className="kp-hero-copy">
        <p className="sg-kicker"><span /> {kicker}</p>
        <h1>{title}</h1>
        <p className="kp-lead">{lead}</p>
        {children && <div className="sg-actions">{children}</div>}
      </div>
      <div className="kp-hero-glyph" aria-hidden="true"><Glyph kind={glyph} lit /></div>
    </section>
  );
}
