import type { ReactNode } from 'react';
export function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = 'text',
  maxLength = 20000,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: string;
  maxLength?: number;
}) {
  const props = {
    className: 'forge-input',
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
    maxLength,
  };
  return (
    <label className="block space-y-1 text-sm text-k-muted">
      <span>{label}</span>
      {multiline ? <textarea {...props} rows={4} /> : <input {...props} type={type} />}
    </label>
  );
}
export function NumberField({
  label,
  value,
  onChange,
  min = 0,
  max = 1e9,
  integer = false,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  integer?: boolean;
}) {
  return (
    <label className="block space-y-1 text-sm text-k-muted">
      <span>{label}</span>
      <input
        className="forge-input"
        type="number"
        min={min}
        max={max}
        step={integer ? 1 : 'any'}
        value={value}
        onChange={(e) => {
          const n = e.target.valueAsNumber;
          if (Number.isFinite(n)) onChange(Math.min(max, Math.max(min, integer ? Math.round(n) : n)));
          else if (!e.target.value) onChange(min);
        }}
      />
    </label>
  );
}
export function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1 text-sm text-k-muted">
      <span>{label}</span>
      <select className="forge-input" value={value} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
    </label>
  );
}
export const usd = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);
