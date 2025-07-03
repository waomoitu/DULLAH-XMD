const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { promisify } = require('util');

const dbPath = path.join(__dirname, '../data/activity.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("[SQLite ERROR]", err.message);
  else console.log("[SQLite] Connected to activity.db");
});

db.run(`
  CREATE TABLE IF NOT EXISTS activity (
    chatId TEXT,
    userId TEXT,
    count INTEGER DEFAULT 0,
    PRIMARY KEY (chatId, userId)
  )
`);

const allAsync = promisify(db.all).bind(db);

// Export the object with both allAsync and run
module.exports = {
  run: db.run.bind(db),
  get: db.get.bind(db),
  all: db.all.bind(db),
  allAsync: allAsync
};
