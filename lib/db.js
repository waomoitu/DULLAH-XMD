const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Set the path for the database file
const dbPath = path.join(__dirname, 'activity.db');

// Open the SQLite database
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

// Export the database object with all SQLite methods (run, all, get, etc.)
module.exports = db;
