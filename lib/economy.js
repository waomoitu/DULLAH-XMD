const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  wallet: { type: Number, default: 0 },
  bank: { type: Number, default: 0 },
  bankCapacity: { type: Number, default: 1000 }
});

const User = mongoose.model("User", userSchema);

async function balance(userId) {
  let user = await User.findOne({ userId });
  if (!user) {
    user = new User({ userId });
    await user.save();
  }
  return {
    wallet: user.wallet,
    bank: user.bank,
    bankCapacity: user.bankCapacity
  };
}

async function addMoney(userId, amount) {
  let user = await User.findOne({ userId });
  if (!user) {
    user = new User({ userId, wallet: amount });
  } else {
    user.wallet += amount;
  }
  await user.save();
  return user;
}

async function deposit(userId, amount) {
  let user = await User.findOne({ userId });
  if (!user || user.wallet < amount) return null;
  if (user.bank + amount > user.bankCapacity) return null;
  user.wallet -= amount;
  user.bank += amount;
  await user.save();
  return user;
}

async function withdraw(userId, amount) {
  let user = await User.findOne({ userId });
  if (!user || user.bank < amount) return null;
  user.bank -= amount;
  user.wallet += amount;
  await user.save();
  return user;
}

module.exports = { balance, addMoney, deposit, withdraw };
