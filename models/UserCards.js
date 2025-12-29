const mongoose = require("mongoose");

// ===============================
// 1️⃣ CARD SCHEMA
// ===============================
const cardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tier: { type: String, required: true },
  series: { type: String, required: true },
  captcha: { type: String, required: true }
});

// ===============================
// 2️⃣ USER CARDS SCHEMA
// ===============================
const userCardsSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },

  // 🔹 Collection ya cards zote
  collection: { type: [cardSchema], default: [] },

  // 🔹 Active deck (max 3 cards)
  deck: { type: [cardSchema], default: [] },

  // 🔹 Extra fields
  locked: { type: Boolean, default: false },
  coins: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },

  // 🔹 Optional: wishlist ya cards
  wishlist: { type: [String], default: [] }
}, { timestamps: true });

// ===============================
// 3️⃣ EXPORT MODEL
// ===============================
module.exports = mongoose.model("UserCards", userCardsSchema);