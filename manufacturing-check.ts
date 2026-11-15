import {
  calculateCosts,
  clearedGates,
  defaultCosts,
  emptyRecord,
  newProject,
  parseProjectBackup,
  paymentValid,
  rfqText,
} from './src/lib/manufacturing';
import { gates, manufacturingModules } from './src/content/manufacturing';
import { useManufacturing } from './src/lib/manufacturingStore';
let checks = 0;
function check(ok: boolean, message: string) {
  if (!ok) throw new Error(message);
  checks++;
}
const c = {
  ...defaultCosts,
  quantity: 100,
  unitPrice: 8,
  packaging: 0.4,
  freight: 0.6,
  duty: 3.15,
  batchFees: 35,
  tooling: 1000,
  testing: 500,
  retail: 40,
  selling: 5,
};
const v = calculateCosts(c);
check(v.repeatUnit === 12.5, 'landed cost includes unit and batch costs');
check(v.firstUnit === 27.5 && v.total === 2750, 'first run amortizes setup once');
check(
  v.grossMargin === 0.6875 && v.contribution === 22.5 && v.breakEven === 67,
  'margin and recovery calculations',
);
check(calculateCosts({ ...c, retail: 0 }).grossMargin === null, 'zero revenue does not divide by zero');
check(calculateCosts({ ...c, retail: 1 }).breakEven === null, 'negative contribution is not recoverable');
const p = newProject('Test', 'blueprint', 'Robot brief', '1 × sensor');
p.costs = c;
check(clearedGates(p) === 0, 'new project gates start open');
for (const gate of gates)
  p.records[gate.id] = {
    checks: [...gate.checks],
    evidence: 'Document revision and test report',
    owner: 'Reviewer',
    date: '2026-11-15',
  };
check(clearedGates(p) === 2, 'sourcing cannot clear without selected qualified partner');
p.suppliers = [
  {
    id: 's',
    name: 'Sample test entity',
    contact: '',
    role: 'Factory · verify',
    evidence: 'Verification record',
    unitPrice: 8,
    moq: 100,
    leadDays: 30,
    incoterm: 'EXW',
    scope: '100 units excluding freight',
  },
];
p.selectedSupplier = 's';
check(clearedGates(p) === 8, 'all documented gates clear in sequence');
p.records.demand.evidence = '';
check(clearedGates(p) === 0, 'removing upstream evidence reopens sequence');
p.records.demand = {
  ...emptyRecord(),
  checks: [...gates[0].checks],
  evidence: 'Test',
  owner: '',
  date: '2026-11-15',
};
check(clearedGates(p) === 0, 'missing reviewer blocks gate');
check(paymentValid(p), '30/40/30 is valid');
p.payments[0].percent = 50;
check(!paymentValid(p), 'overallocated payments invalid');
p.payments[0].percent = 30;
const raw = JSON.stringify({ version: 1, project: p });
const restored = parseProjectBackup(raw);
check(
  restored.id !== p.id && restored.title === p.title && restored.bom === p.bom,
  'import clones safely without overwriting',
);
check(
  restored.selectedSupplier === 's' && restored.costs.unitPrice === 8,
  'import preserves supplier and costs',
);
for (const change of [
  (x: any) => {
    x.version = 99;
  },
  (x: any) => {
    x.project.costs.quantity = 0;
  },
  (x: any) => {
    x.project.costs.quantity = 1.5;
  },
  (x: any) => {
    x.project.costs.unitPrice = -1;
  },
  (x: any) => {
    x.project.records.demand.checks = ['fake'];
  },
  (x: any) => {
    x.project.payments[0].paid = 'true';
  },
  (x: any) => {
    x.project.selectedSupplier = 'missing';
  },
]) {
  const data = JSON.parse(raw);
  change(data);
  let rejected = false;
  try {
    parseProjectBackup(JSON.stringify(data));
  } catch {
    rejected = true;
  }
  check(rejected, 'invalid import rejected');
}
check(
  rfqText(p).includes('1 × sensor') && rfqText(p).includes('Robot brief'),
  'RFQ contains project brief and BOM',
);
useManufacturing.setState({ projects: [{ ...p, payments: p.payments.map((m) => ({ ...m, paid: true })) }] });
useManufacturing.getState().update(p.id, { costs: { ...p.costs, unitPrice: 10 } });
check(
  useManufacturing.getState().projects[0].payments.every((m) => !m.paid),
  'changing invoice invalidates recorded amounts',
);
for (const m of manufacturingModules) {
  check(
    m.quiz.every((q) => q.answer >= 0 && q.answer < q.choices.length),
    `valid answers: ${m.id}`,
  );
  check(m.terms.length >= 3 && m.sections.length >= 3, `complete teaching content: ${m.id}`);
}
console.log(`MANUFACTURING_OK · ${checks} checks`);
