import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Panel, Progress, SectionTitle, StatOrb, Chip } from '@/components/ui';
import { Field } from '@/components/manufacturing/Fields';
import { useManufacturing } from '@/lib/manufacturingStore';
import { clearedGates, download, newProject, parseProjectBackup } from '@/lib/manufacturing';
import { gates } from '@/content/manufacturing';
import ProductionWorkspace from '@/components/manufacturing/ProductionWorkspace';

export default function Manufacturing() {
  const { productionId } = useParams();
  const projects = useManufacturing((s) => s.projects);
  const add = useManufacturing((s) => s.add);
  const remove = useManufacturing((s) => s.remove);
  const learned = useManufacturing((s) => s.learned);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const nav = useNavigate();
  const project = projects.find((p) => p.id === productionId);
  if (productionId)
    return project ? (
      <ProductionWorkspace key={project.id} project={project} />
    ) : (
      <Panel className="p-6">
        <h1 className="text-xl text-white">Project not found on this device</h1>
        <p className="my-3 text-k-muted">Import its backup or open a project saved in this browser.</p>
        <Link className="btn btn-primary" to="/manufacturing">
          Back to Manufacturing Forge
        </Link>
      </Panel>
    );
  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="The production workbench"
        title="Manufacturing Forge"
        sub="From a spark of an idea to a batch you can stand behind."
        right={
          <Link to="/manufacturing/learn" className="btn btn-primary">
            Learn the workflow →
          </Link>
        }
      />
      <Panel tone="myco" className="p-6">
        <div className="font-mono text-xs uppercase tracking-widest text-k-moss">
          Learn · document · verify · release
        </div>
        <h1 className="font-heading text-2xl text-white mt-2">Build the evidence before the inventory.</h1>
        <p className="mt-3 max-w-3xl text-k-mint">
          Create a product project or start from any Idea Lab blueprint. Compare suppliers, test your
          economics, and work through eight evidence gates. Simulation and a completed checklist do not
          certify a product.
        </p>
        <Link className="btn btn-myco mt-4" to="/ideas">
          Choose a blueprint →
        </Link>
      </Panel>
      <div className="grid gap-3 sm:grid-cols-3">
        <StatOrb value={projects.length} label="Production projects" />
        <StatOrb value={`${learned.length}/6`} label="Lessons read" tone="myco" />
        <StatOrb
          value={projects.filter((p) => clearedGates(p) === gates.length).length}
          label="Workflows documented"
          tone="sirius"
        />
      </div>
      <Panel className="p-5">
        <h2 className="font-heading text-xl text-white">Start a project</h2>
        <form
          className="mt-4 flex flex-wrap gap-3 items-end"
          onSubmit={(e) => {
            e.preventDefault();
            if (!title.trim()) return;
            const p = newProject(title);
            add(p);
            nav(`/manufacturing/project/${p.id}`);
          }}
        >
          <div className="flex-1 min-w-48">
            <Field label="Product name" maxLength={200} value={title} onChange={setTitle} />
          </div>
          <button className="btn btn-primary" disabled={!title.trim()}>
            Create production project
          </button>
        </form>
      </Panel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-xl text-white">Your workbench</h2>
        <label className="btn btn-ghost cursor-pointer">
          Import project backup
          <input
            className="sr-only"
            type="file"
            accept="application/json,.json"
            onChange={async (e) => {
              const input = e.currentTarget;
              const file = input.files?.[0];
              if (!file) return;
              try {
                if (file.size > 2_000_000) throw new Error('Backup must be smaller than 2 MB.');
                const p = parseProjectBackup(await file.text());
                add(p);
                setMessage('Backup imported as a new project. Existing projects were kept.');
              } catch (err) {
                setMessage((err as Error).message);
              } finally {
                input.value = '';
              }
            }}
          />
        </label>
      </div>
      {message && (
        <p role="status" className="rounded-lg border border-white/20 p-3 text-k-glint">
          {message}
        </p>
      )}
      {!projects.length ? (
        <Panel className="p-8 text-center">
          <div className="text-4xl">⚒</div>
          <p className="mt-3 text-k-muted">
            Your first production run begins with a question worth solving.
          </p>
          <p className="mt-2 text-sm text-k-muted">
            Create a project above, or bring a blueprint from the Idea Lab.
          </p>
        </Panel>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => {
            const cleared = clearedGates(p);
            return (
              <Panel key={p.id} className="p-5">
                <Chip tone={cleared === 8 ? 'myco' : 'gold'}>
                  {cleared === 8 ? 'All gates documented' : `Next: ${gates[cleared].title}`}
                </Chip>
                <h3 className="mt-3 font-heading text-xl text-white">
                  <Link to={`/manufacturing/project/${p.id}`}>{p.title}</Link>
                </h3>
                <div className="mt-4">
                  <Progress value={cleared / gates.length} label={`${cleared} of 8 gates cleared`} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link className="btn btn-primary" to={`/manufacturing/project/${p.id}`}>
                    Open project →
                  </Link>
                  <button
                    className="btn btn-ghost"
                    onClick={() =>
                      download(
                        'ogun-project-backup.json',
                        JSON.stringify({ version: 1, project: p }, null, 2),
                        'application/json',
                      )
                    }
                  >
                    Export backup
                  </button>
                  <button className="btn btn-ghost" onClick={() => setDeleteId(p.id)}>
                    Delete
                  </button>
                </div>
                {deleteId === p.id && (
                  <div className="mt-3 border border-red-400/50 rounded-lg p-3 text-sm">
                    <p>Delete this project from this browser? Export a backup first if you need it.</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        className="btn btn-ghost"
                        onClick={() => {
                          remove(p.id);
                          setDeleteId('');
                        }}
                      >
                        Delete project permanently
                      </button>
                      <button className="btn btn-ghost" onClick={() => setDeleteId('')}>
                        Keep project
                      </button>
                    </div>
                  </div>
                )}
              </Panel>
            );
          })}
        </div>
      )}
      <p className="text-sm text-k-muted">
        Saved automatically in this browser on this device. Export backups to keep your records or move them
        to another device. No supplier messages, purchases or payments are sent by this workspace.
      </p>
    </div>
  );
}
