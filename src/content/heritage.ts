import type { AtlasEntry, ColorPalette } from './types';

/**
 * Heritage Atlas — Afrocentric science & technology lineage.
 *
 * Editorial rules used throughout this file:
 *  - Civilisations are never conflated: Yoruba, Akan, Kemet, Kush/Meroë, Nok,
 *    Haya, Aksum, Dogon, Songhai, Shona, Zulu and Ndebele are distinct peoples.
 *  - Every entry carries an honest epistemic `status`. Contested material is
 *    labelled `disputed` or `archaeological` and the disagreement is named in
 *    the body text rather than hidden.
 *  - "Sources" are real, citable URLs (museum catalogues, UNESCO records,
 *    peer-reviewed journals, national research institutes). No invented links.
 */

export const heritageEntries: AtlasEntry[] = [
  /* ------------------------------------------------------------------ */
  /* 1 · Ọ̀gún                                                            */
  /* ------------------------------------------------------------------ */
  {
    id: 'ogun-orisha-iron',
    title: 'Ọ̀gún — Orisha of Iron, Tools, Roads and Transformation',
    culture: 'Yoruba · Nigeria, Benin, Togo (and the Yoruba diaspora)',
    region: 'West Africa · Yorubaland',
    era: 'Oral tradition; cult attested for many centuries, documented from the 19th c. CE',
    hook: 'Before anyone wrote the word "engineer", Yoruba tradition had a deity whose whole domain was the transformation of ore into tools.',
    detail:
      'Ọ̀gún is the ìrúnmọlẹ̀ (orisha) of iron, of the tools made from it, of roads and of the transformative act of making. In Yoruba narrative he clears the path for the other orisha and for human settlement; he is the patron of the blacksmith, the hunter, the warrior, the driver and anyone whose work depends on a blade or a machine. The smith holds a recognised social office: the forge (ilé-ẹ̀dì) is a workshop, an initiation school and a ritual space at once, and the smith\'s authority to heat, hammer and quench is treated as a delegated form of Ọ̀gún\'s power. Ironworking in West Africa is archaeologically deep — smelting traditions in the Nsukka area of Nigeria reach back into the early first millennium BCE — so the orisha condenses centuries of accumulated metallurgical craft knowledge into a figure who can be remembered, invoked and taught.',
    engineeringLesson:
      'Treat the tool as the primary artefact and the material as secondary. Ọ̀gún\'s forge is a process definition — acquire ore, control the fire, form the part, harden it, put it back into circulation — and it carries the idea that capability propagates through the tools it produces. Every robot you ship is also a tool factory: its value compounds through what it makes possible downstream.',
    glyph: '⚒',
    status: 'living-tradition',
    tags: ['metallurgy', 'craft', 'orisha', 'tools', 'technology-as-culture'],
    lessonLinks: ['w1l1', 'w1l2'],
    sources: [
      { label: 'Encyclopaedia Britannica — Ogun (Yoruba deity)', url: 'https://www.britannica.com/topic/Ogun-deity' },
      { label: 'Smithsonian Libraries — record: "The historical background of Ogun"', url: 'https://collections.si.edu/search/detail/edanmdm:siris_sil_734782' },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 2 · Ifá divination                                                   */
  /* ------------------------------------------------------------------ */
  {
    id: 'ifa-divination-odu',
    title: 'Ifá Divination — 16 Odù × 16 = 256 Combinations',
    culture: 'Yoruba · Nigeria, Benin, Togo; Cuban and Brazilian diaspora forms',
    region: 'West Africa · Yorubaland, with Atlantic diaspora practice',
    era: 'Classical oral corpus; transcribed from the 19th c. CE onward',
    hook: 'A knowledge system that resolves a question by indexing a 256-cell lookup table of remembered precedent.',
    detail:
      'In Ifá, the babaláwo casts the divination chain (ọ̀pẹ̀lẹ̀) or palm nuts (ikin) to select one of sixteen principal odù; that odù plus a second produces one of 16 × 16 = 256 composite odù (the ẹ̀kọ́-odù / "amulu"). Each odù carries a body of verse (itán) — origin stories, case history, prescriptions, taboo lists — that the diviner recites and applies to the client\'s situation. The mechanism is a decision procedure over a finite symbolic space with a large attached corpus of indexed precedent. **Debate to flag:** it is common in popular writing to call Ifá "binary computing" or a 256-bit code. The parity structure of the eight-mark figures genuinely is a two-state combinatorial coding, and 256 = 2^8 is a real mathematical fact about the system. But Ifá is not an arithmetic machine or a stored-program computer, and several scholars of Yoruba religion and of the history of mathematics argue that retro-projecting modern computing categories onto it distorts a ritual and jurisprudential practice. The defensible claim is: a structured, combinatorial, precedent-indexed inference system that uses two-state marks.',
    engineeringLesson:
      'A finite symbolic state space with a rich indexed lookup table is a legitimate reasoning architecture. Ifá is a database-driven expert system whose "training data" is memorised human case history, with the crucial discipline that the practitioner must interpret, not just retrieve. When you build a rule-based or retrieval-augmented system, keep the interpreter in the loop and treat the corpus as precedent, not oracle.',
    glyph: '||||',
    status: 'living-tradition',
    tags: ['combinatorics', 'knowledge-representation', 'decision-making', 'orisha', 'base-2-debate'],
    lessonLinks: ['w1l2', 'w7l13', 'w8l15'],
    sources: [
      { label: 'UNESCO Intangible Cultural Heritage — Ifa divination system', url: 'https://ich.unesco.org/en/RL/ifa-divination-system-00146' },
      { label: 'Ifa Divination System as Binary Intelligence (Zenodo preprint — note: not peer reviewed)', url: 'https://zenodo.org/records/21404037' },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 3 · Adinkra                                                          */
  /* ------------------------------------------------------------------ */
  {
    id: 'adinkra-symbol-system',
    title: 'Adinkra — A Compact Visual Language of Ethics and Systems Thinking',
    culture: 'Akan · Asante and other Akan peoples, Ghana; also Côte d\'Ivoire',
    region: 'West Africa · Ashanti Region and Akan lands',
    era: 'Attested from at least the early 19th c. CE; the corpus continues to grow today',
    hook: 'Hundreds of stamped symbols, each a proverb compressed into geometry, printed in grids onto cloth that is worn as an argument.',
    detail:
      'Adinkra is a stamped-symbol system: carved calabash stamps are dipped in a dark iron-rich ink (badie, boiled from tree bark) and printed in grid and border patterns onto cloth, historically for funerary and prestige use. Each symbol has a Twi name and a meaning that is usually a proverb or a principle. Well-documented examples, with the readings most commonly given by Akan scholars and museum catalogues, include: **Gye Nyame** ("except God") — the supremacy of the divine; **Sankofa** (a bird turning its head to take an egg from its back) — it is not taboo to go back for what you have forgotten; **Nyame Nti** ("because of God") — faith and endurance; **Nyame Biribi Wɔ Soro** ("God, there is something in the heavens") — hope; **Fihankra** (a compound house with a central courtyard) — security and the sanctity of home; **Akoma** (heart) — patience and tolerance; **Akoma Ntoso** (linked hearts) — unity and understanding; **Nkyinkyim** (zigzag) — adaptability, initiative, changing with circumstance; **Dwennimmen** (ram\'s horns) — humility together with strength; **Sesa Woruban** (a changing/stirring life) — transformation; **Adinkrahene** (chief of the Adinkra symbols, concentric circles) — leadership, charisma, greatness; **Epa** (handcuffs) — law, justice and slavery\'s cautionary memory; **Ohene Aniwa** (king\'s eyes); **Nsaa** (a woven blanket) — excellence and authenticity; **Mframadan** (wind-resistant house) — resilience; **Bi Nka Bi** (a fish head biting another\'s tail) — peace, no one should bite another. Catalogues differ on totals — the set is open and regional variants exist — so treat "15+" as a documented floor rather than a canon. Museum catalogues also document the making (stamp carving, ink, layout), which is what allows the system to be read as a design language rather than a list of emblems.',
    engineeringLesson:
      'Adinkra is a compression format: a few square centimetres of geometry expands into a full proverb with normative force, and symbols compose into grids that carry a second, aggregate message. That is exactly what good iconography, status LEDs and error taxonomies do — one glance, high information density, unambiguous decoding by a trained community.',
    glyph: 'ⵣ',
    status: 'documented',
    tags: ['visual-language', 'semiotics', 'compression', 'ethics', 'Akan'],
    lessonLinks: ['w1l2', 'w7l14'],
    sources: [
      { label: 'Smithsonian National Museum of African Art — Adinkra stamp', url: 'https://africa.si.edu/collection/object/nmafa_2010-10-382' },
      { label: 'British Museum — Adinkra cloth (collection record)', url: 'https://www.britishmuseum.org/collection/object/E_Af2005-04-1' },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 4 · Kente                                                           */
  /* ------------------------------------------------------------------ */
  {
    id: 'kente-cloth-logic',
    title: 'Kente — Warp, Weft and a Thread-Level State Machine',
    culture: 'Asante and Ewe · Ghana, Togo',
    region: 'West Africa · Ashanti and Volta regions',
    era: 'Asante tradition traced to the 17th c. CE; weaving continues as a living industry',
    hook: 'A strip loom is a programmable machine: warp decides state, weft decides transition, and colour carries meaning.',
    detail:
      'Kente (Asante: nwentoma) is woven in narrow strips on a horizontal treadle loom; strips are sewn edge to edge into large cloths. The pattern logic is explicit and teachable: a fixed warp of many parallel threads, a weft inserted pick by pick, with the weaver switching colours and using heddle manipulation to lift warp groups and float supplementary weft patterns. Names of patterns encode meaning — **Adweneasa** ("my skill is exhausted", the most complex designs), **Sika Futuro**, **Emaa Da**, **Akyekyedeɛ Akyi** (tortoise back) — and colour is symbolic: gold for royalty and wealth, green for growth and harvest, blue for peace and harmony, black for spiritual strength and maturity, red for political passion and sacrifice, white for purification. Production is a highly formalised grammar: a finite alphabet of warp/weft states and colour blocks, recombined into an enormous pattern space. The British Museum and the Met hold documented Asante prestige cloths with catalogue notes on structure and terminology.',
    engineeringLesson:
      'A strip loom is a mechanical state machine with a discrete symbol alphabet, and the design library is a template grammar — exactly the composition model underlying CNC weaving files, procedural texture generation and modular robot gait libraries. Name your patterns: a named, versioned pattern library is the difference between a craft and a reusable engineering asset.',
    glyph: '▤',
    status: 'living-tradition',
    tags: ['textiles', 'state-machine', 'pattern-grammar', 'symbolism', 'manufacturing'],
    lessonLinks: ['w1l1', 'w3l5', 'w6l12'],
    sources: [
      { label: 'The Metropolitan Museum of Art — Asante man\'s prestige cloth (kente)', url: 'https://www.metmuseum.org/art/collection/search/320679' },
      { label: 'British Museum — Asante cloth collection record', url: 'https://www.britishmuseum.org/collection/object/E_Af2006-15-90' },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 5 · Ishango bone                                                     */
  /* ------------------------------------------------------------------ */
  {
    id: 'ishango-bone',
    title: 'The Ishango Bone — Tally Marks at the Nile\'s Source',
    culture: 'Late Stone Age communities of the Lake Edward region (attributed to an early fishing culture)',
    region: 'Central Africa · Ishango, eastern Democratic Republic of the Congo',
    era: 'c. 20,000 years BP (Upper Palaeolithic / Late Stone Age)',
    hook: 'A baboon fibula with three columns of deliberately grouped notches — the oldest contested "computer" in Africa.',
    detail:
      'Found in 1950 near the outlet of Lake Edward and now held by the Royal Belgian Institute of Natural Sciences in Brussels, the Ishango bone carries engraved tally marks arranged in three distinct groupings, with the middle column showing deliberate structure (paired, then prime-like grouping, with a distinct notch and a quartz sliver set into one end). That the marks are intentional and structured is not seriously disputed; what they *mean* is. Some scholars, notably Alexander Marshack, read the grouping as a lunar-phase record, roughly two or three months of observation. Others read it as arithmetic play (doubling, prime grouping, a base-12 habit) or as a tally of a practical count. The lunar-calendar reading is a hypothesis, not an established fact, and no unbroken interpretive chain connects this object to later Egyptian or Nubian reckoning.',
    engineeringLesson:
      'Grouping is the first act of abstraction. The moment you decide that twelve identical marks are "one thing", you have built a representation — and the representation is what a machine can operate on. Also instructive: the object is a durable, portable record medium. Persist the log, not just the count.',
    glyph: '𝍫',
    status: 'archaeological',
    tags: ['tally', 'notation', 'prehistory', 'lunar-calendar-debate', 'DRC'],
    lessonLinks: ['w1l2', 'w8l16'],
    sources: [
      { label: 'Royal Belgian Institute of Natural Sciences — the Ishango bone', url: 'https://www.naturalsciences.be/nl/museum/tentoonstellingen-activiteiten/tentoonstellingen/250-jaar-natuurwetenschappen/het-beentje-van-ishango' },
      { label: 'RBINS press document — the "oldest calculator" (PDF)', url: 'https://www.naturalsciences.be/sites/default/files/press_document_ishango.pdf' },
      { label: 'Lapham\'s Quarterly — Keith Houston, "The Early History of Counting"', url: 'https://www.laphamsquarterly.org/roundtable/early-history-counting' },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 6 · Lebombo bone                                                     */
  /* ------------------------------------------------------------------ */
  {
    id: 'lebombo-bone',
    title: 'The Lebombo Bone — The Oldest Known Tally Stick',
    culture: 'Middle Stone Age hunter-gatherers of southern Africa (Border Cave context)',
    region: 'Southern Africa · Eswatini / South Africa border region',
    era: 'c. 35,000–44,000 years BP',
    hook: 'Twenty-nine notches on a baboon fibula, older than any other counting artefact known.',
    detail:
      'Recovered from Border Cave and dated by association to roughly 44,000–35,000 years before present, the Lebombo bone is generally accepted as the oldest known tally stick. It carries 29 clear notches. Because 29 is close to the number of days in a synodic month, the object is frequently described as a lunar-phase counter. **That reading is debated and should be presented as such:** the notches\' grouping is not obviously periodic, use-wear and the possibility of a purely practical tally (or later modification) cannot be excluded, and a single artefact cannot demonstrate a calendrical system. The safe statement is: an intentionally notched, portable counting tool of extraordinary age, with a contested lunar interpretation.',
    engineeringLesson:
      'Persistence beats capacity. A crude tool that survives 40,000 years outperforms a perfect tool that leaves no record. Design your data formats and your logs for the archaeologist, not only for today\'s consumer.',
    glyph: '𝍸',
    status: 'disputed',
    tags: ['tally', 'notation', 'prehistory', 'lunar-calendar-debate', 'southern Africa'],
    lessonLinks: ['w1l2', 'w8l16'],
    sources: [
      { label: 'Wikipedia — Lebombo bone (with primary references)', url: 'https://en.wikipedia.org/wiki/Lebombo_bone' },
      { label: 'Lapham\'s Quarterly — Keith Houston, "The Early History of Counting"', url: 'https://www.laphamsquarterly.org/roundtable/early-history-counting' },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 7 · Nabta Playa                                                      */
  /* ------------------------------------------------------------------ */
  {
    id: 'nabta-playa-archaeoastronomy',
    title: 'Nabta Playa — Megalithic Alignment in the Western Desert',
    culture: 'Late Neolithic pastoralists of the Egyptian Western Desert (pre-dynastic, not dynastic Kemet)',
    region: 'North Africa · Nabta Playa, Nubian Desert, southern Egypt',
    era: 'c. 7,000 BP (roughly 9th–6th millennium BCE for the occupation; megaliths later)',
    hook: 'A ceremonial stone complex in what is now hyper-arid desert, laid out when the Sahara was green.',
    detail:
      'Nabta Playa is a Neolithic playa basin with wells, cattle remains, hearths and a group of megalithic structures, excavated from the 1970s by Fred Wendorf\'s team and later studied by archaeoastronomers including J. McKim Malville. The best-supported findings: a "calendar circle" whose lines align with the summer solstice sunrise and with the rising of stars in the Big Dipper / Orion region at the time of use, plus alignments of larger megaliths. Important limits: the site predates dynastic Kemet by millennia and belongs to a distinct desert pastoralist culture — it is **not** Egyptian temple astronomy. Claims that the complex encoded a fine-grained stellar calendar, tracked the precession of the equinoxes, or functioned as an observatory in the modern sense are pushed further than the evidence supports; some Nabta interpretations in the popular literature are openly speculative. Status: genuinely archaeological, genuinely aligned, interpretively contested in detail.',
    engineeringLesson:
      'Alignment is calibration. Fixing an instrument\'s frame of reference to an external, recurring, verifiable event (solstice sunrise) gives you a clock whose error you can measure against the sky for centuries. Modern equivalents: GNSS time, a fiducial marker, a star tracker — always tie your state estimate to something outside the machine.',
    glyph: '☉',
    status: 'archaeological',
    tags: ['archaeoastronomy', 'megalith', 'neolithic', 'alignment', 'Sahara'],
    lessonLinks: ['w2l3', 'w2l4'],
    sources: [
      { label: 'Mediterranean Archaeology and Archaeometry — Brophy & Rosen, on Nabta Playa and Sahara megaliths (PDF)', url: 'https://web.archive.org/web/20080229170244/http://www.rhodes.aegean.gr/maa_journal/issues/past%20issues/volume%205%20no1%20june%202005/brophy.pdf' },
      { label: 'ICOMOS — African World Heritage Tentative Lists workshop papers (PDF)', url: 'http://openarchive.icomos.org/id/eprint/1502/' },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 8 · Kemet water clock                                                */
  /* ------------------------------------------------------------------ */
  {
    id: 'kemet-water-clock',
    title: 'The Kemet Water Clock — Outflow Timekeeping and the Karnak Clepsydra',
    culture: 'Kemet · Nile Valley, Egypt',
    region: 'North Africa · Nile Valley (Thebes/Karnak)',
    era: 'Attested from the mid-2nd millennium BCE; the Karnak clepsydra dates to the reign of Amenhotep III (14th c. BCE)',
    hook: 'A vessel that measures hours by the water draining out of it — with a scale corrected for the seasons.',
    detail:
      'Egyptian clepsydrae (water clocks) were stone vessels with a small outflow orifice near the base and a graduated scale on the inside wall. Because the vessel empties more slowly as the head of water drops, the hour marks are not evenly spaced — the spacing compensates for the falling flow rate. The famous alabaster clepsydra of Amenhotep III from Karnak (Egyptian Museum, Cairo, JE 37525) carries decan names and month labels keyed to the seasonal hours of the night, which changed length through the year; the hour scales on that instrument are calibrated for the latitude of Thebes. This is a calibrated analog instrument: a physical process (outflow), a transfer function (head-dependent flow), and a hand-fitted scale that turns the process into a readable quantity. The seasonal-hour correction is the part that deserves the most admiration — it is instrument design that accounts for its own reference frame.',
    engineeringLesson:
      'Linearise your sensor. Any real sensor is nonlinear; the fix is not a better vessel but a calibration curve. The Karnak scale is a printed lookup table, and the seasonal-hour spacing is regime-dependent calibration. In robotics: IMU scale factors, thermocouple polynomial fits, camera intrinsics, battery open-circuit-voltage curves — measure, fit, store, apply.',
    glyph: '⏳',
    status: 'documented',
    tags: ['timekeeping', 'instrumentation', 'calibration', 'Nile-Valley', 'decan'],
    lessonLinks: ['w2l3', 'w4l7'],
    sources: [
      { label: 'McMaster University — Ancient Egyptian Water Clocks database: Amenhotep III Karnak clock (JE 37525)', url: 'https://aea.mcmaster.ca/index.php/en/database/water-clocks/wco-1-amenhotep-iii-karnak' },
      { label: 'Science Museum Group — Egyptian water clock (collection record)', url: 'https://collection.sciencemuseumgroup.org.uk/objects/co454/egyptian-water-clock' },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 9 · Shaduf & irrigation                                              */
  /* ------------------------------------------------------------------ */
  {
    id: 'kemet-shaduf-irrigation',
    title: 'Shaduf and Basin Irrigation — Leverage Against the Flood',
    culture: 'Kemet · Nile Valley, Egypt (technique also used across the Near East and later the Sahel)',
    region: 'North Africa · Nile Valley, Faiyum and the flood basins',
    era: 'New Kingdom onward (from c. 16th–14th c. BCE), with river-lift irrigation persisting into the present',
    hook: 'A counterweighted lever, a bucket and a canal network: the original low-power water-handling machine, kept in service for three thousand years.',
    detail:
      'The shaduf (Egyptian Arabic; the device appears in New Kingdom tomb scenes) is a pivoted lever with a counterweight at the short end and a bucket on a rope at the long end. An operator uses body weight and momentum to raise a few tens of litres per lift and swing it into a channel — a human-powered machine whose efficiency comes from moving the counterweight rather than the load. It sits inside a much larger hydraulic system: Nile flood basin irrigation, where floodwater was admitted through dikes and sluices into basins and then held while silt settled and the soil soaked; the Faiyum depression was intensively developed for irrigation and reclamation from the Middle Kingdom onward. Water-lifting, distribution, drainage, dike maintenance and flood prediction formed one managed system — storage and distribution scheduling on a river whose annual behaviour had to be measured and anticipated.',
    engineeringLesson:
      'Counterbalance, then distribute. The shaduf is a force-balance machine: nearly all the effort goes into resetting a mechanical state (the counterweight) rather than lifting a mass, which is the same trick in a spring-balanced robot arm or a counterweighted elevator. And the whole Nile system is a distributed scheduling problem — capacity, storage, priority and timing — which is what a power budget or a compute scheduler solves inside a robot.',
    glyph: '⚖',
    status: 'documented',
    tags: ['hydraulics', 'lever', 'irrigation', 'systems-management', 'Nile'],
    lessonLinks: ['w1l1', 'w6l11'],
    sources: [
      { label: 'International Commission on Irrigation & Drainage — lift irrigation and water-lifting devices', url: 'https://icid-ciid.org/Knowledge/basic_term/0/Lift%20Irrigation/4436' },
      { label: 'ICOMOS/UNESCO dossier on Egyptian irrigation and the Faiyum', url: 'http://openarchive.icomos.org/id/eprint/1502/' },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 10 · Temple doors & "moving statues"                                 */
  /* ------------------------------------------------------------------ */
  {
    id: 'kemet-temple-mechanisms',
    title: 'Kemet Temple Mechanisms and the "Moving Statues" Accounts',
    culture: 'Kemet · Nile Valley, Egypt',
    region: 'North Africa · Upper and Lower Egypt (Karnak, Dendera, Alexandria)',
    era: 'New Kingdom through Ptolemaic/Roman period (c. 1550 BCE – 3rd c. CE)',
    hook: 'Real bronze pivots, sockets and hidden service corridors — and, layered on top, a body of Greco-Roman stories about statues that moved.',
    detail:
      'Two very different evidence classes are usually mixed together here; keep them apart.\n\n**(a) The hardware, which is real.** Egyptian temples used massive doors turning on stone pivot bosses and bronze or stone sockets, with the leaf\'s weight carried vertically on a pivot rather than on hinges; the socket bearings at Karnak and elsewhere survive. Temples also had concealed chambers, false doors, dark sanctuaries and processional routes that structured what a visitor saw and when — an architecture of access control and staged reveal. There are documented acoustic and mechanical tricks in the wider ancient Mediterranean and Near East for animating a cult image (compressed air or liquid, hidden operators, rope-and-pulley), and the scholarly literature on ancient "thaumata" and temple machinery is substantial.\n\n**(b) The literary accounts, which are not engineering records.** Herodotus, Diodorus and later authors report priests causing statues to move, nod or speak; a frequently repeated modern claim concerns a "statue of Nilus" and similar automata. These are second-hand literary testimonia written centuries later, sometimes with satirical or theological intent, and no surviving Egyptian document specifies such a mechanism. Treat the mechanism descriptions as reconstructed or speculative, and label anything derived from them accordingly. The honest position: strong evidence for pivots, bearings, concealment and staging; weaker and often speculative evidence for self-animating statues.',
    engineeringLesson:
      'Bearings and degrees of freedom. Carrying a load on a pivot rather than a hinge edge is load-path design, and it is the reason a 5-tonne door can be moved by a few people. The second lesson is epistemic hygiene: when a mechanism is only known from a poetic or hostile textual source, say so in your datasheet. Requirements traced to a rumour become a reliability incident.',
    glyph: '🗝',
    status: 'documented',
    tags: ['mechanisms', 'bearings', 'automata', 'temple', 'source-criticism'],
    lessonLinks: ['w3l5', 'w3l6'],
    sources: [
      { label: 'McMaster University — Ancient Egyptian water clocks and temple technology database', url: 'https://aea.mcmaster.ca/index.php/en/database/water-clocks/wco-1-amenhotep-iii-karnak' },
      { label: 'ICOMOS — conservation documents on Egyptian temple architecture (PDF archive)', url: 'http://openarchive.icomos.org/id/eprint/1502/' },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 11 · Nok                                                            */
  /* ------------------------------------------------------------------ */
  {
    id: 'nok-culture-terracotta-iron',
    title: 'Nok Culture — Terracotta Sculpture and Early Iron in West Africa',
    culture: 'Nok culture · central Nigeria (not Yoruba, not Igbo — a distinct archaeological culture)',
    region: 'West Africa · Nok region, Kaduna/Nasarawa/Kogi, central Nigeria',
    era: 'c. 1500 BCE – 500 CE',
    hook: 'Sculptural ceramics of extraordinary sophistication, in the same region and centuries where West African iron smelting takes root.',
    detail:
      'The Nok culture is known above all for large hollow terracotta figures — heads and full figures with elaborate coiffure, jewellery and expressive faces — recovered from sites on the Jos Plateau margins and now in Nigerian and international museums. Archaeology (notably the long-running Frankfurt University/Nigerian collaboration) has established a chronology running from roughly 1500 BCE to the early Common Era, along with settlement and subsistence evidence. On iron: Nok-associated sites have produced smelting furnaces, tuyères and slag, and the appearance of ironworking in central Nigeria is dated into the first millennium BCE. The exact date of the earliest smelting in the region, and how much of the Nok iron industry postdates the terracotta tradition, remain actively debated — the evidence base has grown a great deal since the 2000s and earlier dates have been revised. This is not evidence of a single "inventor" people; it is a regional craft tradition with an archaeology still being refined.',
    engineeringLesson:
      'Hollow-form ceramics require wall-thickness control, controlled drying and a firing schedule — the same shrinkage and residual-stress problem a sintered metal part or a fired ceramic insulator has. And the Nok case is a lesson in evidence latency: coarse chronological resolution turns engineering history into guesswork. Improve your dating and you improve your model.',
    glyph: '◍',
    status: 'archaeological',
    tags: ['ceramics', 'iron-smelting', 'materials', 'chronology', 'Nigeria'],
    lessonLinks: ['w1l1', 'w3l6'],
    sources: [
      { label: 'Cambridge Core / Antiquity — "Exploring the Nok enigma"', url: 'https://www.cambridge.org/core/journals/antiquity-project-gallery/article/exploring-the-nok-enigma/5857AFD7964707358A803412D656E4EC' },
      { label: 'Brill, Journal of African Archaeology — "A Chronology of the Central Nigerian Nok Culture"', url: 'https://brill.com/view/journals/jaa/14/3/article-p257_2.xml' },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 12 · Haya furnaces                                                   */
  /* ------------------------------------------------------------------ */
  {
    id: 'haya-iron-steel-furnace',
    title: 'Haya Iron and Steel Furnaces — Preheated Air and High-Carbon Steel',
    culture: 'Haya people · Kagera region, Tanzania',
    region: 'East Africa · Buhaya, western Lake Victoria',
    era: 'Roughly c. 1500–2000 CE (the documented precolonial smelting tradition)',
    hook: 'A forced-draft furnace with preheated air, hot enough and reducing enough to make carbon steel before European steelmaking existed.',
    detail:
      'The Haya of the Kagera region built tall clay shaft furnaces fed by multiple tuyères connected to leather-bellows systems (in the documented forms, several bellows worked in sequence through long clay tubes). The design preheated the blast, and the furnace atmosphere was strongly reducing. Peter Schmidt and Donald Avery, publishing in *Science* in 1978, reported that the process produced high-carbon steel — carbon content comparable to or above modern steel — via a preheated forced draft, with measured or estimated operating temperatures in the region of 1500–2000 °C, temperatures the Haya smelt reached without an externally supplied blast of the industrial kind. Their interpretation has been discussed and partly qualified by later archaeometallurgists, and the precolonial dating rests on genealogical and oral-historical evidence as well as excavation, so treat the fine details as argued rather than closed. What is not in question is the core engineering achievement: heat recuperation, multi-tuyère blast distribution and slag tapping in a clay furnace producing a genuinely modern-class material.',
    engineeringLesson:
      'Preheating the oxidant raises the adiabatic flame temperature and cuts fuel demand — the same principle as an internal combustion engine\'s exhaust recuperator, a gas turbine\'s regenerator, or the Stirling/thermo-acoustic energy work in this course. It is a textbook example of spending mechanical complexity (bellows, tuyères, ducting) to buy thermal efficiency, and of process control: carbon content is set by the furnace\'s atmosphere and time history, not by the ore.',
    glyph: '🔥',
    status: 'documented',
    tags: ['metallurgy', 'steel', 'heat-recuperation', 'high-temperature', 'Tanzania'],
    lessonLinks: ['w3l5', 'w6l12'],
    sources: [
      { label: 'Science (1978) — Schmidt & Avery, "Complex Iron Smelting and Prehistoric Culture in Tanzania"', url: 'https://www.science.org/content/article/ancestors-science-complex-iron-smelting-and-prehistoric-culture-tanzania' },
      { label: 'PubMed record for Schmidt & Avery 1978, Science 201(4361):1085–9', url: 'https://pubmed.ncbi.nlm.nih.gov/17830304/' },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 13 · Meroë                                                           */
  /* ------------------------------------------------------------------ */
  {
    id: 'meroe-kush-ironworks',
    title: 'Meroë — Iron at Industrial Scale in the Kingdom of Kush',
    culture: 'Kush · Meroitic kingdom (Nubian, not Egyptian — distinct language, script and kingship)',
    region: 'Northeast Africa · Nile Valley around Meroë and the Island of Meroë, Sudan',
    era: 'c. 3rd c. BCE – 4th c. CE (Meroitic period)',
    hook: 'A capital city that produced iron in quantities large enough to leave landscape-scale slag heaps.',
    detail:
      'Meroë, capital of the Meroitic kingdom, sits in a landscape with wood fuel, iron ore and river transport in proximity — conditions for sustained smelting. The royal city itself contains extensive ironworking remains, and the wider region carries large slag mounds that were long read as evidence of Meroë as a major iron-producing centre. Modern archaeological work (for example in *Antiquity*, 2018, on the ironworking remains in the royal city) has refined the picture: smelting was substantial and organised, but the older narrative of Meroë as "the Birmingham of Africa" supplying all of the Nile and sub-Saharan Africa is a colonial-era overstatement that later research has scaled back. Some of the slag mounds have also been reinterpreted in part as monumental construction material. Kushite iron production was real, large and technically competent; its exact scale and export reach are still argued. Note the distinction from Kemet: Meroitic Kush is a separate civilisation with its own script (Meroitic hieroglyphic and cursive), its own rulers (the kandakes) and its own funerary architecture.',
    engineeringLesson:
      'Throughput changes everything. A smelter is a furnace; a *smelting district* is a supply chain — fuel logistics, ore sourcing, slag disposal, labour scheduling and transport. When a process goes from gram-scale to tonne-scale, waste streams become a design problem in their own right. Ask where your robot\'s slag heaps are (heat, e-waste, network traffic, human attention).',
    glyph: '⛏',
    status: 'archaeological',
    tags: ['iron-smelting', 'industrial-scale', 'Kush', 'Nubia', 'supply-chain'],
    lessonLinks: ['w3l6', 'w8l15'],
    sources: [
      { label: 'Antiquity (Cambridge) — "The ironworking remains in the royal city of Meroe"', url: 'https://www.cambridge.org/core/journals/antiquity/article/abs/ironworking-remains-in-the-royal-city-of-meroe-new-insights-on-the-nile-corridor-and-the-kingdom-of-kush/B44821E549BB735D365EBFFB974F7F58' },
      { label: 'UNESCO World Heritage — Island of Meroe / Musawwarat es Sufra documentation', url: 'https://whc.unesco.org/en/list/1336/' },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 14 · Aksumite stelae                                                 */
  /* ------------------------------------------------------------------ */
  {
    id: 'aksum-stelae-engineering',
    title: 'Aksumite Stelae — Quarrying, Moving and Raising Multi-Hundred-Tonne Obelisks',
    culture: 'Aksumite kingdom · northern Ethiopia (and Eritrea)',
    region: 'Horn of Africa · Aksum, Tigray',
    era: 'Stelae raised c. 3rd–4th c. CE; the kingdom flourished c. 1st–7th c. CE',
    hook: 'Granite monoliths of several hundred tonnes, carved to imitate multi-storey buildings, transported and set upright.',
    detail:
      'The Aksumite stelae field contains carved granite obelisks decorated as mock towers, with false windows, beams and doorways; the largest ever attempted (the Great Stele, now fallen, roughly 33 m) is estimated in the many-hundred-tonne range, and the tallest still standing (the Obelisk of Aksum, about 24 m, taken to Rome in 1937 and returned and re-erected in 2005–2008) is itself around 150–160 tonnes. Evidence and inference: quarrying used wedge-and-hammer techniques to separate blocks along natural fracture lines; transport most plausibly used sledges, rollers, lubricated tracks and large labour forces; erection is the least certain step and is debated, with candidates including ramps, earthen embankments, levering and pit-and-pivot methods. The Great Stele appears to have collapsed during or shortly after erection, which is itself engineering evidence — an attempt that exceeded the achievable margin. The Met\'s essay on the Aksumite stelae and the DAI publications on Aksumite stoneworking are the best entry points.',
    engineeringLesson:
      'Static friction, bearing pressure and centre of mass. A tipped monolith is a rigid-body stability problem: keep the projection of the centre of mass inside the base footprint at every instant of the lift, and control the descent. Also a project-management lesson: the failed Great Stele shows a civilisation probing the edge of its lifting capability, which is what a well-run engineering organisation does deliberately, at smaller scale, with instrumentation.',
    glyph: '⌂',
    status: 'archaeological',
    tags: ['stoneworking', 'rigid-body-stability', 'logistics', 'Aksum', 'Ethiopia'],
    lessonLinks: ['w3l5', 'w5l10'],
    sources: [
      { label: 'The Metropolitan Museum of Art — "The Monumental Stelae of Aksum (3rd–4th Century)"', url: 'https://www.metmuseum.org/essays/the-monumental-stelae-of-aksum-3rd-4th-century' },
      { label: 'UNESCO World Heritage — launch of the Aksum Obelisk re-erection project', url: 'https://whc.unesco.org/en/news/350' },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 15 · Lalibela                                                        */
  /* ------------------------------------------------------------------ */
  {
    id: 'lalibela-rock-hewn-churches',
    title: 'Lalibela — Subtractive Construction Carved Downward',
    culture: 'Ethiopian Orthodox Christian kingdom of the Zagwe dynasty',
    region: 'Horn of Africa · Lalibela, Amhara, Ethiopia',
    era: 'c. 12th–13th century CE',
    hook: 'Eleven churches cut downward out of living volcanic rock — a building method with no assembly step and no second attempt.',
    detail:
      'The Lalibela churches are monolithic: trenches were cut around a planned footprint in volcanic tuff (welded ignimbrite), and the rock inside was then removed from the top down, with interiors, pillars, arches, capitals, vaults and passages all carved in place as a single continuous piece of stone. Bete Giyorgis is the classic example, standing free in a pit with a cross-shaped plan. Engineering content: the rock is soft enough to work when freshly exposed and hardens on exposure, which is why the technique works at all; the church is unharmed by roof load because it is not a structure with a roof load — it is a void inside a mass; drainage trench systems, sloping floors and channels handle Ethiopian rainfall, and water management is the main threat to the monuments today (a long-term UNESCO conservation concern, and the subject of geotechnical studies of the tuff). There is no way to add material, so every cut is a design commitment. Rope-and-pulley, lever and wedge work, and immense manual labour did the rest.',
    engineeringLesson:
      'Subtraction has no undo. With additive manufacturing you can print a support and remove it later; with subtractive work, every operation is irreversible, so the sequence of operations *is* the design. This is why machining, EDM, waterjet and lithography all begin with a process plan. Order your operations by what each one destroys access to.',
    glyph: '✚',
    status: 'documented',
    tags: ['subtractive-manufacturing', 'rock-cut', 'drainage', 'geotechnics', 'Ethiopia'],
    lessonLinks: ['w1l1', 'w3l6'],
    sources: [
      { label: 'ScienceDirect — "Geological and geotechnical properties of the medieval rock hewn churches of Lalibela"', url: 'https://www.sciencedirect.com/science/article/abs/pii/S1464343X10001676' },
      { label: 'UNESCO — Lalibela at the heart of cultural diplomacy and World Heritage conservation', url: 'https://www.unesco.org/en/articles/lalibela-heart-cultural-diplomacy-and-world-heritage-conservation' },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 16 · Great Zimbabwe                                                  */
  /* ------------------------------------------------------------------ */
  {
    id: 'great-zimbabwe-dry-stone',
    title: 'Great Zimbabwe — Mortarless Dry-Stone Walls in Curved Geometry',
    culture: 'Shona · Kingdom of Zimbabwe (ancestral Shona state)',
    region: 'Southern Africa · Masvingo, Zimbabwe',
    era: 'c. 11th–15th century CE',
    hook: 'Walls up to about eleven metres high, built of shaped granite blocks with no mortar at all.',
    detail:
      'Great Zimbabwe is a complex of dry-stone enclosures, platforms and walls built from locally available granite, split and shaped into blocks and laid with no binding agent. The Great Enclosure\'s outer wall runs roughly 250 m with a maximum height of around 11 m and a distinctly curved plan, thicker at the base and tapering upward; the "Conical Tower" and the parallel passage are the best-known features. Stability comes from the shape and stacking of individual blocks, careful coursing, a base widened to keep the resultant of the wall\'s weight and any thrust inside the masonry, and drainage that lets water pass through rather than build up behind the wall. Construction is dated by archaeology and by imported finds (Chinese and Persian ceramics, glass beads) to the kingdom\'s peak, and the site is the namesake of the modern nation. Colonial-era claims that it could not have been built by Africans were politically motivated and were refuted by professional archaeology — David Randall-MacIver and Gertrude Caton-Thompson in the early 20th century, and every reputable excavation since.',
    engineeringLesson:
      'Global stability from local rules. A dry-stone wall is a system whose strength is not in any one block but in the interaction of many: friction, interlock, taper and drainage. Small, cheap, identical units, each placed by a simple rule, producing a structure no single unit could hold. That is distributed robotics and swarm construction in stone — and, equally, a lesson in designing for repair: you can remove and replace a block without compromising the whole.',
    glyph: '⛨',
    status: 'archaeological',
    tags: ['dry-stone', 'masonry', 'stability', 'swarm-construction', 'Shona'],
    lessonLinks: ['w3l5', 'w8l16'],
    sources: [
      { label: 'The Metropolitan Museum of Art — "Great Zimbabwe"', url: 'https://www.metmuseum.org/perspectives/great-zimbabwe' },
      { label: 'UNESCO World Heritage — Great Zimbabwe National Monument', url: 'https://whc.unesco.org/en/list/364/' },
      { label: 'British Museum — documentation on Shona dry-stone walling practice', url: 'https://drs.britishmuseum.org/ndownloader/files/47407219' },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 17 · Timbuktu                                                        */
  /* ------------------------------------------------------------------ */
  {
    id: 'timbuktu-manuscripts-sankore',
    title: 'Timbuktu Manuscripts and the University of Sankoré',
    culture: 'Songhai, Mandé and Sanhaja scholarly communities · Mali (with trans-Saharan networks)',
    region: 'West Africa · Timbuktu, Niger Bend, Mali',
    era: '13th–16th century CE (the scholarly golden age; manuscript copying continued for centuries)',
    hook: 'Hundreds of thousands of manuscripts on astronomy, mathematics, medicine, law and grammar, from a Sahelian city that was a university town before many European ones.',
    detail:
      'Timbuktu flourished as a trans-Saharan trade and scholarship centre under the Mali and Songhai empires. The Sankoré mosque complex became the focus of an advanced teaching institution — often described as a university, with a curriculum in Qur\'anic sciences, law (fiqh), grammar, rhetoric, logic, astronomy/astrology, mathematics, medicine and history — and scholars such as Ahmad Baba al-Timbukti wrote and taught there. Private and institutional libraries accumulated manuscripts in Arabic and in Ajami (African languages written in Arabic script), with texts on astronomy and timekeeping (including calendar and latitude material used to fix prayer times), arithmetic and inheritance law (a genuinely computational subject), medicine, and marginalia recording local observation and legal practice. Counts matter: the number of surviving manuscripts is large but estimates vary widely by library and by how fragments are counted — treat high-end totals as claims, not census results. Conservation, digitisation and the 2012–2013 evacuation of manuscripts from Timbuktu are documented by UNESCO and by the University of Hamburg\'s Timbuktu project.',
    engineeringLesson:
      'A library is infrastructure: acquisition, cataloguing, copying, storage, climate control and disaster recovery. The Timbuktu libraries are an early, sophisticated instance of replication for durability (copying manuscripts is RAID by hand) and of knowledge as a portable asset that can be evacuated when a city is attacked — a backup and off-site-replication strategy executed at family scale.',
    glyph: '✎',
    status: 'documented',
    tags: ['manuscripts', 'astronomy', 'mathematics', 'libraries', 'Mali'],
    lessonLinks: ['w1l2', 'w7l13'],
    sources: [
      { label: 'University of Hamburg — The Timbuktu Manuscript Project', url: 'https://www.csmc.uni-hamburg.de/research/knowledge-exchange/timbuktu.html' },
      { label: 'UNESCO — project for a manuscript training programme in Timbuktu', url: 'https://core.unesco.org/fr/project/266MLI1000' },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 18 · Djenné Great Mosque                                             */
  /* ------------------------------------------------------------------ */
  {
    id: 'djenne-great-mosque-banco',
    title: 'Djenné\'s Great Mosque — Banco Construction and the Maintenance Ritual',
    culture: 'Djenné · Mandé/Bozo masons and the Muslim community of Djenné, Mali',
    region: 'West Africa · Djenné, Inner Niger Delta, Mali',
    era: 'Present structure 1906–1907, on the site of a 13th-century mosque; the building tradition is far older',
    hook: 'The largest mud-brick building in the world is rebuilt a little every year, on purpose.',
    detail:
      'The Great Mosque of Djenné is built from banco — sun-dried mud bricks set in mud mortar, with a render of mud plaster — over a wooden armature of toron (bundled palm ribs) that project from the facade. It is the largest earth-building in the world and part of the UNESCO World Heritage property "Old Towns of Djenné". Engineering content: (1) **Thermal mass and time lag.** Thick earthen walls have high thermal mass and low thermal diffusivity, so the interior temperature peaks many hours after the exterior peak and the daily swing inside is damped — a passive-cooling strategy that needs no power. (2) **Compression-only construction.** Earth is strong in compression and weak in tension, so the design is massive and buttressed, with the toron acting as reinforcement/mounting points. (3) **Maintenance as a design feature.** Every year, after the rainy season, the community re-plasters the mosque in a collective event (the crépissage), and the projecting toron serve as permanent scaffolding and footholds — the maintenance process is designed into the artefact. The ICOMOS evaluation and UNESCO documents record the conservation regime and its risks (rain erosion, flooding, the pressures of visitation).',
    engineeringLesson:
      'Design for maintainability, not just for commission. The toron are scaffolding left in the structure because someone will have to climb it every year. In robotics: access panels, cable service loops, replaceable modules, firmware update paths and MTTR budgets. Also a thermal lesson — the daily time lag of a thick wall is a free low-pass filter for a hot climate, the same principle as a thermal reservoir on an electronics enclosure.',
    glyph: '⌗',
    status: 'living-tradition',
    tags: ['earthen-architecture', 'thermal-mass', 'maintenance', 'banco', 'Mali'],
    lessonLinks: ['w3l6', 'w6l11'],
    sources: [
      { label: 'UNESCO World Heritage — Old Towns of Djenné (advisory body evaluation, PDF)', url: 'https://whc.unesco.org/archive/advisory_body_evaluation/116rev.pdf' },
      { label: 'UNESCO/ICOMOS documentation on the conservation of Djenné', url: 'https://whc.unesco.org/en/list/116/' },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 19 · Calendars and astronomy                                         */
  /* ------------------------------------------------------------------ */
  {
    id: 'ethiopian-nubian-calendars',
    title: 'Ethiopian and Nubian Calendars — Precision Without Instruments',
    culture: 'Ethiopian Orthodox (Ge\'ez) tradition; Nubian/Kushite and medieval Nubian Christian communities',
    region: 'Horn of Africa and the Middle Nile · Ethiopia, Eritrea, Sudan',
    era: 'Ge\'ez calendrical tradition from late antiquity, still in use; Nubian astronomical practice attested through the medieval period',
    hook: 'A calendar with thirteen months that keeps its place in the solar year without a leap-day patch bolted on later.',
    detail:
      'The Ethiopian calendar (Ge\'ez reckoning) has twelve months of thirty days plus a short thirteenth month of five or six days (Pagumen), with a leap day added every four years; its epoch and year count differ from the Gregorian, so it currently runs several years behind. The structure is anchored to the solar year and to the liturgical cycle — fasts, feasts, and the calendar of the church — and Ethiopian astronomical manuscripts record lunar tables and observational notes. In the Middle Nile, medieval Nubian Christian communities and earlier Kushite/Meroitic culture left evidence of calendrical and astronomical practice, including temple alignments and records of celestial observation; the Egyptian decan and lunar reckoning tradition also fed northward and southward along the river. Caveat: the scholarly literature on Nubian astronomical practice is thinner than for Kemet, and specific claims (for example precise alignments of particular Meroitic temples to particular stars) vary in strength. What is solid is that these are working calendrical systems, maintained by observation and record-keeping across centuries without mechanical clocks.',
    engineeringLesson:
      'A calendar is a long-baseline timebase: a clock you cannot reset, whose error you can only detect by comparing observations over many years. Modern equivalents are GNSS time, pulsar timing and the leap-second system — the hard part is never the tick, it is the epoch, the drift and the protocol for adjustment.',
    glyph: '☾',
    status: 'living-tradition',
    tags: ['calendars', 'timekeeping', 'astronomy', 'Ge\'ez', 'Nubia'],
    lessonLinks: ['w2l3', 'w8l16'],
    sources: [
      { label: 'Addis Ababa University — thesis on the Ethiopian church calendar and lunar reckoning (PDF)', url: 'https://etd.aau.edu.et/bitstreams/eb8eca1d-92fe-4f38-87f7-d268e8514ccf/download' },
      { label: 'Science.gov topic record — geoscience studies referencing Lalibela/Nubian rock mass and heritage sites', url: 'https://www.science.gov/topicpages/b/basaltic+rock+mass' },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 20 · Dogon astronomy — disputed                                      */
  /* ------------------------------------------------------------------ */
  {
    id: 'dogon-sirius-disputed',
    title: 'Dogon Astronomy and Sirius — Ethnography Versus the "Sirius Mystery"',
    culture: 'Dogon · Bandiagara Escarpment, Mali',
    region: 'West Africa · Mopti region, Mali',
    era: 'Ethnographic documentation from the 1930s onward; the sigi is a living ritual cycle',
    hook: 'A real ritual system centred on a star, and a much later story about secret knowledge of an invisible companion — keep the two apart.',
    detail:
      '**What is documented.** Dogon cosmology and ritual are genuinely centred on a sky of named stars, and Sirius (sigi tolo) plays a structural role: the sigi ceremony — a long, generational ritual cycle of roughly sixty years — is tied to Sirius and to the renewal of the world, and Dogon star lore distinguishes stars by colour and role in the system. This much is supported by fieldwork and by Dogon participants themselves; the sigi is a living tradition.\n\n**What is disputed.** In *Dieu d\'eau* (1948) and related work, Marcel Griaule and Germaine Dieterlen reported that Dogon elders described Sirius as having an invisible companion, with a period and a shape, plus other claims about the Jupiter and Saturn systems. The "Sirius mystery" literature (Robert Temple, *The Sirius Mystery*, 1976) and related authors attributed this to contact with extraterrestrials or to a very ancient advanced astronomy. The objections are strong and specific: the material culture and astronomy have strong astronomical explanations consistent with naked-eye observation; the reports come from a single small set of interviews, not from the wider corpus of Dogon knowledge; other ethnographers, most prominently Walter van Beek, who did extended later fieldwork, could not reproduce the claims and found Dogon astronomical statements more limited and more variable; and Griaule\'s informants may have been influenced by earlier European contacts and mission/colonial-era discourse about Sirius B. Sirius B was predicted by Bessel in 1844 from the wobble of Sirius A and first observed in 1862 — before Griaule\'s fieldwork. So: a real, deep, ritual astronomy with Sirius at the centre, plus an unverified claim about an invisible companion. Flagged **disputed**.',
    engineeringLesson:
      'Field data has provenance and chain of custody. The Dogon case is a case study in what happens when an investigation has a single informant channel, no independent replication, and a suggestive prior — the same failure mode as training a model on one biased dataset and reporting it as universal. Write down who told you, when, under what framing, and try hard to reproduce it with someone else.',
    glyph: '✧',
    status: 'disputed',
    tags: ['ethnography', 'archaeoastronomy', 'Sirius', 'source-criticism', 'Mali', 'disputed'],
    lessonLinks: ['w2l4', 'w8l16'],
    sources: [
      { label: 'CNRS — "Sirius, the Dogon star" (video feature, with ethnographers)', url: 'https://images.cnrs.fr/en/video/887' },
      { label: 'Journal des Africanistes / OpenEdition — analysis of Griaule\'s Dogon "secret knowledge" (PDF)', url: 'https://journals.openedition.org/atelierslesc/pdf/2902' },
      { label: 'Skeptical Inquirer (1978), archived by the Library of Congress — critique of the Sirius mystery', url: 'https://webarchive.loc.gov/legacy/20020915135846/http://www.csicop.org/si/7809/sirius.html' },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 21 · African fractals                                                */
  /* ------------------------------------------------------------------ */
  {
    id: 'eglash-african-fractals',
    title: 'Ron Eglash — African Fractals and Recursion as Design Principle',
    culture: 'Cross-cultural: Akan, Asante, Bamileke, BaTammalip, Zulu and other traditions (a comparative thesis, not one culture)',
    region: 'West, Central and Southern Africa (comparative)',
    era: 'Living design traditions of long standing; the comparative analysis published 1999',
    hook: 'Self-similar scaling turns up in African architecture, textiles, hair braiding and divination — recursion as an everyday design habit.',
    detail:
      'Ron Eglash\'s *African Fractals: Modern Computing and Indigenous Design* (Rutgers University Press, 1999) argues that recursive, self-similar scaling is a pervasive design principle in a set of African material and symbolic traditions: the nested, gently tapering rectangular plans of Sahelian compounds and Bamileke and BaTammalip architecture; the logarithmic, self-similar spirals of some African settlement layouts; repeating-and-scaling pattern generation in textiles, brasswork and braiding (including the recursive corner-braiding and cornrow structures); and, metaphorically, fractal branching in the structure of some divination and knowledge systems. Eglash\'s contribution is the demonstration that these are *designed* scaling rules, not accidental resemblance — the sequence of transformations can be stated, verified against built objects, and even used as a generative algorithm. Two honest caveats: first, this is a comparative thesis spanning many distinct peoples, so it must not be read as one "African" practice — the Akan, Bamileke and Zulu examples are separate traditions that share a mathematical family resemblance. Second, not every object in these traditions is fractal; the claim is about a recurring design strategy, and specific attributions are debated in the literature.',
    engineeringLesson:
      'Recursion and self-similarity as a generative design rule. Write the transformation once and apply it at every scale — that is how you get a fractal antenna, a hierarchical controller, a recursive descent planner, or a modular robot that reuses one module type at many scales. Eglash\'s work also models the right research method: state the rule, then check it against the artefact.',
    glyph: '❋',
    status: 'documented',
    tags: ['fractals', 'recursion', 'generative-design', 'architecture', 'comparative'],
    lessonLinks: ['w1l2', 'w8l15'],
    sources: [
      { label: 'TED — Ron Eglash, "The fractals at the heart of African designs"', url: 'https://www.ted.com/speakers/ron_eglash' },
      { label: 'UC Press — Design and Culture review citing Eglash\'s African fractals in design pedagogy', url: 'https://online.ucpress.edu/dcqr/article-split/14/1/84/209547/Research-Teams-for-Liberation-and' },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 22 · Grain stores & passive cooling                                  */
  /* ------------------------------------------------------------------ */
  {
    id: 'zulu-ndebele-granary-passive-cooling',
    title: 'Umgqomo and Inqolobane — Vernacular Storage and Termite-Mound Cooling',
    culture: 'Zulu and Ndebele · South Africa, Zimbabwe',
    region: 'Southern Africa · KwaZulu-Natal and Matabeleland',
    era: 'Documented 19th–20th century vernacular practice; the Eastgate Centre was completed 1996 in Harare',
    hook: 'A sealed clay store that keeps grain cool and weevil-poor, and a Harare office block that borrowed termite-mound ventilation.',
    detail:
      'Southern African grain storage includes raised, sealed containers and larger granaries: **umgqomo** (a large sealed clay/earth storage vessel or pit-store form) and **inqolobane** (a raised granary structure, typically on stone or wooden piers, with a thatched or sealed top). The engineering content is real and well understood: sealing a mass of grain in a container drives respiration within the stored grain and its associated microbiota, which raises CO2 and lowers O2 and suppresses insect pests and mould without chemicals; thermal mass and insulation reduce the daily temperature swing; raising the structure off the ground limits rodent and moisture ingress; ash and plant materials add further pest control. Indigenous grain-storage practice is well covered in South African archaeological and ethnobotanical literature.\n\n**Passive cooling for buildings.** Termite mounds maintain a stable internal climate: the driving mechanism is a diurnal oscillation produced by the mound\'s thermal mass coupled to the external temperature cycle, with the chimney and surface conduits acting as part of a distributed exchange system — not simply a steady "chimney draught". In the mid-1990s, architect Mick Pearce, working with Arup, applied a mound-like strategy to the Eastgate Centre in Harare: the building is cooled by drawing outside air through a hollow floor slab and a network of vertical ducts embedded in the structure that exploit the day/night temperature swing, with fans only for peak loads. The building was widely reported to run with substantially lower energy use and cost than conventional air-conditioned offices of its size, achieved by shifting, storing and exchanging heat rather than refrigerating. Caveat: "the Eastgate is a termite mound" is a marketing simplification; the transferable lesson is the *mechanism class* (thermal-mass night-charging plus buoyancy-driven flow), not literal mimicry of a nest.',
    engineeringLesson:
      'Shift and store, then let physics move the air. Passive design exploits time: charge thermal mass at night, use buoyancy and conduits to deliver coolth during the day, and reserve powered cooling for peaks and fault conditions. In a robot: thermal reservoirs and duty cycling instead of bigger fans. The storage granaries add a second lesson — hermetic enclosure plus metabolic feedback is a control loop with no sensors and no power, the cheapest possible controller.',
    glyph: '⬢',
    status: 'documented',
    tags: ['thermal-mass', 'passive-cooling', 'biomimicry', 'storage', 'hermetic-sealing'],
    lessonLinks: ['w3l6', 'w6l11'],
    sources: [
      { label: 'Nature Scitable — "Keeping Cool with Biomimicry" (Eastgate and termite mounds)', url: 'https://www.nature.com/scitable/blog/student-voices/keeping_cool_with_biomimicry/' },
      { label: 'Arup — Eastgate project record', url: 'https://www.arup.com/projects/eastgate' },
      { label: 'The New York Times — "What Termites Can Teach Us About Cooling Our Buildings" (2019)', url: 'https://www.nytimes.com/2019/03/26/science/termite-nest-ventilation.html' },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 23 · Afrofuturism                                                    */
  /* ------------------------------------------------------------------ */
  {
    id: 'afrofuturism-lineage',
    title: 'Afrofuturism — Sun Ra, Butler, Clinton, Delany, Okorafor, Jemisin, Monáe',
    culture: 'African diaspora · United States, Africa, global Black diaspora',
    region: 'Atlantic world · USA, Caribbean, Africa, and beyond',
    era: 'Term coined 1993 (Mark Dery); lineage from the 1950s onward; a living movement',
    hook: 'A cultural practice of writing Black people into the future, and of treating technology as a site of liberation rather than exclusion.',
    detail:
      '**The term.** Cultural critic Mark Dery coined "Afrofuturism" in his 1993 essay "Black to the Future" (in *Flame Wars*), describing African-American speculative fiction that treats 20th-century technoculture and African-American experience together. The practice long predates the label.\n\n**The lineage.** **Sun Ra** (Herman Blount), from the mid-1950s, built a mythology of space travel and an Afrofuturist aesthetic on stage and record (Space Is the Place, 1974), with music, costume and cosmology as one artefact. **Samuel R. Delany** wrote formally daring science fiction from the 1960s (*Babel-17*, *Nova*, *Dhalgren*) and theorised race and sexuality inside the genre. **Octavia E. Butler** from the 1970s (*Kindred*, *Dawn*, *Parable of the Sower*) built a body of work about power, biology, coercion and survival that is now central to the canon. **George Clinton** and Parliament-Funkadelic ran a parallel, exuberant Afro-cosmic mythology through funk and stage design (the Mothership). Later practitioners extend the lineage in different media and concerns: **Nnedi Okorafor** (African-based science fiction, *Lagoon*, *Binti*, *Who Fears Death*), **N. K. Jemisin** (*The Fifth Season* / Broken Earth trilogy; the first author to win the Hugo for Best Novel three years running), and **Janelle Monáe** (the *Metropolis*/*ArchAndroid*/*Dirty Computer* album-and-film cycle, android subjectivity as a Black experience metaphor). Theory has been elaborated by Alondra Nelson, Kodwo Eshun, Ytasha Womack and others; "Afrofuturism" has also been extended toward Africanfuturism, a term Okorafor proposed to centre African rather than diaspora perspectives.',
    engineeringLesson:
      'Who gets to be in the future is a design decision. Afrofuturism is a requirements document written by people the default future had left out — it forces explicit choices about whose body, whose language, whose aesthetics and whose failure modes a technology serves. Read it as user research with a hundred-year time horizon.',
    glyph: '✦',
    status: 'documented',
    tags: ['afrofuturism', 'speculative-fiction', 'music', 'theory', 'diaspora'],
    lessonLinks: ['w8l15', 'w8l16'],
    sources: [
      { label: 'The Encyclopedia of Science Fiction — "Afrofuturism"', url: 'https://sf-encyclopedia.com/entry/afrofuturism' },
      { label: 'CLAD — profile of Afrofuturist design practice (Hannah Beachler)', url: 'https://www.cladglobal.com/architecture-design-features?codeid=33500' },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 24 · Black Panther / Wakanda                                         */
  /* ------------------------------------------------------------------ */
  {
    id: 'black-panther-wakanda-design',
    title: 'Black Panther and Wakanda — Costume, Set and Vibranium as Narrative Technology',
    culture: 'African diaspora filmmaking · Marvel Studios production, with African material-culture research',
    region: 'African diaspora · USA production; fictional Wakanda in East Africa',
    era: '2018 film; its design research draws on 19th–21st century African material culture',
    hook: 'A fictional country designed by deliberately sampling real African technologies of cloth, metal and building — and one invented material that carries the whole plot.',
    detail:
      '**Ruth E. Carter (costume design, Academy Award winner).** Carter built the Wakandan visual language by researching and sampling specific real traditions rather than blending a generic "Africa". In interviews she names: Maasai beadwork and dress for the river/market scenes and for Nakia and the Dora Milaje; Surma and other Ethiopian/South Sudanese body decoration and lip plates for the river tribe; Tuareg indigo veils and silverwork for the nomad merchants; kente and Adinkra (Asante, Ghana) for T\'Challa\'s and the royal family\'s ceremonial and coronation dress; and, alongside these, Korean and Filipino influences she cited explicitly — including Filipino *bakya* footwear and Korean *hanbok*-derived structural elements in the costumes of Killmonger\'s faction. She also had 3D-printed elements produced to her designs so the ornaments carry a technically plausible "manufactured" look. (Her Oscar was the first Marvel Studios win for costume design, and the first Academy Award for a Black costume designer.)\n\n**Hannah Beachler (production design, Academy Award winner).** Beachler designed Wakanda as an argument about a place: a high-technology African city whose architecture visibly descends from African building traditions — thatched and woven geometries, earth and stone, Zulu and Lesotho and Ghanaian references — extended upward into a speculative future rather than replaced by a generic Western futurism, with the design language differing per tribe. She published detailed design documentation of the process.\n\n**Vibranium as narrative technology.** Vibranium is a plot device that performs real narrative work: it is a fantastic material with impossible properties (energy absorption, anti-gravity applications) that resolves the story\'s central problem by making Wakanda resource-rich and therefore geopolitically free. Read it as a fictional enabling technology that lets the film ask what happens when a country is never colonised and never forced to export its raw materials. The engineering content of the film is therefore in the costume and set research and in the *idea* of vertically integrated advanced manufacturing — not in vibranium, which is fiction and should be labelled as such.',
    engineeringLesson:
      'Design languages need specific sources. Carter and Beachler did what a good design engineer does: instead of reaching for a generic futuristic default, they cited specific traditions, named their sources, and derived structures from them — a modular, documented design system. Second lesson: a single fictional enabling material is a way of exploring counterfactuals. Ask what a hypothetical material or actuator would unlock, then ask which real ones get you 10% of the way.',
    glyph: '☍',
    status: 'documented',
    tags: ['production-design', 'costume', 'material-culture', 'afrofuturism', 'representation'],
    lessonLinks: ['w8l15', 'w1l2'],
    sources: [
      { label: 'The Hollywood Reporter — "Black Panther Costume Designer Talks Tribal-Tech Inspirations"', url: 'https://www.hollywoodreporter.com/news/general-news/black-panther-costume-designer-talks-tribal-tech-inspirations-1074564/' },
      { label: 'The World (PRX) — "Looking Marvel-ous: Designing costumes for Black Panther"', url: 'https://theworld.org/stories/2019/02/20/looking-marvel-ous-designing-costumes-black-panther' },
      { label: 'Oscars.org — 91st Academy Awards backstage interview transcript: Production Design (Hannah Beachler)', url: 'https://www.oscars.org/press/91st-oscars-backstage-interview-transcript-production-design' },
    ],
  },
];

export const colorPalettes: ColorPalette[] = [
  {
    id: 'ogun-forge',
    name: "Ọ̀gún's Forge",
    inspiration:
      'The blacksmith\'s fire at the moment of the quench: white-hot steel, ember orange, oxidized iron, hammered gold leaf. The default forge palette of the course — used for lesson and quiz surfaces.',
    colors: [
      { name: 'Forge Void', hex: '#05010F', use: 'background — app canvas and page base' },
      { name: 'Anvil Iron', hex: '#3A2B2B', use: 'background — panel and card fill, secondary surfaces' },
      { name: 'Ogun Ember', hex: '#FF6B1A', use: 'primary accent — active state, progress, links on dark' },
      { name: 'Hammer Gold', hex: '#F5B301', use: 'highlight — headings, borders, XP and reward accents' },
      { name: 'Quench Crimson', hex: '#C1121F', use: 'danger — errors, failed checks, overheating warnings' },
      { name: 'Slag Copper', hex: '#C96F2B', use: 'secondary accent — charts, timeline bands, muted icons' },
      { name: 'Ash Cream', hex: '#FFE9A8', use: 'text — primary reading colour on dark backgrounds' },
      { name: 'Furnace White', hex: '#FFF6E9', use: 'glow — specular highlights and hot-spot bloom' },
    ],
  },
  {
    id: 'dogon-starlight',
    name: 'Dogon Starlight',
    inspiration:
      'The Dogon night sky over the Bandiagara Escarpment: deep indigo shadow, violet dust, the blue-white light of Sirius and the pale band of the Milky Way. Used for astronomy, sensing and estimation lessons.',
    colors: [
      { name: 'Void Night', hex: '#05010F', use: 'background — deep sky base' },
      { name: 'Indigo Shadow', hex: '#4338CA', use: 'background — gradients, night panels, chart floor' },
      { name: 'Sirius Blue', hex: '#67E8F9', use: 'primary accent — sensor traces, measurement readouts' },
      { name: 'Star White', hex: '#E0F2FE', use: 'text — high-contrast body copy on dark' },
      { name: 'Nebula Violet', hex: '#7C3AED', use: 'glow — halos, focus rings, star bloom' },
      { name: 'Halo Lilac', hex: '#C4B5FD', use: 'text — secondary labels and captions' },
      { name: 'Deep Space', hex: '#0A0420', use: 'background — inset wells and code blocks' },
      { name: 'Starlight Gold', hex: '#F5B301', use: 'highlight — rare emphasis, key values, bookmarks' },
    ],
  },
  {
    id: 'ile-ife-nebula',
    name: 'Ilé-Ifẹ̀ Nebula',
    inspiration:
      'The psychedelic core of the course: Ifẹ̀ as origin-city reimagined as a fuchsia-and-acid nebula. Brassa plaques and beaded crown regalia rendered as plasma. Used for Idea Lab, frontier and reward moments.',
    colors: [
      { name: 'Nebula Fuchsia', hex: '#C026D3', use: 'primary accent — Idea Lab highlights, selection' },
      { name: 'Cosmic Violet', hex: '#7C3AED', use: 'background — nebula gradient mid-stop' },
      { name: 'Acid Spore', hex: '#D9F99D', use: 'highlight — success flash, generative accents' },
      { name: 'Shock Hot', hex: '#FF2FB9', use: 'danger — psychedelic alert, anomaly markers' },
      { name: 'Corona Sun', hex: '#FFD166', use: 'glow — bloom cores, XP bursts, badge sheen' },
      { name: 'Prince Indigo', hex: '#4338CA', use: 'background — deep panels and modal scrim' },
      { name: 'Bead Cream', hex: '#FFE9A8', use: 'text — primary copy over nebula fills' },
      { name: 'Void Plum', hex: '#120A2E', use: 'background — page base under the plasma ribbon' },
    ],
  },
  {
    id: 'mycelium-bloom',
    name: 'Mycelium Bloom',
    inspiration:
      'A mycelial network lit from beneath: spore-lime hyphae, mineral teal, bioluminescent glow. Used for biology, bio-inspired design, energy-harvesting and swarm lessons.',
    colors: [
      { name: 'Forest Deep', hex: '#0F2E22', use: 'background — bio panel base' },
      { name: 'Myco Glow', hex: '#6EE7A8', use: 'primary accent — network edges, growth, bio traces' },
      { name: 'Spore Lime', hex: '#A3E635', use: 'highlight — new growth, active nodes, emphasis' },
      { name: 'Hypha Mint', hex: '#D1FAE5', use: 'text — body copy on the deep green base' },
      { name: 'Bioluma Cyan', hex: '#22D3EE', use: 'glow — bioluminescence and sensor shimmer' },
      { name: 'Loam Ink', hex: '#04150E', use: 'background — wells, terminals, dark insets' },
      { name: 'Rot Amber', hex: '#B45309', use: 'danger — decay, contamination, model drift' },
      { name: 'Chlorophyll', hex: '#16A34A', use: 'primary accent — solid fills, buttons, active tabs' },
    ],
  },
  {
    id: 'sirius-b-xray',
    name: 'Sirius B X-Ray',
    inspiration:
      'A white dwarf imaged in X-ray: a blue-white point source of enormous density, ringed by superheated accretion. High-contrast, clinical, spectral — used for quantum, compute and precision-instrument lessons.',
    colors: [
      { name: 'Event Horizon', hex: '#05010F', use: 'background — absolute base behind spectra' },
      { name: 'X-Ray Cyan', hex: '#67E8F9', use: 'primary accent — data lines, laser/optics, readouts' },
      { name: 'Dwarf Shell White', hex: '#E0F2FE', use: 'text — primary copy, annotations on spectra' },
      { name: 'Accretion Violet', hex: '#7C3AED', use: 'glow — corona halo, high-energy states' },
      { name: 'Compton Indigo', hex: '#4338CA', use: 'background — panel and chart frames' },
      { name: 'Supernova Hot', hex: '#C026D3', use: 'danger — overload, decoherence, saturating flux' },
      { name: 'Gamma Acid', hex: '#D9F99D', use: 'bio/accent — secondary traces, non-human signals' },
      { name: 'Corona Gold', hex: '#FFD166', use: 'highlight — calibration marks and reference lines' },
    ],
  },
];
