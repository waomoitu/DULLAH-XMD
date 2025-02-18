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
      let args = commandeOptions.join(" ").split("|");

      if (!commandeOptions || args.length < 3) {
        return zk.sendMessage(dest, {
          text: `*Use: fakereply text | reply_text | number | type(text,order,contact,image,video)*`,
        });
      }

      let reply = args[0],
        msg = args[1],
        num = `${args[2].replace(/[^0-9]/g, "")}@s.whatsapp.net`,
        type = args[3] && types.includes(args[3]) ? args[3] : "text";

      let charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        cmds = "CMD";
      for (let i = 0; i < 13; i++) {
        smds += charset[Math.floor(Math.random() * charset.length)];
      }

      let fak = await zk.fakeMessage(
        type,
        { id: smds, remoteJid: dest, participant: num },
        msg
      );

      try {
        if (type === "contact") {
          fak.message.contactMessage.jpegThumbnail = await zk.getProfilePicture(num);
        }
      } catch (e) {
        console.log(e);
      }

      await zk.sendMessage(dest, { text: reply }, { quoted: fak });
    } catch (e) {
      console.error(`Error in fakereply: ${e}`);
      zk.sendMessage(dest, { text: `Error: ${e}` });
    }
  }
);
