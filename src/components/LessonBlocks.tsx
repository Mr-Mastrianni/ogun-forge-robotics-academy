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
  insight: { border: '#67e8f9', bg: 'rgba(103,232,249,0.07)', text: '#a5f3fc', glyph: '◈' },
  warning: { border: '#ff6b1a', bg: 'rgba(255,107,26,0.08)', text: '#ffd0b0', glyph: '⚠' },
  afro: { border: '#f5b301', bg: 'rgba(245,179,1,0.08)', text: '#ffe9a8', glyph: '✵' },
  myco: { border: '#6ee7a8', bg: 'rgba(110,231,168,0.08)', text: '#b8f5d0', glyph: '🍄' },
  quantum: { border: '#c026d3', bg: 'rgba(192,38,211,0.09)', text: '#f5c8ff', glyph: '⚛' },
  code: { border: '#8c82a8', bg: 'rgba(140,130,168,0.08)', text: '#ded4f2', glyph: '⌨' },
};

function ChartBlockView({ block }: { block: Extract<Block, { kind: 'chart' }> }) {
  const data = block.x.map((x, i) => {
    const row: Record<string, string | number> = { x };
    block.series.forEach((s) => (row[s.key] = s.data[i] ?? 0));
    return row;
  });

  const common = (
    <>
      <CartesianGrid stroke="#2a1f4d" strokeDasharray="3 5" />
      <XAxis dataKey="x" tick={{ fill: '#c9bde6', fontSize: 10 }} stroke="#4a3d7a" label={{ value: block.xLabel, position: 'insideBottom', offset: -4, fill: '#8c82a8', fontSize: 10 }} />
      <YAxis tick={{ fill: '#c9bde6', fontSize: 10 }} stroke="#4a3d7a" label={{ value: block.yLabel, angle: -90, position: 'insideLeft', fill: '#8c82a8', fontSize: 10 }} />
      <Tooltip contentStyle={{ background: '#0a0420', border: '1px solid #4a3d7a', fontSize: 11 }} labelStyle={{ color: '#ffe9a8' }} />
      <Legend wrapperStyle={{ fontSize: 11 }} />
    </>
  );

  return (
    <Panel className="my-5 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#f5b301]">data</span>
        <h4 className="font-heading text-sm font-semibold text-white">{block.title}</h4>
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
              <PolarGrid stroke="#4a3d7a" />
              <PolarAngleAxis dataKey="x" tick={{ fill: '#c9bde6', fontSize: 10 }} />
              <PolarRadiusAxis tick={{ fill: '#8c82a8', fontSize: 9 }} stroke="#4a3d7a" />
              {block.series.map((s) => (
                <Radar key={s.key} dataKey={s.key} name={s.label} stroke={s.color} fill={s.color} fillOpacity={0.25} />
              ))}
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#0a0420', border: '1px solid #4a3d7a', fontSize: 11 }} />
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
      {block.caption && <p className="mt-2 text-[12px] leading-relaxed text-[#c9bde6]">{block.caption}</p>}
    </Panel>
  );
}

export function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case 'prose':
      return (
        <div className="my-5">
          {block.heading && (
            <h3 className="mb-2 font-heading text-xl font-bold text-[#f5b301]">
              <Inline text={block.heading} />
            </h3>
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
          <div className="text-[14px] leading-relaxed text-[#ded4f2]">
            <RichText body={block.body} />
          </div>
        </div>
      );
    }

    case 'formula':
      return (
        <Panel className="my-5 p-4">
          <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#67e8f9]">formula</div>
          <div className="font-heading text-sm text-white">{block.title}</div>
          <Math tex={block.tex} block />
          <p className="text-[13px] leading-relaxed text-[#c9bde6]">
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
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#f5b301]">reference table</div>
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
          {block.caption && <p className="border-t border-white/5 px-4 py-2 text-[12px] text-[#c9bde6]">{block.caption}</p>}
          {block.insight && (
            <div className="border-t border-[#6ee7a8]/20 bg-[#6ee7a8]/5 px-4 py-2.5 text-[12.5px] leading-relaxed text-[#cfe9dc]">
              <strong className="text-[#6ee7a8]">How to choose:</strong> {block.insight}
            </div>
          )}
        </Panel>
      );

    case 'code':
      return (
        <Panel className="my-5 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6ee7a8]">code</span>
              <span className="font-heading text-[13px] text-white">{block.title}</span>
            </div>
            <Chip tone="dim">{block.language}</Chip>
          </div>
          <pre className="max-h-[460px] overflow-auto bg-[#04010c] p-4 font-mono text-[12px] leading-relaxed text-[#a5f3fc]">
            <code>{block.code}</code>
          </pre>
          {block.note && <p className="border-t border-white/5 px-4 py-2 text-[12px] text-[#c9bde6]">{block.note}</p>}
        </Panel>
      );

    case 'steps':
      return (
        <Panel className="my-5 p-4">
          <div className="mb-3 font-heading text-sm font-semibold text-white">{block.title}</div>
          <ol className="space-y-3">
            {block.steps.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[#f5b301]/50 bg-[#f5b301]/10 font-mono text-[11px] text-[#f5b301]">
                  {i + 1}
                </span>
                <div>
                  <div className="font-heading text-[14px] text-[#ffe9a8]">
                    <Inline text={s.title} />
                  </div>
                  <div className="text-[13.5px] leading-relaxed text-[#ded4f2]">
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
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6ee7a8]">3D lab</span>
            <span className="font-heading text-sm text-white">{block.title}</span>
          </div>
          <p className="mb-3 max-w-3xl text-[13.5px] leading-relaxed text-[#c9bde6]">{block.brief}</p>
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
