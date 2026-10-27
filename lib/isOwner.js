const settings = require('../settings');
const { loadSudoList } = require('./sudo');

async function isOwnerOrSudo(senderId, sock = null, chatId = null) {
    if (!senderId) return false;

    const cleanId = (jid) => {
        if (!jid || typeof jid !== 'string') return '';
        return jid.split('@')[0].split(':')[0];
    };

    const ownerNumber = String(
        settings.ownerNumber || process.env.BOT_OWNER || ''
    ).replace(/\D/g, '');

    // Check bot owner
    const senderNumber = cleanId(senderId).replace(/\D/g, '');

    if (
        ownerNumber &&
        (
            senderNumber === ownerNumber ||
            senderId === `${ownerNumber}@s.whatsapp.net`
        )
    ) {
        return true;
    }

    // Check SUDO list from data/sudo.json
    const sudoUsers = loadSudoList();

    // Direct phone JID match
    if (
        senderId.endsWith('@s.whatsapp.net') &&
        sudoUsers.has(senderNumber)
    ) {
        return true;
    }

    // Resolve LID to a phone JID through group participant metadata
    if (
        sock &&
        chatId &&
        chatId.endsWith('@g.us') &&
        senderId.includes('@lid')
    ) {
        try {
            const metadata = await sock.groupMetadata(chatId);

            const participant = (metadata.participants || []).find(p =>
                p.id === senderId || p.lid === senderId
            );

            if (participant) {
                const phoneJid = [
                    participant.pn,
                    participant.id,
                    participant.jid
                ].find(jid =>
                    typeof jid === 'string' &&
                    jid.endsWith('@s.whatsapp.net')
                );

                if (phoneJid) {
                    const phoneNumber = cleanId(phoneJid).replace(/\D/g, '');

                    if (sudoUsers.has(phoneNumber)) {
                        return true;
                    }

                    if (ownerNumber && phoneNumber === ownerNumber) {
                        return true;
                    }
                }
            }
        } catch (error) {
            console.error('[isOwnerOrSudo] LID lookup failed:', error.message);
        }
    }

    return false;
}

module.exports = isOwnerOrSudo;