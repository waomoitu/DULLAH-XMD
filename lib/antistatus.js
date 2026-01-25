// lib/antistatus.js
const { isEnabled } = require("./antistatusmention");
const { incrementStatusWarnCount, resetStatusWarnCount } = require("./antistatusmention");

// Detect if message is a status mention
function isStatusMention(message) {
    return message?.groupStatusMentionMessage ||
        (
            message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0 &&
            message?.extendedTextMessage?.mentionedJid.includes(process.env.BOT_JID || "")
        );
}

// Main detect & handle function
async function detectAndHandleStatusMention(zk, msg) {
    try {
        if (!msg?.message || msg.key.fromMe) return;
        const from = msg.key.remoteJid;
        if (!from.endsWith("@g.us")) return;

        const sender = msg.key.participant || msg.key.remoteJid;
        const session = "0"; // default session
        const enabled = await isEnabled(session);
        if (!enabled) return;

        if (!isStatusMention(msg.message)) return;

        // Get group metadata
        let metadata;
        try {
            metadata = await zk.groupMetadata(from);
        } catch {
            console.log("❌ Failed to fetch group metadata");
            return;
        }

        const botId = zk.user.id.split(":")[0] + "@s.whatsapp.net";
        const isBotAdmin = metadata.participants.some(p => p.id === botId && p.admin);
        const isAdmin = metadata.participants.some(p => p.id === sender && p.admin);

        if (isAdmin) return; // ignore admin users

        // If bot not admin, just send alert
        if (!isBotAdmin) {
            return zk.sendMessage(from, {
                text: `⚠️ Status mention detected from @${sender.split("@")[0]}!\n❌ Promote bot to admin to take action.`,
                mentions: [sender]
            });
        }

        // Delete the message
        await zk.sendMessage(from, { delete: msg.key });

        // Handle actions from DB settings
        const settings = { action: "warn", warn_limit: 3 }; // default, can be replaced with DB settings

        if (settings.action === "remove") {
            await zk.groupParticipantsUpdate(from, [sender], "remove");
            resetStatusWarnCount(sender);
        } else if (settings.action === "warn") {
            const count = incrementStatusWarnCount(sender);
            if (count >= settings.warn_limit) {
                await zk.groupParticipantsUpdate(from, [sender], "remove");
                resetStatusWarnCount(sender);
            } else {
                await zk.sendMessage(from, {
                    text: `⚠️ Warning ${count}/${settings.warn_limit} @${sender.split("@")[0]}! No status mentions allowed!`,
                    mentions: [sender]
                });
            }
        } else if (settings.action === "delete") {
            await zk.sendMessage(from, {
                text: `🗑️ Status mention deleted`,
                mentions: [sender]
            });
        }

    } catch (e) {
        console.log("❌ ANTISTATUS ERROR:", e);
    }
}

module.exports = { detectAndHandleStatusMention };