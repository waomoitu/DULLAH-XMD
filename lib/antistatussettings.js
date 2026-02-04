// In-memory settings per group
const chatSettings = {};

// Turn AntiStatusMention ON/OFF for a chat
function setStatus(chatId, value) {
    chatSettings[chatId] = value; // true = on, false = off
}

// Get current status, default is ON
function getStatus(chatId) {
    return chatSettings[chatId] ?? true;
}

module.exports = { setStatus, getStatus };
