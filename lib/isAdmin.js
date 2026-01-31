// lib/isAdmin.js
const fs = require('fs');
const path = require('path');

// ----------------- JSON FILE -----------------
const filePath = path.join(__dirname, '../xmd/isAdmin.json'); // <-- updated

function loadOnlyAdminData() {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return new Set(JSON.parse(data));
  } catch {
    return new Set(); // empty if file missing
  }
}

function saveOnlyAdminData(data) {
  fs.writeFileSync(filePath, JSON.stringify([...data], null, 2));
}

const onlyAdminGroups = loadOnlyAdminData();

// ----------------- ADMIN CHECK -----------------
async function isAdmin(zk, chatId, senderId) {
  try {
    const metadata = await zk.groupMetadata(chatId);
    const participants = metadata.participants || [];

    const botId = zk.user?.id || '';
    const botLid = zk.user?.lid || '';
    const botNumber = botId.includes(':') ? botId.split(':')[0] : (botId.includes('@') ? botId.split('@')[0] : botId);
    const botIdWithoutSuffix = botId.includes('@') ? botId.split('@')[0] : botId;
    const botLidNumeric = botLid.includes(':') ? botLid.split(':')[0] : (botLid.includes('@') ? botLid.split('@')[0] : botLid);

    const senderNumber = senderId.includes(':') ? senderId.split(':')[0] : (senderId.includes('@') ? senderId.split('@')[0] : senderId);
    const senderIdWithoutSuffix = senderId.includes('@') ? senderId.split('@')[0] : senderId;

    // Bot admin check
    const isBotAdmin = participants.some(p => {
      const pPhoneNumber = p.phoneNumber ? p.phoneNumber.split('@')[0] : '';
      const pId = p.id ? p.id.split('@')[0] : '';
      const pLid = p.lid ? p.lid.split('@')[0] : '';
      const pFullId = p.id || '';
      const pFullLid = p.lid || '';
      const pLidNumeric = pLid.includes(':') ? pLid.split(':')[0] : pLid;

      const botMatches = (
        botId === pFullId ||
        botId === pFullLid ||
        botLid === pFullLid ||
        botLidNumeric === pLidNumeric ||
        botIdWithoutSuffix === pPhoneNumber
      );

      return botMatches && (p.admin === 'admin' || p.admin === 'superadmin');
    });

    // Sender admin check
    const isSenderAdmin = participants.some(p => {
      const pPhoneNumber = p.phoneNumber ? p.phoneNumber.split('@')[0] : '';
      const pId = p.id ? p.id.split('@')[0] : '';
      const pLid = p.lid ? p.lid.split('@')[0] : '';
      const pFullId = p.id || '';
      const pFullLid = p.lid || '';

      const senderMatches = (
        senderId === pFullId ||
        senderId === pFullLid ||
        senderNumber === pPhoneNumber
      );

      return senderMatches && (p.admin === 'admin' || p.admin === 'superadmin');
    });

    return { isSenderAdmin, isBotAdmin, onlyAdminGroups };

  } catch (err) {
    console.error('❌ Error in isAdmin:', err);
    return { isSenderAdmin: false, isBotAdmin: false, onlyAdminGroups };
  }
}

// ----------------- OnlyAdmin JSON helpers -----------------
async function addGroupToOnlyAdminList(groupeJid) {
  onlyAdminGroups.add(groupeJid);
  saveOnlyAdminData(onlyAdminGroups);
  console.log(`✅ Group ${groupeJid} added to isAdmin list`);
}

async function removeGroupFromOnlyAdminList(groupeJid) {
  onlyAdminGroups.delete(groupeJid);
  saveOnlyAdminData(onlyAdminGroups);
  console.log(`❌ Group ${groupeJid} removed from isAdmin list`);
}

async function isGroupOnlyAdmin(groupeJid) {
  return onlyAdminGroups.has(groupeJid);
}

// lib/isAdmin.js
module.exports = {
  isAdmin,
  addGroupToOnlyAdminList, 
  removeGroupFromOnlyAdminList,
  isGroupOnlyAdmin
};