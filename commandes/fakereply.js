const { zokou } = require("../framework/zokou");

zokou({
  nomCom: "fakereply",
  categorie: "general",
  desc: "Create a fake reply with the given text!",
  reaction: "📩",
  utilisation: "text | reply_text | number | type",
  execute: async (message, args) => {
    try {
      let types = ["text", "order", "contact", "image", "video"];
      let input = args.join(" ").split("|").map(i => i.trim());

      // Validate input length
      if (input.length < 4) {
        return message.reply(
          `*Usage:* fakereply text | reply_text | number | type\n\n*Example:* fakereply Hello | How are you? | 255716945971 | text`
        );
      }

      let replyText = input[0];
      let msgText = input[1];
      let num = `${input[2].replace(/[^0-9]/g, "")}@s.whatsapp.net`;
      let type = types.includes(input[3]) ? input[3] : "text";

      // Validate phone number
      if (!num.match(/^\d{10,15}@s.whatsapp.net$/)) {
        return message.reply("❌ *Error:* Invalid phone number format. Ensure the number is correct.");
      }

      // Construct fake message reference based on type
      let fakeMsg = {
        key: {
          remoteJid: message.chat,
          participant: num,
          fromMe: false,
        },
        message: {},
      };

      switch (type) {
        case "text":
          fakeMsg.message.conversation = msgText;
          break;
        case "order":
          fakeMsg.message.orderMessage = {
            itemCount: 1,
            status: 1,
            surface: 1,
            message: msgText,
            orderTitle: "Fake Order",
            sellerJid: "0@s.whatsapp.net",
          };
          break;
        case "contact":
          fakeMsg.message.contactMessage = {
            displayName: msgText,
            vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${msgText}\nEND:VCARD`,
          };
          break;
        case "image":
          fakeMsg.message.imageMessage = { caption: msgText, jpegThumbnail: null };
          break;
        case "video":
          fakeMsg.message.videoMessage = { caption: msgText, jpegThumbnail: null };
          break;
        default:
          return message.reply("❌ *Error:* Unsupported message type.");
      }

      // Send the fake reply message
      await message.client.sendMessage(message.chat, { text: replyText, quoted: fakeMsg });
      console.log(`Fake reply sent to ${num}: ${replyText}`);
    } catch (e) {
      console.error(e);
      message.reply(`❌ *Error:* ${e.message}\n\n*Command:* fakereply`);
    }
  },
});
