const mongoose = require("mongoose");

const marketplaceCardSchema = new mongoose.Schema({
  cardId: { type: mongoose.Schema.Types.ObjectId, ref: "UserCards.collection", required: true }, // reference to the card
  ownerId: { type: String, required: true },
  price: { type: Number, required: true },
  captcha: { type: String, required: true },
  status: { type: String, enum: ["available", "sold"], default: "available" }
}, { timestamps: true });

module.exports = mongoose.model("CardMarketplace", marketplaceCardSchema);
