const { DataTypes } = require('sequelize');
const { database } = require('../set'); // ⚠️ kama config yako ni set.js

const AntiStatusMentionDB = database.define('antistatusmention', {
    status: {
        type: DataTypes.ENUM('on', 'off'),
        defaultValue: 'off',
        allowNull: false
    },
    action: {
        type: DataTypes.ENUM('warn', 'delete', 'remove'),
        defaultValue: 'delete',
        allowNull: false
    },
    warn_limit: {
        type: DataTypes.INTEGER,
        defaultValue: 3,
        allowNull: false
    }
}, {
    timestamps: true
});

// Warn cache
const statusWarnCounts = new Map();

async function initAntiStatusMentionDB() {
    await AntiStatusMentionDB.sync();
    console.log("✅ AntiStatusMention DB ready");
}

async function getAntiStatusMentionSettings() {
    const [settings] = await AntiStatusMentionDB.findOrCreate({ where: {} });
    return settings;
}

async function updateAntiStatusMentionSettings(updates) {
    const settings = await getAntiStatusMentionSettings();
    return await settings.update(updates);
}

function getStatusWarnCount(user) {
    return statusWarnCounts.get(user) || 0;
}

function incrementStatusWarnCount(user) {
    let c = getStatusWarnCount(user) + 1;
    statusWarnCounts.set(user, c);
    return c;
}

function resetStatusWarnCount(user) {
    statusWarnCounts.delete(user);
}

function clearAllStatusWarns() {
    statusWarnCounts.clear();
}

module.exports = {
    initAntiStatusMentionDB,
    getAntiStatusMentionSettings,
    updateAntiStatusMentionSettings,
    getStatusWarnCount,
    incrementStatusWarnCount,
    resetStatusWarnCount,
    clearAllStatusWarns,
    AntiStatusMentionDB
};