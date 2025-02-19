"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const { zokou } = require("../framework/zokou");

zokou(
  { nomCom: "ping2", reaction: "🧒", nomFichier: __filename },
  async (dest, zk, commandeOptions) => {
    console.log("Ping command received!");

    let message = "*🤖 Bot is online* 🤖 🙏 \n\n" + "DULLA-XD STATUS 😉";
    
    let videoUrl = "https://files.catbox.moe/jq3oin.mp4";
    let audioUrl = "https://files.catbox.moe/e52xx6.mp3";

    // Send video with caption
    await zk.sendMessage(dest, { video: { url: videoUrl }, caption: message });

    // Send audio
    await zk.sendMessage(dest, { audio: { url: audioUrl }, mimetype: "audio/mp3" });

    console.log("Ping command executed successfully!");
  }
);

console.log("Test complete");
