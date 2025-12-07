const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./activity.db");

// Create the activity table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS activity (
    chatId TEXT,
    userId TEXT,
    count INTEGER,
    PRIMARY KEY (chatId, userId)
  )
`, (err) => {
  if (err) {
    console.error("❌ Failed to create 'activity' table:", err.message);
  } else {
    console.log("✅ 'activity' table is ready.");
  }
});

module.exports = db;
