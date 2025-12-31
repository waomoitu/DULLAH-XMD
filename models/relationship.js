const mongoose = require("mongoose");

const RelationshipSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, default: "User" },
  partner: { type: String, default: "Dullahxmd" },
  married: { type: Boolean, default: true },
  startedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Relationship", RelationshipSchema);
