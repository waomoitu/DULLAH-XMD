const { zokou } = require("../framework");

zokou({
  nomCom: "testquoted",
  categorie: "general",
  desc: "Test fake reply quoting",
  execute: async (message) => {
    try {
      let fakeMsg = {
        key: {
          remoteJid: message.chat,
          participant: "255712345678@s.whatsapp.net", // Change this to a valid test number
          fromMe: false,
          id: "fake-msg-id", // Required for quoting
        },
        message: {
          extendedTextMessage: {
            text: "This is a fake quoted message",
          },
        },
      };

      await message.client.sendMessage(
        message.chat,
        { text: "Replying to a fake message" },
        { quoted: fakeMsg }
      );

      console.log("✅ Quoted message sent successfully");
    } catch (e) {
      console.error("❌ Error:", e);
      await message.reply(`❌ *Error:* ${e.message}`);
    }
  },
});
