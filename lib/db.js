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
