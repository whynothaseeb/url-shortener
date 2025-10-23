import express from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// open sqlite db
const dbPromise = open({
  filename: path.join(__dirname, 'urls.db'),
  driver: sqlite3.Database
});

async function initDB() {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS urls (
      id TEXT PRIMARY KEY,
      original_url TEXT NOT NULL,
      clicks INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}
initDB().catch(err => console.error('DB init error', err));

// API: shorten
app.post('/api/shorten', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'url is required' });

    const id = nanoid(7);
    const db = await dbPromise;
    await db.run('INSERT INTO urls (id, original_url) VALUES (?, ?)', [id, url]);

    // return both id and full short URL (assumes frontend uses /redirect route)
    res.json({ id, shortUrl: `${process.env.SHORT_BASE || `http://localhost:${PORT}`}/r/${id}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

// API: analytics
app.get('/api/analytics/:id', async (req, res) => {
  const id = req.params.id;
  const db = await dbPromise;
  const row = await db.get('SELECT id, original_url, clicks, created_at FROM urls WHERE id = ?', [id]);
  if (!row) return res.status(404).json({ error: 'not found' });
  res.json(row);
});

// API: list (optional)
app.get('/api/urls', async (req, res) => {
  const db = await dbPromise;
  const rows = await db.all('SELECT id, original_url, clicks, created_at FROM urls ORDER BY created_at DESC LIMIT 100');
  res.json(rows);
});

// Redirect route for public short link: /r/:id
app.get('/r/:id', async (req, res) => {
  const id = req.params.id;
  const db = await dbPromise;
  const row = await db.get('SELECT original_url FROM urls WHERE id = ?', [id]);
  if (!row) return res.status(404).send('Short URL not found');
  await db.run('UPDATE urls SET clicks = clicks + 1 WHERE id = ?', [id]);
  // redirect to original
  res.redirect(row.original_url);
});

// API: delete a short link
app.delete('/api/urls/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await dbPromise;
    const result = await db.run('DELETE FROM urls WHERE id = ?', [id]);
    if (result.changes === 0) return res.status(404).json({ error: 'not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});


// health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Backend listening on ${PORT}`);
});
