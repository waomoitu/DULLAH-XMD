// lib/antistatusmention.js
let antiStatusDB = {}; // simple in-memory DB

async function initAntiStatusMentionDB() {
    // load from file if needed, here in-memory
    antiStatusDB = {};
}

async function getAntiStatusMentionSettings() {
    // Default settings
    return {
        status: "on",        // on/off
        action: "warn",      // remove / delete / warn
        warn_limit: 3        // max warnings
    };
}

function incrementStatusWarnCount(sender) {
    if (!antiStatusDB[sender]) antiStatusDB[sender] = 0;
    antiStatusDB[sender]++;
    return antiStatusDB[sender];
}

function resetStatusWarnCount(sender) {
    antiStatusDB[sender] = 0;
}

module.exports = {
    initAntiStatusMentionDB,
    getAntiStatusMentionSettings,
    incrementStatusWarnCount,
    resetStatusWarnCount
};
