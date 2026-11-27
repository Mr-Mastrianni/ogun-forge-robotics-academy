/**
 * Sets the browser-tab title, the meta description and the canonical URL for
 * the current page. The site is a single-page app, so without this every page
 * would share the homepage's title and description.
 */
export const SITE_URL = 'https://kamitron.com';
export const DEFAULT_TITLE = 'KAMITRON | Ancient Roots. Living Intelligence. Future Technology.';
export const DEFAULT_DESCRIPTION =
  'Kamitron is an independent research and engineering studio exploring robotics, biological systems, ancestral knowledge and immersive technology. Home of the Ogun Forge Robotics Academy.';

function tag(selector: string, create: () => HTMLElement) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) { el = create(); document.head.appendChild(el); }
  return el;
}

export function setPageMeta({ title, description, path, noindex = false }: { title?: string; description?: string; path?: string; noindex?: boolean }) {
  if (typeof document === 'undefined') return;
  document.title = title ?? DEFAULT_TITLE;
  const desc = (description ?? DEFAULT_DESCRIPTION).replace(/\s+/g, ' ').trim().slice(0, 300);
  tag('meta[name="description"]', () => Object.assign(document.createElement('meta'), { name: 'description' })).setAttribute('content', desc);
  const canonical = tag('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }));
  canonical.setAttribute('href', SITE_URL + (path ?? window.location.pathname));
  const robots = document.head.querySelector('meta[name="robots"]');
  if (noindex && !robots) document.head.appendChild(Object.assign(document.createElement('meta'), { name: 'robots', content: 'noindex' }));
  if (!noindex && robots) robots.remove();
}
