const { DataTypes } = require("sequelize");
const config = require("../../config"); // adjust path

// DATABASE MODEL
const Mention = config.DATABASE.define("mention_settings", {
  enabled: { type: DataTypes.BOOLEAN, defaultValue: false },
  text: { type: DataTypes.TEXT, defaultValue: "Hi" },
  session: { type: DataTypes.STRING, allowNull: false, defaultValue: "0", unique: true }
});

const mentionCache = {};

async function getMention(session) {
  if (mentionCache[session]) return mentionCache[session];
  const found = await Mention.findOne({ where: { session } });
  if (found) {
    mentionCache[session] = found.dataValues;
    return found.dataValues;
  }
  mentionCache[session] = false;
  return false;
}

async function mentionMessage(session) {
  const data = await getMention(session);
  return data ? data.text : null;
}

async function enableMention(input, session, message = null) {
  delete mentionCache[session];
  if (typeof input === "string") {
    const existing = await getMention(session);
    message = input;
    input = existing?.enabled ?? true;
  }

  let record = await Mention.findOne({ where: { session } });
  if (record) {
    await record.update({
      enabled: input,
      text: message || record.text,
      session
    });
    return record;
  }

  return await Mention.create({
    enabled: input,
    text: message || "Hi",
    session
  });
}

function clearFiles() {
  for (let key in mentionCache) delete mentionCache[key];
}

// ✅ Export functions
module.exports = {
  getMention,
  mentionMessage,
  enableMention,
  clearFiles
};