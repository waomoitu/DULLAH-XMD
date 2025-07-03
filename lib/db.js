const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { promisify } = require('util');

// 💾 Set the correct path to /data/activity.db
const dbPath = path.join(__dirname, '../data/activity.db');

// Open the database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("[SQLite ERROR]", err.message);
  } else {
    console.log("[SQLite] Connected to activity.db");
  }
});

// Create the activity table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS activity (
    chatId TEXT,
    userId TEXT,
    count INTEGER DEFAULT 0,
    PRIMARY KEY (chatId, userId)
  )
`);

// Promisify the .all method
db.allAsync = promisify(db.all).bind(db);

// Export
module.exports = db;
