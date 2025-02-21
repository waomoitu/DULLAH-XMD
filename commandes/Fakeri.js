const { zokou } = require("../framework");

zokou({
  nomCom: "test2",
  categorie: "general",
  desc: "Test message sending",
  execute: async (message) => {
    try {
      await message.client.sendMessage(message.chat, { text: "Test message from Zokou Bot" });
      console.log("✅ Message sent successfully");
    } catch (e) {
      console.error("❌ Error:", e);
      message.reply(`❌ *Error:* ${e.message}`);
    }
  },
});
