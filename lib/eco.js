const fs = require("fs");
const path = "./eco_data.json";

// Ensure file exists
if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));

function readDB() {
  return JSON.parse(fs.readFileSync(path, "utf-8"));
}

function writeDB(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

// ============================
// Methods
// ============================

function getBalance(userId, createIfMissing = true) {
  const db = readDB();
  if (!db[userId] && createIfMissing) {
    db[userId] = { wallet: 0, bank: 0, bankCapacity: 1000000 };
    writeDB(db);
  }
  return db[userId] || { wallet: 0, bank: 0, bankCapacity: 1000000 };
}

async function addMoney(userId, amount) {
  const db = readDB();
  if (!db[userId]) db[userId] = { wallet: 0, bank: 0, bankCapacity: 1000000 };
  db[userId].wallet += amount;
  writeDB(db);
  return db[userId];
}

module.exports = { getBalance, addMoney };
