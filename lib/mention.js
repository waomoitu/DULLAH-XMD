
const { DataTypes } = require("sequelize");
const config = require("../../config");

//
// DATABASE MODEL: Mention Auto-Reply
//
const Mention = config.DATABASE.define("mention_settings", {
  enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  text: {
    type: DataTypes.TEXT,
    defaultValue: "Hi",
  },
  session: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "0",
    unique: true,
  }
});

//
// Cache to reduce database queries
//
const mentionCache = {};

//
// Get mention settings for a session
//
async function getMention(session) {
  if (mentionCache[session]) {
    return mentionCache[session];
  }

  const found = await Mention.findOne({ where: { session } });

  if (found) {
    mentionCache[session] = found.dataValues;
    return found.dataValues;
  }

  mentionCache[session] = false;
  return false;
}
exports.getMention = getMention;

//
// Get only the mention text
//
exports.mentionMessage = async (session) => {
  const data = await getMention(session);
  return data ? data.text : null;
};

//
// Enable, disable or update message
//
exports.enableMention = async (input, session, message = null) => {
  delete mentionCache[session];

  // If user typed a text (string), update text only
  if (typeof input === "string") {
    const existing = await getMention(session);
    message = input;
    input = existing?.enabled ?? true; // keep enabled state
  }

  let record = await Mention.findOne({ where: { session } });

  if (record) {
    await record.update({
      enabled: input,
      text: message || record.text,
      session,
    });

    return record;
  }

  return await Mention.create({
    enabled: input,
    text: message || "Hi",
    session,
  });
};

//
// PERSONAL MESSAGE STORAGE
//
const PersonalMessage = config.DATABASE.define("personal_message", {
  uid: { type: DataTypes.STRING, allowNull: false },
  session: { type: DataTypes.STRING, allowNull: false, defaultValue: "0" }
});

//
// Check if user has personal message record
//
exports.getPmMessage = async (uid, session) => {
  const record = await PersonalMessage.findOne({
    where: { uid, session }
  });
  return !!record;
};

//
// Save user personal message record
//
exports.setPmMessage = async (uid, session) => {
  const exists = await PersonalMessage.findOne({
    where: { uid, session }
  });

  if (!exists) {
    await PersonalMessage.create({ uid, session });
  }
};

//
// Clear cached data
//
exports.clearFiles = () => {
  for (let key in mentionCache) delete mentionCache[key];
};