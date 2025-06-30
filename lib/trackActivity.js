const db = require('./db');

async function trackActivity(ms) {
  const chatId = ms.key.remoteJid;
  const sender = ms.key.participant || ms.key.remoteJid;

  // Only count messages in group chats from real users
  if (!chatId.endsWith("@g.us") || !sender.endsWith("@s.whatsapp.net")) return;

  // Add or update the count for this user in this group
  db.run(`
    INSERT INTO activity (chatId, userId, count)
    VALUES (?, ?, 1)
    ON CONFLICT(chatId, userId)
    DO UPDATE SET count = count + 1
  `, [chatId, sender]);
}

module.exports = { trackActivity };
