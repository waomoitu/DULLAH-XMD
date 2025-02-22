const { note, prefix } = require('../lib');

module.exports = (Zokou) => {
  Zokou({
    nomCom: "delnote",
    categorie: "notes",
    desc: "Deletes note from db.",
    usage: "< note id | 1 >",
    fromMe: true,
    handler: async (message, match) => {
      try {
        let id = match.split(" ")[0];
        if (!id || isNaN(id)) {
          return message.reply(`*Provide Note ID, Example: ${prefix}delnote 1*`);
        }
        let res = await note.delnote(message, id);
        return await message.reply(res.msg);
      } catch (e) {
        await message.error(`${e}\n\ncommand: delnote`, e);
      }
    }
  });

  Zokou({
    nomCon: "delallnote",
    categorie: "notes",
    desc: "Deletes all notes from db.",
    fromMe: true,
    handler: async (message) => {
      try {
        let res = await note.delallnote(message);
        return await message.reply(res.msg);
      } catch (e) {
        await message.error(`${e}\n\ncommand: delallnote`, e);
      }
    }
  });

  Zokou.command({
    nomCom: "allnote",
    categorie: "notes",
    desc: "Shows list of all notes.",
    fromMe: true,
    handler: async (message) => {
      try {
        let res = await note.allnotes(message, "all");
        return await message.reply(res.msg);
      } catch (e) {
        await message.error(`${e}\n\ncommand: allnote`, e, "*Can't fetch data, Sorry!!*");
      }
    }
  });

  Zokou({
    nomCom: "getnote",
    categorie: "notes",
    desc: "Shows note by id.",
    usage: "< id|1|2 >",
    fromMe: true,
    handler: async (message, match) => {
      try {
        if (!match) {
          return await message.reply(`*Provide Note ID, Ex: ${prefix}getnote id|1|2|..*`);
        }
        let res = await note.allnotes(message, match.split(" ")[0].toLowerCase().trim());
        return await message.reply(res.msg);
      } catch (e) {
        await message.error(`${e}\n\ncommand: getnote`, e, "*Can't fetch data, Sorry!!*");
      }
    }
  });

  Zokou({
    nomCom: "addnote",
    categorie: "notes",
    desc: "Adds a note on db.",
    usage: "< text >",
    fromMe: true,
    handler: async (message, match) => {
      try {
        if (!match) return await message.reply(`*Please provide text to save in notes!*`);
        let res = await note.addnote(message, match);
        return await message.reply(res.msg);
      } catch (e) {
        await message.error(`${e}\n\ncommand: addnote`, e);
      }
    }
  });

  Zokou.command({
    nomCom: "note",
    categorie: "notes",
    desc: "Shows list of all notes.",
    fromMe: true,
    handler: async (message, { text }) => {
      try {
        let txt = `╭───── *『 MONGODB NOTES 』* ───◆
┃ Here You Can Store Notes For Later Use
┃ *------------------------------------------*
┃  ┌┤  *✯---- ADD NEW NOTE ----⦿*
┃  │✭ *Cmd :* ${prefix}note add 'Your Text'
┃  │✭ *Usage :* Save Text in MongoDb Server
┃  ╰───────────────────◆
┃
┃  ┌┤  *✯---- GET ALL NOTES ----⦿*
┃  │✭ *Cmd :* ${prefix}note all
┃  │✭ *Usage :* Read/Get All Saved Notes 
┃  ╰───────────────────◆
┃
┃  ┌┤  *✯---- DELETE A NOTE ----⦿*
┃  │✭ *Cmd :* ${prefix}note del 'note id'
┃  │✭ *Usage :* Delete A Single Note By ID Number 
┃  ╰───────────────────◆
┃
┃  ┌┤  *✯---- DELETE ALL NOTES ----⦿*
┃  │✭ *Cmd :* ${prefix}note delall
┃  │✭ *Usage :* Delete All Saved Notes 
┃  ╰───────────────────◆
╰━━━━━━━━━━━━━━━━━━━━━━──⊷`;

        if (!text) return await message.reply(txt);

        let action = text.split(" ")[0].trim().toLowerCase();

        if (action === "add" || action === "new") {
          let res = await note.addnote(message, text.replace(/^(add|new)/, "").trim());
          return await message.reply(res.msg);
        } else if (action === "all") {
          let res = await note.allnotes(message, "all");
          return await message.reply(res.msg);
        } else if (action === "delall") {
          let res = await note.delallnote(message);
          return await message.reply(res.msg);
        } else if (action === "del") {
          let id = text.split(" ")[1];
          if (!id || isNaN(id)) {
            return message.reply("*Uhh Please, Provide Note ID. Example: .delnote 1*");
          }
          let res = await note.delnote(message, id);
          return await message.reply(res.msg);
        } else {
          return await message.reply(`*Invalid action provided, please follow* \n\n${txt}`);
        }
      } catch (e) {
        await message.error(`${e}\n\ncommand: note`, e, "*Can't fetch data, Sorry!*");
      }
    }
  });
};
