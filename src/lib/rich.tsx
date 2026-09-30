import katex from 'katex';
import { useMemo, type ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/* KaTeX                                                               */
/* ------------------------------------------------------------------ */

export function Math({ tex, block = false }: { tex: string; block?: boolean }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, {
        displayMode: block,
        throwOnError: false,
        strict: false,
        output: 'html',
      });
    } catch {
      return tex;
    }
  }, [tex, block]);
  if (block) return <div className="formula-block" dangerouslySetInnerHTML={{ __html: html }} />;
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

/* ------------------------------------------------------------------ */
/* Inline markdown: **bold** *italic* `code` [text](url) $math$        */
/* ------------------------------------------------------------------ */

type Token =
  | { t: 'text'; v: string }
  | { t: 'bold'; v: string }
  | { t: 'italic'; v: string }
  | { t: 'code'; v: string }
  | { t: 'link'; v: string; href: string }
  | { t: 'math'; v: string }
  | { t: 'break' };

const PATTERN =
  /(\*\*[^*]+\*\*)|(\*[^*\n]+\*)|(`[^`]+`)|(\[[^\]]+\]\([^)]+\))|(\$[^$\n]+\$)|(\n)/g;

export function parseInline(src: string): Token[] {
  const out: Token[] = [];
  let last = 0;
  for (const m of src.matchAll(PATTERN)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ t: 'text', v: src.slice(last, i) });
    const tok = m[0];
    if (tok.startsWith('**')) out.push({ t: 'bold', v: tok.slice(2, -2) });
    else if (tok.startsWith('`')) out.push({ t: 'code', v: tok.slice(1, -1) });
    else if (tok.startsWith('$')) out.push({ t: 'math', v: tok.slice(1, -1) });
    else if (tok.startsWith('[')) {
      const mm = /\[([^\]]+)\]\(([^)]+)\)/.exec(tok);
      if (mm) out.push({ t: 'link', v: mm[1], href: mm[2] });
    } else if (tok === '\n') out.push({ t: 'break' });
    else if (tok.startsWith('*')) out.push({ t: 'italic', v: tok.slice(1, -1) });
    last = i + tok.length;
  }
  if (last < src.length) out.push({ t: 'text', v: src.slice(last) });
  return out;
}

export function Inline({ text }: { text: string }) {
  const tokens = useMemo(() => parseInline(text), [text]);
  return (
    <>
      {tokens.map((tk, i) => {
        switch (tk.t) {
          case 'bold':
            return <strong key={i}>{tk.v}</strong>;
          case 'italic':
            return <em key={i}>{tk.v}</em>;
          case 'code':
            return <code key={i}>{tk.v}</code>;
          case 'math':
            return <Math key={i} tex={tk.v} />;
          case 'link':
            return (
              <a key={i} href={tk.href} target="_blank" rel="noreferrer noopener">
                {tk.v}
              </a>
            );
          case 'break':
            return <br key={i} />;
          default:
            return <span key={i}>{tk.v}</span>;
        }
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Block-level markdown-lite: paragraphs + "- " bullet lists           */
/* ------------------------------------------------------------------ */

export function RichText({ body }: { body: string }): ReactNode {
  const chunks = body.split(/\n{2,}/);
  return (
    <>
      {chunks.map((chunk, ci) => {
        const lines = chunk.split('\n').filter((l) => l.trim().length);
        const isList = lines.every((l) => /^\s*[-•*]\s+/.test(l));
        if (isList && lines.length) {
          return (
            <ul key={ci} className="my-3 space-y-2">
              {lines.map((l, li) => (
                <li key={li} className="flex gap-2.5 leading-relaxed text-[15px] text-[#ded4f2]">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#f5b301] to-[#c026d3]" />
                  <span>
                    <Inline text={l.replace(/^\s*[-•*]\s+/, '')} />
                  </span>
                </li>
              ))}
            </ul>
          );
        }
        const numbered = lines.every((l) => /^\s*\d+[.)]\s+/.test(l));
        if (numbered && lines.length) {
          return (
            <ol key={ci} className="my-3 space-y-2">
              {lines.map((l, li) => (
                <li key={li} className="flex gap-2.5 leading-relaxed text-[15px] text-[#ded4f2]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#f5b301]/40 font-mono text-[11px] text-[#f5b301]">
                    {li + 1}
                  </span>
                  <span>
                    <Inline text={l.replace(/^\s*\d+[.)]\s+/, '')} />
                  </span>
                </li>
              ))}
            </ol>
          );
        }
        return (
          <p key={ci} className="my-3 leading-relaxed text-[15px] text-[#ded4f2] md:text-base">
            <Inline text={chunk} />
          </p>
        );
      })}
    </>
  );
}
