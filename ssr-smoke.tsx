/**
 * SSR smoke test (development-only, not shipped).
 * Renders every route with renderToString to prove the component tree executes:
 * content wiring, chart blocks, tables, labs, store and derived collections.
 * Run:  npx vite build --ssr ssr-smoke.tsx --outDir .smoke && node .smoke/ssr-smoke.js
 */
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import Home from '@/pages/Home';
import Course from '@/pages/Course';
import LessonPage from '@/pages/LessonPage';
import Labs from '@/pages/Labs';
import QuizArena from '@/pages/QuizArena';
import BossQuizPage from '@/pages/BossQuizPage';
import Flashcards from '@/pages/Flashcards';
import Charts from '@/pages/Charts';
import Tables from '@/pages/Tables';
import Ideas from '@/pages/Ideas';
import IdeaDetail from '@/pages/IdeaDetail';
import Atlas from '@/pages/Atlas';
import Achievements from '@/pages/Achievements';
import ProgressPage from '@/pages/ProgressPage';
import Glossary from '@/pages/Glossary';
import Beyond from '@/pages/Beyond';
import { allProjects, bossQuizzes, flashcards, lessons, referenceTables, heritageEntries, allKeyTerms } from '@/content';

const ROUTES: [string, string][] = [
  ['/', 'ROBOTICS'],
  ['/course', '8 weeks'],
  ['/lesson/w1l1', 'What a Robot Actually Is'],
  ['/lesson/w4l8', 'Inverse Kinematics'],
  ['/lesson/w8l16', 'Capstone'],
  ['/labs', 'Ten labs'],
  ['/labs/robot-arm', 'Kinematics Bench'],
  ['/labs/pid-drone', 'PID Flight Bench'],
  ['/labs/swarm', 'Swarm Bench'],
  ['/labs/kalman', 'Sensor Fusion Bench'],
  ['/labs/mycelium', 'Mycelial Network'],
  ['/labs/bloch', 'Bloch Sphere'],
  ['/labs/gear-train', 'Gear Train'],
  ['/labs/energy-field', 'Energy Frontier Bench'],
  ['/labs/vision-grid', 'Perception Bench'],
  ['/labs/gait', 'Locomotion Bench'],
  ['/lesson/w2l3', 'Proprioception'],
  ['/lesson/w3l5', 'Actuators'],
  ['/lesson/w5l10', 'Embedded'],
  ['/lesson/w6l11', 'State Estimation'],
  ['/lesson/w7l14', 'Safety'],
  ['/quiz', 'Quiz Arena'],
  ['/quiz/w3l6', 'PID'],
  ['/boss/1', 'Trial'],
  ['/flashcards', 'Flashcard Forge'],
  ['/charts', 'Charts'],
  ['/tables', 'Engineering Tables'],
  ['/ideas', 'Idea Lab'],
  ['/ideas/mycelium', 'mycelium'],
  ['/atlas', 'Heritage Atlas'],
  ['/achievements', 'Adinkra'],
  ['/progress', 'Progress'],
  ['/glossary', 'Glossary'],
  ['/beyond', 'even better'],
];

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/course" element={<Course />} />
        <Route path="/lesson/:lessonId" element={<LessonPage />} />
        <Route path="/labs" element={<Labs />} />
        <Route path="/labs/:labId" element={<Labs />} />
        <Route path="/quiz" element={<QuizArena />} />
        <Route path="/quiz/:lessonId" element={<QuizArena />} />
        <Route path="/boss" element={<QuizArena />} />
        <Route path="/boss/:week" element={<BossQuizPage />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/charts" element={<Charts />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/ideas" element={<Ideas />} />
        <Route path="/ideas/:projectId" element={<IdeaDetail />} />
        <Route path="/atlas" element={<Atlas />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/beyond" element={<Beyond />} />
      </Route>
    </Routes>
  );
}

console.log('--- content inventory ---');
console.log(`lessons           ${lessons.length}`);
console.log(`quiz questions    ${lessons.reduce((a, l) => a + l.quiz.length, 0)} + ${bossQuizzes.reduce((a, b) => a + b.questions.length, 0)} boss`);
console.log(`flashcards        ${flashcards.length}`);
console.log(`key terms         ${allKeyTerms.length}`);
console.log(`reference tables  ${referenceTables.length}`);
console.log(`idea blueprints   ${allProjects.length}`);
console.log(`heritage entries  ${heritageEntries.length}`);
console.log('--- route renders ---');

let failures = 0;
for (const [path, needle] of ROUTES) {
  try {
    const html = renderToString(
      <StaticRouter location={path}>
        <App />
      </StaticRouter>,
    );
    const ok = html.length > 1200 && html.includes(needle);
    if (!ok) failures++;
    console.log(`${ok ? 'PASS' : 'WEAK'}  ${path.padEnd(24)} ${String(html.length).padStart(7)} chars  ${needle}`);
  } catch (err) {
    failures++;
    console.log(`FAIL  ${path.padEnd(24)} ${(err as Error).message.slice(0, 160)}`);
  }
}

console.log(failures === 0 ? '\nSMOKE_OK' : `\nSMOKE_FAILURES ${failures}`);
process.exit(failures === 0 ? 0 : 1);
