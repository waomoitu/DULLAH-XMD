const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// ✅ Path to the activity.db inside the data folder
const dbPath = path.join(__dirname, '../data/activity.db');

// 📦 Open the database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("[SQLite ERROR]", err.message);
  } else {
    console.log("[SQLite] Connected to activity.db");
  }
});

// ✅ Ensure the 'activity' table exists
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS activity (
      chatId TEXT NOT NULL,
      userId TEXT NOT NULL,
      count INTEGER DEFAULT 0,
      PRIMARY KEY (chatId, userId)
    )
  `);
});

// ✅ Export the database methods
module.exports = {
  run: db.run.bind(db),
  get: db.get.bind(db),
  all: db.all.bind(db)
};

// === 💰 BANK SYSTEM START ===

// Create 'users' table if not exists
db.run(`CREATE TABLE IF NOT EXISTS users (
  jid TEXT PRIMARY KEY,
  balance INTEGER DEFAULT 0
)`);

// Ensure user is in DB
function createUserIfNotExists(jid) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR IGNORE INTO users (jid, balance) VALUES (?, ?)`,
      [jid, 0],
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
}

// Get balance for a user
function getUserBalance(jid) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT balance FROM users WHERE jid = ?`,
      [jid],
      (err, row) => {
        if (err) return reject(err);
        resolve(row ? row.balance : 0);
      }
    );
  });
}

// === 💰 BANK SYSTEM END ===
