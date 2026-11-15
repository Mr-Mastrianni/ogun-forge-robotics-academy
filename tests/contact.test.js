import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/contact.js';
const originalFetch = globalThis.fetch;
const keys = ['RESEND_API_KEY', 'CONTACT_TO', 'CONTACT_FROM'];
const originalEnv = Object.fromEntries(keys.map(k => [k, process.env[k]]));
afterEach(() => { globalThis.fetch = originalFetch; for (const k of keys) { if (originalEnv[k] === undefined) delete process.env[k]; else process.env[k] = originalEnv[k]; } });
const valid = { name: 'Visitor', email: 'visitor@example.com', subject: 'Robotics project', message: '<script>example</script>', serviceType: 'AI Consulting' };
async function call(body, method = 'POST') {
  const response = { code: 200, headers: {}, setHeader(k,v) { this.headers[k]=v; }, status(code) { this.code=code; return this; }, json(data) { this.data=data; return this; } };
  await handler({ body, method }, response); return response;
}
test('rejects invalid contacts without sending mail', async () => {
  let sent = false; globalThis.fetch = async () => { sent = true; };
  assert.equal((await call({email: 'bad'})).code, 400);
  assert.equal((await call({email: valid.email})).code, 400);
  assert.equal((await call(valid, 'GET')).code, 405);
  assert.equal(sent, false);
});
test('honeypot submissions are ignored', async () => { assert.deepEqual((await call({website: 'spam'})).data, {ok: true}); });
test('missing mail configuration returns an actionable failure', async () => {
  keys.forEach(k => delete process.env[k]); assert.equal((await call(valid)).code, 503);
});
test('contact and waitlist send escaped content with the correct reply address', async () => {
  Object.assign(process.env, {RESEND_API_KEY:'test',CONTACT_TO:'owner@example.com',CONTACT_FROM:'verified@example.com'});
  const messages=[]; globalThis.fetch = async (url, options) => { messages.push(JSON.parse(options.body)); return {ok:true}; };
  assert.equal((await call(valid)).data.ok, true);
  assert.equal((await call({kind:'waitlist',email:valid.email})).data.ok, true);
  assert.equal(messages[0].reply_to, valid.email);
  assert.ok(messages[0].html.includes('&lt;script&gt;'));
  assert.ok(!messages[0].html.includes('<script>'));
  assert.ok(messages[1].subject.includes('waitlist'));
});
test('provider failure is never reported as success', async () => {
  Object.assign(process.env, {RESEND_API_KEY:'test',CONTACT_TO:'owner@example.com',CONTACT_FROM:'verified@example.com'});
  globalThis.fetch = async () => ({ok:false,status:502,text:async () => 'provider unavailable'});
  assert.equal((await call(valid)).code, 502);
});
