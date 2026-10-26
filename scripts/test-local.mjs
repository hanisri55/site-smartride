import { spawn } from 'node:child_process';
const port = 3101;
const server = spawn('node', ['server/index.mjs'], { env: { ...process.env, PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'] });
let logs = ''; server.stdout.on('data', d => { logs += d; }); server.stderr.on('data', d => { logs += d; });
const base = `http://127.0.0.1:${port}`;
const wait = ms => new Promise(r => setTimeout(r, ms));
try {
  let health;
  for (let i = 0; i < 30; i++) { try { const r = await fetch(`${base}/api/health`); health = await r.json(); if (r.ok) break; } catch {} await wait(250); }
  if (!health?.ok) throw new Error(`Database health failed: ${JSON.stringify(health)}`);
  const boot = await (await fetch(`${base}/api/bootstrap`, { headers: { 'X-Finora-User': 'demo-user' } })).json();
  const marker = `local-test-${Date.now()}`;
  const store = boot.store || { profile: boot.user, transactions: [], budgets: [], goals: [], notices: [], theme: 'light' };
  store.__testMarker = marker;
  const saved = await (await fetch(`${base}/api/state`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Finora-User': 'demo-user' }, body: JSON.stringify({ store }) })).json();
  const roundTrip = await (await fetch(`${base}/api/bootstrap`, { headers: { 'X-Finora-User': 'demo-user' } })).json();
  if (!saved.ok || roundTrip.store?.__testMarker !== marker) throw new Error('State round-trip failed');
  console.log(JSON.stringify({ ok: true, health, persisted: true, marker }));
} catch (error) { console.error(JSON.stringify({ ok: false, error: error.message, serverLogs: logs })); process.exitCode = 1; } finally { server.kill('SIGTERM'); }
