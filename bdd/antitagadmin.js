// File: bdd/antitagadmin.js
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data/antitagadmin.json");

function loadData() {
  if (!fs.existsSync(dataPath)) return {};
  return JSON.parse(fs.readFileSync(dataPath));
}

function saveData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

function setStatus(groupId, status) {
  const data = loadData();
  data[groupId] = { active: status };
  saveData(data);
}

function getStatus(groupId) {
  const data = loadData();
  return data[groupId]?.active || false;
}

module.exports = {
  setStatus,
  getStatus
};
