const { zokou } = require("../framework");

zokou(
  {
    nomCom: "cat",
    categorie: "fun",
    reaction: "🐱",
    desc: "Send random cat images!",
  },
  async (dest, zk, commandeOptions) => {
    try {
      const imageUrl = "https://cataas.com/cat";
      await zk.sendImage(dest, imageUrl, "*meyaoooooooooooooon!*");
    } catch (e) {
      await zk.sendText(dest, `❌ Error: ${e.message}`);
    }
  }
);
