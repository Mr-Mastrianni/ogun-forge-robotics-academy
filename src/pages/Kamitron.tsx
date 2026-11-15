import { useEffect, useRef, useState, type MouseEvent, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { KamitronNav } from '@/components/kamitron/KamitronNav';
import { Chip, Panel } from '@/components/ui';
import { KAMITRON_PAGES } from '@/content/kamitron';
import factory from '@/content/kamitron/factory.html?raw';
import about from '@/content/kamitron/about.html?raw';
import services from '@/content/kamitron/services.html?raw';
import community from '@/content/kamitron/community.html?raw';
import contact from '@/content/kamitron/contact.html?raw';
import '@/styles/kamitron.css';

const CONTENT: Record<string, string> = { factory, about, services, community, contact };

export default function Kamitron() {
  const location = useLocation();
  const navigate = useNavigate();
  const container = useRef<HTMLDivElement>(null);
  const page = KAMITRON_PAGES.find(p => p.path === location.pathname) ?? KAMITRON_PAGES[0];
  const [copyStatus, setCopyStatus] = useState('');

  useEffect(() => {
    document.title = `${page.title} · Ọ̀gún’s Forge`;
    const service = new URLSearchParams(location.search).get('service');
    const select = container.current?.querySelector<HTMLSelectElement>('#serviceType');
    if (service && select) select.value = service;
    if (location.hash) requestAnimationFrame(() => {
      container.current?.querySelectorAll('[id]').forEach(el => {
        if (el.id === decodeURIComponent(location.hash.slice(1))) el.scrollIntoView({ block: 'start' });
      });
    });
  }, [page, location.search, location.hash]);

  async function click(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as Element;
    const copy = target.closest<HTMLButtonElement>('[data-copy]');
    if (copy) {
      try { await navigator.clipboard.writeText(copy.dataset.copy ?? ''); setCopyStatus('Email address copied.'); }
      catch { setCopyStatus('Email hello@kamitron.com'); }
      return;
    }
    const a = target.closest<HTMLAnchorElement>('a[href]');
    if (a && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button === 0 && !a.target) {
      const href = a.getAttribute('href')!;
      if (href.startsWith('/') || href.startsWith('#')) {
        event.preventDefault(); navigate(href.startsWith('#') ? location.pathname + href : href);
      }
    }
  }

  async function submit(event: FormEvent<HTMLDivElement>) {
    const form = event.target as HTMLFormElement;
    if (!form.matches('form[data-form]')) return;
    event.preventDefault();
    if (!form.reportValidity()) return;
    const button = form.querySelector<HTMLButtonElement>('[type="submit"]');
    if (button?.disabled) return;
    const status = form.querySelector<HTMLElement>('[role="status"]');
    const setStatus = (text: string) => { if (status) status.textContent = text; };
    const body = Object.fromEntries(new FormData(form).entries());
    if (button) button.disabled = true;
    setStatus('Sending…');
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...body, kind: form.dataset.form }), signal: AbortSignal.timeout(20000) });
      const result = await response.json();
      if (response.ok && result.ok) { setStatus(form.dataset.form === 'waitlist' ? 'You are on the list. Welcome to the Hive.' : 'Message sent. We will be in touch soon.'); form.reset(); }
      else setStatus(`${result.error || 'Could not send your message.'} Email hello@kamitron.com to reach us directly.`);
    } catch { setStatus('Could not reach the server. Please email hello@kamitron.com.'); }
    finally { if (button) button.disabled = false; }
  }

  return <div>
    <Panel className="mb-6 p-5"><Chip>Ọ̀gún’s Forge · Living Technology</Chip><p className="mt-3 text-sm text-[#c9bde6]">Kamitron brings nature-inspired engineering, creative technology and community into the Forge.</p></Panel>
    <KamitronNav />
    <p role="status" className="text-sm text-[#f5b301]">{copyStatus}</p>
    {/* Static, reviewed repository content; scripts, event attributes and source styles were removed during migration. */}
    <div key={page.key} ref={container} className="kamitron-content" onClick={click} onSubmit={submit} dangerouslySetInnerHTML={{ __html: CONTENT[page.key] }} />
  </div>;
}
