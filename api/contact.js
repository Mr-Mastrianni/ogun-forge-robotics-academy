// Vercel serverless function: receives the Contact form and the "Join the Hive" waitlist.
// It emails each submission through Resend (https://resend.com) when these environment
// variables are set in the Vercel project:
//   RESEND_API_KEY  - your Resend API key
//   CONTACT_TO      - where submissions go, e.g. hello@kamitron.com
//   CONTACT_FROM    - a sender on a domain verified in Resend, e.g. "Kamitron <site@kamitron.com>"
// Until they are set it answers 503, and the site asks visitors to email directly.

const LIMITS = { name: 100, email: 200, subject: 200, message: 2000, serviceType: 100 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(v, max) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}
function esc(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Use POST.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  // Honeypot: real visitors never fill this hidden field.
  if (body.website) return res.status(200).json({ ok: true });

  const kind = body.kind === 'waitlist' ? 'waitlist' : 'contact';
  const email = clean(body.email, LIMITS.email);
  const name = clean(body.name, LIMITS.name);
  const subject = clean(body.subject, LIMITS.subject);
  const message = clean(body.message, LIMITS.message);
  const serviceType = clean(body.serviceType, LIMITS.serviceType);

  if (!EMAIL_RE.test(email)) return res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });
  if (kind === 'contact' && (!name || !subject || !message)) {
    return res.status(400).json({ ok: false, error: 'Please fill in your name, subject and message.' });
  }

  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM) {
    return res.status(503).json({ ok: false, error: 'Submissions are not switched on yet.' });
  }

  const title = kind === 'waitlist' ? `New Hive waitlist sign-up: ${email}` : `Ogun Forge / Kamitron contact: ${subject}`;
  const rows = kind === 'waitlist'
    ? [['Email', email]]
    : [['Name', name], ['Email', email], ['Service interest', serviceType || 'Not specified'], ['Subject', subject], ['Message', message]];
  const html = `<h2>${esc(title)}</h2><table cellpadding="6">${rows
    .map(([k, v]) => `<tr><td><strong>${esc(k)}</strong></td><td style="white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join('')}</table><p>Sent from Ogun Forge / Kamitron on ${new Date().toUTCString()}.</p>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: CONTACT_FROM, to: [CONTACT_TO], reply_to: email, subject: title, html }),
    });
    if (!r.ok) {
      console.error('Resend error', r.status, await r.text());
      return res.status(502).json({ ok: false, error: 'The message could not be sent.' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Send failed', err);
    return res.status(502).json({ ok: false, error: 'The message could not be sent.' });
  }
};
