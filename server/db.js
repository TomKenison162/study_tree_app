const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'data.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    avatar_color TEXT DEFAULT '#4a7a45'
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    tree_type TEXT NOT NULL DEFAULT 'orchard',
    duration_mins INTEGER NOT NULL,
    cards_total INTEGER NOT NULL,
    cards_done INTEGER NOT NULL,
    cards_fresh INTEGER NOT NULL DEFAULT 0,
    cards_review INTEGER NOT NULL DEFAULT 0,
    redos INTEGER NOT NULL DEFAULT 0,
    completed_at TEXT DEFAULT (datetime('now')),
    intention TEXT DEFAULT '',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

const queries = {
  // users
  createUser: db.prepare(`
    INSERT INTO users (username, email, password_hash, avatar_color)
    VALUES (?, ?, ?, ?)
  `),
  getUserByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
  getUserByUsername: db.prepare('SELECT * FROM users WHERE username = ?'),
  getUserById: db.prepare('SELECT id, username, email, created_at, avatar_color FROM users WHERE id = ?'),

  // sessions
  insertSession: db.prepare(`
    INSERT INTO sessions (user_id, tree_type, duration_mins, cards_total, cards_done, cards_fresh, cards_review, redos, intention)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  getSessionsByUser: db.prepare(`
    SELECT * FROM sessions WHERE user_id = ? ORDER BY completed_at DESC LIMIT ? OFFSET ?
  `),
  countSessionsByUser: db.prepare('SELECT COUNT(*) as count FROM sessions WHERE user_id = ?'),

  getStats: db.prepare(`
    SELECT
      COUNT(*) as total_sessions,
      COALESCE(SUM(duration_mins), 0) as total_minutes,
      COALESCE(SUM(cards_done), 0) as total_cards,
      COALESCE(SUM(redos), 0) as total_redos,
      COALESCE(MAX(duration_mins), 0) as longest_session,
      COALESCE(MAX(cards_done), 0) as most_cards_session
    FROM sessions WHERE user_id = ?
  `),

  getTreeBreakdown: db.prepare(`
    SELECT tree_type, COUNT(*) as count
    FROM sessions WHERE user_id = ?
    GROUP BY tree_type ORDER BY count DESC
  `),

  getWeeklyData: db.prepare(`
    SELECT
      date(completed_at) as day,
      COUNT(*) as sessions,
      SUM(duration_mins) as minutes,
      SUM(cards_done) as cards
    FROM sessions
    WHERE user_id = ? AND completed_at >= datetime('now', '-7 days')
    GROUP BY date(completed_at)
    ORDER BY day ASC
  `),

  getStreak: db.prepare(`
    SELECT DISTINCT date(completed_at) as day
    FROM sessions WHERE user_id = ?
    ORDER BY day DESC
  `),

  getRecentSessions: db.prepare(`
    SELECT * FROM sessions WHERE user_id = ? ORDER BY completed_at DESC LIMIT 50
  `),
};

function calcStreak(rows) {
  if (!rows.length) return 0;
  const today = new Date().toISOString().slice(0, 10);
  let streak = 0;
  let cur = new Date(rows[0].day);
  const todayDate = new Date(today);
  const diffDays = Math.floor((todayDate - cur) / 86400000);
  if (diffDays > 1) return 0;
  for (let i = 0; i < rows.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - (diffDays + i));
    const actual = new Date(rows[i].day);
    if (actual.toISOString().slice(0, 10) !== expected.toISOString().slice(0, 10)) break;
    streak++;
  }
  return streak;
}

module.exports = { db, queries, calcStreak };
