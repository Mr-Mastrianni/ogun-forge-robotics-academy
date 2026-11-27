import type { ReactNode } from 'react';
import { useProgress } from '@/lib/store';
import { Chip } from '../ui';

export interface LabProps {
  /** optional per-lesson task list; falls back to the registry defaults */
  tasks?: string[];
  compact?: boolean;
}

export function LabFrame({
  labId,
  title,
  brief,
  tasks,
  children,
  controls,
  readouts,
  tone = 'gold',
}: {
  labId: string;
  title: string;
  brief: string;
  tasks?: string[];
  children: ReactNode;
  controls?: ReactNode;
  readouts?: ReactNode;
  tone?: 'gold' | 'myco' | 'psy' | 'sirius';
}) {
  const labs = useProgress((s) => s.labs);
  const toggleLabTask = useProgress((s) => s.toggleLabTask);
  const done = labs[labId] ?? [];
  const list = tasks ?? [];

  const accent: Record<string, string> = {
    gold: 'from-k-gold to-k-forge',
    myco: 'from-k-moss to-[#16a34a]',
    psy: 'from-k-ember to-[#b8863f]',
    sirius: 'from-k-light to-[#2f6b5f]',
  };

  return (
    <div className="glass panel-edge overflow-hidden">
      <div className={`h-[3px] w-full bg-gradient-to-r ${accent[tone]}`} />
      <div className="border-b border-white/10 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-k-gold">
                Interactive lab
              </span>
              <Chip tone="dim">{labId}</Chip>
            </div>
            <h3 className="mt-1 font-heading text-lg font-semibold text-white">{title}</h3>
          </div>
          <div className="font-mono text-[11px] text-k-muted">
            {done.length}/{list.length} challenges
          </div>
        </div>
        <p className="mt-1.5 max-w-3xl text-[13px] leading-relaxed text-k-muted">{brief}</p>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1fr_320px]">
        <div className="relative min-h-[420px] bg-k-ink/60">{children}</div>
        <div className="space-y-3 border-t border-white/10 p-4 lg:border-l lg:border-t-0">
          {controls}
          {readouts && <div className="space-y-2">{readouts}</div>}
          {list.length > 0 && (
            <div className="rounded-xl border border-k-moss/25 bg-k-moss/5 p-3">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-k-moss">
                Challenges (+25 XP each)
              </div>
              <ul className="space-y-1.5">
                {list.map((t, i) => {
                  const on = done.includes(i);
                  return (
                    <li key={i}>
                      <button
                        onClick={() => toggleLabTask(labId, i)}
                        className="flex w-full items-start gap-2 text-left text-[12.5px] leading-snug transition-colors"
                      >
                        <span
                          className={`mt-[3px] grid h-4 w-4 shrink-0 place-items-center rounded border text-[10px] ${
                            on
                              ? 'border-k-moss bg-k-moss text-k-ink'
                              : 'border-k-moss/40 text-transparent'
                          }`}
                        >
                          ✓
                        </span>
                        <span className={on ? 'text-k-moss line-through decoration-k-moss/40' : 'text-k-text'}>
                          {t}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between font-mono text-[10.5px] uppercase tracking-wider text-k-muted">
        <span>{label}</span>
        <span className="text-k-glint">{format ? format(value) : `${value}${unit}`}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </label>
  );
}

export function Toggle({
  label,
  on,
  onClick,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-lg border px-2.5 py-1.5 text-[12px] transition-colors ${
        on
          ? 'border-k-gold/55 bg-k-gold/15 text-k-glint'
          : 'border-white/12 bg-white/[0.03] text-k-muted'
      }`}
    >
      <span>{label}</span>
      <span className="font-mono text-[10px]">{on ? 'ON' : 'OFF'}</span>
    </button>
  );
}

export function Readout({ label, value, tone = '#ffe6b0' }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-white/5 pb-1 last:border-0">
      <span className="font-mono text-[10.5px] uppercase tracking-wider text-k-muted">{label}</span>
      <span className="font-mono text-[12px]" style={{ color: tone }}>
        {value}
      </span>
    </div>
  );
}

export function LabButton({
  children,
  onClick,
  tone = 'gold',
  active = false,
}: {
  children: ReactNode;
  onClick: () => void;
  tone?: 'gold' | 'myco' | 'psy';
  active?: boolean;
}) {
  const map: Record<string, string> = {
    gold: 'border-k-gold/50 hover:bg-k-gold/20',
    myco: 'border-k-moss/50 hover:bg-k-moss/20',
    psy: 'border-k-ember/50 hover:bg-k-ember/20',
  };
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-2.5 py-1.5 font-mono text-[11px] transition-colors ${map[tone]} ${
        active ? 'bg-white/15 text-white' : 'bg-white/[0.03] text-k-text'
      }`}
    >
      {children}
    </button>
  );
}
