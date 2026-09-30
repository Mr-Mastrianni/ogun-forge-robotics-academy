import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/* Layout primitives                                                   */
/* ------------------------------------------------------------------ */

export function Panel({
  children,
  className = '',
  tone = 'gold',
  hover = false,
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: 'gold' | 'hot' | 'myco' | 'psy' | 'sirius';
  hover?: boolean;
  /** anchor target for deep links from search */
  id?: string;
}) {
  const base =
    tone === 'hot'
      ? 'glass-hot'
      : tone === 'myco'
        ? 'glass-myco'
        : tone === 'psy'
          ? 'glass-psy'
          : tone === 'sirius'
            ? 'glass-sirius'
            : 'glass';
  return (
    <div
      id={id}
      className={`${base} panel-edge ${hover ? 'transition-transform duration-300 hover:-translate-y-1' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  sub,
  right,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.28em] text-[#f5b301]/80">{eyebrow}</div>
        )}
        <h2 className="font-heading text-2xl font-bold text-white md:text-3xl">{title}</h2>
        {sub && <p className="mt-1 max-w-2xl text-sm text-[#c9bde6]">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export function Chip({
  children,
  tone = 'gold',
  className = '',
}: {
  children: ReactNode;
  tone?: 'gold' | 'myco' | 'psy' | 'dim';
  className?: string;
}) {
  const map: Record<string, string> = {
    gold: 'chip',
    myco: 'chip chip-myco',
    psy: 'chip chip-psy',
    dim: 'chip border-white/15 bg-white/5 text-white/70',
  };
  return <span className={`${map[tone]} ${className}`}>{children}</span>;
}

export function Progress({ value, label }: { value: number; label?: string }) {
  return (
    <div>
      {label && (
        <div className="mb-1.5 flex justify-between font-mono text-[11px] uppercase tracking-wider text-[#c9bde6]">
          <span>{label}</span>
          <span>{Math.round(value * 100)}%</span>
        </div>
      )}
      <div className="progress-rail">
        <div className="progress-fill" style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }} />
      </div>
    </div>
  );
}

export function StatOrb({
  value,
  label,
  glyph,
  tone = 'gold',
}: {
  value: ReactNode;
  label: string;
  glyph?: string;
  tone?: 'gold' | 'myco' | 'psy' | 'sirius';
}) {
  const ring: Record<string, string> = {
    gold: 'from-[#f5b301] to-[#ff6b1a]',
    myco: 'from-[#6ee7a8] to-[#16a34a]',
    psy: 'from-[#c026d3] to-[#7c3aed]',
    sirius: 'from-[#67e8f9] to-[#4338ca]',
  };
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <div className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${ring[tone]}`} />
      <div className="flex items-baseline gap-2">
        {glyph && <span className="text-lg">{glyph}</span>}
        <span className="font-heading text-2xl font-bold text-white">{value}</span>
      </div>
      <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#c9bde6]">{label}</div>
    </div>
  );
}

export function GlyphDivider({ glyph = '◆' }: { glyph?: string }) {
  return (
    <div className="my-8 flex items-center gap-3 opacity-70">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#f5b301]/50 to-transparent" />
      <span className="text-[#f5b301]">{glyph}</span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c026d3]/50 to-transparent" />
    </div>
  );
}

export function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Meter({ label, value, tone = 'gold' }: { label: string; value: number; tone?: string }) {
  const colors: Record<string, string> = {
    gold: 'bg-gradient-to-r from-[#f5b301] to-[#ff6b1a]',
    myco: 'bg-gradient-to-r from-[#6ee7a8] to-[#16a34a]',
    psy: 'bg-gradient-to-r from-[#c026d3] to-[#7c3aed]',
    sirius: 'bg-gradient-to-r from-[#67e8f9] to-[#4338ca]',
    hot: 'bg-gradient-to-r from-[#ff2fb9] to-[#c1121f]',
  };
  return (
    <div>
      <div className="mb-1 flex justify-between font-mono text-[10px] uppercase tracking-widest text-[#c9bde6]">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${colors[tone] ?? colors.gold}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function DifficultyPips({ level }: { level: string }) {
  const order = ['seedling', 'apprentice', 'journeyman', 'master', 'orisha'];
  const idx = Math.max(0, order.indexOf(level));
  const colors = ['#6ee7a8', '#a3e635', '#f5b301', '#ff6b1a', '#c026d3'];
  return (
    <span className="inline-flex items-center gap-1" title={level}>
      {order.map((_, i) => (
        <span
          key={i}
          className="h-1.5 w-4 rounded-full"
          style={{ background: i <= idx ? colors[idx] : 'rgba(255,255,255,0.13)' }}
        />
      ))}
    </span>
  );
}
