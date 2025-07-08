const fs = require("fs");
const path = require("path");

const stickerPath = path.join(__dirname, "../data/autosticker.json");

function getStickerURL(trigger) {
  try {
    if (!fs.existsSync(stickerPath)) return null;
    const data = JSON.parse(fs.readFileSync(stickerPath));
    return data[trigger.toLowerCase().trim()] || null;
  } catch (e) {
    console.error("❌ Error loading autosticker data:", e);
    return null;
  }
}

async function handleAutoSticker(msg, zk, from) {
  try {
    if (!msg.message || msg.key.fromMe) return;

    let text = "";

    if (msg.message.conversation) {
      text = msg.message.conversation;
    } else if (msg.message.extendedTextMessage?.text) {
      text = msg.message.extendedTextMessage.text;
    } else {
      return;
    }

    const url = getStickerURL(text);
    if (!url) return;

    await zk.sendMessage(from, {
      sticker: { url: url }
    }, { quoted: msg });

    console.log(`✅ Sent autosticker for: "${text}"`);
  } catch (err) {
    console.error("❌ Error in handleAutoSticker:", err);
  }
}

module.exports = { handleAutoSticker };
