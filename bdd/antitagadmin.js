const fs = require("fs");
const path = "./bdd/data/antitagadmin.json";

if (!fs.existsSync(path)) fs.writeFileSync(path, "{}");

function getData() {
  return JSON.parse(fs.readFileSync(path));
}

function saveData(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function setStatus(jid, status) {
  const data = getData();
  data[jid] = status;
  saveData(data);
}

function getStatus(jid) {
  const data = getData();
  return data[jid] || false;
}

module.exports = { setStatus, getStatus };
