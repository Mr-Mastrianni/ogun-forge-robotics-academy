import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageHero } from '@/components/kamitron/KamitronShell';
import { setPageMeta } from '@/lib/pageMeta';

const UPDATED = 'November 27, 2026';

/** Plain-language privacy policy for kamitron.com and the Ogun Forge Academy. */
export default function Privacy() {
  useEffect(() => {
    setPageMeta({ title: 'Privacy policy · Kamitron', description: 'What kamitron.com collects, why, and how to have it deleted.', path: '/privacy' });
  }, []);
  return (
    <>
      <PageHero glyph="eye" kicker="Privacy policy" title="What we collect, and what we do not."
        lead={`Kamitron collects as little as it can. This page explains exactly what that is. Last updated ${UPDATED}.`} />
      <div className="kp">
        <section className="kp-sec">
          <div className="kp-grid g2">
            <article className="kp-card">
              <h2 className="kp-h">When you contact us</h2>
              <p>The contact form sends us your name, email address, subject, message and the topic you choose. We use them only to reply to you and to follow up on what you asked about. Messages are delivered to our inbox by Resend, an email delivery service.</p>
            </article>
            <article className="kp-card">
              <h2 className="kp-h">When you join the waitlist</h2>
              <p>We keep your email address to tell you about the Academy launch, workshops and community news. Every email we send will say how to stop receiving them, and you can also ask us at any time.</p>
            </article>
            <article className="kp-card">
              <h2 className="kp-h">Your academy progress stays on your device</h2>
              <p>XP, quiz scores, streaks, saved builds and display settings are stored in your own browser. They are never sent to us. Use <strong>reset progress</strong> in the academy, or clear this site's data in your browser, to erase them.</p>
            </article>
            <article className="kp-card">
              <h2 className="kp-h">No tracking, no selling</h2>
              <p>The site has no advertising, no tracking cookies and no third-party analytics. We do not sell or rent your information, and we share it only with the services that run the site, as described here, or when the law requires it.</p>
            </article>
            <article className="kp-card">
              <h2 className="kp-h">Hosting</h2>
              <p>kamitron.com is hosted by Vercel. Like any web host, Vercel processes technical request data, such as IP addresses, to deliver pages and protect the site from abuse.</p>
            </article>
            <article className="kp-card">
              <h2 className="kp-h">Younger learners</h2>
              <p>The academy can be used without giving us any personal information. If you are under 13, please ask a parent or guardian to contact us or join the waitlist for you.</p>
            </article>
          </div>
        </section>
        <section className="kp-sec">
          <div className="kp-callout">
            <h2>See or delete your information</h2>
            <p>Email <a href="mailto:hello@kamitron.com">hello@kamitron.com</a> to see what we hold about you, correct it or have it deleted. If this policy changes, we will update the date at the top of this page.</p>
            <div className="kp-actions"><Link className="sg-secondary" to="/contact">Contact Kamitron</Link></div>
          </div>
        </section>
      </div>
    </>
  );
}
