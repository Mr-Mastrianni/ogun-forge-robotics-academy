import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Panel, Progress, SectionTitle, Chip } from '@/components/ui';
import { manufacturingModules, sources } from '@/content/manufacturing';
import { useManufacturing } from '@/lib/manufacturingStore';
import { useProgress } from '@/lib/store';

export default function ManufacturingLearn() {
  const { moduleId } = useParams();
  const m = manufacturingModules.find((m) => m.id === moduleId);
  const learned = useManufacturing((s) => s.learned);
  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Ọ̀gún’s Forge · from blueprint to batch"
        title="Manufacturing Academy"
        sub="Learn the commercial and production skills that turn a working device into a repeatable product."
        right={
          <Link className="btn btn-primary" to="/manufacturing">
            Open production workspace →
          </Link>
        }
      />
      <Panel className="p-5">
        <Progress value={learned.length / manufacturingModules.length} label="Manufacturing lessons read" />
        <p className="mt-3 text-sm text-k-muted">
          A companion track to the eight-week robotics course. Apply each lesson to your own project. Reading
          and quiz progress are separate from production readiness.
        </p>
      </Panel>
      <nav aria-label="Manufacturing lessons" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {manufacturingModules.map((mod) => (
          <Link
            key={mod.id}
            to={`/manufacturing/learn/${mod.id}`}
            className={`rounded-xl border p-4 ${m?.id === mod.id ? 'border-k-gold bg-k-gold/10' : 'border-white/15 bg-black/20'}`}
            aria-current={m?.id === mod.id ? 'page' : undefined}
          >
            <div className="text-k-glint font-heading">{mod.title}</div>
            <div className="mt-2 text-xs text-k-muted">
              {mod.minutes} min · {learned.includes(mod.id) ? '✓ read' : 'not read'}
            </div>
          </Link>
        ))}
      </nav>
      {m ? (
        <Lesson key={m.id} module={m} />
      ) : moduleId ? (
        <Panel className="p-5">That manufacturing lesson does not exist. Choose a lesson above.</Panel>
      ) : (
        <Panel tone="myco" className="p-6">
          <h3 className="font-heading text-xl text-white">Begin with the buyer. Finish with the batch.</h3>
          <p className="mt-2 text-k-muted">
            Follow six lessons, practice the decisions, then carry the evidence into your production gates.
          </p>
          <Link className="btn btn-myco mt-4" to="/manufacturing/learn/validate">
            Start lesson 01 →
          </Link>
        </Panel>
      )}
      <Panel className="p-5">
        <h3 className="font-heading text-white">Source notes & current references</h3>
        <p className="mt-2 text-sm text-k-muted">
          Adapted from your supplied manufacturing transcript, with original exercises and corrections. Cost
          examples, timelines and payment splits are scenarios. No universal tariff rate, certification
          shortcut, legal outcome or supplier credit approval is assumed. Check product-specific requirements
          when making a real decision.
        </p>
        <ul className="mt-3 space-y-2">
          {sources.map((s) => (
            <li key={s.url}>
              <a className="text-sm text-k-light underline" href={s.url} target="_blank" rel="noreferrer">
                {s.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
function Lesson({ module: m }: { module: (typeof manufacturingModules)[number] }) {
  const complete = useManufacturing((s) => s.complete);
  const score = useManufacturing((s) => s.score);
  const best = useManufacturing((s) => s.quizBest[m.id]);
  const learned = useManufacturing((s) => s.learned.includes(m.id));
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [graded, setGraded] = useState(false);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const next = manufacturingModules[manufacturingModules.findIndex((x) => x.id === m.id) + 1];
  const result = m.quiz.reduce((n, q, i) => n + (answers[i] === q.answer ? 1 : 0), 0);
  return (
    <article className="space-y-5">
      <Panel className="p-6">
        <Chip>Manufacturing lesson</Chip>
        <h1 className="mt-3 font-heading text-2xl text-white">{m.title}</h1>
        <p className="mt-2 text-k-muted">{m.summary}</p>
      </Panel>
      {m.sections.map((s) => (
        <Panel key={s.title} className="p-5">
          <h2 className="font-heading text-lg text-k-glint">{s.title}</h2>
          <p className="mt-3 leading-relaxed text-k-text">{s.body}</p>
        </Panel>
      ))}
      <Panel tone="myco" className="p-5">
        <h2 className="font-heading text-xl text-white">Take it to the workbench</h2>
        <p className="my-3 text-k-mint">{m.exercise}</p>
        <Link className="btn btn-myco" to="/manufacturing">
          Apply to a project →
        </Link>
      </Panel>
      <Panel className="p-5">
        <h2 className="font-heading text-xl text-white">Flashcards · tap to reveal</h2>
        <div className="grid gap-3 mt-4 md:grid-cols-3">
          {m.terms.map((t, i) => (
            <button
              key={t.term}
              className="rounded-xl border border-white/20 bg-black/20 p-4 text-left min-h-32"
              aria-expanded={!!flipped[i]}
              onClick={() => setFlipped((s) => ({ ...s, [i]: !s[i] }))}
            >
              <span className="block font-heading text-k-gold">{t.term}</span>
              <span className="block text-sm mt-3 text-k-text">
                {flipped[i] ? t.definition : 'Reveal definition ↻'}
              </span>
            </button>
          ))}
        </div>
      </Panel>
      <Panel className="p-5">
        <h2 className="font-heading text-xl text-white">Knowledge check</h2>
        <p className="text-sm text-k-muted mt-1">
          Best score: {best === undefined ? 'not attempted' : `${best}/${m.quiz.length}`}
        </p>
        <div className="space-y-6 mt-5">
          {m.quiz.map((q, i) => (
            <fieldset key={q.question}>
              <legend className="text-k-glint mb-2">
                {i + 1}. {q.question}
              </legend>
              <div className="space-y-2">
                {q.choices.map((choice, j) => (
                  <label
                    key={choice}
                    className={`flex items-start gap-3 rounded-lg border p-3 text-sm ${graded && j === q.answer ? 'border-k-moss bg-k-moss/10' : 'border-white/15'}`}
                  >
                    <input
                      type="radio"
                      name={`quiz-${m.id}-${i}`}
                      checked={answers[i] === j}
                      disabled={graded}
                      onChange={() => setAnswers((a) => ({ ...a, [i]: j }))}
                    />
                    <span>{choice}</span>
                  </label>
                ))}
              </div>
              {graded && (
                <p className="mt-2 text-sm text-k-muted">
                  {answers[i] === q.answer ? '✓ Correct. ' : 'Review: '}
                  {q.explanation}
                </p>
              )}
            </fieldset>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3 items-center">
          {graded ? (
            <>
              <p role="status">
                Score: {result}/{m.quiz.length}
              </p>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setAnswers({});
                  setGraded(false);
                }}
              >
                Try again
              </button>
            </>
          ) : (
            <button
              className="btn btn-primary"
              disabled={Object.keys(answers).length !== m.quiz.length}
              onClick={() => {
                score(m.id, result);
                setGraded(true);
              }}
            >
              Check answers
            </button>
          )}
        </div>
      </Panel>
      <div className="flex flex-wrap gap-3">
        <button
          className="btn btn-primary"
          disabled={learned}
          onClick={() => {
            complete(m.id);
            useProgress.getState().touchStreak();
          }}
        >
          {learned ? '✓ Lesson marked read' : 'Mark lesson read'}
        </button>
        {next && (
          <Link className="btn btn-ghost" to={`/manufacturing/learn/${next.id}`}>
            Next lesson →
          </Link>
        )}
      </div>
    </article>
  );
}
