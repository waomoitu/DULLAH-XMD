const { note, prefix } = require('../lib');

module.exports = (Zokou) => {
  // Command: delnote - Deletes a note by ID
  Zokou({
    nomCom: "delnote",
    categorie: "notes",
    desc: "Deletes a note from the database.",
    usage: "<note ID>",
    fromMe: true,  // Only bot owner can execute
    handler: async (message, match) => {
      try {
        if (!match || isNaN(match.trim())) {
          return await message.reply(`*Provide Note ID, Example: ${prefix}delnote 1*`);
        }

        let id = match.trim();
        let res = await note.delnote(message, id);

        return await message.reply(res.msg);
      } catch (e) {
        await message.error(`Error: ${e.message}\n\nCommand: delnote`, e);
      }
    }
  });

  // Command: delallnote - Deletes all notes
  Zokou({
    nomCom: "delallnote",
    categorie: "notes",
    desc: "Deletes all notes from the database.",
    fromMe: true,  // Only bot owner can execute
    handler: async (message) => {
      try {
        let res = await note.delallnote(message);
        return await message.reply(res.msg);
      } catch (e) {
        await message.error(`Error: ${e.message}\n\nCommand: delallnote`, e);
      }
    }
  });

  // Command: allnote - Shows list of all notes
  Zokou({
    nomCom: "allnote",
    categorie: "notes",
    desc: "Shows a list of all notes.",
    fromMe: true,  // Only bot owner can execute
    handler: async (message) => {
      try {
        let res = await note.allnotes(message, "all");
        return await message.reply(res.msg);
      } catch (e) {
        await message.error(`Error: ${e.message}\n\nCommand: allnote`, e);
      }
    }
  });

  // Command: getnote - Retrieves a note by its ID
  Zokou({
    nomCom: "getnote",
    categorie: "notes",
    desc: "Retrieves a note by its ID.",
    usage: "<ID>",
    fromMe: true,  // Only bot owner can execute
    handler: async (message, match) => {
      try {
        if (!match) {
          return await message.reply(`*Provide Note ID, Example: ${prefix}getnote 1*`);
        }

        let id = match.trim();
        let res = await note.allnotes(message, id);

        return await message.reply(res.msg);
      } catch (e) {
        await message.error(`Error: ${e.message}\n\nCommand: getnote`, e);
      }
    }
  });

  // Command: addnote - Adds a new note to the database
  Zokou({
    nomCom: "addnote",
    categorie: "notes",
    desc: "Adds a new note to the database.",
    usage: "<text>",
    fromMe: true,  // Only bot owner can execute
    handler: async (message, match) => {
      try {
        if (!match) return await message.reply("*Please provide text to save in notes!*");

        let res = await note.addnote(message, match.trim());
        return await message.reply(res.msg);
      } catch (e) {
        await message.error(`Error: ${e.message}\n\nCommand: addnote`, e);
      }
    }
  });

  // Command: note - Main command to manage notes
  Zokou({
    nomCom: "note",
    categorie: "notes",
    desc: "Manage your saved notes.",
    fromMe: true,  // Only bot owner can execute
    usage: "<add|all|del|delall> [text|note ID]",
    handler: async (message, { text }) => {
      try {
        // Display the menu with actions
        let menu = `╭───── *『 MONGODB NOTES 』* ───◆
┃ Here You Can Store Notes For Later Use
┃ *------------------------------------------*
┃  ┌┤  *✯---- ADD NEW NOTE ----⦿*
┃  │✭ *Cmd :* ${prefix}note add 'Your Text'
┃  │✭ *Usage :* Save Text in MongoDB Server
┃  ╰───────────────────◆
┃
┃  ┌┤  *✯---- GET ALL NOTES ----⦿*
┃  │✭ *Cmd :* ${prefix}note all
┃  │✭ *Usage :* Read/Get All Saved Notes 
┃  ╰───────────────────◆
┃
┃  ┌┤  *✯---- DELETE A NOTE ----⦿*
┃  │✭ *Cmd :* ${prefix}note del 'note ID'
┃  │✭ *Usage :* Delete A Single Note By ID 
┃  ╰───────────────────◆
┃
┃  ┌┤  *✯---- DELETE ALL NOTES ----⦿*
┃  │✭ *Cmd :* ${prefix}note delall
┃  │✭ *Usage :* Delete All Saved Notes 
┃  ╰───────────────────◆
╰━━━━━━━━━━━━━━━━━━━━━━──⊷`;

        if (!text) return await message.reply(menu);

        let args = text.trim().split(" ");
        let action = args[0].toLowerCase();
        let param = args.slice(1).join(" ");

        // Handling different actions
        if (action === "add") {
          if (!param) return await message.reply("*Please provide text to save in notes!*");
          let res = await note.addnote(message, param);
          return await message.reply(res.msg);
        } else if (action === "all") {
          let res = await note.allnotes(message, "all");
          return await message.reply(res.msg);
        } else if (action === "delall") {
          let res = await note.delallnote(message);
          return await message.reply(res.msg);
        } else if (action === "del") {
          if (!param || isNaN(param)) {
            return message.reply(`*Please provide a valid Note ID, Example: ${prefix}note del 1*`);
          }
          let res = await note.delnote(message, param);
          return await message.reply(res.msg);
        } else {
          return await message.reply(`*Invalid action provided, please follow the guide below:*\n\n${menu}`);
        }
      } catch (e) {
        await message.error(`Error: ${e.message}\n\nCommand: note`, e);
      }
    }
  });
};
