import { allKeyTerms, allProjects, bossQuizzes, heritageEntries, lessons, referenceTables } from '@/content';
import { LABS } from '@/components/labs';

export type HitKind = 'lesson' | 'lab' | 'project' | 'table' | 'term' | 'atlas' | 'boss' | 'page';

export interface SearchHit {
  id: string;
  kind: HitKind;
  title: string;
  subtitle: string;
  to: string;
  glyph: string;
  /** extra text matched but never displayed */
  keywords: string;
}

export const KIND_META: Record<HitKind, { label: string; glyph: string; color: string }> = {
  page: { label: 'Page', glyph: '◎', color: '#c9bde6' },
  lesson: { label: 'Lesson', glyph: '⌘', color: '#f5b301' },
  lab: { label: 'Lab', glyph: '⚙', color: '#67e8f9' },
  project: { label: 'Blueprint', glyph: '🍄', color: '#6ee7a8' },
  table: { label: 'Table', glyph: '▦', color: '#f5b301' },
  term: { label: 'Term', glyph: '✎', color: '#c026d3' },
  atlas: { label: 'Heritage', glyph: '✵', color: '#8b5cf6' },
  boss: { label: 'Boss trial', glyph: '⚔', color: '#ff6b1a' },
};

export const PAGES: SearchHit[] = [
  { id: 'p-home', kind: 'page', title: 'Home', subtitle: 'Start here — the 4-step path', to: '/', glyph: '◉', keywords: 'start overview intro beginning' },
  { id: 'p-course', kind: 'page', title: 'Course roadmap', subtitle: 'All 16 lessons across 8 weeks', to: '/course', glyph: '⌘', keywords: 'syllabus curriculum weeks roadmap all lessons' },
  { id: 'p-labs', kind: 'page', title: '3D Labs', subtitle: 'Ten interactive simulators', to: '/labs', glyph: '⚙', keywords: 'interactive simulation three dimensional practice' },
  { id: 'p-myco', kind: 'page', title: 'Mycelium Tech hub', subtitle: 'Living machines, protocols and blueprints', to: '/mycelium', glyph: '🍄', keywords: 'fungal mushroom living material biohybrid mycelium hub' },
  { id: 'p-quiz', kind: 'page', title: 'Quiz Arena', subtitle: 'Lesson quizzes, mixed and weak-spot drills', to: '/quiz', glyph: '⚔', keywords: 'test exam questions practice drill' },
  { id: 'p-flash', kind: 'page', title: 'Flashcards', subtitle: 'Spaced repetition with 155 cards', to: '/flashcards', glyph: '✦', keywords: 'srs memory cards revision study' },
  { id: 'p-gloss', kind: 'page', title: 'Glossary', subtitle: 'Every key term, explained', to: '/glossary', glyph: '✎', keywords: 'definitions dictionary terms words jargon' },
  { id: 'p-charts', kind: 'page', title: 'Charts', subtitle: 'Your progress and every concept graph', to: '/charts', glyph: '∿', keywords: 'graphs data analytics progress mastery' },
  { id: 'p-tables', kind: 'page', title: 'Reference tables', subtitle: 'Sensors, actuators, power, mycelium and more', to: '/tables', glyph: '▦', keywords: 'comparison data specification reference' },
  { id: 'p-atlas', kind: 'page', title: 'Heritage Atlas', subtitle: 'Afro-technical lineage and design palettes', to: '/atlas', glyph: '✵', keywords: 'history africa kemet nok adinkra palettes colours' },
  { id: 'p-ideas', kind: 'page', title: 'Idea Lab', subtitle: '80+ buildable blueprints', to: '/ideas', glyph: '🍄', keywords: 'projects diy build blueprint ideas' },
  { id: 'p-progress', kind: 'page', title: 'Progress', subtitle: 'What to do next, weakest areas', to: '/progress', glyph: '📈', keywords: 'stats next steps streak mastery' },
  { id: 'p-trophy', kind: 'page', title: 'Trophies', subtitle: 'Adinkra badges and the rank ladder', to: '/achievements', glyph: '🏆', keywords: 'badges achievements ranks xp rewards' },
  { id: 'p-next', kind: 'page', title: 'What next', subtitle: 'Fifteen upgrades for this course', to: '/beyond', glyph: '🚀', keywords: 'roadmap future improvements brainstorm' },
];

export const SEARCH_INDEX: SearchHit[] = [
  ...PAGES,
  ...lessons.map<SearchHit>((l) => ({
    id: `l-${l.id}`,
    kind: 'lesson',
    title: `L${l.number} · ${l.title}`,
    subtitle: `Week ${l.week} · ${l.track} · ${l.duration} min`,
    to: `/lesson/${l.id}`,
    glyph: '⌘',
    keywords: `${l.subtitle} ${l.hook} ${l.objectives.join(' ')} ${l.keyTerms.map((k) => k.term).join(' ')} week${l.week} ${l.track} ${l.difficulty}`,
  })),
  ...LABS.map<SearchHit>((l) => ({
    id: `lab-${l.id}`,
    kind: 'lab',
    title: l.name,
    subtitle: `${l.track} · interactive ${l.threeD ? '3D' : '2D'} lab`,
    to: `/labs/${l.id}`,
    glyph: l.glyph,
    keywords: `${l.blurb} ${l.tasks.join(' ')} ${l.track} lab simulator`,
  })),
  ...allProjects.map<SearchHit>((p) => ({
    id: `pr-${p.id}`,
    kind: 'project',
    title: p.title,
    subtitle: `${p.category} · ${p.difficulty} · ${p.buildTime}`,
    to: `/ideas/${p.id}`,
    glyph: '🍄',
    keywords: `${p.tagline} ${p.summary} ${p.science} ${p.category} ${p.billOfMaterials.map((b) => b.item).join(' ')}`,
  })),
  ...referenceTables.map<SearchHit>((t) => ({
    id: `tb-${t.id}`,
    kind: 'table',
    title: t.title,
    subtitle: `${t.category} · ${t.rows.length} rows`,
    to: `/tables?t=${t.id}`,
    glyph: '▦',
    keywords: `${t.intro} ${t.insight} ${t.columns.join(' ')}`,
  })),
  ...heritageEntries.map<SearchHit>((h) => ({
    id: `at-${h.id}`,
    kind: 'atlas',
    title: h.title,
    subtitle: `${h.culture} · ${h.era}`,
    to: `/atlas?e=${h.id}`,
    glyph: h.glyph,
    keywords: `${h.hook} ${h.detail} ${h.engineeringLesson} ${h.tags.join(' ')}`,
  })),
  ...bossQuizzes.map<SearchHit>((b) => ({
    id: `boss-${b.id}`,
    kind: 'boss',
    title: `Week ${b.week} · ${b.title}`,
    subtitle: `${b.questions.length} questions · ${b.xp} XP`,
    to: `/boss/${b.week}`,
    glyph: '⚔',
    keywords: `boss trial week${b.week} exam ${b.subtitle}`,
  })),
  ...allKeyTerms.map<SearchHit>((t) => ({
    id: `tm-${t.lessonId}-${t.term}`,
    kind: 'term',
    title: t.term,
    subtitle: `L${t.week} · ${t.lessonTitle}`,
    to: `/lesson/${t.lessonId}`,
    glyph: '✎',
    keywords: t.definition,
  })),
];

/** Cheap but good-enough ranking: exact, prefix, word-start, then substring. */
export function searchAll(query: string, limit = 26): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return PAGES.slice(0, 8);
  const terms = q.split(/\s+/);
  const scored: { hit: SearchHit; score: number }[] = [];

  for (const hit of SEARCH_INDEX) {
    const title = hit.title.toLowerCase();
    const sub = hit.subtitle.toLowerCase();
    const kw = hit.keywords.toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (title === term) score += 120;
      else if (title.startsWith(term)) score += 70;
      else if (new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(title)) score += 45;
      else if (title.includes(term)) score += 26;
      if (hit.kind === 'page') score += 8;
      if (sub.includes(term)) score += 10;
      if (kw.includes(term)) score += 6;
      if (score === 0) {
        score = -1;
        break;
      }
    }
    if (score > 0) scored.push({ hit, score });
  }
  return scored
    .sort((a, b) => b.score - a.score || a.hit.title.localeCompare(b.hit.title))
    .slice(0, limit)
    .map((x) => x.hit);
}
