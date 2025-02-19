"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { zokou } = require("../framework/zokou");

zokou({ nomCom: "ping", reaction: "🧒", nomFichier: __filename }, async (dest, zk, commandeOptions) => {
    console.log("Command received!");

    let z = '*🤖 Bot is online* 🤖 🙏 \n\n ' + "𝐃𝐔𝐋𝐋𝚫𝚮-𝚳𝐃";
    let d = '                                          𝛥𝐷𝐷 𝛭𝛩𝑅𝛯 𝑆𝑇𝛥𝑇𝑈𝑆 😉';                               
    let varmess = z + d;
    
    let mp4 = 'https://files.catbox.moe/jq3oin.mp4';
    let mp3 = 'https://files.catbox.moe/e52xx6.mp3';

    // Send video with caption
    await zk.sendMessage(dest, { video: { url: mp4 }, caption: varmess });

    // Send music audio
    await zk.sendMessage(dest, { audio: { url: mp3 }, mimetype: 'audio/mp4' });

    console.log("Command executed successfully!");
});
