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
      const imageUrl = "https://cataas.com/cat"; // API for cat images
      const fileName = "random_cat.jpg"; // Image file name

      await zk.sendImage(dest, imageUrl, fileName, "*Meowww!*");
    } catch (e) {
      console.log("Error sending cat image:", e); // Debugging
      await zk.sendText(dest, `❌ Error: ${e.message}`);
    }
  }
);
