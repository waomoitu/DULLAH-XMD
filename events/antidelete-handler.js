// events/antidelete-handler.js
const fs = require("fs-extra");
const path = require("path");

const settingsFile = path.join(__dirname, "../data/antidelete.json");
const loadSettings = () => JSON.parse(fs.readFileSync(settingsFile));

async function handleAntiDelete(zk, update) {
  const settings = loadSettings();

  for (const msg of update) {
    if (msg?.message === undefined && msg?.key?.remoteJid) {
      const remoteJid = msg.key.remoteJid;
      const from = msg.key.participant || msg.key.remoteJid;

      const isGroup = remoteJid.endsWith("@g.us");
      const groupSetting = settings.groups?.[remoteJid] === "on";
      const globalSetting = settings.global === "on";

      if ((isGroup && groupSetting) || (!isGroup && globalSetting)) {
        try {
          const originalMsg = await zk.loadMessage(remoteJid, msg.key.id);
          if (!originalMsg) return;

          const content = JSON.stringify(originalMsg.message, null, 2);
          const sender = from.split("@")[0];

          const caption = `🚫 *Deleted Message Recovered*\n👤 From: @${sender}\n\n\`\`\`${content}\`\`\``;

          await zk.sendMessage(remoteJid, {
            text: caption,
            mentions: [from],
          });
        } catch (e) {
          console.error("AntiDelete Error:", e);
        }
      }
    }
  }
}

module.exports = { handleAntiDelete };
