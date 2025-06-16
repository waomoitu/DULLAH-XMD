const fs = require("fs");
const path = "./bdd/autoantibug.json";

function loadData() {
  if (!fs.existsSync(path)) return {};
  return JSON.parse(fs.readFileSync(path));
}

function saveData(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function setStatus(groupId, status) {
  const data = loadData();
  data[groupId] = status;
  saveData(data);
}

function getStatus(groupId) {
  const data = loadData();
  return data[groupId] || "off";
}

module.exports = { setStatus, getStatus };
