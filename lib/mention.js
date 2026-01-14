const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "../database/mention.json");

// Create file kama haipo
if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify({}, null, 2));
}

// Load data
function loadData() {
    try {
        const data = fs.readFileSync(file);
        return JSON.parse(data);
    } catch (err) {
        console.error("MENTION LOAD ERROR:", err);
        return {};
    }
}

// Save data
function saveData(data) {
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("MENTION SAVE ERROR:", err);
    }
}

// Enable / Disable / Set message
async function enableMention(value, jid) {
    const data = loadData();

    if (!data[jid]) data[jid] = { enabled: false, text: "Hello, you mentioned me?" };

    // OFF
    if (value === false) {
        data[jid].enabled = false;
    }

    // ON
    else if (value === true) {
        data[jid].enabled = true;
    }

    // CUSTOM TEXT
    else if (typeof value === "string") {
        data[jid].enabled = true;
        data[jid].text = value;
    }

    saveData(data);
    return true;
}

// Get current config
async function getMention(jid) {
    const data = loadData();
    return data[jid] || null;
}

// Get message only
async function mentionMessage(jid) {
    const data = loadData();
    if (!data[jid] || !data[jid].enabled) return null;
    return data[jid].text;
}

module.exports = {
    enableMention,
    getMention,
    mentionMessage
};
