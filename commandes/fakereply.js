const { zokou } = require("../framework");

zokou({
  nomCom: "fakereply",
  categorie: "general",
  desc: "Create a fake reply with the given text!",
  reaction: "📩",
  utilisation: "text | reply_text | number | type",
  execute: async (message, args) => {
    try {
      let types = ["text", "order", "contact", "image", "video"];
      let input = args.join(" ").split("|");

      // Check if there are enough arguments
      if (input.length < 4) {
        return message.reply(
          `*Usage:* fakereply text | reply_text | number | type\n\n*Example:* fakereply Hello | How are you? | 255716945971 | text`
        );
      }

      // Get the arguments
      let replyText = input[0].trim();
      let msgText = input[1].trim();
      let num = `${input[2].replace(/[^0-9]/g, "")}@s.whatsapp.net`; // Remove non-numeric characters
      let type = input[3] && types.includes(input[3].trim()) ? input[3].trim() : "text"; // Message type

      // Validate the phone number
      if (!num.match(/^\d{10,15}@s.whatsapp.net$/)) {
        return message.reply("❌ *Error:* Invalid phone number format. Ensure the number is correct.");
      }

      // Create the fake message reference
      let fakeMsg = {
        key: {
          remoteJid: message.chat,
          participant: num,
          fromMe: false,
        },
        message: {
          conversation: msgText,
        },
      };

      // Send the message with the fake quoted message
      await message.client.sendMessage(message.chat, { text: replyText, quoted: fakeMsg });
      console.log(`Fake reply sent to ${num}: ${replyText}`); // Log for tracking
    } catch (e) {
      console.error(e); // Print error details
      message.reply(`❌ *Error:* ${e.message}\n\n*Command:* fakereply`);
    }
  },
});
