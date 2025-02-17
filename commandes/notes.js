const { zokou, prefix } = require('../lib');
const note = require('../lib/note');

//---------------------------------------------------------------------------
// Delete a note by ID
zokou({
    nomCom: "delnote",
    categorie: "notes",
    fromMe: true,
    reaction: "🗑",
    description: "Deletes a note from the database.",
    utilisation: '<note ID | 1>'
}, async (message, args) => {
    try {
        let id = args[0];
        if (!id || isNaN(id)) {
            return message.reply(`*Provide a valid Note ID, Example: ${prefix}delnote 1*`);
        }
        let res = await note.delnote(message, id);
        return message.reply(res.msg);
    } catch (e) {
        await message.error(`${e}\n\nCommand: delnote`, e);
    }
});

//---------------------------------------------------------------------------
// Delete all notes
zokou({
    nomCom: "delallnote",
    categorie: "notes",
    fromMe: true,
    reaction: "🔥",
    description: "Deletes all notes from the database."
}, async (message) => {
    try {
        let res = await note.delallnote(message);
        return message.reply(res.msg);
    } catch (e) {
        await message.error(`${e}\n\nCommand: delallnote`, e);
    }
});

//---------------------------------------------------------------------------
// Show all notes
zokou({
    nomCom: "allnote",
    categorie: "notes",
    fromMe: true,
    reaction: "📜",
    description: "Shows a list of all saved notes."
}, async (message) => {
    try {
        let res = await note.allnotes(message, "all");
        return message.reply(res.msg);
    } catch (e) {
        await message.error(`${e}\n\nCommand: allnote`, e, `*Can't fetch data, Sorry!!*`);
    }
});

//---------------------------------------------------------------------------
// Get a note by ID
zokou({
    nomCom: "getnote",
    categorie: "notes",
    fromMe: true,
    reaction: "🔍",
    description: "Shows a note by ID.",
    utilisation: '<id|1|2>'
}, async (message, args) => {
    try {
        if (!args.length) {
            return message.reply(`*Provide Note ID, Example: ${prefix}getnote 1*`);
        }
        let res = await note.allnotes(message, args[0].toLowerCase().trim());
        return message.reply(res.msg);
    } catch (e) {
        await message.error(`${e}\n\nCommand: getnote`, e, `*Can't fetch data, Sorry!!*`);
    }
});

//---------------------------------------------------------------------------
// Add a note
zokou({
    nomCom: "addnote",
    categorie: "notes",
    fromMe: true,
    reaction: "📝",
    description: "Adds a note to the database.",
    utilisation: '<text>'
}, async (message, args) => {
    try {
        let noteText = args.join(" ");
        if (!noteText) {
            return message.reply(`*Please provide text to save in notes!*`);
        }
        let res = await note.addnote(message, noteText);
        return message.reply(res.msg);
    } catch (e) {
        await message.error(`${e}\n\nCommand: addnote`, e);
    }
});

//---------------------------------------------------------------------------
// Main note command with options
zokou({
    nomCom: "note",
    categorie: "notes",
    fromMe: true,
    reaction: "📒",
    description: "Manage notes (add, get, delete, list).",
    utilisation: "<add|get|del|delall|all> <text|id>"
}, async (message, args) => {
    try {
        let action = args[0]?.toLowerCase().trim();
        let noteText = args.slice(1).join(" ");

        let txt = `╭───── *『 MONGODB NOTES 』* ───◆
┃ Here You Can Store Notes For Later Use
┃ *------------------------------------------*
┃  ┌┤  *✯---- ADD NEW NOTE ----⦿*
┃  │✭ *Cmd :* ${prefix}note add 'Your Text'
┃  │✭ *Usage :* Save text in MongoDB Server
┃  ╰───────────────────◆
┃
┃  ┌┤  *✯---- GET ALL NOTES ----⦿*
┃  │✭ *Cmd :* ${prefix}note all
┃  │✭ *Usage :* Retrieve all saved notes
┃  ╰───────────────────◆
┃
┃  ┌┤  *✯---- DELETE A NOTE ----⦿*
┃  │✭ *Cmd :* ${prefix}note del 'note id'
┃  │✭ *Usage :* Delete a single note by ID number
┃  ╰───────────────────◆
┃
┃  ┌┤  *✯---- DELETE ALL NOTES ----⦿*
┃  │✭ *Cmd :* ${prefix}note delall
┃  │✭ *Usage :* Delete all saved notes
┃  ╰───────────────────◆
╰━━━━━━━━━━━━━━━━━━━━━━──⊷`;

        if (!action) {
            return message.reply(txt);
        }

        switch (action) {
            case "add":
                if (!noteText) {
                    return message.reply(`*Please provide text to save in notes!*`);
                }
                let addRes = await note.addnote(message, noteText);
                return message.reply(addRes.msg);

            case "all":
                let allRes = await note.allnotes(message, "all");
                return message.reply(allRes.msg);

            case "delall":
                let delAllRes = await note.delallnote(message);
                return message.reply(delAllRes.msg);

            case "del":
                if (!args[1] || isNaN(args[1])) {
                    return message.reply(`*Provide a valid Note ID. Example: ${prefix}note del 1*`);
                }
                let delRes = await note.delnote(message, args[1]);
                return message.reply(delRes.msg);

            default:
                return message.reply(`*Invalid action provided. Please follow:*\n\n${txt}`);
        }
    } catch (e) {
        await message.error(`${e}\n\nCommand: note`, e, `*Can't process request, Sorry!*`);
    }
});
