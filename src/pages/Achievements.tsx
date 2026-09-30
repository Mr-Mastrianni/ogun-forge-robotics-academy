import { Link } from 'react-router-dom';
import { Chip, Panel, Progress, SectionTitle, StatOrb } from '@/components/ui';
import { ADINKRA_GLYPHS, BADGES, RANKS, levelFromXp, nextRank, rankFor, rankProgress } from '@/lib/progression';
import { useProgress } from '@/lib/store';
import { allProjects, bossQuizzes, flashcards, lessons } from '@/content';

export default function Achievements() {
  const s = useProgress();
  const xp = s.xp;
  const rank = rankFor(xp);
  const nxt = nextRank(xp);

  const earned = new Set<string>();
  const lessonsDone = Object.keys(s.completedLessons).length;
  if (lessonsDone >= 1) earned.add('gye-nyame');
  if (Object.values(s.scores).some((v) => v.total > 0 && v.best === v.total)) earned.add('dwennimmen');
  if (Object.values(s.scores).some((v) => v.attempts > 1 && v.best === v.total)) earned.add('sankofa');
  if (s.streakCount >= 3) earned.add('nyame-dua');
  if (Object.values(s.bossScores).some((v) => v >= 8)) earned.add('akoma');
  if (Object.values(s.bossScores).length >= 1) earned.add('adinkrahene');
  if (lessonsDone >= 16) earned.add('fihankra');
  if (Object.values(s.labs).reduce((a, b) => a + b.length, 0) >= 5) earned.add('nkyinkyim');
  if (s.completedLessons['w3l5'] && s.completedLessons['w3l6']) earned.add('bi-nka-bi');
  if ((s.labs['mycelium']?.length ?? 0) >= 3 && s.savedProjects.filter((p) => p.includes('myc')).length >= 3) earned.add('myco-bloom');
  if (s.totalCardsReviewed >= 150) earned.add('sirius-b');
  if (lessonsDone >= 16 && Object.keys(s.bossScores).length >= 8) earned.add('ogun-forge');
  if (s.savedProjects.length >= 10) earned.add('wakanda');
  if ((s.labs['bloch']?.length ?? 0) >= 2 && s.completedLessons['w8l16']) earned.add('quantum-griot');

  const tiers: { id: string; label: string; color: string }[] = [
    { id: 'bronze', label: 'Bronze', color: '#c96f2b' },
    { id: 'silver', label: 'Silver', color: '#c9c9d6' },
    { id: 'gold', label: 'Gold', color: '#f5b301' },
    { id: 'orisha', label: 'Orisha', color: '#c026d3' },
  ];

  const nextBadge = BADGES.find((b) => !earned.has(b.id));

  return (
    <div className="space-y-7">
      <SectionTitle
        eyebrow="trophy room"
        title="Adinkra Badges & the Ladder of Ranks"
        sub="Fourteen Adinkra symbols, each earned by demonstrating something. Below them, ten ranks trace the ascent from raw curiosity to cosmic knower."
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <StatOrb value={`${earned.size}/${BADGES.length}`} label="badges earned" glyph="✺" />
        <StatOrb value={xp} label="total XP" glyph="✦" tone="myco" />
        <StatOrb value={levelFromXp(xp)} label="level" glyph="⌘" tone="psy" />
        <StatOrb value={`${s.streakCount} d`} label="streak" glyph="🔥" tone="sirius" />
        <StatOrb value={`${s.savedProjects.length}`} label="projects saved" glyph="🍄" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          {tiers.map((tier) => {
            const list = BADGES.filter((b) => b.tier === tier.id);
            if (!list.length) return null;
            return (
              <section key={tier.id}>
                <div className="mb-2 flex items-center gap-3">
                  <span className="font-display text-xl" style={{ color: tier.color }}>
                    {tier.label}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                  <span className="font-mono text-[10.5px] text-[#c9bde6]">
                    {list.filter((b) => earned.has(b.id)).length}/{list.length}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {list.map((b) => {
                    const has = earned.has(b.id);
                    return (
                      <Panel
                        key={b.id}
                        tone={has ? (tier.id === 'orisha' ? 'hot' : 'gold') : 'gold'}
                        className={`p-4 ${has ? '' : 'opacity-55'}`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border text-2xl"
                            style={{ borderColor: `${tier.color}66`, background: `${tier.color}18`, filter: has ? 'none' : 'grayscale(1)' }}
                          >
                            {b.glyph}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-heading text-[13.5px] text-white">{b.name}</span>
                              {has && <span className="text-[11px] text-[#6ee7a8]">✓</span>}
                            </div>
                            <div className="font-mono text-[10px] uppercase tracking-widest text-[#f5b301]">{b.adinkra}</div>
                            <p className="mt-1 text-[12px] leading-relaxed text-[#c9bde6]">{b.description}</p>
                            <p className="mt-1.5 text-[11.5px] text-[#ded4f2]">
                              <span className="text-[#8c82a8]">require:</span> {b.requirement}
                            </p>
                          </div>
                        </div>
                      </Panel>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <aside className="space-y-4">
          <Panel className="p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#f5b301]">current rank</div>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-3xl">{rank.glyph}</span>
              <div>
                <div className="font-display text-lg text-white">{rank.name}</div>
                <div className="text-[11.5px] text-[#c9bde6]">{rank.blurb}</div>
              </div>
            </div>
            <div className="mt-3">
              <Progress value={rankProgress(xp)} label={nxt ? `to ${nxt.name}` : 'peak rank'} />
            </div>
            <div className="mt-2 font-mono text-[11px] text-[#c9bde6]">
              {nxt ? `${nxt.minXp - xp} XP remaining` : 'You have reached the end of the ladder — for now.'}
            </div>
          </Panel>

          {nextBadge && (
            <Panel tone="myco" className="p-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#6ee7a8]">next badge</div>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-3xl">{nextBadge.glyph}</span>
                <div>
                  <div className="font-heading text-sm text-white">{nextBadge.name}</div>
                  <div className="text-[11.5px] text-[#cfe9dc]">{nextBadge.requirement}</div>
                </div>
              </div>
            </Panel>
          )}

          <Panel className="p-4">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#f5b301]">the ladder</div>
            <ol className="space-y-1.5">
              {RANKS.map((r) => {
                const reached = xp >= r.minXp;
                return (
                  <li
                    key={r.id}
                    className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[12px] ${
                      r.id === rank.id
                        ? 'border-[#f5b301]/60 bg-[#f5b301]/12 text-[#ffe9a8]'
                        : reached
                          ? 'border-white/10 bg-white/[0.03] text-[#ded4f2]'
                          : 'border-white/5 text-[#8c82a8]'
                    }`}
                  >
                    <span>{r.glyph}</span>
                    <span className="flex-1">{r.name}</span>
                    <span className="font-mono text-[10px]">{r.minXp}</span>
                  </li>
                );
              })}
            </ol>
          </Panel>

          <Panel tone="psy" className="p-4">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#f5c8ff]">
              ways to earn XP
            </div>
            <ul className="space-y-1 text-[12px] text-[#f3e9ff]">
              <li>· read a lesson — +40</li>
              <li>· lesson quiz — 20 + 15/correct (+35 flawless)</li>
              <li>· boss trial — 90 + 22/correct</li>
              <li>· lab challenge — +25 each</li>
              <li>· flashcard review — +3 each</li>
              <li>· daily streak — +30</li>
              <li>· save an Idea Lab blueprint — +6</li>
            </ul>
          </Panel>

          <Panel className="p-4">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#f5b301]">
              course content
            </div>
            <div className="space-y-1 font-mono text-[11.5px] text-[#c9bde6]">
              <div className="flex justify-between">
                <span>lessons</span>
                <span>{lessons.length}</span>
              </div>
              <div className="flex justify-between">
                <span>boss trials</span>
                <span>{bossQuizzes.length}</span>
              </div>
              <div className="flex justify-between">
                <span>flashcards</span>
                <span>{flashcards.length}</span>
              </div>
              <div className="flex justify-between">
                <span>idea blueprints</span>
                <span>{allProjects.length}</span>
              </div>
              <div className="flex justify-between">
                <span>adinkra symbols used</span>
                <span>{ADINKRA_GLYPHS.length}</span>
              </div>
            </div>
            <Link to="/ideas" className="btn btn-myco mt-3 w-full !py-1.5 text-[12px]">
              earn the Vibranium Mind →
            </Link>
          </Panel>
        </aside>
      </div>

      <Panel className="p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#f5b301]">about the symbols</div>
        <p className="mt-2 text-[13px] leading-relaxed text-[#c9bde6]">
          Adinkra are visual symbols created by the Akan peoples of Ghana and Côte d'Ivoire, traditionally stamped
          onto cloth. Each encodes a proverb, a value or an observation about how systems behave. Using them as an
          achievement language is a deliberate design choice: it keeps the course's reward system rooted in a
          knowledge tradition that treated pattern, recursion and meaning as engineering material.
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {ADINKRA_GLYPHS.map((g, i) => (
            <Chip key={`${g.name}-${i}`} tone="dim">
              {g.glyph} {g.name}
            </Chip>
          ))}
        </div>
      </Panel>
    </div>
  );
}
