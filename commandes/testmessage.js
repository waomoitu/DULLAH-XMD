const { zokou, prefix } = require('../framework');

zokou({
    nomCom: "testmessage",
    reaction: "🤦",
      categorie: "General",
    aliases: ["tmsg"],
    desc: "Test if bot can send messages",
    public: true,
}, async (dest, zk, commandeOptions) => {
    try {
        await zk.sendMessage(dest.chat, { text: "✅ Bot is working!" });
    } catch (e) {
        console.error("Error sending test message:", e);
        await zk.sendMessage(dest.chat, { text: "❌ Error: Could not send test message." });
    }
});
