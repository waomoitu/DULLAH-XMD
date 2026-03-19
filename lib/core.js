const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/db.json');

// 🔹 DEFAULT DB
global.db = {
  settings: {
    prefix: ".",
    autorecordtype: false,
    autorecording: false,
    autotyping: false,
    autoblock: false,
    addcountrycode: false,
    alwaysonline: false
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
      // Merge any missing settings to ensure defaults
      global.db = {
        users: data.users || {},
        groups: data.groups || {},
        settings: {
          prefix: ".",
          autorecordtype: false,
          autorecording: false,
          autotyping: false,
          autoblock: false,
          addcountrycode: false,
          alwaysonline: false,
          ...data.settings // preserve existing settings
        }
      };
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