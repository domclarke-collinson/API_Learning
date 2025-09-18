// I undersstand some of this but not most of it.

import express, { Request, Response } from 'express';
import { Pool } from 'pg';

const app = express();
app.use(express.json());

// Read DB config from environment with sensible defaults
const pool = new Pool({
  host: process.env.DB_HOST || 'postgres', // service name in docker-compose
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'myuser',
  password: process.env.DB_PASSWORD || 'mypassword',
  database: process.env.DB_NAME || 'mydb',
});

// Optional: catch pool errors for long-running apps
pool.on('error', (err) => {
  console.error('Unexpected Postgres client error', err);
  process.exit(-1);
});

app.get('/memberships', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM memberships ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/memberships', async (req: Request, res: Response) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO memberships (name, email) VALUES ($1, $2) RETURNING *',
      [name, email] // parameterised query -> prevents SQL injection
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error(err);
    // example: handle unique constraint violation
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Insert failed' });
  }
});

// Graceful shutdown (close DB pool)
const PORT = Number(process.env.PORT || 4000);
const server = app.listen(PORT, () => {
  console.log(`Membership service running on port ${PORT}`);
});
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  await pool.end();
  server.close(() => process.exit(0));
});
