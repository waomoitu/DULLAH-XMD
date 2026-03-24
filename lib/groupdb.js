const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "groupdb.json");

// create DB kama haipo
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({}));
}

// read DB
function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE));
  } catch {
    return {};
  }
}

// save DB
function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

/* ===============================
   SAVE USER ACTIVITY
================================ */
async function saveUserActivity(groupId, userId) {
  const db = readDB();

  if (!db[groupId]) db[groupId] = {};

  db[groupId][userId] = Date.now();

  saveDB(db);
}

/* ===============================
   GET ACTIVE USERS
================================ */
async function getActiveUsers(groupId, days = 7) {
  const db = readDB();

  if (!db[groupId]) return [];

  const now = Date.now();
  const ACTIVE_TIME = days * 24 * 60 * 60 * 1000;

  return Object.entries(db[groupId])
    .filter(([jid, time]) => (now - time) < ACTIVE_TIME)
    .map(([jid]) => ({ jid }));
}

/* ===============================
   GET INACTIVE USERS
================================ */
async function getInactiveUsers(groupId, days = 7) {
  const db = readDB();

  if (!db[groupId]) return [];

  const now = Date.now();
  const ACTIVE_TIME = days * 24 * 60 * 60 * 1000;

  return Object.entries(db[groupId])
    .filter(([jid, time]) => (now - time) >= ACTIVE_TIME)
    .map(([jid]) => ({ jid }));
}

/* ===============================
   GET GROUP ADMINS
================================ */
async function getGroupAdmins(zk, groupId) {
  try {
    const metadata = await zk.groupMetadata(groupId);

    return metadata.participants
      .filter(p => p.admin)
      .map(p => p.id);

  } catch (e) {
    console.log("getGroupAdmins error:", e);
    return [];
  }
}

module.exports = {
  saveUserActivity,
  getActiveUsers,
  getInactiveUsers,
  getGroupAdmins
};
