const fs = require('fs');
const path = require('path');

const monayFile = path.join(__dirname, 'monay.json');
// create file if missing
if (!fs.existsSync(monayFile)) fs.writeFileSync(monayFile, '[]', 'utf8');

let _monayOrg = JSON.parse(fs.readFileSync(monayFile, 'utf8'));

// Defaults (no fake money)
const defaultWallet = 0;
const defaultBank = 0;
const defaultBankCapacity = 100000;

const save = () => fs.writeFileSync(monayFile, JSON.stringify(_monayOrg, null, 2), 'utf8');

// Add new user (with zeros) — use only if you want auto-register
const addInventoriMonay = (sender) => {
  if (!_monayOrg.some(u => u.id === sender)) {
    const obj = {
      id: sender,
      monay: defaultWallet,
      bank: defaultBank,
      bankCapacity: defaultBankCapacity
    };
    _monayOrg.push(obj);
    save();
  }
};

// Check if user exists
const cekDuluJoinAdaApaKagaMonaynyaDiJson = (sender) => {
  return _monayOrg.some(u => u.id === sender);
};

// Get wallet + bank balance (does NOT create new entry automatically)
const getBalance = (sender, autoRegister = false) => {
  let user = _monayOrg.find(u => u.id === sender);
  if (!user) {
    if (autoRegister) {
      // register with zeros and return zeros
      addInventoriMonay(sender);
      user = _monayOrg.find(u => u.id === sender);
    } else {
      return { wallet: 0, bank: 0, bankCapacity: defaultBankCapacity };
    }
  }
  // ensure numeric values
  const wallet = (typeof user.monay === 'number') ? user.monay : 0;
  const bank = (typeof user.bank === 'number') ? user.bank : 0;
  const bankCapacity = (typeof user.bankCapacity === 'number') ? user.bankCapacity : defaultBankCapacity;
  return { wallet, bank, bankCapacity };
};

// Add to wallet
const addMonay = (sender, amount) => {
  let user = _monayOrg.find(u => u.id === sender);
  if (!user) return false;
  user.monay = (typeof user.monay === 'number' ? user.monay : 0) + Number(amount);
  save();
  return true;
};

// Reduce wallet (no negative clamp optional)
const kurangMonay = (sender, amount) => {
  let user = _monayOrg.find(u => u.id === sender);
  if (!user) return false;
  user.monay = (typeof user.monay === 'number' ? user.monay : 0) - Number(amount);
  if (user.monay < 0) user.monay = 0;
  save();
  return true;
};

// Bank operations
const addBank = (sender, amount) => {
  let user = _monayOrg.find(u => u.id === sender);
  if (!user) return false;
  user.bank = (typeof user.bank === 'number' ? user.bank : 0) + Number(amount);
  save();
  return true;
};
const kurangBank = (sender, amount) => {
  let user = _monayOrg.find(u => u.id === sender);
  if (!user) return false;
  user.bank = (typeof user.bank === 'number' ? user.bank : 0) - Number(amount);
  if (user.bank < 0) user.bank = 0;
  save();
  return true;
};

module.exports = {
  addInventoriMonay,
  cekDuluJoinAdaApaKagaMonaynyaDiJson,
  getBalance,        // use this to get accurate values
  addMonay,
  kurangMonay,
  addBank,
  kurangBank
};