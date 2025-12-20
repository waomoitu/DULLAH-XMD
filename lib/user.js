const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  jid: { type: String, unique: true },
  coins: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  lastFish: { type: Date, default: null }
});

module.exports = mongoose.model("User", userSchema);
