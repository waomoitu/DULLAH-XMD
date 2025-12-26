require("dotenv").config();
const { Pool } = require("pg");
const s = require("../set");

const proConfig = {
  connectionString: s.DATABASE_URL || "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
  ssl: { rejectUnauthorized: false },
};

const pool = new Pool(proConfig);

// Create table if not exists
const initTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS banGroup (
        groupeJid TEXT PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Table 'banGroup' ready.");
  } catch (e) {
    console.error("❌ Table creation error:", e);
  }
};
initTable();

module.exports = {
  addGroupToBanList: async (groupeJid) => {
    const client = await pool.connect();
    try {
      await client.query(
        "INSERT INTO banGroup (groupeJid) VALUES ($1) ON CONFLICT (groupeJid) DO NOTHING",
        [groupeJid]
      );
      console.log(`✅ ${groupeJid} added to ban list.`);
    } catch (e) {
      console.error("❌ Add to ban error:", e);
    } finally {
      client.release();
    }
  },
  
  isGroupBanned: async (groupeJid) => {
    const client = await pool.connect();
    try {
      const res = await client.query(
        "SELECT EXISTS(SELECT 1 FROM banGroup WHERE groupeJid = $1)",
        [groupeJid]
      );
      return res.rows[0].exists;
    } catch (e) {
      console.error("❌ Check ban error:", e);
      return false;
    } finally {
      client.release();
    }
  },
  
  removeGroupFromBanList: async (groupeJid) => {
    const client = await pool.connect();
    try {
      await client.query(
        "DELETE FROM banGroup WHERE groupeJid = $1",
        [groupeJid]
      );
      console.log(`✅ ${groupeJid} removed from ban list.`);
    } catch (e) {
      console.error("❌ Remove ban error:", e);
    } finally {
      client.release();
    }
  }
};

Hii ndio sever ya bdd