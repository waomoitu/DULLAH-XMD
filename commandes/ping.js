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

    // Send the audio file without forcing it to play directly
    await zk.sendMessage(dest, {
      audio: { url: audioUrl },
      mimetype: "audio/mp3", // MIME type for MP3 file
      title: "Music Playing",
      caption: "Click to play your favorite track!" // Prompt user to click and play
    });

    console.log("Video and audio sent successfully!");
  }
);

console.log("Test complete!");
