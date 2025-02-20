"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { zokou } = require("../framework/zokou");

zokou(
  { nomCom: "ping2", reaction: "🧒", nomFichier: __filename },
  async (dest, zk, commandeOptions) => {
    console.log("Ping command triggered!");

    let captionText = '*🤖 Bot is online 🤖 🙏 \n\n𝐃𝐔𝐋𝐋𝚫𝚮-𝚳𝐃\n\n𝛥𝐷𝐷 𝛭𝛩𝑅𝛯 𝑆𝑇𝛥𝑇𝑈𝑆 😉';

    let videoUrl = "https://files.catbox.moe/jq3oin.mp4";
    let audioUrl = "https://files.catbox.moe/e52xx6.mp3";

    // Send the video with the caption first
    await zk.sendMessage(dest, {
      video: { url: videoUrl },
      caption: captionText,
    });

    // Wait a few seconds before sending the audio
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Send the music audio (correct mimetype for .mp3)
    await zk.sendMessage(dest, {
      audio: { url: audioUrl },
      mimetype: "audio/mpeg", // Correct mimetype for audio
    });

    console.log("Video and audio sent successfully!");
  }
);

console.log("Test complete!");
