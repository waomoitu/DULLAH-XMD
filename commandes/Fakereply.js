const { zokou } = require(__dirname + "/../framework/zokou");
const axios = require("axios");

zokou({ nomCom: "fakereply2", alias: ["freply"], categorie: "Tools" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, args } = commandeOptions;

    if (args.length < 3) {
        return repondre("⚠️ *Usage:* fakereply text | reply_text | number | type");
    }

    let [reply, msg, num, type] = args.join(" ").split(" | ");

    if (!reply || !msg || !num) {
        return repondre("❌ Incorrect format! Use:\n_fakereply text | reply_text | number | type_");
    }

    let smds = Math.floor(Math.random() * 1000000).toString(); // Unique ID for fake message
    let fak = {
        key: {
            fromMe: false,
            participant: num.includes("@s.whatsapp.net") ? num : num + "@s.whatsapp.net",
            remoteJid: dest
        },
        message: {}
    };

    if (!type) type = "text"; // Default type is text

    if (type.toLowerCase() === "text") {
        fak.message.conversation = msg;
    } else if (type.toLowerCase() === "order") {
        fak.message.orderMessage = { itemCount: 1, status: 1, surface: 1, message: msg };
    } else if (type.toLowerCase() === "image") {
        fak.message.imageMessage = { caption: msg };
    } else if (type.toLowerCase() === "video") {
        fak.message.videoMessage = { caption: msg };
    } else if (type.toLowerCase() === "contact") {
        try {
            let ppUrl = await zk.profilePictureUrl(num + "@s.whatsapp.net").catch(() => "https://i.imgur.com/rSba5p5.png");
            fak.message.contactMessage = { displayName: msg, vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${msg}\nTEL;TYPE=CELL:${num}\nEND:VCARD` };
            fak.message.imageMessage = { url: ppUrl }; // Attach profile picture if available
        } catch (e) {
            console.log("❌ Error fetching contact profile:", e);
        }
    } else {
        return repondre("❌ Invalid type! Use: text, order, contact, image, or video.");
    }

    try {
        await zk.sendMessage(dest, { text: reply }, { quoted: fak });
        repondre("✅ *Fake reply sent successfully!*");
    } catch (e) {
        console.log("❌ Fake Reply Error: " + e);
        repondre("❌ Error sending fake reply.");
    }
});
