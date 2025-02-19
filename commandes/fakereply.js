const { zokou, prefix } = require('../framework');

zokou({
    nomCom: "fakereply",
    alias: ['freply'],
    desc: "Create a fake reply using given texts!",
    categorie: "general",
    utilisation: "msg | reply_text | number | type",
    public: true,
}, async (dest, zk, { quoted }) => {
    try {
        let types = ["text", "order", "contact", "image", "video"];
        let args = zk.text ? zk.text.split("|") : [];

        if (args.length < 3) {
            return await dest.reply(`*Usage: ${prefix}fakereply text | Reply_text | 2348039607375 | type (text, order, contact, image, video)*`);
        }

        let reply = args[0].trim();
        let msg = args[1].trim();
        let num = `${args[2].replace(/[^0-9]/g, '')}@s.whatsapp.net`;
        let type = args[3] && types.includes(args[3].trim()) ? args[3].trim() : "text";

        let messageId = 'ZOKOU' + [...Array(13)].map(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]).join('');

        let fakeMsg = await zk.zk.fakeMessage(type, { id: messageId, remoteJid: dest.isGroup ? dest.chat : num, participant: num }, msg);

        if (type === "contact") {
            try {
                fakeMsg.message.contactMessage.jpegThumbnail = await zk.zk.profilePictureUrl(num);
            } catch (e) {
                console.log("Error fetching profile picture:", e);
            }
        }

        await zk.zk.sendMessage(dest.chat, { text: reply }, { quoted: fakeMsg });

    } catch (e) {
        dest.reply(`Error: ${e}\n\nCommand: fakereply`);
    }
});
