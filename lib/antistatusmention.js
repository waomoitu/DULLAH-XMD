// Temporary in-memory storage for warnings
const warnedUsers = {};

async function detectStatusMention(zk, msg) {
    try {
        if (!msg?.message) return;

        const chat = msg.key.remoteJid;
        if (!chat.endsWith("@g.us")) return; // Only handle group chats

        const sender = msg.key.participant || msg.key.remoteJid;

        // Check if the message is a status mention
        if (!msg.message?.groupStatusMentionMessage) return;

        const metadata = await zk.groupMetadata(chat);

        // Get list of group admins
        const admins = metadata.participants
            .filter(p => p.admin)
            .map(p => p.id);

        const isAdmin = admins.includes(sender);
        const isBotAdmin = admins.includes(zk.user.id);

        if (isAdmin) return;      // Admins are allowed
        if (!isBotAdmin) return;  // Bot must be admin to act

        // Delete the status mention message
        await zk.sendMessage(chat, {
            delete: {
                remoteJid: chat,
                fromMe: false,
                id: msg.key.id,
                participant: sender
            }
        });

        // Initialize warning storage for this group
        if (!warnedUsers[chat]) warnedUsers[chat] = {};

        // First offense → send warning
        if (!warnedUsers[chat][sender]) {
            warnedUsers[chat][sender] = 1;

            await zk.sendMessage(chat, {
                text: `⚠️ Warning @${sender.split("@")[0]}\nStatus mentions are not allowed in this group.\nIf you do it again, you will be removed.`,
                mentions: [sender]
            });

        } else {
            // Second offense → remove user from group
            await zk.groupParticipantsUpdate(chat, [sender], "remove");

            // Clear warning after removal
            delete warnedUsers[chat][sender];

            await zk.sendMessage(chat, {
                text: `🚫 @${sender.split("@")[0]} has been removed from the group.\nThey continued using status mentions.`,
                mentions: [sender]
            });
        }

    } catch (e) {
        console.log("AntiStatusMention Error:", e);
    }
}

module.exports = detectStatusMention;
