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

      let reply = args[0];
      let msg = args[1];
      let num = args[2].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
      let type = args[3] && types.includes(args[3]) ? args[3] : "text";

      let cmds = [...Array(13)].map(() => "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]).join("");

      let fak = await zk.fakeMessage(
        type,
        { id: cmds, remoteJid: dest, participant: num },
        msg
      );

      if (type === "contact") {
        try {
          let profilePic = await zk.getProfilePicture(num).catch(() => null);
          if (profilePic) {
            fak.message.contactMessage.jpegThumbnail = profilePic;
          }
        } catch (e) {
          console.log("Profile picture error:", e);
        }
      }

      await zk.sendMessage(dest, { text: reply }, { quoted: fak });
    } catch (e) {
      console.error(`Error in fakereply: ${e.message}`);
      zk.sendMessage(dest, { text: `Error: ${e.message}` });
    }
  }
);
