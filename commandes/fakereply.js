const { zokou, prefix } = require('../framework');

zokou.cmd({
    nomCom: "fakereply",
    alias: ["freply"],
    desc: "Create a fake reply using the given texts!",
    categorie: "General",  // Correct category formatting
    utilisation: "msg | reply_text | number | type",
    public: true,
}, async (dest, zk, { quoted, args }) => {
    try {
        let types = ["text", "order", "contact", "image", "video"];

        // Validation for required arguments
        if (args.length < 3) {
            return await dest.reply(`*Usage: ${prefix}fakereply text | Reply_text | 2348039607375 | type (text, order, contact, image, video)*`);
        }

        // Parse arguments
        let replyText = args[0].trim();
        let msgText = args[1].trim();
        let num = `${args[2].replace(/[^0-9]/g, '')}@s.whatsapp.net`;
        let type = args[3] && types.includes(args[3].trim()) ? args[3].trim() : "text";

        // Create fake message structure
        let fakeMsg = {
            key: {
                remoteJid: dest.isGroup ? dest.chat : num,
                participant: num,
                id: 'FAKEREPLY' + Math.random().toString(36).slice(2),
            },
            message: {
                conversation: msgText
            }
        };

        // If the type is contact, try to fetch the contact's profile picture
        if (type === "contact") {
            try {
                let pfp = await zk.getProfilePicture(num);
                if (pfp) {
                    fakeMsg.message.contactMessage = { jpegThumbnail: pfp };
                } else {
                    console.log("Profile picture not found for contact: ", num);
                }
            } catch (e) {
                console.log("Error fetching profile picture:", e);
            }
        }

        // Send the fake reply message with the quoted message
        await zk.sendMessage(dest.chat, { text: replyText }, { quoted: fakeMsg });

    } catch (e) {
        console.log("Error in fakereply command:", e); // Log full error
        dest.reply(`Error: ${e}\n\nCommand: fakereply`);
    }
});
