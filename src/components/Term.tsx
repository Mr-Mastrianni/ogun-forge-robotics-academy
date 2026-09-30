import { useMemo, type ReactNode } from 'react';
import { allKeyTerms } from '@/content';

/**
 * Inline glossary tooltip. Wrap any term and the reader gets its definition
 * on hover or keyboard focus, without leaving the page.
 *
 *   <Term term="Back-EMF" />            // renders the term with a tooltip
 *   <Term term="K_t"><MathTex .../></Term>  // custom rendering, same tooltip
 */

interface TermRecord {
  term: string;
  definition: string;
  week: number;
  lessonTitle: string;
  lessonId: string;
}

const EXACT = new Map<string, TermRecord>();
for (const t of allKeyTerms) {
  const key = t.term.toLowerCase().trim();
  if (!EXACT.has(key)) {
    EXACT.set(key, {
      term: t.term,
      definition: t.definition,
      week: t.week,
      lessonTitle: t.lessonTitle,
      lessonId: t.lessonId,
    });
  }
}

export function lookupTerm(text: string): TermRecord | undefined {
  const q = text.toLowerCase().trim();
  if (!q) return undefined;
  const exact = EXACT.get(q);
  if (exact) return exact;
  if (q.length < 4) return undefined;
  for (const [key, rec] of EXACT) {
    if (key.includes(q) || q.includes(key)) return rec;
  }
  return undefined;
}

export function Term({
  children,
  term,
  className = '',
}: {
  children?: ReactNode;
  term?: string;
  className?: string;
}) {
  const label = term ?? (typeof children === 'string' ? children : '');
  const hit = useMemo(() => lookupTerm(label), [label]);

  if (!hit) return <span className={className}>{children ?? term}</span>;

  return (
    <span className={`term-tip ${className}`} tabIndex={0} aria-label={`${hit.term}: ${hit.definition}`}>
      {children ?? term}
      <span className="term-pop" role="tooltip">
        <strong className="block font-heading text-[13px] text-[#67e8f9]">{hit.term}</strong>
        <span className="mt-1 block">{hit.definition}</span>
        <span className="mt-1.5 block font-mono text-[10px] text-[#8c82a8]">
          Lesson {hit.week} · {hit.lessonTitle}
        </span>
      </span>
    </span>
  );
}
