/**
 * Content schema for Ọ̀gún's Forge — Robotics Engineering Academy.
 * Every lesson, quiz, flashcard, chart, table and idea-lab project is typed here
 * so content files stay consistent and the UI can render generically.
 */

export type Difficulty = 'seedling' | 'apprentice' | 'journeyman' | 'master' | 'orisha';

export type TrackId =
  | 'foundations'
  | 'perception'
  | 'actuation'
  | 'control'
  | 'kinematics'
  | 'embedded'
  | 'ai'
  | 'systems'
  | 'frontier';

/* ------------------------------------------------------------------ */
/* Rich content blocks rendered inside a lesson                        */
/* ------------------------------------------------------------------ */

export interface ProseBlock {
  kind: 'prose';
  heading?: string;
  /** Supports **bold**, *italic*, `code`, and [text](url). Math via $...$ */
  body: string;
}

export interface CalloutBlock {
  kind: 'callout';
  tone: 'insight' | 'warning' | 'afro' | 'myco' | 'quantum' | 'code';
  title: string;
  body: string;
}

export interface FormulaBlock {
  kind: 'formula';
  title: string;
  /** KaTeX source */
  tex: string;
  /** Plain-language reading of the formula */
  explain: string;
}

export interface ChartSeries {
  key: string;
  label: string;
  color: string;
  data: number[];
}

export interface ChartBlock {
  kind: 'chart';
  title: string;
  caption?: string;
  chartType: 'line' | 'area' | 'bar' | 'radar' | 'scatter';
  xLabel: string;
  yLabel: string;
  x: (string | number)[];
  series: ChartSeries[];
}

export interface TableBlock {
  kind: 'table';
  title: string;
  caption?: string;
  /** optional "how to choose" takeaway rendered under the table */
  insight?: string;
  columns: string[];
  rows: string[][];
}

export interface CodeBlock {
  kind: 'code';
  title: string;
  language: string;
  code: string;
  note?: string;
}

export interface LabBlock {
  kind: 'lab';
  /** id of a registered 3D/2D interactive lab */
  labId: LabId;
  title: string;
  brief: string;
  tasks: string[];
}

export interface StepsBlock {
  kind: 'steps';
  title: string;
  steps: { title: string; detail: string }[];
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export type Block =
  | ProseBlock
  | CalloutBlock
  | FormulaBlock
  | ChartBlock
  | TableBlock
  | CodeBlock
  | LabBlock
  | StepsBlock;

export type LabId =
  | 'robot-arm'
  | 'pid-drone'
  | 'swarm'
  | 'kalman'
  | 'mycelium'
  | 'bloch'
  | 'gear-train'
  | 'energy-field'
  | 'vision-grid'
  | 'gait';

/* ------------------------------------------------------------------ */
/* Lessons                                                             */
/* ------------------------------------------------------------------ */

export interface Lesson {
  id: string;
  number: number;
  week: number;
  track: TrackId;
  title: string;
  subtitle: string;
  duration: number; // minutes
  difficulty: Difficulty;
  xp: number;
  /** short "why this matters" line */
  hook: string;
  objectives: string[];
  blocks: Block[];
  keyTerms: KeyTerm[];
  /** exam-style checks tagged by difficulty */
  quiz: QuizQuestion[];
  flashcards: FlashcardSeed[];
  /** ideas that bridge the lesson into the Idea Lab */
  forgePrompts: string[];
}

/* ------------------------------------------------------------------ */
/* Quizzes                                                             */
/* ------------------------------------------------------------------ */

export interface QuizQuestion {
  id: string;
  question: string;
  choices: string[];
  answer: number; // index into choices
  explanation: string;
  /** cognitive level — used to build balanced quizzes */
  level: 'recall' | 'understand' | 'apply' | 'analyze' | 'design';
}

export interface BossQuiz {
  id: string;
  week: number;
  title: string;
  subtitle: string;
  /** lessons whose material is tested */
  lessonIds: string[];
  xp: number;
  badgeId: string;
  questions: QuizQuestion[];
}

/* ------------------------------------------------------------------ */
/* Flashcards                                                          */
/* ------------------------------------------------------------------ */

export interface FlashcardSeed {
  front: string;
  back: string;
  tag: string;
}

export interface Flashcard extends FlashcardSeed {
  id: string;
  lessonId: string;
  week: number;
}

/* ------------------------------------------------------------------ */
/* Idea Lab projects                                                   */
/* ------------------------------------------------------------------ */

export type IdeaCategory =
  | 'mycelium'
  | 'jyotish'
  | 'nature'
  | 'energy'
  | 'quantum'
  | 'afrofuture'
  | 'space';

export interface ProjectStep {
  title: string;
  detail: string;
}

export interface IdeaProject {
  id: string;
  title: string;
  tagline: string;
  category: IdeaCategory;
  difficulty: Difficulty;
  /** total build time, human readable */
  buildTime: string;
  costBand: '$' | '$$' | '$$$' | '$$$$';
  /** 0-100 — how far past "normal maker project" this sits */
  wakandaIndex: number;
  /** 0-100 — how ready it is for a garage build */
  diyFeasibility: number;
  /** 0-100 — real peer-reviewed grounding */
  scienceGrounding: number;
  /** what is real engineering vs cultural narrative */
  realitySplit: { real: string; narrative: string };
  summary: string;
  science: string;
  billOfMaterials: { item: string; qty: string; note?: string }[];
  buildSteps: ProjectStep[];
  code?: { language: string; snippet: string; note: string };
  metrics: { label: string; value: string }[];
  stretchGoals: string[];
  safety: string[];
  /** cross-links back into the course */
  lessonLinks: string[];
  sources: { label: string; url: string }[];
}

/* ------------------------------------------------------------------ */
/* Reference tables page                                               */
/* ------------------------------------------------------------------ */

export interface ReferenceTable {
  id: string;
  title: string;
  category: 'sensors' | 'actuators' | 'compute' | 'comms' | 'power' | 'control' | 'biology' | 'frontier';
  intro: string;
  columns: string[];
  rows: string[][];
  insight: string;
}

/* ------------------------------------------------------------------ */
/* Achievements                                                        */
/* ------------------------------------------------------------------ */

export interface Badge {
  id: string;
  name: string;
  glyph: string;
  /** Adinkra symbol name used as glyph caption */
  adinkra: string;
  description: string;
  /** how to earn it */
  requirement: string;
  tier: 'bronze' | 'silver' | 'gold' | 'orisha';
}

export interface Rank {
  id: string;
  name: string;
  minXp: number;
  glyph: string;
  blurb: string;
}

/* ------------------------------------------------------------------ */
/* Heritage Atlas — Afrocentric science & technology lineage           */
/* ------------------------------------------------------------------ */

export interface AtlasEntry {
  id: string;
  title: string;
  /** e.g. "Yoruba · Nigeria", "Kemet · Nile Valley" */
  culture: string;
  region: string;
  era: string;
  /** one-line hook */
  hook: string;
  /** what it is / what it does */
  detail: string;
  /** the engineering idea a modern roboticist should steal */
  engineeringLesson: string;
  /** Adinkra/other glyph used in the card */
  glyph: string;
  /** honest epistemic label */
  status: 'documented' | 'archaeological' | 'living-tradition' | 'disputed';
  tags: string[];
  lessonLinks: string[];
  sources: { label: string; url: string }[];
}

export interface ColorPalette {
  id: string;
  name: string;
  inspiration: string;
  colors: { name: string; hex: string; use: string }[];
}
