const { zokou, prefix } = require('../framework');

zokou.cmd({
    nomCom: "fakereply",
    alias: ["freply"],
    desc: "Create a fake reply using the given texts!",
    categorie: "General",
    utilisation: "message | reply_text | number | type",
    public: true,
}, async (dest, zk, { args }) => {
    try {
        let types = ["text", "order", "contact", "image", "video"];

        // Ensure we have enough arguments
        if (args.length < 4) {
            return await zk.sendMessage(dest.chat, { text: `⚠️ *Usage:* ${prefix}fakereply message | reply_text | 2348039607375 | type (text, order, contact, image, video)` });
        }

        // Split arguments correctly
        let [msgText, replyText, number, type] = args.join(" ").split("|").map(a => a.trim());

        if (!msgText || !replyText || !number) {
            return await zk.sendMessage(dest.chat, { text: `❌ *Error:* Invalid format!\n\nUsage: ${prefix}fakereply message | reply_text | 2348039607375 | type` });
        }

        let num = `${number.replace(/[^0-9]/g, '')}@s.whatsapp.net`;
        type = types.includes(type) ? type : "text";

        console.log(`Creating fake reply:\nMessage: ${msgText}\nReply: ${replyText}\nNumber: ${num}\nType: ${type}`);

        // Fake quoted message
        let fakeMsg = {
            key: {
                remoteJid: dest.isGroup ? dest.chat : dest.from,  // Using the correct chat ID for groups or private chats
                fromMe: false,
                participant: num,
                id: 'FAKEREPLY' + Math.random().toString(36).slice(2),
            },
            message: {
                conversation: msgText
            }
        };

        // If the type is "contact", try to fetch the profile picture
        if (type === "contact") {
            try {
                let pfp = await zk.profilePictureUrl(num, 'image').catch(() => null);
                if (pfp) {
                    fakeMsg.message.contactMessage = { displayName: number, vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${number}\nEND:VCARD`, jpegThumbnail: pfp };
                }
            } catch (e) {
                console.log("Error fetching profile picture:", e);
            }
        }

        // Send the fake reply
        await zk.sendMessage(dest.chat, { text: replyText }, { quoted: fakeMsg });

        console.log("✅ Fake reply sent successfully!");

    } catch (e) {
        console.error("❌ Error in fakereply command:", e);
        await zk.sendMessage(dest.chat, { text: `*Error:* ${e.message}\n\n_Command: fakereply_` });
    }
});
