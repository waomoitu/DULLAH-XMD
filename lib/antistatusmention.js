// lib/antistatusmention.js
const { DataTypes } = require("sequelize");
const config = require("../set");

const AntiStatusMention = config.DATABASE.define("antistatusmention", {
    enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
    session: { type: DataTypes.STRING, allowNull: false, unique: true }
});

async function initAntiStatusMentionDB() {
    await AntiStatusMention.sync();
}

async function isEnabled(session) {
    const data = await AntiStatusMention.findOne({ where: { session } });
    return data ? data.enabled : true;
}

module.exports = {
    AntiStatusMention,
    initAntiStatusMentionDB,
    isEnabled
};