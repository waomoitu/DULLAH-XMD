"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { zokou } = require("../framework/zokou");

zokou({ nomCom: "repo5", catégorie: "General", reaction: "✨", nomFichier: __filename }, async (dest, zk, commandeOptions) => {
  const githubRepo = 'https://api.github.com/repos/abdallahsalimjuma/Dullah-xmd';
  const img = 'https://files.catbox.moe/0cxusf.jpg';
  const audioUrl = 'https://files.catbox.moe/example.mp3'; // Replace with actual valid audio URL

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

      const gitdata = `*Hello Friend,
this is* *ᴅᴜʟʟᴀʜ-xᴍᴅ v² 👊.*\n *Join Group Chat* https://chat.whatsapp.com/IdRXU9UcO8K50GPelOyhxh

🗼 *REPOSITORY:* ${data.html_url}
💫 *STARS:* ${repoInfo.stars}
🧧 *FORKS:* ${repoInfo.forks}
📅 *RELEASE DATE:* ${releaseDate}
🕐 *LAST UPDATE:* ${repoInfo.lastUpdate}
🙊 *OWNER:* *Mr. Dullah*
🍃 *THEME:* *ᴅᴜʟʟᴀʜ-xᴍᴅ v²*
🍷 *I Am Safe To Fight In My Life*
__________________________________
            *Made With ᴅᴜʟʟᴀʜ-xᴍᴅ v²*`;

      // Send image with repository details
      await zk.sendMessage(dest, { image: { url: img }, caption: gitdata });

      // Send audio file
      await zk.sendMessage(dest, { audio: { url: audioUrl }, mimetype: 'audio/mpeg' });

    } else {
      console.log("Could not fetch data from GitHub repository.");
      await zk.sendMessage(dest, { text: "Sorry, I couldn't fetch the repository details at this moment. Please try again later." });
    }
  } catch (error) {
    console.log("Error fetching data:", error);
    await zk.sendMessage(dest, { text: "Sorry, an error occurred while fetching the repository data. Please try again later." });
  }
});
