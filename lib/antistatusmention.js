// Temporary in-memory warnings
const warnedUsers = {};

async function detectStatusMention(zk, msg) {
    try {
        if (!msg?.message) return;

        const chat = msg.key.remoteJid;
        if (!chat.endsWith("@g.us")) return; // Only handle group chats

        const sender = msg.key.participant || msg.key.remoteJid;

        // Check if this is a status mention
        if (!msg.message?.groupStatusMentionMessage) return;

        const metadata = await zk.groupMetadata(chat);

        // Get list of group admins
        const admins = metadata.participants
            .filter(p => p.admin)
            .map(p => p.id);

        const isAdmin = admins.includes(sender);
        const isBotAdmin = admins.includes(zk.user.id);

        if (isAdmin) return; // Admins get a free pass
        if (!isBotAdmin) return; // Bot must be admin to delete/remove

        // Delete the status mention message
        await zk.sendMessage(chat, {
            delete: {
                remoteJid: chat,
                fromMe: false,
                id: msg.key.id,
                participant: sender
            }
        });

        // Initialize warnings storage for this chat
        if (!warnedUsers[chat]) warnedUsers[chat] = {};

        // First offense → warning
        if (!warnedUsers[chat][sender]) {
            warnedUsers[chat][sender] = 1;

            await zk.sendMessage(chat, {
                text: `⚠️ Warning @${sender.split("@")[0]}\nStatus mentions are not allowed.\nIf you do it again, you will be removed from the group.`,
                mentions: [sender]
            });

        } else {
            // Second offense → remove the user
            await zk.groupParticipantsUpdate(chat, [sender], "remove");

            // Clear the warning after removal
            delete warnedUsers[chat][sender];

            await zk.sendMessage(chat, {
                text: `🚫 @${sender.split("@")[0]} has been removed from the group.\nThey continued making status mentions.`,
                mentions: [sender]
            });
        }

    } catch (e) {
        console.log("AntiStatusMention Error:", e);
    }
}

module.exports = detectStatusMention;