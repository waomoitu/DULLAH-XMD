const { zokou } = require(__dirname + "/../framework/zokou");

zokou({ nomCom: "fakereply2", categorie: "Tools" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, args } = commandeOptions;
    if (!args[0]) return repondre("⚠️ Enter text for fake reply!");

    let fakeMessage = {
        key: { fromMe: false, participant: "123456789@s.whatsapp.net", remoteJid: dest },
        message: { conversation: args.join(" ") }
    };

    try {
        await zk.sendMessage(dest, { text: "✔️ Fake reply sent!" }, { quoted: fakeMessage });
    } catch (e) {
        console.log("❌ Fake Reply Error:", e);
    }
});
