const { zokou } = require('../framework/zokou");

zokou({
    nomCom: "fakereply",
    categorie: "general",
    reaction: "📩",
    desc: "Create fake Reply by given texts!",
    usage: `${prefix}fakereply text | reply_text | number | type(text,order,contact,image,video)`,
},
async (dest, zk, commandeOptions) => {
    try {
        let text = commandeOptions.join(" ");
        let types = ["text", "order", "contact", "image", "video"];
        let args = text.split("|");

        if (!text || args.length < 3) {
            return await zk.reply(`⚠️ Format sahihi:\n*${prefix}fakereply text | Reply_text | 2348039607375 | type(text,order,contact,image,video)*`);
        }

        let reply = args[0].trim();
        let msg = args[1].trim();
        let num = `${args[2].replace(/[^0-9]/g, '')}@s.whatsapp.net`;
        let type = args[3] && types.includes(args[3].trim()) ? args[3].trim() : "text";

        let charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let fakeID = 'FAKE';
        for (let i = 0; i < 13; i++) {
            fakeID += charset[Math.floor(Math.random() * charset.length)];
        }

        let fakeMsg = await zk.fakeMessage(type, { id: fakeID, remoteJid: zk.isGroup ? dest : num, participant: num }, msg);
        
        // Kama ni contact, jaribu kupata profile pic
        try {
            if (type === "contact") {
                fakeMsg.message.contactMessage.jpegThumbnail = await zk.getpp(num);
            }
        } catch (e) {
            console.log(e);
        }

        await zk.sendMessage(dest, { text: reply }, { quoted: fakeMsg });

    } catch (e) {
        zk.reply(`❌ Error: ${e}\n\nCommand: fakereply`);
        console.error(e);
    }
});
