const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  name: String,
  tier: String,
  series: String,
  captcha: String
});

const userCardsSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  collection: [cardSchema], // cards zote
  deck: [cardSchema]        // active deck (max 3)
});

module.exports = mongoose.model("UserCards", userCardsSchema);
