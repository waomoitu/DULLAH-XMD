const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'data', 'sudo.json');

function ensureFile() {
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
}

function loadSudoList() {
  ensureFile();

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return new Set(JSON.parse(data));
  } catch (error) {
    return new Set();
  }
}

function saveSudoList(set) {
  ensureFile();
  fs.writeFileSync(filePath, JSON.stringify([...set], null, 2));
}

module.exports = {
  loadSudoList,
  saveSudoList
};