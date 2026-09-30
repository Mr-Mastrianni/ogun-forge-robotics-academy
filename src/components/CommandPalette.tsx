import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { KIND_META, PAGES, searchAll, type SearchHit } from '@/lib/searchIndex';
import { useSfx } from './Backdrop';

/**
 * Command palette. Opens with Cmd/Ctrl+K or "/" and searches lessons, labs,
 * blueprints, tables, glossary terms, heritage entries and boss trials.
 */
export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const nav = useNavigate();
  const sfx = useSfx();

  const results = useMemo(() => (q.trim() ? searchAll(q) : PAGES), [q]);

  useEffect(() => {
    if (open) {
      setQ('');
      setCursor(0);
      const t = setTimeout(() => inputRef.current?.focus(), 40);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => setCursor(0), [q]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setCursor((c) => Math.min(results.length - 1, c + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setCursor((c) => Math.max(0, c - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const hit = results[cursor];
        if (hit) {
          sfx.bead();
          nav(hit.to);
          onClose();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, cursor, nav, onClose, sfx]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${cursor}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  const grouped = useMemo(() => {
    const map = new Map<string, SearchHit[]>();
    results.forEach((r) => {
      const arr = map.get(r.kind) ?? [];
      arr.push(r);
      map.set(r.kind, arr);
    });
    return Array.from(map.entries());
  }, [results]);

  let flatIndex = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[8vh]"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-[#02000a]/80 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-psy panel-edge relative w-full max-w-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <span className="text-lg text-[#67e8f9]">⌕</span>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search lessons, labs, blueprints, tables, terms…"
                className="w-full bg-transparent font-body text-[15px] text-white placeholder:text-[#8c82a8] focus:outline-none"
              />
              <kbd className="rounded border border-white/20 px-1.5 py-0.5 font-mono text-[10px] text-[#c9bde6]">esc</kbd>
            </div>

            <div ref={listRef} className="max-h-[58vh] overflow-y-auto p-2">
              {results.length === 0 && (
                <div className="px-3 py-8 text-center text-[13px] text-[#c9bde6]">
                  Nothing matches “{q}”. Try a word like <em>kinematics</em>, <em>mycelium</em>, <em>LiDAR</em> or{' '}
                  <em>PID</em>.
                </div>
              )}
              {grouped.map(([kind, hits]) => (
                <div key={kind} className="mb-1.5">
                  <div className="px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-[#8c82a8]">
                    {KIND_META[kind as keyof typeof KIND_META]?.label ?? kind}
                  </div>
                  {hits.map((hit) => {
                    flatIndex += 1;
                    const idx = flatIndex;
                    const active = idx === cursor;
                    return (
                      <button
                        key={hit.id}
                        data-idx={idx}
                        onMouseEnter={() => setCursor(idx)}
                        onClick={() => {
                          sfx.bead();
                          nav(hit.to);
                          onClose();
                        }}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
                          active ? 'bg-[#67e8f9]/15 shadow-[inset_0_0_0_1px_rgba(103,232,249,0.35)]' : 'hover:bg-white/5'
                        }`}
                      >
                        <span
                          className="grid h-7 w-7 flex-none place-items-center rounded-lg border border-white/10 bg-white/5 text-[13px]"
                          style={{ color: KIND_META[hit.kind].color }}
                        >
                          {hit.glyph}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-heading text-[13.5px] text-white">{hit.title}</span>
                          <span className="block truncate text-[11.5px] text-[#c9bde6]">{hit.subtitle}</span>
                        </span>
                        {active && <span className="flex-none font-mono text-[10px] text-[#67e8f9]">↵</span>}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 font-mono text-[10px] text-[#8c82a8]">
              <span>↑↓ to move · ↵ to open</span>
              <span>{results.length} results</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
