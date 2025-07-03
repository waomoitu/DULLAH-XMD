const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { promisify } = require('util');

// ✅ Define path to the activity database inside /data folder
const dbPath = path.join(__dirname, '../data/activity.db');

// ✅ Open the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("[SQLite ERROR]", err.message);
  } else {
    console.log("[SQLite] Connected to activity.db");
  }
});

// ✅ Create activity table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS activity (
    chatId TEXT,
    userId TEXT,
    count INTEGER DEFAULT 0,
    PRIMARY KEY (chatId, userId)
  )
`);

// ✅ Promisify the .all method to support async/await
const allAsync = promisify(db.all).bind(db);

// ✅ Export standard db functions and allAsync
module.exports = {
  run: db.run.bind(db),
  get: db.get.bind(db),
  all: db.all.bind(db),
  allAsync // ← this is used with async/await in your listactive command
};
