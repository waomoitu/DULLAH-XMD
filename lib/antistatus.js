// lib/antistatus.js
const { getAntiStatusMentionSettings, incrementStatusWarnCount, resetStatusWarnCount } = require("./antistatusmention");

// Detect if message is a status mention
function isStatusMention(message) {
    return message?.groupStatusMentionMessage ||
        (
            message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0 &&
            message?.extendedTextMessage?.text?.toLowerCase().includes("status")
        );
}

// Main detect & handle function
async function detectAndHandleStatusMention(zk, msg) {
    try {
        if (!msg?.message || msg.key.fromMe) return;

        const from = msg.key.remoteJid;
        if (!from.endsWith("@g.us")) return;

        const sender = msg.key.participant || msg.key.remoteJid;
        const settings = await getAntiStatusMentionSettings();
        if (!settings || settings.status === "off") return;
        if (!isStatusMention(msg.message)) return;

        // Group metadata
        let metadata;
        try {
            metadata = await zk.groupMetadata(from);
        } catch {
            return;
        }

        const botId = zk.user.id.split(":")[0] + "@s.whatsapp.net";
        const isBotAdmin = metadata.participants.some(p => p.id === botId && p.admin);
        const isAdmin = metadata.participants.some(p => p.id === sender && p.admin);

        if (isAdmin) return;

        // Bot not admin
        if (!isBotAdmin) {
            return zk.sendMessage(from, {
                text: `⚠️ Status mention detected @${sender.split("@")[0]}!\n❌ Promote bot to admin!`,
                mentions: [sender]
            });
        }

        // Delete message
        await zk.sendMessage(from, { delete: msg.key });

        // ACTIONS
        if (settings.action === "remove") {
            await zk.groupParticipantsUpdate(from, [sender], "remove");
            resetStatusWarnCount(sender);
        }

        if (settings.action === "warn") {
            const count = incrementStatusWarnCount(sender);
            if (count >= settings.warn_limit) {
                await zk.groupParticipantsUpdate(from, [sender], "remove");
                resetStatusWarnCount(sender);
            } else {
                await zk.sendMessage(from, {
                    text: `⚠️ Warning ${count}/${settings.warn_limit} @${sender.split("@")[0]}`,
                    mentions: [sender]
                });
            }
        }

        if (settings.action === "delete") {
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
