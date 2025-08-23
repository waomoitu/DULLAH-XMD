const Database = require("better-sqlite3");
const path = require("path");

// Hifadhi database file ndani ya project folder
const db = new Database(path.join(__dirname, "../database.db"));

// Unda table kama haipo
db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        wallet INTEGER DEFAULT 0,
        bank INTEGER DEFAULT 0,
        bankCapacity INTEGER DEFAULT 1000
    )
`).run();

function getUser(userId) {
    let user = db.prepare("SELECT * FROM users WHERE user_id = ?").get(userId);
    if (!user) {
        db.prepare("INSERT INTO users (user_id, wallet, bank, bankCapacity) VALUES (?, ?, ?, ?)")
          .run(userId, 0, 0, 1000);
        user = db.prepare("SELECT * FROM users WHERE user_id = ?").get(userId);
    }
    return user;
}

async function balance(userId) {
    return getUser(userId);
}

async function addWallet(userId, amount) {
    getUser(userId);
    db.prepare("UPDATE users SET wallet = wallet + ? WHERE user_id = ?")
      .run(amount, userId);
    return balance(userId);
}

async function addBank(userId, amount) {
    getUser(userId);
    db.prepare("UPDATE users SET bank = bank + ? WHERE user_id = ?")
      .run(amount, userId);
    return balance(userId);
}

module.exports = { balance, addWallet, addBank };
