// DB/antifake.js

const { DataTypes } = require("sequelize");
const config = require("../config");


const AntifakeDB = config.DATABASE.define("antifake", {
  jid: { type: DataTypes.STRING, allowNull: false, unique: true },
  enabled: { type: DataTypes.BOOLEAN, defaultValue: false },
  notallow: { type: DataTypes.TEXT, defaultValue: "[]" },
  allow: { type: DataTypes.TEXT, defaultValue: "[]" },
});

async function getFake(jid) {
  let data = await AntifakeDB.findOne({ where: { jid } });
  if (!data) {
    data = await AntifakeDB.create({ jid });
  }
  return {
    enabled: data.enabled,
    notallow: JSON.parse(data.notallow),
    allow: JSON.parse(data.allow),
  };
}


async function antiList(jid, type = "fake") {
  const data = await getFake(jid);
  return type === "fake" ? data.notallow : data.allow;
}


async function enableAntiFake(jid, value) {
  let data = await AntifakeDB.findOne({ where: { jid } });
  if (!data) {
    data = await AntifakeDB.create({ jid });
  }

  let notallow = JSON.parse(data.notallow);
  let allow = JSON.parse(data.allow);

  if (value === "on") {
    await data.update({ enabled: true });
  } else if (value === "off") {
    await data.update({ enabled: false });
  } else if (value.startsWith("!")) {
    notallow = value.replace("!", "").split(",").map((c) => c.trim());
    await data.update({ notallow: JSON.stringify(notallow) });
  } else {
    allow = value.split(",").map((c) => c.trim());
    await data.update({ allow: JSON.stringify(allow) });
  }

  return {
    enabled: data.enabled,
    notallow,
    allow,
  };
}

module.exports = {
  AntifakeDB,
  getFake,
  antiList,
  enableAntiFake,
};
