const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/db.json');

// 🔹 DEFAULT DB
global.db = {
  settings: {
    prefix: ".",
    autorecordtype: false,
  },
  users: {},
  groups: {}
};

// 🔹 LOAD
function loadDatabase() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(global.db, null, 2));
    console.log("📁 New database created");
  } else {
    try {
      const data = JSON.parse(fs.readFileSync(dbPath));
      global.db = data;
      console.log("✅ Database loaded");
    } catch (err) {
      console.error("❌ Error loading DB:", err);
    }
  }
}

// 🔹 SAVE
function saveDatabase() {
  fs.writeFileSync(dbPath, JSON.stringify(global.db, null, 2));
}

// 🔹 AUTO SAVE
setInterval(() => {
  saveDatabase();
}, 10000);

module.exports = {
  loadDatabase,
  saveDatabase
};
