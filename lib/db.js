
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Set the path to the SQLite database file (inside /data folder)
const dbPath = path.join(__dirname, '../data/activity.db');

// Open or create the database
const db = new sqlite3.Database(dbPath);

// Create the activity table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS activity (
    chatId TEXT,
    userId TEXT,
    count INTEGER DEFAULT 0,
    PRIMARY KEY (chatId, userId)
  )
`);

module.exports = db;
