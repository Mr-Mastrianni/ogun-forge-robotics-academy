/**
 * Writes dist/sitemap.xml from the real route list, so new lessons, labs and
 * blueprints appear in it automatically. Runs after `vite build` (see package.json).
 */
import { writeFileSync } from 'node:fs';
import { lessons, allProjects, bossQuizzes } from '@/content';
import { manufacturingModules } from '@/content/manufacturing';
import { LABS } from '@/components/labs';

const SITE = 'https://kamitron.com';
const studio = ['/', '/kamitron', '/vault', '/services', '/about', '/community', '/contact', '/privacy'];
const academy = ['/academy', '/course', '/labs', '/mycelium', '/manufacturing', '/manufacturing/learn', '/quiz', '/flashcards',
  '/progress', '/charts', '/tables', '/atlas', '/ideas', '/glossary', '/achievements', '/beyond'];
const paths = [
  ...studio, ...academy,
  ...lessons.map((l) => `/lesson/${l.id}`),
  ...lessons.map((l) => `/quiz/${l.id}`),
  ...bossQuizzes.map((b) => `/boss/${b.week}`),
  ...LABS.map((l) => `/labs/${l.id}`),
  ...allProjects.map((p) => `/ideas/${p.id}`),
  ...manufacturingModules.map((m) => `/manufacturing/learn/${m.id}`),
];
const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Set(paths)]
  .map((p) => `  <url><loc>${SITE}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`;
writeFileSync('dist/sitemap.xml', xml);
console.log(`sitemap.xml: ${new Set(paths).size} pages`);
