import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Panel, Progress, StatOrb, Chip } from '@/components/ui';
import { Field, NumberField, SelectField, usd } from './Fields';
import { gates } from '@/content/manufacturing';
import { useManufacturing } from '@/lib/manufacturingStore';
import {
  calculateCosts,
  clearedGates,
  download,
  emptyRecord,
  gateReady,
  paymentValid,
  rfqText,
} from '@/lib/manufacturing';
import type { Costs, ProductionProject, Supplier } from '@/lib/manufacturing';

type Tab = 'workflow' | 'suppliers' | 'costs' | 'payments';
export default function ProductionWorkspace({ project: p }: { project: ProductionProject }) {
  const [tab, setTab] = useState<Tab>('workflow');
  const [gateIndex, setGateIndex] = useState(() => Math.min(clearedGates(p), gates.length - 1));
  const update = useManufacturing((s) => s.update);
  const patch = (changes: Partial<ProductionProject>) => update(p.id, changes);
  const cleared = clearedGates(p);
  const cost = calculateCosts(p.costs);
  const gate = gates[gateIndex];
  const r = p.records[gate.id] ?? emptyRecord();
  const updateRecord = (changes: Partial<typeof r>) =>
    patch({ records: { ...p.records, [gate.id]: { ...r, ...changes } } });
  return (
    <div className="space-y-5">
      <Link to="/manufacturing" className="text-sm text-k-light">
        ← Manufacturing Forge
      </Link>
      <header className="flex flex-wrap justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-k-gold">
            Production project · USD scenario
          </div>
          <h1 className="font-heading text-3xl text-white mt-1">{p.title}</h1>
          {p.blueprintId && (
            <Link className="text-sm text-k-moss" to={`/ideas/${p.blueprintId}`}>
              View source blueprint ↗
            </Link>
          )}
        </div>
        <div className="flex flex-wrap gap-2 items-start">
          <button className="btn btn-ghost" onClick={() => download('ogun-rfq-draft.txt', rfqText(p))}>
            Download RFQ draft
          </button>
          <button
            className="btn btn-primary"
            onClick={() =>
              download(
                'ogun-project-backup.json',
                JSON.stringify({ version: 1, project: p }, null, 2),
                'application/json',
              )
            }
          >
            Export project backup
          </button>
        </div>
      </header>
      <Panel className="p-4">
        <Progress value={cleared / gates.length} label={`${cleared}/8 gates cleared in sequence`} />
        <p className="mt-2 text-sm text-k-muted">
          {cleared < gates.length
            ? `Next decision: ${gates[cleared].title}.`
            : 'All gates documented. Review evidence before any real release.'}{' '}
          Changes to earlier evidence can reopen a gate.
        </p>
      </Panel>
      <div className="grid gap-3 sm:grid-cols-3">
        <StatOrb label="Repeat landed / unit" value={usd(cost.repeatUnit)} />
        <StatOrb label="First-run cash + buffer" value={usd(cost.cashPlan)} tone="myco" />
        <StatOrb label="Contribution / sale" value={usd(cost.contribution)} tone="sirius" />
      </div>
      <nav aria-label="Project sections" className="flex flex-wrap gap-2">
        {(['workflow', 'suppliers', 'costs', 'payments'] as const).map((t) => (
          <button
            key={t}
            aria-pressed={tab === t}
            onClick={() => setTab(t)}
            className={`btn ${tab === t ? 'btn-primary' : 'btn-ghost'}`}
          >
            {
              {
                workflow: 'Workflow & evidence',
                suppliers: 'Suppliers & quotes',
                costs: 'Costs & margins',
                payments: 'Payments & dates',
              }[t]
            }
          </button>
        ))}
      </nav>
      {tab === 'workflow' && (
        <>
          <Panel className="p-5">
            <h2 className="font-heading text-xl text-white">Product brief</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field
                label="Project name"
                value={p.title}
                maxLength={200}
                onChange={(title) => patch({ title })}
              />
              <Field
                label="Quote basis · named place, version and included costs"
                value={p.quoteBasis}
                maxLength={500}
                onChange={(quoteBasis) => patch({ quoteBasis })}
              />
              <Field
                label="Buyer, product, use environment and requirements"
                multiline
                value={p.brief}
                onChange={(brief) => patch({ brief })}
              />
              <Field
                label="BOM, drawing revisions and document references"
                multiline
                value={p.bom}
                onChange={(bom) => patch({ bom })}
              />
            </div>
          </Panel>
          <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
            <nav aria-label="Production gates" className="space-y-2">
              {gates.map((g, i) => (
                <button
                  key={g.id}
                  className={`w-full rounded-xl border p-3 text-left text-sm ${gateIndex === i ? 'border-k-gold bg-k-gold/10' : 'border-white/15 bg-black/20'}`}
                  onClick={() => setGateIndex(i)}
                  aria-pressed={gateIndex === i}
                >
                  <span className="text-k-gold mr-2">{i < cleared ? '✓' : i === cleared ? '◉' : '○'}</span>
                  {i + 1}. {g.title}
                  <span className="block text-xs mt-1 ml-6 text-k-muted">
                    {i < cleared
                      ? 'Cleared'
                      : gateReady(p, g)
                        ? 'Documented · earlier gate open'
                        : 'Evidence needed'}
                  </span>
                </button>
              ))}
            </nav>
            <Panel className="p-5 space-y-4">
              <div className="flex flex-wrap gap-2 justify-between">
                <h2 className="font-heading text-xl text-white">
                  {gateIndex + 1}. {gate.title}
                </h2>
                <Chip tone={gateIndex < cleared ? 'myco' : 'dim'}>
                  {gateIndex < cleared ? 'Gate cleared' : 'Not cleared'}
                </Chip>
              </div>
              <p className="text-sm text-k-muted">
                Prepare any gate in advance. Clearance requires every earlier gate, all checks, an evidence
                record, reviewer and date. These are your recorded decisions, not independent approvals.
              </p>
              <div className="space-y-3">
                {gate.checks.map((k, i) => (
                  <label key={k} className="flex gap-3 items-start text-k-text">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={r.checks.includes(k)}
                      onChange={() =>
                        updateRecord({
                          checks: r.checks.includes(k) ? r.checks.filter((x) => x !== k) : [...r.checks, k],
                        })
                      }
                    />
                    <span>{gate.labels[i]}</span>
                  </label>
                ))}
              </div>
              <Field
                label={`Evidence · ${gate.prompt}`}
                multiline
                value={r.evidence}
                onChange={(evidence) => updateRecord({ evidence })}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Reviewer / decision owner"
                  value={r.owner}
                  maxLength={200}
                  onChange={(owner) => updateRecord({ owner })}
                />
                <Field
                  label="Review date"
                  type="date"
                  value={r.date}
                  onChange={(date) => updateRecord({ date })}
                />
              </div>
              {gate.id === 'sourcing' && (
                <p className="text-sm text-k-gold">
                  This gate also needs a selected supplier with name, qualification evidence and quote
                  inclusions recorded in Suppliers.
                </p>
              )}
              <Link className="btn btn-ghost" to={`/manufacturing/learn/${gate.module}`}>
                Study the related lesson →
              </Link>
              {gateIndex < 7 && (
                <button className="btn btn-primary ml-2" onClick={() => setGateIndex((i) => i + 1)}>
                  View next gate →
                </button>
              )}
            </Panel>
          </div>
        </>
      )}
      {tab === 'suppliers' && <Suppliers project={p} patch={patch} />}
      {tab === 'costs' && <CostEditor project={p} patch={patch} />}
      {tab === 'payments' && <Payments project={p} patch={patch} />}
      <p className="text-xs text-k-muted">
        Auto-saved in this browser · export a backup for portability. Keep sensitive contracts and CAD in your
        own document system; use references here. No bank or supplier connection is active.
      </p>
    </div>
  );
}

function Suppliers({
  project: p,
  patch,
}: {
  project: ProductionProject;
  patch: (p: Partial<ProductionProject>) => void;
}) {
  const [editing, setEditing] = useState(p.suppliers[0]?.id ?? '');
  const [confirmDelete, setConfirmDelete] = useState('');
  const [notice, setNotice] = useState('');
  const supplier = p.suppliers.find((s) => s.id === editing);
  const edit = (changes: Partial<Supplier>) => {
    if (supplier)
      patch({ suppliers: p.suppliers.map((s) => (s.id === supplier.id ? { ...s, ...changes } : s)) });
  };
  return (
    <div className="space-y-4">
      <Panel className="p-5">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div>
            <h2 className="font-heading text-xl text-white">Supplier comparison</h2>
            <p className="text-sm text-k-muted mt-1">
              Quotes must share quantity, revision, currency and delivery scope to be comparable. All amounts
              here are USD.
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              const s: Supplier = {
                id: crypto.randomUUID(),
                name: '',
                role: 'Factory · verify',
                contact: '',
                evidence: '',
                unitPrice: 0,
                moq: 100,
                leadDays: 30,
                incoterm: 'EXW',
                scope: '',
              };
              patch({ suppliers: [...p.suppliers, s] });
              setEditing(s.id);
            }}
          >
            Add supplier
          </button>
        </div>
        {!p.suppliers.length ? (
          <p className="mt-5 text-k-muted">
            Build a shortlist, then request equivalent quotes. No sample suppliers are presented as vetted
            partners.
          </p>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="forge-table">
              <caption className="sr-only">Supplier quotes and lead times</caption>
              <thead>
                <tr>
                  <th>Supplier</th>
                  <th>USD / unit</th>
                  <th>MOQ</th>
                  <th>Lead days</th>
                  <th>Basis</th>
                  <th>Review</th>
                </tr>
              </thead>
              <tbody>
                {p.suppliers.map((s) => (
                  <tr key={s.id}>
                    <td>
                      {s.id === p.selectedSupplier ? '★ ' : ''}
                      {s.name || 'Unnamed supplier'}
                    </td>
                    <td>{usd(s.unitPrice)}</td>
                    <td>{s.moq}</td>
                    <td>{s.leadDays}</td>
                    <td>{s.incoterm}</td>
                    <td>
                      <button
                        className="btn btn-ghost"
                        onClick={() => {
                          setEditing(s.id);
                          setConfirmDelete('');
                        }}
                      >
                        Edit quote
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
      {supplier && (
        <Panel className="p-5 space-y-4">
          <h3 className="font-heading text-xl text-white">Quote & qualification record</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Legal supplier name"
              value={supplier.name}
              maxLength={200}
              onChange={(name) => edit({ name })}
            />
            <Field
              label="Contact / document reference"
              value={supplier.contact}
              maxLength={500}
              onChange={(contact) => edit({ contact })}
            />
            <SelectField
              label="Role (confirm in due diligence)"
              value={supplier.role}
              onChange={(role) => edit({ role })}
            >
              {['Factory · verify', 'Verified factory', 'Trading company', 'Sourcing agent', 'Other'].map(
                (x) => (
                  <option key={x}>{x}</option>
                ),
              )}
            </SelectField>
            <Field
              label="Incoterm · named place and version"
              value={supplier.incoterm}
              maxLength={200}
              onChange={(incoterm) => edit({ incoterm })}
            />
            <NumberField
              label="Quoted unit price · USD"
              value={supplier.unitPrice}
              onChange={(unitPrice) => edit({ unitPrice })}
            />
            <NumberField
              label="Minimum order quantity"
              min={1}
              integer
              value={supplier.moq}
              onChange={(moq) => edit({ moq })}
            />
            <NumberField
              label="Confirmed lead time · days"
              integer
              value={supplier.leadDays}
              onChange={(leadDays) => edit({ leadDays })}
            />
            <Field
              label="Quote scope · quantity tiers, validity, packaging, tooling, freight, duties"
              multiline
              value={supplier.scope}
              onChange={(scope) => edit({ scope })}
            />
            <Field
              label="Qualification evidence · legal entity, site verification, references, quality, capacity"
              multiline
              value={supplier.evidence}
              onChange={(evidence) => edit({ evidence })}
            />
          </div>
          {p.costs.quantity < supplier.moq && (
            <p className="text-k-gold">
              Current scenario ({p.costs.quantity} units) is below this supplier’s MOQ ({supplier.moq}).
              Negotiate and document revised terms before treating the quote as viable.
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              className="btn btn-myco"
              disabled={!supplier.name.trim() || !supplier.evidence.trim() || !supplier.scope.trim()}
              onClick={() => {
                patch({ selectedSupplier: supplier.id });
                setNotice('Supplier selected. Cost scenario has not changed.');
              }}
            >
              {p.selectedSupplier === supplier.id ? '★ Selected partner' : 'Select partner'}
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                patch({
                  costs: { ...p.costs, unitPrice: supplier.unitPrice },
                  quoteBasis: supplier.incoterm,
                });
                setNotice(
                  'Quoted unit price and basis copied. Review all additional costs and quantity before comparing totals.',
                );
              }}
            >
              Use quoted price in cost scenario
            </button>
            <button className="btn btn-ghost" onClick={() => setConfirmDelete(supplier.id)}>
              Remove supplier
            </button>
          </div>
          {notice && (
            <p role="status" className="text-sm text-k-moss">
              {notice}
            </p>
          )}
          {confirmDelete === supplier.id && (
            <div>
              <p className="text-sm">Remove this quote and its qualification record?</p>
              <button
                className="btn btn-ghost mt-2"
                onClick={() => {
                  patch({
                    suppliers: p.suppliers.filter((s) => s.id !== supplier.id),
                    selectedSupplier: p.selectedSupplier === supplier.id ? '' : p.selectedSupplier,
                  });
                  setEditing('');
                  setConfirmDelete('');
                }}
              >
                Confirm removal
              </button>
              <button className="btn btn-ghost ml-2" onClick={() => setConfirmDelete('')}>
                Keep supplier
              </button>
            </div>
          )}
        </Panel>
      )}
      <Panel tone="myco" className="p-5">
        <h3 className="font-heading text-white">Negotiate a workable trial</h3>
        <p className="mt-2 text-sm text-k-mint">
          Compare a setup fee, standard components and fewer variants before increasing order size. Preserve
          quality specifications, document tooling ownership, agree change control and tie payment releases to
          evidence.
        </p>
        <Link className="btn btn-ghost mt-3" to="/manufacturing/learn/suppliers">
          Read supplier playbook →
        </Link>
      </Panel>
    </div>
  );
}

const costFields: {
  key: Exclude<keyof Costs, 'dutyBasis'>;
  label: string;
  max?: number;
  min?: number;
  integer?: boolean;
}[] = [
  { key: 'quantity', label: 'Order quantity · units', min: 1, integer: true },
  { key: 'unitPrice', label: 'Quoted goods price · USD / unit' },
  { key: 'packaging', label: 'Additional packaging · USD / unit' },
  { key: 'freight', label: 'Additional transport / insurance · USD / unit' },
  { key: 'duty', label: 'Additional broker-confirmed duties / taxes · USD / unit' },
  { key: 'batchFees', label: 'Additional inspection / brokerage / batch fees · USD total' },
  { key: 'tooling', label: 'Tooling / engineering setup · USD total' },
  { key: 'testing', label: 'One-time compliance / test setup · USD total' },
  { key: 'retail', label: 'Net selling price before sales tax · USD / unit' },
  { key: 'selling', label: 'Ads, fees, fulfillment, returns / warranty reserve · USD / sale' },
  { key: 'contingency', label: 'Planning contingency · % of first-run total', max: 100 },
];
function CostEditor({
  project: p,
  patch,
}: {
  project: ProductionProject;
  patch: (p: Partial<ProductionProject>) => void;
}) {
  const c = p.costs;
  const v = calculateCosts(c);
  return (
    <div className="space-y-4">
      <Panel className="p-5">
        <h2 className="font-heading text-xl text-white">Landed-cost & margin bench</h2>
        <p className="mt-2 text-sm text-k-muted">
          USD planning estimate. Add only costs outside the quoted goods price. For DDP, confirm inclusions
          before adding freight or duty. Tooling and testing are allocated to this first run in full.
        </p>
        <p className="mt-2 text-sm text-k-gold">Quote basis: {p.quoteBasis}</p>
        <div className="grid gap-4 mt-5 md:grid-cols-2 lg:grid-cols-3">
          {costFields.map(({ key, ...f }) => (
            <NumberField
              key={key}
              {...f}
              value={c[key]}
              onChange={(n) => patch({ costs: { ...c, [key]: n } })}
            />
          ))}
        </div>
        <div className="mt-4">
          <Field
            label="Duty estimate evidence · origin, destination, HTS, broker reference and date (or included / not applicable)"
            multiline
            value={c.dutyBasis}
            onChange={(dutyBasis) => patch({ costs: { ...c, dutyBasis } })}
          />
        </div>
      </Panel>
      <Panel className="p-5">
        <h3 className="font-heading text-xl text-white">Scenario results</h3>
        <div className="overflow-x-auto mt-3">
          <table className="forge-table">
            <tbody>
              {[
                ['Repeat-run landed / unit', usd(v.repeatUnit)],
                ['First-run cost / unit including setup', usd(v.firstUnit)],
                ['Goods invoice', usd(v.goods)],
                ['One-time setup & testing', usd(v.oneTime)],
                ['Total first-run cost', usd(v.total)],
                ['Cash plan with contingency', usd(v.cashPlan)],
                [
                  'Gross margin before selling costs',
                  v.grossMargin === null ? 'Set a selling price' : `${(v.grossMargin * 100).toFixed(1)}%`,
                ],
                ['Contribution / sale before fixed overhead', usd(v.contribution)],
                [
                  'Sales to recover one-time setup',
                  v.breakEven === null ? 'Not recoverable at this contribution' : `${v.breakEven} units`,
                ],
              ].map(([label, value]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td className="font-mono text-k-glint">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-k-muted">
          Repeat landed = quoted goods + additional packaging + transport + duties + batch fees ÷ units.
          Contribution subtracts variable selling costs; it excludes fixed overhead and income tax. Recovery
          units cover tooling/testing only, not the entire inventory cash commitment.
        </p>
        {(!c.unitPrice || !c.retail || !c.dutyBasis.trim()) && (
          <p className="mt-3 text-k-gold" role="status">
            Estimate incomplete: confirm goods price, selling price and duty/inclusion evidence before relying
            on these figures.
          </p>
        )}
        {v.contribution <= 0 && (
          <p className="mt-3 text-k-gold">
            No positive contribution in this scenario. Revisit price, costs or the product before ordering.
          </p>
        )}
      </Panel>
      <Link className="btn btn-ghost" to="/manufacturing/learn/economics">
        Understand the economics →
      </Link>
    </div>
  );
}

function Payments({
  project: p,
  patch,
}: {
  project: ProductionProject;
  patch: (p: Partial<ProductionProject>) => void;
}) {
  const v = calculateCosts(p.costs);
  const valid = paymentValid(p);
  const paid = p.payments.reduce((n, m) => n + (m.paid ? (m.percent / 100) * v.goods : 0), 0);
  const totalPercent = p.payments.reduce((n, m) => n + m.percent, 0);
  return (
    <div className="space-y-4">
      <Panel className="p-5">
        <h2 className="font-heading text-xl text-white">Milestone payment plan</h2>
        <p className="mt-2 text-sm text-k-muted">
          Percentages apply to the quoted goods invoice ({usd(v.goods)}). Setup, testing and additional
          logistics need separate funding. “Paid” is your record only; this workspace cannot transfer money.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            [30, 40, 30],
            [30, 0, 70],
          ].map((split) => (
            <button
              key={split.join('/')}
              className="btn btn-ghost"
              onClick={() =>
                patch({
                  payments: p.payments.map((m, i) => ({
                    ...m,
                    percent: split[i],
                    paid: false,
                    evidence: '',
                  })),
                })
              }
            >
              Use {split.join('/')} scenario · clears paid records
            </button>
          ))}
        </div>
        <p className={`mt-3 ${valid ? 'text-k-moss' : 'text-k-gold'}`} role="status">
          Allocation: {totalPercent.toFixed(1)}% {valid ? '✓' : '— must total 100%; payment marking disabled'}
        </p>
      </Panel>
      {p.payments.map((m, i) => {
        const edit = (changes: Partial<typeof m>) =>
          patch({ payments: p.payments.map((x, j) => (j === i ? { ...x, ...changes } : x)) });
        return (
          <Panel key={m.id} className="p-5 space-y-4">
            <div className="flex flex-wrap justify-between gap-3">
              <h3 className="font-heading text-lg text-white">
                {i + 1}. {m.title}
              </h3>
              <Chip>{usd((v.goods * m.percent) / 100)}</Chip>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field
                label="Agreed release milestone"
                maxLength={200}
                value={m.title}
                onChange={(title) => edit({ title, paid: false })}
              />
              <NumberField
                label="Invoice allocation · %"
                max={100}
                value={m.percent}
                onChange={(percent) => edit({ percent, paid: false })}
              />
              <Field
                label="Due date"
                type="date"
                value={m.date}
                onChange={(date) => edit({ date, paid: false })}
              />
            </div>
            <Field
              label="Release evidence / invoice and payment reference"
              multiline
              value={m.evidence}
              onChange={(evidence) => edit({ evidence, paid: false })}
            />
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={m.paid}
                disabled={
                  !m.paid && (!valid || !m.evidence.trim() || !m.date || m.percent === 0 || v.goods <= 0)
                }
                onChange={() => edit({ paid: !m.paid })}
              />
              <span>
                Record paid · requires valid allocation, positive invoice, due date and release evidence.
              </span>
            </label>
          </Panel>
        );
      })}
      <Panel tone="myco" className="p-5">
        <h3 className="font-heading text-white">Cash timing snapshot</h3>
        <p className="mt-2 text-k-mint">
          Recorded goods payments: {usd(paid)} · remaining on goods invoice:{' '}
          {valid ? usd(v.goods - paid) : 'Fix allocation first'}
        </p>
        <p className="mt-2 text-sm text-k-mint">
          Other modeled first-run costs: {usd(v.total - v.goods)} before contingency. Deferred terms and
          SINOSURE eligibility must be confirmed in writing. This plan contains no assumed sales receipts or
          credit approvals.
        </p>
        <Link className="btn btn-ghost mt-3" to="/manufacturing/learn/scale">
          Study funding & logistics →
        </Link>
      </Panel>
    </div>
  );
}
