// events/antifake-check.js
const { getFake } = require("../DB/antifake");

module.exports = async (zk, update) => {
  try {
    if (!update || update.action !== "add") return;

    const group = update.chat; // group JID
    const jid = update.id; // user who joined
    const fake = await getFake(group);

    if (!fake.enabled) return; // if antifake is disabled, do nothing

    const userNum = jid.split("@")[0];
    const code = userNum.slice(0, userNum.length - 7); // extract country code (prefix)

    // check notallow list
    if (fake.notallow.length > 0 && fake.notallow.includes(code)) {
      await zk.groupParticipantsUpdate(group, [jid], "remove");
      await zk.sendMessage(group, { text: `🚫 Number *${userNum}* has been removed (not allowed)` });
      return;
    }

    // check allow list
    if (fake.allow.length > 0 && !fake.allow.includes(code)) {
      await zk.groupParticipantsUpdate(group, [jid], "remove");
      await zk.sendMessage(group, { text: `🚫 Number *${userNum}* is not in the allow list, removed` });
      return;
    }
  } catch (err) {
    console.error("Antifake error:", err);
  }
};
