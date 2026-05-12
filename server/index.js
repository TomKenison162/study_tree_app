const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const { queries, calcStreak } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'study-tree-dev-secret-change-in-prod';

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'] }));
app.use(express.json());

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(header.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

/* ── AUTH ── */

app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'All fields required' });
  if (username.length < 2 || username.length > 30) return res.status(400).json({ error: 'Username must be 2-30 characters' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  if (queries.getUserByEmail.get(email)) return res.status(409).json({ error: 'Email already registered' });
  if (queries.getUserByUsername.get(username)) return res.status(409).json({ error: 'Username already taken' });

  const COLORS = ['#4a7a45','#b85278','#c4521e','#7a9268','#6a4e9c','#2e5a2a','#90b050','#2a5a2a','#507040'];
  const avatar_color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const password_hash = await bcrypt.hash(password, 10);
  const result = queries.createUser.run(username, email, password_hash, avatar_color);
  const user = queries.getUserById.get(result.lastInsertRowid);
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email or username and password required' });
  // Accept email or username in the email field
  const userRow = queries.getUserByEmail.get(email) || queries.getUserByUsername.get(email);
  if (!userRow) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, userRow.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const user = queries.getUserById.get(userRow.id);
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user });
});

app.get('/api/auth/me', auth, (req, res) => {
  const user = queries.getUserById.get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

/* ── SESSIONS ── */

app.post('/api/sessions', auth, (req, res) => {
  const { treeType, durationMins, cardsTotal, cardsDone, cardsFresh, cardsReview, redos, intention } = req.body;
  if (!treeType || !durationMins) return res.status(400).json({ error: 'treeType and durationMins required' });
  const result = queries.insertSession.run(
    req.user.id, treeType, durationMins || 0, cardsTotal || 0,
    cardsDone || 0, cardsFresh || 0, cardsReview || 0, redos || 0, intention || ''
  );
  res.json({ id: result.lastInsertRowid });
});

app.get('/api/sessions', auth, (req, res) => {
  const limit = Math.min(100, parseInt(req.query.limit) || 20);
  const offset = parseInt(req.query.offset) || 0;
  const sessions = queries.getSessionsByUser.all(req.user.id, limit, offset);
  const { count } = queries.countSessionsByUser.get(req.user.id);
  res.json({ sessions, total: count });
});

/* ── STATS ── */

app.get('/api/stats', auth, (req, res) => {
  const base = queries.getStats.get(req.user.id);
  const treeBreakdown = queries.getTreeBreakdown.all(req.user.id);
  const weeklyRaw = queries.getWeeklyData.all(req.user.id);
  const streakRows = queries.getStreak.all(req.user.id);
  const streak = calcStreak(streakRows);
  const user = queries.getUserById.get(req.user.id);

  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const day = d.toISOString().slice(0, 10);
    const found = weeklyRaw.find(r => r.day === day);
    last7.push({ day, sessions: found?.sessions || 0, minutes: found?.minutes || 0, cards: found?.cards || 0 });
  }

  res.json({
    totalSessions: base.total_sessions,
    totalMinutes: base.total_minutes,
    totalCards: base.total_cards,
    totalRedos: base.total_redos,
    longestSession: base.longest_session,
    mostCardsSession: base.most_cards_session,
    streak,
    treeBreakdown,
    weeklyData: last7,
    memberSince: user.created_at,
  });
});

/* ── SERVE CLIENT IN PRODUCTION ── */
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(clientDist, 'index.html'), err => {
    if (err) res.status(200).send('Run `npm run build` in client/ to serve the frontend.');
  });
});

app.listen(PORT, () => console.log(`Study Tree server running on http://localhost:${PORT}`));
