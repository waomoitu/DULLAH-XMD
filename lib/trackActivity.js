const db = require('./db');

async function trackActivity(ms) {
  const chatId = ms.key.remoteJid;
  const sender = ms.key.participant || ms.key.remoteJid;

  if (!chatId || !chatId.endsWith("@g.us") || !sender.endsWith("@s.whatsapp.net")) {
    console.log("[SKIPPED] Not a valid group/user message.");
    return;
  }

  console.log(`[TRACKING] ${sender} in group ${chatId}`);

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
}

module.exports = { trackActivity };
