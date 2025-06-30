const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, 'activity.db');
const db = new sqlite3.Database(dbPath);

// Create table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS activity (
    chatId TEXT,
    userId TEXT,
    count INTEGER DEFAULT 0,
    PRIMARY KEY (chatId, userId)
  )
`);

// Save activity (increase count)
function saveActivity(chatId, userId) {
  db.run(
    `INSERT INTO activity (chatId, userId, count)
     VALUES (?, ?, 1)
     ON CONFLICT(chatId, userId)
     DO UPDATE SET count = count + 1`,
    [chatId, userId]
  );
}

// Get top active users
function getTopActiveUsers(chatId, limit = 20) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT userId as jid, count FROM activity
       WHERE chatId = ?
       ORDER BY count DESC
       LIMIT ?`,
      [chatId, limit],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
}

// Reset group activity
function resetGroupActivity(chatId) {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM activity WHERE chatId = ?`,
      [chatId],
      function (err) {
        if (err) return reject(err);
        resolve(true);
      }
    );
  });
}

module.exports = {
  saveActivity,
  getTopActiveUsers,
  resetGroupActivity
};
