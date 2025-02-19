const { zokou, prefix } = require('../framework');

zokou({
    nomCom: "fakereply",
    alias: ["freply"],
    desc: "Create a fake reply using the given texts!",
    categorie: "General",
    utilisation: "msg | reply_text | number | type",
    public: true,
}, async (dest, zk, { args }) => {
    try {
        let types = ["text", "order", "contact", "image", "video"];

        // Ensure the correct number of arguments
        if (args.length < 3) {
            return await dest.reply(`*Usage: ${prefix}fakereply message | reply_text | 2348039607375 | type (text, order, contact, image, video)*`);
        }

        // Parse input arguments
        let msgText = args[0].trim();   // The original message
        let replyText = args[1].trim(); // The reply message
        let num = `${args[2].replace(/[^0-9]/g, '')}@s.whatsapp.net`; // Clean and format the number
        let type = args[3] && types.includes(args[3].trim()) ? args[3].trim() : "text";

        console.log(`Creating fake reply:\nMessage: ${msgText}\nReply: ${replyText}\nNumber: ${num}\nType: ${type}`);

        // Fake quoted message
        let fakeMsg = {
            key: {
                remoteJid: dest.isGroup ? dest.chat : num,
                fromMe: false,
                participant: num,
                id: 'FAKEREPLY' + Math.random().toString(36).slice(2),
            },
            message: {
                extendedTextMessage: { text: msgText }
            }
        };

        // Handle contact type (fetch profile picture)
        if (type === "contact") {
            try {
                let pfp = await zk.profilePictureUrl(num, 'image');
                if (pfp) {
                    fakeMsg.message.contactMessage = { jpegThumbnail: pfp };
                } else {
                    console.log("Profile picture not found for contact:", num);
                }
            } catch (e) {
                console.log("Error fetching profile picture:", e);
            }
        }

        // Send the fake reply
        await zk.sendMessage(dest.chat, { text: replyText }, { quoted: fakeMsg });

        console.log("Fake reply sent successfully!");

    } catch (e) {
        console.error("Error in fakereply command:", e);
        dest.reply(`Error: ${e.message}\n\nCommand: fakereply`);
    }
});
