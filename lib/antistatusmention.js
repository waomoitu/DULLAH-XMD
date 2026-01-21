const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "antistatusmention.json");
const warnCache = {};

function getAntiStatusMentionSettings() {
    if (!fs.existsSync(filePath)) {
        return { status: "off", action: "delete", warn_limit: 3 };
    }
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function incrementStatusWarnCount(user) {
    warnCache[user] = (warnCache[user] || 0) + 1;
    return warnCache[user];
}

function resetStatusWarnCount(user) {
    delete warnCache[user];
}

module.exports = {
    getAntiStatusMentionSettings,
    incrementStatusWarnCount,
    resetStatusWarnCount
};
