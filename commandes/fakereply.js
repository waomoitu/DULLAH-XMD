const { zokou } = require("../framework");

zokou({
  nomCom: "fakereply",
  categorie: "general",
  desc: "Create a fake reply with the given text!",
  reaction: "📩",
  utilisation: "text | reply_text | number | type",
  execute: async (message, args, commandeOptions) => {
    try {
      let types = ["text", "order", "contact", "image", "video"];
      let input = args.join(" ").split("|");

      if (input.length < 3) {
        return message.reply(
          `*Usage:* fakereply text | reply_text | number | type\n\n*Example:* fakereply Hello | How are you? | 2348039607375 | text`
        );
      }

      let replyText = input[0].trim();
      let msgText = input[1].trim();
      let num = `${input[2].replace(/[^0-9]/g, "")}@s.whatsapp.net`;
      let type = input[3] && types.includes(input[3].trim()) ? input[3].trim() : "text";

      let charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let messageId = "ZK";
      for (let i = 0; i < 13; i++) {
        messageId += charset[Math.floor(Math.random() * charset.length)];
      }

      let fakeMsg = await message.client.fakeMessage(
        type,
        { id: messageId, remoteJid: message.isGroup ? message.chat : num, participant: num },
        msgText
      );

      if (type === "contact") {
        try {
          fakeMsg.message.contactMessage.jpegThumbnail = await message.getProfilePicture(num);
        } catch (e) {
          console.log(e);
        }
      }

      await message.client.sendMessage(message.chat, { text: replyText }, { quoted: fakeMsg });
    } catch (e) {
      message.reply(`Error: ${e.message}\n\nCommand: fakereply`);
    }
  },
});
