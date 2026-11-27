import { type Block } from '@/content/types';
import { Inline, Math, RichText } from '@/lib/rich';
import { Chip, Panel } from './ui';
import { LabRenderer } from './labs';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';

const TONE: Record<string, { border: string; bg: string; text: string; glyph: string }> = {
  insight: { border: '#81dcd4', bg: 'rgba(129,220,212,0.07)', text: '#a9ece5', glyph: '◈' },
  warning: { border: '#f2853a', bg: 'rgba(242,133,58,0.08)', text: '#ffd0b0', glyph: '⚠' },
  afro: { border: '#f7c77c', bg: 'rgba(247,199,124,0.08)', text: '#ffe6b0', glyph: '✵' },
  myco: { border: '#a6eb9b', bg: 'rgba(166,235,155,0.08)', text: '#c4f0bb', glyph: '🍄' },
  quantum: { border: '#e0782f', bg: 'rgba(224,120,47,0.09)', text: '#f7dcb8', glyph: '⚛' },
  code: { border: '#8fa08c', bg: 'rgba(143,160,140,0.08)', text: '#d6e0cf', glyph: '⌨' },
};

function ChartBlockView({ block }: { block: Extract<Block, { kind: 'chart' }> }) {
  const data = block.x.map((x, i) => {
    const row: Record<string, string | number> = { x };
    block.series.forEach((s) => (row[s.key] = s.data[i] ?? 0));
    return row;
  });

  const common = (
    <>
      <CartesianGrid stroke="#1f3326" strokeDasharray="3 5" />
      <XAxis dataKey="x" tick={{ fill: '#b8c7b6', fontSize: 10 }} stroke="#3d5444" label={{ value: block.xLabel, position: 'insideBottom', offset: -4, fill: '#8fa08c', fontSize: 10 }} />
      <YAxis tick={{ fill: '#b8c7b6', fontSize: 10 }} stroke="#3d5444" label={{ value: block.yLabel, angle: -90, position: 'insideLeft', fill: '#8fa08c', fontSize: 10 }} />
      <Tooltip contentStyle={{ background: '#0c1914', border: '1px solid #3d5444', fontSize: 11 }} labelStyle={{ color: '#ffe6b0' }} />
      <Legend wrapperStyle={{ fontSize: 11 }} />
    </>
  );

  return (
    <Panel className="my-5 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-k-gold">data</span>
        <h3 className="font-heading text-sm font-semibold text-white">{block.title}</h3>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          {block.chartType === 'bar' ? (
            <BarChart data={data}>
              {common}
              {block.series.map((s) => (
                <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[4, 4, 0, 0]}>
                  {data.map((_, i) => (
                    <Cell key={i} fill={s.color} />
                  ))}
                </Bar>
              ))}
            </BarChart>
          ) : block.chartType === 'area' ? (
            <AreaChart data={data}>
              {common}
              {block.series.map((s) => (
                <Area key={s.key} dataKey={s.key} name={s.label} stroke={s.color} fill={s.color} fillOpacity={0.28} strokeWidth={2} />
              ))}
            </AreaChart>
          ) : block.chartType === 'radar' ? (
            <RadarChart data={data} outerRadius="72%">
              <PolarGrid stroke="#3d5444" />
              <PolarAngleAxis dataKey="x" tick={{ fill: '#b8c7b6', fontSize: 10 }} />
              <PolarRadiusAxis tick={{ fill: '#8fa08c', fontSize: 9 }} stroke="#3d5444" />
              {block.series.map((s) => (
                <Radar key={s.key} dataKey={s.key} name={s.label} stroke={s.color} fill={s.color} fillOpacity={0.25} />
              ))}
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#0c1914', border: '1px solid #3d5444', fontSize: 11 }} />
            </RadarChart>
          ) : block.chartType === 'scatter' ? (
            <ScatterChart>
              {common}
              <ZAxis range={[40, 40]} />
              {block.series.map((s) => (
                <Scatter key={s.key} dataKey={s.key} name={s.label} fill={s.color} />
              ))}
            </ScatterChart>
          ) : (
            <LineChart data={data}>
              {common}
              {block.series.map((s) => (
                <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color} strokeWidth={2.2} dot={false} />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      {block.caption && <p className="mt-2 text-[12px] leading-relaxed text-k-muted">{block.caption}</p>}
    </Panel>
  );
}

export function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case 'prose':
      return (
        <div className="my-5">
          {block.heading && (
            <h2 className="mb-2 font-heading text-xl font-bold text-k-gold">
              <Inline text={block.heading} />
            </h2>
          )}
          <RichText body={block.body} />
        </div>
      );

    case 'callout': {
      const t = TONE[block.tone] ?? TONE.insight;
      return (
        <div
          className="my-5 rounded-2xl border p-4"
          style={{ borderColor: `${t.border}55`, background: t.bg }}
        >
          <div className="mb-1.5 flex items-center gap-2">
            <span style={{ color: t.border }}>{t.glyph}</span>
            <span className="font-heading text-sm font-semibold" style={{ color: t.text }}>
              <Inline text={block.title} />
            </span>
          </div>
          <div className="text-[14px] leading-relaxed text-k-text">
            <RichText body={block.body} />
          </div>
        </div>
      );
    }

    case 'formula':
      return (
        <Panel className="my-5 p-4">
          <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-k-light">formula</div>
          <div className="font-heading text-sm text-white">{block.title}</div>
          <Math tex={block.tex} block />
          <p className="text-[13px] leading-relaxed text-k-muted">
            <Inline text={block.explain} />
          </p>
        </Panel>
      );

    case 'chart':
      return <ChartBlockView block={block} />;

    case 'table':
      return (
        <Panel className="my-5 overflow-hidden">
          <div className="border-b border-white/10 px-4 py-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-k-gold">reference table</div>
            <div className="font-heading text-sm font-semibold text-white">{block.title}</div>
          </div>
          <div className="max-h-[520px] overflow-auto">
            <table className="forge-table">
              <thead>
                <tr>
                  {block.columns.map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((r, i) => (
                  <tr key={i}>
                    {r.map((cell, j) => (
                      <td key={j}>
                        <Inline text={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && <p className="border-t border-white/5 px-4 py-2 text-[12px] text-k-muted">{block.caption}</p>}
          {block.insight && (
            <div className="border-t border-k-moss/20 bg-k-moss/5 px-4 py-2.5 text-[12.5px] leading-relaxed text-k-mint">
              <strong className="text-k-moss">How to choose:</strong> {block.insight}
            </div>
          )}
        </Panel>
      );

    case 'code':
      return (
        <Panel className="my-5 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-k-moss">code</span>
              <span className="font-heading text-[13px] text-white">{block.title}</span>
            </div>
            <Chip tone="dim">{block.language}</Chip>
          </div>
          <pre className="max-h-[460px] overflow-auto bg-[#060e0b] p-4 font-mono text-[12px] leading-relaxed text-[#a9ece5]">
            <code>{block.code}</code>
          </pre>
          {block.note && <p className="border-t border-white/5 px-4 py-2 text-[12px] text-k-muted">{block.note}</p>}
        </Panel>
      );

    case 'steps':
      return (
        <Panel className="my-5 p-4">
          <div className="mb-3 font-heading text-sm font-semibold text-white">{block.title}</div>
          <ol className="space-y-3">
            {block.steps.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-k-gold/50 bg-k-gold/10 font-mono text-[11px] text-k-gold">
                  {i + 1}
                </span>
                <div>
                  <div className="font-heading text-[14px] text-k-glint">
                    <Inline text={s.title} />
                  </div>
                  <div className="text-[13.5px] leading-relaxed text-k-text">
                    <Inline text={s.detail} />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Panel>
      );

    case 'lab':
      return (
        <div className="my-6">
          <div className="mb-2 flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-k-moss">3D lab</span>
            <span className="font-heading text-sm text-white">{block.title}</span>
          </div>
          <p className="mb-3 max-w-3xl text-[13.5px] leading-relaxed text-k-muted">{block.brief}</p>
          <LabRenderer labId={block.labId} tasks={block.tasks} />
        </div>
      );

    default:
      return null;
  }
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div>
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </div>
  );
}
