import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import KamitronShell from '@/components/kamitron/KamitronShell';

const Kamitron = lazy(() => import('@/pages/Kamitron'));
const SpecimenVault = lazy(() => import('@/pages/SpecimenVault'));

const Manufacturing = lazy(() => import('@/pages/Manufacturing'));
const ManufacturingLearn = lazy(() => import('@/pages/ManufacturingLearn'));

const SolarGenesis = lazy(() => import('@/pages/SolarGenesis'));
const Home = lazy(() => import('@/pages/Home'));
const Course = lazy(() => import('@/pages/Course'));
const MyceliumHub = lazy(() => import('@/pages/MyceliumHub'));
const LessonPage = lazy(() => import('@/pages/LessonPage'));
const Labs = lazy(() => import('@/pages/Labs'));
const QuizArena = lazy(() => import('@/pages/QuizArena'));
const BossQuizPage = lazy(() => import('@/pages/BossQuizPage'));
const Flashcards = lazy(() => import('@/pages/Flashcards'));
const Charts = lazy(() => import('@/pages/Charts'));
const Tables = lazy(() => import('@/pages/Tables'));
const Ideas = lazy(() => import('@/pages/Ideas'));
const IdeaDetail = lazy(() => import('@/pages/IdeaDetail'));
const Atlas = lazy(() => import('@/pages/Atlas'));
const Achievements = lazy(() => import('@/pages/Achievements'));
const ProgressPage = lazy(() => import('@/pages/ProgressPage'));
const Glossary = lazy(() => import('@/pages/Glossary'));
const Beyond = lazy(() => import('@/pages/Beyond'));

function Forging() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 animate-spinSlow place-items-center rounded-2xl border border-[#f5b301]/40 bg-gradient-to-br from-[#3a1206] to-[#120a2e] text-2xl shadow-gold">
          🔥
        </div>
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#f5b301]">heating the iron</div>
        <div className="mt-1 text-[12.5px] text-[#c9bde6]">loading the forge…</div>
      </div>
    </div>
  );
}

function LegacyKamitron({ to }: { to: string }) {
  const { search, hash } = useLocation();
  return <Navigate to={to + search + hash} replace />;
}

export default function App() {
  return (
    <Suspense fallback={<Forging />}>
      <Routes>
        <Route element={<KamitronShell />}>
          <Route path="/" element={<SolarGenesis />} />
          <Route path="/kamitron" element={<Kamitron />} />
          <Route path="/vault" element={<SpecimenVault />} />
          {['services', 'about', 'community', 'contact'].map(path => <Route key={path} path={`/${path}`} element={<Kamitron />} />)}
        </Route>
        <Route element={<Layout />}>
          <Route path="/academy" element={<Home />} />
          <Route path="/manufacturing" element={<Manufacturing />} />
          <Route path="/manufacturing/project/:productionId" element={<Manufacturing />} />
          <Route path="/manufacturing/learn" element={<ManufacturingLearn />} />
          <Route path="/manufacturing/learn/:moduleId" element={<ManufacturingLearn />} />
          {['vault', 'services', 'about', 'community', 'contact'].map(path => <Route key={`${path}-legacy`} path={`/${path}.html`} element={<LegacyKamitron to={`/${path}`} />} />)}
          <Route path="/course" element={<Course />} />
          <Route path="/mycelium" element={<MyceliumHub />} />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
