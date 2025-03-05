"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { zokou } = require("../framework/zokou");
const fetch = require("node-fetch"); // Add this if fetch is not available

zokou({ nomCom: "repo6", catégorie: "Général", reaction: "✨", nomFichier: __filename }, async (dest, zk, commandeOptions) => {
  const githubRepo = 'https://api.github.com/repos/abdallahsalimjuma/Dullah-xmd';
  const img = 'https://files.catbox.moe/0cxusf.jpg';
  const audioUrl = "https://files.catbox.moe/e52xx6.mp3"; // Audio URL

  try {
    const response = await fetch(githubRepo);
    const data = await response.json();

    if (data) {
      const repoInfo = {
        stars: data.stargazers_count,
        forks: data.forks_count,
        lastUpdate: data.updated_at,
        owner: data.owner.login,
      };

      const releaseDate = new Date(data.created_at).toLocaleDateString('en-GB');
      const lastUpdateDate = new Date(data.updated_at).toLocaleDateString('en-GB');

      const gitdata = `*Hello Friend!*
This is *ᴅᴜʟʟᴀʜ-xᴍᴅ v² 👊.*\n
*Join Our Group* 👉 https://chat.whatsapp.com/IdRXU9UcO8K50GPelOyhxh

🗼 *REPOSITORY:* ${data.html_url}
💫 *STARS:* ${repoInfo.stars}
🧧 *FORKS:* ${repoInfo.forks}
📅 *RELEASE DATE:* ${releaseDate}
🕐 *LAST UPDATE:* ${lastUpdateDate}
🙊 *OWNER:* *Mr Dullah*
🍃 *THEME:* *ᴅᴜʟʟᴀʜ-xᴍᴅ v²*
🍷 *I Am Safe To Fight In My Life*
__________________________________
            *Made With ᴅᴜʟʟᴀʜ-xᴍᴅ v²*`;

      // Send image and message
      await zk.sendMessage(dest, { image: { url: img }, caption: gitdata });

      // Send audio after image and message
      await zk.sendMessage(dest, { audio: { url: audioUrl }, mimetype: "audio/mp4", ptt: true });
    } else {
      console.log("Failed to fetch data");
    }
  } catch (error) {
    console.log("Error fetching data:", error);
  }
});
