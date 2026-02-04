const warnedUsers = {};

async function detectStatusMention(zk, msg) {
    try {
        if (!msg?.message) return;

        const chat = msg.key.remoteJid;
        if (!chat.endsWith("@g.us")) return;

        const sender = msg.key.participant;
        if (!sender) return;

        const isStatusMention =
            msg.message?.extendedTextMessage?.contextInfo?.remoteJid === "status@broadcast";

        if (!isStatusMention) return;

        const metadata = await zk.groupMetadata(chat);

        const admins = metadata.participants
            .filter(p => p.admin)
            .map(p => p.id);

        const isAdmin = admins.includes(sender);
        const isBotAdmin = admins.includes(zk.user.id);

        if (isAdmin) return;
        if (!isBotAdmin) return;

        await zk.sendMessage(chat, {
            delete: msg.key
        });

        if (!warnedUsers[chat]) warnedUsers[chat] = {};

        if (!warnedUsers[chat][sender]) {

            warnedUsers[chat][sender] = 1;

            await zk.sendMessage(chat, {
                text: `⚠️ Warning @${sender.split("@")[0]}\nStatus mentions are not allowed.`,
                mentions: [sender]
            });

        } else {

            await zk.groupParticipantsUpdate(chat, [sender], "remove");

            delete warnedUsers[chat][sender];

            await zk.sendMessage(chat, {
                text: `🚫 @${sender.split("@")[0]} removed for repeated status mention.`,
                mentions: [sender]
            });
        }

    } catch (e) {
        console.log("AntiStatusMention Error:", e);
    }
}

module.exports = detectStatusMention;