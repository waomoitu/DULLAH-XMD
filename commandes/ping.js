"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { zokou } = require("../framework/zokou");

zokou({ nomCom: "ping2", reaction: "🧒", nomFichier: __filename }, async (dest, zk, commandeOptions) => {
    console.log("Command received!");

    let message = '*🤖 Bot is online* 🤖 🙏 \n\n ' + "𝐃𝐔𝐋𝐋𝚫𝚮-𝚳𝐃";
    let status = '                                          𝛥𝐷𝐷 𝛭𝛩𝑅𝛯 𝑆𝑇𝛥𝑇𝑈𝑆😉';                               
    let finalMessage = message + status;

    var videoUrl = 'https://files.catbox.moe/jq3oin.mp4';
    var audioUrl = 'https://files.catbox.moe/e52xx6.mp3';

    // Send video with a caption
    await zk.sendMessage(dest, { video: { url: videoUrl }, caption: finalMessage });

    // Send audio file after the video
    await zk.sendMessage(dest, { audio: { url: audioUrl }, mimetype: 'audio/mp3' });

    console.log("Video and audio have been sent!");
});

console.log("Test complete");
