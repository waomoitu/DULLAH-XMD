const mongoose = require("mongoose");

const marketplaceCardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tier: { type: String, required: true },
  series: { type: String, required: true },

  price: { type: Number, required: true },
  captcha: { type: String, required: true },

  ownerId: { type: String, required: true },
  ownerName: { type: String, default: "Unknown" },

  status: { 
    type: String, 
    enum: ["available", "sold"], 
    default: "available" 
  }
}, { timestamps: true });

module.exports = mongoose.model("CardMarketplace", marketplaceCardSchema);