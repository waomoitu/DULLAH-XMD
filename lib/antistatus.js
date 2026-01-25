// lib/antistatus.js
const { isEnabled } = require("./antistatusmention");

async function detectAndHandleStatusMention(zk, msg) {
    try {
        // CHECK STATUS
        if (!msg.key.remoteJid || msg.key.remoteJid !== "status@broadcast") return;

        const sender = msg.key.participant || msg.key.remoteJid;
        if (!sender) return;

        const session = "0";
        const enabled = await isEnabled(session);
        if (!enabled) return;

        // CHECK MENTION
        const mentionedJids =
            msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

        if (!mentionedJids.length) return;

        if (mentionedJids.includes(zk.user.id.split(":")[0] + "@s.whatsapp.net")) {
            console.log("⚠️ BOT MENTIONED IN STATUS BY:", sender);

            await zk.sendMessage(sender, {
                text: `⚠️ Status mention detected @${sender.split("@")[0]}\n❌ Do not mention bot in status!`
            });
        }
    } catch (e) {
        console.log("❌ ANTISTATUS ERROR:", e);
    }
}

module.exports = { detectAndHandleStatusMention };