const { zokou } = require("../framework/zokou");

zokou(
  {
    nomCom: "fakereply",
    reaction: "🕷️",
    alias: ["freply"],
    categorie: "general",
    desc: "Create a fake reply using the given text!",
    utilisation: "text | reply_text | number | type(text,order,contact,image,video)",
    cooldown: 5,
  },
  async (dest, zk, commandeOptions) => {
    try {
      let types = ["text", "order", "contact", "image", "video"];
      let args = commandeOptions.join(" ").split("|").map(arg => arg.trim());

      if (args.length < 3) {
        return zk.sendMessage(dest, {
          text: `*Use: fakereply text | reply_text | number | type(text,order,contact,image,video)*`,
        });
      }

      let replyText = args[0];
      let fakeReplyText = args[1];
      let num = args[2].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
      let type = args[3] && types.includes(args[3]) ? args[3] : "text";

      // Generate a unique message ID
      let messageID = [...Array(13)]
        .map(() => "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)])
        .join("");

      let fakeMessage = {
        key: {
          remoteJid: dest,
          fromMe: false,
          id: messageID,
          participant: num,
        },
        message: {
          conversation: fakeReplyText,
        },
      };

      if (type === "contact") {
        try {
          let profilePic = await zk.profilePictureUrl(num, "image").catch(() => null);
          if (profilePic) {
            fakeMessage.message.contactMessage = { displayName: "Fake Contact", jpegThumbnail: profilePic };
          }
        } catch (e) {
          console.error("Profile picture error:", e);
        }
      }

      await zk.sendMessage(dest, { text: replyText }, { quoted: fakeMessage });
    } catch (e) {
      console.error(`Error in fakereply: ${e.message}`);
      zk.sendMessage(dest, { text: `Error: ${e.message}` });
    }
  }
);
