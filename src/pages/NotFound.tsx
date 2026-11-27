import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageHero } from '@/components/kamitron/KamitronShell';
import { setPageMeta } from '@/lib/pageMeta';

/** Shown for any address the site does not have, instead of silently sending people home. */
export default function NotFound() {
  const { pathname } = useLocation();
  useEffect(() => {
    setPageMeta({ title: 'Page not found · Kamitron', description: 'This page does not exist on kamitron.com.', path: pathname, noindex: true });
  }, [pathname]);
  return (
    <PageHero glyph="orbit" kicker="Page not found" title="This page is not on the map."
      lead={`There is nothing at ${pathname}. It may have moved, or the link may have a typo.`}>
      <Link className="sg-cta" to="/">Go to the homepage</Link>
      <Link className="sg-secondary" to="/academy">Open the academy</Link>
    </PageHero>
  );
}
