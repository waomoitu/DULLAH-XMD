const { zokou } = require(__dirname + "/../framework/zokou");

zokou({ nomCom: "fakereply3", categorie: "Tools" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, args } = commandeOptions;

    if (args.length < 4) {
        return repondre("⚠️ *Usage:* fakereply text | reply_text | number | type");
    }

    let [text, reply_text, number, type] = args.join(" ").split(" | ");

    if (!text || !reply_text || !number || !type) {
        return repondre("❌ Incorrect format! Use:\n_fakereply text | reply_text | number | type_");
    }

    let fakeMessage = {
        key: {
            fromMe: false,
            participant: number + "@s.whatsapp.net",
            remoteJid: dest
        },
        message: {}
    };

    if (type.toLowerCase() === "text") {
        fakeMessage.message.conversation = reply_text;
    } else if (type.toLowerCase() === "image") {
        fakeMessage.message.imageMessage = { caption: reply_text };
    } else if (type.toLowerCase() === "video") {
        fakeMessage.message.videoMessage = { caption: reply_text };
    } else {
        return repondre("❌ Invalid type! Use: text, image, or video.");
    }

    try {
        await zk.sendMessage(dest, { text }, { quoted: fakeMessage });
        repondre("✅ *Fake reply sent by Dullah XMD!*");
    } catch (e) {
        console.log("❌ Fake Reply Error: " + e);
        repondre("❌ Error sending fake reply.");
    }
});
