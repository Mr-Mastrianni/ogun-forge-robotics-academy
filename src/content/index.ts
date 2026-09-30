import { lesson as w1l1 } from './lessons/w1l1';
import { lesson as w1l2 } from './lessons/w1l2';
import { lesson as w2l3 } from './lessons/w2l3';
import { lesson as w2l4 } from './lessons/w2l4';
import { lesson as w3l5 } from './lessons/w3l5';
import { lesson as w3l6 } from './lessons/w3l6';
import { lesson as w4l7 } from './lessons/w4l7';
import { lesson as w4l8 } from './lessons/w4l8';
import { lesson as w5l9 } from './lessons/w5l9';
import { lesson as w5l10 } from './lessons/w5l10';
import { lesson as w6l11 } from './lessons/w6l11';
import { lesson as w6l12 } from './lessons/w6l12';
import { lesson as w7l13 } from './lessons/w7l13';
import { lesson as w7l14 } from './lessons/w7l14';
import { lesson as w8l15 } from './lessons/w8l15';
import { lesson as w8l16 } from './lessons/w8l16';
import { bossQuizzes } from './bossAndTables';
import { referenceTables } from './referenceTables';
import { myceliumProjects as myceliumProjectsBase } from './ideas/mycelium';
import { myceliumAdvancedProjects } from './ideas/mycelium-advanced';
import { natureProjects as natureProjectsA } from './ideas/nature';
import { natureProjectsB } from './ideas/nature-b';
import { natureProjectsC } from './ideas/nature-c';
import { natureProjectsD } from './ideas/nature-d';
import { jyotishProjects, afrofutureProjects } from './ideas/jyotish-afrofuture';
import { energyProjects, quantumProjects, spaceProjects } from './ideas/energy-quantum';
import { heritageEntries, colorPalettes } from './heritage';
import { lessonGuides } from './lessonGuides';
import type { Flashcard, IdeaProject, Lesson, QuizQuestion, TrackId } from './types';
import type { LessonGuide } from './lessonGuides';

export const lessons: Lesson[] = [
  w1l1,
  w1l2,
  w2l3,
  w2l4,
  w3l5,
  w3l6,
  w4l7,
  w4l8,
  w5l9,
  w5l10,
  w6l11,
  w6l12,
  w7l13,
  w7l14,
  w8l15,
  w8l16,
].sort((a, b) => a.number - b.number);

export const lessonById: Record<string, Lesson> = Object.fromEntries(lessons.map((l) => [l.id, l]));

export const weeks: { week: number; title: string; theme: string; lessons: Lesson[] }[] = [
  { week: 1, title: 'The Spark and the Frame', theme: 'What robots are, and what they are made of', lessons: [] },
  { week: 2, title: 'Giving the Machine Senses', theme: 'Proprioception, exteroception and machine vision', lessons: [] },
  { week: 3, title: 'Muscle and Nerve', theme: 'Actuators, drives and control loops', lessons: [] },
  { week: 4, title: 'The Geometry of Motion', theme: 'Frames, forward and inverse kinematics', lessons: [] },
  { week: 5, title: 'Dynamics and the Embedded Core', theme: 'Locomotion, gait and real-time firmware', lessons: [] },
  { week: 6, title: 'The Thinking Machine', theme: 'Perception, estimation, planning and learning', lessons: [] },
  { week: 7, title: 'The Nervous System at Scale', theme: 'ROS 2, IoT, safety and ethics', lessons: [] },
  { week: 8, title: 'Forge, Launch, Transcend', theme: 'Manufacturing, capstone and living machines', lessons: [] },
].map((w) => ({ ...w, lessons: lessons.filter((l) => l.week === w.week) }));

/* Core mycelium builds plus the advanced living-machine tier. */
export const myceliumProjects: IdeaProject[] = [...myceliumProjectsBase, ...myceliumAdvancedProjects];

export const natureProjects: IdeaProject[] = [
  ...natureProjectsA,
  ...natureProjectsB,
  ...natureProjectsC,
  ...natureProjectsD,
];

export {
  jyotishProjects,
  afrofutureProjects,
  energyProjects,
  quantumProjects,
  spaceProjects,
};

export const allProjects: IdeaProject[] = [
  ...myceliumProjects,
  ...natureProjects,
  ...jyotishProjects,
  ...energyProjects,
  ...quantumProjects,
  ...afrofutureProjects,
  ...spaceProjects,
];

export const projectById: Record<string, IdeaProject> = Object.fromEntries(allProjects.map((p) => [p.id, p]));

export const flashcards: Flashcard[] = lessons.flatMap((l) =>
  l.flashcards.map((f, i) => ({
    ...f,
    id: `${l.id}-f${i}`,
    lessonId: l.id,
    week: l.week,
  })),
);

export const allQuizQuestions: (QuizQuestion & { lessonId: string; lessonTitle: string; week: number })[] =
  lessons.flatMap((l) => l.quiz.map((q) => ({ ...q, lessonId: l.id, lessonTitle: l.title, week: l.week })));

export const allKeyTerms: {
  term: string;
  definition: string;
  lessonId: string;
  lessonTitle: string;
  week: number;
  track: TrackId;
}[] = lessons.flatMap((l) =>
  l.keyTerms.map((t) => ({
    ...t,
    lessonId: l.id,
    lessonTitle: l.title,
    week: l.week,
    track: l.track,
  })),
);

export const TRACK_LABELS: Record<TrackId, string> = {
  foundations: 'Foundations',
  perception: 'Perception',
  actuation: 'Actuation',
  control: 'Control',
  kinematics: 'Kinematics',
  embedded: 'Embedded',
  ai: 'AI & Autonomy',
  systems: 'Systems & Safety',
  frontier: 'Frontier',
};

export { bossQuizzes, referenceTables, heritageEntries, colorPalettes };

/* Plain-language guides: one per lesson, keyed by lesson id. */
export { lessonGuides };
export type { LessonGuide };
export const guideFor = (id: string): LessonGuide | undefined => lessonGuides.find((g) => g.lessonId === id);
