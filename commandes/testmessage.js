const { zokou, prefix } = require('../framework');

zokou.cmd({
    nomCom: "testmessage",
    alias: ["tmsg"],
    desc: "Test if bot can send messages",
    categorie: "General",
    public: true,
}, async (dest, zk) => {
    try {
        await zk.sendMessage(dest.chat, { text: "✅ Bot is working!" });
    } catch (e) {
        console.error("Error sending test message:", e);
        await zk.sendMessage(dest.chat, { text: "❌ Error: Could not send test message." });
    }
});
