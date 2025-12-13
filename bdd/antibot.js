 
  const fs = require('fs');
const path = require('path');

/**
 * Paths
 */
const dirPath = path.join(__dirname, 'xmd');
const dataFilePath = path.join(dirPath, 'antibot.json');

/**
 * Hakikisha folder ipo
 */
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

/**
 * Hakikisha file ipo
 */
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify({}, null, 2), 'utf-8');
}

/**
 * Soma data
 */
function readDataFromFile() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data from file:', error);
    return {};
  }
}

/**
 * Andika data
 */
function writeDataToFile(data) {
  try {
    fs.writeFileSync(
      dataFilePath,
      JSON.stringify(data, null, 2),
      'utf-8'
    );
  } catch (error) {
    console.error('Error writing data to file:', error);
  }
}

/**
 * Add / update JID state
 */
function addOrUpdateJidState(jid, etat) {
  const data = readDataFromFile();

  data[jid] = data[jid] || {};
  data[jid].etat = etat;
  data[jid].action = data[jid].action || 'supp';

  writeDataToFile(data);
}

/**
 * Update JID action
 */
function updateJidAction(jid, action) {
  const data = readDataFromFile();

  data[jid] = data[jid] || {};
  data[jid].etat = data[jid].etat || 'non';
  data[jid].action = action;

  writeDataToFile(data);
}

/**
 * Check JID state
 */
function checkJidState(jid) {
  const data = readDataFromFile();
  return data[jid]?.etat === 'oui';
}

/**
 * Get JID action
 */
function getJidAction(jid) {
  const data = readDataFromFile();
  return data[jid]?.action || 'supp';
}

module.exports = {
  updateJidAction,
  addOrUpdateJidState,
  checkJidState,
  getJidAction,
};