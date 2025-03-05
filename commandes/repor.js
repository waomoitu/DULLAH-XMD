"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { zokou } = require("../framework/zokou");

zokou({ nomCom: "repo2", catégorie: "General", reaction: "✨", nomFichier: __filename }, async (dest, zk, commandeOptions) => {
  const githubRepo = 'https://api.github.com/repos/abdallahsalimjuma/Dullah-xmd';
  const img = 'https://files.catbox.moe/0cxusf.jpg';
  const audio = 'https://files.catbox.moe/vuvchw.mp3'; // Audio file link

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

      const gitdata = `*Hello Friend
this is* *ᴅᴜʟʟᴀʜ-xᴍᴅ v² 👊.*\n *Join Group Chat* https://chat.whatsapp.com/IdRXU9UcO8K50GPelOyhxh

🗼 *REPOSITORY:* ${data.html_url}
💫 *STARS:* ${repoInfo.stars}
🧧 *FORKS:* ${repoInfo.forks}
📅 *RELEASE DATE:* ${releaseDate}
🕐 *UPDATE ON:* ${repoInfo.lastUpdate}
🙊 *OWNER:* *Mr Dullah*
🍃 *THEME:* *ᴅᴜʟʟᴀʜ-xᴍᴅ v²*
🍷 *Am Safe To Fight In My Life*
__________________________________
            *Made With ᴅᴜʟʟᴀʜ-xᴍᴅ v²*`;

      // Send image with caption
      await zk.sendMessage(dest, { image: { url: img }, caption: gitdata });

      // Send audio right after
      await zk.sendMessage(dest, { audio: { url: audio }, mimetype: 'audio/mp3' });

    } else {
      console.log("Could not fetch data");
    }
  } catch (error) {
    console.log("Error fetching data:", error);
  }
});
