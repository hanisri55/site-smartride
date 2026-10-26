import express from 'express';
import mysql from 'mysql2/promise';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3000);
const production = process.env.NODE_ENV === 'production';
const databaseUrl = process.env.DATABASE_URL || process.env.DRIZZLE_DATABASE_URL;
const pool = databaseUrl ? mysql.createPool(databaseUrl) : null;
const app = express();
const demoUser = { id: 'demo-user', name: 'Arjun Mehta', email: 'arjun@finora.app', currency: 'INR', monthlyIncome: 45000, avatar: 'AM' };

async function ensureSchema() {
  if (!pool) throw new Error('DATABASE_URL is not configured');
  await pool.query(`CREATE TABLE IF NOT EXISTS finora_users (id VARCHAR(64) PRIMARY KEY, email VARCHAR(255) NOT NULL UNIQUE, name VARCHAR(120) NOT NULL, currency VARCHAR(12) NOT NULL DEFAULT 'INR', monthly_income DECIMAL(15,2) NOT NULL DEFAULT 0, avatar VARCHAR(8) NOT NULL DEFAULT 'AM', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS finora_states (user_id VARCHAR(64) PRIMARY KEY, payload JSON NOT NULL, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, CONSTRAINT finora_states_user_fk FOREIGN KEY (user_id) REFERENCES finora_users(id) ON DELETE CASCADE)`);
  await pool.query('INSERT IGNORE INTO finora_users (id,email,name,currency,monthly_income,avatar) VALUES (?,?,?,?,?,?)', [demoUser.id, demoUser.email, demoUser.name, demoUser.currency, demoUser.monthlyIncome, demoUser.avatar]);
}
const userId = req => String(req.get('x-finora-user') || demoUser.id).slice(0, 64);
app.use(express.json({ limit: '2mb' }));
app.use((req, res, next) => { res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*'); res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Finora-User'); res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS'); if (req.method === 'OPTIONS') return res.sendStatus(204); next(); });
app.get('/api/health', async (_req, res) => { try { await ensureSchema(); res.json({ ok: true, database: 'mysql', persisted: true }); } catch (error) { res.status(503).json({ ok: false, database: 'mysql', persisted: false, error: error.message }); } });
app.post('/api/session', async (req, res) => { try { await ensureSchema(); const email = String(req.body?.email || demoUser.email).trim().toLowerCase(); const name = String(req.body?.name || demoUser.name).trim() || demoUser.name; const [rows] = await pool.query('SELECT id FROM finora_users WHERE email=?', [email]); const id = rows[0]?.id || crypto.randomUUID(); await pool.query('INSERT INTO finora_users (id,email,name) VALUES (?,?,?) ON DUPLICATE KEY UPDATE name=VALUES(name)', [id, email, name]); res.json({ ok: true, userId: id }); } catch (error) { res.status(500).json({ ok: false, error: error.message }); } });
app.get('/api/bootstrap', async (req, res) => { try { await ensureSchema(); const [rows] = await pool.query('SELECT u.id,u.name,u.email,u.currency,u.monthly_income,u.avatar,s.payload FROM finora_users u LEFT JOIN finora_states s ON s.user_id=u.id WHERE u.id=?', [userId(req)]); if (!rows[0]) return res.status(401).json({ ok: false, error: 'Unknown Finora user' }); const row = rows[0]; const payload = typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload; const emptyDemo = payload && Array.isArray(payload.transactions) && payload.transactions.length === 0 && Array.isArray(payload.budgets) && payload.budgets.length === 0; res.json({ ok: true, user: { id: row.id, name: row.name, email: row.email, currency: row.currency, monthlyIncome: Number(row.monthly_income), avatar: row.avatar }, store: emptyDemo ? null : payload || null }); } catch (error) { res.status(500).json({ ok: false, error: error.message }); } });
app.post('/api/state', async (req, res) => { try { await ensureSchema(); const id = userId(req); const store = req.body?.store; if (!store) return res.status(400).json({ ok: false, error: 'store is required' }); await pool.query('INSERT IGNORE INTO finora_users (id,email,name) VALUES (?,?,?)', [id, `${id}@finora.local`, store.profile?.name || demoUser.name]); await pool.query('INSERT INTO finora_states (user_id,payload) VALUES (?,?) ON DUPLICATE KEY UPDATE payload=VALUES(payload),updated_at=CURRENT_TIMESTAMP', [id, JSON.stringify(store)]); res.json({ ok: true, persistedAt: new Date().toISOString() }); } catch (error) { res.status(500).json({ ok: false, error: error.message }); } });

if (production) { app.use(express.static(path.resolve(root, '../dist'))); app.get('*', (_req, res) => res.sendFile(path.resolve(root, '../dist/index.html'))); }
else { const vite = await createViteServer({ server: { middlewareMode: true, allowedHosts: true }, appType: 'spa' }); app.use(vite.middlewares); }
await ensureSchema();
app.listen(port, '0.0.0.0', () => console.log(`Finora server listening on ${port}`));
