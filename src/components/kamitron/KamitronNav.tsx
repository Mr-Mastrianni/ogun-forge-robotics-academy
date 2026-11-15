import { Link } from 'react-router-dom';
import { KAMITRON_PAGES } from '@/content/kamitron';
export function KamitronNav() {
  return <nav aria-label="Kamitron departments" className="mb-6 flex flex-wrap gap-2">{KAMITRON_PAGES.map(p => <Link key={p.path} className="btn-ghost text-xs" to={p.path}>{p.title}</Link>)}</nav>;
}

