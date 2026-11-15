import { gates } from '@/content/manufacturing';
export interface Costs {
  quantity: number;
  unitPrice: number;
  packaging: number;
  freight: number;
  duty: number;
  batchFees: number;
  tooling: number;
  testing: number;
  retail: number;
  selling: number;
  contingency: number;
  dutyBasis: string;
}
export interface Supplier {
  id: string;
  name: string;
  role: string;
  contact: string;
  evidence: string;
  unitPrice: number;
  moq: number;
  leadDays: number;
  incoterm: string;
  scope: string;
}
export interface GateRecord {
  checks: string[];
  evidence: string;
  owner: string;
  date: string;
}
export interface Payment {
  id: string;
  title: string;
  percent: number;
  date: string;
  evidence: string;
  paid: boolean;
}
export interface ProductionProject {
  id: string;
  title: string;
  blueprintId: string;
  brief: string;
  bom: string;
  createdAt: string;
  costs: Costs;
  suppliers: Supplier[];
  selectedSupplier: string;
  quoteBasis: string;
  records: Record<string, GateRecord>;
  payments: Payment[];
}
export const defaultCosts: Costs = {
  quantity: 100,
  unitPrice: 0,
  packaging: 0,
  freight: 0,
  duty: 0,
  batchFees: 0,
  tooling: 0,
  testing: 0,
  retail: 0,
  selling: 0,
  contingency: 10,
  dutyBasis: '',
};
export function calculateCosts(c: Costs) {
  const repeatUnit = c.unitPrice + c.packaging + c.freight + c.duty + c.batchFees / Math.max(1, c.quantity);
  const oneTime = c.tooling + c.testing;
  const firstUnit = repeatUnit + oneTime / Math.max(1, c.quantity);
  const goods = c.unitPrice * c.quantity;
  const total = repeatUnit * c.quantity + oneTime;
  const contribution = c.retail - repeatUnit - c.selling;
  return {
    repeatUnit,
    firstUnit,
    oneTime,
    goods,
    total,
    cashPlan: total * (1 + c.contingency / 100),
    grossMargin: c.retail > 0 ? (c.retail - repeatUnit) / c.retail : null,
    contribution,
    breakEven: contribution > 0 ? Math.ceil(oneTime / contribution) : null,
  };
}
export function newProject(title: string, blueprintId = '', brief = '', bom = ''): ProductionProject {
  return {
    id: crypto.randomUUID(),
    title: title.trim() || 'Untitled production project',
    blueprintId,
    brief,
    bom,
    createdAt: new Date().toISOString(),
    costs: { ...defaultCosts },
    suppliers: [],
    selectedSupplier: '',
    quoteBasis: 'EXW · confirm named place and included costs',
    records: {},
    payments: [
      { id: 'deposit', title: 'Deposit', percent: 30, date: '', evidence: '', paid: false },
      { id: 'inspection', title: 'After inspection', percent: 40, date: '', evidence: '', paid: false },
      {
        id: 'shipment',
        title: 'Shipment / agreed delivery',
        percent: 30,
        date: '',
        evidence: '',
        paid: false,
      },
    ],
  };
}
export const emptyRecord = (): GateRecord => ({ checks: [], evidence: '', owner: '', date: '' });
export function gateReady(p: ProductionProject, gate: (typeof gates)[number]): boolean {
  const r = p.records[gate.id];
  if (
    !r ||
    !r.evidence.trim() ||
    !r.owner.trim() ||
    !r.date ||
    !gate.checks.every((k) => r.checks.includes(k))
  )
    return false;
  if (gate.id === 'sourcing') {
    const supplier = p.suppliers.find((s) => s.id === p.selectedSupplier);
    return !!supplier?.name.trim() && !!supplier.evidence.trim() && !!supplier.scope.trim();
  }
  return true;
}
export function clearedGates(p: ProductionProject): number {
  const first = gates.findIndex((g) => !gateReady(p, g));
  return first === -1 ? gates.length : first;
}
export function paymentValid(p: ProductionProject) {
  return Math.abs(p.payments.reduce((n, v) => n + v.percent, 0) - 100) < 0.001;
}
export function rfqText(p: ProductionProject) {
  return `OGUN FORGE — REQUEST FOR QUOTATION\nProject: ${p.title}\n\nPRODUCT BRIEF\n${p.brief || '[Complete brief]'}\n\nBILL OF MATERIALS / REVISION\n${p.bom || '[Attach controlled BOM and drawings after access review]'}\n\nORDER SCENARIO\nQuantity: ${p.costs.quantity}\nQuote basis: ${p.quoteBasis}\n\nPlease quote sample cost/time, quantity tiers and MOQ, unit price, packaging, tooling/NRE, test fixtures and test costs separately. Specify currency, quote validity, named Incoterms place/version, included freight/duties, production lead time and payment milestones.\n\nQUALIFICATION\nIdentify legal entity, manufacturing site, factory/trading-company role, relevant references, capacity and subcontracting. Provide capability and quality-system evidence.\n\nENGINEERING & QUALITY\nProvide DFM feedback against the supplied revision. Confirm materials, tolerances, firmware access, test method, defect definitions, sampling plan, corrective action and independent inspection access. No substitutions without recorded approval.\n\nOWNERSHIP & COMPLIANCE\nConfirm design, firmware, tooling and fixture ownership/use/transfer terms. Identify required product-specific compliance review; no claim of automatic host approval from a radio module. Agree confidentiality and design-file access before transfer.\n\nRELEASE & LOGISTICS\nDefine golden sample approval, design freeze, pilot criteria, change control, shipment release, importer responsibilities, battery transport documents, packaging dimensions, warranty and returns.\n\nThis is a draft RFQ, not a purchase order or contract. Complete product specifications and destination before sending.\n`;
}
export function download(name: string, content: string, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
/** Validate a portable project before adding it. Unknown fields and executable content are never evaluated. */
export function parseProjectBackup(raw: string): ProductionProject {
  const data = JSON.parse(raw);
  if (data?.version !== 1 || !data.project || typeof data.project !== 'object')
    throw new Error('Expected an Ogun Forge project backup (version 1).');
  const p = data.project;
  const str = (v: unknown, max = 20000): string => {
    if (typeof v !== 'string' || v.length > max) throw new Error('Invalid or oversized text field.');
    return v;
  };
  const num = (v: unknown, max = 1e9): number => {
    if (typeof v !== 'number' || !Number.isFinite(v) || v < 0 || v > max)
      throw new Error('Invalid numeric field.');
    return v;
  };
  const date = (v: unknown) => {
    const s = str(v, 10);
    if (
      s &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(s) ||
        Number.isNaN(Date.parse(s)) ||
        new Date(s).toISOString().slice(0, 10) !== s)
    )
      throw new Error('Invalid date.');
    return s;
  };
  const bool = (v: unknown): boolean => {
    if (typeof v !== 'boolean') throw new Error('Invalid checkbox.');
    return v;
  };
  const base = newProject(str(p.title, 200), str(p.blueprintId, 200), str(p.brief), str(p.bom));
  const costs = p.costs;
  if (
    !costs ||
    !Array.isArray(p.suppliers) ||
    p.suppliers.length > 100 ||
    !Array.isArray(p.payments) ||
    p.payments.length !== 3
  )
    throw new Error('Invalid project structure.');
  for (const key of Object.keys(defaultCosts) as (keyof Costs)[]) {
    if (key === 'dutyBasis') base.costs[key] = str(costs[key]);
    else base.costs[key] = num(costs[key]);
  }
  if (!Number.isInteger(base.costs.quantity) || base.costs.quantity < 1 || base.costs.contingency > 100)
    throw new Error('Invalid quantity or contingency.');
  base.quoteBasis = str(p.quoteBasis, 500);
  base.suppliers = p.suppliers.map((s: Supplier) => ({
    id: str(s.id, 200),
    name: str(s.name, 200),
    role: str(s.role, 200),
    contact: str(s.contact, 500),
    evidence: str(s.evidence),
    unitPrice: num(s.unitPrice),
    moq: num(s.moq),
    leadDays: num(s.leadDays),
    incoterm: str(s.incoterm, 200),
    scope: str(s.scope),
  }));
  if (new Set(base.suppliers.map((s) => s.id)).size !== base.suppliers.length)
    throw new Error('Duplicate supplier IDs.');
  base.selectedSupplier = str(p.selectedSupplier, 200);
  if (base.selectedSupplier && !base.suppliers.some((s) => s.id === base.selectedSupplier))
    throw new Error('Selected supplier is missing.');
  base.payments = p.payments.map((m: Payment, i: number) => ({
    id: base.payments[i].id,
    title: str(m.title, 200),
    percent: num(m.percent, 100),
    date: date(m.date),
    evidence: str(m.evidence),
    paid: bool(m.paid),
  }));
  for (const gate of gates) {
    const r = p.records?.[gate.id];
    if (!r) continue;
    if (
      !Array.isArray(r.checks) ||
      r.checks.some((k: unknown) => typeof k !== 'string' || !(gate.checks as readonly string[]).includes(k))
    )
      throw new Error('Invalid gate checklist.');
    base.records[gate.id] = {
      checks: [...new Set(r.checks as string[])],
      evidence: str(r.evidence),
      owner: str(r.owner, 200),
      date: date(r.date),
    };
  }
  return base;
}
