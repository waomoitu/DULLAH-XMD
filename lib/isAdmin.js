// lib/isAdmin.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../xmd/isAdmin.json');

// JSON helpers
function loadIsAdminData() {
  try {
    return new Set(JSON.parse(fs.readFileSync(filePath, 'utf8')));
  } catch {
    return new Set();
  }
}

function saveIsAdminData(data) {
  fs.writeFileSync(filePath, JSON.stringify([...data], null, 2));
}

const onlyAdminGroups = loadIsAdminData();

// main function
const isAdmin = async (zk, chatId, senderId) => {
  try {
    const metadata = await zk.groupMetadata(chatId);
    const participants = metadata.participants || [];

    const botId = zk.user?.id || '';
    const botLid = zk.user?.lid || '';
    const botNumber = botId.split('@')[0];

    const senderNumber = senderId.split('@')[0];

    // bot admin
    const isBotAdmin = participants.some(p => {
      const pId = p.id || '';
      return (pId.split('@')[0] === botNumber) && (p.admin === 'admin' || p.admin === 'superadmin');
    });

    // sender admin
    const isSenderAdmin = participants.some(p => {
      const pId = p.id || '';
      return (pId.split('@')[0] === senderNumber) && (p.admin === 'admin' || p.admin === 'superadmin');
    });

    return { isSenderAdmin, isBotAdmin, onlyAdminGroups };
  } catch (err) {
    console.error('❌ Error in isAdmin:', err);
    return { isSenderAdmin: false, isBotAdmin: false, onlyAdminGroups };
  }
};

// onlyAdmin helpers
async function addGroupToOnlyAdminList(groupeJid) {
  onlyAdminGroups.add(groupeJid);
  saveIsAdminData(onlyAdminGroups);
}

async function removeGroupFromOnlyAdminList(groupeJid) {
  onlyAdminGroups.delete(groupeJid);
  saveIsAdminData(onlyAdminGroups);
}

async function isGroupOnlyAdmin(groupeJid) {
  return onlyAdminGroups.has(groupeJid);
}

// Export as **single object**
module.exports = {
  isAdmin,
  addGroupToOnlyAdminList,
  removeGroupFromOnlyAdminList,
  isGroupOnlyAdmin
};