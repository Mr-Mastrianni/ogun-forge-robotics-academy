/** Original teaching material adapted from the user-supplied manufacturing transcript.
 * Numerical examples are scenarios, never current tariff quotes or legal determinations. */
export const sources = [
  {
    label: 'CBP · importing and product-specific requirements',
    url: 'https://www.help.cbp.gov/s/article/Article-1894?language=en_US',
  },
  { label: 'USITC · current Harmonized Tariff Schedule', url: 'https://hts.usitc.gov/' },
  { label: 'Trade.gov · total landed cost', url: 'https://www.trade.gov/determine-total-export-price' },
  {
    label: 'FCC · module certification and integration (KDB 996369)',
    url: 'https://apps.fcc.gov/oetcf/kdb/index.cfm',
  },
  {
    label: 'European Commission · CE marking',
    url: 'https://single-market-economy.ec.europa.eu/single-market/ce-marking_en',
  },
  { label: 'SINOSURE · export credit insurance', url: 'https://www.sinosure.com.cn/en/' },
  {
    label: 'WIPO · protecting intellectual property abroad',
    url: 'https://www.wipo.int/en/web/sme/ip-business',
  },
];
export interface ManufacturingModule {
  id: string;
  title: string;
  minutes: number;
  summary: string;
  sections: { title: string; body: string }[];
  terms: { term: string; definition: string }[];
  exercise: string;
  quiz: { question: string; choices: string[]; answer: number; explanation: string }[];
}
export const manufacturingModules: ManufacturingModule[] = [
  {
    id: 'validate',
    title: '01 · Prove the product before the mold',
    minutes: 15,
    summary: 'Turn a robotics blueprint into a testable product proposition and a small first experiment.',
    sections: [
      {
        title: 'Start with a person and a measurable problem',
        body: 'Write who will buy the device, what task it improves, the operating environment, and a measurable acceptance target. A working demonstration is evidence of engineering; customer interviews, paid pilots and realistic conversion tests are evidence of demand. Keep the two separate.',
      },
      {
        title: 'Choose how much to customize',
        body: 'Compare an existing product with your branding, an existing design with targeted modifications, and a fully custom device. ODM usually refers to a manufacturer-developed design; OEM is used inconsistently across suppliers. Describe actual design responsibility, firmware access, ownership and change rights instead of relying on the acronym.',
      },
      {
        title: 'Run a small, honest validation',
        body: 'Test willingness to pay with interviews, a prototype demonstration or a clearly described pilot. Preorders need realistic delivery expectations and a refund plan. Avoid committing to tooling or inventory before identifying a credible buyer and checking the economics. Robotics and living-material projects may require much more validation than a simple consumer accessory.',
      },
    ],
    terms: [
      {
        term: 'MOQ',
        definition:
          'Minimum order quantity a supplier offers for a particular specification and commercial arrangement; it can change with setup costs, components and scheduling.',
      },
      {
        term: 'ODM',
        definition:
          'Original design manufacturing: a supplier provides an underlying design. Customization and ownership rights must be agreed explicitly.',
      },
      {
        term: 'Demand validation',
        definition:
          'Documented evidence that a defined customer values the proposed product at a viable price.',
      },
    ],
    exercise:
      'In a project’s Demand gate, record a buyer, target price, evidence from a pilot or interview, and the next experiment. Start with one product variant.',
    quiz: [
      {
        question: 'Your prototype works. What remains unproven?',
        choices: [
          'Whether customers will buy at a viable price',
          'That any engineering is possible',
          'That you must buy a mold',
        ],
        answer: 0,
        explanation: 'Technical feasibility and demand are distinct risks; validate both.',
      },
      {
        question: 'A factory offers a low MOQ with its standard enclosure. What should you compare?',
        choices: [
          'Only the logo color',
          'Total setup cost, design rights and suitability',
          'Only the largest-volume price',
        ],
        answer: 1,
        explanation: 'An inexpensive trial still needs suitable specifications and clear ownership.',
      },
      {
        question: 'What is the strongest early commitment?',
        choices: [
          'A large speculative production order',
          'Five untested color variants',
          'A limited pilot with measurable success criteria',
        ],
        answer: 2,
        explanation: 'A small pilot produces evidence while limiting exposure.',
      },
    ],
  },
  {
    id: 'economics',
    title: '02 · Know what one unit really costs',
    minutes: 20,
    summary: 'Compare quotes on the same basis and model profit and cash exposure before ordering.',
    sections: [
      {
        title: 'A quote is not a landed cost',
        body: 'Separate unit price, packaging, tooling/NRE, testing, origin transport, freight, insurance, duties, brokerage and destination delivery. Identify what the quote includes before adding costs; a delivered quote can already include freight and duties. Allocate batch costs across the actual order, and compare both repeat-run landed cost and first-run cash burden.',
      },
      {
        title: 'Trade terms allocate responsibilities',
        body: 'EXW places extensive collection and export responsibilities on the buyer. FOB is for sea or inland-waterway transport and transfers risk when goods are on board at the named port. DDP places extensive delivery and import responsibilities on the seller. State the named place and Incoterms version in the contract. Price, risk transfer and legal importer responsibilities are separate questions.',
      },
      {
        title: 'Margin is not markup',
        body: 'Gross margin equals (selling price minus landed cost) divided by selling price. A three-times price-to-cost ratio gives about 66.7% gross margin before other expenses; it is a planning heuristic, not a guarantee of viability. Subtract payment fees, advertising, returns, warranty and fulfillment to estimate contribution. Model tooling and testing separately to see how many sales might recover them.',
      },
      {
        title: 'Customs assumptions need a date and evidence',
        body: 'Record destination, country of origin, product classification and an estimate supplied by your broker. Rates and additional measures can change. Routing goods through another country does not by itself change origin. Use the current HTS and obtain classification help when uncertain. This calculator accepts a manually confirmed duty amount per unit; it does not determine customs value or classification.',
      },
    ],
    terms: [
      {
        term: 'Landed cost',
        definition:
          'The cost of getting a unit to its defined destination, including applicable transport, duties and fees.',
      },
      {
        term: 'NRE',
        definition:
          'Non-recurring engineering: one-time engineering, setup or tooling expenditure; broader than molds alone.',
      },
      {
        term: 'Contribution',
        definition:
          'Revenue remaining after product and variable selling costs, available for fixed costs and profit.',
      },
    ],
    exercise:
      'Enter a small order in the Costs tab, then compare 100 and 1,000 units. Notice how one-time costs change first-run exposure without assuming bulk orders are always wiser.',
    quiz: [
      {
        question: 'A $30 product has $10 landed cost. Gross margin is…',
        choices: ['200%', '33.3%', '66.7%'],
        answer: 2,
        explanation: '(30 − 10) / 30 = 66.7%. Markup would be 200%.',
      },
      {
        question: 'A DDP quote already includes duty. What do you enter as additional duty?',
        choices: ['The same duty again', 'Zero, after confirming the scope', 'An arbitrary 37.5%'],
        answer: 1,
        explanation: 'Add only costs outside the agreed quote to avoid double-counting.',
      },
      {
        question: 'What determines the import duty estimate?',
        choices: [
          'The transcript’s example rate',
          'The brand name alone',
          'Classification, origin, entry date and applicable measures',
        ],
        answer: 2,
        explanation: 'There is no universal duty rate for robotics products.',
      },
    ],
  },
  {
    id: 'suppliers',
    title: '03 · Find and qualify production partners',
    minutes: 20,
    summary: 'Build a supplier shortlist using evidence, comparable RFQs and respectful negotiation.',
    sections: [
      {
        title: 'Send the same RFQ to several candidates',
        body: 'An RFQ should identify product revision, drawings, BOM, quantity tiers, quality targets, packaging, delivery location and quote deadline. Ask separately for samples, tooling ownership, lead time, payment milestones and included testing. Never send confidential design files before deciding what protections and access controls you need.',
      },
      {
        title: 'Verify capability rather than judging appearances',
        body: 'Record the legal entity, actual manufacturing site, factory versus trading-company role, relevant products, capacity, references and subcontracting. A video tour or independent audit helps verify the site. A trading company can be useful for small orders; its role should be transparent. A low price or broad catalog is a signal to investigate, not proof of misconduct.',
      },
      {
        title: 'Negotiate the supplier’s costs and your risk',
        body: 'Ask whether a setup fee, standard finish, existing mold or fewer variants makes a smaller run viable. Compare written quote revisions. Keep quality specifications fixed; a lower price obtained by silent material substitution is not a saving. Show a credible reorder plan without promising orders you cannot place.',
      },
      {
        title: 'Relationships work best with clear records',
        body: 'Use the supplier’s practical communication channel, agree who has decision authority, pay according to agreed terms and handle disagreements respectfully. Confirm specification, cost and schedule changes in a durable written record. Factory ownership, sales role, nationality or follower counts do not establish competence or trustworthiness.',
      },
    ],
    terms: [
      {
        term: 'RFQ',
        definition:
          'Request for quotation: a common specification package suppliers use to price comparable work.',
      },
      {
        term: 'Supplier qualification',
        definition:
          'Documented evaluation of capability, identity, quality controls, delivery capacity and commercial suitability.',
      },
      {
        term: 'Change control',
        definition:
          'A recorded review and approval process for changes to materials, design, cost or schedule.',
      },
    ],
    exercise:
      'Add at least three supplier candidates and document capability evidence. Download the project RFQ and compare quotes at the same quantity and delivery basis.',
    quiz: [
      {
        question: 'The cheapest quote omits packaging and inspection. Is it comparable?',
        choices: [
          'Yes, price is all that matters',
          'Only after normalizing the scope',
          'Never request clarification',
        ],
        answer: 1,
        explanation: 'Compare equivalent specifications and inclusions.',
      },
      {
        question: 'Which supports qualification?',
        choices: [
          'Relevant production references and verified site evidence',
          'A confident sales pitch alone',
          'A low MOQ alone',
        ],
        answer: 0,
        explanation: 'Capability must be backed by evidence tied to your product.',
      },
      {
        question: 'Which may help a small trial order?',
        choices: [
          'Threatening an unrealistic future order',
          'Removing safety tests',
          'Standard components and an agreed setup fee',
        ],
        answer: 2,
        explanation:
          'Reducing setup burden can improve a supplier’s economics without weakening requirements.',
      },
    ],
  },
  {
    id: 'samples',
    title: '04 · Engineer, sample and freeze the design',
    minutes: 20,
    summary: 'Move from CAD and BOM to a controlled golden sample and a production-ready specification.',
    sections: [
      {
        title: 'Design for manufacturing',
        body: 'Submit revision-controlled CAD, drawings, tolerances, materials, electrical interfaces and firmware requirements for DFM review. Ask what cannot be made consistently, what needs a new process and what drives cost. Verify assembly access, serviceability, test fixtures, critical component availability and the actual manufacturing route.',
      },
      {
        title: 'Treat samples as experiments',
        body: 'Record each sample revision, test method, measurements, failures and corrective actions. T1 means an early tooling trial, not production approval. Robotics tests may include stall behavior, thermal rise, battery protection, connector retention, sensor accuracy and emergency stop performance. Define your own product-specific tests before evaluating samples.',
      },
      {
        title: 'Freeze a golden sample and its documents',
        body: 'Both parties retain an identified, approved reference sample and matching specification revision. Record photographs, measured acceptance criteria, firmware version, packaging and approval date. A sample cannot replace drawings and tolerances. Any later material or firmware change needs an impact review and renewed approval where appropriate.',
      },
      {
        title: 'Stage the investment',
        body: 'Use a prototype, an engineering validation build, a design validation build and a production validation build when complexity warrants them. Do not confuse simulated performance in the academy with tested hardware readiness. Budget iteration and schedule buffers; tooling and transport times vary by project, supplier and season.',
      },
    ],
    terms: [
      {
        term: 'DFM',
        definition:
          'Design for manufacturing: reviewing a design against the constraints of the intended production process.',
      },
      {
        term: 'Golden sample',
        definition:
          'An identified approved reference unit tied to a controlled specification and test record.',
      },
      {
        term: 'Design freeze',
        definition: 'An agreed baseline revision; later changes require explicit review and approval.',
      },
    ],
    exercise:
      'Record CAD/BOM revision and DFM findings in Engineering, then attach sample test references and a golden-sample identifier in Sample approval.',
    quiz: [
      {
        question: 'A beautiful sample fails the thermal test. Next step?',
        choices: [
          'Approve based on appearance',
          'Record the failure, correct it and retest',
          'Ship the full batch',
        ],
        answer: 1,
        explanation: 'Approval follows measurable acceptance criteria.',
      },
      {
        question: 'What should identify the golden sample?',
        choices: [
          'Only “looks good”',
          'Only the supplier name',
          'Sample ID, specification revision, test record and approval',
        ],
        answer: 2,
        explanation: 'The reference must be unambiguous and traceable.',
      },
      {
        question: 'A material change after design freeze requires…',
        choices: ['Impact review and recorded approval', 'No documentation', 'Only a new product photo'],
        answer: 0,
        explanation: 'Material changes can affect safety, durability and certification.',
      },
    ],
  },
  {
    id: 'quality',
    title: '05 · Quality, compliance and ownership',
    minutes: 25,
    summary: 'Define acceptance before production and retain evidence for release decisions.',
    sections: [
      {
        title: 'Agree quality before paying for the run',
        body: 'Specify critical, major and minor defect definitions, sampling plan, inspection level, acceptance/rejection criteria, test equipment and corrective-action process. AQL (acceptance quality limit) is part of a sampling scheme, not a promise that every shipped unit is good. Safety-critical characteristics may need complete testing rather than sample inspection.',
      },
      {
        title: 'Use independent evidence at the right time',
        body: 'Plan incoming checks, in-process controls and a pre-shipment inspection. Tie payment milestones to agreed evidence. Record failures, rework and reinspection. An inspector checks the agreed scope; an inspection does not itself certify regulatory compliance or eliminate latent defects.',
      },
      {
        title: 'Plan product-specific compliance early',
        body: 'A certified radio module can reduce work when integration follows its approval conditions, but it does not automatically clear the finished device. Review host emissions, antennas, RF exposure, labeling and other applicable requirements. CE is a conformity marking under applicable EU legislation, not a single universal certificate. Batteries, toys, machinery, living materials and medical claims can each create additional obligations. Record an applicability review with a qualified lab before commercial release.',
      },
      {
        title: 'Protect files, tooling and the brand',
        body: 'Document who owns CAD, firmware, test fixtures and molds, where tooling is stored, and whether it can be transferred or used for others. Obtain jurisdiction-appropriate advice on confidentiality, non-use/non-circumvention terms, trademarks and design protection. The transcript’s litigation strategies and contract suggestions are topics for counsel to assess, not automatic enforcement rights or ready-made contracts.',
      },
    ],
    terms: [
      {
        term: 'AQL',
        definition:
          'Acceptance quality limit used with an agreed statistical sampling plan and acceptance criteria.',
      },
      {
        term: 'Traceability',
        definition:
          'The ability to link a product or batch to materials, revisions, tests and release records.',
      },
      {
        term: 'NNN',
        definition:
          'Non-disclosure, non-use and non-circumvention provisions; effectiveness depends on drafting, jurisdiction and circumstances.',
      },
    ],
    exercise:
      'Write the inspection plan, defect definitions, lab review and tooling ownership references in the Compliance and Pilot gates. Self-recorded evidence is not a certification.',
    quiz: [
      {
        question: 'Does a certified radio module automatically approve the complete robot?',
        choices: [
          'Yes, always',
          'Only if the enclosure is plastic',
          'No; host and integration requirements still need review',
        ],
        answer: 2,
        explanation: 'Module approval is conditional and does not remove all host obligations.',
      },
      {
        question: 'What does AQL sampling guarantee?',
        choices: [
          'No defects in any unit',
          'An agreed statistical acceptance decision, with sampling risk',
          'Regulatory approval',
        ],
        answer: 1,
        explanation: 'Sampling is a quality tool, not a zero-defect guarantee.',
      },
      {
        question: 'Who owns tooling you funded?',
        choices: [
          'Whoever the contract establishes; document it explicitly',
          'Automatically every customer of the factory',
          'Always the designer',
        ],
        answer: 0,
        explanation: 'Payment alone is not a substitute for explicit ownership and use terms.',
      },
    ],
  },
  {
    id: 'scale',
    title: '06 · Fund the run and move the goods',
    minutes: 20,
    summary:
      'Model milestone payments, logistics, warranty and reorders without trapping all your cash in inventory.',
    sections: [
      {
        title: 'Cash timing can matter more than unit discounts',
        body: 'Compare deposit, inspection and shipment payments against actual cash available and realistic sales timing. A 30/70 or 30/40/30 split is a scenario to negotiate, not an entitlement. Confirm when each percentage is due and what invoice amount it applies to. The workspace models percentages of the quoted goods value; tooling, testing and additional logistics remain separate cash needs.',
      },
      {
        title: 'Supplier credit needs underwriting',
        body: 'Export credit insurance such as SINOSURE may help a supplier offer deferred terms. Availability, insured scope, cost and buyer approval depend on the supplier, insurer and transaction. Ask whether insurance cost is included in the price. Never fund the launch on the assumption that an insurer will approve net-90 or net-120 terms.',
      },
      {
        title: 'Build the shipping and fulfillment plan',
        body: 'Confirm packaging dimensions, freight mode, dangerous-goods handling for batteries, importer arrangements, customs documents and delivery destination. A 3PL stores and fulfills inventory; compare location-specific freight, duties, service levels, returns and backup routing. Plan holiday closures and supplier-confirmed lead times rather than reusing a date from a video.',
      },
      {
        title: 'Close the loop after delivery',
        body: 'Record incoming checks, defect and return rates, warranty cost and customer feedback by batch. Update reorder timing from actual sell-through, replenishment lead time and safety stock needs. A companion app, maintainable firmware and useful service can add value, but recurring revenue also creates support, privacy and maintenance responsibilities.',
      },
    ],
    terms: [
      {
        term: '3PL',
        definition:
          'Third-party logistics provider offering services such as warehousing, order fulfillment and returns.',
      },
      {
        term: 'Cash exposure',
        definition:
          'Money committed before corresponding receipts, including goods, development, logistics and contingencies.',
      },
      {
        term: 'Supplier credit',
        definition: 'Agreed deferred payment terms; eligibility and conditions must be confirmed in writing.',
      },
    ],
    exercise:
      'Compare 30/70 with 30/40/30 in Payments. Add dates and release evidence. Finish with a shipping plan and a post-delivery review before reordering.',
    quiz: [
      {
        question: 'What should a final payment depend on?',
        choices: [
          'An agreed milestone and its release evidence',
          'A sales promise alone',
          'The video’s suggested date',
        ],
        answer: 0,
        explanation: 'Use the written agreement and verified evidence.',
      },
      {
        question: 'How should net-90 insurance-backed terms be budgeted?',
        choices: [
          'As guaranteed for every first order',
          'As unconfirmed until approved in writing',
          'As free money',
        ],
        answer: 1,
        explanation: 'Insurer and supplier approval are not automatic.',
      },
      {
        question: 'A second warehouse is useful when…',
        choices: [
          'It always removes duties',
          'It makes customs origin irrelevant',
          'The service and landed-cost scenario supports it',
        ],
        answer: 2,
        explanation: 'Additional fulfillment locations introduce their own costs and obligations.',
      },
    ],
  },
];
export const gates = [
  {
    id: 'demand',
    title: 'Demand',
    module: 'validate',
    checks: ['buyer', 'validation', 'target'],
    labels: [
      'Buyer and problem defined',
      'Demand evidence recorded',
      'Target price and success criteria agreed',
    ],
    prompt: 'Buyer, problem, interview/pilot results, target price and measurable criteria.',
  },
  {
    id: 'engineering',
    title: 'Engineering',
    module: 'samples',
    checks: ['spec', 'dfm', 'bom'],
    labels: ['Specification revision identified', 'DFM review recorded', 'BOM and test plan reviewed'],
    prompt: 'CAD and BOM revisions, DFM reviewer/findings, test plan and open risks.',
  },
  {
    id: 'sourcing',
    title: 'Sourcing',
    module: 'suppliers',
    checks: ['quotes', 'vet', 'terms'],
    labels: ['Comparable quotes reviewed', 'Selected supplier qualified', 'Commercial terms documented'],
    prompt: 'Quote references, due diligence, supplier selection rationale and agreed terms.',
  },
  {
    id: 'compliance',
    title: 'Compliance & IP',
    module: 'quality',
    checks: ['scope', 'rights', 'plan'],
    labels: [
      'Applicable requirements reviewed',
      'Design and tooling rights documented',
      'Lab/testing plan agreed',
    ],
    prompt: 'Target market, lab/adviser review, applicable requirements, ownership and test references.',
  },
  {
    id: 'sample',
    title: 'Sample approval',
    module: 'samples',
    checks: ['tested', 'golden', 'freeze'],
    labels: ['Acceptance tests passed', 'Golden sample approved', 'Design revision frozen'],
    prompt: 'Sample ID, measured test results, specification/firmware revision, approver and date.',
  },
  {
    id: 'pilot',
    title: 'Pilot production',
    module: 'quality',
    checks: ['po', 'inspection', 'corrective'],
    labels: ['Pilot PO and schedule agreed', 'Inspection plan approved', 'Pilot defects resolved'],
    prompt:
      'Purchase order reference, quantity, schedule, inspection criteria, defects and reinspection results.',
  },
  {
    id: 'shipping',
    title: 'Inspection & shipping',
    module: 'scale',
    checks: ['release', 'customs', 'freight'],
    labels: [
      'Pre-shipment release recorded',
      'Customs and battery documents ready',
      'Freight and fulfillment confirmed',
    ],
    prompt:
      'Inspection report, release decision, payment authorization, shipping and customs document references.',
  },
  {
    id: 'review',
    title: 'Delivery & reorder',
    module: 'scale',
    checks: ['received', 'feedback', 'reorder'],
    labels: [
      'Incoming batch checked',
      'Warranty and customer feedback reviewed',
      'Reorder decision justified',
    ],
    prompt: 'Received quantity/date, batch quality, sell-through, warranty costs and reorder decision.',
  },
] as const;
