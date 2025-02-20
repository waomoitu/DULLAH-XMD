"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { zokou } = require("../framework/zokou");

zokou({ nomCom: "ping", reaction: "🧒", nomFichier: __filename }, async (dest, zk, commandeOptions) => {
    console.log("Command received!");

    let varmess = `*🤖 Bot is online *🤖 🙏 \n\n 𝐃𝐔𝐋𝐋𝚫𝚮-𝚳𝐃  
                                          𝛥𝐷𝐷 𝛭𝛩𝑅𝛯 𝑆𝑇𝛥𝑇𝑈𝑆 😉`;

    var mp4 = 'https://files.catbox.moe/jq3oin.mp4';
    var mp3 = 'https://files.catbox.moe/e52xx6.mp3';

    // Send video with caption
    await zk.sendMessage(dest, { 
        video: { url: mp4 }, 
        caption: varmess 
    });

    // Wait a short time before sending the audio
    setTimeout(async () => {
        await zk.sendMessage(dest, { 
            audio: { url: mp3 }, 
            mimetype: 'audio/mp3', 
            ptt: false // Set to true if you want it as a voice note
        });
    }, 2000); // Delay of 2 seconds before sending the audio

    console.log("Command executed!");
});

console.log("Test complete");
