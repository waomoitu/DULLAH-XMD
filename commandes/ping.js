"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { zokou } = require("../framework/zokou");

zokou({ nomCom: "ping2", reaction: "🧒", nomFichier: __filename }, async (dest, zk, commandeOptions) => {
    console.log("Command entered!");

    let z = '*🤖Bot is online*🤖 🙏 \n\n ' + "𝐃𝐔𝐋𝐋𝚫𝚮-𝚳𝐃";
    let d = '                                          𝛥𝐷𝐷 𝛭𝛩𝑅𝛯 𝑆𝑇𝛥𝑇𝑈𝑆😉';                               
    let varmess = z + d;

    // Link to the MP3 file
    let mp3 = 'https://files.catbox.moe/e52xx6.mp3';
    
    // Log for debugging
    console.log("Attempting to send audio from:", mp3);

    try {
        // Send the message with the MP4 video and the MP3 sound
        const message = await zk.sendMessage(dest, {
            video: { url: 'https://files.catbox.moe/jq3oin.mp4' }, 
            audio: { url: mp3 },
            caption: varmess
        });

        console.log("Message sent successfully:", message);
    } catch (error) {
        console.error("Error sending message:", error);
    }
});

console.log("mon test");
