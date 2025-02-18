const { zokou } = require("../framework/zokou");

zokou({

    nomCom: "getall",
    categorie: "owner",
    reaction: "📜",
    fromMe: true,
    desc: "Get JIDs of all members of groups, personal chats, or all groups.",
    usage: "[ members / user / groups ]",
    filename: __filename,
    public: false
}, async (dest, zk, commandeOptions) => {
    try {
        let text = zk.body.split(" ")[1]; // Get command argument
        let response = "";
        
        if (!text) {
            return dest.reply(`*Use:* ${prefix}getall members | user | groups`);
        }

        if (text === "members" || text === "member") {
            if (!zk.isGroup) return dest.reply(tlang("group"));
            const participants = zk.metadata.participants || [];
            for (let i of participants) {
                response += `📍 ${i.id}\n`;
            }
            response ? dest.reply(`*「 LIST OF GROUP MEMBERS 」*\n\n` + response) : dest.reply("*Request Denied!*");

        } else if (text === "user" || text === "pm" || text === "pc") {
            let privateChats = (await zokou.chats.all()).filter(v => v.id.endsWith('.net'));
            for (let i of privateChats) {
                response += `📍 ${i.id}\n`;
            }
            response ? dest.reply(`*「 LIST OF PERSONAL CHATS 」*\n\nTotal ${privateChats.length} users in personal chat.\n\n` + response) : dest.reply("*Request Denied!*");

        } else if (text === "group" || text === "groups" || text === "gc") {
            let allGroups = await zokou.groupFetchAllParticipating();
            const groupList = Object.entries(allGroups).map(([key, value]) => value.id);
            for (let i of groupList) {
                response += `📍 ${i}\n`;
            }
            response ? dest.reply(`*「 LIST OF GROUP CHAT JIDS 」*\n\n` + response) : dest.reply("*Request Denied!*");

        } else {
            return dest.reply(`*Use:* ${prefix}getall members | user | groups`);
        }
        
    } catch (error) {
        console.error(error);
        dest.reply(`*Error in getall command:* ${error.message}`);
    }
});
