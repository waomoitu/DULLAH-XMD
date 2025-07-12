const db = require('./db');

async function trackActivity(ms) {
  const chatId = ms.key.remoteJid;
  const sender = ms.key.participant || ms.key.remoteJid;

  // Skip if not group message or invalid user
  if (!chatId || !chatId.endsWith("@g.us") || !sender.endsWith("@s.whatsapp.net")) {
    console.log("[SKIPPED] Not a valid group/user message.");
    return;
  }

  // Create table if not exists
  db.run(`
    CREATE TABLE IF NOT EXISTS activity (
      chatId TEXT,
      userId TEXT,
      count INTEGER,
      PRIMARY KEY (chatId, userId)
    )
  `, (err) => {
    if (err) {
      console.error("[DB ERROR] Failed to create table:", err.message);
      return;
    }

    console.log(`[TRACKING] ${sender} in group ${chatId}`);

    // Insert or update activity
    db.run(`
      INSERT INTO activity (chatId, userId, count)
      VALUES (?, ?, 1)
      ON CONFLICT(chatId, userId)
      DO UPDATE SET count = count + 1
    `, [chatId, sender], function (err) {
      if (err) {
        console.error("[DB ERROR] Insert/Update failed:", err.message);
      } else {
        console.log(`[DB] Activity updated for ${sender}`);
      }
    });
  });
}

module.exports = { trackActivity };
